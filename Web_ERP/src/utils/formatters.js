/**
 * HTML Sanitization for XSS Prevention
 */
export function escapeHTML(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * Number formatting to Bangladeshi/Indian format (e.g. 1,00,000)
 */
export function formatAmountWithComma(amount) {
    if(amount === null || amount === undefined || amount === '' || isNaN(amount)) return "";
    return Number(amount).toLocaleString('en-IN');
}

/**
 * Convert string with commas back to raw number
 */
export function parseAmount(str) {
    if(!str) return 0;
    return parseFloat(str.toString().replace(/,/g, '')) || 0;
}

/**
 * Format input on the fly
 */
export function handleNumberInput(inputObj) {
    let rawValue = inputObj.value.replace(/[^0-9.]/g, '');
    if (rawValue) {
        inputObj.value = formatAmountWithComma(rawValue);
    } else {
        inputObj.value = "";
    }
}

/**
 * Enhanced Precision Rounding for Accounting (Bulletproof)
 */
export function safeRound(value, decimals = 2) {
    if (value === null || value === undefined || isNaN(value)) return 0;
    const factor = Math.pow(10, decimals);
    return Math.round((value + Number.EPSILON) * factor) / factor;
}

// Global Bindings for HTML onclick
window.escapeHTML = escapeHTML;
window.formatAmountWithComma = formatAmountWithComma;
window.parseAmount = parseAmount;
window.handleNumberInput = handleNumberInput;
window.safeRound = safeRound;
