import Swal from 'sweetalert2';

/**
 * Currency & Number Math with Rounding Protection
 */
export function safeRound(num, decimals = 2) {
    const factor = Math.pow(10, decimals);
    return Math.round(((Number(num) || 0) + Number.EPSILON) * factor) / factor;
}

export function parseAmount(val) {
    if (!val) return 0;
    if (typeof val === 'number') return isNaN(val) ? 0 : val;
    let s = String(val).trim().replace(/,/g, '');
    const num = parseFloat(s);
    return isNaN(num) ? 0 : num;
}

export function formatAmountWithComma(num) {
    const val = Number(num);
    if (isNaN(val)) return '0.00';
    return val.toLocaleString('en-IN', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });
}

/**
 * Date Utilities
 */
export function getTodayLocalDateString() {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${day}/${month}/${year}`;
}

export function toDBDate(dateStr) {
    if (!dateStr) return '';
    if (typeof dateStr !== 'string') return '';
    const parts = dateStr.split(/[-/]/);
    if (parts.length === 3) {
        if (parts[0].length === 4) return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
        return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
    return dateStr;
}

export function formatAppDate(dateVal) {
    if (!dateVal) return '';
    let dStr = typeof dateVal === 'string' ? dateVal : '';
    if (dateVal && typeof dateVal.toDate === 'function') {
        const d = dateVal.toDate();
        return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
    }
    if (!dStr) return '';
    const parts = dStr.split(/[-/]/);
    if (parts.length === 3) {
        if (parts[0].length === 4) return `${parts[2].padStart(2, '0')}/${parts[1].padStart(2, '0')}/${parts[0]}`;
        return `${parts[0].padStart(2, '0')}/${parts[1].padStart(2, '0')}/${parts[2]}`;
    }
    return dStr;
}

/**
 * Strips bracketed [A/C] prefix from customer name for clean display
 */
export function cleanCustomerName(rawName) {
    if (!rawName) return '';
    return String(rawName).replace(/^\[.*?\]\s*/, '').trim();
}

/**
 * Number to Bangla Words Converter
 */
export function numberToBanglaWords(num) {
    const n = Math.abs(Math.floor(Number(num) || 0));
    if (n === 0) return "শূন্য টাকা মাত্র";

    const digits = ["", "এক", "দুই", "তিন", "চার", "পাঁচ", "ছয়", "সাত", "আট", "নয়"];
    const teens = ["দশ", "এগারো", "বারো", "তেরো", "চৌদ্দ", "পনেরো", "ষোল", "সতেরো", "আঠারো", "ঊনিশ"];
    const tens = ["", "দশ", "বিশ", "ত্রিশ", "চল্লিশ", "পঞ্চাশ", "ষাট", "সত্তর", "আশি", "নব্বই"];

    function convertTwoDigits(v) {
        if (v === 0) return "";
        if (v < 10) return digits[v];
        if (v >= 10 && v < 20) return teens[v - 10];
        const t = Math.floor(v / 10), rem = v % 10;
        return tens[t] + (rem > 0 ? " " + digits[rem] : "");
    }

    let words = "";
    const crore = Math.floor(n / 10000000);
    let rem = n % 10000000;
    const lakh = Math.floor(rem / 100000);
    rem = rem % 100000;
    const thousand = Math.floor(rem / 1000);
    rem = rem % 1000;
    const hundred = Math.floor(rem / 100);
    const lastTwo = rem % 100;

    if (crore > 0) words += convertTwoDigits(crore) + " কোটি ";
    if (lakh > 0) words += convertTwoDigits(lakh) + " লক্ষ ";
    if (thousand > 0) words += convertTwoDigits(thousand) + " হাজার ";
    if (hundred > 0) words += digits[hundred] + " শত ";
    if (lastTwo > 0) words += convertTwoDigits(lastTwo) + " ";

    return (words.trim() + " টাকা মাত্র");
}

/**
 * Global Toast Notifications
 */
export function showToast(message, icon = 'info', title = '') {
    Swal.fire({
        toast: true,
        position: 'top-end',
        icon: icon,
        title: title || message,
        text: title ? message : '',
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
        background: '#0F172A',
        color: '#F8FAFC',
        customClass: { popup: 'border border-slate-700 shadow-2xl rounded-2xl font-bn text-xs' }
    });
}

/**
 * Safe Error Handler
 */
export function handleError(error, userFriendlyMsg = 'একটি সমস্যা হয়েছে') {
    console.error('[Boss ERP Error]:', error);
    showToast(userFriendlyMsg, 'error');
}

/**
 * Client Table to Excel Download
 */
export function exportTableToExcel(tableId, filename = 'data.xlsx') {
    const table = document.getElementById(tableId);
    if (!table) return showToast('টেবিল ডাটা পাওয়া যায়নি', 'warning');
    try {
        const wb = window.XLSX.utils.book_new();
        const ws = window.XLSX.utils.table_to_sheet(table);
        window.XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        window.XLSX.writeFile(wb, filename);
        showToast('এক্সেল ফাইল ডাউনলোড সফল হয়েছে', 'success');
    } catch (e) {
        console.error(e);
        showToast('এক্সপোর্ট করতে সমস্যা হয়েছে', 'error');
    }
}
