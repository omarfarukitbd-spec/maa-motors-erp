/**
 * Returns the HTML template for the Financial Summary & Closing Center UI
 * @returns {string} HTML string
 */
export function getFinancialSummaryTemplate() {
    return `
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
                        <button onclick="window.fsSetPeriod('last_month', true)" class="fs-preset-btn px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-all active:scale-95 flex-1 sm:flex-none text-center cursor-pointer" data-period="last_month">গত মাস</button>
                        <button onclick="window.fsSetPeriod('this_year', true)" class="fs-preset-btn px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-all active:scale-95 flex-1 sm:flex-none text-center cursor-pointer" data-period="this_year">চলতি বছর</button>
                    </div>

                    <!-- Custom Range Input (Clean isolated range datepicker) -->
                    <div class="relative w-full sm:w-auto">
                        <input type="text" id="fs-date-range-input" class="w-full sm:w-48 bg-slate-950/90 border border-slate-700/80 rounded-2xl px-3 py-2 text-xs font-bold text-emerald-400 font-mono cursor-pointer text-center outline-none focus:border-emerald-500 shadow-inner" placeholder="কাস্টম রেঞ্জ...">
                    </div>
                </div>
            </div>

            <!-- Quick Action Toolbar -->
            <div class="flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-3 bg-slate-950/60 p-3 sm:p-3.5 rounded-2xl border border-slate-800/80">
                <div class="flex items-center gap-2 text-xs font-bold text-slate-400">
                    <i class="fa-solid fa-clock-rotate-left text-blue-400"></i>
                    <span id="fs-selected-period-text">ডাটা লোড হচ্ছে...</span>
                </div>
                <div class="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    <button onclick="window.fsOpenCashCounter()" class="px-3.5 py-1.5 bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-sm" title="ক্যাশ ড্রয়ার হিসাব মিলান">
                        <i class="fa-solid fa-money-bill-transfer text-emerald-400"></i>
                        <span>ক্যাশ ক্যাশবক্স হিসাব</span>
                    </button>
                    <button onclick="window.fsShareWhatsApp()" class="px-3.5 py-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-sm" title="WhatsApp ক্লোজিং মেসেজ পাঠান">
                        <i class="fa-brands fa-whatsapp text-emerald-400 text-sm"></i>
                        <span>WhatsApp ক্লোজিং</span>
                    </button>
                    <button onclick="window.fsHandleTopPrint()" class="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer">
                        <i class="fa-solid fa-print text-amber-400"></i>
                        <span id="fs-top-print-text">আদায় শিট প্রিন্ট</span>
                    </button>
                    <button onclick="window.fsHandleTopExcel()" class="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer">
                        <i class="fa-solid fa-file-excel text-emerald-400"></i>
                        <span>Excel</span>
                    </button>
                </div>
            </div>

            <!-- KPI Cards Grid -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div class="bg-slate-900/80 p-4 sm:p-5 rounded-3xl border border-slate-800/80 shadow-lg relative overflow-hidden">
                    <div class="flex items-center justify-between">
                        <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">মোট বিক্রয় (ইনভয়েস)</span>
                        <div class="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center text-sm"><i class="fa-solid fa-cart-shopping"></i></div>
                    </div>
                    <div id="fs-kpi-sales" class="text-lg sm:text-2xl lg:text-3xl font-black text-white mt-1.5 tracking-tight font-inter">৳ 0.00</div>
                    <div id="fs-kpi-sales-sub" class="text-[10.5px] text-slate-500 font-bold mt-1">০ টি ইনভয়েস</div>
                </div>
                <div class="bg-slate-900/80 p-4 sm:p-5 rounded-3xl border border-slate-800/80 shadow-lg relative overflow-hidden">
                    <div class="flex items-center justify-between">
                        <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">মোট আদায় (কালেকশন)</span>
                        <div class="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-sm"><i class="fa-solid fa-hand-holding-dollar"></i></div>
                    </div>
                    <div id="fs-kpi-collection" class="text-lg sm:text-2xl lg:text-3xl font-black text-emerald-400 mt-1.5 tracking-tight font-inter">৳ 0.00</div>
                    <div id="fs-kpi-collection-sub" class="text-[10.5px] text-slate-500 font-bold mt-1">ক্যাশ ও ব্যাংক আদায়</div>
                </div>
                <div class="bg-slate-900/80 p-4 sm:p-5 rounded-3xl border border-slate-800/80 shadow-lg relative overflow-hidden">
                    <div class="flex items-center justify-between">
                        <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">মোট খরচ (ব্যয়)</span>
                        <div class="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center text-sm"><i class="fa-solid fa-wallet"></i></div>
                    </div>
                    <div id="fs-kpi-expense" class="text-lg sm:text-2xl lg:text-3xl font-black text-rose-400 mt-1.5 tracking-tight font-inter">৳ 0.00</div>
                    <div id="fs-kpi-expense-sub" class="text-[10.5px] text-slate-500 font-bold mt-1">দোকান ও ব্যবসা পরিচালনা ব্যয়</div>
                </div>
                <div class="bg-slate-900/80 p-4 sm:p-5 rounded-3xl border border-slate-800/80 shadow-lg relative overflow-hidden">
                    <div class="flex items-center justify-between">
                        <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">নেট ক্যাশ-ফ্লো</span>
                        <div class="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center text-sm"><i class="fa-solid fa-scale-balanced"></i></div>
                    </div>
                    <div id="fs-kpi-net" class="text-lg sm:text-2xl lg:text-3xl font-black text-white mt-1.5 tracking-tight font-inter">৳ 0.00</div>
                    <div class="text-[10.5px] text-slate-500 font-bold mt-1">আদায় মাইনাস খরচ</div>
                </div>
            </div>

            <!-- Tab Navigation & Main Tables Container -->
            <div class="bg-slate-900/70 border border-slate-800 rounded-3xl p-3.5 sm:p-5 backdrop-blur-xl shadow-xl space-y-4">
                <div class="flex items-center justify-between border-b border-slate-800 pb-3 gap-2 overflow-x-auto custom-scrollbar">
                    <div class="flex items-center gap-1.5">
                        <button id="fs-tab-btn-customers" onclick="window.fsSwitchTab('customers')" class="fs-tab-btn px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shrink-0 bg-emerald-500 text-slate-950 shadow-md cursor-pointer">
                            <i class="fa-solid fa-users"></i><span>কাস্টমার আদায় বিবরণী</span>
                            <span id="fs-badge-cust-count" class="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-slate-900 text-emerald-400">0</span>
                        </button>
                        <button id="fs-tab-btn-closing" onclick="window.fsSwitchTab('closing')" class="fs-tab-btn px-3.5 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer">
                            <i class="fa-solid fa-calendar-check text-indigo-400"></i><span>কাস্টমার সমাপনী বকেয়া</span>
                            <span id="fs-badge-closing-count" class="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-indigo-900/60 text-indigo-300 font-mono">লাইভ</span>
                        </button>
                        <button id="fs-tab-btn-dayByDay" onclick="window.fsSwitchTab('dayByDay')" class="fs-tab-btn px-3.5 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer">
                            <i class="fa-solid fa-calendar-days"></i><span>দৈনিক সারাংশ অডিট</span>
                            <span id="fs-badge-days-count" class="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300">0 দিন</span>
                        </button>
                        <button id="fs-tab-btn-aging" onclick="window.fsSwitchTab('aging')" class="fs-tab-btn px-3.5 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer">
                            <i class="fa-solid fa-triangle-exclamation text-amber-400"></i><span>বকেয়া বয়স বিশ্লেষণ (Aging)</span>
                        </button>
                        <button id="fs-tab-btn-expenses" onclick="window.fsSwitchTab('expenses')" class="fs-tab-btn px-3.5 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer">
                            <i class="fa-solid fa-receipt"></i><span>খরচের খতিয়ান</span>
                        </button>
                        <button id="fs-tab-btn-methods" onclick="window.fsSwitchTab('methods')" class="fs-tab-btn px-3.5 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer">
                            <i class="fa-solid fa-credit-card"></i><span>আদায়ের মাধ্যম</span>
                        </button>
                    </div>
                </div>

                <!-- Tab Contents -->
                <div class="pt-1">
                    <div id="fs-tab-content-customers" class="space-y-3">
                        <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                            <div class="relative flex-1 max-w-md">
                                <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs"></i>
                                <input type="text" oninput="window.fsFilterCustomerRows(this.value)" placeholder="আদায় তালিকায় কাস্টমার, ফোন বা A/C নং খুঁজুন..." class="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white outline-none focus:border-emerald-500">
                            </div>
                            <div id="fs-cust-table-status" class="text-xs text-slate-400 font-bold self-center"></div>
                        </div>
                        <div class="overflow-x-auto custom-scrollbar rounded-2xl border border-slate-800/80">
                            <table class="w-full text-left text-xs border-collapse min-w-[700px]">
                                <thead>
                                    <tr class="bg-slate-950 text-slate-400 font-bold border-b border-slate-800 uppercase tracking-wider text-[10.5px]">
                                        <th class="py-2.5 px-3 text-center w-10">SL</th>
                                        <th class="py-2.5 px-3 text-center">তারিখ</th>
                                        <th class="py-2.5 px-3 text-center">A/C নং</th>
                                        <th class="py-2.5 px-3">কাস্টমারের নাম</th>
                                        <th class="py-2.5 px-3">জোন</th>
                                        <th class="py-2.5 px-3 text-center">ভাউচার</th>
                                        <th class="py-2.5 px-3 text-center">পেমেন্ট মেথড</th>
                                        <th class="py-2.5 px-3 text-right text-emerald-400">আদায় (৳)</th>
                                        <th class="py-2.5 px-3 text-right text-rose-400">অবশিষ্ট বাকি (৳)</th>
                                    </tr>
                                </thead>
                                <tbody id="fs-customer-tbody" class="divide-y divide-slate-800/50"></tbody>
                            </table>
                        </div>
                    </div>

                    <div id="fs-tab-content-dayByDay" class="hidden space-y-3">
                        <div class="flex justify-between items-center">
                            <span class="text-xs text-slate-400 font-bold">প্রতিদিনের সার্বিক পারফরম্যান্স ও ক্যাশ-ফ্লো রেজিস্টার</span>
                            <button onclick="window.fsPrintMonthlyAudit()" class="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold transition-all"><i class="fa-solid fa-print mr-1"></i> অডিট শিট প্রিন্ট</button>
                        </div>
                        <div class="overflow-x-auto custom-scrollbar rounded-2xl border border-slate-800/80">
                            <table class="w-full text-left text-xs border-collapse min-w-[750px]">
                                <thead>
                                    <tr class="bg-slate-950 text-slate-400 font-bold border-b border-slate-800 uppercase tracking-wider text-[10.5px]">
                                        <th class="py-2.5 px-3 text-center">তারিখ</th>
                                        <th class="py-2.5 px-3 text-center">আদায় কাস্টমার</th>
                                        <th class="py-2.5 px-3 text-right">বিক্রয় (৳)</th>
                                        <th class="py-2.5 px-3 text-right text-emerald-400">ক্যাশ আদায় (৳)</th>
                                        <th class="py-2.5 px-3 text-right text-blue-400">ব্যাংক আদায় (৳)</th>
                                        <th class="py-2.5 px-3 text-right font-black text-emerald-400 bg-emerald-500/10">মোট আদায় (৳)</th>
                                        <th class="py-2.5 px-3 text-right text-rose-400">মোট খরচ (৳)</th>
                                        <th class="py-2.5 px-3 text-right font-black text-white">নেট ক্যাশ (৳)</th>
                                        <th class="py-2.5 px-3 text-center">অ্যাকশন</th>
                                    </tr>
                                </thead>
                                <tbody id="fs-daybyday-tbody" class="divide-y divide-slate-800/50"></tbody>
                            </table>
                        </div>
                    </div>

                    <div id="fs-tab-content-aging" class="hidden space-y-4">
                        <div id="fs-aging-cards-grid" class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3"></div>
                        <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                            <div class="flex items-center gap-1.5 flex-wrap">
                                <button onclick="window.fsFilterAgingBracket('all')" class="aging-filter-btn px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-800 text-white cursor-pointer" data-tier="all">সব বকেয়া</button>
                                <button onclick="window.fsFilterAgingBracket('tier90_plus')" class="aging-filter-btn px-2.5 py-1 text-[11px] font-bold rounded-lg text-rose-400 hover:bg-slate-900 cursor-pointer" data-tier="tier90_plus">৯০+ দিন (অচল)</button>
                                <button onclick="window.fsFilterAgingBracket('tier61_90')" class="aging-filter-btn px-2.5 py-1 text-[11px] font-bold rounded-lg text-orange-400 hover:bg-slate-900 cursor-pointer" data-tier="tier61_90">৬১-৯০ দিন</button>
                                <button onclick="window.fsFilterAgingBracket('tier31_60')" class="aging-filter-btn px-2.5 py-1 text-[11px] font-bold rounded-lg text-amber-400 hover:bg-slate-900 cursor-pointer" data-tier="tier31_60">৩১-৬০ দিন</button>
                            </div>
                            <input type="text" oninput="window.fsFilterAgingRows(this.value)" placeholder="বকেয়া তালিকায় কাস্টমার, ফোন বা জোন খুঁজুন..." class="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-emerald-500">
                        </div>
                        <div class="overflow-x-auto custom-scrollbar rounded-2xl border border-slate-800/80">
                            <table class="w-full text-left text-xs border-collapse min-w-[700px]">
                                <thead>
                                    <tr class="bg-slate-950 text-slate-400 font-bold border-b border-slate-800 uppercase tracking-wider text-[10.5px]">
                                        <th class="py-2.5 px-3 text-center">A/C নং</th>
                                        <th class="py-2.5 px-3">কাস্টমার নাম ও মোবাইল</th>
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

                    <div id="fs-tab-content-methods" class="hidden">
                        <div id="fs-methods-grid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5"></div>
                    </div>

                    <div id="fs-tab-content-closing" class="hidden space-y-3">
                        <div id="fs-closing-view-container">
                            <div class="text-center py-12 text-slate-400 font-bold"><i class="fa-solid fa-spinner fa-spin mr-2 text-indigo-400"></i>সমাপনী ব্যালেন্স হিসাব করা হচ্ছে...</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}
