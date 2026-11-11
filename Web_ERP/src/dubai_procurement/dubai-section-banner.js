/**
 * Nothi Book (নথি বুক) - Per-Section Banner Registry & Unified UI/Print Renderer
 * Single Source of Truth for the navy corporate banner bar across all 5 Nothi Book registers.
 */

import { escapeHTML } from '../utils.js';

export const DEFAULT_SECTION_BANNERS = {
    remittance: {
        motherTitle: 'ডুবাই টাকা পাঠানোর হিসাব বুক',
        pageNo: '০০০১',
        prefixLabel: 'কনসোলমেন্ট:',
        title: 'মূল হিসাব সেশন ০১ — টাকা পাঠানোর খাতা',
        statusText: 'চলমান কনসোলমেন্ট (Active)',
        statusTone: 'emerald'
    },
    'bd-expense': {
        motherTitle: 'বাংলাদেশ লোকাল ক্লিয়ারেন্স ও ব্যয় বুক',
        pageNo: '০০০২',
        prefixLabel: 'খাতার বিবরণ:',
        title: 'বাংলাদেশ দেশীয় মাল ক্রয়, গোডাউন ও আনুষঙ্গিক খরচ',
        statusText: 'চলমান রেজিস্টার (পাতা: ০০০২)',
        statusTone: 'emerald'
    },
    'lc-bills': {
        motherTitle: 'কন্টেইনার এলসি ও ব্যাংক খরচ রেজিস্টার',
        pageNo: '০০০৩',
        prefixLabel: 'হিসাবের ধরন:',
        title: 'কন্টেইনার এলসি মার্জিন ও ব্যাংক খরচ হিসাব',
        statusText: 'চলমান রেজিস্টার (পাতা: ০০০৩)',
        statusTone: 'emerald'
    },
    'port-duty': {
        motherTitle: 'কন্টেইনার ডিউটি ও পোর্ট বিল বুক',
        pageNo: '০০০৪',
        prefixLabel: 'খাতার বিবরণ:',
        title: 'চট্টগ্রাম বন্দর কন্টেইনার ডিউটি, সিএন্ডএফ ও খালাস ব্যয়',
        statusText: 'চলমান রেজিস্টার (পাতা: ০০০৪)',
        statusTone: 'emerald'
    },
    audit: {
        motherTitle: 'দুবাই সাপ্তাহিক ক্যাশ অডিট শিট',
        pageNo: '০০০৫',
        prefixLabel: 'অডিট সেশন:',
        title: 'বৃহস্পতিবারের সাপ্তাহিক ক্যাশ ও মেমো অডিট',
        statusText: 'সাপ্তাহিক রিকনসিলিয়েশন',
        statusTone: 'sky'
    }
};

export const BANNER_TONE_PALETTES = {
    emerald: {
        label: 'সবুজ (চলমান)',
        bgHex: '#047857',
        borderHex: '#34d399',
        dotHex: '#a7f3d0',
        pillClass: 'bg-emerald-600/90 text-white border-emerald-400/70',
        dotClass: 'bg-emerald-200'
    },
    sky: {
        label: 'নীল (তথ্য/অডিট)',
        bgHex: '#0369a1',
        borderHex: '#38bdf8',
        dotHex: '#bae6fd',
        pillClass: 'bg-sky-600/90 text-white border-sky-400/70',
        dotClass: 'bg-sky-200'
    },
    amber: {
        label: 'অ্যাম্বার (প্রক্রিয়াধীন)',
        bgHex: '#b45309',
        borderHex: '#fbbf24',
        dotHex: '#fde68a',
        pillClass: 'bg-amber-600/90 text-white border-amber-400/70',
        dotClass: 'bg-amber-200'
    },
    rose: {
        label: 'লাল (সমাপ্ত/বন্ধ)',
        bgHex: '#be123c',
        borderHex: '#fb7185',
        dotHex: '#fecdd3',
        pillClass: 'bg-rose-600/90 text-white border-rose-400/70',
        dotClass: 'bg-rose-200'
    }
};

export function resolveSectionBannerConfig(consignment, sectionKey) {
    const def = DEFAULT_SECTION_BANNERS[sectionKey] || DEFAULT_SECTION_BANNERS.remittance;
    const saved = consignment?.sectionBanners?.[sectionKey];
    const isClosed = consignment?.status === 'closed';

    if (saved && typeof saved === 'object' && (String(saved.title || '').trim() || String(saved.motherTitle || '').trim())) {
        const fallbackTitle = sectionKey === 'remittance' && consignment?.name
            ? String(consignment.name).trim()
            : def.title;
        return {
            motherTitle: String(saved.motherTitle || '').trim() || def.motherTitle,
            pageNo: String(saved.pageNo || '').trim() || def.pageNo,
            prefixLabel: saved.prefixLabel !== undefined ? String(saved.prefixLabel).trim() : def.prefixLabel,
            title: String(saved.title || '').trim() || fallbackTitle,
            statusText: saved.statusText ? String(saved.statusText).trim() : def.statusText,
            statusTone: BANNER_TONE_PALETTES[saved.statusTone] ? saved.statusTone : def.statusTone,
            isCustom: true
        };
    }

    if (sectionKey === 'remittance' && consignment?.name) {
        return {
            motherTitle: def.motherTitle,
            pageNo: def.pageNo,
            prefixLabel: def.prefixLabel,
            title: String(consignment.name).trim(),
            statusText: isClosed ? 'সমাপ্ত কনসোলমেন্ট (Closed)' : def.statusText,
            statusTone: isClosed ? 'amber' : def.statusTone,
            isCustom: false
        };
    }

    return {
        motherTitle: def.motherTitle,
        pageNo: def.pageNo,
        prefixLabel: def.prefixLabel,
        title: def.title,
        statusText: isClosed ? 'সমাপ্ত রেজিস্টার (Closed)' : def.statusText,
        statusTone: isClosed ? 'amber' : def.statusTone,
        isCustom: false
    };
}

