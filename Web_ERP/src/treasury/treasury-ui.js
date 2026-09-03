import { TreasuryDAO } from './treasury-dao.js';
import { calculateTreasuryLedger, filterTreasuryByDateRange } from './treasury-calc.js';
import { setupTreasuryActions } from './treasury-actions.js';
import { printTreasuryReport, exportTreasuryExcel } from './treasury-print.js';
import { formatAmountWithComma, formatAppDate, escapeHTML, toDBDate, showToast } from '../utils.js';

let rawTransactions = [];
let openingFund = { openingBalance: 46709275, openingDate: '2026-08-29' };
let unsubscribeListener = null;
let currentFilterPeriod = 'all'; // 'all' | 'this_month' | 'last_month' | 'today' | 'custom'
let customStartDate = '';
let customEndDate = '';

/**
 * ️ Render Master Treasury & Fund Flow UI View
 */
export async function renderTreasuryUI(container) {
    if (unsubscribeListener) {
        unsubscribeListener();
        unsubscribeListener = null;
    }

    container.innerHTML = getTreasuryTemplate();

    // Bind Action Handlers
    setupTreasuryActions(() => ({
        allTransactions: rawTransactions,
        openingFund
    }));

    // Bind Print & Export
    window.treasuryHandlePrint = () => {
        const calculated = calculateTreasuryLedger(rawTransactions, openingFund.openingBalance);
        printTreasuryReport(calculated, { label: getFilterLabel() });
    };

    window.treasuryHandleExcel = () => {
        const calculated = calculateTreasuryLedger(rawTransactions, openingFund.openingBalance);
        exportTreasuryExcel(calculated, { label: getFilterLabel() });
    };

    window.treasurySetPeriod = (period) => {
        currentFilterPeriod = period;
        document.querySelectorAll('.tr-period-btn').forEach(b => {
            b.className = b.getAttribute('data-p') === period
                ? 'tr-period-btn px-3 py-1.5 rounded-xl text-xs font-black bg-amber-500 text-slate-950 shadow-md cursor-pointer'
                : 'tr-period-btn px-3 py-1.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer';
        });

        const todayObj = new Date();
        if (period === 'all') {
            customStartDate = ''; customEndDate = '';
        } else if (period === 'today') {
            customStartDate = customEndDate = toDBDate(todayObj);
        } else if (period === 'this_month') {
            const y = todayObj.getFullYear(), m = String(todayObj.getMonth() + 1).padStart(2, '0');
            customStartDate = `${y}-${m}-01`;
            customEndDate = toDBDate(todayObj);
        } else if (period === 'last_month') {
            const firstOfThis = new Date(todayObj.getFullYear(), todayObj.getMonth(), 1);
            const lastOfPrev = new Date(firstOfThis.getTime() - 86400000);
            const firstOfPrev = new Date(lastOfPrev.getFullYear(), lastOfPrev.getMonth(), 1);
            customStartDate = toDBDate(firstOfPrev);
            customEndDate = toDBDate(lastOfPrev);
        }
        renderLedgerTable();
    };

    // Load Opening Fund & Listen to Transactions
    try {
        openingFund = await TreasuryDAO.getOpeningFund();
        unsubscribeListener = TreasuryDAO.listenAll((list) => {
            rawTransactions = list;
            renderLedgerTable();
        });
    } catch (e) {
        console.error('Treasury init error:', e);
        showToast('ট্রেজারি ডাটা লোড ব্যর্থ হয়েছে!', 'error');
    }
}

/**
 * Recalculates and updates KPI cards and Ledger table
 */
