/**
 * --- BUSINESS LOGIC BARREL FILE ---
 * Re-exports modularized helpers for backward compatibility.
 */

export { numberToBanglaWords, updateLiveWords, resetLiveWords } from './currency-words.js';
export { sendSMS, sendWhatsApp, calculateSmsParts, formatSmsCounterText, buildSmsMessage } from './messaging-service.js';
export { promptSecurityPin } from './pin-security.js';
export { toBanglishName, matchCustomerSearch } from './banglish-search.js';

import { numberToBanglaWords, updateLiveWords, resetLiveWords } from './currency-words.js';
import { sendSMS, sendWhatsApp, calculateSmsParts, formatSmsCounterText, buildSmsMessage } from './messaging-service.js';
import { promptSecurityPin } from './pin-security.js';
import { toBanglishName, matchCustomerSearch } from './banglish-search.js';

// Global Bindings for inline DOM events
if (typeof window !== 'undefined') {
    window.numberToBanglaWords = numberToBanglaWords;
    window.updateLiveWords = updateLiveWords;
    window.resetLiveWords = resetLiveWords;
    window.sendSMS = sendSMS;
    window.sendWhatsApp = sendWhatsApp;
    window.calculateSmsParts = calculateSmsParts;
    window.formatSmsCounterText = formatSmsCounterText;
    window.buildSmsMessage = buildSmsMessage;
    window.promptSecurityPin = promptSecurityPin;
    window.toBanglishName = toBanglishName;
    window.matchCustomerSearch = matchCustomerSearch;
}

