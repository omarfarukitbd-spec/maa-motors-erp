import { PayrollDAO } from './payroll-dao.js';
import { calculatePayrollSummary, formatTaka } from './payroll-calc.js';
import {
    getActivePayrollState, setActivePayrollState, setPayrollStateChangeListener,
    handleAmountInput, handleTextInput, toggleItemStatus, setAllItemsStatus,
    setSectionItemsStatus, resetToDefaultTemplate, updatePaymentAccount,
    addNewRow, deleteRow, openSalaryBreakdownModal, updateAedRate, savePayrollToCloud
} from './payroll-actions.js';
import { syncPayrollToDailyExpenses } from './payroll-sync.js';
import { printEmployeePaySlip } from './payroll-payslip.js';
import { printPayrollMasterReport } from './payroll-print.js';
import { exportPayrollToExcel } from './payroll-excel.js';
import { formatAmountWithComma, escapeHTML, showToast } from '../utils.js';

let _container = null;
let _currentFilter = 'all'; // 'all' | 'salary' | 'expense' | 'pending'
let _searchQuery = '';

/**
 * Render Payroll & Monthly Expense Master UI
 * @param {HTMLElement} container
 * @param {Object} params
 */
export async function renderPayroll(container, params = {}) {
    if (!container) return;
    _container = container;

    const currentMonth = params.month || '2026-10';
    let data = null;

    try {
        data = await PayrollDAO.getPayrollByMonth(currentMonth);
    } catch (e) {
        console.warn('Fetch payroll error, using default template:', e);
    }

    if (!data) {
        data = PayrollDAO.getDefaultTemplate(currentMonth);
    }

    setActivePayrollState(data);
    setPayrollStateChangeListener((state, needFullRerender) => {
        if (needFullRerender) {
            renderPayrollContent(_container, state);
        }
    });

    renderPayrollContent(_container, data);
}

/**
 * Render the inner DOM structure
 */
