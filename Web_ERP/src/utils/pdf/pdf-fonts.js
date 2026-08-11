/**
 * Helper to fetch TTF font file from /fonts/ directory and convert to Base64
 * Cached in memory so font fetch happens only once.
 */

let cachedKalpurushBase64 = null;
let cachedInterBase64 = null;

async function fetchFontAsBase64(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to load font from ${url}`);
    }
    const buffer = await response.arrayBuffer();
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

/**
 * Ensures Kalpurush & Inter TTF fonts are registered on the jsPDF instance
 * @param {import('jspdf').jsPDF} doc 
 */
export async function registerPDFFonts(doc) {
    try {
        if (!cachedKalpurushBase64) {
            cachedKalpurushBase64 = await fetchFontAsBase64('/fonts/Kalpurush.ttf');
        }
        doc.addFileToVFS('Kalpurush.ttf', cachedKalpurushBase64);
        doc.addFont('Kalpurush.ttf', 'Kalpurush', 'normal');
        doc.addFont('Kalpurush.ttf', 'Kalpurush', 'bold');
        doc.addFont('Kalpurush.ttf', 'Kalpurush', 'italic');
        doc.addFont('Kalpurush.ttf', 'Kalpurush', 'bolditalic');

        if (!cachedInterBase64) {
            cachedInterBase64 = await fetchFontAsBase64('/fonts/Inter-Regular.ttf');
        }
        doc.addFileToVFS('Inter-Regular.ttf', cachedInterBase64);
        doc.addFont('Inter-Regular.ttf', 'Inter', 'normal');
        doc.addFont('Inter-Regular.ttf', 'Inter', 'bold');
        doc.addFont('Inter-Regular.ttf', 'Inter', 'italic');
        doc.addFont('Inter-Regular.ttf', 'Inter', 'bolditalic');
    } catch (e) {
        console.warn('Error loading custom fonts for jsPDF:', e);
    }
}
