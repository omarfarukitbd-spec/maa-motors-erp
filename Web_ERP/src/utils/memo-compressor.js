/**
 * Maa Motors ERP - Smart Scanned Memo Compressor & Contrast Engine
 * 1. Resizes scanner images to optimal readability dimension (Max Width: 1200px).
 * 2. Enhances ink contrast & removes paper scan haze via Canvas filters.
 * 3. Dynamic iterative WebP encoding strictly targeting 20 KB - 50 KB.
 */

const MAX_WIDTH = 1200;
const MAX_HEIGHT = 1600;
const TARGET_MIN_KB = 20;
const TARGET_MAX_KB = 50;

/**
 * Validates whether the given file is an acceptable image
 * @param {File} file
 * @returns {boolean}
 */
export function isValidImageFile(file) {
    if (!file) return false;
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/bmp', 'image/tiff'];
    return validTypes.includes(file.type.toLowerCase()) || /\.(jpe?g|png|webp|bmp|tiff)$/i.test(file.name);
}

/**
 * Iteratively compresses an image file to WebP format (target 20-50 KB)
 * @param {File|Blob} file 
 * @returns {Promise<{ blob: Blob, dataUrl: string, sizeKB: number, width: number, height: number }>}
 */
export async function compressScannedMemo(file) {
    if (!isValidImageFile(file)) {
        throw new Error('অনুগ্রহ করে একটি সঠিক ছবির ফাইল (JPG, PNG, বা WebP) নির্বাচন করুন।');
    }

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error('ফাইলটি পড়তে ব্যর্থ হয়েছে।'));
        reader.onload = () => {
            const img = new Image();
            img.onerror = () => reject(new Error('ছবির ডেটা লোড করা সম্ভব হয়নি।'));
            img.onload = async () => {
                try {
                    let { width, height } = img;

                    // Calculate aspect-ratio preserved dimensions
                    if (width > MAX_WIDTH || height > MAX_HEIGHT) {
                        const widthRatio = MAX_WIDTH / width;
                        const heightRatio = MAX_HEIGHT / height;
                        const scale = Math.min(widthRatio, heightRatio);
                        width = Math.round(width * scale);
                        height = Math.round(height * scale);
                    }

                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');

                    if (!ctx) {
                        return reject(new Error('ক্যানভাস রেন্ডারিং কন্টেক্সট পাওয়া যায়নি।'));
                    }

                    // Adaptive ink contrast enhancement for faint handwritten pens & rubber stamps
                    ctx.filter = 'contrast(1.12) brightness(1.02)';
                    ctx.drawImage(img, 0, 0, width, height);
                    ctx.filter = 'none';

                    // Iterative Quality Adjustment Loop (Target 20-50 KB)
                    let currentQuality = 0.55;
                    let resultBlob = await getCanvasBlob(canvas, currentQuality);
                    let sizeKB = Math.round(resultBlob.size / 1024);

                    // If too large (> 50 KB), decrease quality
                    while (sizeKB > TARGET_MAX_KB && currentQuality > 0.35) {
                        currentQuality -= 0.06;
                        resultBlob = await getCanvasBlob(canvas, currentQuality);
                        sizeKB = Math.round(resultBlob.size / 1024);
                    }

                    // If smaller than 20 KB and quality has headroom, increase clarity
                    while (sizeKB < TARGET_MIN_KB && currentQuality < 0.75) {
                        currentQuality += 0.08;
                        const higherBlob = await getCanvasBlob(canvas, currentQuality);
                        const higherSizeKB = Math.round(higherBlob.size / 1024);
                        if (higherSizeKB <= TARGET_MAX_KB) {
                            resultBlob = higherBlob;
                            sizeKB = higherSizeKB;
                        } else {
                            break;
                        }
                    }

                    const dataUrl = canvas.toDataURL('image/webp', currentQuality);

                    resolve({
                        blob: resultBlob,
                        dataUrl,
                        sizeKB,
                        width,
                        height
                    });
                } catch (err) {
                    console.error('Memo compression error:', err);
                    reject(err);
                }
            };
            img.src = reader.result;
        };
        reader.readAsDataURL(file);
    });
}

/**
 * Canvas toBlob wrapper returning a Promise
 */
function getCanvasBlob(canvas, quality) {
    return new Promise(resolve => {
        canvas.toBlob(blob => {
            resolve(blob);
        }, 'image/webp', quality);
    });
}
