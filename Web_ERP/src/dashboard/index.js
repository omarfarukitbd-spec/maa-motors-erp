/**
 * --- DASHBOARD MODULE (Main Entry & Realtime Orchestrator) ---
 * Connects UI, Charts, Real-time Listeners, Dynamic Date Filtering & Breakdown Drill-Down.
 */
import { TransactionDAO, ExpenseDAO } from '../dao.js';
import { formatAmountWithComma, getTodayLocalDateString, toDBDate, formatAppDate, safeRound } from '../utils.js';
import { getCustomerCache } from '../customer/index.js';
import { numberToBanglaWords } from '../utils/currency-words.js';
import { getDashboardHTML } from './dashboard-ui.js';
import { renderSalesVsCollectionChart, renderPaymentDonutChart } from './dashboard-charts.js';
import { renderTopDueCustomers, printExecutiveSummary, showBreakdownDetails } from './dashboard-actions.js';
import { loadAllZones } from '../customer/customer-handlers.js';

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
        const colDpEl = document.getElementById('collection-list-datepicker');
        if (colDpEl && colDpEl._flatpickr) {
            colDpEl._flatpickr.set('onChange', function(selectedDates, dateStr, instance) {
                if (selectedDates.length === 2) {
                    const start = toDBDate(selectedDates[0]);
                    const end = toDBDate(selectedDates[1]);
                    window.filterCollectionList('custom', start, end);
                } else if (selectedDates.length === 1 && !dateStr.includes('to')) {
                    const start = toDBDate(selectedDates[0]);
                    window.filterCollectionList('custom', start, start);
                }
            });
        }
        window.filterCollectionList('today');
    }, 200);
}

export function startDashboardRealtimeUpdates(targetDate = null) {
    unsubscribeDashboard();
    const queryDate = targetDate || activeFilterDate || getTodayLocalDateString();
    activeFilterDate = queryDate;

    // Update active date display badge & date input
    const dateInput = document.getElementById('dash-date-filter');
    const badgeText = document.getElementById('dash-active-date-text');
    const formattedAppDateStr = formatAppDate(queryDate);
    const todayStr = getTodayLocalDateString();

    if (dateInput) dateInput.value = formattedAppDateStr;
    if (badgeText) {
        if (queryDate === todayStr) {
            badgeText.innerText = `আজকের লাইভ হিসাব (${formattedAppDateStr})`;
        } else {
            badgeText.innerText = `${formattedAppDateStr} এর হিসাব`;
        }
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

    // Listen for transactions of target date
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
                // Bank or default
                bankCol = safeRound(bankCol + p);
                if (!rf) rf = 'অন্যান্য ব্যাংক';
                if (!currentBankBreakdown[rf]) currentBankBreakdown[rf] = { total: 0, txns: [] };
                currentBankBreakdown[rf].total = safeRound(currentBankBreakdown[rf].total + p);
                currentBankBreakdown[rf].txns.push(data);
            }
        });

        const periodCol = safeRound(cashCol + bankCol);

        const colEl = document.getElementById('dash-today-col');
        if (colEl) colEl.innerText = "৳ " + formatAmountWithComma(periodCol);

        const cashEl = document.getElementById('dash-col-cash');
        const bankEl = document.getElementById('dash-col-bank');
        if (cashEl) cashEl.innerText = "৳ " + formatAmountWithComma(cashCol);
        if (bankEl) bankEl.innerText = "৳ " + formatAmountWithComma(bankCol);

        renderPaymentDonutChart('payment-donut-chart', cashCol, bankCol);
        renderSalesVsCollectionChart('sales-vs-col-chart');
    });
    dashboardUnsubscribes.push(unsubTxns);

    // Listen for expenses of target date
    const unsubExp = ExpenseDAO.listenByDate(queryDate, expenses => {
        let totExp = 0;
        expenses.forEach(e => totExp = safeRound(totExp + (Number(e.amount) || 0)));
        const expEl = document.getElementById('dash-today-exp');
        if (expEl) expEl.innerText = "৳ " + formatAmountWithComma(totExp);

        const colText = document.getElementById('dash-today-col')?.innerText?.replace(/[^0-9]/g, '') || '0';
        const colVal = Number(colText);
        const netCash = safeRound(colVal - totExp);
        const netEl = document.getElementById('dash-net-cash');
        if (netEl) netEl.innerText = `নিট জমা: ৳ ${formatAmountWithComma(Math.max(0, netCash))}`;
    });
    dashboardUnsubscribes.push(unsubExp);
}

