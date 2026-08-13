import Swal from 'sweetalert2';
import { showToast } from '../utils.js';

/**
 * Enterprise Zero-Mouse Keyboard Controller for Customer Management
 */

export function initCustomerHotkeys() {
    if (typeof window === 'undefined' || window._customerHotkeysInitialized) return;
    window._customerHotkeysInitialized = true;

    window.addEventListener('keydown', handleCustomerGlobalHotkeys);
    document.addEventListener('keydown', handleCustomerFormEnter);
}

function handleCustomerGlobalHotkeys(e) {
    // 1. SweetAlert active dialog Y/N handling
    if (Swal.isVisible()) {
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

    // 2. Ctrl + Enter: Save Customer Form if open
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const form = document.getElementById('add-customer-form');
        const saveBtn = document.getElementById('save-cust-btn');
        if (form && !form.classList.contains('hidden') && saveBtn && !saveBtn.disabled && window.saveNewCustomer) {
            e.preventDefault();
            window.saveNewCustomer();
            return;
        }
    }

    // 3. Escape: Close New Customer Form if open
    if (e.key === 'Escape') {
        const form = document.getElementById('add-customer-form');
        if (form && !form.classList.contains('hidden')) {
            e.preventDefault();
            if (window.toggleAddCustomerForm) window.toggleAddCustomerForm();
            return;
        }
    }

    // 4. Alt Hotkeys for Customer Page
    if (e.altKey && !e.ctrlKey && !e.shiftKey && !e.metaKey) {
        switch (e.key.toLowerCase()) {
            case 'n': // Alt + N: Toggle / Open New Customer Form
                e.preventDefault();
                toggleCustomerFormHotkey();
                break;
            case 's': // Alt + S: Focus Customer Search Box
                e.preventDefault();
                focusCustomerSearch();
                break;
            case 'z': // Alt + Z: Focus Zone Filter Dropdown
                e.preventDefault();
                focusZoneFilter();
                break;
            case 'h': // Alt + H: Show Customer Keyboard Guide
                e.preventDefault();
                showCustomerKeyboardGuide();
                break;
            case 'e': // Alt + E: Edit top customer
                e.preventDefault();
                editFirstCustomer();
                break;
            case 'd': // Alt + D: Delete top customer
                e.preventDefault();
                deleteFirstCustomer();
                break;
            case 'w': // Alt + W: Send WhatsApp to top customer
                e.preventDefault();
                sendFirstCustomerWhatsApp();
                break;
            case 'm': // Alt + M: Send SMS to top customer
                e.preventDefault();
                sendFirstCustomerSMS();
                break;
            case 'p': // Alt + P: Print customer list
                e.preventDefault();
                if (window.printFilteredCustomerList) window.printFilteredCustomerList();
                break;
            default:
                break;
        }
    }
}

function handleCustomerFormEnter(e) {
    if (e.key !== 'Enter' || e.ctrlKey || e.altKey || e.shiftKey || e.metaKey) return;
    if (Swal.isVisible()) return;

    const target = e.target;
    if (!target) return;

    const form = document.getElementById('add-customer-form');
    if (!form || !form.contains(target)) return;

    // Field progression on Enter
    if (target.id === 'cust-date') {
        e.preventDefault();
        document.getElementById('cust-name')?.focus();
    } else if (target.id === 'cust-name') {
        e.preventDefault();
        document.getElementById('cust-address')?.focus();
    } else if (target.id === 'cust-address') {
        e.preventDefault();
        document.getElementById('cust-phone')?.focus();
    } else if (target.id === 'cust-phone') {
        e.preventDefault();
        document.getElementById('cust-initial-balance')?.focus();
    } else if (target.id === 'cust-initial-balance') {
        e.preventDefault();
        document.getElementById('cust-zone-select')?.focus();
    } else if (target.id === 'cust-zone-select') {
        e.preventDefault();
        document.getElementById('save-cust-btn')?.focus();
    }
}