function renderLedgerTable() {
    const calculated = calculateTreasuryLedger(rawTransactions, openingFund.openingBalance);
    const kpis = calculated.kpis;

    // Update KPIs
    const balEl = document.getElementById('tr-kpi-balance');
    if (balEl) balEl.innerText = `৳ ${formatAmountWithComma(kpis.currentBalance)}`;

    const opEl = document.getElementById('tr-kpi-opening');
    if (opEl) opEl.innerText = `৳ ${formatAmountWithComma(kpis.openingBalance)}`;

    const inEl = document.getElementById('tr-kpi-inflow');
    if (inEl) inEl.innerText = `৳ ${formatAmountWithComma(kpis.totalInflow)}`;

    const outEl = document.getElementById('tr-kpi-outflow');
    if (outEl) outEl.innerText = `৳ ${formatAmountWithComma(kpis.totalOutflow)}`;

    // Filter rows
    const filteredRows = filterTreasuryByDateRange(calculated.transactions, customStartDate, customEndDate);
    const tbody = document.getElementById('tr-ledger-tbody');
    if (!tbody) return;

    if (filteredRows.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center py-12 text-slate-500 font-bold text-sm">কোনো লেনদেন পাওয়া যায়নি।</td></tr>`;
        return;
    }

    let html = `
        <tr class="bg-amber-950/20 border-b border-amber-500/20 font-bold">
            <td class="py-3 px-3 text-center text-slate-500">-</td>
            <td class="py-3 px-3 text-amber-300 font-mono text-xs whitespace-nowrap">${formatAppDate(openingFund.openingDate)}</td>
            <td class="py-3 px-3 text-amber-400 font-black text-xs" colspan="2">
                <i class="fa-solid fa-vault text-amber-400 mr-1.5"></i>প্রারম্ভিক তহবিল স্থিতি (Brought Forward / B/F)
            </td>
            <td class="py-3 px-3 text-right text-slate-600 font-mono">-</td>
            <td class="py-3 px-3 text-right text-slate-600 font-mono">-</td>
            <td class="py-3 px-3 text-right text-emerald-400 font-mono font-black text-sm">৳ ${formatAmountWithComma(kpis.openingBalance)}</td>
            <td class="py-3 px-3 text-center text-slate-600">
                <button onclick="window.treasuryEditOpeningFund()" class="text-slate-400 hover:text-amber-400 p-1" title="প্রারম্ভিক তহবিল এডিট"><i class="fa-solid fa-pen-to-square"></i></button>
            </td>
        </tr>
    `;

    filteredRows.forEach((t, i) => {
        const isHighlight = t.isMonthEnd;
        const rowClass = isHighlight
            ? 'bg-amber-500/10 border-b border-amber-500/40 text-white'
            : 'border-b border-slate-800/80 hover:bg-slate-800/40 transition-colors';

        html += `
            <tr class="${rowClass}">
                <td class="py-2.5 px-3 text-center text-slate-400 text-xs font-mono">${i + 1}</td>
                <td class="py-2.5 px-3 text-slate-300 text-xs font-mono whitespace-nowrap">${formatAppDate(t.date)}</td>
                <td class="py-2.5 px-3 font-bold text-xs text-white">
                    ${escapeHTML(t.title)}
                    ${isHighlight ? '<span class="ml-2 text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">মাস সমাপ্তি</span>' : ''}
                </td>
                <td class="py-2.5 px-3 text-slate-400 text-xs">${escapeHTML(t.note || '-')}</td>
                <td class="py-2.5 px-3 text-right font-mono font-black text-xs text-emerald-400">
                    ${t.isInflow ? '৳ ' + formatAmountWithComma(t.amount) : '-'}
                </td>
                <td class="py-2.5 px-3 text-right font-mono font-black text-xs text-red-400">
                    ${!t.isInflow ? '৳ ' + formatAmountWithComma(t.amount) : '-'}
                </td>
                <td class="py-2.5 px-3 text-right font-mono font-black text-xs sm:text-sm text-white">
                    ৳ ${formatAmountWithComma(t.runningBalance)}
                </td>
                <td class="py-2.5 px-3 text-center space-x-1 whitespace-nowrap">
                    <button onclick="window.treasuryOpenSpecialTransaction(${JSON.stringify(t).replace(/"/g, '&quot;')})" class="text-blue-400 hover:text-blue-300 p-1" title="এডিট"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button onclick="window.treasuryDeleteItem('${t.id}', '${escapeHTML(t.title)}', ${t.amount})" class="text-red-400 hover:text-red-300 p-1" title="ডিলেট"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

function getFilterLabel() {
    if (currentFilterPeriod === 'all') return 'সব লেনদেন';
    if (currentFilterPeriod === 'this_month') return 'চলতি মাস';
    if (currentFilterPeriod === 'last_month') return 'গত মাস';
    if (currentFilterPeriod === 'today') return 'আজকের দিন';
    return `${formatAppDate(customStartDate)} থেকে ${formatAppDate(customEndDate)}`;
}

/**
 * Main HTML Template Skeleton
 */
function getTreasuryTemplate() {
    return `
        <div class="space-y-5">
            <!-- Top Header & Action Buttons -->
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800/80 p-4 sm:p-5 rounded-3xl shadow-xl">
                <div>
                    <div class="flex items-center gap-2">
                        <span class="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 text-lg">
                            <i class="fa-solid fa-vault"></i>
                        </span>
                        <div>
                            <h2 class="text-lg sm:text-xl font-black text-white">মাস্টার ট্রেজারি ও সেন্ট্রাল ফান্ড বহি</h2>
                            <p class="text-xs text-slate-400">মালিকের কেন্দ্রীয় মূলধন তহবিল ও লাইভ রানিং ব্যালেন্স লেজার</p>
                        </div>
                    </div>
                </div>
                <div class="flex items-center gap-2 flex-wrap">
                    <button onclick="window.treasuryOpenDailyCollection()" class="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 transition-all cursor-pointer">
                        <i class="fa-solid fa-hand-holding-dollar"></i><span>+ দৈনিক কালেকশন</span>
                    </button>
                    <button onclick="window.treasuryOpenDailyExpense()" class="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-black bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30 transition-all cursor-pointer">
                        <i class="fa-solid fa-wallet"></i><span>- দৈনিক খরচ</span>
                    </button>
                    <button onclick="window.treasuryOpenSpecialTransaction()" class="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-black bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg transition-all cursor-pointer">
                        <i class="fa-solid fa-plus"></i><span>বিশেষ লেনদেন</span>
                    </button>
                    <button onclick="window.treasuryHandlePrint()" class="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer">
                        <i class="fa-solid fa-print text-amber-400"></i><span>প্রিন্ট</span>
                    </button>
                    <button onclick="window.treasuryHandleExcel()" class="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer">
                        <i class="fa-solid fa-file-excel text-emerald-400"></i><span>এক্সেল</span>
                    </button>
                </div>
            </div>

            <!-- Top 4 KPI Cards -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div class="bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border border-amber-500/30 p-4 rounded-2xl">
                    <span class="text-[11px] font-bold text-amber-400 uppercase tracking-wider">বর্তমান নেট ফান্ড স্থিতি</span>
                    <h3 id="tr-kpi-balance" class="text-lg sm:text-2xl font-black text-amber-300 font-mono mt-1">৳ ০</h3>
                </div>
                <div class="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
                    <div class="flex items-center justify-between">
                        <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">প্রারম্ভিক তহবিল (B/F)</span>
                        <button onclick="window.treasuryEditOpeningFund()" class="text-xs text-amber-400 hover:underline"><i class="fa-solid fa-pen-to-square"></i></button>
                    </div>
                    <h3 id="tr-kpi-opening" class="text-base sm:text-xl font-black text-slate-200 font-mono mt-1">৳ ০</h3>
                </div>
                <div class="bg-slate-900/80 border border-emerald-500/20 p-4 rounded-2xl">
                    <span class="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">মোট ফান্ড বৃদ্ধি (+)</span>
                    <h3 id="tr-kpi-inflow" class="text-base sm:text-xl font-black text-emerald-400 font-mono mt-1">৳ ০</h3>
                </div>
                <div class="bg-slate-900/80 border border-red-500/20 p-4 rounded-2xl">
                    <span class="text-[11px] font-bold text-red-400 uppercase tracking-wider">মোট ফান্ড বহির্গমন (-)</span>
                    <h3 id="tr-kpi-outflow" class="text-base sm:text-xl font-black text-red-400 font-mono mt-1">৳ ০</h3>
                </div>
            </div>

            <!-- Period Filter Bar -->
            <div class="flex items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800 flex-wrap">
                <div class="flex items-center gap-1.5 flex-wrap">
                    <button data-p="all" onclick="window.treasurySetPeriod('all')" class="tr-period-btn px-3 py-1.5 rounded-xl text-xs font-black bg-amber-500 text-slate-950 shadow-md cursor-pointer">সব লেনদেন</button>
                    <button data-p="this_month" onclick="window.treasurySetPeriod('this_month')" class="tr-period-btn px-3 py-1.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer">চলতি মাস</button>
                    <button data-p="last_month" onclick="window.treasurySetPeriod('last_month')" class="tr-period-btn px-3 py-1.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer">গত মাস</button>
                    <button data-p="today" onclick="window.treasurySetPeriod('today')" class="tr-period-btn px-3 py-1.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer">আজ</button>
                </div>
            </div>

            <!-- Main Live Ledger Table -->
            <div class="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-slate-950/80 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                <th class="py-3 px-3 text-center w-12">ক্রম</th>
                                <th class="py-3 px-3 w-28">তারিখ</th>
                                <th class="py-3 px-3">বিবরণ / একাউন্ট</th>
                                <th class="py-3 px-3">মন্তব্য / বিবরণ নোট</th>
                                <th class="py-3 px-3 text-right w-32">ইনফ্লো (+)</th>
                                <th class="py-3 px-3 text-right w-32">আউটফ্লো (-)</th>
                                <th class="py-3 px-3 text-right w-36">রানিং ব্যালেন্স</th>
                                <th class="py-3 px-3 text-center w-20">অ্যাকশন</th>
                            </tr>
                        </thead>
                        <tbody id="tr-ledger-tbody">
                            <tr><td colspan="8" class="text-center py-8 text-slate-500 font-bold text-xs"><i class="fa-solid fa-spinner fa-spin mr-2"></i>ডাটা লোড হচ্ছে...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}
