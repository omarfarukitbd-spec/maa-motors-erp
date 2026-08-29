import { escapeHTML, formatAmountWithComma, formatAppDate } from '../utils.js';

/**
 * Render Itemized Product Table for Memo Card
 */
export function renderMemoItemsTable(txn) {
    if (!txn?.hasItems || !txn?.items || txn.items.length === 0) return '';

    return `
        <div class="overflow-x-auto custom-scrollbar border border-slate-700/60 rounded-2xl mb-3.5 bg-slate-950/40 font-bn">
            <table class="w-full text-left text-xs border-collapse">
                <thead>
                    <tr class="bg-slate-900/90 text-slate-300 border-b border-slate-700/60 font-black">
                        <th class="py-2 px-3 text-center w-10">#</th>
                        <th class="py-2 px-3">পণ্যের বিবরণ / আইটেম</th>
                        <th class="py-2 px-3 text-center">পরিমাণ</th>
                        <th class="py-2 px-3 text-right">একক দর</th>
                        <th class="py-2 px-3 text-right">মোট টাকা</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-800/60">
                    ${txn.items.map((it, idx) => `
                        <tr class="hover:bg-slate-800/30 transition-colors">
                            <td class="py-1.5 px-3 text-center font-mono text-slate-500">${String(idx + 1).padStart(2, '0')}</td>
                            <td class="py-1.5 px-3 font-bold text-slate-200">${escapeHTML(it.desc || '-')}</td>
                            <td class="py-1.5 px-3 text-center font-mono text-slate-300">${it.qty || 1} ${it.unit || 'Pcs'}</td>
                            <td class="py-1.5 px-3 text-right font-mono text-slate-300">৳${formatAmountWithComma(it.rate || 0)}</td>
                            <td class="py-1.5 px-3 text-right font-mono font-black text-white">৳${formatAmountWithComma(it.total || 0)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

/**
 * Render Interactive Customer All Memos Navigator Bar
 */
export function renderCustomerAllMemosBar(activeVoucherNo, lifetimeStats = {}) {
    const customerMemos = (lifetimeStats.transactions || [])
        .filter(t => t.voucherNo && t.voucherNo !== 'OPENING' && t.voucherNo !== 'OPEN' && t.voucherNo !== 'প্রারম্ভিক ব্যালেন্স')
        .map(t => ({
            voucherNo: String(t.voucherNo).trim(),
            date: t.date,
            bill: Number(t.bill) || 0,
            paid: Number(t.paid) || 0,
            id: t.id
        }))
        .filter((m, idx, self) => idx === self.findIndex(x => x.voucherNo === m.voucherNo))
        .reverse();

    if (customerMemos.length === 0) return '';

    return `
        <div class="bg-slate-950/70 border border-slate-800/90 rounded-xl p-2.5 space-y-1.5 font-bn">
            <div class="flex items-center justify-between px-0.5">
                <div class="text-[10px] font-black text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                    <i class="fa-solid fa-layer-group text-xs"></i> 
                    <span>এই কাস্টমারের সকল মেমো (${customerMemos.length}টি):</span>
                </div>
                <span class="text-[9px] text-slate-500 font-bold hidden sm:inline"><i class="fa-solid fa-hand-pointer text-[8px] mr-1"></i>যেকোনো মেমোতে ক্লিক করে সরাসরি দেখুন</span>
            </div>
            <div class="flex items-center gap-1.5 overflow-x-auto custom-scrollbar py-0.5 text-xs">
                ${customerMemos.map(m => {
                    const isCurrent = String(m.voucherNo).trim().toUpperCase() === String(activeVoucherNo || '').trim().toUpperCase();
                    const b = m.bill;
                    const p = m.paid;
                    const amountStr = b > 0 ? `৳ ${formatAmountWithComma(b)}` : (p > 0 ? `জমা ৳ ${formatAmountWithComma(p)}` : '');
                    
                    return `
                        <button onclick="window.searchMemoDirectly('${escapeHTML(m.voucherNo)}')" class="px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 border ${
                            isCurrent 
                                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 shadow-sm ring-1 ring-cyan-500/40' 
                                : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-800 hover:border-slate-700'
                        }" title="${isCurrent ? 'বর্তমান প্রদর্শিত মেমো' : 'মেমো #' + escapeHTML(m.voucherNo) + ' দেখুন'}">
                            <span class="font-mono font-black ${isCurrent ? 'text-cyan-400' : 'text-slate-300'}">#${escapeHTML(m.voucherNo)}</span>
                            <span class="text-[10px] text-slate-400 font-mono">(${formatAppDate(m.date)})</span>
                            ${amountStr ? `<span class="text-[10px] font-mono ${isCurrent ? 'text-cyan-300' : (b > 0 ? 'text-red-400' : 'text-emerald-400')}">${amountStr}</span>` : ''}
                            ${isCurrent ? `<span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>` : ''}
                        </button>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}
