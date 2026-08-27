import Swal from 'sweetalert2';
import { formatAmountWithComma, parseAmount, getTodayLocalDateString, formatAppDate, safeRound } from '../utils.js';
import { printViaIframe } from '../utils/smart-print-engine.js';
import { SettingsDAO } from '../dao.js';

const DENOMINATIONS = [1000, 500, 200, 100, 50, 20, 10, 5, 2, 1];

/**
 * Open Cash Drawer Physical Note Counter & Reconciliation Modal
 */
export async function openCashReconciliationModal(systemCashAmount = 0) {
    let rowsHtml = '';
    DENOMINATIONS.forEach(denom => {
        rowsHtml += `
            <div class="flex items-center justify-between gap-1.5 sm:gap-2 p-2 sm:p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 hover:border-slate-700 transition-all">
                <div class="font-mono font-black text-emerald-400 text-xs sm:text-sm whitespace-nowrap min-w-[65px] sm:min-w-[75px] text-left">৳ ${denom}</div>
                <div class="text-slate-500 text-xs font-bold font-mono shrink-0">×</div>
                <input type="number" min="0" data-denom="${denom}" oninput="window.calcCashModalTotals()" placeholder="0" class="cash-note-input w-18 sm:w-24 bg-slate-900 border border-slate-700/80 rounded-lg px-2 py-1 text-center text-white font-mono font-black text-sm outline-none focus:border-emerald-500 transition-all">
                <div class="text-slate-500 text-xs font-bold font-mono shrink-0">=</div>
                <div id="denom-total-${denom}" class="text-right font-mono font-black text-white text-xs sm:text-sm whitespace-nowrap min-w-[70px] sm:min-w-[85px]">৳ ০</div>
            </div>
        `;
    });

    const modalHtml = `
        <div class="space-y-3.5 font-bn text-left max-h-[75vh] overflow-y-auto custom-scrollbar p-1">
            <!-- Header Summary Comparison Card -->
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-950 p-3 sm:p-4 rounded-2xl border border-slate-800 shadow-inner">
                <div>
                    <span class="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">সিস্টেম ক্যাশ</span>
                    <h4 class="text-sm sm:text-base font-mono font-black text-blue-400 mt-0.5 whitespace-nowrap">৳ ${formatAmountWithComma(systemCashAmount)}</h4>
                </div>
                <div>
                    <span class="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">গোনা আসল ক্যাশ</span>
                    <h4 id="cash-modal-physical-total" class="text-sm sm:text-base font-mono font-black text-emerald-400 mt-0.5 whitespace-nowrap">৳ ০</h4>
                </div>
                <div class="col-span-2 sm:col-span-1 border-t sm:border-t-0 sm:border-l border-slate-800 pt-2 sm:pt-0 sm:pl-3">
                    <span class="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">পার্থক্য / স্ট্যাটাস</span>
                    <div id="cash-modal-diff-badge" class="text-xs font-bold text-slate-300 font-mono mt-0.5">-</div>
                </div>
            </div>

            <!-- Denomination Input Grid -->
            <div class="space-y-2">
                <label class="block text-xs font-black text-slate-300 uppercase tracking-wider ml-1">নোটের সংখ্যা ইনপুট দিন (Note Count):</label>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                    ${rowsHtml}
                </div>
            </div>

            <!-- Notes or Remarks -->
            <div>
                <label class="block text-[11px] font-bold text-slate-400 mb-1 ml-1">ক্যাশিয়ারের মন্তব্য / নোট (ঐচ্ছিক):</label>
                <input type="text" id="cash-modal-note" placeholder="যেমন: ড্রয়ারে ভাঙতি অতিরিক্ত আছে / ক্যাশ নিখুঁত..." class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500">
            </div>
        </div>
    `;

    // Global Calculator for Denominations inside modal
    window.calcCashModalTotals = () => {
        let totalCounted = 0;
        const noteCounts = {};

        DENOMINATIONS.forEach(denom => {
            const input = document.querySelector(`.cash-note-input[data-denom="${denom}"]`);
            const count = Math.max(0, parseInt(input?.value || '0', 10) || 0);
            noteCounts[denom] = count;
            const subtotal = safeRound(denom * count);
            totalCounted = safeRound(totalCounted + subtotal);

            const label = document.getElementById(`denom-total-${denom}`);
            if (label) label.innerText = `৳ ${formatAmountWithComma(subtotal)}`;
        });

        const physLabel = document.getElementById('cash-modal-physical-total');
        if (physLabel) physLabel.innerText = `৳ ${formatAmountWithComma(totalCounted)}`;

        const diff = safeRound(totalCounted - systemCashAmount);
        const diffBadge = document.getElementById('cash-modal-diff-badge');
        if (diffBadge) {
            if (diff === 0) {
                diffBadge.innerHTML = `<span class="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-lg font-bold text-[11px] whitespace-nowrap inline-block"><i class="fa-solid fa-circle-check mr-1"></i>১০০% নিখুঁত মিলেছে</span>`;
            } else if (diff > 0) {
                diffBadge.innerHTML = `<span class="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-lg font-bold text-[11px] whitespace-nowrap inline-block"><i class="fa-solid fa-circle-plus mr-1"></i>অতিরিক্ত ৳ ${formatAmountWithComma(diff)}</span>`;
            } else {
                diffBadge.innerHTML = `<span class="bg-rose-500/20 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded-lg font-bold text-[11px] whitespace-nowrap inline-block"><i class="fa-solid fa-triangle-exclamation mr-1"></i>শর্ট ৳ ${formatAmountWithComma(Math.abs(diff))}</span>`;
            }
        }

        window._lastCashCounts = { totalCounted, noteCounts, systemCashAmount, diff };
    };

    const result = await Swal.fire({
        title: '<div class="flex items-center justify-center gap-2 font-bn font-black text-lg text-white"><i class="fa-solid fa-money-bill-wave text-emerald-400"></i><span>ক্যাশ ড্রয়ার নোট কাউন্টার ও ক্লোজিং</span></div>',
        html: modalHtml,
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-print mr-1.5"></i> স্লিপ প্রিন্ট করুন',
        cancelButtonText: 'বন্ধ করুন',
        customClass: {
            popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700 shadow-2xl !p-3 sm:!p-5 font-bn max-w-xl w-full',
            confirmButton: 'm3-btn-primary !bg-emerald-600 hover:!bg-emerald-500 !text-white !rounded-xl !px-5 !py-2 font-bold',
            cancelButton: 'm3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !rounded-xl !px-4 !py-2 font-bold border border-slate-700'
        },
        didOpen: () => {
            window.calcCashModalTotals();
        }
    });

    if (result.isConfirmed && window._lastCashCounts) {
        printCashDenominationSlip(window._lastCashCounts);
    }
}

