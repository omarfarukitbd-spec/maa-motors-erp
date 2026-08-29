import Swal from 'sweetalert2';
import { db, firebase } from '../firebase-config.js';
import { CustomerDAO, TransactionDAO, SettingsDAO } from '../dao.js';
import { parseAmount, formatAmountWithComma, formatAppDate, formatSmsCounterText, buildSmsMessage, toDBDate, safeRound, promptSecurityPin, sendSMS, showToast, handleError, resetLiveWords } from '../utils.js';
import { AppState } from '../state.js';
import { getCustomerCache } from '../customer/index.js';
import { auditLog } from '../audit.js';
import { showTransactionConfirmModal } from './ledger-confirm-modal.js';

export async function saveTransaction(editingRef = {}, callbacks = {}, stateRefs = {}) {
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
        if (lessBtn?.classList.contains('bg-emerald-600') || lessBtn?.classList.contains('bg-blue-600')) receivedType = 'Less';
        else if (cashBtn?.classList.contains('bg-emerald-600') || cashBtn?.classList.contains('bg-blue-600')) receivedType = 'Cash';
        else receivedType = 'Bank';
        receivedFrom = document.getElementById('ledger-received-from')?.value?.trim() || '';
    }

    // --- DUPLICATE & MULTIPLE ENTRY SHIELD ---
    let dateTxns = [];
    try {
        const snap = await TransactionDAO.collection.where('customerId', '==', id).where('date', '==', date).get();
        snap.forEach(doc => {
            if (!editingRef.id || doc.id !== editingRef.id) {
                dateTxns.push({ id: doc.id, ...doc.data() });
            }
        });
    } catch (err) {
        console.warn("Date txns fetch error:", err);
        dateTxns = (stateRefs?.currentLedgerTxns || []).filter(t => {
            const tDate = toDBDate(t.date || t.createdAt);
            return tDate === date && String(t.customerId || '') === id && (!editingRef.id || t.id !== editingRef.id);
        });
    }

    let duplicateReasons = [];
    if (dateTxns.length > 0) {
        if (b > 0) {
            const sameBill = dateTxns.find(t => Number(t.bill || 0) === b);
            if (sameBill) {
                duplicateReasons.push(`এই তারিখে একই অংকের বিল (৳ ${formatAmountWithComma(b)}) ইতিমধ্যে রেকর্ড আছে (ভাউচার: #${sameBill.voucherNo || '-'})${sameBill.notes ? ' - ' + sameBill.notes : ''}।`);
            }
        }
        if (p > 0) {
            const samePaid = dateTxns.find(t => Number(t.paid || 0) === p);
            if (samePaid) {
                duplicateReasons.push(`এই তারিখে একই অংকের জমা (৳ ${formatAmountWithComma(p)}) ইতিমধ্যে রেকর্ড আছে (${samePaid.receivedType || 'পেমেন্ট'} ${samePaid.receivedFrom ? '-' + samePaid.receivedFrom : ''})।`);
            }
            const prevDeposits = dateTxns.filter(t => Number(t.paid || 0) > 0);
            if (prevDeposits.length > 0 && !samePaid) {
                const totPrevPaid = prevDeposits.reduce((sum, item) => sum + (Number(item.paid) || 0), 0);
                duplicateReasons.push(`এই তারিখে এই কাস্টমারের পূর্বে আরও ${prevDeposits.length}টি জমা রয়েছে (মোট জমা: ৳ ${formatAmountWithComma(totPrevPaid)})।`);
            }
        }
    }

    if (duplicateReasons.length > 0) {
        const warnConfirm = await Swal.fire({
            title: '<div class="flex items-center justify-center gap-2 font-bn font-black text-lg text-amber-400"><i class="fa-solid fa-triangle-exclamation"></i><span>সম্ভাব্য ডাবল এন্ট্রি সতর্কবার্তা!</span></div>',
            html: `
                <div class="text-left space-y-2.5 font-bn p-3 bg-slate-900/90 rounded-2xl border border-amber-500/30">
                    <p class="text-xs text-slate-200 font-bold">এই কাস্টমারের অ্যাকাউন্টে এই তারিখে (<span class="font-mono text-blue-400">${formatAppDate(date)}</span>) লেনদেন পাওয়া গেছে:</p>
                    <ul class="list-disc list-inside space-y-1 text-xs text-amber-300 font-bold bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                        ${duplicateReasons.map(r => `<li>${r}</li>`).join('')}
                    </ul>
                    <div class="bg-slate-950 p-2 rounded-xl border border-slate-800 text-xs">
                        <span class="text-[10px] text-blue-400 font-bold block uppercase">এখন নতুন যা এন্ট্রি করতে যাচ্ছেন:</span>
                        ${b > 0 ? `<div class="text-red-400 font-bold">বিল: ৳ ${formatAmountWithComma(b)}</div>` : ''}
                        ${p > 0 ? `<div class="text-emerald-400 font-bold">জমা: ৳ ${formatAmountWithComma(p)} ${receivedType ? '(' + receivedType + (receivedFrom ? ' - ' + receivedFrom : '') + ')' : ''}</div>` : ''}
                    </div>
                    <p class="text-xs text-slate-300 font-bold text-center">ভুল এন্ট্রি রোধ করতে নিশ্চিত করুন — আপনি কি এটি সেভ করতে চান?</p>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: '<i class="fa-solid fa-circle-check mr-1.5"></i>হ্যাঁ, নিশ্চিতভাবে সেভ করব',
            cancelButtonText: '<i class="fa-solid fa-pen-to-square mr-1.5"></i>না, সংশোধন করব',
            confirmButtonColor: '#f59e0b',
            cancelButtonColor: '#64748b',
            customClass: { popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn' }
        });

        if (!warnConfirm.isConfirmed) {
            if (mainBtn) { mainBtn.disabled = false; mainBtn.innerText = 'এন্ট্রি সেভ করুন'; }
            return;
        }
    }

    let preCommitCust = getCustomerCache().find(c => c.id === id);
    try { const liveCust = await CustomerDAO.getById(id); if (liveCust) preCommitCust = liveCust; } catch (e) { console.warn('Live fetch failed', e); }
    const preCommitDue = preCommitCust ? (Number(preCommitCust.totalDue) || 0) : 0;

    const confirmResult = await showTransactionConfirmModal({
        customer: preCommitCust || { name, id },
        date,
        voucherNo: v,
        bill: b,
        paid: p,
        receivedType,
        receivedFrom,
        preCommitDue,
        editingRef
    });

    if (!confirmResult.isConfirmed) {
        if (mainBtn) { mainBtn.disabled = false; mainBtn.innerText = 'এন্ট্রি সেভ করুন'; }
        return;
    }

    try {
        const batch = db.batch(); const balanceDiff = safeRound(b - p);
        let actualDelta = balanceDiff;
        let txnRef = null;
        if(editingRef.id) {
            const oldDiff = safeRound((editingRef.oldBill || 0) - (editingRef.oldPaid || 0));
            const oldCid = editingRef.oldCid || id;
            if (oldCid !== id) {
                batch.update(TransactionDAO.getRef(editingRef.id), { customerId: id, customerName: name, date, voucherNo: v, bill: safeRound(b), paid: safeRound(p), receivedType, receivedFrom, currentDue: safeRound(preCommitDue + balanceDiff) });
                batch.update(CustomerDAO.getRef(oldCid), { totalDue: firebase.firestore.FieldValue.increment(-oldDiff) });
                batch.update(CustomerDAO.getRef(id), { totalDue: firebase.firestore.FieldValue.increment(balanceDiff) });
                actualDelta = balanceDiff;
            } else {
                const netIncrement = safeRound(balanceDiff - oldDiff);
                actualDelta = netIncrement;
                batch.update(TransactionDAO.getRef(editingRef.id), { date, voucherNo: v, bill: safeRound(b), paid: safeRound(p), receivedType, receivedFrom, currentDue: firebase.firestore.FieldValue.increment(netIncrement) });
                batch.update(CustomerDAO.getRef(id), { totalDue: firebase.firestore.FieldValue.increment(netIncrement) });
            }
            auditLog('UPDATE', 'Ledger', editingRef.id, name, { oldBill: editingRef.oldBill, oldPaid: editingRef.oldPaid, newBill: b, newPaid: p });
            editingRef.id = null;
            editingRef.oldCid = null;
        } else {
            txnRef = TransactionDAO.getRef();
            batch.set(txnRef, { customerId: id, customerName: name, date, voucherNo: v, bill: safeRound(b), paid: safeRound(p), receivedType, receivedFrom, prevDue: safeRound(preCommitDue), currentDue: safeRound(preCommitDue + balanceDiff), createdBy: AppState?.currentUserEmail || 'Unknown', createdAt: firebase.firestore.FieldValue.serverTimestamp() });
            batch.update(CustomerDAO.getRef(id), { totalDue: firebase.firestore.FieldValue.increment(balanceDiff) });
            auditLog('CREATE', 'Ledger', txnRef.id, name, { bill: b, paid: p, type: receivedType || 'Bill' });
        }
        
        const finalSmsDue = safeRound(preCommitDue + actualDelta);
        const savedTxnId = editingRef.id || txnRef?.id;
        await batch.commit();
        showToast('লেনদেন সফলভাবে সেভ হয়েছে!', 'success');

        // --- INSTANT POST-ACTIONS FROM CONFIRM MODAL ---
        if (confirmResult.sendWhatsApp && window.sendTxnWhatsApp && savedTxnId) {
            setTimeout(() => { window.sendTxnWhatsApp(savedTxnId); }, 350);
        }
        if (confirmResult.openPrint && window.choosePrintType && savedTxnId) {
            setTimeout(() => { window.choosePrintType(savedTxnId); }, 650);
        }

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

                const accountNo = currentCust?.accountNo || '';
                const accStr = accountNo ? `(A/C: ${accountNo})` : '';

                let autoMsg = '';
                if (b > 0) {
                    autoMsg = buildSmsMessage(settings.smsTemplateNew, 'Dear [Name] [AccNo], Memo #[Memo] of Tk [Bill] created on [Date]. Paid: Tk [Paid], Due: Tk [Due]. Thanks! - [Shop]', { name: englishName, accountNo, shopName, date: formattedDate, memo: v, bill: formatAmountWithComma(b), paid: formatAmountWithComma(p), due: formattedDue });
                } else {
                    autoMsg = buildSmsMessage(settings.smsTemplatePaid, 'We have received your payment of Tk [Paid] on [Date]. Your updated due is Tk [Due]. Thank you for staying with us! - [Shop]', { name: englishName, accountNo, shopName, date: formattedDate, paid: formatAmountWithComma(p), type: receivedType || 'Cash', due: formattedDue });
                }

                const { value: text, isConfirmed } = await Swal.fire({
                    title: '<div class="flex flex-col items-center gap-2"><i class="fa-solid fa-comment-sms text-emerald-400 text-3xl mb-1"></i><span class="font-bn font-black text-xl text-white">Transaction SMS Preview</span></div>',
                    html: `<div class="text-left space-y-2 mb-2 font-bn"><p class="text-[13px] text-slate-300">কাস্টমারকে কি লেনদেনের মেসেজ পাঠাতে চান? চাইলে নিচের লেখা এডিট করতে পারেন:</p><div class="flex justify-between items-center"><div class="text-xs text-slate-400">Recipient Phone: <strong class="text-white">${phone}</strong></div><div id="sms-txn-char-counter" class="text-[11px] font-bold text-emerald-400 text-right">${formatSmsCounterText(autoMsg)}</div></div></div>`,
                    input: 'textarea', inputValue: autoMsg, inputAttributes: { rows: 4, class: 'm3-field text-xs font-mono !mt-0' },
                    showCancelButton: true, confirmButtonText: '<i class="fa-solid fa-paper-plane mr-1.5"></i> পাঠিয়ে দিন', cancelButtonText: 'স্কিপ করুন',
                    customClass: { popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-700 shadow-2xl', confirmButton: 'm3-btn-primary !bg-emerald-600 hover:!bg-emerald-500 !px-7 !py-2.5 !rounded-xl font-bold shadow-lg shadow-emerald-600/30', cancelButton: 'm3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-5 !py-2.5 !rounded-xl font-bold border border-slate-700' },
                    didOpen: () => {
                        const textarea = Swal.getInput(); const counter = document.getElementById('sms-txn-char-counter');
                        const updateCount = () => { if (textarea && counter) counter.innerText = formatSmsCounterText(textarea.value); };
                        if (textarea) { textarea.oninput = updateCount; updateCount(); setTimeout(() => textarea.focus(), 150); }
                    }
                });

                if (isConfirmed && text) {
                    const success = await sendSMS(phone, text, false);
                    if (success) showToast('এসএমএস সফলভাবে পাঠানো হয়েছে', 'success');
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
    editingRef.id = id; editingRef.oldCid = cid; editingRef.oldBill = b; editingRef.oldPaid = p;
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
        try {
            Swal.fire({ title: 'ডিলিট হচ্ছে...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
            const txnDoc = await TransactionDAO.getById(id);
            if (!txnDoc) throw new Error("Transaction not found");

            const batch = db.batch();
            
            // 1. Decrease Customer Due
            batch.update(CustomerDAO.getRef(cid), { totalDue: firebase.firestore.FieldValue.increment(safeRound(p - b)) });
            
            // 2. Move to Recycle Bin
            batch.set(db.collection('recycle_bin').doc(id), {
                module: 'Transaction',
                data: txnDoc,
                deletedAt: firebase.firestore.FieldValue.serverTimestamp(),
                deletedBy: window.AppState?.currentUserEmail || 'Unknown'
            });

            // 3. Delete original
            batch.delete(TransactionDAO.getRef(id));
            
            await batch.commit();
            
            auditLog('DELETE', 'Ledger', id, txnDoc.customerName || cid, { bill: b, paid: p, action: 'Soft Delete to Recycle Bin' });
            showToast('ভাউচার রিসাইকেল বিনে মুভ করা হয়েছে!', 'info');
            Swal.close();
            if (callbacks.filterLedgerByCustomer) callbacks.filterLedgerByCustomer(cid);
        } catch (e) {
            console.error("deleteTransaction error:", e);
            Swal.fire('ত্রুটি', 'ভাউচার ডিলিট করা সম্ভব হয়নি।', 'error');
        }
    }
}
