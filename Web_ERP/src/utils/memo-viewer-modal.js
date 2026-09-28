import Swal from 'sweetalert2';
import { compressScannedMemo, isValidImageFile } from './memo-compressor.js';
import { uploadMemoToR2 } from './r2-memo-uploader.js';
import { TransactionDAO } from '../dao.js';
import { promptSecurityPin, showToast, escapeHTML, formatAppDate, formatAmountWithComma } from '../utils.js';

let currentZoom = 1;
let currentRotation = 0;

/**
 * Open high-resolution Scanned Memo Viewer Modal with Zoom, 90deg Rotate, Direct Print and Download
 */
export async function openMemoViewerModal({ url, voucherNo = '', customerName = '', date = '', bill = 0, paid = 0, txnId = null, onUpdated = null }) {
    if (!url) {
        showToast('কোনো মেমোর ছবি পাওয়া যায়নি', 'error');
        return;
    }

    currentZoom = 1;
    currentRotation = 0;
    const cleanVoucher = voucherNo ? (voucherNo.startsWith('#') ? voucherNo : `#${voucherNo}`) : 'ভাউচার বিহীন';
    const formattedDate = date ? formatAppDate(date) : '';

    await Swal.fire({
        title: null,
        html: `
            <div class="text-left font-bn text-white select-none">
                <!-- Header Info Bar -->
                <div class="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                    <div class="flex items-center gap-2">
                        <div class="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                            <i class="fa-solid fa-file-invoice text-sm"></i>
                        </div>
                        <div>
                            <div class="text-sm font-black text-amber-300 font-mono">${escapeHTML(cleanVoucher)}</div>
                            <div class="text-[11px] text-slate-300 font-medium">${escapeHTML(customerName || 'গ্রাহকের নাম')} ${formattedDate ? '• ' + formattedDate : ''}</div>
                        </div>
                    </div>
                    <div class="flex items-center gap-1.5">
                        ${bill > 0 ? `<span class="text-xs font-mono font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-lg">বিল: ৳ ${formatAmountWithComma(bill)}</span>` : ''}
                        ${paid > 0 ? `<span class="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg">জমা: ৳ ${formatAmountWithComma(paid)}</span>` : ''}
                    </div>
                </div>

                <!-- Controls Toolbar -->
                <div class="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 mb-3 text-xs">
                    <div class="flex items-center gap-1">
                        <button type="button" id="memo-zoom-in-btn" class="h-8 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 active:scale-95 transition-all" title="বড় করুন (Zoom In)">
                            <i class="fa-solid fa-magnifying-glass-plus mr-1"></i><span>বড়</span>
                        </button>
                        <button type="button" id="memo-zoom-out-btn" class="h-8 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 active:scale-95 transition-all" title="ছোট করুন (Zoom Out)">
                            <i class="fa-solid fa-magnifying-glass-minus mr-1"></i><span>ছোট</span>
                        </button>
                        <button type="button" id="memo-rotate-btn" class="h-8 px-2.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 active:scale-95 transition-all" title="৯০ ডিগ্রি ঘোরান (Rotate 90°)">
                            <i class="fa-solid fa-rotate-right mr-1"></i><span id="memo-rotate-label">ঘোরান</span>
                        </button>
                    </div>

                    <div class="flex items-center gap-1">
                        <button type="button" id="memo-direct-print-btn" class="h-8 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold active:scale-95 transition-all" title="সরাসরি প্রিন্ট করুন">
                            <i class="fa-solid fa-print mr-1"></i><span>প্রিন্ট</span>
                        </button>
                        <a href="${escapeHTML(url)}" download="${escapeHTML(cleanVoucher.replace('#', 'Memo_'))}.webp" target="_blank" class="h-8 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center active:scale-95 transition-all" title="মেমোর ছবি ডাউনলোড">
                            <i class="fa-solid fa-download mr-1"></i><span>ডাউনলোড</span>
                        </a>
                        ${txnId ? `
                            <button type="button" id="memo-delete-btn" class="h-8 px-2 rounded-lg bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/30 active:scale-95 transition-all" title="মেমো মুছে ফেলুন">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        ` : ''}
                    </div>
                </div>

                <!-- Image Viewport -->
                <div id="memo-viewport" class="relative w-full h-[65vh] max-h-[600px] bg-slate-950/90 rounded-2xl border border-slate-800 overflow-auto flex items-center justify-center p-2 custom-scrollbar">
                    <img id="memo-display-img" src="${escapeHTML(url)}" alt="Scanned Memo" class="max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-transform duration-200 select-none origin-center" style="transform: scale(1) rotate(0deg);">
                </div>
            </div>
        `,
        showConfirmButton: false,
        showCloseButton: true,
        width: '850px',
        customClass: {
            popup: '!bg-slate-950 !rounded-3xl border border-slate-800 shadow-2xl p-4 sm:p-6'
        },
        didOpen: (popup) => {
            const img = popup.querySelector('#memo-display-img');
            const zoomInBtn = popup.querySelector('#memo-zoom-in-btn');
            const zoomOutBtn = popup.querySelector('#memo-zoom-out-btn');
            const rotateBtn = popup.querySelector('#memo-rotate-btn');
            const rotateLabel = popup.querySelector('#memo-rotate-label');
            const printBtn = popup.querySelector('#memo-direct-print-btn');
            const deleteBtn = popup.querySelector('#memo-delete-btn');

            const applyTransform = () => {
                if (img) {
                    img.style.transform = `scale(${currentZoom}) rotate(${currentRotation}deg)`;
                }
            };

            if (zoomInBtn) {
                zoomInBtn.onclick = () => {
                    if (currentZoom < 2.5) {
                        currentZoom = Math.round((currentZoom + 0.25) * 100) / 100;
                        applyTransform();
                    }
                };
            }

            if (zoomOutBtn) {
                zoomOutBtn.onclick = () => {
                    if (currentZoom > 0.6) {
                        currentZoom = Math.round((currentZoom - 0.25) * 100) / 100;
                        applyTransform();
                    }
                };
            }

            if (rotateBtn) {
                rotateBtn.onclick = () => {
                    currentRotation = (currentRotation + 90) % 360;
                    if (rotateLabel) rotateLabel.innerText = `${currentRotation}°`;
                    applyTransform();
                };
            }

            if (printBtn) {
                printBtn.onclick = () => {
                    printIsolatedMemo(url, cleanVoucher, customerName, formattedDate, currentRotation);
                };
            }

            if (deleteBtn && txnId) {
                deleteBtn.onclick = async () => {
                    const pinOk = await promptSecurityPin();
                    if (!pinOk) return;

                    try {
                        await TransactionDAO.update(txnId, {
                            memoPhotoUrl: null,
                            memoSource: null
                        });
                        showToast('সংযুক্ত মেমোর ছবি মুছে ফেলা হয়েছে', 'success');
                        Swal.close();
                        if (typeof onUpdated === 'function') onUpdated();
                    } catch (err) {
                        console.error('Failed to detach memo:', err);
                        showToast('মেমো মুছতে ব্যর্থ হয়েছে', 'error');
                    }
                };
            }
        }
    });
}

