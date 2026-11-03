import { 
    getActiveSettlement, 
    recalculateActiveSettlement, 
    setSavedSettlementsList 
} from './container-state.js';
import { ContainerSettlementDAO } from './container-dao.js';
import { 
    formatAppDate,
    formatAmountWithComma, 
    numberToBanglaWords, 
    escapeHTML 
} from '../utils.js';
import * as actions from './container-actions.js';

let containerListenerUnsub = null;
let currentContainerElement = null;

// Register window global actions
window.containerActions = actions;

/**
 * Main View Renderer for Container Profit & Settlement Accounting
 * @param {HTMLElement} container View container element
 */
export function renderContainerSettlement(container) {
    if (!container) return;
    currentContainerElement = container;

    // Register UI refresh callback
    actions.registerUiRefresh(() => {
        if (currentContainerElement) {
            renderSalesCostsRows();
            renderProfitSharingRows();
            renderCapitalRows();
            updateLiveMetricsAndWords();
        }
    });

    // Ensure latest recalculation
    recalculateActiveSettlement();
    const st = getActiveSettlement();

    container.innerHTML = `
        <div class="space-y-6 animate-fade-in font-bn max-w-7xl mx-auto pb-12">
            <!-- Header Toolbar -->
            <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-slate-900/90 p-5 rounded-3xl border border-slate-800 backdrop-blur-xl shadow-2xl">
                <div>
                    <div class="flex items-center gap-3">
                        <div class="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 text-xl shadow-inner">
                            <i class="fa-solid fa-boxes-packing"></i>
                        </div>
                        <div>
                            <div class="flex items-center gap-2">
                                <h1 class="text-xl sm:text-2xl font-black text-white tracking-wide">কন্টেইনার পার্টনারশিপ হিসাব</h1>
                                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-teal-500/20 text-teal-300 border border-teal-500/30">
                                    <i class="fa-solid fa-handshake mr-1"></i> লাভ ও নিষ্পত্তি
                                </span>
                            </div>
                            <p class="text-xs text-slate-400 mt-0.5">কন্টেইনার মাল বিক্রয়, খরচ, পার্টনার লভ্যাংশ বণ্টন এবং এলসি মার্জিন সমন্বয় ব্যবস্থাপনা</p>
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                    <button type="button" onclick="window.containerActions.saveToCloud()" class="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-slate-950 font-black text-xs transition-all shadow-lg shadow-teal-500/20 active:scale-95 flex items-center gap-1.5 cursor-pointer">
                        <i class="fa-solid fa-cloud-arrow-up text-sm"></i>
                        <span>সংরক্ষণ করুন</span>
                    </button>
                    <button type="button" onclick="window.containerActions.openHistoryModal()" class="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sky-300 hover:text-white font-bold text-xs transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer" title="পূর্বের সংরক্ষিত কন্টেইনার অডিট লোড">
                        <i class="fa-solid fa-clock-rotate-left text-sm"></i>
                        <span class="hidden sm:inline">হিস্ট্রি</span>
                    </button>
                    <button type="button" onclick="window.containerActions.printReport()" class="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 hover:text-white font-bold text-xs transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer" title="অফিসিয়াল A4 ভাউচার প্রিন্ট">
                        <i class="fa-solid fa-print text-sm"></i>
                        <span class="hidden sm:inline">প্রিন্ট</span>
                    </button>
                    <button type="button" onclick="window.containerActions.exportExcel()" class="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-emerald-300 hover:text-white font-bold text-xs transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer" title="এক্সেল স্প্রেডশিট ডাউনলোড">
                        <i class="fa-solid fa-file-excel text-sm"></i>
                        <span class="hidden sm:inline">এক্সেল</span>
                    </button>
                    <button type="button" onclick="window.containerActions.newContainerPrompt()" class="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white font-bold text-xs transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer" title="নতুন কন্টেইনার হিসাব শুরু">
                        <i class="fa-solid fa-plus text-sm"></i>
                        <span class="hidden sm:inline">নতুন</span>
                    </button>
                </div>
            </div>

            <!-- Batch Title & Meta Details Bar -->
            <div class="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 backdrop-blur-md grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div class="md:col-span-6">
                    <label class="block text-[11px] font-black text-slate-400 mb-1">কন্টেইনার হিসাবের শিরোনাম ও বিবরণ</label>
                    <input type="text" id="cont-title-input" value="${escapeHTML(st.title)}" oninput="window.containerActions.handleTitleChange(this.value)" class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white font-black outline-none focus:border-teal-500 transition-all shadow-inner" placeholder="যেমন: ২৭ কন্টেইনার মাল বিক্রয় ও খরচের হিসাব (২০২৪/২০২৫)">
                </div>
                <div class="md:col-span-3">
                    <label class="block text-[11px] font-black text-slate-400 mb-1">অর্থবছর / পিরিয়ড</label>
                    <input type="text" id="cont-period-input" value="${escapeHTML(st.fiscalPeriod || '')}" oninput="window.containerActions.handlePeriodChange(this.value)" class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white font-bold outline-none focus:border-teal-500 transition-all" placeholder="২০২৪ - ২০২৫">
                </div>
                <div class="md:col-span-3">
                    <label class="block text-[11px] font-black text-slate-400 mb-1">হিসাব নিষ্পত্তির তারিখ</label>
                    <input type="text" id="cont-date-input" value="${escapeHTML(formatAppDate(st.settlementDate || ''))}" class="datepicker w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-teal-400 font-bold outline-none focus:border-teal-500 transition-all cursor-pointer">
                </div>
            </div>

            <!-- SECTION 1: Sales & Costs (মাল বিক্রয় ও খরচ সমন্বয়) -->
            <div class="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
                <div class="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div class="flex items-center gap-2">
                        <span class="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-xs">১</span>
                        <h2 class="text-base font-black text-white">মাল বিক্রয় ও খরচ সমন্বয় (কন্টেইনার লাভ নির্ণয়)</h2>
                    </div>
                    <button type="button" onclick="window.containerActions.addSalesCostRow()" class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-teal-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer">
                        <i class="fa-solid fa-plus text-xs"></i>
                        <span>নতুন বিক্রয় / খরচ যোগ</span>
                    </button>
                </div>

                <div id="cont-sales-costs-table" class="space-y-2">
                    <!-- Dynamic Rows Rendered by JS -->
                </div>

                <!-- Section 1 Summary Cards -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800/80">
                    <div class="bg-slate-950/70 p-3 rounded-xl border border-emerald-500/20">
                        <span class="text-[10px] font-black uppercase text-emerald-400">সর্বমোট মাল বিক্রয় (ক্যাশ/বকেয়া)</span>
                        <div id="summary-total-sales" class="text-base sm:text-lg font-black font-mono text-emerald-400 mt-0.5">৳ ০</div>
                    </div>
                    <div class="bg-slate-950/70 p-3 rounded-xl border border-red-500/20">
                        <span class="text-[10px] font-black uppercase text-red-400">সর্বমোট খরচ ও লেন্স</span>
                        <div id="summary-total-costs" class="text-base sm:text-lg font-black font-mono text-red-400 mt-0.5">৳ ০</div>
                    </div>
                    <div class="bg-emerald-950/30 p-3 rounded-xl border border-emerald-500/40 shadow-inner">
                        <span class="text-[10px] font-black uppercase text-emerald-300 flex items-center justify-between">
                            <span>সর্বমোট কন্টেইনার নিট লাভ</span>
                            <i class="fa-solid fa-circle-check text-emerald-400"></i>
                        </span>
                        <div id="summary-net-profit" class="text-lg sm:text-xl font-black font-mono text-emerald-300 mt-0.5">৳ ০</div>
                    </div>
                </div>
                <div id="summary-net-profit-words" class="text-[11px] font-bold text-emerald-400/90 bg-emerald-950/20 px-3 py-1.5 rounded-lg border border-emerald-900/40"></div>
            </div>

            <!-- SECTION 2: Profit Sharing (পার্টনারদের লভ্যাংশ বণ্টন) -->
            <div class="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
                <div class="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div class="flex items-center gap-2">
                        <span class="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-black text-xs">২</span>
                        <h2 class="text-base font-black text-white">পার্টনারদের লভ্যাংশ বণ্টন (ইকুইটি ও ওয়ার্কিং পার্সেন্টেজ)</h2>
                        <span id="badge-pct-status" class="px-2 py-0.5 rounded-full text-[10px] font-black"></span>
                    </div>
                    <button type="button" onclick="window.containerActions.addPartnerRow()" class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-blue-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer">
                        <i class="fa-solid fa-user-plus text-xs"></i>
                        <span>নতুন পার্টনার যোগ</span>
                    </button>
                </div>

                <div id="cont-profit-sharing-table" class="space-y-2">
                    <!-- Dynamic Partner Rows Rendered by JS -->
                </div>

                <!-- Section 2 Summary Footer -->
                <div class="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-blue-500/20 text-xs">
                    <div class="text-slate-300 font-bold">
                        মোট বণ্টিত লভ্যাংশ: <span id="summary-total-distributed" class="text-white font-black font-mono text-sm ml-1">৳ ০</span>
                    </div>
                    <div class="text-slate-400 font-bold">
                        মোট শতকরা: <span id="summary-total-percentage" class="text-blue-400 font-black font-mono text-sm ml-1">১০০%</span>
                    </div>
                </div>
            </div>

            <!-- SECTION 3: Capital & Waterfall Settlement (মূলধন, এলসি মার্জিন ও সমন্বয় নিষ্পত্তি) -->
            <div class="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
                <div class="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div class="flex items-center gap-2">
                        <span class="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-xs">৩</span>
                        <h2 class="text-base font-black text-white">মূলধন, এলসি মার্জিন ও মারফত সমন্বয় নিষ্পত্তি হিসাব</h2>
                    </div>
                    <button type="button" onclick="window.containerActions.addCapitalRow()" class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer">
                        <i class="fa-solid fa-plus text-xs"></i>
                        <span>নতুন মারফত / সমন্বয় যোগ</span>
                    </button>
                </div>

                <div id="cont-capital-table" class="space-y-2">
                    <!-- Dynamic Capital Rows Rendered by JS -->
                </div>

                <!-- Final Net Settled Balance Box -->
                <div class="p-4 rounded-xl bg-gradient-to-r from-sky-950/40 via-blue-950/30 to-slate-950 border border-sky-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
                    <div>
                        <span class="text-[11px] font-black uppercase text-sky-400 tracking-wider">সর্বমোট অবশিষ্ট সমন্বিত ব্যালেন্স</span>
                        <div id="summary-final-balance-words" class="text-xs font-bold text-slate-300 mt-0.5"></div>
                    </div>
                    <div id="summary-final-balance" class="text-2xl sm:text-3xl font-black font-mono text-sky-300">৳ ০</div>
                </div>
            </div>
        </div>
    `;

    // Render interactive dynamic rows
    renderSalesCostsRows();
    renderProfitSharingRows();
    renderCapitalRows();
    updateLiveMetricsAndWords();

    // Start background listener for saved settlements
    if (!containerListenerUnsub) {
        containerListenerUnsub = ContainerSettlementDAO.listen((list) => {
            setSavedSettlementsList(list);
        });
    }
}

