import Swal from 'sweetalert2';
import { db, firebase } from '../firebase-config.js';
import { CustomerDAO, TransactionDAO } from '../dao.js';
import { formatAmountWithComma, formatAppDate, getTodayLocalDateString, parseAmount, showToast } from '../utils.js';
import { getCustomerCache } from '../customer/index.js';

export async function loadStatementData(stateRef = {}) {
    const tbody = document.getElementById('statement-list');
    const mobileContainer = document.getElementById('statement-list-mobile');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="5" class="text-center py-10 text-slate-500 font-bold">লোডিং...</td></tr>';
    if (mobileContainer) mobileContainer.innerHTML = '<div class="text-center py-6 text-slate-500 font-bold">লোডিং...</div>';

    const start = document.getElementById('stmt-start-date')?.value || '';
    const end = document.getElementById('stmt-end-date')?.value || '';
    const { currentCustomerInfo } = stateRef;

    try {
        let initialDue = 0;
        if (currentCustomerInfo && currentCustomerInfo.id) {
            const cached = getCustomerCache().find(c => c.id === currentCustomerInfo.id);
            if (cached !== undefined) initialDue = Number(cached.initialDue || 0);
            else {
                const customer = await CustomerDAO.getById(currentCustomerInfo.id);
                if (customer) initialDue = Number(customer.initialDue || 0);
            }
        }

        let docs = await TransactionDAO.getByCustomer(currentCustomerInfo?.id);
        docs = docs.filter(d => d.voucherNo !== 'OPENING');
        docs.sort((a, b) => {
            const dDiff = new Date(a.date) - new Date(b.date);
            if (dDiff !== 0) return dDiff;
            const timeA = a.createdAt && typeof a.createdAt.toMillis === 'function' ? a.createdAt.toMillis() : 0;
            const timeB = b.createdAt && typeof b.createdAt.toMillis === 'function' ? b.createdAt.toMillis() : 0;
            return timeA - timeB;
        });

        let openingBalance = initialDue;
        if (start) {
            const startDateObj = new Date(start);
            docs.forEach(d => {
                if (new Date(d.date) < startDateObj) {
                    openingBalance += ((Number(d.bill) || 0) - (Number(d.paid) || 0));
                }
            });
            docs = docs.filter(d => new Date(d.date) >= startDateObj);
        }
        if (end) {
            const endDateObj = new Date(end);
            docs = docs.filter(d => new Date(d.date) <= endDateObj);
        }

        stateRef.currentStatementData = docs;
        stateRef.currentOpeningBalance = openingBalance;
        renderTable(openingBalance, stateRef);
    } catch (e) { console.error("Load Statement Error:", e); }
}

