
import { UI } from './ui.js';
import { loadDashboard, navigateTo } from './router.js';
import { initCalculadora } from './calculadora.js';
import { initHistorialPanel } from './historial.js';
 
const sidebar    = document.getElementById('sidebar');
const mainLogo   = document.getElementById('main-logo');
const appContent = document.getElementById('app-content');
 
function init() {
    document.querySelector('.nav-menu').innerHTML = UI.renderSidebarMenu();
    loadDashboard();
    setupEventListeners();
    initCalculadora();
    initHistorialPanel();
    initDarkMode();
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
 
// ── Dark mode ─────────────────────────────────
function initDarkMode() {
    const btn = document.createElement('div');
    btn.id        = 'toggle-dark';
    btn.className = 'floating-icon';
    btn.style.cssText = 'top: 18px; right: 72px;';
    btn.title     = 'Cambiar tema';
    document.body.appendChild(btn);
 
    // Aplicar preferencia guardada (o preferencia del sistema)
    const saved = localStorage.getItem('theme')
        ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    applyTheme(saved);
 
    btn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        applyTheme(current === 'dark' ? 'light' : 'dark');
    });
 
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        btn.textContent = theme === 'dark' ? '☀️' : '🌙';
        btn.title = theme === 'dark' ? 'Modo claro' : 'Modo oscuro';
    }
}
 
document.addEventListener('DOMContentLoaded', init);