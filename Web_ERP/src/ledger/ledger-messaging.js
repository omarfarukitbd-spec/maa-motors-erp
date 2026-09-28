import Swal from 'sweetalert2';
import { CustomerDAO, TransactionDAO, SettingsDAO } from '../dao.js';
import { formatAmountWithComma, formatAppDate, formatSmsCounterText, buildSmsMessage, promptSecurityPin, sendSMS, showToast, escapeHTML } from '../utils.js';
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
        const isOpening = (targetVoucher === 'OPENING' || targetVoucher === 'OPEN' || targetVoucher === 'প্রারম্ভিক ব্যালেন্স' || targetVoucher === 'প্রারম্ভিক জের' || (targetDate && String(targetVoucher).toUpperCase() === 'OPENING'));

        const englishName = (typeof window.toBanglishName === 'function' ? window.toBanglishName(targetName) : targetName) || 'Customer';
        const shopName = settings.shopName ? (typeof window.toBanglishName === 'function' ? window.toBanglishName(settings.shopName) : settings.shopName) : 'M/S. Maa Motors';

        const accountNo = currentCust?.accountNo || txn?.customerAccountNo || txn?.accountNo || '';
        const rType = txn?.receivedType || '';
        const rFrom = txn?.receivedFrom || '';
        const isLess = targetBill === 0 && (rType === 'Less' || /less|ছাড়|discount|কমিশন/i.test(rType) || /less|ছাড়|discount/i.test(rFrom) || /less|ছাড়|discount/i.test(targetVoucher));

        let defaultMsg = '';
        if (isOpening) {
            defaultMsg = buildSmsMessage(settings.smsTemplateOpening, 'Dear Sir [AccNo], A/C opened at [Shop] on [Date]. Opening Due: Tk [Due]. Thanks!', {
                name: englishName,
                accountNo,
                shopName,
                date: formattedDate,
                due: formattedDue,
                rawDue: targetDue
            });
        } else if (isLess) {
            defaultMsg = buildSmsMessage(settings.smsTemplateLess, 'Dear Sir [AccNo], a discount/less of Tk [Paid] has been adjusted on [Date]. Your updated due is Tk [Due]. Thanks! - [Shop]', {
                name: englishName,
                accountNo,
                shopName,
                date: formattedDate,
                paid: formattedPaid,
                type: 'Less',
                due: formattedDue,
                rawDue: targetDue
            });
        } else if (targetBill > 0) {
            defaultMsg = buildSmsMessage(settings.smsTemplateNew, 'Dear Sir [AccNo], Memo #[Memo] of Tk [Bill] created on [Date]. Paid: Tk [Paid], Due: Tk [Due]. Thanks! - [Shop]', {
                name: englishName,
                accountNo,
                shopName,
                date: formattedDate,
                memo: targetVoucher,
                bill: formattedBill,
                paid: formattedPaid,
                due: formattedDue,
                rawDue: targetDue
            });
        } else {
            defaultMsg = buildSmsMessage(settings.smsTemplatePaid, 'We have received your payment of Tk [Paid] on [Date]. Your updated due is Tk [Due]. Thank you for staying with us! - [Shop]', {
                name: englishName,
                accountNo,
                shopName,
                date: formattedDate,
                paid: formattedPaid,
                type: txn?.receivedType || 'Cash',
                due: formattedDue,
                rawDue: targetDue
            });
        }

        const { value: text } = await Swal.fire({
            title: '<i class="fa-solid fa-comment-sms text-blue-400 mr-2"></i>Send Transaction SMS',
            html: `<div class="text-left space-y-1 mb-2 font-bn"><div class="text-xs text-slate-400">Recipient Phone: <strong class="text-white">${phone}</strong></div><div id="sms-char-counter" class="text-[11px] font-bold text-emerald-400 text-right">${formatSmsCounterText(defaultMsg)}</div></div>`,
            input: 'textarea', inputValue: defaultMsg, inputAttributes: { rows: 5, class: 'm3-field text-xs font-mono' },
            showCancelButton: true, confirmButtonText: '<i class="fa-solid fa-paper-plane mr-1.5"></i> Send SMS', cancelButtonText: 'Cancel',
            customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' },
            didOpen: () => {
                const textarea = Swal.getInput(); const counter = document.getElementById('sms-char-counter');
                const updateCount = () => { 
                    if (textarea && counter) { 
                        counter.innerText = formatSmsCounterText(textarea.value); 
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
    // <i class="fa-solid fa-check text-emerald-400"></i> BUG #1 FIX: prefer calculatedDue (running per-transaction balance) over stale totalDue
    let txnFromMap = (stateRefs?.currentLedgerTxnsMap && stateRefs.currentLedgerTxnsMap[id]) ? stateRefs.currentLedgerTxnsMap[id] : null;
    let targetDue = (txnFromMap?.calculatedDue !== undefined) ? txnFromMap.calculatedDue
        : (due !== undefined ? Number(due)
        : (currentCust ? Number(currentCust.totalDue || 0) : Number(txn?.currentDue || 0)));

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
    const isOpening = (targetVoucher === 'OPENING' || targetVoucher === 'OPEN' || targetVoucher === 'প্রারম্ভিক ব্যালেন্স' || targetVoucher === 'প্রারম্ভিক জের' || (targetDate && String(targetVoucher).toUpperCase() === 'OPENING'));
    const waRType = txn?.receivedType || '';
    const waRFrom = txn?.receivedFrom || '';
    const isLessTxn = targetBill === 0 && (waRType === 'Less' || /less|ছাড়|discount|কমিশন/i.test(waRType) || /less|ছাড়|discount/i.test(waRFrom) || /less|ছাড়|discount/i.test(targetVoucher));

    if (isOpening) {
        msg = `আসসালামু আলাইকুম ${targetName},\nমেসার্স মা মোটরস্ থেকে আপনার হিসাবের একাউন্ট খোলা হয়েছে।\n\n${accLine}একাউন্ট খোলার তারিখ: ${formattedDate}\n`;
        const initialVal = targetBill > 0 ? targetBill : (targetPaid > 0 ? -targetPaid : 0);
        const formattedInitial = formatAmountWithComma(Math.abs(initialVal));

        if (initialVal > 0) {
            msg += `প্রারম্ভিক বকেয়া: ৳ ${formattedInitial}\n`;
        } else if (initialVal < 0) {
            msg += `প্রারম্ভিক জমা: ৳ ${formattedInitial}\n`;
        } else {
            msg += `প্রারম্ভিক ব্যালেন্স: ৳ 0\n`;
        }
        msg += `---------------------------------\n`;
        if (targetDue < 0) {
            msg += `অ্যাডভান্স জমা: ৳ ${formattedDue}\n\n`;
        } else {
            msg += `বর্তমান মোট বকেয়া: ৳ ${formattedDue}\n\n`;
        }
        if (pdfLinkStr) msg += pdfLinkStr;
        msg += `যোগাযোগ: 01819-397669\nধন্যবাদ! — মেসার্স মা মোটরস্`;
    } else if (isLessTxn) {
        msg = `আসসালামু আলাইকুম স্যার,\nমেসার্স মা মোটরস্ থেকে আপনার একাউন্টে বিশেষ ছাড়/লেস (Less) সমন্বয় করা হয়েছে।\n\n${accLine}তারিখ: ${formattedDate}\nলেস/ছাড়ের পরিমাণ: ৳ ${formattedPaid}\n---------------------------------\n`;
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

export async function executePrint(txnId, layoutType, selectedMemos = []) {
    try {
        if (typeof Swal !== 'undefined' && Swal.close) Swal.close();
        if (typeof window.printReceiptEngine === 'function') {
            await window.printReceiptEngine(txnId, layoutType, selectedMemos);
        } else {
            const { printReceiptEngine } = await import('../utils/receipt-engine.js');
            window.printReceiptEngine = printReceiptEngine;
            await window.printReceiptEngine(txnId, layoutType, selectedMemos);
        }
    } catch (err) {
        if (typeof showToast === 'function') showToast(`প্রিন্ট লোড ব্যর্থ: ${err.message}`, 'error', 'প্রিন্ট Error');
    }
}

export async function choosePrintType(txnId) {
    let txn = null;
    if (window._currentLedgerTxnsMap && window._currentLedgerTxnsMap[txnId]) {
        txn = window._currentLedgerTxnsMap[txnId];
    } else if (Array.isArray(window._currentLedgerTxns)) {
        txn = window._currentLedgerTxns.find(t => t.id === txnId);
    }
    if (!txn && txnId) {
        try {
            txn = await TransactionDAO.getById(txnId);
        } catch (e) {
            console.error("Error fetching txn in choosePrintType:", e);
        }
    }

    const currentTxns = Array.isArray(window._currentLedgerTxns) ? window._currentLedgerTxns : [];
    const allCandidateMemos = [];
    if (txn?.memoPhotoUrl) allCandidateMemos.push(txn);
    currentTxns.forEach(t => {
        if (t.memoPhotoUrl && t.id !== txn?.id) {
            allCandidateMemos.push(t);
        }
    });

    const seenUrls = new Set();
    const availableMemos = [];
    allCandidateMemos.forEach(m => {
        if (m.memoPhotoUrl && !seenUrls.has(m.memoPhotoUrl)) {
            seenUrls.add(m.memoPhotoUrl);
            availableMemos.push(m);
        }
    });

    let memoSectionHtml = '';
    if (availableMemos.length > 0) {
        const memoItemsHtml = availableMemos.map(m => {
            const isCurrent = m.id === txn?.id || (txn?.voucherNo && m.voucherNo === txn.voucherNo);
            const rawV = m.voucherNo ? String(m.voucherNo).trim() : 'মেমো';
            const cleanV = rawV.startsWith('#') ? rawV : `#${rawV}`;
            const formattedDate = m.date ? formatAppDate(m.date) : '';
            const b = Number(m.bill || 0);
            const p = Number(m.paid || 0);
            return `
                <label class="flex items-center justify-between p-2 rounded-xl bg-slate-900 border ${isCurrent ? 'border-amber-500/40 bg-amber-500/5' : 'border-slate-800'} hover:border-slate-700 cursor-pointer text-xs transition-colors">
                    <div class="flex items-center gap-2.5 overflow-hidden">
                        <input type="checkbox" class="ledger-memo-cb w-4 h-4 rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-0 cursor-pointer" data-url="${escapeHTML(m.memoPhotoUrl)}" data-voucher="${escapeHTML(cleanV)}" data-date="${escapeHTML(m.date || '')}" data-bill="${b}" data-paid="${p}">
                        <img src="${escapeHTML(m.memoPhotoUrl)}" class="w-9 h-9 object-cover rounded-lg border border-slate-700 shrink-0" onclick="event.preventDefault(); if(window.viewMemoPhoto) window.viewMemoPhoto('${m.id || txnId}');" title="বড় করে দেখতে ক্লিক করুন">
                        <div class="truncate">
                            <div class="font-mono font-black text-amber-300 text-xs flex items-center gap-1.5">
                                <span>${escapeHTML(cleanV)}</span>
                                ${isCurrent ? '<span class="text-[9px] font-sans font-bold bg-amber-500/20 text-amber-400 px-1 py-0.2 rounded border border-amber-500/30">এই ভাউচার</span>' : ''}
                            </div>
                            <div class="text-[10px] text-slate-400 font-medium">${formattedDate}</div>
                        </div>
                    </div>
                    <div class="text-right shrink-0">
                        ${b > 0 ? `<div class="text-red-400 font-bold font-mono text-xs">৳ ${formatAmountWithComma(b)}</div>` : ''}
                        ${p > 0 ? `<div class="text-emerald-400 font-bold font-mono text-xs">৳ ${formatAmountWithComma(p)}</div>` : ''}
                    </div>
                </label>
            `;
        }).join('');

        memoSectionHtml = `
            <div class="mb-2 text-left">
                <div class="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800">
                    <span class="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <i class="fa-solid fa-file-invoice text-amber-400 text-xs"></i>
                        <span>স্ক্যান মেমো সংযুক্তি (ঐচ্ছিক)</span>
                    </span>
                    <span id="ledger-memo-count-disp" class="text-[10px] text-slate-400 font-mono">০টি নির্বাচিত</span>
                </div>
                <div class="max-h-40 overflow-y-auto custom-scrollbar space-y-1.5 pr-1">
                    ${memoItemsHtml}
                </div>
            </div>
        `;
    }

    Swal.fire({
        title: '<div class="flex items-center justify-center gap-2 font-bn font-black text-base text-white"><i class="fa-solid fa-print text-emerald-400"></i><span>রিসিট প্রিন্ট ফরম্যাট নির্বাচন করুন</span></div>',
        html: `
            <div class="flex flex-col gap-2 p-1 font-bn mt-1 text-left">
                ${memoSectionHtml}
                <button type="button" id="ledger-print-a4-btn" class="h-11 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all cursor-pointer">
                    <i class="fa-solid fa-file-invoice text-sm text-purple-400"></i>
                    <span id="ledger-a4-text">A4 ফুল পেপার মেমো (Standard Invoice)</span>
                </button>
                <button type="button" id="ledger-print-pos-btn" class="h-11 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer">
                    <i class="fa-solid fa-receipt text-sm"></i>
                    <span>POS রিসিট (80mm Thermal Printer)</span>
                </button>
            </div>
        `,
        showConfirmButton: false,
        showCancelButton: true,
        cancelButtonText: 'বাতিল',
        customClass: {
            popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn max-w-md w-full',
            cancelButton: '!bg-slate-900 hover:!bg-slate-800 !text-slate-400 !px-6 !py-2 !rounded-xl text-xs font-bold border border-slate-800'
        },
        didOpen: (popup) => {
            const a4Btn = popup.querySelector('#ledger-print-a4-btn');
            const posBtn = popup.querySelector('#ledger-print-pos-btn');
            const a4Text = popup.querySelector('#ledger-a4-text');
            const countDisp = popup.querySelector('#ledger-memo-count-disp');
            const memoCbs = popup.querySelectorAll('.ledger-memo-cb');

            const getSelected = () => Array.from(popup.querySelectorAll('.ledger-memo-cb:checked')).map(cb => ({
                url: cb.dataset.url,
                voucherNo: cb.dataset.voucher,
                date: cb.dataset.date,
                bill: Number(cb.dataset.bill || 0),
                paid: Number(cb.dataset.paid || 0)
            }));

            memoCbs.forEach(cb => {
                cb.onchange = () => {
                    const sel = getSelected();
                    if (countDisp) countDisp.innerText = `${sel.length}টি নির্বাচিত`;
                    if (a4Text) {
                        a4Text.innerHTML = sel.length > 0
                            ? `<span class="text-amber-300 font-bold">মেমো সহ A4 প্রিন্ট (${sel.length}টি মেমো)</span>`
                            : 'A4 ফুল পেপার মেমো (Standard Invoice)';
                    }
                    if (a4Btn) {
                        if (sel.length > 0) a4Btn.classList.add('!border-amber-500/60', '!bg-slate-800/90');
                        else a4Btn.classList.remove('!border-amber-500/60', '!bg-slate-800/90');
                    }
                };
            });

            if (a4Btn) {
                a4Btn.onclick = () => {
                    const sel = getSelected();
                    executePrint(txnId, 'a4', sel);
                };
            }
            if (posBtn) {
                posBtn.onclick = () => {
                    executePrint(txnId, 'pos', []);
                };
            }
        }
    });
}
