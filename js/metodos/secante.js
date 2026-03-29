import { renderLayout, graficarFuncion, mostrarResultado, getVal } from '../baseMetodo.js';

export const secante = {
    id: 'secante',
    titulo: 'Secante',
    descripcion: 'Similar a Newton-Raphson, pero usa una aproximación de la pendiente sin necesidad de derivar.',
    icon: '⟀',

    renderHTML() {
        const inputs = `
            <div class="form-group">
                <label>f(x)</label>
                <input id="sec-fx" placeholder="x^3 - 2*x - 5" />
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>x₀</label>
                    <input id="sec-x0" type="number" placeholder="2" />
                </div>
                <div class="form-group">
                    <label>x₁</label>
                    <input id="sec-x1" type="number" placeholder="3" />
                </div>
            </div>
            <div class="form-group">
                <label>Tolerancia</label>
                <input id="sec-tol" type="number" placeholder="0.0001" />
            </div>
        `;
        return renderLayout('sec', inputs);
    },

    
};