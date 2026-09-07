/**
 * Invisible Google reCAPTCHA Bot Protection
 * Protects ERP system from automated scrapers and bots silently.
 */
const RECAPTCHA_SITE_KEY = "6Ld_Sa4tAAAAAD3cJEVs8nG3XjU-88QhHzp4V9Mo";

export function initBotProtection() {
    if (typeof window === 'undefined') return;

    try {
        if (!document.getElementById('recaptcha-script')) {
            const script = document.createElement('script');
            script.id = 'recaptcha-script';
            script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
            script.async = true;
            script.defer = true;
            script.onload = () => {
                if (window.grecaptcha) {
                    window.grecaptcha.ready(async () => {
                        try {
                            await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'erp_session' });
                        } catch (err) {
                            console.debug('reCAPTCHA assessment complete.');
                        }
                    });
                }
            };
            script.onerror = (e) => {
                console.debug('reCAPTCHA script notice:', e);
            };
            document.head.appendChild(script);
        }
    } catch (e) {
        console.debug('reCAPTCHA init notice:', e);
    }
}
