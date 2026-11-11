/**
 * Universal A4 Print Auto-Fit & Overflow Guard Engine
 * Prevents Chrome/Edge A4 print slicing, orphan signature pages,
 * margin-collapse cuts, and font/asset premature prints across all ERP reports.
 */

export const A4_WIDTH_PX = 794;
export const A4_HEIGHT_PX = 1122;
export const SAFE_A4_HEIGHT_PX = 1075;
export const SINGLE_PAGE_FIT_MAX_PX = 1235;
export const MIN_READABLE_ZOOM = 0.88;

/**
 * Strips accidental outer <html>/<head>/<body> tags so content can live safely inside our unified iframe document.
 */
export function normalizePrintBodyHtml(rawHtml = '') {
    const htmlStr = String(rawHtml || '');
    if (!/<html[\s>]|<!doctype/i.test(htmlStr)) {
        return { bodyHtml: htmlStr, extractedCss: '' };
    }

    let extractedCss = '';
    const styleMatches = htmlStr.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
    if (styleMatches) {
        extractedCss = styleMatches
            .map(tag => tag.replace(/<\/?style[^>]*>/gi, ''))
            .join('\n');
    }

    const bodyMatch = htmlStr.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    const bodyHtml = bodyMatch
        ? bodyMatch[1]
        : htmlStr.replace(/<!doctype[^>]*>/gi, '').replace(/<\/?(html|head|body)[^>]*>/gi, '');

    return { bodyHtml, extractedCss };
}

/**
 * Waits cleanly for Google Fonts and embedded images (shop logo / scanned memos) before measuring or printing.
 */
export async function waitForPrintAssets(doc, timeoutMs = 1800) {
    if (!doc) return;
    const win = doc.defaultView || window;

    const waitFonts = async () => {
        try {
            if (doc.fonts && doc.fonts.ready) {
                await Promise.race([
                    doc.fonts.ready,
                    new Promise(resolve => setTimeout(resolve, timeoutMs))
                ]);
            }
        } catch (err) {
            console.warn('Print fonts.ready check skipped:', err);
        }
    };

    const waitImages = async () => {
        try {
            const imgs = Array.from(doc.images || []).filter(img => !img.complete);
            if (imgs.length === 0) return;
            await Promise.race([
                Promise.all(imgs.map(img => new Promise(resolve => {
                    img.addEventListener('load', resolve, { once: true });
                    img.addEventListener('error', resolve, { once: true });
                }))),
                new Promise(resolve => setTimeout(resolve, timeoutMs))
            ]);
        } catch (err) {
            console.warn('Print image readiness check skipped:', err);
        }
    };

    await Promise.all([waitFonts(), waitImages()]);

    await new Promise(resolve => {
        if (win && typeof win.requestAnimationFrame === 'function') {
            win.requestAnimationFrame(() => win.requestAnimationFrame(resolve));
        } else {
            setTimeout(resolve, 40);
        }
    });
}

/**
 * Computes outer pixel height including top/bottom margins without margin-collapse loss.
 */
export function measureOuterHeight(el) {
    if (!el) return 0;
    const view = el.ownerDocument?.defaultView || window;
    const rectH = Math.ceil(el.getBoundingClientRect().height || 0);
    try {
        const cs = view.getComputedStyle(el);
        const mt = parseFloat(cs.marginTop) || 0;
        const mb = parseFloat(cs.marginBottom) || 0;
        return Math.ceil(rectH + mt + mb);
    } catch (err) {
        console.warn('measureOuterHeight style fallback:', err);
        return rectH;
    }
}

/**
 * Reduces excessive top margins on signature blocks and large outer vertical padding when near 1-page overflow.
 */
