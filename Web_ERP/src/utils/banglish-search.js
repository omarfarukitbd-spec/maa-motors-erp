/**
 * Transliterates Bangla names/text to English ASCII (Banglish)
 * e.g. "মোঃ আইয়ুব" -> "Md. Aiyub", "আব্দুল রহিম" -> "Abdul Rahim"
 */
export function toBanglishName(str) {
    if (!str || typeof str !== 'string') return '';
    let text = str.trim();

    const dict = [
        [/\bমেসার্স\b/gi, 'M/S.'],
        [/(?:মোঃ|মো:|মো\.)/gi, 'Md'],
        [/\bমাং\b/gi, 'Md'],
        [/\bমোহাম্মদ\b/gi, 'Mohammad'],
        [/\bআহমেদ\b/gi, 'Ahmed'],
        [/\bহোসেন\b/gi, 'Hossain'],
        [/\bহোসনে\b/gi, 'Hosne'],
        [/\bচৌধুরী\b/gi, 'Chowdhury'],
        [/\bরহমান\b/gi, 'Rahman'],
        [/\bখান\b/gi, 'Khan'],
        [/\bআলী\b/gi, 'Ali'],
        [/\bআলম\b/gi, 'Alam'],
        [/\bইসলাম\b/gi, 'Islam'],
        [/\bউদ্দিন\b/gi, 'Uddin'],
        [/\bসৈয়দ\b/gi, 'Syed'],
        [/\bবেগম\b/gi, 'Begum'],
        [/\bখাতুন\b/gi, 'Khatun'],
        [/\bআইয়ুব\b/gi, 'Aiyub'],
        [/\bআয়ুব\b/gi, 'Aiyub'],
        [/\bরহিম\b/gi, 'Rahim'],
        [/\bকরিম\b/gi, 'Karim'],
        [/\bফারুক\b/gi, 'Faruk'],
        [/\bহাসান\b/gi, 'Hasan'],
        [/\bহোসাইন\b/gi, 'Hossain'],
        [/\bকবির\b/gi, 'Kabir'],
        [/\bইকবাল\b/gi, 'Iqbal'],
        [/\bমাসুদ\b/gi, 'Masud'],
        [/\bরফিক\b/gi, 'Rafiq'],
        [/\bশেখ\b/gi, 'Sheikh'],
        [/\bকাজী\b/gi, 'Kazi'],
        [/\bআক্তার\b/gi, 'Akter'],
        [/\bমিয়া\b/gi, 'Miah'],
        [/\bমিয়া\b/gi, 'Miah'],
        [/\bবিশ্বাস\b/gi, 'Biswas'],
        [/\bসাহেব\b/gi, 'Saheb'],
        [/\bমালেক\b/gi, 'Malek'],
        [/\bকামাল\b/gi, 'Kamal'],
        [/\bমোস্তফা\b/gi, 'Mostafa'],
        [/\bসাইফুল\b/gi, 'Saiful'],
        [/\bনজরুল\b/gi, 'Nazrul'],
        [/\bশরিফ\b/gi, 'Sharif'],
        [/\bতারেক\b/gi, 'Tarek'],
        [/\bরশিদ\b/gi, 'Rashid'],
        [/\bআজাদ\b/gi, 'Azad'],
        [/\bজসিম\b/gi, 'Jasim'],
        [/\bহক\b/gi, 'Hoque'],
        [/\bসরকার\b/gi, 'Sarker'],
        [/\bআনিস\b/gi, 'Anis'],
        [/\bশাহ\b/gi, 'Shah'],
        [/\bপারভেজ\b/gi, 'Parvez'],
        [/\bসাদেক\b/gi, 'Sadek'],
        [/\bমা মোটরস্\b/gi, 'Maa Motors'],
        [/\bমা মোটরস\b/gi, 'Maa Motors']
    ];

    dict.forEach(([pat, rep]) => { text = text.replace(pat, rep); });

    const charMap = {
        'অ': 'o', 'আ': 'a', 'ই': 'i', 'ঈ': 'i', 'উ': 'u', 'ঊ': 'u', 'ঋ': 'ri', 'এ': 'e', 'ঐ': 'oi', 'ও': 'o', 'ঔ': 'ou',
        'ক': 'k', 'খ': 'kh', 'গ': 'g', 'ঘ': 'gh', 'ঙ': 'ng',
        'চ': 'ch', 'ছ': 'chh', 'জ': 'j', 'ঝ': 'jh', 'ঞ': 'n',
        'ট': 't', 'ঠ': 'th', 'ড': 'd', 'ঢ': 'dh', 'ণ': 'n',
        'ত': 't', 'থ': 'th', 'দ': 'd', 'ধ': 'dh', 'ন': 'n',
        'প': 'p', 'ফ': 'f', 'ব': 'b', 'ভ': 'bh', 'ম': 'm',
        'য': 'j', 'র': 'r', 'ল': 'l', 'শ': 'sh', 'ষ': 'sh', 'স': 's', 'হ': 'h',
        'ড়': 'r', 'ঢ়': 'rh', 'য়': 'y', 'ৎ': 't', 'ং': 'ng', 'ঃ': 'h', 'ঁ': 'n',
        'া': 'a', 'ি': 'i', 'ী': 'i', 'ু': 'u', 'ূ': 'u', 'ৃ': 'ri', 'ে': 'e', 'ৈ': 'oi', 'ো': 'o', 'ৌ': 'ou',
        '্': '', 'ৗ': 'ou'
    };

    let result = '';
    for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if (charMap[c] !== undefined) {
            result += charMap[c];
        } else {
            result += c;
        }
    }

    result = result.replace(/\s+/g, ' ').trim();
    result = result.split(' ').map(w => w ? w.charAt(0).toUpperCase() + w.slice(1) : '').join(' ');
    return result.replace(/[^\x00-\x7F]/g, '');
}

