import Swal from 'sweetalert2';
import { firebase, firebaseConfig } from '../firebase-config.js';
import { UserDAO } from '../dao.js';
import { auditLog } from '../audit.js';
import { promptSecurityPin } from '../utils.js';
import { unlockApp } from '../navigation/router.js';

/**
 * User Authentication Actions (Approval, PIN, Block, Delete, Create)
 * Fully Restored logic for secondary Firebase App instance.
 */

export async function approveStaff(userId, email, suggestedRole = 'Staff') {
    if (window.AppState.currentUserRole !== 'Admin') return;

    const isPinValid = await promptSecurityPin("ইউজার অনুমোদন (User Approval)");
    if (!isPinValid) return;

    const { value: formValues } = await Swal.fire({
        title: '<div class="flex items-center justify-center gap-2 text-white font-bn"><i class="fa-solid fa-user-check text-emerald-400"></i><span>অ্যাকাউন্ট অনুমোদন ও পিন সেট</span></div>',
        html: `
            <div class="space-y-4 text-left font-bn mt-2">
                <div>
                    <label class="text-xs text-slate-400 font-bold block mb-1">ইমেইল অ্যাকাউন্ট</label>
                    <div class="p-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-xs font-mono text-emerald-400">${email}</div>
                </div>
                <div>
                    <label class="text-xs text-slate-400 font-bold block mb-1">ব্যবহারকারীর রোল (Role) নির্ধারণ করুন</label>
                    <select id="swal-user-role" class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white outline-none">
                        <option value="Boss" ${suggestedRole === 'Boss' ? 'selected' : ''}>Boss / Executive (ভিউ-অনলি)</option>
                        <option value="Staff" ${suggestedRole !== 'Boss' ? 'selected' : ''}>Staff (দৈনন্দিন এন্ট্রি ও বিলিং)</option>
                        <option value="Admin">Admin (পূর্ণ ক্ষমতা)</option>
                    </select>
                </div>
                <div>
                    <label class="text-xs text-slate-400 font-bold block mb-1">৪-ডিজিট সিকিউরিটি পিন দিন</label>
                    <input id="swal-user-pin" type="text" maxlength="4" placeholder="${suggestedRole === 'Boss' ? '5027' : '1234'}" value="${suggestedRole === 'Boss' ? '5027' : '1234'}" class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-center text-base font-mono font-bold tracking-widest text-white outline-none">
                </div>
            </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'অনুমোদন দিন',
        cancelButtonText: 'বাতিল',
        customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn', confirmButton: 'm3-btn-primary !py-2.5', cancelButton: 'm3-btn-tonal !py-2.5' },
        preConfirm: () => {
            const role = document.getElementById('swal-user-role').value;
            const pin = document.getElementById('swal-user-pin').value.trim();
            if (!pin || pin.length !== 4 || isNaN(pin)) {
                Swal.showValidationMessage('আপনাকে অবশ্যই ৪-ডিজিটের সংখ্যার পিন দিতে হবে!');
                return false;
            }
            return { role, pin };
        }
    });

    if (formValues) {
        try {
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
                deleteBankTransaction: false
            } : {};

            await UserDAO.update(userId, { 
                status: 'active', 
                role: formValues.role, 
                pin: formValues.pin,
                permissions: defaultPerms
            });
            auditLog('APPROVE', 'Admin', userId, email, { role: formValues.role, pinSet: true });
            Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: `${email} সফলভাবে অনুমোদিত হয়েছে!`, showConfirmButton: false, timer: 3000 });
        } catch(e) { console.error(e); Swal.fire('Error', 'অনুমোদন ব্যর্থ হয়েছে', 'error'); }
    }
}

export async function changeStaffPin(userId, oldPin) {
    if (window.AppState.currentUserRole !== 'Admin') return;

    const isPinValid = await promptSecurityPin("স্টাফ পিন পরিবর্তন (PIN Change)");
    if (!isPinValid) return;

    const { value: pin } = await Swal.fire({
        title: 'পিন পরিবর্তন',
        input: 'text',
        inputLabel: `বর্তমান পিন: ${oldPin} | নতুন 4-ডিজিট পিন দিন`,
        inputPlaceholder: 'e.g. 5678',
        inputAttributes: {
            autocomplete: 'new-password',
            autocapitalize: 'off',
            spellcheck: 'false'
        },
        showCancelButton: true,
        inputValidator: (value) => {
            if (!value || value.length !== 4 || isNaN(value)) {
                return 'আপনাকে অবশ্যই 4-ডিজিটের সংখ্যার পিন দিতে হবে!';
            }
        }
    });

    if (pin) {
        try {
            await UserDAO.update(userId, { pin: pin });
            auditLog('PIN_CHANGE', 'Admin', userId, '', { targetUser: userId });
            Swal.fire('সফল!', 'পিন আপডেট করা হয়েছে।', 'success');
        } catch(e) { Swal.fire('Error', 'ব্যর্থ হয়েছেন', 'error'); }
    }
}

export async function revokeStaff(userId) {
    if (window.AppState.currentUserRole !== 'Admin') return;

    const isPinValid = await promptSecurityPin("স্টাফ ব্লক/বাতিল (Revoke Access)");
    if (!isPinValid) return;

    const confirm = await Swal.fire({ title: 'নিশ্চিত?', text: 'এই স্টাফ আর লগইন করতে পারবে না।', icon: 'warning', showCancelButton: true });
    if(confirm.isConfirmed) {
        try {
            await UserDAO.update(userId, { status: 'pending', pin: '' });
            auditLog('REVOKE', 'Admin', userId, '', { action: 'Block/Revoke' });
            Swal.fire('সফল!', 'অ্যাক্সেস বাতিল করা হয়েছে।', 'success');
        } catch(e) { Swal.fire('Error', 'ব্যর্থ হয়েছেন', 'error'); }
    }
}

export async function deleteUserAccount(docId, email) {
    if (window.AppState.currentUserRole !== 'Admin') {
        return Swal.fire('অ্যাক্সেস ডিনাইড!', 'শুধুমাত্র অ্যাডমিন অ্যাকাউন্ট মুছে ফেলতে পারবেন।', 'error');
    }

    const confirm = await Swal.fire({
        title: '<i class="fa-solid fa-user-xmark text-red-400 mr-2"></i>অ্যাকাউন্ট মুছে ফেলা',
        html: `<p style="color:#ef4444;font-size:14px;"><i class="fa-solid fa-triangle-exclamation mr-1.5"></i>আপনি কি নিশ্চিত যে <b>${email || docId}</b> অ্যাকাউন্টটি ডাটাবেস থেকে মুছে ফেলতে চান?</p>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'হ্যাঁ, ডিলেট করুন',
        cancelButtonText: 'বাতিল',
        confirmButtonColor: '#dc2626'
    });

    if (!confirm.isConfirmed) return;

    const isPinValid = await promptSecurityPin("ইউজার অ্যাকাউন্ট মুছে ফেলা");
    if (!isPinValid) return;

    try {
        await UserDAO.delete(docId);
        auditLog('DELETE', 'Admin', docId, email, { action: 'User Deletion' });
        Swal.fire({
            title: 'অ্যাকাউন্ট মুছে ফেলা হয়েছে!',
            text: `ইউজার (${email || docId}) ডাটাবেস থেকে সফলভাবে ডিলেট করা হয়েছে।`,
            icon: 'success'
        });
    } catch(err) {
        console.error("Failed to delete user account:", err);
        Swal.fire({
            title: 'Error!',
            text: 'অ্যাকাউন্টটি মুছতে সমস্যা হয়েছে: ' + (err.message || err),
            icon: 'error'
        });
    }
}

