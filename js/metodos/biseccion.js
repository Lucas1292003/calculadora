import { renderLayout, graficarFuncion, mostrarResultado } from '../baseMetodo.js';

export const biseccion = {
    id: 'biseccion',
    titulo: 'Bisección',
    descripcion: 'Divide el intervalo a la mitad repetidamente hasta encerrar la raíz. Es lento pero siempre converge.',
    icon: '½',

    renderHTML() {
        const inputs = `
            <div class="form-group">
                <label>f(x)</label>
                <input id="bis-fx" placeholder="x^2 - 4" />
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>a</label>
                    <input id="bis-a" type="number" placeholder="0" />
                </div>
                <div class="form-group">
                    <label>b</label>
                    <input id="bis-b" type="number" placeholder="3" />
                </div>
            </div>
            <div class="form-group">
                <label>Tolerancia</label>
                <input id="bis-tol" type="number" placeholder="0.0001" />
            </div>
        `;
        return renderLayout('bis', inputs);
    },

    init() {
        document.getElementById('bis-btn').addEventListener('click', () => this.calcular());
    },

    // Lee el valor del input, y si está vacío usa el placeholder
    getVal(id) {
        const el = document.getElementById(id);
        return el.value.trim() !== '' ? el.value.trim() : el.placeholder;
    },

    calcular() {
        const fx  = this.getVal('bis-fx');
        let a     = parseFloat(this.getVal('bis-a'));
        let b     = parseFloat(this.getVal('bis-b'));
        const tol = parseFloat(this.getVal('bis-tol'));
        const resultado = document.getElementById('bis-resultado');

        try {
            const f = (x) => math.evaluate(fx, { x });

            if (f(a) * f(b) >= 0) {
                resultado.innerHTML = '<p class="error">f(a) y f(b) deben tener signos opuestos.</p>';
                return;
            }

            let iteraciones = [];
            let c;
            const aOrig = a, bOrig = b;

            for (let i = 0; i < 100; i++) {
                c = (a + b) / 2;
                const fc = f(c);
                iteraciones.push({ i: i + 1, a, b, c, fc });

                if (Math.abs(fc) < tol || (b - a) / 2 < tol) break;
                if (f(a) * fc < 0) b = c; else a = c;
            }

            mostrarResultado('bis', c, iteraciones.length);
            graficarFuncion('bis-chart', 'bis-chart-placeholder', f, aOrig, bOrig, c);

            document.getElementById('bis-tabla').innerHTML = `
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