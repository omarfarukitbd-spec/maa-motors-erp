import Swal from 'sweetalert2';
import { db, firebase } from '../firebase-config.js';
import { CustomerDAO, TransactionDAO } from '../dao.js';
import { formatAmountWithComma, formatAppDate, getTodayLocalDateString, parseAmount, safeRound, showToast } from '../utils.js';
import { getCustomerCache } from '../customer/index.js';
import { auditLog } from '../audit.js';

export { sendStmtReminderSMS, sendStmtReminderWhatsApp } from './statement-reminders.js';

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
        docs = docs.filter(d => {
            const v = String(d.voucherNo || '').trim().toUpperCase();
            return v !== 'OPENING' && v !== 'OPEN' && v !== 'প্রারম্ভিক ব্যালেন্স' && v !== 'প্রারম্ভিক জের';
        });
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
                    openingBalance = safeRound(openingBalance + ((Number(d.bill) || 0) - (Number(d.paid) || 0)));
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
    } catch (e) { 
        console.error("Load Statement Error:", e); 
    }
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
        billSum = safeRound(billSum + b);
        if (type === 'Less') lessSum = safeRound(lessSum + p);
        else paidSum = safeRound(paidSum + p);
        running = safeRound(running + (b - p));

        let entryTime = '';
        if (txn.createdAt) {
            try {
                const dt = txn.createdAt.toDate ? txn.createdAt.toDate() : (txn.createdAt.toMillis ? new Date(txn.createdAt.toMillis()) : new Date(txn.createdAt));
                if (!isNaN(dt.getTime())) {
                    entryTime = dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
                }
            } catch (e) {
                console.error("Time parsing error in statement table:", e);
            }
        }

        let methodBadge = '<span class="text-slate-500 text-xs">-</span>';
        if (p > 0) {
            const rFrom = (txn.receivedFrom || '').trim();
            const label = rFrom ? `${type}: ${rFrom}` : type;
            if (type === 'Less') methodBadge = `<span class="bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-lg text-[10px] font-black border border-purple-500/20"><i class="fa-solid fa-tag mr-1"></i>[LESS] ${rFrom}</span>`;
            else if (type === 'Bank') {
                methodBadge = `<span class="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-lg text-[10px] font-bold border border-blue-500/20"><i class="fa-solid fa-building-columns mr-1"></i>${label}</span>`;
            } else {
                methodBadge = `<span class="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-lg text-[10px] font-bold border border-emerald-500/20"><i class="fa-solid fa-hand-holding-dollar mr-1"></i>${label}</span>`;
            }
        }

        const voucherInfo = txn.voucherNo && txn.voucherNo !== 'OPENING' ? `<span class="px-1.5 py-0.5 bg-blue-500/10 text-blue-400 rounded text-[9px] border border-blue-500/20 font-mono font-black">#${txn.voucherNo}</span>` : '';
        const notesInfo = txn.notes ? `<div class="text-[9px] text-slate-400 font-medium italic mt-0.5 truncate max-w-[200px]" title="${txn.notes}">• ${txn.notes}</div>` : '';

        html += `<tr class="hover:bg-white/[0.03] border-b border-slate-800/50">
            <td class="align-top py-2.5 px-3 whitespace-nowrap">
                <div class="text-xs font-bold text-slate-200">${formatAppDate(txn.date)}</div>
                ${entryTime ? `<div class="text-[10px] text-slate-400 font-medium mt-0.5 flex items-center gap-1.5"><i class="fa-regular fa-clock text-[9px] text-slate-500"></i><span>${entryTime}</span></div>` : ''}
            </td>
            <td class="align-top py-2.5 px-3"><div class="flex items-center flex-wrap gap-1.5">${methodBadge}${voucherInfo}</div>${notesInfo}</td>
            <td class="text-right text-red-400 font-black text-sm align-top py-2.5 px-3">${b > 0 ? '৳' + formatAmountWithComma(b) : '-'}</td>
            <td class="text-right text-emerald-400 font-black text-sm align-top py-2.5 px-3">${p > 0 ? '৳' + formatAmountWithComma(p) : '-'}</td>
            <td class="text-right font-black ${running > 0 ? 'text-red-400' : 'text-emerald-400'} bg-white/[0.01] align-top py-2.5 px-3 text-sm">৳ ${formatAmountWithComma(Math.abs(running))} ${running < 0 ? '<span class="text-[9px] font-bold text-emerald-400">(Adv)</span>' : ''}</td>
        </tr>`;

        mobileHtml += `<div class="p-3 bg-slate-900/90 border border-slate-800 rounded-xl flex flex-col gap-1.5 text-xs">
            <div class="flex justify-between items-center border-b border-slate-800/60 pb-1">
                <span class="text-slate-300 font-bold text-[11px]">${formatAppDate(txn.date)}${entryTime ? ` (${entryTime})` : ''} ${voucherInfo}</span>
                ${methodBadge}
            </div>
            <div class="flex justify-between items-center text-slate-300"><span>খরচ: <strong class="text-red-400 font-black">৳${formatAmountWithComma(b)}</strong></span><span>জমা: <strong class="text-emerald-400 font-black">৳${formatAmountWithComma(p)}</strong></span></div>
            <div class="flex justify-between items-center pt-1 border-t border-slate-800/40"><span class="text-[10px] text-slate-400 font-bold">বর্তমান ব্যালেন্স:</span><span class="font-black ${running > 0 ? 'text-red-400' : 'text-emerald-400'}">৳ ${formatAmountWithComma(Math.abs(running))}</span></div>
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
    const startEl = document.getElementById('stmt-start-date'); 
    const endEl = document.getElementById('stmt-end-date');
    if (!startEl || !endEl) return;
    const now = new Date();
    if (type === 'today') { 
        const todayStr = getTodayLocalDateString(); 
        startEl.value = todayStr; endEl.value = todayStr; 
    } else if (type === 'this_month') { 
        const y = now.getFullYear(), m = String(now.getMonth() + 1).padStart(2, '0'); 
        startEl.value = `${y}-${m}-01`; endEl.value = getTodayLocalDateString(); 
    } else if (type === 'last_month') { 
        const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1); 
        const y = prevMonth.getFullYear(), m = String(prevMonth.getMonth() + 1).padStart(2, '0'); 
        const lastDay = new Date(now.getFullYear(), now.getMonth(), 0).getDate(); 
        startEl.value = `${y}-${m}-01`; endEl.value = `${y}-${m}-${String(lastDay).padStart(2, '0')}`; 
    }
    if (callbacks.loadStatementData) callbacks.loadStatementData();
}

export async function quickCollectPaymentFromStmt(stateRef = {}, callbacks = {}) {
    const { currentCustomerInfo } = stateRef;
    const { value: formValues } = await Swal.fire({
        title: '<i class="fa-solid fa-credit-card text-blue-400 mr-2"></i>জমা গ্রহণ করুন',
        html: `
            <div class="flex flex-col gap-3 text-left font-bn p-2">
                <div class="text-xs text-blue-400 font-bold">কাস্টমার: ${currentCustomerInfo?.name || 'Customer'}</div>
                <div>
                    <label class="block text-xs font-bold text-slate-400 mb-1">জমার পরিমাণ (৳)</label>
                    <input id="stmt-recv-amt" type="text" class="m3-field text-lg font-black text-emerald-400" placeholder="০.০০" oninput="window.handleNumberInput(this); window.updateLiveWords(this, 'stmt-recv-words');">
                    <div id="stmt-recv-words" class="text-[10px] font-black text-emerald-400 mt-1 hidden italic truncate"></div>
                </div>
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
            const cachedCust = getCustomerCache().find(c => c.id === currentCustomerInfo.id);
            const prevDue = safeRound(Number(cachedCust?.totalDue || 0));
            const newDue = safeRound(prevDue - formValues.amount);
            const autoVoucherNo = 'QC-' + Date.now().toString(36).toUpperCase();
            batch.set(txnRef, {
                customerId: currentCustomerInfo.id,
                customerName: currentCustomerInfo.name,
                date: getTodayLocalDateString(),
                voucherNo: autoVoucherNo,
                bill: 0,
                paid: formValues.amount,
                receivedType: formValues.type,
                receivedFrom: formValues.ref,
                prevDue: prevDue,
                currentDue: newDue,
                createdBy: window.AppState?.currentUserEmail || 'Unknown',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            batch.update(CustomerDAO.getRef(currentCustomerInfo.id), { totalDue: firebase.firestore.FieldValue.increment(safeRound(-formValues.amount)) });
            await batch.commit();
            auditLog('CREATE', 'Ledger', txnRef.id, currentCustomerInfo.name, { bill: 0, paid: formValues.amount, receivedType: formValues.type, receivedFrom: formValues.ref, source: 'Statement Quick Collect' });
            showToast('জমা সফলভাবে সেভ হয়েছে!', 'success');
            if (callbacks.loadStatementData) callbacks.loadStatementData();
        } catch (e) {
            console.error('Quick collect payment error:', e);
            Swal.fire('Error', 'জমা সেভ করা যায়নি', 'error');
        }
    }
}
