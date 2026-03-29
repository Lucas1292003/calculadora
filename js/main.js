import { UI } from './ui.js';
import { loadDashboard, navigateTo } from './router.js';
import { initCalculadora } from './calculadora.js';

const sidebar   = document.getElementById('sidebar');
const mainLogo  = document.getElementById('main-logo');
const appContent = document.getElementById('app-content');

function init() {
    document.querySelector('.nav-menu').innerHTML = UI.renderSidebarMenu();
    loadDashboard();
    setupEventListeners();
    initCalculadora();
}

function setupEventListeners() {
    // ── Sidebar y Logo ────────────────────────
    mainLogo.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            sidebar.classList.toggle('active-mobile');
            sidebar.classList.remove('collapsed');
        } else {
            sidebar.classList.toggle('collapsed');
            sidebar.classList.remove('active-mobile');
        }
    });

    document.querySelector('.nav-menu').addEventListener('click', (e) => {
        const btn = e.target.closest('.nav-item');
        if (btn) {
            navigateTo(btn.getAttribute('data-section'));
            if (window.innerWidth <= 768) sidebar.classList.remove('active-mobile');
        }
    });

    // ── Home ──────────────────────────────────
    document.getElementById('go-home').addEventListener('click', loadDashboard);
}

document.addEventListener('DOMContentLoaded', init);