/**
 * Render dynamic rows of Section 1 (Sales & Costs)
 */
function renderSalesCostsRows() {
    const listEl = document.getElementById('cont-sales-costs-table');
    if (!listEl) return;

    const st = getActiveSettlement();
    const rows = st.salesAndCosts || [];

    listEl.innerHTML = rows.map((row, idx) => {
        const isPlus = row.op === '+';
        return `
            <div class="flex items-center gap-2 p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors">
                <span class="w-6 text-center text-slate-500 font-bold text-xs">${idx + 1}</span>
                
                <!-- Operator Toggle Button (+ / -) -->
                <button type="button" 
                        onclick="window.containerActions.toggleRowOp('sc', ${idx})" 
                        class="w-16 py-1.5 rounded-lg font-black text-xs transition-all flex items-center justify-center gap-1 cursor-pointer select-none ${isPlus ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-red-500/20 text-red-400 border border-red-500/40'}"
                        title="ক্লিক করে যোগ বা বিয়োগ পরিবর্তন করুন">
                    <span>${isPlus ? '(+) আয়' : '(-) বাদ'}</span>
                </button>

                <!-- Description Input (Fully Editable) -->
                <input type="text" 
                       value="${escapeHTML(row.desc)}" 
                       oninput="window.containerActions.handleRowDescChange('sc', ${idx}, this.value)" 
                       placeholder="বিবরণ লিখুন..." 
                       class="flex-1 bg-slate-900 border border-slate-700/60 rounded-lg px-3 py-1.5 text-xs text-white font-bold outline-none focus:border-teal-500">

                <!-- Amount Input -->
                <div class="w-36 sm:w-44">
                    <input type="text" 
                           value="${formatAmountWithComma(row.amount)}" 
                           oninput="window.handleNumberInput(this); window.containerActions.handleRowAmountChange('sc', ${idx}, this.value)" 
                           placeholder="০" 
                           class="w-full bg-slate-900 border border-slate-700/60 rounded-lg px-3 py-1.5 text-xs text-right font-black font-mono outline-none focus:border-teal-500 ${isPlus ? 'text-emerald-400' : 'text-red-400'}">
                </div>

                <!-- Delete Button -->
                <button type="button" 
                        onclick="window.containerActions.removeRow('sc', ${idx})" 
                        class="w-8 h-8 rounded-lg bg-slate-900 hover:bg-red-500/20 text-slate-500 hover:text-red-400 border border-slate-800 flex items-center justify-center transition-colors cursor-pointer" 
                        title="লাইন মুছে ফেলুন">
                    <i class="fa-solid fa-trash-can text-xs"></i>
                </button>
            </div>
        `;
    }).join('');
}

