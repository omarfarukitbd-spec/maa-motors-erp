import Swal from 'sweetalert2';
import { formatAmountWithComma, safeRound, numberToBanglaWords } from '../utils.js';
import { buildTransactionConfirmHtml } from './ledger-confirm-template.js';

/**
 * World-Class Transaction Confirmation & Financial Balance Impact Modal
 * Enterprise Benchmark pattern (Stripe/SAP/QuickBooks) for pre-commit verification.
 */
export async function showTransactionConfirmModal({
    customer, date, voucherNo = '', bill = 0, paid = 0,
    receivedType = '', receivedFrom = '', preCommitDue = 0, editingRef = {}
}) {
    const cleanName = String(customer?.name || 'Customer').replace(/^\[.*?\]\s*/, '').trim();
    const accountNo = customer?.accountNo ? String(customer.accountNo) : '';
    const phone = customer?.phone && customer.phone !== '-' ? customer.phone.trim() : '';
    const areaStr = ((customer?.zone ? `[${customer.zone}] ` : '') + (customer?.address || '')).trim();

    const b = Number(bill) || 0, p = Number(paid) || 0, currentDue = Number(preCommitDue) || 0;
    const isAccountTransfer = Boolean(editingRef?.id && editingRef?.oldCid && editingRef?.oldCid !== customer?.id);
    const balanceDiff = safeRound(b - p);
    let projectedDue = 0;

    if (editingRef?.id && !isAccountTransfer) {
        const oldDiff = safeRound((editingRef.oldBill || 0) - (editingRef.oldPaid || 0));
        projectedDue = safeRound(currentDue + safeRound(balanceDiff - oldDiff));
    } else {
        projectedDue = safeRound(currentDue + balanceDiff);
    }

    const prevDueBadge = currentDue > 0
        ? `<span class="text-red-400 font-mono font-bold whitespace-nowrap">৳ ${formatAmountWithComma(currentDue)} (বকেয়া)</span>`
        : (currentDue < 0 ? `<span class="text-emerald-400 font-mono font-bold whitespace-nowrap">৳ ${formatAmountWithComma(Math.abs(currentDue))} (অ্যাডভান্স)</span>` : `<span class="text-slate-400 font-mono font-bold whitespace-nowrap">৳ ০.০০</span>`);

    const isDue = projectedDue > 0, isAdv = projectedDue < 0;
    const dueStatusText = isDue ? 'বকেয়া' : (isAdv ? 'অ্যাডভান্স' : 'পরিশোধিত');

    const activeAmount = b > 0 ? b : p;
    const words = numberToBanglaWords(activeAmount);

    let channelHtml = '';
    if (p > 0) {
        let channelIcon = 'fa-solid fa-money-bill-transfer', channelColor = 'emerald';
        let channelTitle = 'নগদ ক্যাশ (Cash)', channelBadge = 'ক্যাশ জমা', destText = 'শোরুম ক্যাশ ড্রয়ারে জমা';

        if (receivedType === 'Bank') {
            channelIcon = 'fa-solid fa-building-columns'; channelColor = 'cyan';
            channelTitle = 'ব্যাংক পেমেন্ট (Bank)'; channelBadge = 'ব্যাংক অ্যাকাউন্ট'; destText = 'সরাসরি ব্যাংক অ্যাকাউন্টে জমা';
        } else if (receivedType === 'Less') {
            channelIcon = 'fa-solid fa-tag'; channelColor = 'purple';
            channelTitle = 'ছাড় / লেস (Discount)'; channelBadge = 'মওকুফ / ছাড়'; destText = 'কাস্টমারের বকেয়া থেকে কর্তন';
        }

        channelHtml = `
            <div class="p-3 bg-slate-900/95 rounded-2xl border border-${channelColor}-500/40 shadow-md">
                <div class="flex items-center justify-between text-[11px] font-bold pb-1.5 border-b border-slate-800">
                    <span class="flex items-center gap-1.5 text-${channelColor}-400"><i class="${channelIcon}"></i> ${channelTitle}</span>
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-${channelColor}-500/15 text-${channelColor}-300 border border-${channelColor}-500/30 uppercase">পেমেন্ট মাধ্যম</span>
                </div>
                <div class="flex items-center justify-between gap-2 pt-2">
                    <div class="flex items-center gap-2">
                        <span class="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold font-mono">${channelBadge}</span>
                        <span class="text-sm font-black text-white font-mono tracking-tight">${receivedFrom || (receivedType === 'Bank' ? 'ব্যাংক' : 'শোরুম ক্যাশ')}</span>
                    </div>
                    <span class="text-[11px] text-${channelColor}-400 font-bold flex items-center gap-1"><i class="fa-solid fa-circle-check text-[10px]"></i> ${destText}</span>
                </div>
            </div>`;
    } else if (b > 0) {
        channelHtml = `
            <div class="p-3 bg-slate-900/95 rounded-2xl border border-red-500/30 shadow-md">
                <div class="flex items-center justify-between text-[11px] font-bold pb-1.5 border-b border-slate-800">
                    <span class="flex items-center gap-1.5 text-red-400"><i class="fa-solid fa-cart-shopping"></i> লেনদেনের ধরন: পণ্য বিক্রয় / নতুন বিল</span>
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/15 text-red-300 border border-red-500/30 uppercase">ডেবিট এন্ট্রি</span>
                </div>
                <div class="text-xs text-slate-300 font-bold pt-2 flex items-center justify-between">
                    <span>কাস্টমারের অ্যাকাউন্টে বিল যোগ হবে</span>
                    <span class="text-red-400 font-mono font-bold">+ বকেয়া বৃদ্ধি পাবে</span>
                </div>
            </div>`;
    }

    const htmlContent = buildTransactionConfirmHtml({
        cleanName, accountNo, phone, areaStr, isAccountTransfer,
        prevDueBadge, b, p, projectedDue, isDue, isAdv, dueStatusText,
        words, date, voucherNo, channelHtml
    });

    const result = await Swal.fire({
        title: `
            <div class="flex items-center justify-center gap-3 font-bn text-xl md:text-2xl text-white font-black">
                <div class="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl border border-emerald-500/30 shadow-lg shadow-emerald-950/40"><i class="fa-solid fa-shield-halved"></i></div>
                <span>লেনদেন চূড়ান্ত যাচাইকরণ</span>
            </div>`,
        html: htmlContent,
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-circle-check mr-2"></i>কনফার্ম ও সেভ করুন',
        cancelButtonText: '<i class="fa-solid fa-pen-to-square mr-2"></i>সংশোধন করব',
        customClass: {
            popup: '!bg-[#0b1120] !text-white !rounded-3xl border border-slate-700/80 shadow-[0_25px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl font-bn !max-w-3xl !w-[96%] md:!w-[820px] !p-4 md:!p-6 max-h-[92vh] overflow-y-auto custom-scrollbar',
            confirmButton: '!bg-emerald-600 hover:!bg-emerald-500 !text-white !font-black !rounded-2xl !py-3.5 !px-8 shadow-xl shadow-emerald-900/40 text-sm md:text-base flex items-center justify-center gap-2 cursor-pointer w-full md:w-auto order-1',
            cancelButton: '!bg-slate-800 hover:!bg-slate-700 !text-slate-300 !font-bold !rounded-2xl !py-3.5 !px-6 text-sm flex items-center justify-center gap-2 cursor-pointer border border-slate-700 w-full md:w-auto order-2'
        },
        focusConfirm: true,
        didOpen: (popup) => {
            const confirmBtn = popup.querySelector('.swal2-confirm');
            if (confirmBtn) confirmBtn.focus();
        }
    });

    const sendWhatsApp = document.getElementById('modal-opt-whatsapp')?.checked || false;
    const openPrint = document.getElementById('modal-opt-print')?.checked || false;

    return {
        isConfirmed: result.isConfirmed,
        sendWhatsApp,
        openPrint
    };
}
