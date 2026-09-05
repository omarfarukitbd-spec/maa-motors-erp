import { parseAmount, formatAmountWithComma, formatAppDate, getDayOfWeekBangla, safeRound } from '../utils.js';
import Clusterize from 'clusterize.js';
import { AppState } from '../state.js';
import { getCustomerCache } from '../customer/index.js';

export function updateLedgerLiveText() {
    const b = parseAmount(document.getElementById('ledger-bill')?.value || '0');
    const p = parseAmount(document.getElementById('ledger-paid')?.value || '0');
    const sel = document.getElementById('ledger-customer-select');
    const calc = document.getElementById('live-due-calc');
    const hud = document.getElementById('ledger-live-math-hud');

    const custId = sel?.value;
    const cust = custId ? (getCustomerCache() || []).find(c => c.id === custId) : null;

    if (cust || (sel && sel.selectedIndex > 0)) {
        let baseDue = cust ? Number(cust.totalDue || 0) : (parseFloat(sel.options[sel.selectedIndex]?.dataset?.due) || 0);
        const editRef = window._ledgerEditingRef || {};
        if (editRef.id && editRef.oldCid === custId) {
            const oldBill = Number(editRef.oldBill) || 0;
            const oldPaid = Number(editRef.oldPaid) || 0;
            baseDue = safeRound(baseDue - (oldBill - oldPaid));
        }
        const nextDue = safeRound(baseDue + b - p);
        
        if (calc) {
            calc.innerText = `বকেয়া: ৳ ${formatAmountWithComma(Math.abs(nextDue))} ${nextDue < 0 ? '(অ্যাড)' : ''}`;
            calc.className = nextDue > 0 ? 'bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-1.5 rounded-xl text-xs font-black font-mono' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-1.5 rounded-xl text-xs font-black font-mono';
        }

        if (hud) {
            hud.classList.remove('hidden');
            const prevDueBadge = baseDue > 0 
                ? `<span class="text-red-400 font-mono font-bold">৳ ${formatAmountWithComma(baseDue)} (বকেয়া)</span>`
                : (baseDue < 0 ? `<span class="text-emerald-400 font-mono font-bold">৳ ${formatAmountWithComma(Math.abs(baseDue))} (অ্যাডভান্স)</span>` : `<span class="text-slate-400 font-mono font-bold">৳ ০.০০</span>`);

            let mathParts = `<span>${editRef.id ? 'ভাউচার ছাড়া মূল বকেয়া' : 'পূর্বের বকেয়া'}: ${prevDueBadge}</span>`;
            if (b > 0) {
                mathParts += `<span class="text-red-400 font-bold font-mono"> + বিল: ৳ ${formatAmountWithComma(b)}</span>`;
            }
            if (p > 0) {
                mathParts += `<span class="text-emerald-400 font-bold font-mono"> - জমা: ৳ ${formatAmountWithComma(p)}</span>`;
            }

            const nextDueBadge = nextDue > 0 
                ? `<span class="text-red-400 font-black font-mono text-sm">৳ ${formatAmountWithComma(nextDue)} (বকেয়া)</span>`
                : (nextDue < 0 ? `<span class="text-emerald-400 font-black font-mono text-sm">৳ ${formatAmountWithComma(Math.abs(nextDue))} (অ্যাডভান্স)</span>` : `<span class="text-emerald-400 font-black font-mono text-sm">৳ ০.০০ (পরিশোধিত)</span>`);

            hud.innerHTML = `
                <div class="flex items-center gap-2 flex-wrap text-slate-300 font-bold">
                    <i class="fa-solid fa-clock-rotate-left text-purple-400 text-sm"></i>
                    ${mathParts}
                </div>
                <div class="flex items-center gap-1.5 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-700/80 shadow-sm">
                    <span class="text-slate-400 text-[11px] font-bold flex items-center gap-1"><i class="fa-solid fa-arrow-right text-emerald-400 text-xs"></i><span>বর্তমান বকেয়া:</span></span>
                    ${nextDueBadge}
                </div>
            `;
        }
    } else {
        if (calc) {
            calc.innerText = '৳ ০';
            calc.className = 'bg-slate-800/80 px-4 py-1.5 rounded-xl border border-slate-700 text-xs font-black text-slate-300 shadow-inner font-bn';
        }
        if (hud) {
            hud.classList.add('hidden');
            hud.innerHTML = '';
        }
    }
}

