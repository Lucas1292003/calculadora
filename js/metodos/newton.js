import { renderLayout, graficarFuncion, mostrarResultado } from '../baseMetodo.js';

export const newton = {
    id: 'newton-raphson',
    titulo: 'Newton Raphson',
    descripcion: 'Utiliza la derivada para encontrar la recta tangente y alcanzar la raíz con gran velocidad.',
    icon: 'ƒ\'',

    renderHTML() {
        const inputs = `
            <div class="form-group">
                <label>f(x)</label>
                <input id="nr-fx" placeholder="x^3 - 2*x - 5" />
            </div>
            <div class="form-group">
                <label>f'(x) <small>(derivada)</small></label>
                <input id="nr-dfx" placeholder="3*x^2 - 2" />
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>x₀ (valor inicial)</label>
                    <input id="nr-x0" type="number" placeholder="2" />
                </div>
                <div class="form-group">
                    <label>Tolerancia</label>
                    <input id="nr-tol" type="number" placeholder="0.0001" />
                </div>
            </div>
        `;
        return renderLayout('nr', inputs);
    },

    init() {
        document.getElementById('nr-btn').addEventListener('click', () => this.calcular());
    },

    // Lee el valor del input, y si está vacío usa el placeholder
    getVal(id) {
        const el = document.getElementById(id);
        return el.value.trim() !== '' ? el.value.trim() : el.placeholder;
    },

    calcular() {
        const strFx = this.getVal('nr-fx');
        const strDfx = this.getVal('nr-dfx');
        let x0 = parseFloat(this.getVal('nr-x0'));
        const tol = parseFloat(this.getVal('nr-tol'));
        const resultado = document.getElementById('nr-resultado');

        try {
            const f = (x) => math.evaluate(strFx, { x });
            const df = (x) => math.evaluate(strDfx, { x });

            let iteraciones = [];
            let xi = x0;
            const MAX_ITER = 100;

            for (let i = 0; i < MAX_ITER; i++) {
                const fxi = f(xi);
                const dfxi = df(xi);

                // Evitar división por cero
                if (Math.abs(dfxi) < 1e-12) {
                    resultado.innerHTML = '<p class="error">Error: La derivada se hizo 0 (recta paralela al eje x). Probá con otro x₀.</p>';
                    return;
                }

                const xNext = xi - (fxi / dfxi);
                const error = Math.abs(xNext - xi);

                iteraciones.push({ i: i + 1, xi, fxi, dfxi, error });

                if (error < tol || Math.abs(f(xNext)) < tol) {
                    xi = xNext;
                    break;
                }
                
                xi = xNext;
            }

            // Mostrar resultados y gráfico
            mostrarResultado('nr', xi, iteraciones.length);
            graficarFuncion('nr-chart', 'nr-chart-placeholder', f, xi - 5, xi + 5, xi);

            // Armar la tabla
            document.getElementById('nr-tabla').innerHTML = `
                <div class="tabla-wrapper">
                    <table>
                        <thead>
                            <tr><th>n</th><th>xᵢ</th><th>f(xᵢ)</th><th>f'(xᵢ)</th><th>Error</th></tr>
                        </thead>
                        <tbody>
                            ${iteraciones.map(r => `
                                <tr>
                                    <td>${r.i}</td>
                                    <td>${r.xi.toFixed(6)}</td>
                                    <td>${r.fxi.toFixed(6)}</td>
                                    <td>${r.dfxi.toFixed(6)}</td>
                                    <td>${r.error.toFixed(6)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        } catch (e) {
            resultado.innerHTML = '<p class="error">Error al evaluar la función o su derivada. Revisá la sintaxis.</p>';
        }
    }
};