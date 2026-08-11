import Swal from 'sweetalert2';
import { db, firebase } from '../firebase-config.js';
import { CustomerDAO, TransactionDAO, SettingsDAO, ZoneDAO } from '../dao.js';
import { parseAmount, formatAmountWithComma, formatAppDate, getTodayLocalDateString, toDBDate, numberToBanglaWords, handleError } from '../utils.js';
import { populateAddressSuggestions } from '../utils/address-suggestions.js';
import { loadAllZones } from '../customer/customer-handlers.js';
import { auditLog } from '../audit.js';

export function resetDashCustomerForm() {
    const nameInput = document.getElementById('dash-cust-name');
    const phoneInput = document.getElementById('dash-cust-phone');
    const addrInput = document.getElementById('dash-cust-address');
    const balInput = document.getElementById('dash-cust-initial-balance');
    const dateInput = document.getElementById('dash-cust-date');
    const zoneSelect = document.getElementById('dash-cust-zone-select');
    const codeDisplay = document.getElementById('dash-cust-zone-code-display');
    const accDisplay = document.getElementById('dash-cust-generated-acc');

    if (nameInput) nameInput.value = '';
    if (phoneInput) phoneInput.value = '';
    if (addrInput) addrInput.value = '';
    if (balInput) balInput.value = '';
    if (dateInput) dateInput.value = getTodayLocalDateString();
    if (zoneSelect) zoneSelect.selectedIndex = 0;
    if (codeDisplay) codeDisplay.value = '';
    if (accDisplay) accDisplay.value = '';
}

export function toggleDashCustomerForm() {
    const form = document.getElementById('dash-add-customer-form');
    if (form) {
        form.classList.toggle('hidden');
        if (!form.classList.contains('hidden')) {
            resetDashCustomerForm();
            loadAllZones();
            populateAddressSuggestions('dash-cust-address', 'dash-cust-address-datalist', 'dash-cust-address-chips');
            const dateInput = document.getElementById('dash-cust-date');
            if (dateInput && !dateInput.value) dateInput.value = getTodayLocalDateString();
            setTimeout(() => {
                form.scrollIntoView({ behavior: 'smooth', block: 'start' });
                const nameInput = document.getElementById('dash-cust-name');
                if (nameInput) nameInput.focus();
            }, 80);
        }
    }
}

