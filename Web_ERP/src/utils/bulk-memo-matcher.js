import Swal from 'sweetalert2';
import { TransactionDAO } from '../dao.js';
import { uploadMemoToR2 } from './r2-memo-uploader.js';
import { compressScannedMemo, isValidImageFile } from './memo-compressor.js';
import { showToast, formatAmountWithComma, formatAppDate, promptSecurityPin } from '../utils.js';

/**
 * Extracts numeric or alphanumeric voucher ID from filename
 * e.g. "101.webp" -> "101", "memo_102.png" -> "102", "INV-103.jpg" -> "103"
 * @param {string} filename 
 * @returns {string}
 */
export function extractVoucherFromFilename(filename) {
    if (!filename) return '';
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, '').trim();
    const match = nameWithoutExt.match(/(?:memo[_-]?|inv[_-]?|v[_-]?)?(\d+)/i);
    return match ? match[1] : nameWithoutExt.replace(/^[#\s]+/, '');
}

/**
 * Opens the Bulk Scanned Memos Auto-Matcher modal
 */
export async function openBulkMemoMatcherModal() {
    let stagedFiles = [];
    let allTxns = [];

    try {
        Swal.fire({
            title: '<div class="flex items-center justify-center gap-2 font-bn font-black text-lg text-white"><i class="fa-solid fa-layer-group text-amber-400"></i><span>বাল্ক মেমো ম্যাচিং ইঞ্জিন</span></div>',
            html: `
                <div class="flex flex-col gap-4 font-bn text-left p-1">
                    <!-- Dropzone -->
                    <div id="bulk-dropzone" class="border-2 border-dashed border-slate-700 hover:border-amber-500/60 bg-slate-900/80 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group">
                        <input type="file" id="bulk-file-input" multiple accept="image/*,.webp" class="hidden">
                        <div class="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 text-xl group-hover:text-amber-400 group-hover:scale-110 transition-all">
                            <i class="fa-solid fa-cloud-arrow-up"></i>
                        </div>
                        <div class="text-xs text-slate-200 font-bold">একসাথে একাধিক মেমোর ছবি টেনে আনুন (Drag & Drop) অথবা <span class="text-amber-400 underline">ব্রাউজ করুন</span></div>
                        <div class="text-[10px] text-slate-500 font-medium">১০ থেকে ৫০+ ছবি একবারে সিলেক্ট করুন (যেমন: 101.webp, 102.webp...)</div>
                    </div>

                    <!-- Selected Files Preview Container -->
                    <div id="bulk-preview-section" class="hidden flex flex-col gap-2">
                        <div class="flex items-center justify-between px-1">
                            <div id="bulk-count-badge" class="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                                <i class="fa-solid fa-images"></i>
                                <span>০টি ছবি নির্বাচিত</span>
                            </div>
                            <button type="button" id="bulk-select-all-btn" class="text-[11px] font-bold text-cyan-400 hover:underline cursor-pointer">সবগুলো আনচেক</button>
                        </div>

                        <!-- Match Table -->
                        <div class="max-h-72 overflow-y-auto custom-scrollbar border border-slate-800 rounded-xl bg-slate-950/60 divide-y divide-slate-800/80" id="bulk-match-list">
                            <!-- Rows inserted dynamically -->
                        </div>
                    </div>

                    <!-- Progress Bar (Initially Hidden) -->
                    <div id="bulk-progress-container" class="hidden flex flex-col gap-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
                        <div class="flex items-center justify-between text-xs font-bold">
                            <span id="bulk-progress-status" class="text-slate-300">আপলোড শুরু হচ্ছে...</span>
                            <span id="bulk-progress-pct" class="text-amber-400 font-mono">০%</span>
                        </div>
                        <div class="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                            <div id="bulk-progress-bar" class="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-300" style="width: 0%"></div>
                        </div>
                    </div>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: '<i class="fa-solid fa-cloud-arrow-up mr-1.5"></i>সবগুলো আপলোড ও লিঙ্ক করুন',
            cancelButtonText: 'বাতিল',
            showConfirmButton: false, // will show after files are selected
            customClass: {
                popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn max-w-2xl w-full',
                confirmButton: 'm3-btn-primary !bg-emerald-600 hover:!bg-emerald-500 !px-5 !py-2.5 rounded-xl font-bold text-xs',
                cancelButton: '!bg-slate-900 hover:!bg-slate-800 !text-slate-400 !px-5 !py-2.5 rounded-xl font-bold text-xs border border-slate-800'
            },
            didOpen: async () => {
                const dropzone = document.getElementById('bulk-dropzone');
                const fileInput = document.getElementById('bulk-file-input');

                // Load all transactions for instant local matching
                try {
                    allTxns = await TransactionDAO.getAll();
                } catch (e) {
                    console.error("Failed to load txns for bulk matcher:", e);
                    allTxns = window._currentLedgerTxns || [];
                }

                const handleFiles = (files) => {
                    const validFiles = Array.from(files).filter(f => isValidImageFile(f));
                    if (!validFiles.length) {
                        return showToast('কোনো সঠিক ছবি পাওয়া যায়নি। JPG, PNG বা WebP নির্বাচন করুন।', 'warning');
                    }
                    stagedFiles = validFiles;
                    renderMatchPreview(stagedFiles, allTxns);
                };

                if (dropzone && fileInput) {
                    dropzone.onclick = () => fileInput.click();
                    fileInput.onchange = (e) => {
                        if (e.target.files?.length) handleFiles(e.target.files);
                    };

                    dropzone.ondragover = (e) => {
                        e.preventDefault();
                        dropzone.classList.add('!border-amber-400', '!bg-amber-500/10');
                    };
                    dropzone.ondragleave = () => {
                        dropzone.classList.remove('!border-amber-400', '!bg-amber-500/10');
                    };
                    dropzone.ondrop = (e) => {
                        e.preventDefault();
                        dropzone.classList.remove('!border-amber-400', '!bg-amber-500/10');
                        if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
                    };
                }
            },
            preConfirm: async () => {
                return executeBulkUpload(stagedFiles, allTxns);
            }
        });
    } catch (err) {
        console.error("Bulk matcher modal error:", err);
        showToast('মোডাল লোড করতে সমস্যা হয়েছে', 'error');
    }
}

/**
 * Renders the match preview table inside the SweetAlert modal
 */
function renderMatchPreview(files, allTxns) {
    const previewSection = document.getElementById('bulk-preview-section');
    const countBadge = document.getElementById('bulk-count-badge');
    const matchList = document.getElementById('bulk-match-list');
    const confirmBtn = Swal.getConfirmButton();

    if (!previewSection || !matchList) return;

    previewSection.classList.remove('hidden');
    if (confirmBtn) confirmBtn.style.display = 'inline-flex';

    // Build lookup map by voucherNo
    const txnByVoucher = new Map();
    allTxns.forEach(t => {
        if (t.voucherNo) {
            const cleanV = String(t.voucherNo).trim().replace(/^[#\s]+/, '');
            if (!txnByVoucher.has(cleanV)) txnByVoucher.set(cleanV, []);
            txnByVoucher.get(cleanV).push(t);
        }
    });

    // Count ready and unmatched
    let readyCount = 0;
    let unmatchedCount = 0;

    files.forEach(file => {
        const v = extractVoucherFromFilename(file.name);
        const list = txnByVoucher.get(v) || [];
        if (list.length) readyCount++;
        else unmatchedCount++;
    });

    countBadge.innerHTML = `
        <div class="flex flex-wrap items-center gap-1.5">
            <span class="text-xs font-bold text-amber-400 flex items-center gap-1">
                <i class="fa-solid fa-images"></i> <span>মোট ${files.length}টি ছবি</span>
            </span>
            <span class="text-[10px] text-slate-500">•</span>
            <button type="button" class="bulk-filter-tab text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 cursor-pointer hover:bg-emerald-500/30 transition-all" data-tab="ready">
                <i class="fa-solid fa-circle-check mr-1 text-[9px]"></i>প্রস্তুত (${readyCount})
            </button>
            ${unmatchedCount > 0 ? `
                <button type="button" class="bulk-filter-tab text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30 cursor-pointer hover:bg-rose-500/30 transition-all" data-tab="unmatched">
                    <i class="fa-solid fa-circle-xmark mr-1 text-[9px]"></i>এন্ট্রি নেই (${unmatchedCount})
                </button>
            ` : ''}
            <button type="button" class="bulk-filter-tab text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 cursor-pointer hover:bg-slate-700 transition-all" data-tab="all">
                সবগুলো
            </button>
        </div>
    `;

    let html = '';
    files.forEach((file, idx) => {
        const detectedVoucher = extractVoucherFromFilename(file.name);
        const matchedList = txnByVoucher.get(detectedVoucher) || [];
        const matchedTxn = matchedList[0] || null;
        const thumbUrl = URL.createObjectURL(file);

        let statusBadge = '';
        let isCheckable = false;
        let itemStatus = 'unmatched';

        if (matchedTxn) {
            isCheckable = true;
            itemStatus = 'ready';
            if (matchedTxn.memoPhotoUrl) {
                statusBadge = `<span class="text-[9px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20" title="পূর্বে মেমো আপলোড ছিল, প্রতিস্থাপন হবে"><i class="fa-solid fa-triangle-exclamation text-[8px] mr-1"></i>মেমো আছে</span>`;
            } else {
                statusBadge = `<span class="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20"><i class="fa-solid fa-circle-check text-[8px] mr-1"></i>প্রস্তুত</span>`;
            }
        } else {
            itemStatus = 'unmatched';
            statusBadge = `<span class="text-[9px] font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20"><i class="fa-solid fa-circle-xmark text-[8px] mr-1"></i>লেনদেন নেই</span>`;
        }

        const custInfo = matchedTxn
            ? `<div class="font-bold text-white text-xs truncate max-w-[170px]">${matchedTxn.customerName || 'কাস্টমার'}</div>
               <div class="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                   <span>${formatAppDate(matchedTxn.date)}</span>
                   ${matchedTxn.bill > 0 ? `<span class="text-red-400">বিল: ৳${formatAmountWithComma(matchedTxn.bill)}</span>` : ''}
                   ${matchedTxn.paid > 0 ? `<span class="text-emerald-400">জমা: ৳${formatAmountWithComma(matchedTxn.paid)}</span>` : ''}
               </div>`
            : `<div class="text-[11px] text-rose-300 font-medium">খতিয়ানে ভাউচার #${detectedVoucher} এন্ট্রি করা হয়নি</div>`;

        html += `
            <div class="bulk-match-row flex items-center justify-between gap-2 p-2 hover:bg-slate-900/60 transition-colors" data-idx="${idx}" data-status="${itemStatus}">
                <div class="flex items-center gap-2 overflow-hidden">
                    <input type="checkbox" class="bulk-item-check rounded accent-emerald-500 w-4 h-4 cursor-pointer" ${isCheckable ? 'checked' : 'disabled'} data-idx="${idx}">
                    <img src="${thumbUrl}" alt="thumb" class="w-9 h-11 object-cover rounded bg-slate-800 border border-slate-700 shrink-0 cursor-pointer" onclick="window.open('${thumbUrl}', '_blank')" title="বড় করে দেখতে ক্লিক করুন">
                    <div class="flex flex-col overflow-hidden">
                        <div class="flex items-center gap-1.5">
                            <span class="text-[11px] font-mono font-black text-cyan-400">#${detectedVoucher || '—'}</span>
                            <span class="text-[10px] text-slate-500 truncate max-w-[100px]">${file.name}</span>
                        </div>
                        ${custInfo}
                    </div>
                </div>
                <div class="shrink-0 flex items-center gap-1">
                    ${statusBadge}
                </div>
            </div>
        `;
    });

    matchList.innerHTML = html;

    // Filter tab switching
    document.querySelectorAll('.bulk-filter-tab').forEach(tabBtn => {
        tabBtn.onclick = () => {
            const targetTab = tabBtn.dataset.tab;
            document.querySelectorAll('.bulk-match-row').forEach(row => {
                if (targetTab === 'all') {
                    row.style.display = 'flex';
                } else if (targetTab === 'ready') {
                    row.style.display = row.dataset.status === 'ready' ? 'flex' : 'none';
                } else if (targetTab === 'unmatched') {
                    row.style.display = row.dataset.status === 'unmatched' ? 'flex' : 'none';
                }
            });
        };
    });

    // Toggle select all
    const selectAllBtn = document.getElementById('bulk-select-all-btn');
    if (selectAllBtn) {
        let allChecked = true;
        selectAllBtn.onclick = () => {
            allChecked = !allChecked;
            document.querySelectorAll('.bulk-item-check:not(:disabled)').forEach(cb => cb.checked = allChecked);
            selectAllBtn.innerText = allChecked ? 'সবগুলো আনচেক' : 'সবগুলো সিলেক্ট';
        };
    }
}

/**
 * Executes the batch upload, compression, R2 storage, and Firestore transaction update
 */
async function executeBulkUpload(files, allTxns) {
    const checkboxes = document.querySelectorAll('.bulk-item-check:checked');
    const selectedIndices = Array.from(checkboxes).map(cb => parseInt(cb.dataset.idx, 10));

    if (!selectedIndices.length) {
        showToast('আপলোড করার জন্য কমপক্ষে একটি প্রস্তুত মেমো সিলেক্ট করুন।', 'warning');
        return false;
    }

    const isPinValid = await promptSecurityPin("বাল্ক মেমো আপলোড ও লিঙ্ক");
    if (!isPinValid) return false;

    // UI elements for progress
    const progressContainer = document.getElementById('bulk-progress-container');
    const progressBar = document.getElementById('bulk-progress-bar');
    const progressStatus = document.getElementById('bulk-progress-status');
    const progressPct = document.getElementById('bulk-progress-pct');
    const confirmBtn = Swal.getConfirmButton();
    const cancelBtn = Swal.getCancelButton();

    if (progressContainer) progressContainer.classList.remove('hidden');
    if (confirmBtn) confirmBtn.disabled = true;
    if (cancelBtn) cancelBtn.disabled = true;

    // Lookup map
    const txnByVoucher = new Map();
    allTxns.forEach(t => {
        if (t.voucherNo) {
            const cleanV = String(t.voucherNo).trim().replace(/^[#\s]+/, '');
            if (!txnByVoucher.has(cleanV)) txnByVoucher.set(cleanV, []);
            txnByVoucher.get(cleanV).push(t);
        }
    });

    let successCount = 0;
    let failCount = 0;
    const totalToUpload = selectedIndices.length;

    for (let i = 0; i < totalToUpload; i++) {
        const fileIdx = selectedIndices[i];
        const file = files[fileIdx];
        const voucherNo = extractVoucherFromFilename(file.name);
        const matchedList = txnByVoucher.get(voucherNo) || [];
        const targetTxn = matchedList[0];

        const currentNum = i + 1;
        const pct = Math.round((currentNum / totalToUpload) * 100);

        if (progressStatus) progressStatus.innerText = `${currentNum}/${totalToUpload}: ভাউচার #${voucherNo} আপলোড হচ্ছে...`;
        if (progressPct) progressPct.innerText = `${pct}%`;
        if (progressBar) progressBar.style.width = `${pct}%`;

        try {
            if (!targetTxn) throw new Error('লেনদেন পাওয়া যায়নি');

            // 1. Compress file (if already WebP and < 50KB, can use directly, else compressScannedMemo)
            let uploadBlob = file;
            if (file.type !== 'image/webp' || file.size > 50 * 1024) {
                const comp = await compressScannedMemo(file);
                uploadBlob = comp.blob;
            }

            // 2. Upload to Cloudflare R2
            const r2Res = await uploadMemoToR2(uploadBlob, voucherNo, targetTxn.customerId || '');
            if (!r2Res || !r2Res.url) throw new Error('R2 রেসপন্স ত্রুটিপূর্ণ');

            // 3. Update Firestore Transaction Record
            await TransactionDAO.update(targetTxn.id, {
                memoPhotoUrl: r2Res.url,
                memoPhotoPath: r2Res.filename,
                memoUploadedAt: new Date().toISOString()
            });

            // Update in local cache if present
            targetTxn.memoPhotoUrl = r2Res.url;
            targetTxn.memoPhotoPath = r2Res.filename;

            successCount++;
        } catch (err) {
            console.error(`Failed to upload memo for voucher #${voucherNo}:`, err);
            failCount++;
        }
    }

    // Refresh ledger UI
    if (typeof window.loadRecentTransactions === 'function') {
        window.loadRecentTransactions();
    }

    Swal.fire({
        title: '<i class="fa-solid fa-circle-check text-emerald-400 mr-2"></i>বাল্ক আপলোড সম্পন্ন!',
        html: `
            <div class="font-bn text-sm text-slate-300 space-y-2 text-center">
                <div class="text-base font-bold text-white">মোট ${totalToUpload}টি মেমোর মধ্যে <span class="text-emerald-400 font-mono font-black">${successCount}টি</span> সফলভাবে লিঙ্ক হয়েছে!</div>
                ${failCount > 0 ? `<div class="text-xs text-rose-400 font-bold">${failCount}টি আপলোড ব্যর্থ হয়েছে।</div>` : ''}
                <div class="text-xs text-slate-500 pt-1">খতিয়ান টেবিলে গোল্ডেন মেমো আইকন দৃশ্যমান হয়েছে।</div>
            </div>
        `,
        icon: 'success',
        confirmButtonText: 'ঠিক আছে',
        customClass: { popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn' }
    });

    return true;
}
