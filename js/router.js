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

    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-section') === sectionId);
    });
}