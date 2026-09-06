import Swal from 'sweetalert2';
import { formatAmountWithComma, formatAppDate, safeRound, numberToBanglaWords } from '../utils.js';

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
        ? `<span class="text-red-400 font-mono font-bold">৳ ${formatAmountWithComma(currentDue)} (বকেয়া)</span>`
        : (currentDue < 0 ? `<span class="text-emerald-400 font-mono font-bold">৳ ${formatAmountWithComma(Math.abs(currentDue))} (অ্যাডভান্স)</span>` : `<span class="text-slate-400 font-mono font-bold">৳ ০.০০</span>`);

    const projectedDueBadge = projectedDue > 0
        ? `<span class="bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-xl text-xs md:text-sm font-black font-mono">৳ ${formatAmountWithComma(projectedDue)} (বকেয়া)</span>`
        : (projectedDue < 0 
            ? `<span class="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-xl text-xs md:text-sm font-black font-mono">৳ ${formatAmountWithComma(Math.abs(projectedDue))} (অ্যাডভান্স)</span>`
            : `<span class="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-xl text-xs md:text-sm font-black font-mono">৳ ০.০০ (পরিশোধিত)</span>`);

    const activeAmount = b > 0 ? b : p;
    const words = numberToBanglaWords(activeAmount);

    // --- Channel & Payment Method Identification ---
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

    const htmlContent = `
        <div class="text-left font-bn">
            ${isAccountTransfer ? `
                <div class="mb-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs text-amber-300 font-bold flex items-center gap-2.5">
                    <i class="fa-solid fa-arrows-rotate text-amber-400 text-base shrink-0"></i>
                    <span>অ্যাকাউন্ট ট্রান্সফার: এই মেমোটি পূর্বের কাস্টমার থেকে কর্তন হয়ে নতুন কাস্টমারের অ্যাকাউন্টে যোগ হবে।</span>
                </div>
            ` : ''}

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <!-- LEFT COLUMN: Customer Profile & Balance Impact -->
                <div class="space-y-3 flex flex-col justify-between">
                    <div class="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-md flex flex-col gap-2">
                        <div class="flex items-center justify-between gap-2">
                            <div class="flex items-center gap-2.5">
                                <div class="w-11 h-11 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center text-lg border border-blue-500/30 font-bold shrink-0">
                                    <i class="fa-solid fa-user-check"></i>
                                </div>
                                <div>
                                    <span class="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">কাস্টমার প্রোফাইল</span>
                                    <span class="text-base md:text-lg text-white font-black leading-tight">${cleanName}</span>
                                </div>
                            </div>
                            ${accountNo ? `<span class="bg-blue-500/15 text-blue-400 border border-blue-500/30 px-2.5 py-1 rounded-xl text-xs font-mono font-black">A/C #${accountNo}</span>` : ''}
                        </div>
                        <div class="flex items-center gap-2.5 text-xs text-slate-400 flex-wrap pt-2 border-t border-slate-800">
                            ${phone ? `<span class="flex items-center gap-1.5 font-mono text-xs text-slate-200 font-bold"><i class="fa-solid fa-phone text-[11px] text-emerald-400"></i> ${phone}</span>` : '<span class="text-slate-500 text-xs">ফোন নম্বর নেই</span>'}
                            ${areaStr ? `<span class="flex items-center gap-1.5 text-xs text-slate-300 truncate max-w-[260px]" title="${areaStr}"><i class="fa-solid fa-location-dot text-[11px] text-slate-400"></i> ${areaStr}</span>` : ''}
                        </div>
                    </div>

                    <div class="p-3.5 bg-gradient-to-b from-slate-900/95 to-slate-950 rounded-2xl border border-slate-800 shadow-md space-y-2.5 flex-1 flex flex-col justify-between">
                        <div>
                            <div class="flex items-center justify-between text-xs text-slate-300 font-bold border-b border-slate-800 pb-2">
                                <div class="flex items-center gap-2 text-indigo-400">
                                    <i class="fa-solid fa-scale-balanced text-sm"></i>
                                    <span class="text-xs text-slate-200 font-black">হিসাবের প্রভাব (Ledger Impact):</span>
                                </div>
                                <span class="text-[10px] text-slate-400 font-bold px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700">খতিয়ান হিসাব</span>
                            </div>

                            <div class="py-2 space-y-1.5 text-xs">
                                <div class="flex items-center justify-between">
                                    <span class="text-slate-400 font-bold flex items-center gap-1.5"><i class="fa-solid fa-clock-rotate-left text-[11px] text-slate-500"></i> পূর্বের ব্যালেন্স:</span>
                                    <div>${prevDueBadge}</div>
                                </div>
                                ${b > 0 ? `
                                <div class="flex items-center justify-between">
                                    <span class="text-red-400 font-bold flex items-center gap-1.5"><i class="fa-solid fa-plus text-[10px]"></i> আজকের নতুন বিল:</span>
                                    <span class="text-red-400 font-mono font-bold">৳ ${formatAmountWithComma(b)}</span>
                                </div>` : ''}
                                ${p > 0 ? `
                                <div class="flex items-center justify-between">
                                    <span class="text-emerald-400 font-bold flex items-center gap-1.5"><i class="fa-solid fa-minus text-[10px]"></i> আজকের পরিশোধ/জমা:</span>
                                    <span class="text-emerald-400 font-mono font-bold">৳ ${formatAmountWithComma(p)}</span>
                                </div>` : ''}
                            </div>
                        </div>

                        <div class="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/90">
                            <span class="text-xs font-black text-slate-200 flex items-center gap-1.5"><i class="fa-solid fa-arrow-right text-emerald-400"></i><span>হালনাগাদ অবশিষ্ট বকেয়া:</span></span>
                            <div>${projectedDueBadge}</div>
                        </div>
                    </div>

                    ${words ? `
                    <div class="bg-slate-950/90 border border-amber-500/30 rounded-2xl px-3.5 py-2 text-xs font-bold text-amber-300 flex items-center gap-2 shadow-inner">
                        <i class="fa-solid fa-coins text-amber-400 text-sm shrink-0"></i>
                        <span class="truncate">কথায়: ${words}</span>
                    </div>` : ''}
                </div>

                <!-- RIGHT COLUMN: Transaction Details, Channel & Fast Actions -->
                <div class="space-y-3 flex flex-col justify-between">
                    <div class="grid grid-cols-2 gap-2.5">
                        <div class="bg-slate-900/90 p-2.5 rounded-2xl border border-slate-800 flex items-center gap-2.5 min-w-0">
                            <div class="w-9 h-9 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center text-base border border-blue-500/25 shrink-0"><i class="fa-regular fa-calendar-check"></i></div>
                            <div class="min-w-0">
                                <span class="text-[10px] text-slate-400 block font-bold leading-tight">তারিখ (Date)</span>
                                <span class="text-xs font-black text-slate-100 font-mono whitespace-nowrap block mt-0.5">${formatAppDate(date)}</span>
                            </div>
                        </div>
                        <div class="bg-slate-900/90 p-2.5 rounded-2xl border border-slate-800 flex items-center gap-2.5 min-w-0">
                            <div class="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center text-base border border-amber-500/25 shrink-0"><i class="fa-solid fa-receipt"></i></div>
                            <div class="min-w-0">
                                <span class="text-[10px] text-slate-400 block font-bold leading-tight">ভাউচার / মেমো নং</span>
                                <span class="text-xs font-black text-amber-400 font-mono whitespace-nowrap block mt-0.5 truncate">${voucherNo ? '#' + voucherNo : '(ভাউচার ছাড়া)'}</span>
                            </div>
                        </div>
                    </div>

                    <div class="grid ${b > 0 && p > 0 ? 'grid-cols-2' : 'grid-cols-1'} gap-2.5">
                        ${b > 0 ? `
                        <div class="p-3 rounded-2xl bg-red-950/25 border border-red-500/40 text-red-400 flex flex-col items-center justify-center text-center">
                            <span class="text-xs font-bold text-red-400 flex items-center justify-center gap-1.5"><i class="fa-solid fa-arrow-up-right-from-square text-xs"></i> বিল (DEBIT)</span>
                            <div class="text-xl md:text-2xl font-black text-red-400 font-mono mt-1">৳ ${formatAmountWithComma(b)}</div>
                            <span class="text-[10px] text-red-300/70 font-bold block mt-0.5">কেনাকাটা / পাওনা বৃদ্ধি</span>
                        </div>` : ''}

                        ${p > 0 ? `
                        <div class="p-3 rounded-2xl bg-emerald-950/25 border border-emerald-500/40 text-emerald-400 flex flex-col items-center justify-center text-center">
                            <span class="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1.5"><i class="fa-solid fa-arrow-down-left-and-up-right-to-center text-xs"></i> জমা (CREDIT)</span>
                            <div class="text-2xl md:text-3xl font-black text-emerald-400 font-mono mt-1">৳ ${formatAmountWithComma(p)}</div>
                        </div>` : ''}
                    </div>

                    <!-- Dedicated Payment Channel Card -->
                    ${channelHtml}

                    <!-- Fast Action Toggles -->
                    <div class="bg-slate-900/80 border border-slate-800 rounded-2xl p-2.5">
                        <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                            <i class="fa-solid fa-bolt text-amber-400"></i><span>তাৎক্ষণিক অ্যাকশন (ঐচ্ছিক):</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <label class="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-slate-700 bg-slate-950/70 text-slate-400 hover:text-white cursor-pointer transition-all has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-500/15 has-[:checked]:text-emerald-300 select-none ${phone ? '' : 'opacity-40 cursor-not-allowed pointer-events-none'}" title="${phone ? 'ক্লিক করে WhatsApp মেমো সিলেক্ট করুন' : 'ফোন নম্বর নেই'}">
                                <input type="checkbox" id="modal-opt-whatsapp" class="hidden">
                                <i class="fa-brands fa-whatsapp text-base text-emerald-400"></i>
                                <span class="text-xs font-bold">WhatsApp মেমো</span>
                            </label>
                            <label class="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-slate-700 bg-slate-950/70 text-slate-400 hover:text-white cursor-pointer transition-all has-[:checked]:border-cyan-500 has-[:checked]:bg-cyan-500/15 has-[:checked]:text-cyan-300 select-none" title="ক্লিক করে তাৎক্ষণিক প্রিন্ট সিলেক্ট করুন">
                                <input type="checkbox" id="modal-opt-print" class="hidden">
                                <i class="fa-solid fa-print text-base text-cyan-400"></i>
                                <span class="text-xs font-bold">মেমো প্রিন্ট</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

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
