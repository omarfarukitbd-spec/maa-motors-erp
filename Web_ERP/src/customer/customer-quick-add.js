import { db, firebase } from '../firebase-config.js';
import { CustomerDAO, TransactionDAO, SettingsDAO, ZoneDAO } from '../dao.js';
import { getTodayLocalDateString, parseAmount, formatAmountWithComma, formatAppDate, toDBDate, numberToBanglaWords, handleError } from '../utils.js';
import { auditLog } from '../audit.js';
import Swal from 'sweetalert2';
import { verifyDuplicateCustomer } from './customer-duplicate-guard.js';

/**
 * Centered Quick Add Customer Function (Shared across modules)
 * Features: Auto-Account No, Zone selection + Add New Zone option, Zone Code preview,
 * Initial Balance, Opening Date, and Confirmation Preview Modal.
 */
export async function quickAddCustomer() {
    // <i class="fa-solid fa-check text-emerald-400"></i> Offline Guard — account number generation requires server transaction
    if (!navigator.onLine) {
        return Swal.fire({
            title: '<i class="fa-solid fa-wifi text-red-400 mr-2"></i>অফলাইন!',
            html: '<p class="font-bn text-slate-300 text-sm">ইন্টারনেট সংযোগ নেই।<br><strong class="text-red-400">অফলাইনে নতুন কাস্টমার যোগ করা যাবে না।</strong><br><span class="text-xs text-slate-400 mt-1 block">অনুগ্রহ করে ইন্টারনেট চালু করে আবার চেষ্টা করুন।</span></p>',
            icon: 'error',
            confirmButtonText: 'ঠিক আছে',
            customClass: { popup: '!bg-slate-950 !text-white !rounded-3xl border border-red-500/30 font-bn', confirmButton: 'm3-btn-primary !bg-red-600 hover:!bg-red-500 !px-6 !py-2 !rounded-xl font-bold' }
        });
    }
    let zones = await ZoneDAO.getAllZones();

    const buildZoneOptions = (selectedName = '') => {
        let opts = '<option value="">-- জোন সিলেক্ট করুন --</option>';
        zones.forEach(z => {
            const isSel = z.name === selectedName ? 'selected' : '';
            opts += `<option value="${z.name}" data-code="${z.code || ''}" ${isSel}>${z.name} (${z.code || 'N/A'})</option>`;
        });
        opts += '<option value="__NEW_ZONE__">+ নতুন জোন যোগ করুন...</option>';
        return opts;
    };

    const todayStr = getTodayLocalDateString();

    const { value: f } = await Swal.fire({
        title: '<div class="flex items-center justify-center gap-2 font-bn font-black text-xl text-white"><i class="fa-solid fa-user-plus text-blue-400"></i><span>নতুন কাস্টমার যুক্ত করুন</span></div>',
        html: `
            <div class="space-y-3 text-left p-1 font-bn">
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block text-[11px] font-black text-blue-400 uppercase tracking-widest mb-1 ml-1">কাস্টমারের নাম *</label>
                        <input id="sw-n" class="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl px-3.5 py-2 text-white outline-none focus:border-blue-500 text-xs font-bold transition-all" placeholder="নাম লিখুন">
                    </div>
                    <div>
                        <label class="block text-[11px] font-black text-blue-400 uppercase tracking-widest mb-1 ml-1">মোবাইল নম্বর *</label>
                        <input id="sw-p" class="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl px-3.5 py-2 text-white outline-none focus:border-blue-500 text-xs font-bold transition-all" placeholder="০১৭xxxxxxxx">
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <div class="flex justify-between items-center mb-1 ml-1">
                            <label class="block text-[11px] font-black text-blue-400 uppercase tracking-widest">জোন / অঞ্চল *</label>
                            <button type="button" id="sw-add-zone-btn" class="text-[10px] text-amber-400 font-bold hover:underline cursor-pointer"><i class="fa-solid fa-plus text-[9px]"></i> নতুন জোন</button>
                        </div>
                        <select id="sw-z" class="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl px-3.5 py-2 text-white outline-none focus:border-blue-500 text-xs font-bold transition-all">
                            ${buildZoneOptions()}
                        </select>
                    </div>
                    <div>
                        <label class="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">ঠিকানা (ঐচ্ছিক)</label>
                        <input id="sw-a" class="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl px-3.5 py-2 text-white outline-none focus:border-blue-500 text-xs font-bold transition-all" placeholder="ঠিকানা">
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-3 p-2 bg-slate-950/60 rounded-xl border border-slate-800">
                    <div>
                        <label class="block text-[10px] font-black text-purple-400 uppercase tracking-widest mb-0.5">জোন কোড (Zone Code)</label>
                        <input id="sw-zcode" type="text" class="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-purple-400 font-mono font-bold text-xs outline-none" readonly placeholder="অটো লোড...">
                    </div>
                    <div>
                        <label class="block text-[10px] font-black text-amber-400 uppercase tracking-widest mb-0.5">অ্যাকাউন্ট নং (Account No)</label>
                        <input id="sw-acc" type="text" class="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-amber-400 font-mono font-bold text-xs outline-none" readonly placeholder="অটো জেনারেট...">
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-3 border-t border-slate-800/80 pt-2.5">
                    <div>
                        <label class="block text-[11px] font-black text-emerald-400 uppercase tracking-widest mb-1 ml-1">প্রারম্ভিক ব্যালেন্স / বকেয়া (৳)</label>
                        <input id="sw-bal" type="text" class="w-full bg-slate-950/90 border border-emerald-500/40 rounded-xl px-3.5 py-2 text-emerald-400 outline-none focus:border-emerald-500 text-xs font-black transition-all" placeholder="০.০০" oninput="window.handleNumberInput(this); window.updateLiveWords(this, 'sw-bal-words');">
                        <div id="sw-bal-words" class="text-[10px] font-black text-emerald-400 mt-1 hidden italic truncate"></div>
                    </div>
                    <div>
                        <label class="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">হিসাব খোলার তারিখ *</label>
                        <input id="sw-d" type="text" class="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl px-3.5 py-2 text-white outline-none focus:border-blue-500 text-xs font-bold datepicker cursor-pointer" value="${todayStr}">
                    </div>
                </div>
            </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-circle-check mr-1.5"></i> সেভ করুন',
        cancelButtonText: 'বাতিল',
        customClass: {
            popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl !p-6 font-bn',
            confirmButton: 'm3-btn-primary !bg-blue-600 hover:!bg-blue-500 !text-white !rounded-xl !px-7 !py-2 font-bold',
            cancelButton: 'm3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !rounded-xl !px-5 !py-2 font-bold border border-slate-700'
        },
        didOpen: () => {
            const zSelect = document.getElementById('sw-z');
            const addZoneBtn = document.getElementById('sw-add-zone-btn');
            const zCodeInp = document.getElementById('sw-zcode');
            const accInp = document.getElementById('sw-acc');

            const handleZoneChange = async () => {
                const zVal = zSelect?.value;
                if (zVal === '__NEW_ZONE__') {
                    if (zSelect) zSelect.value = '';
                    handleAddNewZone();
                    return;
                }
                const opt = zSelect?.options[zSelect.selectedIndex];
                const code = opt ? opt.dataset.code || '' : '';
                if (zCodeInp) zCodeInp.value = code;

                if (zVal) {
                    const serial = await SettingsDAO.peekNextAccountNo(zVal);
                    if (accInp) accInp.value = code + serial;
                } else {
                    if (accInp) accInp.value = '';
                }
            };

            const handleAddNewZone = async () => {
                const { value: zForm } = await Swal.fire({
                    title: 'নতুন জোন যুক্ত করুন',
                    html: `
                        <div class="space-y-3 text-left font-bn p-2">
                            <div><label class="block text-xs font-bold text-slate-300 mb-1">জোনের নাম * (যেমন: চট্টগ্রাম)</label><input id="nz-name" class="m3-field text-xs font-bold" placeholder="জোনের নাম"></div>
                            <div><label class="block text-xs font-bold text-slate-300 mb-1">জোন শর্ট কোড * (যেমন: CTG)</label><input id="nz-code" class="m3-field text-xs font-bold font-mono uppercase" placeholder="কোড"></div>
                        </div>`,
                    showCancelButton: true, confirmButtonText: 'সেভ জোন', cancelButtonText: 'বাতিল',
                    customClass: { popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800' },
                    preConfirm: () => {
                        const name = document.getElementById('nz-name')?.value?.trim();
                        const code = document.getElementById('nz-code')?.value?.trim()?.toUpperCase();
                        if (!name || !code) return Swal.showValidationMessage('জোনের নাম ও কোড আবশ্যক!');
                        return { name, code };
                    }
                });

                if (zForm) {
                    await ZoneDAO.addZone(zForm.name, zForm.code);
                    zones = await ZoneDAO.getAllZones();
                    if (zSelect) {
                        zSelect.innerHTML = buildZoneOptions(zForm.name);
                        handleZoneChange();
                    }
                }
            };

            if (zSelect) zSelect.addEventListener('change', handleZoneChange);
            if (addZoneBtn) addZoneBtn.addEventListener('click', handleAddNewZone);
        },
        preConfirm: () => {
            const n = document.getElementById('sw-n')?.value?.trim();
            const p = document.getElementById('sw-p')?.value?.trim();
            const z = document.getElementById('sw-z')?.value?.trim();
            const a = document.getElementById('sw-a')?.value?.trim();
            const balRaw = document.getElementById('sw-bal')?.value?.trim() || '0';
            const dVal = document.getElementById('sw-d')?.value?.trim() || todayStr;
            const accNo = document.getElementById('sw-acc')?.value || 'Auto';

            if (!n || !p || !z) {
                Swal.showValidationMessage('নাম, মোবাইল ও জোন আবশ্যক!');
                return false;
            }

            const initialBalance = safeRound(parseAmount(balRaw));
            const d = toDBDate(dVal);

            return { n, p, z, a, initialBalance, d, accNo };
        }
    });

    if (f && f.n) {
        const canProceed = await verifyDuplicateCustomer(f.p, f.n);
        if (!canProceed) return;

        // Confirmation Preview Modal (তথ্য যাচাই করুন)
        const words = numberToBanglaWords(f.initialBalance);
        const confirmPreview = await Swal.fire({
            title: '<div class="flex items-center justify-center gap-2 font-bn font-black text-xl text-white"><i class="fa-solid fa-file-shield text-blue-400"></i><span>তথ্য যাচাই করুন</span></div>',
            html: `
                <div class="text-left space-y-3 font-bn p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-inner">
                    <div class="grid grid-cols-2 gap-4 border-b border-slate-800/80 pb-2.5">
                        <div class="flex flex-col gap-1"><span class="text-[10px] text-blue-400 font-black uppercase tracking-wider">কাস্টমারের নাম</span><span class="text-base text-white font-black">${f.n}</span></div>
                        <div class="flex flex-col gap-1"><span class="text-[10px] text-amber-400 font-black uppercase tracking-wider">অ্যাকাউন্ট নং</span><span class="text-base text-amber-400 font-black font-mono">${f.accNo}</span></div>
                    </div>
                    <div class="grid grid-cols-2 gap-4 border-b border-slate-800/80 pb-2.5">
                        <div class="flex flex-col gap-1"><span class="text-[10px] text-blue-400 font-black uppercase tracking-wider">মোবাইল নম্বর</span><span class="text-sm text-slate-200 font-bold font-mono">${f.p}</span></div>
                        <div class="flex flex-col gap-1"><span class="text-[10px] text-purple-400 font-black uppercase tracking-wider">জোন</span><span class="text-sm text-slate-200 font-bold">${f.z}</span></div>
                    </div>
                    <div class="flex flex-col gap-1 border-b border-slate-800/80 pb-2.5">
                        <span class="text-[10px] text-sky-400 font-black uppercase tracking-wider flex items-center gap-1"><i class="fa-solid fa-location-dot text-amber-400 text-xs"></i>ঠিকানা (Address)</span>
                        <span class="text-xs text-slate-200 font-medium">${f.a || 'N/A'}</span>
                    </div>
                    <div class="flex flex-col gap-1 pt-1">
                        <span class="text-[10px] text-emerald-400 font-black uppercase tracking-wider">অবশিষ্ট ব্যালেন্স (Opening)</span>
                        <span class="text-2xl text-emerald-400 font-black">৳ ${formatAmountWithComma(f.initialBalance)}</span>
                        ${words ? `<div class="text-[11px] text-emerald-400 font-black italic bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20 mt-1">(${words})</div>` : ''}
                    </div>
                    <div class="flex flex-col gap-1 pt-2 border-t border-slate-800/80">
                        <span class="text-[10px] text-slate-400 font-black uppercase tracking-wider">হিসাব খোলার তারিখ</span>
                        <span class="text-sm text-slate-300 font-bold font-mono">${formatAppDate(f.d)}</span>
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

        Swal.fire({ title: 'সেভ হচ্ছে...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

        try {
            let newCustId = '';
            let finalAccountNo = f.accNo;

            await db.runTransaction(async t => {
                const zoneObj = zones.find(z => z.name === f.z);
                const zoneCode = zoneObj ? zoneObj.code : "";

                const serial = await SettingsDAO.getNextAccountNo(f.z, t);
                finalAccountNo = zoneCode + serial;

                const custRef = CustomerDAO.getRef();
                newCustId = custRef.id;

                t.set(custRef, {
                    name: f.n,
                    phone: f.p,
                    address: f.a || '',
                    zone: f.z,
                    accountNo: finalAccountNo,
                    initialDue: f.initialBalance,
                    totalDue: f.initialBalance,
                    openingDate: f.d,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });

                const txnRef = TransactionDAO.getRef();
                t.set(txnRef, {
                    customerId: newCustId,
                    customerName: f.n,
                    date: f.d,
                    voucherNo: 'OPENING',
                    bill: f.initialBalance > 0 ? f.initialBalance : 0,
                    paid: f.initialBalance < 0 ? Math.abs(f.initialBalance) : 0,
                    prevDue: 0,
                    currentDue: f.initialBalance,
                    notes: 'প্রারম্ভিক ব্যালেন্স (Opening Balance)',
                    createdBy: window.AppState?.currentUserEmail || 'System',
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            });

            auditLog('CREATE', 'Customers', newCustId, f.n, { phone: f.p, zone: f.z, initialBalance: f.initialBalance });

            if (window.loadCustomersForDropdown) await window.loadCustomersForDropdown();
            if (window.loadCustomers) window.loadCustomers();

            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: `কাস্টমার "${f.n}" যুক্ত হয়েছে (ID: ${finalAccountNo})`,
                showConfirmButton: false,
                timer: 3000,
                customClass: { popup: '!bg-slate-900 !text-white border border-slate-700' }
            });

            return newCustId;
        } catch (err) {
            handleError(err, 'কাস্টমার সেভ করা যায়নি');
        }
    }
}
window.quickAddCustomer = quickAddCustomer;
