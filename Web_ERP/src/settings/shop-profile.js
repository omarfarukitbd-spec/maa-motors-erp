import Swal from 'sweetalert2';
import { promptSecurityPin } from '../utils.js';

/**
 * Shop Profile & Logo Management
 * Separated to handle image processing and UI state.
 */

let currentLogoBase64 = null;

export function getCurrentLogo() { return currentLogoBase64; }
export function setCurrentLogo(val) {
    currentLogoBase64 = val;
    const preview = document.getElementById('logo-preview');
    if (preview && val) {
        preview.src = val;
        preview.classList.remove('hidden');
    }
}

export async function unlockShopSettings() {
    if (window.AppState.currentUserRole !== 'Admin') {
        return Swal.fire('অ্যাক্সেস ডিনাইড!', 'শুধুমাত্র অ্যাডমিন সেটিংস পরিবর্তন করতে পারবেন।', 'error');
    }

    const isPinValid = await promptSecurityPin("দোকানের তথ্য পরিবর্তন (Settings Unlock)");
    if (!isPinValid) return;

    const fields = ['set-shop-name', 'set-shop-owner', 'set-shop-phone', 'set-shop-address', 'set-shop-logo', 'set-print-size', 'set-show-watermark'];
    fields.forEach(id => {
        const el = document.getElementById(id);
        if(el) {
            el.disabled = false;
            el.style.opacity = '1';
        }
    });

    Swal.fire({
        toast: true, position: 'top-end', icon: 'success', title: 'সেটিংস আনলক করা হয়েছে',
        showConfirmButton: false, timer: 3000,
        customClass: { popup: '!bg-slate-900 !text-white border border-slate-700' }
    });
}

export function handleLogoSelect(event) {
    const file = event.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 300;
            let scaleSize = 1;
            if(img.width > MAX_WIDTH) scaleSize = MAX_WIDTH / img.width;
            canvas.width = img.width * scaleSize;
            canvas.height = img.height * scaleSize;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const base64 = canvas.toDataURL('image/png', 0.8);
            setCurrentLogo(base64);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// Global Bindings
window.unlockShopSettings = unlockShopSettings;
window.handleLogoSelect = handleLogoSelect;