export function toggleCustomerFormHotkey() {
    const form = document.getElementById('add-customer-form');
    if (!form) return;
    if (form.classList.contains('hidden')) {
        if (window.toggleAddCustomerForm) window.toggleAddCustomerForm();
        setTimeout(() => {
            const nameInput = document.getElementById('cust-name');
            if (nameInput) {
                nameInput.focus();
                showToast('নতুন কাস্টমার ফর্ম প্রস্তুত (Alt+N)', 'info', 1000);
            }
        }, 150);
    } else {
        if (window.toggleAddCustomerForm) window.toggleAddCustomerForm();
    }
}

export function focusCustomerSearch() {
    const input = document.getElementById('cust-search-input');
    if (input) {
        input.focus();
        input.select();
        showToast('কাস্টমার সার্চ সক্রিয় (Alt+S)', 'info', 1000);
    }
}

export function focusZoneFilter() {
    const sel = document.getElementById('cust-filter-zone');
    if (sel) {
        sel.focus();
        showToast('জোন ফিল্টার সক্রিয় (Alt+Z)', 'info', 1000);
    }
}

export function editFirstCustomer() {
    const firstRow = document.querySelector('#customer-list tr');
    if (!firstRow) return showToast('এডিট করার মতো কাস্টমার পাওয়া যায়নি', 'warning');
    const editBtn = firstRow.querySelector('button[title*="এডিট"]');
    if (editBtn) {
        editBtn.click();
        showToast('কাস্টমার এডিট মোড খোলা হয়েছে', 'info');
    }
}

export function deleteFirstCustomer() {
    const firstRow = document.querySelector('#customer-list tr');
    if (!firstRow) return showToast('ডিলেট করার মতো কাস্টমার পাওয়া যায়নি', 'warning');
    const delBtn = firstRow.querySelector('button[title*="ডিলেট"]');
    if (delBtn) delBtn.click();
}

export function sendFirstCustomerWhatsApp() {
    const firstRow = document.querySelector('#customer-list tr');
    if (!firstRow) return showToast('কাস্টমার পাওয়া যায়নি', 'warning');
    const btn = firstRow.querySelector('button[title*="WhatsApp"]');
    if (btn) btn.click();
}

export function sendFirstCustomerSMS() {
    const firstRow = document.querySelector('#customer-list tr');
    if (!firstRow) return showToast('কাস্টমার পাওয়া যায়নি', 'warning');
    const btn = firstRow.querySelector('button[title*="SMS"], button[title*="রিমাইন্ডার"]');
    if (btn) btn.click();
}

