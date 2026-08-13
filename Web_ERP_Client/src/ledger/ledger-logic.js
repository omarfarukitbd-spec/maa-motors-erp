import { CustomerDAO, TransactionDAO } from '../dao.js';
import { AppState } from '../state.js';
import { formatAmountWithComma, formatAppDate, toDBDate, safeRound, cleanCustomerName, showToast, exportTableToExcel } from '../utils.js';
import { printCustomerStatementA4, printCustomerStatementPOS } from '../statement-print.js';

let unsubLedgerTxns = null;
let currentCustomerTxns = [];
let selectedCustomerObj = null;

export async function initLedger(params = {}) {
    if (unsubLedgerTxns) { unsubLedgerTxns(); unsubLedgerTxns = null; }

    const customers = AppState.customerCache.length ? AppState.customerCache : await CustomerDAO.getAll();
    AppState.customerCache = customers;

    const select = document.getElementById('ledger-customer-select');
    if (select) {
        let html = '<option value="">-- কাস্টমার নির্বাচন করুন --</option>';
        customers.forEach(c => {
            const cleanName = cleanCustomerName(c.name || 'Unknown');
            const acc = c.accountNo ? `[${c.accountNo}] ` : '';
            html += `<option value="${c.id}">${acc}${cleanName} (${c.phone || 'No Phone'})</option>`;
        });
        select.innerHTML = html;

        if (params.customerId) {
            select.value = params.customerId;
            onLedgerCustomerSelect(params.customerId);
        }
    }
}

export async function onLedgerCustomerSelect(customerId) {
    if (unsubLedgerTxns) { unsubLedgerTxns(); unsubLedgerTxns = null; }

    if (!customerId) {
        resetLedgerDetails();
        return;
    }

    selectedCustomerObj = AppState.customerCache.find(c => c.id === customerId) || await CustomerDAO.getById(customerId);
    AppState.selectedCustomerId = customerId;
    AppState.selectedCustomer = selectedCustomerObj;

    updateCustomerInfoCard(selectedCustomerObj);

    // Listen to customer transactions
    unsubLedgerTxns = TransactionDAO.listenByCustomer(customerId, txns => {
        currentCustomerTxns = txns;
        renderLedgerTable(txns);
    });
}

function updateCustomerInfoCard(c) {
    if (!c) return;
    const details = document.getElementById('ledger-cust-details');
    const accEl = document.getElementById('lcd-acc');
    const phoneEl = document.getElementById('lcd-phone');
    const addrEl = document.getElementById('lcd-address');
    const zoneEl = document.getElementById('lcd-zone');
    const dueBadge = document.getElementById('ledger-current-due-badge');
    const statusBadge = document.getElementById('ledger-balance-status');

    if (details) details.classList.remove('hidden');
    if (accEl) accEl.innerText = c.accountNo ? `A/C: ${c.accountNo}` : 'A/C: N/A';
    if (phoneEl) phoneEl.innerText = c.phone || 'N/A';
    if (addrEl) addrEl.innerText = c.address || 'N/A';
    if (zoneEl) zoneEl.innerText = c.zone || 'N/A';

    const due = Number(c.totalDue) || 0;
    if (dueBadge) dueBadge.innerText = "৳ " + formatAmountWithComma(Math.abs(due));
    if (statusBadge) {
        if (due > 0) {
            statusBadge.className = 'px-2.5 py-1 rounded-lg text-xs font-black bg-red-500/10 text-red-400 border border-red-500/20';
            statusBadge.innerText = 'বকেয়া আছে';
        } else if (due < 0) {
            statusBadge.className = 'px-2.5 py-1 rounded-lg text-xs font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
            statusBadge.innerText = 'অ্যাডভান্স জমা';
        } else {
            statusBadge.className = 'px-2.5 py-1 rounded-lg text-xs font-black bg-slate-800 text-slate-400';
            statusBadge.innerText = 'পরিশোধিত';
        }
    }
}

function resetLedgerDetails() {
    const details = document.getElementById('ledger-cust-details');
    const tbody = document.getElementById('ledger-tbody');
    const tfoot = document.getElementById('ledger-tfoot');
    const dueBadge = document.getElementById('ledger-current-due-badge');
    const statusBadge = document.getElementById('ledger-balance-status');

    if (details) details.classList.add('hidden');
    if (tbody) tbody.innerHTML = `<tr><td colspan="6" class="text-center py-12 text-slate-500 italic">প্রথমে কাস্টমার নির্বাচন করুন</td></tr>`;
    if (tfoot) tfoot.classList.add('hidden');
    if (dueBadge) dueBadge.innerText = "৳ ০";
    if (statusBadge) {
        statusBadge.className = 'px-2.5 py-1 rounded-lg text-xs font-black bg-slate-800 text-slate-400';
        statusBadge.innerText = 'হিসাব নেই';
    }
}

