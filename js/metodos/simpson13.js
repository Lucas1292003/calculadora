import { renderLayout, graficarIntegracion, mostrarResultadoIntegracion } from '../baseMetodo.js';

export const simpson13 = {
    id: 'simpson13',
    titulo: 'Simpson 1/3',
    descripcion: 'Aproxima la integral ajustando parábolas entre pares de subintervalos. n debe ser par.',
    icon: '∫¹⁄₃',

    renderHTML() {
        const inputs = `
            <div class="form-group">
                <label>f(x)</label>
                <input id="s13-fx" placeholder="sin(x)" />
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>a (límite inferior)</label>
                    <input id="s13-a" type="number" placeholder="0" />
                </div>
                <div class="form-group">
                    <label>b (límite superior)</label>
                    <input id="s13-b" type="number" placeholder="3.14159" />
                </div>
            </div>
            <div class="form-group">
                <label>n (subintervalos, debe ser par)</label>
                <input id="s13-n" type="number" placeholder="4" min="2" step="2" />
            </div>
        `;
        return renderLayout('s13', inputs);
    },

    init() {
        document.getElementById('s13-btn').addEventListener('click', () => this.calcular());
    },

    getVal(id) {
        const el = document.getElementById(id);
        return el.value.trim() !== '' ? el.value.trim() : el.placeholder;
    },

    calcular() {
        const fxStr    = this.getVal('s13-fx');
        const a        = parseFloat(this.getVal('s13-a'));
        const b        = parseFloat(this.getVal('s13-b'));
        let   n        = parseInt(this.getVal('s13-n'));
        const resultado = document.getElementById('s13-resultado');

        if (a >= b) { resultado.innerHTML = '<p class="error">a debe ser menor que b.</p>';    return; }
        if (n < 2)  { resultado.innerHTML = '<p class="error">n debe ser al menos 2.</p>';     return; }

        // Forzar n par
        if (n % 2 !== 0) {
            n++;
            document.getElementById('s13-n').value = n;
            resultado.innerHTML = `<p class="error">n debe ser par. Se ajustó automáticamente a n = ${n}.</p>`;
        }

        try {
            const f = (x) => math.evaluate(fxStr, { x });
            const h = (b - a) / n;

            // ── Fórmula: (h/3)[f(x₀) + 4f(x₁) + 2f(x₂) + 4f(x₃) + ... + f(xₙ)] ──
            // coeficientes: 1, 4, 2, 4, 2, ..., 4, 1
            const filas = [];
            let suma = 0;

            for (let i = 0; i <= n; i++) {
                const xi  = a + i * h;
                const fxi = f(xi);
                let coef;
                if      (i === 0 || i === n) coef = 1;
                else if (i % 2 === 1)        coef = 4;
                else                         coef = 2;

                filas.push({ i, xi, fxi, coef, contrib: coef * fxi });
                suma += coef * fxi;
            }

            const integral = (h / 3) * suma;

            mostrarResultadoIntegracion('s13', integral, n, h);
            graficarIntegracion('s13-chart', 's13-chart-placeholder', f, a, b, n);

            document.getElementById('s13-tabla').innerHTML = `
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
                                <td colspan="4" class="tfoot-label">Integral = (h/3) × Σ =</td>
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