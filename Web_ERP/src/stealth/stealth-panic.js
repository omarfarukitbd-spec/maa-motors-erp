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
 * Initialize 3x ESC Emergency Trigger
 * Listens for 3 rapid presses of the Escape key within 1.5 seconds.
 */
export function initPanicKey() {
    if (typeof window === 'undefined') return;

    let escCount = 0;
    let lastEscTime = 0;

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const now = Date.now();
            if (now - lastEscTime <= 1500) {
                escCount++;
            } else {
                escCount = 1;
            }
            lastEscTime = now;

            if (escCount >= 3) {
                escCount = 0;
                triggerPanic();
            }
        }
    }, { capture: true });
}
