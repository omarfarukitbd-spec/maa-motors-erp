import { formatAmountWithComma, escapeHTML } from '../utils.js';

/**
 * Render HTML Table Rows for Zone Report Customer Data
 */
export function renderZoneTableRows(customers) {
    if (!customers || customers.length === 0) {
        return `<tr><td colspan="8" class="text-center py-12 text-slate-500 font-bold italic">কোনো কাস্টমার ডাটা পাওয়া যায়নি</td></tr>`;
    }

    return customers.map((c, idx) => `
        <tr class="hover:bg-slate-800/40 transition-colors">
            <td class="p-3.5 text-center font-mono text-slate-400">${idx + 1}</td>
            <td class="p-3.5 text-center font-mono font-bold text-amber-400">${escapeHTML(c.accountNo || '-')}</td>
            <td class="p-3.5 font-bold text-white">${escapeHTML(c.name)}</td>
            <td class="p-3.5 text-slate-300 text-xs">${escapeHTML(c.address || '-')}</td>
            <td class="p-3.5 text-center font-mono text-slate-300">${escapeHTML(c.phone || '-')}</td>
            <td class="p-3.5 text-center"><span class="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-800 text-indigo-300 border border-slate-700">${escapeHTML(c.zone || 'N/A')}</span></td>
            <td class="p-3.5 text-right font-black ${c.totalDue > 0 ? 'text-emerald-400' : (c.totalDue < 0 ? 'text-rose-400' : 'text-slate-400')}">৳ ${formatAmountWithComma(c.totalDue || 0)}</td>
            <td class="p-3.5 text-center">
                <button data-perm="viewZoneCustLedgerBtn" onclick="if(window.navigateTo) window.navigateTo('ledger', { customerId: '${c.id}' })" class="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs font-bold transition-all border border-indigo-500/30 cursor-pointer">লেজার</button>
            </td>
        </tr>
    `).join('');
}