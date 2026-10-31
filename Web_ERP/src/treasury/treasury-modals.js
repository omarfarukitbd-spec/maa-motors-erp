import { formatAmountWithComma, formatAppDate, toDBDate } from '../utils.js';

/**
 *  Modal Configuration & HTML Builders for Treasury
 */

export function getDailyCollectionModalConfig(today, collectionBreakdown = {}) {
    const total = typeof collectionBreakdown === 'object' ? Number(collectionBreakdown.total || 0) : Number(collectionBreakdown || 0);
    const cash = typeof collectionBreakdown === 'object' ? Number(collectionBreakdown.cash || 0) : total;
    const bank = typeof collectionBreakdown === 'object' ? Number(collectionBreakdown.bank || 0) : 0;

    window._currentCollectionBreakdown = { total, cash, bank };
    window._currentCollectionSelectedType = 'total';

    return {
        title: '<div class="flex items-center justify-center gap-2 text-emerald-400 text-lg font-black"><i class="fa-solid fa-hand-holding-dollar"></i><span>দৈনিক কালেকশন ফান্ড এন্ট্রি</span></div>',
        html: `
            <div class="space-y-3.5 text-left p-1">
                <div>
                    <label class="block text-xs font-bold text-slate-400 mb-1">তারিখ</label>
                    <input id="tr-col-date" type="text" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono font-bold text-sm datepicker" value="${formatAppDate(today)}" onchange="window.treasuryFetchCollectionForSelectedDate && window.treasuryFetchCollectionForSelectedDate(this.value)">
                </div>

                <!-- 3-Pill Interactive Breakdown Selector -->
                <div>
                    <div class="flex items-center justify-between mb-1.5">
                        <label class="block text-xs font-bold text-slate-400">কালেকশনের খাত নির্বাচন করুন</label>
                        <span class="text-[10px] text-emerald-400 font-bold flex items-center gap-1"><i class="fa-solid fa-bolt text-[9px]"></i><span>ইআরপি অটো-সিঙ্ক</span></span>
                    </div>
                    <div class="grid grid-cols-3 gap-1.5 p-1 bg-slate-950/80 rounded-2xl border border-slate-800">
                        <button type="button" id="tr-col-pill-total" onclick="window.treasurySelectCollectionType('total')"
                            class="tr-col-type-btn py-2 px-1 rounded-xl text-center transition-all cursor-pointer bg-emerald-600 text-white font-black shadow-md">
                            <div class="text-[10px] uppercase tracking-wider opacity-90 flex items-center justify-center gap-1">
                                <i class="fa-solid fa-coins text-[9px]"></i><span>মোট আদায়</span>
                            </div>
                            <div id="tr-pill-val-total" class="text-xs font-mono font-black mt-0.5">৳ ${formatAmountWithComma(total)}</div>
                        </button>

                        <button type="button" id="tr-col-pill-cash" onclick="window.treasurySelectCollectionType('cash')"
                            class="tr-col-type-btn py-2 px-1 rounded-xl text-center transition-all cursor-pointer bg-slate-900 text-slate-400 hover:text-white font-bold border border-slate-800">
                            <div class="text-[10px] uppercase tracking-wider opacity-90 flex items-center justify-center gap-1">
                                <i class="fa-solid fa-money-bill-wave text-[9px] text-emerald-400"></i><span>শুধু নগদ</span>
                            </div>
                            <div id="tr-pill-val-cash" class="text-xs font-mono font-black mt-0.5">৳ ${formatAmountWithComma(cash)}</div>
                        </button>

                        <button type="button" id="tr-col-pill-bank" onclick="window.treasurySelectCollectionType('bank')"
                            class="tr-col-type-btn py-2 px-1 rounded-xl text-center transition-all cursor-pointer bg-slate-900 text-slate-400 hover:text-white font-bold border border-slate-800">
                            <div class="text-[10px] uppercase tracking-wider opacity-90 flex items-center justify-center gap-1">
                                <i class="fa-solid fa-building-columns text-[9px] text-blue-400"></i><span>শুধু ব্যাংক</span>
                            </div>
                            <div id="tr-pill-val-bank" class="text-xs font-mono font-black mt-0.5">৳ ${formatAmountWithComma(bank)}</div>
                        </button>
                    </div>
                </div>

                <div>
                    <label class="block text-xs font-bold text-slate-400 mb-1">কালেকশনের মোট টাকার অংক (৳)</label>
                    <input id="tr-col-amount" type="text" class="w-full bg-slate-900 border border-emerald-500/50 rounded-xl px-4 py-3 text-emerald-400 font-mono font-black text-lg focus:border-emerald-400 outline-none" 
                        placeholder="0" value="${total > 0 ? formatAmountWithComma(total) : ''}" 
                        oninput="window.handleNumberInput(this); window.updateLiveWords(this, 'tr-col-words');">
                    <div id="tr-col-words" class="text-[11px] font-bold text-emerald-300 mt-1 italic min-h-[16px]"></div>
                    <div class="flex items-center justify-between mt-1.5 flex-wrap gap-1">
                        <div id="tr-col-info" class="text-[10px] text-slate-400 min-h-[16px]">
                            ${total > 0 
                                ? `<span class="text-emerald-400 font-bold"><i class="fa-solid fa-circle-check mr-1"></i>${formatAppDate(today)}: শোরুম নগদ ৳ ${formatAmountWithComma(cash)} + ব্যাংক ৳ ${formatAmountWithComma(bank)} = মোট ৳ ${formatAmountWithComma(total)}</span>` 
                                : `<span class="text-slate-400"><i class="fa-solid fa-circle-info text-blue-400 mr-1"></i>তারিখ পরিবর্তন করলে স্বয়ংক্রিয়ভাবে ওই দিনের মোট কালেকশন চলে আসবে।</span>`}
                        </div>
                        <button type="button" onclick="window.treasuryFetchCollectionForSelectedDate && window.treasuryFetchCollectionForSelectedDate(document.getElementById('tr-col-date')?.value)" class="text-[10px] font-bold text-blue-400 hover:text-blue-300 underline cursor-pointer flex items-center gap-1 shrink-0">
                            <i class="fa-solid fa-arrows-rotate"></i><span>সিঙ্ক করুন</span>
                        </button>
                    </div>
                </div>

                <div>
                    <label class="block text-xs font-bold text-slate-400 mb-1">মন্তব্য (ঐচ্ছিক)</label>
                    <input id="tr-col-note" type="text" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-slate-300 text-xs" 
                        value="${formatAppDate(today)} শোরুম ও ব্যাংক আদায়" 
                        placeholder="যেমন: শোরুম ও ব্যাংকিং আদায়">
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-check mr-1.5"></i> ফান্ডে যোগ করুন',
        cancelButtonText: 'বাতিল',
        customClass: { 
            popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700',
            confirmButton: '!bg-emerald-600 hover:!bg-emerald-500 !text-white !font-bold !rounded-xl !px-5 !py-2.5 shadow-lg shadow-emerald-900/30',
            cancelButton: '!bg-slate-800 hover:!bg-slate-700 !text-slate-300 !font-bold !rounded-xl !px-4 !py-2.5'
        },
        didOpen: () => {
            const dateEl = document.getElementById('tr-col-date');
            const amtEl = document.getElementById('tr-col-amount');
            if (amtEl && amtEl.value) {
                window.updateLiveWords(amtEl, 'tr-col-words');
            }

            // Define selection switcher
            window.treasurySelectCollectionType = (type) => {
                window._currentCollectionSelectedType = type;
                const breakdown = window._currentCollectionBreakdown || { total: 0, cash: 0, bank: 0 };
                const aEl = document.getElementById('tr-col-amount');
                const nEl = document.getElementById('tr-col-note');
                const dEl = document.getElementById('tr-col-date');
                const iEl = document.getElementById('tr-col-info');
                const curDateStr = dEl?.value || formatAppDate(today);

                let targetAmt = 0;
                let defaultNote = '';
                let infoText = '';

                if (type === 'total') {
                    targetAmt = breakdown.total;
                    defaultNote = `${curDateStr} শোরুম ও ব্যাংক আদায়`;
                    infoText = `<span class="text-emerald-400 font-bold"><i class="fa-solid fa-circle-check mr-1"></i>${curDateStr}: শোরুম নগদ ৳ ${formatAmountWithComma(breakdown.cash)} + ব্যাংক ৳ ${formatAmountWithComma(breakdown.bank)} = সর্বমোট ৳ ${formatAmountWithComma(breakdown.total)}</span>`;
                } else if (type === 'cash') {
                    targetAmt = breakdown.cash;
                    defaultNote = `${curDateStr} শোরুম নগদ আদায়`;
                    infoText = `<span class="text-emerald-400 font-bold"><i class="fa-solid fa-circle-check mr-1"></i>${curDateStr}: শোরুম নগদ আদায় ৳ ${formatAmountWithComma(breakdown.cash)}</span>`;
                } else if (type === 'bank') {
                    targetAmt = breakdown.bank;
                    defaultNote = `${curDateStr} কাস্টমার ব্যাংক জমা আদায়`;
                    infoText = `<span class="text-blue-400 font-bold"><i class="fa-solid fa-circle-check mr-1"></i>${curDateStr}: কাস্টমারদের ব্যাংক জমা আদায় ৳ ${formatAmountWithComma(breakdown.bank)}</span>`;
                }

                if (aEl) {
                    aEl.value = targetAmt > 0 ? formatAmountWithComma(targetAmt) : '0';
                    window.updateLiveWords(aEl, 'tr-col-words');
                }
                if (nEl && (!nEl.value || nEl.value.includes('আদায়'))) {
                    nEl.value = defaultNote;
                }
                if (iEl && infoText) {
                    iEl.innerHTML = infoText;
                }

                // Update Button Active States
                ['total', 'cash', 'bank'].forEach(tKey => {
                    const btn = document.getElementById(`tr-col-pill-${tKey}`);
                    if (btn) {
                        if (tKey === type) {
                            btn.className = 'tr-col-type-btn py-2 px-1 rounded-xl text-center transition-all cursor-pointer bg-emerald-600 text-white font-black shadow-md';
                        } else {
                            btn.className = 'tr-col-type-btn py-2 px-1 rounded-xl text-center transition-all cursor-pointer bg-slate-900 text-slate-400 hover:text-white font-bold border border-slate-800';
                        }
                    }
                });
            };

            if (dateEl && dateEl._flatpickr) {
                dateEl._flatpickr.config.onChange.push((selectedDates, dateStr) => {
                    if (window.treasuryFetchCollectionForSelectedDate) {
                        window.treasuryFetchCollectionForSelectedDate(dateStr);
                    }
                });
            }
        },
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
                    <input id="tr-exp-amount" type="text" class="w-full bg-slate-900 border border-red-500/50 rounded-xl px-4 py-3 text-red-400 font-mono font-bold text-lg focus:border-red-400 outline-none" 
                        placeholder="0" 
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
        customClass: { 
            popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700',
            confirmButton: '!bg-red-600 hover:!bg-red-500 !text-white !font-bold !rounded-xl !px-5 !py-2.5 shadow-lg shadow-red-900/30',
            cancelButton: '!bg-slate-800 hover:!bg-slate-700 !text-slate-300 !font-bold !rounded-xl !px-4 !py-2.5'
        },
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
        customClass: { 
            popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700',
            confirmButton: '!bg-indigo-600 hover:!bg-indigo-500 !text-white !font-bold !rounded-xl !px-5 !py-2.5 shadow-lg shadow-indigo-900/30',
            cancelButton: '!bg-slate-800 hover:!bg-slate-700 !text-slate-300 !font-bold !rounded-xl !px-4 !py-2.5'
        },
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
                    <input id="tr-op-amount" type="text" class="w-full bg-slate-900 border border-amber-500/50 rounded-xl px-4 py-3 text-amber-300 font-mono font-bold text-lg focus:border-amber-400 outline-none" 
                        placeholder="0" value="${formatAmountWithComma(currentFund.openingBalance)}" 
                        oninput="window.handleNumberInput(this); window.updateLiveWords(this, 'tr-op-words');">
                    <div id="tr-op-words" class="text-[11px] font-bold text-amber-300 mt-1 italic min-h-[16px]"></div>
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'সংরক্ষণ করুন',
        cancelButtonText: 'বাতিল',
        customClass: { 
            popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700',
            confirmButton: '!bg-amber-500 hover:!bg-amber-400 !text-slate-950 !font-black !rounded-xl !px-5 !py-2.5 shadow-lg shadow-amber-900/30',
            cancelButton: '!bg-slate-800 hover:!bg-slate-700 !text-slate-300 !font-bold !rounded-xl !px-4 !py-2.5'
        },
        preConfirm: () => {
            const dateEl = document.getElementById('tr-op-date');
            const amtEl = document.getElementById('tr-op-amount');
            const amt = parseFloat((amtEl?.value || '0').replace(/,/g, ''));
            return {
                openingDate: toDBDate(dateEl?.value || '2026-08-31'),
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
