import { SettingsDAO } from '../dao.js';
import { printViaIframe } from '../utils/smart-print-engine.js';
import { calculatePayrollSummary } from './payroll-calc.js';
import { formatAmountWithComma, formatAppDate, escapeHTML, getTodayLocalDateString } from '../utils.js';

/**
 * Print Ultra-High-Definition Master Payroll & Monthly Expense Report
 * With 2-page balanced layout and 100% unified Hind Siliguri typography
 * @param {Object} state
 */
export async function printPayrollMasterReport(state) {
    if (!state || !state.sections) return;

    let settings = {};
    try {
        settings = (await SettingsDAO.getAppSettings()) || {};
    } catch (e) {
        console.warn('Settings fetch error:', e);
    }

    const summary = calculatePayrollSummary(state.sections, state.aedRate);
    const shopName = escapeHTML(settings.shopName || "M/S. MAA-MOTOR'S");
    const shopOwner = escapeHTML(settings.shopOwner || "Mohammed Amran");
    const shopAddress = escapeHTML(settings.shopAddress || "Shop No. 22, Rahman Tower, 1st Rail Gate, Muradpur, Hathazari Road");
    const shopPhone = escapeHTML(settings.shopPhone || "01819-397669, 01815-707934");
    const shopLogo = settings.shopLogo || "/shop-official-logo.jpg";
    const reportDate = formatAppDate(getTodayLocalDateString());
    const monthYear = state.monthYear || '২০২৬-১০';

    // Page 1 Sections: Dubai (1), Shop (2), Godown (3)
    const page1Sections = summary.sections.slice(0, 3);
    // Page 2 Sections: House (4), New House (5), Other (6)
    const page2Sections = summary.sections.slice(3, 6);

    const renderSectionTable = (sectionsList, startIdx = 1) => {
        return sectionsList.map(sec => {
            const rowsHtml = (sec.items || []).map((itm, i) => {
                const bg = i % 2 === 1 ? 'background: #f8fafc;' : 'background: #ffffff;';
                const statusBadge = itm.status === 'paid'
                    ? '<span style="color: #16a34a; font-weight: bold; font-size: 7.5px;">পরিশোধিত</span>'
                    : '<span style="color: #d97706; font-weight: bold; font-size: 7.5px;">বকেয়া</span>';

                return `
                    <tr style="${bg}">
                        <td style="text-align: center; border: 1px solid #cbd5e1; padding: 3px 2px; font-size: 8px; font-weight: bold;">${escapeHTML(itm.sl || String(i + 1))}</td>
                        <td style="text-align: left; border: 1px solid #cbd5e1; padding: 3px 5px; font-size: 8.5px; font-weight: bold; color: #0f172a;">${escapeHTML(itm.name)}</td>
                        <td style="text-align: left; border: 1px solid #cbd5e1; padding: 3px 5px; font-size: 8px; color: #475569;">${escapeHTML(itm.details || '-')}</td>
                        <td style="text-align: center; border: 1px solid #cbd5e1; padding: 3px 2px; font-size: 7.5px; color: #64748b;">${escapeHTML(itm.paymentAccount || itm.paymentMethod || 'ক্যাশ')}</td>
                        <td style="text-align: center; border: 1px solid #cbd5e1; padding: 3px 2px;">${statusBadge}</td>
                        <td style="text-align: right; border: 1px solid #cbd5e1; padding: 3px 6px; font-size: 8.5px; font-weight: 900; color: #b91c1c; white-space: nowrap;">৳ ${formatAmountWithComma(itm.amount)}</td>
                    </tr>
                `;
            }).join('');

            return `
                <div style="margin-bottom: 6px; break-inside: avoid; page-break-inside: avoid;">
                    <div style="background: #0f172a; color: #ffffff; padding: 3px 8px; font-size: 8.5px; font-weight: 900; display: flex; justify-content: space-between; align-items: center; border-radius: 4px 4px 0 0;">
                        <span>${escapeHTML(sec.title)}</span>
                        <span style="color: #38bdf8;">উপ-মোট: ৳ ${formatAmountWithComma(sec.subTotal)}</span>
                    </div>
                    <table style="width: 100%; border-collapse: collapse; font-size: 8px;">
                        <thead>
                            <tr style="background: #f1f5f9; color: #334155; font-weight: 800;">
                                <th style="border: 1px solid #cbd5e1; padding: 3px 2px; width: 28px; text-align: center;">নং</th>
                                <th style="border: 1px solid #cbd5e1; padding: 3px 5px; width: 140px; text-align: left;">নাম / খাত</th>
                                <th style="border: 1px solid #cbd5e1; padding: 3px 5px; text-align: left;">বিবরণ / নোট</th>
                                <th style="border: 1px solid #cbd5e1; padding: 3px 2px; width: 75px; text-align: center;">পেমেন্ট ফান্ড</th>
                                <th style="border: 1px solid #cbd5e1; padding: 3px 2px; width: 50px; text-align: center;">স্ট্যাটাস</th>
                                <th style="border: 1px solid #cbd5e1; padding: 3px 6px; width: 85px; text-align: right;">পরিমাণ (টাকা)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rowsHtml}
                        </tbody>
                    </table>
                </div>
            `;
        }).join('');
    };

    const headerBannerHtml = (subTitle, pageNo) => `
        <div style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%) !important; color: #ffffff !important; border-radius: 8px; padding: 6px 12px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; -webkit-print-color-adjust: exact; print-color-adjust: exact;">
            <div style="display: flex; align-items: center; gap: 8px;">
                <img src="${shopLogo}" style="width: 38px; height: 38px; border-radius: 50%; border: 1.5px solid #ffffff; background: #ffffff;" />
                <div>
                    <h1 style="font-size: 14px; font-weight: 900; margin: 0; text-transform: uppercase; color: #ffffff;">${shopName}</h1>
                    <p style="font-size: 8px; margin: 0; color: #e0f2fe; font-weight: 700;">Proprietor: ${shopOwner} • Mobile: ${shopPhone}</p>
                    <p style="font-size: 7.5px; margin: 0; color: #f0f9ff; opacity: 0.9;">${shopAddress}</p>
                </div>
            </div>
            <div style="text-align: right;">
                <div style="font-size: 10px; font-weight: 900; background: rgba(255,255,255,0.2); padding: 2px 8px; border-radius: 4px; display: inline-block;">মাসিক সামগ্রিক ব্যয় ও বেতন বিবরণী</div>
                <div style="font-size: 8px; color: #e0f2fe; margin-top: 2px;">মাস: <strong>${monthYear}</strong> • তারিখ: ${reportDate} • পৃষ্ঠা: ${pageNo}/২</div>
            </div>
        </div>
    `;

    const fullHtml = `
        <!-- PAGE 1: Commercial Operations -->
        <div class="print-page" style="width: 100%; box-sizing: border-box; page-break-after: always; break-after: page; padding: 10mm 12mm; background: #ffffff;">
            ${headerBannerHtml('বাণিজ্যিক ও অপারেশনাল লেয়ার — ১ম পাতা', 1)}
            <div style="font-size: 8px; color: #64748b; font-weight: bold; margin-bottom: 4px; display: flex; justify-content: space-between;">
                <span>বাণিজ্যিক শাখা: ডুবাই অপারেশন, শোরুম দোকান ও গোডাউন কর্মী বেতন ও ব্যয়</span>
                <span>(চলবে ২য় পাতায়...)</span>
            </div>
            ${renderSectionTable(page1Sections, 1)}
        </div>

        <!-- PAGE 2: Residence & Other Expenses + Final Balance -->
        <div class="print-page" style="width: 100%; box-sizing: border-box; padding: 10mm 12mm; background: #ffffff;">
            ${headerBannerHtml('পারিবারিক, ব্যক্তিগত ও অন্যান্য লেয়ার — ২য় পাতা', 2)}
            <div style="font-size: 8px; color: #64748b; font-weight: bold; margin-bottom: 4px;">
                <span>আবাসিক শাখা: নিজ বাড়ি, নতুন বাড়ি, গৃহকর্মী/শিক্ষক বেতন ও ব্যবসায়িক লভ্যাংশ</span>
            </div>
            ${renderSectionTable(page2Sections, 4)}

            <!-- Master Closing Summary Matrix -->
            <div style="margin-top: 6px; border: 1.5px solid #0f172a; border-radius: 6px; overflow: hidden; break-inside: avoid; page-break-inside: avoid;">
                <div style="background: #0f172a; color: #ffffff; padding: 4px 8px; font-size: 9px; font-weight: 900; display: flex; justify-content: space-between;">
                    <span>মাসিক সর্বমোট বাজেট ও সমাপনী হিসাব:</span>
                    <span style="color: #4ade80;">সর্বমোট নিট ব্যয়: ৳ ${formatAmountWithComma(summary.grandTotal)}</span>
                </div>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; padding: 5px; background: #f8fafc; font-size: 8.5px;">
                    <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 4px; padding: 3px 6px; text-align: center;">
                        <div style="color: #64748b; font-size: 7.5px;">সর্বমোট প্রদেয় বাজেট</div>
                        <div style="font-size: 11px; font-weight: 900; color: #0284c7;">৳ ${formatAmountWithComma(summary.grandTotal)}</div>
                    </div>
                    <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 4px; padding: 3px 6px; text-align: center;">
                        <div style="color: #16a34a; font-size: 7.5px;">এ পর্যন্ত পরিশোধিত (Paid)</div>
                        <div style="font-size: 11px; font-weight: 900; color: #16a34a;">৳ ${formatAmountWithComma(summary.totalPaid)}</div>
                    </div>
                    <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 4px; padding: 3px 6px; text-align: center;">
                        <div style="color: #d97706; font-size: 7.5px;">অবশিষ্ট বকেয়া (Pending)</div>
                        <div style="font-size: 11px; font-weight: 900; color: #d97706;">৳ ${formatAmountWithComma(summary.totalPending)}</div>
                    </div>
                </div>
                <div style="padding: 4px 8px; background: #ffffff; border-top: 1px solid #e2e8f0; font-size: 8.5px;">
                    কথায়: <strong style="color: #15803d;">${summary.grandTotalInWords}</strong>
                </div>
            </div>

            <!-- Signatures -->
            <div style="display: flex; justify-content: space-between; padding: 0 45px; margin-top: 25px; break-inside: avoid; page-break-inside: avoid;">
                <div style="border-top: 1.5px dashed #475569; width: 170px; text-align: center; padding-top: 4px;">
                    <div style="font-size: 10px; font-weight: 900; color: #0f172a;">ম্যানেজার</div>
                    <div style="font-size: 7.5px; color: #64748b;">মেসার্স মা মোটরস</div>
                </div>
                <div style="border-top: 1.5px dashed #475569; width: 170px; text-align: center; padding-top: 4px;">
                    <div style="font-size: 10px; font-weight: 900; color: #0f172a;">ইনচার্জ বা অফিস বস</div>
                    <div style="font-size: 7.5px; color: #64748b;">অনুমোদন ও সিলমোহর</div>
                </div>
            </div>
        </div>
    `;

    const unifiedFontCss = `
        * {
            font-family: 'Hind Siliguri', 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
            box-sizing: border-box;
        }
        @page { size: A4 portrait; margin: 0 !important; }
        body { margin: 0 !important; padding: 0 !important; }
    `;

    await printViaIframe(fullHtml, unifiedFontCss, `মাসিক_বেতন_ও_খরচ_${monthYear}`);
}
