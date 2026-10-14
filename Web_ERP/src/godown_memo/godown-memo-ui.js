import { GodownMemoDAO, HISTORICAL_GODOWN_BOOKS } from './godown-memo-dao.js';
import { calculateMasterTotals, formatExactBengaliCurrency, scanActiveBookProgress } from './godown-memo-calc.js';
import { printGodownMemoRegisterA4Portrait } from './godown-memo-print.js';
import { openGodownBookInspector } from './godown-memo-inspector.js';
import { openGodownMemoClosureModal } from './godown-memo-closure-modal.js';
import { fetchMemosByRange } from '../memo_search/memo-book-audit-calc.js';
import { formatAmountWithComma, formatAppDate, escapeHTML, safeRound } from '../utils.js';

let _booksUnsubscribe = null;
let _cachedBooks = [...HISTORICAL_GODOWN_BOOKS];
let _activeConfig = { activeBookSerial: 10, startMemoNo: 201, endMemoNo: 300, defaultOfficerName: 'মোঃ এমরান', defaultOfficerId: '১৯২৫' };

/**
 * Render Master Godown Memo Register UI inside container
 * @param {HTMLElement} container
 */
export async function renderGodownMemoRegisterUI(container) {
    if (!container) return;

    // 1. Immediately render cached or historical books with ZERO delay
    renderRegisterContent(container, _cachedBooks, _activeConfig);
    refreshActiveBookHud(_activeConfig);

    // 2. Fetch active book configuration in background
    try {
        const cfg = await GodownMemoDAO.getActiveBookConfig();
        if (cfg) {
            _activeConfig = cfg;
            refreshActiveBookHud(_activeConfig);
        }
    } catch (e) {
        console.warn('getActiveBookConfig error:', e);
    }

    // 3. Seed historical books if not present in Firestore (non-blocking)
    try {
        await GodownMemoDAO.seedHistoricalBooksIfEmpty();
    } catch (e) {
        console.warn('seedHistoricalBooksIfEmpty error:', e);
    }

    // 4. Listen to all books in real time
    if (_booksUnsubscribe) _booksUnsubscribe();
    _booksUnsubscribe = GodownMemoDAO.listenAllBooks((books) => {
        if (books && books.length > 0) {
            _cachedBooks = books;
            renderRegisterContent(container, _cachedBooks, _activeConfig);
        }
    });
}

/**
 * Render the actual inner content once books are loaded
 */
