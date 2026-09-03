import { TransactionDAO, CustomerDAO } from '../dao.js';
import { safeRound, formatAmountWithComma, formatAppDate, escapeHTML, toDBDate } from '../utils.js';
import { exportClosingExcel as exportExcelFn, printClosingReport as printReportFn } from './financial-summary-closing-print.js';

/**
 * World-Class Point-in-Time (As-Of Date) Closing Balance Engine
 * Calculates exact historical customer balances and total market due as of any target date.
 */

let currentClosingData = null;

export async function calculateClosingBalances(cutoffDateStr) {
    const cutoffDate = toDBDate(cutoffDateStr);
    if (!cutoffDate) return null;

    const [customers, txnSnap] = await Promise.all([
        CustomerDAO.getAll('name', 'asc'),
        TransactionDAO.collection.where('date', '<=', cutoffDate).get()
    ]);

    const txnMap = {};
    const openingMap = {};

    txnSnap.forEach(doc => {
        const t = doc.data();
        if (!t.customerId) return;
        const v = String(t.voucherNo || '').trim().toUpperCase();
        const isOp = (v === 'OPENING' || v === 'OPEN' || v === 'প্রারম্ভিক ব্যালেন্স' || v === 'প্রারম্ভিক জের');

        if (isOp) {
            openingMap[t.customerId] = safeRound((Number(t.bill) || 0) - (Number(t.paid) || 0));
        } else {
            if (!txnMap[t.customerId]) txnMap[t.customerId] = { totalBill: 0, totalPaid: 0 };
            txnMap[t.customerId].totalBill = safeRound(txnMap[t.customerId].totalBill + (Number(t.bill) || 0));
            txnMap[t.customerId].totalPaid = safeRound(txnMap[t.customerId].totalPaid + (Number(t.paid) || 0));
        }
    });

    let totalMarketDue = 0;
    let totalAdvance = 0;
    let dueCustomerCount = 0;

    const closingCustomers = customers.map(c => {
        let initial = Number(c.initialDue || 0);
        if (initial === 0 && openingMap[c.id] !== undefined) {
            initial = openingMap[c.id];
        }
        const tData = txnMap[c.id] || { totalBill: 0, totalPaid: 0 };
        const closingDue = safeRound(initial + tData.totalBill - tData.totalPaid);

        if (closingDue > 0) {
            totalMarketDue = safeRound(totalMarketDue + closingDue);
            dueCustomerCount++;
        } else if (closingDue < 0) {
            totalAdvance = safeRound(totalAdvance + Math.abs(closingDue));
        }

        return {
            id: c.id,
            accountNo: c.accountNo || '',
            name: c.name || 'Unknown',
            phone: c.phone || '',
            zone: c.zone || '',
            address: c.address || '',
            initialDue: initial,
            totalBill: tData.totalBill,
            totalPaid: tData.totalPaid,
            closingDue,
            status: closingDue > 0 ? 'due' : (closingDue < 0 ? 'advance' : 'zero')
        };
    });

    // Default sort: Account No / Serial strictly matching Customer section
    closingCustomers.sort((a, b) => (a.accountNo || '').localeCompare(b.accountNo || '', undefined, { numeric: true }));

    currentClosingData = {
        cutoffDate,
        customers: closingCustomers,
        totalMarketDue,
        totalAdvance,
        dueCustomerCount,
        totalCustomers: closingCustomers.length
    };

    return currentClosingData;
}

