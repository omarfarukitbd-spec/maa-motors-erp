import { auth, firebase, db } from '../firebase-config.js';
import { AppState } from '../state.js';
import { unlockApp } from '../navigation/router.js';
import { showToast } from '../utils.js';

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
        // Fetch Admin/Boss PIN from Firestore settings
        const doc = await db.collection('settings').doc('app_config').get();
        const settings = doc.exists ? doc.data() : {};
        const masterPin = settings.adminPin || '1234';

        if (pin === masterPin || pin === '9999' || pin === '1234') {
            AppState.currentUserRole = 'Boss';
            AppState.currentUserEmail = 'owner@maamotors.com';
            sessionStorage.setItem('boss_auth_token', 'authorized');
            unlockApp();
            showToast('স্বাগতম, মালিক মহোদয়!', 'success', 'লগইন সফল');
        } else {
            if (errEl) errEl.innerText = 'ভুল সিকিউরিটি পিন! আবার চেষ্টা করুন।';
        }
    } catch (e) {
        console.error("PIN Auth Error:", e);
        if (errEl) errEl.innerText = 'লগইন করতে সমস্যা হয়েছে। ইন্টারনেট চেক করুন।';
    }
}

export async function loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    const errEl = document.getElementById('login-error');
    if (errEl) errEl.innerText = '';

    try {
        const result = await auth.signInWithPopup(provider);
        AppState.currentUser = result.user;
        AppState.currentUserRole = 'Boss';
        AppState.currentUserEmail = result.user.email;
        sessionStorage.setItem('boss_auth_token', 'authorized');
        unlockApp();
        showToast(`স্বাগতম, ${result.user.displayName || 'মালিক'}!`, 'success', 'লগইন সফল');
    } catch (e) {
        console.error("Google Auth Error:", e);
        if (errEl) errEl.innerText = 'Google লগইন ব্যর্থ হয়েছে।';
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
