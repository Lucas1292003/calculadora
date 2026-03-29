import { renderLayout, graficarFuncion, mostrarResultado, getVal } from '../baseMetodo.js';

export const regulaFalsi = {
    id: 'regula-falsi',
    titulo: 'Regula Falsi',
    descripcion: 'Método de la falsa posición. Une los puntos del intervalo con una línea recta para aproximar la raíz.',
    icon: '✕',

    renderHTML() {
        const inputs = `
            <div class="form-group">
                <label>f(x)</label>
                <input id="rf-fx" placeholder="x^3 - x - 2" />
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>a</label>
                    <input id="rf-a" type="number" placeholder="1" />
                </div>
                <div class="form-group">
                    <label>b</label>
                    <input id="rf-b" type="number" placeholder="2" />
                </div>
            </div>
            <div class="form-group">
                <label>Tolerancia</label>
                <input id="rf-tol" type="number" placeholder="0.0001" />
            </div>
        `;
        return renderLayout('rf', inputs);
    }
};