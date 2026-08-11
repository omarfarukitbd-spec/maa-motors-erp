import Swal from 'sweetalert2';
import { firebase } from '../firebase-config.js';
import { SettingsDAO, UserDAO } from '../dao.js';
import { shouldRequirePin } from '../settings/security-policy.js';

/**
 * Security PIN Verification with Granular Policy Check
 */
export async function promptSecurityPin(actionName = "ডিলেট/এডিট", actionKey = null) {
    try {
        let targetKey = actionKey;
        if (!targetKey) {
            if (actionName.includes('ডিলেট') && actionName.includes('কাস্টমার')) targetKey = 'deleteCustomer';
            else if (actionName.includes('ডিলেট') && actionName.includes('খরচ')) targetKey = 'deleteExpense';
            else if (actionName.includes('ডিলেট')) targetKey = 'deleteTxn';
            else if (actionName.includes('এডিট') && actionName.includes('কাস্টমার')) targetKey = 'editCustomer';
            else if (actionName.includes('এডিট') && actionName.includes('খরচ')) targetKey = 'editExpense';
            else if (actionName.includes('এডিট')) targetKey = 'editTxn';
            else if (actionName.includes('SMS') || actionName.includes('মেসেজ')) targetKey = 'sendTxnSMS';
            else if (actionName.includes('রিমাইন্ডার') || actionName.includes('তাগাদা')) targetKey = 'sendReminderSMS';
            else if (actionName.includes('বাল্ক')) targetKey = 'sendBulkSMS';
            else if (actionName.includes('ব্যাকআপ')) targetKey = 'exportBackup';
        }

        if (targetKey) {
            const requiresPin = await shouldRequirePin(targetKey);
            if (!requiresPin) return true; // PIN disabled or session paused!
        }

        const settings = await SettingsDAO.getAppSettings();
        const validMasterPin = settings.adminSecurityPin || '1060';

        const currentUser = firebase.auth().currentUser;
        let userPin = null;
        if (currentUser) {
            const userData = await UserDAO.getById(currentUser.uid);
            userPin = userData?.pin || null;
        }

        const randomName = 'sec_pin_' + Math.random().toString(36).substring(7);

        const result = await Swal.fire({
            title: '<i class="fa-solid fa-shield-halved text-amber-400 mr-2"></i>সিকিউরিটি পিন ভেরিফিকেশন',
            html: `<p style="color:#ef4444;font-size:13px;margin-bottom:12px;"><i class="fa-solid fa-triangle-exclamation mr-1.5"></i>এই <b>${actionName}</b> সম্পন্ন করতে সিকিউরিটি পিন দিন।</p>`,
            input: 'password',
            inputPlaceholder: 'Enter Security PIN',
            inputAttributes: {
                autocomplete: 'off',
                autocorrect: 'off',
                autocapitalize: 'off',
                spellcheck: 'false',
                name: randomName
            },
            buttonsStyling: false,
            showCancelButton: true,
            confirmButtonText: 'কনফার্ম',
            cancelButtonText: 'বাতিল',
            confirmButtonColor: '#dc2626',
            allowOutsideClick: false,
            allowEscapeKey: true,
            didOpen: () => {
                const input = Swal.getInput();
                if (input) {
                    input.setAttribute('readonly', 'readonly');
                    setTimeout(() => {
                        input.removeAttribute('readonly');
                        input.focus();
                    }, 150);
                }
            },
            inputValidator: (val) => { if (!val) return 'সিকিউরিটি পিন দেওয়া আবশ্যক!'; }
        });

        if (result.isDismissed) return false;
        const inputPin = result.value;
        if (!inputPin) return false;

        const cleanInput = String(inputPin).trim();
        if (cleanInput === String(userPin) || cleanInput === String(validMasterPin)) return true;

        await Swal.fire({ title: 'ভুল পিন!', text: 'আপনার সিকিউরিটি পিন সঠিক নয়।', icon: 'error' });
        return false;
    } catch(err) { return false; }
}
