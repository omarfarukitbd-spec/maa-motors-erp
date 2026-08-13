import { getCustomerCache } from '../../customer/customer-state.js';
import { formatAmountWithComma } from '../../utils/formatters.js';

/**
 * Shared Searchable Customer Combobox Component
 * Enterprise pattern for unified customer searching across Invoice, Ledger, Bulk Entry, Statements.
 */

export function renderCustomerComboboxHTML({ 
    inputId = 'cust-combobox-input', 
    selectId = 'cust-combobox-select', 
    dropdownId = 'cust-combobox-dropdown', 
    placeholder = 'কাস্টমার নাম, ফোন বা অ্যাকাউন্ট টাইপ করুন...',
    extraBtnHTML = ''
} = {}) {
    return `
        <div class="relative flex items-center w-full z-40 font-bn">
            <i class="fa-solid fa-magnifying-glass absolute left-3 text-slate-500 text-xs pointer-events-none"></i>
            <input type="text" id="${inputId}" class="w-full bg-slate-950/90 border border-slate-700/70 rounded-xl h-10 pl-9 pr-20 text-xs text-white font-bold outline-none focus:border-blue-500 shadow-inner transition-all" placeholder="${placeholder}">
            <div class="absolute right-1.5 flex items-center gap-1">
                <button type="button" id="${inputId}-clear" class="hidden w-5 h-5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-[10px] flex items-center justify-center cursor-pointer transition-all"><i class="fa-solid fa-xmark"></i></button>
                ${extraBtnHTML}
            </div>
            <select id="${selectId}" class="hidden"></select>
            <div id="${dropdownId}" class="hidden absolute left-0 right-0 top-full mt-1.5 bg-slate-900 border border-slate-700/90 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] z-[999] max-h-64 overflow-y-auto custom-scrollbar p-1.5 flex flex-col gap-1 backdrop-blur-2xl"></div>
        </div>
    `;
}

export function filterCustomerCombobox(query = '', { inputId, selectId, dropdownId, onSelect } = {}) {
    const dropdown = document.getElementById(dropdownId);
    if (!dropdown) return;

    let customers = getCustomerCache() || [];
    const q = (query || '').trim();
    
    let filtered = customers;
    if (q) {
        filtered = customers.filter(c => 
            typeof window.matchCustomerSearch === 'function' ? window.matchCustomerSearch(c, q) : (
                (c.name || '').toLowerCase().includes(q.toLowerCase()) ||
                (c.phone || '').toLowerCase().includes(q.toLowerCase()) ||
                (c.accountNo || '').toLowerCase().includes(q.toLowerCase()) ||
                (c.address || '').toLowerCase().includes(q.toLowerCase())
            )
        );
    }

    if (filtered.length === 0) {
        dropdown.innerHTML = `<div class="p-3 text-center text-xs text-slate-500 font-bold">কোনো কাস্টমার পাওয়া যায়নি</div>`;
        dropdown.classList.remove('hidden');
        return;
    }

    dropdown.innerHTML = filtered.slice(0, 40).map(c => {
        const dueVal = Number(c.totalDue) || 0;
        const dueBadge = dueVal > 0 
            ? `<span class="text-[10px] bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-md font-black">৳${formatAmountWithComma(dueVal)}</span>` 
            : `<span class="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md font-bold">০.০০</span>`;
        
        const acc = c.accountNo ? `<span class="text-blue-400 text-[10px] font-mono font-bold">#${c.accountNo}</span>` : '';

        return `
            <div class="combobox-item p-2 rounded-xl hover:bg-slate-800/80 cursor-pointer transition-all border border-transparent hover:border-slate-700 flex items-center justify-between gap-2" data-id="${c.id}">
                <div class="flex flex-col">
                    <div class="text-xs font-black text-white flex items-center gap-1.5">${c.name} ${acc}</div>
                    <div class="text-[10px] text-slate-400 font-bold mt-0.5"><i class="fa-solid fa-phone text-[8px] mr-1 text-slate-500"></i>${c.phone || '-'} ${c.address ? '• ' + c.address : ''}</div>
                </div>
                <div>${dueBadge}</div>
            </div>
        `;
    }).join('');

    dropdown.classList.remove('hidden');

    // Auto highlight first item for instant Enter selection
    const firstItem = dropdown.querySelector('.combobox-item');
    if (firstItem) {
        firstItem.classList.add('active-combobox-item', '!bg-blue-600/30', '!border-blue-500/50');
    }

    dropdown.querySelectorAll('.combobox-item').forEach(item => {
        item.addEventListener('click', () => {
            const id = item.dataset.id;
            selectCustomerComboboxItem(id, { inputId, selectId, dropdownId, onSelect });
        });
    });

    attachCustomerComboboxKeyboard({ inputId, selectId, dropdownId, onSelect });
}

