import { CustomerDAO, TransactionDAO, ExpenseDAO } from '../dao.js';
import { formatAmountWithComma, getTodayLocalDateString, toDBDate, formatAppDate, safeRound, numberToBanglaWords, cleanCustomerName } from '../utils.js';

let unsubCustomers = null;
let unsubTxns = null;
let unsubExpenses = null;
let donutChartInstance = null;
let allTransactionsForPeriod = [];

export function initDashboardListeners() {
    unsubscribeDashboard();

    // 1. Listen Customers (Total Due, Count, Top 5 Due)
    unsubCustomers = CustomerDAO.listenAll(customers => {
        let totalDue = 0;
        customers.forEach(c => {
            const due = Number(c.totalDue) || 0;
            if (due > 0) totalDue = safeRound(totalDue + due);
        });

        const dueEl = document.getElementById('dash-total-due');
        const custEl = document.getElementById('dash-total-cust');
        if (dueEl) dueEl.innerText = "৳ " + formatAmountWithComma(totalDue);
        if (custEl) custEl.innerText = `${customers.length} জন`;

        // Render Top 5 Due Customers
        renderTop5Due(customers);
    });

    // 2. Default to today's date
    const today = toDBDate(getTodayLocalDateString());
    const dateInput = document.getElementById('dash-date-filter');
    if (dateInput) dateInput.value = formatAppDate(today);

    loadDashboardDateData(today);
}

export function unsubscribeDashboard() {
    if (unsubCustomers) { unsubCustomers(); unsubCustomers = null; }
    if (unsubTxns) { unsubTxns(); unsubTxns = null; }
    if (unsubExpenses) { unsubExpenses(); unsubExpenses = null; }
}

