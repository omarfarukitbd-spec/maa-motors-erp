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
        if (typeof window.filterLedgerByCustomer === 'function') {
            const selectEl = document.getElementById('ledger-customer-select');
            if (selectEl) selectEl.value = c.id;
            window.filterLedgerByCustomer(c.id);
        }
        if (typeof window.showSection === 'function') {
            window.showSection('ledger-sec');
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