export function compactSignatureAndSpacing(containerEl) {
    if (!containerEl) return;
    const view = containerEl.ownerDocument?.defaultView || window;

    const sigBlocks = containerEl.querySelectorAll('.print-sig-block, .signature-last-page-block, [data-print-sig]');
    sigBlocks.forEach(sig => {
        const currentMt = parseFloat(view.getComputedStyle(sig).marginTop) || 0;
        if (currentMt > 20) {
            sig.style.marginTop = '18px';
        }
        const currentPt = parseFloat(view.getComputedStyle(sig).paddingTop) || 0;
        if (currentPt > 8) {
            sig.style.paddingTop = '4px';
        }
    });

    try {
        const cs = view.getComputedStyle(containerEl);
        const pt = parseFloat(cs.paddingTop) || 0;
        const pb = parseFloat(cs.paddingBottom) || 0;
        if (pt > 22) containerEl.style.paddingTop = '18px';
        if (pb > 22) containerEl.style.paddingBottom = '16px';
    } catch (err) {
        console.warn('Container spacing compaction error:', err);
    }
}

/**
 * Pure pagination slicer ensuring atomic groups, zero empty returns, and zero orphan signature pages.
 */
export function computeSmartPageSlices({
    rowHeights = [],
    page1BodyMax = 760,
    pageNBodyMax = 920,
    totalLastExtra = 0,
    sumH = 0,
    nearFitTolerance = 115
}) {
    if (!Array.isArray(rowHeights) || rowHeights.length === 0) {
        return [[]];
    }

    const totalRowsH = rowHeights.reduce((acc, h) => acc + Math.max(18, h || 24), 0);
    if (totalRowsH <= page1BodyMax && (totalRowsH + totalLastExtra) <= (page1BodyMax + nearFitTolerance)) {
        return [rowHeights.map((_, idx) => idx)];
    }

    const pagesIdx = [];
    const pageRowSums = [];
    let curIndices = [];
    let curSum = 0;
    let isP1 = true;

    for (let i = 0; i < rowHeights.length; i++) {
        const rh = Math.max(18, rowHeights[i] || 24);
        const budget = isP1 ? page1BodyMax : pageNBodyMax;

        if (curSum + rh > budget && curIndices.length > 0) {
            pagesIdx.push(curIndices);
            pageRowSums.push(curSum);
            curIndices = [];
            curSum = 0;
            isP1 = false;
        }
        curIndices.push(i);
        curSum += rh;
    }

    if (curIndices.length > 0) {
        pagesIdx.push(curIndices);
        pageRowSums.push(curSum);
    }

    const lastIdx = pagesIdx.length - 1;
    const lastBudget = lastIdx === 0 ? page1BodyMax : pageNBodyMax;
    const lastOverflow = (pageRowSums[lastIdx] + totalLastExtra) - lastBudget;

    if (lastOverflow > nearFitTolerance) {
        const lastPageRows = pagesIdx[lastIdx];
        if (lastPageRows.length >= 2) {
            const tailRowIdx = lastPageRows[lastPageRows.length - 1];
            const tailRowH = Math.max(18, rowHeights[tailRowIdx] || 24);
            if (tailRowH + totalLastExtra <= pageNBodyMax + nearFitTolerance) {
                lastPageRows.pop();
                pagesIdx.push([tailRowIdx]);
                return pagesIdx;
            }
        }
        if (sumH > 0 || (pageRowSums[lastIdx] > lastBudget - 120)) {
            pagesIdx.push([]);
        }
    }

    return pagesIdx;
}

/**
 * Protects multi-page free-flow sheets against slicing signature top dashed borders right across page boundaries.
 */
