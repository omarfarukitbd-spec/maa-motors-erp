import { getActiveSettlement } from './container-state.js';
import { formatAmountWithComma, escapeHTML } from '../utils.js';

/**
 * Helper to convert digits to Bengali numeral
 */
export function toBengaliDigits(n) {
    const bn = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(n).replace(/\d/g, d => bn[d]);
}

/**
 * Render dynamic custom sections (Section 4, 5, 6...)
 */
export function renderCustomSections() {
    const containerEl = document.getElementById('cont-custom-sections-container');
    if (!containerEl) return;

    const st = getActiveSettlement();
    const sections = st.customSections || [];

    if (sections.length === 0) {
        containerEl.innerHTML = '';
        return;
    }

    containerEl.innerHTML = sections.map((sec, sIdx) => {
        const secNo = sec.sectionNo || (4 + sIdx);
        const secNoBn = toBengaliDigits(secNo);
        const rows = sec.rows || [];
        const subtotal = sec.subtotal || 0;
        const isPositive = subtotal >= 0;

        const rowsHtml = rows.map((row, rIdx) => {
            const isPlus = row.op === '+';
            return `
                <div class="flex items-center gap-2 p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors">
                    <span class="w-6 text-center text-slate-500 font-bold text-xs">${rIdx + 1}</span>

                    <!-- Operator Toggle (+ / -) -->
                    <button type="button" 
                            onclick="window.containerActions.toggleCustomSectionRowOp(${sIdx}, ${rIdx})" 
                            class="w-16 py-1.5 rounded-lg font-black text-xs transition-all flex items-center justify-center gap-1 cursor-pointer select-none ${isPlus ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-red-500/20 text-red-400 border border-red-500/40'}"
                            title="ক্লিক করে প্লাস বা মাইনাস পরিবর্তন করুন">
                        <span>${isPlus ? '(+) যোগ' : '(-) বাদ'}</span>
                    </button>

                    <!-- Description Input -->
                    <input type="text" 
                           value="${escapeHTML(row.desc)}" 
                           oninput="window.containerActions.handleCustomSectionRowDescChange(${sIdx}, ${rIdx}, this.value)" 
                           placeholder="আইটেমের বিবরণ লিখুন..." 
                           class="flex-1 bg-slate-900 border border-slate-700/60 rounded-lg px-3 py-1.5 text-xs text-white font-bold outline-none focus:border-amber-500">

                    <!-- Amount Input -->
                    <div class="w-36 sm:w-44">
                        <input type="text" 
                               value="${formatAmountWithComma(row.amount)}" 
                               oninput="window.handleNumberInput(this); window.containerActions.handleCustomSectionRowAmountChange(${sIdx}, ${rIdx}, this.value)" 
                               placeholder="০" 
                               class="w-full bg-slate-900 border border-slate-700/60 rounded-lg px-3 py-1.5 text-xs text-right font-black font-mono outline-none focus:border-amber-500 ${isPlus ? 'text-emerald-400' : 'text-red-400'}">
                    </div>

                    <!-- Delete Row Button -->
                    <button type="button" 
                            onclick="window.containerActions.removeCustomSectionRow(${sIdx}, ${rIdx})" 
                            class="w-8 h-8 rounded-lg bg-slate-900 hover:bg-red-500/20 text-slate-500 hover:text-red-400 border border-slate-800 flex items-center justify-center transition-colors cursor-pointer" 
                            title="লাইন মুছে ফেলুন">
                        <i class="fa-solid fa-trash-can text-xs"></i>
                    </button>
                </div>
            `;
        }).join('');

        return `
            <div class="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
                <div class="flex items-center justify-between border-b border-slate-800 pb-3 gap-3 flex-wrap">
                    <div class="flex items-center gap-2.5 flex-1 min-w-[240px]">
                        <span class="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-xs shrink-0">${secNoBn}</span>
                        <input type="text" 
                               value="${escapeHTML(sec.title || '')}" 
                               oninput="window.containerActions.handleCustomSectionTitleChange(${sIdx}, this.value)" 
                               placeholder="সেকশনের শিরোনাম লিখুন..." 
                               class="flex-1 bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-1.5 text-sm text-white font-black outline-none focus:border-amber-500 transition-all">
                    </div>
                    <div class="flex items-center gap-2">
                        <button type="button" 
                                onclick="window.containerActions.addCustomSectionRow(${sIdx})" 
                                class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer">
                            <i class="fa-solid fa-plus text-xs"></i>
                            <span>নতুন আইটেম যোগ</span>
                        </button>
                        <button type="button" 
                                onclick="window.containerActions.removeCustomSection(${sIdx})" 
                                class="px-2.5 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/50 border border-red-800/60 text-red-400 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer" 
                                title="সম্পূর্ণ সেকশন মুছে ফেলুন">
                            <i class="fa-solid fa-trash text-xs"></i>
                            <span class="hidden sm:inline">সেকশন ডিলিট</span>
                        </button>
                    </div>
                </div>

                <div class="space-y-2">
                    ${rowsHtml || '<div class="text-xs text-slate-500 font-bold py-2 text-center">কোনো আইটেম নেই, উপরে "নতুন আইটেম যোগ" বাটনে চাপুন</div>'}
                </div>

                <!-- Subtotal Box -->
                <div class="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between shadow-inner">
                    <span class="text-xs font-black text-slate-400">সেকশন সর্বমোট নিট ব্যালেন্স:</span>
                    <span class="text-base font-black font-mono ${isPositive ? 'text-emerald-400' : 'text-red-400'}">৳ ${formatAmountWithComma(subtotal)}</span>
                </div>
            </div>
        `;
    }).join('');
}
