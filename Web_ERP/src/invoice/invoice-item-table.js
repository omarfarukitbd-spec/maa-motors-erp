import { CustomerDAO } from '../dao.js';
import { getCustomerCache, initCustomerCache } from '../customer/index.js';
import { parseAmount, formatAmountWithComma, numberToBanglaWords, safeRound } from '../utils.js';
import { getInvoiceItems } from './invoice-logic.js';
import { filterCustomerCombobox } from '../shared/components/customer-combobox.js';

export function renderInvoiceItems() {
    const tbody = document.getElementById('inv-items-tbody');
    const items = getInvoiceItems();
    if(!tbody) return;
    if (items.length === 0) { tbody.innerHTML = '<tr><td colspan="7" class="text-center py-6 text-slate-500 italic font-bold">কোনো আইটেম নেই</td></tr>'; return; }
    tbody.innerHTML = items.map((item, i) => `
        <tr class="border-b border-slate-800/60 hover:bg-white/[0.02] transition-colors">
            <td class="w-10 text-center text-slate-400 font-bold text-xs py-2.5 px-2">${i + 1}</td>
            <td class="py-2.5 px-2">
                <input type="text" class="w-full bg-slate-950/90 border border-slate-700/70 rounded-xl px-3.5 h-10 text-xs text-white font-bold outline-none focus:border-blue-500 transition-all shadow-inner" placeholder="আইটেমের নাম / বিবরণ লিখুন..." value="${item.desc}" oninput="window.updateInvoiceItem(${i}, 'desc', this)">
                <div id="price-hint-${i}" class="hidden mt-1"></div>
                <div id="item-live-words-${i}" class="${item.total > 0 ? '' : 'hidden'} text-[10px] text-blue-400 font-bold italic mt-1 flex items-center gap-1"><i class="fa-solid fa-coins text-[9px] text-amber-400"></i><span>${item.total > 0 ? numberToBanglaWords(item.total) : ''}</span></div>
            </td>
            <td class="w-28 py-2.5 px-2">
                <select class="w-full bg-slate-950/90 border border-slate-700/70 rounded-xl px-2.5 h-10 text-xs text-slate-200 font-bold outline-none cursor-pointer focus:border-blue-500 transition-all shadow-inner" onchange="window.updateInvoiceItem(${i}, 'unit', this)">
                    <option value="Pcs" ${item.unit==='Pcs'?'selected':''}>Pcs</option>
                    <option value="Ltr" ${item.unit==='Ltr'?'selected':''}>Ltr</option>
                    <option value="Set" ${item.unit==='Set'?'selected':''}>Set</option>
                    <option value="Kg" ${item.unit==='Kg'?'selected':''}>Kg</option>
                    <option value="Box" ${item.unit==='Box'?'selected':''}>Box</option>
                    <option value="Ft" ${item.unit==='Ft'?'selected':''}>Ft</option>
                </select>
            </td>
            <td class="w-28 py-2.5 px-2">
                <input type="text" class="w-full text-center bg-slate-950/90 border border-slate-700/70 rounded-xl px-2 h-10 text-xs text-white font-bold outline-none focus:border-blue-500 transition-all shadow-inner" value="${item.qty || ''}" placeholder="১" onkeyup="window.handleNumberInput(this); window.updateInvoiceItem(${i}, 'qty', this);">
            </td>
            <td class="w-36 py-2.5 px-2">
                <input type="text" id="inv-item-rate-${i}" class="w-full text-center bg-slate-950/90 border border-slate-700/70 rounded-xl px-2 h-10 text-xs text-white font-bold outline-none focus:border-blue-500 transition-all shadow-inner" value="${item.rate ? formatAmountWithComma(item.rate) : ''}" placeholder="০" onkeyup="window.handleNumberInput(this); window.updateInvoiceItem(${i}, 'rate', this);" onkeydown="if(event.key==='Enter'){ event.preventDefault(); window.addInvoiceItemRow(); }">
            </td>
            <td class="w-40 py-2.5 px-2">
                <input type="text" id="inv-item-total-${i}" class="w-full text-right font-black text-blue-400 bg-slate-950/60 border border-slate-800 rounded-xl px-3 h-10 text-xs outline-none shadow-inner" value="${item.total ? formatAmountWithComma(item.total) : ''}" placeholder="০" readonly>
            </td>
            <td class="w-12 text-center py-2.5 px-1">
                <button type="button" class="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 hover:bg-red-500/20 text-slate-500 hover:text-red-400 flex items-center justify-center transition-all cursor-pointer mx-auto" onclick="window.removeInvoiceItem(${i})" title="লাইন ডিলিট"><i class="fa-solid fa-trash-can text-xs"></i></button>
            </td>
        </tr>`
    ).join('');
}