export function renderTable(openingBalance = 0, stateRef = {}) {
    const tbody = document.getElementById('statement-list');
    const mobileContainer = document.getElementById('statement-list-mobile');
    if (!tbody) return;

    const currentStatementData = stateRef.currentStatementData || [];
    let running = openingBalance, billSum = 0, paidSum = 0, lessSum = 0, html = '', mobileHtml = '';

    html += `<tr class="bg-slate-800/40 font-bold border-b-2 border-slate-700">
        <td colspan="2" class="text-blue-400 uppercase tracking-widest text-[10px] !py-3 px-4 font-black"><i class="fa-solid fa-flag-checkered mr-2"></i>প্রারম্ভিক ব্যালেন্স (Opening Balance)</td>
        <td class="text-right">-</td><td class="text-right">-</td>
        <td class="text-right font-black ${openingBalance > 0 ? 'text-red-400' : 'text-emerald-400'} bg-white/5 !py-3 px-4">৳ ${formatAmountWithComma(Math.abs(openingBalance))} ${openingBalance < 0 ? '(অ্যাড)' : ''}</td>
    </tr>`;

    mobileHtml += `<div class="p-3 bg-slate-900 border border-slate-800 rounded-xl flex justify-between items-center text-xs"><span class="text-blue-400 font-bold">প্রারম্ভিক ব্যালেন্স:</span><span class="font-black ${openingBalance > 0 ? 'text-red-400' : 'text-emerald-400'}">৳ ${formatAmountWithComma(Math.abs(openingBalance))}</span></div>`;

    currentStatementData.forEach(txn => {
        const b = Number(txn.bill) || 0, p = Number(txn.paid) || 0;
        const type = txn.receivedType || '';
        billSum += b;
        if (type === 'Less') lessSum += p;
        else paidSum += p;
        running += (b - p);

        let methodBadge = '<span class="text-slate-500 text-xs">-</span>';
        if (p > 0) {
            if (type === 'Less') methodBadge = `<span class="bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded text-[10px] font-black border border-amber-500/20"><i class="fa-solid fa-hand-holding-heart mr-1"></i>LESS</span>`;
            else {
                const icon = type === 'Bank' ? 'fa-building-columns' : 'fa-money-bill';
                const color = type === 'Bank' ? 'text-blue-400' : 'text-emerald-400';
                methodBadge = `<span class="${color} text-[10px] font-bold uppercase"><i class="fa-solid ${icon} mr-1"></i>${type}</span>`;
            }
        }

        const voucherInfo = txn.voucherNo && txn.voucherNo !== 'OPENING' ? `<span class="px-1.5 py-0.5 bg-slate-950 rounded text-[9px] text-slate-400 border border-slate-800 font-mono">#${txn.voucherNo}</span>` : '';
        const details = txn.receivedFrom ? `<div class="text-[9px] text-slate-500 mt-0.5">${txn.receivedFrom}</div>` : '';

        html += `<tr class="hover:bg-white/[0.02] border-b border-slate-800/50">
            <td class="text-slate-400 text-[11px] !py-3 px-4 font-mono font-bold">${formatAppDate(txn.date)}</td>
            <td class="!py-3 px-4"><div class="flex items-center gap-2">${methodBadge}${voucherInfo}</div>${details}</td>
            <td class="text-right text-red-400 font-bold !py-3 px-4">${b > 0 ? '৳' + formatAmountWithComma(b) : '-'}</td>
            <td class="text-right text-emerald-400 font-bold !py-3 px-4">${p > 0 ? '৳' + formatAmountWithComma(p) : '-'}</td>
            <td class="text-right font-black ${running > 0 ? 'text-red-400' : 'text-emerald-400'} bg-white/[0.01] !py-3 px-4">৳ ${formatAmountWithComma(Math.abs(running))} ${running < 0 ? '<span class="text-[9px]">(Adv)</span>' : ''}</td>
        </tr>`;

        mobileHtml += `<div class="p-3 bg-slate-900/90 border border-slate-800 rounded-xl flex flex-col gap-1.5 text-xs">
            <div class="flex justify-between items-center border-b border-slate-800/60 pb-1"><span class="text-slate-400 font-mono text-[10px]">${formatAppDate(txn.date)} ${voucherInfo}</span>${methodBadge}</div>
            <div class="flex justify-between items-center text-slate-300"><span>খরচ: <strong class="text-red-400">৳${formatAmountWithComma(b)}</strong></span><span>জমা: <strong class="text-emerald-400">৳${formatAmountWithComma(p)}</strong></span></div>
            <div class="flex justify-between items-center pt-1 border-t border-slate-800/40"><span class="text-[10px] text-slate-400 font-bold">জের/ব্যালেন্স:</span><span class="font-black ${running > 0 ? 'text-red-400' : 'text-emerald-400'}">৳ ${formatAmountWithComma(Math.abs(running))}</span></div>
        </div>`;
    });
    if (currentStatementData.length === 0) {
        html += `
            <tr class="border-b border-slate-800/30">
                <td colspan="5" class="py-10 text-center text-slate-400 font-bold bg-slate-950/20">
                    <div class="flex flex-col items-center justify-center gap-2">
                        <div class="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-base shadow-sm">
                            <i class="fa-solid fa-receipt"></i>
                        </div>
                        <span class="text-xs text-slate-300 font-bold">এই সময়সীমার মধ্যে কোনো নতুন লেনদেন নেই</span>
                        <span class="text-[10px] text-slate-500 font-medium">অন্য মেয়াদের হিসাব দেখতে উপরে ফিল্টার বোতামগুলো নির্বাচন করুন</span>
                    </div>
                </td>
            </tr>`;

        mobileHtml += `
            <div class="p-6 bg-slate-900/60 border border-slate-800/80 rounded-2xl text-center text-slate-400 font-bold text-xs flex flex-col items-center justify-center gap-2">
                <i class="fa-solid fa-receipt text-2xl text-blue-400/60"></i>
                <span>এই সময়সীমার মধ্যে কোনো নতুন লেনদেন পাওয়া যায়নি</span>
            </div>`;
    }

    tbody.innerHTML = html;
    if (mobileContainer) mobileContainer.innerHTML = mobileHtml;
    const countBadge = document.getElementById('stmt-count-badge');
    if (countBadge) countBadge.innerText = `${currentStatementData.length} টি লেনদেন`;

    document.getElementById('stmt-total-bill').innerText = `৳ ${formatAmountWithComma(billSum)}`;
    document.getElementById('stmt-total-paid').innerText = `৳ ${formatAmountWithComma(paidSum)}`;
    document.getElementById('stmt-total-less').innerText = `৳ ${formatAmountWithComma(lessSum)}`;
    document.getElementById('stmt-total-due').innerText = `৳ ${formatAmountWithComma(Math.abs(running))} ${running < 0 ? '(অ্যাডভান্স)' : ''}`;
    stateRef.currentFinalBalance = running;
}

