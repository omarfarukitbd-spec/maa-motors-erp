/**
 * --- STEALTH CHAMELEON IDENTITY ---
 * Disguises the browser tab title and favicon as an innocent Google Sheets document
 * so that observers, colleagues, or anyone glancing at the screen cannot detect an ERP.
 */

const SHEETS_TITLE = "Google Sheets - বার্ষিক হিসাব";

// Authentic Google Sheets Green Icon in SVG format
const SHEETS_FAVICON_SVG = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
  <path fill="#0F9D58" d="M29 4H11C9.34 4 8 5.34 8 7v34c0 1.66 1.34 3 3 3h26c1.66 0 3-1.34 3-3V15L29 4z"/>
  <path fill="#87CEAC" d="M29 4v11h11L29 4z"/>
  <path fill="#FFF" d="M14 22h20v2H14zm0 6h20v2H14zm0 6h12v2H14z"/>
</svg>
`);

export function applyChameleonIdentity() {
    if (typeof document === 'undefined') return;

    // 1. Mask Tab Title
    document.title = SHEETS_TITLE;

    // 2. Mask Favicon
    let link = document.querySelector("link[rel*='icon']");
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
    }
    link.type = 'image/svg+xml';
    link.href = SHEETS_FAVICON_SVG;

    // Also update dynamic-favicon or apple touch icons if present
    const dynFavicon = document.getElementById('dynamic-favicon');
    if (dynFavicon) {
        dynFavicon.type = 'image/svg+xml';
        dynFavicon.href = SHEETS_FAVICON_SVG;
    }
}

export function initChameleonObserver() {
    if (typeof window === 'undefined') return;

    applyChameleonIdentity();

    // Re-enforce disguise when tab visibility changes or window gains/loses focus
    document.addEventListener('visibilitychange', () => {
        applyChameleonIdentity();
    });

    window.addEventListener('focus', () => {
        applyChameleonIdentity();
    });
}
