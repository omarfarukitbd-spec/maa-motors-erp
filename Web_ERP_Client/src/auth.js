import Swal from 'sweetalert2';
import { db, auth } from './firebase-config.js';

export const AUTH_KEY = 'maa_client_auth_session';

export async function ensureAuth() {
    if (!auth.currentUser) {
        try {
            await auth.signInAnonymously();
        } catch(e) {
            console.warn("Anonymous auth failed:", e);
        }
    }
}

export function getStoredSession() {
    try {
        const raw = localStorage.getItem(AUTH_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch(e) {
        return null;
    }
}

export function saveSession(sessionData) {
    try {
        localStorage.setItem(AUTH_KEY, JSON.stringify(sessionData));
    } catch(e) {}
}

export function clearSession() {
    try {
        localStorage.removeItem(AUTH_KEY);
    } catch(e) {}
}

/**
 * Perform Master PIN or Customer A/C Login
 */
export async function performLogin(credentialStr) {
    await ensureAuth();

    const input = String(credentialStr || '').trim();
    if (!input) {
        Swal.fire({
            title: 'ইনপুট মিসিং!',
            text: 'অনুগ্রহ করে মাস্টার পিন বা কাস্টমার একাউন্ট নম্বর দিন।',
            icon: 'warning',
            customClass: { popup: '!bg-slate-900 !text-white !rounded-2xl border border-slate-800' }
        });
        return null;
    }

    // 1. Check if Boss Master PIN
    if (input === '1060' || input === '1060#') {
        const session = { role: 'Boss', name: 'Maa Motors Boss', mode: 'full', loggedAt: new Date().toISOString() };
        saveSession(session);
        return session;
    }

    // 2. Lookup Customer by Account No, Phone, or ID
    try {
        Swal.fire({ title: 'ডাটাবেস চেক করা হচ্ছে...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        
        let customer = null;

        // Try exact match on accountNo
        const accSnap = await db.collection('customers').where('accountNo', '==', input).limit(1).get();
        if (!accSnap.empty) {
            customer = { id: accSnap.docs[0].id, ...accSnap.docs[0].data() };
        } else {
            // Try phone lookup
            const phoneSnap = await db.collection('customers').where('phone', '==', input).limit(1).get();
            if (!phoneSnap.empty) {
                customer = { id: phoneSnap.docs[0].id, ...phoneSnap.docs[0].data() };
            }
        }

        Swal.close();

        if (customer) {
            const session = {
                role: 'Customer',
                name: customer.name,
                customerId: customer.id,
                accountNo: customer.accountNo || '',
                phone: customer.phone || '',
                mode: 'customer_only',
                loggedAt: new Date().toISOString()
            };
            saveSession(session);
            return session;
        } else {
            Swal.fire({
                title: 'একাউন্ট পাওয়া যায়নি!',
                text: `"${input}" নম্বরের কোনো কাস্টমার বা পিন পাওয়া যায়নি। সঠিক A/C নং বা মাস্টার পিন দিন।`,
                icon: 'error',
                customClass: { popup: '!bg-slate-900 !text-white !rounded-2xl border border-slate-800' }
            });
            return null;
        }
    } catch(e) {
        console.error("Login lookup error:", e);
        Swal.fire('Error', 'লগইন করতে সমস্যা হয়েছে', 'error');
        return null;
    }
}
