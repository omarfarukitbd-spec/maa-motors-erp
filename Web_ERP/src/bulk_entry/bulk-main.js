import { CustomerDAO } from '../dao.js';
import { getCustomerCache, initCustomerCache } from '../customer/index.js';
import { addSpreadsheetRow } from './spreadsheet-grid.js';
import { downloadAdminExcelBackup, uploadAdminExcelBackup } from '../excel_sync.js';
import { loadBankOptions, loadCashCollectorOptions } from '../ledger/ledger-bank-cash.js';

/**
 * Main Bulk Entry UI Controller
 */

export function renderBulkEntry(container) {
    const loadData = async () => {
        try {
            await Promise.all([loadBankOptions(), loadCashCollectorOptions()]);
            const bankCells = document.querySelectorAll('[id^="bank-cell-"]');
            bankCells.forEach(cell => {
                const row = cell.closest('tr');
                const typeSelect = row ? row.querySelector('select') : null;
                const bankSelect = cell.querySelector('select');
                if (bankSelect && (!typeSelect || typeSelect.value === 'Bank') && window.cachedBanksHtml) {
                    const curVal = bankSelect.value;
                    bankSelect.innerHTML = window.cachedBanksHtml;
                    if (curVal) bankSelect.value = curVal;
                }
            });
        } catch (e) {
            console.error('Error loading bank/cash options in bulk entry:', e);
        }
    };
    loadData();

    if (window.AppState?.currentUserRole === 'Staff' && window.AppState?.permissions?.viewBulkEntry === false) {
        container.innerHTML = `<div class="m3-card text-center font-bn py-12"><h2 class="text-xl font-black text-red-500">অ্যাক্সেস ডিনাইড!</h2></div>`;
        return;
    }

    const isAdmin = window.AppState?.currentUserRole === 'Admin';
    const adminTabBtn = isAdmin ? `
        <button class="px-6 py-2 text-sm font-semibold rounded-lg transition-all text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20" id="tab-admin-excel" onclick="window.switchBulkTab('admin-excel')">
            <i class="fa-solid fa-file-excel mr-1"></i> স্মার্ট এক্সেল (Admin Only)
        </button>` : '';

    container.innerHTML = `
        <div class="flex flex-col gap-6">
            <div class="px-2">
                <h2 class="text-2xl font-bold flex items-center gap-4 text-white font-bn">
                    <div class="w-1.5 h-8 bg-blue-600 rounded-full shadow-lg"></div>
                    ফাস্ট এন্ট্রি (Bulk Entry)
                </h2>
            </div>
            <div class="flex flex-wrap gap-2 p-1 bg-slate-800/50 border border-slate-700/50 rounded-xl self-start ml-2 font-bn">
                <button class="px-6 py-2 text-sm font-semibold rounded-lg transition-all" id="tab-spreadsheet" onclick="window.switchBulkTab('spreadsheet')">স্প্রেডশিট গ্রিড</button>
                <button data-perm="addBulkExcel" class="px-6 py-2 text-sm font-semibold rounded-lg transition-all" id="tab-excel" onclick="window.switchBulkTab('excel')">এক্সেল আপলোড</button>
                ${adminTabBtn}
            </div>
            <div id="bulk-content-area" class="m3-card"></div>
        </div>
    `;
    loadCustomerDatalist();
    switchBulkTab('spreadsheet');
}

