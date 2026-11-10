import { escapeHTML } from '../../utils/formatters.js';

/**
 * Mother PDF & Print Header Engine — Official Corporate Design of MAA MOTORS
 * Generates an executive corporate A4 banner header matching the official Mother Design.
 * Features:
 * - Dynamic category badge and register sheet number (Image 3)
 * - Official circular app logo from Settings/public assets (Image 2)
 * - Pure SVG Japanese car brand vector logos (Mitsubishi & Toyota)
 * - Crisp floating ribbon contact strip with location and phone icons
 * - High-end typography powered by Anek Bangla Google Font
 * - 100% offline-ready & print-color-adjust enforced
 */

function toBengaliNumerals(val) {
    if (val === undefined || val === null) return '০০০১';
    const str = String(val).trim();
    const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    if (/^\d+$/.test(str)) {
        const padded = str.length < 4 ? str.padStart(4, '0') : str;
        return padded.replace(/\d/g, d => bnDigits[Number(d)]);
    }
    return str.replace(/\d/g, d => bnDigits[Number(d)]);
}

function formatTwoToneText(rawText, primaryColor = '#ffdf00', secondaryColor = '#ffffff') {
    if (!rawText) return '';
    const match = rawText.match(/^(.*?)\s*(\(.*?\))\s*$/);
    if (match) {
        const primary = escapeHTML(match[1].trim());
        const secondary = escapeHTML(match[2].trim());
        return `<span style="color: ${primaryColor} !important;">${primary}</span> <span style="color: ${secondaryColor} !important; font-size: 0.88em; font-weight: 700;">${secondary}</span>`;
    }
    return `<span style="color: ${primaryColor} !important;">${escapeHTML(rawText)}</span>`;
}

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

    const title = options.title || 'ডুবাই টাকা পাঠানোর হিসাব বুক';
    const pageLabel = options.pageLabel || 'রেজিস্টার খাতা পাতা';
    const rawPageNo = options.pageNo || options.sheetNo || options.invoiceNo || options.subtitle || '০০০১';
    const pageNo = toBengaliNumerals(rawPageNo);
    const hideRightPill = Boolean(options.hideRightPill);

    const rawShopName = settings.shopName || "মেসার্স মা মোটরস (M/S. MAA-MOTOR'S)";
    const rawShopOwner = settings.shopOwner || "মোহাম্মদ এমরান (Mohammed Amran)";
    const shopAddress = escapeHTML(settings.shopAddress || "দোকান নং-২২, রহমান টাওয়ার, ১ নং রেইল গেইট, মুরাদপুর, হাটহাজারী রোড, চট্টগ্রাম।");
    const shopPhone = escapeHTML(settings.shopPhone || "01819-397669, 01815-707934");
    const shopLogo = settings.shopLogo || "/shop-official-logo.png";

    const shopNameHtml = formatTwoToneText(rawShopName, '#ffdf00', '#ffffff');
    const shopOwnerHtml = formatTwoToneText(rawShopOwner, '#ffdf00', '#ffffff');

    const isBengaliTitle = /[^\x00-\x7F]/.test(title);
    const titleFontFamily = isBengaliTitle ? "'Anek Bangla', 'Hind Siliguri', sans-serif !important;" : "'Inter', 'Segoe UI', Arial, sans-serif !important;";
    const titleFontSize = title.length > 25 ? '10px' : (title.length > 18 ? '11px' : '11.5px');

    return `
        <div class="mother-print-header" style="
            background: linear-gradient(90deg, #024ea2 0%, #0056b8 36%, #00459e 70%, #002d72 100%) !important;
            border-radius: 14px;
            padding: 9px 14px 7px 14px;
            color: #ffffff !important;
            position: relative;
            overflow: hidden;
            box-shadow: 0 3px 12px rgba(2, 78, 162, 0.25);
            margin-bottom: 8px;
            box-sizing: border-box !important;
            font-family: 'Anek Bangla', 'Hind Siliguri', 'Inter', system-ui, -apple-system, sans-serif !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        ">
            <!-- Decorative Luminous Accent Waves at bottom right corner (Image 1) -->
            <div style="position: absolute; right: 0; bottom: 0; width: 155px; height: 46px; background: radial-gradient(ellipse at bottom right, rgba(236, 72, 153, 0.6) 0%, rgba(6, 182, 212, 0.5) 45%, transparent 75%); pointer-events: none; z-index: 1;"></div>

            <!-- Top Row: Logo, Shop Details, Car Brands, and Dynamic Badge -->
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; position: relative; z-index: 2;">
                <!-- Left: Circular App Logo from Settings -->
                <div style="display: flex; align-items: center; gap: 8px; flex-shrink: 0;">
                    <div style="width: 60px; height: 60px; min-width: 60px; background: #ffffff !important; border-radius: 50%; display: flex; align-items: center; justify-content: center; overflow: hidden; border: 2px solid #ffffff; box-shadow: 0 2px 6px rgba(0,0,0,0.25); padding: 1px;">
                        <img src="${shopLogo}" alt="Maa Motors Official Logo" style="width: 100%; height: 100%; object-fit: contain; border-radius: 50%; display: block;" />
                    </div>
                    <div style="width: 1.5px; height: 52px; background: rgba(255, 255, 255, 0.45); margin: 0 2px;"></div>
                </div>

                <!-- Center: Business Branding -->
                <div style="flex-grow: 1; min-width: 0; padding-left: 2px;">
                    <!-- Shop Name: Bengali in Golden Yellow, English in White -->
                    <h1 style="font-size: 20.5px; font-weight: 800 !important; margin: 0 0 2px 0; text-shadow: 0 1px 3px rgba(0,0,0,0.5); letter-spacing: -0.2px; line-height: 1.15; font-family: 'Anek Bangla', 'Hind Siliguri', sans-serif !important; white-space: nowrap;">
                        ${shopNameHtml}
                    </h1>
                    <!-- Subtitle in White Rounded Pill with Navy Text -->
                    <div style="display: inline-block; background: #ffffff !important; color: #001a70 !important; border-radius: 14px; padding: 1.5px 8.5px; font-size: 8.5px; font-weight: 700 !important; margin-bottom: 3px; box-shadow: 0 1px 2px rgba(0,0,0,0.15); line-height: 1.25; font-family: 'Anek Bangla', sans-serif !important; white-space: nowrap;">
                        জাতীয় জাপানি কার ও মাইক্রোবাসের রিকন্ডিশন ইঞ্জিন ও পার্টস বিক্রয় করা হয়।
                    </div>
                    <!-- Proprietor with Red Badge & Two-Tone Name -->
                    <div style="display: flex; align-items: center; gap: 5px; font-size: 11.5px; line-height: 1.2;">
                        <span style="background: #e11d48 !important; color: #ffffff !important; border-radius: 4px; padding: 1px 6px; font-size: 9.5px; font-weight: 800 !important; letter-spacing: 0.2px; white-space: nowrap; font-family: 'Anek Bangla', sans-serif !important;">
                            প্রোপাইটর:
                        </span>
                        <span style="text-shadow: 0 1px 2px rgba(0,0,0,0.3); font-size: 11.5px; font-weight: 800 !important; white-space: nowrap; font-family: 'Anek Bangla', 'Hind Siliguri', sans-serif !important;">
                            ${shopOwnerHtml}
                        </span>
                    </div>
                </div>

                <!-- Middle-Right: Pure SVG Japanese Car Brand Vectors (Mitsubishi & Toyota) -->
                <div style="display: flex; align-items: center; gap: 12px; margin: 0 8px 0 14px; flex-shrink: 0;">
                    <!-- Mitsubishi Brand Vector -->
                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
                        <svg width="23" height="19" viewBox="0 0 30 25" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block;">
                            <polygon points="15,0 20,8.66 15,17.32 10,8.66" fill="#e11d48"/>
                            <polygon points="10,8.66 15,17.32 10,25.98 5,17.32" fill="#e11d48"/>
                            <polygon points="20,8.66 25,17.32 20,25.98 15,17.32" fill="#e11d48"/>
                        </svg>
                        <span style="font-size: 6px; font-weight: 800; color: #ffffff; letter-spacing: 0.6px; margin-top: 1px; font-family: 'Inter', sans-serif;">MITSUBISHI</span>
                    </div>

                    <!-- Toyota Brand Vector -->
                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
                        <svg width="23" height="18" viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block;">
                            <ellipse cx="16" cy="12" rx="15" ry="11" stroke="#ffffff" stroke-width="1.8"/>
                            <ellipse cx="16" cy="8.5" rx="9" ry="5.5" stroke="#ffffff" stroke-width="1.5"/>
                            <ellipse cx="16" cy="12" rx="4.5" ry="9" stroke="#ffffff" stroke-width="1.5"/>
                        </svg>
                        <span style="font-size: 6px; font-weight: 800; color: #ffffff; letter-spacing: 0.6px; margin-top: 1px; font-family: 'Inter', sans-serif;">TOYOTA</span>
                    </div>
                </div>

                <!-- Separator line before Category badge -->
                <div style="width: 1.5px; height: 50px; background: rgba(255, 255, 255, 0.45); margin: 0 4px; flex-shrink: 0;"></div>

                <!-- Far-Right: Dynamic Category Badge & Sheet Indicator (Image 3) -->
                ${hideRightPill ? '' : `
                <div style="text-align: right; flex-shrink: 0; min-width: 145px;">
                    <!-- Category Title in White Pill with Red Border -->
                    <div style="
                        background: #ffffff !important;
                        color: #001a70 !important;
                        border: 2.2px solid #ef4444 !important;
                        border-radius: 7px;
                        padding: 3.5px 10px;
                        font-size: ${titleFontSize};
                        font-weight: 900 !important;
                        letter-spacing: 0.2px;
                        text-align: center;
                        box-shadow: 0 1px 4px rgba(0,0,0,0.18);
                        white-space: nowrap;
                        font-family: ${titleFontFamily};
                    ">
                        ${title}
                    </div>

                    <!-- Register Page / Sheet Number Indicator -->
                    <div style="display: flex; align-items: center; justify-content: flex-end; gap: 4px; margin-top: 3.5px;">
                        <span style="color: #ffffff !important; font-size: 10px; font-weight: 700 !important; text-shadow: 0 1px 2px rgba(0,0,0,0.3); font-family: 'Anek Bangla', sans-serif !important; white-space: nowrap;">
                            ${pageLabel}:
                        </span>
                        <span style="
                            background: #ffdf00 !important;
                            color: #000000 !important;
                            border-radius: 12px;
                            padding: 1px 9px;
                            font-size: 11px;
                            font-weight: 900 !important;
                            font-family: 'Anek Bangla', 'Inter', monospace !important;
                            line-height: 1.2;
                            white-space: nowrap;
                            box-shadow: 0 1px 2px rgba(0,0,0,0.2);
                        ">
                            ${pageNo}
                        </span>
                    </div>
                </div>
                `}
            </div>

            <!-- Bottom Row: Floating Light-Blue Ribbon Contact Strip (Image 1) -->
            <div style="
                background: linear-gradient(90deg, #ffffff 0%, #e0f2fe 50%, #ffffff 100%) !important;
                border-radius: 9999px;
                padding: 3px 14px;
                margin-top: 6px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                color: #002d72 !important;
                font-size: 9px;
                font-weight: 700 !important;
                box-shadow: 0 1px 4px rgba(0,0,0,0.12);
                border: 1px solid #7dd3fc;
                position: relative;
                z-index: 2;
                white-space: nowrap;
                font-family: 'Anek Bangla', 'Inter', sans-serif !important;
            ">
                <!-- Left: Location pin + Shop Address + Separator -->
                <div style="display: flex; align-items: center; gap: 6px; overflow: hidden; text-overflow: ellipsis;">
                    <span style="display: inline-flex; align-items: center; justify-content: center; width: 17px; height: 17px; min-width: 17px; background: #ffd700; border-radius: 50%; box-shadow: 0 1px 2px rgba(0,0,0,0.18); vertical-align: middle;">
                        <svg width="9.5" height="9.5" viewBox="0 0 24 24" fill="#dc2626"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                    </span>
                    <span style="color: #0f172a !important; font-weight: 700; font-family: 'Anek Bangla', sans-serif !important; font-size: 9px; line-height: 1; vertical-align: middle;">${shopAddress}</span>
                    <span style="color: #0284c7; margin: 0 6px; font-weight: 400;">|</span>
                </div>

                <!-- Right: Phone icon + Mobile numbers -->
                <div style="display: flex; align-items: center; gap: 6px; flex-shrink: 0;">
                    <span style="display: inline-flex; align-items: center; justify-content: center; width: 17px; height: 17px; min-width: 17px; background: #ffd700; border-radius: 50%; box-shadow: 0 1px 2px rgba(0,0,0,0.18); vertical-align: middle;">
                        <svg width="9.5" height="9.5" viewBox="0 0 24 24" fill="#16a34a"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                    </span>
                    <span style="color: #002d72 !important; font-family: 'Anek Bangla', 'Inter', sans-serif !important; font-weight: 700; font-size: 9px; line-height: 1; vertical-align: middle;"><strong style="font-weight: 800;">মোবাইল:</strong> ${shopPhone}</span>
                </div>
            </div>
        </div>
    `;
}
