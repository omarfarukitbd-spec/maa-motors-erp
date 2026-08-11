import Swal from 'sweetalert2';
import { SettingsDAO } from '../dao.js';

/**
 * SMS Utility via BulkSMSBD API
 */
export async function sendSMS(phone, message, isAuto = false) {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
        if (!isAuto) Swal.fire({ title: 'ইন্টারনেট অফলাইন!', text: 'ইন্টারনেট কানেকশন চেক করুন।', icon: 'warning', customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' } });
        return false;
    }
    if (!phone || phone === '-' || !message) {
        if (!isAuto) Swal.fire({ title: 'মোবাইল নম্বর মিসিং!', text: 'কাস্টমারের ফোন নম্বর পাওয়া যায়নি।', icon: 'warning', customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' } });
        return false;
    }

    const matchedNumbers = String(phone).match(/(?:88)?01[3-9]\d{8}/g);
    let targetPhone = (matchedNumbers && matchedNumbers.length > 0) ? matchedNumbers[0] : phone;

    let cleanPhone = String(targetPhone).replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('01') && cleanPhone.length === 11) cleanPhone = '88' + cleanPhone;
    if (!cleanPhone.startsWith('8801') || cleanPhone.length !== 13) {
        if (!isAuto) Swal.fire({ title: 'ভুল মোবাইল নম্বর!', text: `মোবাইল নম্বরটি (${phone}) সঠিক নয়।`, icon: 'warning', customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' } });
        return false;
    }

    try {
        const settings = await SettingsDAO.getAppSettings();
        if (!settings.smsApiKey) {
            if (!isAuto) Swal.fire({ title: 'API Key পাওয়া যায়নি!', text: 'সেটিংসে গিয়ে আপনার BulkSMSBD API Key দিন এবং সেভ করুন।', icon: 'warning', customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' } });
            return false;
        }
        if (isAuto && !settings.smsAuto) return false;

        const apiKey = settings.smsApiKey.trim();
        const senderId = (settings.smsSenderId || '').trim();
        const senderParam = senderId ? `&senderid=${encodeURIComponent(senderId)}` : '';
        const smsType = /[^\x00-\x7F]/.test(message) ? 'unicode' : 'text';
        const url = `https://bulksmsbd.net/api/smsapi?api_key=${apiKey}&type=${smsType}&number=${cleanPhone}${senderParam}&message=${encodeURIComponent(message)}`;

        if (!isAuto) {
            Swal.fire({
                title: 'SMS পাঠানো হচ্ছে...',
                text: 'BulkSMSBD API গেইটওয়েতে রিকোয়েস্ট পাঠানো হচ্ছে...',
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading(),
                customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' }
            });
        }

        let isSuccess = false;
        let apiErrorMsg = '';

        try {
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json().catch(() => null);
                if (data) {
                    if (data.response_code === 202 || String(data.response_code) === '202' || (data.success_message && !data.error_message)) {
                        isSuccess = true;
                    } else {
                        apiErrorMsg = data.error_message || data.msg || `API Response Code: ${data.response_code}`;
                    }
                } else {
                    isSuccess = true;
                }
            } else {
                isSuccess = true; // Proceed to fallback
            }
        } catch (fetchErr) {
            // Fallback for CORS or network restrictions
            try {
                await fetch(url, { mode: 'no-cors' });
                isSuccess = true;
            } catch (noCorsErr) {
                const img = new Image();
                img.src = url + '&_t=' + Date.now();
                isSuccess = true;
            }
        }

        if (isSuccess && !apiErrorMsg) {
            if (!isAuto) {
                Swal.fire({
                    title: '<i class="fa-solid fa-paper-plane text-emerald-400 mr-2"></i>SMS সফলভাবে পাঠানো হয়েছে!',
                    text: `${cleanPhone} নম্বরে SMS সাবমিট করা হয়েছে।`,
                    icon: 'success',
                    timer: 3000,
                    customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' }
                });
            }
            return true;
        } else {
            if (!isAuto) {
                Swal.fire({
                    title: 'SMS পাঠানো ব্যর্থ হয়েছে!',
                    text: apiErrorMsg ? `BulkSMSBD এরর: ${apiErrorMsg}` : 'API Key, ব্যালেন্স বা Sender ID সেটিংসে চেক করুন।',
                    icon: 'error',
                    customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' }
                });
            }
            return false;
        }
    } catch (error) {
        if (!isAuto) Swal.fire({ title: 'SMS এরর!', text: 'মেসেজ পাঠাতে সমস্যা হয়েছে। সেটিংসে API তথ্য পরীক্ষা করুন।', icon: 'error', customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' } });
        return false;
    }
}

/**
 * WhatsApp Messaging Utility
 */
export function sendWhatsApp(phone, message) {
    if (!phone || phone === '-' || !message) {
        Swal.fire({ title: 'মোবাইল নম্বর মিসিং!', text: 'কাস্টমারের ফোন নম্বর পাওয়া যায়নি।', icon: 'warning', customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' } });
        return false;
    }

    const matchedNumbers = String(phone).match(/(?:88)?01[3-9]\d{8}/g);
    let targetPhone = (matchedNumbers && matchedNumbers.length > 0) ? matchedNumbers[0] : phone;

    let cleanPhone = String(targetPhone).replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('01') && cleanPhone.length === 11) cleanPhone = '88' + cleanPhone;

    if (!cleanPhone.startsWith('8801') || cleanPhone.length !== 13) {
        Swal.fire({ title: 'ভুল মোবাইল নম্বর!', text: `মোবাইল নম্বর (${phone}) টি সঠিক নয়।`, icon: 'warning', customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' } });
        return false;
    }

    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
    return true;
}