/**
 * Render dynamic rows of Section 2 (Profit Sharing)
 */
function renderProfitSharingRows() {
    const listEl = document.getElementById('cont-profit-sharing-table');
    if (!listEl) return;

    const st = getActiveSettlement();
    const rows = st.profitSharing || [];

    listEl.innerHTML = rows.map((p, idx) => {
        return `
            <div class="flex items-center gap-2 p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors">
                <span class="w-6 text-center text-slate-500 font-bold text-xs">${idx + 1}</span>

                <!-- Partner Name Input -->
                <input type="text" 
                       value="${escapeHTML(p.partnerName)}" 
                       oninput="window.containerActions.handlePartnerFieldChange(${idx}, 'partnerName', this.value)" 
                       placeholder="পার্টনারের নাম..." 
                       class="w-32 sm:w-40 bg-slate-900 border border-slate-700/60 rounded-lg px-3 py-1.5 text-xs text-white font-black outline-none focus:border-blue-500">

                <!-- Share Type Input -->
                <input type="text" 
                       value="${escapeHTML(p.shareType || 'লভ্যাংশ')}" 
                       oninput="window.containerActions.handlePartnerFieldChange(${idx}, 'shareType', this.value)" 
                       placeholder="শেয়ারের ধরণ (যেমন: লভ্যাংশ/ওয়ার্কিং)..." 
                       class="flex-1 bg-slate-900 border border-slate-700/60 rounded-lg px-3 py-1.5 text-xs text-slate-300 font-bold outline-none focus:border-blue-500">

                <!-- Percentage Input -->
                <div class="w-20 sm:w-24 relative">
                    <input type="number" 
                           step="0.01" 
                           value="${p.percentage || 0}" 
                           oninput="window.containerActions.handlePartnerFieldChange(${idx}, 'percentage', this.value)" 
                           class="w-full bg-slate-900 border border-slate-700/60 rounded-lg pl-2 pr-6 py-1.5 text-xs text-center text-blue-400 font-black font-mono outline-none focus:border-blue-500">
                    <span class="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-xs pointer-events-none">%</span>
                </div>

                <!-- Calculated Amount Display / Input -->
                <div class="w-36 sm:w-44">
                    <input type="text" 
                           value="${formatAmountWithComma(p.calculatedAmount)}" 
                           oninput="window.handleNumberInput(this); window.containerActions.handlePartnerFieldChange(${idx}, 'calculatedAmount', this.value, true)" 
                           placeholder="০" 
                           class="w-full bg-slate-900 border border-slate-700/60 rounded-lg px-3 py-1.5 text-xs text-right font-black font-mono text-emerald-400 outline-none focus:border-blue-500">
                </div>

                <!-- Delete Button -->
                <button type="button" 
                        onclick="window.containerActions.removeRow('ps', ${idx})" 
                        class="w-8 h-8 rounded-lg bg-slate-900 hover:bg-red-500/20 text-slate-500 hover:text-red-400 border border-slate-800 flex items-center justify-center transition-colors cursor-pointer" 
                        title="পার্টনার মুছে ফেলুন">
                    <i class="fa-solid fa-trash-can text-xs"></i>
                </button>
            </div>
        `;
    }).join('');
}

