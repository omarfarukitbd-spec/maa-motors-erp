import Swal from 'sweetalert2';
import { BankTransactionDAO } from '../dao.js';
import { parseAmount, showToast, toDBDate, getTodayLocalDateString } from '../utils.js';
import { auditLog } from '../audit.js';
import { firebase } from '../firebase-config.js';

export async function openTransactionModal(type, activeAccounts, refreshCallback) {
    const title = type === 'DEPOSIT' ? 'ম্যানুয়াল জমা (Deposit)' : type === 'WITHDRAWAL' ? 'টাকা উত্তোলন (Withdrawal)' : 'এক ব্যাংক থেকে অন্য ব্যাংকে ট্রান্সফার';
    const btnText = type === 'DEPOSIT' ? 'জমা করুন' : type === 'WITHDRAWAL' ? 'উত্তোলন করুন' : 'ট্রান্সফার করুন';
    const btnColor = type === 'DEPOSIT' ? '#10b981' : type === 'WITHDRAWAL' ? '#ef4444' : '#3b82f6';
    
    let accountOptions = '<option value="">-- নির্বাচন করুন --</option>';
    (activeAccounts || []).forEach(a => {
        accountOptions += `<option value="${a.name}">${a.name} (${a.isCash ? 'Cash' : 'Bank'})</option>`;
    });

    let html = `
        <div class="text-left font-bn space-y-3.5">
            <div>
                <label class="block text-xs font-bold text-slate-300 mb-1">${type === 'TRANSFER' ? 'কোথা থেকে (From Account)' : 'অ্যাকাউন্ট নির্বাচন করুন'}</label>
                <select id="banking-txn-acc" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold text-xs outline-none focus:border-purple-500 cursor-pointer">${accountOptions}</select>
            </div>
    `;

    if (type === 'TRANSFER') {
        html += `
            <div>
                <label class="block text-xs font-bold text-slate-300 mb-1">কোথায় যাবে (To Target Account)</label>
                <select id="banking-txn-target-acc" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold text-xs outline-none focus:border-purple-500 cursor-pointer">${accountOptions}</select>
            </div>
        `;
    }

    html += `
            <div>
                <label class="block text-xs font-bold text-slate-300 mb-1">পরিমাণ (Amount ৳)</label>
                <input type="text" id="banking-txn-amount" oninput="window.handleNumberInput(this); window.updateLiveWords(this, 'banking-txn-amount-words');" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-black text-lg outline-none font-mono focus:border-purple-500" placeholder="0.00">
                <div id="banking-txn-amount-words" class="text-[11px] text-blue-400 font-bold hidden italic mt-1"></div>
            </div>
            <div>
                <label class="block text-xs font-bold text-slate-300 mb-1">বিবরণ / নোট</label>
                <input type="text" id="banking-txn-note" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-purple-500" placeholder="যেমন: চেকের মাধ্যমে উত্তোলন / বস দিয়েছেন...">
            </div>
            <div>
                <label class="block text-xs font-bold text-slate-300 mb-1">তারিখ</label>
                <input type="text" id="banking-txn-date" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-mono outline-none datepicker cursor-pointer" value="${getTodayLocalDateString()}">
            </div>
        </div>
    `;

    const { value: formValues } = await Swal.fire({
        title: `<span class="font-bn font-black text-white text-lg">${title}</span>`,
        html: html,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: btnText,
        cancelButtonText: 'বাতিল',
        confirmButtonColor: btnColor,
        customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' },
        preConfirm: () => {
            const bankName = document.getElementById('banking-txn-acc').value;
            const targetBankName = type === 'TRANSFER' ? document.getElementById('banking-txn-target-acc').value : null;
            const rawAmount = document.getElementById('banking-txn-amount').value;
            const amount = parseAmount(rawAmount);
            const note = document.getElementById('banking-txn-note').value.trim();
            const date = toDBDate(document.getElementById('banking-txn-date').value);

            if (!bankName) return Swal.showValidationMessage('অনুগ্রহ করে একটি অ্যাকাউন্ট নির্বাচন করুন!');
            if (type === 'TRANSFER' && !targetBankName) return Swal.showValidationMessage('অনুগ্রহ করে টার্গেট অ্যাকাউন্ট নির্বাচন করুন!');
            if (type === 'TRANSFER' && bankName === targetBankName) return Swal.showValidationMessage('একই অ্যাকাউন্টে ট্রান্সফার সম্ভব নয়!');
            if (!amount || isNaN(amount) || amount <= 0) return Swal.showValidationMessage('সঠিক টাকার পরিমাণ লিখুন!');
            if (!date) return Swal.showValidationMessage('তারিখ নির্বাচন করুন!');

            return { bankName, targetBankName, amount, note, date };
        }
    });

    if (formValues) {
        Swal.fire({ title: 'সংরক্ষণ করা হচ্ছে...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        try {
            const txnData = {
                type: type,
                bankName: formValues.bankName,
                amount: formValues.amount,
                note: formValues.note,
                date: formValues.date,
                createdBy: firebase.auth().currentUser?.email || 'Admin',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            if (type === 'TRANSFER') {
                txnData.targetBankName = formValues.targetBankName;
            }

            await BankTransactionDAO.add(txnData);
            auditLog('BANKING_TXN_CREATE', 'Admin', 'BankingLedger', `Created ${type} of ৳${formValues.amount} on ${formValues.bankName}`);
            
            Swal.close();
            showToast('সফলভাবে সম্পন্ন হয়েছে!', 'success');
            if (typeof refreshCallback === 'function') await refreshCallback();
        } catch (e) {
            console.error(e);
            Swal.fire('ত্রুটি', 'ডাটাবেজে সেভ করতে সমস্যা হয়েছে!', 'error');
        }
    }
}
