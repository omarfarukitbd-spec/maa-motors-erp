/**
 * Smart Print Engine — DOM-Measured Auto-Paginator
 * 1. Hidden 794px probe → real pixel heights via getBoundingClientRect().
 * 2. @page { margin: 0 } in iframe → Chrome URL/date header+footer removed.
 * 3. table-layout: auto → columns auto-fit content.
 * 4. Cross-browser: Chrome, Edge, Firefox, mobile.
 */

/** A4 at 96 CSS px/inch */
const A4_W = 794;
const A4_H = 1123;

import { IFRAME_PRINT_CSS } from './print-iframe-css.js';


// ─────────────────────────────────────────────────────────────────────────────
// 1. DOM MEASUREMENT UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Creates a hidden A4-width probe div, renders all rows in a table,
 * measures each row's actual rendered pixel height, then removes the probe.
 *
 * @param {Array<string|{html:string}>} rowsArray
 * @param {string} tableColHeaderHtml - <thead> HTML
 * @returns {Promise<number[]>} Real pixel height for every row
 */
export function measureRowHeights(rowsArray, tableColHeaderHtml) {
    return new Promise(resolve => {
        const probe = document.createElement('div');
        probe.style.cssText = [
            'position:fixed', 'left:-9999px', 'top:0',
            `width:${A4_W}px`, 'visibility:hidden', 'pointer-events:none',
            'font-family:"Inter","Kalpurush","Hind Siliguri",sans-serif',
            'font-size:11px', 'color:#0f172a', 'background:white',
            'padding:6px 12px', 'box-sizing:border-box'
        ].join(';');

        const table = document.createElement('table');
        table.style.cssText = 'width:100%;border-collapse:collapse;table-layout:auto;';
        table.innerHTML = tableColHeaderHtml;

        const tbody = document.createElement('tbody');

        rowsArray.forEach(item => {
            const rowHtml = (typeof item === 'object' && item !== null) ? item.html : item;
            const wrap = document.createElement('tbody');
            wrap.innerHTML = (rowHtml || '').trim();
            const tr = wrap.querySelector('tr');
            if (tr) tbody.appendChild(tr);
        });

        table.appendChild(tbody);
        probe.appendChild(table);
        document.body.appendChild(probe);

        // Wait for layout paint then measure
        requestAnimationFrame(() => {
            const trs = tbody.querySelectorAll('tr');
            const heights = Array.from(trs).map(tr =>
                Math.ceil(tr.getBoundingClientRect().height) + 1 // +1px safety
            );
            document.body.removeChild(probe);
            resolve(heights);
        });
    });
}

/**
 * Measures actual rendered pixel height of any HTML block at A4 width.
 * @param {string} html
 * @returns {Promise<number>}
 */
