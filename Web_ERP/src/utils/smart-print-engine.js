/**
 * Smart Print Engine — DOM-Measured Auto-Paginator
 * 1. Hidden 794px probe → real pixel heights via getBoundingClientRect().
 * 2. @page { margin: 0 } in iframe → Chrome URL/date header+footer removed.
 * 3. Dynamic document.title update ensures automatic exact filename in "Save as PDF".
 */

const A4_W = 794;
const A4_H = 1123;

import { IFRAME_PRINT_CSS } from './print-iframe-css.js';

// ─────────────────────────────────────────────────────────────────────────────
// 1. DOM MEASUREMENT UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

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

        const isFixed = tableColHeaderHtml.includes('<colgroup>') || tableColHeaderHtml.includes('fixed-table');
        const table = document.createElement('table');
        table.style.cssText = `width:100%;border-collapse:collapse;table-layout:${isFixed ? 'fixed' : 'auto'};`;
        if (isFixed) table.className = 'fixed-table';
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

        requestAnimationFrame(() => {
            const trs = tbody.querySelectorAll('tr');
            const heights = Array.from(trs).map(tr => Math.ceil(tr.getBoundingClientRect().height));
            document.body.removeChild(probe);
            resolve(heights.length ? heights : rowsArray.map(() => 24));
        });
    });
}

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

const PAGE1_HEADER_H = 148;
const PAGEN_HEADER_H = 48;
const THEAD_H  = 34;
const FOOTER_H = 36;
const PAD_V    = 16;
const ROW_SCALE = 1.0;
const BUDGET_BONUS = -20;

export async function smartPaginatePrint({
    rowsArray, page1HeaderHtml, repeatHeaderHtml, tableColHeaderHtml,
    summaryHtml = '', signatureHtml = '', formattedDate
}) {
    const [rawRowHeights, p1HeaderH, sumH, sigH] = await Promise.all([
        measureRowHeights(rowsArray, tableColHeaderHtml),
        page1HeaderHtml ? measureBlockHeight(page1HeaderHtml) : Promise.resolve(PAGE1_HEADER_H),
        summaryHtml ? measureBlockHeight(summaryHtml) : Promise.resolve(0),
        signatureHtml ? measureBlockHeight(signatureHtml) : Promise.resolve(0)
    ]);

    const rowHeights = rawRowHeights.map(h => Math.ceil(h * ROW_SCALE));
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
    _balanceOrphanPages(pages);

    return _buildPageHtml(pages, {
        page1HeaderHtml, repeatHeaderHtml, tableColHeaderHtml,
        summaryHtml, signatureHtml, formattedDate, tableClass: 'data-table'
    });
}

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
    _balanceOrphanPages(pages);

    return _buildPageHtml(pages, {
        page1HeaderHtml, repeatHeaderHtml, tableColHeaderHtml,
        page1ExtraHtml, summaryHtml, signatureHtml, formattedDate,
        tableClass: 'print-items-table'
    });
}

function _balanceOrphanPages(pages, minRows = 3) {
    if (pages.length <= 1) return;
    const last = pages[pages.length - 1];
    const prev = pages[pages.length - 2];
    if (last.length < minRows && prev && prev.length > minRows + 2) {
        const need = minRows - last.length + 1;
        const shifted = prev.splice(prev.length - need, need);
        last.unshift(...shifted);
    }
}

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
        const isFixed = tableColHeaderHtml.includes('<colgroup>') || (tableClass || '').includes('fixed-table');
        const layoutStyle = isFixed ? 'table-layout:fixed;' : 'table-layout:auto;';
        return `<div style="${brk}width:100%;box-sizing:border-box;background:white;color:#0f172a;padding:6px 12px;">
            <div style="padding-top:2px;margin-bottom:4px;">${isFirst ? page1HeaderHtml : repeatHeaderHtml}</div>
            ${isFirst && page1ExtraHtml ? page1ExtraHtml : ''}
            <table style="width:100%;border-collapse:collapse;${layoutStyle}margin-top:2px;border:1px solid #cbd5e1;" class="${tableClass || ''}${isFixed ? ' fixed-table' : ''}">
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
// 3. IFRAME-BASED PRINT TRIGGER (Suppresses Chrome Header/Footer + Auto Title)
// ─────────────────────────────────────────────────────────────────────────────

export function printViaIframe(htmlBody, extraCss = '', title = 'Maa_Motors_Document') {
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
<title>${title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Inter:wght@400;500;700;900&display=swap" rel="stylesheet">
<link href="https://fonts.maateen.me/kalpurush/font.css" rel="stylesheet">
<style>${IFRAME_PRINT_CSS}${extraCss}</style>
</head><body>${htmlBody}</body></html>`);
    doc.close();

    const originalParentTitle = document.title;

    const doPrint = () => {
        try {
            if (title) document.title = title;
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
        } catch (e) {
            window.print();
        }

        const cleanup = () => {
            document.title = originalParentTitle;
            try { iframe.remove(); } catch (err) { console.error("Remove iframe error:", err); }
        };

        window.addEventListener('afterprint', cleanup, { once: true });
        if (iframe.contentWindow) {
            iframe.contentWindow.addEventListener('afterprint', cleanup, { once: true });
        }
        setTimeout(cleanup, 5000);
    };

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