export function switchBulkTab(tab) {
    const area = document.getElementById('bulk-content-area');
    const tabs = {
        spreadsheet: document.getElementById('tab-spreadsheet'),
        excel: document.getElementById('tab-excel'),
        'admin-excel': document.getElementById('tab-admin-excel')
    };

    Object.keys(tabs).forEach(k => {
        if(!tabs[k]) return;
        if(k === tab) {
            tabs[k].className = (k === 'admin-excel') ? 'px-6 py-2 text-sm font-semibold rounded-lg bg-emerald-600 text-white shadow-md' : 'px-6 py-2 text-sm font-semibold rounded-lg bg-blue-600 text-white shadow-md';
        } else {
            tabs[k].className = (k === 'admin-excel') ? 'px-6 py-2 text-sm font-semibold rounded-lg text-emerald-400 border border-emerald-500/30 bg-emerald-500/10' : 'px-6 py-2 text-sm font-semibold rounded-lg text-slate-400 hover:text-white';
        }
    });

    if (tab === 'spreadsheet') {
        area.innerHTML = `
            <div class="flex flex-wrap items-center justify-between gap-2 mb-3 px-2 font-bn">
                <p class="text-[11px] text-slate-500 flex items-center gap-1.5 uppercase font-bold">
                    <i class="fa-solid fa-info-circle text-blue-500"></i> কীবোর্ড দিয়ে দ্রুত টাইপ করুন। শেষ ঘরে 'Enter' বা 'Tab' চাপলে নতুন লাইন তৈরি হবে।
                </p>
                <div class="flex items-center gap-1.5">
                    <span class="text-[10px] text-slate-500 font-bold">শর্টকাট:</span>
                    <button type="button" onclick="window.quickSelectSpreadsheetAccount('Bank', 'OneBank (IFRAT)')" class="text-[10px] font-bold text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 px-2 py-0.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer" title="OneBank (Alt+1)"><span>OneBank</span><kbd class="text-[9px] bg-slate-900 px-1 rounded text-slate-400 font-mono">Alt+1</kbd></button>
                    <button type="button" onclick="window.quickSelectSpreadsheetAccount('Bank', 'IBBL (IFRAT)')" class="text-[10px] font-bold text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 px-2 py-0.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer" title="IBBL (Alt+2)"><span>IBBL</span><kbd class="text-[9px] bg-slate-900 px-1 rounded text-slate-400 font-mono">Alt+2</kbd></button>
                    <button type="button" onclick="window.quickSelectSpreadsheetAccount('Cash', 'শোরুম ক্যাশ')" class="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer" title="শোরুম ক্যাশ (Alt+3)"><span>ক্যাশ</span><kbd class="text-[9px] bg-slate-900 px-1 rounded text-slate-400 font-mono">Alt+3</kbd></button>
                </div>
            </div>
            <div class="m3-table-container">
                <table class="m3-table w-full table-fixed min-w-[960px]">
                    <thead>
                        <tr class="font-bn">
                            <th class="w-[130px]">তারিখ</th>
                            <th class="w-[200px]">কাস্টমারের নাম / আইডি</th>
                            <th class="w-[120px]">ভাউচার</th>
                            <th class="w-[130px]">বিল (Debit)</th>
                            <th class="w-[130px]">জমা (Credit)</th>
                            <th class="w-[110px]">মাধ্যম</th>
                            <th class="w-[140px]">ব্যাংক / নাম</th>
                        </tr>
                    </thead>
                    <tbody id="spreadsheet-body" class="font-bn"></tbody>
                </table>
            </div>
            <div class="mt-4 flex justify-end px-2">
                <button data-perm="addBulkSpreadsheet" class="m3-btn-primary px-10" onclick="window.saveSpreadsheetData()" id="save-spreadsheet-btn">সব সেভ করুন</button>
            </div>
        `;
        addSpreadsheetRow();
    } else if (tab === 'admin-excel') {
        area.innerHTML = `
            <div class="max-w-3xl mx-auto space-y-6 py-6 font-bn">
                <div class="text-center">
                    <i class="fa-solid fa-shield-halved text-5xl text-emerald-500 mb-2"></i>
                    <h3 class="text-xl font-black text-white">স্মার্ট এক্সেল সিঙ্ক (Admin Only)</h3>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="bg-slate-900/80 p-6 rounded-3xl border border-slate-700/60 flex flex-col justify-between space-y-4">
                        <h4 class="text-white font-bold">১. ব্যাকআপ ডাউনলোড</h4>
                        <button class="m3-btn-primary !bg-emerald-600" onclick="window.downloadAdminExcelBackup()">ডাউনলোড করুন</button>
                    </div>
                    <div class="bg-slate-900/80 p-6 rounded-3xl border border-slate-700/60 flex flex-col justify-between space-y-4">
                        <h4 class="text-white font-bold">২. এক্সেল আপলোড</h4>
                        <input type="file" id="bulk-admin-excel-file" class="hidden" onchange="window.uploadAdminExcelBackup(this)">
                        <button class="m3-btn-primary !bg-blue-600" onclick="document.getElementById('bulk-admin-excel-file').click()">আপলোড ও সিঙ্ক</button>
                    </div>
                </div>
            </div>`;
    } else {
        area.innerHTML = `
            <div class="max-w-2xl mx-auto space-y-6 py-10 font-bn text-center">
                <p class="text-slate-300">এক্সেল (.xlsx) বা .csv ফাইল সিলেক্ট করুন।</p>
                <input type="file" id="excel-file" accept=".xlsx, .xls, .csv" class="m3-field py-10 border-dashed border-2">
                <button data-perm="addBulkExcel" class="m3-btn-primary w-full" onclick="window.processExcelUpload()" id="process-excel-btn">আপলোড ও সেভ</button>
            </div>`;
    }
}

export async function loadCustomerDatalist() {
    try {
        let customers = getCustomerCache();
        if (!customers.length) { initCustomerCache(); customers = await CustomerDAO.getAll(); }
        let listEl = document.getElementById('customer-datalist');
        if (!listEl) { listEl = document.createElement('datalist'); listEl.id = 'customer-datalist'; document.body.appendChild(listEl); }
        listEl.innerHTML = customers.map(c => {
            const acc = c.accountNo ? `[${c.accountNo}] ` : '';
            return `<option value="${acc}${c.name}${c.phone ? ' ('+c.phone+')' : ''}">${acc}${c.name}</option>`;
        }).join('');
    } catch(e) { console.error(e); }
}

// Global Bindings
window.switchBulkTab = switchBulkTab;
window.loadCustomerDatalist = loadCustomerDatalist;