function renderLedgerTable(txns) {
    const tbody = document.getElementById('ledger-tbody');
    const tfoot = document.getElementById('ledger-tfoot');
    if (!tbody) return;

    if (txns.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center py-12 text-slate-500 italic">কোনো লেনদেন রেকর্ড পাওয়া যায়নি</td></tr>`;
        if (tfoot) tfoot.classList.add('hidden');
        return;
    }

    let html = '';
    let running = 0;
    let totBill = 0, totPaid = 0;

    txns.forEach(t => {
        const b = Number(t.bill) || 0;
        const p = Number(t.paid) || 0;
        totBill = safeRound(totBill + b);
        totPaid = safeRound(totPaid + p);
        running = safeRound(running + (b - p));

        const method = (t.receivedFrom || t.receivedType || '').trim();
        const desc = t.notes || (method ? `পেমেন্ট মেথড: ${method}` : 'সাধারণ লেনদেন');
        const balColor = running > 0 ? 'text-red-400' : (running < 0 ? 'text-emerald-400' : 'text-slate-300');

        html += `
            <tr class="hover:bg-slate-800/40 transition-colors">
                <td class="py-3 px-4 font-mono text-slate-300 whitespace-nowrap">${formatAppDate(t.date)}</td>
                <td class="py-3 px-4 font-mono text-blue-400 font-bold">${t.voucherNo || '-'}</td>
                <td class="py-3 px-4 text-slate-200">${desc}</td>
                <td class="py-3 px-4 text-right font-inter font-black ${b > 0 ? 'text-red-400' : 'text-slate-500'}">${b > 0 ? `৳ ${formatAmountWithComma(b)}` : '-'}</td>
                <td class="py-3 px-4 text-right font-inter font-black ${p > 0 ? 'text-emerald-400' : 'text-slate-500'}">${p > 0 ? `৳ ${formatAmountWithComma(p)}` : '-'}</td>
                <td class="py-3 px-4 text-right font-inter font-black ${balColor}">৳ ${formatAmountWithComma(Math.abs(running))} ${running < 0 ? '(Adv)' : ''}</td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
    if (tfoot) {
        tfoot.classList.remove('hidden');
        document.getElementById('ledger-total-bill').innerText = `৳ ${formatAmountWithComma(totBill)}`;
        document.getElementById('ledger-total-paid').innerText = `৳ ${formatAmountWithComma(totPaid)}`;
        const totBalEl = document.getElementById('ledger-total-balance');
        totBalEl.innerText = `৳ ${formatAmountWithComma(Math.abs(running))}`;
        totBalEl.className = `text-right py-3 px-4 font-inter font-black ${running > 0 ? 'text-red-400' : (running < 0 ? 'text-emerald-400' : 'text-white')}`;
    }
}

export function filterLedgerDateRange() {
    const sDate = toDBDate(document.getElementById('ledger-start-date')?.value);
    const eDate = toDBDate(document.getElementById('ledger-end-date')?.value);

    let filtered = currentCustomerTxns;
    if (sDate) filtered = filtered.filter(t => (t.date || '') >= sDate);
    if (eDate) filtered = filtered.filter(t => (t.date || '') <= eDate);

    renderLedgerTable(filtered);
}

export function handlePrintStatement(format = 'a4') {
    if (!selectedCustomerObj || !currentCustomerTxns.length) {
        return showToast('প্রথমে কাস্টমার নির্বাচন করুন যার লেনদেন আছে', 'warning');
    }
    if (format === 'pos') {
        printCustomerStatementPOS(selectedCustomerObj, currentCustomerTxns);
    } else {
        printCustomerStatementA4(selectedCustomerObj, currentCustomerTxns);
    }
}

export function handleExportExcel() {
    if (!selectedCustomerObj) return showToast('কাস্টমার নির্বাচন করুন', 'warning');
    const cleanName = cleanCustomerName(selectedCustomerObj.name || 'Statement');
    exportTableToExcel('ledger-table', `${cleanName}-Statement.xlsx`);
}
