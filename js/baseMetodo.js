// ─────────────────────────────────────────────
//  baseMetodo.js  –  Layout y utilidades base
//  Todos los métodos usan renderLayout() y
//  graficarFuncion() desde acá.
// ─────────────────────────────────────────────

/**
 * Genera el HTML del layout en grilla para cualquier método.
 * @param {string} idPrefix  - prefijo único del método (ej: 'bis')
 * @param {string} inputsHTML - HTML interno de la tarjeta de inputs
 */
export function renderLayout(idPrefix, inputsHTML) {
    return `
        <div class="metodo-grid">

            <!-- Tarjeta: Inputs -->
            <div class="metodo-card inputs-card">
                <div class="card-header">⚙️ Parámetros</div>
                <div class="card-body">
                    ${inputsHTML}
                    <button id="${idPrefix}-btn" class="btn-calcular">Calcular</button>
                </div>
            </div>

            <!-- Tarjeta: Resultado -->
            <div class="metodo-card resultado-card">
                <div class="card-header">🎯 Resultado</div>
                <div class="card-body" id="${idPrefix}-resultado">
                    <p class="placeholder">Ingresá los parámetros y presioná Calcular.</p>
                </div>
            </div>

            <!-- Tarjeta: Gráfico -->
            <div class="metodo-card grafico-card">
                <div class="card-header">📈 Gráfico</div>
                <div class="card-body grafico-body">
                    <canvas id="${idPrefix}-chart"></canvas>
                    <p class="placeholder" id="${idPrefix}-chart-placeholder">El gráfico aparecerá luego de calcular.</p>
                </div>
            </div>

            <!-- Tarjeta: Iteraciones -->
            <div class="metodo-card tabla-card">
                <div class="card-header">🔁 Iteraciones</div>
                <div class="card-body" id="${idPrefix}-tabla">
                    <p class="placeholder">La tabla aparecerá luego de calcular.</p>
                </div>
            </div>

        </div>
    `;
}

/**
 * Dibuja la función en el canvas usando Chart.js.
 * @param {string} canvasId   - id del canvas
 * @param {string} placeholderId - id del placeholder a ocultar
 * @param {Function} f        - función evaluada f(x)
 * @param {number} xMin       - inicio del eje x
 * @param {number} xMax       - fin del eje x
 * @param {number|null} raiz  - valor de la raíz para marcarla (opcional)
 */
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

/**
 * Renderiza el resultado destacado.
 * @param {string} idPrefix
 * @param {number} raiz
 * @param {number} iteraciones
 */
export function mostrarResultado(idPrefix, raiz, iteraciones) {
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