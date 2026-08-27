import Swal from 'sweetalert2';
import { SettingsDAO } from '../dao.js';
import { formatAmountWithComma, formatAppDate, getTodayLocalDateString, showToast } from '../utils.js';

/**
 * Generate formatted Bengali Daily Closing Digest and trigger WhatsApp share + Image Generator
 */
export async function shareDailyClosingViaWhatsApp(summaryData) {
    if (!summaryData) return;

    const settings = await SettingsDAO.getAppSettings();
    const shopName = settings.shopName || 'M/S. MAA-MOTOR\'S';
    const isSingle = summaryData.startDate === summaryData.endDate;
    const dateStr = isSingle ? formatAppDate(summaryData.startDate) : `${formatAppDate(summaryData.startDate)} থেকে ${formatAppDate(summaryData.endDate)}`;

    // 1. Build Bank Breakdown Text (Today's Inflow)
    let bankDetailsText = '';
    if (summaryData.methodBreakdown) {
        const methods = Object.values(summaryData.methodBreakdown).filter(m => m.name !== 'Less');
        if (methods.length > 0) {
            bankDetailsText = methods.map(b => `     - ${b.name}: ৳ ${formatAmountWithComma(b.amount)} (${b.count} জন জমা)`).join('\n');
        }
    }

    // 2. Build Zone Breakdown Text
    let zoneDetailsText = '';
    if (summaryData.zoneBreakdown) {
        const zones = Object.values(summaryData.zoneBreakdown).sort((a, b) => b.amount - a.amount).slice(0, 4);
        if (zones.length > 0) {
            zoneDetailsText = zones.map(z => `   • ${z.name}: ৳ ${formatAmountWithComma(z.amount)}`).join('\n');
        }
    }

    // 3. Build Top Paying Customers Text
    let topCustText = '';
    if (summaryData.customerCollections && summaryData.customerCollections.length > 0) {
        const sortedCust = [...summaryData.customerCollections].sort((a, b) => b.amount - a.amount).slice(0, 4);
        topCustText = sortedCust.map((c, idx) => 
            `   ${idx + 1}. ${c.customerName} (A/C: ${c.customerAccountNo}) - ৳ ${formatAmountWithComma(c.amount)}`
        ).join('\n');
    }

    // 4. Build Live Bank & Cash Closing Balances
    let liveBalancesText = '';
    if (summaryData.bankBalances && summaryData.bankBalances.length > 0) {
        liveBalancesText = summaryData.bankBalances.map(b => 
            `   • ${b.name}: ৳ ${formatAmountWithComma(b.balance)}`
        ).join('\n');
        if (summaryData.totalLiquidFund) {
            liveBalancesText += `\n   =======================\n   * মোট ফান্ড স্থিতি: ৳ ${formatAmountWithComma(summaryData.totalLiquidFund)}`;
        }
    }

    // 5. Build Expenses Text
    let expDetailsText = '';
    if (summaryData.expenseCategoryBreakdown) {
        const expCats = Object.entries(summaryData.expenseCategoryBreakdown);
        if (expCats.length > 0) {
            expDetailsText = expCats.map(([cat, amt]) => `     - ${cat}: ৳ ${formatAmountWithComma(amt)}`).join('\n');
        }
    }

    // Full Formatted Text Digest
    const fullText = 
`*${shopName}*
*দৈনিক সার্বিক আর্থিক ক্লোজিং রিপোর্ট*
তারিখ: ${dateStr}
─────────────────────────
* বিক্রয় বিবরণী:
   • মোট বিক্রয়: ৳ ${formatAmountWithComma(summaryData.totalSales)} (${summaryData.salesCount} টি ইনভয়েস)

* আজকের আদায় ও ডিপোজিট (ব্যাংক ও ক্যাশ):
   • সর্বমোট আদায়: ৳ ${formatAmountWithComma(summaryData.totalCollection)}
${bankDetailsText ? bankDetailsText + '\n' : ''}
${zoneDetailsText ? `* জোন-ভিত্তিক আদায়:\n${zoneDetailsText}\n` : ''}
${topCustText ? `* আজকের শীর্ষ আদায়কারী:\n${topCustText}\n` : ''}
* খরচের বিবরণী:
   • মোট খরচ: ৳ ${formatAmountWithComma(summaryData.totalExpenses)}
${expDetailsText ? expDetailsText + '\n' : ''}
* আজকের নিট ক্যাশ স্থিতি: ৳ ${formatAmountWithComma(summaryData.netCashFlow)}
   • মোট আদায়কারী কাস্টমার: ${summaryData.customerCollections?.length || 0} জন
─────────────────────────
${liveBalancesText ? `* সর্বমোট ব্যাংক ও ক্যাশ স্থিতি (Closing Balances):\n${liveBalancesText}\n─────────────────────────\n` : ''}
_Maa Motors ERP সিস্টেম থেকে স্বয়ংক্রিয়ভাবে প্রস্তুতকৃত_`;

    // Parse Phone Numbers (Owner's Primary and Secondary numbers)
    const rawPhones = (settings.ownerPhone || settings.shopPhone || '').split(/[,/]/).map(p => p.trim()).filter(Boolean);
    const primaryPhone = rawPhones[0] || '';
    const secondaryPhone = rawPhones[1] || '';

    // Tab 1: Text Section Action Buttons
    const textActionButtonsHtml = `
        <div class="flex flex-col sm:flex-row gap-2">
            ${primaryPhone ? `
                <button type="button" onclick="window.sendToSpecificWhatsApp('${primaryPhone}')" class="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer">
                    <i class="fa-brands fa-whatsapp text-sm"></i>
                    <span>প্রধান নম্বরে টেক্সট পাঠান (${primaryPhone})</span>
                </button>
            ` : ''}
            ${secondaryPhone ? `
                <button type="button" onclick="window.sendToSpecificWhatsApp('${secondaryPhone}')" class="flex-1 py-2.5 px-3 bg-teal-700 hover:bg-teal-600 text-white rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer">
                    <i class="fa-brands fa-whatsapp text-sm"></i>
                    <span>বিকল্প নম্বরে টেক্সট পাঠান (${secondaryPhone})</span>
                </button>
            ` : ''}
        </div>
        <!-- Custom Other Number Input for Text -->
        <div class="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            <div class="text-slate-400 text-xs px-2"><i class="fa-solid fa-pen-to-square"></i></div>
            <input id="sw-wa-custom-phone" type="tel" placeholder="অন্য কোনো নম্বরে টেক্সট পাঠান (017xxxxxxxx)..." class="flex-1 bg-transparent text-xs text-white font-mono font-bold outline-none placeholder-slate-500">
            <button type="button" onclick="window.sendToCustomWhatsApp()" class="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-white rounded-lg text-xs font-black transition-all cursor-pointer">
                <i class="fa-solid fa-paper-plane mr-1"></i> পাঠান
            </button>
        </div>
    `;

    // Tab 2: Image Section Action Buttons (Direct Image Share for Boss)
    const imageActionButtonsHtml = `
        <div class="space-y-2">
            <!-- 1. Direct Image Share (Web Share / WhatsApp Attachment) -->
            <div class="flex flex-col sm:flex-row gap-2">
                <button type="button" onclick="window.shareWaCardDirect('${primaryPhone}')" class="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black text-xs shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer">
                    <i class="fa-solid fa-share-nodes text-sm"></i>
                    <span>সরাসরি ইমেজ শেয়ার করুন (WhatsApp)</span>
                </button>
                <button type="button" onclick="window.downloadWaCardImage()" class="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black text-xs shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer">
                    <i class="fa-solid fa-download text-sm"></i>
                    <span>ইমেজ ডাউনলোড (PNG)</span>
                </button>
            </div>

            <!-- 2. Boss WhatsApp Dedicated Image Direct Send Buttons -->
            <div class="flex flex-col sm:flex-row gap-2 pt-1 border-t border-slate-800">
                ${primaryPhone ? `
                    <button type="button" onclick="window.sendImageToBoss('${primaryPhone}')" class="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-white rounded-xl font-bold text-xs border border-slate-700 flex items-center justify-center gap-1.5 transition-all cursor-pointer" title="প্রধান নম্বরে ইমেজ পাঠান">
                        <i class="fa-brands fa-whatsapp text-sm"></i>
                        <span>প্রধান নম্বরে ইমেজ পাঠান (${primaryPhone})</span>
                    </button>
                ` : ''}
                ${secondaryPhone ? `
                    <button type="button" onclick="window.sendImageToBoss('${secondaryPhone}')" class="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-teal-300 hover:text-white rounded-xl font-bold text-xs border border-slate-700 flex items-center justify-center gap-1.5 transition-all cursor-pointer" title="বিকল্প নম্বরে ইমেজ পাঠান">
                        <i class="fa-brands fa-whatsapp text-sm"></i>
                        <span>বিকল্প নম্বরে ইমেজ পাঠান (${secondaryPhone})</span>
                    </button>
                ` : ''}
            </div>
        </div>
    `;

    const modalHtml = `
        <div class="space-y-3.5 text-left font-bn p-1">
            <!-- Action Selector Bar -->
            <div class="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
                <button type="button" id="wa-tab-btn-text" onclick="window.switchWaModalTab('text')" class="flex-1 py-1.5 text-xs font-black rounded-xl bg-emerald-500 text-slate-950 shadow-md transition-all cursor-pointer">
                    <i class="fa-solid fa-align-left mr-1"></i> টেক্সট রিপোর্ট
                </button>
                <button type="button" id="wa-tab-btn-image" onclick="window.switchWaModalTab('image')" class="flex-1 py-1.5 text-xs font-bold text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer">
                    <i class="fa-solid fa-image mr-1"></i> ডিজিটাল কার্ড ইমেজ
                </button>
            </div>

            <!-- Tab 1: Text Report -->
            <div id="wa-modal-text-container" class="space-y-3">
                ${textActionButtonsHtml}
                <div>
                    <div class="flex justify-between items-center mb-1">
                        <label class="text-[11px] font-bold text-slate-400 ml-1">মেসেজ প্রিভিউ (Message Preview):</label>
                        <button type="button" onclick="window.copyWaText()" class="text-[11px] text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 cursor-pointer">
                            <i class="fa-solid fa-copy"></i> কপি করুন
                        </button>
                    </div>
                    <textarea id="sw-wa-text" readonly class="w-full bg-slate-950/90 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-mono h-48 resize-none outline-none custom-scrollbar leading-relaxed">${fullText}</textarea>
                </div>
            </div>

            <!-- Tab 2: Visual Card Image Generator -->
            <div id="wa-modal-image-container" class="hidden space-y-3">
                <div class="bg-slate-950 p-2 rounded-2xl border border-slate-800 text-center flex flex-col items-center">
                    <canvas id="wa-card-canvas" width="1080" height="1820" class="max-h-72 sm:max-h-96 w-auto rounded-xl shadow-2xl border border-slate-800"></canvas>
                </div>
                ${imageActionButtonsHtml}
            </div>
        </div>
    `;

    // Global Functions for the Modal
    window.sendToSpecificWhatsApp = (phoneStr) => {
        let cleanPhone = String(phoneStr || '').replace(/[^0-9]/g, '');
        if (cleanPhone.startsWith('01') && cleanPhone.length === 11) cleanPhone = '88' + cleanPhone;

        const encodedText = encodeURIComponent(fullText);
        const waUrl = cleanPhone 
            ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`
            : `https://api.whatsapp.com/send?text=${encodedText}`;

        window.open(waUrl, '_blank');
        showToast('টেক্সট রিপোর্টসহ WhatsApp ওপেন করা হয়েছে!', 'success', 'WhatsApp');
    };

    window.sendToCustomWhatsApp = () => {
        const input = document.getElementById('sw-wa-custom-phone');
        const phone = input ? input.value.trim() : '';
        if (!phone || phone.length < 6) {
            return showToast('সঠিক মোবাইল নম্বর লিখুন!', 'warning', 'WhatsApp');
        }
        window.sendToSpecificWhatsApp(phone);
    };

    window.copyWaText = async () => {
        try {
            await navigator.clipboard.writeText(fullText);
            showToast('সম্পূর্ণ টেক্সট সফলভাবে কপি হয়েছে!', 'success', 'কপি');
        } catch (err) {
            console.error('Clipboard copy error:', err);
            showToast('কপি করতে সমস্যা হয়েছে!', 'error', 'কপি');
        }
    };

    window.switchWaModalTab = (tab) => {
        const textTabBtn = document.getElementById('wa-tab-btn-text');
        const imgTabBtn = document.getElementById('wa-tab-btn-image');
        const textContainer = document.getElementById('wa-modal-text-container');
        const imgContainer = document.getElementById('wa-modal-image-container');

        if (tab === 'text') {
            textTabBtn.className = 'flex-1 py-1.5 text-xs font-black rounded-xl bg-emerald-500 text-slate-950 shadow-md transition-all cursor-pointer';
            imgTabBtn.className = 'flex-1 py-1.5 text-xs font-bold text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer';
            textContainer.classList.remove('hidden');
            imgContainer.classList.add('hidden');
        } else {
            imgTabBtn.className = 'flex-1 py-1.5 text-xs font-black rounded-xl bg-emerald-500 text-slate-950 shadow-md transition-all cursor-pointer';
            textTabBtn.className = 'flex-1 py-1.5 text-xs font-bold text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer';
            imgContainer.classList.remove('hidden');
            textContainer.classList.add('hidden');
            drawFinancialCardCanvas(summaryData, shopName, dateStr);
        }
    };

    window.downloadWaCardImage = () => {
        const canvas = document.getElementById('wa-card-canvas');
        if (!canvas) return;
        const link = document.createElement('a');
        link.download = `Maa_Motors_Closing_${summaryData.startDate}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        showToast('ডিজিটাল কার্ড ইমেজ ডাউনলোড সম্পন্ন হয়েছে!', 'success', 'ইমেজ');
    };

    window.shareWaCardDirect = async (fallbackPhone = '') => {
        const canvas = document.getElementById('wa-card-canvas');
        if (!canvas) return;

        showToast('ইমেজ শেয়ারিং প্রস্তুত হচ্ছে...', 'info', 'শেয়ার');

        try {
            canvas.toBlob(async (blob) => {
                if (!blob) return window.downloadWaCardImage();
                const file = new File([blob], `Maa_Motors_Closing_${summaryData.startDate}.png`, { type: 'image/png' });

                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    try {
                        await navigator.share({
                            files: [file],
                            title: `${shopName} আর্থিক ক্লোজিং`,
                            text: `${shopName} দৈনিক আর্থিক ক্লোজিং রিপোর্ট (${dateStr})`
                        });
                        showToast('ইমেজ সফলভাবে শেয়ার করা হয়েছে!', 'success', 'শেয়ার');
                    } catch (err) {
                        if (err.name !== 'AbortError') {
                            window.sendImageToBoss(fallbackPhone);
                        }
                    }
                } else {
                    window.sendImageToBoss(fallbackPhone);
                }
            }, 'image/png');
        } catch (e) {
            console.error('Direct share error:', e);
            window.sendImageToBoss(fallbackPhone);
        }
    };

    window.sendImageToBoss = async (targetPhone = '') => {
        const canvas = document.getElementById('wa-card-canvas');
        if (!canvas) return;

        let cleanPhone = String(targetPhone || '').replace(/[^0-9]/g, '');
        if (cleanPhone.startsWith('01') && cleanPhone.length === 11) cleanPhone = '88' + cleanPhone;

        // Try copying image to clipboard for instant Ctrl+V pasting in WhatsApp
        try {
            canvas.toBlob(async (blob) => {
                if (blob && navigator.clipboard && window.ClipboardItem) {
                    try {
                        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
                    } catch (clipErr) {
                        console.warn('Clipboard write image warning:', clipErr);
                    }
                }
            }, 'image/png');
        } catch (e) {
            console.warn('Clipboard image fallback:', e);
        }

        // Auto-download PNG image
        const link = document.createElement('a');
        link.download = `Maa_Motors_Closing_${summaryData.startDate}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();

        // Open WhatsApp chat directly with phone number
        const waUrl = cleanPhone 
            ? `https://api.whatsapp.com/send?phone=${cleanPhone}`
            : `https://api.whatsapp.com/send`;

        window.open(waUrl, '_blank');
        showToast('কার্ড ইমেজ ডাউনলোড ও ক্লিপবোর্ডে কপি হয়েছে! WhatsApp-এ সরাসরি পেস্ট (Ctrl+V) করে পাঠান।', 'success', 'ইমেজ শেয়ার');
    };

    await Swal.fire({
        title: '<div class="flex items-center justify-center gap-2 font-bn font-black text-lg text-white"><i class="fa-brands fa-whatsapp text-emerald-400"></i><span>বসের WhatsApp-এ ক্লোজিং পাঠান</span></div>',
        html: modalHtml,
        showCancelButton: false,
        confirmButtonText: 'বন্ধ করুন',
        customClass: {
            popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700 shadow-2xl !p-4 sm:!p-5 font-bn max-w-xl w-full',
            confirmButton: 'm3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-200 !rounded-xl !px-6 !py-2 font-bold border border-slate-700 cursor-pointer'
        },
        didOpen: () => {
            // Pre-render canvas in background
            drawFinancialCardCanvas(summaryData, shopName, dateStr);
        }
    });
}

