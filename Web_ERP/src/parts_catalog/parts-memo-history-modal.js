import Swal from 'sweetalert2';
import { getPartsCatalogCache } from './parts-state.js';
import { openMemoViewerModal } from '../utils/memo-viewer-modal.js';
import { escapeHTML, formatAmountWithComma } from '../utils.js';

/**
 * Open Modal showing multi-memo price audit trail for a specific part
 * @param {string} partId Part ID
 */
export async function openMemoPriceHistoryModal(partId) {
    if (!partId) return;

    const parts = getPartsCatalogCache();
    const part = parts.find(p => p.id === partId);

    if (!part) {
        await Swal.fire({
            title: 'পার্টস পাওয়া যায়নি',
            text: `আইডি: ${partId} এর কোনো তথ্য খুঁজে পাওয়া যায়নি।`,
            icon: 'error',
            background: '#0F172A',
            color: '#F8FAFC',
            confirmButtonColor: '#F59E0B'
        });
        return;
    }

    const history = Array.isArray(part.memoHistory) ? part.memoHistory : [];

    if (history.length === 0) {
        await Swal.fire({
            title: 'মেমো অডিট তথ্য নেই',
            text: `"${part.nameBn}" পার্টসটির সাথে সংযুক্ত কোনো মেমো হিস্ট্রি রেকর্ড নেই।`,
            icon: 'info',
            background: '#0F172A',
            color: '#F8FAFC',
            confirmButtonColor: '#F59E0B'
        });
        return;
    }

    const rates = history.map(h => Number(h.rate) || 0).filter(r => r > 0);
    const minRate = rates.length > 0 ? Math.min(...rates) : (part.floorPrice || 0);
    const maxRate = rates.length > 0 ? Math.max(...rates) : (part.askingPrice || 0);
    const variance = maxRate - minRate;

    // Variance Status Badge
    let varianceBadge = '';
    if (history.length === 1) {
        varianceBadge = `
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-sky-500/10 text-sky-300 border border-sky-500/20 text-xs font-bold">
                <i class="fa-solid fa-certificate text-sky-400"></i>
                <span>একক মেমো প্রমাণিত দর</span>
            </span>
        `;
    } else if (variance === 0) {
        varianceBadge = `
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-bold">
                <i class="fa-solid fa-circle-check text-emerald-400"></i>
                <span>সকল মেমোতে স্থির রেট (Zero Variance)</span>
            </span>
        `;
    } else {
        varianceBadge = `
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-bold">
                <i class="fa-solid fa-arrow-trend-up text-amber-400"></i>
                <span>মেমোভেদে ৳${formatAmountWithComma(variance)} পার্থক্য</span>
            </span>
        `;
    }

    const modelsText = Array.isArray(part.popularModels) ? part.popularModels.join(', ') : (part.popularModels || '');
    const yearsText = (part.yearStart && part.yearEnd) ? `${part.yearStart}—${part.yearEnd}` : '';

    const rowsHtml = history.map((m, idx) => {
        const rateDiff = (part.askingPrice || 0) - (m.rate || 0);
        let diffBadge = '';
        if (rateDiff > 0) {
            diffBadge = `<span class="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded">-৳${formatAmountWithComma(rateDiff)} ছাড়</span>`;
        } else if (rateDiff === 0) {
            diffBadge = `<span class="text-[10px] font-bold text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">আস্কিং সমান</span>`;
        } else {
            diffBadge = `<span class="text-[10px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.5 rounded">+৳${formatAmountWithComma(Math.abs(rateDiff))}</span>`;
        }

        return `
            <tr class="border-b border-slate-800/80 hover:bg-slate-850/50 transition-colors">
                <td class="py-3 px-3 text-center text-slate-400 font-bold text-xs">${idx + 1}</td>
                <td class="py-3 px-3">
                    <div class="flex items-center gap-2">
                        <div class="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                            <i class="fa-solid fa-receipt text-xs"></i>
                        </div>
                        <div>
                            <div class="font-mono font-black text-amber-300 text-xs">মেমো #${escapeHTML(m.memoNoBn || m.memoNo)}</div>
                            <div class="text-[10px] text-slate-400 font-medium">ক্যাশ মেমো ভাউচার</div>
                        </div>
                    </div>
                </td>
                <td class="py-3 px-3 text-center">
                    ${m.line ? `<span class="inline-block px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700/60 font-bold text-xs">লাইন ${escapeHTML(m.line)}</span>` : '<span class="text-slate-500 text-xs">-</span>'}
                </td>
                <td class="py-3 px-3 text-right">
                    <div class="font-black text-emerald-400 text-sm font-mono">৳ ${formatAmountWithComma(m.rate || 0)}</div>
                    <div class="text-[10px] text-slate-400 font-bold">প্রতি ${escapeHTML(m.unit || 'পিছ')}</div>
                </td>
                <td class="py-3 px-3 text-center">
                    ${diffBadge}
                </td>
                <td class="py-3 px-3 text-center">
                    <button type="button" 
                            onclick="window.partsCatalogActions.viewScannedMemo('${escapeHTML(m.memoNo)}', '${escapeHTML(m.memoNoBn || m.memoNo)}', '${escapeHTML(part.nameBn)}', ${m.rate || 0})"
                            class="px-2.5 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 text-xs font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-sm"
                            title="মেমো #${escapeHTML(m.memoNoBn || m.memoNo)} এর আসল স্ক্যান কপি দেখুন">
                        <i class="fa-solid fa-eye text-xs"></i>
                        <span>আসল মেমো দেখুন</span>
                        <i class="fa-solid fa-arrow-up-right-from-square text-[9px] opacity-70"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');

    await Swal.fire({
        title: null,
        width: '800px',
        background: '#0F172A',
        color: '#F8FAFC',
        showConfirmButton: false,
        showCloseButton: true,
        customClass: {
            popup: 'border border-slate-700/80 rounded-3xl backdrop-blur-2xl shadow-2xl p-4 sm:p-6 font-bn'
        },
        html: `
            <div class="text-left font-bn text-white space-y-4">
                <!-- Header with Part Title -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
                    <div>
                        <div class="flex items-center gap-2">
                            <span class="px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono font-bold text-xs">${escapeHTML(part.id)}</span>
                            <span class="text-xs text-slate-400 font-bold">${escapeHTML(part.category)}</span>
                        </div>
                        <h2 class="text-lg sm:text-xl font-black text-white mt-1 flex items-center gap-2">
                            <span>${escapeHTML(part.nameBn)}</span>
                            ${part.secretCode ? `<span class="text-xs font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">[${escapeHTML(part.secretCode)}]</span>` : ''}
                        </h2>
                        <div class="text-xs text-slate-400 font-mono mt-0.5 flex flex-wrap items-center gap-2">
                            ${part.oemPartNumber && part.oemPartNumber !== 'OEM N/A' ? `<span class="text-blue-400 font-bold">OEM: ${escapeHTML(part.oemPartNumber)}</span><span class="text-slate-600">•</span>` : ''}
                            <span class="text-slate-300 font-sans">${escapeHTML(modelsText || 'Toyota Models')} ${yearsText ? `(${yearsText})` : ''}</span>
                        </div>
                    </div>
                    <div class="shrink-0 flex items-center">
                        ${varianceBadge}
                    </div>
                </div>

                <!-- Price Corridor & Stats Cards -->
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div class="p-3 rounded-2xl bg-slate-900 border border-emerald-500/30 text-center">
                        <div class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">সর্বোচ্চ বিক্রয় দর</div>
                        <div class="text-base sm:text-lg font-black text-emerald-400 font-mono mt-0.5">৳ ${formatAmountWithComma(maxRate)}</div>
                        <div class="text-[10px] text-emerald-400/80 font-bold">আস্কিং দর</div>
                    </div>
                    <div class="p-3 rounded-2xl bg-slate-900 border border-amber-500/30 text-center">
                        <div class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">সর্বনিম্ন বিক্রয় দর</div>
                        <div class="text-base sm:text-lg font-black text-amber-400 font-mono mt-0.5">৳ ${formatAmountWithComma(minRate)}</div>
                        <div class="text-[10px] text-amber-400/80 font-bold">ফ্লোর দর (নিরাপদ)</div>
                    </div>
                    <div class="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                        <div class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">মেমো সংখ্যা</div>
                        <div class="text-base sm:text-lg font-black text-white font-mono mt-0.5">${history.length} টি</div>
                        <div class="text-[10px] text-slate-400 font-bold">প্রমাণিত ভাউচার</div>
                    </div>
                    <div class="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                        <div class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">দোকান অবস্থান</div>
                        <div class="text-xs sm:text-sm font-black text-blue-300 font-sans mt-1 truncate" title="${escapeHTML(part.locationShop || 'দোকান তাক')}">${escapeHTML(part.locationShop || 'দোকান তাক')}</div>
                        <div class="text-[10px] text-slate-400 font-bold">গোডাউন তাক</div>
                    </div>
                </div>

                <!-- Explanation Note -->
                <div class="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                    <i class="fa-solid fa-circle-info text-amber-400 mt-0.5 shrink-0"></i>
                    <div>
                        মা মোটরসের দোকানে বিক্রি হওয়া আসল ক্যাশ মেমোর ভিত্তিতে তৈরি প্রমাণিত হিস্ট্রি ট্রেইল। প্রতিটি মেমোর পাশের <strong class="text-white">"আসল মেমো দেখুন"</strong> বাটনে ক্লিক করে মূল মেমোর হাই-রেজ্যুলেশন ছবি ও হাতের লেখা লাইন দেখতে পারেন।
                    </div>
                </div>

                <!-- Memo Audit Table -->
                <div class="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/60 max-h-[320px] overflow-y-auto custom-scrollbar">
                    <table class="w-full text-xs text-left border-collapse">
                        <thead class="bg-slate-900/90 text-slate-400 sticky top-0 border-b border-slate-800 font-bold uppercase text-[10px] tracking-wider z-10">
                            <tr>
                                <th class="py-2.5 px-3 text-center">ক্র:</th>
                                <th class="py-2.5 px-3">মেমো নম্বর</th>
                                <th class="py-2.5 px-3 text-center">লাইন নং</th>
                                <th class="py-2.5 px-3 text-right">বিক্রি হওয়া দর</th>
                                <th class="py-2.5 px-3 text-center">তুলনা</th>
                                <th class="py-2.5 px-3 text-center">অ্যাকশন</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rowsHtml}
                        </tbody>
                    </table>
                </div>

                <!-- Footer Close Button -->
                <div class="flex justify-end pt-2">
                    <button type="button" onclick="Swal.close()" class="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all active:scale-95 cursor-pointer">
                        <i class="fa-solid fa-xmark mr-1.5"></i>বন্ধ করুন
                    </button>
                </div>
            </div>
        `
    });
}

/**
 * View scanned physical memo WebP image in high-resolution viewer modal
 * @param {string} memoNo English memo number e.g. '105'
 * @param {string} memoNoBn Bengali memo number e.g. '১০৫'
 * @param {string} partName Part name in Bengali
 * @param {number} rate Rate of the part in memo
 */
export async function viewScannedMemo(memoNo, memoNoBn, partName = '', rate = 0) {
    if (!memoNo) return;
    const cleanNo = String(memoNo).trim();
    const memoUrl = `/memos/${cleanNo}.webp`;

    await openMemoViewerModal({
        url: memoUrl,
        voucherNo: `মেমো #${memoNoBn || cleanNo}`,
        customerName: `মেসার্স মা মোটরস ক্যাশ মেমো (${partName || 'পার্টস'})`,
        bill: rate,
        paid: rate
    });
}
