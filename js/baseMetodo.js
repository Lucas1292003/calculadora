import { addEntrada } from './historial.js';

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
                <div class="card-footer">
                    <button id="${idPrefix}-save-btn" class="btn-guardar" disabled>
                        💾 Guardar resultado
                    </button>
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

export function graficarFuncion(canvasId, placeholderId, f, xMin, xMax, raiz = null) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    document.getElementById(placeholderId).style.display = 'none';

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
                x: { ticks: { maxTicksLimit: 8 }, grid: { color: '#e2e8f0' } },
                y: { grid: { color: '#e2e8f0' }, ticks: { maxTicksLimit: 6 } }
            }
        }
    });
}

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

    const saveBtn = document.getElementById(`${idPrefix}-save-btn`);
    if (!saveBtn) return;

    saveBtn.disabled    = false;
    saveBtn.textContent = '💾 Guardar resultado';
    saveBtn.replaceWith(saveBtn.cloneNode(true));
    const freshBtn = document.getElementById(`${idPrefix}-save-btn`);

    freshBtn.addEventListener('click', () => {
        const inputs = {};
        document.querySelectorAll('.inputs-card .form-group').forEach(group => {
            const label = group.querySelector('label')?.textContent?.trim().replace(/\s+/g, ' ');
            const input = group.querySelector('input');
            if (label && input) inputs[label] = input.value.trim() || input.placeholder;
        });

        const metodo = document.getElementById('view-title')?.innerText || 'Método desconocido';
        addEntrada({ metodo, inputs, raiz: raiz.toFixed(8), iteraciones });

        freshBtn.textContent = '✅ Guardado';
        freshBtn.disabled    = true;
        setTimeout(() => {
            freshBtn.textContent = '💾 Guardar resultado';
            freshBtn.disabled    = false;
        }, 2500);
    });
}

// ─── Integración ──────────────────────────────

export function mostrarResultadoIntegracion(idPrefix, integral, n, h) {
    document.getElementById(`${idPrefix}-resultado`).innerHTML = `
        <div class="resultado-destacado">
            <div class="resultado-valor">${integral.toFixed(8)}</div>
            <div class="resultado-label">Integral aproximada</div>
        </div>
        <div class="resultado-meta">
            <span>📐 n = ${n} subintervalos</span>
            <span style="margin-left:1rem">h = ${h.toFixed(6)}</span>
        </div>
    `;

    const saveBtn = document.getElementById(`${idPrefix}-save-btn`);
    if (!saveBtn) return;

    saveBtn.disabled    = false;
    saveBtn.textContent = '💾 Guardar resultado';
    saveBtn.replaceWith(saveBtn.cloneNode(true));
    const freshBtn = document.getElementById(`${idPrefix}-save-btn`);

    freshBtn.addEventListener('click', () => {
        const inputs = {};
        document.querySelectorAll('.inputs-card .form-group').forEach(group => {
            const label = group.querySelector('label')?.textContent?.trim().replace(/\s+/g, ' ');
            const input = group.querySelector('input');
            if (label && input) inputs[label] = input.value.trim() || input.placeholder;
        });

        const metodo = document.getElementById('view-title')?.innerText || 'Método desconocido';
        addEntrada({ metodo, inputs, raiz: integral.toFixed(8), iteraciones: n });

        freshBtn.textContent = '✅ Guardado';
        freshBtn.disabled    = true;
        setTimeout(() => {
            freshBtn.textContent = '💾 Guardar resultado';
            freshBtn.disabled    = false;
        }, 2500);
    });
}

export function graficarIntegracion(canvasId, placeholderId, f, a, b, n) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    document.getElementById(placeholderId).style.display = 'none';
    if (canvas._chartInstance) canvas._chartInstance.destroy();

    const puntos = 300;
    const margen = Math.max((b - a) * 0.2, 0.5);
    const xMin   = a - margen;
    const xMax   = b + margen;
    const paso   = (xMax - xMin) / puntos;

    const labels    = [];
    const curvaData = [];
    const areaData  = [];

    for (let i = 0; i <= puntos; i++) {
        const x = xMin + i * paso;
        labels.push(x.toFixed(4));
        let y;
        try { y = f(x); } catch { y = null; }
        curvaData.push(y);
        areaData.push(x >= a - 1e-9 && x <= b + 1e-9 ? y : null);
    }

    canvas._chartInstance = new Chart(canvas, {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: 'Área ∫f(x)dx',
                    data: areaData,
                    borderColor: 'transparent',
                    backgroundColor: 'rgba(37, 99, 235, 0.12)',
                    fill: 'origin',
                    pointRadius: 0,
                    tension: 0.3,
                },
                {
                    label: 'f(x)',
                    data: curvaData,
                    borderColor: '#2563eb',
                    borderWidth: 2.5,
                    pointRadius: 0,
                    tension: 0.3,
                    fill: false,
                },
            ]
        },
        options: {
            responsive: true,
            animation: { duration: 400 },
            plugins: {
                legend: { position: 'top' },
                tooltip: { mode: 'index', intersect: false }
            },
            scales: {
                x: { ticks: { maxTicksLimit: 8 }, grid: { color: '#e2e8f0' } },
                y: { grid: { color: '#e2e8f0' }, ticks: { maxTicksLimit: 6 } }
            }
        }
    });
}