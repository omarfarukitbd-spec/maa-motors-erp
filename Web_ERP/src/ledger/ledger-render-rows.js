import { parseAmount, formatAmountWithComma, formatAppDate } from '../utils.js';
import Clusterize from 'clusterize.js';
import { AppState } from '../state.js';
import { getCustomerCache } from '../customer/index.js';

export function updateLedgerLiveText() {
    const b = parseAmount(document.getElementById('ledger-bill')?.value || '0');
    const p = parseAmount(document.getElementById('ledger-paid')?.value || '0');
    const sel = document.getElementById('ledger-customer-select');
    const calc = document.getElementById('live-due-calc');
    if(!calc) return;

    if(sel && sel.selectedIndex > 0) {
        const currentDue = (parseFloat(sel.options[sel.selectedIndex].dataset.due) || 0);
        const nextDue = currentDue + b - p;
        calc.innerText = `বকেয়া: ৳ ${formatAmountWithComma(Math.abs(nextDue))} ${nextDue < 0 ? '(অ্যাড)' : ''}`;
        calc.className = nextDue > 0 ? 'bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-1.5 rounded-xl text-xs font-black' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-1.5 rounded-xl text-xs font-black';
    } else {
        calc.innerText = '৳ ০';
        calc.className = 'bg-slate-800/80 px-4 py-1.5 rounded-xl border border-slate-700 text-xs font-black text-blue-400 shadow-inner font-bn';
    }
}

