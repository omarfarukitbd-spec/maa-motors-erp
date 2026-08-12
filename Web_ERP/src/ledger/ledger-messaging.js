import Swal from 'sweetalert2';
import { CustomerDAO, TransactionDAO, SettingsDAO } from '../dao.js';
import { formatAmountWithComma, formatAppDate, promptSecurityPin, sendSMS, showToast } from '../utils.js';
import { getCustomerCache } from '../customer/index.js';

export async function sendTxnSMS(id, name, date, v, bill, paid, due, custId, stateRefs = {}) {
    const isPinValid = await promptSecurityPin("SMS পাঠানোর অনুমতি (Master PIN)");
    if (!isPinValid) return;

    try {
        const { currentLedgerTxnsMap, currentLedgerTxns } = stateRefs;
        let txn = (currentLedgerTxnsMap && currentLedgerTxnsMap[id]) ? currentLedgerTxnsMap[id] : (currentLedgerTxns || []).find(t => t.id === id);
        if (!txn && id) {
            try { txn = await TransactionDAO.getById(id); } catch(e) { console.error("Error fetching txn:", e); }
        }

        const targetCustId = custId || txn?.customerId;
        const targetName = name || txn?.customerName || 'Customer';
        const targetDate = date || txn?.date;
        const targetVoucher = v !== undefined ? v : (txn?.voucherNo || '');
        const targetBill = bill !== undefined ? Number(bill) : Number(txn?.bill || 0);
        const targetPaid = paid !== undefined ? Number(paid) : Number(txn?.paid || 0);

        let currentCust = getCustomerCache().find(c => c.id === targetCustId);
        if (!currentCust && targetCustId) { try { currentCust = await CustomerDAO.getById(targetCustId); } catch(e) { console.error("Error fetching cust:", e); } }

        let phone = txn?.phone || currentCust?.phone || '';
        let targetDue = (txn?.calculatedDue !== undefined) ? txn.calculatedDue : (due !== undefined ? Number(due) : (currentCust ? Number(currentCust.totalDue || 0) : Number(txn?.currentDue || 0)));

        if (!phone) {
            const { value: inputPhone } = await Swal.fire({ title: '<i class="fa-solid fa-mobile-screen text-blue-400 mr-2"></i>Enter Phone Number', input: 'text', inputLabel: `Phone number missing for "${targetName}". Enter phone number:`, inputPlaceholder: '018XXXXXXXX', showCancelButton: true, confirmButtonText: 'Next', cancelButtonText: 'Cancel', customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' } });
            if (!inputPhone || !inputPhone.trim()) return;
            phone = inputPhone.trim();
        }

        const settings = await SettingsDAO.getAppSettings();
        const formattedDate = formatAppDate(targetDate);
        const formattedBill = formatAmountWithComma(targetBill);
        const formattedPaid = formatAmountWithComma(targetPaid);
        const formattedDue = formatAmountWithComma(Math.abs(targetDue));
        const isOpening = (targetVoucher === 'OPENING' || targetVoucher === 'OPEN' || targetVoucher === 'প্রারম্ভিক জের' || (targetDate && String(targetVoucher).toUpperCase() === 'OPENING'));

        const englishName = (typeof window.toBanglishName === 'function' ? window.toBanglishName(targetName) : targetName) || 'Customer';
        const shopName = settings.shopName ? (typeof window.toBanglishName === 'function' ? window.toBanglishName(settings.shopName) : settings.shopName) : 'M/S. Maa Motors';

        const accountNo = currentCust?.accountNo || txn?.customerAccountNo || txn?.accountNo || '';
        const accStr = accountNo ? `(A/C: ${accountNo})` : '';

        let defaultMsg = '';
        if (isOpening) {
            let tpl = settings.smsTemplateOpening || 'Dear [Name] [AccNo], A/C opened at [Shop] on [Date]. Opening Due: Tk [Due]. Thanks!';
            defaultMsg = tpl.replace(/\[Name\]/g, englishName)
                .replace(/\[AccNo\]/g, accStr)
                .replace(/\[Shop\]/g, shopName)
                .replace(/\[Date\]/g, formattedDate)
                .replace(/\[Due\]/g, formattedDue);
        } else if (targetBill > 0) {
            let tpl = settings.smsTemplateNew || 'Dear [Name] [AccNo], Memo #[Memo] of Tk [Bill] created on [Date]. Paid: Tk [Paid], Due: Tk [Due]. Thanks! - [Shop]';
            defaultMsg = tpl.replace(/\[Name\]/g, englishName)
                .replace(/\[AccNo\]/g, accStr)
                .replace(/\[Shop\]/g, shopName)
                .replace(/\[Date\]/g, formattedDate)
                .replace(/\[Memo\]/g, targetVoucher || '1')
                .replace(/\[Bill\]/g, formattedBill)
                .replace(/\[Paid\]/g, formattedPaid)
                .replace(/\[Due\]/g, formattedDue);
        } else {
            let tpl = settings.smsTemplatePaid || 'Dear [Name] [AccNo], Received Tk [Paid] ([Type]) on [Date]. Net Due: Tk [Due]. Thanks! - [Shop]';
            let recvType = txn?.receivedType || 'Cash';
            defaultMsg = tpl.replace(/\[Name\]/g, englishName)
                .replace(/\[AccNo\]/g, accStr)
                .replace(/\[Shop\]/g, shopName)
                .replace(/\[Date\]/g, formattedDate)
                .replace(/\[Paid\]/g, formattedPaid)
                .replace(/\[Type\]/g, recvType)
                .replace(/\[Due\]/g, formattedDue);
        }

        // Clean extra double spaces if any
        defaultMsg = defaultMsg.replace(/\s+/g, ' ').replace(/[^\x00-\x7F]/g, '');

        const { value: text } = await Swal.fire({
            title: '<i class="fa-solid fa-comment-sms text-blue-400 mr-2"></i>Send Transaction SMS',
            html: `<div class="text-left space-y-1 mb-2 font-bn"><div class="text-xs text-slate-400">Recipient Phone: <strong class="text-white">${phone}</strong></div><div id="sms-char-counter" class="text-[11px] font-bold text-emerald-400 text-right">0 / 160 Characters (1 SMS)</div></div>`,
            input: 'textarea', inputValue: defaultMsg, inputAttributes: { rows: 5, class: 'm3-field text-xs font-mono' },
            showCancelButton: true, confirmButtonText: '<i class="fa-solid fa-paper-plane mr-1.5"></i> Send SMS', cancelButtonText: 'Cancel',
            customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' },
            didOpen: () => {
                const textarea = Swal.getInput(); const counter = document.getElementById('sms-char-counter');
                const updateCount = () => { 
                    if (textarea && counter) { 
                        const len = textarea.value.length;
                        const parts = Math.ceil(len / 160) || 1;
                        counter.innerText = `${len} / 160 Characters (${parts} SMS)`; 
                    } 
                };
                if (textarea) textarea.oninput = updateCount; updateCount();
            }
        });

        if (text) {
            const success = await sendSMS(phone, text, false);
            if (success) {
                Swal.fire({ title: '<i class="fa-solid fa-paper-plane text-emerald-400 mr-2"></i>সফল!', text: `${targetName}-কে SMS সফলভাবে পাঠানো হয়েছে`, icon: 'success', customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' } });
            }
        }
    } catch(err) {
        console.error('sendTxnSMS error:', err);
        Swal.fire({ title: 'এরর!', text: 'SMS তৈরি করতে সমস্যা হয়েছে: ' + (err.message || err), icon: 'error', customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' } });
    }
}

export async function sendTxnWhatsApp(id, name, date, v, bill, paid, due, custId, stateRefs = {}) {
    const { currentLedgerTxns } = stateRefs;
    let txn = (currentLedgerTxns || []).find(t => t.id === id);
    if (!txn && id) { try { txn = await TransactionDAO.getById(id); } catch(e) { console.error("Error fetching txn:", e); } }

    const targetCustId = custId || txn?.customerId;
    const targetName = name || txn?.customerName || 'Customer';
    const targetDate = date || txn?.date;
    const targetVoucher = v !== undefined ? v : (txn?.voucherNo || '');
    const targetBill = bill !== undefined ? Number(bill) : Number(txn?.bill || 0);
    const targetPaid = paid !== undefined ? Number(paid) : Number(txn?.paid || 0);

    let currentCust = getCustomerCache().find(c => c.id === targetCustId);
    if (!currentCust && targetCustId) { try { currentCust = await CustomerDAO.getById(targetCustId); } catch(e) { console.error("Error fetching cust:", e); } }
    let phone = currentCust?.phone || '';
    let targetDue = due !== undefined ? Number(due) : (currentCust ? Number(currentCust.totalDue || 0) : Number(txn?.currentDue || 0));

    if (!phone) {
        const { value: inputPhone } = await Swal.fire({
            title: '<i class="fa-brands fa-whatsapp text-emerald-400 mr-2"></i>Enter Phone Number',
            input: 'text', inputLabel: `Phone number missing for "${targetName}". Enter phone number:`,
            inputPlaceholder: '018XXXXXXXX', showCancelButton: true, confirmButtonText: 'Next', cancelButtonText: 'Cancel',
            customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' }
        });
        if (!inputPhone || !inputPhone.trim()) return;
        phone = inputPhone.trim();
    }

    const accountNo = currentCust?.accountNo || txn?.customerAccountNo || txn?.accountNo || '';
    const accLine = accountNo ? `একাউন্ট নং: ${accountNo}\n` : '';

    const formattedDate = formatAppDate(targetDate);
    const formattedBill = formatAmountWithComma(targetBill);
    const formattedPaid = formatAmountWithComma(targetPaid);
    const formattedDue = formatAmountWithComma(Math.abs(targetDue));
    const memoStr = targetVoucher ? `মেমো #${targetVoucher}` : '';

    const directMemoLink = id ? `${window.location.origin}${window.location.pathname}?view=public-memo&id=${id}` : '';
    const shareLink = targetCustId ? `${window.location.origin}${window.location.pathname}?view=public-stmt&id=${targetCustId}` : '';
    const pdfLinkStr = directMemoLink 
        ? `আপনার এই মেমোর ডাইরেক্ট PDF দেখতে লিংকে ক্লিক করুন:\n${directMemoLink}\n\n` 
        : (shareLink ? `আপনার সম্পূর্ণ মেমো ও হিসাবের PDF বিবরণী দেখতে নিচের লিংকে ক্লিক করুন:\n${shareLink}\n\n` : '');

    let msg = '';
    const isOpening = (targetVoucher === 'OPENING' || targetVoucher === 'OPEN' || targetVoucher === 'প্রারম্ভিক জের' || (targetDate && String(targetVoucher).toUpperCase() === 'OPENING'));

    if (isOpening) {
        msg = `আসসালামু আলাইকুম ${targetName},\nমেসার্স মা মোটরস্ থেকে আপনার হিসাবের একাউন্ট খোলা হয়েছে।\n\n${accLine}একাউন্ট খোলার তারিখ: ${formattedDate}\n`;
        const initialVal = targetBill > 0 ? targetBill : (targetPaid > 0 ? -targetPaid : 0);
        const formattedInitial = formatAmountWithComma(Math.abs(initialVal));

        if (initialVal > 0) {
            msg += `প্রারম্ভিক বকেয়া: ৳ ${formattedInitial}\n`;
        } else if (initialVal < 0) {
            msg += `প্রারম্ভিক জমা: ৳ ${formattedInitial}\n`;
        } else {
            msg += `প্রারম্ভিক জের: ৳ 0\n`;
        }
        msg += `---------------------------------\n`;
        if (targetDue < 0) {
            msg += `অ্যাডভান্স জমা: ৳ ${formattedDue}\n\n`;
        } else {
            msg += `বর্তমান মোট বকেয়া: ৳ ${formattedDue}\n\n`;
        }
        if (pdfLinkStr) msg += pdfLinkStr;
        msg += `যোগাযোগ: 01819-397669\nধন্যবাদ! — মেসার্স মা মোটরস্`;
    } else if (targetBill > 0) {
        msg = `আসসালামু আলাইকুম ${targetName},\nমেসার্স মা মোটরস্ থেকে আপনার কেনাকাটার বিবরণী:\n\n${accLine}তারিখ: ${formattedDate}\n${memoStr ? memoStr + '\n' : ''}আজকের বিল/খরচ: ৳ ${formattedBill}\nআজকের জমা: ৳ ${formattedPaid}\n---------------------------------\n`;
        if (targetDue < 0) {
            msg += `অ্যাডভান্স জমা: ৳ ${formattedDue}\n\n`;
        } else {
            msg += `বর্তমান মোট বকেয়া: ৳ ${formattedDue}\n\n`;
        }
        if (pdfLinkStr) msg += pdfLinkStr;
        msg += `যোগাযোগ: 01819-397669\nধন্যবাদ! — মেসার্স মা মোটরস্`;
    } else {
        msg = `আসসালামু আলাইকুম ${targetName},\nমেসার্স মা মোটরস্-এ আপনার টাকা জমা নেওয়ার রিসিট:\n\n${accLine}তারিখ: ${formattedDate}\nজমা প্রাপ্তি: ৳ ${formattedPaid}\n---------------------------------\n`;
        if (targetDue < 0) {
            msg += `অ্যাডভান্স জমা: ৳ ${formattedDue}\n\n`;
        } else {
            msg += `বর্তমান মোট বকেয়া: ৳ ${formattedDue}\n\n`;
        }
        if (pdfLinkStr) msg += pdfLinkStr;
        msg += `যোগাযোগ: 01819-397669\nধন্যবাদ! — মেসার্স মা মোটরস্`;
    }

    const { value: text } = await Swal.fire({
        title: '<div class="flex items-center justify-center gap-2 font-bn font-black text-lg text-emerald-400"><i class="fa-brands fa-whatsapp text-xl"></i><span>Send WhatsApp Message</span></div>',
        html: `<div class="text-left space-y-1 mb-2 font-bn"><div class="text-xs text-slate-400">Recipient Phone: <strong class="text-white">${phone}</strong></div></div>`,
        input: 'textarea', inputValue: msg, inputAttributes: { rows: 8, class: 'm3-field text-xs font-bn' },
        showCancelButton: true, confirmButtonText: '<i class="fa-brands fa-whatsapp mr-1.5"></i> Open WhatsApp', cancelButtonText: 'Cancel',
        customClass: { popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn', confirmButton: 'm3-btn-primary !bg-emerald-600 hover:!bg-emerald-500 !px-6 !py-2 rounded-xl font-bold' }
    });

    if (text) {
        if (window.sendWhatsApp) window.sendWhatsApp(phone, text);
    }
}

export async function executePrint(txnId, layoutType) {
    try {
        if (typeof Swal !== 'undefined' && Swal.close) Swal.close();
        if (typeof window.printReceiptEngine === 'function') {
            await window.printReceiptEngine(txnId, layoutType);
        } else {
            const { printReceiptEngine } = await import('../utils/receipt-engine.js');
            window.printReceiptEngine = printReceiptEngine;
            await window.printReceiptEngine(txnId, layoutType);
        }
    } catch (err) {
        if (typeof showToast === 'function') showToast(`প্রিন্ট লোড ব্যর্থ: ${err.message}`, 'error', 'প্রিন্ট Error');
    }
}

export function choosePrintType(txnId) {
    Swal.fire({ 
        title: '<div class="flex items-center justify-center gap-2 font-bn font-black text-lg text-white"><i class="fa-solid fa-print text-emerald-400"></i><span>রিসিট প্রিন্ট ফরম্যাট নির্বাচন করুন</span></div>', 
        html: `
            <div class="flex flex-col gap-3 p-1 font-bn mt-2">
                <button type="button" onclick="window.executePrint('${txnId}', 'pos')" class="h-11 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer">
                    <i class="fa-solid fa-receipt text-sm"></i> POS রিসিট (80mm Thermal Printer)
                </button>
                <button type="button" onclick="window.executePrint('${txnId}', 'a4')" class="h-11 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all cursor-pointer">
                    <i class="fa-solid fa-file-invoice text-sm text-purple-400"></i> A4 ফুল পেপার মেমো (Standard Invoice)
                </button>
            </div>
        `,
        showConfirmButton: false,
        showCancelButton: true,
        cancelButtonText: 'বাতিল',
        customClass: { 
            popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn',
            cancelButton: '!bg-slate-900 hover:!bg-slate-800 !text-slate-400 !px-6 !py-2 !rounded-xl text-xs font-bold border border-slate-800'
        }
    });
}
