import { formatAmountWithComma, formatAppDate, toDBDate } from '../utils.js';

/**
 *  Modal Configuration & HTML Builders for Treasury
 */

export function getDailyCollectionModalConfig(today, suggestedAmount) {
    return {
        title: '<div class="flex items-center justify-center gap-2 text-emerald-400 text-lg font-black"><i class="fa-solid fa-hand-holding-dollar"></i><span>দৈনিক কালেকশন ফান্ড এন্ট্রি</span></div>',
        html: `
            <div class="space-y-4 text-left p-1">
                <div>
                    <label class="block text-xs font-bold text-slate-400 mb-1">তারিখ</label>
                    <input id="tr-col-date" type="text" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono font-bold text-sm datepicker" value="${formatAppDate(today)}">
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-400 mb-1">কালেকশনের মোট টাকার অংক (৳)</label>
                    <input id="tr-col-amount" type="text" class="w-full bg-slate-900 border border-emerald-500/50 rounded-xl px-4 py-3 text-emerald-400 font-mono font-black text-lg focus:border-emerald-400 outline-none" 
                        placeholder="0" value="${suggestedAmount > 0 ? formatAmountWithComma(suggestedAmount) : ''}" 
                        oninput="window.handleNumberInput(this); window.updateLiveWords(this, 'tr-col-words');">
                    <div id="tr-col-words" class="text-[11px] font-bold text-emerald-300 mt-1 italic min-h-[16px]"></div>
                    ${suggestedAmount > 0 ? `<p class="text-[10px] text-slate-400 mt-1"><i class="fa-solid fa-circle-info text-blue-400 mr-1"></i>আজকের ইআরপি আদায় থেকে ৳ ${formatAmountWithComma(suggestedAmount)} অটো-সাজেস্ট করা হয়েছে।</p>` : ''}
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-400 mb-1">মন্তব্য (ঐচ্ছিক)</label>
                    <input id="tr-col-note" type="text" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-slate-300 text-xs" placeholder="যেমন: শোরুম ও ব্যাংকিং আদায়">
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-check mr-1.5"></i> ফান্ডে যোগ করুন',
        cancelButtonText: 'বাতিল',
        customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' },
        preConfirm: () => {
            const dateEl = document.getElementById('tr-col-date');
            const amtEl = document.getElementById('tr-col-amount');
            const noteEl = document.getElementById('tr-col-note');
            const amt = parseFloat((amtEl?.value || '0').replace(/,/g, ''));
            if (!amt || amt <= 0) {
                Swal.showValidationMessage('টাকার সঠিক অংক লিখুন!');
                return false;
            }
            return {
                date: toDBDate(dateEl?.value || today),
                amount: amt,
                note: (noteEl?.value || '').trim()
            };
        }
    };
}

export function getDailyExpenseModalConfig(today) {
    return {
        title: '<div class="flex items-center justify-center gap-2 text-red-400 text-lg font-black"><i class="fa-solid fa-wallet"></i><span>অফলাইন খাতার দৈনিক মোট খরচ</span></div>',
        html: `
            <div class="space-y-4 text-left p-1">
                <p class="text-xs text-slate-400">অফলাইন খাতার সারাদিনের খরচের মোট সংখ্যাটি এখানে লিখুন:</p>
                <div>
                    <label class="block text-xs font-bold text-slate-400 mb-1">তারিখ</label>
                    <input id="tr-exp-date" type="text" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono font-bold text-sm datepicker" value="${formatAppDate(today)}">
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-400 mb-1">দিনের মোট খরচ (৳)</label>
                    <input id="tr-exp-amount" type="text" class="w-full bg-slate-900 border border-red-500/50 rounded-xl px-4 py-3 text-red-400 font-mono font-black text-lg focus:border-red-400 outline-none" 
                        placeholder="যেমন: ১৬,৭৮১" 
                        oninput="window.handleNumberInput(this); window.updateLiveWords(this, 'tr-exp-words');">
                    <div id="tr-exp-words" class="text-[11px] font-bold text-red-300 mt-1 italic min-h-[16px]"></div>
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-400 mb-1">মন্তব্য (ঐচ্ছিক)</label>
                    <input id="tr-exp-note" type="text" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-slate-300 text-xs" placeholder="যেমন: অফলাইন খাতার যোগফল">
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-check mr-1.5"></i> ফান্ড থেকে মাইনাস করুন',
        cancelButtonText: 'বাতিল',
        customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' },
        preConfirm: () => {
            const dateEl = document.getElementById('tr-exp-date');
            const amtEl = document.getElementById('tr-exp-amount');
            const noteEl = document.getElementById('tr-exp-note');
            const amt = parseFloat((amtEl?.value || '0').replace(/,/g, ''));
            if (!amt || amt <= 0) {
                Swal.showValidationMessage('খরচের সঠিক অংক লিখুন!');
                return false;
            }
            return {
                date: toDBDate(dateEl?.value || today),
                amount: amt,
                note: (noteEl?.value || '').trim()
            };
        }
    };
}

