import Swal from 'sweetalert2';
import { showToast } from '../utils.js';

/**
 * Enterprise Zero-Mouse Keyboard Controller for Ledger Module
 */

export function initLedgerHotkeys() {
    if (typeof window === 'undefined' || window._ledgerHotkeysInitialized) return;
    window._ledgerHotkeysInitialized = true;

    window.addEventListener('keydown', handleGlobalHotkeys);
    document.addEventListener('keydown', handleFormEnterAdvancement);
}

function handleGlobalHotkeys(e) {
    // 1. SweetAlert active dialog Y/N handling
    if (Swal.isVisible()) {
        const activeTag = document.activeElement?.tagName?.toLowerCase();
        const isEditable = activeTag === 'input' || activeTag === 'textarea' || document.activeElement?.isContentEditable;
        if (isEditable) return; // Do not intercept typing

        const key = e.key.toLowerCase();
        if (key === 'y' && !e.ctrlKey && !e.altKey && !e.metaKey) {
            e.preventDefault();
            const confirmBtn = Swal.getConfirmButton();
            if (confirmBtn && !confirmBtn.disabled) confirmBtn.click();
            return;
        }
        if (key === 'n' && !e.ctrlKey && !e.altKey && !e.metaKey) {
            e.preventDefault();
            const cancelBtn = Swal.getCancelButton();
            if (cancelBtn && !cancelBtn.disabled) cancelBtn.click();
            return;
        }
    }

    // 2. Ctrl + Enter: Save Transaction
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const saveBtn = document.getElementById('save-txn-btn');
        const isBulk = Boolean(document.getElementById('spreadsheet-body'));
        if (isBulk && window.saveSpreadsheetData) {
            e.preventDefault();
            window.saveSpreadsheetData();
        } else if (saveBtn && !saveBtn.disabled && window.saveTransaction) {
            e.preventDefault();
            window.saveTransaction();
        }
        return;
    }

    // 3. Alt Hotkeys
    if (e.altKey && !e.ctrlKey && !e.shiftKey && !e.metaKey) {
        const isSpreadsheet = Boolean(document.getElementById('spreadsheet-body'));
        const fn = isSpreadsheet ? window.quickSelectSpreadsheetAccount : window.quickSelectPaymentAccount;

        switch (e.key.toLowerCase()) {
            case '1':
                e.preventDefault();
                if (fn) fn('Bank', 'OneBank (IFRAT)');
                break;
            case '2':
                e.preventDefault();
                if (fn) fn('Bank', 'IBBL (IFRAT)');
                break;
            case '3':
                e.preventDefault();
                if (fn) fn('Cash', 'শোরুম ক্যাশ');
                break;
            case '4':
                e.preventDefault();
                if (fn) fn('Less', 'বিশেষ ছাড়');
                break;
            case 's': // Alt + S: Focus Customer Search
                e.preventDefault();
                focusCustomerSearch();
                break;
            case 'h': // Alt + H: Show Keyboard Guide
                e.preventDefault();
                showLedgerKeyboardGuide();
                break;
            case 'e': // Alt + E: Edit last transaction
                e.preventDefault();
                editLastTransaction();
                break;
            case 'd': // Alt + D: Delete last transaction
                e.preventDefault();
                deleteLastTransaction();
                break;
            case 'r': // Alt + R: Print receipt for last transaction
                e.preventDefault();
                printLastTransaction();
                break;
            default:
                break;
        }
    }
}

function handleFormEnterAdvancement(e) {
    if (e.key !== 'Enter' || e.ctrlKey || e.altKey || e.shiftKey || e.metaKey) return;
    if (Swal.isVisible()) return;

    const target = e.target;
    if (!target) return;

    const form = document.getElementById('ledger-form-card');
    if (!form || !form.contains(target)) return;

    // Field step progression
    if (target.id === 'ledger-date') {
        e.preventDefault();
        document.getElementById('ledger-voucher')?.focus();
    } else if (target.id === 'ledger-voucher') {
        e.preventDefault();
        document.getElementById('ledger-bill')?.focus();
    } else if (target.id === 'ledger-bill') {
        e.preventDefault();
        document.getElementById('ledger-paid')?.focus();
    } else if (target.id === 'ledger-paid') {
        e.preventDefault();
        const p = parseFloat(target.value.replace(/,/g, '')) || 0;
        if (p > 0) {
            document.getElementById('ledger-received-from')?.focus();
        } else {
            document.getElementById('save-txn-btn')?.focus();
        }
    } else if (target.id === 'ledger-received-from') {
        e.preventDefault();
        document.getElementById('save-txn-btn')?.focus();
    }
}

export function focusCustomerSearch() {
    const input = document.getElementById('ledger-cust-search-input');
    if (input) {
        input.focus();
        input.select();
        showToast('কাস্টমার সার্চ সক্রিয় (Alt+S)', 'info', 1000);
    }
}

export function editLastTransaction() {
    const firstRow = document.querySelector('#ledger-list tr');
    if (!firstRow) return showToast('এডিট করার মতো লেনদেন পাওয়া যায়নি', 'warning');
    const editBtn = firstRow.querySelector('button[title*="এডিট"]');
    if (editBtn) {
        editBtn.click();
        showToast('সর্বশেষ লেনদেন এডিট মোডে লোড হয়েছে', 'info');
    }
}

export function deleteLastTransaction() {
    const firstRow = document.querySelector('#ledger-list tr');
    if (!firstRow) return showToast('ডিলেট করার মতো লেনদেন পাওয়া যায়নি', 'warning');
    const delBtn = firstRow.querySelector('button[title*="ডিলেট"]');
    if (delBtn) delBtn.click();
}

