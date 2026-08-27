import Swal from 'sweetalert2';
import { showToast } from './ui-helpers.js';

export function showHotkeyHelpModal() {
    Swal.fire({
        title: '<div class="flex items-center justify-center gap-2 font-bn font-black text-xl text-amber-400"><i class="fa-solid fa-keyboard"></i><span>সুপার-ফাস্ট কিবোর্ড শর্টকাট গাইড</span></div>',
        html: `
            <div class="text-left font-bn p-2 space-y-2 text-xs">
                <p class="text-slate-400 font-bold mb-3 text-center">কিবোর্ডের বাটন চেপে খুব সহজে ১ সেকেন্ডে মাউস ছাড়াই কাজ করুন:</p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div class="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center"><span class="text-white font-bold"><i class="fa-solid fa-chart-pie mr-2 text-blue-400"></i>ড্যাশবোর্ড</span><kbd class="bg-blue-600/30 text-blue-300 px-2 py-1 rounded font-mono font-black border border-blue-500/40">F1 / Alt+H</kbd></div>
                    <div class="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center"><span class="text-white font-bold"><i class="fa-solid fa-receipt mr-2 text-emerald-400"></i>ইনভয়েস/ভাউচার</span><kbd class="bg-emerald-600/30 text-emerald-300 px-2 py-1 rounded font-mono font-black border border-emerald-500/40">F2 / Alt+I</kbd></div>
                    <div class="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center"><span class="text-white font-bold"><i class="fa-solid fa-wallet mr-2 text-purple-400"></i>খতিয়ান পাসবুক</span><kbd class="bg-purple-600/30 text-purple-300 px-2 py-1 rounded font-mono font-black border border-purple-500/40">F3 / Alt+L</kbd></div>
                    <div class="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center"><span class="text-white font-bold"><i class="fa-solid fa-users mr-2 text-sky-400"></i>কাস্টমার তালিকা</span><kbd class="bg-sky-600/30 text-sky-300 px-2 py-1 rounded font-mono font-black border border-sky-500/40">F4 / Alt+C</kbd></div>
                    <div class="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center"><span class="text-white font-bold"><i class="fa-solid fa-file-invoice-dollar mr-2 text-red-400"></i>দৈনিক খরচ</span><kbd class="bg-red-600/30 text-red-300 px-2 py-1 rounded font-mono font-black border border-red-500/40">F6 / Alt+E</kbd></div>
                    <div class="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center"><span class="text-white font-bold"><i class="fa-solid fa-bolt mr-2 text-amber-400"></i>ফাস্ট এন্ট্রি</span><kbd class="bg-amber-600/30 text-amber-300 px-2 py-1 rounded font-mono font-black border border-amber-500/40">F7 / Alt+B</kbd></div>
                    <div class="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center"><span class="text-white font-bold"><i class="fa-solid fa-gear mr-2 text-slate-400"></i>সফ্টওয়্যার সেটিংস</span><kbd class="bg-slate-800 text-slate-300 px-2 py-1 rounded font-mono font-black border border-slate-700">F8 / Alt+S</kbd></div>
                    <div class="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center"><span class="text-white font-bold"><i class="fa-solid fa-barcode mr-2 text-cyan-400"></i>মেমো সার্চ</span><kbd class="bg-cyan-600/30 text-cyan-300 px-2 py-1 rounded font-mono font-black border border-cyan-500/40">F9 / Alt+M</kbd></div>
                    <div class="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center"><span class="text-white font-bold"><i class="fa-solid fa-magnifying-glass mr-2 text-blue-400"></i>গ্লোবাল সার্চ bar</span><kbd class="bg-blue-600/30 text-blue-300 px-2 py-1 rounded font-mono font-black border border-blue-500/40">Ctrl + K</kbd></div>
                    <div class="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center"><span class="text-white font-bold"><i class="fa-solid fa-floppy-disk mr-2 text-emerald-400"></i>স্মার্ট অটো-সেভ</span><kbd class="bg-emerald-600/30 text-emerald-300 px-2 py-1 rounded font-mono font-black border border-emerald-500/40">Ctrl + S</kbd></div>
                    <div class="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center"><span class="text-white font-bold"><i class="fa-solid fa-plus-circle mr-2 text-amber-400"></i>স্মার্ট নতুন এন্ট্রি</span><kbd class="bg-amber-600/30 text-amber-300 px-2 py-1 rounded font-mono font-black border border-amber-500/40">Alt + N / Insert</kbd></div>
                    <div class="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center"><span class="text-white font-bold"><i class="fa-solid fa-print mr-2 text-blue-400"></i>পেজ / লিস্ট প্রিন্ট</span><kbd class="bg-blue-600/30 text-blue-300 px-2 py-1 rounded font-mono font-black border border-blue-500/40">Alt + P</kbd></div>
                    <div class="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center"><span class="text-white font-bold"><i class="fa-solid fa-circle-info mr-2 text-purple-400"></i>শর্টকাট হেল্প গাইড</span><kbd class="bg-purple-600/30 text-purple-300 px-2 py-1 rounded font-mono font-black border border-purple-500/40">F10 / Shift+?</kbd></div>
                </div>
            </div>
        `,
        confirmButtonText: 'ঠিক আছে (Close)',
        customClass: {
            popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn max-w-2xl',
            confirmButton: 'm3-btn-primary !bg-blue-600 hover:!bg-blue-500 !px-7 !py-2.5 !rounded-xl font-bold shadow-lg shadow-blue-600/30'
        }
    });
}

