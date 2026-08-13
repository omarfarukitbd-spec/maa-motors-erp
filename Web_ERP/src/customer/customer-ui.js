import { formatAppDate, getTodayLocalDateString, formatAmountWithComma } from '../utils.js';
import { initCustomerHotkeys } from './customer-hotkeys.js';
import Clusterize from 'clusterize.js';
import 'clusterize.js/clusterize.css';

export function renderCustomers(container, params) {
    if (initCustomerHotkeys) initCustomerHotkeys();
    if(window.AppState.currentUserRole === 'Staff' && window.AppState.permissions.viewCustomers === false) {
        container.innerHTML = `<div class="m3-card text-center"><h2 class="text-xl font-bold text-red-500 font-bn">অ্যাক্সেস ডিনাইড! আপনার কাস্টমার লিস্ট দেখার অনুমতি নেই।</h2></div>`;
        return;
    }

    const canManageCust = window.AppState?.currentUserRole === 'Admin' || window.AppState?.permissions?.manageCustomers !== false;

    container.innerHTML = `
        <div class="flex flex-col gap-6">
            <div class="m3-card bg-slate-900/60 border border-slate-800/80 p-4 md:p-5 rounded-2xl shadow-xl flex flex-col gap-4">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div class="flex items-center gap-3">
                        <div class="w-2 h-7 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
                        <h2 class="text-xl md:text-2xl font-black text-white tracking-tight font-bn flex items-center gap-2">
                            <span>কাস্টমার ম্যানেজমেন্ট</span>
                            <button type="button" class="w-7 h-7 rounded-lg hover:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-blue-400 transition-all active:rotate-180 cursor-pointer" onclick="window.loadCustomers()" title="রিফ্রেশ"><i class="fa-solid fa-rotate text-xs"></i></button>
                            <button type="button" class="w-7 h-7 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center transition-all cursor-pointer" onclick="window.showCustomerKeyboardGuide && window.showCustomerKeyboardGuide()" title="কীবোর্ড শর্টকাট গাইডলাইন (Alt+H)"><i class="fa-solid fa-keyboard text-xs"></i></button>
                        </h2>
                    </div>

                    <div class="flex items-center gap-2.5 w-full sm:w-auto justify-end font-bn">
                        <button class="h-9 px-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-300 text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer shadow-md shadow-amber-500/10" onclick="window.triggerBulkReminderFlow()" title="১-ক্লিকে টপ ১০ বকেয়া তাগাদা"><i class="fa-solid fa-paper-plane text-amber-400"></i><span>বাল্ক তাগাদা (Top 10)</span></button>
                        <button class="h-9 px-3.5 rounded-xl bg-slate-800/90 border border-slate-700/80 hover:bg-slate-700/80 text-slate-200 text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer" onclick="window.exportTableToExcel('customer-export-table', 'customer-list.xlsx')" title="এক্সেল ডাউনলোড"><i class="fa-solid fa-file-excel text-emerald-400"></i><span>এক্সেল</span></button>
                        <button class="h-9 px-3.5 rounded-xl bg-slate-800/90 border border-slate-700/80 hover:bg-slate-700/80 text-slate-200 text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer" onclick="window.printFilteredCustomerList()" title="লিস্ট প্রিন্ট"><i class="fa-solid fa-print text-blue-400"></i><span>প্রিন্ট লিস্ট</span></button>
                        ${canManageCust ? `
                        <button class="h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/20 active:scale-95 transition-all flex items-center gap-2 shrink-0 cursor-pointer" onclick="window.toggleAddCustomerForm()">
                            <i class="fa-solid fa-user-plus text-xs"></i>
                            <span>নতুন কাস্টমার (Alt+N)</span>
                        </button>` : ''}
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-3 items-center font-bn">
                    <div class="relative md:col-span-2">
                        <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs z-10 pointer-events-none"></i>
                        <input type="text" id="cust-search-input" onkeyup="window.filterCustomerList()" placeholder="কাস্টমার খুঁজুন (নাম, ফোন, অ্যাকাউন্ট বা ঠিকানা)..." class="w-full bg-slate-950/90 border border-slate-700/70 rounded-xl h-9 text-xs text-white focus:border-blue-500 outline-none shadow-inner" style="padding-left: 48px !important;">
                    </div>
                    <div>
                        <select id="cust-filter-zone" onchange="window.filterCustomerList()" class="w-full bg-slate-950/90 border border-slate-700/70 rounded-xl h-9 px-3 text-xs text-blue-400 font-bold outline-none cursor-pointer shadow-inner">
                            <option value="">-- সকল জোন (All Zones) --</option>
                        </select>
                    </div>
                </div>

                <div class="flex items-center gap-3 pt-2 border-t border-slate-800/60 text-xs font-bold font-bn">
                    <div class="flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[11px] font-bold text-blue-400">
                        <i class="fa-solid fa-users text-blue-400"></i> মোট কাস্টমার: <strong id="cust-count-badge" class="text-white font-black">০</strong> জন
                    </div>
                    <div class="flex items-center gap-2 px-3 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-[11px] font-bold text-red-400">
                        <i class="fa-solid fa-triangle-exclamation text-red-400"></i> মোট বকেয়া: <strong id="cust-total-due-badge" class="text-red-400 font-black">৳ ০</strong>
                    </div>
                </div>
            </div>

            <!-- Inline New Customer Add Form Container (Collapsable) -->
            <div id="add-customer-form" class="hidden m3-card bg-slate-900/90 border border-slate-800 p-4 md:p-5 rounded-2xl shadow-2xl font-bn flex flex-col gap-4">
                <div class="flex items-center justify-between border-b border-slate-800/80 pb-3">
                    <div class="flex items-center gap-3">
                        <div class="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center text-base font-black shadow-sm">
                            <i class="fa-solid fa-address-card"></i>
                        </div>
                        <div>
                            <h3 class="text-base md:text-lg font-black text-white">নতুন কাস্টমার যুক্ত করুন</h3>
                            <p class="text-[10px] text-slate-400 font-bold">কাস্টমার প্রোফাইল ও প্রারম্ভিক হিসাব এন্ট্রি</p>
                        </div>
                    </div>
                    <button class="w-8 h-8 rounded-xl bg-slate-800/80 hover:bg-red-500/20 border border-slate-700/60 text-slate-400 hover:text-red-400 flex items-center justify-center transition-all cursor-pointer" onclick="window.toggleAddCustomerForm()" title="বন্ধ করুন">
                        <i class="fa-solid fa-xmark text-sm"></i>
                    </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
                    <div>
                        <label class="m3-label">হিসাব খোলার তারিখ <span class="m3-label-sub">(Date)</span></label>
                        <input type="text" id="cust-date" class="m3-field py-1 bg-slate-950/80 h-9 text-xs datepicker cursor-pointer">
                    </div>
                    <div>
                        <label class="m3-label">কাস্টমারের নাম <span class="m3-label-sub">(Name *)</span></label>
                        <input type="text" id="cust-name" placeholder="পুরো নাম লিখুন" class="m3-field py-1 bg-slate-950/80 h-9 text-xs">
                    </div>
                    <div>
                        <label class="m3-label">ঠিকানা <span class="m3-label-sub">(Address)</span></label>
                        <input type="text" id="cust-address" list="cust-address-datalist" placeholder="ঠিকানা লিখুন (যেমন: মা মার্কেট, ১নং রেইল গেইট...)" class="m3-field py-1 bg-slate-950/80 h-9 text-xs">
                        <datalist id="cust-address-datalist"></datalist>
                        <div id="cust-address-chips"></div>
                    </div>
                    <div>
                        <label class="m3-label">মোবাইল নম্বর <span class="m3-label-sub">(Phone *)</span></label>
                        <input type="text" id="cust-phone" placeholder="০১৭xxxxxxxx" class="m3-field py-1 bg-slate-950/80 h-9 text-xs">
                    </div>

                    <div class="flex flex-col">
                        <label class="m3-label text-emerald-400">অবশিষ্ট ব্যালেন্স <span class="m3-label-sub">(Opening Due ৳)</span></label>
                        <input type="text" id="cust-initial-balance" placeholder="০.০০" oninput="window.handleNumberInput(this); window.updateLiveWords(this, 'cust-initial-words');" class="m3-field py-1 border-emerald-500/30 focus:border-emerald-500 text-emerald-400 font-black h-9 text-xs bg-slate-950/80">
                        <div id="cust-initial-words" class="text-[10px] font-black text-emerald-400 mt-1 hidden italic truncate"></div>
                    </div>
                    <div>
                        <label class="m3-label text-purple-400">জোন / অঞ্চল <span class="m3-label-sub">(Zone *)</span></label>
                        <div class="flex gap-2">
                            <select id="cust-zone-select" class="m3-field py-1 flex-grow bg-slate-950/80 h-9 text-xs font-bold text-slate-200 cursor-pointer" onchange="window.handleZoneChange()">
                                <option value="">-- জোন সিলেক্ট --</option>
                            </select>
                            <button title="নতুন জোন যোগ করুন" class="w-9 h-9 bg-purple-600/20 text-purple-400 border border-purple-500/30 rounded-xl hover:bg-purple-600 hover:text-white transition-all flex items-center justify-center shrink-0 cursor-pointer" onclick="window.quickAddZone()"><i class="fa-solid fa-plus text-xs"></i></button>
                        </div>
                    </div>
                    <div>
                        <label class="m3-label text-blue-400">জোন কোড <span class="m3-label-sub">(Code)</span></label>
                        <input type="text" id="cust-zone-code-display" readonly placeholder="কোড" class="m3-field py-1 bg-slate-950/60 border-slate-700/60 text-center text-xs font-black text-blue-400 h-9">
                    </div>
                    <div>
                        <label class="m3-label text-blue-400">অ্যাকাউন্ট নম্বর <span class="m3-label-sub">(Auto A/C)</span></label>
                        <input type="text" id="cust-generated-acc" readonly placeholder="অ্যাকাউন্ট নং" class="m3-field py-1 bg-slate-950/60 border-blue-500/30 text-blue-400 font-black h-9 text-xs">
                    </div>
                </div>

                <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-800/80">
                    <button class="h-9 px-5 rounded-xl bg-slate-800/90 border border-slate-700/80 hover:bg-slate-700/80 text-slate-300 text-xs font-bold transition-all cursor-pointer" onclick="window.toggleAddCustomerForm()">বাতিল</button>
                    <button class="h-9 px-8 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-lg shadow-blue-600/30 active:scale-95 transition-all flex items-center gap-2 cursor-pointer" id="save-cust-btn" onclick="window.saveNewCustomer()">
                        <i class="fa-solid fa-check text-xs"></i>
                        <span>সেভ করুন</span>
                    </button>
                </div>
            </div>

            <!-- Desktop View Table -->
            <div class="desktop-only m3-table-container clusterize-scroll" id="cust-scroll-area" style="max-height: 60vh;">
                <table id="customer-export-table" class="m3-table min-w-[800px]">
                    <thead>
                        <tr class="font-bn">
                            <th class="w-[120px] text-slate-400">খোলার তারিখ</th>
                            <th class="w-1/4 text-slate-400">কাস্টমারের নাম</th>
                            <th class="w-1/4 text-slate-400">ঠিকানা</th>
                            <th class="text-slate-400">মোবাইল নম্বর</th>
                            <th class="text-right text-slate-400">মোট বকেয়া</th>
                            <th class="text-center text-slate-400 sticky-action-col">অ্যাকশন</th>
                        </tr>
                    </thead>
                    <tbody id="customer-list" class="font-bn clusterize-content">
                        <tr><td colspan="6" class="text-center py-20 font-bold text-slate-500 italic">ডাটা লোড হচ্ছে...</td></tr>
                    </tbody>
                </table>
            </div>

            <!-- Mobile View Responsive Cards -->
            <div id="customer-list-mobile" class="mobile-only mobile-card-container font-bn">
                <div class="text-center py-10 text-slate-500 font-bold italic">ডাটা লোড হচ্ছে...</div>
            </div>

            <!-- Pagination Controls -->
            <div id="cust-pagination" class="flex items-center justify-center gap-4 py-4 font-bn">
                <button id="cust-prev-page" class="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl border border-slate-700 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-all" onclick="window.changeCustomerPage('prev')">
                    <i class="fa-solid fa-chevron-left mr-2"></i> পূর্ববর্তী
                </button>
                <div class="text-white font-bold bg-blue-600/10 border border-blue-500/30 px-4 py-2 rounded-xl">
                    পৃষ্ঠা: <span id="cust-current-page-display">1</span>
                </div>
                <button id="cust-next-page" class="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl border border-slate-700 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-all" onclick="window.changeCustomerPage('next')">
                    পরবর্তী <i class="fa-solid fa-chevron-right ml-2"></i>
                </button>
            </div>
        </div>`;
    if (window.loadCustomers) window.loadCustomers();
    if (document.getElementById('cust-date')) {
        document.getElementById('cust-date').value = (window.getTodayLocalDateString ? window.getTodayLocalDateString() : new Date().toISOString().split('T')[0]);
    }
    if (params && params.openForm) {
        setTimeout(() => {
            const form = document.getElementById('add-customer-form');
            if (form) form.classList.remove('hidden');
        }, 150);
    }
}

