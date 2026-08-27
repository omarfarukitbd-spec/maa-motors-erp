import Swal from 'sweetalert2';
import { CustomerDAO, TransactionDAO, SettingsDAO } from '../dao.js';
import { formatAmountWithComma, formatAppDate, escapeHTML, safeRound } from '../utils.js';

/**
 * Open Inline Customer Ledger Statement Drawer Modal
 */
export async function openCustomerLedgerDrawer(customerId, customerName = '', accountNo = '') {
    if (!customerId) return;

    Swal.fire({
        title: '<div class="flex items-center justify-center gap-2 font-bn font-black text-lg text-white"><i class="fa-solid fa-spinner fa-spin text-blue-400"></i><span>খতিয়ান লোড হচ্ছে...</span></div>',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
        customClass: { popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800' }
    });

    try {
        const customer = (await CustomerDAO.getById(customerId)) || {};
        const rawTxns = await TransactionDAO.getByCustomer(customerId);

        // Sort chronologically
        const getTxnTime = (t) => {
            if (!t?.createdAt) return 0;
            if (typeof t.createdAt.toMillis === 'function') return t.createdAt.toMillis();
            if (typeof t.createdAt.toDate === 'function') return t.createdAt.toDate().getTime();
            return new Date(t.createdAt).getTime() || 0;
        };

        const sortedTxns = rawTxns.filter(t => {
            const v = String(t.voucherNo || '').trim().toUpperCase();
            return v !== 'OPENING' && v !== 'OPEN' && v !== 'প্রারম্ভিক ব্যালেন্স';
        }).sort((a, b) => {
            const dDiff = new Date(a.date) - new Date(b.date);
            if (dDiff !== 0) return dDiff;
            return getTxnTime(a) - getTxnTime(b);
        });

        const initialDue = Number(customer.initialDue || 0);
        let runningBalance = initialDue;
        let totalBills = 0;
        let totalPaid = 0;

        const tableRows = sortedTxns.map((t, idx) => {
            const b = Number(t.bill) || 0;
            const p = Number(t.paid) || 0;
            totalBills += b;
            totalPaid += p;
            runningBalance = safeRound(runningBalance + b - p);

            const vBadge = t.voucherNo ? `<span class="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono font-bold text-[10px] border border-blue-500/20">#${escapeHTML(t.voucherNo)}</span>` : '<span class="text-slate-600 font-mono">-</span>';
            const payMethod = (p > 0 && t.receivedType) ? `<span class="text-[9px] text-emerald-300 ml-1">(${escapeHTML(t.receivedType)})</span>` : '';

            return `
                <tr class="hover:bg-slate-800/40 border-b border-slate-800/60 transition-colors text-xs font-medium">
                    <td class="py-2.5 px-3 text-center text-slate-500 font-mono">${idx + 1}</td>
                    <td class="py-2.5 px-3 font-mono text-slate-300 whitespace-nowrap">${formatAppDate(t.date)}</td>
                    <td class="py-2.5 px-3 text-center whitespace-nowrap">${vBadge}</td>
                    <td class="py-2.5 px-3 text-slate-300 truncate max-w-[150px]" title="${escapeHTML(t.notes || '')}">${escapeHTML(t.notes || (b > 0 ? 'পণ্য বিল' : 'জমা রশিদ'))}</td>
                    <td class="py-2.5 px-3 text-right font-mono font-bold text-red-400">${b > 0 ? '৳ ' + formatAmountWithComma(b) : '-'}</td>
                    <td class="py-2.5 px-3 text-right font-mono font-bold text-emerald-400">${p > 0 ? '৳ ' + formatAmountWithComma(p) + payMethod : '-'}</td>
                    <td class="py-2.5 px-3 text-right font-mono font-black ${runningBalance > 0 ? 'text-red-400' : 'text-emerald-400'}">৳ ${formatAmountWithComma(Math.abs(runningBalance))} ${runningBalance < 0 ? '(অ্যাডভান্স)' : ''}</td>
                </tr>
            `;
        }).join('');

        const currentNetDue = Number(customer.totalDue || runningBalance);

        Swal.fire({
            title: `
                <div class="flex items-center justify-between gap-3 border-b border-slate-800 pb-3 text-left font-bn w-full">
                    <div class="flex items-center gap-2.5">
                        <div class="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 text-lg">
                            <i class="fa-solid fa-book"></i>
                        </div>
                        <div>
                            <div class="text-base font-black text-white">${escapeHTML(customer.name || customerName)} - পূর্ণাঙ্গ খতিয়ান</div>
                            <div class="text-xs text-slate-400 font-normal">A/C: <span class="font-mono text-blue-400 font-bold">${escapeHTML(customer.accountNo || accountNo || '-')}</span> • মোবাইল: ${escapeHTML(customer.phone || 'মোবাইল নেই')}</div>
                        </div>
                    </div>
                </div>
            `,
            html: `
                <div class="space-y-4 font-bn text-left max-h-[70vh] overflow-y-auto custom-scrollbar p-1">
                    <!-- KPI Summary Cards -->
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        <div class="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                            <div class="text-[10px] font-bold text-slate-500 uppercase">প্রারম্ভিক ব্যালেন্স</div>
                            <div class="text-sm font-mono font-bold text-slate-200 mt-0.5">৳ ${formatAmountWithComma(initialDue)}</div>
                        </div>
                        <div class="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                            <div class="text-[10px] font-bold text-slate-500 uppercase">মোট কেনাকাটা (বিল)</div>
                            <div class="text-sm font-mono font-black text-red-400 mt-0.5">৳ ${formatAmountWithComma(totalBills)}</div>
                        </div>
                        <div class="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                            <div class="text-[10px] font-bold text-slate-500 uppercase">মোট পরিশোধ (জমা)</div>
                            <div class="text-sm font-mono font-black text-emerald-400 mt-0.5">৳ ${formatAmountWithComma(totalPaid)}</div>
                        </div>
                        <div class="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 ${currentNetDue > 0 ? 'border-red-500/30 bg-red-950/20' : 'border-emerald-500/30 bg-emerald-950/20'}">
                            <div class="text-[10px] font-bold ${currentNetDue > 0 ? 'text-red-400' : 'text-emerald-400'} uppercase">বর্তমান মোট বকেয়া</div>
                            <div class="text-sm font-mono font-black ${currentNetDue > 0 ? 'text-red-400' : 'text-emerald-400'} mt-0.5">৳ ${formatAmountWithComma(Math.abs(currentNetDue))} ${currentNetDue < 0 ? '(অ্যাডভান্স)' : ''}</div>
                        </div>
                    </div>

                    <!-- Ledger Table -->
                    <div class="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/40">
                        <div class="overflow-x-auto custom-scrollbar max-h-[320px]">
                            <table class="w-full text-left border-collapse">
                                <thead class="sticky top-0 bg-slate-900 z-10 border-b border-slate-800 text-[11px] font-black text-slate-400">
                                    <tr>
                                        <th class="py-2.5 px-3 text-center w-10">#</th>
                                        <th class="py-2.5 px-3">তারিখ</th>
                                        <th class="py-2.5 px-3 text-center">মেমো নং</th>
                                        <th class="py-2.5 px-3">বিবরণ / নোট</th>
                                        <th class="py-2.5 px-3 text-right text-red-400">বিল (Debit)</th>
                                        <th class="py-2.5 px-3 text-right text-emerald-400">জমা (Credit)</th>
                                        <th class="py-2.5 px-3 text-right">ব্যালেন্স</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${initialDue > 0 ? `
                                        <tr class="bg-slate-900/30 border-b border-slate-800/60 text-xs font-bold">
                                            <td class="py-2 px-3 text-center font-mono text-slate-500">0</td>
                                            <td class="py-2 px-3 text-slate-400 font-mono">-</td>
                                            <td class="py-2 px-3 text-center"><span class="px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono text-[10px]">OPENING</span></td>
                                            <td class="py-2 px-3 text-slate-400">প্রারম্ভিক বকেয়া</td>
                                            <td class="py-2 px-3 text-right font-mono text-red-400">৳ ${formatAmountWithComma(initialDue)}</td>
                                            <td class="py-2 px-3 text-right font-mono text-slate-600">-</td>
                                            <td class="py-2 px-3 text-right font-mono font-black text-red-400">৳ ${formatAmountWithComma(initialDue)}</td>
                                        </tr>
                                    ` : ''}
                                    ${tableRows || '<tr><td colspan="7" class="py-8 text-center text-slate-500 font-bold text-xs">কোনো লেনদেন রেকর্ড নেই</td></tr>'}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `,
            showCancelButton: true,
            showDenyButton: true,
            confirmButtonText: '<i class="fa-solid fa-print mr-1.5"></i> A4 খতিয়ান প্রিন্ট / PDF',
            denyButtonText: '<i class="fa-brands fa-whatsapp mr-1.5"></i> WhatsApp স্টেটমেন্ট',
            cancelButtonText: 'বন্ধ করুন',
            customClass: {
                popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn max-w-4xl',
                confirmButton: 'm3-btn-primary !bg-blue-600 hover:!bg-blue-500 !px-5 !py-2.5 !rounded-xl font-bold',
                denyButton: 'm3-btn-primary !bg-emerald-600 hover:!bg-emerald-500 !px-5 !py-2.5 !rounded-xl font-bold',
                cancelButton: 'm3-btn-tonal !bg-slate-800 !text-slate-300 !px-4 !py-2.5 !rounded-xl font-bold'
            }
        });

        if (result.isConfirmed) {
            const { printStatement } = await import('../statement-print.js');
            await printStatement(customer, initialDue, sortedTxns, '');
        } else if (result.isDenied) {
            const dueText = currentNetDue > 0 ? `মোট বকেয়া: ৳ ${formatAmountWithComma(currentNetDue)}` : `অ্যাডভান্স জমা: ৳ ${formatAmountWithComma(Math.abs(currentNetDue))}`;
            const msg = `আসসালামু আলাইকুম ${customer.name || customerName},\nমেসার্স মা মোটরস্ থেকে আপনার হিসাব বিবরণী:\n\nমোট কেনাকাটা: ৳ ${formatAmountWithComma(totalBills)}\nমোট জমা: ৳ ${formatAmountWithComma(totalPaid)}\n---------------------------------\n${dueText}\n\nধন্যবাদ! — মেসার্স মা মোটরস্`;
            if (window.sendWhatsApp) window.sendWhatsApp(customer.phone, msg);
            else window.open(`https://api.whatsapp.com/send?phone=88${(customer.phone || '').replace(/[^0-9]/g, '')}&text=${encodeURIComponent(msg)}`, '_blank');
        }
    } catch (e) {
        console.error("openCustomerLedgerDrawer error:", e);
        Swal.fire('Error', 'খতিয়ান লোড করতে সমস্যা হয়েছে', 'error');
    }
}

// Global Binding
window.openCustomerLedgerDrawer = openCustomerLedgerDrawer;
