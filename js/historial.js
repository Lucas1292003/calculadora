// ─────────────────────────────────────────────
//  historial.js  –  Historial de cálculos
//  Persiste en localStorage, exporta a .txt
//  y renderiza el panel lateral deslizable.
// ─────────────────────────────────────────────
 
const KEY      = 'calc-historial-v1';
const MAX_ITEMS = 30;
 
// ─── Storage ──────────────────────────────────
export function getHistorial() {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
    catch { return []; }
}
 
function guardarStorage(lista) {
    localStorage.setItem(KEY, JSON.stringify(lista));
}
 
export function addEntrada(data) {
    const lista = getHistorial();
    lista.unshift({
        ...data,
        id:    Date.now(),
        fecha: new Date().toLocaleString('es-AR'),
    });
    if (lista.length > MAX_ITEMS) lista.pop();
    guardarStorage(lista);
    _actualizarLista();
}
 
export function limpiarHistorial() {
    guardarStorage([]);
    _actualizarLista();
}
 
// ─── Exportar ─────────────────────────────────
export function exportarEntrada(entrada) {
    _descargar(
        `${entrada.metodo.replace(/\s+/g, '_')}_${entrada.id}.txt`,
        _formatear(entrada)
    );
}
 
export function exportarTodo() {
    const lista = getHistorial();
    if (!lista.length) { alert('El historial está vacío.'); return; }
    const sep = '\n' + '═'.repeat(52) + '\n\n';
    _descargar(
        `historial_calculadora_${Date.now()}.txt`,
        lista.map(_formatear).join(sep)
    );
}
 
function _formatear(e) {
    const line = '─'.repeat(44);
    let t  = `MÉTODO : ${e.metodo}\n`;
        t += `FECHA  : ${e.fecha}\n`;
        t += line + '\n';
        t += 'PARÁMETROS:\n';
 
    for (const [k, v] of Object.entries(e.inputs ?? {}))
        t += `  ${k}: ${v}\n`;
 
    t += line + '\n';
    t += 'RESULTADO:\n';
    t += `  Raíz aproximada : ${e.raiz}\n`;
    t += `  Iteraciones     : ${e.iteraciones}\n`;
    return t;
}
 
function _descargar(nombre, contenido) {
    const url = URL.createObjectURL(
        new Blob([contenido], { type: 'text/plain;charset=utf-8' })
    );
    const a = Object.assign(document.createElement('a'), { href: url, download: nombre });
    a.click();
    URL.revokeObjectURL(url);
}
 
// ─── Panel lateral ────────────────────────────
export function initHistorialPanel() {
    // Botón flotante
    const fab = document.createElement('div');
    fab.id        = 'open-historial';
    fab.className = 'floating-icon';
    fab.style.cssText = 'bottom: 80px; right: 20px;';
    fab.title     = 'Historial de cálculos';
    fab.textContent = '📋';
    document.body.appendChild(fab);
 
    // Overlay oscuro
    const overlay = document.createElement('div');
    overlay.id        = 'hist-overlay';
    overlay.className = 'hist-overlay';
    document.body.appendChild(overlay);
 
    // Panel lateral
    const panel = document.createElement('aside');
    panel.id        = 'hist-panel';
    panel.className = 'hist-panel';
    panel.innerHTML = `
        <div class="hist-header">
            <span>📋 Historial</span>
            <button class="hist-close-btn" id="hist-close">&times;</button>
        </div>
        <div class="hist-toolbar">
            <button class="hist-btn hist-btn-secondary" id="hist-export-all">⬇ Exportar todo</button>
            <button class="hist-btn hist-btn-danger"    id="hist-clear" title="Limpiar historial">🗑</button>
        </div>
        <div id="hist-lista" class="hist-lista"></div>
    `;
    document.body.appendChild(panel);
 
    // Eventos del panel
    fab    .addEventListener('click', () => _togglePanel(true));
    overlay.addEventListener('click', () => _togglePanel(false));
    panel.querySelector('#hist-close')     .addEventListener('click', () => _togglePanel(false));
    panel.querySelector('#hist-export-all').addEventListener('click', exportarTodo);
    panel.querySelector('#hist-clear').addEventListener('click', () => {
        if (confirm('¿Limpiar todo el historial?')) limpiarHistorial();
    });
 
    // Delegación: botón descargar en cada ítem
    panel.querySelector('#hist-lista').addEventListener('click', (e) => {
        const btn = e.target.closest('[data-hist-id]');
        if (!btn) return;
        const entry = getHistorial().find(x => x.id === Number(btn.dataset.histId));
        if (entry) exportarEntrada(entry);
    });
 
    _actualizarLista();
}
 
function _togglePanel(open) {
    document.getElementById('hist-panel')  ?.classList.toggle('open', open);
    document.getElementById('hist-overlay')?.classList.toggle('open', open);
}
 
function _actualizarLista() {
    const el = document.getElementById('hist-lista');
    if (!el) return;
 
    const lista = getHistorial();
 
    if (!lista.length) {
        el.innerHTML = '<p class="hist-empty">Todavía no guardaste ningún cálculo.</p>';
        return;
    }
 
    el.innerHTML = lista.map(e => `
        <div class="hist-item">
            <div class="hist-item-top">
                <span class="hist-badge">${e.metodo}</span>
                <button class="hist-dl-btn" data-hist-id="${e.id}" title="Descargar este resultado">⬇</button>
            </div>
            <div class="hist-item-result">
                Raíz: <strong>${e.raiz}</strong>
                <span class="hist-iter-badge">${e.iteraciones} iter.</span>
            </div>
            <div class="hist-item-inputs">
                ${Object.entries(e.inputs ?? {})
                    .map(([k, v]) => `<span><em>${k}:</em> ${v}</span>`)
                    .join('')}
            </div>
            <div class="hist-fecha">${e.fecha}</div>
        </div>
    `).join('');
}