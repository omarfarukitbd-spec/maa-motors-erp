import Swal from 'sweetalert2';
import { formatAmountWithComma, formatAppDate, escapeHTML, safeRound } from '../utils.js';
import { fetchMemosByRange } from '../memo_search/memo-book-audit-calc.js';
import { printMemoBookAuditReport } from '../memo_search/memo-book-audit-print.js';
import { calculateBookAuditSummary } from '../memo_search/memo-book-audit-calc.js';

/**
 * Open interactive Book Inspector modal
 * @param {Object} book - Godown memo book document
 */
export async function openGodownBookInspector(book) {
    if (!book) return;

    const startNo = Number(book.startMemoNo) || 1;
    const endNo = Number(book.endMemoNo) || 1;
    const gross = Number(book.grossSales) || 0;
    const less = Number(book.totalLess) || 0;
    const net = Number(book.netSales) || 0;
    const cum = Number(book.cumulativeNetSales) || 0;
    const isHist = Boolean(book.isHistorical);

    const sDate = book.startDate ? formatAppDate(book.startDate) : '';
    const eDate = book.endDate ? formatAppDate(book.endDate) : '';
    const dateRangeStr = sDate && eDate ? `${sDate} হতে ${eDate}` : (eDate || sDate || 'তারিখ নেই');

    const result = await Swal.fire({
        title: `<div class="flex items-center gap-2 text-base text-cyan-400 font-black"><i class="fa-solid fa-book-bookmark"></i><span>মেমো বই #${escapeHTML(book.bookNo)} বিস্তারিত অডিট ডেক</span></div>`,
        html: `
            <div class="space-y-3.5 text-left font-bn text-xs">
                <!-- Top Badge Bar -->
                <div class="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <div>
                        <div class="text-[10px] text-slate-400 font-bold uppercase">বই পরিচিতি ও নথি</div>
                        <div class="font-black text-white text-sm">ক্রমিক নং: ${book.bookSerial} • রেঞ্জ: #${escapeHTML(book.bookNo)}</div>
                        <div class="text-[11px] text-slate-400 mt-0.5"><i class="fa-solid fa-calendar-days text-cyan-400 mr-1"></i>${dateRangeStr}</div>
                    </div>
                    <div class="text-right">
                        <span class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${isHist ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'}">
                            ${isHist ? '<i class="fa-solid fa-box-archive mr-1"></i>হস্তলিখিত খাতা' : '<i class="fa-solid fa-cloud-check mr-1"></i>অ্যাপ লাইভ বুক'}
                        </span>
                        <div class="text-[10px] text-slate-400 mt-1 font-mono">নথি: ${escapeHTML(book.documentNo || '০০০০১')}</div>
                    </div>
                </div>

                <!-- 4 KPI Cards -->
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                    <div class="bg-slate-900 border border-slate-800 p-2 rounded-xl">
                        <div class="text-[10px] text-slate-400 font-bold uppercase">মোট বিক্রয় (Debit)</div>
                        <div class="font-mono font-black text-red-400 text-sm mt-0.5">৳ ${formatAmountWithComma(gross)}</div>
                    </div>
                    <div class="bg-slate-900 border border-slate-800 p-2 rounded-xl">
                        <div class="text-[10px] text-slate-400 font-bold uppercase">লেস / ছাড়</div>
                        <div class="font-mono font-black text-purple-400 text-sm mt-0.5">৳ ${formatAmountWithComma(less)}</div>
                    </div>
                    <div class="bg-slate-900 border border-slate-800 p-2 rounded-xl">
                        <div class="text-[10px] text-slate-400 font-bold uppercase">নিট বিক্রয়</div>
                        <div class="font-mono font-black text-emerald-400 text-sm mt-0.5">৳ ${formatAmountWithComma(net)}</div>
                    </div>
                    <div class="bg-slate-900 border border-slate-800 p-2 rounded-xl">
                        <div class="text-[10px] text-slate-400 font-bold uppercase">ক্রমপুঞ্জিত মোট</div>
                        <div class="font-mono font-black text-cyan-400 text-sm mt-0.5">৳ ${formatAmountWithComma(cum)}</div>
                    </div>
                </div>

                <!-- Digital Stamp Verification Box -->
                <div class="p-3 bg-blue-950/20 border border-blue-500/30 rounded-xl flex items-center justify-between gap-3">
                    <div class="flex items-center gap-2.5">
                        <div class="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 text-base">
                            <i class="fa-solid fa-stamp"></i>
                        </div>
                        <div>
                            <div class="font-black text-white text-xs">ডিজিটাল অনুমোদিত রাবার স্ট্যাম্প</div>
                            <div class="text-[11px] text-blue-300 font-bold">${escapeHTML(book.inChargeName || 'মোঃ এমরান')} (আইডি-${escapeHTML(book.inChargeId || '১৯২৫')})</div>
                            <div class="text-[10px] text-slate-400">সমাপ্তি তারিখ: ${formatAppDate(book.stampDate || book.endDate)}</div>
                        </div>
                    </div>
                    <div class="text-right">
                        <span class="px-2 py-0.5 rounded bg-blue-500/20 border border-blue-500/40 text-blue-300 text-[10px] font-black">
                            <i class="fa-solid fa-circle-check text-emerald-400 mr-1"></i>১০০% অডিটকৃত
                        </span>
                    </div>
                </div>

                <!-- Live Memos Container (if app live book) -->
                <div id="inspector-memos-container" class="space-y-2">
                    ${isHist ? `
                        <div class="bg-slate-950 p-4 rounded-xl border border-dashed border-slate-800 text-center text-slate-400 space-y-1">
                            <i class="fa-solid fa-file-shield text-amber-400 text-lg"></i>
                            <div class="font-bold text-slate-300">কম্পিউটার পূর্ববর্তী হস্তলিখিত নথি</div>
                            <div class="text-[11px] text-slate-500">এই বইয়ের হিসাবটি মূল রেজিস্টার খাতা হতে সরাসরি ডিজিটালাইজড ও লক করা হয়েছে।</div>
                        </div>
                    ` : `
                        <div class="text-center py-4 text-slate-400">
                            <i class="fa-solid fa-circle-notch animate-spin mr-1"></i> লাইভ ট্রানজাকশন লোড হচ্ছে...
                        </div>
                    `}
                </div>
            </div>
        `,
        width: '680px',
        showCloseButton: true,
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-print mr-1"></i>বই অডিট রিপোর্ট প্রিন্ট',
        cancelButtonText: 'বন্ধ করুন',
        confirmButtonColor: '#0284c7',
        cancelButtonColor: '#334155',
        customClass: {
            popup: 'bg-slate-900 border border-slate-800 rounded-3xl text-white'
        },
        didOpen: async () => {
            if (!isHist) {
                const res = await fetchMemosByRange(startNo, endNo);
                const container = document.getElementById('inspector-memos-container');
                if (!container) return;

                if (!res.success || res.memos.length === 0) {
                    container.innerHTML = `<div class="p-3 bg-slate-950 rounded-xl text-center text-slate-500 text-xs">এই রেঞ্জে কোনো সক্রিয় লেনদেন পাওয়া যায়নি।</div>`;
                    return;
                }

                container.innerHTML = `
                    <div class="max-h-48 overflow-y-auto custom-scrollbar border border-slate-800 rounded-xl">
                        <table class="w-full text-[11px] border-collapse">
                            <thead class="bg-slate-950 sticky top-0 text-slate-400">
                                <tr>
                                    <th class="py-1 px-2 text-center">মেমো</th>
                                    <th class="py-1 px-2 text-left">কাস্টমার</th>
                                    <th class="py-1 px-2 text-center">তারিখ</th>
                                    <th class="py-1 px-2 text-right">বিল</th>
                                    <th class="py-1 px-2 text-right">জমা</th>
                                    <th class="py-1 px-2 text-right">লেস</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-800/60">
                                ${res.memos.map(m => `
                                    <tr class="hover:bg-slate-800/40">
                                        <td class="py-1 px-2 text-center font-mono font-black text-cyan-400">#${m.voucherNum || m.voucherNo}</td>
                                        <td class="py-1 px-2 font-bold text-white truncate max-w-[140px]">${escapeHTML(m.customerName || 'গ্রাহক')}</td>
                                        <td class="py-1 px-2 text-center text-slate-400 font-mono">${formatAppDate(m.date)}</td>
                                        <td class="py-1 px-2 text-right font-mono font-black text-red-400">${Number(m.bill) > 0 ? formatAmountWithComma(m.bill) : '-'}</td>
                                        <td class="py-1 px-2 text-right font-mono font-black text-emerald-400">${Number(m.paid) > 0 ? formatAmountWithComma(m.paid) : '-'}</td>
                                        <td class="py-1 px-2 text-right font-mono font-black text-purple-400">${String(m.receivedType || '').toLowerCase() === 'less' ? formatAmountWithComma(m.paid) : '-'}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `;
            }
        }
    });

    if (result.isConfirmed) {
        const res = await fetchMemosByRange(startNo, endNo);
        if (res.success && res.memos.length > 0) {
            const summary = calculateBookAuditSummary(res.memos, startNo, endNo);
            printMemoBookAuditReport(summary, res.memos);
        } else {
            Swal.fire('তথ্য', 'এই বইয়ের কোনো পৃথক লেনদেন ভাউচার পাওয়া যায়নি (ঐতিহাসিক নথি রেজিস্টার হিসেবে সংরক্ষিত)।', 'info');
        }
    }
}