export function onDashDateFilterChange(val) {
    if (!val) return;
    const dbDate = toDBDate(val);
    startDashboardRealtimeUpdates(dbDate);
}

export function getYesterdayDBDate() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export async function loadCollectionList(startDate, endDate) {
    const tbody = document.getElementById('dash-collection-list-tbody');
    const totalEl = document.getElementById('dash-collection-list-total');
    if (!tbody) return;
    
    tbody.innerHTML = `<tr><td colspan="5" class="text-center py-10 text-slate-500"><i class="fa-solid fa-spinner fa-spin text-xl text-emerald-500 mb-2"></i><br>ডাটা লোড হচ্ছে...</td></tr>`;
    
    try {
        let snap;
        if (startDate === endDate) {
            snap = await TransactionDAO.collection.where('date', '==', startDate).get();
        } else {
            snap = await TransactionDAO.collection.where('date', '>=', startDate).where('date', '<=', endDate).get();
        }
        
        let txns = [];
        snap.forEach(doc => txns.push({ id: doc.id, ...doc.data() }));
        
        // Filter only collections (paid > 0)
        txns = txns.filter(t => (Number(t.paid) || 0) > 0);
        
        // Sort descending by date, then createdAt
        txns.sort((a, b) => {
            if (a.date !== b.date) return b.date.localeCompare(a.date);
            return (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0);
        });
        
        let total = 0;
        let html = '';
        const methodGroups = {};
        
        if (txns.length === 0) {
            html = `<tr><td colspan="5" class="text-center py-10 text-slate-500 italic">এই সময়ের মধ্যে কোনো আদায় নেই।</td></tr>`;
        } else {
            const customerCache = getCustomerCache();
            txns.forEach(t => {
                const p = Number(t.paid) || 0;
                total = safeRound(total + p);
                
                let cName = 'Unknown';
                const cust = customerCache.find(c => c.id === t.customerId);
                if (cust) cName = cust.name;
                
                const method = t.receivedType || 'Bank';
                let actualMethod = (method === 'Cash') ? 'Cash' : (method === 'Less' ? 'Less' : (t.receivedFrom || 'Bank'));
                
                if (actualMethod !== 'Less') {
                    if (!methodGroups[actualMethod]) methodGroups[actualMethod] = { total: 0, count: 0 };
                    methodGroups[actualMethod].total = safeRound(methodGroups[actualMethod].total + p);
                    methodGroups[actualMethod].count++;
                }

                let methodBadge = '';
                if (method === 'Cash') methodBadge = `<span class="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-bold"><i class="fa-solid fa-hand-holding-dollar mr-1"></i> ক্যাশ</span>`;
                else if (method === 'Less') methodBadge = `<span class="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded text-[10px] font-bold">ছাড় (Less)</span>`;
                else methodBadge = `<span class="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded text-[10px] font-bold"><i class="fa-solid fa-building-columns mr-1"></i> ${t.receivedFrom || 'Bank'}</span>`;
                
                html += `
                    <tr class="hover:bg-slate-800/30 transition-all group collection-list-row" data-method="${actualMethod}" data-amount="${p}">
                        <td class="text-xs text-slate-400 whitespace-nowrap">${formatAppDate(t.date)}</td>
                        <td class="text-sm font-bold text-slate-200">
                            ${cName}
                        </td>
                        <td class="text-xs font-mono text-slate-400">${t.voucherNo || '-'}</td>
                        <td>${methodBadge}</td>
                        <td class="text-right text-emerald-400 font-black font-mono">৳ ${formatAmountWithComma(p)}</td>
                    </tr>
                `;
            });
        }
        
        tbody.innerHTML = html;
        if (totalEl) totalEl.innerText = `৳ ${formatAmountWithComma(total)}`;
        
        // Update Card
        const cardTotalEl = document.getElementById('dash-collection-card-total');
        const cardWordsEl = document.getElementById('dash-collection-card-words');
        if (cardTotalEl) cardTotalEl.innerText = `৳ ${formatAmountWithComma(total)}`;
        if (cardWordsEl) cardWordsEl.innerText = total > 0 ? `${numberToBanglaWords(total)}` : 'শূন্য টাকা মাত্র';

        // Render Method Cards
        const cardsContainer = document.getElementById('dash-collection-method-cards');
        if (cardsContainer) {
            let cardsHtml = '';
            if (txns.length > 0 && Object.keys(methodGroups).length > 0) {
                cardsHtml += `
                    <div class="method-card-btn bg-emerald-600/90 backdrop-blur-md border border-emerald-500/50 rounded-2xl p-3 sm:p-3.5 cursor-pointer hover:bg-emerald-500 transition-all flex flex-col justify-between gap-2 w-full min-w-0 shadow-[0_5px_15px_-5px_rgba(16,185,129,0.5)] ring-2 ring-emerald-400 select-none" onclick="window.filterCollectionByMethod('All')" data-method="All">
                        <div class="flex items-center justify-between gap-1.5 w-full">
                            <span class="text-[11px] font-black text-emerald-100 uppercase drop-shadow-sm truncate"><i class="fa-solid fa-layer-group mr-1"></i>সব (All)</span>
                            <span class="text-[9.5px] bg-emerald-900/70 text-emerald-100 px-1.5 py-0.5 rounded-md font-bold shrink-0">${txns.filter(t => t.receivedType !== 'Less').length} জন</span>
                        </div>
                        <div class="text-base sm:text-lg font-black text-white tracking-tight font-inter whitespace-nowrap">৳ ${formatAmountWithComma(total)}</div>
                    </div>
                `;

                for (const [mName, stats] of Object.entries(methodGroups)) {
                    const isCash = mName === 'Cash';
                    const icon = isCash ? '<i class="fa-solid fa-hand-holding-dollar mr-1"></i>' : '<i class="fa-solid fa-building-columns mr-1"></i>';
                    const themeBg = isCash ? 'bg-emerald-500/10' : 'bg-blue-500/10';
                    const themeBorder = isCash ? 'border-emerald-500/30' : 'border-blue-500/30';
                    const themeText = isCash ? 'text-emerald-400' : 'text-blue-400';
                    const themeHover = isCash ? 'hover:bg-emerald-500/20 hover:border-emerald-500/50' : 'hover:bg-blue-500/20 hover:border-blue-500/50';
                    const ringColor = isCash ? 'ring-emerald-400' : 'ring-blue-400';

                    cardsHtml += `
                        <div class="method-card-btn ${themeBg} backdrop-blur-sm border ${themeBorder} ${themeHover} rounded-2xl p-3 sm:p-3.5 cursor-pointer transition-all flex flex-col justify-between gap-2 w-full min-w-0 opacity-80 hover:opacity-100 shadow-sm select-none" onclick="window.filterCollectionByMethod('${mName}')" data-method="${mName}" data-ring="${ringColor}">
                            <div class="flex items-center justify-between gap-1.5 w-full">
                                <span class="text-[11px] font-bold ${themeText} uppercase truncate">${icon}${mName}</span>
                                <span class="text-[9.5px] bg-slate-900/80 ${themeText} px-1.5 py-0.5 rounded-md font-bold shrink-0">${stats.count} জন</span>
                            </div>
                            <div class="text-base sm:text-lg font-black ${themeText} tracking-tight font-inter whitespace-nowrap">৳ ${formatAmountWithComma(stats.total)}</div>
                        </div>
                    `;
                }
            }
            cardsContainer.innerHTML = cardsHtml;
        }
        
    } catch (e) {
        console.error(e);
        tbody.innerHTML = `<tr><td colspan="5" class="text-center py-10 text-red-500">ডাটা লোড করতে সমস্যা হয়েছে</td></tr>`;
    }
}

