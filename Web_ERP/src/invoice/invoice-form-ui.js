import { getTodayLocalDateString } from '../utils.js';
import { getHoldBills, setInvoiceItems } from './invoice-logic.js';

export function renderInvoiceUI(container, params = null, callbacks = {}) {
    if (window.AppState?.currentUserRole === 'Staff' && window.AppState?.permissions?.viewInvoice === false) {
        container.innerHTML = `<div class="m3-card text-center font-bn py-12"><h2 class="text-xl font-black text-red-500">অ্যাক্সেস ডিনাইড!</h2></div>`;
        return;
    }

    const holdBills = getHoldBills();
    const holdBadgeHtml = holdBills.length > 0 ? `<span class="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] ml-1 animate-pulse">${holdBills.length}</span>` : '';

    container.innerHTML = `
        <div class="max-w-6xl mx-auto flex flex-col gap-4 md:gap-5 pb-28 font-bn">
            <!-- Header Card -->
            <div class="m3-card bg-slate-900/80 border border-slate-800/80 p-3.5 md:p-4 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-3">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center text-lg shrink-0"><i class="fa-solid fa-file-invoice"></i></div>
                    <div><h1 class="text-lg md:text-xl font-black text-white tracking-tight">ভাউচার / ইনভয়েস জেনারেটর</h1><p class="text-[10px] text-slate-400 font-bold">কমান্ড সেন্টার বিলিং • অফলাইন প্রিন্ট সিস্টেম</p></div>
                </div>
                <div class="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
                    <button data-perm="holdInvoiceBtn" type="button" class="h-9 px-3 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-400 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer" onclick="window.holdCurrentBill && window.holdCurrentBill()"><i class="fa-solid fa-pause text-xs"></i><span>হোল্ড করুন</span>${holdBadgeHtml}</button>
                    <button data-perm="printInvoicePOS" type="button" class="h-9 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md active:scale-95 transition-all cursor-pointer flex items-center gap-1.5" onclick="window.saveAndPrintInvoice('pos')"><i class="fa-solid fa-receipt text-xs"></i><span>POS মেমো</span></button>
                    <button data-perm="printInvoiceA4" type="button" class="h-9 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-md active:scale-95 transition-all cursor-pointer flex items-center gap-1.5" onclick="window.saveAndPrintInvoice('a4')"><i class="fa-solid fa-print text-xs"></i><span>A4 ইনভয়েস</span></button>
                </div>
            </div>

            ${holdBills.length > 0 ? `<div class="m3-card bg-amber-500/10 border border-amber-500/30 p-3 rounded-2xl flex flex-col gap-2"><div class="text-xs font-black text-amber-400 uppercase tracking-widest flex items-center gap-2"><i class="fa-solid fa-clock-rotate-left"></i> হোল্ডকৃত ড্রাফট বিলসমূহ (${holdBills.length} টি)</div><div class="flex flex-wrap gap-2">${holdBills.map((hb, idx) => `<button type="button" class="px-3 py-1.5 rounded-xl bg-slate-900 border border-amber-500/40 hover:border-amber-400 text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-all" onclick="window.resumeHoldBill(${idx})"><span class="text-amber-400 font-black">${hb.customerName}</span><span class="text-[10px] text-slate-400">(${hb.time})</span><i class="fa-solid fa-play text-[10px] text-emerald-400"></i></button>`).join('')}</div></div>` : ''}

            <!-- Customer & Metadata Info -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 relative z-30">
                <div class="m3-card bg-slate-900/90 border border-slate-800/80 p-3.5 md:p-4 rounded-2xl shadow-xl lg:col-span-2 flex flex-col gap-2.5 relative z-30">
                    <div class="flex justify-between items-center border-b border-slate-800/80 pb-2"><h2 class="text-xs font-black text-blue-400 uppercase tracking-widest flex items-center gap-2"><i class="fa-solid fa-user"></i> কাস্টমার তথ্য নির্বাচন</h2><button data-perm="addCustomer" type="button" class="text-xs text-blue-400 font-bold hover:underline cursor-pointer" onclick="window.quickAddCustomerFromInvoice && window.quickAddCustomerFromInvoice()"><i class="fa-solid fa-user-plus text-[10px] mr-1"></i>+ নতুন কাস্টমার</button></div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
                        <div class="relative z-40">
                            <label class="m3-label text-slate-400 mb-1.5 block text-xs font-bold">কাস্টমার খুঁজুন বা সিলেক্ট করুন *</label>
                            <div class="relative">
                                <i class="fa-solid fa-magnifying-glass absolute left-3 top-3 text-slate-500 text-xs pointer-events-none"></i>
                                <input type="text" id="inv-cust-search-input" class="w-full bg-slate-950/90 border border-slate-700/70 rounded-xl h-10 pl-9 pr-8 text-xs text-white font-bold outline-none focus:border-blue-500 shadow-inner transition-all" placeholder="নাম, ফোন বা অ্যাকাউন্ট নং টাইপ করুন..." oninput="window.filterInvoiceCustomerSearch(this.value)" onfocus="window.filterInvoiceCustomerSearch(this.value)">
                                <button type="button" id="inv-cust-search-clear" class="hidden absolute right-2.5 top-2.5 w-5 h-5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-[10px] flex items-center justify-center cursor-pointer transition-all" onclick="window.clearInvoiceCustomerSearch()"><i class="fa-solid fa-xmark"></i></button>
                            </div>
                            <select id="inv-customer-select" class="hidden" onchange="window.invoiceCustomerChanged()"></select>
                            <!-- Searchable Dropdown Results -->
                            <div id="inv-cust-dropdown" class="hidden absolute left-0 right-0 top-full mt-1.5 bg-slate-900 border border-slate-700/90 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] z-[999] max-h-64 overflow-y-auto custom-scrollbar p-1.5 flex flex-col gap-1 backdrop-blur-2xl"></div>
                        </div>
                        <div class="relative">
                            <label class="m3-label text-slate-400 mb-1.5 block text-xs font-bold opacity-0 hidden md:block">কাস্টমার প্রোফাইল</label>
                            <div id="inv-cust-display" class="p-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-400 h-10 flex flex-col justify-center font-bold">সিলেক্ট করা হয়নি</div>
                        </div>
                    </div>
                </div>

                <div class="m3-card bg-slate-900/60 border border-slate-800/80 p-3.5 md:p-4 rounded-2xl shadow-xl flex flex-col gap-2.5">
                    <h2 class="text-xs font-black text-blue-400 uppercase tracking-widest border-b border-slate-800/80 pb-2 flex items-center gap-2"><i class="fa-solid fa-receipt"></i> ভাউচার মেটাডাটা</h2>
                    <div class="grid grid-cols-2 gap-2.5">
                        <div><label class="m3-label text-slate-400 mb-1 block text-xs font-bold">তারিখ *</label><input type="text" id="inv-date" class="w-full bg-slate-950/90 border border-slate-700/70 rounded-xl h-10 px-3 text-xs text-white datepicker cursor-pointer"></div>
                        <div><label class="m3-label text-slate-400 mb-1 block text-xs font-bold">মেমো নং (Voucher No)</label><input type="text" id="inv-voucher" class="w-full bg-slate-950/90 border border-slate-700/70 rounded-xl h-10 px-3 text-xs text-blue-400 font-bold outline-none" placeholder="মেমো নং..."></div>
                    </div>
                </div>
            </div>

            <!-- Items Table Card -->
            <div class="m3-card bg-slate-900/60 border border-slate-800/80 p-3.5 md:p-4 rounded-2xl shadow-xl flex flex-col gap-3">
                <div class="flex justify-between items-center border-b border-slate-800/80 pb-2"><h2 class="text-xs font-black text-blue-400 uppercase tracking-widest flex items-center gap-2"><i class="fa-solid fa-list-check"></i> বিক্রয়কৃত আইটেম লিস্ট</h2><button type="button" class="h-8 px-3 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer" onclick="window.addInvoiceItemRow()"><i class="fa-solid fa-plus text-xs"></i><span>+ লাইন যোগ করুন</span></button></div>
                <div class="m3-table-container overflow-x-auto rounded-xl border border-slate-800">
                    <table class="m3-table w-full min-w-[650px]">
                        <thead>
                            <tr class="text-xs font-black text-slate-400 bg-slate-950/80 border-b border-slate-800">
                                <th class="w-10 text-center py-3 px-2">#</th>
                                <th class="text-left py-3 px-2 min-w-[240px]">আইটেমের বিবরণ (ITEM DETAILS)</th>
                                <th class="w-28 text-center py-3 px-2">একক (UNIT)</th>
                                <th class="w-28 text-center py-3 px-2">পরিমাণ (QTY)</th>
                                <th class="w-36 text-center py-3 px-2">রেট (RATE ৳)</th>
                                <th class="w-40 text-right py-3 px-2">মোট (TOTAL ৳)</th>
                                <th class="w-12 text-center py-3 px-1"></th>
                            </tr>
                        </thead>
                        <tbody id="inv-items-tbody"></tbody>
                    </table>
                </div>
            </div>

            <!-- Notes & Summary Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
                <div class="m3-card bg-slate-900/60 border border-slate-800/80 p-3.5 md:p-4 rounded-2xl shadow-xl flex flex-col gap-2">
                    <label class="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><i class="fa-solid fa-note-sticky text-amber-400"></i> নোট / শর্তাবলী (NOTES)</label>
                    <textarea id="inv-notes" class="w-full bg-slate-950/80 border border-slate-700/70 rounded-xl p-3 text-xs text-slate-200 outline-none focus:border-blue-500 min-h-[140px] flex-grow resize-none" placeholder="ভাউচার নোট বা ম্যানুয়াল শর্তাদি লিখুন..."></textarea>
                </div>

                <div class="m3-card bg-slate-900/80 border border-slate-800/90 p-4 md:p-5 rounded-2xl shadow-xl flex flex-col gap-3 font-bn">
                    <div class="flex items-center justify-between"><span class="text-xs font-bold text-slate-400">সাব-টোটাল (Subtotal):</span><div class="text-right"><input type="text" id="inv-subtotal" class="w-36 bg-slate-950/90 border border-slate-700/60 rounded-xl h-9 px-3 text-right text-xs font-black text-white outline-none" readonly onkeyup="window.handleNumberInput(this); window.calcInvoiceTotals(); window.updateLiveWords(this, 'inv-sub-words');"><div id="inv-sub-words" class="text-[10px] text-blue-400 hidden italic mt-0.5"></div></div></div>
                    <div data-perm="allowInvoiceDiscount" class="flex items-center justify-between"><span class="text-xs font-bold text-orange-400">ডিসকাউন্ট (Discount):</span><div class="text-right"><div class="flex bg-slate-950/90 rounded-xl border border-orange-500/30 overflow-hidden h-9"><input type="text" id="inv-discount" class="w-24 bg-transparent text-right text-orange-400 font-bold px-3 text-xs outline-none" placeholder="০" onkeyup="window.handleNumberInput(this); window.calcInvoiceTotals(); window.updateLiveWords(this, 'inv-disc-words');"><button type="button" id="inv-disc-mode-btn" class="px-3 bg-orange-500/20 text-orange-400 border-l border-orange-500/30 text-xs font-black cursor-pointer" onclick="window.toggleInvoiceDiscMode()" data-mode="fixed">৳</button></div><div id="inv-disc-words" class="text-[10px] text-orange-400 hidden italic mt-0.5"></div></div></div>
                    <div class="flex items-center justify-between border-b border-slate-800/80 pb-2.5"><span class="text-xs font-bold text-slate-400">পূর্বের বকেয়া (Prev Due):</span><input type="text" id="inv-prev-due" class="w-36 bg-slate-950/60 border border-slate-800 rounded-xl h-9 px-3 text-right text-xs font-bold text-slate-400 outline-none" readonly></div>
                    <div class="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-blue-500/30"><span class="text-xs md:text-sm font-black text-white">সর্বমোট পাওনা (Grand Total):</span><div class="text-right"><div class="text-lg md:text-xl font-black text-blue-400" id="inv-net-total-display">৳ 0</div><div id="inv-net-words" class="text-[10px] text-blue-400 italic"></div></div></div>

                    <div class="flex flex-col gap-2 p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
                        <span class="text-[10px] font-black text-slate-400 uppercase tracking-wider">ক্যাশ পরিশোধ শর্টকাট (Quick Tender)</span>
                        <div class="flex flex-wrap gap-1.5">
                            <button type="button" class="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white text-xs font-bold active:scale-95 transition-all cursor-pointer" onclick="window.setInvoiceTender(500)">৳ ৫০০</button>
                            <button type="button" class="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white text-xs font-bold active:scale-95 transition-all cursor-pointer" onclick="window.setInvoiceTender(1000)">৳ ১,০০০</button>
                            <button type="button" class="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white text-xs font-bold active:scale-95 transition-all cursor-pointer" onclick="window.setInvoiceTender(2000)">৳ ২,০০০</button>
                            <button type="button" class="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white text-xs font-bold active:scale-95 transition-all cursor-pointer" onclick="window.setInvoiceTender(5000)">৳ ৫,০০০</button>
                            <button type="button" class="px-2.5 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600 hover:text-white text-xs font-bold active:scale-95 transition-all cursor-pointer" onclick="window.setInvoiceTender('exact')">একজ্যাক্ট</button>
                        </div>
                        <div id="inv-change-return-box" class="hidden text-xs font-black text-emerald-400 pt-1 border-t border-slate-800 flex justify-between"><span>কাস্টমারকে ফেরত (Change):</span><span id="inv-change-return-display">৳ ০</span></div>
                    </div>

                    <div class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col gap-2">
                        <div class="flex items-center justify-between"><span class="text-xs font-black text-emerald-400">নগদ/ব্যাংক জমা (Paid):</span><input type="text" id="inv-paid" class="w-36 bg-slate-950/90 border border-emerald-500/40 rounded-xl h-9 px-3 text-right text-sm font-black text-emerald-400 outline-none focus:border-emerald-500" placeholder="০.০০" onkeyup="window.handleNumberInput(this); window.calcInvoiceTotals(); window.toggleInvoiceRecvSection(); window.updateLiveWords(this, 'inv-paid-words');"></div>
                        <div id="inv-paid-words" class="text-right text-[10px] text-emerald-400 italic"></div>
                        <div id="inv-recv-section" class="hidden flex flex-col gap-2 pt-2 border-t border-emerald-500/20"><div class="flex items-center justify-between"><span class="text-[11px] text-slate-400 font-bold">পেমেন্ট মাধ্যম:</span><div class="flex bg-slate-950 p-0.5 rounded-lg border border-slate-700 text-xs"><button type="button" id="inv-recv-cash-btn" class="px-3 py-1 rounded-md bg-emerald-600 text-white font-bold" onclick="window.setInvoiceRecvType('Cash')">Cash</button><button type="button" id="inv-recv-bank-btn" class="px-3 py-1 rounded-md text-slate-400 font-bold" onclick="window.setInvoiceRecvType('Bank')">Bank</button></div></div><input id="inv-received-from" class="w-full bg-slate-950/90 border border-slate-700/60 rounded-xl h-8 px-3 text-xs text-white outline-none" placeholder="ব্যাংকের নাম বা মন্তব্য (ঐচ্ছিক)..."></div>
                    </div>

                    <div class="flex items-center justify-between p-3 rounded-xl bg-red-500/10 border border-red-500/30">
                        <span class="text-xs font-black text-red-400">বর্তমান নিট বকেয়া (Net Due):</span>
                        <div class="text-right"><div class="text-lg md:text-xl font-black text-red-400" id="inv-current-due-display">৳ 0</div><div id="inv-due-words" class="text-[10px] text-red-400 italic"></div></div>
                    </div>
                </div>
            </div>

            <!-- Sticky Bottom Bar -->
            <div class="bg-slate-900/95 border border-blue-500/30 rounded-2xl p-3 md:p-3.5 sticky bottom-4 z-20 shadow-[0_-10px_25px_rgba(0,0,0,0.6)] flex flex-wrap items-center justify-between gap-3 backdrop-blur-xl">
                <div class="text-xs font-bold text-slate-300 flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span><span>ইনভয়েস সেভ ও অফলাইন প্রিন্ট কমান্ড:</span></div>
                <div class="flex items-center gap-2">
                    <button data-perm="printInvoicePOS" type="button" class="h-9 md:h-10 px-4 md:px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md active:scale-95 transition-all cursor-pointer flex items-center gap-1.5" onclick="window.saveAndPrintInvoice('pos')"><i class="fa-solid fa-receipt text-xs"></i><span>POS সেভ ও প্রিন্ট</span></button>
                    <button data-perm="printInvoiceA4" type="button" class="h-9 md:h-10 px-4 md:px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-md active:scale-95 transition-all cursor-pointer flex items-center gap-1.5" onclick="window.saveAndPrintInvoice('a4')"><i class="fa-solid fa-print text-xs"></i><span>A4 সেভ ও প্রিন্ট</span></button>
                </div>
            </div>
        </div>
    `;

    document.getElementById('inv-date').value = getTodayLocalDateString();
    setInvoiceItems([{ desc: '', qty: 1, unit: 'Pcs', rate: 0, total: 0 }]);
    if (callbacks.loadInvoiceCustomers) callbacks.loadInvoiceCustomers(params?.customerId);
    if (callbacks.renderInvoiceItems) callbacks.renderInvoiceItems();
}