/**
 * Render dynamic rows of Section 3 (Capital & Settlements)
 */
function renderCapitalRows() {
    const listEl = document.getElementById('cont-capital-table');
    if (!listEl) return;

    const st = getActiveSettlement();
    const rows = st.capitalSettlements || [];

    listEl.innerHTML = rows.map((row, idx) => {
        const isPlus = row.op === '+';
        return `
            <div class="flex items-center gap-2 p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors">
                <span class="w-6 text-center text-slate-500 font-bold text-xs">${idx + 1}</span>

                <!-- Operator Toggle Button (+ / -) -->
                <button type="button" 
                        onclick="window.containerActions.toggleRowOp('cs', ${idx})" 
                        class="w-16 py-1.5 rounded-lg font-black text-xs transition-all flex items-center justify-center gap-1 cursor-pointer select-none ${isPlus ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-red-500/20 text-red-400 border border-red-500/40'}"
                        title="ক্লিক করে প্লাস বা মাইনাস পরিবর্তন করুন">
                    <span>${isPlus ? '(+) যোগ' : '(-) বাদ'}</span>
                </button>

                <!-- Description Input (Fully Editable) -->
                <input type="text" 
                       value="${escapeHTML(row.desc)}" 
                       oninput="window.containerActions.handleRowDescChange('cs', ${idx}, this.value)" 
                       placeholder="সমন্বয়ের বিবরণ (যেমন: মূলধন / এলসি মার্জিন / মারফত পাওনা)..." 
                       class="flex-1 bg-slate-900 border border-slate-700/60 rounded-lg px-3 py-1.5 text-xs text-white font-bold outline-none focus:border-amber-500">

                <!-- Amount Input -->
                <div class="w-36 sm:w-44">
                    <input type="text" 
                           value="${formatAmountWithComma(row.amount)}" 
                           oninput="window.handleNumberInput(this); window.containerActions.handleRowAmountChange('cs', ${idx}, this.value)" 
                           placeholder="০" 
                           class="w-full bg-slate-900 border border-slate-700/60 rounded-lg px-3 py-1.5 text-xs text-right font-black font-mono outline-none focus:border-amber-500 ${isPlus ? 'text-emerald-400' : 'text-red-400'}">
                </div>

                <!-- Delete Button -->
                <button type="button" 
                        onclick="window.containerActions.removeRow('cs', ${idx})" 
                        class="w-8 h-8 rounded-lg bg-slate-900 hover:bg-red-500/20 text-slate-500 hover:text-red-400 border border-slate-800 flex items-center justify-center transition-colors cursor-pointer" 
                        title="লাইন মুছে ফেলুন">
                    <i class="fa-solid fa-trash-can text-xs"></i>
                </button>
            </div>
        `;
    }).join('');
}

