import { renderLayout, graficarIntegracion, mostrarResultadoIntegracion } from '../baseMetodo.js';

export const trapecio = {
    id: 'trapecio',
    titulo: 'Regla del Trapecio',
    descripcion: 'Aproxima la integral dividiendo el área en trapecios. Fácil de aplicar y siempre converge.',
    icon: '⌗',

    renderHTML() {
        const inputs = `
            <div class="form-group">
                <label>f(x)</label>
                <input id="trap-fx" placeholder="x^2" />
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>a (límite inferior)</label>
                    <input id="trap-a" type="number" placeholder="0" />
                </div>
                <div class="form-group">
                    <label>b (límite superior)</label>
                    <input id="trap-b" type="number" placeholder="1" />
                </div>
            </div>
            <div class="form-group">
                <label>n (cantidad de subintervalos)</label>
                <input id="trap-n" type="number" placeholder="4" min="1" />
            </div>
        `;
        return renderLayout('trap', inputs);
    },

    init() {
        document.getElementById('trap-btn').addEventListener('click', () => this.calcular());
    },

    getVal(id) {
        const el = document.getElementById(id);
        return el.value.trim() !== '' ? el.value.trim() : el.placeholder;
    },

    calcular() {
        const fxStr    = this.getVal('trap-fx');
        const a        = parseFloat(this.getVal('trap-a'));
        const b        = parseFloat(this.getVal('trap-b'));
        const n        = parseInt(this.getVal('trap-n'));
        const resultado = document.getElementById('trap-resultado');

        if (a >= b) { resultado.innerHTML = '<p class="error">a debe ser menor que b.</p>'; return; }
        if (n < 1)  { resultado.innerHTML = '<p class="error">n debe ser al menos 1.</p>';   return; }

        try {
            const f = (x) => math.evaluate(fxStr, { x });
            const h = (b - a) / n;

            // ── Fórmula: (h/2)[f(x₀) + 2f(x₁) + ... + 2f(xₙ₋₁) + f(xₙ)] ──
            const filas = [];
            let suma = 0;

            for (let i = 0; i <= n; i++) {
                const xi   = a + i * h;
                const fxi  = f(xi);
                const coef = (i === 0 || i === n) ? 1 : 2;
                filas.push({ i, xi, fxi, coef, contrib: coef * fxi });
                suma += coef * fxi;
            }

            const integral = (h / 2) * suma;

            mostrarResultadoIntegracion('trap', integral, n, h);
            graficarIntegracion('trap-chart', 'trap-chart-placeholder', f, a, b, n);

            document.getElementById('trap-tabla').innerHTML = `
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
                                <td colspan="4" class="tfoot-label">Integral = (h/2) × Σ =</td>
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