import { SettingsDAO, UserDAO } from '../dao.js';
import { firebase, auth } from '../firebase-config.js';
import { triggerPanic } from './stealth-panic.js';

const INACTIVITY_LIMIT_MS = 3 * 60 * 1000; // 3 Minutes
const LOCK_STORAGE_KEY = 'stealth_screen_locked';
const LAST_ACTIVE_KEY = 'stealth_last_active_time';

let inactivityTimer = null;
let isLocked = false;
let failedAttempts = 0;

/**
 * Check if the screen is currently in locked state
 */
export function isStealthLocked() {
    if (typeof window === 'undefined') return false;
    return isLocked || 
        sessionStorage.getItem(LOCK_STORAGE_KEY) === 'true' || 
        localStorage.getItem(LOCK_STORAGE_KEY) === 'true';
}

/**
 * Reset Inactivity Timer on User Interaction & Record Timestamp
 */
export function resetInactivityTimer() {
    if (isLocked) return;

    const now = Date.now();
    try {
        sessionStorage.setItem(LAST_ACTIVE_KEY, now.toString());
        localStorage.setItem(LAST_ACTIVE_KEY, now.toString());
    } catch (e) {
        console.warn('Storage timestamp error:', e);
    }

    if (inactivityTimer) {
        clearTimeout(inactivityTimer);
    }

    inactivityTimer = setTimeout(() => {
        const appContainer = document.getElementById('app-container');
        const isAppUnlocked = appContainer && !appContainer.classList.contains('hidden');
        const hasUser = auth && auth.currentUser;

        if ((isAppUnlocked || hasUser) && !isLocked) {
            lockScreen();
        }
    }, INACTIVITY_LIMIT_MS);
}

/**
 * Present Secure Dark Lock Screen Overlay (Persisted Across Refresh)
 */
