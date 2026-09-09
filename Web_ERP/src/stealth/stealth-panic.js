import { auth } from '../firebase-config.js';

/**
 * --- STEALTH PANIC PROTOCOL ---
 * Instantly wipes browser session, purges local cached stores,
 * and replaces window location with a safe news portal (Prothom Alo)
 * so that back-button history is destroyed and zero accounting traces remain.
 */
export async function triggerPanic() {
    try {
        // 1. Sign out active Firebase user session
        if (auth && auth.currentUser) {
            await auth.signOut();
        }
    } catch (err) {
        console.error('Panic auth signout error:', err);
    }

    try {
        // 2. Clear browser session and local storage
        sessionStorage.clear();
        localStorage.clear();
    } catch (err) {
        console.error('Panic storage clear error:', err);
    }

    try {
        // 3. Purge IndexedDB databases to eliminate cached ledger/customers on disk
        if (window.indexedDB && window.indexedDB.databases) {
            const dbs = await window.indexedDB.databases();
            for (const dbInfo of dbs) {
                // Delete local firestore customer & ledger cache, keep auth schema intact
                if (dbInfo.name && dbInfo.name.toLowerCase().includes('firestore')) {
                    window.indexedDB.deleteDatabase(dbInfo.name);
                }
            }
        }
    } catch (err) {
        console.error('Panic IndexedDB purge error:', err);
    }

    // 4. Irreversible redirection to Prothom Alo without history trace
    window.location.replace('https://www.prothomalo.com');
}

/**
 * Initialize Emergency Stealth Panic Trigger
 * Requires either:
 *  1. Alt + Escape 3 rapid presses within 1.5 seconds, OR
 *  2. Instant Combo: Ctrl + Alt + Shift + P
 * Normal Escape presses (closing modals/popups) will NEVER trigger panic.
 */
export function initPanicKey() {
    if (typeof window === 'undefined') return;

    let altEscCount = 0;
    let lastAltEscTime = 0;

    window.addEventListener('keydown', (e) => {
        // 1. Direct Instant Emergency Combo: Ctrl + Alt + Shift + P
        if (e.ctrlKey && e.altKey && e.shiftKey && (e.key === 'P' || e.key === 'p')) {
            e.preventDefault();
            triggerPanic();
            return;
        }

        // 2. Multi-key Buffer: Alt + Escape 3 times within 1.5 seconds
        if (e.altKey && e.key === 'Escape') {
            const now = Date.now();
            if (now - lastAltEscTime <= 1500) {
                altEscCount++;
            } else {
                altEscCount = 1;
            }
            lastAltEscTime = now;

            if (altEscCount >= 3) {
                altEscCount = 0;
                triggerPanic();
            }
        }
    }, { capture: true });
}
