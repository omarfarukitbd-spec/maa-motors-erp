import Swal from 'sweetalert2';
import { TransactionDAO } from '../dao.js';
import { GodownMemoDAO } from './godown-memo-dao.js';
import { scanActiveBookProgress } from './godown-memo-calc.js';
import { formatAmountWithComma, formatAppDate, safeRound, promptSecurityPin, showToast, ensureOnline } from '../utils.js';

/**
 * Open 1-Click Book Closure & Reconciliation Wizard
 * @param {Array<Object>} existingBooks - Existing closed books in register
 * @param {Object} activeConfig - Active book configuration from settings
 * @param {Function} onClosed - Callback after successful closure
 */
export async function openGodownMemoClosureModal(existingBooks = [], activeConfig = {}, onClosed = null) {
    if (!ensureOnline('গোডাউন মেমো বই সমাপ্তি ও সিলমোহর')) return;
    const sorted = [...existingBooks].sort((a, b) => (Number(a.bookSerial) || 0) - (Number(b.bookSerial) || 0));
    const lastBook = sorted[sorted.length - 1] || null;
    const nextSerial = (lastBook ? Number(lastBook.bookSerial || 0) : 0) + 1;

    let defaultStart = activeConfig.startMemoNo;
    if (!defaultStart) {
        defaultStart = lastBook ? (Number(lastBook.endMemoNo) || 0) + 1 : 201;
    }
    let defaultEnd = activeConfig.endMemoNo;
    if (!defaultEnd) {
        defaultEnd = defaultStart + 99;
    }

    const prevCumulative = lastBook ? (Number(lastBook.cumulativeNetSales) || Number(lastBook.netSales) || 0) : 0;

    let allTxnsCache = [];
    try {
        const snap = await TransactionDAO.collection.get();
        snap.forEach(d => allTxnsCache.push({ id: d.id, ...d.data() }));
    } catch (e) {
        console.error('Fetch transactions error in closure modal:', e);
    }

    const modalHtml = `
        <div class="space-y-3.5 text-left font-bn text-xs">
            <div class="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2">
                <div class="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div class="font-black text-white text-sm flex items-center gap-2">
                        <i class="fa-solid fa-book text-cyan-400"></i>
                        <span>নতুন বই নং ${nextSerial} সমাপ্তি ও সিলমোহর উইজার্ড</span>
                    </div>
                    <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">Auto Reconcile</span>
                </div>

                <div class="grid grid-cols-2 gap-2.5 pt-1">
                    <div>
                        <label class="block text-slate-400 font-bold text-[11px] mb-1">শুরুর মেমো নং:</label>
                        <input type="number" id="closure-start-memo" value="${defaultStart}" class="w-full bg-slate-900 border border-slate-700 rounded-xl h-9 px-3 text-white font-mono font-black focus:border-cyan-500 outline-none">
                    </div>
                    <div>
                        <label class="block text-slate-400 font-bold text-[11px] mb-1">শেষের মেমো নং:</label>
                        <input type="number" id="closure-end-memo" value="${defaultEnd}" class="w-full bg-slate-900 border border-slate-700 rounded-xl h-9 px-3 text-white font-mono font-black focus:border-cyan-500 outline-none">
                    </div>
                </div>
            </div>

            <!-- Live Calculation Preview Container -->
            <div id="closure-calc-preview" class="space-y-2.5">
                <div class="text-center py-4 text-slate-400">
                    <i class="fa-solid fa-circle-notch animate-spin mr-1"></i> লাইভ হিসাব করা হচ্ছে...
                </div>
            </div>

            <!-- Officer & Stamp Assignment -->
            <div class="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2">
                <div class="font-bold text-slate-300 text-[11px] flex items-center gap-1.5">
                    <i class="fa-solid fa-stamp text-blue-400"></i>
                    <span>অনুমোদনকারী ইনচার্জ ও ডিজিটাল রাবার সিল:</span>
                </div>
                <div class="grid grid-cols-2 gap-2">
                    <div>
                        <label class="block text-slate-400 text-[10px] mb-0.5">ইনচার্জের নাম:</label>
                        <input type="text" id="closure-officer-name" value="${escapeHTML(activeConfig.defaultOfficerName || 'মোঃ এমরান')}" class="w-full bg-slate-900 border border-slate-700 rounded-lg h-8 px-2.5 text-xs text-white font-bold outline-none">
                    </div>
                    <div>
                        <label class="block text-slate-400 text-[10px] mb-0.5">কর্মকর্তা আইডি নং:</label>
                        <input type="text" id="closure-officer-id" value="${escapeHTML(activeConfig.defaultOfficerId || '১৯২৫')}" class="w-full bg-slate-900 border border-slate-700 rounded-lg h-8 px-2.5 text-xs text-white font-mono font-bold outline-none">
                    </div>
                </div>
            </div>
        </div>
    `;

    let currentScan = null;

    function refreshPreview(startVal, endVal) {
        const previewEl = document.getElementById('closure-calc-preview');
        if (!previewEl) return;

        currentScan = scanActiveBookProgress(allTxnsCache, startVal, endVal);
        const newCumulative = safeRound(prevCumulative + currentScan.netSales);

        let missingBanner = '';
        if (currentScan.missingVouchers.length > 0) {
            missingBanner = `
                <div class="bg-amber-950/40 border border-amber-800/80 rounded-xl p-2.5 text-[11px] text-amber-200">
                    <div class="font-bold text-amber-400 flex items-center gap-1">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                        <span>সতর্কতা: ${currentScan.missingVouchers.length}টি মেমো এখনো এন্ট্রি করা হয়নি!</span>
                    </div>
                    <div class="text-slate-300 text-[10px] mt-0.5">মিসিং মেমো: ${currentScan.missingVouchers.slice(0, 10).map(m => `#${m}`).join(', ')}${currentScan.missingVouchers.length > 10 ? '...' : ''}</div>
                </div>
            `;
        }

        const sDate = currentScan.earliestDate ? formatAppDate(currentScan.earliestDate) : '-';
        const eDate = currentScan.latestDate ? formatAppDate(currentScan.latestDate) : '-';

        previewEl.innerHTML = `
            ${missingBanner}
            <div class="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 space-y-2">
                <div class="grid grid-cols-2 gap-2 text-center">
                    <div class="bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                        <div class="text-[10px] text-slate-400">মেমো পূরণ হার</div>
                        <div class="font-black text-cyan-400 text-sm mt-0.5"><span class="font-mono">${currentScan.usedCount} / ${currentScan.totalExpected}</span> টি (<span class="font-mono">${currentScan.percent}%</span>)</div>
                    </div>
                    <div class="bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                        <div class="text-[10px] text-slate-400">তারিখ রেঞ্জ</div>
                        <div class="font-bold text-white text-xs mt-0.5">${sDate} হতে ${eDate}</div>
                    </div>
                </div>

                <div class="grid grid-cols-3 gap-2 text-center pt-1 border-t border-slate-800/60">
                    <div>
                        <div class="text-[10px] text-red-400 font-bold">মোট বিক্রয় (Gross)</div>
                        <div class="font-mono font-black text-red-400 text-xs mt-0.5">৳ ${formatAmountWithComma(currentScan.grossSales)}</div>
                    </div>
                    <div>
                        <div class="text-[10px] text-purple-400 font-bold">লেস (Less)</div>
                        <div class="font-mono font-black text-purple-400 text-xs mt-0.5">৳ ${formatAmountWithComma(currentScan.totalLess)}</div>
                    </div>
                    <div>
                        <div class="text-[10px] text-emerald-400 font-bold">নিট বিক্রয় (Net)</div>
                        <div class="font-mono font-black text-emerald-400 text-xs mt-0.5">৳ ${formatAmountWithComma(currentScan.netSales)}</div>
                    </div>
                </div>

                <div class="p-2 bg-slate-950 rounded-lg flex items-center justify-between border border-slate-800 text-[11px]">
                    <span class="text-slate-400 font-bold">নতুন ক্রমপুঞ্জিত নিট বিক্রয়:</span>
                    <span class="font-mono font-black text-cyan-300 text-sm">৳ ${formatAmountWithComma(newCumulative)}</span>
                </div>
            </div>
        `;
    }

    const result = await Swal.fire({
        title: `<div class="flex items-center gap-2 text-base text-white font-black"><i class="fa-solid fa-file-circle-check text-cyan-400"></i><span>মেমো বই ক্লোজ ও সিলমোহর উইজার্ড</span></div>`,
        html: modalHtml,
        width: '560px',
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-stamp mr-1"></i>বই সিলমোহর ও সমাপ্ত করুন',
        cancelButtonText: 'বাতিল',
        confirmButtonColor: '#0284c7',
        cancelButtonColor: '#334155',
        customClass: {
            popup: 'bg-slate-900 border border-slate-800 rounded-3xl text-white'
        },
        didOpen: () => {
            const sIn = document.getElementById('closure-start-memo');
            const eIn = document.getElementById('closure-end-memo');

            refreshPreview(defaultStart, defaultEnd);

            const triggerRefresh = () => {
                const s = parseInt(sIn?.value, 10) || 1;
                const e = parseInt(eIn?.value, 10) || s;
                refreshPreview(s, e);
            };

            if (sIn) sIn.oninput = triggerRefresh;
            if (eIn) eIn.oninput = triggerRefresh;
        },
        preConfirm: async () => {
            const sVal = parseInt(document.getElementById('closure-start-memo')?.value, 10);
            const eVal = parseInt(document.getElementById('closure-end-memo')?.value, 10);
            const officerName = document.getElementById('closure-officer-name')?.value.trim() || 'মোঃ এমরান';
            const officerId = document.getElementById('closure-officer-id')?.value.trim() || '১৯২৫';

            if (isNaN(sVal) || isNaN(eVal) || sVal <= 0 || eVal < sVal) {
                Swal.showValidationMessage('সঠিক শুরু ও শেষ মেমো নম্বর লিখুন!');
                return false;
            }

            if (!currentScan) {
                Swal.showValidationMessage('হিসাব প্রস্তুত হয়নি!');
                return false;
            }

            if (currentScan.missingVouchers && currentScan.missingVouchers.length > 0) {
                const confirmMissing = await Swal.fire({
                    title: '<span class="text-amber-400">মেমো নম্বর বাদ পড়েছে!</span>',
                    html: `এই বইয়ের রেঞ্জে <strong>${currentScan.missingVouchers.length}টি মেমো</strong> এখনো এন্ট্রি করা হয়নি:<br><div class="font-mono text-amber-300 font-bold p-2 bg-slate-950 rounded-lg my-2 text-xs border border-amber-500/30">#${currentScan.missingVouchers.slice(0, 8).join(', #')}${currentScan.missingVouchers.length > 8 ? '...' : ''}</div>আপনি কি মিসিং মেমোর হিসাব লিপিবদ্ধ রেখেই বই ক্লোজ করতে চান?`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'হ্যাঁ, ক্লোজ করুন',
                    cancelButtonText: 'না, এন্ট্রি চেক করব',
                    confirmButtonColor: '#e11d48',
                    cancelButtonColor: '#334155',
                    customClass: { popup: 'bg-slate-900 border border-slate-800 rounded-3xl text-white' }
                });
                if (!confirmMissing.isConfirmed) return false;
            }

            return {
                startNo: sVal,
                endNo: eVal,
                officerName,
                officerId,
                scan: currentScan
            };
        }
    });

    if (!result.isConfirmed || !result.value) return;

    const data = result.value;
    const pinOk = await promptSecurityPin('মেমো বই সমাপ্তি ও সিলমোহর অনুমোদন');
    if (!pinOk) return;

    const bookRangeStr = `${data.startNo}-${data.endNo}`;
    const newCumulative = safeRound(prevCumulative + data.scan.netSales);
    const todayDate = new Date().toISOString().split('T')[0];
    const sDate = data.scan.earliestDate || todayDate;
    const eDate = data.scan.latestDate || todayDate;

    const bookPayload = {
        bookSerial: nextSerial,
        bookNo: bookRangeStr,
        startMemoNo: data.startNo,
        endMemoNo: data.endNo,
        totalMemos: data.scan.totalExpected,
        usedMemosCount: data.scan.usedCount,
        missingMemos: data.scan.missingVouchers || [],
        missingCount: (data.scan.missingVouchers || []).length,
        startDate: sDate,
        endDate: eDate,
        grossSales: data.scan.grossSales,
        totalLess: data.scan.totalLess,
        netSales: data.scan.netSales,
        cumulativeNetSales: newCumulative,
        isHistorical: false,
        status: 'CLOSED',
        inChargeName: data.officerName,
        inChargeId: data.officerId,
        stampDate: eDate,
        documentNo: '০০০০১'
    };

    const docId = await GodownMemoDAO.addBook(bookPayload);
    if (docId) {
        // Automatically roll over to next active book range
        const nextStart = data.endNo + 1;
        const nextEnd = nextStart + 99;
        await GodownMemoDAO.saveActiveBookConfig({
            activeBookSerial: nextSerial + 1,
            startMemoNo: nextStart,
            endMemoNo: nextEnd,
            defaultOfficerName: data.officerName,
            defaultOfficerId: data.officerId
        });

        showToast(`মেমো বই #${bookRangeStr} সফলভাবে সিলমোহর ও ক্লোজ করা হয়েছে!`, 'success');
        if (onClosed) onClosed();
    } else {
        showToast('বই সংরক্ষণ করতে ব্যর্থ হয়েছে!', 'error');
    }
}
