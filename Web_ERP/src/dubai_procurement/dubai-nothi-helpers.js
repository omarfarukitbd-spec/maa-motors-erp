/**
 * Shared helpers for Nothi Khata modules (০০০১–০০০৬):
 * - Standardized Excel export via SheetJS (`XLSX`)
 * - Soft-delete archival to `recycle_bin` + `auditLog` trail
 */

import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { db, firebase } from '../firebase-config.js';
import { auditLog } from '../audit.js';
import { showToast, escapeHTML } from '../utils.js';

/**
 * Exports structured tabular rows to an Excel (.xlsx) workbook with auto column widths.
 * @param {Object} opts
 * @param {string} opts.sheetName
 * @param {Array<string>} opts.headers
 * @param {Array<Array<string|number>>} opts.rows
 * @param {string} opts.filename
 */
export function exportNothiRowsToExcel({ sheetName = 'Nothi_Data', headers = [], rows = [], filename = 'nothi_export.xlsx' }) {
    if (!Array.isArray(rows) || rows.length === 0) {
        showToast('এক্সপোর্ট করার মতো কোনো ডাটা পাওয়া যায়নি!', 'warning', 'এক্সপোর্ট');
        return;
    }

    try {
        const aoa = [headers, ...rows];
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(aoa);

        ws['!cols'] = headers.map((header, colIdx) => {
            let maxLen = String(header || '').length;
            for (const row of rows) {
                const cellLen = String(row?.[colIdx] ?? '').length;
                if (cellLen > maxLen) maxLen = cellLen;
            }
            return { wch: Math.min(Math.max(maxLen + 4, 12), 45) };
        });

        const safeSheetName = String(sheetName || 'Sheet1').replace(/[\\/?*[\]:]/g, '_').slice(0, 31) || 'Sheet1';
        XLSX.utils.book_append_sheet(wb, ws, safeSheetName);
        XLSX.writeFile(wb, filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`);
        showToast('এক্সেল ফাইল সফলভাবে ডাউনলোড হয়েছে!', 'success', 'এক্সপোর্ট');
    } catch (e) {
        console.error('Nothi Excel export error:', e);
        showToast('এক্সেল এক্সপোর্ট করতে সমস্যা হয়েছে!', 'error', 'এক্সপোর্ট');
    }
}

/**
 * Opens a standardized dark-mode SweetAlert confirmation popup.
 * @param {Object} opts
 * @returns {Promise<boolean>}
 */
export async function confirmNothiAction({
    title = 'নিশ্চিত করুন',
    text = '',
    html = '',
    icon = 'warning',
    confirmButtonText = 'হ্যাঁ, সম্পন্ন করুন',
    cancelButtonText = 'বাতিল',
    confirmButtonColor = '#dc2626'
} = {}) {
    const result = await Swal.fire({
        title,
        text: html ? undefined : text,
        html: html || undefined,
        icon,
        showCancelButton: true,
        confirmButtonColor,
        cancelButtonColor: '#334155',
        confirmButtonText,
        cancelButtonText,
        background: '#0f172a',
        color: '#f8fafc'
    });
    return Boolean(result.isConfirmed);
}

/**
 * Archives a deleted Nothi document into `recycle_bin` (soft backup) and records an `auditLog` entry.
 * Call right BEFORE deleting the target Firestore doc, or pass pre-fetched `snapshotData`.
 *
 * @param {Object} opts
 */
export async function archiveNothiDocToRecycleBin({
    collectionName,
    docId,
    moduleLabel = 'Nothi Khata',
    itemName = '',
    snapshotData = null,
    extraDetails = {}
}) {
    if (!collectionName || !docId) return;

    try {
        let data = snapshotData;
        if (!data) {
            const snap = await db.collection(collectionName).doc(docId).get();
            if (snap.exists) {
                data = snap.data();
            }
        }

        if (data) {
            const recId = `REC-${collectionName}-${docId}-${Date.now()}`;
            await db.collection('recycle_bin').doc(recId).set({
                module: moduleLabel,
                collection: collectionName,
                docId,
                data,
                deletedAt: firebase.firestore.FieldValue.serverTimestamp(),
                deletedBy: window.AppState?.currentUserEmail || 'Unknown'
            });
        }

        await auditLog(
            'DELETE',
            moduleLabel,
            docId,
            itemName || docId,
            {
                collection: collectionName,
                archivedToRecycleBin: Boolean(data),
                ...extraDetails
            }
        );
    } catch (e) {
        console.error('Nothi recycle archive/audit error:', e);
    }
}

/**
 * Logs a CREATE / UPDATE / CLOSE action inside Nothi Khata safely without throwing to callers.
 */
export async function logNothiMutation({
    action = 'UPDATE',
    moduleLabel = 'Nothi Khata',
    entityId = '',
    entityName = '',
    details = {},
    changes = null
}) {
    try {
        await auditLog(action, moduleLabel, String(entityId || ''), String(entityName || ''), details, changes);
    } catch (e) {
        console.error('Nothi audit log error:', e);
    }
}

export function canViewNothiBook() {
    return !(window.AppState?.currentUserRole === 'Staff' && window.AppState?.permissions?.viewNothiBook === false);
}

export function canManageNothiEntries() {
    return !(window.AppState?.currentUserRole === 'Staff' && window.AppState?.permissions?.manageNothiEntries === false);
}

export function canDeleteNothiEntries() {
    if (window.AppState?.currentUserRole !== 'Staff') return true;
    return window.AppState?.permissions?.deleteNothiEntries === true;
}

export function renderNothiMasterLinkPill(bookLabel = '০০০৬ সমন্বিত মোট হিসাব') {
    return `
        <button type="button" onclick="window.switchDubaiProcurementView('master-summary')"
            class="px-3 py-1.5 bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 hover:text-white border border-purple-500/35 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm whitespace-nowrap">
            <i class="fa-solid fa-chart-pie text-purple-400"></i>
            <span>${escapeHTML(bookLabel)} দেখুন</span>
        </button>
    `;
}
