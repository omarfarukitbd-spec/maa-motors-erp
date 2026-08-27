import Swal from 'sweetalert2';
import { SettingsDAO } from '../dao.js';
import { formatAmountWithComma, formatAppDate, showToast } from '../utils.js';
import { buildDailyClosingTextDigest, sendToSpecificWhatsApp, sendToCustomWhatsApp, copyWaText } from './financial-summary-whatsapp-text.js';
import { drawFinancialCardCanvas, downloadWaCardImage } from './financial-summary-whatsapp-image.js';
import { printClosingDepositPdfReport } from './financial-summary-whatsapp-pdf.js';

/**
 * Open 3-Tab Daily Closing Modal (Text Digest | Digital Image | PDF Report)
 */
export async function shareDailyClosingViaWhatsApp(summaryData) {
    if (!summaryData) return;

    const settings = await SettingsDAO.getAppSettings();
    const shopName = settings.shopName || 'M/S. MAA-MOTOR\'S';
    const isSingle = summaryData.startDate === summaryData.endDate;
    const dateStr = isSingle ? formatAppDate(summaryData.startDate) : `${formatAppDate(summaryData.startDate)} থেকে ${formatAppDate(summaryData.endDate)}`;

    const fullText = buildDailyClosingTextDigest(summaryData, shopName);

    const rawPhones = (settings.ownerPhone || settings.shopPhone || '').split(/[,/]/).map(p => p.trim()).filter(Boolean);
    const primaryPhone = rawPhones[0] || '';
    const secondaryPhone = rawPhones[1] || '';

    // Tab 1: Text Section HTML
    const textHtml = `
        <div class="space-y-2.5">
            <div class="flex flex-col sm:flex-row gap-2">
                ${primaryPhone ? `
                    <button type="button" onclick="window.sendToSpecificWhatsApp('${primaryPhone}', window._closingFullText)" class="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer">
                        <i class="fa-brands fa-whatsapp text-sm"></i>
                        <span>প্রধান নম্বরে টেক্সট পাঠান (${primaryPhone})</span>
                    </button>
                ` : ''}
                ${secondaryPhone ? `
                    <button type="button" onclick="window.sendToSpecificWhatsApp('${secondaryPhone}', window._closingFullText)" class="flex-1 py-2.5 px-3 bg-teal-700 hover:bg-teal-600 text-white rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer">
                        <i class="fa-brands fa-whatsapp text-sm"></i>
                        <span>বিকল্প নম্বরে টেক্সট পাঠান (${secondaryPhone})</span>
                    </button>
                ` : ''}
            </div>
            <div class="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                <div class="text-slate-400 text-xs px-2"><i class="fa-solid fa-pen-to-square"></i></div>
                <input id="sw-wa-custom-phone" type="tel" placeholder="অন্য কোনো নম্বরে টেক্সট পাঠান (017xxxxxxxx)..." class="flex-1 bg-transparent text-xs text-white font-mono font-bold outline-none placeholder-slate-500">
                <button type="button" onclick="window.sendToCustomWhatsApp(window._closingFullText)" class="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-white rounded-lg text-xs font-black transition-all cursor-pointer">
                    <i class="fa-solid fa-paper-plane mr-1"></i> পাঠান
                </button>
            </div>
            <div>
                <div class="flex justify-between items-center mb-1">
                    <label class="text-[11px] font-bold text-slate-400 ml-1">মেসেজ প্রিভিউ (Message Preview):</label>
                    <button type="button" onclick="window.copyWaText(window._closingFullText)" class="text-[11px] text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 cursor-pointer">
                        <i class="fa-solid fa-copy"></i> কপি করুন
                    </button>
                </div>
                <textarea id="sw-wa-text" readonly class="w-full bg-slate-950/90 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-mono h-44 resize-none outline-none custom-scrollbar leading-relaxed">${fullText}</textarea>
            </div>
        </div>
    `;

    // Tab 2: Visual Card Image HTML
    const imageHtml = `
        <div class="space-y-3">
            <div class="bg-slate-950 p-2 rounded-2xl border border-slate-800 text-center flex flex-col items-center">
                <canvas id="wa-card-canvas" width="1080" height="1820" class="max-h-64 sm:max-h-80 w-auto rounded-xl shadow-2xl border border-slate-800"></canvas>
            </div>
            <div class="flex flex-col sm:flex-row gap-2">
                <button type="button" onclick="window.downloadWaCardImage('${summaryData.startDate}')" class="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black text-xs shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer">
                    <i class="fa-solid fa-download text-sm"></i>
                    <span>কার্ড ইমেজ ডাউনলোড (PNG)</span>
                </button>
                <button type="button" onclick="window.sendToSpecificWhatsApp('${primaryPhone}', window._closingFullText)" class="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black text-xs shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer">
                    <i class="fa-brands fa-whatsapp text-sm"></i>
                    <span>WhatsApp ওপেন করুন</span>
                </button>
            </div>
        </div>
    `;

    // Tab 3: PDF Report Section HTML
    const pdfHtml = `
        <div class="space-y-3 font-bn">
            <!-- Preview Box of PDF Content -->
            <div class="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2.5 text-xs">
                <div class="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div class="flex items-center gap-2">
                        <div class="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center text-sm">
                            <i class="fa-solid fa-file-pdf"></i>
                        </div>
                        <div>
                            <div class="text-xs font-black text-white">দৈনিক কাস্টমার জমা ও ব্যাংক ব্যালেন্স রিপোর্ট</div>
                            <div class="text-[10px] text-slate-400">${dateStr} • মোট কাস্টমার: <strong class="text-emerald-400">${summaryData.customerCollections?.length || 0} জন</strong></div>
                        </div>
                    </div>
                    <div class="text-right font-mono font-black text-emerald-400 text-sm">
                        ৳ ${formatAmountWithComma(summaryData.totalCollection)}
                    </div>
                </div>

                <!-- 1. Executive KPIs -->
                <div class="grid grid-cols-3 gap-2 text-center font-bn">
                    <div class="p-2 bg-slate-900/90 rounded-xl border border-slate-800">
                        <div class="text-[9.5px] text-slate-400 font-bold">মোট বিক্রয়</div>
                        <div class="text-xs font-black text-blue-400 font-mono">৳ ${formatAmountWithComma(summaryData.totalSales || 0)}</div>
                    </div>
                    <div class="p-2 bg-slate-900/90 rounded-xl border border-slate-800">
                        <div class="text-[9.5px] text-slate-400 font-bold">মোট খরচ</div>
                        <div class="text-xs font-black text-rose-400 font-mono">৳ ${formatAmountWithComma(summaryData.totalExpenses || 0)}</div>
                    </div>
                    <div class="p-2 bg-slate-900/90 rounded-xl border border-slate-800">
                        <div class="text-[9.5px] text-slate-400 font-bold">নিট ক্যাশ ফ্লো</div>
                        <div class="text-xs font-black text-emerald-400 font-mono">৳ ${formatAmountWithComma(summaryData.netCashFlow || 0)}</div>
                    </div>
                </div>

                <!-- 2. Live Bank Balances Matrix -->
                ${summaryData.bankBalances && summaryData.bankBalances.length > 0 ? `
                    <div class="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800 text-[11px] space-y-1">
                        <div class="text-[10px] font-bold text-cyan-400 flex items-center gap-1">
                            <i class="fa-solid fa-building-columns"></i> কোন ব্যাংকে কত টাকা আছে (Live Balances):
                        </div>
                        <div class="flex flex-wrap gap-2 text-slate-300">
                            <span>ক্যাশ: <strong class="text-white">৳ ${formatAmountWithComma(summaryData.cashCollection)}</strong></span>
                            ${summaryData.bankBalances.map(b => `<span>• ${escapeHTML(b.name)}: <strong class="text-cyan-300">৳ ${formatAmountWithComma(b.balance)}</strong></span>`).join('')}
                        </div>
                    </div>
                ` : ''}

                <!-- 3. Banking Ledger Transactions (if any) -->
                ${summaryData.bankingTransactions && summaryData.bankingTransactions.length > 0 ? `
                    <div class="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800 text-[11px] space-y-1">
                        <div class="text-[10px] font-bold text-purple-400 flex items-center gap-1">
                            <i class="fa-solid fa-money-bill-transfer"></i> ব্যাংকিং লেজার ম্যানুয়াল লেনদেন (${summaryData.bankingTransactions.length}টি):
                        </div>
                        <div class="space-y-1">
                            ${summaryData.bankingTransactions.map(bt => `
                                <div class="flex justify-between text-[10.5px]">
                                    <span class="text-slate-300">• ${escapeHTML(bt.bankName)}${bt.targetBankName ? ' ➔ ' + escapeHTML(bt.targetBankName) : ''} <span class="text-slate-500">(${bt.type === 'deposit' ? 'জমা' : 'উত্তোলন'})</span></span>
                                    <span class="font-mono font-bold ${bt.type === 'deposit' ? 'text-emerald-400' : 'text-rose-400'}">৳ ${formatAmountWithComma(bt.amount)}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                <!-- 4. Highlights of Deposited Customers -->
                <div class="text-[11px] text-slate-300 space-y-1">
                    <div class="text-slate-400 font-bold text-[10px]">আদায় প্রদানকারী গ্রাহকদের তালিকা (${summaryData.customerCollections?.length || 0} জন):</div>
                    <div class="max-h-28 overflow-y-auto custom-scrollbar space-y-1 pr-1">
                        ${(summaryData.customerCollections || []).map((c, i) => `
                            <div class="flex justify-between items-center py-1 px-2 rounded-lg bg-slate-900/60 border border-slate-800/60 text-[11px]">
                                <span class="truncate max-w-[200px]">${i + 1}. <strong class="text-white">${escapeHTML(c.customerName)}</strong> ${c.customerAccountNo ? `(${escapeHTML(c.customerAccountNo)})` : ''}</span>
                                <span class="font-mono font-bold text-emerald-400 shrink-0">৳ ${formatAmountWithComma(c.amount)}</span>
                            </div>
                        `).join('') || '<div class="text-slate-500 italic">কোনো জমার রেকর্ড নেই</div>'}
                    </div>
                </div>
            </div>

            <!-- PDF Action Buttons -->
            <div class="space-y-2">
                <button type="button" onclick="window.triggerPrintClosingPdf()" class="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-black text-xs shadow-lg shadow-blue-900/30 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer">
                    <i class="fa-solid fa-print text-sm"></i>
                    <span>A4 মাস্টার PDF প্রিন্ট / সেভ করুন</span>
                </button>
                <button type="button" onclick="window.sendToSpecificWhatsApp('${primaryPhone}', window._closingFullText)" class="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer">
                    <i class="fa-brands fa-whatsapp text-sm"></i>
                    <span>হোয়াটসঅ্যাপে পূর্ণ বিবরণী পাঠান (${primaryPhone || 'বসের নম্বর'})</span>
                </button>
            </div>
        </div>
    `;

    const modalHtml = `
        <div class="space-y-3.5 text-left font-bn p-1">
            <!-- 3-Action Selector Bar -->
            <div class="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
                <button type="button" id="wa-tab-btn-text" onclick="window.switchWaModalTab('text')" class="flex-1 py-2 text-xs font-black rounded-xl bg-emerald-500 text-slate-950 shadow-md transition-all cursor-pointer">
                    <i class="fa-solid fa-align-left mr-1"></i> টেক্সট রিপোর্ট
                </button>
                <button type="button" id="wa-tab-btn-image" onclick="window.switchWaModalTab('image')" class="flex-1 py-2 text-xs font-bold text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer">
                    <i class="fa-solid fa-image mr-1"></i> কার্ড ইমেজ
                </button>
                <button type="button" id="wa-tab-btn-pdf" onclick="window.switchWaModalTab('pdf')" class="flex-1 py-2 text-xs font-bold text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer">
                    <i class="fa-solid fa-file-pdf mr-1"></i> PDF রিপোর্ট
                </button>
            </div>

            <div id="wa-modal-text-container" class="space-y-3">${textHtml}</div>
            <div id="wa-modal-image-container" class="hidden space-y-3">${imageHtml}</div>
            <div id="wa-modal-pdf-container" class="hidden space-y-3">${pdfHtml}</div>
        </div>
    `;

    // Global Bindings for Active Modal Instance
    window._closingFullText = fullText;
    window._closingSummaryData = summaryData;
    window.sendToSpecificWhatsApp = sendToSpecificWhatsApp;
    window.sendToCustomWhatsApp = sendToCustomWhatsApp;
    window.copyWaText = copyWaText;
    window.downloadWaCardImage = downloadWaCardImage;
    window.triggerPrintClosingPdf = () => printClosingDepositPdfReport(window._closingSummaryData);

    window.switchWaModalTab = (tab) => {
        const textTabBtn = document.getElementById('wa-tab-btn-text');
        const imgTabBtn = document.getElementById('wa-tab-btn-image');
        const pdfTabBtn = document.getElementById('wa-tab-btn-pdf');
        const textContainer = document.getElementById('wa-modal-text-container');
        const imgContainer = document.getElementById('wa-modal-image-container');
        const pdfContainer = document.getElementById('wa-modal-pdf-container');

        const activeClass = 'flex-1 py-2 text-xs font-black rounded-xl bg-emerald-500 text-slate-950 shadow-md transition-all cursor-pointer';
        const inactiveClass = 'flex-1 py-2 text-xs font-bold text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer';

        if (textTabBtn) textTabBtn.className = tab === 'text' ? activeClass : inactiveClass;
        if (imgTabBtn) imgTabBtn.className = tab === 'image' ? activeClass : inactiveClass;
        if (pdfTabBtn) pdfTabBtn.className = tab === 'pdf' ? activeClass : inactiveClass;

        if (textContainer) textContainer.classList.toggle('hidden', tab !== 'text');
        if (imgContainer) imgContainer.classList.toggle('hidden', tab !== 'image');
        if (pdfContainer) pdfContainer.classList.toggle('hidden', tab !== 'pdf');

        if (tab === 'image') {
            drawFinancialCardCanvas(summaryData, shopName, dateStr);
        }
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
            // Draw in background
            drawFinancialCardCanvas(summaryData, shopName, dateStr);
        }
    });
}
