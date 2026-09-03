import { calculateAgingDueData, sendAgingCustomerWhatsApp, sendAgingCustomerSMS } from './financial-summary-aging.js';
import { formatAmountWithComma, formatAppDate, showToast } from '../utils.js';

/**
 * Render Customer Collection Table Body
 */
export function renderCustomerTable(data) {
    const custTbody = document.getElementById('fs-customer-tbody');
    if (!custTbody) return;

    if (!data.customerCollections || data.customerCollections.length === 0) {
        custTbody.innerHTML = `<tr><td colspan="9" class="text-center py-10 text-slate-500 italic">এই সময়ের মধ্যে কোনো কাস্টমার আদায় নেই।</td></tr>`;
        return;
    }

    custTbody.innerHTML = data.customerCollections.map((c, i) => {
        const methodBadge = c.receivedType === 'Cash' 
            ? `<span class="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap"><i class="fa-solid fa-hand-holding-dollar mr-1"></i> ক্যাশ</span>`
            : `<span class="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap"><i class="fa-solid fa-building-columns mr-1"></i> ${c.receivedFrom || 'Bank'}</span>`;

        return `
            <tr class="hover:bg-slate-800/40 transition-all fs-cust-row">
                <td class="py-2.5 px-3 text-center text-slate-500 font-mono">${i + 1}</td>
                <td class="py-2.5 px-3 text-center text-slate-400 whitespace-nowrap">${formatAppDate(c.date)}</td>
                <td class="py-2.5 px-3 text-center font-mono font-bold text-blue-400 whitespace-nowrap">${c.customerAccountNo}</td>
                <td class="py-2.5 px-3 font-bold text-white">
                    <div class="truncate max-w-[150px] sm:max-w-[200px]">${c.customerName}</div>
                    <div class="text-[10px] text-slate-400 font-normal font-mono">${c.customerPhone}</div>
                </td>
                <td class="py-2.5 px-3 text-slate-300 whitespace-nowrap">${c.customerZone}</td>
                <td class="py-2.5 px-3 text-center font-mono text-slate-400 whitespace-nowrap">${c.voucherNo}</td>
                <td class="py-2.5 px-3 text-center">${methodBadge}</td>
                <td class="py-2.5 px-3 text-right font-black text-emerald-400 font-mono whitespace-nowrap">৳ ${formatAmountWithComma(c.amount)}</td>
                <td class="py-2.5 px-3 text-right font-bold text-rose-400 font-mono whitespace-nowrap">৳ ${formatAmountWithComma(c.currentDue)}</td>
            </tr>
        `;
    }).join('');
}

/**
 * Render Day-by-Day Performance Table
 */
export function renderDayByDayTable(data) {
    const dayTbody = document.getElementById('fs-daybyday-tbody');
    if (!dayTbody) return;

    if (!data.dayByDaySummary || data.dayByDaySummary.length === 0) {
        dayTbody.innerHTML = `<tr><td colspan="9" class="text-center py-10 text-slate-500 italic">কোনো লেনদেন রেকর্ড পাওয়া যায়নি।</td></tr>`;
        return;
    }

    dayTbody.innerHTML = data.dayByDaySummary.map(d => `
        <tr class="hover:bg-slate-800/40 transition-all">
            <td class="py-2.5 px-3 text-center font-bold text-white whitespace-nowrap">${formatAppDate(d.date)}</td>
            <td class="py-2.5 px-3 text-center text-blue-400 font-bold whitespace-nowrap">${d.customerCount} জন</td>
            <td class="py-2.5 px-3 text-right font-mono text-slate-200 whitespace-nowrap">৳ ${formatAmountWithComma(d.sales)}</td>
            <td class="py-2.5 px-3 text-right font-mono text-emerald-400 whitespace-nowrap">৳ ${formatAmountWithComma(d.cashPaid)}</td>
            <td class="py-2.5 px-3 text-right font-mono text-blue-400 whitespace-nowrap">৳ ${formatAmountWithComma(d.bankPaid)}</td>
            <td class="py-2.5 px-3 text-right font-mono font-black text-emerald-400 bg-emerald-500/5 whitespace-nowrap">৳ ${formatAmountWithComma(d.totalPaid)}</td>
            <td class="py-2.5 px-3 text-right font-mono font-bold text-rose-400 whitespace-nowrap">৳ ${formatAmountWithComma(d.expenses)}</td>
            <td class="py-2.5 px-3 text-right font-mono font-black ${d.netCash >= 0 ? 'text-emerald-400' : 'text-rose-400'} whitespace-nowrap">৳ ${formatAmountWithComma(d.netCash)}</td>
            <td class="py-2.5 px-3 text-center whitespace-nowrap">
                <button onclick="window.fsLoadData('${d.date}', '${d.date}'); window.fsSwitchTab('customers');" class="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-blue-400 text-[11px] font-bold rounded-lg transition-all cursor-pointer" title="এই দিনের কাস্টমার লিস্ট দেখুন">
                    <i class="fa-solid fa-eye mr-1"></i> দেখুন
                </button>
            </td>
        </tr>
    `).join('');
}

