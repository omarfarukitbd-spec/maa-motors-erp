import { formatAmountWithComma, escapeHTML } from '../utils.js';
import { getCustomerSnapshot } from './inspector-calc.js';

/**
 * Creates or retrieves the Customer Inspector modal DOM element
 * @returns {HTMLElement} Modal container
 */
export function getOrCreateInspectorModal() {
    let modal = document.getElementById('customer-inspector-modal');
    if (modal) return modal;

    modal = document.createElement('div');
    modal.id = 'customer-inspector-modal';
    modal.className = 'fixed inset-0 z-[999999] bg-slate-950/85 backdrop-blur-md hidden flex items-center justify-center p-3 sm:p-4 font-bn transition-all';
    modal.innerHTML = `
        <div id="inspector-card-box" class="bg-slate-900 border border-slate-700/80 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col transform transition-all scale-95 opacity-0">
            <!-- Header Search Bar -->
            <div class="relative flex items-center border-b border-slate-800 px-4 py-3.5 bg-slate-950/50 gap-2.5">
                <div class="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                    <i class="fa-solid fa-id-card-clip text-sm"></i>
                </div>
                <div class="relative flex-1">
                    <i class="fa-solid fa-magnifying-glass text-slate-500 text-xs absolute left-3 top-1/2 -translate-y-1/2"></i>
                    <input type="text" id="inspector-query-input" placeholder="A/C নং (যেমন: 10001), মোবাইল বা নাম লিখুন..." class="w-full bg-slate-800/80 border border-slate-700/60 rounded-xl pl-8 pr-3 py-1.5 text-white text-xs sm:text-sm font-bold placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all" autocomplete="off">
                </div>
                <span id="inspector-counter-badge" class="px-2 py-1 rounded-lg bg-slate-800 text-slate-400 font-mono text-[11px] font-bold border border-slate-700 shrink-0">0 / 0</span>
                <button type="button" class="w-8 h-8 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center shrink-0 transition-all cursor-pointer" onclick="window.closeCustomerInspector()">
                    <i class="fa-solid fa-xmark text-sm"></i>
                </button>
            </div>

            <!-- Dynamic Customer Card Body -->
            <div id="inspector-card-content" class="p-4 sm:p-5 space-y-4">
                <!-- Content injected dynamically -->
            </div>

            <!-- Footer Keyboard Navigator Bar -->
            <div class="flex items-center justify-between px-4 py-3 bg-slate-950/70 border-t border-slate-800/80 text-[11px] font-bold text-slate-400">
                <button type="button" class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-700/70 transition-all cursor-pointer" onclick="window.inspectorPrev()">
                    <i class="fa-solid fa-arrow-left text-xs"></i>
                    <span>পূর্ববর্তী</span>
                </button>
                <div class="hidden sm:flex items-center gap-2 text-slate-500 text-[10px]">
                    <span><kbd class="bg-slate-800 px-1.5 py-0.5 rounded text-slate-300"><i class="fa-solid fa-arrow-left text-[9px]"></i> <i class="fa-solid fa-arrow-right text-[9px]"></i></kbd> স্ক্রল</span>
                    <span><kbd class="bg-slate-800 px-1.5 py-0.5 rounded text-purple-300">↵</kbd> খতিয়ান</span>
                    <span><kbd class="bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">ESC</kbd> বন্ধ</span>
                </div>
                <button type="button" class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/80 hover:bg-blue-600 text-white border border-blue-500/40 transition-all cursor-pointer" onclick="window.inspectorNext()">
                    <span>পরবর্তী</span>
                    <i class="fa-solid fa-arrow-right text-xs"></i>
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) window.closeCustomerInspector();
    });

    return modal;
}

/**
 * Renders the customer details card inside the inspector modal
 * @param {Object} customer Raw customer object
 * @param {number} currentIndex Current index in sorted array
 * @param {number} totalCount Total count of sorted customers
 */
export function renderInspectorCard(customer, currentIndex, totalCount, stats = null) {
    const contentEl = document.getElementById('inspector-card-content');
    const badgeEl = document.getElementById('inspector-counter-badge');
    if (!contentEl) return;

    if (badgeEl) {
        badgeEl.textContent = `${currentIndex + 1} / ${totalCount}`;
    }

    if (!customer) {
        contentEl.innerHTML = `
            <div class="text-center py-12 text-slate-500 space-y-2">
                <i class="fa-solid fa-user-slash text-3xl text-slate-600"></i>
                <div class="font-bold text-sm">কোনো কাস্টমার পাওয়া যায়নি</div>
            </div>
        `;
        return;
    }

    const s = getCustomerSnapshot(customer, stats);
    const cleanPhone = s.primaryPhone || (s.phone || '').replace(/\D/g, '');
    const waText = encodeURIComponent(`আসসালামু আলাইকুম ${s.name}, মা মোটরস্-এ আপনার বর্তমান মোট বকেয়া ৳ ${formatAmountWithComma(s.totalDue)}। দ্রুত পরিশোধের জন্য অনুরোধ করা হলো।`);
    const waLink = cleanPhone ? `https://wa.me/88${cleanPhone}?text=${waText}` : '#';

    contentEl.innerHTML = `
        <!-- Customer Identity Header -->
        <div class="flex items-start justify-between gap-3">
            <div class="flex items-start gap-3">
                <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-mono font-black text-base shrink-0 shadow-inner">
                    ${escapeHTML((s.name || 'C').charAt(0))}
                </div>
                <div>
                    <div class="flex items-center gap-2 flex-wrap">
                        <span class="bg-blue-600/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-lg font-mono font-black text-xs">
                            A/C: ${escapeHTML(s.accountNo)}
                        </span>
                        ${s.zone && s.zone !== '-' ? `
                            <span class="bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded-lg text-[10px] font-bold">
                                <i class="fa-solid fa-location-dot text-emerald-400 mr-1"></i>${escapeHTML(s.zone)}
                            </span>` : ''}
                    </div>
                    <h3 class="text-white font-black text-base sm:text-lg mt-1 leading-snug">${escapeHTML(s.name)}</h3>
                    <div class="flex items-center gap-3 text-xs text-slate-400 mt-1 flex-wrap">
                        <span class="font-semibold text-slate-300"><i class="fa-solid fa-phone text-emerald-400 mr-1"></i>${escapeHTML(s.phone)}</span>
                        ${s.address && s.address !== '-' ? `<span><i class="fa-solid fa-map-pin text-amber-400 mr-1"></i>${escapeHTML(s.address)}</span>` : ''}
                    </div>
                </div>
            </div>
        </div>

        <!-- Hero Balance Card -->
        <div class="p-4 rounded-2xl bg-gradient-to-br ${s.dueStatus.bgGradient} border ${s.dueStatus.borderColor} shadow-lg space-y-1">
            <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">${s.dueStatus.label}</span>
                <span class="text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${s.dueStatus.type === 'due' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : (s.dueStatus.type === 'adv' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-300 border border-slate-700')}">
                    ${s.dueStatus.badge}
                </span>
            </div>
            <div class="text-2xl sm:text-3xl font-black font-mono ${s.dueStatus.color} tracking-tight">
                ৳ ${formatAmountWithComma(Math.abs(s.totalDue))}
            </div>
        </div>

        <!-- Metrics Row: Opening Balance (if any) + Total Bill + Total Paid -->
        <div class="grid ${s.openingBalance !== 0 ? 'grid-cols-3' : 'grid-cols-2'} gap-2 sm:gap-3">
            ${s.openingBalance !== 0 ? `
            <div class="p-2.5 sm:p-3 rounded-xl bg-slate-950/50 border border-slate-800/80">
                <div class="text-[10px] sm:text-[11px] font-bold ${s.openingBalance > 0 ? 'text-amber-400' : 'text-emerald-400'} mb-0.5">
                    ${s.openingBalance > 0 ? 'প্রারম্ভিক ব্যালেন্স' : 'প্রারম্ভিক জমা'}
                </div>
                <div class="text-xs sm:text-sm font-black font-mono ${s.openingBalance > 0 ? 'text-amber-300' : 'text-emerald-300'} truncate">
                    ৳ ${formatAmountWithComma(Math.abs(s.openingBalance))}
                </div>
            </div>` : ''}
            <div class="p-2.5 sm:p-3 rounded-xl bg-slate-950/50 border border-slate-800/80">
                <div class="text-[10px] sm:text-[11px] font-bold text-slate-400 mb-0.5">মোট বিল (ক্রয়)</div>
                <div id="inspector-stat-bill" class="text-xs sm:text-sm font-black font-mono text-slate-200 truncate">
                    ৳ ${formatAmountWithComma(s.totalBill)}
                </div>
            </div>
            <div class="p-2.5 sm:p-3 rounded-xl bg-slate-950/50 border border-slate-800/80">
                <div class="text-[10px] sm:text-[11px] font-bold text-slate-400 mb-0.5">মোট জমা (পরিশোধ)</div>
                <div id="inspector-stat-paid" class="text-xs sm:text-sm font-black font-mono text-emerald-400 truncate">
                    ৳ ${formatAmountWithComma(s.totalPaid)}
                </div>
            </div>
        </div>

        <!-- Action Buttons (Detailed Ledger + Direct Payment + WhatsApp + Call) -->
        <div class="flex items-center gap-2 pt-1">
            <button type="button" class="flex-1 min-w-[130px] flex items-center justify-center gap-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white py-2.5 px-3 rounded-xl font-bold shadow-lg shadow-purple-600/30 transition-all cursor-pointer text-xs sm:text-sm" onclick="window.inspectorOpenLedger('${s.id}')">
                <i class="fa-solid fa-book-open-reader text-sm text-purple-200"></i>
                <span>খতিয়ান</span>
                <kbd class="hidden sm:inline-block bg-purple-950/60 border border-purple-400/40 text-[9px] px-1.5 py-0.5 rounded text-purple-200 ml-1 font-mono">Enter</kbd>
            </button>
            <button type="button" class="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 px-3 rounded-xl font-bold shadow-lg shadow-emerald-600/30 transition-all cursor-pointer text-xs sm:text-sm shrink-0" onclick="window.inspectorOpenPayment('${s.id}')" title="এই কাস্টমারের টাকা জমা এন্ট্রি করুন">
                <i class="fa-solid fa-hand-holding-dollar text-sm"></i>
                <span>+ টাকা জমা</span>
            </button>
            ${cleanPhone ? `
                <a href="${waLink}" target="_blank" class="w-10 h-10 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 flex items-center justify-center shrink-0 transition-all" title="হোয়াটসঅ্যাপে তাগাদা পাঠান">
                    <i class="fa-brands fa-whatsapp text-lg"></i>
                </a>
                <a href="tel:${cleanPhone}" class="w-10 h-10 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 flex items-center justify-center shrink-0 transition-all" title="ফোনে কল করুন">
                    <i class="fa-solid fa-phone text-sm"></i>
                </a>
            ` : ''}
        </div>
    `;
}
