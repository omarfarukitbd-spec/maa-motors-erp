import Swal from 'sweetalert2';
import { formatAmountWithComma, formatAppDate, getTodayLocalDateString, showToast, formatSmsCounterText } from '../utils.js';

export async function sendStmtReminderSMS(stateRef = {}) {
    const { currentCustomerInfo, currentFinalBalance } = stateRef;
    const phone = currentCustomerInfo?.phone;
    if (!phone) return Swal.fire('Error', 'No phone number found for this customer.', 'warning');
    const dueAmount = currentFinalBalance;
    const dueLabel = dueAmount < 0 ? 'advance' : 'pending due';
    const formattedDue = formatAmountWithComma(Math.abs(dueAmount));
    const englishName = (typeof window.toBanglishName === 'function' ? window.toBanglishName(currentCustomerInfo.name) : currentCustomerInfo.name) || 'Customer';
    const accStr = currentCustomerInfo.accountNo ? `(A/C: ${currentCustomerInfo.accountNo})` : '';
    const stmtEndDate = document.getElementById('stmt-end-date')?.value;
    const stmtDateStr = stmtEndDate ? formatAppDate(stmtEndDate) : formatAppDate(getTodayLocalDateString());

    const msg = `Dear ${englishName} ${accStr}, Your total ${dueLabel} at M/S. Maa Motors is Tk ${formattedDue} on ${stmtDateStr}. Kindly clear payment soon. Thanks! - M/S. Maa Motors`.replace(/\s+/g, ' ').replace(/[^\x00-\x7F]/g, '');
    const { value: text } = await Swal.fire({
        title: '<i class="fa-solid fa-comment-sms text-blue-400 mr-2"></i>Send Reminder SMS',
        html: `<div class="text-left space-y-1 mb-2 font-bn"><div class="text-xs text-slate-400">Recipient: <strong class="text-white">${phone}</strong></div><div id="stmt-sms-counter" class="text-[11px] font-bold text-emerald-400 text-right">${formatSmsCounterText(msg)}</div></div>`,
        input: 'textarea', inputValue: msg, inputAttributes: { rows: 5, class: 'm3-field text-xs font-mono' },
        didOpen: () => {
            const ta = Swal.getInput(); const ctr = document.getElementById('stmt-sms-counter');
            if (ta) ta.oninput = () => { if (ctr) ctr.innerText = formatSmsCounterText(ta.value); };
        },
        showCancelButton: true, confirmButtonText: '<i class="fa-solid fa-paper-plane mr-1.5"></i> Send SMS', cancelButtonText: 'Cancel',
        customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700', confirmButton: 'm3-btn-primary !bg-blue-600 hover:!bg-blue-500 !px-6 !py-2 rounded-xl font-bold', cancelButton: 'm3-btn-tonal !bg-slate-800 !text-slate-300 !px-5 !py-2 rounded-xl font-bold border border-slate-700' }
    });
    if (text) {
        const ok = await window.sendSMS(phone, text, false);
        if (ok) showToast('SMS পাঠানোর চেষ্টা করা হয়েছে!', 'info');
    }
}

export async function sendStmtReminderWhatsApp(stateRef = {}) {
    const { currentCustomerInfo, currentFinalBalance } = stateRef;
    const phone = currentCustomerInfo?.phone;
    if (!phone) return Swal.fire({ title: 'এরর', text: 'কাস্টমারের মোবাইল নম্বর পাওয়া যায়নি!', icon: 'warning', customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' } });

    const dueAmount = currentFinalBalance;
    const formattedDue = formatAmountWithComma(Math.abs(dueAmount));
    const billSum = document.getElementById('stmt-total-bill')?.innerText || '৳ 0';
    const paidSum = document.getElementById('stmt-total-paid')?.innerText || '৳ 0';
    const lessSum = document.getElementById('stmt-total-less')?.innerText || '৳ 0';
    const accNo = currentCustomerInfo.accountNo ? `#${currentCustomerInfo.accountNo}` : '-';

    const stmtStartDate = document.getElementById('stmt-start-date')?.value;
    const stmtEndDate = document.getElementById('stmt-end-date')?.value;
    const dateStr = (stmtStartDate && stmtEndDate) 
        ? `${formatAppDate(stmtStartDate)} থেকে ${formatAppDate(stmtEndDate)}` 
        : (stmtEndDate ? formatAppDate(stmtEndDate) : formatAppDate(getTodayLocalDateString()));

    const shareLink = `${window.location.origin}${window.location.pathname}?view=public-stmt&id=${currentCustomerInfo.id}`;

    let msg = `আসসালামু আলাইকুম ${currentCustomerInfo.name || 'কাস্টমার'},\nমেসার্স মা মোটরস্ থেকে আপনার মোট হিসাবের সামারি:\n\nহিসাব নং: ${accNo}\nবিবরণীর সময়কাল: ${dateStr}\nমোট কেনাকাটা/বিল: ${billSum}\nমোট জমা: ${paidSum}\nমোট ছাড়: ${lessSum}\n---------------------------------\n`;

    if (dueAmount < 0) {
        msg += `অ্যাডভান্স জমা: ৳ ${formattedDue}\n\n`;
    } else {
        msg += `বর্তমান মোট বকেয়া: ৳ ${formattedDue}\n\n*বিশেষ অনুরোধ: আপনার বকেয়া টাকাটি দ্রুত পরিশোধ করার অনুরোধ রইল।*\n\n`;
    }

    msg += `আপনার সম্পূর্ণ মেমো ও হিসাবের PDF বিবরণী দেখতে নিচের লিংকে ক্লিক করুন:\n${shareLink}\n\nযোগাযোগ: 01819-397669\nধন্যবাদ! — মেসার্স মা মোটরস্`;

    const { value: text } = await Swal.fire({
        title: '<div class="flex items-center justify-center gap-2 font-bn font-black text-lg text-emerald-400"><i class="fa-brands fa-whatsapp text-xl"></i><span>Send WhatsApp Reminder</span></div>',
        html: `<div class="text-left space-y-1 mb-2 font-bn"><div class="text-xs text-slate-400">Recipient Phone: <strong class="text-white">${phone}</strong></div></div>`,
        input: 'textarea', inputValue: msg, inputAttributes: { rows: 8, class: 'm3-field text-xs font-bn' },
        showCancelButton: true, confirmButtonText: '<i class="fa-brands fa-whatsapp mr-1.5"></i> Open WhatsApp', cancelButtonText: 'Cancel',
        customClass: { popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn', confirmButton: 'm3-btn-primary !bg-emerald-600 hover:!bg-emerald-500 !px-6 !py-2 rounded-xl font-bold' }
    });

    if (text) {
        if (window.sendWhatsApp) window.sendWhatsApp(phone, text);
    }
}