export function printLastTransaction() {
    const firstRow = document.querySelector('#ledger-list tr');
    if (!firstRow) return showToast('প্রিন্ট করার মতো লেনদেন পাওয়া যায়নি', 'warning');
    const printBtn = firstRow.querySelector('button[title*="রিসিপ্ট"], button[title*="ভাউচার"], button[title*="প্রিন্ট"]');
    if (printBtn) printBtn.click();
}

export function showLedgerKeyboardGuide() {
    Swal.fire({
        title: `
            <div class="flex items-center justify-center gap-2.5 font-bn font-black text-xl text-white">
                <i class="fa-solid fa-keyboard text-purple-400"></i>
                <span>খতিয়ান কীবোর্ড গাইডলাইন (Zero-Mouse)</span>
            </div>
        `,
        html: `
            <div class="text-left font-bn space-y-4 max-h-[65vh] overflow-y-auto custom-scrollbar pr-1">
                <div class="p-3 bg-purple-500/10 border border-purple-500/20 rounded-2xl">
                    <div class="text-xs font-bold text-purple-300 flex items-center gap-2">
                        <i class="fa-solid fa-bolt text-amber-400"></i>
                        <span>মাউস ছাড়া দ্রুত ডাটা এন্ট্রি করার পূর্ণাঙ্গ নিয়মাবলী</span>
                    </div>
                </div>

                <div class="space-y-2">
                    <h4 class="text-xs font-black text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                        <i class="fa-solid fa-arrow-progress text-[10px]"></i> ১. ডাটা এন্ট্রি নেভিগেশন (Enter Flow)
                    </h4>
                    <div class="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 text-xs space-y-2">
                        <div class="flex items-center justify-between">
                            <span class="text-slate-300">কাস্টমার সার্চে নাম লিখে নির্বাচন</span>
                            <span class="flex items-center gap-1"><kbd class="m3-kbd">↓ / ↑</kbd> + <kbd class="m3-kbd">Enter</kbd></span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-slate-300">পরবর্তী ফিল্ডে যাওয়া (Date ➔ Memo ➔ Bill ➔ Paid)</span>
                            <kbd class="m3-kbd">Enter</kbd>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-slate-300">যেকোনো ফিল্ড থেকে সরাসরি এন্ট্রি সেভ</span>
                            <kbd class="m3-kbd bg-blue-600/30 text-blue-300 border-blue-500/40">Ctrl + Enter</kbd>
                        </div>
                    </div>
                </div>

                <div class="space-y-2">
                    <h4 class="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                        <i class="fa-solid fa-building-columns text-[10px]"></i> ২. ১-ক্লিক ব্যাংক ও ক্যাশ সিলেক্ট
                    </h4>
                    <div class="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 text-xs space-y-2">
                        <div class="flex items-center justify-between">
                            <span class="text-slate-300">OneBank (IFRAT) সিলেক্ট</span>
                            <kbd class="m3-kbd">Alt + 1</kbd>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-slate-300">IBBL (IFRAT) সিলেক্ট</span>
                            <kbd class="m3-kbd">Alt + 2</kbd>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-slate-300">শোরুম ক্যাশ সিলেক্ট</span>
                            <kbd class="m3-kbd">Alt + 3</kbd>
                        </div>
                    </div>
                </div>

                <div class="space-y-2">
                    <h4 class="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                        <i class="fa-solid fa-message-sms text-[10px]"></i> ৩. পপআপ ও SMS হ্যান্ডলিং
                    </h4>
                    <div class="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 text-xs space-y-2">
                        <div class="flex items-center justify-between">
                            <span class="text-slate-300">কনফার্ম / SMS পাঠান (OK)</span>
                            <span class="flex items-center gap-1"><kbd class="m3-kbd text-emerald-400">Enter</kbd> বা <kbd class="m3-kbd text-emerald-400">Y</kbd></span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-slate-300">বাতিল / পপআপ বন্ধ (Cancel)</span>
                            <span class="flex items-center gap-1"><kbd class="m3-kbd text-red-400">Esc</kbd> বা <kbd class="m3-kbd text-red-400">N</kbd></span>
                        </div>
                    </div>
                </div>

                <div class="space-y-2">
                    <h4 class="text-xs font-black text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                        <i class="fa-solid fa-sliders text-[10px]"></i> ৪. কুইক অ্যাকশন শর্টকাট
                    </h4>
                    <div class="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 text-xs space-y-2">
                        <div class="flex items-center justify-between">
                            <span class="text-slate-300">কাস্টমার সার্চ বক্সে সরাসরি ফোকাস</span>
                            <kbd class="m3-kbd">Alt + S</kbd>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-slate-300">সর্বশেষ লেনদেন এডিট করুন</span>
                            <kbd class="m3-kbd">Alt + E</kbd>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-slate-300">সর্বশেষ লেনদেন ডিলেট করুন</span>
                            <kbd class="m3-kbd">Alt + D</kbd>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-slate-300">মানি রিসিপ্ট প্রিন্ট</span>
                            <kbd class="m3-kbd">Alt + R</kbd>
                        </div>
                    </div>
                </div>
            </div>
        `,
        confirmButtonText: '<i class="fa-solid fa-check mr-2"></i>ঠিক আছে (Enter)',
        customClass: {
            popup: 'rounded-3xl bg-slate-950 border border-slate-700/80 shadow-2xl p-6 text-white',
            confirmButton: 'm3-btn-primary rounded-xl px-8 py-2.5 text-xs font-bold'
        }
    });
}

window.initLedgerHotkeys = initLedgerHotkeys;
window.showLedgerKeyboardGuide = showLedgerKeyboardGuide;
window.editLastTransaction = editLastTransaction;
window.deleteLastTransaction = deleteLastTransaction;
window.printLastTransaction = printLastTransaction;
window.focusCustomerSearch = focusCustomerSearch;
