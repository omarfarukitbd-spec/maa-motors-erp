import { SettingsDAO } from '../dao.js';
import { formatAmountWithComma, escapeHTML, formatAppDate, getDayOfWeekBangla, safeRound } from '../utils.js';
import { smartPaginatePrint, printViaIframe } from '../utils/smart-print-engine.js';
import { numberToBanglaWords } from '../utils/currency-words.js';

/**
 * Print Ultra-Premium Smart PDF Memo Book Audit & Reconciliation Report
 */
export async function printMemoBookAuditReport(summary, memos) {
    if (!summary || !memos) return;

    let settings = {};
    try {
        settings = (await SettingsDAO.getAppSettings()) || {};
    } catch (e) {
        console.warn("Settings fetch error:", e);
    }

    const shopName = escapeHTML(settings.shopName || "M/S. MAA-MOTOR'S");
    const shopOwner = escapeHTML(settings.shopOwner || "Mohammed Amran");
    const shopAddress = escapeHTML(settings.shopAddress || "Shop No. 22, Rahman Tower, 1st Rail Gate, Muradpur, Hathazari Road");
    const shopPhone = escapeHTML(settings.shopPhone || "01819-397669, 01815-707934");
    const shopLogo = settings.shopLogo || "/shop-official-logo.jpg";
    const reportDate = formatAppDate(new Date().toISOString().split('T')[0]);

    // 1. Sleek Compact Master Header Banner (Smart PDF Design)
    const masterHeaderHtml = `
        <div style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%) !important; color: #ffffff !important; border-radius: 10px; padding: 8px 14px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 6px rgba(2, 132, 199, 0.2); margin-bottom: 6px; font-family: 'Inter', 'Kalpurush', sans-serif !important; -webkit-print-color-adjust: exact; print-color-adjust: exact;">
            <div style="display: flex; align-items: center; gap: 10px;">
                <div style="width: 44px; height: 44px; background: #ffffff !important; border-radius: 50%; display: flex; align-items: center; justify-content: center; overflow: hidden; border: 2px solid #ffffff; flex-shrink: 0; padding: 1px;">
                    <img src="${shopLogo}" style="width: 100%; height: 100%; object-fit: contain; border-radius: 50%; display: block;" />
                </div>
                <div>
                    <h1 style="font-size: 16px; font-weight: 900 !important; margin: 0; text-transform: uppercase; line-height: 1.1; color: #ffffff !important; font-family: 'Inter', sans-serif !important;">${shopName}</h1>
                    <p style="font-size: 8.5px; margin: 1px 0; font-weight: 700 !important; color: #e0f2fe !important;">Proprietor: ${shopOwner} • Mobile: ${shopPhone}</p>
                    <p style="font-size: 8px; margin: 0; opacity: 0.9; font-weight: 600 !important; color: #f0f9ff !important; font-family: 'Kalpurush', 'Hind Siliguri', sans-serif !important;">${shopAddress}</p>
                </div>
            </div>
            <div style="text-align: right; flex-shrink: 0;">
                <div style="display: inline-block; font-size: 11px; font-weight: 900 !important; text-transform: uppercase; background: rgba(255, 255, 255, 0.2) !important; border: 1px solid rgba(255, 255, 255, 0.4); padding: 3px 10px; border-radius: 6px; letter-spacing: 0.5px; color: #ffffff !important;">MEMO BOOK AUDIT & RECONCILIATION</div>
                <div style="font-size: 8.5px; font-weight: 700 !important; margin-top: 2px; color: #e0f2fe !important; font-family: 'Hind Siliguri', sans-serif !important;">
                    রেঞ্জ: <strong>#${summary.startNo} হতে #${summary.endNo}</strong> (${summary.totalFound}/${summary.totalExpected}টি মেমো)
                </div>
            </div>
        </div>
    `;

    // 2. Compact 5-KPI Summary Matrix
    const kpiMatrixHtml = `
        <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 4px; margin-bottom: 5px; font-family: 'Hind Siliguri', sans-serif;">
            <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 5px; padding: 3px 5px; text-align: center;">
                <div style="font-size: 8px; font-weight: 700; color: #0369a1;">মোট মেমো সংখ্যা</div>
                <div style="font-size: 10px; font-weight: 900; color: #0284c7; font-family: 'Inter', sans-serif;">${summary.totalFound} / ${summary.totalExpected} টি</div>
            </div>
            <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 5px; padding: 3px 5px; text-align: center;">
                <div style="font-size: 8px; font-weight: 700; color: #b91c1c;">মোট বিল (Debit)</div>
                <div style="font-size: 10px; font-weight: 900; color: #dc2626; font-family: 'Inter', sans-serif;">৳ ${formatAmountWithComma(summary.totalBill)}</div>
            </div>
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 5px; padding: 3px 5px; text-align: center;">
                <div style="font-size: 8px; font-weight: 700; color: #15803d;">মোট জমা (Credit)</div>
                <div style="font-size: 10px; font-weight: 900; color: #16a34a; font-family: 'Inter', sans-serif;">৳ ${formatAmountWithComma(summary.totalPaid)}</div>
            </div>
            <div style="background: #faf5ff; border: 1px solid #e9d5ff; border-radius: 5px; padding: 3px 5px; text-align: center;">
                <div style="font-size: 8px; font-weight: 700; color: #7e22ce;">মোট ছাড় (Less)</div>
                <div style="font-size: 10px; font-weight: 900; color: #9333ea; font-family: 'Inter', sans-serif;">৳ ${formatAmountWithComma(summary.totalLess)}</div>
            </div>
            <div style="background: #fff7ed; border: 1px solid #fed7aa; border-radius: 5px; padding: 3px 5px; text-align: center;">
                <div style="font-size: 8px; font-weight: 700; color: #c2410c;">অবশিষ্ট বকেয়া</div>
                <div style="font-size: 10px; font-weight: 900; color: ${summary.totalNetDue > 0 ? '#ea580c' : '#16a34a'}; font-family: 'Inter', sans-serif;">৳ ${formatAmountWithComma(summary.totalNetDue)}</div>
            </div>
        </div>
    `;

    // 3. Missing & Duplicate Memo Warning Strips
    let gapAlertHtml = '';
    if (summary.missingNumbers && summary.missingNumbers.length > 0) {
        gapAlertHtml += `
            <div style="background: #fef2f2; border: 1px solid #f87171; border-radius: 5px; padding: 3px 6px; margin-bottom: 4px; font-size: 8.5px; color: #b91c1c; font-family: 'Hind Siliguri', sans-serif; font-weight: 700;">
                [সতর্কতা] ${summary.missingNumbers.length}টি মেমো বাদ পড়েছে / মিসিং: <strong>#${summary.missingNumbers.join(', #')}</strong>
            </div>
        `;
    }
    if (summary.duplicateNumbers && summary.duplicateNumbers.length > 0) {
        gapAlertHtml += `
            <div style="background: #fffbeb; border: 1px solid #f59e0b; border-radius: 5px; padding: 3px 6px; margin-bottom: 4px; font-size: 8.5px; color: #b45309; font-family: 'Hind Siliguri', sans-serif; font-weight: 700;">
                [সতর্কতা] ${summary.duplicateNumbers.length}টি মেমো নম্বরে একাধিক (ডুপ্লিকেট) এন্ট্রি রয়েছে: <strong>#${summary.duplicateNumbers.map(d => `${d.number} (${d.count}টি)`).join(', #')}</strong>
            </div>
        `;
    }

    const page1HeaderHtml = `
        <div style="margin-bottom: 5px;">
            ${masterHeaderHtml}
            ${kpiMatrixHtml}
            ${gapAlertHtml}
        </div>
    `;

    // 4. Compact Repeat Header for Pages 2+
    const repeatHeaderHtml = `
        <div style="display: flex; justify-content: space-between; align-items: center; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 3px 8px; margin-bottom: 4px; font-family: 'Hind Siliguri', sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact;">
            <div style="font-size: 9px; font-weight: 800; color: #0f172a;">${shopName} • মেমো বুক অডিট (#${summary.startNo} - #${summary.endNo})</div>
            <div style="font-size: 8.5px; font-weight: 700; color: #64748b;">রিপোর্ট তারিখ: ${reportDate}</div>
        </div>
    `;

    // 5. Table Rows Array for DOM measurement
    const rowsArray = memos.map((m, idx) => {
        const bill = Number(m.bill) || 0;
        const paid = Number(m.paid) || 0;
        const rType = String(m.receivedType || '').trim();
        const isLess = rType === 'Less' || /less|ছাড়|discount/i.test(rType);
        const actualPaid = isLess ? 0 : paid;
        const actualLess = isLess ? paid : 0;
        const netRowDue = safeRound(bill - (actualPaid + actualLess));
        const cleanCustName = String(m.customerName || 'গ্রাহক').replace(/^\[.*?\]\s*/, '').trim();
        const isDuplicate = summary.voucherCounts && summary.voucherCounts[m.voucherNum] > 1;
        const bgStyle = idx % 2 === 1 ? 'background: #f8fafc;' : 'background: #ffffff;';

        return `
            <tr class="print-row-no-break" style="${bgStyle}">
                <td style="text-align:center; vertical-align:middle; border: 1px solid #cbd5e1; padding: 3px 2px; font-size: 8.5px; font-family: 'Inter', sans-serif;">${idx + 1}</td>
                <td style="text-align:center; vertical-align:middle; border: 1px solid #cbd5e1; padding: 3px 2px; font-size: 9px; font-weight: 800; font-family: 'Inter', monospace; color: #0284c7;">
                    #${m.voucherNum || m.voucherNo}
                    ${isDuplicate ? '<span style="font-size:7px; color:#d97706; font-weight:bold;">(Dup)</span>' : ''}
                </td>
                <td style="text-align:center; vertical-align:middle; border: 1px solid #cbd5e1; padding: 3px 2px; font-size: 8.5px; font-family: 'Inter', sans-serif; white-space: nowrap;"><div style="font-weight: 700;">${formatAppDate(m.date)}</div><div style="font-size: 7.5px; color: #64748b; font-family: 'Hind Siliguri', sans-serif; font-weight: 600;">${getDayOfWeekBangla(m.date)}</div></td>
                <td style="text-align:left; vertical-align:middle; border: 1px solid #cbd5e1; padding: 3px 4px; font-size: 9px; font-family: 'Kalpurush', 'Hind Siliguri', sans-serif; line-height: 1.2; color: #0f172a;">
                    <strong>${escapeHTML(cleanCustName)}</strong>
                    ${m.customerAccountNo ? `<span style="font-size:7.5px; color:#0284c7; margin-left:2px;">[${escapeHTML(m.customerAccountNo)}]</span>` : ''}
                    ${m.customerPhone ? `<span style="font-size:7.5px; color:#64748b; margin-left:2px;">(${escapeHTML(m.customerPhone)})</span>` : ''}
                </td>
                <td style="text-align:right; vertical-align:middle; border: 1px solid #cbd5e1; padding: 3px 4px; font-size: 9.5px; font-weight: 900; color: #dc2626; font-family: 'Inter', sans-serif; white-space: nowrap;">${bill > 0 ? '৳ ' + formatAmountWithComma(bill) : '-'}</td>
                <td style="text-align:right; vertical-align:middle; border: 1px solid #cbd5e1; padding: 3px 4px; font-size: 9.5px; font-weight: 900; color: #16a34a; font-family: 'Inter', sans-serif; white-space: nowrap;">${actualPaid > 0 ? '৳ ' + formatAmountWithComma(actualPaid) : '-'}</td>
                <td style="text-align:right; vertical-align:middle; border: 1px solid #cbd5e1; padding: 3px 4px; font-size: 9.5px; font-weight: 900; color: #9333ea; font-family: 'Inter', sans-serif; white-space: nowrap;">${actualLess > 0 ? '৳ ' + formatAmountWithComma(actualLess) : '-'}</td>
                <td style="text-align:center; vertical-align:middle; border: 1px solid #cbd5e1; padding: 3px 2px; font-size: 8px; font-family: 'Hind Siliguri', sans-serif; color: #475569; white-space: nowrap;">${escapeHTML(m.receivedType || (m.bill > 0 ? 'বাকিতে' : 'জমা'))}</td>
                <td style="text-align:right; vertical-align:middle; border: 1px solid #cbd5e1; padding: 3px 4px; font-size: 9px; font-weight: 800; font-family: 'Inter', sans-serif; color: ${netRowDue > 0 ? '#dc2626' : '#16a34a'}; white-space: nowrap;">${netRowDue > 0 ? '৳ ' + formatAmountWithComma(netRowDue) : 'পরিশোধিত'}</td>
            </tr>
        `;
    });

    const tableColHeaderHtml = `
        <thead>
            <tr style="background: #f1f5f9; border-bottom: 2px solid #cbd5e1;">
                <th style="text-align: center; border: 1px solid #cbd5e1; padding: 3px 2px; font-size: 8.5px; font-weight: 900; color: #1e293b; width: 22px;">SL</th>
                <th style="text-align: center; border: 1px solid #cbd5e1; padding: 3px 2px; font-size: 8.5px; font-weight: 900; color: #1e293b; width: 45px;">মেমো</th>
                <th style="text-align: center; border: 1px solid #cbd5e1; padding: 3px 2px; font-size: 8.5px; font-weight: 900; color: #1e293b; width: 55px;">তারিখ</th>
                <th style="text-align: left; border: 1px solid #cbd5e1; padding: 3px 4px; font-size: 8.5px; font-weight: 900; color: #1e293b;">কাস্টমার ও অ্যাকাউন্ট</th>
                <th style="text-align: right; border: 1px solid #cbd5e1; padding: 3px 4px; font-size: 8.5px; font-weight: 900; color: #dc2626; width: 70px;">বিল (Debit)</th>
                <th style="text-align: right; border: 1px solid #cbd5e1; padding: 3px 4px; font-size: 8.5px; font-weight: 900; color: #16a34a; width: 70px;">জমা (Credit)</th>
                <th style="text-align: right; border: 1px solid #cbd5e1; padding: 3px 4px; font-size: 8.5px; font-weight: 900; color: #9333ea; width: 65px;">ছাড় (Less)</th>
                <th style="text-align: center; border: 1px solid #cbd5e1; padding: 3px 2px; font-size: 8px; font-weight: 900; color: #1e293b; width: 55px;">মাধ্যম</th>
                <th style="text-align: right; border: 1px solid #cbd5e1; padding: 3px 4px; font-size: 8.5px; font-weight: 900; color: #1e293b; width: 70px;">বকেয়া (৳)</th>
            </tr>
        </thead>
    `;

    const summaryHtml = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-top: 6px; page-break-inside: avoid; break-inside: avoid;">
            <div style="width: 52%; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 5px; padding: 4px 6px; font-family: 'Hind Siliguri', sans-serif;">
                <div style="font-size: 9px; font-weight: 700; color: #334155;">
                    কথায় (আদায়): <span style="font-weight: 900; color: #15803d;">${numberToBanglaWords(summary.totalPaid)}</span>
                </div>
                <div style="display: flex; gap: 8px; font-size: 8.5px; color: #64748b; margin-top: 1px;">
                    <span>ক্যাশ: <strong>৳ ${formatAmountWithComma(summary.paymentDistribution?.cash || 0)}</strong></span>
                    <span>ব্যাংক: <strong>৳ ${formatAmountWithComma(summary.paymentDistribution?.bank || 0)}</strong></span>
                    <span>ছাড়: <strong>৳ ${formatAmountWithComma(summary.totalLess)}</strong></span>
                </div>
            </div>

            <div style="width: 44%; background: #f0fdf4; border: 1px solid #86efac; border-radius: 5px; padding: 4px 6px; font-family: 'Hind Siliguri', sans-serif;">
                <div style="display: flex; justify-content: space-between; font-size: 9px; margin-bottom: 1px;">
                    <span style="color: #166534; font-weight: 700;">মোট মেমো পাতা:</span>
                    <strong style="color: #0f172a; font-weight: 900;">${summary.totalFound} / ${summary.totalExpected} টি (${summary.collectionRate}% আদায়)</strong>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 10px; border-top: 1px dashed #86efac; padding-top: 1px;">
                    <span style="color: #166534; font-weight: 900;">সর্বমোট আদায় (Paid):</span>
                    <strong style="color: #15803d; font-size: 11px; font-weight: 900;">৳ ${formatAmountWithComma(summary.totalPaid)}</strong>
                </div>
            </div>
        </div>
    `;

    const signatureHtml = `
        <div class="signature-last-page-block" style="margin-top: 16px; page-break-inside: avoid; break-inside: avoid;">
            <div style="display: flex; justify-content: space-between; padding: 0 15px;">
                <div style="border-top: 1.5px dashed #64748b; width: 105px; text-align: center; font-size: 8px; font-weight: 700; color: #334155; padding-top: 2px; font-family: 'Hind Siliguri', sans-serif;">হিসাবরক্ষকের স্বাক্ষর</div>
                <div style="border-top: 1.5px dashed #64748b; width: 105px; text-align: center; font-size: 8px; font-weight: 700; color: #334155; padding-top: 2px; font-family: 'Hind Siliguri', sans-serif;">নিরীক্ষকের স্বাক্ষর</div>
                <div style="border-top: 1.5px dashed #64748b; width: 105px; text-align: center; font-size: 8px; font-weight: 700; color: #334155; padding-top: 2px; font-family: 'Hind Siliguri', sans-serif;">স্বত্বাধিকারীর স্বাক্ষর</div>
            </div>
        </div>
    `;

    const pdfTitle = `মেমো_বুক_অডিট_রেঞ্জ_${summary.startNo}_হতে_${summary.endNo}_${reportDate.replace(/\//g, '-')}`;

    const pagesHtml = await smartPaginatePrint({
        page1HeaderHtml,
        repeatHeaderHtml,
        tableColHeaderHtml,
        rowsArray,
        summaryHtml,
        signatureHtml,
        formattedDate: reportDate
    });

    await printViaIframe(pagesHtml, pdfTitle);
}
