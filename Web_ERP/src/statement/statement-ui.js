import { getCustomerCache } from '../customer/index.js';

export function renderStatementUI(container, params, stateRef = {}, callbacks = {}) {
    if (window.AppState?.currentUserRole === 'Staff' && window.AppState?.permissions?.viewStatement === false) {
        container.innerHTML = `<div class="m3-card text-center font-bn py-12"><h2 class="text-xl font-bold text-red-500">অ্যাক্সেস ডিনাইড! আপনার স্টেটমেন্ট দেখার অনুমতি নেই।</h2></div>`;
        return;
    }
    if (!params || !params.customerId) {
        container.innerHTML = `<div class="m3-card text-center font-bn py-12"><h2 class="text-xl font-bold text-red-500">কাস্টমার সিলেক্ট করা হয়নি!</h2></div>`;
        return;
    }

    const cached = getCustomerCache().find(c => c.id === params.customerId);
    const dueVal = Number(cached?.totalDue || params.totalDue || 0);

    const rawName = params.customerName || cached?.name || 'Customer';
    const cleanName = rawName.replace(/^\[.*?\]\s*/, '').trim();

    stateRef.currentCustomerInfo = { 
        id: params.customerId, name: cleanName,
        accountNo: params.accountNo || cached?.accountNo || '', phone: params.customerPhone || cached?.phone || '',
        address: params.customerAddress || cached?.address || '', zone: cached?.zone || '', totalDue: dueVal
    };

    const currentCustomerInfo = stateRef.currentCustomerInfo;
    const firstChar = (cleanName || 'C').charAt(0).toUpperCase();
    const healthBadge = dueVal > 50000 
        ? '<span class="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-black uppercase"><i class="fa-solid fa-circle text-[8px] mr-1 animate-pulse"></i>High Due</span>'
        : (dueVal > 0 ? '<span class="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-black uppercase">Regular</span>' : '<span class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase">Cleared</span>');

    container.innerHTML = `
        <div class="max-w-6xl mx-auto flex flex-col gap-6 pb-24 font-bn">
            <div class="m3-card bg-slate-900/80 border border-slate-800/80 p-4 md:p-5 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
                <div class="flex items-center gap-4 w-full md:w-auto">
                    <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white font-black text-xl flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">${firstChar}</div>
                    <div>
                        <div class="flex items-center gap-2 flex-wrap">
                            <h1 class="text-xl md:text-2xl font-black text-white tracking-tight">${currentCustomerInfo.name}</h1>
                            ${currentCustomerInfo.accountNo ? `<span class="px-2 py-0.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black">#${currentCustomerInfo.accountNo}</span>` : ''}
                            ${healthBadge}
                        </div>
                        <div class="flex items-center gap-3 text-xs text-slate-400 font-bold mt-1 flex-wrap">
                            <span><i class="fa-solid fa-phone text-[10px] mr-1 text-slate-500"></i>${currentCustomerInfo.phone || '-'}</span>
                            <span>•</span><span><i class="fa-solid fa-location-dot text-[10px] mr-1 text-slate-500"></i>${currentCustomerInfo.address || '-'}</span>
                            ${currentCustomerInfo.zone ? `<span>•</span><span class="text-blue-400 font-black">${currentCustomerInfo.zone}</span>` : ''}
                        </div>
                    </div>
                </div>
                <div class="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end shrink-0">
                    <button type="button" class="h-9 px-3 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600 hover:text-white font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5" onclick="window.quickCollectPaymentFromStmt()"><i class="fa-solid fa-plus text-xs"></i><span>+ জমা নিন</span></button>
                    <button type="button" class="h-9 px-3 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600 hover:text-white font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5" onclick="window.sendStmtReminderSMS()"><i class="fa-solid fa-comment-sms text-xs"></i><span>SMS তাগাদা</span></button>
                    <button type="button" class="h-9 px-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600 hover:text-white font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5" onclick="window.sendStmtReminderWhatsApp()"><i class="fa-brands fa-whatsapp text-sm"></i><span>WhatsApp তাগাদা</span></button>
                    <button type="button" class="h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-lg active:scale-95 transition-all cursor-pointer flex items-center gap-1.5" onclick="window.printStatement()"><i class="fa-solid fa-print text-xs"></i><span>প্রিন্ট মেমো (PDF)</span></button>
                    <button type="button" class="h-9 px-4 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 font-black text-xs active:scale-95 transition-all cursor-pointer flex items-center gap-1.5" onclick="window.exportTableToExcel('statement-export-table', 'customer-statement.xlsx')"><i class="fa-solid fa-file-excel text-emerald-400"></i><span>এক্সেল</span></button>
                    <button type="button" class="h-9 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer" onclick="navigate('customers')"><i class="fa-solid fa-arrow-left mr-1"></i>ব্যাক</button>
                </div>
            </div>

            <div class="m3-card bg-slate-900/60 border border-slate-800/80 p-4 md:p-5 rounded-2xl shadow-xl flex flex-col gap-3 font-bn">
                <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                    <div class="flex items-center gap-2 cursor-pointer" onclick="window.toggleStmtFilterCollapse()">
                        <span class="text-xs font-black text-blue-400 uppercase tracking-widest flex items-center gap-2"><i class="fa-solid fa-filter"></i> ফিল্টার ও সময়কাল</span>
                        <i class="fa-solid fa-chevron-down text-slate-500 text-xs md:hidden"></i>
                    </div>
                    <div class="flex flex-wrap gap-1.5">
                        <button type="button" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white text-[11px] font-bold active:scale-95 transition-all cursor-pointer" onclick="window.setStmtPresetDate('today')">আজ</button>
                        <button type="button" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white text-[11px] font-bold active:scale-95 transition-all cursor-pointer" onclick="window.setStmtPresetDate('this_month')">চলতি মাস</button>
                        <button type="button" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white text-[11px] font-bold active:scale-95 transition-all cursor-pointer" onclick="window.setStmtPresetDate('last_month')">গত মাস</button>
                        <button type="button" class="px-2.5 py-1 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600 hover:text-white text-[11px] font-bold active:scale-95 transition-all cursor-pointer" onclick="window.clearStatementFilter()">সব সময়</button>
                    </div>
                </div>
                <div id="stmt-filter-grid" class="grid grid-cols-1 md:grid-cols-3 gap-3 items-end pt-1">
                    <div><label class="m3-label text-slate-400 mb-1.5 block text-xs font-bold">শুরুর তারিখ</label><input type="text" id="stmt-start-date" class="w-full bg-slate-950/90 border border-slate-700/70 rounded-xl h-10 px-3.5 text-xs text-white datepicker cursor-pointer focus:border-blue-500 transition-all" placeholder="DD/MM/YYYY"></div>
                    <div><label class="m3-label text-slate-400 mb-1.5 block text-xs font-bold">শেষের তারিখ</label><input type="text" id="stmt-end-date" class="w-full bg-slate-950/90 border border-slate-700/70 rounded-xl h-10 px-3.5 text-xs text-white datepicker cursor-pointer focus:border-blue-500 transition-all" placeholder="DD/MM/YYYY"></div>
                    <div class="flex gap-2"><button type="button" class="h-10 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs flex-grow shadow-lg shadow-blue-600/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2" onclick="window.loadStatementData()"><i class="fa-solid fa-magnifying-glass text-xs"></i><span>ফিল্টার করুন</span></button></div>
                </div>
            </div>

            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="m3-card p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex flex-col justify-between"><span class="text-[10px] font-black text-red-400 uppercase tracking-wider">মোট খরচ (Debit)</span><h2 id="stmt-total-bill" class="text-xl md:text-2xl font-black text-red-400 mt-2">৳ 0</h2></div>
                <div class="m3-card p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col justify-between"><span class="text-[10px] font-black text-emerald-400 uppercase tracking-wider">মোট জমা (Credit)</span><h2 id="stmt-total-paid" class="text-xl md:text-2xl font-black text-emerald-400 mt-2">৳ 0</h2></div>
                <div class="m3-card p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col justify-between"><span class="text-[10px] font-black text-amber-400 uppercase tracking-wider">মোট ছাড় (Less)</span><h2 id="stmt-total-less" class="text-xl md:text-2xl font-black text-amber-400 mt-2">৳ 0</h2></div>
                <div class="m3-card p-4 rounded-2xl bg-gradient-to-tr from-blue-900/40 to-purple-900/40 border border-blue-500/40 shadow-xl flex flex-col justify-between"><span class="text-[10px] font-black text-blue-300 uppercase tracking-wider">অবশিষ্ট বকেয়া (Net Due)</span><h2 id="stmt-total-due" class="text-xl md:text-2xl font-black text-blue-400 mt-2">৳ 0</h2></div>
            </div>

            <div class="m3-card bg-slate-900/60 border border-slate-800/80 p-4 md:p-5 rounded-2xl shadow-xl flex flex-col gap-3">
                <div class="flex justify-between items-center border-b border-slate-800/80 pb-2">
                    <h2 class="text-xs font-black text-blue-400 uppercase tracking-widest flex items-center gap-2"><i class="fa-solid fa-book"></i> খতিয়ান পাসবুক লেনদেনসমূহ</h2>
                    <span id="stmt-count-badge" class="text-[11px] text-slate-400 font-bold">০ টি লেনদেন</span>
                </div>
                <div class="desktop-only m3-table-container overflow-x-auto">
                    <table id="statement-export-table" class="m3-table w-full min-w-[750px]">
                        <thead>
                            <tr class="text-xs font-black text-slate-400">
                                <th class="w-28">তারিখ</th><th>বিবরণ / মাধ্যম / ভাউচার</th><th class="w-32 text-right">খরচ (Debit ৳)</th><th class="w-32 text-right">জমা (Credit ৳)</th><th class="w-36 text-right">বর্তমান ব্যালেন্স (Balance ৳)</th>
                            </tr>
                        </thead>
                        <tbody id="statement-list"></tbody>
                    </table>
                </div>
                <div id="statement-list-mobile" class="mobile-only flex flex-col gap-2.5"></div>
            </div>

            <div class="m3-card bg-slate-900/60 border border-slate-800/80 p-4 md:p-5 rounded-2xl shadow-xl flex flex-col gap-2">
                <label class="text-xs font-black text-amber-400 uppercase tracking-widest flex items-center gap-2"><i class="fa-solid fa-pen-to-square"></i> বিশেষ নোটিশ / শর্তাবলি (Custom Statement Note)</label>
                <textarea id="stmt-custom-note" class="w-full bg-slate-950/80 border border-slate-700/70 rounded-xl p-3 text-xs text-slate-200 outline-none focus:border-blue-500 min-h-[70px]" placeholder="প্রিন্ট মেমোর নিচে ম্যানুয়ালি যেকোনো বিশেষ নোটিশ বা শর্ত লিখতে পারেন (যেমন: আগামী ১৫ দিনের মধ্যে বকেয়া পরিশোধের অনুরোধ)..."></textarea>
                <span class="text-[10px] text-slate-500 font-bold">* এখানে যা ম্যানুয়ালি টাইপ করবেন তা সরাসরি স্টেটমেন্ট প্রিন্ট কপির নিচে প্রদর্শিত হবে।</span>
            </div>
        </div>`;

    if (callbacks.loadStatementData) callbacks.loadStatementData();
}
