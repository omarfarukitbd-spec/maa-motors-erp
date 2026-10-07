import Swal from 'sweetalert2';
import { CustomerDAO, ZoneDAO, SettingsDAO } from '../dao.js';
import { formatAmountWithComma, showToast, promptSecurityPin } from '../utils.js';
import { getCustomerCache, cachedZones } from './customer-state.js';

const BENGALI_DIGITS = { '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4', '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9' };

/**
 * বাংলা সংখ্যাকে ইংরেজি সংখ্যায় রূপান্তর করে
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
function buildContactDisplayName(customer, nameStyle = 'tag_zone') {
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
 * RFC 6350 / vCard 3.0 ফরম্যাট তৈরি করে
 */
export function generateVCardContent(customers, options = {}) {
    const { nameStyle = 'tag_zone', shopName = "M/S. MAA-MOTOR'S" } = options;
    const lines = [];

    customers.forEach(c => {
        const phones = parsePhoneNumbers(c.phone);
        if (phones.length === 0 && options.skipNoPhone) return;

        const displayName = buildContactDisplayName(c, nameStyle);
        const cleanName = (c.name || 'গ্রাহক').replace(/[;,\n]/g, ' ');
        const address = (c.address || '').replace(/[;\n]/g, ' ');
        const zone = (c.zone || '').replace(/[;\n]/g, ' ');
        const dueAmount = Number(c.totalDue) || 0;
        const dueText = dueAmount > 0 ? `বকেয়া: ৳ ${formatAmountWithComma(dueAmount)}` : (dueAmount < 0 ? `অগ্রিম: ৳ ${formatAmountWithComma(Math.abs(dueAmount))}` : 'ব্যালেন্স: পরিশোধিত');

        lines.push('BEGIN:VCARD');
        lines.push('VERSION:3.0');
        lines.push(`FN;CHARSET=UTF-8:${displayName}`);
        lines.push(`N;CHARSET=UTF-8:${cleanName};;;;`);
        lines.push(`ORG;CHARSET=UTF-8:${shopName};Maa Motors ERP`);
        lines.push(`TITLE;CHARSET=UTF-8:কাস্টমার [${c.accountNo || ''}]`);

        phones.forEach((p, idx) => {
            if (idx === 0) {
                lines.push(`TEL;TYPE=CELL,VOICE;TYPE=pref:${p}`);
            } else {
                lines.push(`TEL;TYPE=CELL,VOICE:${p}`);
            }
        });

        if (address || zone) {
            lines.push(`ADR;TYPE=WORK;CHARSET=UTF-8:;;${address};${zone};;;Bangladesh`);
        }

        const note = `অ্যাকাউন্ট: ${c.accountNo || '-'} | জোন: ${zone || '-'} | ঠিকানা: ${address || '-'} | ${dueText}`;
        lines.push(`NOTE;CHARSET=UTF-8:${note}`);
        lines.push('CATEGORIES;CHARSET=UTF-8:মা মোটরস কাস্টমার,Maa Motors Customers');
        lines.push('END:VCARD');
    });

    return lines.join('\r\n');
}

/**
 * CSV সেল এস্কেপিং
 */