function renderPayrollContent(container, state) {
    const summary = calculatePayrollSummary(state.sections, state.aedRate);

    container.innerHTML = `
        <div class="space-y-4 animate-fade-in font-bn">
            <!-- Top Header Banner -->
            <div class="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl backdrop-blur-xl space-y-4">
                <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                    <div class="flex items-center gap-3">
                        <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600/30 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-2xl shadow-lg">
                            <i class="fa-solid fa-users-gear"></i>
                        </div>
                        <div>
                            <h1 class="text-base sm:text-lg font-black text-white flex items-center gap-2">
                                <span>মাসিক সামগ্রিক ব্যয় ও বেতন বিবরণী</span>
                                <span class="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">এডিটেবল মাস্টার</span>
                            </h1>
                            <p class="text-[11px] text-slate-400">কর্মী বেতন, বোনাস, ঋণ কর্তন, ইউটিলিটি ও লভ্যাংশের লাইভ রেজিস্টার</p>
                        </div>
                    </div>

                    <!-- Top Action Buttons -->
                    <div class="flex items-center flex-wrap gap-2">
                        <button onclick="window.savePayrollCloud()" class="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer" title="ক্লাউড ডাটাবেজে সংরক্ষণ করুন">
                            <i class="fa-solid fa-cloud-arrow-up text-sm"></i>
                            <span>ক্লাউডে সেভ</span>
                        </button>
                        <button onclick="window.syncPayrollToExpenses()" class="px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer" title="পরিশোধিত আইটেমগুলো দৈনিক খরচে যুক্ত করুন">
                            <i class="fa-solid fa-receipt text-sm"></i>
                            <span>দৈনিক খরচে পোস্টিং</span>
                        </button>
                        <button onclick="window.printPayrollMaster()" class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white font-bold text-xs border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer" title="অফিশিয়াল A4 Portrait প্রিন্ট">
                            <i class="fa-solid fa-print text-sm"></i>
                            <span>A4 প্রিন্ট</span>
                        </button>
                        <button onclick="window.exportPayrollXlsx()" class="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-emerald-400 text-xs border border-slate-700 flex items-center gap-1 cursor-pointer" title="এক্সেল ডাউনলোড">
                            <i class="fa-solid fa-file-excel text-sm"></i>
                            <span class="hidden sm:inline">এক্সেল</span>
                        </button>
                    </div>
                </div>

                <!-- 4 KPI Cards Matrix -->
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
                    <div class="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
                        <div class="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                            <i class="fa-solid fa-calculator text-blue-400"></i>
                            <span>সর্বমোট প্রদেয় বাজেট</span>
                        </div>
                        <div id="kpi-grand-total" class="text-base sm:text-lg font-black text-blue-400">${formatTaka(summary.grandTotal)}</div>
                        <div class="text-[10px] text-slate-500">সকল শাখার মোট ব্যয় বরাদ্দ</div>
                    </div>

                    <div class="bg-slate-950 p-3 rounded-2xl border border-emerald-500/30 space-y-1">
                        <div class="text-[10px] font-bold text-emerald-400 uppercase flex items-center gap-1">
                            <i class="fa-solid fa-circle-check text-emerald-400"></i>
                            <span>পরিশোধিত (Paid)</span>
                        </div>
                        <div id="kpi-total-paid" class="text-base sm:text-lg font-black text-emerald-400">${formatTaka(summary.totalPaid)}</div>
                        <div class="text-[10px] text-slate-400">${summary.paidCount} টি আইটেম ক্লিয়ার্ড</div>
                    </div>

                    <div class="bg-slate-950 p-3 rounded-2xl border border-red-500/30 space-y-1">
                        <div class="text-[10px] font-bold text-red-400 uppercase flex items-center gap-1">
                            <i class="fa-solid fa-clock-rotate-left text-red-400"></i>
                            <span>অবশিষ্ট বকেয়া (Pending)</span>
                        </div>
                        <div id="kpi-total-pending" class="text-base sm:text-lg font-black text-red-400">${formatTaka(summary.totalPending)}</div>
                        <div class="text-[10px] text-slate-400">${summary.pendingCount} টি আইটেম বাকি</div>
                    </div>

                    <div class="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
                        <div class="text-[10px] font-bold text-cyan-400 uppercase flex items-center gap-1">
                            <i class="fa-solid fa-list-check text-cyan-400"></i>
                            <span>মোট কর্মী ও খাত</span>
                        </div>
                        <div id="kpi-items-count" class="text-base sm:text-lg font-black text-white">${summary.totalItemsCount} টি এন্ট্রি</div>
                        <div class="text-[10px] text-slate-500">বেতন: ${formatTaka(summary.totalSalaries)}</div>
                    </div>
                </div>

                <!-- Controls Bar: Month Picker, AED Rate, Bulk Status & Search -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                    <div class="flex items-center flex-wrap gap-2">
                        <div class="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5">
                            <i class="fa-regular fa-calendar text-cyan-400 text-xs"></i>
                            <select id="payroll-month-select" onchange="window.switchPayrollMonth(this.value)" class="bg-slate-900 text-white font-black text-xs outline-none cursor-pointer rounded-lg px-1 py-0.5">
                                ${renderMonthOptions(state.monthYear)}
                            </select>
                        </div>

                        <div class="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs">
                            <span class="text-slate-400">AED রেট: ৳</span>
                            <input type="number" value="${state.aedRate || 35}" onchange="window.handleAedRateChange(this.value)" class="w-12 bg-transparent text-cyan-300 font-bold outline-none text-center" title="দুবাই দিনার বিনিময় হার" />
                        </div>

                        <!-- Bulk Status Actions -->
                        <div class="flex items-center gap-1.5 pl-1">
                            <button onclick="window.payrollActions.setAllItemsStatus('pending')" class="px-2.5 py-1.5 rounded-xl bg-red-600/15 hover:bg-red-600/25 text-red-400 border border-red-500/30 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer" title="সকল আইটেম বকেয়া করুন">
                                <i class="fa-solid fa-clock-rotate-left text-[11px]"></i>
                                <span>সব বকেয়া</span>
                            </button>
                            <button onclick="window.payrollActions.setAllItemsStatus('paid')" class="px-2.5 py-1.5 rounded-xl bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer" title="সকল আইটেম পরিশোধিত করুন">
                                <i class="fa-solid fa-check-double text-[11px]"></i>
                                <span>সব পেইড</span>
                            </button>
                            <button onclick="window.payrollActions.resetToDefaultTemplate()" class="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer" title="ডিফল্ট টেমপ্লেট রিসেট">
                                <i class="fa-solid fa-rotate-left text-[11px]"></i>
                                <span>রিসেট</span>
                            </button>
                        </div>
                    </div>

                    <!-- Search Input -->
                    <div class="relative w-full sm:w-64">
                        <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs"></i>
                        <input type="text" id="payroll-search" oninput="window.handlePayrollSearch(this.value)" placeholder="কর্মী বা খাতের নাম খুঁজুন..." class="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white outline-none focus:border-cyan-500 transition-all shadow-inner" />
                    </div>
                </div>
            </div>

            <!-- Words Banner -->
            <div class="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-md">
                <div class="text-xs">
                    <span class="text-slate-400">কথায় (সর্বমোট প্রদেয় বাজেট):</span>
                    <strong id="payroll-words-display" class="text-emerald-400 text-sm ml-1">${summary.grandTotalInWords}</strong>
                </div>
                <div class="text-[10px] text-slate-500 font-bold">নথি নং: ০০০০১ • মেসার্স মা মোটরস</div>
            </div>

            <!-- Sections Container -->
            <div id="payroll-sections-container" class="space-y-4">
                ${renderSectionsHtml(summary.sections)}
            </div>

            <!-- Bottom Master Actions & Cloud Save Bar -->
            <div class="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-4 mt-6">
                <div class="space-y-1 text-center md:text-left">
                    <div class="text-xs text-slate-400 font-bold flex items-center justify-center md:justify-start gap-1.5">
                        <i class="fa-solid fa-cloud-arrow-up text-cyan-400"></i>
                        <span>মাসিক সামগ্রিক ব্যালেন্স ও ক্লাউড সিঙ্ক্রোনাইজেশন</span>
                    </div>
                    <div class="text-xs text-slate-300">
                        মোট বাজেট: <strong id="bottom-kpi-grand" class="text-blue-400 font-black">${formatTaka(summary.grandTotal)}</strong> • 
                        পরিশোধিত: <strong id="bottom-kpi-paid" class="text-emerald-400 font-black">${formatTaka(summary.totalPaid)}</strong> • 
                        বকেয়া: <strong id="bottom-kpi-pending" class="text-red-400 font-black">${formatTaka(summary.totalPending)}</strong>
                    </div>
                </div>

                <div class="flex items-center flex-wrap justify-center gap-2.5">
                    <button onclick="window.savePayrollCloud()" class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-emerald-600/30 flex items-center gap-2 transition-all active:scale-95 cursor-pointer" title="ক্লাউড ডাটাবেজে সংরক্ষণ করুন">
                        <i class="fa-solid fa-cloud-arrow-up text-base"></i>
                        <span>ক্লাউডে সেভ করুন</span>
                    </button>
                    <button onclick="window.syncPayrollToExpenses()" class="px-4 py-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer" title="পরিশোধিত আইটেমগুলো দৈনিক খরচে যুক্ত করুন">
                        <i class="fa-solid fa-receipt text-sm"></i>
                        <span>দৈনিক খরচে পোস্টিং</span>
                    </button>
                    <button onclick="window.printPayrollMaster()" class="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white font-bold text-xs border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer" title="অফিশিয়াল A4 Portrait প্রিন্ট">
                        <i class="fa-solid fa-print text-sm"></i>
                        <span>A4 প্রিন্ট</span>
                    </button>
                    <button onclick="window.exportPayrollXlsx()" class="px-3.5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-emerald-400 text-xs border border-slate-700 flex items-center gap-1 cursor-pointer" title="এক্সেল ডাউনলোড">
                        <i class="fa-solid fa-file-excel text-sm"></i>
                        <span>এক্সেল</span>
                    </button>
                </div>
            </div>
        </div>
    `;
}

