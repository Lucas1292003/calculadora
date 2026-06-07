import { addEntrada } from './historial.js';
 
export function renderLayout(idPrefix, inputsHTML) {
    return `
        <div class="metodo-grid">
 
            <div class="metodo-card inputs-card">
                <div class="card-header">⚙️ Parámetros</div>
                <div class="card-body">
                    ${inputsHTML}
                    
                    <div id="${idPrefix}-preview-container" style="margin: 15px 0; padding: 12px; background: var(--bg-main); border: 1px solid var(--border); border-radius: 8px; display: none; flex-direction: column; gap: 8px; text-align: center;"></div>
                    
                    <button id="${idPrefix}-btn" class="btn-calcular">Calcular</button>
                </div>
            </div>
 
            <div class="metodo-card resultado-card">
                <div class="card-header">🎯 Resultado</div>
                <div class="card-body" id="${idPrefix}-resultado">
                    <p class="placeholder">Ingresá los parámetros y presioná Calcular.</p>
                </div>
                <div class="card-footer">
                    <button id="${idPrefix}-save-btn" class="btn-guardar" disabled>
                        💾 Guardar resultado
                    </button>
                </div>
            </div>
 
            <div class="metodo-card grafico-card">
                <div class="card-header">📈 Gráfico</div>
                <div class="card-body grafico-body">
                    <canvas id="${idPrefix}-chart"></canvas>
                    <p class="placeholder" id="${idPrefix}-chart-placeholder">El gráfico aparecerá luego de calcular.</p>
                </div>
            </div>
 
            <div class="metodo-card tabla-card">
                <div class="card-header">🔁 Iteraciones</div>
                <div class="card-body" id="${idPrefix}-tabla">
                    <p class="placeholder">La tabla aparecerá luego de calcular.</p>
                </div>
            </div>
 
        </div>
    `;
}

export function graficarFuncion(canvasId, placeholderId, f, xMin, xMax, raiz = null) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
 
    document.getElementById(placeholderId).style.display = 'none';
 
    // Destruir gráfico anterior si existe
    if (canvas._chartInstance) canvas._chartInstance.destroy();
 
    const puntos = 200;
    const paso   = (xMax - xMin) / puntos;
    const labels = [];
    const data   = [];
 
    for (let i = 0; i <= puntos; i++) {
        const x = xMin + i * paso;
        labels.push(x.toFixed(3));
        try { data.push(f(x)); } catch { data.push(null); }
    }
 
    const datasets = [
        {
            label: 'f(x)',
            data,
            borderColor: '#2563eb',
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.3,
            fill: false,
        }
    ];
 
    // Marcar la raíz si existe
    if (raiz !== null) {
        datasets.push({
            label: 'Raíz',
            data: labels.map(l => Math.abs(parseFloat(l) - raiz) < paso ? 0 : null),
            borderColor: '#dc2626',
            backgroundColor: '#dc2626',
            pointRadius: 6,
            pointStyle: 'circle',
            showLine: false,
        });
    }
 
    canvas._chartInstance = new Chart(canvas, {
        type: 'line',
        data: { labels, datasets },
        options: {
            responsive: true,
            animation: { duration: 500 },
            plugins: {
                legend: { position: 'top' },
                tooltip: { mode: 'index', intersect: false }
            },
            scales: {
                x: {
                    ticks: { maxTicksLimit: 8 },
                    grid: { color: '#e2e8f0' }
                },
                y: {
                    grid: { color: '#e2e8f0' },
                    ticks: { maxTicksLimit: 6 }
                }
            }
        }
    });
}
 
export function mostrarResultado(idPrefix, raiz, iteraciones) {
    // ── Renderizar resultado ──────────────────
    document.getElementById(`${idPrefix}-resultado`).innerHTML = `
        <div class="resultado-destacado">
            <div class="resultado-valor">${raiz.toFixed(8)}</div>
            <div class="resultado-label">Raíz aproximada</div>
        </div>
        <div class="resultado-meta">
            <span>🔁 ${iteraciones} iteraciones</span>
        </div>
    `;
 
    // ── Activar botón Guardar ─────────────────
    const saveBtn = document.getElementById(`${idPrefix}-save-btn`);
    if (!saveBtn) return;
 
    saveBtn.disabled    = false;
    saveBtn.textContent = '💾 Guardar resultado';
 
    // Reemplazar handler anterior (evita duplicados si se calcula varias veces)
    saveBtn.replaceWith(saveBtn.cloneNode(true));
    const freshBtn = document.getElementById(`${idPrefix}-save-btn`);
 
    freshBtn.addEventListener('click', () => {
        // Recolectar inputs desde el DOM del card de parámetros
        const inputs = {};
        document.querySelectorAll('.inputs-card .form-group').forEach(group => {
            const label = group.querySelector('label')?.textContent?.trim().replace(/\s+/g, ' ');
            const input = group.querySelector('input');
            if (label && input) {
                inputs[label] = input.value.trim() || input.placeholder;
            }
        });
 
        const metodo = document.getElementById('view-title')?.innerText || 'Método desconocido';
 
        addEntrada({
            metodo,
            inputs,
            raiz:        raiz.toFixed(8),
            iteraciones,
        });
 
        freshBtn.textContent = '✅ Guardado';
        freshBtn.disabled    = true;
 
        // Restaurar el botón después de un momento
        setTimeout(() => {
            freshBtn.textContent = '💾 Guardar resultado';
            freshBtn.disabled    = false;
        }, 2500);
    });
}
 
export function getVal(){
    document.getElementById(`${idPrefix}-resultado`).innerHTML = `
        <div class="resultado-destacado">
            <div class="resultado-valor">${raiz.toFixed(8)}</div>
            <div class="resultado-label">Raíz aproximada</div>
        </div>
        <div class="resultado-meta">
            <span>🔁 ${iteraciones} iteraciones</span>
        </div>
    `;
}