function escapeCsvCell(val) {
    if (val === null || val === undefined) return '""';
    const str = String(val);
    if (/[",\n\r]/.test(str)) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return `"${str}"`;
}

/**
 * Google Contacts Import-এর জন্য RFC 4180 কমপ্লায়েন্ট CSV তৈরি করে
 */
export function generateGoogleContactsCSV(customers, options = {}) {
    const { nameStyle = 'tag_zone', groupLabel = 'Maa Motors Customers', shopName = "M/S. MAA-MOTOR'S" } = options;

    const headers = [
        'Name',
        'Given Name',
        'Family Name',
        'Group Membership',
        'Phone 1 - Type',
        'Phone 1 - Value',
        'Phone 2 - Type',
        'Phone 2 - Value',
        'Organization 1 - Name',
        'Organization 1 - Title',
        'Address 1 - Type',
        'Address 1 - Formatted',
        'Address 1 - Street',
        'Address 1 - City',
        'Notes'
    ];

    const rows = [headers.join(',')];

    customers.forEach(c => {
        const phones = parsePhoneNumbers(c.phone);
        if (phones.length === 0 && options.skipNoPhone) return;

        const displayName = buildContactDisplayName(c, nameStyle);
        const givenName = c.name?.trim() || '';
        const address = c.address?.trim() || '';
        const zone = c.zone?.trim() || '';
        const fullAddr = [address, zone].filter(Boolean).join(', ');
        const dueAmount = Number(c.totalDue) || 0;
        const dueText = dueAmount > 0 ? `বকেয়া: ৳ ${formatAmountWithComma(dueAmount)}` : (dueAmount < 0 ? `অগ্রিম: ৳ ${formatAmountWithComma(Math.abs(dueAmount))}` : 'ব্যালেন্স: পরিশোধিত');
        const note = `অ্যাকাউন্ট নং: ${c.accountNo || '-'} | জোন: ${zone || '-'} | ${dueText}`;

        const row = [
            escapeCsvCell(displayName),
            escapeCsvCell(givenName),
            escapeCsvCell(''),
            escapeCsvCell(`* myContacts ::: ${groupLabel}`),
            escapeCsvCell('Mobile'),
            escapeCsvCell(phones[0] || ''),
            escapeCsvCell(phones[1] ? 'Mobile' : ''),
            escapeCsvCell(phones[1] || ''),
            escapeCsvCell(shopName),
            escapeCsvCell(`কাস্টমার [${c.accountNo || ''}]`),
            escapeCsvCell('Work'),
            escapeCsvCell(fullAddr),
            escapeCsvCell(address),
            escapeCsvCell(zone),
            escapeCsvCell(note)
        ];

        rows.push(row.join(','));
    });

    return '\uFEFF' + rows.join('\r\n');
}

/**
 * ব্রাউজারে ফাইল ডাউনলোড ট্রিগার করে
 */
function downloadBlob(content, fileName, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, fileName);
        return;
    }
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
        if (link.parentNode) link.parentNode.removeChild(link);
        URL.revokeObjectURL(url);
    }, 2000);
}

/**
 * কন্টাক্ট এক্সপোর্ট ও গুগল সিঙ্ক মডাল ওপেন করে
 */
