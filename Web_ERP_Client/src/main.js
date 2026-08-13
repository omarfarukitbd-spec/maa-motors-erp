import { loginWithPin, loginWithGoogle, logout, checkAutoAuth } from './auth/auth.js';
import { initNetworkStatus } from './navigation/router.js';
import { initOmnisearch } from './search/omnisearch.js';

// Setup App Global Interface
window.app = {
    loginWithPin,
    loginWithGoogle,
    logout,
    toggleSidebar() {
        const sidebar = document.getElementById('app-sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        if (sidebar) sidebar.classList.toggle('open');
        if (overlay) overlay.classList.toggle('hidden');
    },
    toggleSidebarCollapse() {
        const sidebar = document.getElementById('app-sidebar');
        if (sidebar) sidebar.classList.toggle('collapsed');
    },
    toggleCalculator() {
        const widget = document.getElementById('calculator-widget');
        if (widget) widget.classList.toggle('hidden');
    }
};

// Setup Calculator Logic
function initCalculator() {
    const buttons = [
        'C', 'CE', '%', '/',
        '7', '8', '9', '*',
        '4', '5', '6', '-',
        '1', '2', '3', '+',
        '0', '00', '.', '='
    ];

    const btnContainer = document.getElementById('calc-buttons');
    const display = document.getElementById('calc-display');
    const history = document.getElementById('calc-history');

    if (!btnContainer || !display) return;

    let currentInput = '0';
    let prevVal = '';
    let operator = null;
    let resetNext = false;

    btnContainer.innerHTML = '';
    buttons.forEach(b => {
        const btn = document.createElement('button');
        btn.innerText = b;
        let bg = 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700/60';
        if (['+', '-', '*', '/', '='].includes(b)) bg = 'bg-blue-600 hover:bg-blue-500 text-white font-bold border-blue-500/40';
        if (['C', 'CE'].includes(b)) bg = 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30 font-bold';

        btn.className = `${bg} rounded-xl p-2 text-sm font-mono transition-all active:scale-95 border cursor-pointer flex items-center justify-center shadow-sm`;
        btn.onclick = () => handleCalc(b);
        btnContainer.appendChild(btn);
    });

    function handleCalc(val) {
        if (val === 'C') {
            currentInput = '0';
            prevVal = '';
            operator = null;
            if (history) history.innerText = '';
        } else if (val === 'CE') {
            currentInput = '0';
        } else if (['+', '-', '*', '/'].includes(val)) {
            prevVal = currentInput;
            operator = val;
            resetNext = true;
            if (history) history.innerText = `${prevVal} ${operator}`;
        } else if (val === '=') {
            if (operator && prevVal) {
                try {
                    const res = Function(`"use strict"; return (${prevVal} ${operator} ${currentInput})`)();
                    if (history) history.innerText = `${prevVal} ${operator} ${currentInput} =`;
                    currentInput = String(Math.round(res * 100) / 100);
                    operator = null;
                    resetNext = true;
                } catch (e) {
                    console.error(e);
                    currentInput = 'Error';
                }
            }
        } else {
            if (currentInput === '0' || resetNext) {
                currentInput = val;
                resetNext = false;
            } else {
                currentInput += val;
            }
        }
        display.value = currentInput;
    }
}

// Bootstrap App
document.addEventListener('DOMContentLoaded', () => {
    initNetworkStatus();
    initOmnisearch();
    initCalculator();
    checkAutoAuth();
});
