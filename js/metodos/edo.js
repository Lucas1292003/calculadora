import { renderLayout } from '../baseMetodo.js';

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
    
    // Inyecta los inputs en el layout base de baseMetodo.js
    renderHTML: () => {
        const inputsHTML = `
            <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 15px;">
                <label>Función f(x,y): <input type="text" id="edo-f" value="x - y" style="width:100%"></label>
                <div style="display: flex; gap: 10px;">
                    <label>x₀: <input type="number" id="edo-x0" step="any" value="0" style="width:100%"></label>
                    <label>y₀: <input type="number" id="edo-y0" step="any" value="1" style="width:100%"></label>
                </div>
                <div style="display: flex; gap: 10px;">
                    <label>Paso (h): <input type="number" id="edo-h" step="any" value="0.1" style="width:100%"></label>
                    <label>Pasos (n): <input type="number" id="edo-n" value="10" style="width:100%"></label>
                </div>
                <label>Método:
                    <select id="edo-tipo" style="width:100%">
                        <option value="euler">Euler</option>
                        <option value="rk2">Runge-Kutta 2 (Heun)</option>
                        <option value="rk4">Runge-Kutta 4</option>
                    </select>
                </label>
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
                // Compilamos la función usando math.js para mayor seguridad y velocidad
                const nodo = math.compile(funcStr);
                const f = (x, y) => nodo.evaluate({ x, y });

                // Calculamos
                const historial = calcularEDO(tipo, f, x0, y0, h, pasos);

                // Mostramos el último valor como resultado destacado
                const ultimoPunto = historial[historial.length - 1];
                document.getElementById('edo-resultado').innerHTML = `
                    <div class="resultado-destacado">
                        <div class="resultado-valor">y = ${ultimoPunto.y}</div>
                        <div class="resultado-label">En x = ${ultimoPunto.x}</div>
                    </div>
                `;

                // Renderizamos la tabla
                let htmlTabla = `<table style="width:100%; text-align:left; border-collapse: collapse;">
                    <tr style="border-bottom: 1px solid #ccc;">
                        <th>Paso</th><th>x</th><th>y</th>
                    </tr>`;
                historial.forEach(p => {
                    htmlTabla += `<tr><td>${p.paso}</td><td>${p.x}</td><td>${p.y}</td></tr>`;
                });
                htmlTabla += `</table>`;
                document.getElementById('edo-tabla').innerHTML = htmlTabla;

                // Generamos el gráfico usando Chart.js
                graficarEDO(historial);

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