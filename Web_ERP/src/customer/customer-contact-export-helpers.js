import { formatAmountWithComma } from '../utils.js';

const BENGALI_DIGITS = { '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4', '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9' };

/**
 * বাংলা সংখ্যাকে ইংরেজি সংখ্যায় রূপান্তর করে
 */
export function normalizeBengaliNumbers(str) {
    if (!str) return '';
    return String(str).replace(/[০-৯]/g, d => BENGALI_DIGITS[d] || d);
}

/**
 * র ফোন নম্বর থেকে একাধিক বৈধ বাংলাদেশি মোবাইল নম্বর আলাদা ও পরিষ্কার করে
 */
export function parsePhoneNumbers(rawPhone) {
    if (!rawPhone) return [];
    const engStr = normalizeBengaliNumbers(rawPhone);
    const parts = engStr.split(/[,/|;\n\r]|(?:\s+or\s+)|\s+বা\s+/i);
    const validPhones = [];

    parts.forEach(p => {
        let clean = p.trim().replace(/[^\d+]/g, '');
        if (!clean) return;

        if (clean.startsWith('8801')) {
            clean = '+' + clean;
        } else if (clean.startsWith('01')) {
            clean = '+88' + clean;
        } else if (clean.startsWith('+8801')) {
            // Already standard format
        }

        // বাংলাদেশি ১১-ডিজিট মোবাইল নম্বর ভ্যালিডেশন
        const digitsOnly = clean.replace(/\D/g, '');
        if ((digitsOnly.length === 11 && digitsOnly.startsWith('01')) || (digitsOnly.length === 13 && digitsOnly.startsWith('8801'))) {
            if (!validPhones.includes(clean)) {
                validPhones.push(clean);
            }
        }
    });

    return validPhones;
}

/**
 * বকেয়া টাকার পরিমাণকে সুন্দর ব্র্যাকেট ফরম্যাটে সাজায়
 * যেমন: [৳ ১৫,০০০], [পরিশোধিত], [অগ্রিম ৳ ৫,০০০]
 */
export function buildDueTagText(totalDue) {
    if (totalDue === null || totalDue === undefined) return '';
    const num = Number(totalDue);
    if (isNaN(num)) return '';
    if (num > 0) return `[৳ ${formatAmountWithComma(num)}]`;
    if (num < 0) return `[অগ্রিম ৳ ${formatAmountWithComma(Math.abs(num))}]`;
    return '[পরিশোধিত]';
}

/**
 * বসের নিজস্ব সেভ করা নামের শেষে ব্যালেন্স ব্র্যাকেট আপডেট করে
 * যেমন: "জাবেদ ভাই মেকানিক [৳ ১০,০০০]" -> "জাবেদ ভাই মেকানিক [৳ ১৫,০০০]"
 */
export function updatePersonalContactNameWithDue(existingName, totalDue) {
    if (!existingName) return '';
    const dueTag = buildDueTagText(totalDue);
    const cleanName = existingName.replace(/\s*\[(?:৳|পরিশোধিত|অগ্রিম).*?\]$/i, '').trim();
    return dueTag ? `${cleanName} ${dueTag}` : cleanName;
}

/**
 * কন্টাক্টের ডিসপ্লে নাম তৈরি করে
 * যেমন: [MM] মো: জাবেদ - ভান্ডার মার্কেট [৳ ১৫,০০০]
 */
export function buildContactDisplayName(customer, nameStyle = 'tag_zone', totalDue = null) {
    const rawName = customer.name?.trim() || 'গ্রাহক';
    const acc = customer.accountNo ? `#${customer.accountNo}` : '';
    const area = customer.address?.trim() ? customer.address.trim().split(',')[0].trim() : (customer.zone || '');
    const dueTag = buildDueTagText(totalDue);
    const dueSuffix = dueTag ? ` ${dueTag}` : '';

    if (nameStyle === 'tag_zone') {
        const areaSuffix = area ? ` - ${area}` : '';
        return `[MM] ${rawName}${areaSuffix}${dueSuffix}`;
    } else if (nameStyle === 'tag_acc') {
        const accSuffix = acc ? ` (${acc})` : '';
        return `[MM] ${rawName}${accSuffix}${dueSuffix}`;
    } else if (nameStyle === 'clean_acc') {
        const accSuffix = acc ? ` (${acc})` : '';
        return `${rawName}${accSuffix}${dueSuffix}`;
    }
    return `${rawName}${dueSuffix}`;
}

/**
 * CSV সেল এস্কেপিং
 */
export function escapeCsvCell(val) {
    if (val === null || val === undefined) return '""';
    const str = String(val);
    if (/[",\n\r]/.test(str)) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return `"${str}"`;
}
