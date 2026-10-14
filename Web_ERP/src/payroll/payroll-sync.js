import { ExpenseDAO } from '../dao.js';
import { promptSecurityPin, showToast, formatAmountWithComma, getTodayLocalDateString } from '../utils.js';
import { getActivePayrollState, savePayrollToCloud } from './payroll-actions.js';

/**
 * 1-Click Sync/Post Paid Payroll & Expense Items to Main ERP Daily Expenses
 */
export async function syncPayrollToDailyExpenses() {
    const state = getActivePayrollState();
    if (!state || !state.sections) {
        showToast('কোনো সক্রিয় বেতন ডাটা পাওয়া যায়নি', 'error');
        return;
    }

    // 1. Gather all paid items that haven't been posted yet
    const unpostedPaidItems = [];
    state.sections.forEach(sec => {
        (sec.items || []).forEach(itm => {
            if (itm.status === 'paid' && Number(itm.amount) > 0 && !itm.isSyncedToExpenses) {
                unpostedPaidItems.push({
                    sectionId: sec.id,
                    sectionTitle: sec.title,
                    ...itm
                });
            }
        });
    });

    if (unpostedPaidItems.length === 0) {
        await Swal.fire({
            title: 'পোস্ট করার মতো নতুন আইটেম নেই',
            text: 'সকল পরিশোধিত বেতন ও খরচের আইটেম ইতোমধ্যে দৈনিক খরচে পোস্ট করা হয়েছে অথবা কোনো পেইড এন্ট্রি নেই।',
            icon: 'info',
            customClass: {
                popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn',
                confirmButton: 'm3-btn-primary !px-6 !py-2 rounded-xl font-bold'
            }
        });
        return;
    }

    const totalSyncAmt = unpostedPaidItems.reduce((acc, i) => acc + (Number(i.amount) || 0), 0);

    // 2. Confirmation prompt
    const confirmResult = await Swal.fire({
        title: '<div class="font-bn font-black text-lg text-white flex items-center justify-center gap-2"><i class="fa-solid fa-cloud-arrow-up text-emerald-400"></i><span>দৈনিক খরচে পোস্টিং নিশ্চিতকরণ</span></div>',
        html: `
            <div class="text-left font-bn space-y-2 p-1 text-xs">
                <p class="text-slate-300">আপনি কি নিম্নের পরিশোধিত আইটেমসমূহ মূল ইআরপির <strong>দৈনিক খরচ (Daily Expenses)</strong> খতিয়ানে যুক্ত করতে চান?</p>
                <div class="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                    <div class="flex justify-between text-slate-400">
                        <span>মোট ভাউচার সংখ্যা:</span>
                        <strong class="text-white">${unpostedPaidItems.length} টি</strong>
                    </div>
                    <div class="flex justify-between text-emerald-400 font-bold text-sm">
                        <span>মোট টাকার পরিমাণ:</span>
                        <span>৳ ${formatAmountWithComma(totalSyncAmt)}</span>
                    </div>
                    <div class="text-[10px] text-slate-500 pt-1">ভাউচার তারিখ হিসেবে বর্তমান তারিখ ব্যবহৃত হবে।</div>
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'হ্যাঁ, পোস্টিং করুন',
        cancelButtonText: 'বাতিল',
        customClass: {
            popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn max-w-md w-full',
            confirmButton: 'm3-btn-primary !bg-emerald-600 hover:!bg-emerald-500 !px-5 !py-2 rounded-xl font-bold',
            cancelButton: 'bg-slate-800 hover:bg-slate-700 text-slate-300 px-5 py-2 rounded-xl font-bold ml-2'
        }
    });

    if (!confirmResult.isConfirmed) return;

    // 3. Security PIN Verification (Rule 12 compliant)
    const pinVerified = await promptSecurityPin();
    if (!pinVerified) return;

    const todayDate = getTodayLocalDateString();

    try {
        let successCount = 0;
        for (const itm of unpostedPaidItems) {
            const categoryName = itm.type === 'salary' ? 'কর্মী বেতন' : (itm.sectionTitle.includes('ভাড়া') ? 'দোকান ও গোডাউন ভাড়া' : 'সাধারণ খরচ');
            const detailsText = `${itm.name} — ${itm.details || ''} [মাসিক বেতন শীট ${state.monthYear}]`.trim();

            await ExpenseDAO.add({
                date: todayDate,
                category: categoryName,
                details: detailsText,
                amount: Number(itm.amount) || 0,
                paymentMethod: itm.paymentMethod || 'Cash',
                paymentAccount: itm.paymentAccount || 'শোরুম ক্যাশ',
                sourceModule: 'payroll_sheet',
                monthYear: state.monthYear,
                payrollItemId: itm.id
            });

            // Mark as synced
            itm.isSyncedToExpenses = true;
            itm.syncedAt = todayDate;
            successCount += 1;
        }

        // Save updated sync flags to Firestore
        await savePayrollToCloud();

        showToast(`সফল! ${successCount} টি খরচ সফলভাবে দৈনিক খরচে পোস্ট করা হয়েছে।`, 'success');
    } catch (e) {
        console.error('syncPayrollToDailyExpenses error:', e);
        showToast('দৈনিক খরচে পোস্টিং করার সময় ত্রুটি ঘটেছে!', 'error');
    }
}