export function renderClosingBalanceView(containerId, closingData) {
    const container = document.getElementById(containerId);
    if (!container || !closingData) return;

    const formattedDate = formatAppDate(closingData.cutoffDate);
    const zones = Array.from(new Set(closingData.customers.map(c => c.zone).filter(Boolean))).sort();

    container.innerHTML = `
        <div class="space-y-4 font-bn">
            <!-- Header & Action Bar -->
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-3.5 bg-slate-950/70 border border-slate-800 rounded-2xl">
                <div>
                    <div class="text-xs text-indigo-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <i class="fa-solid fa-calendar-check"></i>
                        <span>কাট-অফ তারিখ: <strong class="text-white font-mono">${formattedDate}</strong></span>
                    </div>
                    <h3 class="text-base font-black text-white mt-0.5">কাস্টমার সমাপনী বকেয়া বিবরণী (Closing Balances)</h3>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="window.fsPrintClosingReport()" class="px-3.5 py-1.5 bg-indigo-600/90 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5 cursor-pointer">
                        <i class="fa-solid fa-print"></i><span>প্রিন্ট / PDF</span>
                    </button>
                    <button onclick="window.fsExportClosingExcel()" class="px-3.5 py-1.5 bg-emerald-600/90 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center gap-1.5 cursor-pointer">
                        <i class="fa-solid fa-file-excel"></i><span>এক্সেল ডাউনলোড</span>
                    </button>
                </div>
            </div>

            <!-- KPI Summary Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div class="p-3 bg-rose-950/20 border border-rose-500/30 rounded-2xl">
                    <div class="text-[10px] text-rose-400 font-bold uppercase tracking-wider">ওই তারিখ পর্যন্ত মোট বকেয়া</div>
                    <div class="text-xl font-black text-rose-400 font-mono mt-0.5">৳ ${formatAmountWithComma(closingData.totalMarketDue)}</div>
                    <div class="text-[10px] text-slate-400 mt-0.5">বকেয়াদার কাস্টমার: <strong class="text-white">${closingData.dueCustomerCount} জন</strong></div>
                </div>
                <div class="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-2xl">
                    <div class="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">মোট অ্যাডভান্স জমা</div>
                    <div class="text-xl font-black text-emerald-400 font-mono mt-0.5">৳ ${formatAmountWithComma(closingData.totalAdvance)}</div>
                    <div class="text-[10px] text-slate-400 mt-0.5">অগ্রিম প্রদানকারী খদ্দের তহবিল</div>
                </div>
                <div class="p-3 bg-indigo-950/20 border border-indigo-500/30 rounded-2xl">
                    <div class="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">মোট অডিটকৃত কাস্টমার</div>
                    <div class="text-xl font-black text-white font-mono mt-0.5">${closingData.totalCustomers} জন</div>
                    <div class="text-[10px] text-slate-400 mt-0.5">${formattedDate} তারিখ পর্যন্ত কার্যকর</div>
                </div>
            </div>

            <!-- Filters Bar -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                <input type="text" id="fs-closing-search" oninput="window.fsFilterClosingRows()" placeholder="খুঁজুন (নাম, ফোন, A/C নং)..." class="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-indigo-500">
                <select id="fs-closing-zone" onchange="window.fsFilterClosingRows()" class="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-indigo-500 font-bold">
                    <option value="">সকল জোন (${zones.length} টি)</option>
                    ${zones.map(z => `<option value="${escapeHTML(z)}">${escapeHTML(z)}</option>`).join('')}
                </select>
                <select id="fs-closing-status" onchange="window.fsFilterClosingRows()" class="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-indigo-500 font-bold">
                    <option value="all">সকল ব্যালেন্স স্ট্যাটাস</option>
                    <option value="due">শুধুমাত্র বকেয়া আছে এমন (> ০)</option>
                    <option value="zero">ব্যালেন্স শূন্য (০.০০)</option>
                    <option value="advance">অ্যাডভান্স জমা (< ০)</option>
                </select>
                <select id="fs-closing-sort" onchange="window.fsFilterClosingRows()" class="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-indigo-500 font-bold">
                    <option value="acc_asc">সিরিয়াল: A/C নং (১, ২, ৩...)</option>
                    <option value="due_desc">সিরিয়াল: বকেয়া অনুযায়ী (সর্বোচ্চ)</option>
                    <option value="name_asc">সিরিয়াল: নাম অনুযায়ী (A-Z)</option>
                </select>
            </div>

            <!-- Table Container -->
            <div class="overflow-x-auto custom-scrollbar rounded-2xl border border-slate-800/80">
                <table class="w-full text-left text-xs border-collapse min-w-[720px]">
                    <thead>
                        <tr class="bg-slate-950 text-slate-400 font-bold border-b border-slate-800 uppercase tracking-wider text-[10.5px]">
                            <th class="py-2.5 px-3 text-center w-12">#</th>
                            <th class="py-2.5 px-3 text-center">A/C</th>
                            <th class="py-2.5 px-3">কাস্টমার ও মোবাইল</th>
                            <th class="py-2.5 px-3">জোন</th>
                            <th class="py-2.5 px-3 text-right text-slate-400">মোট বিল (৳)</th>
                            <th class="py-2.5 px-3 text-right text-emerald-400">মোট জমা (৳)</th>
                            <th class="py-2.5 px-3 text-right">সমাপনী বকেয়া (৳)</th>
                            <th class="py-2.5 px-3 text-center w-20">খতিয়ান</th>
                        </tr>
                    </thead>
                    <tbody id="fs-closing-tbody" class="divide-y divide-slate-800/50"></tbody>
                </table>
            </div>
            <div id="fs-closing-count-text" class="text-[11px] text-slate-400 font-bold text-right"></div>
        </div>
    `;

    renderClosingTableRows();
}

