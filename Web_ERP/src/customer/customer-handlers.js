import { CustomerDAO, ZoneDAO, SettingsDAO } from '../dao.js';
import { formatAmountWithComma, formatAppDate, getTodayLocalDateString, formatSmsCounterText, buildSmsMessage, sendSMS, promptSecurityPin, renderSkeletonRows, safeRound } from '../utils.js';
import Swal from 'sweetalert2';
import { cachedCustomers, lastVisibleCust, pageStackCust, currentCustPage, custPageSize, setLastVisibleCust, setIsSearchingCust, setCachedZones } from './customer-state.js';
import { renderCustomerRows } from './customer-ui.js';
import { printFilteredCustomerList } from './customer-print.js';

export async function loadAllZones() {
    try {
        const zones = await ZoneDAO.getAllZones();
        let options = '<option value="">-- জোন সিলেক্ট --</option>';
        let filterOptions = '<option value="">-- সকল জোন (All Zones) --</option>';

        setCachedZones(zones);
        zones.forEach(z => {
            options += `<option value="${z.name}" data-code="${z.code}">${z.name} (Code: ${z.code})</option>`;
            filterOptions += `<option value="${z.name}">${z.name}</option>`;
        });

        const mainSel = document.getElementById('cust-zone-select');
        const filterSel = document.getElementById('cust-filter-zone');
        const dashSel = document.getElementById('dash-cust-zone-select');
        if (mainSel) mainSel.innerHTML = options;
        if (filterSel) filterSel.innerHTML = filterOptions;
        if (dashSel) dashSel.innerHTML = options;
    } catch (e) { console.error("Error loading zones:", e); }
}

