export function getCustomerUIHTML() {
    return `
        <div class="flex flex-col gap-6 font-bn max-w-7xl mx-auto">
            <!-- Customer Top Card -->
            <div class="m3-card bg-slate-900/60 border border-slate-800/80 p-4 md:p-5 rounded-2xl shadow-xl flex flex-col gap-4">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div class="flex items-center gap-3">
                        <div class="w-2 h-7 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
                        <h2 class="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                            <span>কাস্টমার ডিরেক্টরি (গ্রাহক তালিকা)</span>
                            <button type="button" class="w-7 h-7 rounded-lg hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-blue-400 transition-all active:rotate-180 cursor-pointer" onclick="window.loadCustomers()" title="রিফ্রেশ"><i class="fa-solid fa-rotate text-xs"></i></button>
                        </h2>
                    </div>

                    <div class="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                        <button class="h-9 px-3.5 rounded-xl bg-slate-800/90 border border-slate-700/80 hover:bg-slate-700/80 text-slate-200 text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer" onclick="window.exportTableToExcel('customer-export-table', 'customer-list.xlsx')" title="এক্সেল ডাউনলোড"><i class="fa-solid fa-file-excel text-emerald-400"></i><span>এক্সেল</span></button>
                        <button class="h-9 px-3.5 rounded-xl bg-slate-800/90 border border-slate-700/80 hover:bg-slate-700/80 text-slate-200 text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer" onclick="window.printFilteredCustomerList()" title="লিস্ট প্রিন্ট"><i class="fa-solid fa-print text-blue-400"></i><span>প্রিন্ট লিস্ট</span></button>
                    </div>
                </div>

                <!-- Search & Filters -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                    <div class="relative md:col-span-2">
                        <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none"></i>
                        <input type="text" id="cust-search-input" onkeyup="window.filterCustomerList()" placeholder="কাস্টমার খুঁজুন (নাম, ফোন, অ্যাকাউন্ট বা ঠিকানা)..." class="w-full bg-slate-950/90 border border-slate-700/70 rounded-xl h-9 text-xs text-white focus:border-blue-500 outline-none shadow-inner" style="padding-left: 36px !important;">
                    </div>
                    <div>
                        <select id="cust-zone-filter" onchange="window.filterCustomerList()" class="w-full bg-slate-950/90 border border-slate-700/70 rounded-xl h-9 text-xs text-white focus:border-blue-500 outline-none px-3 cursor-pointer">
                            <option value="">সকল জোন (All Zones)</option>
                        </select>
                    </div>
                </div>

                <!-- Summary Bar -->
                <div class="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80 text-xs">
                    <div class="flex items-center gap-4">
                        <span class="text-slate-400 font-bold">মোট কাস্টমার: <strong id="cust-count-badge" class="text-white font-inter">০ জন</strong></span>
                        <span class="text-slate-400 font-bold">মোট বকেয়া: <strong id="cust-total-due-badge" class="text-red-400 font-inter">৳ ০</strong></span>
                    </div>
                </div>
            </div>

            <!-- Customer Cards / Table Grid Container -->
            <div id="customer-list-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div class="col-span-full text-center py-12 text-slate-500 text-sm italic"><i class="fa-solid fa-spinner fa-spin mr-2"></i> কাস্টমার তালিকা লোড হচ্ছে...</div>
            </div>

            <!-- Hidden Export Table -->
            <table id="customer-export-table" class="hidden">
                <thead>
                    <tr><th>A/C No</th><th>Name</th><th>Phone</th><th>Zone</th><th>Address</th><th>Total Due</th></tr>
                </thead>
                <tbody id="customer-export-tbody"></tbody>
            </table>
        </div>
    `;
}
