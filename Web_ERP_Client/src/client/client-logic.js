import { db } from '../firebase-config.js';
import { printCustomerStatement } from '../client-print.js';
import Swal from 'sweetalert2';
import {
    activeCustomer,
    allCustomersCache,
    appSettings,
    customerTransactions,
    setActiveCustomer,
    setCustomerTransactions
} from './client-state.js';
import {
    formatMoney,
    renderCustomerLedgerView,
    renderDirectoryCardsHtml,
    renderTxnCardsHtml
} from './client-ui.js';

/**
 * Handle Live Search Input
 */
export function handleOmniSearch(query) {
    const dropdown = document.getElementById('search-results-dropdown');
    if (!dropdown) return;

    const q = String(query || '').trim().toLowerCase();
    if (!q) {
        dropdown.classList.add('hidden');
        dropdown.innerHTML = '';
        return;
    }

    const matches = allCustomersCache.filter(c => 
        (c.name || '').toLowerCase().includes(q) ||
        (c.accountNo || '').toLowerCase().includes(q) ||
        (c.phone || '').includes(q) ||
        (c.zone || '').toLowerCase().includes(q)
    ).slice(0, 8);

    if (matches.length === 0) {
        dropdown.innerHTML = `<div class="p-3 text-xs text-slate-400 font-bold text-center italic">"${query}" দিয়ে কোনো কাস্টমার বা একাউন্ট নম্বর পাওয়া যায়নি</div>`;
    } else {
        dropdown.innerHTML = matches.map(c => `
            <div class="p-2.5 rounded-xl hover:bg-sky-500/10 cursor-pointer flex justify-between items-center transition-colors border-b border-slate-800/50 last:border-0" onclick="window.selectCustomerById('${c.id}')">
                <div>
                    <p class="text-xs font-black text-white">${c.name}</p>
                    <p class="text-[10px] text-sky-400 font-bold">A/C: ${c.accountNo || '-'} • Mobile: ${c.phone || '-'}</p>
                </div>
                <div class="text-right">
                    <span class="text-xs font-black ${Number(c.totalDue) > 0 ? 'text-red-400' : 'text-emerald-400'}">${formatMoney(c.totalDue)}</span>
                </div>
            </div>
        `).join('');
    }

    dropdown.classList.remove('hidden');
}

export function filterDirectoryList(query) {
    const q = String(query || '').trim().toLowerCase();
    const filtered = allCustomersCache.filter(c => 
        (c.name || '').toLowerCase().includes(q) ||
        (c.accountNo || '').toLowerCase().includes(q) ||
        (c.phone || '').includes(q)
    );

    const listEl = document.getElementById('directory-customers-list');
    if (listEl) listEl.innerHTML = renderDirectoryCardsHtml(filtered);

    const countEl = document.getElementById('dir-count-badge');
    if (countEl) countEl.innerText = `${filtered.length} জন`;
}

/**
 * Load & Render Customer Ledger Screen
 */
export async function loadAndRenderCustomerLedger(container, customer) {
    setActiveCustomer(customer);
    Swal.fire({ title: 'স্টেটমেন্ট লোড হচ্ছে...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

    try {
        const snap = await db.collection('transactions')
            .where('customerId', '==', customer.id)
            .get();

        const txns = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            .sort((a, b) => new Date(b.date) - new Date(a.date));

        setCustomerTransactions(txns);
        Swal.close();
        renderCustomerLedgerView(container, customer, txns);
    } catch(e) {
        console.error(e);
        Swal.fire('Error', 'লেনদেন ডাটা লোড করতে সমস্যা হয়েছে', 'error');
    }
}

/**
 * Filter Date Presets
 */
export function applyDatePreset(presetKey) {
    if (!activeCustomer || !customerTransactions) return;

    ['all', 'today', 'month', 'year'].forEach(k => {
        const btn = document.getElementById(`preset-${k}`);
        if (btn) {
            if (k === presetKey) {
                btn.className = "py-1.5 rounded-lg bg-sky-500 text-white text-[11px] text-center font-bold";
            } else {
                btn.className = "py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] text-center font-bold";
            }
        }
    });

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const currentMonthStr = todayStr.substring(0, 7);
    const currentYearStr = todayStr.substring(0, 4);

    let filtered = customerTransactions;
    let label = 'সব সময়';

    if (presetKey === 'today') {
        filtered = customerTransactions.filter(t => t.date === todayStr);
        label = `আজকে (${todayStr.split('-').reverse().join('/')})`;
    } else if (presetKey === 'month') {
        filtered = customerTransactions.filter(t => t.date && t.date.startsWith(currentMonthStr));
        label = `এই মাস (${currentMonthStr})`;
    } else if (presetKey === 'year') {
        filtered = customerTransactions.filter(t => t.date && t.date.startsWith(currentYearStr));
        label = `এই বছর (${currentYearStr})`;
    }

    const labelEl = document.getElementById('date-filter-label');
    if (labelEl) labelEl.innerText = label;

    const cardsList = document.getElementById('txns-cards-list');
    if (cardsList) cardsList.innerHTML = renderTxnCardsHtml(filtered);
}

/**
 * Trigger Current Customer Statement Print
 */
export async function triggerPrintCurrentStatement() {
    if (!activeCustomer) return;
    printCustomerStatement(activeCustomer, customerTransactions, appSettings);
}