export function filterCollectionByMethod(methodName) {
    const rows = document.querySelectorAll('.collection-list-row');
    let visibleTotal = 0;
    
    rows.forEach(row => {
        const rowMethod = row.getAttribute('data-method');
        // 'Less' transactions should always hide if filtering a specific method, or show if 'All'
        if (methodName === 'All' || rowMethod === methodName) {
            row.style.display = '';
            const amt = Number(row.getAttribute('data-amount')) || 0;
            visibleTotal = safeRound(visibleTotal + amt);
        } else {
            row.style.display = 'none';
        }
    });

    // Update active styles on buttons
    const btns = document.querySelectorAll('.method-card-btn');
    btns.forEach(btn => {
        const bm = btn.getAttribute('data-method');
        const ringColor = btn.getAttribute('data-ring') || 'ring-emerald-400';
        
        if (bm === methodName) {
            if (bm === 'All') {
                btn.classList.add('bg-emerald-600', 'ring-2', 'ring-emerald-400');
                btn.classList.remove('bg-emerald-600/50');
            } else {
                btn.classList.add('ring-2', ringColor, 'opacity-100');
                btn.classList.remove('opacity-70');
            }
        } else {
            if (bm === 'All') {
                btn.classList.remove('bg-emerald-600', 'ring-2', 'ring-emerald-400');
                btn.classList.add('bg-emerald-600/50');
            } else {
                btn.classList.remove('ring-2', ringColor, 'opacity-100');
                btn.classList.add('opacity-70');
            }
        }
    });

    // Update Summary Card
    const cardTotalEl = document.getElementById('dash-collection-card-total');
    const cardWordsEl = document.getElementById('dash-collection-card-words');
    const listTotalEl = document.getElementById('dash-collection-list-total');
    
    if (cardTotalEl) cardTotalEl.innerText = `৳ ${formatAmountWithComma(visibleTotal)}`;
    if (listTotalEl) listTotalEl.innerText = `৳ ${formatAmountWithComma(visibleTotal)}`;
    if (cardWordsEl) cardWordsEl.innerText = visibleTotal > 0 ? `${numberToBanglaWords(visibleTotal)}` : 'শূন্য টাকা মাত্র';
}

