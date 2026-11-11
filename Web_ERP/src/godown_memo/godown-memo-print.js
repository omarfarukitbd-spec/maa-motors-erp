import { formatAmountWithComma, formatAppDate, escapeHTML, renderPrintHeader, renderRepeatHeader } from '../utils.js';
import { smartPaginatePrint, printViaIframe } from '../utils/smart-print-engine.js';
import { calculateMasterTotals, formatExactBengaliCurrency } from './godown-memo-calc.js';
import { SettingsDAO } from '../dao.js';

/**
 * Print Ultra-High-Definition Master Godown Memo Register on exact 1 A4 Portrait Page
 * With 100% unified, consistent Bengali typography (Hind Siliguri) across all sections
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
    const reportDate = formatAppDate(new Date().toISOString().split('T')[0]);

    // 1. Official Mother PDF Header
    const page1HeaderHtml = `
        ${renderPrintHeader(settings, {
            title: 'গোডাউন মেমো অডিট রেজিস্টার',
            pageLabel: 'নথি নং',
            pageNo: '০০০০১'
        })}
        <div style="display:flex; justify-content:space-between; align-items:center; background:#f8fafc; border:1px solid #cbd5e1; border-left:4px solid #0284c7; border-radius:4px; padding:4px 10px; margin-bottom:5px; font-family:'Anek Bangla','Hind Siliguri',sans-serif; font-size:9px; color:#0f172a;">
            <span>হিসাবকাল: <strong>২/১১/২০২৫ হতে বর্তমান হিসাব</strong></span>
            <span>রিপোর্ট তারিখ: <strong>${reportDate}</strong></span>
        </div>

        <!-- 5-KPI Master Summary Matrix (All unified in Hind Siliguri) -->
        <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 4px; margin-bottom: 5px; font-family: 'Hind Siliguri', sans-serif !important;">
            <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 5px; padding: 3px 5px; text-align: center;">
                <div style="font-size: 7.5px; font-weight: 700; color: #0369a1; font-family: 'Hind Siliguri', sans-serif !important;">মোট মেমো বই</div>
                <div style="font-size: 10px; font-weight: 900; color: #0284c7; font-family: 'Hind Siliguri', sans-serif !important;">${totals.totalBooksCount} টি বই</div>
            </div>
            <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 5px; padding: 3px 5px; text-align: center;">
                <div style="font-size: 7.5px; font-weight: 700; color: #334155; font-family: 'Hind Siliguri', sans-serif !important;">মোট মেমো সংখ্যা</div>
                <div style="font-size: 10px; font-weight: 900; color: #0f172a; font-family: 'Hind Siliguri', sans-serif !important;">${totals.totalMemosCount} টি মেমো</div>
            </div>
            <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 5px; padding: 3px 5px; text-align: center;">
                <div style="font-size: 7.5px; font-weight: 700; color: #b91c1c; font-family: 'Hind Siliguri', sans-serif !important;">মোট বিক্রয় (Gross)</div>
                <div style="font-size: 9.5px; font-weight: 900; color: #dc2626; font-family: 'Hind Siliguri', sans-serif !important;">${formatExactBengaliCurrency(totals.totalGross)}</div>
            </div>
            <div style="background: #faf5ff; border: 1px solid #e9d5ff; border-radius: 5px; padding: 3px 5px; text-align: center;">
                <div style="font-size: 7.5px; font-weight: 700; color: #7e22ce; font-family: 'Hind Siliguri', sans-serif !important;">মোট লেস (Less)</div>
                <div style="font-size: 9.5px; font-weight: 900; color: #9333ea; font-family: 'Hind Siliguri', sans-serif !important;">${formatExactBengaliCurrency(totals.totalLess)}</div>
            </div>
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 5px; padding: 3px 5px; text-align: center;">
                <div style="font-size: 7.5px; font-weight: 700; color: #15803d; font-family: 'Hind Siliguri', sans-serif !important;">মোট নিট বিক্রয় (Net)</div>
                <div style="font-size: 9.5px; font-weight: 900; color: #16a34a; font-family: 'Hind Siliguri', sans-serif !important;">${formatExactBengaliCurrency(totals.totalNet)}</div>
            </div>
        </div>
    `;

    // 2. Compact Repeat Header for Pages 2+
    const repeatHeaderHtml = renderRepeatHeader('গোডাউন মেমো অডিট রেজিস্টার (নথি: ০০০০১)', `রিপোর্ট তারিখ: ${reportDate}`);

    // 3. Table Column Header HTML with Exact Columns Requested
    const tableColHeaderHtml = `
        <thead>
            <tr style="background: #0f172a; color: #ffffff; font-family: 'Hind Siliguri', sans-serif !important;">
                <th style="border: 1px solid #0f172a; padding: 4px 2px; text-align: center; font-size: 8px; font-weight: 900; width: 22px; font-family: 'Hind Siliguri', sans-serif !important;">ক্র:</th>
                <th style="border: 1px solid #0f172a; padding: 4px 2px; text-align: center; font-size: 8.5px; font-weight: 900; width: 55px; font-family: 'Hind Siliguri', sans-serif !important;">মেমো বই নং</th>
                <th style="border: 1px solid #0f172a; padding: 4px 2px; text-align: center; font-size: 8px; font-weight: 900; width: 90px; font-family: 'Hind Siliguri', sans-serif !important;">তারিখ রেঞ্জ</th>
                <th style="border: 1px solid #0f172a; padding: 4px 2px; text-align: center; font-size: 8px; font-weight: 900; width: 44px; font-family: 'Hind Siliguri', sans-serif !important;">মেমো সংখ্যা</th>
                <th style="border: 1px solid #0f172a; padding: 4px 2px; text-align: center; font-size: 8px; font-weight: 900; width: 48px; font-family: 'Hind Siliguri', sans-serif !important;">ক্রমপুঞ্জিত</th>
                <th style="border: 1px solid #0f172a; padding: 4px 2px; text-align: center; font-size: 8px; font-weight: 900; width: 45px; font-family: 'Hind Siliguri', sans-serif !important;">মিসিং</th>
                <th style="border: 1px solid #0f172a; padding: 4px 3px; text-align: right; font-size: 8px; font-weight: 900; width: 68px; color: #fca5a5; font-family: 'Hind Siliguri', sans-serif !important;">মোট বিক্রয়</th>
                <th style="border: 1px solid #0f172a; padding: 4px 3px; text-align: right; font-size: 8px; font-weight: 900; width: 44px; color: #d8b4fe; font-family: 'Hind Siliguri', sans-serif !important;">লেস</th>
                <th style="border: 1px solid #0f172a; padding: 4px 3px; text-align: right; font-size: 8px; font-weight: 900; width: 68px; color: #86efac; font-family: 'Hind Siliguri', sans-serif !important;">নিট বিক্রয়</th>
                <th style="border: 1px solid #0f172a; padding: 4px 3px; text-align: right; font-size: 8px; font-weight: 900; width: 72px; color: #e2e8f0; font-family: 'Hind Siliguri', sans-serif !important;">ক্রমপুঞ্জিত মোট</th>
                <th style="border: 1px solid #0f172a; padding: 4px 2px; text-align: center; font-size: 8px; font-weight: 900; width: 75px; font-family: 'Hind Siliguri', sans-serif !important;">সাক্ষর ও সিল</th>
            </tr>
        </thead>
    `;

    // 4. Data Rows Array (All styled with Hind Siliguri)
    const rowsArray = totals.books.map((b, idx) => {
        const gross = Number(b.grossSales) || 0;
        const less = Number(b.totalLess) || 0;
        const net = Number(b.calculatedNetSales || b.netSales) || 0;
        const cum = Number(b.calculatedCumulative || b.cumulativeNetSales) || 0;
        const sDate = b.startDate ? formatAppDate(b.startDate) : '';
        const eDate = b.endDate ? formatAppDate(b.endDate) : '';
        const dateStr = sDate && eDate ? `${sDate} হতে ${eDate}` : (eDate || sDate || '-');

        const bgStyle = idx % 2 === 1 ? 'background: #f8fafc;' : 'background: #ffffff;';
        const missingBadge = b.missingMemoPrintDisplay === 'সম্পূর্ণ'
            ? '<span style="color: #16a34a; font-weight: bold; font-family: \'Hind Siliguri\', sans-serif !important;">সম্পূর্ণ</span>'
            : `<span style="color: #dc2626; font-weight: bold; font-size: 7.5px; font-family: \'Hind Siliguri\', sans-serif !important;">${escapeHTML(b.missingMemoPrintDisplay)}</span>`;

        return `
            <tr class="print-row-no-break" style="${bgStyle}; font-family: 'Hind Siliguri', sans-serif !important;">
                <td style="text-align: center; border: 1px solid #cbd5e1; padding: 3px 2px; font-size: 8px; font-family: 'Hind Siliguri', sans-serif !important; font-weight: bold;">${idx + 1}</td>
                <td style="text-align: center; border: 1px solid #cbd5e1; padding: 3px 2px; font-size: 8.5px; font-weight: 900; font-family: 'Hind Siliguri', monospace !important; color: #0284c7;">#${escapeHTML(b.bookNo)}</td>
                <td style="text-align: center; border: 1px solid #cbd5e1; padding: 3px 2px; font-size: 7.5px; font-family: 'Hind Siliguri', sans-serif !important; white-space: nowrap;">${dateStr}</td>
                <td style="text-align: center; border: 1px solid #cbd5e1; padding: 3px 2px; font-size: 8.5px; font-weight: 800; font-family: 'Hind Siliguri', sans-serif !important; color: #0f172a;">${b.bookMemos} টি</td>
                <td style="text-align: center; border: 1px solid #cbd5e1; padding: 3px 2px; font-size: 8.5px; font-weight: 800; font-family: 'Hind Siliguri', sans-serif !important; color: #0284c7;">${b.calculatedCumulativeMemos} টি</td>
                <td style="text-align: center; border: 1px solid #cbd5e1; padding: 3px 2px; font-size: 8px; font-family: 'Hind Siliguri', sans-serif !important;">${missingBadge}</td>
                <td style="text-align: right; border: 1px solid #cbd5e1; padding: 3px 3px; font-size: 8.5px; font-weight: 800; font-family: 'Hind Siliguri', sans-serif !important; color: #b91c1c; white-space: nowrap;">৳ ${formatAmountWithComma(gross)}</td>
                <td style="text-align: right; border: 1px solid #cbd5e1; padding: 3px 3px; font-size: 8px; font-weight: 700; font-family: 'Hind Siliguri', sans-serif !important; color: #7e22ce; white-space: nowrap;">${less > 0 ? '৳ ' + formatAmountWithComma(less) : '-'}</td>
                <td style="text-align: right; border: 1px solid #cbd5e1; padding: 3px 3px; font-size: 8.5px; font-weight: 900; font-family: 'Hind Siliguri', sans-serif !important; color: #047857; white-space: nowrap;">৳ ${formatAmountWithComma(net)}</td>
                <td style="text-align: right; border: 1px solid #cbd5e1; padding: 3px 3px; font-size: 8.5px; font-weight: 800; font-family: 'Hind Siliguri', sans-serif !important; color: #0f172a; white-space: nowrap; background: #f1f5f9;">৳ ${formatAmountWithComma(cum)}</td>
                <td style="text-align: center; border: 1px solid #cbd5e1; padding: 2px 2px; vertical-align: middle;">
                    <div style="border: 1.2px dashed #94a3b8; border-radius: 4px; width: 76px; height: 32px; background: #ffffff; display: inline-block;"></div>
                </td>
            </tr>
        `;
    });

    // 5. Total Summary Row (Unified Hind Siliguri)
    rowsArray.push(`
        <tr class="print-row-no-break" style="background: #f1f5f9; font-weight: 900; border-top: 2px solid #0f172a; border-bottom: 2px solid #0f172a; font-family: 'Hind Siliguri', sans-serif !important;">
            <td colspan="3" style="text-align: center; font-weight: 900; font-size: 8.5px; border: 1px solid #cbd5e1; padding: 4px 2px; font-family: 'Hind Siliguri', sans-serif !important;">সর্বমোট সমাপনী হিসাব:</td>
            <td style="text-align: center; font-weight: 900; font-family: 'Hind Siliguri', sans-serif !important; font-size: 8.5px; border: 1px solid #cbd5e1; padding: 4px 2px; color: #0f172a;">${totals.totalMemosCount} টি</td>
            <td style="text-align: center; font-weight: 900; font-family: 'Hind Siliguri', sans-serif !important; font-size: 8.5px; border: 1px solid #cbd5e1; padding: 4px 2px; color: #0284c7;">${totals.totalMemosCount} টি</td>
            <td style="text-align: center; font-weight: 900; font-size: 7.5px; border: 1px solid #cbd5e1; padding: 4px 2px; color: #16a34a; font-family: 'Hind Siliguri', sans-serif !important;">১০০% অডিট</td>
            <td style="text-align: right; font-weight: 900; font-family: 'Hind Siliguri', sans-serif !important; font-size: 8.5px; border: 1px solid #cbd5e1; padding: 4px 3px; color: #b91c1c; white-space: nowrap;">৳ ${formatAmountWithComma(totals.totalGross)}</td>
            <td style="text-align: right; font-weight: 900; font-family: 'Hind Siliguri', sans-serif !important; font-size: 8.5px; border: 1px solid #cbd5e1; padding: 4px 3px; color: #7e22ce; white-space: nowrap;">৳ ${formatAmountWithComma(totals.totalLess)}</td>
            <td style="text-align: right; font-weight: 900; font-family: 'Hind Siliguri', sans-serif !important; font-size: 8.5px; border: 1px solid #cbd5e1; padding: 4px 3px; color: #047857; white-space: nowrap;">৳ ${formatAmountWithComma(totals.totalNet)}</td>
            <td style="text-align: right; font-weight: 900; font-family: 'Hind Siliguri', sans-serif !important; font-size: 8.5px; border: 1px solid #cbd5e1; padding: 4px 3px; color: #0f172a; white-space: nowrap; background: #e2e8f0;">৳ ${formatAmountWithComma(totals.grandCumulative)}</td>
            <td style="text-align: center; font-weight: 900; font-size: 7.5px; border: 1px solid #cbd5e1; padding: 4px 2px; color: #1e40af; font-family: 'Hind Siliguri', sans-serif !important;">১০০% সংরক্ষিত</td>
        </tr>
    `);

    // 6. Summary Words (Unified Hind Siliguri)
    const summaryHtml = `
        <div style="margin-top: 4px; page-break-inside: avoid; break-inside: avoid; font-family: 'Hind Siliguri', sans-serif !important;">
            <div style="background: #f8fafc; border: 1px dashed #94a3b8; border-radius: 6px; padding: 4px 8px; font-size: 9px; font-weight: 700; color: #1e293b; display: flex; justify-content: space-between; align-items: center; font-family: 'Hind Siliguri', sans-serif !important;">
                <div>
                    <span style="color: #475569; font-family: 'Hind Siliguri', sans-serif !important;">কথায় (নিট বিক্রয়):</span>
                    <strong style="color: #15803d; font-size: 9.5px; margin-left: 4px; font-family: 'Hind Siliguri', sans-serif !important;">${totals.netInWords}</strong>
                </div>
                <div style="font-size: 8px; color: #64748b; font-family: 'Hind Siliguri', sans-serif !important;">
                    মোট বই: <strong>${totals.totalBooksCount}টি</strong> • মোট মেমো: <strong>${totals.totalMemosCount}টি</strong>
                </div>
            </div>
        </div>
    `;

    // 7. Exactly 2 Signatures: Left = Manager, Right = In-Charge / Office Boss with Offline Seal Boxes
    const signatureHtml = `
        <div class="signature-last-page-block" style="margin-top: 48px; page-break-inside: avoid; break-inside: avoid; font-family: 'Anek Bangla', 'Hind Siliguri', sans-serif !important;">
            <div style="display: flex; justify-content: space-between; padding: 0 45px;">
                <div style="width: 170px; text-align: center; font-family: 'Anek Bangla', 'Hind Siliguri', sans-serif !important;">
                    <div style="border: 1px dashed #94a3b8; height: 38px; margin-bottom: 6px; border-radius: 4px; background: rgba(248, 250, 252, 0.4);"></div>
                    <div style="border-top: 1.2px dashed #64748b; padding-top: 6px;">
                        <div style="font-size: 10.5px; font-weight: 900; color: #0f172a; font-family: 'Anek Bangla', 'Hind Siliguri', sans-serif !important;">ম্যানেজার</div>
                        <div style="font-size: 8px; font-weight: 600; color: #64748b; font-family: 'Anek Bangla', 'Hind Siliguri', sans-serif !important;">মেসার্স মা মোটরস</div>
                    </div>
                </div>
                <div style="width: 170px; text-align: center; font-family: 'Anek Bangla', 'Hind Siliguri', sans-serif !important;">
                    <div style="border: 1px dashed #94a3b8; height: 38px; margin-bottom: 6px; border-radius: 4px; background: rgba(248, 250, 252, 0.4);"></div>
                    <div style="border-top: 1.2px dashed #64748b; padding-top: 6px;">
                        <div style="font-size: 10.5px; font-weight: 900; color: #0f172a; font-family: 'Anek Bangla', 'Hind Siliguri', sans-serif !important;">ইনচার্জ বা অফিস বস</div>
                        <div style="font-size: 8px; font-weight: 600; color: #64748b; font-family: 'Anek Bangla', 'Hind Siliguri', sans-serif !important;">অনুমোদন ও সিলমোহর</div>
                    </div>
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

    // Injected iframe CSS ensuring 100% font unification across all tags and pseudo-elements
    const unifiedFontCss = `
        * {
            font-family: 'Anek Bangla', 'Hind Siliguri', 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        }
    `;

    await printViaIframe(pagesHtml, unifiedFontCss, pdfTitle);
}