export function renderRows(transactions, container, stateRefs = {}) {
    if (!container) return;
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

    if (isFilteredCustomer) {
        const custId = sel.value;
        const currentCustomer = allCustomers.find(c => c.id === custId);
        let running = Number(currentCustomer?.totalDue || 0);
        transactions.forEach((d, index) => { runningBalances[index] = running; running -= (Number(d.bill) || 0) - (Number(d.paid) || 0); });
    }

    (transactions || []).forEach((d, index) => {
        const isAdmin = String(AppState?.currentUserRole || '').toLowerCase() === 'admin';
        const canEdit = isAdmin || (AppState?.permissions?.editLedger !== false && AppState?.permissions?.manageLedger !== false);
        const canDelete = isAdmin || (AppState?.permissions?.deleteLedger === true);
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

        const type = d.receivedType || '';
        let typeBadge = p > 0 ? `<span class="text-emerald-400 text-[10px] font-bold uppercase ml-2"><i class="fa-solid fa-money-bill-wave mr-1"></i>${type || 'Cash'}</span>` : '';

        rows.push(`<tr class="hover:bg-white/[0.03] transition-colors border-b border-slate-800/50">
            <td class="text-[10px] text-slate-300 font-bold whitespace-nowrap">${formatAppDate(d.date)}</td>
            <td class="font-bold text-slate-200 text-xs"><div>${d.customerName || cust?.name || 'Unknown'}${typeBadge}</div><div class="flex items-center gap-1.5 mt-1">${d.voucherNo ? `<span class="text-[9px] text-blue-400 font-black">#${d.voucherNo}</span>` : ''}${d.notes ? `<span class="text-[9px] text-slate-500 font-medium italic truncate max-w-[180px]" title="${d.notes}">• ${d.notes}</span>` : ''}</div></td>
            <td class="text-right text-red-400 font-black text-sm">৳${formatAmountWithComma(b)}</td>
            <td class="text-right text-emerald-400 font-black text-sm">৳${formatAmountWithComma(p)}</td>
            <td class="text-right text-white font-black text-base bg-white/[0.02] border-l border-slate-800/50">৳${formatAmountWithComma(Math.abs(balanceVal))}<div class="text-[9px] uppercase font-bold ${balanceVal > 0 ? 'text-red-400' : 'text-emerald-400'}">${balanceVal > 0 ? 'Due' : 'Adv'}</div></td>
            <td class="text-center sticky-action-col"><div class="flex items-center justify-center gap-1.5">
                <button class="m3-btn-icon" onclick="window.sendTxnWhatsApp('${sId}')" title="WhatsApp বার্তা পাঠান"><i class="fa-brands fa-whatsapp text-emerald-400"></i></button>
                <button class="m3-btn-icon" onclick="window.sendTxnSMS('${sId}')" title="ট্রানজেকশন SMS পাঠান"><i class="fa-solid fa-comment-sms text-blue-400"></i></button>
                ${canEdit ? `<button class="m3-btn-icon" onclick="window.editTransaction('${sId}', '${sCustId}', '${d.date}', '${d.voucherNo || ''}', ${b}, ${p}, '${d.receivedType || ''}', '${d.receivedFrom || ''}')" title="এডিট"><i class="fa-solid fa-pen-to-square text-amber-400"></i></button>` : ''}
                ${canDelete ? `<button class="m3-btn-icon" onclick="window.deleteTransaction('${sId}', '${sCustId}', ${b}, ${p})" title="ডিলেট"><i class="fa-solid fa-trash-can text-red-400"></i></button>` : ''}
                <button class="m3-btn-icon" onclick="window.choosePrintType('${sId}')" title="প্রিন্ট"><i class="fa-solid fa-print text-emerald-400"></i></button>
            </div></td>
        </tr>`);

        mobileHtml += `<div class="mobile-card">
            <div class="mobile-card-header">
                <div><div class="mobile-card-title">${d.customerName || cust?.name || 'Unknown'}</div><div class="mobile-card-sub text-blue-400 font-bold mt-0.5">${d.voucherNo ? '#' + d.voucherNo : formatAppDate(d.date)} ${typeBadge}</div></div>
                <div class="text-right"><div class="text-white font-black text-base">৳ ${formatAmountWithComma(Math.abs(balanceVal))}</div><span class="inline-block text-[9px] uppercase font-bold ${balanceVal > 0 ? 'text-red-400' : 'text-emerald-400'}">${balanceVal > 0 ? 'Due' : 'Adv'}</span></div>
            </div>
            <div class="mobile-card-row"><span class="mobile-card-label">খরচ (Debit):</span><span class="mobile-card-value text-red-400 font-bold">৳ ${formatAmountWithComma(b)}</span></div>
            <div class="mobile-card-row"><span class="mobile-card-label">জমা (Credit):</span><span class="mobile-card-value text-emerald-400 font-bold">৳ ${formatAmountWithComma(p)}</span></div>
            <div class="mobile-card-actions">
                <button class="m3-btn-icon" onclick="window.sendTxnWhatsApp('${sId}')" title="WhatsApp বার্তা পাঠান"><i class="fa-brands fa-whatsapp text-emerald-400"></i></button>
                <button class="m3-btn-icon" onclick="window.sendTxnSMS('${sId}')" title="ট্রানজেকশন SMS পাঠান"><i class="fa-solid fa-comment-sms text-blue-400"></i></button>
                ${canEdit ? `<button class="m3-btn-icon" onclick="window.editTransaction('${sId}', '${sCustId}', '${d.date}', '${d.voucherNo || ''}', ${b}, ${p}, '${d.receivedType || ''}', '${d.receivedFrom || ''}')" title="এডিট"><i class="fa-solid fa-pen-to-square text-amber-400"></i></button>` : ''}
                ${canDelete ? `<button class="m3-btn-icon" onclick="window.deleteTransaction('${sId}', '${sCustId}', ${b}, ${p})" title="ডিলেট"><i class="fa-solid fa-trash-can text-red-400"></i></button>` : ''}
                <button class="m3-btn-icon" onclick="window.choosePrintType('${sId}')" title="প্রিন্ট"><i class="fa-solid fa-print text-emerald-400"></i></button>
            </div>
        </div>`;
    });

    if (window.ledgerClusterize) {
        window.ledgerClusterize.destroy();
    }
    if (rows.length > 0) {
        window.ledgerClusterize = new Clusterize({
            rows: rows,
            scrollId: 'ledger-scroll-area',
            contentId: 'ledger-list'
        });
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
                    <button class="h-8 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs active:scale-95 transition-all flex items-center gap-1 cursor-pointer" onclick="window.openCustomerStatement('${sel.value}')">
                        <i class="fa-solid fa-file-invoice"></i><span>মেমো</span>
                    </button>
                </div>`;
            mobileStickyBar.classList.remove('hidden');
        } else {
            mobileStickyBar.classList.add('hidden');
        }
    }
}
