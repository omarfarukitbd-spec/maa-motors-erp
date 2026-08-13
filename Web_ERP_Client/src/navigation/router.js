import { AppState } from '../state.js';
import { CustomerDAO } from '../dao.js';
import { renderDashboard, unsubscribeDashboard } from '../dashboard/index.js';
import { renderCustomers } from '../customer/index.js';
import { renderLedger } from '../ledger/index.js';
import { renderInvoice } from '../invoice/index.js';
import { renderExpenses } from '../expense/index.js';
import { showToast } from '../utils.js';

export function initNetworkStatus() {
    const update = () => {
        const isOnline = navigator.onLine;
        const badge = document.getElementById('network-sync-badge');
        if (badge) {
            badge.innerHTML = isOnline 
                ? `<span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse block"></span><span class="hidden md:inline text-[10px] font-black uppercase text-emerald-400">অনলাইন</span>`
                : `<span class="w-2.5 h-2.5 rounded-full bg-red-500 block"></span><span class="hidden md:inline text-[10px] font-black uppercase text-red-400">অফলাইন</span>`;
            badge.className = isOnline 
                ? 'w-8 h-8 md:w-auto md:h-auto md:px-3 md:py-1 md:gap-1.5 flex items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-sm cursor-default'
                : 'w-8 h-8 md:w-auto md:h-auto md:px-3 md:py-1 md:gap-1.5 flex items-center justify-center rounded-full bg-red-500/10 border border-red-500/20 shadow-sm cursor-default';
        }
    };

    window.addEventListener('online', () => { update(); showToast('অনলাইন কানেকশন সক্রিয়', 'success'); });
    window.addEventListener('offline', () => { update(); showToast('ইন্টারনেট সংযোগ বিচ্ছিন্ন', 'warning'); });
    update();
}

export function navigate(view, params = {}) {
    if (AppState.currentView === 'dashboard' && view !== 'dashboard') {
        unsubscribeDashboard();
    }

    AppState.currentView = view;

    // Close mobile sidebar if open
    const sidebar = document.getElementById('app-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.add('hidden');

    // Update Navigation UI Active States (Desktop + Mobile)
    document.querySelectorAll('.nav-links li, .nav-item, .mobile-nav-item').forEach(el => {
        el.classList.remove('active');
        const onclick = el.getAttribute('onclick');
        if (onclick && onclick.includes(`'${view}'`)) {
            el.classList.add('active');
        }
    });

    const container = document.getElementById('view-container');
    if (!container) return;

    // Route Switching
    switch (view) {
        case 'dashboard':
            renderDashboard(container, params);
            break;
        case 'customers':
            renderCustomers(container, params);
            break;
        case 'ledger':
            renderLedger(container, params);
            break;
        case 'invoice':
            renderInvoice(container, params);
            break;
        case 'expenses':
            renderExpenses(container, params);
            break;
        default:
            renderDashboard(container, params);
    }
}

export function unlockApp() {
    const loginScreen = document.getElementById('login-screen');
    const appContainer = document.getElementById('app-container');

    if (loginScreen) loginScreen.style.display = 'none';
    if (appContainer) appContainer.classList.remove('hidden');

    // Pre-cache customers in background
    CustomerDAO.getAll().then(customers => {
        AppState.customerCache = customers;
    }).catch(e => console.error(e));

    navigate('dashboard');
}

window.navigate = navigate;
