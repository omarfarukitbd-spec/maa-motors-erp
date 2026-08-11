import { getStoredSession, performLogin, clearSession, ensureAuth } from './auth.js';
import { 
    renderLoginView, 
    renderDashboardView, 
    renderTodayCollectionView,
    renderCustomerDirectoryView,
    filterDirectoryList,
    handleOmniSearch, 
    loadAndRenderCustomerLedger, 
    applyDatePreset, 
    triggerPrintCurrentStatement 
} from './client-app.js';
import { db } from './firebase-config.js';

let currentSession = null;
let currentTab = 'search';

async function initApp() {
    await ensureAuth();

    const root = document.getElementById('app-root');
    const bottomNav = document.getElementById('bottom-nav');
    const userBadge = document.getElementById('user-badge');

    currentSession = getStoredSession();

    if (!currentSession) {
        if (bottomNav) bottomNav.classList.add('hidden');
        if (userBadge) userBadge.innerHTML = '';
        renderLoginView(root);
        return;
    }

    // Authenticated Session
    if (bottomNav) bottomNav.classList.remove('hidden');
    if (userBadge) {
        userBadge.innerHTML = `
            <span class="px-2.5 py-1 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-sky-400 flex items-center gap-1.5 shadow-md">
                <i class="${currentSession.role === 'Boss' ? 'fa-solid fa-crown text-amber-400' : 'fa-solid fa-user-check text-emerald-400'}"></i>
                <span class="truncate max-w-[100px]">${currentSession.name}</span>
            </span>
        `;
    }

    navTo('search');
}

// Global API Bindings for Inline Click Handlers
window.handleLoginSubmit = async () => {
    const inputEl = document.getElementById('login-input');
    const val = inputEl?.value?.trim();
    if (!val) return;

    const session = await performLogin(val);
    if (session) {
        initApp();
    }
};

window.handleLogout = () => {
    clearSession();
    initApp();
};

window.navTo = (view) => {
    currentTab = view;
    const root = document.getElementById('app-root');
    if (!root) return;

    // Update Bottom Nav Tab Styles
    ['search', 'today', 'directory'].forEach(t => {
        const btn = document.getElementById(`nav-${t}-btn`);
        if (btn) {
            if (t === view) {
                btn.className = "nav-btn flex flex-col items-center gap-1 text-sky-400 font-bold bg-sky-500/10 py-1.5 px-3 rounded-xl border border-sky-500/30 transition-all";
            } else {
                btn.className = "nav-btn flex flex-col items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors py-1.5 px-3 rounded-xl";
            }
        }
    });

    if (view === 'search') {
        renderDashboardView(root, currentSession);
    } else if (view === 'today') {
        renderTodayCollectionView(root);
    } else if (view === 'directory') {
        renderCustomerDirectoryView(root);
    }
};

window.handleOmniSearch = handleOmniSearch;
window.filterDirectoryList = filterDirectoryList;

window.selectCustomerById = async (cid) => {
    const root = document.getElementById('app-root');
    try {
        const cSnap = await db.collection('customers').doc(cid).get();
        if (cSnap.exists) {
            const customer = { id: cSnap.id, ...cSnap.data() };
            await loadAndRenderCustomerLedger(root, customer);
        }
    } catch(e) {
        console.error(e);
    }
};

window.applyDatePreset = applyDatePreset;
window.triggerPrintCurrentStatement = triggerPrintCurrentStatement;

// Start App
document.addEventListener('DOMContentLoaded', initApp);
