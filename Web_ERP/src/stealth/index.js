/**
 * --- STEALTH & ZERO-TRACE SYSTEM BARREL ---
 * Unifies Panic Trigger (3x ESC), Chameleon Identity (Google Sheets),
 * and 3-Minute Inactivity Auto-Lock into a single robust entry point.
 */
import { initPanicKey, triggerPanic } from './stealth-panic.js';
import { initChameleonObserver, applyChameleonIdentity } from './stealth-chameleon.js';
import { initAutoLockWatcher, lockScreen, unlockScreen } from './stealth-autolock.js';

export function initStealthSystem() {
    // 1. Initialize Chameleon Disguise
    initChameleonObserver();

    // 2. Initialize 3x ESC Emergency Panic Key
    initPanicKey();

    // 3. Initialize 3-Minute Inactivity Auto-Lock
    initAutoLockWatcher();
}

export {
    triggerPanic,
    applyChameleonIdentity,
    lockScreen,
    unlockScreen
};
