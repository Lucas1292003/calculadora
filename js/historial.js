// ─────────────────────────────────────────────
//  historial.js  –  Historial de cálculos
// ─────────────────────────────────────────────

const KEY       = 'calc-historial-v1';
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
    lista.unshift({ ...data, id: Date.now(), fecha: new Date().toLocaleString('es-AR') });
    if (lista.length > MAX_ITEMS) lista.pop();
    guardarStorage(lista);
    _actualizarLista();
}

export function limpiarHistorial() {
    guardarStorage([]);
    _actualizarLista();
}

// ─── Exportar TXT ─────────────────────────────
export function exportarEntrada(entrada) {
    _descargar(
        `${entrada.metodo.replace(/\s+/g, '_')}_${entrada.id}.txt`,
        _formatearTxt(entrada)
    );
}

export function exportarTodo() {
    const lista = getHistorial();
    if (!lista.length) { alert('El historial está vacío.'); return; }
    const sep = '\n' + '═'.repeat(52) + '\n\n';
    _descargar(
        `historial_calculadora_${Date.now()}.txt`,
        lista.map(_formatearTxt).join(sep)
    );
}

function _formatearTxt(e) {
    const line = '─'.repeat(44);
    let t  = `METODO : ${e.metodo}\n`;
        t += `FECHA  : ${e.fecha}\n`;
        t += line + '\n';
        t += 'PARAMETROS:\n';
    for (const [k, v] of Object.entries(e.inputs ?? {}))
        t += `  ${k}: ${v}\n`;
    t += line + '\n';
    t += 'RESULTADO:\n';
    t += `  Resultado   : ${e.raiz}\n`;
    t += `  Iteraciones : ${e.iteraciones}\n`;
    return t;
}

// ─── Exportar CSV ─────────────────────────────
export function exportarCSV() {
    const lista = getHistorial();
    if (!lista.length) { alert('El historial está vacío.'); return; }

    const filas = [
        ['Metodo', 'Fecha', 'Resultado', 'Iteraciones / n', 'Parametros']
    ];

    lista.forEach(e => {
        const params = Object.entries(e.inputs ?? {})
            .map(([k, v]) => `${k}: ${v}`)
            .join(' | ');
        filas.push([e.metodo, e.fecha, e.raiz, e.iteraciones, params]);
    });

    // Fixes para Excel en español (Argentina/España):
    // 1. \uFEFF  = BOM UTF-8 → Excel reconoce el encoding y no garbleea tildes/ñ
    // 2. sep=;   = le dice explícitamente a Excel que el separador es ";"
    // 3. ";"     = separador punto y coma (en es-AR la coma es separador decimal)
    // 4. \r\n    = salto de línea Windows para máxima compatibilidad
    const SEP  = ';';
    const CRLF = '\r\n';
    const escapar = (c) => `"${String(c).replace(/"/g, '""')}"`;

    const csv = '\uFEFF'
        + 'sep=;' + CRLF
        + filas.map(fila => fila.map(escapar).join(SEP)).join(CRLF);

    _descargar(
        `historial_calculadora_${Date.now()}.csv`,
        csv,
        'text/csv;charset=utf-8'
    );
}

// ─── Helper descarga ──────────────────────────
function _descargar(nombre, contenido, tipo = 'text/plain;charset=utf-8') {
    const url = URL.createObjectURL(new Blob([contenido], { type: tipo }));
    const a   = Object.assign(document.createElement('a'), { href: url, download: nombre });
    a.click();
    URL.revokeObjectURL(url);
}

// ─── Panel lateral ────────────────────────────
export function initHistorialPanel() {
    const fab = document.createElement('div');
    fab.id = 'open-historial';
    fab.className = 'floating-icon';
    fab.style.cssText = 'bottom: 80px; right: 20px;';
    fab.title = 'Historial de cálculos';
    fab.textContent = '📋';
    document.body.appendChild(fab);

    const overlay = document.createElement('div');
    overlay.id = 'hist-overlay';
    overlay.className = 'hist-overlay';
    document.body.appendChild(overlay);

    const panel = document.createElement('aside');
    panel.id = 'hist-panel';
    panel.className = 'hist-panel';
    panel.innerHTML = `
        <div class="hist-header">
            <span>📋 Historial</span>
            <button class="hist-close-btn" id="hist-close">&times;</button>
        </div>
        <div class="hist-toolbar">
            <button class="hist-btn hist-btn-secondary" id="hist-export-txt" title="Exportar todo como .txt">⬇ TXT</button>
            <button class="hist-btn hist-btn-secondary" id="hist-export-csv" title="Exportar todo como .csv (Excel)">⬇ CSV</button>
            <button class="hist-btn hist-btn-danger"    id="hist-clear"      title="Limpiar historial">🗑</button>
        </div>
        <div id="hist-lista" class="hist-lista"></div>
    `;
    document.body.appendChild(panel);

    fab    .addEventListener('click', () => _togglePanel(true));
    overlay.addEventListener('click', () => _togglePanel(false));
    panel.querySelector('#hist-close')     .addEventListener('click', () => _togglePanel(false));
    panel.querySelector('#hist-export-txt').addEventListener('click', exportarTodo);
    panel.querySelector('#hist-export-csv').addEventListener('click', exportarCSV);
    panel.querySelector('#hist-clear').addEventListener('click', () => {
        if (confirm('¿Limpiar todo el historial?')) limpiarHistorial();
    });

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
                <button class="hist-dl-btn" data-hist-id="${e.id}" title="Descargar como .txt">⬇</button>
            </div>
            <div class="hist-item-result">
                Resultado: <strong>${e.raiz}</strong>
                <span class="hist-iter-badge">${e.iteraciones} iter.</span>
            </div>
            <div class="hist-item-inputs">
                ${Object.entries(e.inputs ?? {}).map(([k, v]) => `<span><em>${k}:</em> ${v}</span>`).join('')}
            </div>
            <div class="hist-fecha">${e.fecha}</div>
        </div>
    `).join('');
}