/**
 * Update summary cards and Bengali words in real-time
 */
function updateLiveMetricsAndWords() {
    recalculateActiveSettlement();
    const st = getActiveSettlement();

    // Section 1 metrics
    const salesEl = document.getElementById('summary-total-sales');
    const costsEl = document.getElementById('summary-total-costs');
    const profitEl = document.getElementById('summary-net-profit');
    const profitWordsEl = document.getElementById('summary-net-profit-words');

    if (salesEl) salesEl.textContent = `৳ ${formatAmountWithComma(st.totalSales)}`;
    if (costsEl) costsEl.textContent = `৳ ${formatAmountWithComma(st.totalExpenses)}`;
    if (profitEl) profitEl.textContent = `৳ ${formatAmountWithComma(st.netProfit)}`;
    if (profitWordsEl) {
        profitWordsEl.textContent = st.netProfit > 0 
            ? `কথায়: ${numberToBanglaWords(st.netProfit)}`
            : 'কথায়: শূন্য টাকা মাত্র';
    }

    // Section 2 metrics
    const distEl = document.getElementById('summary-total-distributed');
    const pctEl = document.getElementById('summary-total-percentage');
    const pctBadge = document.getElementById('badge-pct-status');

    if (distEl) distEl.textContent = `৳ ${formatAmountWithComma(st.totalDistributedProfit)}`;
    if (pctEl) pctEl.textContent = `${st.totalPercentage}%`;
    if (pctBadge) {
        if (st.isPercentageBalanced) {
            pctBadge.className = 'px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
            pctBadge.innerHTML = '<i class="fa-solid fa-circle-check mr-1"></i> ১০০% পূর্ণ';
        } else {
            pctBadge.className = 'px-2 py-0.5 rounded-full text-[10px] font-black bg-red-500/20 text-red-400 border border-red-500/30';
            pctBadge.innerHTML = `<i class="fa-solid fa-triangle-exclamation mr-1"></i> ${st.totalPercentage}% (১০০% নয়)`;
        }
    }

    // Section 3 metrics
    const finalBalEl = document.getElementById('summary-final-balance');
    const finalWordsEl = document.getElementById('summary-final-balance-words');

    if (finalBalEl) finalBalEl.textContent = `৳ ${formatAmountWithComma(st.finalNetBalance)}`;
    if (finalWordsEl) {
        finalWordsEl.textContent = st.finalNetBalance > 0
            ? `কথায়: ${numberToBanglaWords(st.finalNetBalance)}`
            : 'কথায়: শূন্য টাকা মাত্র';
    }
}

/**
 * Cleanup listener when navigating away
 */
export function unsubscribeContainerSettlement() {
    if (containerListenerUnsub) {
        containerListenerUnsub();
        containerListenerUnsub = null;
    }
}
