import Swal from 'sweetalert2';
import { firebase, firebaseConfig } from '../firebase-config.js';
import { UserDAO } from '../dao.js';
import { auditLog } from '../audit.js';
import { promptSecurityPin } from '../utils.js';

export async function createNewUser() {
    if (window.AppState.currentUserRole !== 'Admin') return;
    const isPinValid = await promptSecurityPin("নতুন ইউজার অ্যাকাউন্ট তৈরি");
    if (!isPinValid) return;
    const { value: formValues } = await Swal.fire({
        title: 'নতুন অ্যাকাউন্ট তৈরি করুন',
        html: `
            <div class="flex flex-col gap-4 text-left font-bn mt-2">
                <div>
                    <label class="block text-xs font-bold text-slate-400 mb-1">ইমেইল এড্রেস</label>
                    <input id="new-user-email" type="email" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" placeholder="example@email.com">
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-400 mb-1">পাসওয়ার্ড (কমপক্ষে ৬ ক্যারেক্টার)</label>
                    <input id="new-user-password" type="password" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" placeholder="******">
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-400 mb-1">ইউজার রোল</label>
                    <select id="new-user-role" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500">
                        <option value="Staff">Staff (স্টাফ)</option>
                        <option value="Admin">Admin (অ্যাডমিন)</option>
                    </select>
                </div>
            </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'অ্যাকাউন্ট তৈরি করুন',
        cancelButtonText: 'বাতিল',
        preConfirm: () => {
            const email = document.getElementById('new-user-email').value.trim();
            const password = document.getElementById('new-user-password').value;
            const role = document.getElementById('new-user-role').value;

            if (!email || !password) {
                Swal.showValidationMessage('ইমেইল এবং পাসওয়ার্ড আবশ্যক!');
                return false;
            }
            if (password.length < 6) {
                Swal.showValidationMessage('পাসওয়ার্ড কমপক্ষে ৬ ক্যারেক্টার হতে হবে!');
                return false;
            }
            return { email, password, role };
        }
    });

    if (formValues) {
        Swal.fire({
            title: 'অ্যাকাউন্ট তৈরি হচ্ছে...',
            text: 'অনুগ্রহ করে অপেক্ষা করুন',
            allowOutsideClick: false,
            didOpen: () => { Swal.showLoading(); }
        });

        let secondaryApp = null;
        try {
            secondaryApp = firebase.initializeApp(firebaseConfig, "UserCreationApp_" + Date.now());
            const secondaryAuth = secondaryApp.auth();

            const userCredential = await secondaryAuth.createUserWithEmailAndPassword(formValues.email, formValues.password);
            const newUid = userCredential.user.uid;

            const defaultPerms = formValues.role === 'Staff' ? {
                viewDashboardFinancials: false,
                viewDashChart: false,
                viewDashTopDue: false,
                deleteLedger: false,
                deleteExpenses: false,
                deleteCustomers: false,
                exportCustomers: false,
                bulkCustReminder: false,
                addLedgerEntry: false,
                exportLedger: false,
                editLedger: false,
                printZoneReport: false,
                printTagadaSheet: false,
                exportZoneReport: false,
                addBulkSpreadsheet: false,
                addBulkExcel: false,
                printInvoicePOS: false,
                printInvoiceA4: false,
                holdInvoiceBtn: false,
                allowInvoiceDiscount: false,
                addExpense: false,
                printExpenseStatement: false,
                editExpenses: false,
                viewBanking: false,
                addBankDeposit: false,
                addBankWithdrawal: false,
                addBankTransfer: false,
                printBankLedger: false,
                exportBankLedger: false,
                deleteBankTransaction: false,
                viewAuditLog: false
            } : {};

            await UserDAO.getRef(newUid).set({
                email: formValues.email,
                role: formValues.role,
                status: 'active',
                permissions: defaultPerms,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            auditLog('CREATE', 'Admin', newUid, formValues.email, { role: formValues.role });

            Swal.fire({
                title: 'সফল!',
                text: `${formValues.email} অ্যাকাউন্টটি সফলভাবে ফায়ারবেসে তৈরি হয়েছে।`,
                icon: 'success'
            });
        } catch (error) {
            console.error("Error creating user:", error);
            Swal.fire({
                title: 'Error!',
                text: 'অ্যাকাউন্ট তৈরি করতে সমস্যা হয়েছে: ' + (error.message || error),
                icon: 'error'
            });
        } finally {
            if (secondaryApp) {
                secondaryApp.delete().catch(err => console.warn("secondaryApp cleanup warning:", err));
            }
        }
    }
}
