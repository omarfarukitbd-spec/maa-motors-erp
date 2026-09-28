/**
 * Maa Motors ERP - Cloudflare R2 Scanned Memo Uploader
 * Uploads compressed WebP memo images directly to Cloudflare R2 bucket via Worker proxy.
 */

const WORKER_UPLOAD_URL = 'https://maa-motors-memo-worker.office-maamotors.workers.dev';
const R2_PUBLIC_CDN_BASE = 'https://pub-852a16944d1c4fc89208ea905340a36e.r2.dev';

/**
 * Uploads a WebP blob to Cloudflare R2
 * @param {Blob} blob - The compressed WebP blob (20-50 KB)
 * @param {string} voucherNo - Voucher or Invoice number for tracking
 * @param {string} customerId - Optional customer reference
 * @returns {Promise<{ success: boolean, url: string, filename: string, error?: string }>}
 */
export async function uploadMemoToR2(blob, voucherNo = '', customerId = '') {
    if (!blob) {
        throw new Error('আপলোড করার জন্য কোনো ছবির ফাইল পাওয়া যায়নি।');
    }

    const year = new Date().getFullYear();
    const cleanVoucher = String(voucherNo || 'unassigned')
        .trim()
        .replace(/^[#\s]+/, '')
        .replace(/[^a-zA-Z0-9_-]/g, '_') || 'memo';
    const timestamp = Date.now();
    const filename = `memos/${year}/${cleanVoucher}_${timestamp}.webp`;

    try {
        const response = await fetch(WORKER_UPLOAD_URL, {
            method: 'POST',
            headers: {
                'X-Filename': filename,
                'Content-Type': 'image/webp'
            },
            body: blob
        });

        if (!response.ok) {
            const errText = await response.text();
            let parsedMsg = errText;
            try {
                const json = JSON.parse(errText);
                if (json.error) parsedMsg = json.error;
            } catch (e) {
                // Keep raw text
                console.error("Non-JSON error response from worker:", e);
            }
            throw new Error(`ক্লাউডফ্লেয়ার আপলোড ব্যর্থ হয়েছে (${response.status}): ${parsedMsg}`);
        }

        const data = await response.json();
        const finalUrl = data.url || `${R2_PUBLIC_CDN_BASE}/${filename}`;

        return {
            success: true,
            url: finalUrl,
            filename: data.filename || filename
        };
    } catch (err) {
        console.error('R2 Memo upload error:', err);
        throw err;
    }
}
