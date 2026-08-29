// --- Ledger Module (Modular Architecture) ---
import { CustomerDAO, TransactionDAO } from './dao.js';
import { updateLiveWords, promptSecurityPin, handleError, parseAmount } from './utils.js';
import { getCustomerCache, initCustomerCache } from './customer/index.js';
import { filterCustomerCombobox } from './shared/components/customer-combobox.js';
import Swal from 'sweetalert2';

import { renderLedger as renderLedgerUI } from './ledger/ledger-ui.js';
import { renderRows as renderRowsUI, updateLedgerLiveText as updateLiveTextUI } from './ledger/ledger-render-rows.js';
import { saveTransaction as saveTransactionAction, editTransaction as editTransactionAction, deleteTransaction as deleteTransactionAction } from './ledger/ledger-actions.js';
import { sendTxnSMS as sendTxnSMSAction, sendTxnWhatsApp as sendTxnWhatsAppAction, choosePrintType as choosePrintTypeAction, executePrint as executePrintAction } from './ledger/ledger-messaging.js';
import { initLedgerHotkeys } from './ledger/ledger-hotkeys.js';

let editingRef = { id: null, oldBill: 0, oldPaid: 0 };
let recentTxnsListener = null, currentLedgerTxns = [], currentLedgerTxnsMap = {};
let lastVisibleDoc = null, pageStack = [], balanceStack = [], currentPage = 1;
const pageSize = 20;

const stateRefs = { currentLedgerTxns, currentLedgerTxnsMap };

export async function loadRecentTransactions(filterVoucher = null, filterCustomer = null, direction = 'reset') {
    if(recentTxnsListener) recentTxnsListener();
    const tbody = document.getElementById('ledger-list');
    const mobileContainer = document.getElementById('ledger-list-mobile');
    const dashTbody = document.getElementById('recent-txn-list');
    const paginationEl = document.getElementById('ledger-pagination');

    if (direction === 'reset') {
        lastVisibleDoc = null;
        pageStack = [];
        balanceStack = [];
        currentPage = 1;
    }

    if (filterCustomer === null && !filterVoucher) {
        const custSelect = document.getElementById('ledger-customer-select');
        if (custSelect && custSelect.value) {
            filterCustomer = custSelect.value;
        }
    }

    if (tbody) tbody.innerHTML = '<tr><td colspan="6" class="text-center py-12"><i class="fa-solid fa-spinner fa-spin mr-3 text-blue-500 text-xl"></i> লোডিং...</td></tr>';
    if (mobileContainer) mobileContainer.innerHTML = '<div class="text-center py-10 text-slate-500 font-bold italic">লোডিং...</div>';

    try {
        let results;
        if (filterVoucher) {
            const txns = await TransactionDAO.getByVoucher(filterVoucher);
            results = { data: txns, lastDoc: null, count: txns.length };
            if (paginationEl) paginationEl.classList.add('hidden');
        } else {
            const filters = filterCustomer ? [{ field: 'customerId', op: '==', value: filterCustomer }] : [];
            if (dashTbody && !tbody) return TransactionDAO.listenRecent(5, transactions => renderRows(transactions, dashTbody));

            let cursor = (direction === 'next') ? lastVisibleDoc : (direction === 'prev' ? (pageStack.length > 1 ? pageStack[pageStack.length - 2] : null) : null);

            if (filterCustomer) {
                try { results = await TransactionDAO.getByPage(pageSize, cursor, 'createdAt', 'desc', filters); } 
                catch (idxErr) { results = await TransactionDAO.getByPage(pageSize, cursor, 'date', 'desc', filters); }
            } else { results = await TransactionDAO.getByPage(pageSize, cursor, 'createdAt', 'desc', filters); }

            lastVisibleDoc = results.lastDoc;
            if (direction === 'next') { if (cursor) pageStack.push(cursor); } else if (direction === 'prev') { pageStack.pop(); }

            if (paginationEl) {
                paginationEl.classList.remove('hidden');
                const pageDisplay = document.getElementById('current-page-display');
                if (pageDisplay) pageDisplay.innerText = currentPage;
                const prevBtn = document.getElementById('prev-page'); const nextBtn = document.getElementById('next-page');
                if (prevBtn) prevBtn.disabled = currentPage === 1;
                if (nextBtn) nextBtn.disabled = results.count < pageSize;
            }
        }

        let startBalance = null;
        if (filterCustomer) {
            if (direction === 'reset' || balanceStack.length === 0) {
                const currentCustomer = (getCustomerCache() || []).find(c => c.id === filterCustomer);
                startBalance = Number(currentCustomer?.totalDue || 0);
                balanceStack = [startBalance];
            } else {
                startBalance = balanceStack[currentPage - 1] !== undefined ? balanceStack[currentPage - 1] : null;
            }
        }

        const activeTbody = document.getElementById('ledger-list') || document.getElementById('recent-txn-list');
        if (!activeTbody) return;

        const renderRes = renderRows(results.data, activeTbody, startBalance);
        if (filterCustomer && renderRes && renderRes.finalRunning !== undefined) {
            balanceStack[currentPage] = renderRes.finalRunning;
        }
    } catch (err) {
        handleError(err, 'লেনদেন লোড করতে সমস্যা হয়েছে');
        if (tbody) tbody.innerHTML = '<tr><td colspan="6" class="text-center py-12 text-red-400">ডাটা লোড করতে সমস্যা হয়েছে</td></tr>';
    }
}

