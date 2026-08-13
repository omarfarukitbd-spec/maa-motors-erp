import Swal from 'sweetalert2';
import { parseAmount, handleNumberInput } from '../utils.js';
import { executeBulkSave } from './bulk-save-engine.js';

/**
 * Manual Entry Spreadsheet Grid Logic
 */

export function addSpreadsheetRow() {
    const tbody = document.getElementById('spreadsheet-body');
    if(!tbody) return;
    const tr = document.createElement('tr');

    let workingDate = localStorage.getItem('workingDate');
    if (!workingDate || !/^\d{4}-\d{2}-\d{2}$/.test(workingDate)) {
        workingDate = (window.getTodayLocalDateString ? window.getTodayLocalDateString() : new Date().toISOString().split('T')[0]);
    }

    const rowIndex = tbody.children.length + 1;

    tr.innerHTML = `
        <td class="!px-1 !py-1 border-b border-slate-800/50">
            <input type="text" class="grid-input m3-field !bg-slate-900/50 !py-1.5 !px-2 text-xs datepicker" value="${workingDate}" onchange="if(this.value) localStorage.setItem('workingDate', this.value)">
        </td>
        <td class="!px-1 !py-1 border-b border-slate-800/50"><input type="text" list="customer-datalist" class="grid-input m3-field !bg-slate-900/50 !py-1.5 !px-2 text-xs" placeholder="নাম / অ্যাকাউন্ট নং / ফোন"></td>
        <td class="!px-1 !py-1 border-b border-slate-800/50"><input type="text" class="grid-input m3-field !bg-slate-900/50 !py-1.5 !px-2 text-xs" placeholder="ভাউচার"></td>
        <td class="!px-1 !py-1 border-b border-slate-800/50">
            <input type="text" class="grid-input m3-field !bg-slate-900/50 !py-1.5 !px-2 text-xs font-bold text-red-400" placeholder="0" oninput="window.handleNumberInput(this); window.updateLiveWords(this, 'grid-b-words-${rowIndex}')">
            <div id="grid-b-words-${rowIndex}" class="text-[10px] font-black text-red-400 mt-1 px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/20 truncate hidden italic"></div>
        </td>
        <td class="!px-1 !py-1 border-b border-slate-800/50">
            <input type="text" class="grid-input m3-field !bg-slate-900/50 !py-1.5 !px-2 text-xs font-bold text-emerald-400" placeholder="0" oninput="window.handleNumberInput(this); window.updateLiveWords(this, 'grid-p-words-${rowIndex}')">
            <div id="grid-p-words-${rowIndex}" class="text-[10px] font-black text-emerald-400 mt-1 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 truncate hidden italic"></div>
        </td>
        <td class="!px-1 !py-1 border-b border-slate-800/50">
            <select class="grid-input m3-field !bg-slate-900 !py-1.5 !px-1 text-xs text-blue-400 font-bold cursor-pointer" onchange="window.updateGridBankOptions(this, ${rowIndex})">
                <option value="Bank" class="!bg-slate-900 !text-white font-bold py-2">Bank</option>
                <option value="Cash" class="!bg-slate-900 !text-white font-bold py-2">Cash</option>
                <option value="Less" class="!bg-slate-900 !text-purple-400 font-bold py-2">Less</option>
            </select>
        </td>
        <td class="!px-1 !py-1 border-b border-slate-800/50" id="bank-cell-${rowIndex}">
            <select class="grid-input m3-field !bg-slate-900/50 !py-1.5 !px-2 text-xs font-bold cursor-pointer text-slate-300">
                ${window.cachedBanksHtml || '<option value="" class="!bg-slate-900 !text-slate-400">-- ব্যাংক নির্বাচন করুন --</option>'}
            </select>
        </td>
    `;
    tbody.appendChild(tr);

    if(tbody.children.length > 1) {
        tr.children[1].querySelector('input')?.focus();
    }
}

export function handleGridKey(event, element) {
    if (event.key === 'Enter' || event.key === 'Tab') {
        event.preventDefault();
        const dateInput = element.closest('tr')?.querySelector('input.datepicker')?.value;
        if(dateInput) localStorage.setItem('workingDate', dateInput);
        addSpreadsheetRow();
    }
}

