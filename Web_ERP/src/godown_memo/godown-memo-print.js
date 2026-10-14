import { formatAmountWithComma, formatAppDate, escapeHTML } from '../utils.js';
import { printViaIframe } from '../utils/smart-print-engine.js';
import { calculateMasterTotals, formatExactBengaliCurrency } from './godown-memo-calc.js';
import { SettingsDAO } from '../dao.js';

/**
 * Print Ultra-High-Definition Master Godown Memo Register on exact 1 A4 Portrait Page
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
    const shopName = escapeHTML(settings.shopName || "মেসার্স মা মোটরস");
    const shopAddress = escapeHTML(settings.shopAddress || "দোকান নং ২২, রহমান টাওয়ার, ১ম রেল গেইট, মুরাদপুর, চট্টগ্রাম");
    const shopPhone = escapeHTML(settings.shopPhone || "০১৮১৯-৩৯৭৬৬৯, ০১৮১৫-৭০৭৯৩৪");

    const rowsHtml = totals.books.map((b, idx) => {
        const gross = Number(b.grossSales) || 0;
        const less = Number(b.totalLess) || 0;
        const net = Number(b.calculatedNetSales || b.netSales) || 0;
        const cum = Number(b.calculatedCumulative || b.cumulativeNetSales) || 0;
        const sDate = b.startDate ? formatAppDate(b.startDate) : '';
        const eDate = b.endDate ? formatAppDate(b.endDate) : '';
        const dateStr = sDate && eDate ? `${sDate} হইতে ${eDate}` : (eDate || sDate || '-');
        const officerName = escapeHTML(b.inChargeName || 'মোঃ এমরান');
        const officerId = escapeHTML(b.inChargeId || '১৯২৫');
        const stampDate = b.stampDate ? formatAppDate(b.stampDate) : eDate;

        return `
            <tr>
                <td style="text-align: center; font-weight: bold; font-family: monospace;">${idx + 1}</td>
                <td style="text-align: center; font-weight: 900; font-family: monospace; color: #0284c7;">${escapeHTML(b.bookNo)}</td>
                <td style="text-align: center; font-size: 8.5px; white-space: nowrap;">${dateStr}</td>
                <td style="text-align: right; font-weight: 800; font-family: monospace; color: #b91c1c;">${formatAmountWithComma(gross)}</td>
                <td style="text-align: right; font-weight: 700; font-family: monospace; color: #7e22ce;">${less > 0 ? formatAmountWithComma(less) : '-'}</td>
                <td style="text-align: right; font-weight: 900; font-family: monospace; color: #047857;">${formatAmountWithComma(net)}</td>
                <td style="text-align: right; font-weight: 800; font-family: monospace; color: #0f172a; background: #f8fafc;">${formatAmountWithComma(cum)}</td>
                <td style="text-align: center; padding: 2px 3px;">
                    <div style="border: 1.5px solid #1e40af; border-radius: 4px; padding: 1.5px 3px; background: #eff6ff; display: inline-block; text-align: center; line-height: 1.15; width: 88px;">
                        <div style="font-size: 7px; font-weight: 900; color: #1e3a8a;">মেসার্স মা মোটরস</div>
                        <div style="font-size: 7.5px; font-weight: 900; color: #1d4ed8;">${officerName}</div>
                        <div style="font-size: 6.5px; font-weight: 800; color: #1e40af;">আই ডি-${officerId}</div>
                        <div style="font-size: 6.5px; font-weight: 700; color: #2563eb;">তারিখ: ${stampDate}</div>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    const htmlContent = `
        <!DOCTYPE html>
        <html lang="bn">
        <head>
            <meta charset="UTF-8">
            <title>গোডাউন_মেমো_বিক্রয়_মাস্টার_রেজিস্টার</title>
            <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700;800;900&family=Inter:wght@400;700;800;900&display=swap" rel="stylesheet">
            <style>
                @page {
                    size: A4 portrait;
                    margin: 7mm 6mm 7mm 6mm;
                }
                * { box-sizing: border-box; }
                body {
                    margin: 0;
                    padding: 0;
                    font-family: 'Hind Siliguri', 'Inter', sans-serif;
                    background: #ffffff;
                    color: #0f172a;
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }
                .container {
                    width: 100%;
                    max-width: 100%;
                    margin: 0 auto;
                }
                .header-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 6px;
                    border-bottom: 2px solid #0f172a;
                    padding-bottom: 4px;
                }
                .title-main {
                    font-size: 19px;
                    font-weight: 900;
                    color: #0f172a;
                    letter-spacing: 0.5px;
                    margin: 0;
                    text-align: center;
                }
                .sub-headline {
                    font-size: 12px;
                    font-weight: 900;
                    color: #1e3a8a;
                    background: #dbeafe;
                    border: 1px solid #93c5fd;
                    border-radius: 4px;
                    padding: 2px 10px;
                    display: inline-block;
                    margin: 3px 0;
                }
                .meta-row {
                    display: flex;
                    justify-content: space-between;
                    font-size: 10px;
                    font-weight: 700;
                    color: #334155;
                    margin-top: 2px;
                }
                .data-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 9.5px;
                    margin-top: 5px;
                }
                .data-table th {
                    background: #0f172a;
                    color: #ffffff;
                    font-weight: 800;
                    padding: 5px 3px;
                    border: 1px solid #0f172a;
                    text-align: center;
                    font-size: 9px;
                }
                .data-table td {
                    border: 1px solid #cbd5e1;
                    padding: 3px 4px;
                    vertical-align: middle;
                }
                .data-table tr:nth-child(even) {
                    background-color: #f8fafc;
                }
                .total-row td {
                    background: #f1f5f9 !important;
                    font-weight: 900 !important;
                    border-top: 2px solid #0f172a !important;
                    border-bottom: 2px solid #0f172a !important;
                    padding: 5px 4px;
                }
                .words-box {
                    margin-top: 6px;
                    background: #f8fafc;
                    border: 1px dashed #94a3b8;
                    border-radius: 6px;
                    padding: 5px 10px;
                    font-size: 10px;
                    font-weight: 700;
                    color: #1e293b;
                }
                .signatures {
                    margin-top: 22px;
                    display: flex;
                    justify-content: space-between;
                    padding: 0 25px;
                }
                .sign-line {
                    border-top: 1.5px solid #475569;
                    padding-top: 3px;
                    font-size: 10.5px;
                    font-weight: 900;
                    color: #0f172a;
                    text-align: center;
                    width: 180px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <table class="header-table">
                    <tr>
                        <td style="text-align: center;">
                            <div class="title-main">${shopName}</div>
                            <div style="font-size: 9px; color: #475569; font-weight: 600;">${shopAddress} • মোবাইল: ${shopPhone}</div>
                            <div class="sub-headline">২/১১/২০২৫ হইতে গোডাউন এর মোট মাল বিক্রয় হিসাব</div>
                            <div class="meta-row">
                                <div><strong>ইনচার্জ:</strong> ১ম তম; মোঃ এমরান (আই ডি-১৯২৫)</div>
                                <div><strong>নথি নং:</strong> ০০০০১</div>
                                <div><strong>প্রিন্ট তারিখ:</strong> ${formatAppDate(new Date().toISOString().split('T')[0])}</div>
                            </div>
                        </td>
                    </tr>
                </table>

                <table class="data-table">
                    <thead>
                        <tr>
                            <th style="width: 26px;">ক্র:</th>
                            <th style="width: 78px;">মেমো বই নং</th>
                            <th style="width: 135px;">তারিখ রেঞ্জ</th>
                            <th style="width: 95px;">মোট বিক্রয়</th>
                            <th style="width: 60px;">লেস</th>
                            <th style="width: 95px;">নিট বিক্রয়</th>
                            <th style="width: 95px;">ক্রমপুঞ্জিত মোট</th>
                            <th style="width: 95px;">সাক্ষর ও সিল</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rowsHtml}
                        <tr class="total-row">
                            <td colspan="3" style="text-align: center; font-weight: 900; font-size: 10.5px;">সর্বমোট হিসাব:</td>
                            <td style="text-align: right; font-weight: 900; font-family: monospace; color: #b91c1c; font-size: 10.5px;">${formatAmountWithComma(totals.totalGross)}</td>
                            <td style="text-align: right; font-weight: 900; font-family: monospace; color: #7e22ce; font-size: 10.5px;">${formatAmountWithComma(totals.totalLess)}</td>
                            <td style="text-align: right; font-weight: 900; font-family: monospace; color: #047857; font-size: 10.5px;">${formatAmountWithComma(totals.totalNet)}</td>
                            <td style="text-align: right; font-weight: 900; font-family: monospace; color: #0f172a; font-size: 10.5px;">${formatAmountWithComma(totals.grandCumulative)}</td>
                            <td style="text-align: center; font-weight: 900; font-size: 8px; color: #1e40af;">১০০% অডিটকৃত</td>
                        </tr>
                    </tbody>
                </table>

                <div class="words-box">
                    <strong>কথায় (নিট বিক্রয়):</strong> ${totals.netInWords}
                </div>

                <div class="signatures">
                    <div class="sign-line">
                        ১ম তম; ইনচার্জ: মোঃ এমরান<br>
                        <span style="font-size: 8.5px; font-weight: 600; color: #475569;">গোডাউন ইনচার্জ (আইডি: ১৯২৫)</span>
                    </div>
                    <div class="sign-line">
                        স্বত্বাধিকারী<br>
                        <span style="font-size: 8.5px; font-weight: 600; color: #475569;">মেসার্স মা মোটরস</span>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `;

    printViaIframe(htmlContent, '', 'Maa_Motors_Godown_Sales_Register_A4_Portrait');
}
