import { getCustomerCache, initCustomerCache } from '../customer/index.js';
import { CustomerDAO } from '../dao.js';
import { formatAmountWithComma } from '../utils.js';

/**
 * Enterprise Global Floating Customer Autocomplete for Spreadsheet Grid
 * Attached to document.body (position: fixed) to bypass any table overflow clipping.
 */

let activeTargetInput = null;
let activeTargetRowIndex = null;

function getGlobalDropdown() {
    let el = document.getElementById('grid-global-customer-dropdown');
    if (!el) {
        el = document.createElement('div');
        el.id = 'grid-global-customer-dropdown';
        el.className = 'hidden fixed bg-slate-900/98 border border-slate-700/90 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.95)] z-[999999] max-h-72 overflow-y-auto custom-scrollbar p-1.5 flex flex-col gap-1 backdrop-blur-2xl text-left font-bn w-[420px] max-w-[90vw]';
        document.body.appendChild(el);
    }
    return el;
}

export async function handleGridCustomerSearch(inputEl, rowIndex) {
    if (!inputEl) return;
    activeTargetInput = inputEl;
    activeTargetRowIndex = rowIndex;

    const dropdown = getGlobalDropdown();
    const query = inputEl.value.trim().toLowerCase();

    let customers = getCustomerCache();
    if (!customers || customers.length === 0) {
        initCustomerCache();
        try {
            customers = await CustomerDAO.getAll();
        } catch (e) {
            console.error('Failed to fetch customers for grid search:', e);
            customers = [];
        }
    }

    let filtered = customers || [];
    if (query) {
        filtered = filtered.filter(c => {
            const name = (c.name || '').toLowerCase();
            const phone = (c.phone || '').toLowerCase();
            const acc = (c.accountNo || '').toLowerCase();
            const addr = (c.address || '').toLowerCase();
            const zone = (c.zone || '').toLowerCase();
            return name.includes(query) || phone.includes(query) || acc.includes(query) || addr.includes(query) || zone.includes(query);
        });
    }

    // Position dropdown relative to input using getBoundingClientRect
    const rect = inputEl.getBoundingClientRect();
    const leftPos = Math.max(10, Math.min(rect.left, window.innerWidth - 440));
    dropdown.style.left = `${leftPos}px`;
    dropdown.style.top = `${rect.bottom + 6}px`;

    if (filtered.length === 0) {
        dropdown.innerHTML = `<div class="p-3 text-center text-xs text-slate-500 font-bold">কোনো কাস্টমার পাওয়া যায়নি</div>`;
        dropdown.classList.remove('hidden');
        return;
    }

    dropdown.innerHTML = filtered.slice(0, 35).map((c, idx) => {
        const dueVal = Number(c.totalDue) || 0;
        const dueBadge = dueVal > 0 
            ? `<span class="text-[10px] bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-md font-black shrink-0">৳${formatAmountWithComma(dueVal)}</span>` 
            : `<span class="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md font-bold shrink-0">০.০০</span>`;
        
        const acc = c.accountNo ? `<span class="text-blue-400 text-[11px] font-mono font-bold">[${c.accountNo}]</span>` : '';
        const phoneStr = c.phone ? `<span class="flex items-center gap-1 text-slate-300"><i class="fa-solid fa-phone text-[9px] text-slate-500"></i>${c.phone}</span>` : '';
        const addrStr = c.address ? `<span class="flex items-center gap-1 text-slate-200 font-bold"><i class="fa-solid fa-location-dot text-[9px] text-red-400 shrink-0"></i>${c.address}</span>` : '';
        const zoneStr = c.zone ? `<span class="flex items-center gap-1 text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20 text-[10px]"><i class="fa-solid fa-map-location-dot text-[8px]"></i>${c.zone}</span>` : '';

        const activeClass = idx === 0 ? 'active-grid-cust !bg-blue-600/30 !border-blue-500/50' : '';

        return `
            <div class="grid-cust-item p-2.5 rounded-xl hover:bg-slate-800/90 cursor-pointer transition-all border border-slate-800/60 hover:border-blue-500/50 flex flex-col gap-1 ${activeClass}" 
                 data-acc="${c.accountNo || ''}" 
                 data-name="${c.name || ''}" 
                 data-phone="${c.phone || ''}" 
                 data-address="${c.address || ''}" 
                 data-zone="${c.zone || ''}"
                 onclick="window.selectGridCustomer(this)">
                <div class="flex items-center justify-between gap-2">
                    <div class="flex items-center gap-1.5 font-bold text-xs text-white truncate">
                        ${acc}
                        <span class="text-white font-black truncate">${c.name}</span>
                    </div>
                    ${dueBadge}
                </div>
                <div class="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] text-slate-400 font-medium pt-0.5">
                    ${phoneStr}
                    ${addrStr}
                    ${zoneStr}
                </div>
            </div>
        `;
    }).join('');

    dropdown.classList.remove('hidden');
}

