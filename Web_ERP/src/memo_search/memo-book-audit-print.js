import { formatAmountWithComma, formatAppDate, escapeHTML, safeRound } from '../utils.js';
import { SettingsDAO } from '../dao.js';

/**
 * Print Ultra-Premium A4 Memo Book Audit & Reconciliation Report
 */
export async function printMemoBookAuditReport(summary, memos) {
    if (!summary || !memos) return;

    let settings = {};
    try {
        settings = (await SettingsDAO.getAppSettings()) || {};
    } catch (e) {
        console.warn("Settings fetch error:", e);
    }

    const shopName = settings.shopName || 'M/S. Maa Motors';
    const shopAddress = settings.shopAddress || 'কাপ্তাই রোড, কুয়াইশ রোড সংযোগ মোড়, চট্টগ্রাম';
    const shopPhone = settings.shopPhone || '01819-384451, 01819-311894';

    const printWin = window.open('', '_blank');
    if (!printWin) return alert('পপআপ ব্লক করা আছে, অনুগ্রহ করে ব্রাউজারের পপআপ চালু করুন।');

    const missingHtml = summary.missingNumbers && summary.missingNumbers.length > 0
        ? `<div style="background: #fef2f2; border: 1px solid #f87171; color: #b91c1c; padding: 8px 12px; border-radius: 8px; margin-bottom: 15px; font-size: 12px; font-weight: bold;">
            [সতর্কতা] মিসিং মেমো (${summary.missingNumbers.length}টি বাদ পড়েছে): #${summary.missingNumbers.join(', #')}
           </div>`
        : `<div style="background: #f0fdf4; border: 1px solid #4ade80; color: #15803d; padding: 6px 12px; border-radius: 8px; margin-bottom: 15px; font-size: 11px; font-weight: bold;">
            [যাচাইকৃত] এই মেমো বইয়ের সকল মেমো ক্রমানুসারে শতভাগ নির্ভুল ও রেকর্ডকৃত রয়েছে।
           </div>`;

    let rowsHtml = '';
    memos.forEach((m, idx) => {
        const bill = Number(m.bill) || 0;
        const paid = Number(m.paid) || 0;
        const rType = String(m.receivedType || '').trim();
        const isLess = rType === 'Less' || /less|ছাড়|discount/i.test(rType);
        const actualPaid = isLess ? 0 : paid;
        const actualLess = isLess ? paid : 0;
        const netRowDue = safeRound(bill - (actualPaid + actualLess));

        rowsHtml += `
            <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 6px 8px; text-align: center; font-size: 11px;">${idx + 1}</td>
                <td style="padding: 6px 8px; font-family: monospace; font-weight: bold; color: #0284c7; text-align: center; font-size: 11px;">#${m.voucherNum || m.voucherNo}</td>
                <td style="padding: 6px 8px; font-size: 11px; text-align: center;">${formatAppDate(m.date)}</td>
                <td style="padding: 6px 8px; font-size: 11px; font-weight: bold;">${escapeHTML(m.customerName)} ${m.customerAccountNo ? `<span style="font-size: 9px; color: #64748b;">(A/C: ${m.customerAccountNo})</span>` : ''}</td>
                <td style="padding: 6px 8px; font-size: 10px; color: #475569;">${m.customerPhone || '-'}</td>
                <td style="padding: 6px 8px; text-align: right; font-family: monospace; font-weight: bold; color: #dc2626; font-size: 11px;">${bill > 0 ? '৳' + formatAmountWithComma(bill) : '-'}</td>
                <td style="padding: 6px 8px; text-align: right; font-family: monospace; font-weight: bold; color: #059669; font-size: 11px;">${actualPaid > 0 ? '৳' + formatAmountWithComma(actualPaid) : '-'}</td>
                <td style="padding: 6px 8px; text-align: right; font-family: monospace; font-weight: bold; color: #9333ea; font-size: 11px;">${actualLess > 0 ? '৳' + formatAmountWithComma(actualLess) : '-'}</td>
                <td style="padding: 6px 8px; font-size: 10px; text-align: center; color: #64748b;">${escapeHTML(m.receivedType || (m.bill > 0 ? 'বাকিতে' : 'জমা'))} ${m.receivedFrom ? '(' + escapeHTML(m.receivedFrom) + ')' : ''}</td>
                <td style="padding: 6px 8px; text-align: right; font-family: monospace; font-weight: bold; font-size: 11px; color: ${netRowDue > 0 ? '#dc2626' : '#059669'};">${netRowDue > 0 ? '৳' + formatAmountWithComma(netRowDue) : 'পরিশোধিত'}</td>
            </tr>
        `;
    });

    const docHtml = `
    <!DOCTYPE html>
    <html lang="bn">
    <head>
        <meta charset="UTF-8">
        <title>মেমো বুক অডিট রিপোর্ট (#${summary.startNo} - #${summary.endNo}) - ${shopName}</title>
        <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700;800&display=swap" rel="stylesheet">
        <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: 'Hind Siliguri', sans-serif; background: #fff; color: #0f172a; padding: 25px; }
            .header-box { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 15px; }
            .shop-title { font-size: 22px; font-weight: 800; color: #0f172a; }
            .shop-sub { font-size: 12px; color: #475569; margin-top: 2px; }
            .report-title { font-size: 15px; font-weight: 800; background: #0f172a; color: #fff; display: inline-block; padding: 4px 16px; border-radius: 20px; margin-top: 8px; }
            .grid-kpi { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; margin-bottom: 15px; }
            .kpi-card { border: 1px solid #cbd5e1; border-radius: 8px; padding: 8px 10px; background: #f8fafc; text-align: center; }
            .kpi-label { font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; }
            .kpi-val { font-size: 14px; font-weight: 800; font-family: 'JetBrains Mono', monospace; margin-top: 2px; }
            table { width: 100%; border-collapse: collapse; margin-top: 5px; }
            th { background: #f1f5f9; border-top: 1px solid #cbd5e1; border-bottom: 2px solid #94a3b8; padding: 8px; font-size: 11px; font-weight: 800; color: #334155; text-align: left; }
            .sign-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 40px; text-align: center; font-size: 11px; font-weight: 700; color: #475569; }
            .sign-line { border-top: 1px dashed #94a3b8; padding-top: 5px; margin-top: 30px; }
            @media print {
                body { padding: 0; }
                @page { size: A4 portrait; margin: 10mm; }
            }
        </style>
    </head>
    <body>
        <div class="header-box">
            <div class="shop-title">${escapeHTML(shopName)}</div>
            <div class="shop-sub">${escapeHTML(shopAddress)} | মোবাইল: ${escapeHTML(shopPhone)}</div>
            <div class="report-title">মেমো বুক অডিট ও রিকনসিলিয়েশন রিপোর্ট</div>
            <div style="font-size: 11px; color: #64748b; margin-top: 4px;">
                মেমো রেঞ্জ: <strong>#${summary.startNo} হতে #${summary.endNo}</strong> | মোট মেমো: <strong>${summary.totalFound}/${summary.totalExpected} টি</strong> | প্রিন্ট তারিখ: ${formatAppDate(new Date().toISOString().split('T')[0])}
            </div>
        </div>

        ${missingHtml}

        <div class="grid-kpi">
            <div class="kpi-card">
                <div class="kpi-label">মোট পাতা / মেমো</div>
                <div class="kpi-val" style="color: #0284c7;">${summary.totalFound} / ${summary.totalExpected} টি</div>
            </div>
            <div class="kpi-card">
                <div class="kpi-label">মোট বিল (Debit)</div>
                <div class="kpi-val" style="color: #dc2626;">৳ ${formatAmountWithComma(summary.totalBill)}</div>
            </div>
            <div class="kpi-card">
                <div class="kpi-label">মোট আদায় (Credit)</div>
                <div class="kpi-val" style="color: #059669;">৳ ${formatAmountWithComma(summary.totalPaid)}</div>
            </div>
            <div class="kpi-card">
                <div class="kpi-label">মোট ছাড় (Less)</div>
                <div class="kpi-val" style="color: #9333ea;">৳ ${formatAmountWithComma(summary.totalLess)}</div>
            </div>
            <div class="kpi-card">
                <div class="kpi-label">অবশিষ্ট বকেয়া</div>
                <div class="kpi-val" style="color: ${summary.totalNetDue > 0 ? '#dc2626' : '#059669'};">৳ ${formatAmountWithComma(summary.totalNetDue)}</div>
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th style="text-align: center; width: 35px;">ক্রম</th>
                    <th style="text-align: center; width: 65px;">মেমো নং</th>
                    <th style="text-align: center; width: 75px;">তারিখ</th>
                    <th>কাস্টমারের নাম</th>
                    <th>মোবাইল</th>
                    <th style="text-align: right;">বিল (Debit)</th>
                    <th style="text-align: right;">জমা (Credit)</th>
                    <th style="text-align: right;">ছাড় (Less)</th>
                    <th style="text-align: center;">মাধ্যম</th>
                    <th style="text-align: right;">বকেয়া</th>
                </tr>
            </thead>
            <tbody>
                ${rowsHtml}
            </tbody>
            <tfoot>
                <tr style="background: #f8fafc; border-top: 2px solid #0f172a; font-weight: 800; font-family: 'JetBrains Mono', monospace; font-size: 12px;">
                    <td colspan="5" style="padding: 8px; text-align: right; font-family: 'Hind Siliguri', sans-serif;">সর্বমোট (Total):</td>
                    <td style="padding: 8px; text-align: right; color: #dc2626;">৳${formatAmountWithComma(summary.totalBill)}</td>
                    <td style="padding: 8px; text-align: right; color: #059669;">৳${formatAmountWithComma(summary.totalPaid)}</td>
                    <td style="padding: 8px; text-align: right; color: #9333ea;">৳${formatAmountWithComma(summary.totalLess)}</td>
                    <td style="padding: 8px; text-align: center; font-size: 10px; font-family: 'Hind Siliguri', sans-serif; color: #64748b;">কালেকশন: ${summary.collectionRate}%</td>
                    <td style="padding: 8px; text-align: right; color: #dc2626;">৳${formatAmountWithComma(summary.totalNetDue)}</td>
                </tr>
            </tfoot>
        </table>

        <div class="sign-grid">
            <div><div class="sign-line">হিসাবরক্ষক স্বাক্ষর</div></div>
            <div><div class="sign-line">নিরীক্ষক / অডিটর</div></div>
            <div><div class="sign-line">স্বত্বাধিকারী অনুমোদন</div></div>
        </div>
    </body>
    </html>
    `;

    printWin.document.open();
    printWin.document.write(docHtml);
    printWin.document.close();

    setTimeout(() => {
        printWin.focus();
        printWin.print();
    }, 500);
}