export function renderCustomerRows(customers) {
    const tbody = document.getElementById('customer-list');
    const mobileContainer = document.getElementById('customer-list-mobile');
    if(!tbody) return;

    const isAdmin = String(window.AppState?.currentUserRole || '').toLowerCase() === 'admin';
    const canEditCust = isAdmin || (window.AppState?.permissions?.editCustomers !== false && window.AppState?.permissions?.manageCustomers !== false);
    const canDeleteCust = isAdmin || (window.AppState?.permissions?.deleteCustomers === true);

    let rows = [];
    let mobileHtml = '';

    customers.forEach(d => {
        let openingDate = d.openingDate || '', entryTime = '';
        if (d.createdAt) {
            try {
                const dt = d.createdAt.toDate ? d.createdAt.toDate() : (d.createdAt.toMillis ? new Date(d.createdAt.toMillis()) : new Date(d.createdAt));
                if (!isNaN(dt.getTime())) {
                    if (!openingDate) openingDate = dt.toISOString().split('T')[0];
                    entryTime = dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
                }
            } catch(e) { console.error(e); }
        }
        if (!openingDate) openingDate = getTodayLocalDateString();

        const due = Number(d.totalDue) || 0;
        const dueColorClass = due > 0 ? 'text-red-400' : (due < 0 ? 'text-emerald-400' : 'text-slate-400');
        const sId = String(d.id || '');
        const sName = String(d.name || 'N/A').replace(/'/g, "\\'").replace(/"/g, "&quot;");
        const sPhone = String(d.phone || '-').replace(/'/g, "\\'").replace(/"/g, "&quot;");
        const sAddr = String(d.address || '-').replace(/'/g, "\\'").replace(/"/g, "&quot;");
        const sZone = String(d.zone || '').replace(/'/g, "\\'").replace(/"/g, "&quot;");

        rows.push(`<tr class="hover:bg-white/[0.04] transition-colors border-b border-slate-800/60 cursor-pointer group" onclick="window.openCustomerLedger('${sId}')">
            <td class="py-2.5 px-3 text-xs font-bold text-slate-200 whitespace-nowrap align-top">
                <div>${formatAppDate(openingDate)}</div>
                ${entryTime ? `<div class="text-[10px] text-slate-400 font-medium mt-0.5 flex items-center gap-1.5"><i class="fa-regular fa-clock text-[9px] text-slate-500"></i><span>${entryTime}</span></div>` : ''}
            </td>
            <td class="py-2.5 px-3 font-bold text-slate-200 whitespace-nowrap align-top">
                <div class="flex items-center gap-2">
                    <div class="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-black text-xs shrink-0">${(d.name || 'K').charAt(0)}</div>
                    <div class="flex items-center gap-2">
                        <span class="text-xs text-white font-bold group-hover:text-blue-400 transition-colors">${d.name || 'N/A'}</span>
                        <span class="text-[10px] text-blue-400 font-black bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 rounded font-mono">${d.accountNo || '-'}</span>
                    </div>
                </div>
            </td>
            <td class="py-2.5 px-3 text-xs text-slate-300 font-medium max-w-[220px] align-top" title="${d.address || '-'}">
                <div class="flex items-center gap-1 truncate">
                    ${d.zone ? `<span class="inline-block text-[9px] text-purple-400 font-bold bg-purple-500/10 border border-purple-500/20 px-1.5 py-0.5 rounded shrink-0"><i class="fa-solid fa-location-dot mr-0.5"></i>${d.zone}</span>` : ''}
                    <span class="truncate text-slate-400">${d.address || '-'}</span>
                </div>
            </td>
            <td class="py-2.5 px-3 text-xs text-slate-300 font-bold whitespace-nowrap align-top">${d.phone || '-'}</td>
            <td class="py-2.5 px-3 text-right whitespace-nowrap align-top">
                <div class="flex items-center justify-end gap-1.5">
                    <span class="font-black text-sm ${dueColorClass}">৳ ${formatAmountWithComma(Math.abs(due))}</span>
                    <span class="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${due > 0 ? 'bg-red-500/10 text-red-400 border border-red-500/20' : (due < 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400')}">${due > 0 ? 'বকেয়া' : (due < 0 ? 'অ্যাডভান্স' : 'পরিশোধিত')}</span>
                </div>
            </td>
            <td class="py-2.5 px-3 text-center whitespace-nowrap sticky-action-col align-top" onclick="event.stopPropagation()">
                <div class="flex items-center justify-center gap-1">
                    <button class="m3-btn-icon" onclick="window.openCustomerLedger('${sId}')" title="খতিয়ান দেখুন"><i class="fa-solid fa-book text-blue-400"></i></button>
                    <button class="m3-btn-icon" onclick="window.openCustomerStatement('${sId}', '${sName}', '${d.accountNo || ''}', '${sPhone}', '${sAddr}')" title="স্টেটমেন্ট"><i class="fa-solid fa-file-invoice text-purple-400"></i></button>
                    <button class="m3-btn-icon" onclick="window.sendDashWhatsAppReminder('${sPhone}', ${due}, '${sName}')" title="WhatsApp তাগাদা"><i class="fa-brands fa-whatsapp text-emerald-400"></i></button>
                    ${due > 0 ? `<button class="m3-btn-icon" onclick="window.sendReminderSMS('${sPhone}', ${due}, '${sName}', '${d.accountNo || ''}')" title="রিমাইন্ডার SMS"><i class="fa-solid fa-bell text-amber-400"></i></button>` : ''}
                    ${canEditCust ? `<button class="m3-btn-icon" onclick="window.editCustomer('${sId}', '${sName}', '${sPhone}', '${sAddr}', '${sZone}')" title="এডিট"><i class="fa-solid fa-pen-to-square text-amber-400"></i></button>` : ''}
                    ${canDeleteCust ? `<button class="m3-btn-icon" onclick="window.deleteCustomer('${sId}', '${sName}')" title="ডিলেট"><i class="fa-solid fa-trash-can text-red-400"></i></button>` : ''}
                </div>
            </td>
        </tr>`);

        mobileHtml += `<div class="mobile-card cursor-pointer" onclick="window.openCustomerLedger('${sId}')">
            <div class="mobile-card-header">
                <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-black text-xs shrink-0">${(d.name || 'K').charAt(0)}</div>
                    <div>
                        <div class="mobile-card-title">${d.name || 'N/A'}</div>
                        <div class="mobile-card-sub text-blue-400 font-bold">${d.accountNo || '-'} ${d.zone ? '• ' + d.zone : ''}</div>
                    </div>
                </div>
                <div class="text-right">
                    <div class="text-base font-black ${dueColorClass}">৳ ${formatAmountWithComma(Math.abs(due))}</div>
                    <span class="inline-block text-[9px] uppercase font-bold ${due > 0 ? 'text-red-400' : 'text-emerald-400'}">${due > 0 ? 'বকেয়া' : 'পরিশোধিত'}</span>
                </div>
            </div>
            <div class="mobile-card-row"><span class="mobile-card-label">তারিখ:</span><span class="mobile-card-value">${formatAppDate(openingDate)}${entryTime ? ` (${entryTime})` : ''}</span></div>
            <div class="mobile-card-row"><span class="mobile-card-label">মোবাইল:</span><span class="mobile-card-value">${d.phone || '-'}</span></div>
            <div class="mobile-card-row"><span class="mobile-card-label">ঠিকানা:</span><span class="mobile-card-value">${d.address || '-'}</span></div>
            <div class="mobile-card-actions" onclick="event.stopPropagation()">
                <button class="m3-btn-icon" onclick="window.openCustomerLedger('${sId}')" title="খতিয়ান"><i class="fa-solid fa-book text-blue-400"></i></button>
                <button class="m3-btn-icon" onclick="window.openCustomerStatement('${sId}', '${sName}', '${d.accountNo || ''}', '${sPhone}', '${sAddr}')" title="স্টেটমেন্ট"><i class="fa-solid fa-file-invoice text-purple-400"></i></button>
                <button class="m3-btn-icon" onclick="window.sendDashWhatsAppReminder('${sPhone}', ${due}, '${sName}')" title="WhatsApp তাগাদা"><i class="fa-brands fa-whatsapp text-emerald-400"></i></button>
                ${due > 0 ? `<button class="m3-btn-icon" onclick="window.sendReminderSMS('${sPhone}', ${due}, '${sName}', '${d.accountNo || ''}')" title="রিমাইন্ডার SMS"><i class="fa-solid fa-bell text-amber-400"></i></button>` : ''}
                ${canEditCust ? `<button class="m3-btn-icon" onclick="window.editCustomer('${sId}', '${sName}', '${sPhone}', '${sAddr}', '${sZone}')" title="এডিট"><i class="fa-solid fa-pen-to-square text-amber-400"></i></button>` : ''}
                ${canDeleteCust ? `<button class="m3-btn-icon" onclick="window.deleteCustomer('${sId}', '${sName}')" title="ডিলেট"><i class="fa-solid fa-trash-can text-red-400"></i></button>` : ''}
            </div>
        </div>`;
    });

    if (window.customerClusterize) {
        window.customerClusterize.destroy();
    }
    if (rows.length > 0) {
        window.customerClusterize = new Clusterize({
            rows: rows,
            scrollId: 'cust-scroll-area',
            contentId: 'customer-list'
        });
    } else {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center py-20 text-slate-500 italic font-bold">কোনো কাস্টমার পাওয়া যায়নি</td></tr>';
    }
    
    if (mobileContainer) mobileContainer.innerHTML = mobileHtml || '<div class="text-center py-10 text-slate-500 font-bold italic">কোনো কাস্টমার পাওয়া যায়নি</div>';
}