function protectMultiPageBreakBoundaries(rootEl) {
    if (!rootEl) return;
    const rootRect = rootEl.getBoundingClientRect();
    const sigBlocks = Array.from(rootEl.querySelectorAll('.print-sig-block, .signature-last-page-block'));

    sigBlocks.forEach(sig => {
        sig.style.pageBreakInside = 'avoid';
        sig.style.breakInside = 'avoid';
        const rect = sig.getBoundingClientRect();
        const relTop = rect.top - rootRect.top;
        const relBottom = rect.bottom - rootRect.top;
        const startPage = Math.floor(Math.max(0, relTop) / SAFE_A4_HEIGHT_PX);
        const endPage = Math.floor(Math.max(0, relBottom) / SAFE_A4_HEIGHT_PX);

        // If signature starts near bottom edge or splits across page boundary
        if (endPage > startPage || (relTop % SAFE_A4_HEIGHT_PX) < 28) {
            const prev = sig.previousElementSibling;
            const overflowOnPage = relBottom - ((startPage + 1) * SAFE_A4_HEIGHT_PX);
            if (overflowOnPage > 0 && overflowOnPage <= 52) {
                compactSignatureAndSpacing(rootEl);
                return;
            }
            if (prev && prev.getBoundingClientRect().height < 260) {
                prev.style.pageBreakBefore = 'always';
                prev.style.breakBefore = 'page';
                prev.style.marginTop = '0px';
                prev.style.paddingTop = '20px';
            } else {
                sig.style.marginTop = '0px';
                sig.style.paddingTop = '32px';
            }
        }
    });
}

/**
 * Inspects rendered iframe pages/sheets and auto-solves small A4 overflows and orphan signatures cleanly.
 */
export function applyUniversalPrintOverflowGuard(doc) {
    if (!doc || !doc.body) return { adjustedCount: 0, mode: 'none' };
    let adjustedCount = 0;

    // 1. Protect scanned memo fixed pages from 0.5px trailing blank pages
    const memoPages = Array.from(doc.querySelectorAll('.memo-print-page'));
    memoPages.forEach(mp => {
        mp.style.minHeight = '1070px';
        mp.style.maxHeight = '1105px';
        mp.style.overflow = 'hidden';
    });

    // 2. Enforce safe ceiling on every structured .spe-page
    const spePages = Array.from(doc.querySelectorAll('.spe-page'));
    if (spePages.length > 0) {
        spePages.forEach(pageEl => {
            pageEl.style.zoom = '';
            let h = Math.ceil(pageEl.scrollHeight || 0);
            if (h > SAFE_A4_HEIGHT_PX && h <= SINGLE_PAGE_FIT_MAX_PX) {
                compactSignatureAndSpacing(pageEl);
                h = Math.ceil(pageEl.scrollHeight || 0);
                if (h > SAFE_A4_HEIGHT_PX) {
                    const scale = Math.max(MIN_READABLE_ZOOM, (SAFE_A4_HEIGHT_PX - 6) / h);
                    pageEl.style.zoom = scale.toFixed(4);
                    adjustedCount++;
                }
            }
        });
        return { adjustedCount, mode: 'spe-pages' };
    }

    // 3. Fallback safety net for un-paginated free-flow A4 sheets (not thermal POS)
    if (doc.querySelector('.print-pos, .pos-wrapper')) {
        return { adjustedCount: 0, mode: 'pos-skip' };
    }

    const candidates = Array.from(doc.body.children).filter(el => el.tagName !== 'STYLE' && el.tagName !== 'SCRIPT');
    const rootEl = candidates.length === 1 ? candidates[0] : doc.body;
    if (!rootEl) return { adjustedCount: 0, mode: 'empty' };

    rootEl.style.zoom = '';
    let h = Math.ceil(rootEl.scrollHeight || 0);

    if (h > SAFE_A4_HEIGHT_PX && h <= SINGLE_PAGE_FIT_MAX_PX) {
        compactSignatureAndSpacing(rootEl);
        h = Math.ceil(rootEl.scrollHeight || 0);
        if (h > SAFE_A4_HEIGHT_PX) {
            const scale = Math.max(MIN_READABLE_ZOOM, (SAFE_A4_HEIGHT_PX - 6) / h);
            rootEl.style.zoom = scale.toFixed(4);
            rootEl.style.margin = '0 auto';
            adjustedCount++;
        }
        return { adjustedCount, mode: 'freeflow-autofit' };
    }

    if (h > SINGLE_PAGE_FIT_MAX_PX) {
        protectMultiPageBreakBoundaries(rootEl);
        return { adjustedCount: 1, mode: 'freeflow-multipage-guard' };
    }

    return { adjustedCount: 0, mode: 'single-ok' };
}
