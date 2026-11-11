/**
 * Smart Print Engine — Unified Iframe Sandbox Auto-Paginator & Layout Guard
 * 1. Off-screen 794px iframe sandbox measures real heights after Google Fonts & CSS apply.
 * 2. SAFE_A4_HEIGHT_PX (1075px) prevents Chromium 96dpi ghost blank pages & sliced borders.
 * 3. Supports atomic rowGroups (rowspan blocks), near-1-page micro-fit, and no-orphan signatures.
 * 4. @page { margin: 0 } removes Chrome URL/date headers while preserving per-page safe padding.
 */

import { IFRAME_PRINT_CSS } from './print-iframe-css.js';
import {
    A4_WIDTH_PX,
    A4_HEIGHT_PX,
    SAFE_A4_HEIGHT_PX,
    normalizePrintBodyHtml,
    waitForPrintAssets,
    measureOuterHeight,
    computeSmartPageSlices,
    applyUniversalPrintOverflowGuard
} from './print-autofit-guard.js';

const FONT_LINKS_HTML = `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Anek+Bangla:wght@400;500;600;700;800;900&family=Hind+Siliguri:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<link href="https://fonts.maateen.me/kalpurush/font.css" rel="stylesheet">`;

function buildFooterHtml(formattedDate, pageNum, totalPages) {
    return `<div style="display:flex;justify-content:space-between;align-items:center;font-size:10px;color:#475569;font-weight:700;border-top:1px solid #cbd5e1;padding-top:6px;margin-top:8px;font-family:'Anek Bangla','Hind Siliguri','Inter',sans-serif;">
        <span>${formattedDate ? 'তারিখ: ' + formattedDate : ''}</span>
        <span>পৃষ্ঠা ${pageNum} / ${totalPages}</span>
    </div>`;
}

function normalizeRowItem(item) {
    if (typeof item === 'object' && item !== null) {
        return {
            html: item.html || '',
            isGroup: Boolean(item.isGroup || item.groupHtml)
        };
    }
    return { html: String(item || ''), isGroup: false };
}

