export function getLedgerUIHTML() {
    return `
        <div class="flex flex-col gap-6 font-bn max-w-7xl mx-auto">
            <!-- Customer Select & Account Summary Header Card -->
            <div class="m3-card bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl shadow-xl flex flex-col gap-4">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800/80 pb-3">
                    <div class="flex items-center gap-3">
                        <div class="w-2.5 h-8 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
                        <div>
                            <h2 class="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                                <span>কাস্টমার খতিয়ান ও হিসাব খাতা</span>
                                <span class="text-xs text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">ভিউ-অনলি</span>
                            </h2>
                            <p class="text-[10.5px] text-slate-400 font-bold">গ্রাহকের পূর্ণাঙ্গ লেজার হিস্ট্রি, ভাউচার ও রানিং ব্যালেন্স বিবরণী</p>
                        </div>
                    </div>

                    <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
                        <button class="h-9 px-3.5 rounded-xl bg-slate-800 border border-slate-700/80 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer" onclick="window.exportLedgerExcel()" title="এক্সেল ডাউনলোড">
                            <i class="fa-solid fa-file-excel text-emerald-400"></i><span>এক্সেল</span>
                        </button>
                        <button class="h-9 px-3.5 rounded-xl bg-blue-600/10 border border-blue-500/30 hover:bg-blue-600/20 text-blue-400 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer" onclick="window.printLedgerStatement('a4')" title="A4 স্টেটমেন্ট প্রিন্ট">
                            <i class="fa-solid fa-print"></i><span>A4 প্রিন্ট</span>
                        </button>
                        <button class="h-9 px-3.5 rounded-xl bg-purple-600/10 border border-purple-500/30 hover:bg-purple-600/20 text-purple-400 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer" onclick="window.printLedgerStatement('pos')" title="POS 80mm রশিদ প্রিন্ট">
                            <i class="fa-solid fa-receipt"></i><span>POS প্রিন্ট</span>
                        </button>
                    </div>
                </div>

                <!-- Customer Search / Dropdown & Live Balance Hero -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <div class="md:col-span-2 relative">
                        <label class="text-[11px] font-bold text-slate-400 mb-1 block">কাস্টমার বেছে নিন</label>
                        <div class="relative">
                            <i class="fa-solid fa-user absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none"></i>
                            <select id="ledger-customer-select" onchange="window.onLedgerCustomerChange(this.value)" class="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl h-10 text-xs text-white focus:border-blue-500 outline-none pr-3 cursor-pointer" style="padding-left: 36px !important;">
                                <option value="">-- কাস্টমার নির্বাচন করুন --</option>
                            </select>
                        </div>
                    </div>

                    <!-- Customer Current Balance Card -->
                    <div class="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
                        <div>
                            <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">বর্তমান ব্যালেন্স</span>
                            <h3 id="ledger-current-due-badge" class="text-xl font-black text-white font-inter">৳ ০</h3>
                        </div>
                        <div id="ledger-balance-status" class="px-2.5 py-1 rounded-lg text-xs font-black bg-slate-800 text-slate-400">
                            হিসাব নেই
                        </div>
                    </div>
                </div>

                <!-- Selected Customer Info Bar -->
                <div id="ledger-cust-details" class="hidden flex-wrap items-center gap-4 pt-3 border-t border-slate-800/80 text-xs text-slate-300">
                    <span class="flex items-center gap-1.5"><i class="fa-solid fa-id-badge text-blue-400"></i><strong id="lcd-acc" class="font-mono text-white"></strong></span>
                    <span class="flex items-center gap-1.5"><i class="fa-solid fa-phone text-emerald-400"></i><strong id="lcd-phone" class="font-mono text-white"></strong></span>
                    <span class="flex items-center gap-1.5"><i class="fa-solid fa-location-dot text-amber-400"></i><strong id="lcd-address" class="text-white"></strong></span>
                    <span class="flex items-center gap-1.5"><i class="fa-solid fa-map-location-dot text-purple-400"></i><strong id="lcd-zone" class="text-white"></strong></span>
                </div>
            </div>

            <!-- Ledger Table Card -->
            <div class="m3-card bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl shadow-xl flex flex-col gap-4">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div class="flex items-center gap-2">
                        <i class="fa-solid fa-table-list text-blue-400 text-sm"></i>
                        <h3 class="text-sm font-black text-white uppercase tracking-wider">লেনদেন বিবরণী (Ledger Rows)</h3>
                    </div>
                    <!-- Date Filter -->
                    <div class="flex items-center gap-2 text-xs">
                        <input type="text" id="ledger-start-date" class="m3-field py-1 px-2.5 bg-slate-950/80 border border-slate-700 rounded-lg text-xs text-white w-28 cursor-pointer" placeholder="শুরুর তারিখ" onchange="window.filterLedgerRows()">
                        <span class="text-slate-400">থেকে</span>
                        <input type="text" id="ledger-end-date" class="m3-field py-1 px-2.5 bg-slate-950/80 border border-slate-700 rounded-lg text-xs text-white w-28 cursor-pointer" placeholder="শেষ তারিখ" onchange="window.filterLedgerRows()">
                    </div>
                </div>

                <div class="m3-table-container custom-scrollbar overflow-x-auto rounded-xl border border-slate-800/60">
                    <table id="ledger-table" class="m3-table min-w-[750px] w-full text-left font-bn">
                        <thead class="bg-slate-900/90 sticky top-0 z-10 border-b border-slate-800">
                            <tr class="text-[11px] uppercase tracking-wider text-slate-400">
                                <th class="py-3 px-4">তারিখ</th>
                                <th class="py-3 px-4">ভাউচার/রশিদ নং</th>
                                <th class="py-3 px-4">বিবরণ (Particulars)</th>
                                <th class="py-3 px-4 text-right text-red-400">বিল/খরচ (Debit ৳)</th>
                                <th class="py-3 px-4 text-right text-emerald-400">জমা (Credit ৳)</th>
                                <th class="py-3 px-4 text-right">ব্যালেন্স (Balance ৳)</th>
                            </tr>
                        </thead>
                        <tbody id="ledger-tbody" class="divide-y divide-slate-800/40 text-xs">
                            <tr><td colspan="6" class="text-center py-12 text-slate-500 italic">প্রথমে কাস্টমার নির্বাচন করুন</td></tr>
                        </tbody>
                        <tfoot id="ledger-tfoot" class="hidden bg-slate-900/95 border-t-2 border-slate-700 font-bold">
                            <tr class="text-sm">
                                <td colspan="3" class="text-right py-3 px-4 text-slate-300 font-black">সর্বমোট:</td>
                                <td id="ledger-total-bill" class="text-right py-3 px-4 text-red-400 font-inter font-black">৳ ০</td>
                                <td id="ledger-total-paid" class="text-right py-3 px-4 text-emerald-400 font-inter font-black">৳ ০</td>
                                <td id="ledger-total-balance" class="text-right py-3 px-4 text-white font-inter font-black">৳ ০</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    `;
}
