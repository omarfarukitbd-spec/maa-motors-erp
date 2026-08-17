import Swal from 'sweetalert2';
import { UserDAO } from '../dao.js';
import { auditLog } from '../audit.js';
import { promptSecurityPin } from '../utils.js';

/**
 * Sophisticated Permission Management
 * Fully Restored from original logic.
 */
export async function managePermissions(userId, email) {
    if (window.AppState.currentUserRole !== 'Admin') return;

    const isPinValid = await promptSecurityPin("পারমিশন পরিবর্তন (Manage Permissions)");
    if (!isPinValid) return;

    try {
        const userData = await UserDAO.getById(userId);
        const perms = userData.permissions || {};

        const createToggle = (id, label, subLabel, isChecked) => `
            <label class="flex items-center justify-between p-2.5 bg-slate-950/50 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer border border-slate-800 hover:border-slate-700 mb-2">
                <div>
                    <div class="text-[13px] font-bold text-slate-200 leading-tight">${label}</div>
                    <div class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">${subLabel}</div>
                </div>
                <div class="relative flex items-center">
                    <input type="checkbox" id="${id}" class="peer sr-only" ${isChecked ? 'checked' : ''}>
                    <div class="w-10 h-5 bg-slate-800 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-500/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 peer-checked:after:bg-white after:border-slate-800 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500 shadow-inner"></div>
                </div>
            </label>
        `;

        const { value: formValues } = await Swal.fire({
            title: `Permissions for ${email}`,
            html: `
                <div class="text-left space-y-1.5 text-sm mt-3 p-3 bg-slate-900 rounded-2xl border border-slate-800 max-h-[60vh] overflow-y-auto font-bn custom-scrollbar">
                    <div class="text-xs font-black text-blue-400 uppercase tracking-widest border-b border-slate-800 pb-1.5 mb-3 sticky top-0 bg-slate-900 z-10 pt-1"><i class="fa-solid fa-chart-pie mr-1.5"></i>ড্যাশবোর্ড ও রিপোর্ট পারমিশন:</div>

                    ${createToggle('perm-viewDashboard', 'ড্যাশবোর্ড মেনু দেখার অনুমতি', 'View Dashboard', perms.viewDashboard !== false)}
                    ${createToggle('perm-viewDashboardFinancials', 'টাকার অংক ও মোট বকেয়া দেখা', 'View Financial Stats', perms.viewDashboardFinancials !== false)}
                    ${createToggle('perm-viewDashChart', 'আয়-ব্যয়ের গ্রাফ ও অ্যানালিটিক্স', 'View Analytics Chart', perms.viewDashChart !== false)}
                    ${createToggle('perm-viewDashRecentCol', 'সর্বশেষ কালেকশন লিস্ট দেখা', 'View Recent Collections', perms.viewDashRecentCol !== false)}
                    ${createToggle('perm-viewDashTopDue', 'শীর্ষ ৫ বকেয়া কাস্টমার লিস্ট', 'View Top Due Customers', perms.viewDashTopDue !== false)}
                    ${createToggle('perm-dashAddCustomer', 'দ্রুত কাস্টমার যুক্ত করার বাটন', 'Quick Add Customer', perms.dashAddCustomer !== false)}
                    ${createToggle('perm-printExecutiveReport', '১-ক্লিক দৈনিক এক্সিকিউটিভ রিপোর্ট', 'Print Executive Summary', perms.printExecutiveReport !== false)}

                    <div class="text-xs font-black text-amber-400 uppercase tracking-widest border-b border-slate-800 pb-1.5 mt-4 mb-2"><i class="fa-solid fa-book mr-1.5"></i>খতিয়ান ও লেনদেন (Ledger & Icons):</div>

                    <label class="flex items-center gap-3 text-white cursor-pointer hover:bg-slate-800/50 p-1.5 rounded-lg transition-colors">
                    ${createToggle('perm-viewLedger', 'লেজার খতিয়ান দেখার অনুমতি', 'View Ledger', perms.viewLedger !== false)}
                    ${createToggle('perm-addLedgerEntry', 'নতুন এন্ট্রি করা (বিল/জমা)', 'Add Ledger Entry', perms.addLedgerEntry !== false)}
                    ${createToggle('perm-editLedger', 'এন্ট্রি এডিট করা', 'Edit Entry', perms.editLedger !== false && perms.manageLedger !== false)}
                    ${createToggle('perm-deleteLedger', 'এন্ট্রি ডিলিট করা', 'Delete Entry', perms.deleteLedger === true)}
                    ${createToggle('perm-exportLedger', 'লেজার এক্সেল ডাউনলোড', 'Export Excel', perms.exportLedger !== false)}
                    ${createToggle('perm-printLedgerReceipt', 'ট্রানজেকশন রিসিপ্ট প্রিন্ট করা', 'Print Receipt', perms.printLedgerReceipt !== false)}
                    ${createToggle('perm-sendLedgerWhatsApp', 'ট্রানজেকশন WhatsApp মেসেজ', 'WhatsApp Alert', perms.sendLedgerWhatsApp !== false)}
                    ${createToggle('perm-sendLedgerSMS', 'ট্রানজেকশন SMS', 'SMS Alert', perms.sendLedgerSMS !== false)}

                    <div class="text-xs font-black text-purple-400 uppercase tracking-widest border-b border-slate-800 pb-1.5 mt-4 mb-2"><i class="fa-solid fa-bolt mr-1.5"></i>দ্রুত এন্ট্রি ও ইনভয়েস (Bulk & Invoices):</div>

                    <label class="flex items-center gap-3 text-white cursor-pointer hover:bg-slate-800/50 p-1.5 rounded-lg transition-colors">
                        <input type="checkbox" id="perm-viewBulkEntry" class="w-5 h-5 rounded bg-slate-950 border-slate-700 text-blue-500 focus:ring-blue-500" ${perms.viewBulkEntry !== false ? 'checked' : ''}>
                        <span class="leading-tight">ফাস্ট এন্ট্রি (Bulk Entry) ব্যবহারের অনুমতি<br><span class="text-[11px] text-slate-400 font-bold">View Bulk Entry</span></span>
                    </label>
                    <label class="flex items-center gap-3 text-white cursor-pointer hover:bg-slate-800/50 p-1.5 rounded-lg transition-colors">
                        <input type="checkbox" id="perm-viewInvoice" class="w-5 h-5 rounded bg-slate-950 border-slate-700 text-blue-500 focus:ring-blue-500" ${perms.viewInvoice !== false ? 'checked' : ''}>
                        <span class="leading-tight">ইনভয়েস/ভাউচার তৈরি ও প্রিন্টের অনুমতি<br><span class="text-[11px] text-slate-400 font-bold">Create Invoice & Voucher</span></span>
                    </label>
                    <label class="flex items-center gap-3 text-white cursor-pointer hover:bg-slate-800/50 p-1.5 rounded-lg transition-colors pl-6 border-l-2 border-purple-500/50">
                        <input type="checkbox" id="perm-allowInvoiceDiscount" class="w-5 h-5 rounded bg-slate-950 border-slate-700 text-purple-400 focus:ring-purple-400" ${perms.allowInvoiceDiscount !== false ? 'checked' : ''}>
                        <span class="leading-tight text-purple-300"><i class="fa-solid fa-tag mr-1 text-purple-400"></i>ইনভয়েসে ডিসকাউন্ট / ছাড় দেওয়ার অনুমতি<br><span class="text-[11px] text-slate-400 font-bold">Allow Invoice Discounts</span></span>
                    </label>

                    <div class="text-xs font-black text-emerald-400 uppercase tracking-widest border-b border-slate-800 pb-1.5 mt-4 mb-2"><i class="fa-solid fa-wallet mr-1.5"></i>দৈনিক খরচ (Daily Expenses):</div>

                    <label class="flex items-center gap-3 text-white cursor-pointer hover:bg-slate-800/50 p-1.5 rounded-lg transition-colors">
                        <input type="checkbox" id="perm-viewExpenses" class="w-5 h-5 rounded bg-slate-950 border-slate-700 text-blue-500 focus:ring-blue-500" ${perms.viewExpenses !== false ? 'checked' : ''}>
                        <span class="leading-tight">দৈনিক খরচ দেখার অনুমতি<br><span class="text-[11px] text-slate-400 font-bold">View Expenses</span></span>
                    </label>
                    <label class="flex items-center gap-3 text-white cursor-pointer hover:bg-slate-800/50 p-1.5 rounded-lg transition-colors pl-6 border-l-2 border-amber-500/50">
                        <input type="checkbox" id="perm-editExpenses" class="w-5 h-5 rounded bg-slate-950 border-slate-700 text-amber-500 focus:ring-amber-500" ${perms.editExpenses !== false && perms.manageExpenses !== false ? 'checked' : ''}>
                        <span class="leading-tight text-amber-300"><i class="fa-solid fa-pen-to-square mr-1 text-amber-400"></i>খরচ এডিট আইকন দেখানো ও সংশোধনের অনুমতি<br><span class="text-[11px] text-slate-400 font-bold">Show Edit Icon & Edit Expenses</span></span>
                    </label>
                    <label class="flex items-center gap-3 text-white cursor-pointer hover:bg-slate-800/50 p-1.5 rounded-lg transition-colors pl-6 border-l-2 border-red-500/50">
                        <input type="checkbox" id="perm-deleteExpenses" class="w-5 h-5 rounded bg-slate-950 border-slate-700 text-red-500 focus:ring-red-500" ${perms.deleteExpenses ? 'checked' : ''}>
                        <span class="leading-tight text-red-300"><i class="fa-solid fa-trash-can mr-1 text-red-400"></i>খরচ ডিলিট আইকন দেখানো ও খরচ ডিলেটের অনুমতি<br><span class="text-[11px] text-slate-400 font-bold">Show Delete Icon & Delete Expenses</span></span>
                    </label>

                    <div class="text-xs font-black text-cyan-400 uppercase tracking-widest border-b border-slate-800 pb-1.5 mt-4 mb-2"><i class="fa-solid fa-users mr-1.5"></i>কাস্টমার ডাটাবেস (Customers):</div>

                    ${createToggle('perm-viewCustomers', 'কাস্টমার লিস্ট দেখার অনুমতি', 'View Customers', perms.viewCustomers !== false)}
                    ${createToggle('perm-addCustomer', 'নতুন কাস্টমার যুক্ত করা', 'Add Customer', perms.addCustomer !== false)}
                    ${createToggle('perm-editCustomers', 'কাস্টমার এডিট করা', 'Edit Customer', perms.editCustomers !== false && perms.manageCustomers !== false)}
                    ${createToggle('perm-deleteCustomers', 'কাস্টমার ডিলিট করা', 'Delete Customer', perms.deleteCustomers === true)}
                    ${createToggle('perm-exportCustomers', 'কাস্টমার এক্সেল ডাউনলোড', 'Export Excel', perms.exportCustomers !== false)}
                    ${createToggle('perm-printCustList', 'কাস্টমার লিস্ট প্রিন্ট করা', 'Print List', perms.printCustList !== false)}
                    ${createToggle('perm-bulkCustReminder', 'টপ ১০ বাল্ক তাগাদা (Top 10)', 'Bulk Reminder', perms.bulkCustReminder !== false)}
                    ${createToggle('perm-viewCustLedgerBtn', 'খতিয়ান দেখার বাটন', 'View Ledger Icon', perms.viewCustLedgerBtn !== false)}
                    ${createToggle('perm-viewCustStatementBtn', 'স্টেটমেন্ট বাটন', 'Statement Icon', perms.viewCustStatementBtn !== false)}
                    ${createToggle('perm-sendCustWhatsApp', 'WhatsApp তাগাদা বাটন', 'WhatsApp Icon', perms.sendCustWhatsApp !== false)}
                    ${createToggle('perm-sendCustSMS', 'রিমাইন্ডার SMS বাটন', 'SMS Icon', perms.sendCustSMS !== false)}

                    <div class="text-xs font-black text-pink-400 uppercase tracking-widest border-b border-slate-800 pb-1.5 mt-4 mb-2"><i class="fa-solid fa-file-invoice mr-1.5"></i>স্টেটমেন্ট, SMS ও ডিরেক্টরি:</div>

                    <label class="flex items-center gap-3 text-white cursor-pointer hover:bg-slate-800/50 p-1.5 rounded-lg transition-colors">
                        <input type="checkbox" id="perm-viewStatement" class="w-5 h-5 rounded bg-slate-950 border-slate-700 text-blue-500 focus:ring-blue-500" ${perms.viewStatement !== false ? 'checked' : ''}>
                        <span class="leading-tight">স্টেটমেন্ট/রিপোর্ট দেখার অনুমতি<br><span class="text-[11px] text-slate-400 font-bold">View Statement</span></span>
                    </label>
                    <label class="flex items-center gap-3 text-white cursor-pointer hover:bg-slate-800/50 p-1.5 rounded-lg transition-colors">
                        <input type="checkbox" id="perm-sendSMS" class="w-5 h-5 rounded bg-slate-950 border-slate-700 text-purple-500 focus:ring-purple-500" ${perms.sendSMS !== false ? 'checked' : ''}>
                        <span class="leading-tight text-purple-300">কাস্টমারকে SMS পাঠানোর অনুমতি<br><span class="text-[11px] text-slate-400 font-bold">Send SMS Reminders</span></span>
                    </label>
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'পারমিশন সেভ করুন',
            cancelButtonText: 'বাতিল',
            customClass: {
                popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700/80',
                title: '!text-white',
                confirmButton: 'm3-btn-primary !px-6',
                cancelButton: 'm3-btn-tonal !px-6'
            },
            preConfirm: () => {
                const editLedger = document.getElementById('perm-editLedger').checked;
                const deleteLedger = document.getElementById('perm-deleteLedger').checked;
                const editExpenses = document.getElementById('perm-editExpenses').checked;
                const deleteExpenses = document.getElementById('perm-deleteExpenses').checked;
                const editCustomers = document.getElementById('perm-editCustomers').checked;
                const deleteCustomers = document.getElementById('perm-deleteCustomers').checked;

                return {
                    viewDashboard: document.getElementById('perm-viewDashboard').checked,
                    viewDashboardFinancials: document.getElementById('perm-viewDashboardFinancials').checked,
                    viewDashChart: document.getElementById('perm-viewDashChart').checked,
                    viewDashRecentCol: document.getElementById('perm-viewDashRecentCol').checked,
                    viewDashTopDue: document.getElementById('perm-viewDashTopDue').checked,
                    dashAddCustomer: document.getElementById('perm-dashAddCustomer').checked,
                    printExecutiveReport: document.getElementById('perm-printExecutiveReport').checked,

                    viewLedger: document.getElementById('perm-viewLedger').checked,
                    addLedgerEntry: document.getElementById('perm-addLedgerEntry').checked,
                    manageLedger: editLedger || deleteLedger,
                    editLedger: editLedger,
                    deleteLedger: deleteLedger,
                    exportLedger: document.getElementById('perm-exportLedger').checked,
                    printLedgerReceipt: document.getElementById('perm-printLedgerReceipt').checked,
                    sendLedgerWhatsApp: document.getElementById('perm-sendLedgerWhatsApp').checked,
                    sendLedgerSMS: document.getElementById('perm-sendLedgerSMS').checked,
                    exportLedger: document.getElementById('perm-exportLedger').checked,

                    viewBulkEntry: document.getElementById('perm-viewBulkEntry').checked,
                    viewInvoice: document.getElementById('perm-viewInvoice').checked,
                    allowInvoiceDiscount: document.getElementById('perm-allowInvoiceDiscount').checked,

                    viewExpenses: document.getElementById('perm-viewExpenses').checked,
                    manageExpenses: editExpenses || deleteExpenses,
                    editExpenses: editExpenses,
                    deleteExpenses: deleteExpenses,

                    viewCustomers: document.getElementById('perm-viewCustomers').checked,
                    addCustomer: document.getElementById('perm-addCustomer').checked,
                    manageCustomers: editCustomers || deleteCustomers,
                    editCustomers: editCustomers,
                    deleteCustomers: deleteCustomers,
                    exportCustomers: document.getElementById('perm-exportCustomers').checked,
                    printCustList: document.getElementById('perm-printCustList').checked,
                    bulkCustReminder: document.getElementById('perm-bulkCustReminder').checked,
                    viewCustLedgerBtn: document.getElementById('perm-viewCustLedgerBtn').checked,
                    viewCustStatementBtn: document.getElementById('perm-viewCustStatementBtn').checked,
                    sendCustWhatsApp: document.getElementById('perm-sendCustWhatsApp').checked,
                    sendCustSMS: document.getElementById('perm-sendCustSMS').checked,

                    viewStatement: document.getElementById('perm-viewStatement').checked,
                    sendSMS: document.getElementById('perm-sendSMS').checked
                };
            }
        });

        if (formValues) {
            await UserDAO.update(userId, { permissions: formValues });
            auditLog('PERMISSION_CHANGE', 'Admin', userId, email, { permissions: formValues });
            Swal.fire({
                title: 'সফল!',
                text: 'পারমিশন সফলভাবে সেভ করা হয়েছে।',
                icon: 'success',
                customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700/80' }
            });
        }
    } catch (e) {
        console.error("Failed to update permissions:", e);
        Swal.fire('Error', 'Failed to update permissions.', 'error');
    }
}
