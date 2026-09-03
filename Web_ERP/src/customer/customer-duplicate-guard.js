import Swal from 'sweetalert2';
import { getCustomerCache } from './customer-state.js';
import { formatAmountWithComma } from '../utils.js';

/**
 * Normalizes phone numbers by stripping all non-digit characters
 */
export function normalizePhone(rawPhone) {
    if (!rawPhone) return '';
    return String(rawPhone).replace(/\D/g, '').trim();
}

/**
 * Searches customer cache for any existing customer with matching phone or exact name
 */
export function findDuplicateCustomer(phone, name, excludeId = null) {
    const cleanPhone = normalizePhone(phone);
    const cleanName = String(name || '').trim().toLowerCase();
    const customers = getCustomerCache() || [];

    if (!cleanPhone && !cleanName) return null;

    // 1. Check Phone Number Match (Requires at least 6 digits to avoid false positives)
    if (cleanPhone.length >= 6) {
        const matchedByPhone = customers.find(c => {
            if (excludeId && c.id === excludeId) return false;
            const existingPhone = normalizePhone(c.phone);
            if (!existingPhone || existingPhone.length < 6) return false;
            return existingPhone === cleanPhone || existingPhone.endsWith(cleanPhone) || cleanPhone.endsWith(existingPhone);
        });
        if (matchedByPhone) {
            return { type: 'phone', customer: matchedByPhone };
        }
    }

    // 2. Check Exact Name Match (Minimum 3 characters)
    if (cleanName.length >= 3) {
        const matchedByName = customers.find(c => {
            if (excludeId && c.id === excludeId) return false;
            const existingName = String(c.name || '').trim().toLowerCase();
            return existingName === cleanName;
        });
        if (matchedByName) {
            return { type: 'name', customer: matchedByName };
        }
    }

    return null;
}

/**
 * Shows an alert modal if duplicate customer is detected.
 * Returns true if user wants to proceed anyway, false to abort.
 */
export async function verifyDuplicateCustomer(phone, name, excludeId = null) {
    const dup = findDuplicateCustomer(phone, name, excludeId);
    if (!dup) return true; // No duplicate found, proceed safely!

    const c = dup.customer;
    const due = Number(c.totalDue || 0);
    const formattedDue = formatAmountWithComma(Math.abs(due));
    const dueBadge = due > 0 
        ? `<span class="text-red-400 font-bold">৳ ${formattedDue} (বকেয়া)</span>` 
        : (due < 0 ? `<span class="text-emerald-400 font-bold">৳ ${formattedDue} (অগ্রিম)</span>` : '<span class="text-slate-300 font-bold">৳ ০ (পরিশোধিত)</span>');

    const isPhoneDup = dup.type === 'phone';
    const warningReason = isPhoneDup 
        ? `এই মোবাইল নম্বরটিতে (<b>${c.phone || phone}</b>) ইতিমধ্যে একটি সক্রিয় অ্যাকাউন্ট রয়েছে!` 
        : `এই নামে (<b>${c.name}</b>) ইতিমধ্যে একটি গ্রাহক অ্যাকাউন্ট তৈরি করা আছে!`;

    const result = await Swal.fire({
        title: '<div class="flex items-center justify-center gap-2 font-bn font-black text-xl text-amber-400"><i class="fa-solid fa-triangle-exclamation"></i><span>ডুপ্লিকেট কাস্টমার সতর্কবার্তা</span></div>',
        html: `
            <div class="text-left font-bn space-y-3 p-3 bg-slate-900/90 rounded-2xl border border-amber-500/30 text-xs">
                <p class="text-amber-300 font-medium leading-relaxed">${warningReason}</p>
                
                <div class="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1.5">
                    <div class="flex justify-between items-center border-b border-slate-800/80 pb-1.5">
                        <span class="text-slate-400 font-bold">বিদ্যমান অ্যাকাউন্ট:</span>
                        <span class="text-amber-400 font-mono font-black text-sm">#${c.accountNo || 'N/A'}</span>
                    </div>
                    <div class="flex justify-between items-center border-b border-slate-800/80 pb-1.5">
                        <span class="text-slate-400 font-bold">গ্রাহকের নাম:</span>
                        <span class="text-white font-bold">${c.name}</span>
                    </div>
                    <div class="flex justify-between items-center border-b border-slate-800/80 pb-1.5">
                        <span class="text-slate-400 font-bold">মোবাইল নম্বর:</span>
                        <span class="text-slate-200 font-mono">${c.phone || '-'}</span>
                    </div>
                    <div class="flex justify-between items-center border-b border-slate-800/80 pb-1.5">
                        <span class="text-slate-400 font-bold">জোন ও ঠিকানা:</span>
                        <span class="text-slate-300 truncate max-w-[180px]">${c.zone ? `[${c.zone}] ` : ''}${c.address || '-'}</span>
                    </div>
                    <div class="flex justify-between items-center pt-0.5">
                        <span class="text-slate-400 font-bold">বর্তমান ব্যালেন্স:</span>
                        <span>${dueBadge}</span>
                    </div>
                </div>

                <div class="p-2.5 bg-red-500/10 rounded-xl border border-red-500/20 text-[11px] text-red-300">
                    <i class="fa-solid fa-circle-exclamation mr-1"></i>একই ব্যক্তির একাধিক অ্যাকাউন্ট তৈরি করলে আর্থিক খতিয়ান ও বকেয়ার হিসেবে গরমিল হতে পারে।
                </div>
            </div>
        `,
        icon: 'warning',
        showCancelButton: true,
        showDenyButton: true,
        confirmButtonText: '<i class="fa-solid fa-folder-open mr-1.5"></i>বিদ্যমান খতিয়ান খুলুন',
        denyButtonText: '<i class="fa-solid fa-triangle-exclamation mr-1.5"></i>তবুও নতুন একাউন্ট খুলব',
        cancelButtonText: 'বাতিল',
        customClass: {
            popup: '!bg-slate-950 !text-white !rounded-3xl border border-amber-500/40 shadow-2xl font-bn',
            confirmButton: 'm3-btn-primary !bg-blue-600 hover:!bg-blue-500 !px-5 !py-2.5 !rounded-xl font-bold text-xs',
            denyButton: 'm3-btn-tonal !bg-slate-800 hover:!bg-amber-900/50 !text-amber-400 !px-4 !py-2.5 !rounded-xl font-bold text-xs border border-amber-500/30',
            cancelButton: 'm3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-4 !py-2.5 !rounded-xl font-bold text-xs border border-slate-700'
        }
    });

    if (result.isConfirmed) {
        // Open existing customer's ledger!
        if (typeof window.navigate === 'function') {
            window.navigate('ledger', { customerId: c.id });
        } else if (typeof window.filterLedgerByCustomer === 'function') {
            const selectEl = document.getElementById('ledger-customer-select');
            if (selectEl) selectEl.value = c.id;
            window.filterLedgerByCustomer(c.id);
        }
        return false; // Stop creating new customer
    }

    if (result.isDenied) {
        // User explicitly chose to create another account anyway
        return true;
    }

    // Cancelled
    return false;
}

