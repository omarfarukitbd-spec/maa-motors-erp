import { TransactionDAO, CustomerDAO, SettingsDAO } from '../dao.js';
import { escapeHTML, formatAmountWithComma } from './formatters.js';
import { formatAppDate } from './date-logic/date-converter.js';
import { safeRound } from './formatters.js';
import { showToast } from './ui-helpers.js';
import Swal from 'sweetalert2';

/**
 * Mobile & Desktop Safe Universal Print Trigger
 */
export function triggerUniversalPrint(container) {
    if (!container) return;
    container.classList.remove('hidden');

    let cleaned = false;
    const cleanup = () => {
        if (cleaned) return;
        cleaned = true;
        container.classList.add('hidden');
        window.removeEventListener('afterprint', cleanup);
    };

    window.addEventListener('afterprint', cleanup);

    setTimeout(() => {
        window.print();
        setTimeout(cleanup, 12000);
    }, 150);
}

import { renderSharedPrintHeader } from '../shared/print/print-header.js';

/**
 * Universal Corporate Print Header Generator
 * Delegates to central shared print header template.
 */
export function renderPrintHeader(options = {}, settings = {}) {
    return renderSharedPrintHeader(settings, options);
}

/**
 * Core Receipt Printing Engine
 * Fully Restored - 100% functional parity with original utils.js
 */
