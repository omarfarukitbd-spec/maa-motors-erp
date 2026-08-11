import Swal from 'sweetalert2';

/**
 * Global Error Handler with SweetAlert2 Integration
 * @param {Error|Object|string} error - The caught error
 * @param {string} customMessage - User-friendly context message
 */
export function handleError(error, customMessage = "একটি সমস্যা হয়েছে") {
    console.error("[App Error]", error);

    let detailedMessage = error.message || String(error);

    // Map Firebase/Common errors to Bangla
    if (error.code === 'permission-denied') {
        detailedMessage = "আপনার এই কাজটি করার অনুমতি নেই। (Permission Denied)";
    } else if (error.code === 'unavailable') {
        detailedMessage = "ইন্টারনেট কানেকশন চেক করুন। (Service Unavailable)";
    } else if (error.code === 'resource-exhausted') {
        detailedMessage = "কোটা শেষ হয়ে গেছে। (Quota Exceeded)";
    } else if (error.message && error.message.includes('index')) {
        detailedMessage = "ডাটাবেস ইনডেক্স প্রয়োজন। অনুগ্রহ করে অ্যাডমিনের সাথে যোগাযোগ করুন।";
    }

    Swal.fire({
        title: 'ভুল হয়েছে!',
        html: `
            <div class="text-left font-bn space-y-2">
                <p class="text-base font-black text-red-500">${customMessage}</p>
                <div class="p-3 bg-red-500/5 border border-red-500/10 rounded-xl">
                    <p class="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">প্রযুক্তিগত বিবরণ (Technical Details):</p>
                    <p class="text-xs text-slate-300 font-sans italic">${detailedMessage}</p>
                </div>
            </div>
        `,
        icon: 'error',
        confirmButtonText: 'ঠিক আছে',
        customClass: {
            popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-700 shadow-2xl',
            confirmButton: 'm3-btn-primary !bg-red-600 !px-8'
        }
    });
}

window.handleError = handleError;
