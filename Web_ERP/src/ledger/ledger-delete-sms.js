import Swal from 'sweetalert2';
import { formatAmountWithComma, formatAppDate, formatSmsCounterText, buildSmsMessage, sendSMS, showToast, safeRound } from '../utils.js';
import { SettingsDAO } from '../dao.js';

/**
 * World-Class Transaction Reversal / Deletion Correction SMS Handler
 * Prompts the cashier after a soft delete whether to dispatch an apology / correction SMS.
 */
export async function handlePostDeleteSms({ customer, txnDoc, newTotalDue }) {
    if (!txnDoc) return;
    const phone = customer?.phone && customer.phone !== '-' ? customer.phone.trim() : (txnDoc?.customerPhone || '');
    if (!phone || phone.trim() === '' || phone === '-') return;

    try {
        const rawName = customer?.name || txnDoc?.customerName || 'Customer';
        const cleanName = String(rawName).replace(/^\[.*?\]\s*/, '').trim();
        const date = txnDoc.date || '';
        const bill = safeRound(txnDoc.bill || 0);
        const paid = safeRound(txnDoc.paid || 0);
        const amount = bill > 0 ? bill : paid;
        const voucherNo = txnDoc.voucherNo || '';
        const currentDue = Number(newTotalDue) || 0;

        const { isConfirmed } = await Swal.fire({
            title: '<div class="flex flex-col items-center gap-2"><i class="fa-solid fa-triangle-exclamation text-amber-400 text-3xl mb-1"></i><span class="font-bn font-black text-xl text-white">সংশোধনী SMS পাঠানোর প্রস্তাব</span></div>',
            html: `<div class="text-left space-y-2.5 mb-2 font-bn">
                    <p class="text-[13px] text-slate-300">ভাউচারটি সফলভাবে বাতিল করা হয়েছে। আপনি কি গ্রাহককে একটি <strong>সংশোধনী ও ক্ষমাপ্রার্থনামূলক (Correction / Apology) SMS</strong> পাঠাতে চান?</p>
                    <div class="p-3 bg-slate-900 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-1.5">
                        <div class="flex justify-between"><span>কাস্টমার:</span> <strong class="text-white">${cleanName}</strong></div>
                        <div class="flex justify-between"><span>মোবাইল নম্বর:</span> <strong class="text-slate-200 font-mono">${phone}</strong></div>
                        <div class="flex justify-between"><span>বাতিলকৃত লেনদেন:</span> <strong class="text-amber-400 font-mono">৳ ${formatAmountWithComma(amount)}</strong></div>
                        <div class="flex justify-between border-t border-slate-800 pt-1.5">
                            <span>বর্তমান ব্যালেন্স:</span>
                            <strong class="${currentDue < 0 ? 'text-emerald-400' : 'text-red-400'} font-mono">৳ ${formatAmountWithComma(Math.abs(currentDue))} ${currentDue < 0 ? '(অ্যাডভান্স)' : (currentDue > 0 ? '(বকেয়া)' : '(পরিশোধিত)')}</strong>
                        </div>
                    </div>
                   </div>`,
            showCancelButton: true,
            confirmButtonText: '<i class="fa-solid fa-comment-sms mr-1.5"></i> হ্যাঁ, এসএমএস পাঠান',
            cancelButtonText: '<i class="fa-solid fa-xmark mr-1.5"></i> না, প্রয়োজন নেই',
            customClass: {
                popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-700 shadow-2xl',
                confirmButton: 'm3-btn-primary !bg-emerald-600 hover:!bg-emerald-500 !px-6 !py-2.5 !rounded-xl font-bold shadow-lg shadow-emerald-600/30',
                cancelButton: 'm3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-5 !py-2.5 !rounded-xl font-bold border border-slate-700'
            }
        });

        if (!isConfirmed) return;

        const settings = await SettingsDAO.getAppSettings();
        const formattedDate = formatAppDate(date);
        const englishName = (typeof window.toBanglishName === 'function' ? window.toBanglishName(cleanName) : cleanName) || 'Customer';
        const shopName = settings.shopName ? (typeof window.toBanglishName === 'function' ? window.toBanglishName(settings.shopName) : settings.shopName) : 'M/S. Maa Motors';

        const defaultCorrectionTpl = 'Correction Notice: Dear Sir [AccNo], a transaction of Tk [Amount] on [Date] has been cancelled/deleted due to an entry error. Your updated due is Tk [Due]. We apologize for any inconvenience. - [Shop]';

        const correctionMsg = buildSmsMessage(settings.smsTemplateCorrection, defaultCorrectionTpl, {
            name: englishName,
            accountNo: customer?.accountNo || '',
            shopName,
            date: formattedDate,
            amount: formatAmountWithComma(amount),
            due: formatAmountWithComma(Math.abs(currentDue)),
            rawDue: currentDue,
            memo: voucherNo
        });

        const { value: text, isConfirmed: isSentConfirmed } = await Swal.fire({
            title: '<div class="flex flex-col items-center gap-2"><i class="fa-solid fa-envelope-circle-check text-emerald-400 text-3xl mb-1"></i><span class="font-bn font-black text-xl text-white">Correction SMS Preview</span></div>',
            html: `<div class="text-left space-y-2 mb-2 font-bn">
                    <p class="text-[13px] text-slate-300">নিচে সংশোধনী মেসেজটি দেওয়া হলো। চাইলে লেখা পরিবর্তন করতে পারেন:</p>
                    <div class="flex justify-between items-center"><div class="text-xs text-slate-400">Recipient Phone: <strong class="text-white">${phone}</strong></div><div id="sms-del-char-counter" class="text-[11px] font-bold text-emerald-400 text-right">${formatSmsCounterText(correctionMsg)}</div></div>
                   </div>`,
            input: 'textarea',
            inputValue: correctionMsg,
            inputAttributes: { rows: 4, class: 'm3-field text-xs font-mono !mt-0' },
            showCancelButton: true,
            confirmButtonText: '<i class="fa-solid fa-paper-plane mr-1.5"></i> পাঠিয়ে দিন',
            cancelButtonText: 'স্কিপ করুন',
            customClass: {
                popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-700 shadow-2xl',
                confirmButton: 'm3-btn-primary !bg-emerald-600 hover:!bg-emerald-500 !px-7 !py-2.5 !rounded-xl font-bold shadow-lg shadow-emerald-600/30',
                cancelButton: 'm3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-5 !py-2.5 !rounded-xl font-bold border border-slate-700'
            },
            didOpen: () => {
                const textarea = Swal.getInput();
                const counter = document.getElementById('sms-del-char-counter');
                const updateCount = () => { if (textarea && counter) counter.innerText = formatSmsCounterText(textarea.value); };
                if (textarea) { textarea.oninput = updateCount; updateCount(); setTimeout(() => textarea.focus(), 150); }
            }
        });

        if (isSentConfirmed && text) {
            const success = await sendSMS(phone, text, false);
            if (success) showToast('সংশোধনী এসএমএস সফলভাবে পাঠানো হয়েছে!', 'success');
        }
    } catch (err) {
        console.error('Post-delete SMS error:', err);
    }
}
