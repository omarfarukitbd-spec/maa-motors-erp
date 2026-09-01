import { formatAmountWithComma, showToast } from '../utils.js';

/**
 * Draw 1080x1820 HD Graphic Card on HTML5 Canvas (Customer Deposits & Bank Balances)
 */
export function drawFinancialCardCanvas(data, shopName, dateStr) {
    const canvas = document.getElementById('wa-card-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = 1080;
    const height = 1820;

    // Background Gradient
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#042f2e');
    grad.addColorStop(0.3, '#0f172a');
    grad.addColorStop(1, '#090d16');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Top Header Banner
    ctx.fillStyle = '#10b981';
    ctx.fillRect(0, 0, width, 12);

    // Title & Header
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 44px "Hind Siliguri", "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(shopName, width / 2, 85);

    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 26px "Hind Siliguri", "Inter", sans-serif';
    ctx.fillText('দৈনিক কাস্টমার জমা ও ব্যাংক ব্যালেন্স রিপোর্ট', width / 2, 130);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '22px "Hind Siliguri", "Inter", sans-serif';
    ctx.fillText(`তারিখ: ${dateStr}`, width / 2, 170);

    // Divider Line
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(60, 200);
    ctx.lineTo(width - 60, 200);
    ctx.stroke();

    // 1. Four Collection & Fund KPI Metric Cards
    const cardY = 215;
    const cardW = 460;
    const cardH = 125;

    drawMetricBox(ctx, 60, cardY, cardW, cardH, '#064e3b', '#34d399', 'সর্বমোট জমা (Total Collection)', `৳ ${formatAmountWithComma(data.totalCollection)}`, `${data.customerCollections?.length || 0} জন কাস্টমার জমা`);
    drawMetricBox(ctx, 560, cardY, cardW, cardH, '#0c4a6e', '#38bdf8', 'ক্যাশ ইন হ্যান্ড (Cash In Hand)', `৳ ${formatAmountWithComma(data.cashCollection)}`, 'নগদ ক্যাশ জমা');
    drawMetricBox(ctx, 60, cardY + 140, cardW, cardH, '#1e3a8a', '#60a5fa', 'ব্যাংক ও অনলাইন আদায় (Bank Inflow)', `৳ ${formatAmountWithComma(data.bankCollection)}`, 'ব্যাংক একাউন্ট ও এমএফএস');
    drawMetricBox(ctx, 560, cardY + 140, cardW, cardH, '#581c87', '#c084fc', 'মোট ফান্ড স্থিতি (Liquid Balance)', `৳ ${formatAmountWithComma(data.totalLiquidFund || data.totalCollection)}`, 'ক্যাশ ও ব্যাংকের মোট স্থিতি');

    // 2. Full-Width Grand Card: মার্কেটে সর্বমোট বকেয়া (Total Market Outstanding Due)
    const dueY = cardY + 280;
    const dueW = 960;
    const dueH = 115;
    drawMetricBox(ctx, 60, dueY, dueW, dueH, '#4c0519', '#fb7185', 'মার্কেটে সর্বমোট অবশিষ্ট বকেয়া (Total Market Due)', `৳ ${formatAmountWithComma(data.totalMarketDue || 0)}`, `${data.dueCustomerCount || 0} জন কাস্টমারের কাছে মোট পাওনা বকেয়া`);

    // Section 1: আজকের ব্যাংক ও ক্যাশভিত্তিক জমা
    let currY = dueY + 130;
    const sec1H = 320;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(60, currY, 960, sec1H);
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(60, currY, 960, sec1H);

    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 25px "Hind Siliguri", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('আজকের ব্যাংক ও ক্যাশ আদায় বিবরণী (Today\'s Deposits)', 90, currY + 42);

    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(90, currY + 62);
    ctx.lineTo(990, currY + 62);
    ctx.stroke();

    let methodRowY = currY + 105;
    if (data.methodBreakdown) {
        const methods = Object.values(data.methodBreakdown).filter(m => m.name !== 'Less');
        if (methods.length > 0) {
            methods.slice(0, 5).forEach(m => {
                ctx.fillStyle = '#f1f5f9';
                ctx.font = 'bold 22px "Hind Siliguri", sans-serif';
                ctx.fillText(`• ${m.name}`, 90, methodRowY);

                ctx.fillStyle = '#94a3b8';
                ctx.font = '19px "Hind Siliguri", sans-serif';
                ctx.fillText(`(${m.count} জন কাস্টমার)`, 380, methodRowY);

                ctx.fillStyle = '#34d399';
                ctx.font = 'bold 24px "Inter", monospace';
                ctx.textAlign = 'right';
                ctx.fillText(`৳ ${formatAmountWithComma(m.amount)}`, 990, methodRowY);
                ctx.textAlign = 'left';
                methodRowY += 45;
            });
        }
    }

    // Section 2: কোন ব্যাংকে কত টাকা আছে (Live Balances)
    currY = 965;
    const sec2H = 360;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(60, currY, 960, sec2H);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(60, currY, 960, sec2H);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 25px "Hind Siliguri", sans-serif';
    ctx.fillText('কোন ব্যাংকে কত টাকা আছে (Live Bank Balances)', 90, currY + 42);

    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(90, currY + 62);
    ctx.lineTo(990, currY + 62);
    ctx.stroke();

    let bankRowY = currY + 105;
    if (data.bankBalances && data.bankBalances.length > 0) {
        data.bankBalances.slice(0, 5).forEach(b => {
            ctx.fillStyle = '#f8fafc';
            ctx.font = 'bold 22px "Hind Siliguri", sans-serif';
            ctx.fillText(`• ${b.name}`, 90, bankRowY);

            ctx.fillStyle = '#38bdf8';
            ctx.font = 'bold 24px "Inter", monospace';
            ctx.textAlign = 'right';
            ctx.fillText(`৳ ${formatAmountWithComma(b.balance)}`, 990, bankRowY);
            ctx.textAlign = 'left';
            bankRowY += 45;
        });
    }

    // Section 3: শীর্ষ জমা প্রদানকারী কাস্টমার
    currY = 1345;
    const sec3H = 380;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(60, currY, 960, sec3H);
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(60, currY, 960, sec3H);

    ctx.fillStyle = '#c084fc';
    ctx.font = 'bold 25px "Hind Siliguri", sans-serif';
    ctx.fillText('আজকের শীর্ষ জমা প্রদানকারী কাস্টমার (Top Deposits)', 90, currY + 42);

    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(90, currY + 62);
    ctx.lineTo(990, currY + 62);
    ctx.stroke();

    let topRowY = currY + 105;
    if (data.customerCollections && data.customerCollections.length > 0) {
        const sorted = [...data.customerCollections].sort((a, b) => b.amount - a.amount).slice(0, 5);
        sorted.forEach((c, idx) => {
            ctx.fillStyle = '#f1f5f9';
            ctx.font = 'bold 21px "Hind Siliguri", sans-serif';
            ctx.fillText(`${idx + 1}. ${c.customerName} (A/C: ${c.customerAccountNo || '-'})`, 90, topRowY);

            ctx.fillStyle = '#a855f7';
            ctx.font = 'bold 23px "Inter", monospace';
            ctx.textAlign = 'right';
            ctx.fillText(`৳ ${formatAmountWithComma(c.amount)}`, 990, topRowY);
            ctx.textAlign = 'left';
            topRowY += 45;
        });
    }

    // Footer Branding
    ctx.fillStyle = '#64748b';
    ctx.font = '18px "Hind Siliguri", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Maa Motors ERP • স্বয়ংক্রিয় ডিজিটাল ক্লোজিং সিস্টেম', width / 2, 1780);
}

function drawMetricBox(ctx, x, y, w, h, bgHex, textHex, title, mainVal, subVal) {
    ctx.fillStyle = bgHex;
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = textHex;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x, y, w, h);

    ctx.fillStyle = textHex;
    ctx.font = 'bold 20px "Hind Siliguri", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(title, x + 20, y + 36);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px "Inter", sans-serif';
    ctx.fillText(mainVal, x + 20, y + 84);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '18px "Hind Siliguri", sans-serif';
    ctx.fillText(subVal, x + 20, y + 122);
}

export function downloadWaCardImage(startDate) {
    const canvas = document.getElementById('wa-card-canvas');
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `Maa_Motors_Closing_${startDate}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast('ডিজিটাল কার্ড ইমেজ ডাউনলোড সম্পন্ন হয়েছে!', 'success', 'ইমেজ');
}