export function setStmtPresetDate(type, callbacks = {}) {
    const startEl = document.getElementById('stmt-start-date'); const endEl = document.getElementById('stmt-end-date');
    if (!startEl || !endEl) return;
    const now = new Date();
    if (type === 'today') { const todayStr = getTodayLocalDateString(); startEl.value = todayStr; endEl.value = todayStr; }
    else if (type === 'this_month') { const y = now.getFullYear(), m = String(now.getMonth() + 1).padStart(2, '0'); startEl.value = `${y}-${m}-01`; endEl.value = getTodayLocalDateString(); }
    else if (type === 'last_month') { const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1); const y = prevMonth.getFullYear(), m = String(prevMonth.getMonth() + 1).padStart(2, '0'); const lastDay = new Date(now.getFullYear(), now.getMonth(), 0).getDate(); startEl.value = `${y}-${m}-01`; endEl.value = `${y}-${m}-${String(lastDay).padStart(2, '0')}`; }
    if (callbacks.loadStatementData) callbacks.loadStatementData();
}

export async function quickCollectPaymentFromStmt(stateRef = {}, callbacks = {}) {
    const { currentCustomerInfo } = stateRef;
    const { value: formValues } = await Swal.fire({
        title: '<i class="fa-solid fa-credit-card text-blue-400 mr-2"></i>জমা গ্রহণ করুন',
        html: `
            <div class="flex flex-col gap-3 text-left font-bn p-2">
                <div class="text-xs text-blue-400 font-bold">কাস্টমার: ${currentCustomerInfo?.name || 'Customer'}</div>
                <div><label class="block text-xs font-bold text-slate-400 mb-1">জমার পরিমাণ (৳)</label><input id="stmt-recv-amt" type="text" class="m3-field text-lg font-black text-emerald-400" placeholder="০.০০"></div>
                <div><label class="block text-xs font-bold text-slate-400 mb-1">পেমেন্ট মাধ্যম</label><select id="stmt-recv-type" class="m3-field"><option value="Cash">Cash (নগদ)</option><option value="Bank">Bank (ব্যাংক/বিকাশ)</option><option value="Less">Less (ছাড়/কমিশন)</option></select></div>
                <div><label class="block text-xs font-bold text-slate-400 mb-1">বিবরণ / ব্যাংক নাম (ঐচ্ছিক)</label><input id="stmt-recv-ref" type="text" class="m3-field" placeholder="মন্তব্য..."></div>
            </div>`,
        showCancelButton: true, 
        confirmButtonText: '<i class="fa-solid fa-circle-check mr-2"></i>জমা সেভ করুন', 
        cancelButtonText: 'বাতিল', 
        customClass: { 
            popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn',
            confirmButton: 'm3-btn-primary !bg-emerald-600 hover:!bg-emerald-500 !px-6 !py-2 rounded-xl font-bold',
            cancelButton: 'm3-btn-tonal !bg-slate-800 !text-slate-300 !px-5 !py-2 rounded-xl font-bold border border-slate-700'
        },
        preConfirm: () => {
            const amt = parseAmount(document.getElementById('stmt-recv-amt').value);
            if (!amt || amt <= 0) return Swal.showValidationMessage('সঠিক জমার পরিমাণ লিখুন!');
            return { amount: amt, type: document.getElementById('stmt-recv-type').value, ref: document.getElementById('stmt-recv-ref').value.trim() };
        }
    });

    if (formValues) {
        try {
            const batch = db.batch(); const txnRef = TransactionDAO.getRef();
            batch.set(txnRef, { customerId: currentCustomerInfo.id, customerName: currentCustomerInfo.name, date: getTodayLocalDateString(), voucherNo: '', bill: 0, paid: formValues.amount, receivedType: formValues.type, receivedFrom: formValues.ref, createdBy: window.AppState?.currentUserEmail || 'Unknown', createdAt: firebase.firestore.FieldValue.serverTimestamp() });
            batch.update(CustomerDAO.getRef(currentCustomerInfo.id), { totalDue: firebase.firestore.FieldValue.increment(-formValues.amount) });
            await batch.commit();
            showToast('জমা সফলভাবে সেভ হয়েছে!', 'success');
            if (callbacks.loadStatementData) callbacks.loadStatementData();
        } catch (e) { Swal.fire('Error', 'জমা সেভ করা যায়নি', 'error'); }
    }
}

