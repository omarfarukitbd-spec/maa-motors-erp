import Swal from 'sweetalert2';
import { PartsCatalogDAO } from './parts-dao.js';
import { getPartsCatalogCache } from './parts-state.js';
import { promptSecurityPin, showToast, parseAmount, safeRound } from '../utils.js';
import { INITIAL_PARTS_CATALOG } from './initial-catalog-data.js';
import { openMemoPriceHistoryModal, viewScannedMemo } from './parts-memo-history-modal.js';

/**
 * Open Modal to Add or Edit a Part in the Master Catalog
 * @param {string|null} partId Part ID to edit or null for new
 */
export async function openPartModal(partId = null) {
    let existing = null;
    if (partId) {
        existing = await PartsCatalogDAO.getById(partId);
    }

    const isEdit = Boolean(existing);
    const title = isEdit ? 'পার্টস এডিট করুন' : 'নতুন পার্টস মাস্টার এন্ট্রি';

    const { value: formValues } = await Swal.fire({
        title: `<div class="text-base font-black text-amber-400 font-bn">${title}</div>`,
        width: '750px',
        background: '#0F172A',
        color: '#F8FAFC',
        showCancelButton: true,
        confirmButtonText: isEdit ? 'আপডেট করুন' : 'সংরক্ষণ করুন',
        cancelButtonText: 'বাতিল',
        confirmButtonColor: '#F59E0B',
        cancelButtonColor: '#334155',
        customClass: {
            popup: 'border border-slate-700/80 rounded-3xl backdrop-blur-2xl shadow-2xl font-bn',
            confirmButton: 'font-bold px-6 py-2.5 rounded-xl',
            cancelButton: 'font-bold px-5 py-2.5 rounded-xl'
        },
        html: `
            <div class="space-y-4 text-left font-bn text-xs p-1 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <!-- Row 1: Code & Category -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label class="block text-slate-400 font-bold mb-1">পার্ট কোড / আইডি *</label>
                        <input id="swal-part-id" type="text" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold outline-none focus:border-amber-500" value="${existing ? existing.id : `PART-${Date.now().toString().slice(-4)}`}" ${isEdit ? 'readonly' : ''} placeholder="PART-1001">
                    </div>
                    <div>
                        <label class="block text-slate-400 font-bold mb-1">ক্যাটাগরি *</label>
                        <select id="swal-part-cat" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold outline-none cursor-pointer focus:border-amber-500">
                            <option value="স্টিয়ারিং ও সাসপেনশন" ${existing && existing.category === 'স্টিয়ারিং ও সাসপেনশন' ? 'selected' : ''}>স্টিয়ারিং ও সাসপেনশন</option>
                            <option value="ব্রেকিং সিস্টেম" ${existing && existing.category === 'ব্রেকিং সিস্টেম' ? 'selected' : ''}>ব্রেকিং সিস্টেম</option>
                            <option value="ইঞ্জিন ও ট্রান্সমিশন" ${existing && existing.category === 'ইঞ্জিন ও ট্রান্সমিশন' ? 'selected' : ''}>ইঞ্জিন ও ট্রান্সমিশন</option>
                            <option value="ইলেকট্রিক্যাল ও সেন্সর" ${existing && existing.category === 'ইলেকট্রিক্যাল ও সেন্সর' ? 'selected' : ''}>ইলেকট্রিক্যাল ও সেন্সর</option>
                            <option value="কুলিং ও এসি" ${existing && existing.category === 'কুলিং ও এসি' ? 'selected' : ''}>কুলিং ও এসি</option>
                            <option value="বডি ও এক্সটেরিয়র" ${existing && existing.category === 'বডি ও এক্সটেরিয়র' ? 'selected' : ''}>বডি ও এক্সটেরিয়র</option>
                            <option value="ড্রাইভট্রেন ও এক্সেল" ${existing && existing.category === 'ড্রাইভট্রেন ও এক্সেল' ? 'selected' : ''}>ড্রাইভট্রেন ও এক্সেল</option>
                        </select>
                    </div>
                </div>

                <!-- Row 2: Names -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label class="block text-slate-400 font-bold mb-1">বাংলা লোকাল নাম (মেমো নাম) *</label>
                        <input id="swal-part-namebn" type="text" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold outline-none focus:border-amber-500" value="${existing ? existing.nameBn : ''}" placeholder="যেমন: Axio নিউ রেক খোলা">
                    </div>
                    <div>
                        <label class="block text-slate-400 font-bold mb-1">ইংলিশ OEM টেকনিক্যাল নাম</label>
                        <input id="swal-part-nameen" type="text" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold outline-none focus:border-amber-500" value="${existing ? (existing.nameEn || '') : ''}" placeholder="Power Steering Rack">
                    </div>
                </div>

                <!-- Row 3: OEM & Aliases -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label class="block text-slate-400 font-bold mb-1">OEM পার্ট নাম্বার</label>
                        <input id="swal-part-oem" type="text" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-blue-400 font-mono font-bold outline-none focus:border-amber-500" value="${existing ? (existing.oemPartNumber || '') : ''}" placeholder="যেমন: 45510-12390">
                    </div>
                    <div>
                        <label class="block text-slate-400 font-bold mb-1">বাংলা ডাকনাম ও মিসপেলিং (কমা দিয়ে পৃথক)</label>
                        <input id="swal-part-aliases" type="text" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-300 outline-none focus:border-amber-500" value="${existing && Array.isArray(existing.aliasesBn) ? existing.aliasesBn.join(', ') : ''}" placeholder="রেক খোলা, স্টিয়ারিং রেক, রেক এন্ড">
                    </div>
                </div>

                <!-- Row 4: Commercial Pricing Corridor -->
                <div class="p-3 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-2">
                    <p class="text-[11px] font-black text-amber-400 uppercase tracking-wider">বাণিজ্যিক রেট করিডোর (Commercial Pricing)</p>
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <div>
                            <label class="block text-slate-400 text-[10px] font-bold mb-0.5">আস্কিং দর (৳) *</label>
                            <input id="swal-part-asking" type="number" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-emerald-400 font-black text-sm outline-none focus:border-emerald-500" value="${existing ? (existing.askingPrice || '') : ''}" placeholder="৫০০০">
                        </div>
                        <div>
                            <label class="block text-slate-400 text-[10px] font-bold mb-0.5">ফ্লোর দর (সর্বনিম্ন ৳) *</label>
                            <input id="swal-part-floor" type="number" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-red-400 font-black text-sm outline-none focus:border-red-500" value="${existing ? (existing.floorPrice || '') : ''}" placeholder="৪৭০০">
                        </div>
                        <div>
                            <label class="block text-slate-400 text-[10px] font-bold mb-0.5">ভাঙা ১ পিছ দর (৳)</label>
                            <input id="swal-part-single" type="number" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-bold outline-none focus:border-amber-500" value="${existing ? (existing.singlePiecePrice || '') : ''}" placeholder="২৮০০">
                        </div>
                        <div>
                            <label class="block text-slate-400 text-[10px] font-bold mb-0.5">ভাঙা কোর ছাড় (৳)</label>
                            <input id="swal-part-core" type="number" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-amber-300 font-bold outline-none focus:border-amber-500" value="${existing ? (existing.oldCoreDiscount || '') : ''}" placeholder="৫০০">
                        </div>
                    </div>
                </div>

                <!-- Row 5: Fitment & Vehicle Models -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label class="block text-slate-400 font-bold mb-1">ফিট হওয়া গাড়ির মডেল (কমা দিয়ে পৃথক)</label>
                        <input id="swal-part-models" type="text" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold outline-none focus:border-amber-500" value="${existing && Array.isArray(existing.popularModels) ? existing.popularModels.join(', ') : ''}" placeholder="Axio 141, Fielder 141, Allion 260">
                    </div>
                    <div>
                        <label class="block text-slate-400 font-bold mb-1">চ্যাসিস কোড (কমা দিয়ে পৃথক)</label>
                        <input id="swal-part-chassis" type="text" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-300 font-mono outline-none focus:border-amber-500" value="${existing && Array.isArray(existing.compatibleChassis) ? existing.compatibleChassis.join(', ') : ''}" placeholder="NZE141, ZRE142, NZT260">
                    </div>
                </div>

                <!-- Row 6: Units & Rack -->
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                        <label class="block text-slate-400 font-bold mb-1">ডিফল্ট ইউনিট</label>
                        <select id="swal-part-unit" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-2 py-2 text-white font-bold outline-none">
                            <option value="পিছ" ${existing && existing.defaultUnit === 'পিছ' ? 'selected' : ''}>পিছ (Pcs)</option>
                            <option value="জোড়া" ${existing && existing.defaultUnit === 'জোড়া' ? 'selected' : ''}>জোড়া (Pair)</option>
                            <option value="সেট" ${existing && existing.defaultUnit === 'সেট' ? 'selected' : ''}>সেট (Set)</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-slate-400 font-bold mb-1">সাইড (Side)</label>
                        <select id="swal-part-side" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-2 py-2 text-white font-bold outline-none">
                            <option value="প্রযোজ্য নয়" ${existing && existing.sideAvailable === 'প্রযোজ্য নয়' ? 'selected' : ''}>প্রযোজ্য নয়</option>
                            <option value="ডান (RH)" ${existing && existing.sideAvailable === 'ডান (RH)' ? 'selected' : ''}>ডান (RH)</option>
                            <option value="বাম (LH)" ${existing && existing.sideAvailable === 'বাম (LH)' ? 'selected' : ''}>বাম (LH)</option>
                            <option value="জোড়া (Pair)" ${existing && existing.sideAvailable === 'জোড়া (Pair)' ? 'selected' : ''}>জোড়া (Pair)</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-slate-400 font-bold mb-1">সিক্রেট কোড</label>
                        <input id="swal-part-secret" type="text" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-purple-400 font-mono font-bold outline-none" value="${existing ? (existing.secretCode || '') : ''}" placeholder="ACM">
                    </div>
                    <div>
                        <label class="block text-slate-400 font-bold mb-1">গোডাউন তাক/র‍্যাক</label>
                        <input id="swal-part-rack" type="text" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none" value="${existing ? (existing.locationShop || '') : ''}" placeholder="দোকান তাক A-1">
                    </div>
                </div>

                <!-- Row 7: Mismatch Warning -->
                <div>
                    <label class="block text-amber-400 font-bold mb-1">মিসম্যাচ ওয়ার্নিং (সতর্কতা নোট)</label>
                    <input id="swal-part-mismatch" type="text" class="w-full bg-slate-950 border border-amber-500/40 rounded-xl px-3 py-2 text-amber-300 outline-none" value="${existing ? (existing.mismatchWarning || '') : ''}" placeholder="যেমন: ২০১২ এর পরের (160 সিরিজ) মডেলে ফিট হবে না">
                </div>
            </div>
        `,
        preConfirm: () => {
            const id = document.getElementById('swal-part-id')?.value.trim();
            const nameBn = document.getElementById('swal-part-namebn')?.value.trim();
            const asking = parseAmount(document.getElementById('swal-part-asking')?.value || '0');
            const floor = parseAmount(document.getElementById('swal-part-floor')?.value || '0');

            if (!id || !nameBn) {
                Swal.showValidationMessage('পার্ট কোড ও বাংলা নাম আবশ্যক!');
                return false;
            }
            if (asking <= 0) {
                Swal.showValidationMessage('আস্কিং দর অবশ্যই ০ টাকার বেশি হতে হবে!');
                return false;
            }

            const parseList = (str) => (str || '').split(',').map(s => s.trim()).filter(s => s.length > 0);

            return {
                id,
                nameBn,
                nameEn: document.getElementById('swal-part-nameen')?.value.trim() || '',
                category: document.getElementById('swal-part-cat')?.value || 'স্টিয়ারিং ও সাসপেনশন',
                oemPartNumber: document.getElementById('swal-part-oem')?.value.trim() || '',
                aliasesBn: parseList(document.getElementById('swal-part-aliases')?.value),
                askingPrice: asking,
                floorPrice: floor || asking,
                singlePiecePrice: parseAmount(document.getElementById('swal-part-single')?.value || '0'),
                oldCoreDiscount: parseAmount(document.getElementById('swal-part-core')?.value || '0'),
                popularModels: parseList(document.getElementById('swal-part-models')?.value),
                compatibleChassis: parseList(document.getElementById('swal-part-chassis')?.value),
                defaultUnit: document.getElementById('swal-part-unit')?.value || 'পিছ',
                sideAvailable: document.getElementById('swal-part-side')?.value || 'প্রযোজ্য নয়',
                secretCode: document.getElementById('swal-part-secret')?.value.trim() || '',
                locationShop: document.getElementById('swal-part-rack')?.value.trim() || '',
                mismatchWarning: document.getElementById('swal-part-mismatch')?.value.trim() || ''
            };
        }
    });

    if (formValues) {
        try {
            await PartsCatalogDAO.savePart(formValues);
            showToast(isEdit ? 'পার্টস সফলভাবে আপডেট হয়েছে!' : 'নতুন পার্টস মাস্টার ক্যাটালগে যুক্ত হয়েছে!', 'success');
        } catch (e) {
            console.error('Save part error:', e);
            showToast('পার্টস সংরক্ষণ করতে সমস্যা হয়েছে', 'error');
        }
    }
}