export function updateCashTenderUI(paidVal, grandTotal) {
    const changeBox = document.getElementById('inv-change-return-box');
    const changeDisplay = document.getElementById('inv-change-return-display');
    if (!changeBox || !changeDisplay) return;

    if (paidVal > grandTotal && grandTotal > 0) {
        const change = paidVal - grandTotal;
        changeDisplay.innerText = `৳ ${formatAmountWithComma(change)}`;
        changeBox.classList.remove('hidden');
    } else {
        changeBox.classList.add('hidden');
    }
}

export function calcItemTotals() {
    let subtotal = 0;
    getInvoiceItems().forEach(item => { subtotal += (item.total || 0); });
    const subInp = document.getElementById('inv-subtotal');
    if (subInp) { subInp.value = formatAmountWithComma(subtotal); calcInvoiceTotals(); }
}

export function calcInvoiceTotals() {
    const sub = parseAmount(document.getElementById('inv-subtotal')?.value || '0');
    const discInput = parseAmount(document.getElementById('inv-discount')?.value || '0');
    const prev = parseAmount(document.getElementById('inv-prev-due')?.value || '0');
    const paid = parseAmount(document.getElementById('inv-paid')?.value || '0');
    const mode = document.getElementById('inv-disc-mode-btn')?.dataset.mode || 'fixed';

    let discAmt = mode === 'percent' ? safeRound((sub * discInput) / 100) : discInput;
    const netTotal = safeRound(Math.max(0, sub - discAmt) + prev);
    const currentDue = safeRound(netTotal - paid);

    const setWords = (id, val) => {
        const el = document.getElementById(id);
        if(el) {
            if(val > 0) {
                el.innerText = `(${numberToBanglaWords(val)})`;
                el.classList.remove('hidden');
            } else el.classList.add('hidden');
        }
    };

    setWords('inv-sub-words', sub);
    setWords('inv-disc-words', discAmt);
    setWords('inv-net-words', netTotal);
    setWords('inv-paid-words', paid);
    setWords('inv-due-words', Math.abs(currentDue));

    const netDisplay = document.getElementById('inv-net-total-display');
    if(netDisplay) netDisplay.innerText = '৳ ' + formatAmountWithComma(netTotal);

    const cd = document.getElementById('inv-current-due-display');
    if(cd) {
        cd.innerText = '৳ ' + formatAmountWithComma(Math.abs(currentDue)) + (currentDue < 0 ? ' (Adv)' : '');
        cd.className = currentDue > 0 ? 'text-xl font-black text-red-400' : (currentDue < 0 ? 'text-xl font-black text-emerald-400' : 'text-xl font-black text-slate-300');
    }
    updateCashTenderUI(paid, netTotal);
}

export async function loadInvoiceCustomers(selectedId = null) {
    let customers = getCustomerCache();
    if (!customers.length) { initCustomerCache(); customers = await CustomerDAO.getAll('name', 'asc'); }
    const sel = document.getElementById('inv-customer-select');
    if(!sel) return;
    sel.innerHTML = '<option value="">-- সিলেক্ট করুন --</option>' + customers.map(d => {
        const acc = d.accountNo ? `[${d.accountNo}] ` : '';
        return `<option value="${d.id}" data-due="${d.totalDue || 0}" data-phone="${d.phone || ''}" data-address="${d.address || ''}" data-name="${d.name}" data-acc="${d.accountNo || ''}">${acc}${d.name}</option>`;
    }).join('');
    if (selectedId) {
        selectInvoiceCustomer(selectedId);
    }
}

export function filterInvoiceCustomerSearch(query = '') {
    filterCustomerCombobox(query, {
        inputId: 'inv-cust-search-input',
        selectId: 'inv-customer-select',
        dropdownId: 'inv-cust-dropdown',
        onSelect: (id) => selectInvoiceCustomer(id)
    });
}

