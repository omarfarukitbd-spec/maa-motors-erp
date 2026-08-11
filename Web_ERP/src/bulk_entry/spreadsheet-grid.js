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
            <input type="text" class="grid-input m3-field !bg-slate-900/50 !py-1.5 !px-2 text-xs font-bold text-red-400" placeholder="0" oninput="handleNumberInput(this); window.updateLiveWords(this, 'grid-b-words-${rowIndex}')">
            <div id="grid-b-words-${rowIndex}" class="text-[10px] font-black text-red-400 mt-1 px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/20 truncate hidden italic"></div>
        </td>
        <td class="!px-1 !py-1 border-b border-slate-800/50">
            <input type="text" class="grid-input m3-field !bg-slate-900/50 !py-1.5 !px-2 text-xs font-bold text-emerald-400" placeholder="0" oninput="handleNumberInput(this); window.updateLiveWords(this, 'grid-p-words-${rowIndex}')">
            <div id="grid-p-words-${rowIndex}" class="text-[10px] font-black text-emerald-400 mt-1 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 truncate hidden italic"></div>
        </td>
        <td class="!px-1 !py-1 border-b border-slate-800/50">
            <select class="grid-input m3-field !bg-slate-900 !py-1.5 !px-1 text-xs text-blue-400 font-bold cursor-pointer">
                <option value="Bank" class="!bg-slate-900 !text-white font-bold py-2">Bank</option>
                <option value="Cash" class="!bg-slate-900 !text-white font-bold py-2">Cash</option>
            </select>
        </td>
        <td class="!px-1 !py-1 border-b border-slate-800/50"><input type="text" class="grid-input m3-field !bg-slate-900/50 !py-1.5 !px-2 text-xs" placeholder="ব্যাংকের নাম / নাম" onkeydown="window.handleGridKey(event, this)"></td>
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