/**
 * Shows full customer info modal when clicking the live duplicate badge
 */
export async function showCustomerQuickInfoModal(c) {
    if (!c) return;
    const due = Number(c.totalDue || 0);
    const dueFormatted = formatAmountWithComma(Math.abs(due));
    const dueBadge = due > 0 
        ? `<span class="px-2.5 py-0.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 font-bold text-xs">৳ ${dueFormatted} (বকেয়া)</span>`
        : (due < 0 ? `<span class="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold text-xs">৳ ${dueFormatted} (অগ্রিম)</span>` : `<span class="px-2.5 py-0.5 rounded-full bg-slate-700 text-slate-300 font-bold text-xs">৳ ০</span>`);

    const result = await Swal.fire({
        title: '<i class="fa-solid fa-id-card text-cyan-400 mr-2"></i>বিদ্যমান গ্রাহকের বিবরণ',
        html: `
            <div class="text-left font-bn space-y-3 p-3 bg-slate-900/90 rounded-2xl border border-slate-800 text-xs">
                <div class="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div>
                        <span class="text-[10px] text-slate-400 uppercase font-black tracking-wider block">গ্রাহকের নাম</span>
                        <h4 class="text-base font-black text-white">${c.name || 'N/A'}</h4>
                    </div>
                    <div class="text-right">
                        <span class="text-[10px] text-slate-400 uppercase font-black tracking-wider block">অ্যাকাউন্ট নং</span>
                        <span class="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono font-black text-sm">#${c.accountNo || '-'}</span>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-2 border-b border-slate-800 pb-2">
                    <div>
                        <span class="text-[10px] text-slate-400 uppercase font-black block">মোবাইল নম্বর</span>
                        <span class="text-slate-200 font-bold text-xs font-mono">${c.phone || '-'}</span>
                    </div>
                    <div>
                        <span class="text-[10px] text-slate-400 uppercase font-black block">জোন / অঞ্চল</span>
                        <span class="text-purple-300 font-bold text-xs">${c.zone || '-'}</span>
                    </div>
                </div>

                <div class="border-b border-slate-800 pb-2">
                    <span class="text-[10px] text-slate-400 uppercase font-black block">ঠিকানা</span>
                    <span class="text-slate-300 font-medium text-xs">${c.address || 'কোনো ঠিকানা দেওয়া নেই'}</span>
                </div>

                <div class="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                    <span class="text-slate-300 font-bold">বর্তমান হিসাবের স্থিতি:</span>
                    ${dueBadge}
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-book-open mr-1.5"></i>খতিয়ান দেখুন',
        cancelButtonText: '<i class="fa-solid fa-xmark mr-1.5"></i>বন্ধ করুন',
        customClass: {
            popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn shadow-2xl',
            confirmButton: 'm3-btn-primary !bg-blue-600 hover:!bg-blue-500 !px-6 !py-2.5 !rounded-xl font-bold',
            cancelButton: 'm3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-5 !py-2.5 !rounded-xl font-bold border border-slate-700'
        }
    });

    if (result.isConfirmed) {
        if (typeof window.navigate === 'function') {
            window.navigate('ledger', { customerId: c.id });
        } else if (typeof window.filterLedgerByCustomer === 'function') {
            const sel = document.getElementById('ledger-customer-select');
            if (sel) sel.value = c.id;
            window.filterLedgerByCustomer(c.id);
        }
    }
}

/**
 * Attaches a live input event listener to phone inputs to show real-time inline duplicate warnings
 */
export function attachLiveDuplicatePhoneListener(inputElement, excludeId = null) {
    if (!inputElement) return;

    let hintEl = inputElement.parentElement?.querySelector('.live-dup-hint');
    if (!hintEl && inputElement.parentElement) {
        hintEl = document.createElement('div');
        hintEl.className = 'live-dup-hint hidden text-[11px] font-bn font-bold mt-1.5 p-2.5 rounded-xl border transition-all cursor-pointer';
        inputElement.parentElement.appendChild(hintEl);
    }

    const check = () => {
        if (!hintEl) return;
        const val = inputElement.value.trim();
        const dup = findDuplicateCustomer(val, '', excludeId);
        if (dup && dup.type === 'phone') {
            const c = dup.customer;
            const due = Number(c.totalDue || 0);
            const dueFormatted = formatAmountWithComma(Math.abs(due));
            const dueText = due > 0 
                ? `<span class="text-red-400 font-bold">৳ ${dueFormatted} (বকেয়া)</span>` 
                : (due < 0 ? `<span class="text-emerald-400 font-bold">৳ ${dueFormatted} (অগ্রিম)</span>` : '<span class="text-slate-300 font-bold">৳ ০</span>');
            
            hintEl.className = 'live-dup-hint text-[11px] font-bn font-bold mt-1.5 p-2 rounded-xl border bg-amber-500/10 border-amber-500/30 text-amber-300 shadow-sm hover:bg-amber-500/20 transition-all cursor-pointer block';
            hintEl.title = 'কাস্টমারের পূর্ণাঙ্গ তথ্য দেখতে ক্লিক করুন';
            hintEl.innerHTML = `
                <div class="flex flex-col gap-1">
                    <div class="flex items-center justify-between gap-1">
                        <span class="flex items-center gap-1.5 text-amber-300 truncate">
                            <i class="fa-solid fa-triangle-exclamation text-amber-400 shrink-0"></i>
                            <span class="truncate">ইতিমধ্যে অ্যাকাউন্ট আছে: <b>${c.name}</b></span>
                        </span>
                        <span class="text-cyan-400 font-mono text-[10px] shrink-0">#${c.accountNo || ''}</span>
                    </div>
                    <div class="flex items-center justify-between text-[10px] pt-1 border-t border-amber-500/20">
                        <span class="text-cyan-400 hover:underline flex items-center gap-1"><i class="fa-solid fa-circle-info text-[9px]"></i>সম্পূর্ণ তথ্য দেখতে ক্লিক করুন</span>
                        <div class="shrink-0 font-bold">${dueText}</div>
                    </div>
                </div>
            `;
            hintEl.onclick = () => showCustomerQuickInfoModal(c);
            hintEl.classList.remove('hidden');
        } else {
            hintEl.classList.add('hidden');
            hintEl.innerHTML = '';
        }
    };

    inputElement.addEventListener('input', check);
    inputElement.addEventListener('blur', check);
    // Initial check in case value was prefilled
    if (inputElement.value) check();
}

window.attachLiveDuplicatePhoneListener = attachLiveDuplicatePhoneListener;
window.showCustomerQuickInfoModal = showCustomerQuickInfoModal;


