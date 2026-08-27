import { escapeHTML, formatAmountWithComma, formatAppDate } from '../utils.js';
import { navigate } from '../navigation/router.js';

/**
 * Render Full Detailed Memo Card UI
 */
export function renderMemoCardHTML(txn) {
    if (!txn) return '';

    const bill = Number(txn.bill) || 0;
    const paid = Number(txn.paid) || 0;
    const prevDue = Number(txn.computedPrevDue) || 0;
    const currentDue = Number(txn.computedCurrentDue) || 0;
    const cleanCustName = String(txn.customerName || 'গ্রাহক').replace(/^\[.*?\]\s*/, '').trim();

    // Status Badge Logic
    let statusBadge = '';
    if (bill > 0 && paid >= bill) {
        statusBadge = '<span class="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><i class="fa-solid fa-circle-check mr-1"></i>পরিশোধিত (PAID)</span>';
    } else if (bill > 0 && paid < bill) {
        statusBadge = '<span class="px-2.5 py-1 rounded-full text-xs font-black bg-red-500/10 text-red-400 border border-red-500/20"><i class="fa-solid fa-circle-exclamation mr-1"></i>বকেয়া (DUE)</span>';
    } else if (paid > 0) {
        statusBadge = '<span class="px-2.5 py-1 rounded-full text-xs font-black bg-purple-500/10 text-purple-400 border border-purple-500/20"><i class="fa-solid fa-receipt mr-1"></i>জমা রিসিট (COLLECTION)</span>';
    } else {
        statusBadge = '<span class="px-2.5 py-1 rounded-full text-xs font-black bg-blue-500/10 text-blue-400 border border-blue-500/20"><i class="fa-solid fa-info-circle mr-1"></i>এন্ট্রি</span>';
    }

    // Payment Method
    let paymentMethodHtml = '';
    if (paid > 0 && txn.receivedType) {
        paymentMethodHtml = `<span class="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 ml-1.5">${escapeHTML(txn.receivedType)}${txn.receivedFrom ? ' • ' + escapeHTML(txn.receivedFrom) : ''}</span>`;
    }

    // Item Table
    let itemsTableHtml = '';
    if (txn.hasItems && txn.items && txn.items.length > 0) {
        itemsTableHtml = `
            <div class="overflow-x-auto custom-scrollbar border border-slate-700/60 rounded-2xl mb-4">
                <table class="w-full text-left text-xs border-collapse">
                    <thead>
                        <tr class="bg-slate-800/80 text-slate-300 border-b border-slate-700/60 font-black">
                            <th class="py-2.5 px-3 text-center w-12">#</th>
                            <th class="py-2.5 px-3">পণ্যের বিবরণ / আইটেম</th>
                            <th class="py-2.5 px-3 text-center">পরিমাণ</th>
                            <th class="py-2.5 px-3 text-right">একক দর</th>
                            <th class="py-2.5 px-3 text-right">মোট টাকা</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-800/60">
                        ${txn.items.map((it, idx) => `
                            <tr class="hover:bg-slate-800/30 transition-colors">
                                <td class="py-2 px-3 text-center font-mono text-slate-500">${String(idx + 1).padStart(2, '0')}</td>
                                <td class="py-2 px-3 font-bold text-slate-200">${escapeHTML(it.desc || '-')}</td>
                                <td class="py-2 px-3 text-center font-mono text-slate-300">${it.qty || 1} ${it.unit || 'Pcs'}</td>
                                <td class="py-2 px-3 text-right font-mono text-slate-300">৳${formatAmountWithComma(it.rate || 0)}</td>
                                <td class="py-2 px-3 text-right font-mono font-black text-white">৳${formatAmountWithComma(it.total || 0)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    return `
        <div class="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-xl animate-fade-in font-bn">
            <!-- Header Bar -->
            <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-4">
                <div class="flex items-center gap-3">
                    <div class="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 text-xl font-black shadow-inner">
                        <i class="fa-solid fa-file-invoice"></i>
                    </div>
                    <div>
                        <div class="flex items-center gap-2">
                            <span class="text-xl font-black text-white tracking-tight">মেমো #${escapeHTML(txn.voucherNo || txn.id.slice(-6).toUpperCase())}</span>
                            ${statusBadge}
                        </div>
                        <div class="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                            <span><i class="fa-regular fa-calendar text-blue-400 mr-1"></i>${formatAppDate(txn.date)}</span>
                            <span>•</span>
                            <span><i class="fa-solid fa-user-pen text-slate-500 mr-1"></i>${escapeHTML(txn.createdBy || 'System')}</span>
                        </div>
                    </div>
                </div>

                <!-- Action Buttons Hub -->
                <div class="flex flex-wrap items-center gap-2">
                    <button onclick="window.printReceiptEngine('${txn.id}', 'a4')" class="h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20 active:scale-95 cursor-pointer" title="A4 সাইজ ইনভয়েস প্রিন্ট">
                        <i class="fa-solid fa-print"></i><span>A4 প্রিন্ট / PDF</span>
                    </button>
                    <button onclick="window.printReceiptEngine('${txn.id}', 'pos')" class="h-9 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-2 border border-slate-700 transition-all active:scale-95 cursor-pointer" title="৮০মিমি POS থার্মাল প্রিন্ট">
                        <i class="fa-solid fa-receipt"></i><span>POS মেমো</span>
                    </button>
                    <button onclick="window.shareMemoOnWhatsApp('${txn.id}')" class="h-9 px-3.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white font-bold text-xs flex items-center gap-2 border border-emerald-500/30 transition-all active:scale-95 cursor-pointer" title="কাস্টমারকে WhatsApp মেসেজ পাঠান">
                        <i class="fa-brands fa-whatsapp text-sm"></i><span>WhatsApp</span>
                    </button>
                    <button onclick="window.viewCustomerLedgerDirectly('${txn.customerId}', '${escapeHTML(cleanCustName)}', '${escapeHTML(txn.customerAccountNo || '')}')" class="h-9 px-3.5 rounded-xl bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white font-bold text-xs flex items-center gap-2 border border-purple-500/30 transition-all active:scale-95 cursor-pointer" title="কাস্টমারের সম্পূর্ণ খতিয়ান দেখুন">
                        <i class="fa-solid fa-book"></i><span>লেজার দেখুন</span>
                    </button>
                </div>
            </div>

            <!-- Customer Profile Card -->
            <div class="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 mb-4">
                <div class="text-[10px] font-black uppercase text-blue-400 tracking-wider mb-2 flex items-center gap-1.5">
                    <i class="fa-solid fa-id-card"></i> <span>কাস্টমার প্রোফাইল</span>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div>
                        <div class="text-slate-500 font-bold">নাম:</div>
                        <div class="text-sm font-black text-white truncate">${escapeHTML(cleanCustName)}</div>
                    </div>
                    <div>
                        <div class="text-slate-500 font-bold">অ্যাকাউন্ট নং:</div>
                        <div class="text-sm font-mono font-bold text-blue-400">${escapeHTML(txn.customerAccountNo || '-')}</div>
                    </div>
                    <div>
                        <div class="text-slate-500 font-bold">মোবাইল:</div>
                        <div class="flex items-center gap-2 text-sm font-bold text-slate-200">
                            <span>${escapeHTML(txn.customerPhone || 'মোবাইল নেই')}</span>
                            ${txn.customerPhone ? `
                                <a href="tel:${txn.customerPhone}" class="text-emerald-400 hover:text-emerald-300" title="সরাসরি কল দিন"><i class="fa-solid fa-phone text-xs"></i></a>
                                <a href="https://wa.me/88${txn.customerPhone.replace(/[^0-9]/g,'')}" target="_blank" class="text-emerald-400 hover:text-emerald-300" title="WhatsApp চ্যাট"><i class="fa-brands fa-whatsapp text-sm"></i></a>
                            ` : ''}
                        </div>
                    </div>
                    <div>
                        <div class="text-slate-500 font-bold">জোন / এলাকা:</div>
                        <div class="text-sm font-bold text-slate-300 truncate">${escapeHTML(txn.customerZone || txn.customerAddress || '-')}</div>
                    </div>
                </div>
            </div>

            <!-- Items Table Section -->
            ${itemsTableHtml}

            <!-- Financial Calculation Equation -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <!-- Left: Notes & Remarks -->
                <div class="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-4 h-full">
                    <div class="text-[11px] font-black text-amber-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <i class="fa-solid fa-note-sticky"></i> <span>নোট / রিমার্কস</span>
                    </div>
                    <p class="text-xs text-slate-300 leading-relaxed font-medium">
                        ${txn.notes ? escapeHTML(txn.notes).replace(/\n/g, '<br/>') : 'কোনো বিশেষ নোট নেই।'}
                    </p>
                </div>

                <!-- Right: Accounting Equation -->
                <div class="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-2 text-xs">
                    <div class="text-[11px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-1 mb-2">
                        হিসাবের বিবরণী (Accounting Summary)
                    </div>
                    ${txn.subtotal && txn.discount > 0 ? `
                        <div class="flex justify-between text-slate-400">
                            <span>সাবটোটাল (Subtotal):</span>
                            <span class="font-mono font-bold">৳${formatAmountWithComma(txn.subtotal)}</span>
                        </div>
                        <div class="flex justify-between text-amber-400">
                            <span>ডিসকাউন্ট / ছাড় (-):</span>
                            <span class="font-mono font-bold">- ৳${formatAmountWithComma(txn.discount)}</span>
                        </div>
                    ` : ''}
                    <div class="flex justify-between text-slate-300">
                        <span>পূর্বের বকেয়া:</span>
                        <span class="font-mono font-bold">৳${formatAmountWithComma(prevDue)}</span>
                    </div>
                    <div class="flex justify-between text-red-400 font-bold">
                        <span>আজকের বিল:</span>
                        <span class="font-mono font-black">৳${formatAmountWithComma(bill)}</span>
                    </div>
                    <div class="flex justify-between text-emerald-400 font-bold items-center">
                        <span>আজকের জমা:${paymentMethodHtml}</span>
                        <span class="font-mono font-black">- ৳${formatAmountWithComma(paid)}</span>
                    </div>
                    <div class="pt-2 border-t border-slate-800 flex justify-between items-center text-sm font-black ${currentDue > 0 ? 'text-red-400' : 'text-emerald-400'}">
                        <span>বর্তমান মোট বকেয়া:</span>
                        <span class="font-mono text-base bg-slate-900 px-3 py-1 rounded-xl border border-slate-800">
                            ৳${formatAmountWithComma(Math.abs(currentDue))} ${currentDue < 0 ? '(অ্যাডভান্স)' : ''}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Global WhatsApp Share Helper
window.shareMemoOnWhatsApp = async function(txnId) {
    try {
        const { TransactionDAO, SettingsDAO } = await import('../dao.js');
        const txn = await TransactionDAO.getById(txnId);
        if (!txn) return;
        const phone = txn.customerPhone || '';
        const name = txn.customerName || 'কাস্টমার';
        const formattedDate = formatAppDate(txn.date);
        const bill = Number(txn.bill) || 0;
        const paid = Number(txn.paid) || 0;
        const currentDue = Number(txn.currentDue) || 0;
        const dueText = currentDue < 0 ? `অ্যাডভান্স জমা: ৳ ${formatAmountWithComma(Math.abs(currentDue))}` : `বর্তমান মোট বকেয়া: ৳ ${formatAmountWithComma(currentDue)}`;
        const directMemoLink = `${window.location.origin}${window.location.pathname}?view=public-memo&id=${txnId}`;
        const memoStr = txn.voucherNo ? `মেমো #${txn.voucherNo}\n` : '';
        const msg = `আসসালামু আলাইকুম ${name},\nমেসার্স মা মোটরস্ থেকে আপনার মেমো তথ্য:\n\n${memoStr}তারিখ: ${formattedDate}\nআজকের বিল: ৳ ${formatAmountWithComma(bill)}\nআজকের জমা: ৳ ${formatAmountWithComma(paid)}\n---------------------------------\n${dueText}\n\nআপনার ডিজিটাল মেমোর PDF দেখতে নিচের লিংকে ক্লিক করুন:\n${directMemoLink}\n\nধন্যবাদ! — মেসার্স মা মোটরস্`;
        
        if (window.sendWhatsApp) {
            window.sendWhatsApp(phone, msg);
        } else {
            const cleanPhone = phone.replace(/[^0-9]/g, '');
            const targetPhone = cleanPhone.startsWith('88') ? cleanPhone : '88' + cleanPhone;
            window.open(`https://api.whatsapp.com/send?phone=${targetPhone}&text=${encodeURIComponent(msg)}`, '_blank');
        }
    } catch (e) {
        console.error("WhatsApp share error:", e);
    }
};

// Global View Customer Ledger Direct Helper
window.viewCustomerLedgerDirectly = function(customerId, customerName, accountNo) {
    if (customerId) {
        navigate('statement', { customerId, customerName, accountNo });
    }
};
