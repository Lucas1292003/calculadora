import { renderLayout, graficarFuncion, mostrarResultado } from '../baseMetodo.js';

export const puntoFijo = {
    id: 'punto-fijo',
    titulo: 'Punto Fijo',
    descripcion: 'Transforma la ecuación en x = g(x) para encontrar el valor donde la función se intersecta con la identidad.',
    icon: '⊙',

    renderHTML() {
        const inputs = `
            <div class="form-group">
                <label>g(x) <small>(despejada como x = g(x))</small></label>
                <input id="pf-gx" placeholder="sqrt(x + 2)" />
            </div>
            <div class="form-group">
                <label>x₀ (valor inicial)</label>
                <input id="pf-x0" type="number" placeholder="1" />
            </div>
            <div class="form-group">
                <label>Tolerancia</label>
                <input id="pf-tol" type="number" placeholder="0.0001" />
            </div>
        `;
        return renderLayout('pf', inputs);
    },

    init() {
        // Vinculamos el botón de calcular con la función calcular()
        document.getElementById('pf-btn').addEventListener('click', () => this.calcular());
    },

    getVal(id) {
        const el = document.getElementById(id);
        return el.value.trim() !== '' ? el.value.trim() : el.placeholder;
    },

    calcular() {
        const gxStr = this.getVal('pf-gx');
        let x0      = parseFloat(this.getVal('pf-x0'));
        const tol   = parseFloat(this.getVal('pf-tol'));
        const resultado = document.getElementById('pf-resultado');

        try {
            // Evaluamos la función g(x) usando math.js
            const g = (x) => math.evaluate(gxStr, { x });

            let iteraciones = [];
            let x1;
            let error = tol + 1; // Inicializamos el error mayor a la tolerancia
            const xInicio = x0;

            // Bucle principal del método
            for (let i = 0; i < 100; i++) {
                x1 = g(x0); // Calculamos el nuevo valor
                error = Math.abs(x1 - x0); // Calculamos el error absoluto
                
                iteraciones.push({ i: i + 1, x0, x1, error });

                if (error < tol) break; // Condición de parada
                
                x0 = x1; // Actualizamos para la siguiente iteración
            }

            mostrarResultado('pf', x1, iteraciones.length);

            // Para graficar usando tu función base que solo toma una función f(x),
            // convertimos el problema de x = g(x) de vuelta a f(x) = g(x) - x = 0.
            // Así la raíz se verá donde cruza el eje Y=0.
            const f = (x) => g(x) - x;
            
            // Calculamos un rango dinámico para el gráfico
            const margen = Math.max(Math.abs(xInicio - x1), 1);
            const aOrig = Math.min(xInicio, x1) - margen;
            const bOrig = Math.max(xInicio, x1) + margen;
            
            graficarFuncion('pf-chart', 'pf-chart-placeholder', f, aOrig, bOrig, x1);

            // Generar la tabla de iteraciones
            document.getElementById('pf-tabla').innerHTML = `
                <div class="tabla-wrapper">
                    <table>
                        <thead>
                            <tr><th>n</th><th>x₀</th><th>x₁ = g(x₀)</th><th>Error |x₁ - x₀|</th></tr>
                        </thead>
                        <tbody>
                            ${iteraciones.map(r => `
                                <tr>
                                    <td>${r.i}</td>
                                    <td>${r.x0.toFixed(6)}</td>
                                    <td>${r.x1.toFixed(6)}</td>
                                    <td>${r.error.toFixed(6)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        } catch {
            resultado.innerHTML = '<p class="error">Error al evaluar la función. Revisá la expresión de g(x).</p>';
        }
    }
};