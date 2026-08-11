/**
 * --- SETTINGS BARREL FILE ---
 */
import { renderSettings } from './settings/settings-main.js';
import * as ShopProfile from './settings/shop-profile.js';
import * as SmsConfig from './settings/sms-config.js';

// Export for main navigation
export { renderSettings };

// Maintain Global compatibility for HTML onclick="appSettings.func()"
window.appSettings = {
    ...ShopProfile,
    ...SmsConfig,
    exportData: window.appSettings?.exportData // Preserve the wrapper defined in settings-main.js
};
