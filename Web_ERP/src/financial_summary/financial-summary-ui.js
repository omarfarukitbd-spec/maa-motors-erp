import { fetchFinancialSummaryData } from './financial-summary-calc.js';
import { printCustomerCollectionRegister, printDayByDayMonthlyRegister } from './financial-summary-print.js';
import { openCashReconciliationModal } from './financial-summary-cash-modal.js';
import { shareDailyClosingViaWhatsApp } from './financial-summary-whatsapp.js';
import { calculateAgingDueData, sendAgingCustomerWhatsApp, sendAgingCustomerSMS } from './financial-summary-aging.js';
import { formatAmountWithComma, getTodayLocalDateString, formatAppDate, toDBDate, showToast } from '../utils.js';

let cachedSummaryData = null;
let currentActiveTab = 'customers'; // 'customers' | 'dayByDay' | 'expenses' | 'methods' | 'aging'
let fpInstance = null;

/**
 * Render Financial Summary & Closing Center UI (100% Mobile & Desktop Responsive, Zero Emojis)
 */
export async function renderFinancialSummaryUI(container, initialParams = {}) {
    const today = getTodayLocalDateString();
    let startDate = initialParams.startDate || today;
    let endDate = initialParams.endDate || today;

    container.innerHTML = `
        <div class="space-y-4 sm:space-y-5 font-bn pb-28 lg:pb-10 max-w-7xl mx-auto px-1 sm:px-2">
            <!-- Header & Period Filter Bar -->
            <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3.5 sm:gap-4 bg-slate-900/70 p-4 sm:p-5 rounded-3xl border border-slate-800 backdrop-blur-xl shadow-xl">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-lg sm:text-xl shadow-inner shrink-0">
                        <i class="fa-solid fa-file-invoice-dollar"></i>
                    </div>
                    <div>
                        <h1 class="text-lg sm:text-2xl font-black text-white tracking-tight">সার্বিক আর্থিক বিবরণী ও ক্লোজিং রেজিস্টার</h1>
                        <p class="text-[11px] sm:text-xs text-slate-400 font-bold">বিক্রয়, কাস্টমার আদায়, খরচ ও ক্যাশ-ফ্লো নিয়ন্ত্রণ কেন্দ্র</p>
                    </div>
                </div>

                <!-- Date Range & Preset Selector -->
                <div class="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                    <div class="flex flex-wrap items-center bg-slate-950/90 border border-slate-800 rounded-2xl p-1 gap-1 w-full sm:w-auto justify-between sm:justify-start">
                        <button onclick="window.fsSetPeriod('today', true)" class="fs-preset-btn px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-all active:scale-95 flex-1 sm:flex-none text-center cursor-pointer" data-period="today">আজ</button>
                        <button onclick="window.fsSetPeriod('yesterday', true)" class="fs-preset-btn px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-all active:scale-95 flex-1 sm:flex-none text-center cursor-pointer" data-period="yesterday">গতকাল</button>
                        <button onclick="window.fsSetPeriod('this_week', true)" class="fs-preset-btn px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-all active:scale-95 flex-1 sm:flex-none text-center cursor-pointer" data-period="this_week">এই সপ্তাহ</button>
                        <button onclick="window.fsSetPeriod('this_month', true)" class="fs-preset-btn px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-all active:scale-95 flex-1 sm:flex-none text-center cursor-pointer" data-period="this_month">এই মাস</button>
                        <button onclick="window.fsSetPeriod('this_year', true)" class="fs-preset-btn px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-all active:scale-95 flex-1 sm:flex-none text-center cursor-pointer" data-period="this_year">চলতি বছর</button>
                    </div>

                    <!-- Custom Range Input (Clean isolated range datepicker) -->
                    <div class="relative w-full sm:w-auto">
                        <input type="text" id="fs-date-range-input" class="w-full sm:w-48 bg-slate-950/90 border border-slate-700/80 rounded-2xl px-3 py-2 text-xs font-bold text-emerald-400 font-mono cursor-pointer text-center outline-none focus:border-emerald-500 shadow-inner" placeholder="কাস্টম রেঞ্জ...">
                    </div>
                </div>
            </div>

            <!-- Quick Action Toolbar (WhatsApp, Cash Counter, Print & Export) -->
            <div class="flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-3 bg-slate-950/60 p-3 sm:p-3.5 rounded-2xl border border-slate-800/80">
                <div class="flex items-center gap-2 text-xs font-bold text-slate-400">
                    <i class="fa-solid fa-clock-rotate-left text-blue-400"></i>
                    <span id="fs-selected-period-text">ডাটা লোড হচ্ছে...</span>
                </div>
                <div class="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    <!-- Feature 1: Cash Counter Button -->
                    <button onclick="window.fsOpenCashCounter()" class="px-3.5 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-black rounded-xl shadow-md border border-amber-400/30 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer" title="ক্যাশ ড্রয়ার নোট গণনা ও মেলানো">
                        <i class="fa-solid fa-money-bill-wave"></i>
                        <span>ক্যাশ কাউন্টার</span>
                    </button>

                    <!-- Feature 3: WhatsApp Closing Button -->
                    <button onclick="window.fsShareWhatsApp()" class="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black rounded-xl shadow-md border border-emerald-400/30 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer" title="বসের WhatsApp-এ ক্লোজিং পাঠান">
                        <i class="fa-brands fa-whatsapp text-sm"></i>
                        <span>WhatsApp ক্লোজিং</span>
                    </button>

                    <!-- Print Collection Register -->
                    <button onclick="window.fsPrintCustomerRegister()" class="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black rounded-xl shadow-md border border-blue-400/30 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer" title="কাস্টমার আদায় শিট প্রিন্ট">
                        <i class="fa-solid fa-print"></i>
                        <span class="hidden md:inline">আদায় শিট</span><span>প্রিন্ট (A4)</span>
                    </button>

                    <!-- Print Monthly Audit -->
                    <button onclick="window.fsPrintMonthlyAudit()" class="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer" title="তারিখভিত্তিক অডিট শিট প্রিন্ট">
                        <i class="fa-solid fa-file-lines text-blue-400"></i>
                        <span>অডিট শিট</span>
                    </button>

                    <!-- Export Excel -->
                    <button onclick="window.fsExportExcel()" class="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold rounded-xl border border-slate-700 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer" title="এক্সেল ডাউনলোড">
                        <i class="fa-solid fa-file-excel text-emerald-400"></i>
                        <span class="hidden sm:inline text-[11px]">Excel</span>
                    </button>
                </div>
            </div>

            <!-- Hero KPI Metric Cards -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
                <!-- 1. Total Sales -->
                <div class="bg-gradient-to-br from-blue-950/40 via-slate-900/60 to-slate-950/80 p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-blue-500/20 shadow-xl relative overflow-hidden group">
                    <div class="flex justify-between items-start mb-1 sm:mb-2">
                        <span class="text-[11px] sm:text-xs font-black text-blue-400 uppercase tracking-wider">মোট বিক্রয়</span>
                        <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center text-xs sm:text-sm"><i class="fa-solid fa-cart-shopping"></i></div>
                    </div>
                    <h3 id="fs-kpi-sales" class="text-lg sm:text-2xl lg:text-3xl font-black text-white tracking-tight font-inter">৳ ০</h3>
                    <p id="fs-kpi-sales-sub" class="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 sm:mt-1 font-bold">০ টি ইনভয়েস</p>
                </div>

                <!-- 2. Total Collection -->
                <div class="bg-gradient-to-br from-emerald-950/40 via-slate-900/60 to-slate-950/80 p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-emerald-500/30 shadow-xl relative overflow-hidden group">
                    <div class="flex justify-between items-start mb-1 sm:mb-2">
                        <span class="text-[11px] sm:text-xs font-black text-emerald-400 uppercase tracking-wider">সর্বমোট আদায়</span>
                        <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs sm:text-sm"><i class="fa-solid fa-coins"></i></div>
                    </div>
                    <h3 id="fs-kpi-collection" class="text-lg sm:text-2xl lg:text-3xl font-black text-emerald-400 tracking-tight font-inter">৳ ০</h3>
                    <p id="fs-kpi-collection-sub" class="text-[10px] sm:text-[11px] text-emerald-300/80 mt-0.5 sm:mt-1 font-bold">ক্যাশ ও ব্যাংক</p>
                </div>

                <!-- 3. Total Expenses -->
                <div class="bg-gradient-to-br from-rose-950/40 via-slate-900/60 to-slate-950/80 p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-rose-500/20 shadow-xl relative overflow-hidden group">
                    <div class="flex justify-between items-start mb-1 sm:mb-2">
                        <span class="text-[11px] sm:text-xs font-black text-rose-400 uppercase tracking-wider">মোট খরচ</span>
                        <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center text-xs sm:text-sm"><i class="fa-solid fa-wallet"></i></div>
                    </div>
                    <h3 id="fs-kpi-expense" class="text-lg sm:text-2xl lg:text-3xl font-black text-rose-400 tracking-tight font-inter">৳ ০</h3>
                    <p id="fs-kpi-expense-sub" class="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 sm:mt-1 font-bold">দোকান খরচ</p>
                </div>

                <!-- 4. Net Cash Flow -->
                <div class="bg-gradient-to-br from-purple-950/40 via-slate-900/60 to-slate-950/80 p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-purple-500/20 shadow-xl relative overflow-hidden group">
                    <div class="flex justify-between items-start mb-1 sm:mb-2">
                        <span class="text-[11px] sm:text-xs font-black text-purple-400 uppercase tracking-wider">নিট ক্যাশ ফ্লো</span>
                        <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center text-xs sm:text-sm"><i class="fa-solid fa-chart-line"></i></div>
                    </div>
                    <h3 id="fs-kpi-net" class="text-lg sm:text-2xl lg:text-3xl font-black text-white tracking-tight font-inter">৳ ০</h3>
                    <p id="fs-kpi-net-sub" class="text-[10px] sm:text-[11px] text-purple-300 mt-0.5 sm:mt-1 font-bold">আদায় - খরচ</p>
                </div>
            </div>

            <!-- Tabbed Detailed Breakdowns (5 Tabs) -->
            <div class="bg-slate-900/60 rounded-3xl border border-slate-800/80 overflow-hidden shadow-2xl backdrop-blur-xl">
                <!-- Navigation Tabs (Horizontally Scrollable on Mobile) -->
                <div class="flex items-center gap-1.5 sm:gap-2 p-2.5 sm:p-4 border-b border-slate-800 bg-slate-950/60 overflow-x-auto custom-scrollbar no-scrollbar">
                    <button onclick="window.fsSwitchTab('customers')" id="fs-tab-btn-customers" class="fs-tab-btn px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shrink-0 bg-emerald-500 text-slate-950 shadow-md cursor-pointer">
                        <i class="fa-solid fa-users"></i>
                        <span>কাস্টমার আদায় তালিকা</span>
                        <span id="fs-badge-cust-count" class="bg-slate-900 text-emerald-400 px-1.5 py-0.5 rounded-full text-[9.5px] font-bold">০</span>
                    </button>
                    <button onclick="window.fsSwitchTab('dayByDay')" id="fs-tab-btn-dayByDay" class="fs-tab-btn px-3.5 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer">
                        <i class="fa-solid fa-calendar-day"></i>
                        <span>দৈনিক সারাংশ</span>
                        <span id="fs-badge-days-count" class="bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded-full text-[9.5px] font-bold">০ দিন</span>
                    </button>
                    <button onclick="window.fsSwitchTab('aging')" id="fs-tab-btn-aging" class="fs-tab-btn px-3.5 py-2 rounded-xl text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-all flex items-center gap-1.5 shrink-0 border border-rose-500/20 cursor-pointer">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                        <span>অচল বকেয়া ও এজিং</span>
                        <span id="fs-badge-aging-count" class="bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded-full text-[9.5px] font-bold">বকেয়া</span>
                    </button>
                    <button onclick="window.fsSwitchTab('expenses')" id="fs-tab-btn-expenses" class="fs-tab-btn px-3.5 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer">
                        <i class="fa-solid fa-receipt"></i>
                        <span>খরচের বিবরণী</span>
                    </button>
                    <button onclick="window.fsSwitchTab('methods')" id="fs-tab-btn-methods" class="fs-tab-btn px-3.5 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer">
                        <i class="fa-solid fa-building-columns"></i>
                        <span>পদ্ধতি ও ব্যাংক</span>
                    </button>
                </div>

                <!-- Tab Contents -->
                <div class="p-3 sm:p-5">
                    <!-- Tab 1: Customer Collections Table -->
                    <div id="fs-tab-content-customers" class="space-y-3">
                        <div class="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2 mb-2">
                            <input type="text" id="fs-cust-search" oninput="window.fsFilterCustomerRows(this.value)" placeholder="তালিকায় খুঁজুন (নাম, ফোন, A/C)..." class="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-emerald-500 w-full sm:w-72 shadow-inner">
                            <span class="text-[11px] text-slate-400 font-bold text-right" id="fs-cust-table-status"></span>
                        </div>
                        <div class="overflow-x-auto custom-scrollbar rounded-2xl border border-slate-800/80">
                            <table class="w-full text-left text-xs border-collapse min-w-[700px]">
                                <thead>
                                    <tr class="bg-slate-950 text-slate-400 font-bold border-b border-slate-800 uppercase tracking-wider text-[10.5px]">
                                        <th class="py-2.5 px-3 text-center w-10">SL</th>
                                        <th class="py-2.5 px-3 text-center">তারিখ</th>
                                        <th class="py-2.5 px-3 text-center">A/C নং</th>
                                        <th class="py-2.5 px-3">কাস্টমার ও মোবাইল</th>
                                        <th class="py-2.5 px-3">জোন</th>
                                        <th class="py-2.5 px-3 text-center">ভাউচার</th>
                                        <th class="py-2.5 px-3 text-center">মেথড</th>
                                        <th class="py-2.5 px-3 text-right">আদায় (৳)</th>
                                        <th class="py-2.5 px-3 text-right">অবশিষ্ট বাকি (৳)</th>
                                    </tr>
                                </thead>
                                <tbody id="fs-customer-tbody" class="divide-y divide-slate-800/50">
                                    <tr><td colspan="9" class="text-center py-8 text-slate-500">ডাটা লোড হচ্ছে...</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Tab 2: Day-by-Day Summary Table -->
                    <div id="fs-tab-content-dayByDay" class="hidden space-y-3">
                        <div class="overflow-x-auto custom-scrollbar rounded-2xl border border-slate-800/80">
                            <table class="w-full text-left text-xs border-collapse min-w-[750px]">
                                <thead>
                                    <tr class="bg-slate-950 text-slate-400 font-bold border-b border-slate-800 uppercase tracking-wider text-[10.5px]">
                                        <th class="py-2.5 px-3 text-center">তারিখ</th>
                                        <th class="py-2.5 px-3 text-center">খদ্দের</th>
                                        <th class="py-2.5 px-3 text-right">বিক্রয় (৳)</th>
                                        <th class="py-2.5 px-3 text-right">ক্যাশ (৳)</th>
                                        <th class="py-2.5 px-3 text-right">ব্যাংক (৳)</th>
                                        <th class="py-2.5 px-3 text-right text-emerald-400">মোট আদায় (৳)</th>
                                        <th class="py-2.5 px-3 text-right text-rose-400">খরচ (৳)</th>
                                        <th class="py-2.5 px-3 text-right text-purple-400">নিট ক্যাশ (৳)</th>
                                        <th class="py-2.5 px-3 text-center">অ্যাকশন</th>
                                    </tr>
                                </thead>
                                <tbody id="fs-daybyday-tbody" class="divide-y divide-slate-800/50"></tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Tab 3: Aging Due & Defaulter Recovery Table -->
                    <div id="fs-tab-content-aging" class="hidden space-y-4">
                        <!-- 4 Aging Summary Tier Cards -->
                        <div class="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5" id="fs-aging-cards-grid"></div>

                        <!-- Aging Filter & Table -->
                        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                            <div class="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto max-w-full">
                                <button onclick="window.fsFilterAgingBracket('all')" class="aging-filter-btn px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-800 text-white cursor-pointer" data-tier="all">সব বকেয়া</button>
                                <button onclick="window.fsFilterAgingBracket('tier90_plus')" class="aging-filter-btn px-2.5 py-1 text-[11px] font-bold rounded-lg text-rose-400 hover:bg-rose-950/40 cursor-pointer flex items-center gap-1" data-tier="tier90_plus"><span class="w-2 h-2 rounded-full bg-rose-500 inline-block"></span> ৯০+ দিন</button>
                                <button onclick="window.fsFilterAgingBracket('tier61_90')" class="aging-filter-btn px-2.5 py-1 text-[11px] font-bold rounded-lg text-orange-400 hover:bg-orange-950/40 cursor-pointer flex items-center gap-1" data-tier="tier61_90"><span class="w-2 h-2 rounded-full bg-orange-500 inline-block"></span> ৬১-৯০ দিন</button>
                                <button onclick="window.fsFilterAgingBracket('tier31_60')" class="aging-filter-btn px-2.5 py-1 text-[11px] font-bold rounded-lg text-amber-400 hover:bg-amber-950/40 cursor-pointer flex items-center gap-1" data-tier="tier31_60"><span class="w-2 h-2 rounded-full bg-amber-500 inline-block"></span> ৩১-৬০ দিন</button>
                            </div>
                            <input type="text" id="fs-aging-search" oninput="window.fsFilterAgingRows(this.value)" placeholder="বকেয়া তালিকায় সার্চ..." class="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-rose-500 w-full sm:w-60">
                        </div>

                        <div class="overflow-x-auto custom-scrollbar rounded-2xl border border-slate-800/80">
                            <table class="w-full text-left text-xs border-collapse min-w-[700px]">
                                <thead>
                                    <tr class="bg-slate-950 text-slate-400 font-bold border-b border-slate-800 uppercase tracking-wider text-[10.5px]">
                                        <th class="py-2.5 px-3 text-center">A/C</th>
                                        <th class="py-2.5 px-3">কাস্টমার ও মোবাইল</th>
                                        <th class="py-2.5 px-3">জোন</th>
                                        <th class="py-2.5 px-3 text-center">অচল থাকার সময়</th>
                                        <th class="py-2.5 px-3 text-right text-rose-400">মোট বকেয়া (৳)</th>
                                        <th class="py-2.5 px-3 text-center">তাগাদা অ্যাকশন</th>
                                    </tr>
                                </thead>
                                <tbody id="fs-aging-tbody" class="divide-y divide-slate-800/50"></tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Tab 4: Expenses Table -->
                    <div id="fs-tab-content-expenses" class="hidden space-y-3">
                        <div class="overflow-x-auto custom-scrollbar rounded-2xl border border-slate-800/80">
                            <table class="w-full text-left text-xs border-collapse min-w-[600px]">
                                <thead>
                                    <tr class="bg-slate-950 text-slate-400 font-bold border-b border-slate-800 uppercase tracking-wider text-[10.5px]">
                                        <th class="py-2.5 px-3 text-center">তারিখ</th>
                                        <th class="py-2.5 px-3">খরচের বিবরণ / নোট</th>
                                        <th class="py-2.5 px-3">ক্যাটাগরি</th>
                                        <th class="py-2.5 px-3 text-center">পেমেন্ট মেথড</th>
                                        <th class="py-2.5 px-3 text-right text-rose-400">পরিমাণ (৳)</th>
                                    </tr>
                                </thead>
                                <tbody id="fs-expenses-tbody" class="divide-y divide-slate-800/50"></tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Tab 5: Payment Methods Breakdown -->
                    <div id="fs-tab-content-methods" class="hidden">
                        <div id="fs-methods-grid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5"></div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Initialize Flatpickr range on input cleanly
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

    // Global Functions for the UI
    window.fsLoadData = async (sDate, eDate, retryCount = 0) => {
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
        } else if (period === 'this_year') {
            const year = todayObj.getFullYear();
            s = `${year}-01-01`;
            e = getTodayLocalDateString();
            periodLabel = 'চলতি বছরের';
        }

        if (fpInstance) {
            fpInstance.setDate([s, e], false);
        }

        if (isUserAction) {
            showToast(`${periodLabel} হিসাব লোড করা হচ্ছে...`, 'info', 'সময়কাল ফিল্টার');
        }
        window.fsLoadData(s, e);
    };

    window.fsSwitchTab = (tabName) => {
        currentActiveTab = tabName;
        document.querySelectorAll('.fs-tab-btn').forEach(b => {
            b.className = 'fs-tab-btn px-3.5 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer';
        });
        const activeBtn = document.getElementById(`fs-tab-btn-${tabName}`);
        if (activeBtn) activeBtn.className = 'fs-tab-btn px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shrink-0 bg-emerald-500 text-slate-950 shadow-md cursor-pointer';

        ['customers', 'dayByDay', 'aging', 'expenses', 'methods'].forEach(t => {
            const el = document.getElementById(`fs-tab-content-${t}`);
            if (el) el.classList.toggle('hidden', t !== tabName);
        });
    };

    window.fsFilterCustomerRows = (query) => {
        const q = (query || '').toLowerCase().trim();
        let matchCount = 0;
        document.querySelectorAll('.fs-cust-row').forEach(row => {
            const txt = row.innerText.toLowerCase();
            const matches = txt.includes(q);
            row.style.display = matches ? '' : 'none';
            if (matches) matchCount++;
        });

        const statusEl = document.getElementById('fs-cust-table-status');
        if (statusEl) {
            statusEl.innerText = q ? `ফিল্টার অনুযায়ী পাওয়া গেছে: ${matchCount} জন` : '';
        }
    };

    window.fsOpenCashCounter = () => {
        if (!cachedSummaryData) {
            return showToast('হিসাব প্রস্তুত হচ্ছে, এক মুহূর্ত অপেক্ষা করুন...', 'info', 'ক্যাশ কাউন্টার');
        }
        const sysCash = cachedSummaryData ? cachedSummaryData.cashCollection : 0;
        openCashReconciliationModal(sysCash);
    };

    window.fsShareWhatsApp = () => {
        if (!cachedSummaryData) {
            return showToast('হিসাব প্রস্তুত হচ্ছে, এক মুহূর্ত অপেক্ষা করুন...', 'info', 'WhatsApp ক্লোজিং');
        }
        shareDailyClosingViaWhatsApp(cachedSummaryData);
    };

    window.fsPrintCustomerRegister = () => {
        if (!cachedSummaryData) {
            return showToast('ডাটা লোড হচ্ছে, অপেক্ষা করুন...', 'info', 'প্রিন্ট');
        }
        if (cachedSummaryData.customerCollections.length === 0) {
            return showToast('নির্বাচিত তারিখে প্রিন্ট করার মতো কোনো কাস্টমার আদায়ের রেকর্ড নেই!', 'warning', 'প্রিন্ট');
        }
        showToast('কাস্টমার আদায় শিট প্রিন্ট প্রস্তুত হচ্ছে...', 'info', 'প্রিন্ট');
        printCustomerCollectionRegister(cachedSummaryData);
    };

    window.fsPrintMonthlyAudit = () => {
        if (!cachedSummaryData) {
            return showToast('ডাটা লোড হচ্ছে, অপেক্ষা করুন...', 'info', 'প্রিন্ট');
        }
        if (cachedSummaryData.dayByDaySummary.length === 0) {
            return showToast('নির্বাচিত সময়ে প্রিন্ট করার মতো কোনো দৈনিক সারাংশ রেকর্ড নেই!', 'warning', 'প্রিন্ট');
        }
        showToast('অডিট শিট প্রিন্ট প্রস্তুত হচ্ছে...', 'info', 'প্রিন্ট');
        printDayByDayMonthlyRegister(cachedSummaryData);
    };

    window.fsExportExcel = () => {
        if (!cachedSummaryData) {
            return showToast('ডাটা লোড হচ্ছে, অপেক্ষা করুন...', 'info', 'Excel');
        }
        if (cachedSummaryData.customerCollections.length === 0) {
            return showToast('এক্সেল ডাউনলোড করার মতো কোনো আদায়ের রেকর্ড নেই!', 'warning', 'Excel');
        }
        if (!window.XLSX) {
            return showToast('এক্সেল ইঞ্জিন লোড হচ্ছে, পুনরায় চেষ্টা করুন...', 'warning', 'Excel');
        }
        try {
            const rows = cachedSummaryData.customerCollections.map((c, i) => ({
                'SL': i + 1,
                'তারিখ': c.date,
                'A/C নং': c.customerAccountNo,
                'কাস্টমারের নাম': c.customerName,
                'মোবাইল': c.customerPhone,
                'জোন': c.customerZone,
                'ভাউচার নং': c.voucherNo,
                'পেমেন্ট মেথড': c.receivedType,
                'আদায় (৳)': c.amount,
                'অবশিষ্ট বাকি (৳)': c.currentDue
            }));
            const ws = XLSX.utils.json_to_sheet(rows);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "আদায় তালিকা");
            XLSX.writeFile(wb, `Maa_Motors_Collection_${cachedSummaryData.startDate}_to_${cachedSummaryData.endDate}.xlsx`);
            showToast('এক্সেল ফাইল ডাউনলোড সম্পন্ন হয়েছে!', 'success', 'Excel');
        } catch (e) {
            console.error('Excel error:', e);
            showToast('এক্সেল ফাইল তৈরিতে সমস্যা হয়েছে!', 'error', 'Excel');
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

    // KPIs
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

    // Badges
    const custBadge = document.getElementById('fs-badge-cust-count');
    if (custBadge) custBadge.innerText = `${data.customerCollections.length} জন`;

    const daysBadge = document.getElementById('fs-badge-days-count');
    if (daysBadge) daysBadge.innerText = `${data.dayByDaySummary.length} দিন`;

    // 1. Render Customer Table
    const custTbody = document.getElementById('fs-customer-tbody');
    if (custTbody) {
        if (data.customerCollections.length === 0) {
            custTbody.innerHTML = `<tr><td colspan="9" class="text-center py-10 text-slate-500 italic">এই সময়ের মধ্যে কোনো কাস্টমার আদায় নেই।</td></tr>`;
        } else {
            custTbody.innerHTML = data.customerCollections.map((c, i) => {
                const methodBadge = c.receivedType === 'Cash' 
                    ? `<span class="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap"><i class="fa-solid fa-hand-holding-dollar mr-1"></i> ক্যাশ</span>`
                    : `<span class="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap"><i class="fa-solid fa-building-columns mr-1"></i> ${c.receivedFrom || 'Bank'}</span>`;

                return `
                    <tr class="hover:bg-slate-800/40 transition-all fs-cust-row">
                        <td class="py-2.5 px-3 text-center text-slate-500 font-mono">${i + 1}</td>
                        <td class="py-2.5 px-3 text-center text-slate-400 whitespace-nowrap">${formatAppDate(c.date)}</td>
                        <td class="py-2.5 px-3 text-center font-mono font-bold text-blue-400 whitespace-nowrap">${c.customerAccountNo}</td>
                        <td class="py-2.5 px-3 font-bold text-white">
                            <div class="truncate max-w-[150px] sm:max-w-[200px]">${c.customerName}</div>
                            <div class="text-[10px] text-slate-400 font-normal font-mono">${c.customerPhone}</div>
                        </td>
                        <td class="py-2.5 px-3 text-slate-300 whitespace-nowrap">${c.customerZone}</td>
                        <td class="py-2.5 px-3 text-center font-mono text-slate-400 whitespace-nowrap">${c.voucherNo}</td>
                        <td class="py-2.5 px-3 text-center">${methodBadge}</td>
                        <td class="py-2.5 px-3 text-right font-black text-emerald-400 font-mono whitespace-nowrap">৳ ${formatAmountWithComma(c.amount)}</td>
                        <td class="py-2.5 px-3 text-right font-bold text-rose-400 font-mono whitespace-nowrap">৳ ${formatAmountWithComma(c.currentDue)}</td>
                    </tr>
                `;
            }).join('');
        }
    }

    // 2. Render Day-by-Day Table
    const dayTbody = document.getElementById('fs-daybyday-tbody');
    if (dayTbody) {
        if (data.dayByDaySummary.length === 0) {
            dayTbody.innerHTML = `<tr><td colspan="9" class="text-center py-10 text-slate-500 italic">কোনো লেনদেন রেকর্ড পাওয়া যায়নি।</td></tr>`;
        } else {
            dayTbody.innerHTML = data.dayByDaySummary.map(d => `
                <tr class="hover:bg-slate-800/40 transition-all">
                    <td class="py-2.5 px-3 text-center font-bold text-white whitespace-nowrap">${formatAppDate(d.date)}</td>
                    <td class="py-2.5 px-3 text-center text-blue-400 font-bold whitespace-nowrap">${d.customerCount} জন</td>
                    <td class="py-2.5 px-3 text-right font-mono text-slate-200 whitespace-nowrap">৳ ${formatAmountWithComma(d.sales)}</td>
                    <td class="py-2.5 px-3 text-right font-mono text-emerald-400 whitespace-nowrap">৳ ${formatAmountWithComma(d.cashPaid)}</td>
                    <td class="py-2.5 px-3 text-right font-mono text-blue-400 whitespace-nowrap">৳ ${formatAmountWithComma(d.bankPaid)}</td>
                    <td class="py-2.5 px-3 text-right font-mono font-black text-emerald-400 bg-emerald-500/5 whitespace-nowrap">৳ ${formatAmountWithComma(d.totalPaid)}</td>
                    <td class="py-2.5 px-3 text-right font-mono font-bold text-rose-400 whitespace-nowrap">৳ ${formatAmountWithComma(d.expenses)}</td>
                    <td class="py-2.5 px-3 text-right font-mono font-black ${d.netCash >= 0 ? 'text-emerald-400' : 'text-rose-400'} whitespace-nowrap">৳ ${formatAmountWithComma(d.netCash)}</td>
                    <td class="py-2.5 px-3 text-center whitespace-nowrap">
                        <button onclick="window.fsLoadData('${d.date}', '${d.date}'); window.fsSwitchTab('customers');" class="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-blue-400 text-[11px] font-bold rounded-lg transition-all cursor-pointer" title="এই দিনের কাস্টমার লিস্ট দেখুন">
                            <i class="fa-solid fa-eye mr-1"></i> দেখুন
                        </button>
                    </td>
                </tr>
            `).join('');
        }
    }

    // 3. Render Expenses Table
    const expTbody = document.getElementById('fs-expenses-tbody');
    if (expTbody) {
        if (data.rawExpenses.length === 0) {
            expTbody.innerHTML = `<tr><td colspan="5" class="text-center py-10 text-slate-500 italic">কোনো খরচের এন্ট্রি নেই।</td></tr>`;
        } else {
            expTbody.innerHTML = data.rawExpenses.map(e => `
                <tr class="hover:bg-slate-800/40 transition-all">
                    <td class="py-2.5 px-3 text-center text-slate-400 whitespace-nowrap">${formatAppDate(e.date)}</td>
                    <td class="py-2.5 px-3 font-bold text-white">${e.note || e.title || '-'}</td>
                    <td class="py-2.5 px-3 text-slate-300">${e.category || 'অন্যান্য'}</td>
                    <td class="py-2.5 px-3 text-center text-slate-400">${e.paymentMethod || 'ক্যাশ'}</td>
                    <td class="py-2.5 px-3 text-right font-black text-rose-400 font-mono whitespace-nowrap">৳ ${formatAmountWithComma(e.amount)}</td>
                </tr>
            `).join('');
        }
    }

    // 4. Render Methods Grid
    const methodsGrid = document.getElementById('fs-methods-grid');
    if (methodsGrid) {
        const methods = Object.values(data.methodBreakdown);
        if (methods.length === 0) {
            methodsGrid.innerHTML = `<div class="col-span-full text-center py-10 text-slate-500 italic">কোনো আদায়ের মেথড ডাটা নেই।</div>`;
        } else {
            methodsGrid.innerHTML = methods.map(m => `
                <div class="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
                    <div class="flex justify-between items-center mb-3">
                        <span class="text-xs font-black text-slate-300 uppercase">${m.name}</span>
                        <span class="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-bold">${m.count} টি জমা</span>
                    </div>
                    <div class="text-xl font-black text-emerald-400 font-mono">৳ ${formatAmountWithComma(m.amount)}</div>
                </div>
            `).join('');
        }
    }
}

/**
 * Render Aging Due & Defaulter Recovery Tab (Zero Emojis)
 */
function renderAgingDueTab() {
    const agingData = calculateAgingDueData();
    const { buckets } = agingData;

    // 1. Render Aging Header Cards
    const cardsGrid = document.getElementById('fs-aging-cards-grid');
    if (cardsGrid) {
        cardsGrid.innerHTML = `
            <div class="bg-emerald-950/30 border border-emerald-500/20 p-3 sm:p-4 rounded-2xl">
                <span class="text-[10.5px] font-bold text-emerald-400">০ - ৩০ দিন (স্বাভাবিক)</span>
                <h4 class="text-base sm:text-xl font-black text-white font-mono mt-1">৳ ${formatAmountWithComma(buckets.tier0_30.totalDue)}</h4>
                <p class="text-[10px] text-slate-400 font-bold">${buckets.tier0_30.count} জন কাস্টমার</p>
            </div>
            <div class="bg-amber-950/30 border border-amber-500/20 p-3 sm:p-4 rounded-2xl">
                <span class="text-[10.5px] font-bold text-amber-400">৩১ - ৬০ দিন (সতর্কতা)</span>
                <h4 class="text-base sm:text-xl font-black text-white font-mono mt-1">৳ ${formatAmountWithComma(buckets.tier31_60.totalDue)}</h4>
                <p class="text-[10px] text-slate-400 font-bold">${buckets.tier31_60.count} জন কাস্টমার</p>
            </div>
            <div class="bg-orange-950/30 border border-orange-500/20 p-3 sm:p-4 rounded-2xl">
                <span class="text-[10.5px] font-bold text-orange-400">৬১ - ৯০ দিন (উচ্চ ঝুঁকি)</span>
                <h4 class="text-base sm:text-xl font-black text-white font-mono mt-1">৳ ${formatAmountWithComma(buckets.tier61_90.totalDue)}</h4>
                <p class="text-[10px] text-slate-400 font-bold">${buckets.tier61_90.count} জন কাস্টমার</p>
            </div>
            <div class="bg-rose-950/30 border border-rose-500/30 p-3 sm:p-4 rounded-2xl">
                <span class="text-[10.5px] font-bold text-rose-400">৯০+ দিন (ডেড বকেয়া)</span>
                <h4 class="text-base sm:text-xl font-black text-rose-400 font-mono mt-1">৳ ${formatAmountWithComma(buckets.tier90_plus.totalDue)}</h4>
                <p class="text-[10px] text-slate-400 font-bold">${buckets.tier90_plus.count} জন কাস্টমার</p>
            </div>
        `;
    }

    // 2. Render Aging Table Rows (Default: All due customers)
    window._currentAgingList = [
        ...buckets.tier90_plus.list.map(c => ({ ...c, tier: 'tier90_plus', badge: '৯০+ দিন (অচল)' })),
        ...buckets.tier61_90.list.map(c => ({ ...c, tier: 'tier61_90', badge: '৬১-৯০ দিন (অচল)' })),
        ...buckets.tier31_60.list.map(c => ({ ...c, tier: 'tier31_60', badge: '৩১-৬০ দিন (সতর্কতা)' })),
        ...buckets.tier0_30.list.map(c => ({ ...c, tier: 'tier0_30', badge: '০-৩০ দিন (স্বাভাবিক)' }))
    ];

    window.fsFilterAgingBracket = (tier) => {
        document.querySelectorAll('.aging-filter-btn').forEach(btn => {
            if (btn.getAttribute('data-tier') === tier) {
                btn.className = 'aging-filter-btn px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-800 text-white cursor-pointer';
            } else {
                btn.className = 'aging-filter-btn px-2.5 py-1 text-[11px] font-bold rounded-lg text-slate-400 hover:bg-slate-900 cursor-pointer';
            }
        });

        const listToRender = tier === 'all' ? window._currentAgingList : window._currentAgingList.filter(c => c.tier === tier);
        renderAgingTableBody(listToRender);

        const tierNames = {
            'all': 'সব বকেয়া',
            'tier90_plus': '৯০+ দিনের ডেড বকেয়া',
            'tier61_90': '৬১-৯০ দিনের বকেয়া',
            'tier31_60': '৩১-৬০ দিনের বকেয়া'
        };
        showToast(`${tierNames[tier] || tier} তালিকা ফিল্টার করা হয়েছে (${listToRender.length} জন)`, 'info', 'এজিং ফিল্টার');
    };

    window.fsFilterAgingRows = (q) => {
        const query = (q || '').toLowerCase().trim();
        const filtered = window._currentAgingList.filter(c => 
            c.name.toLowerCase().includes(query) || c.phone.includes(query) || c.accountNo.toLowerCase().includes(query) || c.zone.toLowerCase().includes(query)
        );
        renderAgingTableBody(filtered);
    };

    window.fsSendAgingWhatsApp = (name, phone, due) => {
        sendAgingCustomerWhatsApp(name, phone, due);
    };

    window.fsSendAgingSMS = (name, phone, due) => {
        sendAgingCustomerSMS(name, phone, due);
    };

    renderAgingTableBody(window._currentAgingList);
}

function renderAgingTableBody(list) {
    const tbody = document.getElementById('fs-aging-tbody');
    if (!tbody) return;

    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center py-8 text-slate-500 italic">কোনো বকেয়া কাস্টমার পাওয়া যায়নি।</td></tr>`;
        return;
    }

    tbody.innerHTML = list.map(c => {
        let badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
        if (c.tier === 'tier90_plus') badgeColor = 'bg-rose-500/20 text-rose-400 border-rose-500/30';
        else if (c.tier === 'tier61_90') badgeColor = 'bg-orange-500/20 text-orange-400 border-orange-500/30';
        else if (c.tier === 'tier31_60') badgeColor = 'bg-amber-500/20 text-amber-400 border-amber-500/30';

        return `
            <tr class="hover:bg-slate-800/40 transition-all fs-aging-row">
                <td class="py-2.5 px-3 text-center font-mono font-bold text-blue-400 whitespace-nowrap">${c.accountNo}</td>
                <td class="py-2.5 px-3 font-bold text-white">
                    <div class="truncate max-w-[150px] sm:max-w-[200px]">${c.name}</div>
                    <div class="text-[10px] text-slate-400 font-normal font-mono">${c.phone}</div>
                </td>
                <td class="py-2.5 px-3 text-slate-300 whitespace-nowrap">${c.zone}</td>
                <td class="py-2.5 px-3 text-center whitespace-nowrap">
                    <span class="px-2 py-0.5 rounded-md text-[10px] font-bold border ${badgeColor}">
                        ${c.inactiveDays} দিন অচল
                    </span>
                </td>
                <td class="py-2.5 px-3 text-right font-black text-rose-400 font-mono whitespace-nowrap">৳ ${formatAmountWithComma(c.totalDue)}</td>
                <td class="py-2.5 px-3 text-center whitespace-nowrap">
                    <div class="flex items-center justify-center gap-1.5">
                        <button onclick="window.fsSendAgingWhatsApp('${c.name}', '${c.phone}', ${c.totalDue})" class="w-7 h-7 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white flex items-center justify-center transition-all cursor-pointer" title="WhatsApp তাগাদা">
                            <i class="fa-brands fa-whatsapp text-xs"></i>
                        </button>
                        <button onclick="window.fsSendAgingSMS('${c.name}', '${c.phone}', ${c.totalDue})" class="w-7 h-7 rounded-lg bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white flex items-center justify-center transition-all cursor-pointer" title="SMS তাগাদা">
                            <i class="fa-solid fa-comment-sms text-xs"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}