export function filterLedgerByCustomer(custId) {
    lastVisibleDoc = null; pageStack = []; balanceStack = []; currentPage = 1;
    const phoneInput = document.getElementById('ledger-cust-phone');
    const addressInput = document.getElementById('ledger-cust-address');
    if (custId) {
        const cust = (getCustomerCache() || []).find(c => c.id === custId);
        if (phoneInput) phoneInput.value = cust?.phone || 'মোবাইল নেই';
        if (addressInput) addressInput.value = (cust?.zone ? `[${cust.zone}] ` : '') + (cust?.address || 'ঠিকানা নেই');
    } else {
        if (phoneInput) phoneInput.value = '';
        if (addressInput) addressInput.value = '';
    }
    updateLedgerLiveText(); loadRecentTransactions(null, custId, 'reset');
}

export function updateLedgerLiveText() {
    updateLiveTextUI();
}

export function renderRows(transactions, container, startBalance = null) {
    return renderRowsUI(transactions, container, stateRefs, startBalance);
}

export function renderLedger(container, params) {
    renderLedgerUI(container, params, {
        loadCustomersForDropdown,
        loadRecentTransactions,
        filterLedgerByCustomer
    });
    currentPage = 1; pageStack = []; balanceStack = []; lastVisibleDoc = null;
}

export async function saveTransaction() {
    return saveTransactionAction(editingRef, { filterLedgerByCustomer }, stateRefs);
}

export async function sendTxnSMS(id, name, date, v, bill, paid, due, custId) {
    return sendTxnSMSAction(id, name, date, v, bill, paid, due, custId, stateRefs);
}

export async function sendTxnWhatsApp(id, name, date, v, bill, paid, due, custId) {
    return sendTxnWhatsAppAction(id, name, date, v, bill, paid, due, custId, stateRefs);
}

export async function editTransaction(id, cid, date, v, b, p, rt, rf) {
    return editTransactionAction(id, cid, date, v, b, p, rt, rf, editingRef);
}

export async function deleteTransaction(id, cid, b, p) {
    return deleteTransactionAction(id, cid, b, p, { filterLedgerByCustomer });
}

export async function executePrint(txnId, layoutType) {
    return executePrintAction(txnId, layoutType);
}

export function choosePrintType(txnId) {
    return choosePrintTypeAction(txnId);
}

