import { showToast } from '../utils/ui-helpers.js';

/**
 * Robust Print Handler for Memo Search
 */
export async function printMemoReceipt(txnId, layoutType = 'a4') {
    if (!txnId) return;
    try {
        if (typeof window.printReceiptEngine === 'function') {
            await window.printReceiptEngine(txnId, layoutType);
        } else {
            const { printReceiptEngine } = await import('../utils/receipt-engine.js');
            window.printReceiptEngine = printReceiptEngine;
            await printReceiptEngine(txnId, layoutType);
        }
    } catch (e) {
        console.error("Print Memo Error:", e);
        showToast('প্রিন্ট লোড করতে সমস্যা হয়েছে: ' + (e.message || 'Error'), 'error');
    }
}

/**
 * Robust WhatsApp Share Handler for Memo Search
 */
export async function shareMemoOnWhatsApp(txnId) {
    if (!txnId) return;
    try {
        const { shareTxnWhatsApp } = await import('../ledger/ledger-messaging.js');
        await shareTxnWhatsApp(txnId);
    } catch (e) {
        console.error("WhatsApp Share Error:", e);
        showToast('WhatsApp শেয়ার ওপেন করতে সমস্যা হয়েছে', 'error');
    }
}

/**
 * Robust SMS Sender for Memo Search
 */
export async function sendMemoDueSMS(txnId, name, phone, due, voucherNo) {
    if (!txnId) return;
    try {
        const { sendTxnSMS } = await import('../ledger/ledger-messaging.js');
        await sendTxnSMS(txnId, name, undefined, voucherNo, undefined, undefined, due);
    } catch (e) {
        console.error("SMS Send Error:", e);
        showToast('SMS মডিউল লোড করতে সমস্যা হয়েছে', 'error');
    }
}

// Global Bindings
window.printMemoReceipt = printMemoReceipt;
window.shareMemoOnWhatsApp = shareMemoOnWhatsApp;
window.sendMemoDueSMS = sendMemoDueSMS;