export function measureBlockHeight(html) {
    if (!html || !html.trim()) return Promise.resolve(0);
    return new Promise(resolve => {
        const probe = document.createElement('div');
        probe.style.cssText = [
            'position:fixed', 'left:-9999px', 'top:0',
            `width:${A4_W}px`, 'visibility:hidden', 'pointer-events:none',
            'font-family:"Inter","Kalpurush","Hind Siliguri",sans-serif',
            'font-size:11px', 'padding:6px 12px', 'box-sizing:border-box'
        ].join(';');
        probe.innerHTML = html;
        document.body.appendChild(probe);
        requestAnimationFrame(() => {
            const h = Math.ceil(probe.getBoundingClientRect().height);
            document.body.removeChild(probe);
            resolve(h || 0);
        });
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. SMART PAGINATORS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Calibrated A4 page constants (empirically tuned for MAA MOTORS header).
 *
 * WHY fixed heights instead of measured?
 * The renderSharedPrintHeader() contains an <img> logo that does NOT load
 * during the DOM probe (image cross-origin / async), so measureBlockHeight()
 * underestimates the page-1 header. Fixed values are more reliable.
 *
 * ROW_SCALE: In the probe, ALL rows are measured together in one table —
 * table-layout:auto gives narrow columns (more wrapping → taller rows).
 * In actual print, each PAGE has only a SUBSET of rows — columns can be
 * wider (less wrapping → shorter rows). Factor ≈ 0.88 corrects for this.
 */
const PAGE1_HEADER_H = 148; // Measured empirically: gradient header + 20px margin-bottom
const PAGEN_HEADER_H = 48;  // Repeat "Continued" header height
const THEAD_H  = 34;        // Column header row
const FOOTER_H = 36;        // Date + page number footer bar
const PAD_V    = 16;        // Page div vertical padding (6px top + 6px bottom + 4px gap)
const ROW_SCALE = 1.0;     // Row height correction: actual print < probe (per-page column widths differ)
const BUDGET_BONUS = -20;    // Extra buffer so we don't cut a page short

/**
 * Smart paginator for zone/customer tabular reports.
 * Uses DOM-measured heights — zero blank pages, perfect fit.
 *
 * @returns {Promise<string>} Complete paginated HTML ready for printing
 */
export async function smartPaginatePrint({
    rowsArray, page1HeaderHtml, repeatHeaderHtml, tableColHeaderHtml,
    summaryHtml = '', signatureHtml = '', formattedDate
}) {
    // Measure row heights AND dynamically measure page1HeaderHtml, summaryHtml, signatureHtml
    const [rawRowHeights, p1HeaderH, sumH, sigH] = await Promise.all([
        measureRowHeights(rowsArray, tableColHeaderHtml),
        page1HeaderHtml ? measureBlockHeight(page1HeaderHtml) : Promise.resolve(PAGE1_HEADER_H),
        summaryHtml ? measureBlockHeight(summaryHtml) : Promise.resolve(0),
        signatureHtml ? measureBlockHeight(signatureHtml) : Promise.resolve(0)
    ]);

    // Apply scale factor: actual print rows render shorter than probe measurement
    const rowHeights = rawRowHeights.map(h => Math.ceil(h * ROW_SCALE));

    // Dynamic calibrated budget using real measured header height
    const effectiveP1HeaderH = Math.max(p1HeaderH, PAGE1_HEADER_H);
    const page1Budget = A4_H - effectiveP1HeaderH - THEAD_H - FOOTER_H - PAD_V - 20;
    const pageNBudget = A4_H - PAGEN_HEADER_H - THEAD_H - FOOTER_H - PAD_V - 20;
    const totalLastExtra = sumH + sigH;

    const pages = [];
    let cur = [], curH = 0, isP1 = true;

    for (let i = 0; i < rowsArray.length; i++) {
        const rh = rowHeights[i] || 24;
        const budget = isP1 ? page1Budget : pageNBudget;
        const isLastRow = i === rowsArray.length - 1;
        const extra = isLastRow ? totalLastExtra : 0;

        if (curH + rh + extra > budget && cur.length > 0) {
            pages.push(cur); cur = []; curH = 0; isP1 = false;
        }
        const item = rowsArray[i];
        cur.push(typeof item === 'object' ? item.html : item);
        curH += rh;
    }
    if (cur.length) pages.push(cur);

    return _buildPageHtml(pages, {
        page1HeaderHtml, repeatHeaderHtml, tableColHeaderHtml,
        summaryHtml, signatureHtml, formattedDate, tableClass: 'data-table'
    });
}

/**
 * Smart paginator for statement / ledger / খতিয়ান reports.
 */
export async function smartPaginateStatement({
    rowsArray, page1HeaderHtml, repeatHeaderHtml, tableColHeaderHtml,
    page1ExtraHtml = '', summaryHtml = '', signatureHtml = '', formattedDate
}) {
    const [rawRowHeights, extraH, sumH, sigH] = await Promise.all([
        measureRowHeights(rowsArray, tableColHeaderHtml),
        page1ExtraHtml ? measureBlockHeight(page1ExtraHtml) : Promise.resolve(0),
        summaryHtml ? measureBlockHeight(summaryHtml) : Promise.resolve(0),
        signatureHtml ? measureBlockHeight(signatureHtml) : Promise.resolve(0)
    ]);

    const rowHeights = rawRowHeights.map(h => Math.ceil(h * ROW_SCALE));

    // Statement page-1 has extra customer info block below header
    const page1Budget = A4_H - PAGE1_HEADER_H - Math.ceil(extraH * ROW_SCALE) - THEAD_H - FOOTER_H - PAD_V + BUDGET_BONUS;
    const pageNBudget = A4_H - PAGEN_HEADER_H - THEAD_H - FOOTER_H - PAD_V + BUDGET_BONUS;
    const totalLastExtra = sumH + sigH;

    const pages = [];
    let cur = [], curH = 0, isP1 = true;

    for (let i = 0; i < rowsArray.length; i++) {
        const rh = rowHeights[i] || 24;
        const budget = isP1 ? page1Budget : pageNBudget;
        const isLastRow = i === rowsArray.length - 1;
        const extra = isLastRow ? totalLastExtra : 0;

        if (curH + rh + extra > budget && cur.length > 0) {
            pages.push(cur); cur = []; curH = 0; isP1 = false;
        }
        const item = rowsArray[i];
        cur.push(typeof item === 'object' ? item.html : item);
        curH += rh;
    }
    if (cur.length) pages.push(cur);

    return _buildPageHtml(pages, {
        page1HeaderHtml, repeatHeaderHtml, tableColHeaderHtml,
        page1ExtraHtml, summaryHtml, signatureHtml, formattedDate,
        tableClass: 'print-items-table'
    });
}


/** Internal: builds final HTML string from paginated row buckets */
function _buildPageHtml(pages, opts) {
    const {
        page1HeaderHtml, repeatHeaderHtml, tableColHeaderHtml,
        page1ExtraHtml = '', summaryHtml = '', signatureHtml = '',
        formattedDate, tableClass
    } = opts;
    const total = pages.length;

    return pages.map((rows, i) => {
        const num = i + 1, isFirst = num === 1, isLast = num === total;
        const brk = isLast ? '' : 'page-break-after:always;break-after:always;';
        const tbodyStyle = tableClass === 'print-items-table' ? ' style="font-size:10px;"' : '';
        return `<div style="${brk}width:100%;box-sizing:border-box;background:white;color:#0f172a;padding:6px 12px;">
            <div style="padding-top:2px;margin-bottom:4px;">${isFirst ? page1HeaderHtml : repeatHeaderHtml}</div>
            ${isFirst && page1ExtraHtml ? page1ExtraHtml : ''}
            <table style="width:100%;border-collapse:collapse;table-layout:auto;margin-top:2px;border:1px solid #cbd5e1;" class="${tableClass}">
                ${tableColHeaderHtml}
                <tbody${tbodyStyle}>${rows.join('')}</tbody>
            </table>
            ${isLast ? summaryHtml + signatureHtml : ''}
            <div style="display:flex;justify-content:space-between;align-items:center;font-size:10px;color:#475569;font-weight:700;border-top:1px solid #cbd5e1;padding-top:6px;margin-top:8px;font-family:'Inter','Kalpurush',sans-serif;">
                <span>${formattedDate ? 'তারিখ: ' + formattedDate : ''}</span>
                <span>পৃষ্ঠা ${num} / ${total}</span>
            </div>
        </div>`;
    }).join('');
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. IFRAME-BASED PRINT TRIGGER (Suppresses Chrome Header/Footer)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Prints HTML via an isolated iframe with @page { margin: 0 }.
 * This removes Chrome's built-in URL / date / page-number header+footer.
 * Self-contained CSS — no external stylesheet dependency.
 *
 * @param {string} htmlBody - HTML body content to print
 * @param {string} [extraCss=''] - Any extra CSS to inject into iframe
 */
export function printViaIframe(htmlBody, extraCss = '') {
    const old = document.getElementById('__spe_iframe__');
    if (old) old.remove();

    const iframe = document.createElement('iframe');
    iframe.id = '__spe_iframe__';
    iframe.setAttribute('aria-hidden', 'true');
    iframe.style.cssText = 'position:fixed;left:-9999px;top:0;width:0;height:0;border:none;opacity:0;';
    document.body.appendChild(iframe);

    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(`<!DOCTYPE html><html lang="bn"><head><meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap" rel="stylesheet">
<link href="https://fonts.maateen.me/kalpurush/font.css" rel="stylesheet">
<style>${IFRAME_PRINT_CSS}${extraCss}</style>
</head><body>${htmlBody}</body></html>`);
    doc.close();

    const doPrint = () => {
        try { iframe.contentWindow.focus(); iframe.contentWindow.print(); }
        catch (e) { window.print(); }
        setTimeout(() => { try { iframe.remove(); } catch (e) { console.error("Remove iframe error:", e); } }, 4000);
    };

    // document.fonts.ready → waits for Bengali + Inter fonts to fully load
    const iDoc = iframe.contentDocument;
    if (iDoc && iDoc.fonts && iDoc.fonts.ready) {
        (async () => {
            try {
                await iDoc.fonts.ready;
                doPrint();
            } catch(e) { console.error("Fonts ready error:", e); setTimeout(doPrint, 700); }
        })();
    } else {
        setTimeout(doPrint, 700);
    }
}
