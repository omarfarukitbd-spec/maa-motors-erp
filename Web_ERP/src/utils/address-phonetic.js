/**
 * English to Bangla Phonetic Dictionary & Transliteration Helper
 */
export function englishToBanglaPhonetic(englishText) {
    if (!englishText || typeof englishText !== 'string') return '';
    let text = englishText.trim();
    if (!text) return '';

    const dict = {
        'dhaka': 'ঢাকা', 'bangladesh': 'বাংলাদেশ',
        'chattogram': 'চট্টগ্রাম', 'chittagong': 'চট্টগ্রাম', 'ctg': 'চট্টগ্রাম',
        'muradpur': 'মুরাদপুর', 'hathazari': 'হাটহাজারী', 'railgate': 'রেইলগেইট',
        'rail gate': 'রেইল গেইট', 'rahman': 'রহমান', 'tower': 'টাওয়ার',
        'market': 'মার্কেট', 'center': 'সেন্টার', 'centre': 'সেন্টার',
        'shop': 'দোকান', 'no': 'নং', 'road': 'রোড', 'lane': 'গলি',
        'gali': 'গলি', 'goli': 'গলি', 'sholashahar': 'ষোলশহর',
        'khatunganj': 'খাতুনগঞ্জ', 'agarabad': 'আগ্রাবাদ', 'halishahar': 'হালিশহর',
        'nasirabad': 'নাসিরাবাদ', 'bismillah': 'বিসমিল্লাহ', 'enterprise': 'এন্টারপ্রাইজ',
        'motors': 'মোটরস', 'motor': 'মোটর', 'store': 'স্টোর', 'hardware': 'হার্ডওয়্যার',
        'auto': 'অটো', 'parts': 'পার্টস', 'maa': 'মা', 'ms': 'মেসার্স', 'm/s': 'মেসার্স',
        'feni': 'ফেনী', 'comilla': 'কুমিল্লা', 'kumilla': 'কুমিল্লা', 'noakhali': 'নোয়াখালী',
        'sylhet': 'সিলেট', 'rajshahi': 'রাজশাহী', 'khulna': 'খুলনা', 'barisal': 'বরিশাল'
    };

    let words = text.split(/(\s+|[,,\-।])/);
    let convertedWords = words.map(w => {
        const clean = w.trim().toLowerCase();
        if (dict[clean]) return dict[clean];
        if (!clean || /^\d+$/.test(clean) || /^[^\w\s]$/.test(clean)) return w;
        return transliterateWord(w);
    });

    return convertedWords.join('');
}

function transliterateWord(word) {
    if (!word || !/[a-zA-Z]/.test(word)) return word;

    let w = word.toLowerCase();

    w = w.replace(/desh/g, 'দেশ')
         .replace(/road/g, 'রোড')
         .replace(/rd$/g, 'র্ড')
         .replace(/nd$/g, 'ন্ড')
         .replace(/ld$/g, 'ল্ড');

    w = w.replace(/kkh/g, 'ক্ষ').replace(/ggh/g, 'ঘ্').replace(/ng/g, 'ং').replace(/cch/g, 'চ্ছ')
         .replace(/tth/g, 'ঠ').replace(/dhd/g, 'দ্ধ').replace(/ddh/g, 'ঢ').replace(/bbh/g, 'ভ')
         .replace(/mbh/g, 'ম্ভ').replace(/mph/g, 'ম্ফ').replace(/nkh/g, 'ঙ্খ').replace(/ngh/g, 'ঙ্ঘ')
         .replace(/ndh/g, 'ন্ধ').replace(/nst/g, 'ন্সট').replace(/sh/g, 'শ').replace(/th/g, 'থ')
         .replace(/dh/g, 'ধ').replace(/kh/g, 'খ').replace(/gh/g, 'ঘ').replace(/ch/g, 'চ')
         .replace(/jh/g, 'ঝ').replace(/ph/g, 'ফ').replace(/bh/g, 'ভ').replace(/rh/g, 'ঢ়')
         .replace(/k/g, 'ক').replace(/g/g, 'গ').replace(/j/g, 'জ').replace(/z/g, 'জ')
         .replace(/t/g, 'ট').replace(/d/g, 'দ').replace(/n/g, 'ন').replace(/p/g, 'প')
         .replace(/f/g, 'ফ').replace(/b/g, 'ব').replace(/m/g, 'ম').replace(/r/g, 'র')
         .replace(/l/g, 'ল').replace(/s/g, 'স').replace(/h/g, 'হ').replace(/y/g, 'য়')
         .replace(/v/g, 'ভ').replace(/w/g, 'ও').replace(/a/g, 'া').replace(/i/g, 'ি')
         .replace(/u/g, 'ু').replace(/e/g, 'ে').replace(/o/g, 'ো');

    return w;
}