export function renderRows(transactions, container, stateRefs = {}, startBalance = null) {
    if (!container) return { finalRunning: 0 };
    const mobileContainer = document.getElementById('ledger-list-mobile');
    const tfootContainer = document.getElementById('ledger-tfoot');
    const sel = document.getElementById('ledger-customer-select');
    const isFilteredCustomer = sel && sel.selectedIndex > 0;
    
    let rows = [], mobileHtml = '', totBill = 0, totPaid = 0, runningBalances = [];
    if (stateRefs.currentLedgerTxns) stateRefs.currentLedgerTxns.length = 0;
    if (transactions) stateRefs.currentLedgerTxns?.push(...transactions);
    if (stateRefs.currentLedgerTxnsMap) {
        Object.keys(stateRefs.currentLedgerTxnsMap).forEach(k => delete stateRefs.currentLedgerTxnsMap[k]);
    }

    const allCustomers = getCustomerCache() || [];
    let running = 0;

    if (isFilteredCustomer) {
        const custId = sel.value;
        const currentCustomer = allCustomers.find(c => c.id === custId);
        running = (startBalance !== null && startBalance !== undefined) 
            ? Number(startBalance) 
            : Number(currentCustomer?.totalDue || 0);
        transactions.forEach((d, index) => { 
            runningBalances[index] = running; 
            running = safeRound(running - ((Number(d.bill) || 0) - (Number(d.paid) || 0))); 
        });
    }

    (transactions || []).forEach((d, index) => {
        const isBoss = String(AppState?.currentUserRole || '').toLowerCase() === 'boss';
        const isAdmin = String(AppState?.currentUserRole || '').toLowerCase() === 'admin';
        const balanceVal = isFilteredCustomer ? runningBalances[index] : (Number(d.currentDue) || 0);
        const b = Number(d.bill) || 0, p = Number(d.paid) || 0;
        totBill += b; totPaid += p;

        const sId = String(d.id || '');
        const sCustId = String(d.customerId || '');
        const cust = allCustomers.find(c => c.id === sCustId);

        if (sId && stateRefs.currentLedgerTxnsMap) {
            stateRefs.currentLedgerTxnsMap[sId] = {
                ...d,
                phone: cust?.phone || d.phone || '',
                customerName: d.customerName || cust?.name || 'Customer',
                calculatedDue: balanceVal
            };
        }

        let typeBadge = '';
        if (p > 0) {
            const rType = d.receivedType || 'Bank';
            const rFrom = (d.receivedFrom || '').trim();
            const label = rFrom ? `${rType}: ${rFrom}` : rType;
            if (rType === 'Bank') {
                typeBadge = `<span class="inline-flex items-center gap-1 text-[10px] font-black text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-lg ml-2" title="${label}"><i class="fa-solid fa-building-columns text-[9px]"></i><span>${label}</span></span>`;
            } else if (rType === 'Less') {
                typeBadge = `<span class="inline-flex items-center gap-1 text-[10px] font-black text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-lg ml-2" title="${label}"><i class="fa-solid fa-tag text-[9px]"></i><span>${label}</span></span>`;
            } else {
                typeBadge = `<span class="inline-flex items-center gap-1 text-[10px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg ml-2" title="${label}"><i class="fa-solid fa-hand-holding-dollar text-[9px]"></i><span>${label}</span></span>`;
            }
        }

        const sRf = (d.receivedFrom || '').replace(/'/g, "\\'");
        const sRt = (d.receivedType || '').replace(/'/g, "\\'");

        let entryTime = '';
        let fullEntryDateTime = '';
        if (d.createdAt) {
            try {
                const dt = d.createdAt.toDate ? d.createdAt.toDate() : (d.createdAt.toMillis ? new Date(d.createdAt.toMillis()) : new Date(d.createdAt));
                if (!isNaN(dt.getTime())) {
                    entryTime = dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
                    fullEntryDateTime = `${dt.toLocaleDateString('en-GB')} ${entryTime}`;
                }
            } catch (e) {
                console.error("Time parsing error:", e);
            }
        }
        const rawCustName = d.customerName || cust?.name || 'Unknown';
        const cleanCustName = String(rawCustName).replace(/^\[.*?\]\s*/, '').trim();
        const isSingleCustView = Boolean(document.getElementById('ledger-customer-select')?.value);
        const custAddress = (!isSingleCustView && (cust?.address || d.address)) ? (cust?.address || d.address) : '';

        rows.push(`<tr class="hover:bg-white/[0.03] transition-colors border-b border-slate-800/50">
            <td class="py-2.5 px-3 text-xs font-bold text-slate-200 whitespace-nowrap align-top">
                <div>${formatAppDate(d.date)}</div>
                <div class="text-[10px] text-slate-400 font-medium mt-0.5">${getDayOfWeekBangla(d.date)}${entryTime ? ` • <span class="cursor-help" title="আসল এন্ট্রির সময়: ${fullEntryDateTime}"><i class="fa-regular fa-clock text-[9px] text-slate-500 mr-0.5"></i>${entryTime}</span>` : ''}</div>
            </td>
            <td class="font-bold text-slate-200 text-xs align-top py-2.5">
                <div class="flex items-center flex-wrap gap-1">
                    <span>${cleanCustName}</span>
                    ${typeBadge}
                </div>
                ${custAddress ? `<div class="text-[9px] text-slate-400 font-normal mt-0.5 truncate max-w-[220px] flex items-center gap-1" title="${custAddress}"><i class="fa-solid fa-location-dot text-[8px] text-slate-500"></i><span>${custAddress}</span></div>` : ''}
                <div class="flex items-center gap-1.5 mt-0.5">${d.voucherNo ? `<span class="text-[9px] text-cyan-400 font-mono font-black">#${d.voucherNo}</span>` : ''}${d.notes ? `<span class="text-[9px] text-slate-500 font-medium italic truncate max-w-[180px]" title="${d.notes}">• ${d.notes}</span>` : ''}</div>
            </td>
            <td class="text-right text-red-400 font-black text-sm align-top py-2.5 font-mono">৳${formatAmountWithComma(b)}</td>
            <td class="text-right text-emerald-400 font-black text-sm align-top py-2.5 font-mono">৳${formatAmountWithComma(p)}</td>
            <td class="text-right text-white font-black text-base bg-white/[0.02] border-l border-slate-800/50 align-top py-2.5 font-mono">৳${formatAmountWithComma(Math.abs(balanceVal))}<div class="text-[9px] uppercase font-bold ${balanceVal > 0 ? 'text-red-400' : 'text-emerald-400'} font-sans">${balanceVal > 0 ? 'Due' : 'Adv'}</div></td>
            <td class="text-center sticky-action-col align-top py-2.5"><div class="flex items-center justify-center gap-1.5">
                <button data-perm="sendLedgerWhatsApp" class="m3-btn-icon" onclick="window.sendTxnWhatsApp('${sId}')" title="WhatsApp বার্তা পাঠান"><i class="fa-brands fa-whatsapp text-emerald-400"></i></button>
                <button data-perm="sendLedgerSMS" class="m3-btn-icon" onclick="window.sendTxnSMS('${sId}')" title="ট্রানজেকশন SMS পাঠান"><i class="fa-solid fa-comment-sms text-cyan-400"></i></button>
                <button data-perm="editLedger" class="m3-btn-icon" onclick="window.editTransaction('${sId}', '${sCustId}', '${d.date}', '${d.voucherNo || ''}', ${b}, ${p}, '${sRt}', '${sRf}')" title="এডিট"><i class="fa-solid fa-pen-to-square text-amber-400"></i></button>
                <button data-perm="deleteLedger" class="m3-btn-icon" onclick="window.deleteTransaction('${sId}', '${sCustId}', ${b}, ${p})" title="ডিলেট"><i class="fa-solid fa-trash-can text-red-400"></i></button>
                <button data-perm="printLedgerReceipt" class="m3-btn-icon" onclick="window.choosePrintType('${sId}')" title="প্রিন্ট"><i class="fa-solid fa-print text-emerald-400"></i></button>
            </div></td>
        </tr>`);

        mobileHtml += `<div class="mobile-card">
            <div class="mobile-card-header">
                <div>
                    <div class="mobile-card-title">${cleanCustName}</div>
                    ${custAddress ? `<div class="text-[10px] text-slate-400 font-normal flex items-center gap-1 mt-0.5"><i class="fa-solid fa-location-dot text-[9px] text-slate-500"></i><span>${custAddress}</span></div>` : ''}
                    <div class="mobile-card-sub text-cyan-400 font-mono font-bold mt-0.5">${d.voucherNo ? '#' + d.voucherNo + ' • ' : ''}${formatAppDate(d.date)} (${getDayOfWeekBangla(d.date)})${entryTime ? ` <span title="আসল এন্ট্রির সময়: ${fullEntryDateTime}" class="cursor-help font-sans">(${entryTime})</span>` : ''} ${typeBadge}</div>
                </div>
                <div class="text-right"><div class="text-white font-black text-base">৳ ${formatAmountWithComma(Math.abs(balanceVal))}</div><span class="inline-block text-[9px] uppercase font-bold ${balanceVal > 0 ? 'text-red-400' : 'text-emerald-400'}">${balanceVal > 0 ? 'Due' : 'Adv'}</span></div>
            </div>
            <div class="mobile-card-row"><span class="mobile-card-label">বিল (Debit):</span><span class="mobile-card-value text-red-400 font-bold">৳ ${formatAmountWithComma(b)}</span></div>
            <div class="mobile-card-row"><span class="mobile-card-label">জমা (Credit):</span><span class="mobile-card-value text-emerald-400 font-bold">৳ ${formatAmountWithComma(p)}</span></div>
            <div class="mobile-card-actions">
                <button data-perm="sendLedgerWhatsApp" class="m3-btn-icon" onclick="window.sendTxnWhatsApp('${sId}')" title="WhatsApp বার্তা পাঠান"><i class="fa-brands fa-whatsapp text-emerald-400"></i></button>
                <button data-perm="sendLedgerSMS" class="m3-btn-icon" onclick="window.sendTxnSMS('${sId}')" title="ট্রানজেকশন SMS পাঠান"><i class="fa-solid fa-comment-sms text-blue-400"></i></button>
                <button data-perm="editLedger" class="m3-btn-icon" onclick="window.editTransaction('${sId}', '${sCustId}', '${d.date}', '${d.voucherNo || ''}', ${b}, ${p}, '${sRt}', '${sRf}')" title="এডিট"><i class="fa-solid fa-pen-to-square text-amber-400"></i></button>
                <button data-perm="deleteLedger" class="m3-btn-icon" onclick="window.deleteTransaction('${sId}', '${sCustId}', ${b}, ${p})" title="ডিলেট"><i class="fa-solid fa-trash-can text-red-400"></i></button>
                <button data-perm="printLedgerReceipt" class="m3-btn-icon" onclick="window.choosePrintType('${sId}')" title="প্রিন্ট"><i class="fa-solid fa-print text-emerald-400"></i></button>
            </div>
        </div>`;
    });

    if (container.id === 'recent-txn-list') {
        if (rows.length > 0) {
            container.innerHTML = rows.join('');
        } else {
            container.innerHTML = '<tr><td colspan="5" class="text-center py-8 text-slate-600 italic">কোনো লেনদেন পাওয়া যায়নি</td></tr>';
        }
        const dashMobile = document.getElementById('recent-txn-list-mobile');
        if (dashMobile) dashMobile.innerHTML = mobileHtml || '<div class="text-center py-8 text-slate-500 font-bold italic">কোনো লেনদেন পাওয়া যায়নি</div>';
        return;
    }

    const scrollElem = document.getElementById('ledger-scroll-area');
    const contentElem = document.getElementById('ledger-list');

    if (window.ledgerClusterize) {
        try {
            window.ledgerClusterize.destroy();
        } catch (e) {
            console.warn("Ledger clusterize destroy error:", e);
        }
        window.ledgerClusterize = null;
    }

    if (rows.length > 0) {
        if (scrollElem && contentElem) {
            try {
                window.ledgerClusterize = new Clusterize({
                    rows: rows,
                    scrollId: 'ledger-scroll-area',
                    contentId: 'ledger-list'
                });
            } catch (clErr) {
                console.warn("Ledger clusterize init failed, falling back to innerHTML:", clErr);
                container.innerHTML = rows.join('');
            }
        } else {
            container.innerHTML = rows.join('');
        }
    } else {
        container.innerHTML = '<tr><td colspan="6" class="text-center py-12 text-slate-600 italic">কোনো লেনদেন পাওয়া যায়নি</td></tr>';
    }
    if (mobileContainer) mobileContainer.innerHTML = mobileHtml || '<div class="text-center py-10 text-slate-500 font-bold italic">কোনো লেনদেন পাওয়া যায়নি</div>';
    if (tfootContainer) tfootContainer.innerHTML = `<tr class="bg-slate-900/90 font-black border-t-2 border-blue-500/40"><td colspan="2" class="text-right text-slate-300 py-3">পৃষ্ঠা মোট (Page Total):</td><td class="text-right text-red-400">৳ ${formatAmountWithComma(totBill)}</td><td class="text-right text-emerald-400">৳ ${formatAmountWithComma(totPaid)}</td><td class="text-right text-white">৳ ${formatAmountWithComma(Math.abs(totBill - totPaid))}</td><td></td></tr>`;

    const mobileStickyBar = document.getElementById('ledger-mobile-sticky-bar');
    if (mobileStickyBar) {
        if (isFilteredCustomer && (transactions || []).length > 0) {
            const latestBal = runningBalances[0];
            const isDue = latestBal > 0;
            const formattedBal = formatAmountWithComma(Math.abs(latestBal));
            mobileStickyBar.innerHTML = `
                <div class="flex items-center gap-2.5">
                    <div class="w-8 h-8 rounded-xl ${isDue ? 'bg-red-500/10 border border-red-500/20 text-red-400' : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'} flex items-center justify-center font-black text-xs shrink-0">
                        <i class="fa-solid ${isDue ? 'fa-receipt' : 'fa-hand-holding-dollar'}"></i>
                    </div>
                    <div>
                        <div class="text-[9px] text-slate-400 font-bold uppercase tracking-wider">${isDue ? 'বর্তমান বকেয়া' : 'অ্যাডভান্স জমা'}</div>
                        <div class="text-sm font-black ${isDue ? 'text-red-400' : 'text-emerald-400'}">৳ ${formattedBal}</div>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <button data-perm="viewCustStatementBtn" class="h-8 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs active:scale-95 transition-all flex items-center gap-1 cursor-pointer" onclick="window.openCustomerStatement('${sel.value}')">
                        <i class="fa-solid fa-file-invoice"></i><span>মেমো</span>
                    </button>
                </div>`;
            mobileStickyBar.classList.remove('hidden');
        } else {
            mobileStickyBar.classList.add('hidden');
        }
    }
    return { finalRunning: running, runningBalances };
}