/**
 * Direct print of an isolated memo image on clean A4 page
 */
export function printIsolatedMemo(url, voucherNo, customerName, dateStr, rotation = 0) {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.left = '-9999px';
    iframe.style.top = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';

    document.body.appendChild(iframe);
    const doc = iframe.contentWindow.document;

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>${escapeHTML(voucherNo || 'Memo_Print')}</title>
            <style>
                @page { size: A4 portrait; margin: 12mm 15mm; }
                body {
                    margin: 0;
                    padding: 0;
                    font-family: 'Inter', 'Kalpurush', sans-serif;
                    color: #0f172a;
                    background: #fff;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: flex-start;
                }
                .memo-header {
                    width: 100%;
                    border-bottom: 2px solid #0284c7;
                    padding-bottom: 8px;
                    margin-bottom: 14px;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                }
                .memo-title {
                    font-size: 16px;
                    font-weight: 900;
                    color: #0f172a;
                }
                .memo-meta {
                    font-size: 11px;
                    color: #475569;
                    font-weight: 600;
                }
                .memo-img-wrapper {
                    width: 100%;
                    max-height: 240mm;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .memo-img {
                    max-width: 100%;
                    max-height: 235mm;
                    object-fit: contain;
                    transform: rotate(${rotation}deg);
                    border: 1px solid #e2e8f0;
                    border-radius: 4px;
                }
            </style>
        </head>
        <body>
            <div class="memo-header">
                <div>
                    <div class="memo-title">মেসার্স মা মোটরস্ - স্ক্যান মেমো কপি</div>
                    <div class="memo-meta">ভাউচার: <strong>${escapeHTML(voucherNo)}</strong> | গ্রাহক: <strong>${escapeHTML(customerName)}</strong></div>
                </div>
                <div class="memo-meta">তারিখ: ${escapeHTML(dateStr || '-')}</div>
            </div>
            <div class="memo-img-wrapper">
                <img src="${escapeHTML(url)}" class="memo-img" alt="Scanned Memo">
            </div>
            <script>
                window.onload = function() {
                    setTimeout(function() {
                        window.focus();
                        window.print();
                        setTimeout(function() {
                            window.parent.document.body.removeChild(window.frameElement);
                        }, 500);
                    }, 400);
                };
            </script>
        </body>
        </html>
    `;

    doc.open();
    doc.write(html);
    doc.close();
}

/**
 * Open late memo upload modal for past ledger records that lack an attached memo
 */
export async function openLateMemoUploadModal(txnId, voucherNo = '', customerName = '', onAttached = null) {
    if (!txnId) return;

    let stagedFileBlob = null;
    let stagedDataUrl = null;
    const cleanV = voucherNo ? (voucherNo.startsWith('#') ? voucherNo : `#${voucherNo}`) : 'ভাউচার';

    await Swal.fire({
        title: '<div class="flex items-center gap-2 font-bn font-black text-lg text-white"><i class="fa-solid fa-paperclip text-amber-400"></i><span>স্ক্যান মেমো সংযুক্ত করুন</span></div>',
        html: `
            <div class="text-left font-bn space-y-3 p-1">
                <div class="bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs flex justify-between items-center text-slate-300">
                    <div>ভাউচার: <strong class="text-cyan-400 font-mono">${escapeHTML(cleanV)}</strong></div>
                    <div>গ্রাহক: <strong class="text-white">${escapeHTML(customerName || 'কাস্টমার')}</strong></div>
                </div>

                <!-- Dropzone Area -->
                <div id="late-dropzone" class="border-2 border-dashed border-slate-700 hover:border-amber-400/80 bg-slate-900/60 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2">
                    <input type="file" id="late-file-input" accept="image/*" class="hidden">
                    <div class="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 text-xl group-hover:text-amber-400">
                        <i class="fa-solid fa-cloud-arrow-up"></i>
                    </div>
                    <div class="text-xs text-slate-200 font-bold">কম্পিউটার থেকে ছবি টেনে আনুন (Drag & Drop), <span class="text-amber-400 underline">ব্রাউজ করুন</span> অথবা <kbd class="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 font-mono text-[11px] border border-slate-700">Ctrl + V</kbd> পেস্ট করুন</div>
                    <div class="text-[10px] text-slate-500 font-medium">স্বয়ংক্রিয়ভাবে ২০–৫০ KB WebP ফরমেটে অপ্টিমাইজ হবে</div>
                </div>

                <!-- Compression Preview Chip -->
                <div id="late-preview-chip" class="hidden bg-slate-900 border border-emerald-500/40 p-2.5 rounded-xl flex items-center justify-between text-xs">
                    <div class="flex items-center gap-2 overflow-hidden">
                        <img id="late-thumb" src="" class="w-10 h-10 object-cover rounded-lg border border-slate-700 shrink-0">
                        <div class="truncate">
                            <div class="font-bold text-white text-xs truncate">স্ক্যান মেমো প্রস্তুত</div>
                            <div id="late-size-info" class="text-[10px] text-emerald-400 font-mono font-bold">WebP • 0 KB</div>
                        </div>
                    </div>
                    <button type="button" id="late-remove-staged" class="text-slate-400 hover:text-red-400 p-1.5" title="বাদ দিন">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-upload mr-1.5"></i>আপলোড ও সংরক্ষণ',
        cancelButtonText: 'বাতিল',
        confirmButtonColor: '#059669',
        cancelButtonColor: '#64748b',
        customClass: {
            popup: '!bg-slate-950 !rounded-3xl border border-slate-800 shadow-2xl font-bn',
            confirmButton: 'm3-btn-primary font-bold !px-6 !py-2.5 !rounded-xl',
            cancelButton: 'm3-btn-tonal font-bold !px-5 !py-2.5 !rounded-xl'
        },
        didOpen: (popup) => {
            const dropzone = popup.querySelector('#late-dropzone');
            const fileInput = popup.querySelector('#late-file-input');
            const previewChip = popup.querySelector('#late-preview-chip');
            const thumb = popup.querySelector('#late-thumb');
            const sizeInfo = popup.querySelector('#late-size-info');
            const removeBtn = popup.querySelector('#late-remove-staged');

            const handleFile = async (file) => {
                if (!isValidImageFile(file)) {
                    showToast('শুধুমাত্র ছবির ফাইল (JPG, PNG, WebP) গ্রহণযোগ্য', 'error');
                    return;
                }
                try {
                    showToast('মেমো অপ্টিমাইজ হচ্ছে...', 'info');
                    const comp = await compressScannedMemo(file);
                    stagedFileBlob = comp.blob;
                    stagedDataUrl = comp.dataUrl;

                    if (thumb) thumb.src = comp.dataUrl;
                    if (sizeInfo) sizeInfo.innerText = `WebP • ${comp.sizeKB} KB (ক্রিস্টাল ক্লিয়ার)`;
                    if (previewChip) previewChip.classList.remove('hidden');
                    if (dropzone) dropzone.classList.add('hidden');
                } catch (e) {
                    console.error('Late compression error:', e);
                    showToast(e.message || 'ছবি প্রসেস করতে ব্যর্থ', 'error');
                }
            };

            popup.onpaste = (e) => {
                const items = e.clipboardData?.items;
                if (!items) return;
                for (let i = 0; i < items.length; i++) {
                    if (items[i].type && items[i].type.indexOf('image') !== -1) {
                        const blob = items[i].getAsFile();
                        if (blob) {
                            e.preventDefault();
                            showToast('ক্লিপবোর্ড থেকে ছবি গ্রহণ করা হয়েছে', 'info');
                            handleFile(blob);
                            break;
                        }
                    }
                }
            };

            if (dropzone && fileInput) {
                dropzone.onclick = () => fileInput.click();
                fileInput.onchange = (e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFile(f);
                };

                dropzone.ondragover = (e) => { e.preventDefault(); dropzone.classList.add('border-amber-400'); };
                dropzone.ondragleave = () => { dropzone.classList.remove('border-amber-400'); };
                dropzone.ondrop = (e) => {
                    e.preventDefault();
                    dropzone.classList.remove('border-amber-400');
                    const f = e.dataTransfer?.files?.[0];
                    if (f) handleFile(f);
                };
            }

            if (removeBtn) {
                removeBtn.onclick = () => {
                    stagedFileBlob = null;
                    stagedDataUrl = null;
                    if (previewChip) previewChip.classList.add('hidden');
                    if (dropzone) dropzone.classList.remove('hidden');
                    if (fileInput) fileInput.value = '';
                };
            }
        },
        preConfirm: async () => {
            if (!stagedFileBlob) {
                Swal.showValidationMessage('অনুগ্রহ করে আগে একটি মেমোর ছবি নির্বাচন করুন');
                return false;
            }
            try {
                Swal.showLoading();
                const uploadRes = await uploadMemoToR2(stagedFileBlob, cleanV, txnId);
                if (!uploadRes.success || !uploadRes.url) {
                    throw new Error(uploadRes.error || 'আপলোড ব্যর্থ হয়েছে');
                }

                await TransactionDAO.update(txnId, {
                    memoPhotoUrl: uploadRes.url,
                    memoSource: 'offline_scan'
                });

                return uploadRes.url;
            } catch (err) {
                console.error('Late upload error:', err);
                Swal.showValidationMessage(err.message || 'মেমো সেভ করতে সমস্যা হয়েছে');
                return false;
            }
        }
    });

    // If modal completed with uploaded URL
    // (preConfirm returns the URL)
    if (typeof onAttached === 'function') {
        onAttached();
    }
}
