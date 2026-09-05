/**
 * Get today's local YYYY-MM-DD date string (Strict Asia/Dhaka Timezone)
 */
export function getTodayLocalDateString() {
    try {
        const now = new Date();
        const dtf = new Intl.DateTimeFormat('en-CA', {
            timeZone: 'Asia/Dhaka',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
        return dtf.format(now);
    } catch (e) {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
}

/**
 * Format Firebase Timestamp or JS Date to DD/MM/YYYY
 */
export function formatTimestampToAppDate(ts) {
    if (!ts) return '';
    const d = (typeof ts.toDate === 'function') ? ts.toDate() : new Date(ts);
    if (isNaN(d.getTime())) return '';
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

/**
 * Ensure YYYY-MM-DD for Database and DD/MM/YYYY for Display
 */
export function toDBDate(dateString) {
    if (!dateString) return getTodayLocalDateString();

    if (dateString instanceof Date) {
        if (isNaN(dateString.getTime())) return getTodayLocalDateString();
        const year = dateString.getFullYear();
        const month = String(dateString.getMonth() + 1).padStart(2, '0');
        const day = String(dateString.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const trimmed = String(dateString).trim();

    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;

    if (/^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)) {
        const [d, m, y] = trimmed.split('/');
        return `${y}-${m}-${d}`;
    }

    const d = new Date(dateString);
    if (isNaN(d.getTime())) return getTodayLocalDateString();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function toDisplayDate(dateString) {
    if (!dateString) return '';
    const trimmed = String(dateString).trim();

    if (/^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)) return trimmed;

    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
        const [y, m, d] = trimmed.split('-');
        return `${d}/${m}/${y}`;
    }

    const d = new Date(dateString);
    if (isNaN(d.getTime())) return trimmed;
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

export function formatAppDate(dateString) {
    return toDisplayDate(dateString);
}

/**
 * Return Bengali day of week name (e.g. 'শনিবার')
 */
export function getDayOfWeekBangla(dateString, short = false) {
    if (!dateString) return '';
    let d;
    if (dateString instanceof Date) {
        d = dateString;
    } else if (typeof dateString?.toDate === 'function') {
        d = dateString.toDate();
    } else {
        const str = String(dateString).trim();
        if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
            const [y, m, day] = str.split('-').map(Number);
            d = new Date(y, m - 1, day);
        } else if (/^\d{2}\/\d{2}\/\d{4}$/.test(str)) {
            const [day, m, y] = str.split('/').map(Number);
            d = new Date(y, m - 1, day);
        } else {
            d = new Date(dateString);
        }
    }
    if (!d || isNaN(d.getTime())) return '';
    const dayIdx = d.getDay();
    const names = short 
        ? ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি']
        : ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
    return names[dayIdx] || '';
}

/**
 * Format date with stacked Bengali day of week
 */
export function formatAppDateWithDay(dateString, opts = {}) {
    const dateDisp = toDisplayDate(dateString);
    if (!dateDisp) return '';
    const dayName = getDayOfWeekBangla(dateString, opts.short || false);
    if (!dayName) return dateDisp;

    if (opts.inline) {
        return `${dateDisp} (${dayName})`;
    }
    const subClass = opts.subClass || 'text-[10px] text-slate-400 font-medium';
    const subStyle = opts.subStyle || 'font-size: 8px; color: #64748b; font-weight: 600; line-height: 1.1; font-family: "Hind Siliguri", sans-serif;';
    
    if (opts.isPrint) {
        return `<div style="font-weight: 700; white-space: nowrap;">${dateDisp}</div><div style="${subStyle} white-space: nowrap;">${dayName}</div>`;
    }
    return `<div class="leading-tight"><span class="font-bold">${dateDisp}</span><div class="${subClass}">${dayName}</div></div>`;
}

// Global Bindings
window.getTodayLocalDateString = getTodayLocalDateString;
window.formatTimestampToAppDate = formatTimestampToAppDate;
window.toDBDate = toDBDate;
window.toDisplayDate = toDisplayDate;
window.formatAppDate = formatAppDate;
window.getDayOfWeekBangla = getDayOfWeekBangla;
window.formatAppDateWithDay = formatAppDateWithDay;

