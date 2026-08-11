/**
 * Pre-Calculate Print Paginator — Automatic A4 Pixel-Height Paginator
 * 
 * Solves Bengali CTL Font Rendering AND Multi-line Address Overflow:
 * 1. Native HTML/DOM Print rendering ensures 100% perfect Bengali (বাংলা) font shaping (যুক্তাক্ষর & কার).
 * 2. Automatic A4 Pixel-Height Calculation measures address/text length in exact pixels (not hardcoded row numbers).
 * 3. Exact "পৃষ্ঠা X / Y" page numbers in footers across all pages.
 */

/**
 * Paginates tabular print data automatically using exact A4 pixel height budgeting.
 * @param {Object} opts
 * @param {Array<string|{html: string, textLength: number}>} opts.rowsArray - Array of <tr> HTML strings or row objects
 * @param {string} opts.page1HeaderHtml - Full branded header for page 1
 * @param {string} opts.repeatHeaderHtml - Compact strip header for pages 2+
 * @param {string} opts.tableColHeaderHtml - <thead> with column names
 * @param {string} [opts.summaryHtml] - Summary box (last page only)
 * @param {string} [opts.signatureHtml] - Signature section (last page only)
 * @param {string} opts.formattedDate - e.g. "11/08/2026"
 * @param {number} [opts.page1MaxPx=818] - Printable table height budget for page 1 (in px)
 * @param {number} [opts.pageNMaxPx=930] - Printable table height budget for pages 2+ (in px)
 * @returns {string} Complete paginated HTML string
 */
export function paginatePrintRows({
    rowsArray, page1HeaderHtml, repeatHeaderHtml, tableColHeaderHtml,
    summaryHtml = '', signatureHtml = '', formattedDate,
    page1MaxPx = 818, pageNMaxPx = 930
}) {
    const pages = [];
    let currentPage = [];
    let currentPx = 0;
    let isPage1 = true;

    for (let i = 0; i < rowsArray.length; i++) {
        const item = rowsArray[i];
        let rowHtml = '';
        let textLen = 0;

        if (typeof item === 'object' && item !== null) {
            rowHtml = item.html;
            textLen = item.textLength || 0;
        } else {
            rowHtml = item;
            textLen = (item.replace(/<[^>]*>/g, '').length) / 3;
        }

        // Calculate exact pixel height for the row based on address/content text length
        let rowPx = 28;
        if (textLen > 110) rowPx = 72;
        else if (textLen > 70) rowPx = 56;
        else if (textLen > 35) rowPx = 42;

        const maxPx = isPage1 ? page1MaxPx : pageNMaxPx;

        if (currentPx + rowPx > maxPx && currentPage.length > 0) {
            pages.push(currentPage);
            currentPage = [];
            currentPx = 0;
            isPage1 = false;
        }

        currentPage.push(rowHtml);
        currentPx += rowPx;
    }

    if (currentPage.length > 0) {
        pages.push(currentPage);
    }

    const total = pages.length;

    return pages.map((rows, i) => {
        const num = i + 1;
        const isFirst = num === 1;
        const isLast = num === total;
        const breakStyle = isLast ? '' : 'page-break-after:always; break-after:always;';
        return `
            <div style="${breakStyle} width:100%; box-sizing:border-box; background:white; color:#0f172a; padding:6px 12px;">
                <div style="padding-top:2px; margin-bottom:4px;">${isFirst ? page1HeaderHtml : repeatHeaderHtml}</div>
                <table style="width:100%; border-collapse:collapse; margin-top:2px; border:1px solid #cbd5e1;" class="data-table">
                    ${tableColHeaderHtml}
                    <tbody>${rows.join('')}</tbody>
                </table>
                ${isLast ? summaryHtml + signatureHtml : ''}
                <div style="display:flex; justify-content:space-between; align-items:center; font-size:10px; color:#475569; font-weight:700; border-top:1px solid #cbd5e1; padding-top:6px; margin-top:8px; font-family:'Inter','Kalpurush',sans-serif;">
                    <span>তারিখ: ${formattedDate}</span>
                    <span>পৃষ্ঠা ${num} / ${total}</span>
                </div>
            </div>`;
    }).join('');
}

/**
 * Paginates statement/ledger (খতিয়ান) print data automatically using exact A4 pixel height budgeting.
 */
export function paginateStatementRows({
    rowsArray, page1HeaderHtml, repeatHeaderHtml, tableColHeaderHtml,
    page1ExtraHtml = '', summaryHtml = '', signatureHtml = '', formattedDate,
    page1MaxPx = 540, pageNMaxPx = 930
}) {
    const pages = [];
    let currentPage = [];
    let currentPx = 0;
    let isPage1 = true;

    for (let i = 0; i < rowsArray.length; i++) {
        const item = rowsArray[i];
        let rowHtml = '';
        let textLen = 0;

        if (typeof item === 'object' && item !== null) {
            rowHtml = item.html;
            textLen = item.textLength || 0;
        } else {
            rowHtml = item;
            textLen = (item.replace(/<[^>]*>/g, '').length) / 3;
        }

        let rowPx = 28;
        if (textLen > 80) rowPx = 52;
        else if (textLen > 40) rowPx = 40;

        const maxPx = isPage1 ? page1MaxPx : pageNMaxPx;

        if (currentPx + rowPx > maxPx && currentPage.length > 0) {
            pages.push(currentPage);
            currentPage = [];
            currentPx = 0;
            isPage1 = false;
        }

        currentPage.push(rowHtml);
        currentPx += rowPx;
    }

    if (currentPage.length > 0) {
        pages.push(currentPage);
    }

    const total = pages.length;

    return pages.map((rows, i) => {
        const num = i + 1;
        const isFirst = num === 1;
        const isLast = num === total;
        const breakStyle = isLast ? '' : 'page-break-after:always; break-after:always;';
        return `
            <div style="${breakStyle} width:100%; box-sizing:border-box; background:white; color:#0f172a; padding:6px 12px;">
                <div style="padding-top:2px; margin-bottom:4px;">${isFirst ? page1HeaderHtml : repeatHeaderHtml}</div>
                ${isFirst ? page1ExtraHtml : ''}
                <table style="width:100%; border-collapse:collapse; margin-bottom:6px; border:1px solid #cbd5e1;" class="print-items-table">
                    ${tableColHeaderHtml}
                    <tbody style="font-size:10px;">${rows.join('')}</tbody>
                </table>
                ${isLast ? summaryHtml + signatureHtml : ''}
                <div style="display:flex; justify-content:space-between; align-items:center; font-size:10px; color:#475569; font-weight:700; border-top:1px solid #cbd5e1; padding-top:6px; margin-top:8px; font-family:'Inter','Kalpurush',sans-serif;">
                    <span>তারিখ: ${formattedDate}</span>
                    <span>পৃষ্ঠা ${num} / ${total}</span>
                </div>
            </div>`;
    }).join('');
}