/**
 * Prompt to delete a part with Security PIN protection
 */
export async function promptDeletePart(partId) {
    const verified = await promptSecurityPin();
    if (!verified) return;

    const { isConfirmed } = await Swal.fire({
        title: 'আপনি কি নিশ্চিত?',
        text: `পার্টস আইডি ${partId} ক্যাটালগ থেকে মুছে ফেলা হবে।`,
        icon: 'warning',
        background: '#0F172A',
        color: '#F8FAFC',
        showCancelButton: true,
        confirmButtonColor: '#EF4444',
        cancelButtonColor: '#334155',
        confirmButtonText: 'হ্যাঁ, মুছুন',
        cancelButtonText: 'না'
    });

    if (isConfirmed) {
        try {
            await PartsCatalogDAO.deletePart(partId);
            showToast('পার্টস সফলভাবে মুছে ফেলা হয়েছে', 'success');
        } catch (e) {
            console.error('Delete part error:', e);
            showToast('ডিলিট ব্যর্থ হয়েছে', 'error');
        }
    }
}

/**
 * Export full parts catalog to Excel / CSV with UTF-8 BOM
 */
export function exportPartsToExcel() {
    const parts = getPartsCatalogCache();
    if (!parts || parts.length === 0) {
        showToast('ক্যাটালগে কোনো ডাটা নেই', 'error');
        return;
    }

    const headers = [
        'ID/Code', 'Name (Bengali)', 'Name (English)', 'OEM Part Number', 'Category',
        'Asking Price (BDT)', 'Floor Price (BDT)', 'Single Piece Price', 'Core Discount',
        'Default Unit', 'Side', 'Popular Models', 'Compatible Chassis', 'Location/Rack', 'Secret Code'
    ];

    const escapeCsv = (str) => `"${String(str || '').replace(/"/g, '""')}"`;

    const rows = parts.map(p => [
        escapeCsv(p.id),
        escapeCsv(p.nameBn),
        escapeCsv(p.nameEn),
        escapeCsv(p.oemPartNumber),
        escapeCsv(p.category),
        p.askingPrice || 0,
        p.floorPrice || 0,
        p.singlePiecePrice || 0,
        p.oldCoreDiscount || 0,
        escapeCsv(p.defaultUnit),
        escapeCsv(p.sideAvailable),
        escapeCsv(Array.isArray(p.popularModels) ? p.popularModels.join(', ') : ''),
        escapeCsv(Array.isArray(p.compatibleChassis) ? p.compatibleChassis.join(', ') : ''),
        escapeCsv(p.locationShop),
        escapeCsv(p.secretCode)
    ].join(','));

    // Prepend UTF-8 BOM (\uFEFF) for Excel native rendering
    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Maa_Motors_Master_Auto_Parts_Catalog_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('এক্সেল ফাইল ডাউনলোড সম্পন্ন হয়েছে', 'success');
}

