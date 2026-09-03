import Swal from 'sweetalert2';
import { formatAmountWithComma, formatAppDate, safeRound, numberToBanglaWords } from '../utils.js';

/**
 * World-Class Transaction Confirmation & Financial Balance Impact Modal
 * Enterprise Benchmark pattern (Stripe/SAP/QuickBooks) for pre-commit verification.
 */
export async function showTransactionConfirmModal({
    customer,
    date,
    voucherNo = '',
    bill = 0,
    paid = 0,
    receivedType = '',
    receivedFrom = '',
    preCommitDue = 0,
    editingRef = {}
}) {
    const rawName = customer?.name || 'Customer';
    const cleanName = String(rawName).replace(/^\[.*?\]\s*/, '').trim();
    const accountNo = customer?.accountNo ? String(customer.accountNo) : '';
    const phone = customer?.phone && customer.phone !== '-' ? customer.phone.trim() : '';
    const address = customer?.address || '';
    const zone = customer?.zone || '';
    const areaStr = (zone ? `[${zone}] ` : '') + (address ? address : '');

    const b = Number(bill) || 0;
    const p = Number(paid) || 0;
    const currentDue = Number(preCommitDue) || 0;
    const isAccountTransfer = Boolean(editingRef?.id && editingRef?.oldCid && editingRef?.oldCid !== customer?.id);
    
    const balanceDiff = safeRound(b - p);
    let projectedDue = 0;

    if (editingRef && editingRef.id && !isAccountTransfer) {
        const oldDiff = safeRound((editingRef.oldBill || 0) - (editingRef.oldPaid || 0));
        const netIncrement = safeRound(balanceDiff - oldDiff);
        projectedDue = safeRound(currentDue + netIncrement);
    } else {
        projectedDue = safeRound(currentDue + balanceDiff);
    }

    const prevDueBadge = currentDue > 0
        ? `<span class="text-red-400 font-mono font-bold">৳ ${formatAmountWithComma(currentDue)} (বকেয়া)</span>`
        : (currentDue < 0 ? `<span class="text-emerald-400 font-mono font-bold">৳ ${formatAmountWithComma(Math.abs(currentDue))} (অ্যাডভান্স)</span>` : `<span class="text-slate-400 font-mono font-bold">৳ ০.০০</span>`);

    let mathParts = `<span>পূর্বের ব্যালেন্স: ${prevDueBadge}</span>`;
    if (b > 0) mathParts += `<span class="text-red-400 font-bold font-mono"> + বিল: ৳ ${formatAmountWithComma(b)}</span>`;
    if (p > 0) mathParts += `<span class="text-emerald-400 font-bold font-mono"> - জমা: ৳ ${formatAmountWithComma(p)}</span>`;

    const projectedDueBadge = projectedDue > 0
        ? `<span class="bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-xl text-sm font-black font-mono">৳ ${formatAmountWithComma(projectedDue)} (বকেয়া)</span>`
        : (projectedDue < 0 
            ? `<span class="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-xl text-sm font-black font-mono">৳ ${formatAmountWithComma(Math.abs(projectedDue))} (অ্যাডভান্স)</span>`
            : `<span class="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-xl text-sm font-black font-mono">৳ ০.০০ (পরিশোধিত)</span>`);

    // Amount In Words
    const activeAmount = b > 0 ? b : p;
    const words = numberToBanglaWords(activeAmount);

    const htmlContent = `
        <div class="text-left font-bn">
            ${isAccountTransfer ? `
                <div class="mb-3.5 p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs text-amber-300 font-bold flex items-center gap-2.5">
                    <i class="fa-solid fa-arrows-rotate text-amber-400 text-base shrink-0"></i>
                    <span>অ্যাকাউন্ট ট্রান্সফার: এই মেমোটি পূর্বের কাস্টমার থেকে কর্তন হয়ে নতুন কাস্টমারের অ্যাকাউন্টে যোগ হবে।</span>
                </div>
            ` : ''}

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- LEFT COLUMN: Customer Profile & Balance Impact -->
                <div class="space-y-3.5 flex flex-col justify-between">
                    <!-- 1. Customer Card -->
                    <div class="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-md flex flex-col gap-2.5">
                        <div class="flex items-center justify-between gap-2">
                            <div class="flex items-center gap-3">
                                <div class="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center text-xl border border-blue-500/30 font-bold shrink-0">
                                    <i class="fa-solid fa-user-check"></i>
                                </div>
                                <div>
                                    <span class="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">কাস্টমার প্রোফাইল</span>
                                    <span class="text-base md:text-lg text-white font-black leading-tight">${cleanName}</span>
                                </div>
                            </div>
                            ${accountNo ? `<span class="bg-blue-500/15 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-xl text-xs font-mono font-black">A/C #${accountNo}</span>` : ''}
                        </div>
                        <div class="flex items-center gap-3 text-xs text-slate-400 flex-wrap pt-2 border-t border-slate-800">
                            ${phone ? `<span class="flex items-center gap-1.5 font-mono text-sm text-slate-200 font-bold"><i class="fa-solid fa-phone text-xs text-emerald-400"></i> ${phone}</span>` : '<span class="text-slate-500 text-xs">ফোন নম্বর নেই</span>'}
                            ${areaStr ? `<span class="flex items-center gap-1.5 text-xs text-slate-300 truncate max-w-[280px]" title="${areaStr}"><i class="fa-solid fa-location-dot text-xs text-slate-400"></i> ${areaStr}</span>` : ''}
                        </div>
                    </div>

                    <!-- 2. Ledger Balance Impact & Reconciliation Breakdown -->
                    <div class="p-4 bg-gradient-to-b from-slate-900/90 to-slate-950 rounded-2xl border border-slate-800 shadow-md space-y-3 flex-1 flex flex-col justify-between">
                        <div>
                            <div class="flex items-center justify-between text-xs text-slate-300 font-bold border-b border-slate-800 pb-2">
                                <div class="flex items-center gap-2 text-purple-400">
                                    <i class="fa-solid fa-scale-balanced text-base"></i>
                                    <span class="text-xs text-slate-200 font-bold">হিসাবের প্রভাব (Ledger Impact):</span>
                                </div>
                            </div>
                            <div class="text-xs text-slate-300 pt-2 pb-1 space-y-1">
                                <div>${mathParts}</div>
                            </div>
                        </div>
                        <div class="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                            <span class="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                                <i class="fa-solid fa-arrow-right text-emerald-400"></i>
                                <span>হালনাগাদ অবশিষ্ট বকেয়া:</span>
                            </span>
                            <div>${projectedDueBadge}</div>
                        </div>
                    </div>

                    <!-- 3. Amount In Words -->
                    ${words ? `
                    <div class="bg-slate-950/90 border border-amber-500/30 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-amber-300 flex items-center gap-2 shadow-inner">
                        <i class="fa-solid fa-coins text-amber-400 text-sm shrink-0"></i>
                        <span class="truncate">কথায়: ${words}</span>
                    </div>` : ''}
                </div>

                <!-- RIGHT COLUMN: Transaction Details & Fast Action Toggles -->
                <div class="space-y-3.5 flex flex-col justify-between">
                    <!-- 4. Date & Voucher Grid -->
                    <div class="grid grid-cols-2 gap-2.5">
                        <div class="bg-slate-900/90 p-3 rounded-2xl border border-slate-800 flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center text-lg border border-blue-500/25 shrink-0">
                                <i class="fa-regular fa-calendar-check"></i>
                            </div>
                            <div>
                                <span class="text-[11px] text-slate-400 block font-bold">তারিখ (Date)</span>
                                <span class="text-xs md:text-sm text-slate-100 font-black font-mono">${formatAppDate(date)}</span>
                            </div>
                        </div>
                        <div class="bg-slate-900/90 p-3 rounded-2xl border border-slate-800 flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center text-lg border border-amber-500/25 shrink-0">
                                <i class="fa-solid fa-receipt"></i>
                            </div>
                            <div>
                                <span class="text-[11px] text-slate-400 block font-bold">ভাউচার / মেমো নং</span>
                                <span class="text-xs md:text-sm text-amber-400 font-black font-mono">${voucherNo ? '#' + voucherNo : '(ভাউচার ছাড়া)'}</span>
                            </div>
                        </div>
                    </div>

                    <!-- 5. Financial Dual-Card: Debit vs Credit -->
                    <div class="grid grid-cols-2 gap-2.5 flex-1">
                        <!-- Bill / Debit -->
                        <div class="p-3.5 rounded-2xl ${b > 0 ? 'bg-red-950/25 border border-red-500/40 text-red-400' : 'bg-slate-900/40 border border-slate-800 text-slate-500'} flex flex-col items-center justify-center text-center transition-all">
                            <span class="text-xs uppercase font-bold text-red-400 flex items-center justify-center gap-1.5">
                                <i class="fa-solid fa-arrow-up-right-from-square text-xs"></i> বিল (Debit)
                            </span>
                            <div class="text-xl md:text-2xl font-black ${b > 0 ? 'text-red-400' : 'text-slate-500'} font-mono mt-1">
                                ৳ ${formatAmountWithComma(b)}
                            </div>
                            <span class="text-[10px] text-red-300/70 font-bold block mt-1">${b > 0 ? 'কেনাকাটা / পাওনা বৃদ্ধি' : '-'}</span>
                        </div>

                        <!-- Paid / Credit -->
                        <div class="p-3.5 rounded-2xl ${p > 0 ? 'bg-emerald-950/25 border border-emerald-500/40 text-emerald-400' : 'bg-slate-900/40 border border-slate-800 text-slate-500'} flex flex-col items-center justify-center text-center transition-all">
                            <span class="text-xs uppercase font-bold text-emerald-400 flex items-center justify-center gap-1.5">
                                <i class="fa-solid fa-arrow-down-left-and-up-right-to-center text-xs"></i> জমা (Credit)
                            </span>
                            <div class="text-xl md:text-2xl font-black ${p > 0 ? 'text-emerald-400' : 'text-slate-500'} font-mono mt-1">
                                ৳ ${formatAmountWithComma(p)}
                            </div>
                            <div class="text-[11px] text-emerald-300 font-bold mt-1 truncate font-mono">${p > 0 ? `${receivedType} ${receivedFrom ? '(' + receivedFrom + ')' : ''}` : '-'}</div>
                        </div>
                    </div>

                    <!-- 6. Fast Action Icon Pill Toggles (Default UNCHECKED / OFF) -->
                    <div class="bg-slate-900/80 border border-slate-800 rounded-2xl p-3">
                        <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <i class="fa-solid fa-bolt text-amber-400"></i>
                            <span>তাৎক্ষণিক অ্যাকশন (ঐচ্ছিক):</span>
                        </div>
                        <div class="flex items-center gap-2.5">
                            <!-- WhatsApp Toggle Button -->
                            <label class="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-700 bg-slate-950/70 text-slate-400 hover:text-white cursor-pointer transition-all has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-500/15 has-[:checked]:text-emerald-300 select-none ${phone ? '' : 'opacity-40 cursor-not-allowed pointer-events-none'}" title="${phone ? 'ক্লিক করে WhatsApp মেমো সিলেক্ট করুন' : 'ফোন নম্বর নেই'}">
                                <input type="checkbox" id="modal-opt-whatsapp" class="hidden">
                                <i class="fa-brands fa-whatsapp text-lg text-emerald-400"></i>
                                <span class="text-xs font-bold">WhatsApp মেমো</span>
                            </label>

                            <!-- Print Toggle Button -->
                            <label class="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-700 bg-slate-950/70 text-slate-400 hover:text-white cursor-pointer transition-all has-[:checked]:border-cyan-500 has-[:checked]:bg-cyan-500/15 has-[:checked]:text-cyan-300 select-none" title="ক্লিক করে তাৎক্ষণিক প্রিন্ট সিলেক্ট করুন">
                                <input type="checkbox" id="modal-opt-print" class="hidden">
                                <i class="fa-solid fa-print text-lg text-cyan-400"></i>
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
                <div class="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl border border-emerald-500/30 shadow-lg shadow-emerald-950/40">
                    <i class="fa-solid fa-shield-halved"></i>
                </div>
                <span>লেনদেন চূড়ান্ত যাচাইকরণ</span>
            </div>
        `,
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