function renderRegisterContent(container, books, activeConfig) {
    const totals = calculateMasterTotals(books);
    const sNo = activeConfig?.startMemoNo || 201;
    const eNo = activeConfig?.endMemoNo || 300;
    const bSerial = activeConfig?.activeBookSerial || 10;

    container.innerHTML = `
        <div class="space-y-4 animate-fade-in font-bn">
            <!-- Top Toolbar Header Banner -->
            <div class="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl backdrop-blur-xl space-y-3">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                    <div class="flex items-center gap-3">
                        <div class="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600/30 to-cyan-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xl shadow-lg">
                            <i class="fa-solid fa-warehouse"></i>
                        </div>
                        <div>
                            <h1 class="text-base sm:text-lg font-black text-white flex items-center gap-2">
                                <span>গোডাউন মেমো বিক্রয় মাস্টার রেজিস্টার</span>
                                <span class="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">নথি ০০০০১</span>
                            </h1>
                            <p class="text-[11px] text-slate-400">২/১১/২০২৫ হইতে বর্তমান পর্যন্ত মেমো বইয়ের ধারাবাহিক অডিট, বিক্রয় ও সিলমোহর বহি</p>
                        </div>
                    </div>

                    <!-- Action Toolbar Buttons -->
                    <div class="flex items-center flex-wrap gap-2">
                        <button onclick="window.triggerGodownMemoClosure()" class="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer">
                            <i class="fa-solid fa-file-circle-check text-sm"></i>
                            <span>+ নতুন বই সমাপ্তি ও অটো-সংরক্ষণ</span>
                        </button>
                        <button onclick="window.triggerGodownPortraitPrint()" class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white font-bold text-xs border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer" title="১ পৃষ্ঠায় নিখুঁত A4 Portrait প্রিন্ট">
                            <i class="fa-solid fa-print text-sm"></i>
                            <span>A4 Portrait প্রিন্ট</span>
                        </button>
                        <a href="/MAA_MOTORS_Godown_Memo_Sales_Register.xlsx" download class="px-2.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-emerald-400 text-xs border border-slate-700 flex items-center gap-1 cursor-pointer" title="এক্সেল ডাউনলোড">
                            <i class="fa-solid fa-file-excel text-sm"></i>
                            <span class="hidden sm:inline">এক্সেল</span>
                        </a>
                        <a href="/MAA_MOTORS_Godown_Memo_Sales_Register.docx" download class="px-2.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-blue-400 text-xs border border-slate-700 flex items-center gap-1 cursor-pointer" title="ওয়ার্ড ডাউনলোড">
                            <i class="fa-solid fa-file-word text-sm"></i>
                            <span class="hidden sm:inline">ওয়ার্ড</span>
                        </a>
                    </div>
                </div>

                <!-- Top Exact KPI Summary Matrix -->
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
                    <div class="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
                        <div class="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                            <i class="fa-solid fa-book-bookmark text-cyan-400"></i>
                            <span>মোট সংরক্ষিত বই</span>
                        </div>
                        <div class="text-base font-black font-mono text-white">${totals.totalBooksCount} টি বই (${totals.totalMemosCount} মেমো)</div>
                        <div class="text-[10px] text-slate-500">নথি নং: ০০০০১ • গোডাউন শাখা</div>
                    </div>

                    <div class="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
                        <div class="text-[10px] font-bold text-red-400 uppercase flex items-center gap-1">
                            <i class="fa-solid fa-chart-line-up text-red-400"></i>
                            <span>সর্বমোট মোট বিক্রয় (Gross)</span>
                        </div>
                        <div class="text-base font-black font-mono text-red-400">${formatExactBengaliCurrency(totals.totalGross)}</div>
                        <div class="text-[10px] text-slate-500">মোট ডেলিভারি ও বিলের সমষ্টি</div>
                    </div>

                    <div class="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
                        <div class="text-[10px] font-bold text-purple-400 uppercase flex items-center gap-1">
                            <i class="fa-solid fa-tags text-purple-400"></i>
                            <span>সর্বমোট লেস / ছাড় (Less)</span>
                        </div>
                        <div class="text-base font-black font-mono text-purple-400">${formatExactBengaliCurrency(totals.totalLess)}</div>
                        <div class="text-[10px] text-slate-500">মেমোর বিপরীতে বিশেষ ছাড়</div>
                    </div>

                    <div class="bg-gradient-to-br from-emerald-950/40 to-slate-950 p-3 rounded-2xl border border-emerald-500/30 space-y-1">
                        <div class="text-[10px] font-bold text-emerald-400 uppercase flex items-center gap-1">
                            <i class="fa-solid fa-shield-check text-emerald-400"></i>
                            <span>সর্বমোট নিট বিক্রয় (Net)</span>
                        </div>
                        <div class="text-lg font-black font-mono text-emerald-400">${formatExactBengaliCurrency(totals.totalNet)}</div>
                        <div class="text-[10px] text-slate-300 font-bold truncate" title="${totals.netInWords}">কথায়: ${totals.netInWords}</div>
                    </div>
                </div>
            </div>

            <!-- Active Running Book Live HUD Bar -->
            <div id="godown-active-book-hud" class="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 space-y-2 shadow-lg">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div class="flex items-center gap-2">
                        <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span class="font-black text-white text-sm">চলমান বই নং ${bSerial} (#${sNo} হতে #${eNo})</span>
                        <span class="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-[10px]">সক্রিয় খাতা</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="text-slate-400 font-mono text-[11px]">লোড হচ্ছে...</span>
                        <button onclick="window.triggerGodownMemoClosure()" class="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold transition-all cursor-pointer">
                            <i class="fa-solid fa-stamp text-[10px] mr-1"></i>বই অডিট ও সমাপ্তি করুন
                        </button>
                    </div>
                </div>
                <div class="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div class="bg-gradient-to-r from-emerald-500 to-cyan-500 h-full rounded-full" style="width: 5%"></div>
                </div>
            </div>

            <!-- Master Register Table Container -->
            <div class="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-xl overflow-hidden space-y-3">
                <div class="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <div class="font-black text-white text-sm flex items-center gap-2">
                        <i class="fa-solid fa-table-list text-cyan-400"></i>
                        <span>মাস্টার বিক্রয় খাতা ও সিলমোহর রেজিস্টার</span>
                    </div>
                    <div class="text-[11px] text-slate-400">ইনচার্জ: <strong>১ম তম; মোঃ এমরান (আই ডি-১৯২৫)</strong></div>
                </div>

                <div class="overflow-x-auto custom-scrollbar">
                    <table class="w-full text-left text-xs border-collapse">
                        <thead>
                            <tr class="bg-slate-950 text-slate-400 uppercase text-[10px] font-black border-b border-slate-800">
                                <th class="py-3 px-2 text-center w-10">ক্র:</th>
                                <th class="py-3 px-2 text-center w-24">মেমো বই নং</th>
                                <th class="py-3 px-2 text-center">তারিখ রেঞ্জ</th>
                                <th class="py-3 px-2 text-center w-20">মেমো সংখ্যা</th>
                                <th class="py-3 px-2 text-center w-20">ক্রমপুঞ্জিত</th>
                                <th class="py-3 px-2 text-center w-24">মিসিং মেমো</th>
                                <th class="py-3 px-2 text-right">মোট বিক্রয়</th>
                                <th class="py-3 px-2 text-right">লেস</th>
                                <th class="py-3 px-2 text-right">নিট বিক্রয়</th>
                                <th class="py-3 px-2 text-right">ক্রমপুঞ্জিত মোট</th>
                                <th class="py-3 px-2 text-center w-32">সাক্ষর ও সিল</th>
                                <th class="py-3 px-2 text-center w-14">অ্যাকশন</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-800/60 font-bn">
                            ${renderTableRows(totals.books)}
                            <tr class="bg-slate-950/90 font-black border-t-2 border-slate-700 text-xs">
                                <td colspan="3" class="py-3 px-2 text-center text-white text-sm">সর্বমোট সমাপনী হিসাব:</td>
                                <td class="py-3 px-2 text-center font-mono font-black text-white text-xs">${totals.totalMemosCount} টি</td>
                                <td class="py-3 px-2 text-center font-mono font-black text-cyan-400 text-xs">${totals.totalMemosCount} টি</td>
                                <td class="py-3 px-2 text-center font-bn">
                                    <span class="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold">১০০% সম্পূর্ণ</span>
                                </td>
                                <td class="py-3 px-2 text-right font-mono font-black text-red-400 text-sm">৳ ${formatAmountWithComma(totals.totalGross)}</td>
                                <td class="py-3 px-2 text-right font-mono font-black text-purple-400 text-sm">৳ ${formatAmountWithComma(totals.totalLess)}</td>
                                <td class="py-3 px-2 text-right font-mono font-black text-emerald-400 text-sm">৳ ${formatAmountWithComma(totals.totalNet)}</td>
                                <td class="py-3 px-2 text-right font-mono font-black text-cyan-300 text-sm">৳ ${formatAmountWithComma(totals.grandCumulative)}</td>
                                <td class="py-3 px-2 text-center">
                                    <span class="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[9px] font-black">১০০% অডিটকৃত</span>
                                </td>
                                <td class="py-3 px-2 text-center">
                                    <button onclick="window.triggerGodownPortraitPrint()" class="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 flex items-center justify-center mx-auto cursor-pointer" title="প্রিন্ট"><i class="fa-solid fa-print text-xs"></i></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;

    // Global Action Bindings
    window.triggerGodownPortraitPrint = () => {
        printGodownMemoRegisterA4Portrait(_cachedBooks);
    };

    window.triggerGodownMemoClosure = () => {
        openGodownMemoClosureModal(_cachedBooks, _activeConfig, () => {
            renderGodownMemoRegisterUI(container);
        });
    };

    window.inspectGodownBook = (serial) => {
        const book = _cachedBooks.find(b => Number(b.bookSerial) === Number(serial));
        if (book) openGodownBookInspector(book);
    };
}

async function refreshActiveBookHud(activeConfig) {
    const hudEl = document.getElementById('godown-active-book-hud');
    if (!hudEl) return;
    const sNo = activeConfig?.startMemoNo || 201;
    const eNo = activeConfig?.endMemoNo || 300;
    const bSerial = activeConfig?.activeBookSerial || 10;

    try {
        const res = await fetchMemosByRange(sNo, eNo);
        const txns = res?.memos || [];
        const activeScan = scanActiveBookProgress(txns, sNo, eNo);

        let missingNotice = '';
        if (activeScan.missingVouchers && activeScan.missingVouchers.length > 0) {
            const previewMiss = activeScan.missingVouchers.slice(0, 4).join(', #');
            missingNotice = `
                <span class="text-amber-400 text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                    <i class="fa-solid fa-triangle-exclamation mr-1"></i>মিসিং: #${previewMiss}${activeScan.missingVouchers.length > 4 ? '...' : ''}
                </span>
            `;
        }

        hudEl.innerHTML = `
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div class="flex items-center flex-wrap gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span class="font-black text-white text-sm">চলমান বই নং ${bSerial} (#${sNo} হতে #${eNo})</span>
                    <span class="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-[10px]">১০০% ক্লাউড সিঙ্ক</span>
                    ${missingNotice}
                </div>
                <div class="flex items-center gap-2">
                    <span class="text-slate-400 font-mono text-[11px]">${activeScan.usedCount} / ${activeScan.totalExpected} টি মেমো সম্পন্ন (${activeScan.percent}%)</span>
                    <button onclick="window.triggerGodownMemoClosure()" class="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold transition-all cursor-pointer">
                        <i class="fa-solid fa-stamp text-[10px] mr-1"></i>বই অডিট ও সমাপ্তি করুন
                    </button>
                </div>
            </div>

            <!-- Progress Meter -->
            <div class="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                <div class="bg-gradient-to-r from-emerald-500 to-cyan-500 h-full rounded-full transition-all duration-500" style="width: ${activeScan.percent}%"></div>
            </div>

            <div class="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                <div>লাইভ বিক্রয়: <strong class="text-red-400 font-mono">৳ ${formatAmountWithComma(activeScan.grossSales)}</strong> • লেস: <strong class="text-purple-400 font-mono">৳ ${formatAmountWithComma(activeScan.totalLess)}</strong> • নিট: <strong class="text-emerald-400 font-mono">৳ ${formatAmountWithComma(activeScan.netSales)}</strong></div>
                <div>বাকি মেমো: <strong class="text-white font-mono">${activeScan.remainingCount} টি</strong></div>
            </div>
        `;
    } catch (e) {
        console.error('refreshActiveBookHud error:', e);
    }
}

function renderTableRows(books) {
    return books.map((b, idx) => {
        const gross = Number(b.grossSales) || 0;
        const less = Number(b.totalLess) || 0;
        const net = Number(b.calculatedNetSales || b.netSales) || 0;
        const cum = Number(b.calculatedCumulative || b.cumulativeNetSales) || 0;
        const sDate = b.startDate ? formatAppDate(b.startDate) : '';
        const eDate = b.endDate ? formatAppDate(b.endDate) : '';
        const dateStr = sDate && eDate ? `${sDate} হতে ${eDate}` : (eDate || sDate || '-');
        const officerName = escapeHTML(b.inChargeName || 'মোঃ এমরান');
        const officerId = escapeHTML(b.inChargeId || '১৯২৫');
        const stampDate = b.stampDate ? formatAppDate(b.stampDate) : eDate;

        const missingBadge = b.missingMemosList && b.missingMemosList.length > 0
            ? `<span class="px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 text-[9px] font-bold font-mono">${escapeHTML(b.missingMemoDisplay)}</span>`
            : `<span class="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold">নেই (১০০%)</span>`;

        return `
            <tr class="hover:bg-white/[0.02] transition-colors">
                <td class="py-3 px-2 text-center text-slate-500 font-mono font-bold">${idx + 1}</td>
                <td class="py-3 px-2 text-center font-mono font-black text-cyan-400 text-xs">
                    #${escapeHTML(b.bookNo)}
                    ${b.isHistorical ? '<span class="block text-[8px] text-amber-400/80 font-normal">হস্তলিখিত খাতা</span>' : '<span class="block text-[8px] text-emerald-400/80 font-normal">অনলাইন খাতা</span>'}
                </td>
                <td class="py-3 px-2 text-center text-slate-300 font-mono text-[11px] whitespace-nowrap">${dateStr}</td>
                <td class="py-3 px-2 text-center font-mono font-bold text-slate-200 text-xs">${b.bookMemos} টি</td>
                <td class="py-3 px-2 text-center font-mono font-black text-cyan-400 text-xs">${b.calculatedCumulativeMemos} টি</td>
                <td class="py-3 px-2 text-center font-bn">${missingBadge}</td>
                <td class="py-3 px-2 text-right font-mono font-black text-red-400">৳ ${formatAmountWithComma(gross)}</td>
                <td class="py-3 px-2 text-right font-mono font-black text-purple-400">${less > 0 ? '৳ ' + formatAmountWithComma(less) : '-'}</td>
                <td class="py-3 px-2 text-right font-mono font-black text-emerald-400">৳ ${formatAmountWithComma(net)}</td>
                <td class="py-3 px-2 text-right font-mono font-black text-slate-200 bg-slate-950/40">৳ ${formatAmountWithComma(cum)}</td>
                <td class="py-2.5 px-2 text-center">
                    <div class="w-24 h-8 mx-auto rounded border border-dashed border-slate-700 bg-slate-950/40 flex items-center justify-center text-[9px] text-slate-500 font-bn" title="প্রিন্ট করার পর অফলাইনে সিলমোহর দেওয়া হবে">
                        <span class="opacity-40">সিলমোহর</span>
                    </div>
                </td>
                <td class="py-3 px-2 text-center">
                    <button onclick="window.inspectGodownBook(${b.bookSerial})" class="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-white flex items-center justify-center mx-auto transition-all cursor-pointer" title="বিস্তারিত অডিট ডেক">
                        <i class="fa-solid fa-eye text-xs"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}