export async function saveDashCustomer() {
    const dVal = document.getElementById('dash-cust-date')?.value;
    const d = toDBDate(dVal || getTodayLocalDateString()),
        n = document.getElementById('dash-cust-name')?.value?.trim(),
        p = document.getElementById('dash-cust-phone')?.value?.trim(),
        a = document.getElementById('dash-cust-address')?.value?.trim(),
        z = document.getElementById('dash-cust-zone-select')?.value,
        balInput = document.getElementById('dash-cust-initial-balance')?.value?.trim();

    if (!n || !p || !z) return Swal.fire('এরর', 'নাম, মোবাইল নম্বর ও জোন আবশ্যক!', 'error');

    let initialBalance = parseAmount(balInput);
    const accNo = document.getElementById('dash-cust-generated-acc')?.value || 'Auto';
    const words = numberToBanglaWords(initialBalance);

    const confirmPreview = await Swal.fire({
        title: '<div class="flex items-center justify-center gap-2 font-bn font-black text-xl text-white"><i class="fa-solid fa-file-shield text-blue-400"></i><span>তথ্য যাচাই করুন</span></div>',
        html: `
            <div class="text-left space-y-3 font-bn p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-inner">
                <div class="grid grid-cols-2 gap-4 border-b border-slate-800/80 pb-2.5">
                    <div class="flex flex-col gap-1"><span class="text-[10px] text-blue-400 font-black uppercase tracking-wider">কাস্টমারের নাম</span><span class="text-base text-white font-black">${n}</span></div>
                    <div class="flex flex-col gap-1"><span class="text-[10px] text-amber-400 font-black uppercase tracking-wider">অ্যাকাউন্ট নং</span><span class="text-base text-amber-400 font-black font-mono">${accNo}</span></div>
                </div>
                <div class="grid grid-cols-2 gap-4 border-b border-slate-800/80 pb-2.5">
                    <div class="flex flex-col gap-1"><span class="text-[10px] text-blue-400 font-black uppercase tracking-wider">মোবাইল নম্বর</span><span class="text-sm text-slate-200 font-bold font-mono">${p}</span></div>
                    <div class="flex flex-col gap-1"><span class="text-[10px] text-purple-400 font-black uppercase tracking-wider">জোন</span><span class="text-sm text-slate-200 font-bold">${z}</span></div>
                </div>
                <div class="flex flex-col gap-1 border-b border-slate-800/80 pb-2.5">
                    <span class="text-[10px] text-sky-400 font-black uppercase tracking-wider flex items-center gap-1"><i class="fa-solid fa-location-dot text-amber-400 text-xs"></i>ঠিকানা (Address)</span>
                    <span class="text-xs text-slate-200 font-medium">${a || 'N/A'}</span>
                </div>
                <div class="flex flex-col gap-1 pt-1">
                    <span class="text-[10px] text-emerald-400 font-black uppercase tracking-wider">অবশিষ্ট ব্যালেন্স (Opening)</span>
                    <span class="text-2xl text-emerald-400 font-black">৳ ${formatAmountWithComma(initialBalance)}</span>
                    ${words ? `<div class="text-[11px] text-emerald-400 font-black italic bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20 mt-1">(${words})</div>` : ''}
                </div>
                <div class="flex flex-col gap-1 pt-2 border-t border-slate-800/80">
                    <span class="text-[10px] text-slate-400 font-black uppercase tracking-wider">হিসাব খোলার তারিখ</span>
                    <span class="text-sm text-slate-300 font-bold font-mono">${formatAppDate(d)}</span>
                </div>
            </div>
            <p class="text-xs text-amber-400 font-bold mt-4 text-center">সব তথ্য সঠিক থাকলে "কনফার্ম করুন" বাটনে ক্লিক করুন।</p>
        `,
        showCancelButton: true, 
        confirmButtonText: '<i class="fa-solid fa-circle-check mr-2"></i>কনফার্ম করুন', 
        cancelButtonText: '<i class="fa-solid fa-pen-to-square mr-2"></i>সংশোধন করব',
        customClass: { 
            popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn', 
            confirmButton: 'm3-btn-primary !bg-blue-600 hover:!bg-blue-500 !px-7 !py-2.5 !rounded-xl font-bold shadow-lg shadow-blue-600/30', 
            cancelButton: 'm3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-5 !py-2.5 !rounded-xl font-bold border border-slate-700' 
        }
    });

    if (!confirmPreview.isConfirmed) return;

    const btn = document.getElementById('dash-save-cust-btn');
    if (btn) { btn.disabled = true; btn.innerText = "সেভ হচ্ছে..."; }

    try {
        const zones = await ZoneDAO.getAllZones();
        const zoneObj = zones.find(cz => cz.name === z);
        const zoneCode = zoneObj ? zoneObj.code : "";
        const serial = await SettingsDAO.getNextAccountNo(z);
        const accountNo = zoneCode + serial;

        const batch = db.batch();
        const custRef = CustomerDAO.getRef();
        const customerId = custRef.id;
        const txnRef = TransactionDAO.getRef();

        batch.set(custRef, {
            name: n, phone: p, address: a || '', zone: z || '',
            accountNo: accountNo, openingDate: d, initialDue: initialBalance, totalDue: initialBalance,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        batch.set(txnRef, {
            customerId: customerId, customerName: n, date: d, voucherNo: 'OPENING',
            bill: initialBalance > 0 ? initialBalance : 0, paid: initialBalance < 0 ? Math.abs(initialBalance) : 0,
            prevDue: 0, currentDue: initialBalance, notes: 'প্রারম্ভিক জের (Opening Balance)',
            createdBy: window.AppState?.currentUserEmail || 'System', createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        await batch.commit();
        auditLog('CREATE', 'Customers', customerId, n, { phone: p, zone: z, initialBalance });

        Swal.fire({ title: 'সফল!', text: `কাস্টমার "${n}" যোগ করা হয়েছে। জোন: ${z || 'N/A'}`, icon: 'success', customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' } });

        resetDashCustomerForm();
        const form = document.getElementById('dash-add-customer-form');
        if (form) form.classList.add('hidden');

        if (window.loadCustomers) window.loadCustomers();
    } catch (e) {
        handleError(e, 'কাস্টমার যোগ করা যায়নি');
    } finally {
        if (btn) { btn.disabled = false; btn.innerText = "সেভ করুন"; }
    }
}
