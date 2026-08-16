/**
 * --- DASHBOARD MODULE (Main Entry & Realtime Orchestrator) ---
 * Connects UI, Charts, Real-time Listeners, Dynamic Date Filtering & Breakdown Drill-Down.
 */
import { TransactionDAO, ExpenseDAO } from '../dao.js';
import { formatAmountWithComma, getTodayLocalDateString, toDBDate, formatAppDate, safeRound } from '../utils.js';
import { getCustomerCache } from '../customer/index.js';
import { getDashboardHTML } from './dashboard-ui.js';
import { renderSalesVsCollectionChart, renderPaymentDonutChart } from './dashboard-charts.js';
import { renderTopDueCustomers, printExecutiveSummary, showBreakdownDetails } from './dashboard-actions.js';
import { loadAllZones } from '../customer/customer-handlers.js';
import { loadCollectionList, filterCollectionList, filterCollectionByMethod, getYesterdayDBDate } from './dashboard-collection.js';
import { toggleDashCustomerForm, saveDashCustomer, resetDashCustomerForm } from './dashboard-quick-customer.js';

let dashboardUnsubscribes = [];
let currentTimeframe = 'today';
let activeFilterDate = null;
let currentBankBreakdown = {};
let currentCashBreakdown = {};

export function unsubscribeDashboard() {
    dashboardUnsubscribes.forEach(unsub => { if (typeof unsub === 'function') unsub(); });
    dashboardUnsubscribes = [];
}

export function renderDashboard(container, params) {
    if (window.AppState?.currentUserRole === 'Staff' && window.AppState?.permissions?.viewDashboard === false) {
        container.innerHTML = `<div class="m3-card text-center"><h2 class="text-xl font-bold text-red-500 font-bn">অ্যাক্সেস ডিনাইড! আপনার ড্যাশবোর্ড দেখার অনুমতি নেই।</h2></div>`;
        return;
    }

    unsubscribeDashboard();
    container.innerHTML = getDashboardHTML();

    loadAllZones();
    activeFilterDate = getTodayLocalDateString();
    startDashboardRealtimeUpdates(activeFilterDate);

    setTimeout(() => {
        window.filterCollectionList('today');
    }, 200);
}

export function startDashboardRealtimeUpdates(targetDate = null) {
    unsubscribeDashboard();
    const queryDate = targetDate || activeFilterDate || getTodayLocalDateString();
    activeFilterDate = queryDate;

    const dateInput = document.getElementById('dash-date-filter');
    const badgeText = document.getElementById('dash-active-date-text');
    const formattedAppDateStr = formatAppDate(queryDate);
    const todayStr = getTodayLocalDateString();

    if (dateInput) dateInput.value = formattedAppDateStr;
    if (badgeText) {
        badgeText.innerText = (queryDate === todayStr) ? `আজকের লাইভ হিসাব (${formattedAppDateStr})` : `${formattedAppDateStr} এর হিসাব`;
    }

    function updateCustomerStats() {
        const customers = getCustomerCache();
        let totalDue = 0;
        customers.forEach(c => { totalDue = safeRound(totalDue + (Number(c.totalDue) || 0)); });
        const dueEl = document.getElementById('dash-total-due');
        const custEl = document.getElementById('dash-total-cust');
        if (dueEl) dueEl.innerText = "৳ " + formatAmountWithComma(totalDue);
        if (custEl) custEl.innerText = customers.length + " জন";
        renderTopDueCustomers();
    }

    updateCustomerStats();
    const statsInterval = setInterval(() => {
        if (!document.getElementById('dash-total-due')) { clearInterval(statsInterval); return; }
        updateCustomerStats();
    }, 3000);
    dashboardUnsubscribes.push(() => clearInterval(statsInterval));

    let latestCashCol = 0, latestBankCol = 0, latestTotExp = 0;

    function updateNetBalances() {
        const netCash = safeRound(latestCashCol - latestTotExp);
        const netEl = document.getElementById('dash-net-cash');
        if (netEl) {
            if (netCash < 0) {
                netEl.className = 'flex items-center gap-1.5 text-red-400 font-bn font-bold text-xs';
                netEl.innerHTML = `<i class="fa-solid fa-triangle-exclamation text-red-400"></i> নিট ক্যাশ: <span class="font-mono text-red-300 font-black">-৳ ${formatAmountWithComma(Math.abs(netCash))}</span> <span class="text-[10px] bg-red-500/20 px-1.5 py-0.5 rounded-md text-red-300 font-bold">(ঘাটতি)</span>`;
            } else {
                netEl.className = 'flex items-center gap-1.5 text-emerald-400 font-bn font-bold text-xs';
                netEl.innerHTML = `<i class="fa-solid fa-coins text-emerald-400"></i> নিট ক্যাশ: <span class="font-mono text-white font-black">৳ ${formatAmountWithComma(netCash)}</span> <span class="text-[10px] bg-emerald-500/20 px-1.5 py-0.5 rounded-md text-emerald-300 font-bold">(উদ্বৃত্ত)</span>`;
            }
        }

        const bankInflowEl = document.getElementById('dash-bank-inflow');
        if (bankInflowEl) {
            bankInflowEl.className = 'text-blue-400 font-black bg-blue-500/10 px-2 py-0.5 rounded-lg flex items-center gap-1 border border-blue-500/20 font-bn text-[11px]';
            bankInflowEl.innerHTML = `<i class="fa-solid fa-building-columns text-[10px]"></i> ব্যাংক: <span class="font-mono text-white font-bold">৳ ${formatAmountWithComma(latestBankCol)}</span>`;
        }
    }

    const unsubTxns = TransactionDAO.listenByDate(queryDate, transactions => {
        let cashCol = 0, bankCol = 0, lessCol = 0;
        currentBankBreakdown = {};
        currentCashBreakdown = {};

        transactions.forEach(data => {
            const p = (Number(data.paid) || 0);
            if (p <= 0) return;

            const rt = data.receivedType || 'Bank';
            let rf = (data.receivedFrom || '').trim();

            if (rt === 'Cash') {
                cashCol = safeRound(cashCol + p);
                if (!rf) rf = 'শোরুম ক্যাশ';
                if (!currentCashBreakdown[rf]) currentCashBreakdown[rf] = { total: 0, txns: [] };
                currentCashBreakdown[rf].total = safeRound(currentCashBreakdown[rf].total + p);
                currentCashBreakdown[rf].txns.push(data);
            } else if (rt === 'Less') {
                lessCol = safeRound(lessCol + p);
            } else {
                bankCol = safeRound(bankCol + p);
                if (!rf) rf = 'অন্যান্য ব্যাংক';
                if (!currentBankBreakdown[rf]) currentBankBreakdown[rf] = { total: 0, txns: [] };
                currentBankBreakdown[rf].total = safeRound(currentBankBreakdown[rf].total + p);
                currentBankBreakdown[rf].txns.push(data);
            }
        });

        latestCashCol = cashCol;
        latestBankCol = bankCol;

        const periodCol = safeRound(cashCol + bankCol);
        const colEl = document.getElementById('dash-today-col');
        if (colEl) colEl.innerText = "৳ " + formatAmountWithComma(periodCol);

        const cashEl = document.getElementById('dash-col-cash');
        const bankEl = document.getElementById('dash-col-bank');
        if (cashEl) cashEl.innerText = "৳ " + formatAmountWithComma(cashCol);
        if (bankEl) bankEl.innerText = "৳ " + formatAmountWithComma(bankCol);

        updateNetBalances();
        renderPaymentDonutChart('payment-donut-chart', cashCol, bankCol);
        renderSalesVsCollectionChart('sales-vs-col-chart');
    });
    dashboardUnsubscribes.push(unsubTxns);

    const unsubExp = ExpenseDAO.listenByDate(queryDate, expenses => {
        let totExp = 0;
        expenses.forEach(e => totExp = safeRound(totExp + (Number(e.amount) || 0)));
        latestTotExp = totExp;
        const expEl = document.getElementById('dash-today-exp');
        if (expEl) expEl.innerText = "৳ " + formatAmountWithComma(totExp);
        updateNetBalances();
    });
    dashboardUnsubscribes.push(unsubExp);
}

