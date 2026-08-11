import { escapeHTML } from '../../utils/formatters.js';

/**
 * Centralized Store Memo Header Generator
 * Guarantees 1-location update for shop name, logo, address, and Proprietor text across all memos & statements.
 * Features Smart Dual-Order Parameter Detection and Bulletproof Inter/Kalpurush Fonts.
 */

export function renderSharedPrintHeader(arg1 = {}, arg2 = {}) {
    let settings = {};
    let options = {};

    // Smart Dual-Order Parameter Detector (handles both (settings, options) and (options, settings))
    if (arg1 && (arg1.shopName !== undefined || arg1.shopLogo !== undefined || arg1.shopPhone !== undefined || arg1.shopAddress !== undefined)) {
        settings = arg1;
        options = arg2 || {};
    } else if (arg2 && (arg2.shopName !== undefined || arg2.shopLogo !== undefined || arg2.shopPhone !== undefined || arg2.shopAddress !== undefined)) {
        settings = arg2;
        options = arg1 || {};
    } else {
        settings = arg1 || {};
        options = arg2 || {};
    }

    const title = options.title || 'CUSTOMER REPORT';
    const subtitle = options.subtitle || '';
    const dateRangeStr = options.dateRangeStr || '';

    const shopName = escapeHTML(settings.shopName || "M/S. MAA-MOTOR'S");
    const shopOwner = escapeHTML(settings.shopOwner || "Mohammed Amran");
    const shopAddress = escapeHTML(settings.shopAddress || "Shop No. 22, Rahman Tower, 1st Rail Gate, Muradpur, Hathazari Road");
    const shopPhone = escapeHTML(settings.shopPhone || "01819-397669, 01815-707934");
    const shopLogo = settings.shopLogo || "/shop-official-logo.jpg";

    const subtitleText = dateRangeStr ? `সময়কাল: ${dateRangeStr}` : subtitle;

    const logoHtml = `<img src="${shopLogo}" style="width: 100%; height: 100%; object-fit: contain; border-radius: 50%; display: block;" />`;

    return `
        <div style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%) !important; color: #ffffff !important; border-radius: 16px; padding: 18px 24px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 12px rgba(2, 132, 199, 0.25); margin-bottom: 20px; font-family: 'Inter', 'Kalpurush', system-ui, -apple-system, sans-serif !important; -webkit-print-color-adjust: exact; print-color-adjust: exact;">
            <div style="display: flex; align-items: center; gap: 18px;">
                <div style="width: 72px; height: 72px; background: #ffffff !important; border-radius: 50%; display: flex; align-items: center; justify-content: center; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.15); border: 3px solid #ffffff; flex-shrink: 0; padding: 2px;">
                    ${logoHtml}
                </div>
                <div>
                    <h1 style="font-size: 22px; font-weight: 900 !important; margin: 0; text-transform: uppercase; letter-spacing: -0.5px; line-height: 1.1; color: #ffffff !important; font-family: 'Inter', system-ui, -apple-system, sans-serif !important;">${shopName}</h1>
                    <p style="font-size: 11px; margin: 3px 0 2px 0; opacity: 0.95; font-weight: 700 !important; color: #ffffff !important; font-family: 'Inter', system-ui, -apple-system, sans-serif !important;">Proprietor: ${shopOwner}</p>
                    <p style="font-size: 11px; margin: 2px 0 3px 0; opacity: 0.95; font-weight: 600 !important; line-height: 1.3; color: #ffffff !important; max-width: 480px; font-family: 'Kalpurush', 'Hind Siliguri', 'Inter', sans-serif !important;">${shopAddress}</p>
                    <p style="font-size: 11px; margin: 0; font-weight: 800 !important; opacity: 0.95; color: #ffffff !important; font-family: 'Inter', system-ui, -apple-system, sans-serif !important;">Mobile: ${shopPhone}</p>
                </div>
            </div>
            <div style="text-align: right; flex-shrink: 0;">
                <div style="display: inline-block; font-size: 18px; font-weight: 900 !important; text-transform: uppercase; background: rgba(255, 255, 255, 0.18) !important; backdrop-filter: blur(8px); border: 1.5px solid rgba(255, 255, 255, 0.4); padding: 8px 22px; border-radius: 12px; letter-spacing: 1px; color: #ffffff !important; font-family: 'Inter', 'Hind Siliguri', 'Kalpurush', system-ui, -apple-system, sans-serif !important;">${title}</div>
                ${subtitleText ? `<div style="font-size: 10px; font-weight: 700 !important; margin-top: 6px; opacity: 0.95; text-align: right; color: #ffffff !important; font-family: 'Kalpurush', 'Hind Siliguri', 'Inter', sans-serif !important;">${subtitleText}</div>` : ''}
            </div>
        </div>
    `;
}
