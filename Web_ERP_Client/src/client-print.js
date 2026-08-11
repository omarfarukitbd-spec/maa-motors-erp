import { db } from './firebase-config.js';

/**
 * 🖨️ Mobile-Safe Universal Print Dispatcher
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

/**
 * Render Header Banner for Prints
 */
export function renderPrintHeader(options = {}, settings = {}) {
    const title = options.title || 'STATEMENT';
    const subtitle = options.subtitle || '';
    
    const shopName = settings.shopName || "M/S. Maa Motors";
    const shopAddress = settings.shopAddress || "Shop No. 22, Rahman Tower, 1st Rail Gate, Muradpur, Hathazari Road";
    const shopPhone = settings.shopPhone || "01819-397669, 01815-707934";

    return `
        <div style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%) !important; color: white !important; border-radius: 14px; padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 12px rgba(2, 132, 199, 0.25); margin-bottom: 16px; font-family: 'Hind Siliguri', sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact;">
            <div style="display: flex; align-items: center; gap: 14px;">
                <div style="width: 60px; height: 60px; background: #ffffff !important; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 900; color: #0284c7; flex-shrink: 0;">
                    MM
                </div>
                <div>
                    <h1 style="font-size: 20px; font-weight: 900; margin: 0; text-transform: uppercase; letter-spacing: -0.5px; line-height: 1.1; color: white !important;">${shopName}</h1>
                    <p style="font-size: 10px; margin: 3px 0; opacity: 0.95; font-weight: 500; color: white !important;">${shopAddress}</p>
                    <p style="font-size: 10px; margin: 0; font-weight: 700; opacity: 0.95; color: white !important; font-family: 'Inter', sans-serif;">Mobile: ${shopPhone}</p>
                </div>
            </div>
            <div style="text-align: right; flex-shrink: 0;">
                <div style="display: inline-block; font-size: 15px; font-weight: 900; text-transform: uppercase; background: rgba(255, 255, 255, 0.18) !important; border: 1.5px solid rgba(255, 255, 255, 0.4); padding: 6px 18px; border-radius: 10px; color: white !important;">${title}</div>
                ${subtitle ? `<div style="font-size: 9px; font-weight: 700; margin-top: 4px; opacity: 0.9; text-align: right; color: white !important;">${subtitle}</div>` : ''}
            </div>
        </div>
    `;
}

/**
 * Mobile-Safe A4 Customer Statement Print
 */
