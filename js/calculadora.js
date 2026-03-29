// ─────────────────────────────────────────────
//  calculadora.js  –  Calculadora Básica
//  Genera el modal dinámicamente, usa math.js
//  y detecta entrada desde teclado.
// ─────────────────────────────────────────────

function crearModal() {
    const modal = document.createElement('div');
    modal.id = 'calc-modal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <span>Calculadora Básica</span>
                <span class="close-modal" id="close-calc">&times;</span>
            </div>
            <div class="calculator">
                <input type="text" id="calc-display" readonly placeholder="0">
                <div class="calc-buttons">
                    <!-- Botones básicos -->
                    <button onclick="appendCalc('7')">7</button>
                    <button onclick="appendCalc('8')">8</button>
                    <button onclick="appendCalc('9')">9</button>
                    <button class="op" onclick="appendCalc('/')">÷</button>

                    <button onclick="appendCalc('4')">4</button>
                    <button onclick="appendCalc('5')">5</button>
                    <button onclick="appendCalc('6')">6</button>
                    <button class="op" onclick="appendCalc('*')">×</button>

                    <button onclick="appendCalc('1')">1</button>
                    <button onclick="appendCalc('2')">2</button>
                    <button onclick="appendCalc('3')">3</button>
                    <button class="op" onclick="appendCalc('-')">−</button>

                    <button onclick="appendCalc('0')">0</button>
                    <button onclick="appendCalc('.')">.</button>
                    <button class="eq" onclick="calculateResult()">=</button>
                    <button class="op" onclick="appendCalc('+')">+</button>

                    <button class="del" onclick="deleteLast()">⌫</button>
                    <button class="cls" onclick="clearCalc()" style="grid-column: span 2;">C</button>
                    <button class="toggle-adv" id="toggle-adv-btn" onclick="toggleAvanzado()">∨</button>
                </div>

                <!-- Botones avanzados (ocultos por defecto) -->
                <div class="calc-buttons calc-avanzado" id="calc-avanzado" style="display:none; margin-top: 8px;">
                    <button class="fn" onclick="appendCalc('sqrt(')">√</button>
                    <button class="fn" onclick="appendCalc('^')">xʸ</button>
                    <button class="fn" onclick="appendCalc('(')">(</button>
                    <button class="fn" onclick="appendCalc(')')">)</button>

                    <button class="fn" onclick="appendCalc('sin(')">sin</button>
                    <button class="fn" onclick="appendCalc('cos(')">cos</button>
                    <button class="fn" onclick="appendCalc('tan(')">tan</button>
                    <button class="fn" onclick="appendCalc('pi')">π</button>

                    <button class="fn" onclick="appendCalc('log(')">log</button>
                    <button class="fn" onclick="appendCalc('exp(')">eˣ</button>
                    <button class="fn" onclick="appendCalc('abs(')">|x|</button>
                    <button class="fn" onclick="appendCalc('e')">e</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

export function initCalculadora() {
    crearModal();

    const modal   = document.getElementById('calc-modal');
    const btnOpen = document.getElementById('open-calc');
    const btnClose = document.getElementById('close-calc');

    // ── Abrir / cerrar modal ──────────────────
    btnOpen?.addEventListener('click', () => {
        modal.classList.add('active');
    });

    btnClose?.addEventListener('click', closeModal);

    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // ── Teclado ───────────────────────────────
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;

        if (e.key >= '0' && e.key <= '9')        { appendCalc(e.key); return; }
        if (['+', '-', '*', '/'].includes(e.key)) { appendCalc(e.key); return; }
        if (e.key === '.')                         { appendCalc('.');   return; }
        if (e.key === '(' || e.key === ')')        { appendCalc(e.key); return; }
        if (e.key === '^')                         { appendCalc('^');   return; }
        if (e.key === 'Enter')                     { calculateResult(); return; }
        if (e.key === 'Backspace')                 { deleteLast();      return; }
        if (e.key === 'Escape')                    { closeModal();      return; }
    });

    // ── Helpers ───────────────────────────────
    function closeModal() {
        modal.classList.remove('active');
    }

    function getDisplay() {
        return document.getElementById('calc-display');
    }

    // ── Funciones globales (usadas por los onclick) ──
    window.appendCalc = (val) => {
        const d = getDisplay();
        if (d.value === 'Error') d.value = '';
        d.value += val;
    };

    window.clearCalc = () => {
        getDisplay().value = '';
    };

    window.deleteLast = () => {
        const d = getDisplay();
        d.value = d.value.slice(0, -1);
    };

    window.calculateResult = () => {
        const d = getDisplay();
        try {
            d.value = math.evaluate(d.value);
        } catch {
            d.value = 'Error';
        }
    };

    window.toggleAvanzado = () => {
        const panel = document.getElementById('calc-avanzado');
        const btn   = document.getElementById('toggle-adv-btn');
        const visible = panel.style.display !== 'none';
        panel.style.display = visible ? 'none' : 'grid';
        btn.textContent = visible ? '∨' : '∧';
    };
}