export function getSpecialTransactionModalConfig(today, isEdit, editItem) {
    return {
        title: `<div class="flex items-center justify-center gap-2 text-indigo-400 text-lg font-black"><i class="fa-solid fa-file-signature"></i><span>${isEdit ? 'লেনদেন সংশোধন' : 'বিশেষ তহবিল লেনদেন এন্ট্রি'}</span></div>`,
        html: `
            <div class="space-y-3.5 text-left p-1">
                <div>
                    <label class="block text-xs font-bold text-slate-400 mb-1">লেনদেনের ধরন</label>
                    <div class="grid grid-cols-2 gap-2">
                        <label class="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-red-500/40 bg-red-950/20 text-red-400 font-black cursor-pointer text-xs">
                            <input type="radio" name="tr-type" value="outflow" ${(!isEdit || editItem.type === 'outflow') ? 'checked' : ''}>
                            <span>(-) খরচ / পেমেন্ট</span>
                        </label>
                        <label class="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-emerald-500/40 bg-emerald-950/20 text-emerald-400 font-black cursor-pointer text-xs">
                            <input type="radio" name="tr-type" value="inflow" ${(isEdit && editItem.type === 'inflow') ? 'checked' : ''}>
                            <span>(+) প্রাপ্তি / মূলধন</span>
                        </label>
                    </div>
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-400 mb-1">তারিখ</label>
                    <input id="tr-spec-date" type="text" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono font-bold text-sm datepicker" value="${formatAppDate(isEdit ? editItem.date : today)}">
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-400 mb-1">বিবরণ / ব্যক্তির নাম</label>
                    <input id="tr-spec-title" type="text" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-bold text-sm" placeholder="যেমন: নয়ন নাহার মোটর / মিনহাজ মারফত" value="${escapeHtml(isEdit ? editItem.title : '')}">
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-400 mb-1">টাকার অংক (৳)</label>
                    <input id="tr-spec-amount" type="text" class="w-full bg-slate-900 border border-indigo-500/50 rounded-xl px-4 py-3 text-white font-mono font-black text-lg focus:border-indigo-400 outline-none" 
                        placeholder="0" value="${isEdit ? formatAmountWithComma(editItem.amount) : ''}" 
                        oninput="window.handleNumberInput(this); window.updateLiveWords(this, 'tr-spec-words');">
                    <div id="tr-spec-words" class="text-[11px] font-bold text-indigo-300 mt-1 italic min-h-[16px]"></div>
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-400 mb-1">মন্তব্য / বিবরণ নোট (ঐচ্ছিক)</label>
                    <input id="tr-spec-note" type="text" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-slate-300 text-xs" placeholder="যেমন: ইঞ্জিন ক্রয় ১৫ পিছ" value="${escapeHtml(isEdit ? editItem.note : '')}">
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: isEdit ? 'পরিবর্তন সেভ করুন' : 'ফান্ডে রেকর্ড করুন',
        cancelButtonText: 'বাতিল',
        customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' },
        preConfirm: () => {
            const typeEl = document.querySelector('input[name="tr-type"]:checked');
            const dateEl = document.getElementById('tr-spec-date');
            const titleEl = document.getElementById('tr-spec-title');
            const amtEl = document.getElementById('tr-spec-amount');
            const noteEl = document.getElementById('tr-spec-note');
            const amt = parseFloat((amtEl?.value || '0').replace(/,/g, ''));

            if (!titleEl?.value || !titleEl.value.trim()) {
                Swal.showValidationMessage('বিবরণ বা ব্যক্তির নাম লিখুন!');
                return false;
            }
            if (!amt || amt <= 0) {
                Swal.showValidationMessage('টাকার সঠিক অংক লিখুন!');
                return false;
            }
            return {
                type: typeEl?.value || 'outflow',
                date: toDBDate(dateEl?.value || today),
                title: titleEl.value.trim(),
                amount: amt,
                note: (noteEl?.value || '').trim()
            };
        }
    };
}

export function getOpeningFundModalConfig(currentFund) {
    return {
        title: '<div class="text-amber-400 font-black text-lg"><i class="fa-solid fa-vault mr-2"></i>প্রারম্ভিক তহবিল (B/F) সেটআপ</div>',
        html: `
            <div class="space-y-4 text-left p-1">
                <p class="text-xs text-slate-400">খাতার শুরুর প্রারম্ভিক তহবিল স্থিতি (Brought Forward) এখানে লিখুন:</p>
                <div>
                    <label class="block text-xs font-bold text-slate-400 mb-1">তারিখ</label>
                    <input id="tr-op-date" type="text" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono font-bold text-sm datepicker" value="${formatAppDate(currentFund.openingDate)}">
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-400 mb-1">প্রারম্ভিক তহবিল অংক (৳)</label>
                    <input id="tr-op-amount" type="text" class="w-full bg-slate-900 border border-amber-500/50 rounded-xl px-4 py-3 text-amber-300 font-mono font-black text-lg focus:border-amber-400 outline-none" 
                        placeholder="যেমন: ৪,৬৭,০৯,২৭৫" value="${formatAmountWithComma(currentFund.openingBalance)}" 
                        oninput="window.handleNumberInput(this); window.updateLiveWords(this, 'tr-op-words');">
                    <div id="tr-op-words" class="text-[11px] font-bold text-amber-300 mt-1 italic min-h-[16px]"></div>
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'সংরক্ষণ করুন',
        cancelButtonText: 'বাতিল',
        customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' },
        preConfirm: () => {
            const dateEl = document.getElementById('tr-op-date');
            const amtEl = document.getElementById('tr-op-amount');
            const amt = parseFloat((amtEl?.value || '0').replace(/,/g, ''));
            return {
                openingDate: toDBDate(dateEl?.value || '2026-08-29'),
                openingBalance: amt
            };
        }
    };
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
