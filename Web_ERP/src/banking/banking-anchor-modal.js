import Swal from 'sweetalert2';
import { BankDAO, CashCollectorDAO } from '../dao.js';
import { parseAmount, showToast, toDBDate, promptSecurityPin, formatAmountWithComma } from '../utils.js';
import { auditLog } from '../audit.js';

/**
 * Open Anchor Configuration Modal for Bank / Cash Account
 * Configures Effective Start Date (cut-off) and Initial Opening Balance.
 */
export async function openAccountAnchorModal(accountName, isCash, onSaveSuccess) {
    const dao = isCash ? CashCollectorDAO : BankDAO;
    const typeLabel = isCash ? 'ক্যাশ বক্স' : 'ব্যাংক অ্যাকাউন্ট';

    Swal.fire({
        title: 'লোড হচ্ছে...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
        customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' }
    });

    let currentAnchor = { effectiveStartDate: '2026-09-01', openingBalance: 0, docId: null };

    try {
        const snap = await dao.collection.where('name', '==', accountName).limit(1).get();
        if (!snap.empty) {
            const doc = snap.docs[0];
            const data = doc.data();
            currentAnchor.docId = doc.id;
            if (data.effectiveStartDate) currentAnchor.effectiveStartDate = toDBDate(data.effectiveStartDate);
            if (data.openingBalance !== undefined && !isNaN(Number(data.openingBalance))) {
                currentAnchor.openingBalance = Number(data.openingBalance);
            }
        }
    } catch (err) {
        console.error('Error fetching account anchor:', err);
    }

    const html = `
        <div class="text-left font-bn space-y-4">
            <div class="bg-blue-500/10 border border-blue-500/30 p-3.5 rounded-2xl text-blue-300 text-xs leading-relaxed shadow-sm">
                <i class="fa-solid fa-circle-info mr-1.5 text-blue-400"></i>
                <strong>প্রারম্ভিক ব্যালেন্স ও কাট-অফ ডেট:</strong> এই তারিখের আগের পুরোনো বা অপ্রাসঙ্গিক লেনদেন লেজারে আসবে না। নির্ধারিত তারিখ থেকে প্রদত্ত প্রারম্ভিক ব্যালেন্স দিয়ে হিসাব শুরু হবে।
            </div>

            <div>
                <label class="block text-xs font-bold text-slate-300 mb-1">অ্যাকাউন্টের নাম</label>
                <input type="text" readonly class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-300 text-xs font-bold outline-none cursor-not-allowed" value="${accountName} (${typeLabel})">
            </div>

            <div>
                <label class="block text-xs font-bold text-slate-300 mb-1">হিসাব শুরুর তারিখ (Effective Start Date)</label>
                <input type="text" id="anchor-start-date" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-mono outline-none datepicker cursor-pointer" value="${currentAnchor.effectiveStartDate}">
            </div>

            <div>
                <label class="block text-xs font-bold text-slate-300 mb-1">প্রারম্ভিক ব্যালেন্স (Opening Balance ৳)</label>
                <input type="text" id="anchor-opening-bal" oninput="window.handleNumberInput(this); window.updateLiveWords(this, 'anchor-bal-words');" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-black text-lg outline-none font-mono focus:border-purple-500" value="${formatAmountWithComma(currentAnchor.openingBalance)}">
                <div id="anchor-bal-words" class="text-[11px] text-emerald-400 font-bold hidden italic mt-1"></div>
            </div>
        </div>
    `;

    const { value: formValues } = await Swal.fire({
        title: `<div class="font-bn font-black text-white text-lg flex items-center justify-center gap-2">
            <i class="fa-solid fa-sliders text-purple-400"></i>
            <span>প্রারম্ভিক ব্যালেন্স কনফিগারেশন</span>
        </div>`,
        html: html,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-check mr-1.5"></i>সংরক্ষণ করুন',
        cancelButtonText: 'বাতিল',
        confirmButtonColor: '#10b981',
        cancelButtonColor: '#64748b',
        customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' },
        preConfirm: () => {
            const rawDate = document.getElementById('anchor-start-date')?.value?.trim();
            const rawBal = document.getElementById('anchor-opening-bal')?.value?.trim();
            const effectiveStartDate = toDBDate(rawDate);
            const openingBalance = parseAmount(rawBal) || 0;

            if (!effectiveStartDate) return Swal.showValidationMessage('শুরুর তারিখ দেওয়া আবশ্যক!');
            return { effectiveStartDate, openingBalance };
        }
    });

    if (formValues) {
        const isPinValid = await promptSecurityPin(`Configure Anchor for ${accountName}`, 'editBank');
        if (!isPinValid) return;

        Swal.fire({ title: 'সংরক্ষণ করা হচ্ছে...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        try {
            if (currentAnchor.docId) {
                await dao.update(currentAnchor.docId, {
                    effectiveStartDate: formValues.effectiveStartDate,
                    openingBalance: formValues.openingBalance
                });
            } else {
                await dao.add({
                    name: accountName,
                    status: 'active',
                    effectiveStartDate: formValues.effectiveStartDate,
                    openingBalance: formValues.openingBalance
                });
            }

            auditLog('SET_ACCOUNT_ANCHOR', 'Admin', 'BankingSystem', `Set anchor for ${accountName}: Start ${formValues.effectiveStartDate}, Opening ৳${formValues.openingBalance}`);
            Swal.close();
            showToast('প্রারম্ভিক ব্যালেন্স সফলভাবে আপডেট হয়েছে!', 'success');

            if (typeof onSaveSuccess === 'function') {
                await onSaveSuccess();
            }
            if (typeof window.bankingApp?.refreshCards === 'function') {
                window.bankingApp.refreshCards();
            }
        } catch (err) {
            console.error('Error saving account anchor:', err);
            Swal.fire('ত্রুটি', 'সংরক্ষণ করতে সমস্যা হয়েছে!', 'error');
        }
    }
}
