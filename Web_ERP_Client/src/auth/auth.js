import { auth, firebase, db } from '../firebase-config.js';
import { AppState } from '../state.js';
import { unlockApp } from '../navigation/router.js';
import { showToast } from '../utils.js';

const MASTER_PINS = ['1234', '9999', '7860', '1894', '1001', '01819189402', '123456'];

export async function loginWithPin() {
    const pinInput = document.getElementById('pin-input');
    const errEl = document.getElementById('login-error');
    if (errEl) errEl.innerText = '';
    const pin = pinInput?.value?.trim();

    if (!pin) {
        if (errEl) errEl.innerText = 'অনুগ্রহ করে সিকিউরিটি পিন দিন';
        return;
    }

    try {
        // Authenticate with Firebase anonymously if not logged in
        if (!auth.currentUser) {
            try {
                await auth.signInAnonymously();
            } catch (authErr) {
                console.warn("Anonymous auth note:", authErr);
            }
        }

        let isAuthorized = MASTER_PINS.includes(pin);

        if (!isAuthorized) {
            try {
                const doc = await db.collection('settings').doc('app_config').get();
                if (doc.exists && doc.data().adminPin === pin) {
                    isAuthorized = true;
                }
            } catch (err) {
                console.warn("Settings check error:", err);
            }
        }

        if (isAuthorized) {
            AppState.currentUserRole = 'Boss';
            AppState.currentUserEmail = 'owner@maamotors.com';
            sessionStorage.setItem('boss_auth_token', 'authorized');
            unlockApp();
            showToast('স্বাগতম, মালিক মহোদয়!', 'success', 'লগইন সফল');
        } else {
            if (errEl) errEl.innerText = 'ভুল সিকিউরিটি পিন! সঠিক ৪-ডিজিট পিন দিন।';
        }
    } catch (e) {
        console.error("PIN Auth Error:", e);
        // Fallback for offline/local authorization
        if (MASTER_PINS.includes(pin)) {
            AppState.currentUserRole = 'Boss';
            AppState.currentUserEmail = 'owner@maamotors.com';
            sessionStorage.setItem('boss_auth_token', 'authorized');
            unlockApp();
            showToast('স্বাগতম, মালিক মহোদয়!', 'success', 'লগইন সফল');
        } else {
            if (errEl) errEl.innerText = 'ভুল সিকিউরিটি পিন!';
        }
    }
}

export async function loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    const errEl = document.getElementById('login-error');
    if (errEl) errEl.innerText = 'Google লগইন প্রসেস করা হচ্ছে...';

    try {
        const result = await auth.signInWithPopup(provider);
        AppState.currentUser = result.user;
        AppState.currentUserRole = 'Boss';
        AppState.currentUserEmail = result.user.email;
        sessionStorage.setItem('boss_auth_token', 'authorized');
        unlockApp();
        showToast(`স্বাগতম, ${result.user.displayName || 'মালিক'}!`, 'success', 'লগইন সফল');
    } catch (e) {
        console.warn("Popup blocked, trying redirect:", e);
        try {
            await auth.signInWithRedirect(provider);
        } catch (err) {
            console.error("Google Auth Error:", err);
            if (errEl) errEl.innerText = 'Google লগইন ব্যর্থ হয়েছে।';
        }
    }
}

export async function logout() {
    try {
        await auth.signOut();
    } catch (e) {
        console.error(e);
    }
    sessionStorage.removeItem('boss_auth_token');
    window.location.reload();
}

export function checkAutoAuth() {
    const token = sessionStorage.getItem('boss_auth_token');
    if (token === 'authorized') {
        unlockApp();
    }
}
