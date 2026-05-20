import { renderLayout, graficarFuncion, mostrarResultado } from '../baseMetodo.js';

export const secante = {
    id: 'secante',
    titulo: 'Método de la Secante',
    descripcion: 'Aproxima la derivada utilizando dos puntos iniciales, eliminando la necesidad de calcular la derivada formal.',
    icon: 'Δx',

    renderHTML() {
        const inputs = `
            <div class="form-group">
                <label>f(x)</label>
                <input id="sec-fx" placeholder="x^3 - 2*x - 5" />
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>x₀ (Primer punto)</label>
                    <input id="sec-x0" type="number" placeholder="1" />
                </div>
                <div class="form-group">
                    <label>x₁ (Segundo punto)</label>
                    <input id="sec-x1" type="number" placeholder="2" />
                </div>
            </div>
            <div class="form-group">
                <label>Tolerancia</label>
                <input id="sec-tol" type="number" placeholder="0.0001" />
            </div>
        `;
        return renderLayout('sec', inputs);
    },

    init() {
        document.getElementById('sec-btn').addEventListener('click', () => this.calcular());
    },

    // Lee el valor del input, y si está vacío usa el placeholder
    getVal(id) {
        const el = document.getElementById(id);
        return el.value.trim() !== '' ? el.value.trim() : el.placeholder;
    },

    calcular() {
        const strFx = this.getVal('sec-fx');
        let x0 = parseFloat(this.getVal('sec-x0'));
        let x1 = parseFloat(this.getVal('sec-x1'));
        const tol = parseFloat(this.getVal('sec-tol'));
        const resultado = document.getElementById('sec-resultado');

        try {
            const f = (x) => math.evaluate(strFx, { x });

            let iteraciones = [];
            const MAX_ITER = 100;
            let raiz = x1;

            for (let i = 0; i < MAX_ITER; i++) {
                const fx0 = f(x0);
                const fx1 = f(x1);

                // Evitar división por cero si las imágenes se igualan
                if (Math.abs(fx1 - fx0) < 1e-12) {
                    resultado.innerHTML = '<p class="error">Error: f(x₁) - f(x₀) es cercano a 0. El método se indetermina.</p>';
                    return;
                }

                // Fórmula de la secante
                const xNext = x1 - (fx1 * (x1 - x0)) / (fx1 - fx0);
                const error = Math.abs(xNext - x1);

                iteraciones.push({ i: i + 1, x0, x1, fx1, xNext, error });

                if (error < tol || Math.abs(f(xNext)) < tol) {
                    raiz = xNext;
                    break;
                }

                // Desplazamiento de puntos para la siguiente iteración
                x0 = x1;
                x1 = xNext;
                raiz = xNext;
            }

            // Mostrar resultados y gráfico
            mostrarResultado('sec', raiz, iteraciones.length);
            graficarFuncion('sec-chart', 'sec-chart-placeholder', f, raiz - 5, raiz + 5, raiz);

            // Armar la tabla de iteraciones
            document.getElementById('sec-tabla').innerHTML = `
                <div class="tabla-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>n</th>
                                <th>xₙ₋₁</th>
                                <th>xₙ</th>
                                <th>xₙ₊₁ (sig)</th>
                                <th>f(xₙ)</th>
                                <th>Error</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${iteraciones.map(r => `
                                <tr>
                                    <td>${r.i}</td>
                                    <td>${r.x0.toFixed(6)}</td>
                                    <td>${r.x1.toFixed(6)}</td>
                                    <td>${r.xNext.toFixed(6)}</td>
                                    <td>${r.fx1.toFixed(6)}</td>
                                    <td>${r.error.toFixed(6)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        } catch (e) {
            resultado.innerHTML = '<p class="error">Error al evaluar la función. Revisá la sintaxis.</p>';
        }
    }
};