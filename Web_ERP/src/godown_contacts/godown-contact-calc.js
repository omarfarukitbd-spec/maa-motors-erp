/**
 * godown-contact-calc.js
 * Business logic, categories, validation and link helpers for Godown Contacts
 */

export const GODOWN_CONTACT_CATEGORIES = {
    all: {
        id: 'all',
        title: 'সকল কন্টাক্ট',
        icon: '<i class="fa-solid fa-layer-group"></i>',
        color: 'text-slate-300 bg-slate-800/80 border-slate-700'
    },
    transport: {
        id: 'transport',
        title: 'পরিবহন ও গাড়ি',
        icon: '<i class="fa-solid fa-truck-moving"></i>',
        color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30'
    },
    labor: {
        id: 'labor',
        title: 'শ্রমিক ও হ্যান্ডলিং',
        icon: '<i class="fa-solid fa-people-carry-box"></i>',
        color: 'text-amber-400 bg-amber-500/10 border-amber-500/30'
    },
    technical: {
        id: 'technical',
        title: 'ওয়ার্কশপ ও মিস্ত্রি',
        icon: '<i class="fa-solid fa-wrench"></i>',
        color: 'text-purple-400 bg-purple-500/10 border-purple-500/30'
    },
    packaging: {
        id: 'packaging',
        title: 'প্যাকিং ও স্টোরেজ',
        icon: '<i class="fa-solid fa-boxes-stacked"></i>',
        color: 'text-blue-400 bg-blue-500/10 border-blue-500/30'
    },
    emergency: {
        id: 'emergency',
        title: 'জরুরি সেবা ও প্রশাসন',
        icon: '<i class="fa-solid fa-truck-medical"></i>',
        color: 'text-red-400 bg-red-500/10 border-red-500/30'
    }
};

const CUSTOM_CATEGORY_PALETTES = [
    { color: 'text-purple-400 bg-purple-500/10 border-purple-500/30', icon: '<i class="fa-solid fa-tag"></i>' },
    { color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', icon: '<i class="fa-solid fa-briefcase"></i>' },
    { color: 'text-rose-400 bg-rose-500/10 border-rose-500/30', icon: '<i class="fa-solid fa-shapes"></i>' },
    { color: 'text-amber-400 bg-amber-500/10 border-amber-500/30', icon: '<i class="fa-solid fa-screwdriver-wrench"></i>' },
    { color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30', icon: '<i class="fa-solid fa-truck-ramp-box"></i>' },
    { color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30', icon: '<i class="fa-solid fa-cube"></i>' },
    { color: 'text-teal-400 bg-teal-500/10 border-teal-500/30', icon: '<i class="fa-solid fa-boxes-packing"></i>' },
    { color: 'text-orange-400 bg-orange-500/10 border-orange-500/30', icon: '<i class="fa-solid fa-shield"></i>' }
];

export function getCategoryPalette(name = '') {
    let hash = 0;
    const str = String(name || '');
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
    }
    const idx = Math.abs(hash) % CUSTOM_CATEGORY_PALETTES.length;
    return CUSTOM_CATEGORY_PALETTES[idx];
}

/**
 * Extract all unique categories combining presets and custom entries from contacts
 */
export function extractUniqueCategories(contactsList = []) {
    const categoryMap = new Map();

    // Default presets first
    Object.entries(GODOWN_CONTACT_CATEGORIES).forEach(([id, meta]) => {
        if (id !== 'all') {
            categoryMap.set(id, { id, title: meta.title, icon: meta.icon, color: meta.color, isPreset: true });
        }
    });

    // Custom categories found in contacts
    contactsList.forEach(c => {
        const cat = (c.category || '').trim();
        if (cat && !categoryMap.has(cat)) {
            const palette = getCategoryPalette(cat);
            categoryMap.set(cat, {
                id: cat,
                title: cat,
                icon: palette.icon,
                color: palette.color,
                isPreset: false
            });
        }
    });

    return Array.from(categoryMap.values());
}

/**
 * Standard Phone Number Normalization
 */
export function normalizePhoneNumber(raw = '') {
    if (!raw) return '';
    // Replace Bengali digits with English
    const bnNums = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    let clean = String(raw).trim();
    bnNums.forEach((bn, en) => {
        clean = clean.split(bn).join(en);
    });
    // Remove all non-numeric characters except +
    clean = clean.replace(/[^\d+]/g, '');
    if (clean.startsWith('+880')) {
        clean = '0' + clean.slice(4);
    } else if (clean.startsWith('880')) {
        clean = '0' + clean.slice(3);
    }
    return clean;
}

/**
 * Build 1-Click WhatsApp Direct URL
 */
export function buildWhatsAppLink(phone, name = '') {
    const clean = normalizePhoneNumber(phone);
    if (!clean) return '#';
    let intlPhone = clean;
    if (intlPhone.startsWith('0')) {
        intlPhone = '88' + intlPhone;
    }
    const msg = encodeURIComponent(`সালামু আলাইকুম ${name || ''}, মেসার্স মা মোটরস (মুরাদপুর, চট্টগ্রাম) গোডাউন থেকে যোগাযোগ করা হচ্ছে।`);
    return `https://wa.me/${intlPhone}?text=${msg}`;
}

/**
 * Build 1-Click Call URL
 */
export function buildCallLink(phone) {
    const clean = normalizePhoneNumber(phone);
    return clean ? `tel:${clean}` : '#';
}

/**
 * Get Category Metadata (Presets or Dynamic Custom)
 */
export function getCategoryMeta(key = 'transport') {
    if (GODOWN_CONTACT_CATEGORIES[key]) {
        return GODOWN_CONTACT_CATEGORIES[key];
    }
    const palette = getCategoryPalette(key);
    return {
        id: key,
        title: key || 'সাধারণ',
        icon: palette.icon,
        color: palette.color,
        isCustom: true
    };
}