export function selectInvoiceCustomer(id) {
    const sel = document.getElementById('inv-customer-select');
    const searchInput = document.getElementById('inv-cust-search-input');
    const clearBtn = document.getElementById('inv-cust-search-clear');
    const dropdown = document.getElementById('inv-cust-dropdown');

    if (sel) {
        sel.value = id;
        invoiceCustomerChanged();
    }

    if (sel && sel.selectedIndex > 0) {
        const opt = sel.options[sel.selectedIndex];
        if (searchInput) searchInput.value = `${opt.dataset.name} ${opt.dataset.acc ? '[' + opt.dataset.acc + ']' : ''}`;
        if (clearBtn) clearBtn.classList.remove('hidden');
    }

    if (dropdown) dropdown.classList.add('hidden');
}

export function clearInvoiceCustomerSearch() {
    const sel = document.getElementById('inv-customer-select');
    const searchInput = document.getElementById('inv-cust-search-input');
    const clearBtn = document.getElementById('inv-cust-search-clear');
    const dropdown = document.getElementById('inv-cust-dropdown');

    if (sel) {
        sel.value = '';
        invoiceCustomerChanged();
    }
    if (searchInput) searchInput.value = '';
    if (clearBtn) clearBtn.classList.add('hidden');
    if (dropdown) dropdown.classList.add('hidden');
}

export function invoiceCustomerChanged() {
    const sel = document.getElementById('inv-customer-select');
    const display = document.getElementById('inv-cust-display');
    const prevDueInput = document.getElementById('inv-prev-due');
    if (sel && sel.selectedIndex > 0) {
        const opt = sel.options[sel.selectedIndex];
        const dueVal = Number(opt.dataset.due) || 0;
        const dueBadge = dueVal > 0 ? `<span class="text-red-400 font-black">বকেয়া: ৳${formatAmountWithComma(dueVal)}</span>` : '<span class="text-emerald-400 font-bold">পরিশোধিত</span>';
        display.innerHTML = `
            <div class="flex justify-between items-center"><div class="font-black text-white">${opt.dataset.name} <span class="text-blue-400 text-[11px] font-bold">(${opt.dataset.acc || '-'})</span></div>${dueBadge}</div>
            <div class="text-[11px] text-slate-400 font-bold mt-0.5"><i class="fa-solid fa-phone text-[9px] mr-1"></i>${opt.dataset.phone || '-'} • ${opt.dataset.address || '-'}</div>`;
        prevDueInput.value = formatAmountWithComma(dueVal);
    } else {
        display.innerText = 'সিলেক্ট করা হয়নি'; if (prevDueInput) prevDueInput.value = '';
    }
    calcInvoiceTotals();
}

export function toggleInvoiceDiscMode() {
    const b = document.getElementById('inv-disc-mode-btn'); if(!b) return;
    b.dataset.mode = b.dataset.mode === 'fixed' ? 'percent' : 'fixed';
    b.innerText = b.dataset.mode === 'fixed' ? '৳' : '%';
    calcInvoiceTotals();
}

export function toggleInvoiceRecvSection() {
    const p = parseAmount(document.getElementById('inv-paid')?.value || '0');
    document.getElementById('inv-recv-section')?.classList.toggle('hidden', p <= 0);
}

export function setInvoiceRecvType(type) {
    const b = document.getElementById('inv-recv-bank-btn'); const c = document.getElementById('inv-recv-cash-btn');
    const r = document.getElementById('inv-received-from');
    if(b && c) {
        if(type==='Bank'){ 
            b.className = 'px-3 py-1 rounded-md bg-blue-600 text-white font-bold'; 
            c.className = 'px-3 py-1 rounded-md text-slate-400 font-bold'; 
            if(r) {
                r.outerHTML = '<select id="inv-received-from" class="w-full bg-slate-950/90 border border-slate-700/60 rounded-xl h-8 px-3 text-xs text-white outline-none cursor-pointer">' + (window.cachedBanksHtml || '<option value="">-- নির্বাচন করুন --</option>') + '</select>';
            }
        }
        else { 
            c.className = 'px-3 py-1 rounded-md bg-emerald-600 text-white font-bold'; 
            b.className = 'px-3 py-1 rounded-md text-slate-400 font-bold'; 
            if(r) {
                r.outerHTML = '<select id="inv-received-from" class="w-full bg-slate-950/90 border border-slate-700/60 rounded-xl h-8 px-3 text-xs text-white outline-none cursor-pointer">' + (window.cachedCashHtml || '<option value="">-- নির্বাচন করুন --</option>') + '</select>';
            }
        }
    }
}
