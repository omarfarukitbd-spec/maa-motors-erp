import { db, firebase } from '../firebase-config.js';
import { CustomerDAO, TransactionDAO, SettingsDAO } from '../dao.js';
import { parseAmount, toDBDate, getTodayLocalDateString, numberToBanglaWords, resetLiveWords, formatAmountWithComma, formatAppDate, formatSmsCounterText, buildSmsMessage, handleError, sendSMS, showToast } from '../utils.js';
import Swal from 'sweetalert2';
import { auditLog } from '../audit.js';
import { cachedZones } from './customer-state.js';
import { verifyDuplicateCustomer, attachLiveDuplicatePhoneListener } from './customer-duplicate-guard.js';

export function resetAddCustomerForm() {
    ['cust-name', 'cust-phone', 'cust-address', 'cust-initial-balance'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    resetLiveWords('cust-initial-words');
    const pInput = document.getElementById('cust-phone');
    const hint = pInput?.parentElement?.querySelector('.live-dup-hint');
    if (hint) { hint.classList.add('hidden'); hint.innerHTML = ''; }
    if (pInput) attachLiveDuplicatePhoneListener(pInput);
    const dateInput = document.getElementById('cust-date');
    if (dateInput) {
        const todayStr = getTodayLocalDateString();
        dateInput.value = todayStr;
        if (dateInput._flatpickr) dateInput._flatpickr.setDate(todayStr, false);
    }
    const zoneSelect = document.getElementById('cust-zone-select');
    if (zoneSelect) zoneSelect.selectedIndex = 0;
}

export async function saveNewCustomer() {
    // <i class="fa-solid fa-check text-emerald-400"></i> Offline Guard — account number requires server transaction
    if (!navigator.onLine) {
        return Swal.fire({
            title: '<i class="fa-solid fa-wifi text-red-400 mr-2"></i>অফলাইন!',
            html: '<p class="font-bn text-slate-300 text-sm">ইন্টারনেট সংযোগ নেই।<br><strong class="text-red-400">অফলাইনে নতুন কাস্টমার যোগ করা যাবে না।</strong><br><span class="text-xs text-slate-400 mt-1 block">অনুগ্রহ করে ইন্টারনেট চালু করে আবার চেষ্টা করুন।</span></p>',
            icon: 'error',
            confirmButtonText: 'ঠিক আছে',
            customClass: { popup: '!bg-slate-950 !text-white !rounded-3xl border border-red-500/30 font-bn', confirmButton: 'm3-btn-primary !bg-red-600 hover:!bg-red-500 !px-6 !py-2 !rounded-xl font-bold' }
        });
    }
    const d = toDBDate(document.getElementById('cust-date').value),
          n = document.getElementById('cust-name').value.trim(),
          p = document.getElementById('cust-phone').value.trim(),
          a = document.getElementById('cust-address').value.trim(),
          z = document.getElementById('cust-zone-select').value,
          balInput = document.getElementById('cust-initial-balance').value.trim();

    if(!n || !p || !z) return Swal.fire('এরর', 'নাম, মোবাইল নম্বর ও জোন আবশ্যক!', 'error');

    const canProceed = await verifyDuplicateCustomer(p, n);
    if (!canProceed) return;

    let initialBalance = safeRound(parseAmount(balInput));
    const accNo = document.getElementById('cust-generated-acc')?.value || 'Auto';
    const words = numberToBanglaWords(initialBalance);

    const confirmPreview = await Swal.fire({
        title: '<div class="flex items-center justify-center gap-2 font-bn font-black text-xl text-white"><i class="fa-solid fa-file-shield text-blue-400"></i><span>তথ্য যাচাই করুন</span></div>',
        html: `<div class="text-left space-y-3 font-bn p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-inner">
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
            <p class="text-xs text-amber-400 font-bold mt-4 text-center">সব তথ্য সঠিক থাকলে "কনফার্ম করুন" বাটনে ক্লিক করুন।</p>`,
        showCancelButton: true, confirmButtonText: '<i class="fa-solid fa-circle-check mr-2"></i>কনফার্ম করুন', cancelButtonText: '<i class="fa-solid fa-pen-to-square mr-2"></i>সংশোধন করব',
        customClass: { popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn', confirmButton: 'm3-btn-primary !bg-blue-600 hover:!bg-blue-500 !px-7 !py-2.5 !rounded-xl font-bold shadow-lg shadow-blue-600/30', cancelButton: 'm3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-5 !py-2.5 !rounded-xl font-bold border border-slate-700' }
    });

    if (!confirmPreview.isConfirmed) return;

    const btn = document.getElementById('save-cust-btn');
    if(btn) { btn.disabled = true; btn.innerText = "সেভ হচ্ছে..."; }

    try {
        let customerId = '', accountNo = '';
        await db.runTransaction(async (t) => {
            const zoneObj = cachedZones.find(cz => cz.name === z);
            const zoneCode = zoneObj ? zoneObj.code : "";
            const serial = await SettingsDAO.getNextAccountNo(z, t);
            accountNo = zoneCode + serial;

            const custRef = CustomerDAO.getRef();
            customerId = custRef.id;
            const txnRef = TransactionDAO.getRef();

            t.set(custRef, {
                name: n, phone: p, address: a, zone: z || '',
                accountNo: accountNo, openingDate: d, initialDue: initialBalance, totalDue: initialBalance,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            t.set(txnRef, {
                customerId: customerId, customerName: n, date: d, voucherNo: 'OPENING',
                bill: initialBalance > 0 ? initialBalance : 0, paid: initialBalance < 0 ? Math.abs(initialBalance) : 0,
                prevDue: 0, currentDue: initialBalance, notes: 'প্রারম্ভিক ব্যালেন্স (Opening Balance)',
                createdBy: window.AppState?.currentUserEmail || 'System', createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        });
        auditLog('CREATE', 'Customers', customerId, n, { phone: p, zone: z, initialBalance });

        const successMessageHtml = `কাস্টমার <strong>${n}</strong> সফলভাবে ডাটাবেসে যোগ করা হয়েছে। জোন: ${z || 'N/A'}`;
        await Swal.fire({ title: 'সফল!', html: successMessageHtml, icon: 'success', timer: 1500, showConfirmButton: false, customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' } });
        
        // --- CUSTOMER ONBOARDING SMS WORKFLOW ---
        if (p && p.trim() !== '' && p !== '-') {
            try {
                const settings = await SettingsDAO.getAppSettings();
                const englishName = (typeof window.toBanglishName === 'function' ? window.toBanglishName(n) : n) || 'Customer';
                const shopName = settings.shopName ? (typeof window.toBanglishName === 'function' ? window.toBanglishName(settings.shopName) : settings.shopName) : 'M/S. Maa Motors';
                const formattedOpeningDate = formatAppDate(d);

                const msg = buildSmsMessage(settings.smsTemplateOpening, 'Dear [Name] [AccNo], A/C opened at [Shop] on [Date]. Opening Due: Tk [Due]. Thanks!', {
                    name: englishName,
                    accountNo,
                    shopName,
                    date: formattedOpeningDate,
                    due: formatAmountWithComma(Math.abs(initialBalance))
                });

                const { value: text, isConfirmed } = await Swal.fire({
                    title: '<div class="flex flex-col items-center gap-2"><i class="fa-solid fa-comment-sms text-emerald-400 text-3xl mb-1"></i><span class="font-bn font-black text-xl text-white">Welcome SMS</span></div>',
                    html: `<div class="text-left space-y-2 mb-2 font-bn">
                            <p class="text-[13px] text-slate-300">কাস্টমারকে কি অ্যাকাউন্ট খোলার মেসেজ পাঠাতে চান? চাইলে নিচের লেখা এডিট করতে পারেন:</p>
                            <div class="flex justify-between items-center"><div class="text-xs text-slate-400">Recipient Phone: <strong class="text-white">${p}</strong></div><div id="sms-open-char-counter" class="text-[11px] font-bold text-emerald-400 text-right">${formatSmsCounterText(msg)}</div></div>
                           </div>`,
                    input: 'textarea', inputValue: msg, inputAttributes: { rows: 4, class: 'm3-field text-xs font-mono !mt-0' },
                    showCancelButton: true, confirmButtonText: '<i class="fa-solid fa-paper-plane mr-1.5"></i> পাঠিয়ে দিন', cancelButtonText: 'স্কিপ করুন',
                    customClass: { popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-700 shadow-2xl', confirmButton: 'm3-btn-primary !bg-emerald-600 hover:!bg-emerald-500 !px-7 !py-2.5 !rounded-xl font-bold shadow-lg shadow-emerald-600/30', cancelButton: 'm3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-5 !py-2.5 !rounded-xl font-bold border border-slate-700' },
                    didOpen: () => {
                        const textarea = Swal.getInput(); const counter = document.getElementById('sms-open-char-counter');
                        const updateCount = () => { 
                            if (textarea && counter) { 
                                counter.innerText = formatSmsCounterText(textarea.value); 
                            } 
                        };
                        if (textarea) {
                            textarea.oninput = updateCount; updateCount();
                            setTimeout(() => textarea.focus(), 150);
                        }
                    }
                });

                if (isConfirmed && text) {
                    const success = await sendSMS(p, text, false);
                    if (success) {
                        showToast('Welcome SMS পাঠানো হয়েছে', 'success');
                    }
                }
            } catch(e) {
                console.error("Welcome SMS Error:", e);
            }
        }

        resetAddCustomerForm();
        if (window.toggleAddCustomerForm) window.toggleAddCustomerForm();
        if (window.loadCustomers) window.loadCustomers();
    } catch(e) {
        handleError(e, 'কাস্টমার যোগ করা যায়নি');
    } finally {
        if(btn) { btn.disabled = false; btn.innerText = "সেভ করুন"; }
    }
}