export async function loadCustomerPage(direction = 'next') {
    const tbody = document.getElementById('customer-list');
    if (!tbody) return;

    renderSkeletonRows(tbody, 5);

    try {
        const cursor = (direction === 'next') ? lastVisibleCust : (pageStackCust.length > 1 ? pageStackCust[pageStackCust.length - 2] : null);
        const results = await CustomerDAO.getByPage(custPageSize, cursor, 'createdAt', 'desc');

        setLastVisibleCust(results.lastDoc);
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

export async function filterCustomerList() {
    const query = document.getElementById('cust-search-input')?.value.trim() || '';
    const zoneFilter = document.getElementById('cust-filter-zone')?.value || '';
    const paginationEl = document.getElementById('cust-pagination');

    if (!query && !zoneFilter) {
        setIsSearchingCust(false);
        if (paginationEl) paginationEl.classList.remove('hidden');
        loadCustomerPage();
        return;
    }

    setIsSearchingCust(true);
    if (paginationEl) paginationEl.classList.add('hidden');

    let customers = cachedCustomers;
    if (!customers || customers.length === 0) {
        customers = await CustomerDAO.getAll('name', 'asc');
    }

    const filtered = customers.filter(c => {
        const matchesSearch = !query || (typeof window.matchCustomerSearch === 'function' ? window.matchCustomerSearch(c, query) : (c.name || '').toLowerCase().includes(query.toLowerCase()));
        const matchesZone = !zoneFilter || c.zone === zoneFilter;
        return matchesSearch && matchesZone;
    });

    renderCustomerRows(filtered);
    updateStats(filtered);
}

function updateStats(list) {
    let totalDue = 0;
    list.forEach(c => totalDue = safeRound(totalDue + (Number(c.totalDue) || 0)));
    const countBadge = document.getElementById('cust-count-badge');
    const dueBadge = document.getElementById('cust-total-due-badge');
    if (countBadge) countBadge.innerText = list.length;
    if (dueBadge) dueBadge.innerText = "৳ " + formatAmountWithComma(totalDue);
}

export async function sendReminderSMS(phone, dueAmt, name, accountNo = '') {
    if (window.AppState?.currentUserRole === 'Staff' && window.AppState?.permissions?.sendSMS === false) {
        return Swal.fire({ title: 'অ্যাক্সেস ডিনাইড!', text: 'আপনার কাস্টমারদের SMS পাঠানোর অনুমতি নেই।', icon: 'error', customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' } });
    }

    if (!phone || phone === '-' || phone.trim() === '') {
        return Swal.fire({ title: 'মোবাইল নম্বর মিসিং!', text: `কাস্টমার "${name}"-এর কোনো মোবাইল নম্বর যুক্ত করা নেই। কাস্টমার এডিট করে নম্বর যোগ করুন।`, icon: 'warning', customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' } });
    }

    const isPinValid = await promptSecurityPin("বকেয়া রিমাইন্ডার SMS পাঠানো (Master PIN)");
    if (!isPinValid) return;

    try {
        const settings = await SettingsDAO.getAppSettings();
        const englishName = (typeof window.toBanglishName === 'function' ? window.toBanglishName(name) : name) || 'Customer';
        const shopName = settings.shopName ? (typeof window.toBanglishName === 'function' ? window.toBanglishName(settings.shopName) : settings.shopName) : 'M/S. Maa Motors';
        const todayDate = formatAppDate(getTodayLocalDateString());

        const msg = buildSmsMessage(settings.smsTemplateReminder, 'Reminder: Dear [Name] [AccNo], your due is Tk [Due] on [Date]. Kindly clear payment soon. Thanks! - [Shop]', {
            name: englishName,
            accountNo,
            shopName,
            date: todayDate,
            due: formatAmountWithComma(Math.abs(dueAmt))
        });

        const { value: text } = await Swal.fire({
            title: '<i class="fa-solid fa-comment-sms text-blue-400 mr-2"></i>Send Reminder SMS',
            html: `<div class="text-left space-y-1 mb-2 font-bn"><div class="text-xs text-slate-400">Recipient Phone: <strong class="text-white">${phone}</strong></div><div id="sms-rem-char-counter" class="text-[11px] font-bold text-emerald-400 text-right">${formatSmsCounterText(msg)}</div></div>`,
            input: 'textarea', inputValue: msg, inputAttributes: { rows: 5, class: 'm3-field text-xs font-mono' },
            showCancelButton: true, confirmButtonText: '<i class="fa-solid fa-paper-plane mr-1.5"></i> Send SMS', cancelButtonText: 'Cancel',
            customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' },
            didOpen: () => {
                const textarea = Swal.getInput(); const counter = document.getElementById('sms-rem-char-counter');
                const updateCount = () => { 
                    if (textarea && counter) { 
                        counter.innerText = formatSmsCounterText(textarea.value); 
                    } 
                };
                if (textarea) textarea.oninput = updateCount; updateCount();
            }
        });

        if (text) {
            const success = await sendSMS(phone, text, false);
            if (success) {
                Swal.fire({ title: '<i class="fa-solid fa-paper-plane text-emerald-400 mr-2"></i>সফল!', text: `${name}-কে রিমাইন্ডার SMS সফলভাবে পাঠানো হয়েছে`, icon: 'success', customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' } });
            }
        }
    } catch(e) { console.error(e); Swal.fire('ব্যর্থ!', 'ডাটাবেস এরর।', 'error'); }
}

export async function handleZoneChange() {
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
        } catch (e) { console.error(e); accDisplay.value = "Error"; }
    } else {
        codeDisplay.value = "";
        accDisplay.value = "";
    }
}

export async function handleDashZoneChange() {
    const sel = document.getElementById('dash-cust-zone-select');
    const codeDisplay = document.getElementById('dash-cust-zone-code-display');
    const accDisplay = document.getElementById('dash-cust-generated-acc');

    if (!sel || !codeDisplay || !accDisplay) return;

    if (sel.selectedIndex > 0) {
        const zoneName = sel.value;
        const zoneCode = sel.options[sel.selectedIndex].dataset.code;
        codeDisplay.value = zoneCode;

        try {
            accDisplay.value = "লোডিং...";
            const nextSerial = await SettingsDAO.peekNextAccountNo(zoneName);
            accDisplay.value = zoneCode + nextSerial;
        } catch (e) { console.error(e); accDisplay.value = "Error"; }
    } else {
        codeDisplay.value = "";
        accDisplay.value = "";
    }
}
window.handleDashZoneChange = handleDashZoneChange;

export function quickAddZoneWrapper() {
    if (window.quickAddZone) window.quickAddZone();
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

export { printFilteredCustomerList };
