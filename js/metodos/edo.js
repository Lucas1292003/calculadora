import { renderLayout } from '../baseMetodo.js';
import { addEntrada }   from '../historial.js';

// ── Lógica matemática ──────────────────────────
function calcularEDO(metodo, f, x0, y0, h, pasos) {
    const historial = [{ paso: 0, x: x0, y: y0 }];
    let x = x0, y = y0;

    for (let i = 1; i <= pasos; i++) {
        if (metodo === 'euler') {
            y = y + h * f(x, y);
        } else if (metodo === 'rk2') {
            const k1 = f(x, y);
            const k2 = f(x + h, y + h * k1);
            y = y + (h / 2) * (k1 + k2);
        } else if (metodo === 'rk4') {
            const k1 = f(x, y);
            const k2 = f(x + h / 2, y + (h / 2) * k1);
            const k3 = f(x + h / 2, y + (h / 2) * k2);
            const k4 = f(x + h,     y + h * k3);
            y = y + (h / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
        }
        x = x + h;
        historial.push({ paso: i, x: Number(x.toFixed(6)), y: Number(y.toFixed(6)) });
    }
    return historial;
}

// ── Módulo ─────────────────────────────────────
export const metodoEDO = {
    id: 'edo',
    titulo: 'Ecuaciones Diferenciales',
    descripcion: 'Resolución paso a paso mediante Euler, RK2 (Heun) y RK4.',
    icon: '📉',

    renderHTML() {
        const inputsHTML = `
            <div class="form-group">
                <label>Función f(x, y)</label>
                <input type="text" id="edo-f" placeholder="x - y" />
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>x₀ (valor inicial)</label>
                    <input type="number" id="edo-x0" step="any" placeholder="0" />
                </div>
                <div class="form-group">
                    <label>y₀ (valor inicial)</label>
                    <input type="number" id="edo-y0" step="any" placeholder="1" />
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Paso (h)</label>
                    <input type="number" id="edo-h" step="any" placeholder="0.1" />
                </div>
                <div class="form-group">
                    <label>Cantidad de pasos (n)</label>
                    <input type="number" id="edo-n" placeholder="10" />
                </div>
            </div>
            <div class="form-group">
                <label>Método</label>
                <select id="edo-tipo" class="form-select">
                    <option value="euler">Euler</option>
                    <option value="rk2">Runge-Kutta 2 (Heun)</option>
                    <option value="rk4">Runge-Kutta 4</option>
                </select>
            </div>
        `;
        return renderLayout('edo', inputsHTML);
    },

    init() {
        document.getElementById('edo-btn').addEventListener('click', () => {
            const funcStr = document.getElementById('edo-f').value || 'x - y';
            const x0      = parseFloat(document.getElementById('edo-x0').value || 0);
            const y0      = parseFloat(document.getElementById('edo-y0').value || 1);
            const h       = parseFloat(document.getElementById('edo-h').value  || 0.1);
            const pasos   = parseInt(document.getElementById('edo-n').value    || 10);
            const tipo    = document.getElementById('edo-tipo').value;
            const resultado = document.getElementById('edo-resultado');

            try {
                const nodo = math.compile(funcStr);
                const f    = (x, y) => nodo.evaluate({ x, y });
                const hist = calcularEDO(tipo, f, x0, y0, h, pasos);
                const ult  = hist[hist.length - 1];

                resultado.innerHTML = `
                    <div class="resultado-destacado">
                        <div class="resultado-valor">y = ${ult.y.toFixed(6)}</div>
                        <div class="resultado-label">En x = ${ult.x}</div>
                    </div>
                    <div class="resultado-meta">
                        <span>🔁 ${pasos} pasos ejecutados</span>
                    </div>
                `;

                document.getElementById('edo-tabla').innerHTML = `
                    <div class="tabla-wrapper">
                        <table>
                            <thead><tr><th>Paso</th><th>x</th><th>y</th></tr></thead>
                            <tbody>
                                ${hist.map(p => `
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

                _graficarEDO(hist);

                // ── Botón guardar ─────────────────
                const saveBtn = document.getElementById('edo-save-btn');
                if (saveBtn) {
                    saveBtn.disabled    = false;
                    saveBtn.textContent = '💾 Guardar resultado';
                    saveBtn.replaceWith(saveBtn.cloneNode(true));
                    const freshBtn = document.getElementById('edo-save-btn');

                    freshBtn.addEventListener('click', () => {
                        addEntrada({
                            metodo: 'Ecuaciones Diferenciales',
                            inputs: {
                                'f(x,y)': funcStr,
                                'x₀': x0, 'y₀': y0,
                                'h': h, 'n': pasos,
                                'Método': tipo.toUpperCase()
                            },
                            raiz: `y(${ult.x}) = ${ult.y.toFixed(6)}`,
                            iteraciones: pasos,
                        });
                        freshBtn.textContent = '✅ Guardado';
                        freshBtn.disabled    = true;
                        setTimeout(() => {
                            freshBtn.textContent = '💾 Guardar resultado';
                            freshBtn.disabled    = false;
                        }, 2500);
                    });
                }

            } catch {
                document.getElementById('edo-resultado').innerHTML =
                    '<p class="error">Error al evaluar f(x, y). Revisá la sintaxis.</p>';
            }
        });
    }
};

function _graficarEDO(historial) {
    const canvas = document.getElementById('edo-chart');
    document.getElementById('edo-chart-placeholder').style.display = 'none';
    if (canvas._chartInstance) canvas._chartInstance.destroy();

    canvas._chartInstance = new Chart(canvas, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Aproximación EDO',
                data: historial.map(p => ({ x: p.x, y: p.y })),
                borderColor: '#2563eb', backgroundColor: '#2563eb',
                borderWidth: 2, pointRadius: 3, fill: false, tension: 0.1,
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