export async function openContactExportModal() {
    const isPinValid = await promptSecurityPin("মোবাইল কন্টাক্ট ডাটা এক্সপোর্ট");
    if (!isPinValid) return;

    let customers = getCustomerCache();
    if (!customers || customers.length === 0) {
        try {
            const snap = await CustomerDAO.collection.get();
            customers = [];
            snap.forEach(doc => customers.push({ id: doc.id, ...doc.data() }));
        } catch (e) {
            console.error('Error fetching customers for contact export:', e);
            customers = [];
        }
    }

    if (customers.length === 0) {
        return Swal.fire({
            title: 'কোনো কাস্টমার পাওয়া যায়নি',
            text: 'ডাটাবেজে বর্তমানে কোনো কাস্টমার রেকর্ড নেই।',
            icon: 'info',
            customClass: { popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn' }
        });
    }

    let zones = [];
    try {
        zones = cachedZones.length > 0 ? cachedZones : await ZoneDAO.getAllZones();
    } catch (e) {
        console.error('Error fetching zones:', e);
        zones = [];
    }

    let zoneOptionsHtml = '<option value="">-- সকল জোন (All Zones) --</option>';
    zones.forEach(z => {
        zoneOptionsHtml += `<option value="${z.name}">${z.name}</option>`;
    });

    const modalHtml = `
        <div class="text-left font-bn space-y-4 p-1 text-slate-200">
            <!-- Header Tag -->
            <div class="p-3 bg-indigo-950/40 border border-indigo-500/30 rounded-2xl flex items-center justify-between gap-3">
                <div class="flex items-center gap-2.5">
                    <div class="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                        <i class="fa-solid fa-address-book text-base"></i>
                    </div>
                    <div>
                        <h4 class="text-white font-black text-sm">মোবাইল কন্টাক্ট ডিরেক্টরি এক্সপোর্ট</h4>
                        <p class="text-[11px] text-slate-400">Google Contacts ও মোবাইল ফোনবুকে আলাদা লেবেলে কল করার জন্য</p>
                    </div>
                </div>
                <div class="text-right">
                    <span class="text-[10px] text-indigo-400 font-bold block">মোট কাস্টমার</span>
                    <strong class="text-white text-sm font-black font-mono">${customers.length} জন</strong>
                </div>
            </div>

            <!-- Format Selection -->
            <div>
                <label class="block text-[11px] font-black text-indigo-400 uppercase tracking-wider mb-1.5 ml-1">১. ইমপোর্ট ফাইল ফরম্যাট নির্বাচন করুন</label>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <label class="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900 border border-indigo-500/50 hover:border-indigo-400 cursor-pointer transition-all">
                        <input type="radio" name="export-fmt" value="google_csv" checked class="mt-1 w-4 h-4 text-indigo-600 cursor-pointer">
                        <div>
                            <span class="text-xs font-black text-white flex items-center gap-1.5">
                                <i class="fa-brands fa-google text-red-400"></i> Google Contacts CSV
                                <span class="bg-indigo-500/20 text-indigo-300 text-[9px] px-1.5 py-0.5 rounded font-mono font-bold">প্রস্তাবিত</span>
                            </span>
                            <p class="text-[10px] text-slate-400 mt-0.5">Google Contacts অ্যাপে 'Maa Motors' আলাদা লেবেলে অটো সিঙ্ক হবে।</p>
                        </div>
                    </label>

                    <label class="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-slate-600 cursor-pointer transition-all">
                        <input type="radio" name="export-fmt" value="vcf" class="mt-1 w-4 h-4 text-indigo-600 cursor-pointer">
                        <div>
                            <span class="text-xs font-black text-white flex items-center gap-1.5">
                                <i class="fa-solid fa-mobile-screen text-emerald-400"></i> vCard (.vcf 3.0)
                            </span>
                            <p class="text-[10px] text-slate-400 mt-0.5">অ্যান্ড্রয়েড ও আইফোনে ফাইলে ক্লিক করলেই ১-ট্যাপে সরাসরি সেভ হবে।</p>
                        </div>
                    </label>
                </div>
            </div>

            <!-- Naming Style -->
            <div>
                <label class="block text-[11px] font-black text-indigo-400 uppercase tracking-wider mb-1.5 ml-1">২. কন্টাক্ট নামের স্টাইল (ডায়লারে দ্রুত চেনার জন্য)</label>
                <select id="export-name-style" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-indigo-500 font-bold">
                    <option value="tag_zone" selected>[MM] কাস্টমারের নাম - এলাকা (যেমন: [MM] শ্যামা মোটরস - মুরাদপুর) [প্রস্তাবিত]</option>
                    <option value="tag_acc">[MM] কাস্টমারের নাম (#অ্যাকাউন্ট) (যেমন: [MM] শ্যামা মোটরস (#0001))</option>
                    <option value="clean_acc">কাস্টমারের নাম (#অ্যাকাউন্ট) (প্রিফিক্স ছাড়া)</option>
                    <option value="clean">শুধু কাস্টমারের নাম</option>
                </select>
                <p class="text-[10px] text-slate-400 mt-1 ml-1">
                    <i class="fa-solid fa-circle-info text-blue-400 mr-1"></i>
                    [MM] ট্যাগ থাকলে মোবাইলের ডায়লারে শুধু <strong>MM</strong> লিখলেই সব কাস্টমার একসাথে চলে আসবে।
                </p>
            </div>

            <!-- Filters -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-slate-800">
                <div>
                    <label class="block text-[11px] font-black text-slate-300 uppercase tracking-wider mb-1 ml-1">জোন ফিল্টার</label>
                    <select id="export-zone-filter" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500">
                        ${zoneOptionsHtml}
                    </select>
                </div>
                <div>
                    <label class="block text-[11px] font-black text-slate-300 uppercase tracking-wider mb-1 ml-1">লেবেল / গ্রুপ নাম</label>
                    <input id="export-label-name" type="text" value="Maa Motors Customers" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 font-bold">
                </div>
            </div>

            <!-- Checkboxes -->
            <div class="space-y-2 pt-1">
                <label class="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
                    <input type="checkbox" id="export-skip-no-phone" checked class="w-4 h-4 rounded text-indigo-600 cursor-pointer">
                    <span>শুধুমাত্র যাদের মোবাইল নম্বর যুক্ত আছে তাদের নিন (ফাঁকা নম্বর বাদ)</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
                    <input type="checkbox" id="export-due-only" class="w-4 h-4 rounded text-indigo-600 cursor-pointer">
                    <span>শুধুমাত্র বকেয়া থাকা কাস্টমারদের নিন (Due &gt; 0)</span>
                </label>
            </div>

            <!-- Guide Toggle Box -->
            <div class="p-3 bg-slate-900/90 rounded-2xl border border-slate-800 text-[11px] space-y-1.5">
                <div class="font-black text-amber-400 flex items-center gap-1.5">
                    <i class="fa-solid fa-lightbulb"></i>
                    <span>Google Contacts অ্যাপে যেভাবে আলাদা গ্রুপ পাবেন:</span>
                </div>
                <ol class="list-decimal list-inside text-slate-300 space-y-1 ml-1">
                    <li>ডাউনলোড করা CSV ফাইলটি নিয়ে ব্রাউজারে <strong>contacts.google.com</strong>-এ যান।</li>
                    <li>বাম পাশের মেনু থেকে <strong>Import</strong> বাটনে ক্লিক করে ফাইলটি আপলোড করুন।</li>
                    <li>আপনার মোবাইলের <strong>Google Contacts</strong> অ্যাপ খুললে 'Labels' ট্যাবে <strong>"Maa Motors Customers"</strong> আলাদা গ্রুপ পেয়ে যাবেন!</li>
                </ol>
            </div>
        </div>
    `;

    const result = await Swal.fire({
        title: '<div class="flex items-center justify-center gap-2 font-bn font-black text-lg text-white"><i class="fa-solid fa-cloud-arrow-down text-indigo-400"></i><span>মোবাইল কন্টাক্ট ফাইল ডাউনলোড</span></div>',
        html: modalHtml,
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-download mr-1.5"></i> ফাইল ডাউনলোড করুন',
        cancelButtonText: 'বাতিল',
        focusConfirm: false,
        customClass: {
            popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn w-[95%] max-w-lg',
            confirmButton: 'm3-btn-primary !bg-indigo-600 hover:!bg-indigo-500 !px-6 !py-2.5 !rounded-xl font-bold shadow-lg shadow-indigo-600/30',
            cancelButton: '!bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-5 !py-2.5 !rounded-xl font-bold'
        },
        preConfirm: () => {
            const fmt = document.querySelector('input[name="export-fmt"]:checked')?.value || 'google_csv';
            const nameStyle = document.getElementById('export-name-style')?.value || 'tag_zone';
            const zoneFilter = document.getElementById('export-zone-filter')?.value || '';
            const labelName = document.getElementById('export-label-name')?.value?.trim() || 'Maa Motors Customers';
            const skipNoPhone = document.getElementById('export-skip-no-phone')?.checked ?? true;
            const dueOnly = document.getElementById('export-due-only')?.checked ?? false;

            return { fmt, nameStyle, zoneFilter, labelName, skipNoPhone, dueOnly };
        }
    });

    if (!result.isConfirmed || !result.value) return;

    const options = result.value;

    try {
        // Filter customers
        let filtered = [...customers];
        if (options.zoneFilter) {
            filtered = filtered.filter(c => c.zone === options.zoneFilter);
        }
        if (options.dueOnly) {
            filtered = filtered.filter(c => (Number(c.totalDue) || 0) > 0);
        }
        if (options.skipNoPhone) {
            filtered = filtered.filter(c => parsePhoneNumbers(c.phone).length > 0);
        }

        if (filtered.length === 0) {
            return Swal.fire({
                title: 'কোনো ম্যাচিং কন্টাক্ট পাওয়া যায়নি',
                text: 'নির্বাচিত ফিল্টার অনুযায়ী কোনো কাস্টমার ডাটা পাওয়া যায়নি।',
                icon: 'warning',
                customClass: { popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn' }
            });
        }

        let shopName = "M/S. MAA-MOTOR'S";
        try {
            const settings = await SettingsDAO.getAppSettings();
            if (settings && settings.shopName) shopName = settings.shopName;
        } catch (e) {
            console.warn('Fallback getting shopName:', e);
        }

        const dateStamp = new Date().toISOString().slice(0, 10);

        if (options.fmt === 'vcf') {
            const vcfText = generateVCardContent(filtered, {
                nameStyle: options.nameStyle,
                skipNoPhone: options.skipNoPhone,
                shopName
            });
            const fileName = `Maa_Motors_Contacts_${dateStamp}.vcf`;
            downloadBlob(vcfText, fileName, 'text/vcard;charset=utf-8;');
            showToast(`${filtered.length} জন কাস্টমারের vCard ফাইল ডাউনলোড হয়েছে`, 'success');
        } else {
            const csvText = generateGoogleContactsCSV(filtered, {
                nameStyle: options.nameStyle,
                groupLabel: options.labelName,
                skipNoPhone: options.skipNoPhone,
                shopName
            });
            const fileName = `Maa_Motors_Google_Contacts_${dateStamp}.csv`;
            downloadBlob(csvText, fileName, 'text/csv;charset=utf-8;');
            showToast(`${filtered.length} জন কাস্টমারের Google CSV ফাইল ডাউনলোড হয়েছে`, 'success');
        }
    } catch (err) {
        console.error('Error downloading contacts:', err);
        Swal.fire({
            title: 'ডাউনলোড এরর!',
            text: 'ফাইল তৈরি করতে সমস্যা হয়েছে: ' + (err.message || ''),
            icon: 'error',
            customClass: { popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn' }
        });
    }
}