export function lockScreen() {
    isLocked = true;
    failedAttempts = 0;

    // Persist lock status so browser refresh (F5) cannot bypass security
    try {
        sessionStorage.setItem(LOCK_STORAGE_KEY, 'true');
        localStorage.setItem(LOCK_STORAGE_KEY, 'true');
    } catch (e) {
        console.warn('Storage lock error:', e);
    }

    // Blur and freeze underlying app container
    const appContainer = document.getElementById('app-container');
    if (appContainer) {
        appContainer.classList.add('pointer-events-none', 'select-none', 'filter', 'blur-xl');
    }

    // Remove existing lock overlay if already in DOM
    document.getElementById('stealth-lock-overlay')?.remove();

    const overlay = document.createElement('div');
    overlay.id = 'stealth-lock-overlay';
    overlay.className = 'fixed inset-0 z-[999999] flex items-center justify-center bg-slate-950/95 backdrop-blur-3xl p-4 font-bn select-none';
    overlay.innerHTML = `
        <div class="w-full max-w-[380px] p-8 m3-card text-center bg-slate-900/95 border border-slate-700/80 rounded-[32px] shadow-2xl animate-fade-in">
            <div class="w-16 h-16 bg-blue-500/15 text-blue-400 text-3xl flex items-center justify-center rounded-2xl mx-auto mb-5 border border-blue-500/30 shadow-lg shadow-blue-500/10 animate-pulse">
                <i class="fa-solid fa-shield-halved"></i>
            </div>
            <h3 class="text-xl font-black text-white mb-1">অফিস ওয়ার্কস্পেস লক</h3>
            <p class="text-slate-400 text-xs mb-6">নিষ্ক্রিয়তার কারণে সিস্টেমটি লক করা হয়েছে। আনলক করতে আপনার মাস্টার পিন দিন।</p>
            
            <form id="stealth-unlock-form" class="space-y-4" onsubmit="return false;">
                <div>
                    <input 
                        type="password" 
                        id="stealth-lock-pin" 
                        maxlength="8" 
                        autocomplete="off" 
                        autofocus 
                        placeholder="••••" 
                        class="w-full text-center text-2xl tracking-[0.4em] font-mono py-3.5 px-4 bg-slate-800/90 border border-slate-700 rounded-2xl text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                </div>
                <div id="stealth-lock-err" class="text-red-400 text-xs font-bold min-h-[18px]"></div>
                <button 
                    type="submit" 
                    id="stealth-unlock-btn" 
                    class="w-full py-3 bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-black rounded-2xl shadow-lg shadow-blue-600/30 transition-all cursor-pointer text-sm flex items-center justify-center gap-2"
                >
                    <i class="fa-solid fa-lock-open"></i> আনলক করুন
                </button>
            </form>
            <div class="mt-4 pt-3 border-t border-slate-800/80 flex justify-between items-center text-[11px] text-slate-500">
                <span>৩ বার ভুল হলে ডেটা ক্লিয়ার হবে</span>
                <button type="button" class="text-red-400 hover:text-red-300 font-bold transition-all cursor-pointer" onclick="window.triggerEmergencyPanic()">
                    <i class="fa-solid fa-power-off mr-1"></i> প্রস্থান
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    const pinInput = document.getElementById('stealth-lock-pin');
    const form = document.getElementById('stealth-unlock-form');
    const errEl = document.getElementById('stealth-lock-err');

    setTimeout(() => {
        pinInput?.focus();
    }, 100);

    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const inputVal = pinInput?.value?.trim() || '';
        if (!inputVal) {
            if (errEl) errEl.innerText = "পিন দেওয়া আবশ্যক!";
            return;
        }

        if (errEl) errEl.innerText = "যাচাই করা হচ্ছে...";

        try {
            const settings = await SettingsDAO.getAppSettings();
            const masterPin = settings?.adminSecurityPin || '1060';

            const user = firebase.auth().currentUser;
            let userPin = null;
            if (user) {
                const uDoc = await UserDAO.getById(user.uid);
                userPin = uDoc?.pin || null;
            }

            if (inputVal === String(masterPin) || (userPin && inputVal === String(userPin))) {
                unlockScreen();
            } else {
                failedAttempts++;
                const remaining = 3 - failedAttempts;
                if (remaining <= 0) {
                    // 3 consecutive failed attempts: trigger panic wipe
                    triggerPanic();
                } else {
                    if (errEl) errEl.innerText = `ভুল পিন! আর ${remaining} বার চেষ্টা করতে পারবেন।`;
                    if (pinInput) {
                        pinInput.value = '';
                        pinInput.focus();
                    }
                }
            }
        } catch (err) {
            console.error('Lock validation error:', err);
            if (errEl) errEl.innerText = "যাচাইকরণে সমস্যা হয়েছে। আবার চেষ্টা করুন।";
        }
    });
}

/**
 * Successfully Unlock Screen and Clear Lock Storage
 */
export function unlockScreen() {
    isLocked = false;
    failedAttempts = 0;

    // Clear persistent lock flags
    try {
        sessionStorage.removeItem(LOCK_STORAGE_KEY);
        localStorage.removeItem(LOCK_STORAGE_KEY);
        const now = Date.now().toString();
        sessionStorage.setItem(LAST_ACTIVE_KEY, now);
        localStorage.setItem(LAST_ACTIVE_KEY, now);
    } catch (e) {
        console.warn('Storage unlock error:', e);
    }

    // Unblur app container
    const appContainer = document.getElementById('app-container');
    if (appContainer) {
        appContainer.classList.remove('pointer-events-none', 'select-none', 'filter', 'blur-xl');
    }

    document.getElementById('stealth-lock-overlay')?.remove();
    resetInactivityTimer();
}

/**
 * Initialize 3-Minute Auto-Lock Watcher & Check Startup Lock State
 */
export function initAutoLockWatcher() {
    if (typeof window === 'undefined') return;

    window.triggerEmergencyPanic = triggerPanic;

    // 1. Check if the screen was already locked before browser refresh (F5)
    const wasLocked = sessionStorage.getItem(LOCK_STORAGE_KEY) === 'true' || 
                      localStorage.getItem(LOCK_STORAGE_KEY) === 'true';
    
    const lastActiveStr = sessionStorage.getItem(LAST_ACTIVE_KEY) || localStorage.getItem(LAST_ACTIVE_KEY);
    const lastActive = lastActiveStr ? parseInt(lastActiveStr, 10) : 0;
    const isExpired = lastActive > 0 && (Date.now() - lastActive >= INACTIVITY_LIMIT_MS);

    if (wasLocked || isExpired) {
        // Immediately enforce lock screen upon page load/refresh
        lockScreen();
    }

    // 2. Throttled activity listeners
    const activityEvents = ['mousemove', 'keydown', 'touchstart', 'scroll', 'click'];
    let lastActivityRecorded = 0;

    activityEvents.forEach(evt => {
        window.addEventListener(evt, () => {
            const now = Date.now();
            if (now - lastActivityRecorded > 1000) {
                lastActivityRecorded = now;
                resetInactivityTimer();
            }
        }, { passive: true });
    });

    // Start initial timer
    resetInactivityTimer();
}
