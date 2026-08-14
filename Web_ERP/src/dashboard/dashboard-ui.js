/**
 * --- DASHBOARD UI MODULE (World-Class Aesthetics) ---
 * Generates HTML layout for Enterprise Dashboard.
 */
import { getDashboardKPICardsHTML } from './dashboard-kpi-cards.js';

function getDashboardHeaderAndFormHTML() {
    return `
        <!-- 1. Top Quick Action Bar -->
        <div class="m3-card bg-slate-900/80 border border-slate-800/80 p-3 md:p-4 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-3">
                <div class="w-2.5 h-8 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.6)]"></div>
                <div>
                    <h2 class="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                        ড্যাশবোর্ড <span class="text-xs text-slate-400 font-bold uppercase tracking-widest">(Overview)</span>
                    </h2>
                    <p class="text-[10px] text-slate-400 font-bold">মা মোটরস ইআরপি • লাইভ ইন্টেলিজেন্স</p>
                </div>
            </div>

            <div class="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <button class="h-9 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-lg shadow-blue-600/20 transition-all flex items-center gap-1.5 cursor-pointer" onclick="window.navigate('bulk')">
                    <i class="fa-solid fa-plus-circle"></i><span>বিক্রি এন্ট্রি</span>
                </button>
                <button class="h-9 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-1.5 cursor-pointer" onclick="window.navigate('ledger')">
                    <i class="fa-solid fa-hand-holding-dollar"></i><span>টাকা জমা</span>
                </button>
                <button class="h-9 px-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black shadow-lg shadow-purple-600/20 transition-all flex items-center gap-1.5 cursor-pointer" onclick="window.navigate('expenses')">
                    <i class="fa-solid fa-wallet"></i><span>নতুন খরচ</span>
                </button>
                <button class="h-9 px-3.5 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer" onclick="window.toggleDashCustomerForm()">
                    <i class="fa-solid fa-user-plus text-blue-400"></i><span>কাস্টমার</span>
                </button>
                <button class="h-9 px-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-400 text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer" onclick="window.printExecutiveSummary && window.printExecutiveSummary()" title="১-ক্লিক দৈনিক সারসংক্ষেপ">
                    <i class="fa-solid fa-print"></i><span>রিপোর্ট</span>
                </button>
            </div>
        </div>

        <!-- Inline Dashboard New Customer Add Form Container (Collapsable) -->
        <div id="dash-add-customer-form" class="hidden m3-card bg-slate-900/90 border border-slate-800 p-4 md:p-5 rounded-2xl shadow-2xl font-bn flex flex-col gap-4">
            <div class="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center text-base font-black shadow-sm">
                        <i class="fa-solid fa-address-card"></i>
                    </div>
                    <div>
                        <h3 class="text-base md:text-lg font-black text-white">নতুন কাস্টমার যুক্ত করুন</h3>
                        <p class="text-[10px] text-slate-400 font-bold">ড্যাশবোর্ড থেকে সরাসরি কাস্টমার প্রোফাইল ও প্রারম্ভিক হিসাব এন্ট্রি</p>
                    </div>
                </div>
                <button class="w-8 h-8 rounded-xl bg-slate-800/80 hover:bg-red-500/20 border border-slate-700/60 text-slate-400 hover:text-red-400 flex items-center justify-center transition-all cursor-pointer" onclick="window.toggleDashCustomerForm()" title="বন্ধ করুন">
                    <i class="fa-solid fa-xmark text-sm"></i>
                </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
                <div>
                    <label class="m3-label">হিসাব খোলার তারিখ <span class="m3-label-sub">(Date)</span></label>
                    <input type="text" id="dash-cust-date" class="m3-field py-1 bg-slate-950/80 h-9 text-xs datepicker cursor-pointer">
                </div>
                <div>
                    <label class="m3-label">কাস্টমারের নাম <span class="m3-label-sub">(Name *)</span></label>
                    <input type="text" id="dash-cust-name" placeholder="পুরো নাম লিখুন" class="m3-field py-1 bg-slate-950/80 h-9 text-xs">
                </div>
                <div>
                    <label class="m3-label">ঠিকানা <span class="m3-label-sub">(Address)</span></label>
                    <input type="text" id="dash-cust-address" list="dash-cust-address-datalist" placeholder="ঠিকানা লিখুন (যেমন: মা মার্কেট, ১নং রেইল গেইট...)" class="m3-field py-1 bg-slate-950/80 h-9 text-xs">
                    <datalist id="dash-cust-address-datalist"></datalist>
                    <div id="dash-cust-address-chips"></div>
                </div>
                <div>
                    <label class="m3-label">মোবাইল নম্বর <span class="m3-label-sub">(Phone *)</span></label>
                    <input type="text" id="dash-cust-phone" placeholder="০১৭xxxxxxxx" class="m3-field py-1 bg-slate-950/80 h-9 text-xs">
                </div>

                <div class="flex flex-col">
                    <label class="m3-label text-emerald-400">অবশিষ্ট ব্যালেন্স <span class="m3-label-sub">(Opening Due ৳)</span></label>
                    <input type="text" id="dash-cust-initial-balance" placeholder="০.০০" oninput="window.handleNumberInput(this); window.updateLiveWords(this, 'dash-cust-initial-words');" class="m3-field py-1 border-emerald-500/30 focus:border-emerald-500 text-emerald-400 font-black h-9 text-xs bg-slate-950/80">
                    <div id="dash-cust-initial-words" class="text-[10px] font-black text-emerald-400 mt-1 hidden italic truncate"></div>
                </div>
                <div>
                    <label class="m3-label text-purple-400">জোন / অঞ্চল <span class="m3-label-sub">(Zone *)</span></label>
                    <div class="flex gap-2">
                        <select id="dash-cust-zone-select" class="m3-field py-1 flex-grow bg-slate-950/80 h-9 text-xs font-bold text-slate-200 cursor-pointer" onchange="window.handleDashZoneChange && window.handleDashZoneChange()">
                            <option value="">-- জোন সিলেক্ট --</option>
                        </select>
                        <button title="নতুন জোন যোগ করুন" class="w-9 h-9 bg-purple-600/20 text-purple-400 border border-purple-500/30 rounded-xl hover:bg-purple-600 hover:text-white transition-all flex items-center justify-center shrink-0 cursor-pointer" onclick="window.quickAddZone()"><i class="fa-solid fa-plus text-xs"></i></button>
                    </div>
                </div>
                <div>
                    <label class="m3-label text-blue-400">জোন কোড <span class="m3-label-sub">(Code)</span></label>
                    <input type="text" id="dash-cust-zone-code-display" readonly placeholder="কোড" class="m3-field py-1 bg-slate-950/60 border-slate-700/60 text-center text-xs font-black text-blue-400 h-9">
                </div>
                <div>
                    <label class="m3-label text-blue-400">অ্যাকাউন্ট নম্বর <span class="m3-label-sub">(Auto A/C)</span></label>
                    <input type="text" id="dash-cust-generated-acc" readonly placeholder="অ্যাকাউন্ট নং" class="m3-field py-1 bg-slate-950/60 border-blue-500/30 text-blue-400 font-black h-9 text-xs">
                </div>
            </div>

            <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-800/80">
                <button class="h-9 px-5 rounded-xl bg-slate-800/90 border border-slate-700/80 hover:bg-slate-700/80 text-slate-300 text-xs font-bold transition-all cursor-pointer" onclick="window.toggleDashCustomerForm()">বাতিল</button>
                <button class="h-9 px-8 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-lg shadow-blue-600/30 active:scale-95 transition-all flex items-center gap-2 cursor-pointer" id="dash-save-cust-btn" onclick="window.saveDashCustomer()">
                    <i class="fa-solid fa-check text-xs"></i><span>সেভ করুন</span>
                </button>
            </div>
        </div>
    `;
}

