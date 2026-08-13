export function getDashboardHTML() {
    return `
        <div class="flex flex-col gap-6 font-bn max-w-7xl mx-auto">
            <!-- Top Dashboard Action Bar -->
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div class="flex items-center gap-3">
                    <div class="w-2.5 h-8 bg-amber-400 rounded-full shadow-[0_0_15px_rgba(251,191,36,0.5)]"></div>
                    <div>
                        <h2 class="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                            <span>মালিক ড্যাশবোর্ড (Boss Monitor)</span>
                            <button class="w-7 h-7 rounded-lg hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-blue-400 transition-all active:rotate-180 cursor-pointer" onclick="window.refreshDashboardData && window.refreshDashboardData()" title="রিফ্রেশ"><i class="fa-solid fa-rotate text-xs"></i></button>
                        </h2>
                        <p class="text-[10.5px] text-slate-400 font-bold">ব্যবসায়ের লাইভ আর্থিক সারসংক্ষেপ ও রিয়েল-টাইম কালেকশন মনিটর</p>
                    </div>
                </div>

                <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button class="h-9 px-4 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-400 text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-sm" onclick="window.printExecutiveSummary && window.printExecutiveSummary()" title="১-ক্লিক দৈনিক সারসংক্ষেপ">
                        <i class="fa-solid fa-print"></i><span>প্রিন্ট সারসংক্ষেপ</span>
                    </button>
                </div>
            </div>

            <!-- Main Metric Cards Row (4 KPI Cards) -->
            <div class="m3-card bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl shadow-2xl flex flex-col gap-5">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800/80 pb-3">
                    <div class="flex items-center gap-2">
                        <i class="fa-solid fa-chart-line text-blue-400 text-sm"></i>
                        <span class="text-xs font-black text-white uppercase tracking-wider">প্রধান আর্থিক সূচক</span>
                    </div>

                    <!-- Date Filter & Quick Switch -->
                    <div class="flex flex-wrap items-center gap-2">
                        <div class="relative flex items-center">
                            <i class="fa-solid fa-calendar-days absolute left-3 text-blue-400 text-xs pointer-events-none z-10"></i>
                            <input type="text" id="dash-date-filter" class="m3-field py-1.5 bg-slate-950/90 border border-slate-700/80 rounded-xl h-8 text-[11px] text-white font-bold outline-none pl-8 pr-3 w-36 cursor-pointer hover:border-blue-500/50 transition-all focus:border-blue-500" placeholder="তারিখ বেছে নিন..." onchange="window.onDashDateFilterChange && window.onDashDateFilterChange(this.value)">
                        </div>
                        <div class="w-px h-6 bg-slate-800 mx-1"></div>
                        <div class="flex items-center gap-1 text-[11px] font-bold">
                            <button class="px-3.5 py-1.5 min-h-[32px] rounded-xl bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)] active:scale-95 transition-all cursor-pointer flex items-center gap-1.5" id="tf-today-btn" onclick="window.switchDashTimeframe('today')"><i class="fa-solid fa-calendar-day"></i>আজকে</button>
                            <button class="px-3.5 py-1.5 min-h-[32px] rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5" id="tf-yesterday-btn" onclick="window.switchDashTimeframe('yesterday')">গতকাল</button>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <!-- Total Due Card -->
                    <div class="m3-card relative overflow-hidden group bg-slate-900/40 backdrop-blur-md border border-slate-800/60 hover:border-red-500/40 p-5 shadow-xl transition-all">
                        <div class="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-60"></div>
                        <i class="fa-solid fa-receipt absolute -right-4 -bottom-4 text-[90px] text-red-500/5 pointer-events-none"></i>
                        <div class="relative z-10 flex flex-col h-full">
                            <div class="flex items-center gap-3 mb-4">
                                <div class="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 border border-red-500/20 flex items-center justify-center text-lg shadow-[0_0_15px_rgba(239,68,68,0.15)]"><i class="fa-solid fa-receipt"></i></div>
                                <h4 class="text-slate-400 text-xs font-black uppercase tracking-widest">মার্কেটে মোট বকেয়া</h4>
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
                    <div class="m3-card relative overflow-hidden group bg-slate-900/40 backdrop-blur-md border border-slate-800/60 hover:border-emerald-500/40 p-5 shadow-xl transition-all">
                        <div class="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-60"></div>
                        <i class="fa-solid fa-hand-holding-dollar absolute -right-4 -bottom-4 text-[90px] text-emerald-500/5 pointer-events-none"></i>
                        <div class="relative z-10 flex flex-col h-full">
                            <div class="flex items-center gap-3 mb-4">
                                <div class="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 flex items-center justify-center text-lg shadow-[0_0_15px_rgba(16,185,129,0.15)]"><i class="fa-solid fa-hand-holding-dollar"></i></div>
                                <h4 class="text-slate-400 text-xs font-black uppercase tracking-widest">মোট কালেকশন</h4>
                            </div>
                            <h2 id="dash-today-col" class="text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-md font-inter">৳ ০</h2>
                            <div class="mt-auto pt-5">
                                <div class="flex items-center justify-between text-[10px] text-slate-400 font-bold border-t border-slate-800/60 pt-2.5">
                                    <span id="dash-net-cash" class="flex items-center gap-1.5 text-emerald-200 font-inter"><i class="fa-solid fa-coins text-emerald-500"></i> নিট ক্যাশ: ৳ ০</span>
                                    <span class="text-emerald-400 font-black bg-emerald-500/10 px-1.5 py-0.5 rounded flex items-center gap-1 border border-emerald-500/20"><i class="fa-solid fa-cloud-arrow-up"></i> আদায় সিঙ্কড</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Expense Card -->
                    <div class="m3-card relative overflow-hidden group bg-slate-900/40 backdrop-blur-md border border-slate-800/60 hover:border-purple-500/40 p-5 shadow-xl transition-all">
                        <div class="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-60"></div>
                        <i class="fa-solid fa-wallet absolute -right-4 -bottom-4 text-[90px] text-purple-500/5 pointer-events-none"></i>
                        <div class="relative z-10 flex flex-col h-full">
                            <div class="flex items-center gap-3 mb-4">
                                <div class="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/20 flex items-center justify-center text-lg shadow-[0_0_15px_rgba(168,85,247,0.15)]"><i class="fa-solid fa-wallet"></i></div>
                                <h4 class="text-slate-400 text-xs font-black uppercase tracking-widest">মোট খরচ</h4>
                            </div>
                            <h2 id="dash-today-exp" class="text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-md font-inter">৳ ০</h2>
                            <div class="mt-auto pt-5">
                                <div class="flex items-center justify-between text-[10px] text-slate-400 font-bold border-t border-slate-800/60 pt-2.5">
                                    <span class="flex items-center gap-1.5"><i class="fa-solid fa-calendar text-purple-400"></i> দৈনিক হিসাব</span>
                                    <span class="text-purple-400 font-black bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20">রেকর্ড ভিউ</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Customer Count Card -->
                    <div class="m3-card relative overflow-hidden group bg-slate-900/40 backdrop-blur-md border border-slate-800/60 hover:border-blue-500/40 p-5 shadow-xl transition-all">
                        <div class="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-60"></div>
                        <i class="fa-solid fa-users absolute -right-4 -bottom-4 text-[90px] text-blue-500/5 pointer-events-none"></i>
                        <div class="relative z-10 flex flex-col h-full">
                            <div class="flex items-center gap-3 mb-4">
                                <div class="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/20 flex items-center justify-center text-lg shadow-[0_0_15px_rgba(59,130,246,0.15)]"><i class="fa-solid fa-users"></i></div>
                                <h4 class="text-slate-400 text-xs font-black uppercase tracking-widest">মোট কাস্টমার</h4>
                            </div>
                            <h2 id="dash-total-cust" class="text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-md font-inter">০ জন</h2>
                            <div class="mt-auto pt-5">
                                <div class="flex items-center justify-between text-[10px] text-slate-400 font-bold border-t border-slate-800/60 pt-2.5">
                                    <span class="flex items-center gap-1.5"><i class="fa-solid fa-id-card text-blue-400"></i> একটিভ অ্যাকাউন্ট</span>
                                    <span class="text-blue-400 font-black bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">তালিকা</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Two Column Layout: Collection List & Payment Method Breakdown -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Left Column (2 Cols): Live Collection Drill-Down & List -->
                <div class="lg:col-span-2 flex flex-col gap-6">
                    <div class="m3-card bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl shadow-xl flex flex-col gap-5">
                        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800/80 pb-3">
                            <h3 class="text-base font-black text-white flex items-center gap-2">
                                <div class="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-sm"><i class="fa-solid fa-hand-holding-dollar"></i></div>
                                <span>কালেকশন বিবরণ ও লিস্ট</span>
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
                        <h3 class="text-sm font-black text-white uppercase tracking-widest border-b border-slate-800/60 pb-3 flex items-center gap-2 z-10">
                            <div class="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-sm"><i class="fa-solid fa-chart-pie"></i></div>
                            পেমেন্ট মেথড ব্রেকডাউন
                        </h3>
                        <div class="flex items-center justify-around py-2 z-10">
                            <div class="relative w-[120px] h-[120px] drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                                <canvas id="payment-donut-chart" class="w-full h-full"></canvas>
                            </div>
                            <div class="flex flex-col gap-3 font-bn">
                                <div class="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-800/50 transition-all border border-transparent cursor-default">
                                    <span class="w-3.5 h-3.5 rounded bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
                                    <div><p class="text-[10px] text-slate-400 font-bold tracking-wider">নগদ (Cash)</p><p id="dash-col-cash" class="text-base font-black text-emerald-400 tracking-tight font-inter">৳ ০</p></div>
                                </div>
                                <div class="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-800/50 transition-all border border-transparent cursor-default">
                                    <span class="w-3.5 h-3.5 rounded bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></span>
                                    <div><p class="text-[10px] text-slate-400 font-bold tracking-wider">ব্যাংক (Bank)</p><p id="dash-col-bank" class="text-base font-black text-blue-400 tracking-tight font-inter">৳ ০</p></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Top 5 Due Customers Widget -->
                    <div class="m3-card bg-slate-900/40 backdrop-blur-md border border-slate-800/60 p-5 rounded-2xl shadow-xl flex flex-col gap-4">
                        <div class="flex items-center justify-between border-b border-slate-800/60 pb-3">
                            <h3 class="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                                <div class="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center shadow-sm"><i class="fa-solid fa-triangle-exclamation"></i></div>
                                শীর্ষ ৫ বকেয়া কাস্টমার
                            </h3>
                            <button onclick="navigate('customers')" class="text-xs text-blue-400 hover:underline font-bold">কাস্টমার লিস্ট <i class="fa-solid fa-arrow-right ml-1"></i></button>
                        </div>
                        <div id="dash-top-due-list" class="flex flex-col gap-2.5">
                            <p class="text-center py-6 text-slate-500 text-xs italic"><i class="fa-solid fa-spinner fa-spin mr-2"></i> লোড হচ্ছে...</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}
