/**
 * --- DASHBOARD MODULE (Main Entry & Realtime Orchestrator) ---
 * Connects UI, Charts, Real-time Listeners, and Fallbacks.
 */
import { db } from '../firebase-config.js';
import { TransactionDAO, ExpenseDAO } from '../dao.js';
import { loadRecentTransactions } from '../ledger.js';
import { formatAmountWithComma, getTodayLocalDateString } from '../utils.js';
import { getCustomerCache } from '../customer/index.js';
import { getDashboardHTML } from './dashboard-ui.js';
import { renderSalesVsCollectionChart, renderPaymentDonutChart } from './dashboard-charts.js';
import { renderTopDueCustomers, printExecutiveSummary } from './dashboard-actions.js';

let dashboardUnsubscribes = [];
let currentTimeframe = 'today';

export function unsubscribeDashboard() {
    dashboardUnsubscribes.forEach(unsub => { if (typeof unsub === 'function') unsub(); });
    dashboardUnsubscribes = [];
}

import { loadAllZones } from '../customer/customer-handlers.js';

export function renderDashboard(container, params) {
    if(window.AppState?.currentUserRole === 'Staff' && window.AppState?.permissions?.viewDashboard === false) {
        container.innerHTML = `<div class="m3-card text-center"><h2 class="text-xl font-bold text-red-500 font-bn">অ্যাক্সেস ডিনাইড! আপনার ড্যাশবোর্ড দেখার অনুমতি নেই।</h2></div>`;
        return;
    }

    unsubscribeDashboard();
    container.innerHTML = getDashboardHTML();

    loadAllZones();
    startDashboardRealtimeUpdates();
    const filterVoucher = (params && params.filterVoucher) ? params.filterVoucher : null;
    loadRecentTransactions(filterVoucher);
}

function startDashboardRealtimeUpdates() {
    unsubscribeDashboard();
    const today = getTodayLocalDateString();

    function updateCustomerStats() {
        const customers = getCustomerCache();
        let totalDue = 0;
        customers.forEach(c => { totalDue = safeRound(totalDue + (Number(c.totalDue) || 0)); });
        const dueEl = document.getElementById('dash-total-due');
        const custEl = document.getElementById('dash-total-cust');
        if(dueEl) dueEl.innerText = "৳ " + formatAmountWithComma(totalDue);
        if(custEl) custEl.innerText = customers.length + " জন";
        renderTopDueCustomers();
    }

    updateCustomerStats();
    const statsInterval = setInterval(() => {
        if (!document.getElementById('dash-total-due')) { clearInterval(statsInterval); return; }
        updateCustomerStats();
    }, 3000);
    dashboardUnsubscribes.push(() => clearInterval(statsInterval));

    // Listen for today's transactions
    const unsubTxns = TransactionDAO.listenByDate(today, transactions => {
        let todayCol = 0, cashCol = 0, bankCol = 0, todaySales = 0;
        let bankBreakdown = {};
        let cashBreakdown = {};

        transactions.forEach(data => {
            const p = (Number(data.paid) || 0);
            const b = (Number(data.bill) || 0);
            todayCol += p; todaySales += b;
            
            if (p > 0) {
                const rt = data.receivedType || 'Bank';
                let rf = (data.receivedFrom || '').trim();
                
                if (rt === 'Cash') {
                    cashCol += p;
                    if (!rf) rf = 'শোরুম ক্যাশ';
                    cashBreakdown[rf] = (cashBreakdown[rf] || 0) + p;
                } else if (rt === 'Bank' || !data.receivedType) {
                    bankCol += p;
                    if (!rf) rf = 'অন্যান্য ব্যাংক';
                    bankBreakdown[rf] = (bankBreakdown[rf] || 0) + p;
                }
            }
        });

        const colEl = document.getElementById('dash-today-col');
        if(colEl) colEl.innerText = "৳ " + formatAmountWithComma(todayCol);

        const cashEl = document.getElementById('dash-col-cash');
        const bankEl = document.getElementById('dash-col-bank');
        if(cashEl) cashEl.innerText = "৳ " + formatAmountWithComma(cashCol);
        if(bankEl) bankEl.innerText = "৳ " + formatAmountWithComma(bankCol);

        if (typeof window.renderCollectionBreakdown === 'function') {
            window.renderCollectionBreakdown(bankBreakdown, cashBreakdown);
        }

        renderPaymentDonutChart('payment-donut-chart', cashCol, bankCol);
        renderSalesVsCollectionChart('sales-vs-col-chart');
    });
    dashboardUnsubscribes.push(unsubTxns);

    // Listen for today's expenses
    const unsubExp = ExpenseDAO.listenByDate(today, expenses => {
        let totExp = 0;
        expenses.forEach(e => totExp += (Number(e.amount) || 0));
        const expEl = document.getElementById('dash-today-exp');
        if (expEl) expEl.innerText = "৳ " + formatAmountWithComma(totExp);

        const colText = document.getElementById('dash-today-col')?.innerText?.replace(/[^0-9]/g, '') || '0';
        const colVal = Number(colText);
        const netCash = colVal - totExp;
        const netEl = document.getElementById('dash-net-cash');
        if (netEl) netEl.innerText = `নিট জমা: ৳ ${formatAmountWithComma(Math.max(0, netCash))}`;
    });
    dashboardUnsubscribes.push(unsubExp);
}