/**
 * Generate 2025-2027 Bangla Month Options dynamically
 */
function renderMonthOptions(selectedMonth) {
    const monthsBn = [
        'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
        'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
    ];
    const years = [2025, 2026, 2027];
    let html = '';
    years.forEach(y => {
        monthsBn.forEach((mName, idx) => {
            const mVal = `${y}-${String(idx + 1).padStart(2, '0')}`;
            const isSel = mVal === selectedMonth ? 'selected' : '';
            html += `<option class="bg-slate-900 text-white py-1" value="${mVal}" ${isSel}>${mName} ${y}</option>`;
        });
    });
    return html;
}

/**
 * Render all 6 sections HTML
 */
function renderSectionsHtml(sections) {
    return sections.map(sec => {
        const filteredItems = (sec.items || []).filter(itm => {
            if (!_searchQuery) return true;
            const q = _searchQuery.toLowerCase().trim();
            const nameMatch = itm.name && itm.name.toLowerCase().includes(q);
            const detailsMatch = itm.details && itm.details.toLowerCase().includes(q);
            const accountMatch = itm.paymentAccount && itm.paymentAccount.toLowerCase().includes(q);
            const statusMatch = (q === 'paid' || q === 'পরিশোধিত')
                ? itm.status === 'paid'
                : (q === 'বকেয়া' || q === 'pending')
                    ? itm.status === 'pending'
                    : false;
            return nameMatch || detailsMatch || accountMatch || statusMatch;
        });

        const rowsHtml = filteredItems.map((itm, idx) => {
            const isPaid = itm.status === 'paid';
            const statusBadgeClass = isPaid
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/25'
                : 'bg-red-500/15 text-red-400 border-red-500/40 hover:bg-red-500/25';
            const statusLabel = isPaid
                ? '<i class="fa-solid fa-circle-check text-[10px]"></i><span>পরিশোধিত</span>'
                : '<i class="fa-solid fa-clock text-[10px]"></i><span>বকেয়া</span>';

            const amountColorClass = isPaid
                ? 'text-emerald-400 border-emerald-500/40 bg-emerald-950/20 focus:border-emerald-400'
                : 'text-red-400 border-red-500/40 bg-red-950/20 focus:border-red-400';
            const currencyColor = isPaid ? 'text-emerald-400' : 'text-red-400';

            return `
                <tr class="${isPaid ? 'hover:bg-emerald-500/[0.04]' : 'hover:bg-red-500/[0.04]'} transition-colors border-b border-slate-800/60">
                    <td class="py-2.5 px-3 text-center text-slate-500 font-mono font-bold text-xs">${itm.sl || (idx + 1)}</td>
                    <td class="py-2.5 px-3">
                        <input type="text" value="${escapeHTML(itm.name || '')}" onchange="window.payrollActions.handleTextInput('${sec.id}', '${itm.id}', 'name', this.value)" class="w-full bg-slate-950/40 border border-slate-800/80 hover:border-slate-700/80 focus:border-cyan-500 focus:bg-slate-900 text-white font-bold text-xs rounded-xl px-2.5 py-1.5 outline-none transition-all shadow-inner" />
                    </td>
                    <td class="py-2.5 px-3">
                        <input type="text" value="${escapeHTML(itm.details || '')}" onchange="window.payrollActions.handleTextInput('${sec.id}', '${itm.id}', 'details', this.value)" class="w-full bg-slate-950/40 border border-slate-800/80 hover:border-slate-700/80 focus:border-cyan-500 focus:bg-slate-900 text-slate-300 text-xs rounded-xl px-2.5 py-1.5 outline-none transition-all shadow-inner" />
                    </td>
                    <td class="py-2.5 px-3 text-center">
                        <select onchange="window.payrollActions.updatePaymentAccount('${sec.id}', '${itm.id}', this.value)" class="bg-slate-900 border border-slate-800/80 hover:border-slate-700/80 focus:border-cyan-500 text-slate-200 text-xs rounded-xl px-2.5 py-1.5 font-bold outline-none cursor-pointer transition-all">
                            <option class="bg-slate-900 text-white py-1" value="শোরুম ক্যাশ" ${itm.paymentAccount === 'শোরুম ক্যাশ' ? 'selected' : ''}>শোরুম ক্যাশ</option>
                            <option class="bg-slate-900 text-white py-1" value="ইসলামী ব্যাংক" ${itm.paymentAccount === 'ইসলামী ব্যাংক' ? 'selected' : ''}>ইসলামী ব্যাংক</option>
                            <option class="bg-slate-900 text-white py-1" value="আল-আরাফাহ ব্যাংক" ${itm.paymentAccount === 'আল-আরাফাহ ব্যাংক' ? 'selected' : ''}>আল-আরাফাহ</option>
                            <option class="bg-slate-900 text-white py-1" value="পূবালী ব্যাংক" ${itm.paymentAccount === 'পূবালী ব্যাংক' ? 'selected' : ''}>পূবালী ব্যাংক</option>
                            <option class="bg-slate-900 text-white py-1" value="দুবাই ক্যাশ" ${itm.paymentAccount === 'দুবাই ক্যাশ' ? 'selected' : ''}>দুবাই ক্যাশ (AED)</option>
                        </select>
                    </td>
                    <td class="py-2.5 px-3 text-center">
                        <button onclick="window.payrollActions.toggleItemStatus('${sec.id}', '${itm.id}')" class="px-2.5 py-1 rounded-full border text-[11px] font-black cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-1 mx-auto ${statusBadgeClass}" title="ক্লিক করে স্ট্যাটাস পরিবর্তন করুন">
                            ${statusLabel}
                        </button>
                    </td>
                    <td class="py-2.5 px-3 text-right">
                        <div class="flex items-center justify-end gap-1.5">
                            <span class="${currencyColor} font-black text-xs">৳</span>
                            <input type="text" value="${formatAmountWithComma(itm.amount)}" oninput="window.handleNumberInput(this); window.payrollActions.handleAmountInput(this, '${sec.id}', '${itm.id}')" class="w-28 border font-black text-xs text-right outline-none rounded-xl px-2.5 py-1.5 shadow-inner transition-all ${amountColorClass}" />
                        </div>
                    </td>
                    <td class="py-2.5 px-3 text-center whitespace-nowrap">
                        <div class="flex items-center justify-center gap-1">
                            ${itm.type === 'salary' ? `
                                <button onclick="window.payrollActions.openSalaryBreakdownModal('${sec.id}', '${itm.id}')" class="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 flex items-center justify-center transition-all cursor-pointer" title="বেতন ব্রেকডাউন ও ঋণ কর্তন">
                                    <i class="fa-solid fa-calculator text-[10px]"></i>
                                </button>
                                <button onclick="window.payrollActions.printEmployeePaySlip('${sec.id}', '${itm.id}')" class="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 flex items-center justify-center transition-all cursor-pointer" title="স্যালারি স্লিপ প্রিন্ট">
                                    <i class="fa-solid fa-receipt text-[10px]"></i>
                                </button>
                            ` : ''}
                            <button onclick="window.payrollActions.deleteRow('${sec.id}', '${itm.id}')" class="w-6 h-6 rounded bg-slate-800 hover:bg-red-900/40 text-slate-500 hover:text-red-400 flex items-center justify-center transition-all cursor-pointer" title="মুছে ফেলুন">
                                <i class="fa-solid fa-trash-can text-[10px]"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        return `
            <div class="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-xl overflow-hidden space-y-3">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                    <div class="font-black text-white text-sm flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full bg-cyan-400"></span>
                        <span>${escapeHTML(sec.title)}</span>
                    </div>
                    <div class="flex items-center flex-wrap gap-2">
                        <div class="text-xs text-slate-300">
                            উপ-মোট: <strong id="subtotal-${sec.id}" class="text-cyan-400 font-black">৳ ${formatAmountWithComma(sec.subTotal)}</strong>
                        </div>
                        <div class="flex items-center gap-1 ml-2">
                            <button onclick="window.payrollActions.setSectionItemsStatus('${sec.id}', 'paid')" class="px-2 py-0.5 rounded-lg bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold transition-all cursor-pointer" title="এই শাখার সব আইটেম পরিশোধিত করুন">সব পেইড</button>
                            <button onclick="window.payrollActions.setSectionItemsStatus('${sec.id}', 'pending')" class="px-2 py-0.5 rounded-lg bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/30 text-[10px] font-bold transition-all cursor-pointer" title="এই শাখার সব আইটেম বকেয়া করুন">সব বকেয়া</button>
                        </div>
                        <button onclick="window.payrollActions.addNewRow('${sec.id}')" class="px-2.5 py-1 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1">
                            <i class="fa-solid fa-plus text-[10px]"></i>
                            <span>নতুন সারি</span>
                        </button>
                    </div>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-slate-950/80 text-slate-400 font-bold text-[11px] uppercase border-b border-slate-800">
                                <th class="py-2.5 px-3 text-center w-10">ক্র:</th>
                                <th class="py-2.5 px-3 w-48">নাম / কর্মী</th>
                                <th class="py-2.5 px-3">বিবরণ ও বিবরণী নোট</th>
                                <th class="py-2.5 px-3 text-center w-36">পেমেন্ট সোর্স ফান্ড</th>
                                <th class="py-2.5 px-3 text-center w-28">স্ট্যাটাস</th>
                                <th class="py-2.5 px-3 text-right w-36">পরিমাণ (টাকা)</th>
                                <th class="py-2.5 px-3 text-center w-20">অ্যাকশন</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rowsHtml}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }).join('');
}

// Global Bindings for HTML Event Handlers
window.payrollActions = {
    handleAmountInput,
    handleTextInput,
    toggleItemStatus,
    setAllItemsStatus,
    setSectionItemsStatus,
    resetToDefaultTemplate,
    updatePaymentAccount,
    addNewRow,
    deleteRow,
    openSalaryBreakdownModal,
    printEmployeePaySlip
};

window.savePayrollCloud = savePayrollToCloud;
window.syncPayrollToExpenses = syncPayrollToDailyExpenses;
window.printPayrollMaster = () => printPayrollMasterReport(getActivePayrollState());
window.exportPayrollXlsx = () => exportPayrollToExcel(getActivePayrollState());
window.handleAedRateChange = (r) => updateAedRate(r);
window.switchPayrollMonth = async (m) => {
    if (_container) await renderPayroll(_container, { month: m });
};
window.handlePayrollSearch = (q) => {
    _searchQuery = q || '';
    const state = getActivePayrollState();
    if (state && _container) {
        const summary = calculatePayrollSummary(state.sections, state.aedRate);
        const secCont = document.getElementById('payroll-sections-container');
        if (secCont) secCont.innerHTML = renderSectionsHtml(summary.sections);
    }
};
