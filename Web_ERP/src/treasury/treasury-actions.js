// ALLOW_LARGE_FILE: Treasury Actions & Logic Controller
import { db, firebase } from '../firebase-config.js';
import { TreasuryDAO } from './treasury-dao.js';
import { TransactionDAO } from '../dao.js';
import { findTreasuryDuplicate } from './treasury-calc.js';
import { getDailyCollectionModalConfig, getDailyExpenseModalConfig, getSpecialTransactionModalConfig, getOpeningFundModalConfig } from './treasury-modals.js';
import { openBankSyncModal } from './treasury-bank-sync.js';
import { formatAmountWithComma, getTodayLocalDateString, formatAppDate, safeRound, showToast, promptSecurityPin, toDBDate, ensureOnline } from '../utils.js';
import { auditLog } from '../audit/audit-logger.js';

/**
 *  Treasury Action Handlers & Business Logic Controller
 */

export function setupTreasuryActions(getState) {
    // 1. Quick Daily Collection
    window.treasuryOpenDailyCollection = async () => {
        if (!ensureOnline('দৈনিক কালেকশন এন্ট্রি')) return;
        const today = getTodayLocalDateString();
        let suggestedCashAmount = 0;
        let suggestedBankAmount = 0;

        try {
            const snap = await TransactionDAO.collection.where('date', '==', today).get();
            snap.forEach(doc => {
                const t = doc.data();
                if (t.voucherNo !== 'OPENING') {
                    if (String(t.receivedType || '').trim() === 'Less') return;
                    const p = Number(t.paid) || 0;
                    if (t.receivedType === 'Bank') {
                        suggestedBankAmount = safeRound(suggestedBankAmount + p);
                    } else {
                        suggestedCashAmount = safeRound(suggestedCashAmount + p);
                    }
                }
            });
        } catch (e) {
            console.warn('ERP collection suggest fallback:', e);
        }

        const total = safeRound(suggestedCashAmount + suggestedBankAmount);
        const config = getDailyCollectionModalConfig(today, {
            total,
            cash: suggestedCashAmount,
            bank: suggestedBankAmount
        });
        const { value: formValues } = await Swal.fire(config);

        if (formValues) {
            await saveTreasuryItemWithDuplicateCheck({
                title: 'দৈনিক কালেকশন',
                type: 'inflow',
                category: 'collection',
                amount: formValues.amount,
                date: formValues.date,
                note: formValues.note || `${formatAppDate(formValues.date)} শোরুম ও ব্যাংক আদায়`
            }, getState);
        }
    };

    // Auto fetch collection on date change
    window.treasuryFetchCollectionForSelectedDate = async (dateVal) => {
        const infoEl = document.getElementById('tr-col-info');
        const amtEl = document.getElementById('tr-col-amount');
        if (!dateVal) return;
        const dbDate = toDBDate(dateVal);
        if (infoEl) infoEl.innerHTML = '<span class="text-amber-400 font-bold"><i class="fa-solid fa-spinner fa-spin mr-1"></i>ইআরপি থেকে কালেকশন খোঁজা হচ্ছে...</span>';

        try {
            let cashTotal = 0;
            let bankTotal = 0;
            const snap = await TransactionDAO.collection.where('date', '==', dbDate).get();
            snap.forEach(doc => {
                const t = doc.data();
                if (t.voucherNo !== 'OPENING') {
                    if (String(t.receivedType || '').trim() === 'Less') return;
                    const p = Number(t.paid) || 0;
                    if (t.receivedType === 'Bank') {
                        bankTotal = safeRound(bankTotal + p);
                    } else {
                        cashTotal = safeRound(cashTotal + p);
                    }
                }
            });

            if (cashTotal === 0 && bankTotal === 0) {
                const altDate = formatAppDate(dbDate);
                if (altDate !== dbDate) {
                    const snap2 = await TransactionDAO.collection.where('date', '==', altDate).get();
                    snap2.forEach(doc => {
                        const t = doc.data();
                        if (t.voucherNo !== 'OPENING') {
                            if (String(t.receivedType || '').trim() === 'Less') return;
                            const p = Number(t.paid) || 0;
                            if (t.receivedType === 'Bank') {
                                bankTotal = safeRound(bankTotal + p);
                            } else {
                                cashTotal = safeRound(cashTotal + p);
                            }
                        }
                    });
                }
            }

            const total = safeRound(cashTotal + bankTotal);
            window._currentCollectionBreakdown = { total, cash: cashTotal, bank: bankTotal };

            // Update pill values in UI
            const pillValTotal = document.getElementById('tr-pill-val-total');
            const pillValCash = document.getElementById('tr-pill-val-cash');
            const pillValBank = document.getElementById('tr-pill-val-bank');
            if (pillValTotal) pillValTotal.innerText = `৳ ${formatAmountWithComma(total)}`;
            if (pillValCash) pillValCash.innerText = `৳ ${formatAmountWithComma(cashTotal)}`;
            if (pillValBank) pillValBank.innerText = `৳ ${formatAmountWithComma(bankTotal)}`;

            if (total > 0) {
                const activeType = window._currentCollectionSelectedType || 'total';
                if (window.treasurySelectCollectionType) {
                    window.treasurySelectCollectionType(activeType);
                }
            } else {
                if (amtEl && (!amtEl.value || amtEl.value === '0')) {
                    amtEl.value = '';
                }
                if (infoEl) infoEl.innerHTML = `<span class="text-slate-400"><i class="fa-solid fa-circle-info text-blue-400 mr-1"></i>${formatAppDate(dbDate)} তারিখে ইআরপিতে কোনো কালেকশন এন্ট্রি নেই। খাতা দেখে সরাসরি হাত দিয়ে টাকার অংক লিখুন।</span>`;
            }
        } catch (e) {
            console.error('Fetch collection for date error:', e);
            if (infoEl) infoEl.innerHTML = `<span class="text-red-400 text-[10px]"><i class="fa-solid fa-triangle-exclamation mr-1"></i>কালেকশন ফেচ এরর: ${e.message || 'ব্যর্থ'}</span>`;
        }
    };

    // 2. Quick Daily Expense
    window.treasuryOpenDailyExpense = async () => {
        if (!ensureOnline('দৈনিক খরচ এন্ট্রি')) return;
        const today = getTodayLocalDateString();
        const config = getDailyExpenseModalConfig(today);
        const { value: formValues } = await Swal.fire(config);

        if (formValues) {
            if (formValues.amount > 100000) {
                const confirmBig = await Swal.fire({
                    title: 'অতিরিক্ত খরচের সতর্কবার্তা!',
                    html: `আপনি দৈনিক খরচ হিসেবে <strong>৳ ${formatAmountWithComma(formValues.amount)}</strong> লিখেছেন।<br>সংখ্যাটি কি শতভাগ সঠিক?`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'হ্যাঁ, সঠিক',
                    cancelButtonText: 'চেক করব',
                    customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' }
                });
                if (!confirmBig.isConfirmed) return;
            }

            await saveTreasuryItemWithDuplicateCheck({
                title: 'দৈনিক খরচ',
                type: 'outflow',
                category: 'daily_expense',
                amount: formValues.amount,
                date: formValues.date,
                note: formValues.note || 'অফলাইন খাতার দৈনিক মোট খরচ'
            }, getState);
        }
    };

    // 3. Special Custom Transaction (or Edit Transaction)
    window.treasuryOpenSpecialTransaction = async (editItem = null) => {
        const isEdit = Boolean(editItem && editItem.id);
        if (!ensureOnline(isEdit ? 'লেনদেন সংশোধন' : 'বিশেষ লেনদেন এন্ট্রি')) return;
        const today = getTodayLocalDateString();

        if (isEdit) {
            const pinOk = await promptSecurityPin();
            if (!pinOk) return;
        }

        const config = getSpecialTransactionModalConfig(today, isEdit, editItem);
        const { value: formValues } = await Swal.fire(config);

        if (formValues) {
            try {
                if (isEdit) {
                    await TreasuryDAO.updateTransaction(editItem.id, formValues);
                    auditLog('UPDATE', 'Treasury', editItem.id, formValues.title, { old: editItem, new: formValues });
                    showToast('লেনদেন সফলভাবে আপডেট করা হয়েছে!', 'success');
                } else {
                    await TreasuryDAO.addTransaction({ ...formValues, category: 'special' });
                    auditLog('CREATE', 'Treasury', formValues.title, `টাকা: ৳ ${formatAmountWithComma(formValues.amount)}`, formValues);
                    showToast('বিশেষ লেনদেন সফলভাবে রেকর্ড হয়েছে!', 'success');
                }
            } catch (err) {
                console.error('Save special transaction error:', err);
                showToast('লেনদেন সংরক্ষণ করতে সমস্যা হয়েছে!', 'error');
            }
        }
    };

    // 3.5. Quick Bank Fund Sync
    window.treasuryOpenBankSyncModal = async () => {
        if (!ensureOnline('ব্যাংক ফান্ড সিঙ্ক')) return;
        await openBankSyncModal(getState);
    };

    // 4. Opening Fund Balance
    window.treasuryEditOpeningFund = async () => {
        if (!ensureOnline('প্রারম্ভিক তহবিল সংশোধন')) return;
        const pinOk = await promptSecurityPin();
        if (!pinOk) return;

        const currentFund = await TreasuryDAO.getOpeningFund();
        const config = getOpeningFundModalConfig(currentFund);
        const { value: formValues } = await Swal.fire(config);

        if (formValues) {
            try {
                await TreasuryDAO.saveOpeningFund(formValues.openingBalance, formValues.openingDate);
                showToast('প্রারম্ভিক তহবিল সফলভাবে আপডেট হয়েছে!', 'success');
            } catch (err) {
                console.error('Save opening fund error:', err);
                showToast('প্রারম্ভিক তহবিল সংরক্ষণ ব্যর্থ হয়েছে!', 'error');
            }
        }
    };

    // 5. Safe Delete
    window.treasuryDeleteItem = async (id, title, amount) => {
        if (!ensureOnline('ফান্ড লেনদেন মুছে ফেলা')) return;
        const pinOk = await promptSecurityPin();
        if (!pinOk) return;

        const confirm = await Swal.fire({
            title: 'লেনদেন মুছে ফেলবেন?',
            html: `আপনি কি নিশ্চিত যে <strong>"${title}"</strong> (৳ ${formatAmountWithComma(amount)}) লেনদেনটি মুছে ফেলতে চান?<br><small class="text-amber-400">এর ফলে পরবর্তী সমস্ত রানিং ব্যালেন্স স্বয়ংক্রিয়ভাবে রিক্যালকুলেট হবে।</small>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'হ্যাঁ, মুছুন',
            cancelButtonText: 'বাতিল',
            customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' }
        });

        if (confirm.isConfirmed) {
            try {
                const itemDoc = (getState().allTransactions || []).find(t => t.id === id);
                if (itemDoc) {
                    await db.collection('recycle_bin').doc(id).set({
                        module: 'Treasury',
                        data: itemDoc,
                        deletedAt: firebase.firestore.FieldValue.serverTimestamp(),
                        deletedBy: window.AppState?.currentUserEmail || 'Unknown'
                    });
                }
                await TreasuryDAO.deleteTransaction(id);
                auditLog('DELETE', 'Treasury', id, title, { amount, action: 'Soft Delete to Recycle Bin' });
                showToast('লেনদেনটি মুছে রিসাইকেল বিনে ব্যাকআপ রাখা হয়েছে এবং ব্যালেন্স রিক্যালকুলেট হয়েছে!', 'success');
            } catch (err) {
                console.error('Delete treasury item error:', err);
                showToast('মুছতে সমস্যা হয়েছে!', 'error');
            }
        }
    };
}

async function saveTreasuryItemWithDuplicateCheck(payload, getState) {
    const { allTransactions } = getState();
    const duplicate = findTreasuryDuplicate(allTransactions, {
        date: payload.date,
        category: payload.category,
        title: payload.title
    });

    if (duplicate) {
        const result = await Swal.fire({
            title: '<div class="flex items-center justify-center gap-2 text-amber-400 font-bold text-base"><i class="fa-solid fa-triangle-exclamation text-amber-400"></i><span>ডুপ্লিকেট এন্ট্রির সম্ভাবনা!</span></div>',
            html: `
                <div class="text-xs text-left p-2 space-y-2 bg-slate-950/60 rounded-xl border border-amber-500/30">
                    <p><strong>${formatAppDate(payload.date)}</strong> তারিখে ইতিমধ্যে একটি <strong>${payload.title}</strong> এন্ট্রি রয়েছে:</p>
                    <p class="font-mono text-amber-300 font-bold">টাকার পরিমাণ: ৳ ${formatAmountWithComma(duplicate.amount)}</p>
                </div>
                <p class="text-xs text-slate-300 mt-3">আপনি কি পূর্বের এন্ট্রিটি আপডেট করতে চান, নাকি এটি আলাদা কোনো লেনদেন?</p>
            `,
            icon: 'question',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'পূর্বের এন্ট্রি আপডেট করুন',
            denyButtonText: 'আলাদা এন্ট্রি হিসেবে সেভ করুন',
            cancelButtonText: 'বাতিল',
            customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' }
        });

        if (result.isConfirmed) {
            const pinOk = await promptSecurityPin();
            if (!pinOk) return;
            await TreasuryDAO.updateTransaction(duplicate.id, payload);
            auditLog('UPDATE', 'Treasury', duplicate.id, payload.title, { old: duplicate, new: payload });
            showToast('পূর্বের এন্ট্রি সফলভাবে আপডেট করা হয়েছে!', 'success');
            return;
        } else if (!result.isDenied) {
            return;
        }
    }

    try {
        await TreasuryDAO.addTransaction(payload);
        auditLog('CREATE', 'Treasury', payload.title, `টাকা: ৳ ${formatAmountWithComma(payload.amount)}`, payload);
        showToast(`${payload.title} সফলভাবে ফান্ডে যোগ হয়েছে!`, 'success');
    } catch (err) {
        console.error('saveTreasuryItem error:', err);
        showToast('সংরক্ষণ ব্যর্থ হয়েছে!', 'error');
    }
}