/**
 * Draw 1080x1820 HD Graphic Card on HTML5 Canvas (Comprehensive with Daily Bank Breakdown & Balances)
 */
function drawFinancialCardCanvas(data, shopName, dateStr) {
    const canvas = document.getElementById('wa-card-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = 1080;
    const height = 1820;

    // 1. Background
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, width, height);

    // Decorative gradient background
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#042f2e');
    grad.addColorStop(0.3, '#0f172a');
    grad.addColorStop(1, '#090d16');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Top Header Banner
    ctx.fillStyle = '#10b981';
    ctx.fillRect(0, 0, width, 12);

    // 2. Title & Header
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 44px "Hind Siliguri", "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(shopName, width / 2, 85);

    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 26px "Hind Siliguri", "Inter", sans-serif';
    ctx.fillText('দৈনিক সার্বিক আর্থিক ক্লোজিং রিপোর্ট', width / 2, 130);

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

    // 3. Four Core Metric Cards (2x2 Grid)
    const cardY = 225;
    const cardW = 460;
    const cardH = 145;

    // Box 1: Sales
    drawMetricBox(ctx, 60, cardY, cardW, cardH, '#1e3a8a', '#60a5fa', 'মোট বিক্রয় (Sales)', `৳ ${formatAmountWithComma(data.totalSales)}`, `${data.salesCount} টি ইনভয়েস`);
    // Box 2: Total Collection
    drawMetricBox(ctx, 560, cardY, cardW, cardH, '#064e3b', '#34d399', 'সর্বমোট আদায় (Collection)', `৳ ${formatAmountWithComma(data.totalCollection)}`, `ক্যাশ: ৳${formatAmountWithComma(data.cashCollection)} | ব্যাংক: ৳${formatAmountWithComma(data.bankCollection)}`);
    // Box 3: Total Expenses
    drawMetricBox(ctx, 60, cardY + 165, cardW, cardH, '#881337', '#fb7185', 'মোট দোকান খরচ (Expense)', `৳ ${formatAmountWithComma(data.totalExpenses)}`, 'দোকান ও পরিচালনা খরচ');
    // Box 4: Net Cash Flow
    drawMetricBox(ctx, 560, cardY + 165, cardW, cardH, '#581c87', '#c084fc', 'নিট ক্যাশ স্থিতি (Net Cash)', `৳ ${formatAmountWithComma(data.netCashFlow)}`, 'আদায় - মোট খরচ');

    // 4. Section 1: আজকের ব্যাংক ও ক্যাশ আদায় বিবরণী (Today's Inflow by Bank/Cash)
    let currY = 570;
    const sec1H = 340;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(60, currY, 960, sec1H);
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(60, currY, 960, sec1H);

    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 25px "Hind Siliguri", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('আজকের ব্যাংক ও ক্যাশ আদায় বিবরণী (Today\'s Collections)', 90, currY + 42);

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
                ctx.fillText(`(${m.count} জন কাস্টমার জমা)`, 380, methodRowY);

                ctx.fillStyle = '#34d399';
                ctx.font = 'bold 24px "Inter", monospace';
                ctx.textAlign = 'right';
                ctx.fillText(`৳ ${formatAmountWithComma(m.amount)}`, 990, methodRowY);
                ctx.textAlign = 'left';

                methodRowY += 45;
            });
        } else {
            ctx.fillStyle = '#64748b';
            ctx.font = '20px "Hind Siliguri", sans-serif';
            ctx.fillText('আজকে কোনো আদায়ের রেকর্ড নেই।', 90, methodRowY);
        }
    }

    // 5. Section 2: ব্যাংক ও ক্যাশ সমাপনী স্থিতি (Live Closing Balances)
    currY = 940;
    const sec2H = 370;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(60, currY, 960, sec2H);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(60, currY, 960, sec2H);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 25px "Hind Siliguri", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('সর্বমোট ব্যাংক ও ক্যাশ স্থিতি (Live Total Balances)', 90, currY + 42);

    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(90, currY + 62);
    ctx.lineTo(990, currY + 62);
    ctx.stroke();

    let bankRowY = currY + 105;
    if (data.bankBalances && data.bankBalances.length > 0) {
        data.bankBalances.slice(0, 5).forEach(b => {
            ctx.fillStyle = '#cbd5e1';
            ctx.font = '22px "Hind Siliguri", sans-serif';
            ctx.fillText(`• ${b.name}`, 90, bankRowY);

            ctx.fillStyle = '#38bdf8';
            ctx.font = 'bold 24px "Inter", monospace';
            ctx.textAlign = 'right';
            ctx.fillText(`৳ ${formatAmountWithComma(b.balance)}`, 990, bankRowY);
            ctx.textAlign = 'left';

            bankRowY += 42;
        });
    }

    if (data.totalLiquidFund) {
        ctx.strokeStyle = '#334155';
        ctx.beginPath();
        ctx.moveTo(90, currY + 310);
        ctx.lineTo(990, currY + 310);
        ctx.stroke();

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 24px "Hind Siliguri", sans-serif';
        ctx.fillText('মোট লিকুইড ফান্ড স্থিতি:', 90, currY + 345);
        ctx.textAlign = 'right';
        ctx.fillText(`৳ ${formatAmountWithComma(data.totalLiquidFund)}`, 990, currY + 345);
        ctx.textAlign = 'left';
    }

    // 6. Section 3: আজকের শীর্ষ আদায়কারী কাস্টমার (Top Paying Customers)
    currY = 1340;
    const sec3H = 390;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(60, currY, 960, sec3H);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(60, currY, 960, sec3H);

    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 25px "Hind Siliguri", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('আজকের শীর্ষ আদায়কারী কাস্টমার (Top Collections)', 90, currY + 42);

    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(90, currY + 62);
    ctx.lineTo(990, currY + 62);
    ctx.stroke();

    let custRowY = currY + 105;
    if (data.customerCollections && data.customerCollections.length > 0) {
        const topCust = [...data.customerCollections].sort((a, b) => b.amount - a.amount).slice(0, 5);
        topCust.forEach((c, i) => {
            ctx.fillStyle = '#e2e8f0';
            ctx.font = 'bold 21px "Hind Siliguri", sans-serif';
            ctx.fillText(`${i + 1}. ${c.customerName} (A/C: ${c.customerAccountNo})`, 90, custRowY);

            ctx.fillStyle = '#94a3b8';
            ctx.font = '18px "Hind Siliguri", sans-serif';
            ctx.fillText(`[${c.receivedFrom || c.receivedType}]`, 520, custRowY);

            ctx.fillStyle = '#34d399';
            ctx.font = 'bold 22px "Inter", monospace';
            ctx.textAlign = 'right';
            ctx.fillText(`৳ ${formatAmountWithComma(c.amount)}`, 990, custRowY);
            ctx.textAlign = 'left';

            custRowY += 50;
        });
    } else {
        ctx.fillStyle = '#64748b';
        ctx.font = '20px "Hind Siliguri", sans-serif';
        ctx.fillText('এই সময়ে কোনো কাস্টমার আদায়ের রেকর্ড নেই।', 90, custRowY);
    }

    // 7. Footer Watermark
    ctx.fillStyle = '#475569';
    ctx.font = '18px "Hind Siliguri", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Maa Motors ERP • Live Cloud Intelligence System', width / 2, 1780);
}

function drawMetricBox(ctx, x, y, w, h, bgGradStart, accentColor, title, value, sub) {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = '#1e293b';
    ctx.strokeRect(x, y, w, h);

    // Accent line on left
    ctx.fillStyle = accentColor;
    ctx.fillRect(x, y, 6, h);

    // Title
    ctx.fillStyle = accentColor;
    ctx.font = 'bold 20px "Hind Siliguri", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(title, x + 25, y + 38);

    // Value
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 35px "Inter", monospace';
    ctx.fillText(value, x + 25, y + 86);

    // Sub
    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px "Hind Siliguri", sans-serif';
    ctx.fillText(sub, x + 25, y + 120);
}
