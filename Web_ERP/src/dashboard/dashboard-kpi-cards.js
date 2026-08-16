/**
 * KPI Cards & Timeframe Switcher Component
 */
export function getDashboardKPICardsHTML() {
    return `
        <!-- 2. 4 Glassmorphic KPI Cards + Timeframe Switcher -->
        <div class="flex flex-col gap-4">
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-1">
                <div class="flex items-center gap-2">
                    <span class="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><i class="fa-solid fa-bolt text-blue-400"></i> ব্যবসায়িক রিয়েল-টাইম মেট্রিক্স</span>
                    <span id="dash-active-date-badge" class="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-black flex items-center gap-1.5 shadow-[0_0_10px_rgba(59,130,246,0.15)] backdrop-blur-sm">
                        <i class="fa-solid fa-clock text-[9px] animate-pulse"></i><span id="dash-active-date-text">আজকের লাইভ হিসাব</span>
                    </span>
                </div>
                <div class="flex flex-wrap items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800/80 shadow-lg backdrop-blur-md">
                    <div class="relative flex items-center">
                        <i class="fa-solid fa-calendar-days absolute left-3 text-blue-400 text-xs pointer-events-none z-10"></i>
                        <input type="text" id="dash-date-filter" class="m3-field py-1.5 bg-slate-950/90 border border-slate-700/80 rounded-xl h-8 text-[11px] text-white font-bold outline-none pl-8 pr-3 w-36 datepicker cursor-pointer hover:border-blue-500/50 transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50" placeholder="তারিখ বেছে নিন..." onchange="window.onDashDateFilterChange && window.onDashDateFilterChange(this.value)">
                    </div>
                    <div class="w-px h-6 bg-slate-800 mx-1"></div>
                    <div class="flex items-center gap-1 text-[11px] font-bold">
                        <button class="px-3.5 py-1.5 min-h-[32px] rounded-xl bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)] active:scale-95 transition-all cursor-pointer flex items-center gap-1.5" id="tf-today-btn" onclick="window.switchDashTimeframe('today')"><i class="fa-solid fa-calendar-day"></i>আজকে</button>
                        <button class="px-3.5 py-1.5 min-h-[32px] rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5" id="tf-yesterday-btn" onclick="window.switchDashTimeframe('yesterday')">গতকাল</button>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <!-- Due Card -->
                <div class="m3-card relative overflow-hidden group bg-slate-900/40 backdrop-blur-md border border-slate-800/60 hover:border-red-500/40 p-5 shadow-xl transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(239,68,68,0.2)]">
                    <div class="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-60"></div>
                    <i class="fa-solid fa-receipt absolute -right-4 -bottom-4 text-[90px] text-red-500/5 group-hover:text-red-500/10 transition-all duration-500 transform group-hover:rotate-12 group-hover:scale-110"></i>
                    <div class="relative z-10 flex flex-col h-full">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500/20 to-red-600/5 text-red-400 border border-red-500/20 flex items-center justify-center text-lg shadow-[0_0_15px_rgba(239,68,68,0.15)]"><i class="fa-solid fa-receipt"></i></div>
                            <h4 class="text-slate-400 text-xs font-black uppercase tracking-widest drop-shadow-sm">মার্কেটে মোট বকেয়া</h4>
                        </div>
                        <h2 id="dash-total-due" class="text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-md font-inter">৳ ০</h2>
                        <div class="mt-auto pt-5">
                            <div class="flex items-center justify-between text-[10px] text-slate-400 font-bold border-t border-slate-800/60 pt-2.5">
                                <span class="flex items-center gap-1.5"><i class="fa-solid fa-users text-slate-500"></i> সব কাস্টমারের বাকি</span>
                                <span class="text-red-400 font-black bg-red-500/10 px-1.5 py-0.5 rounded flex items-center gap-1 border border-red-500/20"><span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> রিয়েল-টাইম</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Collection Card -->
                <div class="m3-card relative overflow-hidden group bg-slate-900/40 backdrop-blur-md border border-slate-800/60 hover:border-emerald-500/40 p-5 shadow-xl transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(16,185,129,0.2)]">
                    <div class="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-60"></div>
                    <i class="fa-solid fa-hand-holding-dollar absolute -right-4 -bottom-4 text-[90px] text-emerald-500/5 group-hover:text-emerald-500/10 transition-all duration-500 transform group-hover:rotate-12 group-hover:scale-110"></i>
                    <div class="relative z-10 flex flex-col h-full">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/5 text-emerald-400 border border-emerald-500/20 flex items-center justify-center text-lg shadow-[0_0_15px_rgba(16,185,129,0.15)]"><i class="fa-solid fa-hand-holding-dollar"></i></div>
                            <h4 class="text-slate-400 text-xs font-black uppercase tracking-widest drop-shadow-sm">মোট কালেকশন</h4>
                        </div>
                        <h2 id="dash-today-col" class="text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-md font-inter">৳ ০</h2>
                        <div class="mt-auto pt-5">
                            <div class="flex items-center justify-between text-[10px] text-slate-400 font-bold border-t border-slate-800/60 pt-2.5">
                                <span id="dash-net-cash" class="flex items-center gap-1.5 text-emerald-400 font-inter font-bold"><i class="fa-solid fa-coins text-emerald-500"></i> নিট ক্যাশ: ৳ ০</span>
                                <span id="dash-bank-inflow" class="text-blue-400 font-black bg-blue-500/10 px-1.5 py-0.5 rounded flex items-center gap-1 border border-blue-500/20 font-inter"><i class="fa-solid fa-building-columns"></i> ব্যাংক: ৳ ০</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Expense Card -->
                <div class="m3-card relative overflow-hidden group bg-slate-900/40 backdrop-blur-md border border-slate-800/60 hover:border-purple-500/40 p-5 shadow-xl transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(168,85,247,0.2)]">
                    <div class="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-60"></div>
                    <i class="fa-solid fa-wallet absolute -right-4 -bottom-4 text-[90px] text-purple-500/5 group-hover:text-purple-500/10 transition-all duration-500 transform group-hover:rotate-12 group-hover:scale-110"></i>
                    <div class="relative z-10 flex flex-col h-full">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/5 text-purple-400 border border-purple-500/20 flex items-center justify-center text-lg shadow-[0_0_15px_rgba(168,85,247,0.15)]"><i class="fa-solid fa-wallet"></i></div>
                            <h4 class="text-slate-400 text-xs font-black uppercase tracking-widest drop-shadow-sm">মোট খরচ</h4>
                        </div>
                        <h2 id="dash-today-exp" class="text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-md font-inter">৳ ০</h2>
                        <div class="mt-auto pt-5">
                            <div class="flex items-center justify-between text-[10px] text-slate-400 font-bold border-t border-slate-800/60 pt-2.5">
                                <span class="flex items-center gap-1.5"><i class="fa-solid fa-file-invoice-dollar text-slate-500"></i> দৈনিক খরচ যোগফল</span>
                                <span class="text-purple-400 font-black bg-purple-500/10 px-1.5 py-0.5 rounded flex items-center gap-1 border border-purple-500/20"><i class="fa-solid fa-check-double"></i> হিসাবকৃত</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Customers Card -->
                <div class="m3-card relative overflow-hidden group bg-slate-900/40 backdrop-blur-md border border-slate-800/60 hover:border-blue-500/40 p-5 shadow-xl transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(59,130,246,0.2)]">
                    <div class="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-60"></div>
                    <i class="fa-solid fa-users absolute -right-4 -bottom-4 text-[90px] text-blue-500/5 group-hover:text-blue-500/10 transition-all duration-500 transform group-hover:-rotate-12 group-hover:scale-110"></i>
                    <div class="relative z-10 flex flex-col h-full">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/5 text-blue-400 border border-blue-500/20 flex items-center justify-center text-lg shadow-[0_0_15px_rgba(59,130,246,0.15)]"><i class="fa-solid fa-users"></i></div>
                            <h4 class="text-slate-400 text-xs font-black uppercase tracking-widest drop-shadow-sm">মোট কাস্টমার</h4>
                        </div>
                        <h2 id="dash-total-cust" class="text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-md font-inter">০ জন</h2>
                        <div class="mt-auto pt-5">
                            <div class="flex items-center justify-between text-[10px] text-slate-400 font-bold border-t border-slate-800/60 pt-2.5">
                                <span class="flex items-center gap-1.5"><i class="fa-solid fa-user-check text-slate-500"></i> সক্রিয় অ্যাকাউন্ট</span>
                                <span class="text-blue-400 font-black bg-blue-500/10 px-1.5 py-0.5 rounded flex items-center gap-1 border border-blue-500/20"><i class="fa-solid fa-database"></i> সিঙ্কড</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}
