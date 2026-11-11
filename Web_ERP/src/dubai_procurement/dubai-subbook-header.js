/**
 * Nothi Book (নথি বুক) - Centralized Metadata Registry & Unified 2-Tier Sub-Book Header
 * Prevents header text crushing/wrapping by separating Hub Navigation from Title & Actions.
 */

export const NOTHI_BOOK_CATEGORIES = [
    {
        key: 'remittance',
        pageNo: '০০০১',
        pageBadge: 'খাতা পাতা: ০০০১',
        shortLabel: 'টাকা পাঠানো (০০০১)',
        title: 'টাকা পাঠানোর খাতা',
        subtitle: 'বৈদেশিক রেমিট্যান্স, এক্সচেঞ্জ রেট ও ক্রমপুঞ্জিত তহবিল রেজিস্টার',
        currency: 'AED & BDT',
        icon: 'fa-money-bill-transfer',
        accent: 'emerald'
    },
    {
        key: 'bd-expense',
        pageNo: '০০০২',
        pageBadge: 'খাতা পাতা: ০০০২',
        shortLabel: 'বাংলাদেশ খরচ (০০০২)',
        title: 'বাংলাদেশ খরচ মাস্টার খাতা',
        subtitle: 'স্থানীয় মাল ক্রয়, গোডাউন ভাড়া, চালানি কেরিং ও আনুষঙ্গিক খরচ',
        currency: 'BDT',
        icon: 'fa-file-invoice-dollar',
        accent: 'amber'
    },
    {
        key: 'lc-bills',
        pageNo: '০০০৩',
        pageBadge: 'খাতা পাতা: ০০০৩',
        shortLabel: 'এলসি ও ব্যাংক (০০০৩)',
        title: 'কন্টেইনার এলসি ও ব্যাংক খরচ রেজিস্টার',
        subtitle: 'কন্টেইনারভিত্তিক আলাদা তারিখের ব্যাংক পেমেন্ট, USD ও ডেলিভারি ট্র্যাকার',
        currency: 'USD & BDT',
        icon: 'fa-file-contract',
        accent: 'cyan'
    },
    {
        key: 'port-duty',
        pageNo: '০০০৪',
        pageBadge: 'খাতা পাতা: ০০০৪',
        shortLabel: 'পোর্ট ও ডিউটি (০০০৪)',
        title: 'কন্টেইনার ডিউটি, সিএন্ডএফ ও পোর্ট বিল রেজিস্টার',
        subtitle: 'চট্টগ্রাম বন্দর ক্লিয়ারেন্স, কাস্টমস শুল্ক, সিএন্ডএফ ও খালাস ব্যয়',
        currency: 'BDT',
        icon: 'fa-ship',
        accent: 'indigo'
    },
    {
        key: 'audit',
        pageNo: 'অডিট',
        pageBadge: 'সাপ্তাহিক হিসাব',
        shortLabel: 'সাপ্তাহিক অডিট শিট',
        title: 'সাপ্তাহিক ক্যাশ ও মেমো অডিট শিট',
        subtitle: 'বৃহস্পতিবারের ধারাবাহিক বিয়োগফল, মেমো হিসাব ও ক্যাশ রিকনসিলিয়েশন',
        currency: 'AED (د.إ)',
        icon: 'fa-table-list',
        accent: 'sky'
    }
];

const THEME_STYLES = {
    emerald: {
        iconBox: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400',
        badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
        activePill: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-sm',
        cardBorder: 'hover:border-emerald-500/50 hover:shadow-emerald-950/40',
        kpiValue: 'text-emerald-400',
        actionText: 'text-emerald-400 group-hover:text-emerald-300'
    },
    amber: {
        iconBox: 'bg-amber-500/10 border-amber-500/25 text-amber-400',
        badge: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
        activePill: 'bg-amber-500/15 text-amber-300 border-amber-500/40 shadow-sm',
        cardBorder: 'hover:border-amber-500/50 hover:shadow-amber-950/40',
        kpiValue: 'text-amber-400',
        actionText: 'text-amber-400 group-hover:text-amber-300'
    },
    cyan: {
        iconBox: 'bg-cyan-500/10 border-cyan-500/25 text-cyan-400',
        badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/25',
        activePill: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40 shadow-sm',
        cardBorder: 'hover:border-cyan-500/50 hover:shadow-cyan-950/40',
        kpiValue: 'text-cyan-400',
        actionText: 'text-cyan-400 group-hover:text-cyan-300'
    },
    indigo: {
        iconBox: 'bg-indigo-500/10 border-indigo-500/25 text-indigo-400',
        badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/25',
        activePill: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/40 shadow-sm',
        cardBorder: 'hover:border-indigo-500/50 hover:shadow-indigo-950/40',
        kpiValue: 'text-indigo-400',
        actionText: 'text-indigo-400 group-hover:text-indigo-300'
    },
    sky: {
        iconBox: 'bg-sky-500/10 border-sky-500/25 text-sky-400',
        badge: 'bg-sky-500/10 text-sky-400 border-sky-500/25',
        activePill: 'bg-sky-500/15 text-sky-300 border-sky-500/40 shadow-sm',
        cardBorder: 'hover:border-sky-500/50 hover:shadow-sky-950/40',
        kpiValue: 'text-sky-400',
        actionText: 'text-sky-400 group-hover:text-sky-300'
    }
};

