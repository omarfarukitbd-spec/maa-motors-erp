import { fetchFinancialSummaryData } from './financial-summary-calc.js';
import { calculateClosingBalances, renderClosingBalanceView } from './financial-summary-closing.js';
import { renderCustomerTable, renderDayByDayTable, renderExpensesTable, renderMethodsGrid, renderAgingDueTab } from './financial-summary-ui-tables.js';
import { setupFinancialSummaryActions } from './financial-summary-ui-actions.js';
import { getFinancialSummaryTemplate } from './financial-summary-ui-template.js';
import { formatAmountWithComma, getTodayLocalDateString, formatAppDate, toDBDate, showToast } from '../utils.js';

let cachedSummaryData = null;
let currentActiveTab = 'customers'; // 'customers' | 'dayByDay' | 'expenses' | 'methods' | 'aging' | 'closing'
let currentEndDate = '';
let fpInstance = null;

/**
 * Render Financial Summary & Closing Center UI (100% Mobile & Desktop Responsive, Zero Emojis)
 */
export async function renderFinancialSummaryUI(container, initialParams = {}) {
    const today = getTodayLocalDateString();
    let startDate = initialParams.startDate || today;
    let endDate = initialParams.endDate || today;

    container.innerHTML = getFinancialSummaryTemplate();

    // Initialize Flatpickr range
    const dateInput = document.getElementById('fs-date-range-input');
    if (dateInput && typeof flatpickr !== 'undefined') {
        fpInstance = flatpickr(dateInput, {
            mode: 'range',
            dateFormat: 'Y-m-d',
            altInput: true,
            altFormat: 'd/m/Y',
            defaultDate: [startDate, endDate],
            onClose: (selectedDates) => {
                if (selectedDates.length === 2) {
                    const start = toDBDate(selectedDates[0]);
                    const end = toDBDate(selectedDates[1]);
                    showToast(`সময়কাল: ${formatAppDate(start)} থেকে ${formatAppDate(end)}`, 'info', 'ফিল্টার');
                    window.fsLoadData(start, end);
                } else if (selectedDates.length === 1) {
                    const single = toDBDate(selectedDates[0]);
                    showToast(`তারিখ: ${formatAppDate(single)}`, 'info', 'ফিল্টার');
                    window.fsLoadData(single, single);
                }
            }
        });
    }

    // Connect Actions Helper
    setupFinancialSummaryActions(() => ({ currentActiveTab, cachedSummaryData }));

    // Global Functions for UI Data Loading
    window.fsLoadData = async (sDate, eDate, retryCount = 0) => {
        currentEndDate = eDate;
        const periodText = document.getElementById('fs-selected-period-text');
        if (periodText) periodText.innerHTML = `<i class="fa-solid fa-spinner fa-spin text-emerald-400 mr-1"></i> হিসাব লোড হচ্ছে...`;

        try {
            cachedSummaryData = await fetchFinancialSummaryData(sDate, eDate);
            updateDashboardViews(cachedSummaryData);
            try {
                renderAgingDueTab();
            } catch (agingErr) {
                console.warn('Aging tab render warning:', agingErr);
            }
            if (currentActiveTab === 'closing') {
                window.fsLoadClosingBalances();
            }
        } catch (err) {
            console.error('FS load attempt error:', err);
            if (retryCount < 2) {
                setTimeout(() => {
                    window.fsLoadData(sDate, eDate, retryCount + 1);
                }, 600);
            } else {
                showToast('ডাটা লোড করতে সমস্যা হয়েছে! ইন্টারনেট সংযোগ চেক করুন।', 'error', 'আর্থিক রিপোর্ট');
                if (periodText) periodText.innerText = 'ডাটা লোড করতে সমস্যা হয়েছে।';
            }
        }
    };

    window.fsLoadClosingBalances = async () => {
        const container = document.getElementById('fs-closing-view-container');
        const targetDate = currentEndDate || getTodayLocalDateString();
        if (container) {
            container.innerHTML = `<div class="text-center py-12 text-slate-400 font-bold"><i class="fa-solid fa-spinner fa-spin mr-2 text-indigo-400"></i>${formatAppDate(targetDate)} তারিখ পর্যন্ত সমাপনী ব্যালেন্স হিসাব করা হচ্ছে...</div>`;
        }
        try {
            const closingData = await calculateClosingBalances(targetDate);
            if (closingData) {
                renderClosingBalanceView('fs-closing-view-container', closingData);
                const badge = document.getElementById('fs-badge-closing-count');
                if (badge) badge.innerText = '৳ ' + formatAmountWithComma(closingData.totalMarketDue);
            }
        } catch (e) {
            console.error('Closing balances load error:', e);
            if (container) container.innerHTML = `<div class="text-center py-12 text-red-400 font-bold">সমাপনী ব্যালেন্স লোড করতে সমস্যা হয়েছে!</div>`;
        }
    };

    window.fsSetPeriod = (period, isUserAction = false) => {
        document.querySelectorAll('.fs-preset-btn').forEach(btn => {
            if (btn.getAttribute('data-period') === period) {
                btn.className = 'fs-preset-btn px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-black bg-emerald-500 text-slate-950 shadow-md transition-all flex-1 sm:flex-none text-center cursor-pointer';
            } else {
                btn.className = 'fs-preset-btn px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-all active:scale-95 flex-1 sm:flex-none text-center cursor-pointer';
            }
        });

        const todayObj = new Date();
        let s = getTodayLocalDateString();
        let e = getTodayLocalDateString();
        let periodLabel = 'আজকের';

        if (period === 'today') {
            s = e = getTodayLocalDateString();
            periodLabel = 'আজকের';
        } else if (period === 'yesterday') {
            const y = new Date();
            y.setDate(y.getDate() - 1);
            s = e = toDBDate(y);
            periodLabel = 'গতকালের';
        } else if (period === 'this_week') {
            const w = new Date();
            w.setDate(w.getDate() - 6);
            s = toDBDate(w);
            e = getTodayLocalDateString();
            periodLabel = 'এই সপ্তাহের';
        } else if (period === 'this_month') {
            const year = todayObj.getFullYear();
            const month = String(todayObj.getMonth() + 1).padStart(2, '0');
            s = `${year}-${month}-01`;
            e = getTodayLocalDateString();
            periodLabel = 'চলতি মাসের';
        } else if (period === 'last_month') {
            const firstOfThisMonth = new Date(todayObj.getFullYear(), todayObj.getMonth(), 1);
            const lastOfPrevMonth = new Date(firstOfThisMonth.getTime() - 86400000);
            const firstOfPrevMonth = new Date(lastOfPrevMonth.getFullYear(), lastOfPrevMonth.getMonth(), 1);
            s = toDBDate(firstOfPrevMonth);
            e = toDBDate(lastOfPrevMonth);
            periodLabel = 'গত মাসের';
        } else if (period === 'this_year') {
            const year = todayObj.getFullYear();
            s = `${year}-01-01`;
            e = getTodayLocalDateString();
            periodLabel = 'চলতি বছরের';
        }

        if (fpInstance) fpInstance.setDate([s, e], false);
        if (isUserAction) showToast(`${periodLabel} হিসাব লোড করা হচ্ছে...`, 'info', 'সময়কাল ফিল্টার');
        window.fsLoadData(s, e);
    };

    window.fsSwitchTab = (tabName) => {
        currentActiveTab = tabName;
        document.querySelectorAll('.fs-tab-btn').forEach(b => {
            b.className = 'fs-tab-btn px-3.5 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer';
        });
        const activeBtn = document.getElementById(`fs-tab-btn-${tabName}`);
        if (activeBtn) activeBtn.className = 'fs-tab-btn px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shrink-0 bg-emerald-500 text-slate-950 shadow-md cursor-pointer';

        ['customers', 'dayByDay', 'aging', 'expenses', 'methods', 'closing'].forEach(t => {
            const el = document.getElementById(`fs-tab-content-${t}`);
            if (el) el.classList.toggle('hidden', t !== tabName);
        });

        const topPrintText = document.getElementById('fs-top-print-text');
        if (topPrintText) {
            topPrintText.innerText = tabName === 'closing' ? 'সমাপনী শিট প্রিন্ট' : 'আদায় শিট প্রিন্ট';
        }

        if (tabName === 'closing') {
            window.fsLoadClosingBalances();
            setTimeout(() => {
                const cEl = document.getElementById('fs-tab-content-closing');
                if (cEl) cEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    };

    // Load initial data for Today
    window.fsSetPeriod('today', false);
}

/**
 * Update UI DOM elements with calculated summary data
 */
function updateDashboardViews(data) {
    const periodText = document.getElementById('fs-selected-period-text');
    if (periodText) {
        const isSingle = data.startDate === data.endDate;
        periodText.innerHTML = isSingle 
            ? `<i class="fa-solid fa-calendar-day text-emerald-400 mr-1"></i> তারিখ: <strong class="text-white">${formatAppDate(data.startDate)}</strong>`
            : `<i class="fa-solid fa-calendar-week text-emerald-400 mr-1"></i> সময়কাল: <strong class="text-white">${formatAppDate(data.startDate)}</strong> থেকে <strong class="text-white">${formatAppDate(data.endDate)}</strong>`;
    }

    // Update KPI Numbers
    document.getElementById('fs-kpi-sales').innerText = `৳ ${formatAmountWithComma(data.totalSales)}`;
    document.getElementById('fs-kpi-sales-sub').innerText = `${data.salesCount} টি ইনভয়েস`;

    document.getElementById('fs-kpi-collection').innerText = `৳ ${formatAmountWithComma(data.totalCollection)}`;
    document.getElementById('fs-kpi-collection-sub').innerText = `ক্যাশ: ৳ ${formatAmountWithComma(data.cashCollection)} | ব্যাংক: ৳ ${formatAmountWithComma(data.bankCollection)}`;

    document.getElementById('fs-kpi-expense').innerText = `৳ ${formatAmountWithComma(data.totalExpenses)}`;
    document.getElementById('fs-kpi-expense-sub').innerText = `${data.rawExpenses.length} টি খরচের ভাউচার`;

    const netEl = document.getElementById('fs-kpi-net');
    netEl.innerText = `৳ ${formatAmountWithComma(data.netCashFlow)}`;
    netEl.className = data.netCashFlow >= 0 
        ? 'text-lg sm:text-2xl lg:text-3xl font-black text-emerald-400 tracking-tight font-inter'
        : 'text-lg sm:text-2xl lg:text-3xl font-black text-rose-400 tracking-tight font-inter';

    // Update Badges
    const custBadge = document.getElementById('fs-badge-cust-count');
    if (custBadge) custBadge.innerText = `${data.customerCollections.length} জন`;

    const daysBadge = document.getElementById('fs-badge-days-count');
    if (daysBadge) daysBadge.innerText = `${data.dayByDaySummary.length} দিন`;

    // Render Tables via modular sub-modules
    renderCustomerTable(data);
    renderDayByDayTable(data);
    renderExpensesTable(data);
    renderMethodsGrid(data);
}
