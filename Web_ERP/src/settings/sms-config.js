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

    const fields = ['set-sms-reminder', 'set-sms-opening', 'set-sms-new-bill', 'set-sms-payment', 'set-sms-less', 'set-sms-correction', 'set-sms-api', 'set-sms-sender', 'set-sms-auto'];
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
        const res = await sendSMS(testPhone.trim(), testMsg, { silent: true, returnDetails: true });

        if (res && res.success) {
            Swal.fire({
                title: '<i class="fa-solid fa-paper-plane text-emerald-400 mr-2"></i>সফল!',
                text: 'টেস্ট মেসেজ সফলভাবে পাঠানো হয়েছে।',
                icon: 'success',
                customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn' }
            });
        } else if (res && res.isIpError) {
            Swal.fire({
                title: '<span class="text-amber-400 font-bold"><i class="fa-solid fa-shield-halved mr-2"></i>IP Whitelist সমস্যা!</span>',
                html: `
                    <div class="text-left space-y-2.5 font-bn text-sm">
                        <p class="text-slate-300">আপনার বর্তমান ইন্টারনেট আইপি <b>BulkSMSBD</b> পোর্টালে অনুমোদিত নয়।</p>
                        ${res.ip ? `<div class="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center text-xs text-slate-300">বর্তমান আইপি: <span class="font-mono text-cyan-400 font-bold text-sm ml-1 select-all">${res.ip}</span></div>` : ''}
                        <div class="bg-slate-800/80 p-3 rounded-2xl border border-slate-700 text-xs text-slate-300 space-y-1.5">
                            <p class="font-bold text-white"><i class="fa-solid fa-circle-check text-emerald-400 mr-1"></i> সমাধান পদ্ধতি:</p>
                            <p>১. <a href="https://bulksmsbd.net" target="_blank" class="text-sky-400 underline font-bold">BulkSMSBD</a> পোর্টালে লগইন করুন।</p>
                            <p>২. <b>Phonebook</b> ➔ <b>IP White List</b> পেজে যান।</p>
                            <p>৩. <b>Source IP Checking</b> অপশনটি <b>"Disable"</b> করে <b>Update</b> দিন।</p>
                            <p class="text-[11px] text-slate-400"><i>(অথবা IP বক্সে ${res.ip || 'বর্তমান আইপি'} বসিয়ে Submit করুন)</i></p>
                        </div>
                    </div>
                `,
                icon: 'warning',
                confirmButtonText: 'বুঝেছি',
                customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn' }
            });
        } else {
            Swal.fire({
                title: 'ব্যর্থ!',
                text: (res && res.error) ? `BulkSMSBD এরর: ${res.error}` : 'API Key, ব্যালেন্স বা Sender ID চেক করুন।',
                icon: 'error',
                customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn' }
            });
        }
    }
}

// Global Bindings
window.unlockSmsSettings = unlockSmsSettings;
window.checkSmsLength = checkSmsLength;
window.sendTestSMS = sendTestSMS;
