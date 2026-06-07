import { renderLayout } from '../baseMetodo.js';
import { addEntrada } from '../historial.js';

// ── Lógica Matemática ──
function calcularEDO(metodo, f, x0, y0, h, pasos) {
    let historial = [{ paso: 0, x: x0, y: y0 }];
    let x = x0;
    let y = y0;

    for (let i = 1; i <= pasos; i++) {
        if (metodo === 'euler') {
            y = y + h * f(x, y);
        } else if (metodo === 'rk2') {
            let k1 = f(x, y);
            let k2 = f(x + h, y + h * k1);
            y = y + (h / 2) * (k1 + k2);
        } else if (metodo === 'rk4') {
            let k1 = f(x, y);
            let k2 = f(x + h / 2, y + (h / 2) * k1);
            let k3 = f(x + h / 2, y + (h / 2) * k2);
            let k4 = f(x + h, y + h * k3);
            y = y + (h / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
        }
        x = x + h;
        historial.push({ paso: i, x: Number(x.toFixed(6)), y: Number(y.toFixed(6)) });
    }
    return historial;
}

// ── Configuración para el Router (SPA) ──
export const metodoEDO = {
    id: 'edo',
    titulo: 'Ecuaciones Diferenciales',
    descripcion: 'Resolución paso a paso mediante Euler, RK2 (Heun) y RK4.',
    icon: '📉',
    
    // Inyecta los inputs usando el sistema de grillas global de style.css
    renderHTML: () => {
        const inputsHTML = `
            <div class="form-group">
                <label>Función f(x,y)</label>
                <input type="text" id="edo-f" value="x - y" placeholder="x - y" />
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>x₀ (Valor inicial)</label>
                    <input type="number" id="edo-x0" step="any" value="0" />
                </div>
                <div class="form-group">
                    <label>y₀ (Valor inicial)</label>
                    <input type="number" id="edo-y0" step="any" value="1" />
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Paso (h)</label>
                    <input type="number" id="edo-h" step="any" value="0.1" />
                </div>
                <div class="form-group">
                    <label>Pasos (n)</label>
                    <input type="number" id="edo-n" value="10" />
                </div>
            </div>
            <div class="form-group">
                <label>Método</label>
                <select id="edo-tipo" style="padding: 10px 12px; border: 1px solid var(--border); border-radius: 8px; font-size: 0.95rem; background: var(--bg-main); color: var(--text-main); outline: none;">
                    <option value="euler">Euler</option>
                    <option value="rk2">Runge-Kutta 2 (Heun)</option>
                    <option value="rk4">Runge-Kutta 4</option>
                </select>
            </div>
        `;
        return renderLayout('edo', inputsHTML);
    },

    // Lógica de interfaz que se ejecuta al abrir la vista
    init: () => {
        const btn = document.getElementById('edo-btn');
        btn.addEventListener('click', () => {
            const funcStr = document.getElementById('edo-f').value;
            const x0 = parseFloat(document.getElementById('edo-x0').value);
            const y0 = parseFloat(document.getElementById('edo-y0').value);
            const h = parseFloat(document.getElementById('edo-h').value);
            const pasos = parseInt(document.getElementById('edo-n').value);
            const tipo = document.getElementById('edo-tipo').value;

            try {
                // Compilamos la función usando math.js
                const nodo = math.compile(funcStr);
                const f = (x, y) => nodo.evaluate({ x, y });

                // Calculamos
                const historial = calcularEDO(tipo, f, x0, y0, h, pasos);

                // Mostramos el último valor como resultado destacado
                const ultimoPunto = historial[historial.length - 1];
                document.getElementById('edo-resultado').innerHTML = `
                    <div class="resultado-destacado">
                        <div class="resultado-valor">y = ${ultimoPunto.y.toFixed(6)}</div>
                        <div class="resultado-label">En x = ${ultimoPunto.x}</div>
                    </div>
                    <div class="resultado-meta">
                        <span>🔁 ${pasos} pasos ejecutados</span>
                    </div>
                `;

                // Renderizamos la tabla usando el wrapper responsivo y semántica estándar
                document.getElementById('edo-tabla').innerHTML = `
                    <div class="tabla-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>Paso</th>
                                    <th>x</th>
                                    <th>y</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${historial.map(p => `
                                    <tr>
                                        <td>${p.paso}</td>
                                        <td>${p.x.toFixed(6)}</td>
                                        <td>${p.y.toFixed(6)}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `;

                // Generamos el gráfico usando Chart.js
                graficarEDO(historial);

                // Activar e integrar el botón "Guardar resultado" en el historial global
                const saveBtn = document.getElementById('edo-save-btn');
                if (saveBtn) {
                    saveBtn.disabled = false;
                    saveBtn.textContent = '💾 Guardar resultado';
                    
                    // Clonar para limpiar event listeners previos y evitar duplicados
                    saveBtn.replaceWith(saveBtn.cloneNode(true));
                    const freshBtn = document.getElementById('edo-save-btn');
                    
                    freshBtn.addEventListener('click', () => {
                        const inputs = {
                            "Función f(x,y)": funcStr,
                            "x₀": x0,
                            "y₀": y0,
                            "Paso (h)": h,
                            "Pasos (n)": pasos,
                            "Método": tipo.toUpperCase()
                        };

                        addEntrada({
                            metodo: 'Ecuaciones Diferenciales',
                            inputs,
                            raiz: `y(${ultimoPunto.x}) = ${ultimoPunto.y.toFixed(6)}`,
                            iteraciones: pasos
                        });

                        freshBtn.textContent = '✅ Guardado';
                        freshBtn.disabled = true;

                        setTimeout(() => {
                            freshBtn.textContent = '💾 Guardar resultado';
                            freshBtn.disabled = false;
                        }, 2500);
                    });
                }

            } catch (error) {
                alert("Error al procesar la función matemática. Verificá la sintaxis.");
            }
        });
    }
};

// ── Gráfico Custom para EDOs ──
function graficarEDO(historial) {
    const canvas = document.getElementById('edo-chart');
    document.getElementById('edo-chart-placeholder').style.display = 'none';

    if (canvas._chartInstance) canvas._chartInstance.destroy();

    const dataPoints = historial.map(p => ({ x: p.x, y: p.y }));

    canvas._chartInstance = new Chart(canvas, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Aproximación EDO',
                data: dataPoints,
                borderColor: '#2563eb',
                backgroundColor: '#2563eb',
                borderWidth: 2,
                pointRadius: 3,
                fill: false,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { type: 'linear', title: { display: true, text: 'x' } },
                y: { title: { display: true, text: 'y' } }
            }
        }
    });
}