import Swal from 'sweetalert2';
import { showToast } from './ui-helpers.js';
import { escapeHTML } from './formatters.js';

/**
 * Detect Bangladesh Telecom Operator info
 */
export function getOperatorInfo(phone) {
    const clean = phone.replace(/[^0-9]/g, '');
    let prefix = '';
    if (clean.startsWith('880')) prefix = clean.substring(2, 5);
    else if (clean.startsWith('0')) prefix = clean.substring(0, 3);

    switch (prefix) {
        case '017':
        case '013':
            return { name: 'GP', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' };
        case '018':
            return { name: 'Robi', color: 'bg-red-500/10 text-red-400 border-red-500/20' };
        case '019':
        case '014':
            return { name: 'Banglalink', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' };
        case '016':
            return { name: 'Airtel', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' };
        case '015':
            return { name: 'Teletalk', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
        default:
            return { name: 'Mobile', color: 'bg-slate-800 text-slate-400 border-slate-700' };
    }
}

/**
 * Intelligent parser to extract multiple phone numbers from free-form string
 */
export function parseCustomerPhoneNumbers(rawPhone) {
    if (!rawPhone || typeof rawPhone !== 'string') return [];
    
    // Split by common delimiters: comma, slash, semicolon, pipe, newline, 'এবং', 'or', '&'
    const parts = rawPhone.split(/[,/|;\n&]|(?:\s+এবং\s+)|\bor\b/i);
    const result = [];
    const seenNumbers = new Set();

    for (const part of parts) {
        const trimmed = part.trim();
        if (!trimmed) continue;

        // Check for attached notes in parentheses e.g. "01711223344 (মালিক)"
        let note = '';
        const noteMatch = trimmed.match(/\(([^)]+)\)/);
        if (noteMatch) {
            note = noteMatch[1].trim();
        }

        // Clean number digits (preserve leading + if present)
        let sanitized = trimmed.replace(/\([^)]*\)/g, '').replace(/[^0-9+]/g, '').trim();
        
        // Remove leading international code variations for local dial compatibility
        let dialNumber = sanitized;
        if (dialNumber.startsWith('+880')) dialNumber = dialNumber.substring(3);
        else if (dialNumber.startsWith('880')) dialNumber = dialNumber.substring(2);

        // Ensure starts with 0 if valid 11 digit Bangladeshi number
        if (dialNumber.length === 10 && dialNumber.startsWith('1')) {
            dialNumber = '0' + dialNumber;
        }

        if (dialNumber && dialNumber.length >= 6 && !seenNumbers.has(dialNumber)) {
            seenNumbers.add(dialNumber);
            result.push({
                display: dialNumber,
                dial: dialNumber,
                note: note,
                operator: getOperatorInfo(dialNumber)
            });
        }
    }

    return result;
}

/**
 * Global Customer Call Handler
 */
export function handleCustomerCall(customerName = 'কাস্টমার', rawPhone = '') {
    const numbers = parseCustomerPhoneNumbers(rawPhone);

    if (numbers.length === 0) {
        showToast(`"${customerName}"-এর কোনো মোবাইল নম্বর পাওয়া যায়নি!`, 'warning');
        return;
    }

    // 1 Number: Direct Instant Dial
    if (numbers.length === 1) {
        window.location.href = `tel:${numbers[0].dial}`;
        return;
    }

    // 2 or more Numbers: Modern Interactive Dial Modal
    showMultiPhoneModal(customerName, numbers);
}

/**
 * Multi-Number Interactive Dialog
 */
export function showMultiPhoneModal(customerName, phoneList) {
    const listHtml = phoneList.map((item, index) => {
        const waNum = item.dial.startsWith('0') ? '88' + item.dial : item.dial;
        const escName = escapeHTML(customerName);
        const escDial = escapeHTML(item.dial);

        return `
            <div class="rounded-2xl bg-slate-900/90 border border-slate-800 p-3.5 flex flex-col gap-3 shadow-lg hover:border-emerald-500/40 transition-all">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2.5">
                        <div class="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-sm">
                            <i class="fa-solid fa-phone"></i>
                        </div>
                        <div>
                            <div class="text-white font-mono font-black text-sm sm:text-base tracking-wide">${escDial}</div>
                            <div class="flex items-center gap-1.5 mt-0.5">
                                <span class="px-2 py-0.2 rounded-md text-[9px] font-bold border ${item.operator.color}">${item.operator.name}</span>
                                ${item.note ? `<span class="text-[10px] text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.2 rounded">${escapeHTML(item.note)}</span>` : ''}
                            </div>
                        </div>
                    </div>
                    <button class="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer text-xs" onclick="window.copyPhoneNumber('${escDial}')" title="নম্বর কপি করুন">
                        <i class="fa-regular fa-copy"></i>
                    </button>
                </div>

                <div class="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800/80">
                    <a href="tel:${escDial}" class="h-9 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer">
                        <i class="fa-solid fa-phone-volume text-xs"></i> <span>সরাসরি কল</span>
                    </a>
                    <a href="https://wa.me/${waNum}" target="_blank" class="h-9 rounded-xl bg-slate-800 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer">
                        <i class="fa-brands fa-whatsapp text-sm"></i> <span>WhatsApp</span>
                    </a>
                </div>
            </div>
        `;
    }).join('');

    Swal.fire({
        title: `<i class="fa-solid fa-address-book text-emerald-400 mr-2"></i>${escapeHTML(customerName)}`,
        html: `
            <div class="font-bn text-left space-y-3 p-1">
                <p class="text-xs text-slate-400 font-bold">এই কাস্টমারের একাধিক নম্বর পাওয়া গেছে। যে নম্বরে কল করতে চান নির্বাচন করুন:</p>
                <div class="flex flex-col gap-2.5 max-h-72 overflow-y-auto custom-scrollbar pr-1">
                    ${listHtml}
                </div>
            </div>
        `,
        showConfirmButton: false,
        showCancelButton: true,
        cancelButtonText: 'বন্ধ করুন',
        customClass: {
            popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn max-w-md',
            cancelButton: 'm3-btn-tonal !bg-slate-800 !text-slate-300 !px-6 !py-2 rounded-xl font-bold border border-slate-700'
        }
    });
}

/**
 * Universal copy helper with feedback
 */
export function copyPhoneNumber(number) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(number);
        showToast(`নম্বর ${number} কপি হয়েছে!`, 'success');
    } else {
        showToast(`নম্বর: ${number}`, 'info');
    }
}

if (typeof window !== 'undefined') {
    window.handleCustomerCall = handleCustomerCall;
    window.copyPhoneNumber = copyPhoneNumber;
}