/**
 * Bulk Percentage Shift of Prices (Asking & Floor) with Boss Security PIN
 */
export async function promptBulkPriceShift() {
    const verified = await promptSecurityPin();
    if (!verified) return;

    const { value: percentStr } = await Swal.fire({
        title: 'কনটেইনার দর সমন্বয় (% Shift)',
        text: 'সমগ্র ক্যাটালগ বা নির্দিষ্ট ক্যাটাগরির পার্টসের দাম কত শতাংশ পরিবর্তন করবেন? (যেমন: +10 বা -5)',
        input: 'number',
        inputPlaceholder: '+১০ বা -৫',
        background: '#0F172A',
        color: '#F8FAFC',
        showCancelButton: true,
        confirmButtonText: 'প্রয়োগ করুন',
        cancelButtonText: 'বাতিল',
        confirmButtonColor: '#F59E0B'
    });

    const percent = Number(percentStr);
    if (isNaN(percent) || percent === 0) return;

    const parts = getPartsCatalogCache();
    const updated = parts.map(p => ({
        ...p,
        askingPrice: safeRound(p.askingPrice * (1 + percent / 100)),
        floorPrice: safeRound(p.floorPrice * (1 + percent / 100)),
        singlePiecePrice: p.singlePiecePrice ? safeRound(p.singlePiecePrice * (1 + percent / 100)) : 0
    }));

    try {
        await PartsCatalogDAO.seedBatch(updated);
        showToast(`সকল পার্টসের রেট ${percent > 0 ? '+' : ''}${percent}% সমন্বয় করা হয়েছে!`, 'success');
    } catch (e) {
        console.error('Bulk shift error:', e);
        showToast('দর সমন্বয়ে ত্রুটি হয়েছে', 'error');
    }
}