/**
 * Universal Cross-Language Customer Search Matcher
 * Matches Bangla/English/Banglish queries against customer name, phone, A/C, address.
 */
export function matchCustomerSearch(customer, query) {
    if (!customer || !query) return false;
    const q = String(query).trim().toLowerCase();
    if (!q) return false;

    const acc = String(customer.accountNo || '').toLowerCase();
    const phone = String(customer.phone || '').toLowerCase();
    const addr = String(customer.address || '').toLowerCase();
    const rawName = String(customer.name || '').toLowerCase();
    const qClean = q.replace(/^#/, '');

    if (acc.includes(qClean) || phone.includes(qClean) || rawName.includes(q) || addr.includes(q)) return true;

    const banglishName = toBanglishName(customer.name || '').toLowerCase();
    if (banglishName.includes(q)) return true;

    const normalize = (s) => s
        .replace(/aiyub|aiub|ayoub|ayob/g, 'ayub')
        .replace(/mohammad|mohammed|mohamed|muhammad|muhammed|mahmed|mahmud/g, 'md')
        .replace(/hossain|hossein|hussain|husein/g, 'hossain')
        .replace(/choudhury|chowdhury|choudury/g, 'chowdhury')
        .replace(/kaysar|kaiser|kaesar/g, 'kaisar')
        .replace(/tareq|tarik|tareck/g, 'tarek')
        .replace(/jahir|zahir|jaher|zaher/g, 'jahir')
        .replace(/jasim|jashim/g, 'jasim')
        .replace(/sumon|suman/g, 'sumon')
        .replace(/syed|sayed|saeed/g, 'syed')
        .replace(/y/g, 'i');

    const normName = normalize(banglishName);
    const normQuery = normalize(q);

    if (normName.includes(normQuery)) return true;

    const queryWords = normQuery.split(/\s+/).filter(Boolean);
    if (queryWords.length > 1) {
        return queryWords.every(w => normName.includes(w) || rawName.includes(w) || phone.includes(w) || acc.includes(w));
    }

    return false;
}
