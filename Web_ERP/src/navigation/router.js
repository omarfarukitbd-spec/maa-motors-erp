import { initCustomerCache } from '../customer/index.js';
import { renderDashboard, unsubscribeDashboard } from '../dashboard.js';
import { renderCustomers } from '../customer/index.js';
import { renderLedger } from '../ledger.js';
import { renderExpenses } from '../expense.js';
import { renderSettings } from '../settings.js';
import { renderStatement } from '../statement.js';
import { renderBulkEntry } from '../bulk_entry.js';
import { renderAdmin } from '../admin.js';
import { renderInvoice } from '../invoice.js';
import { renderAuditLogs, unsubscribeAuditLogs } from '../audit.js';
import { renderRecycleBin, unsubscribeRecycleBinData } from '../admin/recycle-bin.js';
import { renderZoneReports } from '../zone_reports/index.js';
import { renderFinancialSummary } from '../financial_summary/index.js';
import { renderTreasury } from '../treasury/index.js';
import { renderMemoSearch } from '../memo_search/index.js';
import { AppState } from '../state.js';
import { firebase } from '../firebase-config.js';
import { initDatePickers } from '../utils/date-logic/date-picker.js';
import { SettingsDAO } from '../dao.js';

/**
 * Apply shop logo as favicon + PWA manifest icon from Firestore settings
 */
async function applyAppBranding() {
    try {
        const settings = await SettingsDAO.getAppSettings();
        const logoUrl = settings.shopLogo;
        const shopName = settings.shopName || 'MAA ERP';

        // 1. Update browser tab title
        document.title = `${shopName} - ERP`;

        if (!logoUrl) return;

        // 2. Set favicon
        let favicon = document.getElementById('dynamic-favicon');
        if (!favicon) {
            favicon = document.createElement('link');
            favicon.id = 'dynamic-favicon';
            favicon.rel = 'icon';
            document.head.appendChild(favicon);
        }
        favicon.href = logoUrl;

        // 3. Set apple-touch-icon
        let appleIcon = document.getElementById('dynamic-apple-icon');
        if (!appleIcon) {
            appleIcon = document.createElement('link');
            appleIcon.id = 'dynamic-apple-icon';
            appleIcon.rel = 'apple-touch-icon';
            document.head.appendChild(appleIcon);
        }
        appleIcon.href = logoUrl;

        // 4. Override PWA manifest icons dynamically
        const manifestLink = document.querySelector('link[rel="manifest"]');
        if (manifestLink) {
            const manifest = {
                name: shopName,
                short_name: shopName.split(' ')[0],
                description: 'Professional Business Ledger & Accounting System',
                start_url: '/',
                display: 'standalone',
                background_color: '#0F172A',
                theme_color: '#0F172A',
                orientation: 'portrait-primary',
                icons: [
                    { src: logoUrl, sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
                    { src: logoUrl, sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
                ]
            };
            const blob = new Blob([JSON.stringify(manifest)], { type: 'application/json' });
            manifestLink.href = URL.createObjectURL(blob);
        }
    } catch (e) {
        console.warn('App branding apply error:', e);
    }
}

/**
 * Online Status Indicator (Icon-based)
 */
export function initOnlineStatus() {
    const statusBadge = document.getElementById('online-status-badge');
    if (!statusBadge) return;

    function updateStatus() {
        if (navigator.onLine) {
            statusBadge.className = "flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-black cursor-help";
            statusBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> <i class="fa-solid fa-cloud text-xs"></i> <span class="hidden sm:inline">LIVE</span>`;
            statusBadge.title = "সিস্টেম অনলাইনে আছে (লাইভ সিঙ্ক চালু)";
        } else {
            statusBadge.className = "flex items-center gap-1.5 px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full text-[10px] font-black cursor-help";
            statusBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> <i class="fa-solid fa-cloud-slash text-xs"></i> <span class="hidden sm:inline">OFFLINE</span>`;
            statusBadge.title = "অফলাইন মোড (ইন্টারনেট কানেকশন নেই)";
        }
    }

    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
    updateStatus();
}

/**
 * App Navigation Logic
 */
export function navigate(view, params = {}) {
    if (AppState.currentView === 'dashboard' && view !== 'dashboard') unsubscribeDashboard();
    if (AppState.currentView === 'audit' && view !== 'audit') unsubscribeAuditLogs();
    if (AppState.currentView === 'recycle-bin' && view !== 'recycle-bin') unsubscribeRecycleBinData();

    AppState.currentView = view;
    const sidebar = document.getElementById('app-sidebar');
    if(sidebar) sidebar.classList.remove('open');

    // Update Nav UI (Desktop Sidebar + Mobile Bottom Nav)
    document.querySelectorAll('.nav-links li, .nav-item, .mobile-nav-item').forEach(el => {
        el.classList.remove('active');
        const onclick = el.getAttribute('onclick');
        if(onclick && onclick.includes(`'${view}'`)) el.classList.add('active');
    });

    const container = document.getElementById('view-container');
    if(!container) return;

    // View Switching
    switch(view) {
        case 'dashboard': renderDashboard(container, params); break;
        case 'customers': renderCustomers(container); break;
        case 'ledger': renderLedger(container, params); break;
        case 'zone-reports': renderZoneReports(container); break;
        case 'financial-summary': renderFinancialSummary(container, params); break;
        case 'bulk': renderBulkEntry(container); break;
        case 'invoice': renderInvoice(container, params); break;
        case 'expenses': renderExpenses(container); break;
        case 'settings': renderSettings(container); break;
        case 'statement': renderStatement(container, params); break;
        case 'admin': renderAdmin(container); break;
        case 'audit': renderAuditLogs(container); break;
        case 'banking': window.bankingApp.renderBankingLedger(container); break;
        case 'memo-search':
        case 'memo_search': renderMemoSearch(container, params); break;
        case 'treasury': renderTreasury(container, params); break;
        case 'recycle-bin': renderRecycleBin(container); break;
    }

    // Refresh date pickers after render
    setTimeout(initDatePickers, 50);
}

/**
 * Unlocks the app after successful login/PIN
 */
export function unlockApp() {
    initCustomerCache();
    applyAppBranding(); // Auto-set favicon & PWA icon from shop logo
    const errEl = document.getElementById('login-error');
    if (errEl) errEl.innerText = '';

    const ls = document.getElementById('login-screen'), ac = document.getElementById('app-container');
    if(ls) ls.style.display = 'none';
    if(ac) ac.classList.remove('hidden');

    const roleEl = document.getElementById('user-role');
    if(roleEl) roleEl.innerText = AppState.currentUserRole || 'User';

    const currentUser = firebase.auth().currentUser;
    const avatarEl = document.getElementById('user-profile-avatar');
    if (avatarEl && currentUser) {
        if (currentUser.photoURL) {
            avatarEl.innerHTML = `<img src="${currentUser.photoURL}" class="w-full h-full object-cover rounded-full" referrerpolicy="no-referrer" />`;
        } else {
            avatarEl.innerHTML = `<i class="fa-solid fa-user-shield text-sm"></i>`;
        }
        avatarEl.title = `${currentUser.email} (${AppState.currentUserRole})`;
    }

    navigate(AppState.currentView || 'dashboard');
}

/**
 * Sidebar Toggle Logic
 */
export function toggleSidebarCollapse() {
    const sb = document.getElementById('app-sidebar');
    if(sb) {
        sb.classList.toggle('collapsed');
        localStorage.setItem('sidebarCollapsed', sb.classList.contains('collapsed'));
    }
}

// Global Bindings
window.navigate = navigate;
window.navigateTo = navigate;
window.unlockApp = unlockApp;
