import { TreasuryDAO } from './treasury-dao.js';
import { findTreasuryDuplicate } from './treasury-calc.js';
import { getDailyCollectionModalConfig, getDailyExpenseModalConfig, getSpecialTransactionModalConfig, getOpeningFundModalConfig } from './treasury-modals.js';
import { formatAmountWithComma, getTodayLocalDateString, formatAppDate, safeRound, showToast, promptSecurityPin } from '../utils.js';
import { auditLog } from '../audit/audit-logger.js';

/**
 *  Treasury Action Handlers & Business Logic Controller
 */

export function setupTreasuryActions(getState) {
    // 1. Quick Daily Collection
    window.treasuryOpenDailyCollection = async () => {
        const today = getTodayLocalDateString();
        let suggestedAmount = 0;

        try {
            const snap = await firebase.firestore().collection('transactions').where('date', '==', today).get();
            snap.forEach(doc => {
                const t = doc.data();
                suggestedAmount = safeRound(suggestedAmount + (Number(t.paid) || 0));
            });
        } catch (e) {
            console.warn('ERP collection suggest fallback:', e);
        }

        const config = getDailyCollectionModalConfig(today, suggestedAmount);
        const { value: formValues } = await Swal.fire(config);

        if (formValues) {
            await saveTreasuryItemWithDuplicateCheck({
                title: 'দৈনিক কালেকশন',
                type: 'inflow',
                category: 'collection',
                amount: formValues.amount,
                date: formValues.date,
                note: formValues.note || 'দৈনিক শোরুম কালেকশন'
            }, getState);
        }
    };

    // 2. Quick Daily Expense
    window.treasuryOpenDailyExpense = async () => {
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

    // 3. Special Custom Transaction
    window.treasuryOpenSpecialTransaction = async (editItem = null) => {
        const today = getTodayLocalDateString();
        const isEdit = Boolean(editItem && editItem.id);
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

    // 4. Opening Fund Balance
    window.treasuryEditOpeningFund = async () => {
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
                await TreasuryDAO.deleteTransaction(id);
                auditLog('DELETE', 'Treasury', id, title, { amount });
                showToast('লেনদেনটি মুছে ফেলা হয়েছে এবং ব্যালেন্স রিক্যালকুলেট করা হয়েছে!', 'success');
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
            await TreasuryDAO.updateTransaction(duplicate.id, payload);
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
