import { formatAmountWithComma, formatAppDate, escapeHTML } from '../utils.js';

/**
 * Render In-Card Customer Recent Transactions History Section
 */
export function renderInCardLedgerHistory(customerId, customerName, accountNo, lifetimeStats = {}) {
    const txns = lifetimeStats.transactions || [];
    if (!customerId || txns.length === 0) return '';

    // Last 5 recent transactions
    const recentTxns = txns.slice(-5).reverse();

    return `
        <div class="bg-slate-950/60 border border-slate-800 rounded-3xl p-4 sm:p-5 space-y-3.5 font-bn">
            <!-- Header & Summary Chips -->
            <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center text-sm">
                        <i class="fa-solid fa-clock-rotate-left"></i>
                    </div>
                    <div>
                        <div class="text-xs font-black text-white">এই কাস্টমারের সাম্প্রতিক লেনদেন বিবরণী (Recent Ledger)</div>
                        <div class="text-[10px] text-slate-400">কাস্টমারের শেষ ৫টি ট্রানজেকশনের সংক্ষিপ্ত প্রিভিউ</div>
                    </div>
                </div>

                <div class="flex items-center gap-2 flex-wrap text-xs">
                    <div class="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-bold text-slate-300">
                        মোট ক্রয়: <span class="font-mono text-red-400 font-black">৳ ${formatAmountWithComma(lifetimeStats.totalBills || 0)}</span>
                    </div>
                    <div class="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-bold text-slate-300">
                        মোট পরিশোধ: <span class="font-mono text-emerald-400 font-black">৳ ${formatAmountWithComma(lifetimeStats.totalPaid || 0)}</span>
                    </div>
                    <button onclick="window.openCustomerLedgerDrawer('${customerId}', '${escapeHTML(customerName)}', '${escapeHTML(accountNo)}')" class="px-3 py-1 rounded-xl bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 active:scale-95">
                        <i class="fa-solid fa-book-open text-[10px]"></i> <span>সব খতিয়ান ও A4 প্রিন্ট</span>
                    </button>
                </div>
            </div>

            <!-- Table -->
            <div class="overflow-x-auto custom-scrollbar rounded-2xl border border-slate-800/80 bg-slate-950/40">
                <table class="w-full text-left border-collapse text-xs">
                    <thead>
                        <tr class="bg-slate-900/80 border-b border-slate-800 text-[11px] font-black text-slate-400">
                            <th class="py-2.5 px-3 text-center w-10">#</th>
                            <th class="py-2.5 px-3">তারিখ</th>
                            <th class="py-2.5 px-3 text-center">মেমো নং</th>
                            <th class="py-2.5 px-3">বিবরণ / নোট</th>
                            <th class="py-2.5 px-3 text-right text-red-400">বিল (Debit)</th>
                            <th class="py-2.5 px-3 text-right text-emerald-400">জমা (Credit)</th>
                            <th class="py-2.5 px-3 text-right">ব্যালেন্স</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-800/50">
                        ${recentTxns.map((t, idx) => {
                            const b = Number(t.bill) || 0;
                            const p = Number(t.paid) || 0;
                            const vNo = t.voucherNo || '';
                            const vBadge = vNo ? `<button onclick="window.searchMemoDirectly('${escapeHTML(vNo)}')" class="px-2 py-0.5 rounded bg-blue-500/10 hover:bg-cyan-600 text-blue-400 hover:text-white font-mono font-bold text-[10px] border border-blue-500/20 transition-all cursor-pointer" title="এই মেমোতে যান">#${escapeHTML(vNo)}</button>` : '<span class="text-slate-600 font-mono">-</span>';
                            const due = Number(t.currentDue || 0);

                            return `
                                <tr class="hover:bg-slate-800/30 transition-colors font-medium">
                                    <td class="py-2 px-3 text-center font-mono text-slate-500">${idx + 1}</td>
                                    <td class="py-2 px-3 font-mono text-slate-300 whitespace-nowrap">${formatAppDate(t.date)}</td>
                                    <td class="py-2 px-3 text-center whitespace-nowrap">${vBadge}</td>
                                    <td class="py-2 px-3 text-slate-300 truncate max-w-[150px]">${escapeHTML(t.notes || (b > 0 ? 'পণ্য ক্রয়' : 'টাকা জমা'))}</td>
                                    <td class="py-2 px-3 text-right font-mono font-bold text-red-400">${b > 0 ? '৳ ' + formatAmountWithComma(b) : '-'}</td>
                                    <td class="py-2 px-3 text-right font-mono font-bold text-emerald-400">${p > 0 ? '৳ ' + formatAmountWithComma(p) : '-'}</td>
                                    <td class="py-2 px-3 text-right font-mono font-black ${due > 0 ? 'text-red-400' : 'text-emerald-400'}">৳ ${formatAmountWithComma(Math.abs(due))} ${due < 0 ? '(Adv)' : ''}</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}
