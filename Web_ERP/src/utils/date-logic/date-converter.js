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
    const trimmed = String(dateString).trim();

    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;

    if (/^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)) {
        const [d, m, y] = trimmed.split('/');
        return `${y}-${m}-${d}`;
    }

    const d = new Date(dateString);
    if (isNaN(d.getTime())) return getTodayLocalDateString();
    return d.toISOString().split('T')[0];
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

// Global Bindings
window.getTodayLocalDateString = getTodayLocalDateString;
window.formatTimestampToAppDate = formatTimestampToAppDate;
window.toDBDate = toDBDate;
window.toDisplayDate = toDisplayDate;
window.formatAppDate = formatAppDate;