function getDashboardMainGridHTML() {
    return `
        <!-- 3. Main Dashboard 2-Column Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <!-- Left Column (2 Cols): Sales vs Collection Graph & Recent Activity -->
            <div class="lg:col-span-2 flex flex-col gap-6">

                <!-- Trend Graph Card -->
                <div class="m3-card bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl shadow-xl">
                    <div class="flex items-center justify-between mb-3 border-b border-slate-800/60 pb-2">
                        <h3 class="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                            <i class="fa-solid fa-chart-line text-blue-400"></i> বিক্রি বনাম আদায় পারফরম্যান্স গ্রাফ
                        </h3>
                        <div class="flex items-center gap-3 text-[10px] font-bold">
                            <span class="flex items-center gap-1 text-blue-400"><span class="w-2 h-2 rounded-full bg-blue-500"></span> বিক্রি</span>
                            <span class="flex items-center gap-1 text-emerald-400"><span class="w-2 h-2 rounded-full bg-emerald-500"></span> কালেকশন</span>
                        </div>
                    </div>
                    <div class="w-full overflow-hidden flex items-center justify-center">
                        <canvas id="sales-vs-col-chart" class="w-full max-h-[190px]"></canvas>
                    </div>
                </div>

                <!-- Premium Collection List Section -->
                <div class="m3-card bg-slate-900/40 backdrop-blur-md border border-slate-800/60 p-5 rounded-2xl shadow-xl flex flex-col gap-5">
                    <div class="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-slate-800/60 pb-3">
                        <h3 class="text-sm md:text-base font-black text-white uppercase tracking-widest flex items-center gap-2 whitespace-nowrap flex-nowrap">
                            <div class="w-2 h-5 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)] shrink-0"></div> 
                            <span class="shrink-0">আদায় / কালেকশন লিস্ট</span>
                            <input type="text" id="collection-list-datepicker" data-mode="range" class="m3-field py-1.5 bg-slate-950/80 h-8 text-[11px] w-44 datepicker cursor-pointer ml-2 text-center text-emerald-400 font-bold border-emerald-500/30 rounded-lg hover:border-emerald-500/60 transition-all" placeholder="Select Date Range">
                        </h3>
                        <div class="flex flex-wrap items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 shadow-inner">
                            <button id="btn-col-today" class="px-3.5 py-1.5 bg-emerald-600 text-white rounded-xl text-[11px] font-bold transition-all shadow-[0_0_10px_rgba(16,185,129,0.3)]" onclick="window.filterCollectionList('today')">আজ</button>
                            <button id="btn-col-yesterday" class="px-3.5 py-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl text-[11px] font-bold transition-all" onclick="window.filterCollectionList('yesterday')">গতকাল</button>
                            <button id="btn-col-week" class="px-3.5 py-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl text-[11px] font-bold transition-all" onclick="window.filterCollectionList('week')">১ সপ্তাহ</button>
                            <button id="btn-col-month" class="px-3.5 py-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl text-[11px] font-bold transition-all" onclick="window.filterCollectionList('month')">১ মাস</button>
                        </div>
                    </div>

                    <!-- Collection Total Summary Hero Card -->
                    <div class="bg-gradient-to-br from-emerald-800/90 via-slate-900/95 to-slate-950 border border-emerald-500/40 rounded-2xl p-8 flex flex-col items-center justify-center gap-2 shadow-[0_15px_40px_-10px_rgba(16,185,129,0.3)] relative overflow-hidden group">
                        <div class="absolute -right-10 -bottom-10 opacity-[0.05] text-[180px] pointer-events-none group-hover:scale-105 transition-transform duration-700">
                            <i class="fa-solid fa-coins"></i>
                        </div>
                        <span class="text-xs md:text-sm font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2 z-10"><i class="fa-solid fa-coins text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]"></i> সর্বমোট আদায় (Total Collection)</span>
                        <h2 id="dash-collection-card-total" class="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mt-1 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] z-10 font-inter">৳ ০</h2>
                        <p id="dash-collection-card-words" class="text-xs md:text-sm text-emerald-300 font-bold italic mt-2 z-10 bg-black/20 px-4 py-1.5 rounded-full border border-emerald-500/20">শূন্য টাকা মাত্র</p>
                    </div>

                    <!-- Dynamic Payment Method Summary Cards (Auto Responsive Grid) -->
                    <div id="dash-collection-method-cards" class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3 w-full"></div>

                    <!-- Collection List Table -->
                    <div class="m3-table-container custom-scrollbar max-h-[400px] overflow-y-auto rounded-xl border border-slate-800/60">
                        <table class="m3-table min-w-[700px] w-full text-left">
                            <thead class="bg-slate-900/80 backdrop-blur sticky top-0 z-10">
                                <tr class="text-[10px] uppercase tracking-widest text-slate-400 border-b border-slate-800">
                                    <th class="py-3 px-4">তারিখ</th>
                                    <th class="py-3 px-4">কাস্টমার</th>
                                    <th class="py-3 px-4">ভাউচার/রিসিপ্ট</th>
                                    <th class="py-3 px-4">পেমেন্ট মেথড</th>
                                    <th class="py-3 px-4 text-right">জমা (Collection)</th>
                                </tr>
                            </thead>
                            <tbody id="dash-collection-list-tbody" class="divide-y divide-slate-800/40">
                                <tr><td colspan="5" class="text-center py-10 text-slate-500 italic"><i class="fa-solid fa-spinner fa-spin mr-2"></i> ডাটা লোড হচ্ছে...</td></tr>
                            </tbody>
                            <tfoot class="sticky bottom-0 bg-slate-900/95 backdrop-blur border-t-2 border-emerald-500/40">
                                <tr class="font-black">
                                    <td colspan="4" class="text-right text-slate-400 py-3 px-4 uppercase text-xs tracking-wider">সর্বমোট আদায়:</td>
                                    <td id="dash-collection-list-total" class="text-right text-emerald-400 text-lg px-4 tracking-tight font-inter">৳ ০</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Right Column (1 Col): Donut Chart & Top 5 Due Customers Widget -->
            <div class="flex flex-col gap-6">

                <!-- Cash vs Bank Donut Card -->
                <div class="m3-card bg-slate-900/40 backdrop-blur-md border border-slate-800/60 p-5 rounded-2xl shadow-xl flex flex-col gap-4 relative overflow-hidden group">
                    <div class="absolute -right-6 -bottom-6 opacity-[0.03] text-[120px] pointer-events-none group-hover:scale-110 transition-transform duration-500">
                        <i class="fa-solid fa-chart-pie"></i>
                    </div>
                    <h3 class="text-sm font-black text-white uppercase tracking-widest border-b border-slate-800/60 pb-3 flex items-center gap-2 z-10">
                        <div class="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-[0_0_10px_rgba(16,185,129,0.2)]"><i class="fa-solid fa-chart-pie"></i></div>
                        পেমেন্ট মেথড ব্রেকডাউন
                    </h3>
                    <div class="flex items-center justify-around py-2 z-10">
                        <div class="relative w-[120px] h-[120px] drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                            <canvas id="payment-donut-chart" class="w-full h-full"></canvas>
                        </div>
                        <div class="flex flex-col gap-3 font-bn">
                            <div class="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-800/50 transition-all border border-transparent hover:border-slate-700/50 cursor-default">
                                <span class="w-3.5 h-3.5 rounded bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
                                <div><p class="text-[10px] text-slate-400 font-bold tracking-wider">নগদ (Cash)</p><p id="dash-col-cash" class="text-base font-black text-emerald-400 tracking-tight font-inter">৳ ০</p></div>
                            </div>
                            <div class="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-800/50 transition-all border border-transparent hover:border-slate-700/50 cursor-default">
                                <span class="w-3.5 h-3.5 rounded bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></span>
                                <div><p class="text-[10px] text-slate-400 font-bold tracking-wider">ব্যাংক (Bank)</p><p id="dash-col-bank" class="text-base font-black text-blue-400 tracking-tight font-inter">৳ ০</p></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Collection Breakdown Widget -->
                <div id="dash-collection-breakdown-card" class="hidden m3-card bg-slate-900/40 backdrop-blur-md border border-slate-800/60 p-5 rounded-2xl shadow-xl flex-col gap-4 relative overflow-hidden group">
                    <div class="absolute -right-6 -bottom-6 opacity-[0.03] text-[120px] pointer-events-none group-hover:scale-110 transition-transform duration-500">
                        <i class="fa-solid fa-list-check"></i>
                    </div>
                    <h3 class="text-sm font-black text-white uppercase tracking-widest border-b border-slate-800/60 pb-3 flex items-center gap-2 z-10">
                        <div class="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.2)]"><i class="fa-solid fa-list-ul"></i></div>
                        জমার বিস্তারিত বিবরণ
                    </h3>
                    <div id="dash-collection-breakdown-list" class="flex flex-col gap-2 font-bn mt-1 max-h-48 overflow-y-auto custom-scrollbar pr-1 z-10"></div>
                </div>

                <!-- Top 5 Due Customers Widget -->
                <div class="m3-card bg-slate-900/40 backdrop-blur-md border border-slate-800/60 p-5 rounded-2xl shadow-xl flex flex-col gap-4 relative overflow-hidden group">
                    <div class="absolute -right-6 -bottom-6 opacity-[0.03] text-[120px] pointer-events-none group-hover:scale-110 transition-transform duration-500">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                    </div>
                    <div class="flex items-center justify-between border-b border-slate-800/60 pb-3 z-10">
                        <h3 class="text-sm font-black text-red-400 uppercase tracking-widest flex items-center gap-2">
                            <div class="w-8 h-8 rounded-lg bg-red-500/20 text-red-500 flex items-center justify-center shadow-[0_0_10px_rgba(239,68,68,0.2)] animate-pulse"><i class="fa-solid fa-triangle-exclamation"></i></div>
                            শীর্ষ ৫ বকেয়া কাস্টমার
                        </h3>
                        <button class="text-[10px] text-blue-400 font-bold hover:text-white bg-blue-500/10 hover:bg-blue-600 px-3 py-1.5 rounded-lg border border-blue-500/30 transition-all flex items-center gap-1.5" onclick="window.navigate('customers')">
                            কাস্টমার লিস্ট <i class="fa-solid fa-arrow-right"></i>
                        </button>
                    </div>
                    <div id="top-due-customers-list" class="flex flex-col gap-2.5 font-bn z-10">
                        <div class="text-center py-6 text-slate-500 text-xs italic"><i class="fa-solid fa-spinner fa-spin mr-2"></i> ডাটা ফিল্টার হচ্ছে...</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export function getDashboardHTML() {
    return `
        <div class="flex flex-col gap-6 font-bn">
            ${getDashboardHeaderAndFormHTML()}
            ${getDashboardKPICardsHTML()}
            ${getDashboardMainGridHTML()}
        </div>
    `;
}
