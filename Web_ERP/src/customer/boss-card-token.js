import CryptoJS from 'crypto-js';

const BOSS_CARD_SALT = 'MAA_MOTORS_BOSS_CARD_SALT_2026_SECURE_TOKEN';

/**
 * কাস্টমার আইডির জন্য ক্রিপ্টোগ্রাফিক সিক্রেট টোকেন তৈরি করে (SHA-256)
 */
export function generateBossToken(customerId) {
    if (!customerId) return '';
    return CryptoJS.SHA256(customerId + BOSS_CARD_SALT).toString().slice(0, 16);
}

/**
 * ইউআরএল-এর টোকেন যাচাই করে
 */
export function verifyBossToken(customerId, token) {
    if (!customerId || !token) return false;
    const expected = generateBossToken(customerId);
    return expected === token;
}
