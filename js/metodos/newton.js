import { renderLayout, graficarFuncion, mostrarResultado, getVal } from '../baseMetodo.js';

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
            <div class="form-group">
                <label>x₀ (valor inicial)</label>
                <input id="nr-x0" type="number" placeholder="2" />
            </div>
            <div class="form-group">
                <label>Tolerancia</label>
                <input id="nr-tol" type="number" placeholder="0.0001" />
            </div>
        `;
        return renderLayout('nr', inputs);
    }
};