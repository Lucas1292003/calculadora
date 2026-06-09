import { UI } from './ui.js';
import { LISTA_METODOS } from './metodos/index.js';

const appContent = document.getElementById('app-content');

export function loadDashboard() {
    document.getElementById('view-title').innerText = 'Calculadora Numérica';
    document.getElementById('view-description').innerText = 'Selecciona un método para comenzar.';
    appContent.innerHTML = UI.renderDashboard();

    // Un solo listener en appContent cubre todos los grupos del dashboard
    appContent.addEventListener('click', (e) => {
        const card = e.target.closest('.method-card');
        if (card) navigateTo(card.getAttribute('data-section'));
    });
}

export function navigateTo(sectionId) {
    const metodo = LISTA_METODOS.find(m => m.id === sectionId);
    if (!metodo) return;

    document.getElementById('view-title').innerText = metodo.titulo;
    document.getElementById('view-description').innerText = metodo.descripcion;
    appContent.innerHTML = metodo.renderHTML();
    metodo.init?.();

    vincularMotorPreviews();

    // ── BUG CORREGIDO: era '.nav-menu', ahora '.nav-item' ──
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-section') === sectionId);
    });
}

// Renderizado dinámico en tiempo real con KaTeX
function vincularMotorPreviews() {
    const container = document.querySelector('.inputs-card [id$="-preview-container"]');
    if (!container) return;

    const inputsMatematicos = document.querySelectorAll('.inputs-card input:not([type="number"])');
    if (inputsMatematicos.length === 0) return;

    const procesarYRenderizar = () => {
        container.innerHTML = '';
        let visibilidadContenedor = false;

        inputsMatematicos.forEach(input => {
            const formulaTexto = input.value.trim() || input.placeholder || '';
            if (!formulaTexto) return;

            const labelTexto = input.previousElementSibling?.textContent || 'Expresión';

            const formulaWrapper = document.createElement('div');
            formulaWrapper.style.margin = '6px 0';
            formulaWrapper.innerHTML = `
                <small style="color: var(--text-muted); display: block; font-size: 0.78rem; margin-bottom: 4px;">
                    Vista matemática de <strong>${labelTexto}</strong>:
                </small>
                <div class="math-target" style="padding: 4px 0; overflow-x: auto;"></div>
            `;
            container.appendChild(formulaWrapper);

            const mathTarget = formulaWrapper.querySelector('.math-target');

            try {
                const nodoSintactico = math.parse(formulaTexto);
                const codigoLatex = nodoSintactico.toTex({ parenthesis: 'keep' });
                katex.render(codigoLatex, mathTarget, {
                    throwOnError: false,
                    displayMode: true
                });
                visibilidadContenedor = true;
            } catch (err) {
                mathTarget.innerHTML = `<span style="color: var(--text-muted); font-style: italic;">${formulaTexto}</span>`;
            }
        });

        container.style.display = visibilidadContenedor ? 'flex' : 'none';
    };

    inputsMatematicos.forEach(input => {
        input.addEventListener('input', procesarYRenderizar);
    });

    procesarYRenderizar();
}