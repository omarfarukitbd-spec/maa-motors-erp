import { SettingsDAO } from '../dao.js';
import { printViaIframe } from '../utils/smart-print-engine.js';
import { numberToBanglaWords } from '../utils/currency-words.js';
import { formatAmountWithComma, formatAppDate, escapeHTML, getTodayLocalDateString } from '../utils.js';
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

    const shopName = escapeHTML(settings.shopName || "M/S. MAA-MOTOR'S");
    const shopOwner = escapeHTML(settings.shopOwner || "Mohammed Amran");
    const shopAddress = escapeHTML(settings.shopAddress || "Shop No. 22, Rahman Tower, 1st Rail Gate, Muradpur, Hathazari Road");
    const shopPhone = escapeHTML(settings.shopPhone || "01819-397669, 01815-707934");
    const shopLogo = settings.shopLogo || "/shop-official-logo.jpg";
    const today = formatAppDate(getTodayLocalDateString());
    const monthYear = state.monthYear || '';

    const base = Number(itm.baseSalary || itm.amount) || 0;
    const bonus = Number(itm.bonus) || 0;
    const ded = Number(itm.deduction) || 0;
    const net = Number(itm.amount) || 0;
    const netWords = numberToBanglaWords(net);

    const slipHtml = `
        <div style="width: 100%; max-width: 500px; margin: 0 auto; padding: 15px; border: 2px solid #0f172a; border-radius: 8px; font-family: 'Hind Siliguri', 'Inter', sans-serif !important; color: #0f172a; background: #ffffff;">
            <!-- Header -->
            <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #0284c7; padding-bottom: 8px; margin-bottom: 10px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <img src="${shopLogo}" style="width: 44px; height: 44px; border-radius: 50%; border: 1px solid #cbd5e1;" />
                    <div>
                        <div style="font-size: 15px; font-weight: 900; color: #0284c7; text-transform: uppercase;">${shopName}</div>
                        <div style="font-size: 8px; color: #475569;">মোবাইল: ${shopPhone}</div>
                        <div style="font-size: 7.5px; color: #64748b;">${shopAddress}</div>
                    </div>
                </div>
                <div style="text-align: right;">
                    <span style="font-size: 9px; font-weight: 900; background: #e0f2fe; color: #0369a1; padding: 2px 8px; border-radius: 4px; border: 1px solid #bae6fd;">বেতন ভাউচার</span>
                    <div style="font-size: 8px; color: #64748b; margin-top: 3px;">তারিখ: <strong>${today}</strong></div>
                    <div style="font-size: 8px; color: #0369a1; font-weight: bold;">মাস: ${monthYear}</div>
                </div>
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
            <div style="display: flex; justify-content: space-between; padding: 0 20px; margin-top: 20px;">
                <div style="width: 140px; text-align: center;">
                    <div style="border: 1px dashed #94a3b8; height: 34px; border-radius: 4px; margin-bottom: 4px; display: flex; align-items: center; justify-content: center; font-size: 7px; color: #94a3b8;">
                        (কর্মীর স্বাক্ষর / টিপসহি)
                    </div>
                    <div style="border-top: 1px dashed #475569; padding-top: 3px; font-size: 8.5px; font-weight: bold;">
                        কর্মীর স্বাক্ষর ও প্রাপ্তিস্বীকার
                    </div>
                </div>
                <div style="width: 140px; text-align: center;">
                    <div style="border: 1px dashed #94a3b8; height: 34px; border-radius: 4px; margin-bottom: 4px; display: flex; align-items: center; justify-content: center; font-size: 7px; color: #94a3b8;">
                        (অফিস সিলমোহর)
                    </div>
                    <div style="border-top: 1px dashed #475569; padding-top: 3px; font-size: 8.5px; font-weight: bold;">
                        অনুমোদন ও অফিস সিলমোহর
                    </div>
                </div>
            </div>
        </div>
    `;

    const extraCss = `
        * { font-family: 'Hind Siliguri', 'Inter', sans-serif !important; }
        @page { size: auto; margin: 10mm !important; }
    `;

    await printViaIframe(slipHtml, extraCss, `বেতন_ভাউচার_${itm.name}_${monthYear}`);
}
