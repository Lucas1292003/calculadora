import { GRUPOS_METODOS } from './metodos/index.js';

export const UI = {

    // Dashboard con secciones por categoría
    renderDashboard: () => {
        return GRUPOS_METODOS.map(grupo => `
            <div class="dashboard-section">
                <h2 class="dashboard-section-title">
                    <span class="section-icon">${grupo.icon}</span>
                    ${grupo.titulo}
                </h2>
                <div class="welcome-grid">
                    ${grupo.metodos.map(m => `
                        <div class="method-card" data-section="${m.id}">
                            <div class="method-icon">${m.icon}</div>
                            <h3>${m.titulo}</h3>
                            <p>${m.descripcion}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    },

    // Sidebar con encabezados de categoría
    renderSidebarMenu: () => {
        return GRUPOS_METODOS.map(grupo => `
            <div class="nav-group">
                <div class="nav-group-title">${grupo.titulo}</div>
                ${grupo.metodos.map(m => `
                    <button class="nav-item" data-section="${m.id}">
                        ${m.titulo}
                    </button>
                `).join('')}
            </div>
        `).join('');
    }
};