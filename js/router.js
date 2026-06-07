import { UI } from './ui.js';
import { LISTA_METODOS } from './metodos/index.js';

const appContent = document.getElementById('app-content');

export function loadDashboard() {
    document.getElementById('view-title').innerText = 'Calculadora Numérica';
    document.getElementById('view-description').innerText = 'Selecciona un método para comenzar.';
    appContent.innerHTML = UI.renderDashboard();

    appContent.querySelector('.welcome-grid')?.addEventListener('click', (e) => {
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
    metodo.init?.(); // Si el método tiene lógica de inicialización, la ejecuta

    // ── SOLUCIÓN: El motor ahora se autogestiona sin depender de IDs manuales ──
    vincularMotorPreviews();

    document.querySelectorAll('.nav-menu').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-section') === sectionId);
    });
}

// Función encargada del renderizado dinámico en tiempo real (KaTeX)
function vincularMotorPreviews() {
    // Busca dinámicamente cualquier elemento cuyo ID termine con "-preview-container" dentro de los inputs activos
    const container = document.querySelector('.inputs-card [id$="-preview-container"]');
    if (!container) return;

    // Buscamos todos los campos de entrada de texto (ignoramos los números tradicionales como tolerancias o intervalos)
    const inputsMatematicos = document.querySelectorAll('.inputs-card input:not([type="number"])');
    if (inputsMatematicos.length === 0) return;

    const procesarYRenderizar = () => {
        container.innerHTML = '';
        let visibilidadContenedor = false;

        inputsMatematicos.forEach(input => {
            const formulaTexto = input.value.trim() || input.placeholder || '';
            if (!formulaTexto) return;

            // Extraemos la etiqueta asignada al campo (ej: f(x) o g(x))
            const labelTexto = input.previousElementSibling?.textContent || 'Expresión';

            // Estructuramos un sub-bloque de visualización por cada input matemático detectado
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
                // math.parse procesa el texto común y toTex() genera el código LaTeX formal
                const nodoSintactico = math.parse(formulaTexto);
                const codigoLatex = nodoSintactico.toTex({ parenthesis: 'keep' });

                // KaTeX renderiza el código LaTeX directamente en el elemento del DOM
                katex.render(codigoLatex, mathTarget, {
                    throwOnError: false,
                    displayMode: true // Centra la fórmula y le asigna tamaño de bloque formal
                });
                visibilidadContenedor = true;
            } catch (err) {
                // Mientras el usuario escribe, la expresión puede estar incompleta. Mostramos el texto temporal de forma segura
                mathTarget.innerHTML = `<span style="color: var(--text-muted); font-style: italic;">${formulaTexto}</span>`;
            }
        });

        // Mostramos el contenedor general de previsualizaciones únicamente si hay fórmulas válidas procesándose
        container.style.display = visibilidadContenedor ? 'flex' : 'none';
    };

    // Escuchamos el tipeo activo del usuario en los inputs analizados
    inputsMatematicos.forEach(input => {
        input.addEventListener('input', procesarYRenderizar);
    });

    // Invocación inicial para renderizar los placeholders por defecto inmediatamente al entrar a la vista
    procesarYRenderizar();
}
