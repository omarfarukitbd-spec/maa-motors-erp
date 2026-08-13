import { db } from '../firebase-config.js';
import { formatAmountWithComma, formatAppDate, cleanCustomerName, exportTableToExcel } from '../utils.js';
import { printSingleTransactionReceipt } from '../statement-print.js';

let allInvoices = [];

export async function loadInvoices() {
    const tbody = document.getElementById('invoice-tbody');
    if (!tbody) return;

    try {
        const snap = await db.collection('transactions').orderBy('date', 'desc').limit(250).get();
        allInvoices = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        filterInvoices();
    } catch (e) {
        console.error("Load Invoices Error:", e);
        tbody.innerHTML = `<tr><td colspan="7" class="text-center py-12 text-red-400">ডাটা লোড করতে সমস্যা হয়েছে</td></tr>`;
    }
}

export function filterInvoices() {
    const q = (document.getElementById('invoice-search-input')?.value || '').toLowerCase().trim();
    const type = document.getElementById('invoice-type-filter')?.value || '';

    const filtered = allInvoices.filter(t => {
        const name = (t.customerName || '').toLowerCase();
        const v = (t.voucherNo || '').toLowerCase();
        const method = (t.receivedFrom || t.receivedType || '').toLowerCase();

        const matchQ = !q || name.includes(q) || v.includes(q) || method.includes(q);
        const matchType = !type || (type === 'bill' && Number(t.bill) > 0) || (type === 'paid' && Number(t.paid) > 0);
        return matchQ && matchType;
    });

    renderInvoiceTable(filtered);
}

function renderInvoiceTable(invoices) {
    const tbody = document.getElementById('invoice-tbody');
    if (!tbody) return;

    if (invoices.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center py-12 text-slate-500 italic">কোনো ভাউচার পাওয়া যায়নি</td></tr>`;
        return;
    }

    let html = '';
    invoices.forEach(t => {
        const b = Number(t.bill) || 0;
        const p = Number(t.paid) || 0;
        const cleanName = cleanCustomerName(t.customerName || 'Unknown');
        const method = (t.receivedFrom || t.receivedType || '-').trim();

        html += `
            <tr class="hover:bg-slate-800/40 transition-colors">
                <td class="py-3 px-4 font-mono text-slate-300">${formatAppDate(t.date)}</td>
                <td class="py-3 px-4 font-mono text-blue-400 font-bold">${t.voucherNo || '-'}</td>
                <td class="py-3 px-4 font-bold text-white cursor-pointer hover:text-blue-400" onclick="navigate('ledger', { customerId: '${t.customerId}' })">${cleanName}</td>
                <td class="py-3 px-4 text-slate-300 text-xs">${method}</td>
                <td class="py-3 px-4 text-right font-inter font-black ${b > 0 ? 'text-red-400' : 'text-slate-500'}">${b > 0 ? `৳ ${formatAmountWithComma(b)}` : '-'}</td>
                <td class="py-3 px-4 text-right font-inter font-black ${p > 0 ? 'text-emerald-400' : 'text-slate-500'}">${p > 0 ? `৳ ${formatAmountWithComma(p)}` : '-'}</td>
                <td class="py-3 px-4 text-center">
                    <button class="px-2.5 py-1 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xs font-bold transition-all cursor-pointer" onclick='window.printSingleReceipt(${JSON.stringify(t)})' title="রশিদ প্রিন্ট">
                        <i class="fa-solid fa-print mr-1"></i>রশিদ
                    </button>
                </td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

export function handleExportInvoiceExcel() {
    exportTableToExcel('invoice-table', 'Invoices_Vouchers.xlsx');
}
