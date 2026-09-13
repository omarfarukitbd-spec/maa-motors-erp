/**
 * Dubai Procurement - Weekly Audits History Table Renderer
 * Renders the saved audits history table with load, print, and delete controls.
 */

import { formatAmountWithComma, parseAmount, safeRound } from '../utils.js';

export function renderDubaiHistoryTable(tbodyId, audits = []) {
    const tbody = document.getElementById(tbodyId);
    if (!tbody) return;

    if (!Array.isArray(audits) || audits.length === 0) {
        tbody.innerHTML = `<tr><td colspan="10" class="p-4 text-center text-slate-500 italic">কোনো পূর্ববর্তী অডিট হিস্ট্রি পাওয়া যায়নি।</td></tr>`;
        return;
    }

    let html = '';
    audits.forEach(a => {
        const vAmt = safeRound(parseAmount(a.varianceAmount));
        const vClass = vAmt >= 0 ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold';
        let holdingsSum = 0;
        if (Array.isArray(a.personalHoldings)) {
            a.personalHoldings.forEach(h => {
                holdingsSum = safeRound(holdingsSum + safeRound(parseAmount(h.amount)));
            });
        }
        html += `
            <tr class="border-b border-slate-800/60 hover:bg-slate-800/40 transition-colors">
                <td class="p-2.5 font-bold font-mono text-white">${a.weekEndDate || ''}</td>
                <td class="p-2.5 text-slate-400">${a.containerNo || ''}</td>
                <td class="p-2.5 text-right font-mono text-emerald-400">${formatAmountWithComma(a.cumulativeRemittance)}</td>
                <td class="p-2.5 text-right font-mono text-amber-400">${formatAmountWithComma(a.cumulativePurchaseTotal)}</td>
                <td class="p-2.5 text-right font-mono text-red-400">${formatAmountWithComma(a.cumulativeExpenseTotal)}</td>
                <td class="p-2.5 text-right font-mono text-cyan-400">${formatAmountWithComma(a.marketAdvance)}</td>
                <td class="p-2.5 text-right font-mono text-emerald-400">${formatAmountWithComma(a.cashInHand)}</td>
                <td class="p-2.5 text-right font-mono text-purple-400">${formatAmountWithComma(holdingsSum)}</td>
                <td class="p-2.5 text-right font-mono ${vClass}">${formatAmountWithComma(vAmt)}</td>
                <td class="p-2.5 text-center">
                    <div class="flex items-center justify-center gap-1.5">
                        <button type="button" onclick="window.loadDubaiAuditHistory('${a.id}')" class="p-1 rounded hover:bg-slate-700 text-sky-400 cursor-pointer" title="লোড করুন">
                            <i class="fa-solid fa-folder-open text-xs"></i>
                        </button>
                        <button type="button" onclick="window.printDubaiAuditHistory('${a.id}')" class="p-1 rounded hover:bg-slate-700 text-slate-300 cursor-pointer" title="প্রিন্ট করুন">
                            <i class="fa-solid fa-print text-xs"></i>
                        </button>
                        <button type="button" onclick="window.deleteDubaiAuditHistory('${a.id}')" class="p-1 rounded hover:bg-red-500/20 text-red-400 cursor-pointer" title="মুছে ফেলুন">
                            <i class="fa-solid fa-trash-can text-xs"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
}