/**
 * Generates compact dual-bar live WYSIWYG preview matching BOTH:
 * 1) The Blue Mother Header White Pill (`motherTitle`)
 * 2) The Navy Section Banner Strip (`prefixLabel` + `title` + `statusText`)
 */
export function renderNothiDualPreviewHtml(config = {}) {
    const cleanMotherTitle = String(config.motherTitle || '').trim() || 'শিরোনাম নির্ধারিত নয়';
    const cleanPageNo = String(config.pageNo || '').trim() || '০০০১';
    return `
        <div style="display: flex; flex-direction: column; gap: 6px;">
            <div style="
                background: linear-gradient(135deg, #0042a6 0%, #0356c2 60%, #0284c7 100%);
                border-radius: 8px;
                padding: 7px 10px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 8px;
                box-shadow: 0 2px 5px rgba(2, 62, 138, 0.25);
            ">
                <div style="font-size: 9px; font-weight: 800; color: rgba(255,255,255,0.85); white-space: nowrap;">
                    <i class="fa-solid fa-building-columns" style="margin-right: 3px;"></i>PDF মূল শিরোনাম (সাদা পিল):
                </div>
                <div style="
                    background: #ffffff;
                    color: #012b6d;
                    border: 1.5px solid #e2e8f0;
                    border-radius: 999px;
                    padding: 3px 16px;
                    font-size: 12px;
                    font-weight: 900;
                    font-family: 'Anek Bangla', sans-serif;
                    text-align: center;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.18);
                ">${escapeHTML(cleanMotherTitle)}</div>
                <div style="
                    background: rgba(255,255,255,0.15);
                    border: 1px solid rgba(255,255,255,0.3);
                    border-radius: 6px;
                    padding: 2px 7px;
                    font-size: 9px;
                    font-weight: 800;
                    color: #ffffff;
                    white-space: nowrap;
                ">পাতা: ${escapeHTML(cleanPageNo)}</div>
            </div>
            ${renderNothiPrintBannerHtml(config, true)}
        </div>
    `;
}

/**
 * Generates the exact Navy Gradient + Gold Title + Status Pill bar HTML
 * Shared identically by A4 Print Engines and Live WYSIWYG Preview inside the app.
 */
export function renderNothiPrintBannerHtml(config = {}, compact = false) {
    const tone = BANNER_TONE_PALETTES[config.statusTone] || BANNER_TONE_PALETTES.emerald;
    const cleanPrefix = String(config.prefixLabel || '').trim();
    const cleanTitle = String(config.title || '').trim() || 'শিরোনাম নির্ধারিত নয়';
    const cleanStatus = String(config.statusText || '').trim();

    const paddingStyle = compact ? 'padding: 6px 12px;' : 'padding: 4px 10px;';
    const fontSize = compact ? '12.5px' : '11px';
    const pillFontSize = compact ? '9.5px' : '8px';

    return `
        <div style="
            background: linear-gradient(90deg, #032b69 0%, #011b40 100%) !important;
            border: 1px solid #1d4ed8;
            box-shadow: 0 1px 3px rgba(3, 43, 105, 0.25);
            color: #ffffff;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
            ${paddingStyle}
            border-radius: 6px;
            margin-bottom: ${compact ? '0' : '6px'};
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        ">
            <h2 style="margin: 0; font-size: ${fontSize}; font-weight: 800; font-family: 'Anek Bangla', sans-serif !important; color: #ffffff; letter-spacing: 0.1px; line-height: 1.35;">
                ${cleanPrefix ? `<span>${escapeHTML(cleanPrefix)} </span>` : ''}<span style="color: #ffd700;">${escapeHTML(cleanTitle)}</span>
            </h2>
            ${cleanStatus ? `
                <span style="
                    background: ${tone.bgHex} !important;
                    color: #ffffff !important;
                    border: 1px solid ${tone.borderHex};
                    font-size: ${pillFontSize};
                    font-weight: 800;
                    font-family: 'Anek Bangla', sans-serif !important;
                    padding: 2.5px 8px;
                    border-radius: 12px;
                    display: inline-flex;
                    align-items: center;
                    gap: 4.5px;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.25);
                    white-space: nowrap;
                    flex-shrink: 0;
                ">
                    <span style="width: 6px; height: 6px; background: ${tone.dotHex}; border-radius: 50%; display: inline-block;"></span>
                    ${escapeHTML(cleanStatus)}
                </span>
            ` : ''}
        </div>
    `;
}

