import Swal from 'sweetalert2';
import { fetchMemosByRange, calculateBookAuditSummary } from './memo-book-audit-calc.js';
import { printMemoBookAuditReport } from './memo-book-audit-print.js';
import { formatAmountWithComma, formatAppDate, escapeHTML, safeRound } from '../utils.js';
import { showToast } from '../utils/ui-helpers.js';

let _currentAuditSummary = null;
let _currentAuditMemos = [];

/**
 * Render Memo Book Range Audit & Reconciliation UI
 */
export function renderMemoBookAuditUI(container) {
    if (!container) return;

    container.innerHTML = `
        <div class="space-y-4 animate-fade-in font-bn">
            <!-- Book Range Selector Capsule -->
            <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-xl space-y-3">
                <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-2.5">
                    <div class="flex items-center gap-2.5">
                        <div class="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 text-base shadow-sm">
                            <i class="fa-solid fa-book-open"></i>
                        </div>
                        <div>
                            <h2 class="text-base font-black text-white flex items-center gap-2">
                                <span>মেমো বুক রেঞ্জ অডিট ও টোটাল সামারি</span>
                                <span class="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">Book Audit</span>
                            </h2>
                            <p class="text-[11px] text-slate-400">অফলাইন মেমো বই শেষ হলে শুরু ও শেষ মেমো নম্বর দিয়ে সম্পূর্ণ বইয়ের নিখুঁত হিসাব করুন</p>
                        </div>
                    </div>
                </div>

                <!-- Input Controls Grid -->
                <div class="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                    <div class="sm:col-span-4">
                        <label class="block text-slate-400 font-bold text-xs mb-1 flex items-center gap-1">
                            <i class="fa-solid fa-hashtag text-cyan-400 text-[10px]"></i>
                            <span>শুরু মেমো নং (Start Memo #):</span>
                        </label>
                        <input type="number" id="memo-audit-start" placeholder="যেমন: 101" class="w-full bg-slate-950 border border-slate-700/80 rounded-xl h-10 px-3.5 text-sm font-mono font-black text-white outline-none focus:border-purple-500 shadow-inner">
                    </div>
                    <div class="sm:col-span-4">
                        <label class="block text-slate-400 font-bold text-xs mb-1 flex items-center gap-1">
                            <i class="fa-solid fa-hashtag text-purple-400 text-[10px]"></i>
                            <span>শেষ মেমো নং (End Memo #):</span>
                        </label>
                        <input type="number" id="memo-audit-end" placeholder="যেমন: 200" class="w-full bg-slate-950 border border-slate-700/80 rounded-xl h-10 px-3.5 text-sm font-mono font-black text-white outline-none focus:border-purple-500 shadow-inner">
                    </div>
                    <div class="sm:col-span-4">
                        <button onclick="window.runMemoBookAudit()" class="w-full h-10 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer">
                            <i class="fa-solid fa-calculator text-sm"></i>
                            <span>বই অডিট ও হিসাব করুন</span>
                        </button>
                    </div>
                </div>

                <!-- Quick Presets -->
                <div class="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pt-1 text-xs">
                    <span class="text-slate-500 font-bold shrink-0 text-[11px]">
                        <i class="fa-solid fa-bookmark text-purple-400 mr-1"></i>স্মার্ট প্রিসেট:
                    </span>
                    <button onclick="window.setAuditBookRange(1, 50)" class="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-[11px] font-mono shrink-0 transition-all cursor-pointer">#1 - #50</button>
                    <button onclick="window.setAuditBookRange(51, 100)" class="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-[11px] font-mono shrink-0 transition-all cursor-pointer">#51 - #100</button>
                    <button onclick="window.setAuditBookRange(101, 150)" class="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-[11px] font-mono shrink-0 transition-all cursor-pointer">#101 - #150</button>
                    <button onclick="window.setAuditBookRange(101, 200)" class="px-2.5 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 hover:text-white border border-purple-500/30 text-[11px] font-mono font-bold shrink-0 transition-all cursor-pointer">#101 - #200</button>
                    <button onclick="window.setAuditBookRange(201, 250)" class="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-[11px] font-mono shrink-0 transition-all cursor-pointer">#201 - #250</button>
                    <button onclick="window.setAuditBookRange(201, 300)" class="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-[11px] font-mono shrink-0 transition-all cursor-pointer">#201 - #300</button>
                </div>
            </div>

            <!-- Results Output Area -->
            <div id="memo-audit-results-area">
                <div class="bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-8 text-center text-slate-500 space-y-2">
                    <div class="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto text-purple-400 text-xl">
                        <i class="fa-solid fa-receipt"></i>
                    </div>
                    <div class="text-sm font-bold text-slate-300">মেমো বইয়ের শুরু ও শেষ নম্বর দিন</div>
                    <div class="text-xs text-slate-500">বইয়ের মোট বিল, নগদ ও ব্যাংক জমা, মোট ছাড় (Less), অবশিষ্ট বকেয়া এবং কোনো মেমো মিসিং থাকলে তা স্বয়ংক্রিয়ভাবে শনাক্ত হবে</div>
                </div>
            </div>
        </div>
    `;

    window.setAuditBookRange = (start, end) => {
        const sEl = document.getElementById('memo-audit-start');
        const eEl = document.getElementById('memo-audit-end');
        if (sEl && eEl) {
            sEl.value = start;
            eEl.value = end;
            window.runMemoBookAudit();
        }
    };

    window.runMemoBookAudit = async () => {
        const startVal = parseInt(document.getElementById('memo-audit-start')?.value, 10);
        const endVal = parseInt(document.getElementById('memo-audit-end')?.value, 10);

        if (isNaN(startVal) || isNaN(endVal) || startVal <= 0 || endVal <= 0) {
            return Swal.fire('সতর্কতা', 'সঠিক শুরু ও শেষ মেমো নম্বর লিখুন!', 'warning');
        }

        const resArea = document.getElementById('memo-audit-results-area');
        if (resArea) {
            resArea.innerHTML = `
                <div class="p-8 text-center bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3">
                    <div class="inline-block animate-spin text-purple-400 text-2xl"><i class="fa-solid fa-circle-notch"></i></div>
                    <div class="text-sm font-bold text-white">মেমো #${Math.min(startVal, endVal)} হতে #${Math.max(startVal, endVal)} অডিট করা হচ্ছে...</div>
                </div>
            `;
        }

        const res = await fetchMemosByRange(startVal, endVal);
        if (!res.success) {
            if (resArea) resArea.innerHTML = `<div class="p-6 text-center text-red-400 font-bold bg-red-950/20 border border-red-900 rounded-2xl">ডাটা লোড করতে ব্যর্থ: ${res.error}</div>`;
            return;
        }

        const summary = calculateBookAuditSummary(res.memos, startVal, endVal);
        _currentAuditSummary = summary;
        _currentAuditMemos = res.memos;

        renderAuditResultsContent(resArea, summary, res.memos);
    };

    window.printCurrentBookAudit = () => {
        if (_currentAuditSummary && _currentAuditMemos) {
            printMemoBookAuditReport(_currentAuditSummary, _currentAuditMemos);
        }
    };
}

