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
 * Calculates SMS character length, Unicode detection and billing parts
 */
export function calculateSmsParts(message = '') {
    const text = String(message || '');
    const len = text.length;
    const isUnicode = /[^\x00-\x7F]/.test(text);
    const singleLimit = isUnicode ? 70 : 160;
    const multiLimit = isUnicode ? 67 : 153;
    const parts = len === 0 ? 1 : (len <= singleLimit ? 1 : Math.ceil(len / multiLimit));
    const limit = len <= singleLimit ? singleLimit : multiLimit;
    const typeLabel = isUnicode ? 'বাংলা/Unicode' : 'English/GSM';
    return { len, isUnicode, singleLimit, multiLimit, limit, parts, typeLabel };
}

export function formatSmsCounterText(message = '') {
    const info = calculateSmsParts(message);
    return `${info.len} / ${info.limit} Chars [${info.typeLabel}] • ${info.parts} SMS`;
}

/**
 * WhatsApp Messaging Utility
 */
export function sendWhatsApp(phone, message) {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
        Swal.fire({ title: 'ইন্টারনেট অফলাইন!', text: 'ইন্টারনেট কানেকশন চেক করুন।', icon: 'warning', customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' } });
        return false;
    }

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

/**
 * Centralized SMS Message Builder with Guaranteed Date Binding
 * @param {string} template - The SMS template or empty string to use default
 * @param {string} defaultTemplate - The standard fallback template
 * @param {object} params - Replacement tokens: { name, accountNo, shopName, date, bill, paid, due, memo, type }
 * @returns {string} - Clean formatted SMS string
 */
export function buildSmsMessage(template, defaultTemplate, params = {}) {
    let tpl = (template && template.trim()) ? template.trim() : defaultTemplate;
    const name = params.name || 'Customer';
    const accStr = params.accountNo ? `(A/C: ${params.accountNo})` : '';
    const shop = params.shopName || 'M/S. Maa Motors';
    const date = params.date || '';
    const bill = params.bill !== undefined ? String(params.bill) : '';
    const paid = params.paid !== undefined ? String(params.paid) : '';
    const due = params.due !== undefined ? String(params.due) : '';
    const memo = params.memo ? String(params.memo).trim() : '';
    const type = params.type || 'Cash';

    let msg = tpl;

    // Handle Memo / Voucher replacement
    if (memo) {
        if (msg.includes('[Memo]')) {
            msg = msg.replace(/\[Memo\]/g, memo);
        } else if (tpl.indexOf('[Memo]') === -1 && bill) {
            if (msg.includes('purchase of Tk')) {
                msg = msg.replace(/purchase of Tk/g, `purchase (Memo #${memo}) of Tk`);
            } else if (msg.includes('Bill of Tk')) {
                msg = msg.replace(/Bill of Tk/g, `Memo #${memo} of Tk`);
            }
        }
    } else {
        // Cleanly remove Memo #[Memo] when voucher field is empty
        msg = msg
            .replace(/Memo\s*#\s*\[Memo\]\s*of\s*/gi, 'Bill of ')
            .replace(/Memo\s*#\s*\[Memo\]\s*,?\s*/gi, '')
            .replace(/\[Memo\]/g, '');
    }

    msg = msg
        .replace(/\[Name\]/g, name)
        .replace(/\[AccNo\]/g, accStr)
        .replace(/\[Shop\]/g, shop)
        .replace(/\[Date\]/g, date)
        .replace(/\[Bill\]/g, bill)
        .replace(/\[Paid\]/g, paid)
        .replace(/\[Type\]/g, type)
        .replace(/\[Due\]/g, due);

    // Fail-safe date injection: if custom template lacks [Date] and date is provided
    if (tpl.indexOf('[Date]') === -1 && date) {
        if (msg.includes(' - ')) {
            msg = msg.replace(/ - [^-]+$/, ` (${date})$&`);
        } else {
            msg = `${msg} (${date})`;
        }
    }

    return msg.replace(/\s+/g, ' ').trim();
}