export async function printReceiptEngine(txnId, layoutType = 'a4') {
    try {
        showToast(`রিসিট লেআউট তৈরি হচ্ছে (${layoutType.toUpperCase()})...`, 'info', 'প্রিন্ট Engine');
        const txn = await TransactionDAO.getById(txnId);
        if (!txn) {
            showToast("লেনদেন ডাটা পাওয়া যায়নি!", "error", "প্রিন্ট Error");
            throw new Error("Transaction record not found in database");
        }

        const customerId = txn.customerId;
        const cData = await CustomerDAO.getById(customerId) || {};

        const allTxns = await TransactionDAO.getByCustomer(customerId);
        allTxns.sort((a, b) => {
            const dDiff = new Date(a.date) - new Date(b.date);
            if (dDiff !== 0) return dDiff;
            return (a.createdAt?.toMillis() || 0) - (b.createdAt?.toMillis() || 0);
        });

        let calcPrevDue = Number(cData.initialDue || 0);
        for (const t of allTxns) {
            if (t.id === txnId) break;
            calcPrevDue = safeRound(calcPrevDue + (Number(t.bill) || 0) - (Number(t.paid) || 0));
        }

        const effectivePrevDue = safeRound(calcPrevDue);
        const effectiveCurrentDue = safeRound(effectivePrevDue + (Number(txn.bill) || 0) - (Number(txn.paid) || 0));
        const settings = await SettingsDAO.getAppSettings();
        const shopName = escapeHTML(settings.shopName || "M/S. Maa Motors");
        const shopAddress = escapeHTML(settings.shopAddress || "Shop No. 22, Rahman Tower, 1st Rail Gate, Muradpur, Hathazari Road");
        const shopPhone = escapeHTML(settings.shopPhone || "01819-397669, 01815-707934");

        let container = document.getElementById('print-receipt-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'print-receipt-container';
            container.classList.add('hidden');
            document.body.appendChild(container);
        }

        let itemsHtml = '';
        if (txn.hasItems && txn.items && txn.items.length > 0) {
            itemsHtml = `
                <table class="print-items-table">
                    <thead>
                        <tr>
                            <th style="width:8%">SL.</th>
                            <th style="width:42%; text-align:left;">বিবরণ / আইটেমের নাম</th>
                            <th style="width:15%">পরিমাণ</th>
                            <th style="width:15%">দর</th>
                            <th style="width:20%">মোট</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${txn.items.map((it, i) => `
                            <tr>
                                <td style="text-align:center;">${String(i + 1).padStart(2, '0')}</td>
                                <td class="text-left" style="font-weight:700;">${escapeHTML(it.desc || '-')}</td>
                                <td class="text-right">${it.qty || 0}</td>
                                <td class="text-right">৳${formatAmountWithComma(it.rate || 0)}</td>
                                <td class="text-right" style="font-weight:800;">৳${formatAmountWithComma(it.total || 0)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        } else {
            // Fake table for Opening Balance or Cash Received to prevent blank middle space
            const rowDesc = txn.bill > 0 ? (txn.paid > 0 ? 'Transaction Entry / Payment' : 'Opening Balance / Bill Entry') : 'Cash Received / Payment';
            const rowTotal = txn.bill > 0 ? txn.bill : txn.paid;
            itemsHtml = `
                <table class="print-items-table">
                    <thead>
                        <tr>
                            <th style="width:10%">SL.</th>
                            <th style="width:60%; text-align:left;">Description / বিবরণ</th>
                            <th style="width:30%; text-align:right;">Amount / পরিমাণ</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="text-align:center;">01</td>
                            <td class="text-left" style="font-weight:700; color:#0f172a;">${rowDesc}</td>
                            <td class="text-right" style="font-weight:900; color:#0f172a;">৳${formatAmountWithComma(rowTotal)}</td>
                        </tr>
                    </tbody>
                </table>
            `;
        }

        let paymentMethodStr = '';
        if (txn.paid > 0 && txn.receivedType) {
            paymentMethodStr = ` <span style="font-size: 9px; opacity: 0.8;">(${escapeHTML(txn.receivedType)}${txn.receivedFrom ? ' - ' + escapeHTML(txn.receivedFrom) : ''})</span>`;
        }

        if (layoutType === 'a4') {
            const printHeader = renderPrintHeader({
                title: 'INVOICE',
                dateRangeStr: `ভাউচার #: #${escapeHTML(txn.voucherNo || txnId.slice(-6).toUpperCase())} • তারিখ: ${formatAppDate(txn.date)}`
            }, settings);

            container.className = 'print-a4';
            container.innerHTML = `
                <style>
                    .print-items-table { width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 12px; }
                    .print-items-table th { background: #f1f5f9 !important; border: 1px solid #cbd5e1; padding: 8px 10px; text-align: center; font-weight: 900; color: #0f172a; }
                    .print-items-table td { border: 1px solid #e2e8f0; padding: 7px 10px; color: #334155; }
                    .print-items-table .text-left { text-align: left; }
                    .print-items-table .text-right { text-align: right; }
                </style>
                <div class="a4-wrapper font-bn" style="width: 100%; max-width: 210mm; margin: 0 auto; padding: 10mm 12mm; box-sizing: border-box; background: #ffffff; color: #0f172a;">
                    ${printHeader}

                    <!-- Customer Details Box (Full Width) -->
                    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; border-left: 4px solid #0284c7; padding: 12px 16px; margin-bottom: 18px;">
                        <div style="font-size: 10px; font-weight: 900; color: #0284c7; text-transform: uppercase; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin-bottom: 8px; letter-spacing: 0.5px;">CUSTOMER DETAILS</div>
                        <p style="font-size:15px; font-weight: 900; color:#0f172a; margin-bottom: 4px; line-height: 1.2;">${escapeHTML(String(txn.customerName || cData.name || '').replace(/^\[.*?\]\s*/, '').trim())}</p>
                        <div style="display: flex; flex-wrap: wrap; gap: 12px; font-size:11px; color:#475569; margin-bottom: 6px;">
                            <span><strong style="color:#0f172a;">A/C No:</strong> ${escapeHTML(cData.accountNo || '-')}</span>
                            <span><strong style="color:#0f172a;">Mobile:</strong> ${escapeHTML(cData.phone || '-')}</span>
                        </div>
                        <div style="border-top: 1px dashed #cbd5e1; padding-top: 6px; margin-top: 4px;">
                            <p style="font-size: 11px; color: #334155; line-height: 1.4; margin: 0; font-weight: 600;"><strong>Address:</strong> ${escapeHTML(cData.address || '-')}</p>
                        </div>
                    </div>

                    ${itemsHtml ? `<div style="margin-bottom:18px;">${itemsHtml}</div>` : ''}

                    <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 24px; margin-top: 15px; page-break-inside: avoid;">
                        <div style="background: #fffbe6; border: 1px solid #ffe58f; border-radius: 10px; padding: 10px 14px;">
                            <strong style="color:#856404; font-weight:900; font-size:11px; border-bottom:1px solid #fadb14; display:block; padding-bottom:3px; margin-bottom:5px;">নোট / শর্তাবলী:</strong>
                            <p style="font-size:10.5px; line-height:1.5; color:#533f03; margin:0;">${txn.notes ? escapeHTML(txn.notes).replace(/\n/g, '<br/>') : 'পণ্য বিক্রয়ের সময় রিসিট দেখে বুঝে নিন। ধন্যবাদ!'}</p>
                        </div>
                        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px 14px; position: relative;">
                            
                            <!-- Watermark Stamp (Moved to Payment Equation) -->
                            <div style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%) rotate(-12deg); pointer-events: none; opacity: 0.12; border: 4px double ${effectiveCurrentDue <= 0 ? '#059669' : '#dc2626'}; color: ${effectiveCurrentDue <= 0 ? '#059669' : '#dc2626'}; padding: 6px 14px; border-radius: 8px; font-weight: 900; font-size: 26px; text-transform: uppercase; letter-spacing: 2px; text-align: center; line-height: 1.1; z-index: 10; font-family: sans-serif;">
                                ${effectiveCurrentDue <= 0 ? 'PAID' : 'DUE'}
                            </div>

                            <div style="font-size: 10px; font-weight: 900; color: #0f172a; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin-bottom: 6px; text-transform: uppercase;">হিসাবের বিবরণী (Payment Equation)</div>
                            ${txn.subtotal && txn.discount > 0 ? `<div style="display:flex; justify-content:space-between; margin-bottom:3px; font-size:11px; color:#475569; position: relative; z-index: 20;"><span>Subtotal:</span><strong>৳ ${formatAmountWithComma(txn.subtotal)}</strong></div>` : ''}
                            ${txn.discount > 0 ? `<div style="display:flex; justify-content:space-between; margin-bottom:3px; font-size:11px; color:#d97706; position: relative; z-index: 20;"><span>Discount (-):</span><strong>- ৳ ${formatAmountWithComma(txn.discount)}</strong></div>` : ''}
                            <div style="display:flex; justify-content:space-between; margin-bottom:3px; font-size:11px; color:#0f172a; font-weight:700; position: relative; z-index: 20;"><span>আজকের বিল:</span><strong>৳ ${formatAmountWithComma(txn.bill)}</strong></div>
                            <div style="display:flex; justify-content:space-between; margin-bottom:3px; font-size:11px; color:#475569; position: relative; z-index: 20;"><span>পূর্বের বকেয়া:</span><strong>৳ ${formatAmountWithComma(effectivePrevDue)}</strong></div>
                            <div style="display:flex; justify-content:space-between; margin-bottom:3px; font-size:11px; color:#059669; font-weight:700; position: relative; z-index: 20;"><span>আজকের জমা${paymentMethodStr}:</span><strong>- ৳ ${formatAmountWithComma(txn.paid)}</strong></div>
                            <div style="display:flex; justify-content:space-between; padding:5px 8px; border-top:2px solid #cbd5e1; font-size:12.5px; font-weight:900; color:${effectiveCurrentDue > 0 ? '#dc2626' : '#059669'}; background: ${effectiveCurrentDue > 0 ? '#fef2f2' : '#ecfdf5'}; border-radius: 6px; margin-top: 4px; border-left: 4px solid ${effectiveCurrentDue > 0 ? '#dc2626' : '#059669'}; position: relative; z-index: 20;"><span>মোট বকেয়া:</span><strong>৳ ${formatAmountWithComma(Math.abs(effectiveCurrentDue))} ${effectiveCurrentDue < 0 ? '(Adv)' : ''}</strong></div>
                        </div>
                    </div>

                    <div style="display: flex; justify-content: space-between; margin-top: 40px; padding: 0 20px; page-break-inside: avoid;">
                        <div style="border-top: 1.5px dashed #64748b; padding-top: 5px; width: 140px; text-align: center; font-size: 11px; font-weight: 700; color: #334155;">গ্রাহকের স্বাক্ষর</div>
                        <div style="border-top: 1.5px dashed #64748b; padding-top: 5px; width: 140px; text-align: center; font-size: 11px; font-weight: 700; color: #334155;">কর্তৃপক্ষের স্বাক্ষর</div>
                    </div>
                </div>
            `;
        } else {
            const shopOwner = escapeHTML(settings.shopOwner || "Mohammed Amran");
            container.className = 'print-pos';
            container.innerHTML = `
                <div class="pos-wrapper font-bn text-center" style="width: 80mm; padding: 10px; box-sizing: border-box; background: white; color: black; font-family: 'Inter', 'Kalpurush', 'Hind Siliguri', sans-serif;">
                    <h2 style="font-size: 16px; font-weight: 900; margin: 0 0 2px 0; text-transform: uppercase;">${shopName}</h2>
                    <p style="font-size: 10px; margin: 1px 0 4px 0; font-weight: 700; font-family: 'Inter', sans-serif;">Proprietor: ${shopOwner}</p>
                    <p style="font-size: 10px; margin: 0 0 6px 0; opacity: 0.85;">${shopAddress}<br>মোবাইল: ${shopPhone}</p>
                    <div style="border-bottom: 1.5px dashed #000; margin: 6px 0;"></div>
                    <div style="display: flex; justify-content: space-between; font-size: 10px; font-weight: 700; font-family: monospace;">
                        <span>#${escapeHTML(txn.voucherNo || txnId.slice(-6).toUpperCase())}</span>
                        <span>${formatAppDate(txn.date)}</span>
                    </div>
                    <div style="text-align: left; font-weight: 800; font-size: 12px; margin: 6px 0 4px 0;">কাস্টমার: ${escapeHTML(cleanCustName)}</div>
                    <div style="border-bottom: 1px dashed #000; margin: 6px 0;"></div>
                    <div style="display: flex; justify-content: space-between; font-size: 11px; margin: 3px 0;"><span>পূর্বের বকেয়া:</span><span>৳ ${formatAmountWithComma(effectivePrevDue)}</span></div>
                    <div style="display: flex; justify-content: space-between; font-size: 11px; margin: 3px 0;"><span>আজকের বিল:</span><span>৳ ${formatAmountWithComma(txn.bill)}</span></div>
                    <div style="display: flex; justify-content: space-between; font-size: 11px; margin: 3px 0; font-weight: 700;"><span>আজকের জমা${paymentMethodStr}:</span><span>- ৳ ${formatAmountWithComma(txn.paid)}</span></div>
                    <div style="border-bottom: 1.5px solid #000; margin: 6px 0;"></div>
                    <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: 900;">
                        <span>মোট বকেয়া:</span>
                        <span>৳ ${formatAmountWithComma(Math.abs(effectiveCurrentDue))} ${effectiveCurrentDue < 0 ? '(Adv)' : ''}</span>
                    </div>
                    <div style="border-bottom: 1px dashed #000; margin: 8px 0;"></div>
                    <div style="font-size: 10px; font-weight: 700; margin-top: 6px;">পণ্য বিক্রয়ের সময় দেখে বুঝে নিন। ধন্যবাদ!</div>
                </div>
            `;
        }

        triggerUniversalPrint(container);
        showToast(`প্রিন্ট পপ-আপ কমান্ড তৈরি সফল (${layoutType.toUpperCase()})!`, 'success', 'প্রিন্ট Engine');

    } catch (e) {
        console.error("Print Engine Error:", e);
        showToast(`প্রিন্ট ব্যর্থ: ${e.message || 'অজানা এরর'}`, 'error', 'প্রিন্ট Error');
        Swal.fire('প্রিন্ট এরর', e.message || 'প্রিন্ট করতে সমস্যা হয়েছে', 'error');
    }
}

// Bind to window object globally
if (typeof window !== 'undefined') {
    window.printReceiptEngine = printReceiptEngine;
}

export { renderPublicMemoView } from './public-memo-ui.js';