export function onDashDateFilterChange(val) {
    if (!val) return;
    startDashboardRealtimeUpdates(toDBDate(val));
}

// Global API Bindings
if (typeof window !== 'undefined') {
    window.switchDashTimeframe = (tf) => {
        currentTimeframe = tf;
        const today = getTodayLocalDateString();
        const yesterday = getYesterdayDBDate();
        const btnToday = document.getElementById('tf-today-btn');
        const btnYesterday = document.getElementById('tf-yesterday-btn');

        if (btnToday && btnYesterday) {
            if (tf === 'today') {
                btnToday.className = 'px-3 py-1.5 min-h-[34px] rounded-lg bg-blue-600 text-white font-black cursor-pointer';
                btnYesterday.className = 'px-3 py-1.5 min-h-[34px] rounded-lg text-slate-400 hover:text-white font-bold cursor-pointer';
                startDashboardRealtimeUpdates(today);
            } else if (tf === 'yesterday') {
                btnYesterday.className = 'px-3 py-1.5 min-h-[34px] rounded-lg bg-blue-600 text-white font-black cursor-pointer';
                btnToday.className = 'px-3 py-1.5 min-h-[34px] rounded-lg text-slate-400 hover:text-white font-bold cursor-pointer';
                startDashboardRealtimeUpdates(yesterday);
            }
        }
    };
    window.onDashDateFilterChange = onDashDateFilterChange;
    window.loadCollectionList = loadCollectionList;
    window.filterCollectionList = filterCollectionList;
    window.filterCollectionByMethod = filterCollectionByMethod;
    window.printExecutiveSummary = printExecutiveSummary;
    window.toggleDashCustomerForm = toggleDashCustomerForm;
    window.saveDashCustomer = saveDashCustomer;
    window.resetDashCustomerForm = resetDashCustomerForm;
    window.showBreakdownDetails = (type, accountName) => {
        const breakdown = type === 'Bank' ? currentBankBreakdown : currentCashBreakdown;
        const sourceData = accountName ? breakdown[accountName] : null;
        if (!sourceData) {
            const allEntries = Object.entries(breakdown);
            if (allEntries.length === 0) return Swal.fire({ title: type, text: 'এই ক্যাটাগরিতে কোনো লেনদেন নেই', icon: 'info', customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' } });
            const [firstName, firstData] = allEntries[0];
            showBreakdownDetails(firstName, type, firstData, activeFilterDate);
            return;
        }
        showBreakdownDetails(accountName, type, sourceData, activeFilterDate);
    };
}

export { 
    getDashboardHTML, renderSalesVsCollectionChart, renderPaymentDonutChart, 
    renderTopDueCustomers, printExecutiveSummary, showBreakdownDetails,
    loadCollectionList, filterCollectionList, filterCollectionByMethod,
    toggleDashCustomerForm, saveDashCustomer, resetDashCustomerForm 
};
