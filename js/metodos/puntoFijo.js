import { renderLayout, graficarFuncion, mostrarResultado, getVal } from '../baseMetodo.js';

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
    }
};