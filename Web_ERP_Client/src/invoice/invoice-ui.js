export function getInvoiceUIHTML() {
    return `
        <div class="flex flex-col gap-6 font-bn max-w-7xl mx-auto">
            <!-- Invoice Header Card -->
            <div class="m3-card bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl shadow-xl flex flex-col gap-4">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div class="flex items-center gap-3">
                        <div class="w-2.5 h-8 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
                        <div>
                            <h2 class="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                                <span>ইনভয়েস ও ভাউচার হিস্ট্রি</span>
                                <span class="text-xs text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">ভিউ-অনলি</span>
                            </h2>
                            <p class="text-[10.5px] text-slate-400 font-bold">সকল বিল ও জমা রশিদের কেন্দ্রীয় রেকর্ড ভিউ</p>
                        </div>
                    </div>

                    <button class="h-9 px-3.5 rounded-xl bg-slate-800 border border-slate-700/80 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer" onclick="window.exportInvoiceExcel()" title="এক্সেল ডাউনলোড">
                        <i class="fa-solid fa-file-excel text-emerald-400"></i><span>এক্সেল</span>
                    </button>
                </div>

                <!-- Search & Filters -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                    <div class="relative md:col-span-2">
                        <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none"></i>
                        <input type="text" id="invoice-search-input" onkeyup="window.filterInvoiceList()" placeholder="ভাউচার নং, কাস্টমারের নাম বা ফোন দিয়ে খুঁজুন..." class="w-full bg-slate-950/90 border border-slate-700/70 rounded-xl h-9 text-xs text-white focus:border-blue-500 outline-none shadow-inner" style="padding-left: 36px !important;">
                    </div>
                    <div>
                        <select id="invoice-type-filter" onchange="window.filterInvoiceList()" class="w-full bg-slate-950/90 border border-slate-700/70 rounded-xl h-9 text-xs text-white focus:border-blue-500 outline-none px-3 cursor-pointer">
                            <option value="">সকল ধরন (All Types)</option>
                            <option value="bill">শুধু বিল/খরচ (Debit)</option>
                            <option value="paid">শুধু জমা রশিদ (Credit)</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Invoice List Table Card -->
            <div class="m3-card bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl shadow-xl flex flex-col gap-4">
                <div class="m3-table-container custom-scrollbar overflow-x-auto rounded-xl border border-slate-800/60">
                    <table id="invoice-table" class="m3-table min-w-[750px] w-full text-left font-bn">
                        <thead class="bg-slate-900/90 sticky top-0 z-10 border-b border-slate-800">
                            <tr class="text-[11px] uppercase tracking-wider text-slate-400">
                                <th class="py-3 px-4">তারিখ</th>
                                <th class="py-3 px-4">ভাউচার/রশিদ নং</th>
                                <th class="py-3 px-4">কাস্টমারের নাম</th>
                                <th class="py-3 px-4">পেমেন্ট মেথড</th>
                                <th class="py-3 px-4 text-right text-red-400">বিল (Debit ৳)</th>
                                <th class="py-3 px-4 text-right text-emerald-400">জমা (Credit ৳)</th>
                                <th class="py-3 px-4 text-center">অ্যাকশন</th>
                            </tr>
                        </thead>
                        <tbody id="invoice-tbody" class="divide-y divide-slate-800/40 text-xs">
                            <tr><td colspan="7" class="text-center py-12 text-slate-500 italic"><i class="fa-solid fa-spinner fa-spin mr-2"></i> লোড হচ্ছে...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}
