import { renderLayout, graficarFuncion, mostrarResultado } from '../baseMetodo.js';

export const regulaFalsi = {
    id: 'regulaFalsi',
    titulo: 'Regula Falsi',
    descripcion: 'Traza una recta entre f(a) y f(b) para encontrar la intersección con el eje X. Suele converger más rápido que bisección.',
    icon: '📏', // Puedes cambiar el icono si lo deseas

    renderHTML() {
        const inputs = `
            <div class="form-group">
                <label>f(x)</label>
                <input id="rf-fx" placeholder="x^2 - 4" />
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>a</label>
                    <input id="rf-a" type="number" placeholder="0" />
                </div>
                <div class="form-group">
                    <label>b</label>
                    <input id="rf-b" type="number" placeholder="3" />
                </div>
            </div>
            <div class="form-group">
                <label>Tolerancia</label>
                <input id="rf-tol" type="number" placeholder="0.0001" />
            </div>
        `;
        return renderLayout('rf', inputs);
    },

    init() {
        document.getElementById('rf-btn').addEventListener('click', () => this.calcular());
    },

    // Lee el valor del input, y si está vacío usa el placeholder
    getVal(id) {
        const el = document.getElementById(id);
        return el.value.trim() !== '' ? el.value.trim() : el.placeholder;
    },

    calcular() {
        const fx  = this.getVal('rf-fx');
        let a     = parseFloat(this.getVal('rf-a'));
        let b     = parseFloat(this.getVal('rf-b'));
        const tol = parseFloat(this.getVal('rf-tol'));
        const resultado = document.getElementById('rf-resultado');

        try {
            const f = (x) => math.evaluate(fx, { x });

            let fa = f(a);
            let fb = f(b);

            if (fa * fb >= 0) {
                resultado.innerHTML = '<p class="error">f(a) y f(b) deben tener signos opuestos.</p>';
                return;
            }

            let iteraciones = [];
            let c;
            let fc;
            const aOrig = a, bOrig = b;

            for (let i = 0; i < 100; i++) {
                // Se aplica la fórmula de Regula Falsi en lugar del punto medio
                c = b - (fb * (a - b)) / (fa - fb);
                fc = f(c);
                
                iteraciones.push({ i: i + 1, a, b, c, fc });

                // Condición de parada (tolerancia)
                if (Math.abs(fc) < tol) break;

                // Reasignación del intervalo
                if (fa * fc < 0) {
                    b = c;
                    fb = fc;
                } else {
                    a = c;
                    fa = fc;
                }
            }

            mostrarResultado('rf', c, iteraciones.length);
            graficarFuncion('rf-chart', 'rf-chart-placeholder', f, aOrig, bOrig, c);

            document.getElementById('rf-tabla').innerHTML = `
                <div class="tabla-wrapper">
                    <table>
                        <thead>
                            <tr><th>n</th><th>a</th><th>b</th><th>c</th><th>f(c)</th></tr>
                        </thead>
                        <tbody>
                            ${iteraciones.map(r => `
                                <tr>
                                    <td>${r.i}</td>
                                    <td>${r.a.toFixed(6)}</td>
                                    <td>${r.b.toFixed(6)}</td>
                                    <td>${r.c.toFixed(6)}</td>
                                    <td>${r.fc.toFixed(6)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        } catch {
            resultado.innerHTML = '<p class="error">Error al evaluar la función. Revisá la expresión.</p>';
        }
    }
};