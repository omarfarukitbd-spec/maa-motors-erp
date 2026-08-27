import { getCustomerCache } from '../customer/index.js';
import { formatAmountWithComma, formatAppDate } from '../utils.js';
import { navigate } from '../navigation/router.js';
import { TransactionDAO } from '../dao.js';
import { AppState } from '../state.js';

let searchDebounce;
let selectedSearchIndex = -1;

/**
 * Initialize Global Search
 */
export function initSearch() {
    const input = document.getElementById('global-search-input'), results = document.getElementById('global-search-results');
    if(!input || !results) return;

    input.oninput = (e) => {
        const query = e.target.value.trim();
        if(query.length < 1) {
            selectedSearchIndex = -1;
            return results.classList.add('hidden');
        }
        clearTimeout(searchDebounce);
        searchDebounce = setTimeout(async () => {
            results.classList.remove('hidden');
            results.innerHTML = '<div class="p-4 text-xs text-slate-500 text-center"><i class="fa-solid fa-spinner fa-spin mr-2 text-blue-500"></i>অনুসন্ধান করা হচ্ছে...</div>';
            performSearch(query, results);
            selectedSearchIndex = -1;
        }, 150);
    };

    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            input.focus(); input.select();
        } else if (e.key === 'Escape') {
            results.classList.add('hidden');
        } else if (results && !results.classList.contains('hidden')) {
            const items = results.querySelectorAll('.search-result-item');
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                selectedSearchIndex = Math.min(selectedSearchIndex + 1, items.length - 1);
                updateSearchSelection(items);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                selectedSearchIndex = Math.max(selectedSearchIndex - 1, 0);
                updateSearchSelection(items);
            } else if (e.key === 'Enter' && selectedSearchIndex >= 0) {
                e.preventDefault();
                items[selectedSearchIndex].click();
            }
        }
    });
}

function updateSearchSelection(items) {
    items.forEach((item, index) => {
        if (index === selectedSearchIndex) {
            item.classList.add('bg-blue-600/20', 'border-blue-500/50');
            item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        } else {
            item.classList.remove('bg-blue-600/20', 'border-blue-500/50');
        }
    });
}

/**
 * Execute Search Logic
 */
async function performSearch(query, container) {
    try {
        let html = '';
        const q = query.toLowerCase();
        const qNoHash = q.replace(/^#/, '');

        // 1. Customer Search
        const matchedCustomers = getCustomerCache().filter(c => {
            if (typeof window.matchCustomerSearch === 'function') return window.matchCustomerSearch(c, query);
            return (c.accountNo && c.accountNo.toLowerCase().includes(qNoHash)) ||
                (c.name && c.name.toLowerCase().includes(q)) ||
                (c.phone && c.phone.includes(qNoHash));
        });

        if(matchedCustomers.length > 0) {
            html += `<div class="px-3 py-1.5 bg-slate-800/80 text-[10px] text-blue-400 font-black tracking-widest uppercase border-b border-slate-700/50">কাস্টমার (${matchedCustomers.length})</div>`;
            matchedCustomers.forEach(c => {
                html += `
                <div class="search-result-item p-3 hover:bg-slate-800 cursor-pointer flex justify-between items-center border-b border-slate-800 transition-all group"
                    onclick="window.handleSearchResultClick('customer', '${c.id}', '${c.name.replace(/'/g,"\\'")}', '${c.accountNo||''}')">
                    <div class="overflow-hidden">
                        <div class="font-bold text-slate-200 text-sm group-hover:text-blue-400 transition-colors">${c.name}</div>
                        <div class="text-[10px] text-slate-500">${c.phone||'No Phone'}</div>
                    </div>
                    <div class="text-xs font-black text-red-400">৳${formatAmountWithComma(c.totalDue||0)}</div>
                </div>`;
            });
        }

        // 2. Voucher Search (with Deduplication)
        if (qNoHash.length >= 2) {
            const txns = await TransactionDAO.getByVoucher(qNoHash);
            const seenVouchers = new Set();
            const uniqueVouchers = txns.filter(v => {
                if (seenVouchers.has(v.voucherNo)) return false;
                seenVouchers.add(v.voucherNo);
                return true;
            });

            if (uniqueVouchers.length > 0) {
                html += `<div class="px-3 py-1.5 bg-slate-800/80 text-[10px] text-emerald-400 font-black tracking-widest uppercase border-b border-slate-700/50 mt-1">ভাউচার (${uniqueVouchers.length})</div>`;
                uniqueVouchers.forEach(v => {
                    const amt = (Number(v.bill) || 0) > 0 ? `৳${formatAmountWithComma(v.bill)}` : `৳${formatAmountWithComma(v.paid)}`;
                    html += `
                    <div class="search-result-item p-3 hover:bg-slate-800 cursor-pointer flex justify-between items-center border-b border-slate-800 transition-all group"
                        onclick="window.handleSearchResultClick('voucher', '${v.voucherNo}')">
                        <div>
                            <div class="font-bold text-slate-200 text-sm group-hover:text-emerald-400 transition-colors">#${v.voucherNo} • ${v.customerName}</div>
                            <div class="text-[10px] text-slate-500">${formatAppDate(v.date)}</div>
                        </div>
                        <div class="text-xs font-black text-white">${amt}</div>
                    </div>`;
                });
            }
        }

        container.innerHTML = html || '<div class="p-8 text-center text-xs text-slate-500 italic">কিছু পাওয়া যায়নি</div>';
    } catch (e) {
        console.error(e);
        container.innerHTML = '<div class="p-4 text-center text-red-400">Error during search</div>';
    }
}

/**
 * Handle Result Click
 */
export function handleSearchResultClick(type, id, name, accNo) {
    document.getElementById('global-search-results')?.classList.add('hidden');
    document.getElementById('global-search-input').value = '';

    if(type === 'customer') {
        const view = AppState.currentView;
        if (view === 'invoice') {
            const sel = document.getElementById('inv-customer-select');
            if (sel) { sel.value = id; window.invoiceCustomerChanged(); }
        } else if (view === 'ledger') {
            const sel = document.getElementById('ledger-customer-select');
            if (sel) { sel.value = id; window.filterLedgerByCustomer(id); }
        } else if (view === 'customers') {
            const input = document.getElementById('cust-search-input');
            if (input) {
                input.value = accNo || name;
                window.filterCustomerList();
                setTimeout(() => {
                    const rows = document.querySelectorAll('#customer-list tr');
                    rows.forEach(row => {
                        if (row.innerText.includes(name)) {
                            row.classList.add('bg-blue-600/20');
                            row.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                    });
                }, 150);
            }
        } else {
            navigate('statement', { customerId: id, customerName: name, accountNo: accNo });
        }
    } else if (type === 'voucher') {
        navigate('memo-search', { memoNo: id });
    }
}

window.handleSearchResultClick = handleSearchResultClick;
