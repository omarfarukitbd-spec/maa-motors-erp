import Swal from 'sweetalert2';
import { db, firebase } from '../firebase-config.js';
import { CustomerDAO, TransactionDAO, SettingsDAO } from '../dao.js';
import { parseAmount, formatAmountWithComma, formatAppDate, toDBDate, safeRound, promptSecurityPin, sendSMS, showToast, handleError, resetLiveWords } from '../utils.js';
import { AppState } from '../state.js';
import { getCustomerCache } from '../customer/index.js';

export async function saveTransaction(editingRef = {}, callbacks = {}) {
    const mainBtn = document.getElementById('save-txn-btn');
    const sel = document.getElementById('ledger-customer-select');
    if (!sel || !sel.value) return Swal.fire('Error', 'কাস্টমার সিলেক্ট করুন', 'error');
    const id = sel.value; const name = sel.options[sel.selectedIndex].text.replace(/\s*\([^)]*\)\s*$/, '').trim();
    const date = toDBDate(document.getElementById('ledger-date').value);
    const v = document.getElementById('ledger-voucher').value.trim();
    const b = parseAmount(document.getElementById('ledger-bill').value);
    const p = parseAmount(document.getElementById('ledger-paid').value);
    if(b === 0 && p === 0) return Swal.fire('Error', 'বিল বা জমা দিন', 'error');
    if (mainBtn) { mainBtn.disabled = true; mainBtn.innerText = 'প্রসেসিং...'; }
    let receivedType = '', receivedFrom = '';
    if (p > 0) {
        const cashBtn = document.getElementById('recv-cash-btn'); const lessBtn = document.getElementById('recv-less-btn');
        if (lessBtn?.classList.contains('bg-blue-600')) receivedType = 'Less';
        else if (cashBtn?.classList.contains('bg-blue-600')) receivedType = 'Cash';
        else receivedType = 'Bank';
        receivedFrom = document.getElementById('ledger-received-from')?.value?.trim() || '';
    }
    const confirmPreview = await Swal.fire({
        title: '<div class="flex items-center justify-center gap-2 font-bn font-black text-xl text-white"><i class="fa-solid fa-file-shield text-blue-400"></i><span>লেনদেন যাচাই করুন</span></div>',
        html: `
            <div class="text-left space-y-3 font-bn p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-inner">
                <div class="flex flex-col gap-1 border-b border-slate-800/80 pb-2">
                    <span class="text-[10px] text-blue-400 font-black uppercase tracking-wider">কাস্টমারের নাম</span>
                    <span class="text-base text-white font-black">${name}</span>
                </div>
                <div class="grid grid-cols-2 gap-4 border-b border-slate-800/80 pb-2">
                    <div class="flex flex-col gap-1"><span class="text-[10px] text-blue-400 font-black uppercase tracking-wider">তারিখ</span><span class="text-sm text-slate-200 font-bold font-mono">${formatAppDate(date)}</span></div>
                    <div class="flex flex-col gap-1"><span class="text-[10px] text-amber-400 font-black uppercase tracking-wider">ভাউচার / মেমো নং</span><span class="text-sm text-amber-400 font-bold font-mono">${v || '-'}</span></div>
                </div>
                <div class="grid grid-cols-2 gap-4 border-b border-slate-800/80 pb-2">
                    <div class="flex flex-col gap-1"><span class="text-[10px] text-blue-400 font-black uppercase tracking-wider">বিল / কেনাকাটা</span><span class="text-lg text-blue-400 font-black font-mono">৳ ${formatAmountWithComma(b)}</span></div>
                    <div class="flex flex-col gap-1"><span class="text-[10px] text-emerald-400 font-black uppercase tracking-wider">জমা প্রাপ্তি</span><span class="text-lg text-emerald-400 font-black font-mono">৳ ${formatAmountWithComma(p)}</span></div>
                </div>
                ${p > 0 ? `<div class="flex flex-col gap-1 border-b border-slate-800/80 pb-2"><span class="text-[10px] text-purple-400 font-black uppercase tracking-wider">পেমেন্ট মাধ্যম</span><span class="text-xs text-purple-300 font-bold">${receivedType} ${receivedFrom ? '(' + receivedFrom + ')' : ''}</span></div>` : ''}
            </div>
            <p class="text-xs text-amber-400 font-bold mt-3 text-center">সব তথ্য সঠিক থাকলে "কনফার্ম করুন" বাটনে ক্লিক করুন।</p>
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
    if (!confirmPreview.isConfirmed) { if (mainBtn) { mainBtn.disabled = false; mainBtn.innerText = 'এন্ট্রি সেভ করুন'; } return; }
    try {
        let preCommitCust = getCustomerCache().find(c => c.id === id);
        try { const liveCust = await CustomerDAO.getById(id); if (liveCust) preCommitCust = liveCust; } catch (e) { console.warn('Live fetch failed', e); }
        const preCommitDue = preCommitCust ? (Number(preCommitCust.totalDue) || 0) : 0;

        const batch = db.batch(); const balanceDiff = safeRound(b - p);
        let actualDelta = balanceDiff;
        if(editingRef.id) {
            const oldDiff = safeRound((editingRef.oldBill || 0) - (editingRef.oldPaid || 0)); const netIncrement = safeRound(balanceDiff - oldDiff);
            actualDelta = netIncrement;
            batch.update(TransactionDAO.getRef(editingRef.id), { date, voucherNo: v, bill: b, paid: p, receivedType, receivedFrom, currentDue: firebase.firestore.FieldValue.increment(netIncrement) });
            batch.update(CustomerDAO.getRef(id), { totalDue: firebase.firestore.FieldValue.increment(netIncrement) });
            editingRef.id = null;
        } else {
            const txnRef = TransactionDAO.getRef();
            batch.set(txnRef, { customerId: id, customerName: name, date, voucherNo: v, bill: safeRound(b), paid: safeRound(p), receivedType, receivedFrom, prevDue: safeRound(preCommitDue), currentDue: safeRound(preCommitDue + balanceDiff), createdBy: AppState?.currentUserEmail || 'Unknown', createdAt: firebase.firestore.FieldValue.serverTimestamp() });
            batch.update(CustomerDAO.getRef(id), { totalDue: firebase.firestore.FieldValue.increment(balanceDiff) });
        }
        
        const finalSmsDue = safeRound(preCommitDue + actualDelta);
        await batch.commit();
        showToast('লেনদেন সফলভাবে সেভ হয়েছে!', 'success');

        // --- KHATIYAN TRANSACTION SMS WORKFLOW ---
        try {
            const currentCust = getCustomerCache().find(c => c.id === id);
            const phone = currentCust?.phone;
            if (phone && phone.trim() !== '' && phone !== '-') {
                const settings = await SettingsDAO.getAppSettings();
                const formattedDate = formatAppDate(date);
                const englishName = (typeof window.toBanglishName === 'function' ? window.toBanglishName(name) : name) || 'Customer';
                const shopName = settings.shopName ? (typeof window.toBanglishName === 'function' ? window.toBanglishName(settings.shopName) : settings.shopName) : 'M/S. Maa Motors';
                const netDue = finalSmsDue;
                const formattedDue = formatAmountWithComma(Math.abs(netDue));

                let autoMsg = '';
                if (b > 0) {
                    let tpl = settings.smsTemplateNew || 'Dear [Name], Memo #[Memo] of Tk [Bill] created on [Date]. Paid: Tk [Paid], Due: Tk [Due]. Thanks! - [Shop]';
                    autoMsg = tpl.replace(/\[Name\]/g, englishName)
                        .replace(/\[Shop\]/g, shopName)
                        .replace(/\[Date\]/g, formattedDate)
                        .replace(/\[Memo\]/g, v || '1')
                        .replace(/\[Bill\]/g, formatAmountWithComma(b))
                        .replace(/\[Paid\]/g, formatAmountWithComma(p))
                        .replace(/\[Due\]/g, formattedDue);
                } else {
                    let tpl = settings.smsTemplatePaid || 'Dear [Name], Received Tk [Paid] ([Type]) on [Date]. Net Due: Tk [Due]. Thanks! - [Shop]';
                    autoMsg = tpl.replace(/\[Name\]/g, englishName)
                        .replace(/\[Shop\]/g, shopName)
                        .replace(/\[Date\]/g, formattedDate)
                        .replace(/\[Paid\]/g, formatAmountWithComma(p))
                        .replace(/\[Type\]/g, receivedType || 'Cash')
                        .replace(/\[Due\]/g, formattedDue);
                }
                autoMsg = autoMsg.replace(/\s+/g, ' ').replace(/[^\x00-\x7F]/g, '');

                const { value: text, isConfirmed } = await Swal.fire({
                    title: '<div class="flex flex-col items-center gap-2"><i class="fa-solid fa-comment-sms text-emerald-400 text-3xl mb-1"></i><span class="font-bn font-black text-xl text-white">Transaction SMS Preview</span></div>',
                    html: `<div class="text-left space-y-2 mb-2 font-bn">
                            <p class="text-[13px] text-slate-300">কাস্টমারকে কি লেনদেনের মেসেজ পাঠাতে চান? চাইলে নিচের লেখা এডিট করতে পারেন:</p>
                            <div class="flex justify-between items-center"><div class="text-xs text-slate-400">Recipient Phone: <strong class="text-white">${phone}</strong></div><div id="sms-txn-char-counter" class="text-[11px] font-bold text-emerald-400 text-right">0 / 160 Characters (1 SMS)</div></div>
                           </div>`,
                    input: 'textarea', inputValue: autoMsg, inputAttributes: { rows: 4, class: 'm3-field text-xs font-mono !mt-0' },
                    showCancelButton: true, confirmButtonText: '<i class="fa-solid fa-paper-plane mr-1.5"></i> পাঠিয়ে দিন', cancelButtonText: 'স্কিপ করুন',
                    customClass: { popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-700 shadow-2xl', confirmButton: 'm3-btn-primary !bg-emerald-600 hover:!bg-emerald-500 !px-7 !py-2.5 !rounded-xl font-bold shadow-lg shadow-emerald-600/30', cancelButton: 'm3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-5 !py-2.5 !rounded-xl font-bold border border-slate-700' },
                    didOpen: () => {
                        const textarea = Swal.getInput(); const counter = document.getElementById('sms-txn-char-counter');
                        const updateCount = () => {
                            if (textarea && counter) {
                                const len = textarea.value.length;
                                const parts = Math.ceil(len / 160) || 1;
                                counter.innerText = `${len} / 160 Characters (${parts} SMS)`;
                            }
                        };
                        if (textarea) {
                            textarea.oninput = updateCount; updateCount();
                            setTimeout(() => textarea.focus(), 150);
                        }
                    }
                });

                if (isConfirmed && text) {
                    const success = await sendSMS(phone, text, false);
                    if (success) {
                        showToast('এসএমএস সফলভাবে পাঠানো হয়েছে', 'success');
                    }
                }
            }
        } catch (autoErr) { console.warn('Transaction SMS dispatch error:', autoErr); }

        document.getElementById('ledger-bill').value = ''; document.getElementById('ledger-paid').value = '';
        resetLiveWords('ledger-bill-words');
        resetLiveWords('ledger-paid-words');
        const vEl = document.getElementById('ledger-voucher'); if (vEl) vEl.value = '';
        const rfEl = document.getElementById('ledger-received-from'); if (rfEl) rfEl.value = '';
        if (callbacks.filterLedgerByCustomer) callbacks.filterLedgerByCustomer(id);
        setTimeout(() => { document.getElementById('ledger-bill')?.focus(); }, 150);
    } catch(e) { handleError(e, 'লেনদেন সেভ করতে ব্যর্থ'); }
    finally { if (mainBtn) { mainBtn.disabled = false; mainBtn.innerText = 'এন্ট্রি সেভ করুন'; mainBtn.className = 'm3-btn-primary rounded-xl h-10 px-8 text-xs font-bold shadow-md shadow-blue-600/20'; } }
}

export async function editTransaction(id, cid, date, v, b, p, rt, rf, editingRef = {}) {
    if (!(await promptSecurityPin("খতিয়ান এডিট (Authorization)"))) return;
    editingRef.id = id; editingRef.oldBill = b; editingRef.oldPaid = p;
    if (document.getElementById('ledger-customer-select')) document.getElementById('ledger-customer-select').value = cid;
    if (document.getElementById('ledger-date')) document.getElementById('ledger-date').value = date;
    if (document.getElementById('ledger-voucher')) document.getElementById('ledger-voucher').value = v;
    if (document.getElementById('ledger-bill')) document.getElementById('ledger-bill').value = b;
    if (document.getElementById('ledger-paid')) document.getElementById('ledger-paid').value = p;
    if (window.setReceivedType) window.setReceivedType(rt);
    if (document.getElementById('ledger-received-from')) document.getElementById('ledger-received-from').value = rf;
    if (window.updateLedgerLiveText) window.updateLedgerLiveText();
    if (window.toggleReceivedSection) window.toggleReceivedSection();
    
    const btn = document.getElementById('save-txn-btn');
    if (btn) { 
        btn.innerHTML = '<i class="fa-solid fa-pen-to-square mr-1.5"></i>আপডেট সংশোধন করুন'; 
        btn.className = 'm3-btn-primary rounded-xl h-10 px-8 text-xs font-bold shadow-md !bg-amber-600 hover:!bg-amber-500'; 
    }

    const viewContainer = document.getElementById('view-container');
    const formCard = document.getElementById('ledger-form-card') || document.getElementById('ledger-customer-select');
    
    if (viewContainer) viewContainer.scrollTo({ top: 0, behavior: 'smooth' });
    if (formCard) formCard.scrollIntoView({ behavior: 'smooth', block: 'start' });

    setTimeout(() => { 
        const billInput = document.getElementById('ledger-bill');
        if (billInput) { billInput.focus(); if (billInput.select) billInput.select(); }
    }, 350);
}

export async function deleteTransaction(id, cid, b, p, callbacks = {}) {
    if (await promptSecurityPin("Delete")) {
        const batch = db.batch();
        batch.update(CustomerDAO.getRef(cid), { totalDue: firebase.firestore.FieldValue.increment(safeRound(p - b)) });
        batch.delete(TransactionDAO.getRef(id));
        await batch.commit();
        showToast('লেনদেন ডিলেট করা হয়েছে!', 'info');
        if (callbacks.filterLedgerByCustomer) callbacks.filterLedgerByCustomer(cid);
    }
}