// Global Bindings
window.switchDashTimeframe = (tf) => {
    currentTimeframe = tf;
    ['today', 'week', 'month'].forEach(t => {
        const btn = document.getElementById(`tf-${t}-btn`);
        if (btn) {
            if (t === tf) { btn.className = 'px-3 py-1 rounded-lg bg-blue-600 text-white font-black'; }
            else { btn.className = 'px-3 py-1 rounded-lg text-slate-400 hover:text-white font-bold'; }
        }
    });
};
window.printExecutiveSummary = printExecutiveSummary;

window.renderCollectionBreakdown = (bankData, cashData) => {
    const card = document.getElementById('dash-collection-breakdown-card');
    const list = document.getElementById('dash-collection-breakdown-list');
    if (!card || !list) return;
    
    let html = '';
    
    // Check if there is any data
    if (Object.keys(bankData).length === 0 && Object.keys(cashData).length === 0) {
        card.classList.remove('flex');
        card.classList.add('hidden');
        return;
    }
    
    card.classList.remove('hidden');
    card.classList.add('flex');

    if (Object.keys(bankData).length > 0) {
        html += `<div class="text-[11px] text-blue-400 font-black uppercase mt-1 mb-1"><i class="fa-solid fa-building-columns mr-1"></i> ব্যাংক জমা</div>`;
        for (const [bank, amount] of Object.entries(bankData)) {
            html += `<div class="flex items-center justify-between bg-slate-950/50 p-2 rounded-lg border border-slate-800">
                        <span class="text-xs text-slate-300 font-bold truncate max-w-[60%]">${bank}</span>
                        <span class="text-xs font-black text-blue-400">৳ ${window.formatAmountWithComma ? window.formatAmountWithComma(amount) : amount}</span>
                     </div>`;
        }
    }
    
    if (Object.keys(cashData).length > 0) {
        html += `<div class="text-[11px] text-emerald-400 font-black uppercase mt-2 mb-1"><i class="fa-solid fa-money-bill-wave mr-1"></i> ক্যাশ জমা</div>`;
        for (const [receiver, amount] of Object.entries(cashData)) {
            html += `<div class="flex items-center justify-between bg-slate-950/50 p-2 rounded-lg border border-slate-800">
                        <span class="text-xs text-slate-300 font-bold truncate max-w-[60%]">${receiver}</span>
                        <span class="text-xs font-black text-emerald-400">৳ ${window.formatAmountWithComma ? window.formatAmountWithComma(amount) : amount}</span>
                     </div>`;
        }
    }
    
    list.innerHTML = html;
};
