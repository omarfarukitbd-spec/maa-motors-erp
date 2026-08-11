// --- Customer Module ---
import { db, firebase } from './firebase-config.js';
import { CustomerDAO, ZoneDAO, SettingsDAO, TransactionDAO } from './dao.js';
import { formatAmountWithComma, sendSMS, promptSecurityPin, parseAmount, toDBDate, formatAppDate, getTodayLocalDateString, numberToBanglaWords } from './utils.js';
import Swal from 'sweetalert2';
import { auditLog } from './audit.js';

// Pagination State for Customers
let lastVisibleCust = null;
let pageStackCust = [];
let currentCustPage = 1;
const custPageSize = 20;
let isSearchingCust = false;

export function renderCustomers(container) {
    if(window.AppState.currentUserRole === 'Staff' && window.AppState.permissions.viewCustomers === false) {
        container.innerHTML = `<div class="m3-card text-center"><h2 class="text-xl font-bold text-red-500 font-bn">অ্যাক্সেস ডিনাইড! আপনার কাস্টমার লিস্ট দেখার অনুমতি নেই।</h2></div>`;
        return;
    }

    const canManageCust = window.AppState?.currentUserRole === 'Admin' || window.AppState?.permissions?.manageCustomers !== false;

    container.innerHTML = `
        <div class="flex flex-col gap-8">
            <div class="flex justify-between items-center px-2">
                <h2 class="text-3xl font-black flex items-center gap-4 tracking-tight text-white font-bn">
                    <div class="w-2 h-10 bg-blue-600 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.5)]"></div>
                    কাস্টমার ম্যানেজমেন্ট
                    <button class="w-8 h-8 rounded-full hover:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-blue-400 transition-all active:rotate-180" onclick="window.loadCustomers()" title="রিফ্রেশ">
                        <i class="fa-solid fa-rotate text-sm"></i>
                    </button>
                </h2>
                ${canManageCust ? `
                <button class="m3-btn-primary px-6 py-3 shadow-blue-600/20 hover:scale-105 active:scale-95 transition-all font-bn" onclick="toggleAddCustomerForm()">
                    <i class="fa-solid fa-user-plus mr-2"></i> নতুন কাস্টমার
                </button>` : ''}
            </div>

            <div id="add-customer-form" class="hidden m3-card bg-slate-800/40 border-slate-700/50">
                <div class="flex items-center gap-3 mb-6">
                    <div class="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-500 flex items-center justify-center">
                        <i class="fa-solid fa-address-card"></i>
                    </div>
                    <h3 class="text-xl font-black text-white font-bn">নতুন কাস্টমার যুক্ত করুন</h3>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 font-bn">
                    <div class="space-y-1">
                        <label class="text-[10px] font-black text-blue-400 uppercase tracking-widest ml-1">হিসাব খোলার তারিখ</label>
                        <input type="text" id="cust-date" class="m3-field datepicker cursor-pointer">
                    </div>
                    <div class="space-y-1">
                        <label class="text-[10px] font-black text-blue-500 uppercase tracking-widest ml-1">নাম</label>
                        <input type="text" id="cust-name" placeholder="পুরো নাম লিখুন" class="m3-field">
                    </div>
                    <div class="space-y-1">
                        <label class="text-[10px] font-black text-blue-500 uppercase tracking-widest ml-1">মোবাইল</label>
                        <input type="text" id="cust-phone" placeholder="০১৭xxxxxxxx" class="m3-field">
                    </div>
                    <div class="space-y-1">
                        <label class="text-[10px] font-black text-blue-500 uppercase tracking-widest ml-1">ঠিকানা</label>
                        <input type="text" id="cust-address" placeholder="ঠিকানা লিখুন" class="m3-field">
                    </div>
                    <div class="space-y-1">
                        <label class="text-[10px] font-black text-purple-400 uppercase tracking-widest ml-1">জোন / অঞ্চল</label>
                        <div class="flex gap-2">
                            <select id="cust-zone-select" class="m3-field flex-grow bg-slate-900 focus:bg-slate-800 cursor-pointer font-bold" onchange="window.handleZoneChange()">
                                <option value="">-- জোন সিলেক্ট --</option>
                            </select>
                            <button title="নতুন জোন যোগ করুন" class="w-[42px] h-[42px] bg-purple-600/20 text-purple-400 border border-purple-500/30 rounded-xl hover:bg-purple-600 hover:text-white transition-all flex items-center justify-center flex-shrink-0" onclick="window.quickAddZone()"><i class="fa-solid fa-plus"></i></button>
                        </div>
                    </div>
                    <div class="space-y-1">
                        <label class="text-[10px] font-black text-blue-400 uppercase tracking-widest ml-1">অ্যাকাউন্ট নম্বর (অটো)</label>
                        <div class="flex gap-2">
                            <input type="text" id="cust-zone-code-display" readonly placeholder="কোড" class="w-16 bg-slate-900/50 border border-slate-700/50 rounded-lg px-2 text-center text-xs font-black text-blue-400">
                            <input type="text" id="cust-generated-acc" readonly placeholder="অ্যাকাউন্ট নং" class="m3-field flex-grow bg-slate-900/50 border-blue-500/20 text-blue-500 font-black">
                        </div>
                    </div>
                    <div class="space-y-1">
                        <label class="text-[10px] font-black text-emerald-500 uppercase tracking-widest ml-1">অবশিষ্ট ব্যালেন্স</label>
                        <input type="text" id="cust-initial-balance" placeholder="০.০০" oninput="handleNumberInput(this); updateLiveWords(this, 'cust-initial-words');" class="m3-field border-emerald-500/30 focus:border-emerald-500 text-emerald-400 font-bold">
                        <div id="cust-initial-words" class="text-[11px] md:text-xs font-black text-emerald-400 mt-1.5 px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 hidden italic inline-block"></div>
                    </div>
                </div>
                <div class="flex justify-end gap-4 mt-8 font-bn">
                    <button class="m3-btn-tonal px-8" onclick="toggleAddCustomerForm()">বাতিল</button>
                    <button class="m3-btn-primary px-12" id="save-cust-btn" onclick="saveNewCustomer()">সেভ করুন</button>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-center px-2">
                <div class="relative md:col-span-2">
                    <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm"></i>
                    <input type="text" id="cust-search-input" onkeyup="window.filterCustomerList()" placeholder="কাস্টমার খুঁজুন (নাম, ফোন, অ্যাকাউন্ট বা ঠিকানা)..." class="w-full bg-slate-900/80 border border-slate-700/60 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:border-blue-500 outline-none shadow-inner font-bn">
                </div>
                <div>
                    <select id="cust-filter-zone" onchange="window.filterCustomerList()" class="w-full bg-slate-900/80 border border-slate-700/60 rounded-2xl py-3 px-4 text-sm text-blue-400 font-bold outline-none cursor-pointer font-bn shadow-inner">
                        <option value="">-- সকল জোন (All Zones) --</option>
                    </select>
                </div>
            </div>

            <div class="flex items-center justify-between px-2 text-xs font-bold text-slate-400 font-bn">
                <div class="flex items-center gap-4">
                    <span>মোট কাস্টমার: <strong id="cust-count-badge" class="text-blue-400">০</strong> জন</span>
                    <span>•</span>
                    <span>মোট বকেয়া: <strong id="cust-total-due-badge" class="text-red-400">৳ ০</strong></span>
                </div>
                <button class="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1.5" onclick="window.printFilteredCustomerList()">
                    <i class="fa-solid fa-print"></i> এই লিস্ট প্রিন্ট করুন
                </button>
            </div>

            <div class="m3-table-container">
                <table class="m3-table min-w-[800px]">
                    <thead>
                        <tr class="font-bn">
                            <th class="w-[120px] text-slate-400">খোলার তারিখ</th>
                            <th class="w-1/4 text-slate-400">কাস্টমারের নাম</th>
                            <th class="w-1/4 text-slate-400">ঠিকানা</th>
                            <th class="text-slate-400">মোবাইল নম্বর</th>
                            <th class="text-right text-slate-400">মোট বকেয়া</th>
                            <th class="text-center text-slate-400">অ্যাকশন</th>
                        </tr>
                    </thead>
                    <tbody id="customer-list" class="font-bn">
                        <tr><td colspan="5" class="text-center py-20 font-bold text-slate-500 italic">ডাটা লোড হচ্ছে...</td></tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination Controls -->
            <div id="cust-pagination" class="flex items-center justify-center gap-4 py-4 font-bn">
                <button id="cust-prev-page" class="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl border border-slate-700 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-all" onclick="changeCustomerPage('prev')">
                    <i class="fa-solid fa-chevron-left mr-2"></i> পূর্ববর্তী
                </button>
                <div class="text-white font-bold bg-blue-600/10 border border-blue-500/30 px-4 py-2 rounded-xl">
                    পৃষ্ঠা: <span id="cust-current-page-display">1</span>
                </div>
                <button id="cust-next-page" class="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl border border-slate-700 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-all" onclick="changeCustomerPage('next')">
                    পরবর্তী <i class="fa-solid fa-chevron-right ml-2"></i>
                </button>
            </div>
        </div>`;
    loadCustomers();
    if (document.getElementById('cust-date')) {
        document.getElementById('cust-date').value = (window.getTodayLocalDateString ? window.getTodayLocalDateString() : new Date().toISOString().split('T')[0]);
    }
}

