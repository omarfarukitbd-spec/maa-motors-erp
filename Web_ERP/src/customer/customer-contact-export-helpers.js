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
 * কন্টাক্টের ডিসপ্লে নাম তৈরি করে
 */
export function buildContactDisplayName(customer, nameStyle = 'tag_zone') {
    const rawName = customer.name?.trim() || 'গ্রাহক';
    const acc = customer.accountNo ? `#${customer.accountNo}` : '';
    const area = customer.address?.trim() ? customer.address.trim().split(',')[0].trim() : (customer.zone || '');

    if (nameStyle === 'tag_zone') {
        const suffix = area ? ` - ${area}` : '';
        return `[MM] ${rawName}${suffix}`;
    } else if (nameStyle === 'tag_acc') {
        const suffix = acc ? ` (${acc})` : '';
        return `[MM] ${rawName}${suffix}`;
    } else if (nameStyle === 'clean_acc') {
        const suffix = acc ? ` (${acc})` : '';
        return `${rawName}${suffix}`;
    }
    return rawName;
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