export function updateGridBankOptions(selectEl, rowIndex) {
    const type = selectEl.value;
    const targetCell = document.getElementById(`bank-cell-${rowIndex}`);
    if (!targetCell) return;
    
    if (type === 'Cash') {
        selectEl.classList.replace('text-blue-400', 'text-emerald-400');
        selectEl.classList.replace('text-purple-400', 'text-emerald-400');
        targetCell.innerHTML = `<select class="grid-input m3-field !bg-slate-900/50 !py-1.5 !px-2 text-xs font-bold cursor-pointer text-slate-300" onkeydown="window.handleGridKey(event, this)">
            ${window.cachedCashHtml || '<option value="Cash" class="!bg-slate-900 !text-slate-200">Cash</option>'}
        </select>`;
    } else if (type === 'Less') {
        selectEl.classList.replace('text-blue-400', 'text-purple-400');
        selectEl.classList.replace('text-emerald-400', 'text-purple-400');
        targetCell.innerHTML = `<input type="text" class="grid-input m3-field !bg-slate-900/50 !py-1.5 !px-2 text-xs font-bold text-slate-300" placeholder="যেমন: সম্মানিতে ছাড়..." onkeydown="window.handleGridKey(event, this)">`;
    } else {
        selectEl.classList.replace('text-emerald-400', 'text-blue-400');
        selectEl.classList.replace('text-purple-400', 'text-blue-400');
        targetCell.innerHTML = `<select class="grid-input m3-field !bg-slate-900/50 !py-1.5 !px-2 text-xs font-bold cursor-pointer text-slate-300" onkeydown="window.handleGridKey(event, this)">
            ${window.cachedBanksHtml || '<option value="OneBank (IFRAT)" class="!bg-slate-900 !text-slate-200">OneBank (IFRAT)</option>'}
        </select>`;
    }
}

export function quickSelectSpreadsheetAccount(type, accountName) {
    const tbody = document.getElementById('spreadsheet-body');
    if (!tbody || tbody.children.length === 0) return;

    let targetRow = document.activeElement ? document.activeElement.closest('tr') : null;
    if (!targetRow || !tbody.contains(targetRow)) {
        targetRow = tbody.children[tbody.children.length - 1];
    }
    if (!targetRow) return;

    const rowIndex = Array.from(tbody.children).indexOf(targetRow) + 1;
    const typeSelect = targetRow.querySelector('select');
    if (typeSelect) {
        typeSelect.value = type;
        updateGridBankOptions(typeSelect, rowIndex);
        const bankSelect = document.getElementById(`bank-cell-${rowIndex}`)?.querySelector('select');
        if (bankSelect) bankSelect.value = accountName;
    }
    const inputs = targetRow.querySelectorAll('input');
    if (inputs && inputs[4]) inputs[4].focus(); // 5th input is Paid/Credit
}
window.quickSelectSpreadsheetAccount = quickSelectSpreadsheetAccount;
window.updateGridBankOptions = updateGridBankOptions;

export async function saveSpreadsheetData() {
    const tbody = document.getElementById('spreadsheet-body');
    const rows = tbody.querySelectorAll('tr');
    const dataToSave = [];

    rows.forEach(row => {
        const inputs = row.querySelectorAll('input, select');
        const date = inputs[0].value;
        let nameRaw = inputs[1].value.trim();
        let name = nameRaw;
        let phone = '';

        if (nameRaw.startsWith('[')) {
            const matchName = nameRaw.match(/^\[.*?\]\s*([^(]+)/);
            if (matchName) name = matchName[1].trim();
            const matchPhone = nameRaw.match(/\(([^)]+)\)/);
            if (matchPhone) phone = matchPhone[1].trim();
        }

        const voucher = inputs[2].value.trim();
        const bill = parseAmount(inputs[3].value);
        const paid = parseAmount(inputs[4].value);
        const receivedType = inputs[5].value || 'Bank';
        const receivedFrom = inputs[6].value.trim();

        if (name && (bill > 0 || paid > 0)) {
            dataToSave.push({ date, name, phone, voucher, bill, paid, receivedType, receivedFrom });
        }
    });

    if (dataToSave.length === 0) {
        Swal.fire('খালি ফর্ম', 'সেভ করার মতো কোনো ডাটা পাওয়া যায়নি।', 'warning');
        return;
    }

    const btn = document.getElementById('save-spreadsheet-btn');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i>সেভ হচ্ছে...';
    }

    try {
        await executeBulkSave(dataToSave);
    } catch(err) {
        console.error("saveSpreadsheetData error:", err);
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="fa-solid fa-cloud-arrow-up mr-2"></i> সব সেভ করুন';
        }
    }
}
