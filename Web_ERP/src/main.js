/**
 * --- MAA MOTORS ERP (Modular Main) ---
 * High-level initialization and module orchestration.
 */
import './style.css';
import { initAuthListener, login, loginWithGoogle, logout } from './auth/auth-handler.js';
import { navigate, toggleSidebarCollapse, initOnlineStatus } from './navigation/router.js';
import { initSearch } from './search/global-search.js';
import { initDatePickers, startDateObserver } from './utils/date-logic/date-picker.js';
import { handleCalc, initCalculatorKeyboard, initDraggableCalculator } from './ui/calculator.js';
import { initOmnisearch, initNetworkSyncBadge, initGlobalButtonInteractions, initPermissionObserver } from './utils.js';
import { initCustomerInspector } from './customer_inspector/index.js';
import './banking/banking-ui.js';

// -------------------------------------------------------------------------
// APP STARTUP
// -------------------------------------------------------------------------

/**
 * Global App Controller
 */
window.app = {
    login,
    loginWithGoogle,
    logout,
    toggleSidebar: () => document.getElementById('app-sidebar')?.classList.toggle('open'),
    toggleSidebarCollapse,
    toggleCalculator: () => document.getElementById('calculator-widget')?.classList.toggle('hidden')
};

// Start Observers & Listeners
document.addEventListener('DOMContentLoaded', () => {
    // 0. Public Share Link Route Check
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('view') === 'public-stmt' && urlParams.get('id')) {
        (async () => {
            const m = await import('./statement-print.js');
            m.renderPublicStatementView(urlParams.get('id'));
        })();
        return;
    }
    if (urlParams.get('view') === 'public-memo' && urlParams.get('id')) {
        (async () => {
            const m = await import('./utils/receipt-engine.js');
            m.renderPublicMemoView(urlParams.get('id'));
        })();
        return;
    }

    // 1. Initialize Auth System
    initAuthListener();

    // 2. Initialize Search & Omnisearch Command Palette
    initSearch();
    initOmnisearch();
    initCustomerInspector();

    // 3. Initialize Date Pickers & Real-time Observer
    initDatePickers();
    startDateObserver();

    // 4. Initialize Network Status Badge, Touch Haptic & Permission Engine
    initNetworkSyncBadge();
    initGlobalButtonInteractions();
    initPermissionObserver();


    // 5. Setup Sidebar State
    if (localStorage.getItem('sidebarCollapsed') === 'true') {
        document.getElementById('app-sidebar')?.classList.add('collapsed');
    }

    // 6. Build Calculator Buttons
    const calcBtns = [
        { label: 'MC', class: 'bg-slate-800 text-slate-400 text-[11px] font-bold hover:bg-slate-700' },
        { label: 'MR', class: 'bg-slate-800 text-slate-400 text-[11px] font-bold hover:bg-slate-700' },
        { label: 'M+', class: 'bg-slate-800 text-slate-400 text-[11px] font-bold hover:bg-slate-700' },
        { label: 'M-', class: 'bg-slate-800 text-slate-400 text-[11px] font-bold hover:bg-slate-700' },
        
        { label: 'C', class: 'bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20' },
        { label: '⌫', class: 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700/50' },
        { label: '%', class: 'bg-slate-800 text-blue-400 hover:bg-blue-600 hover:text-white font-black border border-slate-700/50' },
        { label: '/', class: 'bg-slate-800 text-blue-400 hover:bg-blue-600 hover:text-white font-black border border-slate-700/50' },
        
        { label: '7', class: 'bg-slate-800/60 text-white hover:bg-slate-700 border border-slate-700/30' },
        { label: '8', class: 'bg-slate-800/60 text-white hover:bg-slate-700 border border-slate-700/30' },
        { label: '9', class: 'bg-slate-800/60 text-white hover:bg-slate-700 border border-slate-700/30' },
        { label: '*', class: 'bg-slate-800 text-blue-400 hover:bg-blue-600 hover:text-white font-black border border-slate-700/50' },
        
        { label: '4', class: 'bg-slate-800/60 text-white hover:bg-slate-700 border border-slate-700/30' },
        { label: '5', class: 'bg-slate-800/60 text-white hover:bg-slate-700 border border-slate-700/30' },
        { label: '6', class: 'bg-slate-800/60 text-white hover:bg-slate-700 border border-slate-700/30' },
        { label: '-', class: 'bg-slate-800 text-blue-400 hover:bg-blue-600 hover:text-white font-black text-xl border border-slate-700/50' },
        
        { label: '1', class: 'bg-slate-800/60 text-white hover:bg-slate-700 border border-slate-700/30' },
        { label: '2', class: 'bg-slate-800/60 text-white hover:bg-slate-700 border border-slate-700/30' },
        { label: '3', class: 'bg-slate-800/60 text-white hover:bg-slate-700 border border-slate-700/30' },
        { label: '+', class: 'bg-slate-800 text-blue-400 hover:bg-blue-600 hover:text-white font-black text-xl border border-slate-700/50' },
        
        { label: '0', class: 'bg-slate-800/60 text-white hover:bg-slate-700 border border-slate-700/30' },
        { label: '00', class: 'bg-slate-800/60 text-white hover:bg-slate-700 border border-slate-700/30 text-sm' },
        { label: '000', class: 'bg-slate-800/60 text-white hover:bg-slate-700 border border-slate-700/30 text-[11px]' },
        { label: '.', class: 'bg-slate-800/60 text-white hover:bg-slate-700 font-black border border-slate-700/30 text-xl pb-1' },
        
        { label: '=', class: 'col-span-4 bg-blue-600 text-white hover:bg-blue-500 font-black shadow-lg shadow-blue-500/30 border border-blue-500' }
    ];
    const container = document.getElementById('calc-buttons');
    if(container) {
        container.innerHTML = calcBtns.map(b =>
            `<button onclick="window.handleCalc('${b.label}')" class="h-full min-h-[36px] rounded-xl text-sm sm:text-base transition-all active:scale-95 ${b.class} flex items-center justify-center">${b.label}</button>`
        ).join('');
    }

    // 7. Initialize Calculator Keyboard
    initCalculatorKeyboard();
    initDraggableCalculator();
});

// Re-export for sub-modules
export { navigate };