/**
 * Print Cash Denomination Receipt Slip
 */
async function printCashDenominationSlip({ totalCounted, noteCounts, systemCashAmount, diff }) {
    const settings = await SettingsDAO.getAppSettings();
    const today = getTodayLocalDateString();

    let rowsHtml = '';
    DENOMINATIONS.forEach(denom => {
        const count = noteCounts[denom] || 0;
        if (count > 0) {
            rowsHtml += `
                <tr>
                    <td style="padding: 4px; border: 1px solid #cbd5e1; text-align: center; font-family: monospace;">৳ ${denom}</td>
                    <td style="padding: 4px; border: 1px solid #cbd5e1; text-align: center; font-family: monospace;">${count} টি</td>
                    <td style="padding: 4px; border: 1px solid #cbd5e1; text-align: right; font-family: monospace; font-weight: bold;">৳ ${formatAmountWithComma(denom * count)}</td>
                </tr>
            `;
        }
    });

    const slipHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Cash Denomination Slip</title>
            <style>
                body { font-family: 'Hind Siliguri', 'Inter', sans-serif; margin: 0; padding: 20px; color: #0f172a; }
                .card { width: 380px; margin: 0 auto; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 16px; }
                .header { text-align: center; border-bottom: 2px solid #0284c7; padding-bottom: 8px; margin-bottom: 12px; }
                .header h2 { margin: 0; font-size: 16px; font-weight: 900; }
                .header p { margin: 2px 0 0 0; font-size: 11px; color: #64748b; }
                table { width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 12px; }
                th { background: #f1f5f9; padding: 5px; border: 1px solid #cbd5e1; font-weight: 800; }
                .summary-box { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 8px; font-size: 11px; margin-bottom: 20px; }
                .summary-row { display: flex; justify-content: space-between; margin-bottom: 4px; }
                .signatures { display: flex; justify-content: space-between; font-size: 10px; margin-top: 35px; }
                .sign-line { border-top: 1px dashed #64748b; width: 120px; text-align: center; padding-top: 4px; }
            </style>
        </head>
        <body>
            <div class="card">
                <div class="header">
                    <h2>${settings.shopName || 'MAA MOTORS'}</h2>
                    <p>দৈনিক ক্যাশ ড্রয়ার নোট গণনা ও ক্লোজিং স্লিপ</p>
                    <p style="font-weight: bold; color: #0284c7;">তারিখ: ${formatAppDate(today)}</p>
                </div>
                <table>
                    <thead>
                        <tr><th>নোটের মান</th><th>সংখ্যা</th><th>মোট টাকা</th></tr>
                    </thead>
                    <tbody>
                        ${rowsHtml || '<tr><td colspan="3" style="text-align:center; padding:10px;">কোনো নোট ইনপুট দেওয়া হয়নি</td></tr>'}
                    </tbody>
                </table>
                <div class="summary-box">
                    <div class="summary-row"><span>সিস্টেম ক্যাশ:</span><strong>৳ ${formatAmountWithComma(systemCashAmount)}</strong></div>
                    <div class="summary-row"><span>গোনা আসল ক্যাশ:</span><strong style="color: #15803d; font-size: 13px;">৳ ${formatAmountWithComma(totalCounted)}</strong></div>
                    <div class="summary-row" style="border-top: 1px dashed #cbd5e1; padding-top: 4px; margin-top: 4px;">
                        <span>পার্থক্য / অমিল:</span>
                        <strong style="color: ${diff === 0 ? '#15803d' : (diff > 0 ? '#0284c7' : '#dc2626')};">${diff === 0 ? '১০০% মিলেছে (৳ ০)' : (diff > 0 ? `অতিরিক্ত ৳ ${formatAmountWithComma(diff)}` : `শর্ট ৳ ${formatAmountWithComma(Math.abs(diff))}`)}</strong>
                    </div>
                </div>
                <div class="signatures">
                    <div class="sign-line">ক্যাশিয়ারের স্বাক্ষর</div>
                    <div class="sign-line">মালিকের স্বাক্ষর</div>
                </div>
            </div>
        </body>
        </html>
    `;

    printViaIframe(slipHtml);
}
