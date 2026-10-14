import { formatAmountWithComma, formatAppDate, escapeHTML } from '../utils.js';
import { smartPaginatePrint, printViaIframe } from '../utils/smart-print-engine.js';
import { calculateMasterTotals, formatExactBengaliCurrency } from './godown-memo-calc.js';
import { SettingsDAO } from '../dao.js';

/**
 * Print Ultra-High-Definition Master Godown Memo Register on exact 1 A4 Portrait Page
 * Matching the app's signature print header, detailed memo metrics, and missing memo audit
 * @param {Array<Object>} books
 */
export async function printGodownMemoRegisterA4Portrait(books = []) {
    if (!books || books.length === 0) return;

    let settings = {};
    try {
        settings = (await SettingsDAO.getAppSettings()) || {};
    } catch (e) {
        console.warn('Settings fetch error:', e);
    }

    const totals = calculateMasterTotals(books);
    const shopName = escapeHTML(settings.shopName || "M/S. MAA-MOTOR'S");
    const shopOwner = escapeHTML(settings.shopOwner || "Mohammed Amran");
    const shopAddress = escapeHTML(settings.shopAddress || "Shop No. 22, Rahman Tower, 1st Rail Gate, Muradpur, Hathazari Road");
    const shopPhone = escapeHTML(settings.shopPhone || "01819-397669, 01815-707934");
    const shopLogo = settings.shopLogo || "/shop-official-logo.jpg";
    const reportDate = formatAppDate(new Date().toISOString().split('T')[0]);

    // 1. App-Standard Signature Master Header Banner (Gradient Blue + Round Logo)
    const page1HeaderHtml = `
        <div style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%) !important; color: #ffffff !important; border-radius: 10px; padding: 8px 14px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 6px rgba(2, 132, 199, 0.2); margin-bottom: 6px; font-family: 'Inter', 'Kalpurush', 'Hind Siliguri', sans-serif !important; -webkit-print-color-adjust: exact; print-color-adjust: exact;">
            <div style="display: flex; align-items: center; gap: 10px;">
                <div style="width: 46px; height: 46px; background: #ffffff !important; border-radius: 50%; display: flex; align-items: center; justify-content: center; overflow: hidden; border: 2px solid #ffffff; flex-shrink: 0; padding: 1px;">
                    <img src="${shopLogo}" style="width: 100%; height: 100%; object-fit: contain; border-radius: 50%; display: block;" />
                </div>
                <div>
                    <h1 style="font-size: 16px; font-weight: 900 !important; margin: 0; text-transform: uppercase; line-height: 1.1; color: #ffffff !important; font-family: 'Inter', sans-serif !important;">${shopName}</h1>
                    <p style="font-size: 8.5px; margin: 1px 0; font-weight: 700 !important; color: #e0f2fe !important;">Proprietor: ${shopOwner} • Mobile: ${shopPhone}</p>
                    <p style="font-size: 8px; margin: 0; opacity: 0.95; font-weight: 600 !important; color: #f0f9ff !important; font-family: 'Kalpurush', 'Hind Siliguri', sans-serif !important;">${shopAddress}</p>
                </div>
            </div>
            <div style="text-align: right; flex-shrink: 0;">
                <div style="display: inline-block; font-size: 11px; font-weight: 900 !important; text-transform: uppercase; background: rgba(255, 255, 255, 0.2) !important; border: 1px solid rgba(255, 255, 255, 0.4); padding: 3px 10px; border-radius: 6px; letter-spacing: 0.5px; color: #ffffff !important; font-family: 'Hind Siliguri', sans-serif !important;">গোডাউন মেমো বিক্রয় মাস্টার রেজিস্টার</div>
                <div style="font-size: 8.5px; font-weight: 700 !important; margin-top: 2px; color: #e0f2fe !important; font-family: 'Hind Siliguri', sans-serif !important;">
                    নথি নং: <strong>০০০০১</strong> • ২/১১/২০২৫ হতে বর্তমান হিসাব
                </div>
            </div>
        </div>

        <!-- 5-KPI Master Summary Matrix -->
        <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 4px; margin-bottom: 5px; font-family: 'Hind Siliguri', sans-serif;">
            <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 5px; padding: 3px 5px; text-align: center;">
                <div style="font-size: 7.5px; font-weight: 700; color: #0369a1;">মোট মেমো বই</div>
                <div style="font-size: 10px; font-weight: 900; color: #0284c7; font-family: 'Inter', sans-serif;">${totals.totalBooksCount} টি বই</div>
            </div>
            <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 5px; padding: 3px 5px; text-align: center;">
                <div style="font-size: 7.5px; font-weight: 700; color: #334155;">মোট মেমো সংখ্যা</div>
                <div style="font-size: 10px; font-weight: 900; color: #0f172a; font-family: 'Inter', sans-serif;">${totals.totalMemosCount} টি মেমো</div>
            </div>
            <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 5px; padding: 3px 5px; text-align: center;">
                <div style="font-size: 7.5px; font-weight: 700; color: #b91c1c;">মোট বিক্রয় (Gross)</div>
                <div style="font-size: 9.5px; font-weight: 900; color: #dc2626; font-family: 'Inter', sans-serif;">${formatExactBengaliCurrency(totals.totalGross)}</div>
            </div>
            <div style="background: #faf5ff; border: 1px solid #e9d5ff; border-radius: 5px; padding: 3px 5px; text-align: center;">
                <div style="font-size: 7.5px; font-weight: 700; color: #7e22ce;">মোট লেস (Less)</div>
                <div style="font-size: 9.5px; font-weight: 900; color: #9333ea; font-family: 'Inter', sans-serif;">${formatExactBengaliCurrency(totals.totalLess)}</div>
            </div>
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 5px; padding: 3px 5px; text-align: center;">
                <div style="font-size: 7.5px; font-weight: 700; color: #15803d;">মোট নিট বিক্রয় (Net)</div>
                <div style="font-size: 9.5px; font-weight: 900; color: #16a34a; font-family: 'Inter', sans-serif;">${formatExactBengaliCurrency(totals.totalNet)}</div>
            </div>
        </div>
    `;

    // 2. Compact Repeat Header for Pages 2+
    const repeatHeaderHtml = `
        <div style="display: flex; justify-content: space-between; align-items: center; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 3px 8px; margin-bottom: 4px; font-family: 'Hind Siliguri', sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact;">
            <div style="font-size: 9px; font-weight: 800; color: #0f172a;">${shopName} • গোডাউন মেমো মাস্টার রেজিস্টার (নথি: ০০০০১)</div>
            <div style="font-size: 8.5px; font-weight: 700; color: #64748b;">রিপোর্ট তারিখ: ${reportDate}</div>
        </div>
    `;

    // 3. Table Column Header HTML with Exact Columns Requested
    const tableColHeaderHtml = `
        <thead>
            <tr style="background: #0f172a; color: #ffffff;">
                <th style="border: 1px solid #0f172a; padding: 4px 2px; text-align: center; font-size: 8px; font-weight: 900; width: 22px;">ক্র:</th>
                <th style="border: 1px solid #0f172a; padding: 4px 2px; text-align: center; font-size: 8.5px; font-weight: 900; width: 55px;">মেমো বই নং</th>
                <th style="border: 1px solid #0f172a; padding: 4px 2px; text-align: center; font-size: 8px; font-weight: 900; width: 90px;">তারিখ রেঞ্জ</th>
                <th style="border: 1px solid #0f172a; padding: 4px 2px; text-align: center; font-size: 8px; font-weight: 900; width: 44px;">মেমো সংখ্যা</th>
                <th style="border: 1px solid #0f172a; padding: 4px 2px; text-align: center; font-size: 8px; font-weight: 900; width: 48px;">ক্রমপুঞ্জিত</th>
                <th style="border: 1px solid #0f172a; padding: 4px 2px; text-align: center; font-size: 8px; font-weight: 900; width: 45px;">মিসিং</th>
                <th style="border: 1px solid #0f172a; padding: 4px 3px; text-align: right; font-size: 8px; font-weight: 900; width: 68px; color: #fca5a5;">মোট বিক্রয়</th>
                <th style="border: 1px solid #0f172a; padding: 4px 3px; text-align: right; font-size: 8px; font-weight: 900; width: 44px; color: #d8b4fe;">লেস</th>
                <th style="border: 1px solid #0f172a; padding: 4px 3px; text-align: right; font-size: 8px; font-weight: 900; width: 68px; color: #86efac;">নিট বিক্রয়</th>
                <th style="border: 1px solid #0f172a; padding: 4px 3px; text-align: right; font-size: 8px; font-weight: 900; width: 72px; color: #e2e8f0;">ক্রমপুঞ্জিত মোট</th>
                <th style="border: 1px solid #0f172a; padding: 4px 2px; text-align: center; font-size: 8px; font-weight: 900; width: 75px;">সাক্ষর ও সিল</th>
            </tr>
        </thead>
    `;

    // 4. Data Rows Array
    const rowsArray = totals.books.map((b, idx) => {
        const gross = Number(b.grossSales) || 0;
        const less = Number(b.totalLess) || 0;
        const net = Number(b.calculatedNetSales || b.netSales) || 0;
        const cum = Number(b.calculatedCumulative || b.cumulativeNetSales) || 0;
        const sDate = b.startDate ? formatAppDate(b.startDate) : '';
        const eDate = b.endDate ? formatAppDate(b.endDate) : '';
        const dateStr = sDate && eDate ? `${sDate} হতে ${eDate}` : (eDate || sDate || '-');
        const officerName = escapeHTML(b.inChargeName || 'মোঃ এমরান');
        const officerId = escapeHTML(b.inChargeId || '১৯২৫');
        const stampDate = b.stampDate ? formatAppDate(b.stampDate) : eDate;

        const bgStyle = idx % 2 === 1 ? 'background: #f8fafc;' : 'background: #ffffff;';
        const missingBadge = b.missingMemoPrintDisplay === 'সম্পূর্ণ'
            ? '<span style="color: #16a34a; font-weight: bold;">সম্পূর্ণ</span>'
            : `<span style="color: #dc2626; font-weight: bold; font-size: 7.5px;">${escapeHTML(b.missingMemoPrintDisplay)}</span>`;

        return `
            <tr class="print-row-no-break" style="${bgStyle}">
                <td style="text-align: center; border: 1px solid #cbd5e1; padding: 3px 2px; font-size: 8px; font-family: 'Inter', sans-serif; font-weight: bold;">${idx + 1}</td>
                <td style="text-align: center; border: 1px solid #cbd5e1; padding: 3px 2px; font-size: 8.5px; font-weight: 900; font-family: 'Inter', monospace; color: #0284c7;">#${escapeHTML(b.bookNo)}</td>
                <td style="text-align: center; border: 1px solid #cbd5e1; padding: 3px 2px; font-size: 7.5px; font-family: 'Hind Siliguri', sans-serif; white-space: nowrap;">${dateStr}</td>
                <td style="text-align: center; border: 1px solid #cbd5e1; padding: 3px 2px; font-size: 8.5px; font-weight: 800; font-family: 'Inter', sans-serif; color: #0f172a;">${b.bookMemos} টি</td>
                <td style="text-align: center; border: 1px solid #cbd5e1; padding: 3px 2px; font-size: 8.5px; font-weight: 800; font-family: 'Inter', sans-serif; color: #0284c7;">${b.calculatedCumulativeMemos} টি</td>
                <td style="text-align: center; border: 1px solid #cbd5e1; padding: 3px 2px; font-size: 8px; font-family: 'Hind Siliguri', sans-serif;">${missingBadge}</td>
                <td style="text-align: right; border: 1px solid #cbd5e1; padding: 3px 3px; font-size: 8.5px; font-weight: 800; font-family: 'Inter', sans-serif; color: #b91c1c; white-space: nowrap;">৳ ${formatAmountWithComma(gross)}</td>
                <td style="text-align: right; border: 1px solid #cbd5e1; padding: 3px 3px; font-size: 8px; font-weight: 700; font-family: 'Inter', sans-serif; color: #7e22ce; white-space: nowrap;">${less > 0 ? '৳ ' + formatAmountWithComma(less) : '-'}</td>
                <td style="text-align: right; border: 1px solid #cbd5e1; padding: 3px 3px; font-size: 8.5px; font-weight: 900; font-family: 'Inter', sans-serif; color: #047857; white-space: nowrap;">৳ ${formatAmountWithComma(net)}</td>
                <td style="text-align: right; border: 1px solid #cbd5e1; padding: 3px 3px; font-size: 8.5px; font-weight: 800; font-family: 'Inter', sans-serif; color: #0f172a; white-space: nowrap; background: #f1f5f9;">৳ ${formatAmountWithComma(cum)}</td>
                <td style="text-align: center; border: 1px solid #cbd5e1; padding: 2px 2px; vertical-align: middle;">
                    <div style="border: 1.2px dashed #94a3b8; border-radius: 4px; width: 76px; height: 32px; background: #ffffff; display: inline-block;"></div>
                </td>
            </tr>
        `;
    });

    // 5. Total Summary Row
    rowsArray.push(`
        <tr class="print-row-no-break" style="background: #f1f5f9; font-weight: 900; border-top: 2px solid #0f172a; border-bottom: 2px solid #0f172a;">
            <td colspan="3" style="text-align: center; font-weight: 900; font-size: 8.5px; border: 1px solid #cbd5e1; padding: 4px 2px; font-family: 'Hind Siliguri', sans-serif;">সর্বমোট সমাপনী হিসাব:</td>
            <td style="text-align: center; font-weight: 900; font-family: 'Inter', sans-serif; font-size: 8.5px; border: 1px solid #cbd5e1; padding: 4px 2px; color: #0f172a;">${totals.totalMemosCount} টি</td>
            <td style="text-align: center; font-weight: 900; font-family: 'Inter', sans-serif; font-size: 8.5px; border: 1px solid #cbd5e1; padding: 4px 2px; color: #0284c7;">${totals.totalMemosCount} টি</td>
            <td style="text-align: center; font-weight: 900; font-size: 7.5px; border: 1px solid #cbd5e1; padding: 4px 2px; color: #16a34a; font-family: 'Hind Siliguri', sans-serif;">১০০% অডিট</td>
            <td style="text-align: right; font-weight: 900; font-family: 'Inter', sans-serif; font-size: 8.5px; border: 1px solid #cbd5e1; padding: 4px 3px; color: #b91c1c; white-space: nowrap;">৳ ${formatAmountWithComma(totals.totalGross)}</td>
            <td style="text-align: right; font-weight: 900; font-family: 'Inter', sans-serif; font-size: 8.5px; border: 1px solid #cbd5e1; padding: 4px 3px; color: #7e22ce; white-space: nowrap;">৳ ${formatAmountWithComma(totals.totalLess)}</td>
            <td style="text-align: right; font-weight: 900; font-family: 'Inter', sans-serif; font-size: 8.5px; border: 1px solid #cbd5e1; padding: 4px 3px; color: #047857; white-space: nowrap;">৳ ${formatAmountWithComma(totals.totalNet)}</td>
            <td style="text-align: right; font-weight: 900; font-family: 'Inter', sans-serif; font-size: 8.5px; border: 1px solid #cbd5e1; padding: 4px 3px; color: #0f172a; white-space: nowrap; background: #e2e8f0;">৳ ${formatAmountWithComma(totals.grandCumulative)}</td>
            <td style="text-align: center; font-weight: 900; font-size: 7.5px; border: 1px solid #cbd5e1; padding: 4px 2px; color: #1e40af; font-family: 'Hind Siliguri', sans-serif;">১০০% সংরক্ষিত</td>
        </tr>
    `);

    // 6. Summary Words & Exactly 2 Signatures (Manager & In-Charge/Office Boss)
    const summaryHtml = `
        <div style="margin-top: 4px; page-break-inside: avoid; break-inside: avoid; font-family: 'Hind Siliguri', sans-serif;">
            <div style="background: #f8fafc; border: 1px dashed #94a3b8; border-radius: 6px; padding: 4px 8px; font-size: 9px; font-weight: 700; color: #1e293b; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <span style="color: #475569;">কথায় (নিট বিক্রয়):</span>
                    <strong style="color: #15803d; font-size: 9.5px; margin-left: 4px;">${totals.netInWords}</strong>
                </div>
                <div style="font-size: 8px; color: #64748b; font-family: 'Inter', sans-serif;">
                    মোট বই: <strong>${totals.totalBooksCount}টি</strong> • মোট মেমো: <strong>${totals.totalMemosCount}টি</strong>
                </div>
            </div>
        </div>
    `;

    // 7. Exactly 2 Signatures: Left = Manager, Right = In-Charge / Office Boss
    const signatureHtml = `
        <div class="signature-last-page-block" style="margin-top: 26px; page-break-inside: avoid; break-inside: avoid; font-family: 'Hind Siliguri', sans-serif;">
            <div style="display: flex; justify-content: space-between; padding: 0 45px;">
                <div style="border-top: 1.5px dashed #475569; width: 170px; text-align: center; padding-top: 4px;">
                    <div style="font-size: 10.5px; font-weight: 900; color: #0f172a;">ম্যানেজার</div>
                    <div style="font-size: 8px; font-weight: 600; color: #64748b;">মেসার্স মা মোটরস</div>
                </div>
                <div style="border-top: 1.5px dashed #475569; width: 170px; text-align: center; padding-top: 4px;">
                    <div style="font-size: 10.5px; font-weight: 900; color: #0f172a;">ইনচার্জ বা অফিস বস</div>
                    <div style="font-size: 8px; font-weight: 600; color: #64748b;">অনুমোদন ও সিলমোহর</div>
                </div>
            </div>
        </div>
    `;

    const pdfTitle = `গোডাউন_মেমো_বিক্রয়_মাস্টার_রেজিস্টার_${reportDate.replace(/\//g, '-')}`;

    const pagesHtml = await smartPaginatePrint({
        page1HeaderHtml,
        repeatHeaderHtml,
        tableColHeaderHtml,
        rowsArray,
        summaryHtml,
        signatureHtml,
        formattedDate: reportDate
    });

    await printViaIframe(pagesHtml, '', pdfTitle);
}
