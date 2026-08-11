/**
 * --- DASHBOARD UI MODULE (World-Class Aesthetics) ---
 * Generates HTML layout for Enterprise Dashboard.
 */
export function getDashboardHTML() {
    return `
        <div class="flex flex-col gap-6 font-bn">

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
                            <select id="dash-cust-zone-select" class="m3-field py-1 flex-grow bg-slate-950/80 h-9 text-xs font-bold text-slate-200 cursor-pointer" onchange="window.handleDashZoneChange()">
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
                        <i class="fa-solid fa-check text-xs"></i>
                        <span>সেভ করুন</span>
                    </button>
                </div>
            </div>

            <!-- 2. 4 Glassmorphic KPI Cards + Timeframe Switcher -->
            <div class="flex flex-col gap-3">
                <div class="flex items-center justify-between px-1">
                    <span class="text-xs font-black text-slate-400 uppercase tracking-widest">ব্যবসায়িক রিয়েল-টাইম মেট্রিক্স</span>
                    <div class="flex bg-slate-950/80 rounded-xl p-1 border border-slate-800 text-[11px] font-bold">
                        <button class="px-3 py-1.5 min-h-[34px] rounded-lg bg-blue-600 text-white active:scale-95 transition-all" id="tf-today-btn" onclick="window.switchDashTimeframe('today')">আজকে</button>
                        <button class="px-3 py-1.5 min-h-[34px] rounded-lg text-slate-400 hover:text-white active:scale-95 transition-all" id="tf-week-btn" onclick="window.switchDashTimeframe('week')">এই সপ্তাহ</button>
                        <button class="px-3 py-1.5 min-h-[34px] rounded-lg text-slate-400 hover:text-white active:scale-95 transition-all" id="tf-month-btn" onclick="window.switchDashTimeframe('month')">এই মাস</button>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <!-- Due Card -->
                    <div class="m3-card relative overflow-hidden group border-l-4 border-l-red-500 bg-slate-900/60">
                        <div class="w-9 h-9 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center mb-3 text-lg"><i class="fa-solid fa-receipt"></i></div>
                        <h4 class="text-slate-400 text-[11px] font-black uppercase tracking-wider mb-1">মার্কেটে মোট বকেয়া</h4>
                        <h2 id="dash-total-due" class="text-2xl md:text-3xl font-black text-white tracking-tight">৳ ০</h2>
                        <div class="mt-3 flex items-center justify-between text-[10px] text-slate-400 font-bold border-t border-slate-800/60 pt-2">
                            <span>সব কাস্টমারের বাকি</span><span class="text-red-400 font-black">রিয়েল-টাইম</span>
                        </div>
                    </div>

                    <!-- Collection Card -->
                    <div class="m3-card relative overflow-hidden group border-l-4 border-l-emerald-500 bg-slate-900/60">
                        <div class="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3 text-lg"><i class="fa-solid fa-hand-holding-dollar"></i></div>
                        <h4 class="text-slate-400 text-[11px] font-black uppercase tracking-wider mb-1">মোট কালেকশন</h4>
                        <h2 id="dash-today-col" class="text-2xl md:text-3xl font-black text-white tracking-tight">৳ ০</h2>
                        <div class="mt-3 flex items-center justify-between text-[10px] text-slate-400 font-bold border-t border-slate-800/60 pt-2">
                            <span id="dash-net-cash">নিট ক্যাশ: ৳ ০</span><span class="text-emerald-400 font-black">আদায় সিঙ্কড</span>
                        </div>
                    </div>

                    <!-- Expense Card -->
                    <div class="m3-card relative overflow-hidden group border-l-4 border-l-purple-500 bg-slate-900/60">
                        <div class="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3 text-lg"><i class="fa-solid fa-wallet"></i></div>
                        <h4 class="text-slate-400 text-[11px] font-black uppercase tracking-wider mb-1">মোট খরচ</h4>
                        <h2 id="dash-today-exp" class="text-2xl md:text-3xl font-black text-white tracking-tight">৳ ০</h2>
                        <div class="mt-3 flex items-center justify-between text-[10px] text-slate-400 font-bold border-t border-slate-800/60 pt-2">
                            <span>দৈনিক খরচ যোগফল</span><span class="text-purple-400 font-black">হিসাবকৃত</span>
                        </div>
                    </div>

                    <!-- Customers Card -->
                    <div class="m3-card relative overflow-hidden group border-l-4 border-l-blue-500 bg-slate-900/60">
                        <div class="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3 text-lg"><i class="fa-solid fa-users"></i></div>
                        <h4 class="text-slate-400 text-[11px] font-black uppercase tracking-wider mb-1">মোট কাস্টমার</h4>
                        <h2 id="dash-total-cust" class="text-2xl md:text-3xl font-black text-white tracking-tight">০ জন</h2>
                        <div class="mt-3 flex items-center justify-between text-[10px] text-slate-400 font-bold border-t border-slate-800/60 pt-2">
                            <span>সক্রিয় অ্যাকাউন্ট</span><span class="text-blue-400 font-black">ডাটাবেস সিঙ্কড</span>
                        </div>
                    </div>
                </div>
            </div>

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

                    <!-- Recent Activity Section -->
                    <div class="flex flex-col gap-3">
                        <div class="flex items-center justify-between px-1">
                            <h3 class="text-lg font-bold flex items-center gap-2 text-white">
                                <div class="w-2 h-5 bg-blue-600 rounded-full"></div> সাম্প্রতিক লেনদেন
                            </h3>
                            <button class="text-blue-400 text-xs font-bold hover:underline flex items-center gap-1" onclick="window.navigate('ledger')">
                                সব দেখুন <i class="fa-solid fa-arrow-right"></i>
                            </button>
                        </div>

                        <!-- Desktop Table View -->
                        <div class="desktop-only m3-table-container">
                            <table class="m3-table min-w-[700px]">
                                <thead>
                                    <tr>
                                        <th>তারিখ</th><th>কাস্টমার</th><th class="text-right">খরচ (Debit)</th><th class="text-right">জমা (Credit)</th><th class="text-center">অ্যাকশন</th>
                                    </tr>
                                </thead>
                                <tbody id="recent-txn-list">
                                    <tr><td colspan="5" class="text-center py-8 text-slate-500 italic">ডাটা লোড হচ্ছে...</td></tr>
                                </tbody>
                            </table>
                        </div>

                        <!-- Mobile Card View -->
                        <div id="recent-txn-list-mobile" class="mobile-only mobile-card-container">
                            <div class="text-center py-8 text-slate-500 italic">ডাটা লোড হচ্ছে...</div>
                        </div>
                    </div>
                </div>

                <!-- Right Column (1 Col): Donut Chart & Top 5 Due Customers Widget -->
                <div class="flex flex-col gap-6">

                    <!-- Cash vs Bank Donut Card -->
                    <div class="m3-card bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl shadow-xl flex flex-col gap-3">
                        <h3 class="text-sm font-black text-white uppercase tracking-widest border-b border-slate-800/60 pb-2 flex items-center gap-2">
                            <i class="fa-solid fa-pie-chart text-emerald-400"></i> পেমেন্ট মেথড ব্রেকডাউন
                        </h3>
                        <div class="flex items-center justify-around py-2">
                            <canvas id="payment-donut-chart" class="w-[120px] h-[120px]"></canvas>
                            <div class="flex flex-col gap-2 font-bn">
                                <div class="flex items-center gap-2">
                                    <span class="w-3 h-3 rounded-md bg-emerald-500"></span>
                                    <div><p class="text-[10px] text-slate-400 font-bold">নগদ (Cash)</p><p id="dash-col-cash" class="text-sm font-black text-white">৳ ০</p></div>
                                </div>
                                <div class="flex items-center gap-2">
                                    <span class="w-3 h-3 rounded-md bg-blue-500"></span>
                                    <div><p class="text-[10px] text-slate-400 font-bold">ব্যাংক (Bank)</p><p id="dash-col-bank" class="text-sm font-black text-white">৳ ০</p></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Top 5 Due Customers Widget -->
                    <div class="m3-card bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl shadow-xl flex flex-col gap-3">
                        <div class="flex items-center justify-between border-b border-slate-800/60 pb-2">
                            <h3 class="text-sm font-black text-red-400 uppercase tracking-widest flex items-center gap-2">
                                <i class="fa-solid fa-triangle-exclamation"></i> শীর্ষ ৫ বকেয়া কাস্টমার
                            </h3>
                            <button class="text-[10px] text-blue-400 font-bold hover:underline" onclick="window.navigate('customers')">কাস্টমার লিস্ট</button>
                        </div>
                        <div id="top-due-customers-list" class="flex flex-col gap-2 font-bn">
                            <div class="text-center py-6 text-slate-500 text-xs italic">ডাটা ফিল্টার হচ্ছে...</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
}
