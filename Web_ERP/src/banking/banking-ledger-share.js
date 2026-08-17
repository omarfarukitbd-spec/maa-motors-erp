import Swal from 'sweetalert2';
import { formatAmountWithComma, formatAppDate, getTodayLocalDateString, showToast } from '../utils.js';

/**
 * Generate formatted Bengali text for WhatsApp Bank Statement
 */
export function generateBankStatementWhatsAppText(accountName, isCash, fromDate, toDate, ledgerData) {
    if (!ledgerData) return '';

    let totalInflow = 0;
    let totalOutflow = 0;

    (ledgerData.transactions || []).forEach(t => {
        if (t.isCredit) totalInflow += Number(t.amount || 0);
        if (t.isDebit) totalOutflow += Number(t.amount || 0);
    });

    const netFlow = totalInflow - totalOutflow;
    const fromStr = fromDate ? formatAppDate(fromDate) : 'শুরু';
    const toStr = toDate ? formatAppDate(toDate) : formatAppDate(getTodayLocalDateString());
    const todayStr = formatAppDate(getTodayLocalDateString());

    return `*মেসার্স মা মোটরস্*
*ব্যাংক ও ক্যাশ হিসাব বিবরণী (Bank Statement)*
────────────────────────
*অ্যাকাউন্ট:* ${accountName} (${isCash ? 'ক্যাশ' : 'ব্যাংক'})
*সময়কাল:* ${fromStr} থেকে ${toStr}

* প্রারম্ভিক ব্যালেন্স: ৳ ${formatAmountWithComma(ledgerData.openingBalance || 0)}
[+] মোট জমা (Inflow): ৳ ${formatAmountWithComma(totalInflow)}
[-] মোট খরচ ও উত্তোলন: ৳ ${formatAmountWithComma(totalOutflow)}
────────────────────────
*বর্তমান সমাপনী ব্যালেন্স: ৳ ${formatAmountWithComma(ledgerData.closingBalance || 0)}*
নিট ক্যাশ ফ্লো: ${netFlow >= 0 ? '+' : '-'} ৳ ${formatAmountWithComma(Math.abs(netFlow))}

মোট লেনদেন: ${(ledgerData.transactions || []).length} টি
তৈরির তারিখ: ${todayStr}
────────────────────────
_মা মোটরস্ ইআরপি সিস্টেম থেকে প্রস্তুতকৃত_`;
}

/**
 * Open interactive SweetAlert modal to share statement via WhatsApp or Copy
 */
export async function openWhatsAppShareModal(accountName, isCash, currentLedgerData) {
    if (!currentLedgerData) {
        Swal.fire({
            title: 'ডাটা লোড হয়নি',
            text: 'অনুগ্রহ করে আগে লেজার লোড করুন',
            icon: 'warning',
            customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' }
        });
        return;
    }

    const fromDate = document.getElementById('bl-from-date')?.value || '';
    const toDate = document.getElementById('bl-to-date')?.value || '';
    const statementText = generateBankStatementWhatsAppText(accountName, isCash, fromDate, toDate, currentLedgerData);

    const { value: phone } = await Swal.fire({
        title: `<div class="flex items-center justify-center gap-2 text-emerald-400 font-bn text-lg font-black">
            <i class="fa-brands fa-whatsapp text-2xl"></i>
            <span>WhatsApp স্টেটমেন্ট শেয়ার</span>
        </div>`,
        html: `
            <div class="font-bn text-left space-y-3">
                <p class="text-xs text-slate-300">যাঁর নম্বরে স্টেটমেন্ট পাঠাতে চান তার হোয়াটসঅ্যাপ নম্বরটি লিখুন (অথবা খালি রেখে সরাসরি হোয়াটসঅ্যাপে চ্যাট নির্বাচন করুন):</p>
                <div class="relative">
                    <i class="fa-solid fa-phone absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                    <input type="text" id="wa-share-phone" placeholder="০১xxxxxxxxx (ঐচ্ছিক)" class="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white font-mono outline-none focus:border-emerald-500">
                </div>
                
                <div>
                    <label class="block text-[11px] font-bold text-slate-400 mb-1">মেসেজ প্রিভিউ:</label>
                    <textarea readonly class="w-full h-36 bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-mono resize-none focus:outline-none custom-scrollbar">${statementText}</textarea>
                </div>

                <div class="flex justify-end">
                    <button type="button" id="copy-statement-btn" class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer">
                        <i class="fa-solid fa-copy text-xs"></i>
                        <span>মেসেজ কপি করুন</span>
                    </button>
                </div>
            </div>
        `,
        didOpen: () => {
            const copyBtn = document.getElementById('copy-statement-btn');
            if (copyBtn) {
                copyBtn.onclick = () => {
                    if (navigator.clipboard) {
                        navigator.clipboard.writeText(statementText);
                        showToast('স্টেটমেন্ট মেসেজ কপি হয়েছে!', 'success');
                    }
                };
            }
        },
        showCancelButton: true,
        confirmButtonText: '<i class="fa-brands fa-whatsapp mr-1.5"></i> হোয়াটসঅ্যাপে পাঠান',
        cancelButtonText: 'বাতিল',
        customClass: {
            popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700',
            confirmButton: '!bg-emerald-600 hover:!bg-emerald-500 !text-white font-bold !rounded-xl !px-5',
            cancelButton: '!bg-slate-800 hover:!bg-slate-700 !text-slate-300 font-bold !rounded-xl !px-4'
        },
        preConfirm: () => {
            const val = document.getElementById('wa-share-phone')?.value?.trim() || '';
            return val;
        }
    });

    if (phone !== undefined) {
        let cleanPhone = phone.replace(/[^0-9]/g, '');
        if (cleanPhone.startsWith('01')) {
            cleanPhone = '88' + cleanPhone;
        }

        const encodedText = encodeURIComponent(statementText);
        const waUrl = cleanPhone 
            ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`
            : `https://api.whatsapp.com/send?text=${encodedText}`;

        window.open(waUrl, '_blank');
        showToast('WhatsApp ওপেন করা হচ্ছে...', 'success');
    }
}