async function loadCustomersForDropdown() {
    let customers = getCustomerCache();
    if (!customers.length) {
        initCustomerCache();
        customers = await CustomerDAO.getAll('name', 'asc');
    }
    const sel = document.getElementById('ledger-customer-select');
    if (sel) {
        sel.innerHTML = '<option value="">-- সকল কাস্টমার --</option>' + customers.map(d => {
            const acc = d.accountNo ? `[${d.accountNo}] ` : '';
            return `<option value="${d.id}" data-due="${d.totalDue || 0}" data-phone="${d.phone || ''}" data-address="${d.address || ''}" data-zone="${d.zone || ''}" data-name="${d.name}" data-acc="${d.accountNo || ''}">${acc}${d.name}</option>`;
        }).join('');
    }
}

export function filterLedgerCustomerSearch(query = '') {
    filterCustomerCombobox(query, {
        inputId: 'ledger-cust-search-input',
        selectId: 'ledger-customer-select',
        dropdownId: 'ledger-cust-dropdown',
        onSelect: (id) => selectLedgerCustomer(id)
    });
}

export function selectLedgerCustomer(id) {
    const sel = document.getElementById('ledger-customer-select');
    const searchInput = document.getElementById('ledger-cust-search-input');
    const clearBtn = document.getElementById('ledger-cust-search-clear');
    const dropdown = document.getElementById('ledger-cust-dropdown');
    const phoneInput = document.getElementById('ledger-cust-phone');
    const addressInput = document.getElementById('ledger-cust-address');

    if (sel) {
        sel.value = id;
    }
    const cust = (getCustomerCache() || []).find(c => c.id === id);
    if (searchInput && cust) {
        searchInput.value = cust.name || '';
        if (clearBtn) clearBtn.classList.remove('hidden');
    }
    if (phoneInput) phoneInput.value = cust?.phone || 'মোবাইল নেই';
    if (addressInput) addressInput.value = (cust?.zone ? `[${cust.zone}] ` : '') + (cust?.address || 'ঠিকানা নেই');
    if (dropdown) dropdown.classList.add('hidden');

    filterLedgerByCustomer(id);
    updateLedgerLiveText();
}

export function clearLedgerCustomerSearch() {
    const sel = document.getElementById('ledger-customer-select');
    const searchInput = document.getElementById('ledger-cust-search-input');
    const clearBtn = document.getElementById('ledger-cust-search-clear');
    const dropdown = document.getElementById('ledger-cust-dropdown');
    const phoneInput = document.getElementById('ledger-cust-phone');
    const addressInput = document.getElementById('ledger-cust-address');

    if (sel) {
        sel.value = '';
        filterLedgerByCustomer('');
    }
    if (searchInput) searchInput.value = '';
    if (phoneInput) phoneInput.value = '';
    if (addressInput) addressInput.value = '';
    if (clearBtn) clearBtn.classList.add('hidden');
    if (dropdown) dropdown.classList.add('hidden');
    updateLedgerLiveText();
}