/**
 * Seed initial 76 real memo-verified parts to Cloud Firestore
 */
export async function seedDefaultCatalog() {
    const { isConfirmed } = await Swal.fire({
        title: 'মাস্টার ক্যাটালগ আপলোড',
        text: 'আপনি কি মেমো-ভেরিফাইড ১৩৪টি জাপানি রিকন্ডিশন্ড পার্টস ক্লাউড ডাটাবেজে আপলোড করতে চান?',
        icon: 'question',
        background: '#0F172A',
        color: '#F8FAFC',
        showCancelButton: true,
        confirmButtonColor: '#F59E0B',
        cancelButtonColor: '#334155',
        confirmButtonText: 'হ্যাঁ, আপলোড করুন',
        cancelButtonText: 'বাতিল'
    });

    if (!isConfirmed) return;

    Swal.fire({
        title: 'আপলোড হচ্ছে...',
        text: '১৩৪টি পার্টস ক্লাউড ফায়ারস্টোরে সিঙ্ক করা হচ্ছে',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
    });

    try {
        const count = await PartsCatalogDAO.seedBatch(INITIAL_PARTS_CATALOG);
        Swal.close();
        showToast(`সফলভাবে ${count}টি পার্টস ক্যাটালগে আপলোড হয়েছে!`, 'success');
    } catch (e) {
        Swal.close();
        console.error('Seed catalog error:', e);
        showToast('ক্যাটালগ আপলোড ব্যর্থ হয়েছে', 'error');
    }
}

// Global Binding
window.partsCatalogActions = {
    openAddModal: () => openPartModal(null),
    openEditModal: (id) => openPartModal(id),
    promptDelete: (id) => promptDeletePart(id),
    exportExcel: () => exportPartsToExcel(),
    bulkPriceShift: () => promptBulkPriceShift(),
    seedDefault: () => seedDefaultCatalog(),
    showMemoHistory: (id) => openMemoPriceHistoryModal(id),
    viewScannedMemo: (memoNo, memoNoBn, partName, rate) => viewScannedMemo(memoNo, memoNoBn, partName, rate)
};