/**
 * Render Raw Expenses Table
 */
export function renderExpensesTable(data) {
    const expTbody = document.getElementById('fs-expenses-tbody');
    if (!expTbody) return;

    if (!data.rawExpenses || data.rawExpenses.length === 0) {
        expTbody.innerHTML = `<tr><td colspan="5" class="text-center py-10 text-slate-500 italic">কোনো খরচের এন্ট্রি নেই।</td></tr>`;
        return;
    }

    expTbody.innerHTML = data.rawExpenses.map(e => `
        <tr class="hover:bg-slate-800/40 transition-all">
            <td class="py-2.5 px-3 text-center text-slate-400 whitespace-nowrap">${formatAppDate(e.date)}</td>
            <td class="py-2.5 px-3 font-bold text-white">${e.note || e.title || '-'}</td>
            <td class="py-2.5 px-3 text-slate-300">${e.category || 'অন্যান্য'}</td>
            <td class="py-2.5 px-3 text-center text-slate-400">${e.paymentMethod || 'ক্যাশ'}</td>
            <td class="py-2.5 px-3 text-right font-black text-rose-400 font-mono whitespace-nowrap">৳ ${formatAmountWithComma(e.amount)}</td>
        </tr>
    `).join('');
}

/**
 * Render Payment Methods Breakdown Grid
 */
export function renderMethodsGrid(data) {
    const methodsGrid = document.getElementById('fs-methods-grid');
    if (!methodsGrid) return;

    const methods = Object.values(data.methodBreakdown || {});
    if (methods.length === 0) {
        methodsGrid.innerHTML = `<div class="col-span-full text-center py-10 text-slate-500 italic">কোনো আদায়ের মেথড ডাটা নেই।</div>`;
        return;
    }

    methodsGrid.innerHTML = methods.map(m => `
        <div class="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
            <div class="flex justify-between items-center mb-3">
                <span class="text-xs font-black text-slate-300 uppercase">${m.name}</span>
                <span class="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-bold">${m.count} টি জমা</span>
            </div>
            <div class="text-xl font-black text-emerald-400 font-mono">৳ ${formatAmountWithComma(m.amount)}</div>
        </div>
    `).join('');
}

/**
 * Render Aging Due & Defaulter Recovery Tab
 */
export function renderAgingDueTab() {
    const agingData = calculateAgingDueData();
    const { buckets } = agingData;

    // 1. Render Aging Header Cards
    const cardsGrid = document.getElementById('fs-aging-cards-grid');
    if (cardsGrid) {
        cardsGrid.innerHTML = `
            <div class="bg-emerald-950/30 border border-emerald-500/20 p-3 sm:p-4 rounded-2xl">
                <span class="text-[10.5px] font-bold text-emerald-400">০ - ৩০ দিন (স্বাভাবিক)</span>
                <h4 class="text-base sm:text-xl font-black text-white font-mono mt-1">৳ ${formatAmountWithComma(buckets.tier0_30.totalDue)}</h4>
                <p class="text-[10px] text-slate-400 font-bold">${buckets.tier0_30.count} জন কাস্টমার</p>
            </div>
            <div class="bg-amber-950/30 border border-amber-500/20 p-3 sm:p-4 rounded-2xl">
                <span class="text-[10.5px] font-bold text-amber-400">৩১ - ৬০ দিন (সতর্কতা)</span>
                <h4 class="text-base sm:text-xl font-black text-white font-mono mt-1">৳ ${formatAmountWithComma(buckets.tier31_60.totalDue)}</h4>
                <p class="text-[10px] text-slate-400 font-bold">${buckets.tier31_60.count} জন কাস্টমার</p>
            </div>
            <div class="bg-orange-950/30 border border-orange-500/20 p-3 sm:p-4 rounded-2xl">
                <span class="text-[10.5px] font-bold text-orange-400">৬১ - ৯০ দিন (উচ্চ ঝুঁকি)</span>
                <h4 class="text-base sm:text-xl font-black text-white font-mono mt-1">৳ ${formatAmountWithComma(buckets.tier61_90.totalDue)}</h4>
                <p class="text-[10px] text-slate-400 font-bold">${buckets.tier61_90.count} জন কাস্টমার</p>
            </div>
            <div class="bg-rose-950/30 border border-rose-500/30 p-3 sm:p-4 rounded-2xl">
                <span class="text-[10.5px] font-bold text-rose-400">৯০+ দিন (ডেড বকেয়া)</span>
                <h4 class="text-base sm:text-xl font-black text-rose-400 font-mono mt-1">৳ ${formatAmountWithComma(buckets.tier90_plus.totalDue)}</h4>
                <p class="text-[10px] text-slate-400 font-bold">${buckets.tier90_plus.count} জন কাস্টমার</p>
            </div>
        `;
    }

    // 2. Render Aging Table Rows
    window._currentAgingList = [
        ...buckets.tier90_plus.list.map(c => ({ ...c, tier: 'tier90_plus', badge: '৯০+ দিন (অচল)' })),
        ...buckets.tier61_90.list.map(c => ({ ...c, tier: 'tier61_90', badge: '৬১-৯০ দিন (অচল)' })),
        ...buckets.tier31_60.list.map(c => ({ ...c, tier: 'tier31_60', badge: '৩১-৬০ দিন (সতর্কতা)' })),
        ...buckets.tier0_30.list.map(c => ({ ...c, tier: 'tier0_30', badge: '০-৩০ দিন (স্বাভাবিক)' }))
    ];

    window.fsFilterAgingBracket = (tier) => {
        document.querySelectorAll('.aging-filter-btn').forEach(btn => {
            if (btn.getAttribute('data-tier') === tier) {
                btn.className = 'aging-filter-btn px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-800 text-white cursor-pointer';
            } else {
                btn.className = 'aging-filter-btn px-2.5 py-1 text-[11px] font-bold rounded-lg text-slate-400 hover:bg-slate-900 cursor-pointer';
            }
        });

        const listToRender = tier === 'all' ? window._currentAgingList : window._currentAgingList.filter(c => c.tier === tier);
        renderAgingTableBody(listToRender);

        const tierNames = {
            'all': 'সব বকেয়া',
            'tier90_plus': '৯০+ দিনের ডেড বকেয়া',
            'tier61_90': '৬১-৯০ দিনের বকেয়া',
            'tier31_60': '৩১-৬০ দিনের বকেয়া'
        };
        showToast(`${tierNames[tier] || tier} তালিকা ফিল্টার করা হয়েছে (${listToRender.length} জন)`, 'info', 'এজিং ফিল্টার');
    };

    window.fsFilterAgingRows = (q) => {
        const query = (q || '').toLowerCase().trim();
        const filtered = window._currentAgingList.filter(c => 
            c.name.toLowerCase().includes(query) || c.phone.includes(query) || c.accountNo.toLowerCase().includes(query) || c.zone.toLowerCase().includes(query)
        );
        renderAgingTableBody(filtered);
    };

    window.fsSendAgingWhatsApp = (name, phone, due) => {
        sendAgingCustomerWhatsApp(name, phone, due);
    };

    window.fsSendAgingSMS = (name, phone, due) => {
        sendAgingCustomerSMS(name, phone, due);
    };

    renderAgingTableBody(window._currentAgingList);
}

