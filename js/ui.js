import { LISTA_METODOS } from './metodos/index.js';

export const UI = {
    // Genera las tarjetas del Dashboard automáticamente
    renderDashboard: () => {
        return `
            <div class="welcome-grid">
                ${LISTA_METODOS.map(metodo => `
                    <div class="method-card" data-section="${metodo.id}">
                        <div class="method-icon">${metodo.icon}</div>
                        <h3>${metodo.titulo}</h3>
                        <p>${metodo.descripcion}</p>
                    </div>
                `).join('')}
            </div>
        `;
    },

    // Genera los botones del Menú lateral automáticamente
    renderSidebarMenu: () => {
        return LISTA_METODOS.map(metodo => `
            <button class="nav-item" data-section="${metodo.id}">
                ${metodo.titulo}
            </button>
        `).join('');
    }
};