export async function sendStmtReminderSMS(stateRef = {}) {
    const { currentCustomerInfo, currentFinalBalance } = stateRef;
    const phone = currentCustomerInfo?.phone;
    if (!phone) return Swal.fire('Error', 'No phone number found for this customer.', 'warning');
    const dueAmount = currentFinalBalance;
    const dueLabel = dueAmount < 0 ? 'advance' : 'pending due';
    const formattedDue = formatAmountWithComma(Math.abs(dueAmount));
    const msg = `Dear ${currentCustomerInfo.name || 'Customer'}, Your total ${dueLabel} at M/S. Maa Motors is Tk ${formattedDue}. Kindly clear payment. Contact: 01819-397669. Thank you! - M/S. Maa Motors`;
    const { value: text } = await Swal.fire({
        title: '<i class="fa-solid fa-comment-sms text-blue-400 mr-2"></i>Send Reminder SMS', input: 'textarea', inputValue: msg, inputAttributes: { rows: 5, class: 'm3-field text-xs font-mono' },
        showCancelButton: true, confirmButtonText: '<i class="fa-solid fa-paper-plane mr-1.5"></i> Send SMS', cancelButtonText: 'Cancel', customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' }
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

    const shareLink = `${window.location.origin}${window.location.pathname}?view=public-stmt&id=${currentCustomerInfo.id}`;

    let msg = `আসসালামু আলাইকুম ${currentCustomerInfo.name || 'কাস্টমার'},\nমেসার্স মা মোটরস্ থেকে আপনার মোট হিসাবের সামারি:\n\nহিসাব নং: ${accNo}\nমোট কেনাকাটা/বিল: ${billSum}\nমোট জমা: ${paidSum}\nমোট ছাড়: ${lessSum}\n---------------------------------\n`;

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
