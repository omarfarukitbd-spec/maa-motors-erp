import { formatAmountWithComma, escapeHTML } from '../utils.js';

/**
 * Render HTML Table Rows for Zone Report Customer Data
 */
export function renderZoneTableRows(customers) {
    if (!customers || customers.length === 0) {
        return `<tr><td colspan="8" class="text-center py-12 text-slate-500 font-bold italic">কোনো কাস্টমার ডাটা পাওয়া যায়নি</td></tr>`;
    }

    return customers.map((c, idx) => {
        const sName = escapeHTML(c.name || 'কাস্টমার');
        const sPhone = escapeHTML(c.phone || '');
        const jsName = (c.name || 'কাস্টমার').replace(/'/g, "\\'");
        const jsPhone = (c.phone || '').replace(/'/g, "\\'");

        const phoneHtml = c.phone && c.phone !== '-' ? `
            <button type="button" onclick="window.handleCustomerCall('${jsName}', '${jsPhone}')" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all font-mono text-xs cursor-pointer active:scale-95 group/call" title="সরাসরি কল করুন">
                <i class="fa-solid fa-phone text-[10px] group-hover/call:animate-bounce"></i>
                <span class="font-bold">${sPhone}</span>
            </button>
        ` : `<span class="text-slate-500 font-mono text-xs">-</span>`;

        return `
            <tr class="hover:bg-slate-800/40 transition-colors border-b border-slate-800/50">
                <td class="p-3.5 text-center font-mono text-slate-400">${idx + 1}</td>
                <td class="p-3.5 text-center font-mono font-bold text-amber-400">${escapeHTML(c.accountNo || '-')}</td>
                <td class="p-3.5 font-bold text-white">${sName}</td>
                <td class="p-3.5 text-slate-300 text-xs">${escapeHTML(c.address || '-')}</td>
                <td class="p-3.5 text-center">${phoneHtml}</td>
                <td class="p-3.5 text-center"><span class="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-800 text-indigo-300 border border-slate-700">${escapeHTML(c.zone || 'N/A')}</span></td>
                <td class="p-3.5 text-right font-black ${c.totalDue > 0 ? 'text-red-400' : (c.totalDue < 0 ? 'text-emerald-400' : 'text-slate-400')}">৳ ${formatAmountWithComma(c.totalDue || 0)}</td>
                <td class="p-3.5 text-center">
                    <button data-perm="viewZoneCustLedgerBtn" onclick="if(window.navigateTo) window.navigateTo('ledger', { customerId: '${c.id}' })" class="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs font-bold transition-all border border-indigo-500/30 cursor-pointer">লেজার</button>
                </td>
            </tr>
        `;
    }).join('');
}