export function getExpenseUIHTML() {
    return `
        <div class="flex flex-col gap-6 font-bn max-w-7xl mx-auto">
            <!-- Expense Top Header Card -->
            <div class="m3-card bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl shadow-xl flex flex-col gap-4">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800/80 pb-3">
                    <div class="flex items-center gap-3">
                        <div class="w-2.5 h-8 bg-purple-500 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.5)]"></div>
                        <div>
                            <h2 class="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                                <span>দৈনিক খরচের হিসাব (Expenses)</span>
                                <span class="text-xs text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">ভিউ-অনলি</span>
                            </h2>
                            <p class="text-[10.5px] text-slate-400 font-bold">প্রতিষ্ঠানের যাবতীয় ব্যয়ের বিস্তারিত রেকর্ড ও ক্যাটাগরি রিপোর্ট</p>
                        </div>
                    </div>

                    <button class="h-9 px-3.5 rounded-xl bg-slate-800 border border-slate-700/80 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer" onclick="window.exportExpenseExcel()" title="এক্সেল ডাউনলোড">
                        <i class="fa-solid fa-file-excel text-emerald-400"></i><span>এক্সেল</span>
                    </button>
                </div>

                <!-- Date & Category Filters -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                    <div class="relative">
                        <label class="text-[11px] font-bold text-slate-400 mb-1 block">তারিখ বেছে নিন</label>
                        <input type="text" id="expense-date-filter" class="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl h-10 text-xs text-white px-3 cursor-pointer outline-none focus:border-blue-500" placeholder="তারিখ..." onchange="window.onExpenseDateChange(this.value)">
                    </div>

                    <div>
                        <label class="text-[11px] font-bold text-slate-400 mb-1 block">ক্যাটাগরি ফিল্টার</label>
                        <select id="expense-cat-filter" onchange="window.filterExpenseList()" class="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl h-10 text-xs text-white px-3 cursor-pointer outline-none focus:border-blue-500">
                            <option value="">সকল ক্যাটাগরি (All Categories)</option>
                        </select>
                    </div>

                    <!-- Total Expense Hero Card -->
                    <div class="bg-slate-950/80 border border-purple-500/30 rounded-xl p-3 flex items-center justify-between">
                        <div>
                            <span class="text-[10px] text-purple-400 font-bold uppercase tracking-wider block">মোট খরচ</span>
                            <h3 id="expense-total-badge" class="text-xl font-black text-purple-400 font-inter">৳ ০</h3>
                        </div>
                        <div class="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center text-base">
                            <i class="fa-solid fa-wallet"></i>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Expense Records Table Card -->
            <div class="m3-card bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl shadow-xl flex flex-col gap-4">
                <div class="m3-table-container custom-scrollbar overflow-x-auto rounded-xl border border-slate-800/60">
                    <table id="expense-table" class="m3-table min-w-[700px] w-full text-left font-bn">
                        <thead class="bg-slate-900/90 sticky top-0 z-10 border-b border-slate-800">
                            <tr class="text-[11px] uppercase tracking-wider text-slate-400">
                                <th class="py-3 px-4">তারিখ</th>
                                <th class="py-3 px-4">ক্যাটাগরি</th>
                                <th class="py-3 px-4">বিবরণ (Details)</th>
                                <th class="py-3 px-4 text-right text-purple-400">পরিমাণ (Amount ৳)</th>
                            </tr>
                        </thead>
                        <tbody id="expense-tbody" class="divide-y divide-slate-800/40 text-xs">
                            <tr><td colspan="4" class="text-center py-12 text-slate-500 italic"><i class="fa-solid fa-spinner fa-spin mr-2"></i> লোড হচ্ছে...</td></tr>
                        </tbody>
                        <tfoot id="expense-tfoot" class="bg-slate-900/95 border-t-2 border-purple-500/40 font-bold">
                            <tr class="text-sm">
                                <td colspan="3" class="text-right py-3 px-4 text-slate-300 font-black">সর্বমোট খরচ:</td>
                                <td id="expense-footer-total" class="text-right py-3 px-4 text-purple-400 font-inter font-black">৳ ০</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    `;
}