export function filterCollectionList(range, customStart = null, customEnd = null) {
    const today = getTodayLocalDateString();
    let start = today, end = today;
    
    // Update UI active states
    ['today', 'yesterday', 'week', 'month'].forEach(r => {
        const btn = document.getElementById(`btn-col-${r}`);
        if (btn) {
            if (r === range) {
                btn.classList.add('bg-emerald-600', 'text-white');
                btn.classList.remove('bg-slate-800', 'text-slate-300', 'bg-emerald-600/20', 'text-emerald-400');
            } else {
                btn.classList.remove('bg-emerald-600', 'text-white', 'bg-emerald-600/20', 'text-emerald-400');
                btn.classList.add('bg-slate-800', 'text-slate-300');
            }
        }
    });

    if (range === 'yesterday') {
        start = end = getYesterdayDBDate();
    } else if (range === 'week') {
        const d = new Date();
        d.setDate(d.getDate() - 6);
        start = toDBDate(d);
        end = today;
    } else if (range === 'month') {
        const d = new Date();
        d.setDate(d.getDate() - 29);
        start = toDBDate(d);
        end = today;
    } else if (range === 'custom' && customStart && customEnd) {
        start = customStart;
        end = customEnd;
    }
    
    // Update datepicker UI silently
    const dp = document.getElementById('collection-list-datepicker');
    if (dp && dp._flatpickr && range !== 'custom') {
        if (start === end) dp._flatpickr.setDate(start, false);
        else dp._flatpickr.setDate([start, end], false);
    }

    loadCollectionList(start, end);
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
}
