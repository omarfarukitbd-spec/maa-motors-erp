import { SettingsDAO } from '../dao.js';
import { printViaIframe } from '../utils/smart-print-engine.js';
import { calculatePayrollSummary } from './payroll-calc.js';
import { formatAmountWithComma, formatAppDate, escapeHTML, getTodayLocalDateString, renderPrintHeader } from '../utils.js';

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

    const fullHtml = `
        <!-- PAGE 1: Commercial Operations -->
        <div class="print-page spe-page" style="width: 100%; box-sizing: border-box; page-break-after: always; break-after: page; padding: 10mm 12mm; background: #ffffff;">
            ${renderPrintHeader(settings, { title: 'মাসিক সামগ্রিক ব্যয় ও বেতন রেজিস্টার', pageLabel: 'পৃষ্ঠা', pageNo: '০১/০২' })}
            <div style="font-size: 8.5px; color: #0f172a; font-weight: bold; margin-bottom: 6px; padding: 4px 8px; background: #f8fafc; border: 1px solid #cbd5e1; border-left: 3px solid #0284c7; border-radius: 4px; display: flex; justify-content: space-between;">
                <span>বাণিজ্যিক শাখা: ডুবাই অপারেশন, শোরুম দোকান ও গোডাউন কর্মী বেতন ও ব্যয়</span>
                <span>মাস: <strong>${escapeHTML(monthYear)}</strong> • তারিখ: ${reportDate}</span>
            </div>
            ${renderSectionTable(page1Sections, 1)}
        </div>

        <!-- PAGE 2: Residence & Other Expenses + Final Balance -->
        <div class="print-page spe-page" style="width: 100%; box-sizing: border-box; padding: 10mm 12mm; background: #ffffff;">
            ${renderPrintHeader(settings, { title: 'মাসিক সামগ্রিক ব্যয় ও বেতন রেজিস্টার', pageLabel: 'পৃষ্ঠা', pageNo: '০২/০২' })}
            <div style="font-size: 8.5px; color: #0f172a; font-weight: bold; margin-bottom: 6px; padding: 4px 8px; background: #f8fafc; border: 1px solid #cbd5e1; border-left: 3px solid #0284c7; border-radius: 4px; display: flex; justify-content: space-between;">
                <span>আবাসিক শাখা: নিজ বাড়ি, নতুন বাড়ি, গৃহকর্মী/শিক্ষক বেতন ও ব্যবসায়িক লভ্যাংশ</span>
                <span>মাস: <strong>${escapeHTML(monthYear)}</strong> • তারিখ: ${reportDate}</span>
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

            <!-- Signatures with Empty Seal Boxes for Offline Stamping -->
            <div class="print-sig-block" style="display: flex; justify-content: space-between; padding: 6px 45px 0 45px; margin-top: 30px; break-inside: avoid; page-break-inside: avoid;">
                <div style="width: 170px; text-align: center;">
                    <div style="border: 1px dashed #94a3b8; height: 38px; border-radius: 4px; margin-bottom: 6px; display: flex; align-items: center; justify-content: center; font-size: 7.5px; color: #94a3b8;">
                        (ম্যানেজার সিলমোহর ও স্বাক্ষর)
                    </div>
                    <div style="border-top: 1.2px dashed #64748b; padding-top: 6px;">
                        <div style="font-size: 10px; font-weight: 900; color: #0f172a;">ম্যানেজার</div>
                        <div style="font-size: 7.5px; color: #64748b;">মেসার্স মা মোটরস</div>
                    </div>
                </div>
                <div style="width: 170px; text-align: center;">
                    <div style="border: 1px dashed #94a3b8; height: 38px; border-radius: 4px; margin-bottom: 6px; display: flex; align-items: center; justify-content: center; font-size: 7.5px; color: #94a3b8;">
                        (অফিস বস সিলমোহর ও অনুমোদন)
                    </div>
                    <div style="border-top: 1.2px dashed #64748b; padding-top: 6px;">
                        <div style="font-size: 10px; font-weight: 900; color: #0f172a;">ইনচার্জ বা অফিস বস</div>
                        <div style="font-size: 7.5px; color: #64748b;">অনুমোদন ও চূড়ান্ত সিদ্ধান্ত</div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const unifiedFontCss = `
        * {
            font-family: 'Anek Bangla', 'Hind Siliguri', 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
            box-sizing: border-box;
        }
        @page { size: A4 portrait; margin: 0 !important; }
        body { margin: 0 !important; padding: 0 !important; }
    `;

    await printViaIframe(fullHtml, unifiedFontCss, `মাসিক_বেতন_ও_খরচ_${monthYear}`);
}
