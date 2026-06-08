import { renderLayout, graficarIntegracion, mostrarResultadoIntegracion } from '../baseMetodo.js';

export const simpson38 = {
    id: 'simpson38',
    titulo: 'Simpson 3/8',
    descripcion: 'Versión mejorada de Simpson que ajusta polinomios de grado 3. n debe ser múltiplo de 3.',
    icon: '∫³⁄₈',

    renderHTML() {
        const inputs = `
            <div class="form-group">
                <label>f(x)</label>
                <input id="s38-fx" placeholder="x^3 - x" />
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>a (límite inferior)</label>
                    <input id="s38-a" type="number" placeholder="0" />
                </div>
                <div class="form-group">
                    <label>b (límite superior)</label>
                    <input id="s38-b" type="number" placeholder="2" />
                </div>
            </div>
            <div class="form-group">
                <label>n (subintervalos, múltiplo de 3)</label>
                <input id="s38-n" type="number" placeholder="6" min="3" step="3" />
            </div>
        `;
        return renderLayout('s38', inputs);
    },

    init() {
        document.getElementById('s38-btn').addEventListener('click', () => this.calcular());
    },

    getVal(id) {
        const el = document.getElementById(id);
        return el.value.trim() !== '' ? el.value.trim() : el.placeholder;
    },

    calcular() {
        const fxStr    = this.getVal('s38-fx');
        const a        = parseFloat(this.getVal('s38-a'));
        const b        = parseFloat(this.getVal('s38-b'));
        let   n        = parseInt(this.getVal('s38-n'));
        const resultado = document.getElementById('s38-resultado');

        if (a >= b) { resultado.innerHTML = '<p class="error">a debe ser menor que b.</p>';    return; }
        if (n < 3)  { resultado.innerHTML = '<p class="error">n debe ser al menos 3.</p>';     return; }

        // Forzar n múltiplo de 3
        if (n % 3 !== 0) {
            n = n + (3 - (n % 3));
            document.getElementById('s38-n').value = n;
            resultado.innerHTML = `<p class="error">n debe ser múltiplo de 3. Se ajustó automáticamente a n = ${n}.</p>`;
        }

        try {
            const f = (x) => math.evaluate(fxStr, { x });
            const h = (b - a) / n;

            // ── Fórmula: (3h/8)[f(x₀) + 3f(x₁) + 3f(x₂) + 2f(x₃) + 3f(x₄) + ... + f(xₙ)] ──
            // patrón de coeficientes: 1, 3, 3, 2, 3, 3, 2, ..., 3, 3, 1
            const filas = [];
            let suma = 0;

            for (let i = 0; i <= n; i++) {
                const xi  = a + i * h;
                const fxi = f(xi);
                let coef;
                if      (i === 0 || i === n) coef = 1;
                else if (i % 3 === 0)        coef = 2;   // múltiplo de 3 interno
                else                         coef = 3;   // posición 1, 2 dentro de cada grupo

                filas.push({ i, xi, fxi, coef, contrib: coef * fxi });
                suma += coef * fxi;
            }

            const integral = (3 * h / 8) * suma;

            mostrarResultadoIntegracion('s38', integral, n, h);
            graficarIntegracion('s38-chart', 's38-chart-placeholder', f, a, b, n);

            document.getElementById('s38-tabla').innerHTML = `
                <div class="tabla-wrapper">
                    <table>
                        <thead>
                            <tr><th>i</th><th>xᵢ</th><th>f(xᵢ)</th><th>Coef.</th><th>Coef × f(xᵢ)</th></tr>
                        </thead>
                        <tbody>
                            ${filas.map(r => `
                                <tr>
                                    <td>${r.i}</td>
                                    <td>${r.xi.toFixed(6)}</td>
                                    <td>${r.fxi.toFixed(6)}</td>
                                    <td>${r.coef}</td>
                                    <td>${r.contrib.toFixed(6)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="4" class="tfoot-label">Integral = (3h/8) × Σ =</td>
                                <td class="tfoot-valor">${integral.toFixed(8)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            `;
        } catch {
            resultado.innerHTML = '<p class="error">Error al evaluar la función. Revisá la expresión.</p>';
        }
    }
};