let cachedCustomers = [];
let cachedZones = [];
let customerCacheListener = null;

export function getCustomerCache() {
    return cachedCustomers;
}
window.getCustomerCache = getCustomerCache;

export function initCustomerCache() {
    if (customerCacheListener) return;
    // We keep a lightweight listener for the stats but won't use it for the main table render if paginated
    customerCacheListener = CustomerDAO.listenToAll(customers => {
        cachedCustomers = customers;
        let totalMarketDue = 0;
        customers.forEach(data => {
            totalMarketDue += (Number(data.totalDue) || 0);
        });
        window.customerCache = cachedCustomers;

        const countBadge = document.getElementById('cust-count-badge');
        const dueBadge = document.getElementById('cust-total-due-badge');
        if (countBadge) countBadge.innerText = cachedCustomers.length;
        if (dueBadge) dueBadge.innerText = "৳ " + formatAmountWithComma(totalMarketDue);

        // If we are currently searching, we should update the search results
        if (isSearchingCust && document.getElementById('customer-list')) {
            filterCustomerList();
        }
    });
}
window.initCustomerCache = initCustomerCache;

window.quickAddZone = async function() {
    const { value: formValues } = await Swal.fire({
        title: 'নতুন জোন (অঞ্চল) যোগ করুন',
        html: `
            <div class="space-y-4 text-left p-1 font-bn">
                <div>
                    <label class="block text-[11px] font-black text-blue-400 uppercase tracking-widest mb-1 ml-1">জোনের নাম *</label>
                    <input id="sw-zn" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 text-sm transition-all" placeholder="যেমন: ঢাকা, চট্টগ্রাম">
                </div>
                <div>
                    <label class="block text-[11px] font-black text-blue-400 uppercase tracking-widest mb-1 ml-1">জোন কোড (ম্যানুয়াল) *</label>
                    <input id="sw-zc" type="number" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 text-sm transition-all" placeholder="যেমন: 1 বা 11">
                </div>
            </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'সেভ করুন',
        cancelButtonText: 'বাতিল',
        customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' },
        preConfirm: () => {
            const name = document.getElementById('sw-zn').value.trim();
            const code = document.getElementById('sw-zc').value.trim();
            if (!name || !code) {
                Swal.showValidationMessage('নাম ও কোড উভয়ই আবশ্যক!');
                return false;
            }
            return { name, code };
        }
    });

    if (formValues) {
        try {
            Swal.fire({ title: 'চেক করা হচ্ছে...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

            // Check if code is already taken
            const existing = await ZoneDAO.getByCode(formValues.code);
            if (existing) {
                return Swal.fire('Error!', `জোন কোড "${formValues.code}" ইতিমধ্যে "${existing.name}" জোনের জন্য ব্যবহার করা হয়েছে!`, 'error');
            }

            await ZoneDAO.add({ name: formValues.name, code: formValues.code });
            Swal.fire('সফল!', `জোন "${formValues.name}" সফলভাবে তৈরি হয়েছে।`, 'success');
            loadAllZones();
        } catch (e) {
            console.error(e);
            Swal.fire('Error', 'জোন সেভ করা যায়নি: ' + (e.message || e), 'error');
        }
    }
};

async function loadAllZones() {
    try {
        const zones = await ZoneDAO.getAllZones();
        let options = '<option value="">-- জোন সিলেক্ট --</option>';
        let filterOptions = '<option value="">-- সকল জোন (All Zones) --</option>';

        cachedZones = zones; // Store full objects (name and code)
        zones.forEach(z => {
            options += `<option value="${z.name}" data-code="${z.code}">${z.name} (Code: ${z.code})</option>`;
            filterOptions += `<option value="${z.name}">${z.name}</option>`;
        });

        const mainSel = document.getElementById('cust-zone-select');
        const filterSel = document.getElementById('cust-filter-zone');
        if (mainSel) mainSel.innerHTML = options;
        if (filterSel) filterSel.innerHTML = filterOptions;
    } catch (e) { console.error("Error loading zones:", e); }
}

window.printFilteredCustomerList = async () => {
    const query = document.getElementById('cust-search-input')?.value.trim();
    const zone = document.getElementById('cust-filter-zone')?.value;

    const filtered = cachedCustomers.filter(c => {
        const matchesSearch = !query || c.name.toLowerCase().includes(query.toLowerCase()) || (c.accountNo && c.accountNo.includes(query));
        const matchesZone = !zone || c.zone === zone;
        return matchesSearch && matchesZone;
    });

    if (filtered.length === 0) return Swal.fire('Error', 'লিস্টে কোনো ডাটা নেই!', 'warning');

    // Get Shop Info
    const settings = await SettingsDAO.getAppSettings();

    let container = document.getElementById('print-receipt-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'print-receipt-container';
        container.classList.add('hidden');
        document.body.appendChild(container);
    }

    const title = zone ? `${zone} জোনের কাস্টমার লিস্ট` : 'সকল কাস্টমার লিস্ট';
    let totalDue = 0;
    filtered.forEach(c => totalDue += (Number(c.totalDue) || 0));

    container.className = 'print-a4';
    container.innerHTML = `
        <div class="a4-wrapper font-bn">
            <div class="a4-header">
                <div class="shop-info">
                    <h1>${settings.shopName || 'MAA MOTORS'}</h1>
                    <p>${settings.shopAddress || ''}</p>
                    <p>মোবাইল: ${settings.shopPhone || ''}</p>
                </div>
                <div class="invoice-title">
                    <h2>CUSTOMER LIST / তালিকা</h2>
                    <p style="font-size: 13px; font-weight: 700; color: #475569; margin-top: 4px;">ধরণ: <strong>${title}</strong></p>
                </div>
            </div>

            <table class="print-items-table">
                <thead>
                    <tr>
                        <th style="width:10%">A/C NO</th>
                        <th style="width:30%; text-align:left;">কাস্টমারের নাম</th>
                        <th style="width:20%">মোবাইল</th>
                        <th style="width:20%">জোন</th>
                        <th style="width:20%; text-align:right;">মোট বকেয়া</th>
                    </tr>
                </thead>
                <tbody>
                    ${filtered.map(c => `
                        <tr>
                            <td style="text-align:center;">${c.accountNo || '-'}</td>
                            <td style="text-align:left;">${c.name}</td>
                            <td style="text-align:center;">${c.phone || '-'}</td>
                            <td style="text-align:center;">${c.zone || '-'}</td>
                            <td style="text-align:right; font-weight:900; color:${c.totalDue > 0 ? '#dc2626' : '#059669'};">৳ ${formatAmountWithComma(c.totalDue)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <div class="a4-totals-container" style="justify-content: flex-end;">
                <div class="a4-totals" style="width: 300px;">
                    <p><span>মোট কাস্টমার:</span> <span>${filtered.length} জন</span></p>
                    <div class="totals-divider"></div>
                    <p class="net-total" style="color:#dc2626;"><span>মার্কেটে মোট বকেয়া:</span> <span>৳ ${formatAmountWithComma(totalDue)}</span></p>
                </div>
            </div>

            <div class="a4-print-footer">
                <div class="page-number-container"></div>
            </div>
        </div>
    `;

    container.classList.remove('hidden');
    window.print();
    container.classList.add('hidden');
};

export async function loadCustomers() {
    initCustomerCache();
    loadAllZones();

    // Reset pagination
    lastVisibleCust = null;
    pageStackCust = [];
    currentCustPage = 1;
    isSearchingCust = false;

    // Initial Stats from cache
    let totalMarketDue = 0;
    cachedCustomers.forEach(c => totalMarketDue += (Number(c.totalDue) || 0));

    const countBadge = document.getElementById('cust-count-badge');
    const dueBadge = document.getElementById('cust-total-due-badge');
    if (countBadge) countBadge.innerText = cachedCustomers.length;
    if (dueBadge) dueBadge.innerText = "৳ " + formatAmountWithComma(totalMarketDue);

    loadCustomerPage();
}

async function loadCustomerPage(direction = 'next') {
    const tbody = document.getElementById('customer-list');
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="6" class="text-center py-20"><i class="fa-solid fa-spinner fa-spin mr-2"></i>লোডিং...</td></tr>';

    try {
        const cursor = (direction === 'next') ? lastVisibleCust : (pageStackCust.length > 1 ? pageStackCust[pageStackCust.length - 2] : null);

        const results = await CustomerDAO.getByPage(custPageSize, cursor, 'name', 'asc');

        lastVisibleCust = results.lastDoc;
        if (direction === 'next') {
            if (cursor) pageStackCust.push(cursor);
        } else {
            pageStackCust.pop();
        }

        document.getElementById('cust-current-page-display').innerText = currentCustPage;
        document.getElementById('cust-prev-page').disabled = currentCustPage === 1;
        document.getElementById('cust-next-page').disabled = results.count < custPageSize;

        renderCustomerRows(results.data);
    } catch (err) {
        console.error("Load customer page error:", err);
        tbody.innerHTML = '<tr><td colspan="6" class="text-center py-20 text-red-400">ডাটা লোড করতে সমস্যা হয়েছে</td></tr>';
    }
}

window.changeCustomerPage = (dir) => {
    if (dir === 'next') currentCustPage++;
    else currentCustPage--;
    loadCustomerPage(dir);
};

function renderCustomerRows(customers) {
    const tbody = document.getElementById('customer-list');
    if(!tbody) return;

    const isAdmin = window.AppState?.currentUserRole === 'Admin';

    let html = '';
    customers.forEach(d => {
        let openingDate = d.openingDate || '';
        if (!openingDate && d.createdAt) {
            try {
                openingDate = d.createdAt.toDate().toISOString().split('T')[0];
            } catch(e) {
                openingDate = getTodayLocalDateString();
            }
        }

        const due = d.totalDue || 0;
        const dueColorClass = due > 0 ? 'text-red-500' : 'text-emerald-500';
        const statusLabel = due > 0 ? 'বকেয়া' : (due < 0 ? 'অ্যাডভান্স' : 'পরিশোধিত');
        const statusBadgeClass = due > 0 ? 'bg-red-500/10 text-red-400' : (due < 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-700/50 text-slate-400');
        const absDue = Math.abs(due);
        const accNo = d.accountNo ? `<span class="text-[10px] font-black text-blue-400/80 bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 rounded mr-1.5">${d.accountNo}</span>` : '';

        // Ultra-Safe Data Strings for onclick
        const sId = String(d.id || '');
        const sName = String(d.name || '').replace(/'/g, "\\'").replace(/"/g, "&quot;");
        const sPhone = String(d.phone || '');
        const sAddress = String(d.address || '').replace(/'/g, "\\'").replace(/"/g, "&quot;");
        const sZone = String(d.zone || '').replace(/'/g, "\\'").replace(/"/g, "&quot;");
        const sAccNo = String(d.accountNo || '');

        html += `
            <tr class="hover:bg-white/[0.02] transition-all group border-b border-slate-800/40">
                <td class="text-slate-400 font-bold text-[11px] whitespace-nowrap !py-3 px-4">
                    ${formatAppDate(openingDate)}
                </td>
                <td class="!py-3">
                    <div class="flex items-center gap-2.5">
                        <div class="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-blue-500 font-black text-xs border border-slate-700 uppercase shrink-0">${(d.name || 'C').charAt(0)}</div>
                        <div class="truncate">
                            <div class="font-bold text-white text-sm truncate">${accNo}${d.name}</div>
                            ${d.zone ? `<div class="text-[9px] font-black text-purple-400/80 uppercase tracking-widest"><i class="fa-solid fa-location-crosshairs mr-0.5"></i> ${d.zone}</div>` : ''}
                        </div>
                    </div>
                </td>
                <td class="font-medium text-slate-400 text-xs !py-3 truncate max-w-[150px]">${d.address || '-'}</td>
                <td class="font-bold text-slate-400 text-xs !py-3 whitespace-nowrap">${d.phone || '-'}</td>
                <td class="text-right !py-3">
                    <div class="${dueColorClass} font-black text-base">৳${formatAmountWithComma(absDue)}</div>
                    <div class="inline-block text-[9px] px-1.5 py-0.5 rounded ${statusBadgeClass} font-black uppercase tracking-tighter mt-0.5">${statusLabel}</div>
                </td>
                <td class="text-center !py-3">
                    <div class="flex items-center justify-center gap-1.5">
                        <button class="w-9 h-9 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-500 hover:bg-blue-600 hover:text-white transition-all duration-200 flex items-center justify-center shadow-sm" onclick="window.openCustomerLedger('${sId}')" title="খতিয়ান">
                            <i class="fa-solid fa-wallet text-sm"></i>
                        </button>
                        <button class="w-9 h-9 rounded-full bg-slate-700/40 border border-slate-600/30 text-slate-300 hover:bg-slate-600 hover:text-white transition-all duration-200 flex items-center justify-center shadow-sm" onclick="window.openCustomerStatement('${sId}', '${sName}', '${sAccNo}', '${sPhone}', '${sAddress}')" title="স্টেটমেন্ট">
                            <i class="fa-solid fa-receipt text-sm"></i>
                        </button>
                        ${(due > 0 && d.phone) ? `
                        <button class="w-9 h-9 rounded-full bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all duration-200 flex items-center justify-center shadow-sm" onclick="window.sendReminderSMS('${sPhone}', ${due}, '${sName}')" title="রিমাইন্ডার">
                            <i class="fa-solid fa-bell text-sm"></i>
                        </button>` : ''}
                        ${isAdmin ? `
                        <button class="w-9 h-9 rounded-full bg-amber-600/10 border border-amber-500/20 text-amber-500 hover:bg-amber-600 hover:text-white transition-all duration-200 flex items-center justify-center shadow-sm" onclick="window.editCustomer('${sId}', '${sName}', '${sPhone}', '${sAddress}', '${sZone}')" title="এডিট">
                            <i class="fa-solid fa-user-pen text-sm"></i>
                        </button>
                        <button class="w-9 h-9 rounded-full bg-red-600/10 border border-red-500/20 text-red-500 hover:bg-red-600 hover:text-white transition-all duration-200 flex items-center justify-center shadow-sm" onclick="window.deleteCustomer('${sId}', '${sName}')" title="ডিলেট">
                            <i class="fa-solid fa-trash-can text-sm"></i>
                        </button>
                        ` : ''}
                    </div>
                </td>
            </tr>`;
    });
    tbody.innerHTML = html || '<tr><td colspan="6" class="text-center py-12 text-slate-600 italic">কোনো কাস্টমার পাওয়া যায়নি</td></tr>';
}

window.filterCustomerList = function() {
    const query = document.getElementById('cust-search-input')?.value.trim().toLowerCase() || '';
    const zoneFilter = document.getElementById('cust-filter-zone')?.value || '';
    const paginationEl = document.getElementById('cust-pagination');

    if (!query && !zoneFilter) {
        isSearchingCust = false;
        if (paginationEl) paginationEl.classList.remove('hidden');
        loadCustomerPage(); // Back to paginated view
        return;
    }

    isSearchingCust = true;
    if (paginationEl) paginationEl.classList.add('hidden');

    const filtered = cachedCustomers.filter(c => {
        const matchesSearch = !query ||
            (c.name && c.name.toLowerCase().includes(query)) ||
            (c.phone && c.phone.toLowerCase().includes(query)) ||
            (c.address && c.address.toLowerCase().includes(query)) ||
            (c.accountNo && c.accountNo.toLowerCase().includes(query));

        const matchesZone = !zoneFilter || c.zone === zoneFilter;

        return matchesSearch && matchesZone;
    });

    renderCustomerRows(filtered);
    updateStats(filtered);
};

function updateStats(list) {
    let totalDue = 0;
    list.forEach(c => totalDue += (Number(c.totalDue) || 0));
    const countBadge = document.getElementById('cust-count-badge');
    const dueBadge = document.getElementById('cust-total-due-badge');
    if (countBadge) countBadge.innerText = list.length;
    if (dueBadge) dueBadge.innerText = "৳ " + formatAmountWithComma(totalDue);
}

async function sendReminderSMS(phone, dueAmt, name) {
    if (window.AppState?.currentUserRole === 'Staff' && window.AppState?.permissions?.sendSMS === false) {
        return Swal.fire({
            title: 'অ্যাক্সেস ডিনাইড!',
            text: 'আপনার কাস্টমারদের SMS পাঠানোর অনুমতি নেই।',
            icon: 'error',
            customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' }
        });
    }

    if (!phone || phone === '-' || phone.trim() === '') {
        return Swal.fire({
            title: 'মোবাইল নম্বর মিসিং!',
            text: `কাস্টমার "${name}"-এর কোনো মোবাইল নম্বর যুক্ত করা নেই। কাস্টমার এডিট করে নম্বর যোগ করুন।`,
            icon: 'warning',
            customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' }
        });
    }

    const isPinValid = await promptSecurityPin("বকেয়া রিমাইন্ডার SMS পাঠানো");
    if (!isPinValid) return;

    const confirm = await Swal.fire({
        title: 'রিমাইন্ডার SMS',
        text: `আপনি কি ${name} (${phone})-কে বকেয়া ৳${formatAmountWithComma(dueAmt)} এর জন্য SMS পাঠাতে চান?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'হ্যাঁ, পাঠান',
        cancelButtonText: 'না',
        customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' }
    });

    if(confirm.isConfirmed) {
        try {
            const settings = await SettingsDAO.getAppSettings();
            let msg = `Gentle Reminder: Your total due is Tk ${formatAmountWithComma(dueAmt)}. Kindly clear the payment at your earliest convenience. Thank you! - Maa Motors`;

            if(Object.keys(settings).length > 0) {
                if(settings.smsTemplateReminder) {
                    msg = settings.smsTemplateReminder
                        .replace('[Due]', formatAmountWithComma(dueAmt))
                        .replace('[Shop]', settings.shopName || 'Shop');
                }
            }

            const success = await sendSMS(phone, msg, false);
            if (success) {
                Swal.fire({
                    title: 'সফল! ✅',
                    text: `${name}-কে রিমাইন্ডার SMS সফলভাবে পাঠানো হয়েছে।`,
                    icon: 'success',
                    customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' }
                });
            }
        } catch(e) {
            console.error(e);
            Swal.fire('ব্যর্থ!', 'ডাটাবেস এরর।', 'error');
        }
    }
}

export async function loadCustomersForDropdown() {
    const customers = cachedCustomers.length > 0 ? cachedCustomers : await CustomerDAO.getAll('name', 'asc');
    let html = '<option value="">-- সিলেক্ট কাস্টমার --</option>';
    customers.forEach(d => {
        html += `<option value="${d.id}" data-due="${d.totalDue || 0}">${d.name} (${d.phone || '-'})</option>`;
    });
    const ls = document.getElementById('ledger-customer-select');
    if(ls) ls.innerHTML = html;
}

window.handleZoneChange = async function() {
    const sel = document.getElementById('cust-zone-select');
    const codeDisplay = document.getElementById('cust-zone-code-display');
    const accDisplay = document.getElementById('cust-generated-acc');

    if (!sel || !codeDisplay || !accDisplay) return;

    if (sel.selectedIndex > 0) {
        const zoneName = sel.value;
        const zoneCode = sel.options[sel.selectedIndex].dataset.code;
        codeDisplay.value = zoneCode;

        try {
            accDisplay.value = "লোডিং...";
            const nextSerial = await SettingsDAO.peekNextAccountNo(zoneName);
            accDisplay.value = zoneCode + nextSerial;
        } catch (e) {
            console.error(e);
            accDisplay.value = "Error";
        }
    } else {
        codeDisplay.value = "";
        accDisplay.value = "";
    }
};

async function saveNewCustomer() {
    const d = toDBDate(document.getElementById('cust-date').value),
          n = document.getElementById('cust-name').value.trim(),
          p = document.getElementById('cust-phone').value.trim(),
          a = document.getElementById('cust-address').value.trim(),
          z = document.getElementById('cust-zone-select').value,
          balInput = document.getElementById('cust-initial-balance').value.trim();

    if(!n || !p || !z) return Swal.fire('এরর', 'নাম, মোবাইল নম্বর ও জোন আবশ্যক!', 'error');

    let initialBalance = parseAmount(balInput);

    // Smart Warning System if balance is empty
    if (balInput === '') {
        const confirm = await Swal.fire({
            title: 'বকেয়া ফিল্ড খালি!',
            text: 'আপনি কোনো অবশিষ্ট ব্যালেন্স দেননি। এটি কি "০" টাকা (পরিশোধিত) হিসেবে সেভ করবেন?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'হ্যাঁ, ০ হিসেবে সেভ করুন',
            cancelButtonText: 'না, ব্যালেন্স দিব',
            customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' }
        });
        if (!confirm.isConfirmed) return;
        initialBalance = 0;
    }

    const btn = document.getElementById('save-cust-btn');
    if(btn) { btn.disabled = true; btn.innerText = "সেভ হচ্ছে..."; }

    try {
        const zoneObj = cachedZones.find(cz => cz.name === z);
        const zoneCode = zoneObj ? zoneObj.code : "";
        const serial = await SettingsDAO.getNextAccountNo(z);
        const accountNo = zoneCode + serial;

        const batch = db.batch();
        const custRef = CustomerDAO.getRef();
        const customerId = custRef.id;
        const txnRef = TransactionDAO.getRef();

        batch.set(custRef, {
            name: n, phone: p, address: a, zone: z || '',
            accountNo: accountNo,
            openingDate: d,
            initialDue: initialBalance,
            totalDue: initialBalance,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        // Auto-create Opening Balance entry in Ledger
        batch.set(txnRef, {
            customerId: customerId,
            customerName: n,
            date: d,
            voucherNo: 'OPENING',
            bill: initialBalance > 0 ? initialBalance : 0,
            paid: initialBalance < 0 ? Math.abs(initialBalance) : 0,
            prevDue: 0,
            currentDue: initialBalance,
            notes: 'প্রারম্ভিক জের (Opening Balance)',
            createdBy: window.AppState?.currentUserEmail || 'System',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        await batch.commit();

        // Audit Log (Fire and forget, won't block UI)
        auditLog('CREATE', 'Customers', customerId, n, { phone: p, zone: z, initialBalance });

        Swal.fire({
            title: 'সফল! ✅',
            text: `কাস্টমার "${n}" যোগ করা হয়েছে। জোন: ${z || 'N/A'}`,
            icon: 'success',
            customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' }
        });

        document.getElementById('cust-initial-balance').value = '';
        toggleAddCustomerForm();
        loadCustomers();
    } catch(e) {
        console.error(e);
        Swal.fire('Error', 'যোগ করা যায়নি: ' + (e.message || e), 'error');
    } finally {
        if(btn) { btn.disabled = false; btn.innerText = "সেভ করুন"; }
    }
}

function toggleAddCustomerForm() { document.getElementById('add-customer-form').classList.toggle('hidden'); }

async function editCustomer(id, name, phone, address, currentZone) {
    if (window.AppState.currentUserRole !== 'Admin') {
        return Swal.fire('অ্যাক্সেস ডিনাইড!', 'শুধুমাত্র অ্যাডমিন কাস্টমার তথ্য এডিট করতে পারবেন।', 'error');
    }

    // Step 1: Verification First (as per user workflow expectations)
    const isPinValid = await promptSecurityPin("কাস্টমার তথ্য এডিট (Authorization)");
    if (!isPinValid) return;

    // Step 2: Immediate Data Access (Use cache to avoid delays)
    const customer = cachedCustomers.find(c => c.id === id);
    const currentInitialDue = customer ? (customer.initialDue || 0) : 0;
    const currentOpeningDate = customer?.openingDate || (customer?.createdAt ? customer.createdAt.toDate().toISOString().split('T')[0] : getTodayLocalDateString());

    // Build zone options from cache
    let zoneOpts = '<option value="">-- জোন সিলেক্ট --</option>';
    cachedZones.forEach(z => {
        const zName = typeof z === 'string' ? z : z.name;
        zoneOpts += `<option value="${zName}" ${zName === currentZone ? 'selected' : ''}>${zName}</option>`;
    });

    // Step 3: Show Edit Form Dialog
    const { value: f } = await Swal.fire({
        title: '✏️ কাস্টমার তথ্য এডিট করুন',
        html: `
            <div class="space-y-4 text-left p-1 font-bn">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-[11px] font-black text-blue-400 uppercase tracking-widest mb-1 ml-1">হিসাব খোলার তারিখ *</label>
                        <input id="ed-d" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 text-sm transition-all datepicker" value="${currentOpeningDate}">
                    </div>
                    <div>
                        <label class="block text-[11px] font-black text-blue-400 uppercase tracking-widest mb-1 ml-1">কাস্টমারের নাম *</label>
                        <input id="ed-n" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 text-sm transition-all" value="${name}">
                    </div>
                </div>
                <div>
                    <label class="block text-[11px] font-black text-blue-400 uppercase tracking-widest mb-1 ml-1">মোবাইল নম্বর *</label>
                    <input id="ed-p" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 text-sm transition-all" value="${phone}">
                </div>
                <div>
                    <label class="block text-[11px] font-black text-blue-400 uppercase tracking-widest mb-1 ml-1">ঠিকানা (ঐচ্ছিক)</label>
                    <input id="ed-a" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 text-sm transition-all" value="${address}">
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-[11px] font-black text-purple-400 uppercase tracking-widest mb-1 ml-1">জোন / অঞ্চল</label>
                        <select id="ed-z" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 text-sm transition-all">
                            ${zoneOpts}
                        </select>
                    </div>
                    <div>
                        <label class="block text-[11px] font-black text-emerald-500 uppercase tracking-widest mb-1 ml-1">Opening Balance</label>
                        <input id="ed-ib" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-emerald-400 font-bold outline-none focus:border-emerald-500 text-sm transition-all" value="${currentInitialDue}" oninput="handleNumberInput(this); updateLiveWords(this, 'ed-ib-words');">
                        <div id="ed-ib-words" class="text-[11px] font-black text-emerald-400 mt-1.5 px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 italic font-bn inline-block">(${numberToBanglaWords(currentInitialDue)})</div>
                    </div>
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'আপডেট করুন',
        cancelButtonText: 'বাতিল',
        customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' },
        preConfirm: () => {
            const d = toDBDate(document.getElementById('ed-d').value);
            const n = document.getElementById('ed-n').value.trim();
            const p = document.getElementById('ed-p').value.trim();
            const a = document.getElementById('ed-a').value.trim();
            const z = document.getElementById('ed-z').value;
            const ib = parseAmount(document.getElementById('ed-ib').value);
            if (!n || !p) return Swal.showValidationMessage('নাম ও মোবাইল নম্বর আবশ্যক!');
            return { d, n, p, a, z, ib };
        }
    });

    if (f) {
        try {
            Swal.fire({ title: 'আপডেট হচ্ছে...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

            const balanceDiff = f.ib - currentInitialDue;

            await CustomerDAO.update(id, {
                name: f.n,
                phone: f.p,
                address: f.a,
                zone: f.z || '',
                openingDate: f.d,
                initialDue: f.ib,
                totalDue: firebase.firestore.FieldValue.increment(balanceDiff)
            });

            // Audit Log
            auditLog('UPDATE', 'Customers', id, f.n, { old: { name, phone, address, zone: currentZone, initialDue: currentInitialDue, openingDate: currentOpeningDate }, new: f });

            // Update customerName and Opening Balance transaction
            const txns = await TransactionDAO.getByCustomer(id);
            const batch = db.batch();
            txns.forEach(txn => {
                const updateData = { customerName: f.n };
                if (txn.voucherNo === 'OPENING') {
                    updateData.date = f.d;
                    updateData.bill = f.ib > 0 ? f.ib : 0;
                    updateData.paid = f.ib < 0 ? Math.abs(f.ib) : 0;
                    updateData.currentDue = f.ib;
                }
                batch.update(TransactionDAO.getRef(txn.id), updateData);
            });
            await batch.commit();

            Swal.fire('সফল!', 'কাস্টমার তথ্য সফলভাবে আপডেট হয়েছে।', 'success');
            loadCustomers(); // Automatic Refresh
        } catch (e) {
            console.error(e);
            Swal.fire('Error', 'আপডেট করা যায়নি।', 'error');
        }
    }
}

async function deleteCustomer(id, name) {
    if (window.AppState.currentUserRole !== 'Admin') {
        return Swal.fire('অ্যাক্সেস ডিনাইড!', 'শুধুমাত্র অ্যাডমিন কাস্টমার ডিলেট করতে পারবেন।', 'error');
    }

    const confirm = await Swal.fire({
        title: '⚠️ কাস্টমার ডিলেট?',
        text: `আপনি কি নিশ্চিত যে "${name}" এবং তার সকল লেনদেন ডাটাবেস থেকে মুছে ফেলতে চান? এটি আর ফিরিয়ে আনা সম্ভব নয়!`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'হ্যাঁ, ডিলেট করুন',
        cancelButtonText: 'বাতিল',
        confirmButtonColor: '#dc2626',
        customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' }
    });

    if (confirm.isConfirmed) {
        const isPinValid = await promptSecurityPin("কাস্টমার ডিলেট (Permanent Delete)");
        if (!isPinValid) return;

        try {
            // Delete Transactions first
            const txns = await TransactionDAO.getByCustomer(id);
            const batch = db.batch();
            txns.forEach(txn => batch.delete(TransactionDAO.getRef(txn.id)));

            // Delete Customer
            batch.delete(CustomerDAO.getRef(id));

            await batch.commit();

            // Audit Log
            auditLog('DELETE', 'Customers', id, name, { action: 'Full Customer Deletion' });

            Swal.fire('সফল!', 'কাস্টমার এবং তার সকল লেনদেন মুছে ফেলা হয়েছে।', 'success');
            loadCustomers(); // Automatic Refresh
        } catch (e) {
            console.error(e);
            Swal.fire('Error', 'মুছে ফেলা সম্ভব হয়নি।', 'error');
        }
    }
}

export function openCustomerLedger(id) { window.navigate('ledger', { customerId: id }); }
export function openCustomerStatement(id, name, accountNo, phone, address) {
    window.navigate('statement', { customerId: id, customerName: name, accountNo: accountNo || '', customerPhone: phone || '', customerAddress: address || '' });
}

window.toggleAddCustomerForm = toggleAddCustomerForm;
window.saveNewCustomer = saveNewCustomer;
window.editCustomer = editCustomer;
window.deleteCustomer = deleteCustomer;
window.openCustomerLedger = openCustomerLedger;
window.openCustomerStatement = openCustomerStatement;
window.sendReminderSMS = sendReminderSMS;
window.loadCustomers = loadCustomers;
window.filterCustomerList = filterCustomerList;
window.quickAddZone = quickAddZone;
window.handleZoneChange = handleZoneChange;
window.changeCustomerPage = changeCustomerPage;
