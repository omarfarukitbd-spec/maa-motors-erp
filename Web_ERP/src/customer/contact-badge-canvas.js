/**
 * contact-badge-canvas.js
 * HTML5 Canvas ভিত্তিক ৫১২x৫১২ রেজোলিউশনের কলার আইডি ব্যালেন্স ব্যাজ ফটো জেনারেটর
 * গুগল ডায়ালার এবং শাওমি (MIUI/HyperOS) ডায়ালারের সার্কুলার সেফ জোনের সাথে শতভাগ মানানসই।
 */

import { formatAmountWithComma } from '../utils.js';

/**
 * কাস্টমারের ডাটা ও কল ইন্টেলিজেন্স থেকে ৫১২x৫১২ ক্যানভাসে ছবি ড্র করে
 * @param {Object} customer - কাস্টমার অবজেক্ট
 * @param {Object} intelligence - calculateCallIntelligence থেকে প্রাপ্ত তথ্য
 * @returns {HTMLCanvasElement}
 */
export function renderCustomerBadgeCanvas(customer = {}, intelligence = {}) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    const totalDue = Number(customer.totalDue) || 0;
    const accountNo = customer.accountNo || '-';
    const zoneName = customer.zone || 'সাধারণ';

    // ১. থিম ও কালার স্কিম নির্ধারণ (Strict Accounting Color Code)
    let bgGradientStart, bgGradientEnd, borderGlowColor, headerText, heroText;

    if (totalDue > 0) {
        // বকেয়া (Debit - Deep Crimson Red)
        bgGradientStart = '#881337'; // rose-900 / red-900
        bgGradientEnd = '#450A0A';   // deep black-red
        borderGlowColor = '#EF4444'; // red-500
        headerText = 'বর্তমান বকেয়া';
        heroText = `৳ ${formatAmountWithComma(totalDue)}`;
    } else if (totalDue < 0) {
        // অগ্রিম জমা (Credit Advance - Ocean Blue)
        bgGradientStart = '#075985'; // sky-900
        bgGradientEnd = '#082F49';   // sky-950
        borderGlowColor = '#38BDF8'; // sky-400
        headerText = 'অগ্রিম জমা';
        heroText = `৳ ${formatAmountWithComma(Math.abs(totalDue))}`;
    } else {
        // পরিশোধিত (Credit Zero Due - Deep Emerald Green)
        bgGradientStart = '#064E3B'; // emerald-900
        bgGradientEnd = '#022C22';   // emerald-950
        borderGlowColor = '#10B981'; // emerald-500
        headerText = 'হিসাব পরিশোধিত';
        heroText = 'পরিশোধিত';
    }

    // ২. ব্যাকগ্রাউন্ড ড্র (Full Bleed Radial Gradient)
    const bgGradient = ctx.createRadialGradient(256, 256, 40, 256, 256, 260);
    bgGradient.addColorStop(0, bgGradientStart);
    bgGradient.addColorStop(1, bgGradientEnd);
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 512, 512);

    // ৩. সার্কুলার বর্ডার (Outer Safe Guide Ring)
    ctx.save();
    ctx.beginPath();
    ctx.arc(256, 256, 248, 0, Math.PI * 2);
    ctx.lineWidth = 5;
    ctx.strokeStyle = borderGlowColor;
    ctx.shadowColor = borderGlowColor;
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.restore();

    ctx.textAlign = 'center';

    // ৪. টপ: হিসাব নং পিল (বড় ফন্ট ২০px)
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    const accPillW = 180;
    const accPillH = 34;
    ctx.beginPath();
    ctx.roundRect(256 - accPillW / 2, 48, accPillW, accPillH, 17);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#F8FAFC';
    ctx.font = 'bold 20px "Hind Siliguri", "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`হিসাব #${accountNo}`, 256, 72);
    ctx.restore();

    // ৫. স্ট্যাটাস হেডার: বর্তমান বকেয়া (২৫px বোল্ড)
    ctx.fillStyle = borderGlowColor;
    ctx.font = 'bold 25px "Hind Siliguri", "Segoe UI", Roboto, sans-serif';
    ctx.fillText(headerText, 256, 122);

    // ৬. বিশাল হিরো ব্যালেন্স (Hero Balance) — ৭৪px থেকে ৮৪px
    ctx.save();
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
    ctx.shadowBlur = 14;
    ctx.shadowOffsetY = 4;

    if (heroText.length > 13) {
        ctx.font = 'bold 64px "Hind Siliguri", "Segoe UI", Roboto, sans-serif';
    } else if (heroText.length > 10) {
        ctx.font = 'bold 74px "Hind Siliguri", "Segoe UI", Roboto, sans-serif';
    } else {
        ctx.font = 'bold 84px "Hind Siliguri", "Segoe UI", Roboto, sans-serif';
    }
    ctx.fillText(heroText, 256, 202);
    ctx.restore();

    // ৭. স্মার্ট পেমেন্ট রিকারেন্সি হাই-ইমপ্যাক্ট কার্ড (Ultra Legible Box, y = 260 to 365)
    const daysText = intelligence.lastPaymentDaysText || '';
    const paidAmt = intelligence.lastPaidAmtStr || '';
    const dateText = intelligence.lastPaymentDateText || '';
    const recencyBoxW = 400;
    const recencyBoxH = 104;

    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    ctx.beginPath();
    ctx.roundRect(256 - recencyBoxW / 2, 260, recencyBoxW, recencyBoxH, 20);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    if (daysText) {
        // লাইন ১: শেষ জমা: ২ দিন আগে (বোল্ড ২৫px উজ্জ্বল হলুদ)
        ctx.fillStyle = '#FEF08A'; // yellow-200
        ctx.font = 'bold 25px "Hind Siliguri", "Segoe UI", Roboto, sans-serif';
        ctx.fillText(`শেষ জমা: ${daysText}`, 256, 300);

        // লাইন ২: ৳ ৫,০০,০০০ • ১১/১০/২৬ (বোল্ড ২১px পরিষ্কার সাদা)
        ctx.fillStyle = '#F1F5F9'; // slate-100
        ctx.font = 'bold 21px "Hind Siliguri", "Segoe UI", Roboto, sans-serif';
        const subText = dateText ? `৳ ${paidAmt}  •  ${dateText}` : `৳ ${paidAmt}`;
        ctx.fillText(subText, 256, 340);
    } else if (intelligence.lastPaymentRecencyText && intelligence.lastPaymentRecencyText !== 'পূর্বে কোনো জমা নেই') {
        // ফলব্যাক
        ctx.fillStyle = '#FEF08A';
        ctx.font = 'bold 22px "Hind Siliguri", "Segoe UI", Roboto, sans-serif';
        ctx.fillText(intelligence.lastPaymentRecencyText, 256, 318);
    } else {
        // কোনো জমা না থাকলে
        ctx.fillStyle = '#FEF08A';
        ctx.font = 'bold 24px "Hind Siliguri", "Segoe UI", Roboto, sans-serif';
        ctx.fillText('পূর্বে কোনো জমা নেই', 256, 320);
    }
    ctx.restore();

    // ৮. ফুটার: এলাকা ট্যাগ (২২px বোল্ড)
    ctx.fillStyle = '#F8FAFC';
    ctx.font = 'bold 22px "Hind Siliguri", "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`এলাকা: ${zoneName}`, 256, 432);

    return canvas;
}

/**
 * কাস্টমারের ৫১২x৫১২ ব্যাজের Raw Base64 স্ট্রিং রিটার্ন করে (Google People API photoBytes-এর জন্য)
 * @param {Object} customer
 * @param {Object} intelligence
 * @returns {string} base64 string without header
 */
export function generateCustomerBadgeBase64(customer = {}, intelligence = {}) {
    const canvas = renderCustomerBadgeCanvas(customer, intelligence);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    // data:image/jpeg;base64, অংশটুকু বাদ দেওয়া
    const parts = dataUrl.split(',');
    return parts.length > 1 ? parts[1] : '';
}

/**
 * প্রিভিউয়ের জন্য সম্পূর্ণ Data URL রিটার্ন করে
 * @param {Object} customer
 * @param {Object} intelligence
 * @returns {string} data:image/jpeg;base64,...
 */
export function generateCustomerBadgeDataUrl(customer = {}, intelligence = {}) {
    const canvas = renderCustomerBadgeCanvas(customer, intelligence);
    return canvas.toDataURL('image/jpeg', 0.85);
}