export function showCustomerKeyboardGuide() {
    Swal.fire({
        title: `<div class="flex items-center justify-center gap-2.5 font-bn font-black text-xl text-white"><i class="fa-solid fa-keyboard text-purple-400"></i><span>কাস্টমার কীবোর্ড গাইডলাইন (Zero-Mouse)</span></div>`,
        html: `
            <div class="text-left font-bn space-y-3.5 max-h-[65vh] overflow-y-auto custom-scrollbar pr-1">
                <div class="p-2.5 bg-purple-500/10 border border-purple-500/20 rounded-2xl">
                    <div class="text-xs font-bold text-purple-300 flex items-center gap-2">
                        <i class="fa-solid fa-bolt text-amber-400"></i>
                        <span>মাউস ছাড়া সম্পূর্ণ কাস্টমার তৈরি ও ম্যানেজ করার গাইডলাইন</span>
                    </div>
                </div>
                <div class="space-y-1.5">
                    <h4 class="text-xs font-black text-blue-400 uppercase tracking-wider flex items-center gap-1.5"><i class="fa-solid fa-user-plus text-[10px]"></i> ১. নতুন কাস্টমার তৈরি (Enter Flow)</h4>
                    <div class="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 text-xs space-y-1.5">
                        <div class="flex items-center justify-between"><span class="text-slate-300">নতুন কাস্টমার ফর্ম খোলা / বন্ধ</span><kbd class="m3-kbd">Alt + N</kbd></div>
                        <div class="flex items-center justify-between"><span class="text-slate-300">পরবর্তী ফিল্ডে যাওয়া (Date ➔ Name ➔ Addr ➔ Phone ➔ Due ➔ Zone)</span><kbd class="m3-kbd">Enter</kbd></div>
                        <div class="flex items-center justify-between"><span class="text-slate-300">যেকোনো ফিল্ড থেকে সরাসরি কাস্টমার সেভ</span><kbd class="m3-kbd bg-blue-600/30 text-blue-300 border-blue-500/40">Ctrl + Enter</kbd></div>
                        <div class="flex items-center justify-between"><span class="text-slate-300">কাস্টমার ফর্ম বাতিল / বন্ধ করা</span><kbd class="m3-kbd text-red-400">Esc</kbd></div>
                    </div>
                </div>
                <div class="space-y-1.5">
                    <h4 class="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5"><i class="fa-solid fa-magnifying-glass text-[10px]"></i> ২. সার্চ ও জোন ফিল্টারিং</h4>
                    <div class="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 text-xs space-y-1.5">
                        <div class="flex items-center justify-between"><span class="text-slate-300">কাস্টমার সার্চ বক্সে সরাসরি ফোকাস</span><kbd class="m3-kbd">Alt + S</kbd></div>
                        <div class="flex items-center justify-between"><span class="text-slate-300">জোন ফিল্টার ড্রপডাউনে ফোকাস</span><kbd class="m3-kbd">Alt + Z</kbd></div>
                    </div>
                </div>
                <div class="space-y-1.5">
                    <h4 class="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5"><i class="fa-solid fa-sliders text-[10px]"></i> ৩. কাস্টমার লিস্ট অ্যাকশন</h4>
                    <div class="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 text-xs space-y-1.5">
                        <div class="flex items-center justify-between"><span class="text-slate-300">শীর্ষ কাস্টমারকে এডিট করুন</span><kbd class="m3-kbd">Alt + E</kbd></div>
                        <div class="flex items-center justify-between"><span class="text-slate-300">শীর্ষ কাস্টমারকে ডিলেট করুন</span><kbd class="m3-kbd">Alt + D</kbd></div>
                        <div class="flex items-center justify-between"><span class="text-slate-300">কাস্টমারকে WhatsApp তাগাদা পাঠান</span><kbd class="m3-kbd">Alt + W</kbd></div>
                        <div class="flex items-center justify-between"><span class="text-slate-300">কাস্টমারকে SMS রিমাইন্ডার পাঠান</span><kbd class="m3-kbd">Alt + M</kbd></div>
                        <div class="flex items-center justify-between"><span class="text-slate-300">কাস্টমার লিস্ট প্রিন্ট করুন</span><kbd class="m3-kbd">Alt + P</kbd></div>
                    </div>
                </div>
                <div class="space-y-1.5">
                    <h4 class="text-xs font-black text-purple-400 uppercase tracking-wider flex items-center gap-1.5"><i class="fa-solid fa-message-sms text-[10px]"></i> ৪. পপআপ ও কনফার্মেশন</h4>
                    <div class="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 text-xs space-y-1.5">
                        <div class="flex items-center justify-between"><span class="text-slate-300">কনফার্ম / হ্যাঁ (OK)</span><span class="flex items-center gap-1"><kbd class="m3-kbd text-emerald-400">Enter</kbd> বা <kbd class="m3-kbd text-emerald-400">Y</kbd></span></div>
                        <div class="flex items-center justify-between"><span class="text-slate-300">বাতিল / না (Cancel)</span><span class="flex items-center gap-1"><kbd class="m3-kbd text-red-400">Esc</kbd> বা <kbd class="m3-kbd text-red-400">N</kbd></span></div>
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

window.initCustomerHotkeys = initCustomerHotkeys;
window.showCustomerKeyboardGuide = showCustomerKeyboardGuide;
window.toggleCustomerFormHotkey = toggleCustomerFormHotkey;
window.focusCustomerSearch = focusCustomerSearch;
window.focusZoneFilter = focusZoneFilter;
window.editFirstCustomer = editFirstCustomer;
window.deleteFirstCustomer = deleteFirstCustomer;
window.sendFirstCustomerWhatsApp = sendFirstCustomerWhatsApp;
window.sendFirstCustomerSMS = sendFirstCustomerSMS;