// Global API Bindings
if (typeof window !== 'undefined') {
    Object.assign(window, {
        loadRecentTransactions, saveTransaction, sendTxnSMS, sendTxnWhatsApp,
        updateLedgerLiveText, filterLedgerByCustomer, editTransaction,
        deleteTransaction, executePrint, choosePrintType, filterLedgerCustomerSearch,
        selectLedgerCustomer, clearLedgerCustomerSearch
    });
    window.changeLedgerPage = async (dir) => { 
        const prevPage = currentPage; 
        if (dir === 'next') currentPage++; else currentPage--; 
        try { 
            const custId = document.getElementById('ledger-customer-select')?.value; 
            await loadRecentTransactions(null, custId, dir); 
        } catch(e) { currentPage = prevPage; } 
    };
    window.toggleReceivedSection = () => { 
        const p = parseAmount(document.getElementById('ledger-paid')?.value || '0'); 
        const recvSec = document.getElementById('received-section');
        const standaloneSave = document.getElementById('ledger-standalone-save-strip');
        if (recvSec) recvSec.classList.toggle('hidden', p <= 0);
        if (standaloneSave) standaloneSave.classList.toggle('hidden', p > 0);
    };
    window.setReceivedType = (type) => { 
        ['Bank', 'Cash', 'Less'].forEach(k => { 
            const el = document.getElementById('recv-' + k.toLowerCase() + '-btn'); 
            if (el) { 
                if (k === type) { el.classList.add('bg-emerald-600', 'text-white'); el.classList.remove('text-slate-400', 'bg-blue-600'); } 
                else { el.classList.remove('bg-emerald-600', 'bg-blue-600', 'text-white'); el.classList.add('text-slate-400'); } 
            } 
        }); 
        const lbl = document.getElementById('lbl-recv-from');
        const wrapper = document.getElementById('recv-input-wrapper');
        if (lbl && wrapper) {
            if (type === 'Bank') {
                lbl.innerText = 'ব্যাংক অ্যাকাউন্ট (Bank Name)';
                wrapper.innerHTML = `<select id="ledger-received-from" class="m3-field py-1 text-xs bg-slate-950/80 h-9 flex-1 cursor-pointer">${window.cachedBanksHtml || '<option value="">-- ব্যাংক নির্বাচন করুন --</option>'}</select>
                <button type="button" id="btn-quick-edit-recv" onclick="window.quickEditBank && window.quickEditBank()" class="w-9 h-9 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 rounded-xl transition-all flex items-center justify-center shrink-0 cursor-pointer" title="নির্বাচিত ব্যাংক এডিট করুন"><i class="fa-solid fa-pen text-xs"></i></button>
                <button type="button" id="btn-quick-add-recv" onclick="window.quickAddBank && window.quickAddBank()" class="w-9 h-9 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 rounded-xl transition-all flex items-center justify-center shrink-0 cursor-pointer" title="নতুন ব্যাংক যোগ করুন"><i class="fa-solid fa-plus text-xs"></i></button>`;
            } else if (type === 'Cash') {
                lbl.innerText = 'কার মাধ্যমে জমা (Cash Receiver)';
                wrapper.innerHTML = `<select id="ledger-received-from" class="m3-field py-1 text-xs bg-slate-950/80 h-9 flex-1 cursor-pointer">${window.cachedCashHtml || '<option value="">-- ক্যাশ রিসিভার নির্বাচন করুন --</option>'}</select>
                <button type="button" id="btn-quick-edit-recv" onclick="window.quickEditCashCollector && window.quickEditCashCollector()" class="w-9 h-9 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 rounded-xl transition-all flex items-center justify-center shrink-0 cursor-pointer" title="নির্বাচিত ক্যাশ সোর্স এডিট করুন"><i class="fa-solid fa-pen text-xs"></i></button>
                <button type="button" id="btn-quick-add-recv" onclick="window.quickAddCashCollector && window.quickAddCashCollector()" class="w-9 h-9 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 rounded-xl transition-all flex items-center justify-center shrink-0 cursor-pointer" title="নতুন ক্যাশ সোর্স যোগ করুন"><i class="fa-solid fa-plus text-xs"></i></button>`;
            } else {
                lbl.innerText = 'ছাড়ের কারণ (Reason)';
                wrapper.innerHTML = `<input type="text" id="ledger-received-from" placeholder="যেমন: সম্মানিতে ছাড়..." class="m3-field py-1 text-xs bg-slate-950/80 h-9 flex-1">`;
            }
        }
    };
    window.Swal = Swal;
    window.quickSelectPaymentAccount = (type, accountName) => {
        document.getElementById('received-section')?.classList.remove('hidden');
        if (window.setReceivedType) window.setReceivedType(type);
        const sel = document.getElementById('ledger-received-from');
        if (sel) sel.value = accountName;
        document.getElementById('ledger-paid')?.focus();
        showToast(`[${type}] ${accountName} সিলেক্ট করা হয়েছে`, 'info');
    };
    initLedgerHotkeys();
}

document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('ledger-cust-dropdown');
    const searchInput = document.getElementById('ledger-cust-search-input');
    if (dropdown && !dropdown.contains(e.target) && e.target !== searchInput) dropdown.classList.add('hidden');
});