function buildTableBodiesHtml(rows, tableClass) {
    const tbodyStyle = tableClass === 'print-items-table' ? ' style="font-size:10px;"' : '';
    const chunks = [];
    let plainBuffer = [];

    const flushPlain = () => {
        if (plainBuffer.length > 0) {
            chunks.push(`<tbody${tbodyStyle}>${plainBuffer.join('')}</tbody>`);
            plainBuffer = [];
        }
    };

    rows.forEach(rawItem => {
        const item = normalizeRowItem(rawItem);
        if (!item.html) return;
        if (item.isGroup) {
            flushPlain();
            chunks.push(`<tbody class="print-row-group"${tbodyStyle}>${item.html}</tbody>`);
        } else {
            plainBuffer.push(item.html);
        }
    });
    flushPlain();
    return chunks.join('');
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. UNIFIED SANDBOX MEASUREMENT UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

async function measurePrintMetricsInSandbox({
    rowsArray = [],
    page1HeaderHtml = '',
    repeatHeaderHtml = '',
    page1ExtraHtml = '',
    tableColHeaderHtml = '',
    tableFooterRowsHtml = '',
    summaryHtml = '',
    signatureHtml = '',
    formattedDate = '',
    extraCss = '',
    tableClass = 'data-table',
    tableStyle = '',
    sheetPadding = '6px 12px'
}) {
    const old = document.getElementById('__spe_measure_iframe__');
    if (old) old.remove();

    const iframe = document.createElement('iframe');
    iframe.id = '__spe_measure_iframe__';
    iframe.setAttribute('aria-hidden', 'true');
    iframe.style.cssText = `position:fixed;left:-9999px;top:0;width:${A4_WIDTH_PX}px;height:${A4_HEIGHT_PX}px;border:none;visibility:hidden;pointer-events:none;`;
    document.body.appendChild(iframe);

    try {
        const mDoc = iframe.contentDocument || iframe.contentWindow.document;
        const normalizedRows = (rowsArray || []).map(normalizeRowItem);
        const rowTbodiesHtml = normalizedRows
            .map((r, idx) => `<tbody data-row-idx="${idx}">${r.html}</tbody>`)
            .join('');
        const tblStyle = tableStyle || 'width:100%;border-collapse:collapse;table-layout:auto;margin-top:2px;border:1px solid #cbd5e1;';
        const footerSample = buildFooterHtml(formattedDate, 1, 1);

        mDoc.open();
        mDoc.write(`<!DOCTYPE html><html lang="bn"><head><meta charset="UTF-8">${FONT_LINKS_HTML}<style>${IFRAME_PRINT_CSS}${extraCss}</style></head>
        <body>
            <div data-m="sheet" style="width:${A4_WIDTH_PX}px;box-sizing:border-box;padding:${sheetPadding};background:#fff;">
                <div data-m="p1h" style="display:flow-root;padding-top:2px;margin-bottom:4px;">${page1HeaderHtml}</div>
                <div data-m="reph" style="display:flow-root;padding-top:2px;margin-bottom:4px;">${repeatHeaderHtml}</div>
                <div data-m="ext" style="display:flow-root;">${page1ExtraHtml}</div>
                <table data-m="tbl" style="${tblStyle}" class="${tableClass}">
                    ${tableColHeaderHtml}
                    ${rowTbodiesHtml}
                    ${tableFooterRowsHtml ? `<tbody data-m="tfootrows">${tableFooterRowsHtml}</tbody>` : ''}
                </table>
                <div data-m="sum" style="display:flow-root;">${summaryHtml}</div>
                <div data-m="sig" style="display:flow-root;">${signatureHtml}</div>
                <div data-m="ftr" style="display:flow-root;">${footerSample}</div>
            </div>
        </body></html>`);
        mDoc.close();

        await waitForPrintAssets(mDoc, 1500);

        const sheetEl = mDoc.querySelector('[data-m="sheet"]');
        const csSheet = mDoc.defaultView.getComputedStyle(sheetEl);
        const sheetPadV = Math.ceil((parseFloat(csSheet.paddingTop) || 0) + (parseFloat(csSheet.paddingBottom) || 0));

        const p1HeaderH = measureOuterHeight(mDoc.querySelector('[data-m="p1h"]'));
        const repeatHeaderH = repeatHeaderHtml ? measureOuterHeight(mDoc.querySelector('[data-m="reph"]')) : 38;
        const extraH = page1ExtraHtml ? measureOuterHeight(mDoc.querySelector('[data-m="ext"]')) : 0;
        const theadEl = mDoc.querySelector('[data-m="tbl"] thead');
        const theadH = theadEl ? Math.ceil(theadEl.getBoundingClientRect().height || 0) : 0;
        const tfootRowsEl = mDoc.querySelector('[data-m="tfootrows"]');
        const tableFooterH = tfootRowsEl ? Math.ceil(tfootRowsEl.getBoundingClientRect().height || 0) : 0;
        const sumH = summaryHtml ? measureOuterHeight(mDoc.querySelector('[data-m="sum"]')) : 0;
        const sigH = signatureHtml ? measureOuterHeight(mDoc.querySelector('[data-m="sig"]')) : 0;
        const footerH = measureOuterHeight(mDoc.querySelector('[data-m="ftr"]'));

        const rowEls = mDoc.querySelectorAll('tbody[data-row-idx]');
        const rowHeights = Array.from(rowEls).map(tb => Math.max(18, Math.ceil(tb.getBoundingClientRect().height || 24)));

        return {
            sheetPadV,
            p1HeaderH,
            repeatHeaderH,
            extraH,
            theadH,
            tableFooterH,
            sumH,
            sigH,
            footerH,
            rowHeights
        };
    } catch (err) {
        console.error('Sandbox measurement fallback triggered:', err);
        return {
            sheetPadV: 18,
            p1HeaderH: 148,
            repeatHeaderH: 48,
            extraH: 0,
            theadH: 34,
            tableFooterH: 0,
            sumH: summaryHtml ? 80 : 0,
            sigH: signatureHtml ? 95 : 0,
            footerH: 34,
            rowHeights: (rowsArray || []).map(() => 28)
        };
    } finally {
        try { iframe.remove(); } catch (rmErr) { console.error('Measure iframe cleanup error:', rmErr); }
    }
}

export async function measureRowHeights(rowsArray, tableColHeaderHtml, extraCss = '', tableClass = 'data-table') {
    const metrics = await measurePrintMetricsInSandbox({ rowsArray, tableColHeaderHtml, extraCss, tableClass });
    return metrics.rowHeights;
}

export async function measureBlockHeight(html, extraCss = '') {
    if (!html || !html.trim()) return 0;
    const metrics = await measurePrintMetricsInSandbox({ summaryHtml: html, extraCss });
    return metrics.sumH;
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. SMART PAGINATORS (WITH NEAR-1-PAGE MICRO-FIT & NO-ORPHAN SIGNATURES)
// ─────────────────────────────────────────────────────────────────────────────

function _buildPageHtml(pages, opts) {
    const {
        page1HeaderHtml, repeatHeaderHtml, tableColHeaderHtml,
        page1ExtraHtml = '', tableFooterRowsHtml = '', summaryHtml = '', signatureHtml = '',
        formattedDate = '', tableClass = 'data-table', tableStyle = '',
        sheetPadding = '6px 12px', extraPagesCount = 0
    } = opts;
    const total = pages.length + (extraPagesCount || 0);
    const tblStyle = tableStyle || 'width:100%;border-collapse:collapse;table-layout:auto;margin-top:2px;border:1px solid #cbd5e1;';
    const tbodyStyle = tableClass === 'print-items-table' ? ' style="font-size:10px;"' : '';

    return pages.map((rows, i) => {
        const num = i + 1;
        const isFirst = num === 1;
        const isLast = num === pages.length && extraPagesCount === 0;
        const isFinalDataPage = num === pages.length;
        const brk = isLast ? '' : 'page-break-after:always;break-after:always;';

        let bodyRowsMarkup = buildTableBodiesHtml(rows, tableClass);
        if (!bodyRowsMarkup && !tableFooterRowsHtml) {
            bodyRowsMarkup = `<tbody${tbodyStyle}><tr><td colspan="20" style="text-align:center;padding:12px;color:#64748b;font-size:10px;">কোনো এন্ট্রি পাওয়া যায়নি</td></tr></tbody>`;
        }
        const footerRowsInTable = (isFinalDataPage && tableFooterRowsHtml)
            ? `<tbody class="print-row-group"${tbodyStyle}>${tableFooterRowsHtml}</tbody>`
            : '';

        return `<div class="spe-page" style="${brk}width:100%;box-sizing:border-box;background:#ffffff;color:#0f172a;padding:${sheetPadding};">
            <div style="padding-top:2px;margin-bottom:4px;">${isFirst ? page1HeaderHtml : repeatHeaderHtml}</div>
            ${isFirst && page1ExtraHtml ? page1ExtraHtml : ''}
            <table style="${tblStyle}" class="${tableClass}">
                ${tableColHeaderHtml}
                ${bodyRowsMarkup}
                ${footerRowsInTable}
            </table>
            ${isFinalDataPage ? summaryHtml + signatureHtml : ''}
            ${buildFooterHtml(formattedDate, num, total)}
        </div>`;
    }).join('');
}

async function runUnifiedSmartPagination(opts) {
    const {
        rowsArray = [],
        page1HeaderHtml = '',
        repeatHeaderHtml = '',
        tableColHeaderHtml = '',
        page1ExtraHtml = '',
        tableFooterRowsHtml = '',
        summaryHtml = '',
        signatureHtml = '',
        formattedDate = '',
        extraCss = '',
        tableClass = 'data-table',
        tableStyle = '',
        sheetPadding = '6px 12px',
        extraPagesCount = 0
    } = opts;

    const m = await measurePrintMetricsInSandbox({
        rowsArray, page1HeaderHtml, repeatHeaderHtml, page1ExtraHtml,
        tableColHeaderHtml, tableFooterRowsHtml, summaryHtml, signatureHtml,
        formattedDate, extraCss, tableClass, tableStyle, sheetPadding
    });

    const page1BodyMax = Math.max(180, SAFE_A4_HEIGHT_PX - m.sheetPadV - m.p1HeaderH - m.extraH - m.theadH - m.footerH - 12);
    const pageNBodyMax = Math.max(260, SAFE_A4_HEIGHT_PX - m.sheetPadV - m.repeatHeaderH - m.theadH - m.footerH - 12);
    const totalLastExtra = m.tableFooterH + m.sumH + m.sigH;

    const sliceIndices = computeSmartPageSlices({
        rowHeights: m.rowHeights,
        page1BodyMax,
        pageNBodyMax,
        totalLastExtra,
        sumH: m.tableFooterH + m.sumH,
        nearFitTolerance: 115
    });

    const pages = sliceIndices.map(idxList => idxList.map(idx => rowsArray[idx]));
    const html = _buildPageHtml(pages, {
        page1HeaderHtml, repeatHeaderHtml, tableColHeaderHtml,
        page1ExtraHtml, tableFooterRowsHtml, summaryHtml, signatureHtml,
        formattedDate, tableClass, tableStyle, sheetPadding, extraPagesCount
    });

    return { html, pageCount: pages.length };
}

export async function smartPaginatePrint(opts) {
    const result = await runUnifiedSmartPagination({
        tableClass: 'data-table',
        ...opts
    });
    return result.html;
}

export async function smartPaginateStatement(opts) {
    const result = await runUnifiedSmartPagination({
        tableClass: 'print-items-table',
        ...opts
    });
    const extraCount = opts.extraPagesCount || 0;
    return {
        html: result.html,
        stmtPageCount: result.pageCount,
        totalPageCount: result.pageCount + extraCount,
        toString() { return this.html; }
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. UNIVERSAL IFRAME-BASED PRINT TRIGGER WITH OVERFLOW & ORPHAN GUARD
// ─────────────────────────────────────────────────────────────────────────────

export async function printViaIframe(htmlBody, extraCss = '', title = 'Maa_Motors_Document') {
    const old = document.getElementById('__spe_iframe__');
    if (old) old.remove();

    const { bodyHtml, extractedCss } = normalizePrintBodyHtml(htmlBody);
    const mergedCss = `${IFRAME_PRINT_CSS}\n${extractedCss}\n${extraCss || ''}`;

    const iframe = document.createElement('iframe');
    iframe.id = '__spe_iframe__';
    iframe.setAttribute('aria-hidden', 'true');
    iframe.style.cssText = `position:fixed;left:-9999px;top:0;width:${A4_WIDTH_PX}px;height:${A4_HEIGHT_PX}px;border:none;visibility:hidden;pointer-events:none;`;
    document.body.appendChild(iframe);

    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(`<!DOCTYPE html><html lang="bn"><head><meta charset="UTF-8"><title>${title}</title>${FONT_LINKS_HTML}<style>${mergedCss}</style></head><body>${bodyHtml}</body></html>`);
    doc.close();

    const originalParentTitle = document.title;

    const cleanup = () => {
        document.title = originalParentTitle;
        try { iframe.remove(); } catch (err) { console.error('Remove iframe error:', err); }
    };

    try {
        await waitForPrintAssets(doc, 1800);
        applyUniversalPrintOverflowGuard(doc);
        await waitForPrintAssets(doc, 250);

        if (title) document.title = title;
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
    } catch (e) {
        console.error('Iframe print fallback to window.print:', e);
        window.print();
    }

    window.addEventListener('afterprint', cleanup, { once: true });
    if (iframe.contentWindow) {
        iframe.contentWindow.addEventListener('afterprint', cleanup, { once: true });
    }
    setTimeout(cleanup, 6000);
}
