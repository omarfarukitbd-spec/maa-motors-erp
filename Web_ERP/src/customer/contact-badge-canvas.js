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
        bgGradientStart = '#7F1D1D'; // red-900
        bgGradientEnd = '#450A0A';   // red-950
        borderGlowColor = '#EF4444'; // red-500
        headerText = 'ব র্ত মা ন  ব কে য়া';
        heroText = `৳ ${formatAmountWithComma(totalDue)}`;
    } else if (totalDue < 0) {
        // অগ্রিম জমা (Credit Advance - Ocean Blue)
        bgGradientStart = '#075985'; // sky-900
        bgGradientEnd = '#082F49';   // sky-950
        borderGlowColor = '#38BDF8'; // sky-400
        headerText = 'অ গ্রি ম  জ মা';
        heroText = `৳ ${formatAmountWithComma(Math.abs(totalDue))}`;
    } else {
        // পরিশোধিত (Credit Zero Due - Deep Emerald Green)
        bgGradientStart = '#064E3B'; // emerald-900
        bgGradientEnd = '#022C22';   // emerald-950
        borderGlowColor = '#10B981'; // emerald-500
        headerText = 'প রি শো ধি ত  হি সা ব';
        heroText = 'পরিশোধিত';
    }

    // ২. ব্যাকগ্রাউন্ড গ্রাডিয়েন্ট ড্র
    const bgGradient = ctx.createRadialGradient(256, 256, 60, 256, 256, 320);
    bgGradient.addColorStop(0, bgGradientStart);
    bgGradient.addColorStop(1, bgGradientEnd);
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 512, 512);

    // ৩. সার্কুলার সেফ জোন গাইড রিং (ডায়ালারে সার্কেল ক্রপিং সুন্দর দেখাতে)
    ctx.save();
    ctx.beginPath();
    ctx.arc(256, 256, 246, 0, Math.PI * 2);
    ctx.lineWidth = 4;
    ctx.strokeStyle = borderGlowColor;
    ctx.shadowColor = borderGlowColor;
    ctx.shadowBlur = 12;
    ctx.stroke();
    ctx.restore();

    // ভেতরের অলংকার রিং
    ctx.save();
    ctx.beginPath();
    ctx.arc(256, 256, 238, 0, Math.PI * 2);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.stroke();
    ctx.restore();

    // ৪. টপ ব্র্যান্ড ও হিসাব নম্বর হেডার
    ctx.textAlign = 'center';
    ctx.fillStyle = '#F8FAFC'; // slate-50
    ctx.font = 'bold 20px "Segoe UI", "Hind Siliguri", Roboto, sans-serif';
    ctx.fillText("M/S. MAA-MOTOR'S", 256, 75);

    // হিসাব নং পিল ব্যাজ
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    const accBadgeWidth = 130;
    const accBadgeHeight = 26;
    ctx.beginPath();
    ctx.roundRect(256 - accBadgeWidth / 2, 92, accBadgeWidth, accBadgeHeight, 13);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.stroke();

    ctx.fillStyle = '#CBD5E1'; // slate-300
    ctx.font = 'bold 13px "Segoe UI", "Hind Siliguri", Roboto, sans-serif';
    ctx.fillText(`হিসাব #${accountNo}`, 256, 110);
    ctx.restore();

    // ৫. ডিভাইডার লাইন
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(110, 135);
    ctx.lineTo(402, 135);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();

    // ৬. অ্যাকাউন্টিং স্ট্যাটাস হেডার (বকেয়া / পরিশোধিত / অগ্রিম)
    ctx.fillStyle = borderGlowColor;
    ctx.font = 'bold 18px "Hind Siliguri", "Segoe UI", Roboto, sans-serif';
    ctx.fillText(headerText, 256, 175);

    // ৭. হিরো অ্যামাউন্ট (বড় বোল্ড ফন্ট)
    ctx.save();
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 4;

    // টাকার অংক কত বড় সে অনুযায়ী ফন্ট সাইজ অ্যাডজাস্ট
    if (heroText.length > 12) {
        ctx.font = 'bold 44px "Hind Siliguri", "Segoe UI", Roboto, sans-serif';
    } else if (heroText.length > 9) {
        ctx.font = 'bold 52px "Hind Siliguri", "Segoe UI", Roboto, sans-serif';
    } else {
        ctx.font = 'bold 62px "Hind Siliguri", "Segoe UI", Roboto, sans-serif';
    }
    ctx.fillText(heroText, 256, 255);
    ctx.restore();

    // ৮. ডিভাইডার লাইন ২
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(110, 290);
    ctx.lineTo(402, 290);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();

    // ৯. স্মার্ট পেমেন্ট ট্র্যাকার (ব্যবহারকারীর চাহিদামতো "শেষ জমা: ২০ দিন আগে")
    const recencyText = intelligence.lastPaymentRecencyText || 'কোনো জমা পাওয়া যায়নি';
    const dateText = intelligence.lastPaymentDateText ? `জমার তারিখ: ${intelligence.lastPaymentDateText}` : '';

    // পেমেন্ট তথ্য বক্স
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    const infoBoxW = 360;
    const infoBoxH = dateText ? 76 : 50;
    ctx.beginPath();
    ctx.roundRect(256 - infoBoxW / 2, 310, infoBoxW, infoBoxH, 16);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.stroke();

    ctx.fillStyle = '#FEF08A'; // yellow-200 (হাইলাইট)
    if (recencyText.length > 25) {
        ctx.font = 'bold 15px "Hind Siliguri", "Segoe UI", Roboto, sans-serif';
    } else {
        ctx.font = 'bold 17px "Hind Siliguri", "Segoe UI", Roboto, sans-serif';
    }
    ctx.fillText(recencyText, 256, 342);

    if (dateText) {
        ctx.fillStyle = '#94A3B8'; // slate-400
        ctx.font = '14px "Hind Siliguri", "Segoe UI", Roboto, sans-serif';
        ctx.fillText(dateText, 256, 368);
    }
    ctx.restore();

    // ১০. ফুটার: জোন / এলাকা ট্যাগ
    ctx.fillStyle = '#CBD5E1';
    ctx.font = 'bold 16px "Hind Siliguri", "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`এলাকা: ${zoneName}`, 256, 440);

    // সিকিউরিটি গার্ড ট্যাগ
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.font = '11px "Segoe UI", Roboto, sans-serif';
    ctx.fillText('LIVE ERP CALLER ID', 256, 470);

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