export function setupGlobalHotkeys(callbacks = {}) {
    window.addEventListener('keydown', (e) => {
        const goNav = (view, params) => {
            if (typeof window.navigate === 'function') window.navigate(view, params);
            else if (typeof window.navigateTo === 'function') window.navigateTo(view, params);
        };

        const activeTag = document.activeElement?.tagName?.toLowerCase();
        const isEditable = activeTag === 'input' || activeTag === 'textarea' || document.activeElement?.isContentEditable;

        // F10 or Shift + ? -> Open Hotkey Cheat Sheet
        if (e.key === 'F10' || (e.shiftKey && e.key === '?')) {
            if (!isEditable || e.key === 'F10') {
                e.preventDefault();
                showHotkeyHelpModal();
                return;
            }
        }

        // F1 -> Dashboard
        if (e.key === 'F1') {
            e.preventDefault();
            goNav('dashboard');
            return;
        }

        // F2 -> Invoice / Voucher Generator
        if (e.key === 'F2') {
            e.preventDefault();
            goNav('invoice');
            return;
        }

        // F3 -> Ledger Passbook
        if (e.key === 'F3') {
            e.preventDefault();
            goNav('ledger');
            return;
        }

        // F4 -> Customers List
        if (e.key === 'F4') {
            e.preventDefault();
            goNav('customers');
            return;
        }

        // F6 -> Daily Expenses
        if (e.key === 'F6') {
            e.preventDefault();
            goNav('expenses');
            return;
        }

        // F7 -> Fast Entry / Bulk Billing
        if (e.key === 'F7') {
            e.preventDefault();
            goNav('bulk');
            return;
        }

        // F8 -> Software Settings
        if (e.key === 'F8') {
            e.preventDefault();
            goNav('settings');
            return;
        }

        // F9 or Alt+M -> Instant Memo Search
        if (e.key === 'F9' || (e.altKey && e.key.toLowerCase() === 'm')) {
            e.preventDefault();
            goNav('memo-search');
            return;
        }

        // Ctrl + S or Cmd + S -> Universal Smart Auto-Save
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
            e.preventDefault();

            // 1. SweetAlert2 Confirmation Dialog Open
            if (Swal.isVisible()) {
                const confirmBtn = Swal.getConfirmButton();
                if (confirmBtn && !confirmBtn.disabled) {
                    confirmBtn.click();
                    return;
                }
            }

            // 2. Dashboard Add Customer Form Open
            const dashForm = document.getElementById('dash-add-customer-form');
            if (dashForm && !dashForm.classList.contains('hidden')) {
                if (typeof window.saveDashCustomer === 'function') {
                    window.saveDashCustomer();
                    return;
                }
            }

            // 3. Customer Modal Open
            const custModal = document.getElementById('customer-modal');
            if (custModal && !custModal.classList.contains('hidden')) {
                if (typeof window.saveCustomer === 'function') {
                    window.saveCustomer();
                    return;
                }
            }

            // 4. Invoice Page Active
            if (document.getElementById('inv-items-tbody')) {
                if (typeof window.saveAndPrintInvoice === 'function') {
                    window.saveAndPrintInvoice('pos');
                    return;
                }
            }

            // 5. Expense Form Active
            const expSaveBtn = document.getElementById('expense-save-btn') || document.getElementById('save-expense-btn');
            if (expSaveBtn) {
                expSaveBtn.click();
                return;
            }
            if (typeof window.saveExpense === 'function') {
                window.saveExpense();
                return;
            }

            // 6. Settings Page Active
            const settingsSaveBtn = document.getElementById('settings-save-btn') || document.getElementById('save-settings-btn');
            if (settingsSaveBtn) {
                settingsSaveBtn.click();
                return;
            }
            if (typeof window.saveSettings === 'function') {
                window.saveSettings();
                return;
            }

            // 7. Generic Fallback: Click primary save button inside page
            const primarySaveBtn = document.querySelector('.m3-btn-primary, button[type="submit"]');
            if (primarySaveBtn) {
                primarySaveBtn.click();
                return;
            }

            showToast('ডাটা সেভ প্রসেস করা হচ্ছে...', 'info');
            return;
        }

        // Ctrl + K or Cmd + K -> Command Palette / Omnisearch
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            if (callbacks.toggleOmnisearch) callbacks.toggleOmnisearch();
            return;
        }

        // Escape Key -> Close Modal / Omnisearch
        if (e.key === 'Escape') {
            if (callbacks.toggleOmnisearch) callbacks.toggleOmnisearch(false);
            return;
        }

        // Contextual New Record Entry Engine (No Popup): Alt + N, Ctrl + Shift + N, Insert
        const isNewRecordHotkey = (e.altKey && e.key.toLowerCase() === 'n')
            || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'n')
            || e.key === 'Insert';

        if (isNewRecordHotkey) {
            e.preventDefault();
            e.stopPropagation();

            const currentView = window.AppState?.currentView || 'dashboard';

            // If on customer page, customer-hotkeys.js handles it directly
            if (currentView === 'customers' || document.getElementById('add-customer-form')) {
                return;
            }

            // 2. Dashboard Page -> Open inline Dashboard Customer Form
            const dashForm = document.getElementById('dash-add-customer-form');
            if (dashForm && currentView === 'dashboard') {
                if (typeof window.toggleDashCustomerForm === 'function') {
                    window.toggleDashCustomerForm();
                    return;
                }
            }

            // 3. Invoice Page -> Add New Item Line Row
            if (currentView === 'invoice' || document.getElementById('inv-items-tbody')) {
                if (typeof window.addInvoiceItemRow === 'function') {
                    window.addInvoiceItemRow();
                    showToast('+ নতুন ইনভয়েস লাইন যোগ করা হয়েছে', 'success');
                    return;
                }
            }

            // 4. Daily Expenses Page -> Open Expense Entry Form
            if (currentView === 'expenses' || document.getElementById('expense-modal')) {
                const expAddBtn = document.getElementById('add-expense-btn') || document.getElementById('btn-add-expense');
                if (expAddBtn) {
                    expAddBtn.click();
                    return;
                }
                if (typeof window.openExpenseModal === 'function') {
                    window.openExpenseModal();
                    return;
                }
            }

            // 5. Fast Entry Page -> Add New Row
            if (currentView === 'bulk') {
                if (typeof window.addBulkRow === 'function') {
                    window.addBulkRow();
                    showToast('+ নতুন স্প্রেডশীট রো যোগ করা হয়েছে', 'success');
                    return;
                }
            }

            // Fallback: Click inline customer toggle button on page
            const newCustBtn = document.querySelector('[onclick*="toggleDashCustomerForm"], [onclick*="toggleAddCustomerForm"]');
            if (newCustBtn) {
                newCustBtn.click();
                return;
            }

            if (typeof window.toggleDashCustomerForm === 'function') {
                window.toggleDashCustomerForm();
            }
            return;
        }

        // Alt + P -> Print
        if (e.altKey && e.key.toLowerCase() === 'p') {
            e.preventDefault();
            if (window.printFilteredCustomerList) window.printFilteredCustomerList();
            else window.print();
            return;
        }
    });
}