export function renderNothiPrintSectionBanner(consignment, sectionKey) {
    const config = resolveSectionBannerConfig(consignment, sectionKey);
    return renderNothiPrintBannerHtml(config, false);
}

/**
 * Renders the Screen Banner Card below every Sub-Book header:
 * Consignment selector + Edit Banner button + Live Print Navy Banner Preview.
 */
export function renderNothiScreenBannerBar({
    sectionKey,
    consignment = null,
    consignments = [],
    selectId = '',
    showSelector = true
}) {
    const cfg = resolveSectionBannerConfig(consignment, sectionKey);
    const tone = BANNER_TONE_PALETTES[cfg.statusTone] || BANNER_TONE_PALETTES.emerald;

    const optionsHtml = consignments.length > 0
        ? consignments.map(c => `
            <option value="${escapeHTML(c.id)}" ${c.id === consignment?.id ? 'selected' : ''}>
                ${escapeHTML(c.name || c.id)} (${c.status === 'closed' ? 'সমাপ্ত' : 'চলমান'})
            </option>
        `).join('')
        : `<option value="CONSIGNMENT-01">মূল হিসাব সেশন ০১ (চলমান)</option>`;

    return `
        <div class="bg-slate-900/75 border border-slate-800/90 rounded-2xl p-3 sm:p-3.5 shadow-lg flex flex-col gap-2.5">
            <!-- Control Bar: Consignment Selector & Customize Action -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div class="flex items-center gap-2.5 flex-grow min-w-0">
                    ${showSelector && selectId ? `
                        <span class="text-xs font-bold text-slate-400 whitespace-nowrap shrink-0">
                            <i class="fa-solid fa-boxes-stacked text-sky-400 mr-1"></i>সেশন / খাতা:
                        </span>
                        <select id="${escapeHTML(selectId)}" class="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-bold focus:border-sky-500 outline-none max-w-md w-full truncate">
                            ${optionsHtml}
                        </select>
                    ` : `
                        <span class="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                            <i class="fa-solid fa-bookmark text-sky-400"></i>
                            <span>PDF শিরোনাম ও সেকশন ব্যানার</span>
                        </span>
                    `}
                    <span class="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-950/80 text-blue-200 border border-blue-700/60 whitespace-nowrap" title="PDF হেডারের সাদা পিল শিরোনাম">
                        <i class="fa-solid fa-file-pdf text-sky-400 text-[9px]"></i>
                        <span>PDF শিরোনাম: ${escapeHTML(cfg.motherTitle)}</span>
                    </span>
                    <span class="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${cfg.isCustom ? 'bg-sky-500/10 text-sky-300 border border-sky-500/25' : 'bg-slate-800 text-slate-400 border border-slate-700'} whitespace-nowrap">
                        <i class="fa-solid ${cfg.isCustom ? 'fa-check-double' : 'fa-wand-magic-sparkles'} text-[9px]"></i>
                        <span>${cfg.isCustom ? 'কাস্টম সেট করা' : 'ডিফল্ট'}</span>
                    </span>
                </div>

                <div class="flex items-center gap-2 shrink-0">
                    <button type="button" data-edit-nothi-banner="${escapeHTML(sectionKey)}"
                        class="px-3 py-1.5 bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 hover:text-white border border-sky-500/35 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95">
                        <i class="fa-solid fa-pen-to-square text-[11px]"></i>
                        <span>PDF শিরোনাম ও ব্যানার এডিট</span>
                    </button>
                </div>
            </div>

            <!-- Live Print-Parity Navy Corporate Banner Strip -->
            <div data-edit-nothi-banner="${escapeHTML(sectionKey)}" title="ব্যানার লেখা পরিবর্তন করতে ক্লিক করুন"
                class="cursor-pointer rounded-xl px-3.5 py-2 border border-blue-500/40 bg-gradient-to-r from-[#032b69] to-[#011b40] flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-inner hover:border-sky-400/70 transition-all group">
                <div class="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm font-extrabold leading-snug">
                    ${cfg.prefixLabel ? `<span class="text-white/95">${escapeHTML(cfg.prefixLabel)}</span>` : ''}
                    <span class="text-amber-300 font-black group-hover:text-amber-200 transition-colors">${escapeHTML(cfg.title)}</span>
                </div>
                ${cfg.statusText ? `
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border whitespace-nowrap self-start sm:self-auto shrink-0 ${tone.pillClass}">
                        <span class="w-1.5 h-1.5 rounded-full ${tone.dotClass}"></span>
                        <span>${escapeHTML(cfg.statusText)}</span>
                    </span>
                ` : ''}
            </div>
        </div>
    `;
}
