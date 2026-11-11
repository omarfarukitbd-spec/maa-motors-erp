import { SettingsDAO } from '../dao.js';
import { printViaIframe } from '../utils/smart-print-engine.js';
import { numberToBanglaWords } from '../utils/currency-words.js';
import { formatAmountWithComma, formatAppDate, escapeHTML, getTodayLocalDateString, renderPrintHeader } from '../utils.js';
import { getActivePayrollState } from './payroll-actions.js';

/**
 * Print individual employee salary slip / money receipt
 * @param {string} sectionId
 * @param {string} itemId
 */
export async function printEmployeePaySlip(sectionId, itemId) {
    const state = getActivePayrollState();
    if (!state) return;

    const sec = state.sections.find(s => s.id === sectionId);
    if (!sec) return;
    const itm = sec.items.find(i => i.id === itemId);
    if (!itm) return;

    let settings = {};
    try {
        settings = (await SettingsDAO.getAppSettings()) || {};
    } catch (e) {
        console.warn('Settings fetch error:', e);
    }

    const today = formatAppDate(getTodayLocalDateString());
    const monthYear = state.monthYear || '';

    const base = Number(itm.baseSalary || itm.amount) || 0;
    const bonus = Number(itm.bonus) || 0;
    const ded = Number(itm.deduction) || 0;
    const net = Number(itm.amount) || 0;
    const netWords = numberToBanglaWords(net);

    const slipHtml = `
        <div style="width: 100%; max-width: 210mm; margin: 0 auto; padding: 10mm 14mm; font-family: 'Anek Bangla', 'Hind Siliguri', 'Inter', sans-serif !important; color: #0f172a; background: #ffffff; box-sizing: border-box;">
            ${renderPrintHeader(settings, { title: 'কর্মী বেতন ভাউচার', pageLabel: 'মাস', pageNo: monthYear || today })}
            <div style="border: 1.5px solid #0f172a; border-radius: 8px; padding: 14px; background: #ffffff;">
            <div style="display:flex; justify-content:space-between; font-size:9px; color:#475569; margin-bottom:8px; padding-bottom:4px; border-bottom:1px dashed #cbd5e1;">
                <span>প্রিন্ট তারিখ: <strong>${today}</strong></span>
                <span>বেতনের মাস: <strong style="color:#0369a1;">${escapeHTML(monthYear || today)}</strong></span>
            </div>

            <!-- Employee Info -->
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 6px 10px; margin-bottom: 10px; font-size: 9px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
                    <span>কর্মীর নাম: <strong style="font-size: 11px; color: #0f172a;">${escapeHTML(itm.name)}</strong></span>
                    <span>শাখা: <strong>${escapeHTML(sec.title.split('(')[0].trim())}</strong></span>
                </div>
                <div style="color: #64748b; font-size: 8px;">বিবরণ: ${escapeHTML(itm.details || 'মাসিক নির্ধারিত বেতন')}</div>
            </div>

            <!-- Salary Details Breakdown Table -->
            <table style="width: 100%; border-collapse: collapse; font-size: 9px; margin-bottom: 10px;">
                <thead>
                    <tr style="background: #0f172a; color: #ffffff;">
                        <th style="padding: 4px 6px; text-align: left; border: 1px solid #0f172a;">বেতনের বিবরণ</th>
                        <th style="padding: 4px 6px; text-align: right; border: 1px solid #0f172a;">টাকার পরিমাণ</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="padding: 4px 6px; border: 1px solid #cbd5e1;">১. মূল নির্ধারিত বেতন (Basic)</td>
                        <td style="padding: 4px 6px; border: 1px solid #cbd5e1; text-align: right; font-weight: bold;">৳ ${formatAmountWithComma(base)}</td>
                    </tr>
                    ${bonus > 0 ? `
                    <tr>
                        <td style="padding: 4px 6px; border: 1px solid #cbd5e1; color: #16a34a;">২. অতিরিক্ত বোনাস / ভাতা (+)</td>
                        <td style="padding: 4px 6px; border: 1px solid #cbd5e1; text-align: right; font-weight: bold; color: #16a34a;">৳ ${formatAmountWithComma(bonus)}</td>
                    </tr>
                    ` : ''}
                    ${ded > 0 ? `
                    <tr>
                        <td style="padding: 4px 6px; border: 1px solid #cbd5e1; color: #dc2626;">৩. অগ্রিম বা ঋণ কর্তন (-)</td>
                        <td style="padding: 4px 6px; border: 1px solid #cbd5e1; text-align: right; font-weight: bold; color: #dc2626;">- ৳ ${formatAmountWithComma(ded)}</td>
                    </tr>
                    ` : ''}
                    <tr style="background: #f0fdf4; font-weight: 900; font-size: 11px;">
                        <td style="padding: 5px 6px; border: 1px solid #86efac; color: #15803d;">সর্বমোট নিট প্রদেয় বেতন (Net Payable)</td>
                        <td style="padding: 5px 6px; border: 1px solid #86efac; text-align: right; color: #15803d;">৳ ${formatAmountWithComma(net)}</td>
                    </tr>
                </tbody>
            </table>

            <!-- Words & Method -->
            <div style="background: #f8fafc; border: 1px dashed #94a3b8; border-radius: 6px; padding: 5px 8px; font-size: 8.5px; margin-bottom: 16px;">
                <div>কথায়: <strong style="color: #15803d;">${netWords}</strong></div>
                <div style="color: #64748b; font-size: 7.5px; margin-top: 2px;">পেমেন্ট পদ্ধতি: <strong>${escapeHTML(itm.paymentMethod || 'Cash')}</strong> (${escapeHTML(itm.paymentAccount || 'ক্যাশ')})</div>
            </div>

            <!-- Signatures with Empty Seal Boxes for Offline Stamping -->
            <div style="display: flex; justify-content: space-between; padding: 0 24px; margin-top: 48px;">
                <div style="width: 170px; text-align: center;">
                    <div style="border: 1px dashed #94a3b8; height: 36px; border-radius: 4px; margin-bottom: 6px; display: flex; align-items: center; justify-content: center; font-size: 7.5px; color: #94a3b8;">
                        (কর্মীর স্বাক্ষর / টিপসহি)
                    </div>
                    <div style="border-top: 1.2px dashed #64748b; padding-top: 5px; font-size: 9.5px; font-weight: bold; color: #1e293b;">
                        কর্মীর স্বাক্ষর ও প্রাপ্তিস্বীকার
                    </div>
                </div>
                <div style="width: 170px; text-align: center;">
                    <div style="border: 1px dashed #94a3b8; height: 36px; border-radius: 4px; margin-bottom: 6px; display: flex; align-items: center; justify-content: center; font-size: 7.5px; color: #94a3b8;">
                        (অফিস সিলমোহর)
                    </div>
                    <div style="border-top: 1.2px dashed #64748b; padding-top: 5px; font-size: 9.5px; font-weight: bold; color: #1e293b;">
                        অনুমোদন ও অফিস সিলমোহর
                    </div>
                </div>
            </div>
            </div>
        </div>
    `;

    const extraCss = `
        * { font-family: 'Anek Bangla', 'Hind Siliguri', 'Inter', sans-serif !important; }
        @page { size: A4 portrait; margin: 0 !important; }
    `;

    await printViaIframe(slipHtml, extraCss, `বেতন_ভাউচার_${itm.name}_${monthYear}`);
}