export function renderAgingTableBody(list) {
    const tbody = document.getElementById('fs-aging-tbody');
    if (!tbody) return;

    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center py-8 text-slate-500 italic">কোনো বকেয়া কাস্টমার পাওয়া যায়নি।</td></tr>`;
        return;
    }

    tbody.innerHTML = list.map(c => {
        let badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
        if (c.tier === 'tier90_plus') badgeColor = 'bg-rose-500/20 text-rose-400 border-rose-500/30';
        else if (c.tier === 'tier61_90') badgeColor = 'bg-orange-500/20 text-orange-400 border-orange-500/30';
        else if (c.tier === 'tier31_60') badgeColor = 'bg-amber-500/20 text-amber-400 border-amber-500/30';

        return `
            <tr class="hover:bg-slate-800/40 transition-all fs-aging-row">
                <td class="py-2.5 px-3 text-center font-mono font-bold text-blue-400 whitespace-nowrap">${c.accountNo}</td>
                <td class="py-2.5 px-3 font-bold text-white">
                    <div class="truncate max-w-[150px] sm:max-w-[200px]">${c.name}</div>
                    <div class="text-[10px] text-slate-400 font-normal font-mono">${c.phone}</div>
                </td>
                <td class="py-2.5 px-3 text-slate-300 whitespace-nowrap">${c.zone}</td>
                <td class="py-2.5 px-3 text-center whitespace-nowrap">
                    <span class="px-2 py-0.5 rounded-md text-[10px] font-bold border ${badgeColor}">
                        ${c.inactiveDays} দিন অচল
                    </span>
                </td>
                <td class="py-2.5 px-3 text-right font-black text-rose-400 font-mono whitespace-nowrap">৳ ${formatAmountWithComma(c.totalDue)}</td>
                <td class="py-2.5 px-3 text-center whitespace-nowrap">
                    <div class="flex items-center justify-center gap-1.5">
                        <button onclick="window.fsSendAgingWhatsApp('${c.name}', '${c.phone}', ${c.totalDue})" class="w-7 h-7 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white flex items-center justify-center transition-all cursor-pointer" title="WhatsApp তাগাদা">
                            <i class="fa-brands fa-whatsapp text-xs"></i>
                        </button>
                        <button onclick="window.fsSendAgingSMS('${c.name}', '${c.phone}', ${c.totalDue})" class="w-7 h-7 rounded-lg bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white flex items-center justify-center transition-all cursor-pointer" title="SMS তাগাদা">
                            <i class="fa-solid fa-comment-sms text-xs"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}