export function attachCustomerComboboxKeyboard({ inputId, selectId, dropdownId, onSelect, nextFocusId } = {}) {
    const input = document.getElementById(inputId);
    if (!input || input._comboboxKeyBound) return;
    input._comboboxKeyBound = true;

    input.addEventListener('keydown', (e) => {
        const dropdown = document.getElementById(dropdownId);
        if (!dropdown || dropdown.classList.contains('hidden')) {
            if (e.key === 'ArrowDown') {
                filterCustomerCombobox(input.value, { inputId, selectId, dropdownId, onSelect });
            }
            return;
        }

        const items = Array.from(dropdown.querySelectorAll('.combobox-item'));
        if (items.length === 0) return;

        let activeIdx = items.findIndex(el => el.classList.contains('active-combobox-item'));

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (activeIdx >= 0) items[activeIdx].classList.remove('active-combobox-item', '!bg-blue-600/30', '!border-blue-500/50');
            activeIdx = (activeIdx + 1) % items.length;
            items[activeIdx].classList.add('active-combobox-item', '!bg-blue-600/30', '!border-blue-500/50');
            items[activeIdx].scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (activeIdx >= 0) items[activeIdx].classList.remove('active-combobox-item', '!bg-blue-600/30', '!border-blue-500/50');
            activeIdx = (activeIdx - 1 + items.length) % items.length;
            items[activeIdx].classList.add('active-combobox-item', '!bg-blue-600/30', '!border-blue-500/50');
            items[activeIdx].scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const targetItem = activeIdx >= 0 ? items[activeIdx] : items[0];
            if (targetItem && targetItem.dataset.id) {
                selectCustomerComboboxItem(targetItem.dataset.id, { inputId, selectId, dropdownId, onSelect });
                const nextEl = document.getElementById(nextFocusId || 'ledger-date');
                if (nextEl) nextEl.focus();
            }
        } else if (e.key === 'Escape') {
            dropdown.classList.add('hidden');
        }
    });
}

export function selectCustomerComboboxItem(id, { inputId, selectId, dropdownId, onSelect } = {}) {
    const sel = document.getElementById(selectId);
    const input = document.getElementById(inputId);
    const clearBtn = document.getElementById(`${inputId}-clear`);
    const dropdown = document.getElementById(dropdownId);

    if (sel) {
        sel.value = id;
        sel.dispatchEvent(new Event('change', { bubbles: true }));
    }

    if (sel && sel.selectedIndex >= 0) {
        const opt = sel.options[sel.selectedIndex];
        if (input && opt) {
            input.value = `${opt.dataset?.name || opt.text}`;
        }
        if (clearBtn) clearBtn.classList.remove('hidden');
    }

    if (dropdown) dropdown.classList.add('hidden');
    if (typeof onSelect === 'function') onSelect(id);
}

export function clearCustomerCombobox({ inputId, selectId, dropdownId, onSelect } = {}) {
    const sel = document.getElementById(selectId);
    const input = document.getElementById(inputId);
    const clearBtn = document.getElementById(`${inputId}-clear`);
    const dropdown = document.getElementById(dropdownId);

    if (sel) {
        sel.value = '';
        sel.dispatchEvent(new Event('change', { bubbles: true }));
    }
    if (input) input.value = '';
    if (clearBtn) clearBtn.classList.add('hidden');
    if (dropdown) dropdown.classList.add('hidden');
    if (typeof onSelect === 'function') onSelect('');
}
