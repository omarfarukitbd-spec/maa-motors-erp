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

    // Projected Ledger Balance Impact Math
    const b = Number(bill) || 0;
    const p = Number(paid) || 0;
    const currentDue = Number(preCommitDue) || 0;
    
    let balanceDiff = safeRound(b - p);
    let projectedDue = 0;

    if (editingRef && editingRef.id) {
        const oldDiff = safeRound((editingRef.oldBill || 0) - (editingRef.oldPaid || 0));
        const netIncrement = safeRound(balanceDiff - oldDiff);
        projectedDue = safeRound(currentDue + netIncrement);
    } else {
        projectedDue = safeRound(currentDue + balanceDiff);
    }

    const prevDueBadge = currentDue > 0
        ? `<span class="text-red-400 font-mono font-bold">৳ ${formatAmountWithComma(currentDue)} (বকেয়া)</span>`
        : (currentDue < 0 ? `<span class="text-emerald-400 font-mono font-bold">৳ ${formatAmountWithComma(Math.abs(currentDue))} (অ্যাডভান্স)</span>` : `<span class="text-slate-400 font-mono font-bold">৳ ০.০০</span>`);

    let mathParts = `<span>পূর্বের বকেয়া: ${prevDueBadge}</span>`;
    if (b > 0) mathParts += `<span class="text-red-400 font-bold font-mono"> + বিল: ৳ ${formatAmountWithComma(b)}</span>`;
    if (p > 0) mathParts += `<span class="text-emerald-400 font-bold font-mono"> - জমা: ৳ ${formatAmountWithComma(p)}</span>`;

    const projectedDueBadge = projectedDue > 0
        ? `<span class="bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-xl text-sm md:text-base font-black font-mono">৳ ${formatAmountWithComma(projectedDue)} (বকেয়া)</span>`
        : (projectedDue < 0 
            ? `<span class="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-xl text-sm md:text-base font-black font-mono">৳ ${formatAmountWithComma(Math.abs(projectedDue))} (অ্যাডভান্স)</span>`
            : `<span class="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-xl text-sm md:text-base font-black font-mono">৳ ০.০০ (পরিশোধিত)</span>`);

    // Amount In Words
    const activeAmount = b > 0 ? b : p;
    const words = numberToBanglaWords(activeAmount);

    const htmlContent = `
        <div class="text-left space-y-3 font-bn">
            <!-- 1. Customer Identity Card -->
            <div class="p-3 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-inner flex flex-col gap-1.5">
                <div class="flex items-center justify-between gap-2 flex-wrap">
                    <div class="flex items-center gap-2">
                        <div class="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center text-sm border border-blue-500/30 font-bold">
                            <i class="fa-solid fa-user-check"></i>
                        </div>
                        <div>
                            <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">কাস্টমার প্রোফাইল</span>
                            <span class="text-sm md:text-base text-white font-black">${cleanName}</span>
                        </div>
                    </div>
                    ${accountNo ? `<span class="bg-blue-500/10 text-blue-400 border border-blue-500/30 px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold">A/C #${accountNo}</span>` : ''}
                </div>
                <div class="flex items-center gap-3 text-xs text-slate-400 flex-wrap pt-1 border-t border-slate-800/80">
                    ${phone ? `<span class="flex items-center gap-1 font-mono text-slate-300"><i class="fa-solid fa-phone text-[10px] text-emerald-400"></i> ${phone}</span>` : '<span class="text-slate-500 text-[11px]">ফোন নম্বর নেই</span>'}
                    ${areaStr ? `<span class="flex items-center gap-1 truncate max-w-[280px]" title="${areaStr}"><i class="fa-solid fa-location-dot text-[10px] text-slate-500"></i> ${areaStr}</span>` : ''}
                </div>
            </div>

            <!-- 2. Metadata: Date & Voucher -->
            <div class="grid grid-cols-2 gap-2 text-xs">
                <div class="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/70 flex items-center gap-2">
                    <i class="fa-regular fa-calendar-check text-blue-400 text-sm"></i>
                    <div>
                        <span class="text-[10px] text-slate-400 block font-bold">তারিখ (Date)</span>
                        <span class="text-xs text-slate-200 font-bold font-mono">${formatAppDate(date)}</span>
                    </div>
                </div>
                <div class="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/70 flex items-center gap-2">
                    <i class="fa-solid fa-receipt text-amber-400 text-sm"></i>
                    <div>
                        <span class="text-[10px] text-slate-400 block font-bold">ভাউচার / মেমো নং</span>
                        <span class="text-xs text-amber-400 font-black font-mono">${voucherNo ? '#' + voucherNo : '(ভাউচার ছাড়া)'}</span>
                    </div>
                </div>
            </div>

            <!-- 3. Financial Dual-Card: Debit (Bill) vs Credit (Paid) -->
            <div class="grid grid-cols-2 gap-2.5">
                <!-- Bill / Debit -->
                <div class="p-3 rounded-2xl ${b > 0 ? 'bg-red-500/10 border border-red-500/30' : 'bg-slate-900/40 border border-slate-800'} text-center transition-all">
                    <span class="text-[10px] uppercase font-bold text-red-400 flex items-center justify-center gap-1">
                        <i class="fa-solid fa-arrow-up-right-from-square text-[9px]"></i> বিল (Debit)
                    </span>
                    <div class="text-lg md:text-xl font-black ${b > 0 ? 'text-red-400' : 'text-slate-500'} font-mono mt-0.5">
                        ৳ ${formatAmountWithComma(b)}
                    </div>
                    ${b > 0 ? '<span class="text-[9px] text-red-300/70 font-bold block mt-0.5">কেনাকাটা / পাওনা বৃদ্ধি</span>' : ''}
                </div>

                <!-- Paid / Credit -->
                <div class="p-3 rounded-2xl ${p > 0 ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-slate-900/40 border border-slate-800'} text-center transition-all">
                    <span class="text-[10px] uppercase font-bold text-emerald-400 flex items-center justify-center gap-1">
                        <i class="fa-solid fa-arrow-down-left-and-up-right-to-center text-[9px]"></i> জমা (Credit)
                    </span>
                    <div class="text-lg md:text-xl font-black ${p > 0 ? 'text-emerald-400' : 'text-slate-500'} font-mono mt-0.5">
                        ৳ ${formatAmountWithComma(p)}
                    </div>
                    ${p > 0 ? `<div class="text-[10px] text-emerald-300 font-bold mt-0.5 truncate font-mono">${receivedType} ${receivedFrom ? '(' + receivedFrom + ')' : ''}</div>` : ''}
                </div>
            </div>

            <!-- 4. Amount In Words -->
            ${words ? `
            <div class="bg-slate-950/90 border border-slate-800/80 rounded-xl px-3 py-2 text-center text-xs font-bold text-emerald-300 flex items-center justify-center gap-1.5 shadow-inner">
                <i class="fa-solid fa-pen-nib text-emerald-400 text-xs shrink-0"></i>
                <span class="truncate">কথায়: ${words}</span>
            </div>` : ''}

            <!-- 5. Ledger Balance Impact & Reconciliation Breakdown -->
            <div class="p-3 bg-gradient-to-b from-slate-900/90 to-slate-950 rounded-2xl border border-slate-800 shadow-md space-y-2">
                <div class="flex items-center justify-between text-xs text-slate-300 font-bold border-b border-slate-800/80 pb-2">
                    <div class="flex items-center gap-1.5 text-purple-400">
                        <i class="fa-solid fa-scale-balanced text-sm"></i>
                        <span class="text-slate-200">হিসাবের প্রভাব (Ledger Impact):</span>
                    </div>
                    <div class="text-[11px] text-slate-400">${mathParts}</div>
                </div>
                <div class="flex items-center justify-between gap-2 pt-0.5">
                    <span class="text-xs text-slate-300 font-bold flex items-center gap-1.5">
                        <i class="fa-solid fa-arrow-right text-emerald-400"></i>
                        <span>হালনাগাদ অবশিষ্ট বকেয়া:</span>
                    </span>
                    <div>${projectedDueBadge}</div>
                </div>
            </div>

            <!-- 6. Instant Post-Action Toggles -->
            <div class="bg-slate-950/80 border border-slate-800/70 rounded-2xl p-2.5 space-y-2 text-xs font-bold">
                <label class="flex items-center justify-between cursor-pointer group text-slate-300 hover:text-white transition-colors">
                    <div class="flex items-center gap-2">
                        <i class="fa-brands fa-whatsapp text-emerald-400 text-base"></i>
                        <span>সেভ শেষে স্বয়ংক্রিয় WhatsApp মেমো পাঠানো</span>
                    </div>
                    <input type="checkbox" id="modal-opt-whatsapp" class="w-4 h-4 accent-emerald-500 rounded cursor-pointer" ${phone ? 'checked' : 'disabled'}>
                </label>
                <label class="flex items-center justify-between cursor-pointer group text-slate-300 hover:text-white transition-colors border-t border-slate-800/60 pt-2">
                    <div class="flex items-center gap-2">
                        <i class="fa-solid fa-print text-cyan-400 text-base"></i>
                        <span>তাৎক্ষণিক মেমো / রসিদ প্রিন্ট অপশন খোলা</span>
                    </div>
                    <input type="checkbox" id="modal-opt-print" class="w-4 h-4 accent-cyan-500 rounded cursor-pointer">
                </label>
            </div>
        </div>
    `;

    const result = await Swal.fire({
        title: `
            <div class="flex items-center justify-center gap-2.5 font-bn text-lg md:text-xl text-white font-black">
                <div class="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm border border-emerald-500/30">
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
            popup: '!bg-[#0b1120] !text-white !rounded-3xl border border-slate-700/80 shadow-[0_25px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl font-bn !max-w-lg !w-[95%] md:!w-full !p-3.5 md:!p-5 max-h-[94vh] overflow-y-auto custom-scrollbar',
            confirmButton: '!bg-emerald-600 hover:!bg-emerald-500 !text-white !font-black !rounded-2xl !py-3 !px-6 shadow-xl shadow-emerald-900/40 text-sm md:text-base flex items-center justify-center gap-1.5 cursor-pointer w-full md:w-auto order-1',
            cancelButton: '!bg-slate-800 hover:!bg-slate-700 !text-slate-300 !font-bold !rounded-2xl !py-3 !px-5 text-sm flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700 w-full md:w-auto order-2'
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