export function handleGridCustomerKey(event, inputEl, rowIndex) {
    const dropdown = getGlobalDropdown();
    if (!dropdown || dropdown.classList.contains('hidden')) {
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            handleGridCustomerSearch(inputEl, rowIndex);
        }
        return;
    }

    const items = Array.from(dropdown.querySelectorAll('.grid-cust-item'));
    if (items.length === 0) return;

    let activeIdx = items.findIndex(el => el.classList.contains('active-grid-cust'));

    if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (activeIdx >= 0) items[activeIdx].classList.remove('active-grid-cust', '!bg-blue-600/30', '!border-blue-500/50');
        activeIdx = (activeIdx + 1) % items.length;
        items[activeIdx].classList.add('active-grid-cust', '!bg-blue-600/30', '!border-blue-500/50');
        items[activeIdx].scrollIntoView({ block: 'nearest' });
    } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (activeIdx >= 0) items[activeIdx].classList.remove('active-grid-cust', '!bg-blue-600/30', '!border-blue-500/50');
        activeIdx = (activeIdx - 1 + items.length) % items.length;
        items[activeIdx].classList.add('active-grid-cust', '!bg-blue-600/30', '!border-blue-500/50');
        items[activeIdx].scrollIntoView({ block: 'nearest' });
    } else if (event.key === 'Enter' || event.key === 'Tab') {
        event.preventDefault();
        const targetItem = activeIdx >= 0 ? items[activeIdx] : items[0];
        if (targetItem) {
            selectGridCustomer(targetItem);
        }
    } else if (event.key === 'Escape') {
        dropdown.classList.add('hidden');
    }
}

export function selectGridCustomer(itemEl) {
    const dropdown = getGlobalDropdown();
    dropdown.classList.add('hidden');

    const input = activeTargetInput || document.getElementById(`grid-cust-input-${activeTargetRowIndex}`);
    if (!input) return;

    const acc = itemEl.dataset.acc ? `[${itemEl.dataset.acc}] ` : '';
    const name = itemEl.dataset.name || '';
    const phone = itemEl.dataset.phone ? itemEl.dataset.phone : '';
    const address = itemEl.dataset.address ? itemEl.dataset.address : '';
    const zone = itemEl.dataset.zone ? itemEl.dataset.zone : '';

    const detailsArr = [phone, address, zone].filter(Boolean);
    const detailsStr = detailsArr.length > 0 ? ` (${detailsArr.join(' - ')})` : '';

    input.value = `${acc}${name}${detailsStr}`;

    // Move focus to next column (Voucher)
    const tr = input.closest('tr');
    if (tr) {
        const inputs = tr.querySelectorAll('input');
        if (inputs && inputs[2]) {
            inputs[2].focus();
        }
    }
}

export function closeAllGridDropdowns() {
    const dropdown = document.getElementById('grid-global-customer-dropdown');
    if (dropdown) dropdown.classList.add('hidden');
}

if (typeof window !== 'undefined') {
    window.handleGridCustomerSearch = handleGridCustomerSearch;
    window.handleGridCustomerKey = handleGridCustomerKey;
    window.selectGridCustomer = selectGridCustomer;
    window.closeAllGridDropdowns = closeAllGridDropdowns;

    document.addEventListener('click', (e) => {
        const dropdown = document.getElementById('grid-global-customer-dropdown');
        if (dropdown && !dropdown.contains(e.target) && !e.target.classList.contains('grid-cust-input')) {
            dropdown.classList.add('hidden');
        }
    });

    window.addEventListener('scroll', () => {
        const dropdown = document.getElementById('grid-global-customer-dropdown');
        if (dropdown && !dropdown.classList.contains('hidden') && activeTargetInput) {
            const rect = activeTargetInput.getBoundingClientRect();
            dropdown.style.left = `${Math.max(10, Math.min(rect.left, window.innerWidth - 440))}px`;
            dropdown.style.top = `${rect.bottom + 6}px`;
        }
    }, true);
}