export async function printCustomerStatement(customerInfo, txns, settings = {}) {
    let container = document.getElementById('print-receipt-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'print-receipt-container';
        document.body.appendChild(container);
    }

    let totBill = 0, totPaid = 0;
    let running = Number(customerInfo.totalDue) || 0;
    
    // Sort chronological for calculation
    const sorted = [...txns].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    let tableRows = sorted.map((t, idx) => {
        const b = Number(t.bill) || 0;
        const p = Number(t.paid) || 0;
        totBill += b;
        totPaid += p;
        
        const dateStr = t.date ? t.date.split('-').reverse().join('/') : '-';
        const desc = t.voucherNo ? `Sales Memo #${t.voucherNo}` : (p > 0 ? 'Payment Received' : 'Transaction');

        return `
            <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 6px 8px; font-size: 10px; color: #475569;">${dateStr}</td>
                <td style="padding: 6px 8px; font-size: 10px; font-weight: bold; color: #0f172a;">${desc} ${t.notes ? `<span style="font-weight:normal; color:#64748b; font-style:italic;">(${t.notes})</span>` : ''}</td>
                <td style="padding: 6px 8px; font-size: 10px; text-align: right; font-weight: bold; color: ${b > 0 ? '#dc2626' : '#94a3b8'};">${b > 0 ? '৳ ' + b.toLocaleString('en-IN') : '-'}</td>
                <td style="padding: 6px 8px; font-size: 10px; text-align: right; font-weight: bold; color: ${p > 0 ? '#059669' : '#94a3b8'};">${p > 0 ? '৳ ' + p.toLocaleString('en-IN') : '-'}</td>
                <td style="padding: 6px 8px; font-size: 10px; text-align: right; font-weight: 900; color: #0f172a; border-left: 1px solid #cbd5e1;">৳ ${(b - p).toLocaleString('en-IN')}</td>
            </tr>
        `;
    }).join('');

    const headerHtml = renderPrintHeader({ title: 'STATEMENT', subtitle: `তারিখ: ${new Date().toLocaleDateString('en-GB')}` }, settings);

    container.className = 'print-a4';
    container.innerHTML = `
        <table class="print-layout-table" style="width: 100%; border-collapse: collapse;">
            <thead><tr><td><div class="print-header-space"></div></td></tr></thead>
            <tbody>
                <tr>
                    <td>
                        <div class="a4-wrapper font-bn">
                            ${headerHtml}

                            <div style="position: relative; display: grid; grid-template-columns: 1.35fr 1fr; gap: 14px; margin-bottom: 14px; align-items: stretch;">
                                <div style="position: absolute; left: 54%; top: 50%; transform: translate(-50%, -50%) rotate(-12deg); pointer-events: none; opacity: 0.22; border: 4px double ${running <= 0 ? '#059669' : '#dc2626'}; color: ${running <= 0 ? '#059669' : '#dc2626'}; padding: 4px 16px; border-radius: 8px; font-weight: 900; font-size: 18px; text-transform: uppercase; letter-spacing: 1.5px; text-align: center; font-family: sans-serif; background: rgba(255,255,255,0.85);">
                                    ${running <= 0 ? 'PAID<br><span style="font-size:9px;">পরিশোধিত</span>' : 'DUE<br><span style="font-size:9px;">বকেয়া হিসাব</span>'}
                                </div>

                                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; border-left: 4px solid #0284c7; padding: 10px 14px;">
                                    <div style="font-size: 9px; font-weight: 900; color: #0284c7; text-transform: uppercase; border-bottom: 1px solid #cbd5e1; padding-bottom: 3px; margin-bottom: 6px;">CUSTOMER DETAILS</div>
                                    <p style="font-size:14px; font-weight: 900; color:#0f172a; margin-bottom: 3px;">${customerInfo.name}</p>
                                    <div style="font-size:10px; color:#475569; margin-bottom: 4px;">
                                        <strong>A/C No:</strong> ${customerInfo.accountNo || '-'} &nbsp;|&nbsp; <strong>Mobile:</strong> ${customerInfo.phone || '-'}
                                    </div>
                                    <p style="font-size: 9px; color: #334155; margin: 0;">${customerInfo.address || '-'}</p>
                                </div>

                                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; border-left: 4px solid #0369a1; padding: 10px 14px;">
                                    <div style="font-size: 9px; font-weight: 900; color: #0369a1; text-transform: uppercase; border-bottom: 1px solid #cbd5e1; padding-bottom: 3px; margin-bottom: 6px;">FINANCIAL SUMMARY</div>
                                    <div style="display: flex; flex-direction: column; gap: 3px;">
                                        <div style="display: flex; justify-content: space-between; font-size:10px;"><span style="color:#64748b;">TOTAL BILL</span><strong style="color:#dc2626;">৳ ${totBill.toLocaleString('en-IN')}</strong></div>
                                        <div style="display: flex; justify-content: space-between; font-size:10px;"><span style="color:#64748b;">TOTAL PAID</span><strong style="color:#059669;">৳ ${totPaid.toLocaleString('en-IN')}</strong></div>
                                        <div style="display: flex; justify-content: space-between; font-size:11px; border-top:1px dashed #cbd5e1; padding-top:3px;"><span style="color:#1e40af; font-weight:900;">NET DUE BALANCE</span><strong style="color:#1e40af;">৳ ${running.toLocaleString('en-IN')}</strong></div>
                                    </div>
                                </div>
                            </div>

                            <table style="width:100%; border-collapse:collapse; margin-bottom:12px; border: 1px solid #cbd5e1;">
                                <thead>
                                    <tr style="background:#f1f5f9; border-bottom:1.5px solid #0f172a;">
                                        <th style="width:12%; padding:6px; text-align:left; font-size:9px; font-weight:900;">DATE</th>
                                        <th style="width:42%; padding:6px; text-align:left; font-size:9px; font-weight:900;">DESCRIPTION / VOUCHER</th>
                                        <th style="width:15%; padding:6px; text-align:right; font-size:9px; font-weight:900;">DEBIT</th>
                                        <th style="width:15%; padding:6px; text-align:right; font-size:9px; font-weight:900;">CREDIT</th>
                                        <th style="width:16%; padding:6px; text-align:right; font-size:9px; font-weight:900; border-left:1px solid #cbd5e1;">BALANCE</th>
                                    </tr>
                                </thead>
                                <tbody>${tableRows || '<tr><td colspan="5" style="text-align:center; padding:12px; color:#64748b;">কোনো লেনদেন রেকর্ড পাওয়া যায়নি</td></tr>'}</tbody>
                            </table>

                            <div style="margin-top: 35px; page-break-inside: avoid;">
                                <div style="display: flex; justify-content: space-between; padding: 0 30px;">
                                    <div style="border-top: 1.5px dashed #64748b; padding-top: 4px; width: 130px; text-align: center; font-size: 10px; font-weight: 700; color: #334155;">গ্রাহকের স্বাক্ষর</div>
                                    <div style="border-top: 1.5px dashed #64748b; padding-top: 4px; width: 130px; text-align: center; font-size: 10px; font-weight: 700; color: #334155;">কর্তৃপক্ষের স্বাক্ষর</div>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
            <tfoot><tr><td><div class="print-footer-space"></div></td></tr></tfoot>
        </table>
    `;

    triggerUniversalPrint(container);
}