function renderAuditResultsContent(container, summary, memos) {
    if (!container) return;

    // Missing Alert Banner
    const missingAlertHtml = summary.missingNumbers && summary.missingNumbers.length > 0
        ? `
            <div class="bg-red-950/40 border border-red-800/80 rounded-2xl p-3.5 flex items-start gap-3 text-xs text-red-200">
                <div class="w-8 h-8 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400 text-sm shrink-0">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                </div>
                <div class="space-y-1">
                    <div class="font-black text-red-400 text-sm">সতর্কতা: ${summary.missingNumbers.length}টি মেমো মিসিং রয়েছে!</div>
                    <div class="text-slate-300">নিম্নলিখিত মেমোগুলো এখনো সিস্টেমে এন্ট্রি করা হয়নি:</div>
                    <div class="flex flex-wrap gap-1.5 pt-1">
                        ${summary.missingNumbers.map(n => `<span class="px-2 py-0.5 rounded-lg bg-red-500/20 text-red-300 font-mono font-black border border-red-500/30">#${n}</span>`).join('')}
                    </div>
                </div>
            </div>
        `
        : `
            <div class="bg-emerald-950/30 border border-emerald-800/60 rounded-2xl p-3 flex items-center gap-3 text-xs text-emerald-300">
                <div class="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs shrink-0"><i class="fa-solid fa-circle-check"></i></div>
                <div class="font-bold">এই বইয়ের সকল মেমো ক্রমানুসারে শতভাগ নির্ভুল ও রেকর্ডকৃত রয়েছে (কোনো মেমো বাদ পড়েনি)।</div>
            </div>
        `;

    // Render Table Rows
    let rowsHtml = '';
    memos.forEach((m, idx) => {
        const bill = Number(m.bill) || 0;
        const paid = Number(m.paid) || 0;
        const rType = String(m.receivedType || '').trim();
        const isLess = rType === 'Less' || /less|ছাড়|discount/i.test(rType);
        const actualPaid = isLess ? 0 : paid;
        const actualLess = isLess ? paid : 0;
        const netRowDue = safeRound(bill - (actualPaid + actualLess));

        rowsHtml += `
            <tr class="hover:bg-white/[0.02] border-b border-slate-800/60 transition-colors">
                <td class="py-2.5 px-3 text-xs text-center text-slate-500 font-mono">${idx + 1}</td>
                <td class="py-2.5 px-3 text-xs text-center font-mono font-black text-cyan-400">#${m.voucherNum || m.voucherNo}</td>
                <td class="py-2.5 px-3 text-xs text-center text-slate-300">${formatAppDate(m.date)}</td>
                <td class="py-2.5 px-3 text-xs">
                    <div class="font-black text-white">${escapeHTML(m.customerName)}</div>
                    <div class="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                        ${m.customerAccountNo ? `<span class="text-cyan-400 font-mono font-bold">A/C: ${escapeHTML(m.customerAccountNo)}</span>` : ''}
                        ${m.customerPhone ? `<span><i class="fa-solid fa-phone text-[9px] text-emerald-400 mr-0.5"></i>${escapeHTML(m.customerPhone)}</span>` : ''}
                    </div>
                </td>
                <td class="py-2.5 px-3 text-xs text-right font-mono font-black text-red-400">${bill > 0 ? '৳' + formatAmountWithComma(bill) : '-'}</td>
                <td class="py-2.5 px-3 text-xs text-right font-mono font-black text-emerald-400">${actualPaid > 0 ? '৳' + formatAmountWithComma(actualPaid) : '-'}</td>
                <td class="py-2.5 px-3 text-xs text-right font-mono font-black text-purple-400">${actualLess > 0 ? '৳' + formatAmountWithComma(actualLess) : '-'}</td>
                <td class="py-2.5 px-3 text-xs text-center text-slate-400 text-[11px]">
                    <span class="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-slate-300 font-bold">${escapeHTML(m.receivedType || (m.bill > 0 ? 'বাকিতে' : 'জমা'))}</span>
                </td>
                <td class="py-2.5 px-3 text-xs text-right font-mono font-black ${netRowDue > 0 ? 'text-red-400' : 'text-emerald-400'}">
                    ${netRowDue > 0 ? '৳' + formatAmountWithComma(netRowDue) : '<span class="text-[10px] text-emerald-400">পরিশোধিত</span>'}
                </td>
                <td class="py-2.5 px-3 text-xs text-center">
                    <div class="flex items-center justify-center gap-1">
                        <button onclick="window.searchMemoDirectly('${m.voucherNo || m.voucherNum}')" class="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-white flex items-center justify-center cursor-pointer" title="মেমো ভিউ"><i class="fa-solid fa-eye text-[10px]"></i></button>
                        <button onclick="window.printMemoReceipt('${m.id}', 'a4')" class="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-white flex items-center justify-center cursor-pointer" title="প্রিন্ট"><i class="fa-solid fa-print text-[10px]"></i></button>
                    </div>
                </td>
            </tr>
        `;
    });

    container.innerHTML = `
        <div class="space-y-3.5 animate-fade-in font-bn">
            <!-- 6 Financial KPI Cards Grid -->
            <div class="grid grid-cols-2 lg:grid-cols-6 gap-2.5">
                <div class="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl text-center space-y-1">
                    <div class="text-[10px] font-bold text-slate-400 uppercase">মোট মেমো সংখ্যা</div>
                    <div class="text-base font-black font-mono text-cyan-400">${summary.totalFound} / ${summary.totalExpected} টি</div>
                </div>
                <div class="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl text-center space-y-1">
                    <div class="text-[10px] font-bold text-red-400 uppercase">মোট বিল (Debit)</div>
                    <div class="text-base font-black font-mono text-red-400">৳ ${formatAmountWithComma(summary.totalBill)}</div>
                </div>
                <div class="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl text-center space-y-1">
                    <div class="text-[10px] font-bold text-emerald-400 uppercase">মোট জমা (Credit)</div>
                    <div class="text-base font-black font-mono text-emerald-400">৳ ${formatAmountWithComma(summary.totalPaid)}</div>
                </div>
                <div class="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl text-center space-y-1">
                    <div class="text-[10px] font-bold text-purple-400 uppercase">মোট ছাড় (Less)</div>
                    <div class="text-base font-black font-mono text-purple-400">৳ ${formatAmountWithComma(summary.totalLess)}</div>
                </div>
                <div class="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl text-center space-y-1">
                    <div class="text-[10px] font-bold text-slate-300 uppercase">অবশিষ্ট বকেয়া</div>
                    <div class="text-base font-black font-mono ${summary.totalNetDue > 0 ? 'text-red-400' : 'text-emerald-400'}">৳ ${formatAmountWithComma(summary.totalNetDue)}</div>
                </div>
                <div class="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl text-center space-y-1">
                    <div class="text-[10px] font-bold text-amber-400 uppercase">আদায় হার (KPI)</div>
                    <div class="text-base font-black font-mono text-amber-400">${summary.collectionRate}%</div>
                </div>
            </div>

            <!-- Missing Alert Banner -->
            ${missingAlertHtml}

            <!-- Table Header Toolbar -->
            <div class="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-2.5">
                <div class="text-xs font-bold text-white flex items-center gap-2">
                    <i class="fa-solid fa-list-check text-purple-400"></i>
                    <span>মেমো তালিকা (#${summary.startNo} হতে #${summary.endNo})</span>
                    <span class="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-mono font-bold">${memos.length}টি এন্ট্রি</span>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="window.printCurrentBookAudit()" class="h-8 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-1.5 shadow-md shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer">
                        <i class="fa-solid fa-print"></i> <span>A4 সামারি প্রিন্ট</span>
                    </button>
                    <button onclick="window.exportTableToExcel('memo-book-audit-table', 'memo-book-audit-${summary.startNo}-${summary.endNo}.xlsx')" class="h-8 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer">
                        <i class="fa-solid fa-file-excel text-emerald-400"></i> <span>এক্সেল</span>
                    </button>
                </div>
            </div>

            <!-- Table -->
            <div class="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div class="overflow-x-auto custom-scrollbar">
                    <table id="memo-book-audit-table" class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-slate-950/80 border-b border-slate-800 text-slate-400 text-xs font-black uppercase">
                                <th class="py-3 px-3 text-center w-12">ক্রম</th>
                                <th class="py-3 px-3 text-center w-24">মেমো নং</th>
                                <th class="py-3 px-3 text-center w-28">তারিখ</th>
                                <th class="py-3 px-3">কাস্টমার প্রোফাইল</th>
                                <th class="py-3 px-3 text-right text-red-400">বিল (Debit)</th>
                                <th class="py-3 px-3 text-right text-emerald-400">জমা (Credit)</th>
                                <th class="py-3 px-3 text-right text-purple-400">ছাড় (Less)</th>
                                <th class="py-3 px-3 text-center">মাধ্যম</th>
                                <th class="py-3 px-3 text-right">বকেয়া</th>
                                <th class="py-3 px-3 text-center w-20">অ্যাকশন</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rowsHtml || '<tr><td colspan="10" class="p-6 text-center text-slate-500 font-bold">এই রেঞ্জে কোনো মেমো পাওয়া যায়নি</td></tr>'}
                        </tbody>
                        <tfoot class="bg-slate-950/90 border-t-2 border-slate-800 font-mono font-black text-xs">
                            <tr>
                                <td colspan="4" class="py-3 px-3 text-right font-bn font-black text-white">সর্বমোট (Total):</td>
                                <td class="py-3 px-3 text-right text-red-400 text-sm">৳${formatAmountWithComma(summary.totalBill)}</td>
                                <td class="py-3 px-3 text-right text-emerald-400 text-sm">৳${formatAmountWithComma(summary.totalPaid)}</td>
                                <td class="py-3 px-3 text-right text-purple-400 text-sm">৳${formatAmountWithComma(summary.totalLess)}</td>
                                <td class="py-3 px-3 text-center text-[10px] font-bn text-amber-400">${summary.collectionRate}% আদায়</td>
                                <td class="py-3 px-3 text-right text-sm ${summary.totalNetDue > 0 ? 'text-red-400' : 'text-emerald-400'}">৳${formatAmountWithComma(summary.totalNetDue)}</td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    `;
}