export async function updateUserRole(userId) {
    if (window.AppState.currentUserRole !== 'Admin') return;

    const isPinValid = await promptSecurityPin("ইউজার রোল পরিবর্তন (Role Change)");
    if (!isPinValid) return;

    const newRole = document.getElementById(`role-${userId}`).value;
    try {
        await UserDAO.update(userId, { role: newRole });
        auditLog('ROLE_CHANGE', 'Admin', userId, '', { newRole });
        Swal.fire('সফল!', 'ইউজারের রোল আপডেট হয়েছে।', 'success');
    } catch (error) {
        Swal.fire('Error', 'রোল আপডেট করতে ব্যর্থ হয়েছেন।', 'error');
    }
}

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
                deleteBankTransaction: false
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

export async function copyPortalLink(type) {
    const origin = window.location.origin;
    const url = `${origin}/?portal=${type}`;
    try {
        await navigator.clipboard.writeText(url);
        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: `${type === 'boss' ? 'বস' : 'স্টাফ'} পোর্টাল লিংক কপি হয়েছে!`,
            showConfirmButton: false,
            timer: 2500,
            background: '#0F172A',
            color: '#F8FAFC'
        });
    } catch (err) {
        console.error(err);
        Swal.fire('কপি ব্যর্থ', url, 'info');
    }
}

export function sharePortalWhatsApp(type) {
    const origin = window.location.origin;
    const url = `${origin}/?portal=${type}`;
    const text = type === 'boss'
        ? `আসসালামু আলাইকুম স্যার, মা মোটরসের লাইভ হিসাব ও ড্যাশবোর্ড দেখার লিংক:\n${url}\n(আপনার সিকিউরিটি পিন: 5027)`
        : `আসসালামু আলাইকুম, মা মোটরস ERP স্টাফ পোর্টাল লিংক:\n${url}`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
}