function renderTop5Due(customers) {
    const container = document.getElementById('dash-top-due-list');
    if (!container) return;

    const top5 = [...customers]
        .filter(c => (Number(c.totalDue) || 0) > 0)
        .sort((a, b) => (Number(b.totalDue) || 0) - (Number(a.totalDue) || 0))
        .slice(0, 5);

    if (top5.length === 0) {
        container.innerHTML = `<p class="text-center py-6 text-slate-500 text-xs italic">কোনো বকেয়া কাস্টমার নেই</p>`;
        return;
    }

    let html = '';
    top5.forEach((c, idx) => {
        const cleanName = cleanCustomerName(c.name || 'Unknown');
        const due = formatAmountWithComma(c.totalDue || 0);
        html += `
            <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-all cursor-pointer" onclick="navigate('ledger', { customerId: '${c.id}' })">
                <div class="flex items-center gap-3 overflow-hidden">
                    <div class="w-6 h-6 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center text-xs font-black shrink-0">${idx + 1}</div>
                    <div class="overflow-hidden">
                        <h5 class="text-xs font-bold text-white truncate">${cleanName}</h5>
                        <p class="text-[10px] text-slate-400 font-mono">${c.phone || c.accountNo || 'N/A'}</p>
                    </div>
                </div>
                <div class="text-right shrink-0">
                    <span class="text-xs font-black text-red-400 font-inter">৳ ${due}</span>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

export function loadDashboardDateData(queryDate) {
    if (unsubTxns) unsubTxns();
    if (unsubExpenses) unsubExpenses();

    unsubTxns = TransactionDAO.listenByDate(queryDate, txns => {
        allTransactionsForPeriod = txns.filter(t => (Number(t.paid) || 0) > 0);
        let cashCol = 0, bankCol = 0;
        const methodGroups = {};

        allTransactionsForPeriod.forEach(t => {
            const p = Number(t.paid) || 0;
            const rt = t.receivedType || 'Cash';
            const rf = (t.receivedFrom || '').trim() || (rt === 'Cash' ? 'Cash' : 'Bank');

            if (rt === 'Cash') cashCol = safeRound(cashCol + p);
            else bankCol = safeRound(bankCol + p);

            if (rt !== 'Less') {
                if (!methodGroups[rf]) methodGroups[rf] = { total: 0, count: 0 };
                methodGroups[rf].total = safeRound(methodGroups[rf].total + p);
                methodGroups[rf].count++;
            }
        });

        const totalCol = safeRound(cashCol + bankCol);
        const colEl = document.getElementById('dash-today-col');
        const cardTotalEl = document.getElementById('dash-collection-card-total');
        const cardWordsEl = document.getElementById('dash-collection-card-words');
        const cashEl = document.getElementById('dash-col-cash');
        const bankEl = document.getElementById('dash-col-bank');

        if (colEl) colEl.innerText = "৳ " + formatAmountWithComma(totalCol);
        if (cardTotalEl) cardTotalEl.innerText = "৳ " + formatAmountWithComma(totalCol);
        if (cardWordsEl) cardWordsEl.innerText = totalCol > 0 ? numberToBanglaWords(totalCol) : 'শূন্য টাকা মাত্র';
        if (cashEl) cashEl.innerText = "৳ " + formatAmountWithComma(cashCol);
        if (bankEl) bankEl.innerText = "৳ " + formatAmountWithComma(bankCol);

        updateDonutChart(cashCol, bankCol);
        renderMethodCards(totalCol, methodGroups, allTransactionsForPeriod.length);
        renderCollectionTable(allTransactionsForPeriod);
    });

    unsubExpenses = ExpenseDAO.listenByDate(queryDate, expenses => {
        let totExp = 0;
        expenses.forEach(e => totExp = safeRound(totExp + (Number(e.amount) || 0)));
        const expEl = document.getElementById('dash-today-exp');
        if (expEl) expEl.innerText = "৳ " + formatAmountWithComma(totExp);
    });
}

function updateDonutChart(cash, bank) {
    const canvas = document.getElementById('payment-donut-chart');
    if (!canvas || !window.Chart) return;

    if (donutChartInstance) donutChartInstance.destroy();

    donutChartInstance = new window.Chart(canvas, {
        type: 'doughnut',
        data: {
            labels: ['Cash', 'Bank'],
            datasets: [{
                data: [cash || 0, bank || 0],
                backgroundColor: ['#10B981', '#3B82F6'],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            cutout: '75%'
        }
    });
}

function renderMethodCards(total, methodGroups, totalCount) {
    const container = document.getElementById('dash-collection-method-cards');
    if (!container) return;

    let html = `
        <div class="method-card-btn bg-emerald-600/90 backdrop-blur-md border border-emerald-500/50 rounded-2xl p-3 sm:p-3.5 cursor-pointer hover:bg-emerald-500 transition-all flex flex-col justify-between gap-2 w-full min-w-0 shadow-[0_5px_15px_-5px_rgba(16,185,129,0.5)] ring-2 ring-emerald-400 select-none" onclick="window.filterCollectionByMethod('All')">
            <div class="flex items-center justify-between gap-1.5 w-full">
                <span class="text-[11px] font-black text-emerald-100 uppercase drop-shadow-sm truncate"><i class="fa-solid fa-layer-group mr-1"></i>সব (All)</span>
                <span class="text-[9.5px] bg-emerald-900/70 text-emerald-100 px-1.5 py-0.5 rounded-md font-bold shrink-0">${totalCount} জন</span>
            </div>
            <div class="text-base sm:text-lg font-black text-white tracking-tight font-inter whitespace-nowrap">৳ ${formatAmountWithComma(total)}</div>
        </div>
    `;

    for (const [mName, stats] of Object.entries(methodGroups)) {
        const isCash = mName.toLowerCase().includes('cash');
        const icon = isCash ? '<i class="fa-solid fa-hand-holding-dollar mr-1"></i>' : '<i class="fa-solid fa-building-columns mr-1"></i>';
        const themeBg = isCash ? 'bg-emerald-500/10' : 'bg-blue-500/10';
        const themeBorder = isCash ? 'border-emerald-500/30' : 'border-blue-500/30';
        const themeText = isCash ? 'text-emerald-400' : 'text-blue-400';
        const themeHover = isCash ? 'hover:bg-emerald-500/20 hover:border-emerald-500/50' : 'hover:bg-blue-500/20 hover:border-blue-500/50';

        html += `
            <div class="method-card-btn ${themeBg} backdrop-blur-sm border ${themeBorder} ${themeHover} rounded-2xl p-3 sm:p-3.5 cursor-pointer transition-all flex flex-col justify-between gap-2 w-full min-w-0 opacity-80 hover:opacity-100 shadow-sm select-none" onclick="window.filterCollectionByMethod('${mName}')">
                <div class="flex items-center justify-between gap-1.5 w-full">
                    <span class="text-[11px] font-bold ${themeText} uppercase truncate">${icon}${mName}</span>
                    <span class="text-[9.5px] bg-slate-900/80 ${themeText} px-1.5 py-0.5 rounded-md font-bold shrink-0">${stats.count} জন</span>
                </div>
                <div class="text-base sm:text-lg font-black ${themeText} tracking-tight font-inter whitespace-nowrap">৳ ${formatAmountWithComma(stats.total)}</div>
            </div>
        `;
    }

    container.innerHTML = html;
}

function renderCollectionTable(txns) {
    const tbody = document.getElementById('dash-collection-list-tbody');
    const totalEl = document.getElementById('dash-collection-list-total');
    if (!tbody) return;

    if (txns.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center py-10 text-slate-500 italic">এই তারিখে কোনো জমা বা কালেকশন পাওয়া যায়নি</td></tr>`;
        if (totalEl) totalEl.innerText = "৳ ০";
        return;
    }

    let html = '';
    let runningTotal = 0;
    txns.forEach(t => {
        const p = Number(t.paid) || 0;
        runningTotal = safeRound(runningTotal + p);
        const cleanName = cleanCustomerName(t.customerName || 'Unknown');
        const method = (t.receivedFrom || t.receivedType || 'Cash').trim();

        html += `
            <tr class="collection-list-row hover:bg-slate-800/40 transition-colors" data-method="${method}" data-amount="${p}">
                <td class="py-3 px-4 text-xs font-mono text-slate-300">${formatAppDate(t.date)}</td>
                <td class="py-3 px-4 text-xs font-bold text-white cursor-pointer hover:text-blue-400" onclick="navigate('ledger', { customerId: '${t.customerId}' })">${cleanName}</td>
                <td class="py-3 px-4 text-xs font-mono text-slate-400">${t.voucherNo || '-'}</td>
                <td class="py-3 px-4 text-xs font-bold text-blue-400">${method}</td>
                <td class="py-3 px-4 text-right text-xs font-black text-emerald-400 font-inter">৳ ${formatAmountWithComma(p)}</td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
    if (totalEl) totalEl.innerText = "৳ " + formatAmountWithComma(runningTotal);
}

window.filterCollectionByMethod = function(methodName) {
    const rows = document.querySelectorAll('.collection-list-row');
    let visibleTotal = 0;

    rows.forEach(row => {
        const rowMethod = row.getAttribute('data-method');
        if (methodName === 'All' || rowMethod === methodName) {
            row.style.display = '';
            const amt = Number(row.getAttribute('data-amount')) || 0;
            visibleTotal = safeRound(visibleTotal + amt);
        } else {
            row.style.display = 'none';
        }
    });

    const totalEl = document.getElementById('dash-collection-list-total');
    if (totalEl) totalEl.innerText = "৳ " + formatAmountWithComma(visibleTotal);
};
