import Swal from 'sweetalert2';
import { promptSecurityPin, sendSMS } from '../utils.js';

/**
 * SMS Configuration & Template Management
 */

export async function unlockSmsSettings() {
    if (window.AppState.currentUserRole !== 'Admin') {
        return Swal.fire('অ্যাক্সেস ডিনাইড!', 'শুধুমাত্র অ্যাডমিন সেটিংস পরিবর্তন করতে পারবেন।', 'error');
    }

    const isPinValid = await promptSecurityPin("SMS সেটিংস পরিবর্তন (Settings Unlock)");
    if (!isPinValid) return;

    const fields = ['set-sms-reminder', 'set-sms-opening', 'set-sms-new-bill', 'set-sms-payment', 'set-sms-api', 'set-sms-sender', 'set-sms-auto'];
    fields.forEach(id => {
        const el = document.getElementById(id);
        if(el) {
            el.disabled = false;
            el.style.opacity = '1';
        }
    });

    Swal.fire({
        toast: true, position: 'top-end', icon: 'success', title: 'SMS সেটিংস আনলক করা হয়েছে',
        showConfirmButton: false, timer: 3000,
        customClass: { popup: '!bg-slate-900 !text-white border border-slate-700' }
    });
}

export function checkSmsLength(element, counterId) {
    if(!element) return;
    const val = element.value || '';
    const len = val.length;
    const isUnicode = /[^\x00-\x7F]/.test(val);
    const limit = isUnicode ? 70 : 160;
    const parts = Math.ceil(len / limit) || 1;

    const counter = document.getElementById(counterId);
    if(counter) {
        counter.innerText = `${len}/${limit} (${parts} SMS${isUnicode ? ' - বাংলা' : ''})`;
        if(parts > 1) {
            counter.classList.add('text-amber-400');
            counter.classList.remove('text-purple-300');
        } else {
            counter.classList.remove('text-amber-400');
            counter.classList.add('text-purple-300');
        }
    }
}

export async function sendTestSMS() {
    const apiKey = document.getElementById('set-sms-api')?.value.trim();
    if (!apiKey) {
        return Swal.fire({
            title: 'API Key প্রয়োজন!',
            text: 'প্রথমে SMS Settings-এ আপনার BulkSMSBD API Key দিন এবং সেভ করুন।',
            icon: 'warning',
            customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' }
        });
    }

    const { value: testPhone } = await Swal.fire({
        title: 'Send Test SMS',
        input: 'text',
        inputLabel: 'পরীক্ষামূলক মেসেজ পাঠাতে মোবাইল নম্বরটি লিখুন:',
        inputPlaceholder: '018XXXXXXXX',
        showCancelButton: true,
        confirmButtonText: 'Send Test SMS',
        customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' },
        inputValidator: (val) => (!val || val.trim().length < 11) ? 'সঠিক ১১-ডিজিটের মোবাইল নম্বর দিন!' : null
    });

    if (testPhone) {
        Swal.fire({ title: 'SMS পাঠানো হচ্ছে...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        const testMsg = `MAA ERP Test SMS: Your BulkSMSBD SMS Gateway is working perfectly! - M/S. Maa Motors`;
        const res = await sendSMS(testPhone.trim(), testMsg, false);

        if (res) {
            Swal.fire({ title: 'সফল!', text: 'টেস্ট মেসেজ পাঠানো হয়েছে।', icon: 'success' });
        } else {
            Swal.fire({ title: 'ব্যর্থ!', text: 'API Key বা ব্যালেন্স চেক করুন।', icon: 'error' });
        }
    }
}

// Global Bindings
window.unlockSmsSettings = unlockSmsSettings;
window.checkSmsLength = checkSmsLength;
window.sendTestSMS = sendTestSMS;