export function renderClosingTableRows() {
    const tbody = document.getElementById('fs-closing-tbody');
    const countEl = document.getElementById('fs-closing-count-text');
    if (!tbody || !currentClosingData) return;

    const q = (document.getElementById('fs-closing-search')?.value || '').toLowerCase().trim();
    const zone = document.getElementById('fs-closing-zone')?.value || '';
    const status = document.getElementById('fs-closing-status')?.value || 'all';
    const sort = document.getElementById('fs-closing-sort')?.value || 'acc_asc';

    const filtered = currentClosingData.customers.filter(c => {
        if (q && !c.name.toLowerCase().includes(q) && !c.phone.includes(q) && !c.accountNo.toLowerCase().includes(q)) return false;
        if (zone && c.zone !== zone) return false;
        if (status !== 'all' && c.status !== status) return false;
        return true;
    });

    filtered.sort((a, b) => {
        if (sort === 'due_desc') return b.closingDue - a.closingDue;
        if (sort === 'name_asc') return (a.name || '').localeCompare(b.name || '');
        return (a.accountNo || '').localeCompare(b.accountNo || '', undefined, { numeric: true });
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center py-8 text-slate-500 font-bold italic">কোনো কাস্টমার পাওয়া যায়নি</td></tr>`;
        if (countEl) countEl.innerText = `০ জন প্রদর্শিত`;
        return;
    }

    let subtotalDue = 0;
    const html = filtered.map((c, i) => {
        if (c.closingDue > 0) subtotalDue = safeRound(subtotalDue + c.closingDue);
        const dueColor = c.closingDue > 0 ? 'text-red-400' : (c.closingDue < 0 ? 'text-emerald-400' : 'text-slate-400');
        const dueLabel = c.closingDue < 0 ? ' (অ্যাড)' : '';

        return `
            <tr class="hover:bg-slate-900/60 transition-colors">
                <td class="py-2.5 px-3 text-center text-slate-500 font-mono font-bold">${i + 1}</td>
                <td class="py-2.5 px-3 text-center text-indigo-400 font-mono font-bold">[${escapeHTML(c.accountNo || '-')}]</td>
                <td class="py-2.5 px-3 font-bold text-white">
                    <div>${escapeHTML(c.name)}</div>
                    <div class="text-[10px] text-slate-400 font-mono font-normal">${escapeHTML(c.phone || '-')}</div>
                </td>
                <td class="py-2.5 px-3 text-slate-300 font-bold">${escapeHTML(c.zone || '-')}</td>
                <td class="py-2.5 px-3 text-right font-mono font-bold text-slate-300">৳ ${formatAmountWithComma(c.totalBill)}</td>
                <td class="py-2.5 px-3 text-right font-mono font-bold text-emerald-400">৳ ${formatAmountWithComma(c.totalPaid)}</td>
                <td class="py-2.5 px-3 text-right font-mono font-black ${dueColor} text-sm">৳ ${formatAmountWithComma(Math.abs(c.closingDue))}${dueLabel}</td>
                <td class="py-2.5 px-3 text-center">
                    <button onclick="window.navigate('ledger', { customerId: '${c.id}' })" class="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-blue-400 text-[10px] font-bold rounded-lg transition-all cursor-pointer" title="খতিয়ান দেখুন">
                        <i class="fa-solid fa-book-open"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');

    tbody.innerHTML = html;
    if (countEl) countEl.innerHTML = `ফিল্টারকৃত কাস্টমার: <strong class="text-white font-mono">${filtered.length} জন</strong> | ফিল্টারকৃত মোট বকেয়া: <strong class="text-red-400 font-mono">৳ ${formatAmountWithComma(subtotalDue)}</strong>`;
}

export function exportClosingExcel() {
    exportExcelFn(currentClosingData);
}

export async function printClosingReport() {
    await printReportFn(currentClosingData);
}

// Global UI Bindings
window.fsFilterClosingRows = renderClosingTableRows;
window.fsExportClosingExcel = exportClosingExcel;
window.fsPrintClosingReport = printClosingReport;
