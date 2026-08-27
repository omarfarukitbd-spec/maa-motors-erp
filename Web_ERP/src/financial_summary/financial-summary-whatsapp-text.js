import { formatAmountWithComma, formatAppDate, showToast } from '../utils.js';

/**
 * Build Formatted Bengali Text Digest for Daily Closing (Customer Deposits & Bank Balances)
 */
export function buildDailyClosingTextDigest(summaryData, shopName = 'M/S. MAA-MOTOR\'S') {
    const isSingle = summaryData.startDate === summaryData.endDate;
    const dateStr = isSingle ? formatAppDate(summaryData.startDate) : `${formatAppDate(summaryData.startDate)} থেকে ${formatAppDate(summaryData.endDate)}`;

    // 1. Bank Inflow Breakdown (Today's Inflow)
    let bankDetailsText = '';
    if (summaryData.methodBreakdown) {
        const methods = Object.values(summaryData.methodBreakdown).filter(m => m.name !== 'Less');
        if (methods.length > 0) {
            bankDetailsText = methods.map(b => `   • ${b.name}: ৳ ${formatAmountWithComma(b.amount)} (${b.count} জন জমা)`).join('\n');
        }
    }

    // 2. Live Bank & Cash Closing Balances ("কোন ব্যাংকে কত টাকা আছে")
    let liveBalancesText = '';
    if (summaryData.bankBalances && summaryData.bankBalances.length > 0) {
        liveBalancesText = summaryData.bankBalances.map(b => 
            `   • ${b.name}: ৳ ${formatAmountWithComma(b.balance)}`
        ).join('\n');
        if (summaryData.totalLiquidFund) {
            liveBalancesText += `\n   ─────────────────────────\n   * মোট ব্যাংক ও ক্যাশ ফান্ড স্থিতি: ৳ ${formatAmountWithComma(summaryData.totalLiquidFund)}`;
        }
    }

    // 3. Banking Ledger Manual Transactions
    let bankingTxnsText = '';
    if (summaryData.bankingTransactions && summaryData.bankingTransactions.length > 0) {
        bankingTxnsText = summaryData.bankingTransactions.map((bt, idx) => {
            const isDep = (bt.type || '').toLowerCase() === 'deposit';
            const typeText = isDep ? 'সরাসরি জমা' : ((bt.type || '').toLowerCase() === 'withdraw' ? 'উত্তোলন' : 'ট্রান্সফার');
            const target = bt.targetBankName ? ` ➔ ${bt.targetBankName}` : '';
            return `   ${idx + 1}. ${bt.bankName}${target} - ৳ ${formatAmountWithComma(bt.amount)} [${typeText}] ${bt.notes ? `(${bt.notes})` : ''}`;
        }).join('\n');
    }

    // 4. Customer Collection Details List ("তারিখ অনুযায়ী কে কে টাকা দিল")
    let custCollectionsText = '';
    if (summaryData.customerCollections && summaryData.customerCollections.length > 0) {
        custCollectionsText = summaryData.customerCollections.map((c, idx) => {
            const acc = c.customerAccountNo ? ` [A/C: ${c.customerAccountNo}]` : '';
            const m = c.receivedType === 'Cash' ? 'ক্যাশ' : (c.receivedFrom || c.receivedType || 'ব্যাংক');
            return `   ${idx + 1}. ${c.customerName}${acc} - ৳ ${formatAmountWithComma(c.amount)} (${m})`;
        }).join('\n');
    }

    return `*${shopName}*
*দৈনিক কাস্টমার জমা ও ব্যাংক ব্যালেন্স ক্লোজিং রিপোর্ট*
তারিখ: ${dateStr}
─────────────────────────
* আজকের সর্বমোট জমা (আদায়): ৳ ${formatAmountWithComma(summaryData.totalCollection)}
   • ক্যাশ জমা: ৳ ${formatAmountWithComma(summaryData.cashCollection)}
   • ব্যাংক ও অনলাইন জমা: ৳ ${formatAmountWithComma(summaryData.bankCollection)}
   • মোট কাস্টমার সংখ্যা: ${summaryData.customerCollections?.length || 0} জন

* আজকের ব্যাংক ও ক্যাশভিত্তিক জমা:
${bankDetailsText || '   • কোনো জমার রেকর্ড নেই'}
─────────────────────────
${liveBalancesText ? `* কোন ব্যাংকে কত টাকা আছে (Live Balances):\n${liveBalancesText}\n─────────────────────────\n` : ''}${bankingTxnsText ? `* ব্যাংকিং লেজার ম্যানুয়াল লেনদেন:\n${bankingTxnsText}\n─────────────────────────\n` : ''}* আজকের কাস্টমার জমার পূর্ণাঙ্গ তালিকা:
${custCollectionsText || '   • কোনো কাস্টমার জমার রেকর্ড নেই'}
─────────────────────────
_Maa Motors ERP সিস্টেম থেকে স্বয়ংক্রিয়ভাবে প্রস্তুতকৃত_`;
}

/**
 * Send WhatsApp text message to specific phone
 */
export function sendToSpecificWhatsApp(phoneStr, fullText) {
    let cleanPhone = String(phoneStr || '').replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('01') && cleanPhone.length === 11) cleanPhone = '88' + cleanPhone;

    const encodedText = encodeURIComponent(fullText);
    const waUrl = cleanPhone 
        ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`
        : `https://api.whatsapp.com/send?text=${encodedText}`;

    window.open(waUrl, '_blank');
    showToast('টেক্সট রিপোর্টসহ WhatsApp ওপেন করা হয়েছে!', 'success', 'WhatsApp');
}

/**
 * Send WhatsApp text to custom phone input
 */
export function sendToCustomWhatsApp(fullText) {
    const input = document.getElementById('sw-wa-custom-phone');
    const phone = input ? input.value.trim() : '';
    if (!phone || phone.length < 6) {
        return showToast('সঠিক মোবাইল নম্বর লিখুন!', 'warning', 'WhatsApp');
    }
    sendToSpecificWhatsApp(phone, fullText);
}

/**
 * Copy text to clipboard
 */
export async function copyWaText(fullText) {
    try {
        await navigator.clipboard.writeText(fullText);
        showToast('সম্পূর্ণ টেক্সট সফলভাবে কপি হয়েছে!', 'success', 'কপি');
    } catch (err) {
        console.error('Clipboard copy error:', err);
        showToast('কপি করতে সমস্যা হয়েছে!', 'error', 'কপি');
    }
}
