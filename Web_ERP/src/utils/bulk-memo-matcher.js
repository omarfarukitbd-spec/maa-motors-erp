import Swal from 'sweetalert2';
import { TransactionDAO } from '../dao.js';
import { uploadMemoToR2 } from './r2-memo-uploader.js';
import { compressScannedMemo, isValidImageFile } from './memo-compressor.js';
import { showToast, formatAmountWithComma, formatAppDate } from '../utils.js';

/**
 * Normalizes voucher string: converts Bengali numerals to English,
 * strips leading prefixes, spaces, # and leading zeros.
 * e.g. "০১০১" -> "101", " 0148 " -> "148", "#101" -> "101"
 */
export function cleanVoucherNumber(str) {
    if (!str && str !== 0) return '';
    let val = String(str).trim();
    const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    for (let i = 0; i < 10; i++) {
        val = val.replaceAll(bnDigits[i], String(i));
    }
    val = val.replace(/^(?:memo[_-]?|inv[_-]?|v[_-]?|[#\s])+/i, '');
    val = val.replace(/^0+(?=\d)/, '');
    return val.trim();
}

/**
 * Extracts numeric or alphanumeric voucher ID from filename
 */
export function extractVoucherFromFilename(filename) {
    if (!filename) return '';
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, '').trim();
    const match = nameWithoutExt.match(/(?:memo[_-]?|inv[_-]?|v[_-]?)?(\d+)/i);
    const rawNum = match ? match[1] : nameWithoutExt.replace(/^[#\s]+/, '');
    return cleanVoucherNumber(rawNum);
}

/**
 * Safely extracts 4-digit year from transaction date
 */
export function getTxnYear(t) {
    if (!t) return '';
    if (t.date && typeof t.date.toDate === 'function') {
        return String(t.date.toDate().getFullYear());
    }
    const dStr = String(t.date || t.createdAt || '').trim();
    const yStart = dStr.match(/^(\d{4})/);
    if (yStart) return yStart[1];
    const yAny = dStr.match(/(?:^|[\/\-\s])(\d{4})(?:$|[\/\-\sT])/);
    if (yAny) return yAny[1];
    return '';
}


/**
 * Generates HTML for customer information line
 */
function renderCustInfoHtml(matchedTxn, voucher) {
    if (matchedTxn) {
        return `
            <div class="font-bold text-white text-xs truncate max-w-[170px]">${matchedTxn.customerName || 'কাস্টমার'}</div>
            <div class="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                <span>${formatAppDate(matchedTxn.date)}</span>
                ${matchedTxn.bill > 0 ? `<span class="text-red-400">বিল: ৳${formatAmountWithComma(matchedTxn.bill)}</span>` : ''}
                ${matchedTxn.paid > 0 ? `<span class="text-emerald-400">জমা: ৳${formatAmountWithComma(matchedTxn.paid)}</span>` : ''}
            </div>`;
    }
    return `<div class="text-[11px] text-rose-300 font-medium">খতিয়ানে ভাউচার #${voucher || '—'} নেই</div>`;
}

/**
 * Generates badge class and icon for match status
 */
function renderStatusBadge(matchedTxn) {
    if (!matchedTxn) {
        return { cls: "text-[9px] font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20", html: '<i class="fa-solid fa-circle-xmark text-[8px] mr-1"></i>লেনদেন নেই' };
    }
    if (matchedTxn.memoPhotoUrl) {
        return { cls: "text-[9px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20", html: '<i class="fa-solid fa-triangle-exclamation text-[8px] mr-1"></i>মেমো আছে' };
    }
    return { cls: "text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20", html: '<i class="fa-solid fa-circle-check text-[8px] mr-1"></i>প্রস্তুত' };
}

/**
 * Builds lookup map of transactions indexed by cleaned voucher number
 */
function buildTxnMapByVoucher(allTxns, selectedYear) {
    const filteredTxns = (selectedYear && selectedYear !== 'all')
        ? allTxns.filter(t => getTxnYear(t) === selectedYear)
        : allTxns;

    const txnByVoucher = new Map();
    filteredTxns.forEach(t => {
        if (t.voucherNo) {
            const cleanV = cleanVoucherNumber(t.voucherNo);
            if (cleanV) {
                if (!txnByVoucher.has(cleanV)) txnByVoucher.set(cleanV, []);
                txnByVoucher.get(cleanV).push(t);
            }
        }
    });
    return txnByVoucher;
}

/**
 * Opens the Bulk Scanned Memos Auto-Matcher modal
 */
export async function openBulkMemoMatcherModal() {
    let stagedFiles = [];
    let allTxns = [];
    const currentYear = new Date().getFullYear().toString();
    let selectedYear = currentYear;

    try {
        try {
            allTxns = await TransactionDAO.getAll();
        } catch (e) {
            console.error("Failed to load txns for bulk matcher:", e);
            allTxns = window._currentLedgerTxns || [];
        }

        const detectedYears = Array.from(new Set(
            allTxns.map(t => getTxnYear(t)).filter(y => y && y.length === 4)
        )).sort((a, b) => b.localeCompare(a));

        if (!detectedYears.includes(currentYear)) detectedYears.unshift(currentYear);

        const yearOptionsHtml = detectedYears.map(yr => `
            <option value="${yr}" ${yr === currentYear ? 'selected' : ''}>
                ${yr === currentYear ? `${yr} (চলতি সাল)` : `${yr} সাল`}
            </option>
        `).join('') + `<option value="all">সকল সাল (All Years)</option>`;

        Swal.fire({
            title: `
                <div class="flex items-center justify-between w-full pb-2 border-b border-slate-800 font-bn">
                    <div class="flex items-center gap-2 text-white text-base font-black">
                        <i class="fa-solid fa-layer-group text-amber-400"></i>
                        <span>বাল্ক মেমো ম্যাচিং ইঞ্জিন</span>
                    </div>
                    <div class="flex items-center gap-1.5 bg-slate-900 border border-slate-700/80 px-2 py-1 rounded-xl">
                        <span class="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                            <i class="fa-solid fa-calendar-days text-amber-400 text-[10px]"></i>
                            <span>সাল:</span>
                        </span>
                        <select id="bulk-year-select" class="bg-slate-950 text-cyan-400 font-mono font-bold text-xs border border-slate-700/80 rounded-lg px-2 py-0.5 outline-none focus:border-amber-400 cursor-pointer">
                            ${yearOptionsHtml}
                        </select>
                    </div>
                </div>`,
            html: `
                <div class="flex flex-col gap-3 font-bn text-left p-1">
                    <div id="bulk-dropzone" class="border-2 border-dashed border-slate-700 hover:border-amber-500/60 bg-slate-900/80 rounded-2xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group">
                        <input type="file" id="bulk-file-input" multiple accept="image/*,.webp" class="hidden">
                        <div class="w-11 h-11 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 text-lg group-hover:text-amber-400 group-hover:scale-110 transition-all">
                            <i class="fa-solid fa-cloud-arrow-up"></i>
                        </div>
                        <div class="text-xs text-slate-200 font-bold">একসাথে একাধিক মেমোর ছবি টেনে আনুন (Drag & Drop) অথবা <span class="text-amber-400 underline">ব্রাউজ করুন</span></div>
                        <div class="text-[10px] text-slate-400 font-medium">১০ থেকে ৫০+ ছবি একবারে সিলেক্ট করুন (যেমন: 101.webp, 102.webp...)</div>
                    </div>
                    <div id="bulk-preview-section" class="hidden flex flex-col gap-2">
                        <div class="flex items-center justify-between px-1">
                            <div id="bulk-count-badge" class="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                                <i class="fa-solid fa-images"></i> <span>০টি ছবি নির্বাচিত</span>
                            </div>
                            <button type="button" id="bulk-select-all-btn" class="text-[11px] font-bold text-cyan-400 hover:underline cursor-pointer">সবগুলো আনচেক</button>
                        </div>
                        <div class="max-h-72 overflow-y-auto custom-scrollbar border border-slate-800 rounded-xl bg-slate-950/60 divide-y divide-slate-800/80" id="bulk-match-list"></div>
                    </div>
                    <div id="bulk-progress-container" class="hidden flex flex-col gap-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
                        <div class="flex items-center justify-between text-xs font-bold">
                            <span id="bulk-progress-status" class="text-slate-300">আপলোড শুরু হচ্ছে...</span>
                            <span id="bulk-progress-pct" class="text-amber-400 font-mono">০%</span>
                        </div>
                        <div class="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                            <div id="bulk-progress-bar" class="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-300" style="width: 0%"></div>
                        </div>
                    </div>
                </div>`,
            showCancelButton: true,
            confirmButtonText: '<i class="fa-solid fa-cloud-arrow-up mr-1.5"></i>সবগুলো আপলোড ও লিঙ্ক করুন',
            cancelButtonText: 'বাতিল',
            showConfirmButton: false,
            customClass: {
                popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn max-w-2xl w-full',
                confirmButton: 'm3-btn-primary !bg-emerald-600 hover:!bg-emerald-500 !px-5 !py-2.5 rounded-xl font-bold text-xs',
                cancelButton: '!bg-slate-900 hover:!bg-slate-800 !text-slate-400 !px-5 !py-2.5 rounded-xl font-bold text-xs border border-slate-800'
            },
            didOpen: async () => {
                const dropzone = document.getElementById('bulk-dropzone');
                const fileInput = document.getElementById('bulk-file-input');
                const yearSelect = document.getElementById('bulk-year-select');

                const handleFiles = (files) => {
                    const validFiles = Array.from(files).filter(f => isValidImageFile(f));
                    if (!validFiles.length) return showToast('কোনো সঠিক ছবি পাওয়া যায়নি। JPG, PNG বা WebP নির্বাচন করুন।', 'warning');
                    stagedFiles = validFiles;
                    renderMatchPreview(stagedFiles, allTxns, selectedYear);
                };

                if (yearSelect) {
                    yearSelect.onchange = () => {
                        selectedYear = yearSelect.value;
                        if (stagedFiles.length > 0) renderMatchPreview(stagedFiles, allTxns, selectedYear);
                    };
                }

                if (dropzone && fileInput) {
                    dropzone.onclick = () => fileInput.click();
                    fileInput.onchange = (e) => { if (e.target.files?.length) handleFiles(e.target.files); };
                    dropzone.ondragover = (e) => { e.preventDefault(); dropzone.classList.add('!border-amber-400', '!bg-amber-500/10'); };
                    dropzone.ondragleave = () => { dropzone.classList.remove('!border-amber-400', '!bg-amber-500/10'); };
                    dropzone.ondrop = (e) => {
                        e.preventDefault();
                        dropzone.classList.remove('!border-amber-400', '!bg-amber-500/10');
                        if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
                    };
                }
            },
            preConfirm: async () => executeBulkUpload(stagedFiles, allTxns, selectedYear)
        });
    } catch (err) {
        console.error("Bulk matcher modal error:", err);
        showToast('মোডাল লোড করতে সমস্যা হয়েছে', 'error');
    }
}

/**
 * Recalculates and updates the summary badge counts
 */
function updateSummaryBadges(files, txnByVoucher) {
    const countBadge = document.getElementById('bulk-count-badge');
    if (!countBadge) return;

    let readyCount = 0;
    let unmatchedCount = 0;

    files.forEach(file => {
        const v = file._customVoucher !== undefined ? file._customVoucher : extractVoucherFromFilename(file.name);
        const list = txnByVoucher.get(v) || [];
        if (list.length > 0) readyCount++;
        else unmatchedCount++;
    });

    countBadge.innerHTML = `
        <div class="flex flex-wrap items-center gap-1.5">
            <span class="text-xs font-bold text-amber-400 flex items-center gap-1">
                <i class="fa-solid fa-images"></i> <span>মোট ${files.length}টি</span>
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
        </div>`;

    document.querySelectorAll('.bulk-filter-tab').forEach(tabBtn => {
        tabBtn.onclick = () => {
            const targetTab = tabBtn.dataset.tab;
            document.querySelectorAll('.bulk-match-row').forEach(row => {
                if (targetTab === 'all') row.style.display = 'flex';
                else if (targetTab === 'ready') row.style.display = row.dataset.status === 'ready' ? 'flex' : 'none';
                else if (targetTab === 'unmatched') row.style.display = row.dataset.status === 'unmatched' ? 'flex' : 'none';
            });
        };
    });
}

/**
 * Renders the match preview table inside the SweetAlert modal
 */
function renderMatchPreview(files, allTxns, selectedYear) {
    const previewSection = document.getElementById('bulk-preview-section');
    const matchList = document.getElementById('bulk-match-list');
    const confirmBtn = Swal.getConfirmButton();

    if (!previewSection || !matchList) return;

    previewSection.classList.remove('hidden');
    if (confirmBtn) confirmBtn.style.display = 'inline-flex';

    const txnByVoucher = buildTxnMapByVoucher(allTxns, selectedYear);
    updateSummaryBadges(files, txnByVoucher);

    let html = '';
    files.forEach((file, idx) => {
        const detectedVoucher = file._customVoucher !== undefined
            ? file._customVoucher
            : extractVoucherFromFilename(file.name);
        file._customVoucher = detectedVoucher;

        const matchedList = txnByVoucher.get(detectedVoucher) || [];
        const matchedTxn = matchedList[0] || null;
        const thumbUrl = URL.createObjectURL(file);
        const badgeInfo = renderStatusBadge(matchedTxn);
        const itemStatus = matchedTxn ? 'ready' : 'unmatched';
        const isCheckable = matchedTxn !== null;

        html += `
            <div class="bulk-match-row flex items-center justify-between gap-2 p-2 hover:bg-slate-900/60 transition-colors" data-idx="${idx}" data-status="${itemStatus}">
                <div class="flex items-center gap-2 overflow-hidden">
                    <input type="checkbox" class="bulk-item-check rounded accent-emerald-500 w-4 h-4 cursor-pointer" ${isCheckable ? 'checked' : 'disabled'} data-idx="${idx}">
                    <img src="${thumbUrl}" alt="thumb" class="w-9 h-11 object-cover rounded bg-slate-800 border border-slate-700 shrink-0 cursor-pointer" onclick="window.open('${thumbUrl}', '_blank')" title="বড় করে দেখতে ক্লিক করুন">
                    <div class="flex flex-col overflow-hidden">
                        <div class="flex items-center gap-1.5">
                            <div class="flex items-center bg-slate-900 border border-slate-700 focus-within:border-cyan-400 rounded px-1.5 py-0.5 transition-colors" title="ভাউচার নাম্বারে ভুল থাকলে সরাসরি এডিট করুন">
                                <span class="text-[10px] font-mono font-bold text-slate-500 mr-0.5">#</span>
                                <input type="text" class="bulk-voucher-input bg-transparent text-[11px] font-mono font-bold text-cyan-400 outline-none w-16" value="${detectedVoucher}" data-idx="${idx}">
                            </div>
                            <span class="text-[10px] text-slate-500 truncate max-w-[100px]" title="${file.name}">${file.name}</span>
                        </div>
                        <div id="bulk-cust-info-${idx}">
                            ${renderCustInfoHtml(matchedTxn, detectedVoucher)}
                        </div>
                    </div>
                </div>
                <div class="shrink-0 flex items-center gap-1">
                    <span id="bulk-status-badge-${idx}" class="${badgeInfo.cls}">${badgeInfo.html}</span>
                </div>
            </div>`;
    });

    matchList.innerHTML = html;

    document.querySelectorAll('.bulk-voucher-input').forEach(inputEl => {
        const updateRow = () => {
            const idx = parseInt(inputEl.dataset.idx, 10);
            const file = files[idx];
            if (!file) return;

            const cleanVal = cleanVoucherNumber(inputEl.value);
            inputEl.value = cleanVal;
            file._customVoucher = cleanVal;

            const matchedList = txnByVoucher.get(cleanVal) || [];
            const matchedTxn = matchedList[0] || null;
            const rowEl = document.querySelector(`.bulk-match-row[data-idx="${idx}"]`);
            const custInfoEl = document.getElementById(`bulk-cust-info-${idx}`);
            const statusBadgeEl = document.getElementById(`bulk-status-badge-${idx}`);
            const checkboxEl = document.querySelector(`.bulk-item-check[data-idx="${idx}"]`);

            if (rowEl) rowEl.dataset.status = matchedTxn ? 'ready' : 'unmatched';
            if (checkboxEl) {
                checkboxEl.disabled = !matchedTxn;
                checkboxEl.checked = matchedTxn !== null;
            }
            if (statusBadgeEl) {
                const b = renderStatusBadge(matchedTxn);
                statusBadgeEl.className = b.cls;
                statusBadgeEl.innerHTML = b.html;
            }
            if (custInfoEl) {
                custInfoEl.innerHTML = renderCustInfoHtml(matchedTxn, cleanVal);
            }

            updateSummaryBadges(files, txnByVoucher);
        };

        inputEl.oninput = updateRow;
        inputEl.onchange = updateRow;
        inputEl.onkeydown = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const idx = parseInt(inputEl.dataset.idx, 10);
                const nextInput = document.querySelector(`.bulk-voucher-input[data-idx="${idx + 1}"]`);
                if (nextInput) {
                    nextInput.focus();
                    nextInput.select();
                }
            }
        };
    });

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
async function executeBulkUpload(files, allTxns, selectedYear) {
    const checkboxes = document.querySelectorAll('.bulk-item-check:checked');
    const selectedIndices = Array.from(checkboxes).map(cb => parseInt(cb.dataset.idx, 10));

    if (!selectedIndices.length) {
        showToast('আপলোড করার জন্য কমপক্ষে একটি প্রস্তুত মেমো সিলেক্ট করুন।', 'warning');
        return false;
    }


    const progressContainer = document.getElementById('bulk-progress-container');
    const progressBar = document.getElementById('bulk-progress-bar');
    const progressStatus = document.getElementById('bulk-progress-status');
    const progressPct = document.getElementById('bulk-progress-pct');
    const confirmBtn = Swal.getConfirmButton();
    const cancelBtn = Swal.getCancelButton();

    if (progressContainer) progressContainer.classList.remove('hidden');
    if (confirmBtn) confirmBtn.disabled = true;
    if (cancelBtn) cancelBtn.disabled = true;

    const txnByVoucher = buildTxnMapByVoucher(allTxns, selectedYear);
    let successCount = 0;
    let failCount = 0;
    const totalToUpload = selectedIndices.length;

    for (let i = 0; i < totalToUpload; i++) {
        const fileIdx = selectedIndices[i];
        const file = files[fileIdx];
        const voucherNo = file._customVoucher !== undefined ? file._customVoucher : extractVoucherFromFilename(file.name);
        const matchedList = txnByVoucher.get(voucherNo) || [];
        const targetTxn = matchedList[0];

        const currentNum = i + 1;
        const pct = Math.round((currentNum / totalToUpload) * 100);

        if (progressStatus) progressStatus.innerText = `${currentNum}/${totalToUpload}: ভাউচার #${voucherNo} আপলোড হচ্ছে...`;
        if (progressPct) progressPct.innerText = `${pct}%`;
        if (progressBar) progressBar.style.width = `${pct}%`;

        try {
            if (!targetTxn) throw new Error('লেনদেন পাওয়া যায়নি');

            let uploadBlob = file;
            if (file.type !== 'image/webp' || file.size > 50 * 1024) {
                const comp = await compressScannedMemo(file);
                uploadBlob = comp.blob;
            }

            const r2Res = await uploadMemoToR2(uploadBlob, voucherNo, targetTxn.customerId || '');
            if (!r2Res || !r2Res.url) throw new Error('R2 রেসপন্স ত্রুটিপূর্ণ');

            for (const txn of matchedList) {
                await TransactionDAO.update(txn.id, {
                    memoPhotoUrl: r2Res.url,
                    memoPhotoPath: r2Res.filename,
                    memoUploadedAt: new Date().toISOString()
                });
                txn.memoPhotoUrl = r2Res.url;
                txn.memoPhotoPath = r2Res.filename;
            }

            successCount++;
        } catch (err) {
            console.error(`Failed to upload memo for voucher #${voucherNo}:`, err);
            failCount++;
        }
    }

    if (typeof window.loadRecentTransactions === 'function') {
        window.loadRecentTransactions();
    }

    Swal.fire({
        title: '<i class="fa-solid fa-circle-check text-emerald-400 mr-2"></i>বাল্ক আপলোড সম্পন্ন!',
        html: `
            <div class="font-bn text-sm text-slate-300 space-y-2 text-center">
                <div class="text-base font-bold text-white">মোট ${totalToUpload}টি মেমোর মধ্যে <span class="text-emerald-400 font-mono font-black">${successCount}টি</span> সফলভাবে লিঙ্ক হয়েছে!</div>
                ${failCount > 0 ? `<div class="text-xs text-rose-400 font-bold">${failCount}টি আপলোড ব্যর্থ হয়েছে।</div>` : ''}
                <div class="text-xs text-slate-400 pt-1">খতিয়ান টেবিলে গোল্ডেন মেমো আইকন দৃশ্যমান হয়েছে।</div>
            </div>`,
        icon: 'success',
        confirmButtonText: 'ঠিক আছে',
        customClass: { popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn' }
    });

    return true;
}