export function getNothiTheme(accent) {
    return THEME_STYLES[accent] || THEME_STYLES.sky;
}

/**
 * Generates a spacious, non-crushing 2-tier workspace header for every Nothi Book section.
 * Tier 1: Back to Nothi Book Hub + Quick Category Switcher Pills
 * Tier 2: Full-width clean Bengali Title + Action Buttons
 */
export function renderNothiSubBookHeader({
    activeKey,
    title,
    subtitle,
    pageBadge,
    currencyBadge,
    iconClass,
    accentColor = 'sky',
    actionButtonsHtml = ''
}) {
    const meta = NOTHI_BOOK_CATEGORIES.find(c => c.key === activeKey);
    const theme = getNothiTheme(accentColor || meta?.accent || 'sky');
    const resolvedTitle = title || meta?.title || 'নথি বুক';
    const resolvedSubtitle = subtitle || meta?.subtitle || '';
    const resolvedPageBadge = pageBadge || meta?.pageBadge || '';
    const resolvedCurrency = currencyBadge || meta?.currency || '';
    const resolvedIcon = iconClass || `fa-solid ${meta?.icon || 'fa-book-bookmark'}`;

    const switcherPills = NOTHI_BOOK_CATEGORIES.map(cat => {
        const isCurrent = cat.key === activeKey;
        const catTheme = getNothiTheme(cat.accent);
        const cls = isCurrent
            ? catTheme.activePill
            : 'bg-slate-900/70 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-800';
        return `
            <button type="button" onclick="window.switchDubaiProcurementView && window.switchDubaiProcurementView('${cat.key}')"
                class="px-2.5 py-1.5 rounded-lg border text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${cls}">
                <i class="fa-solid ${cat.icon} text-[10px]"></i>
                <span>${cat.shortLabel}</span>
            </button>
        `;
    }).join('');

    return `
        <div class="bg-slate-900/90 border border-slate-800 rounded-3xl backdrop-blur-xl shadow-2xl overflow-hidden">
            <!-- Tier 1: Breadcrumb & Category Quick Switcher Strip -->
            <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 px-4 sm:px-5 py-2.5 bg-slate-950/70 border-b border-slate-800/80">
                <div class="flex items-center gap-2 shrink-0">
                    <button type="button" onclick="window.switchDubaiProcurementView && window.switchDubaiProcurementView('hub')"
                        class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95">
                        <i class="fa-solid fa-arrow-left text-sky-400 text-[11px]"></i>
                        <span>নথি বুক হাব</span>
                    </button>
                    <span class="text-slate-600 text-xs">/</span>
                    <span class="text-xs font-bold text-slate-300 truncate">${resolvedTitle}</span>
                </div>

                <div class="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-0.5 lg:pb-0">
                    ${switcherPills}
                </div>
            </div>

            <!-- Tier 2: Full-Space Clean Bengali Title & Section Actions -->
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 sm:p-5">
                <div class="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                    <div class="w-12 h-12 rounded-2xl border flex items-center justify-center text-xl shadow-inner shrink-0 ${theme.iconBox}">
                        <i class="${resolvedIcon}"></i>
                    </div>
                    <div class="min-w-0 flex-1">
                        <div class="flex flex-wrap items-center gap-2">
                            <h1 class="text-lg sm:text-xl font-black text-white tracking-tight leading-snug">${resolvedTitle}</h1>
                            ${resolvedPageBadge ? `<span class="px-2.5 py-0.5 rounded-full text-[11px] font-black border whitespace-nowrap ${theme.badge}">${resolvedPageBadge}</span>` : ''}
                            ${resolvedCurrency ? `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700 whitespace-nowrap">${resolvedCurrency}</span>` : ''}
                        </div>
                        <p class="text-xs text-slate-400 mt-0.5 leading-relaxed">${resolvedSubtitle}</p>
                    </div>
                </div>

                ${actionButtonsHtml ? `
                    <div class="flex flex-wrap items-center gap-2 shrink-0 justify-start md:justify-end">
                        ${actionButtonsHtml}
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}
