/**
 * --- DASHBOARD ACTIONS MODULE (Modular Architecture) ---
 */
import { formatAmountWithComma, formatAppDate, getTodayLocalDateString, renderPrintHeader, triggerUniversalPrint } from '../utils.js';
import { getCustomerCache } from '../customer/index.js';
import { SettingsDAO } from '../dao.js';
import Swal from 'sweetalert2';

export { resetDashCustomerForm, toggleDashCustomerForm, saveDashCustomer } from './dashboard-quick-customer.js';
import { toggleDashCustomerForm, saveDashCustomer } from './dashboard-quick-customer.js';

export function renderTopDueCustomers() {
    const container = document.getElementById('top-due-customers-list');
    if (!container) return;

    const customers = getCustomerCache();
    const sorted = [...customers].sort((a, b) => (Number(b.totalDue) || 0) - (Number(a.totalDue) || 0)).slice(0, 5);

    if (sorted.length === 0) {
        container.innerHTML = '<div class="text-center py-6 text-slate-500 text-xs italic">কোনো বকেয়া কাস্টমার পাওয়া যায়নি</div>';
        return;
    }

    let html = '';
    sorted.forEach((c, idx) => {
        const due = Number(c.totalDue) || 0;
        const sName = (c.name || 'Unknown').replace(/'/g, "\\'");
        const sPhone = c.phone || '';

        html += `
            <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60 hover:border-red-500/30 transition-all">
                <div class="flex items-center gap-2.5">
                    <span class="w-6 h-6 rounded-lg bg-red-500/10 text-red-400 font-black text-xs flex items-center justify-center">${idx + 1}</span>
                    <div>
                        <p class="text-xs font-black text-white truncate max-w-[120px]">${c.name || 'Unknown'}</p>
                        <p class="text-[10px] text-slate-400 font-bold">${c.phone || '-'}</p>
                    </div>
                </div>
                <div class="flex items-center gap-1.5">
                    <span class="text-xs font-black text-red-400 mr-1">৳ ${formatAmountWithComma(due)}</span>
                    <button class="w-7 h-7 rounded-lg bg-emerald-600/10 hover:bg-emerald-600 text-emerald-400 hover:text-white flex items-center justify-center transition-all cursor-pointer" onclick="window.sendDashWhatsAppReminder('${sPhone}', ${due}, '${sName}')" title="WhatsApp তাগাদা">
                        <i class="fa-brands fa-whatsapp text-[12px]"></i>
                    </button>
                    <button class="w-7 h-7 rounded-lg bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white flex items-center justify-center transition-all cursor-pointer" onclick="window.sendReminderSMS && window.sendReminderSMS('${sPhone}', ${due}, '${sName}')" title="SMS রিমাইন্ডার">
                        <i class="fa-solid fa-comment-sms text-[11px]"></i>
                    </button>
                </div>
            </div>`;
    });

    container.innerHTML = html;
}

export function sendDashWhatsAppReminder(phone, due, name) {
    const formattedDue = formatAmountWithComma(Math.abs(due));
    const dueText = due < 0 ? `অ্যাডভান্স জমা: ৳ ${formattedDue}` : `বর্তমান মোট বকেয়া: ৳ ${formattedDue}`;
    const msg = `আসসালামু আলাইকুম ${name},\nমেসার্স মা মোটরস্ থেকে আপনার হিসাব বিবরণী:\n\n${dueText}\n\n*বিশেষ অনুরোধ: আপনার বকেয়া টাকাটি দ্রুত পরিশোধ করার অনুরোধ রইল।*\n\nযোগাযোগ: 01819-397669\nধন্যবাদ! — মেসার্স মা মোটরস্`;
    if (window.sendWhatsApp) window.sendWhatsApp(phone, msg);
}

export function showBreakdownDetails(name, category, sourceData, queryDateStr) {
    if (!sourceData || !sourceData.txns || sourceData.txns.length === 0) {
        return Swal.fire({ title: name, text: 'এই ব্যাংক বা উৎসে কোনো লেনদেন ডাটা পাওয়া যায়নি', icon: 'info' });
    }

    const txns = sourceData.txns;
    const formattedDate = formatAppDate(queryDateStr || getTodayLocalDateString());
    
    let rowsHtml = '';
    txns.forEach((t, i) => {
        const cName = t.customerName || 'Customer';
        const vNo = t.voucherNo ? `#${t.voucherNo}` : '-';
        const paidAmt = Number(t.paid) || 0;

        rowsHtml += `
            <tr class="border-b border-slate-800/80 hover:bg-white/[0.02]">
                <td class="py-2 px-3 text-center text-slate-400 font-bold">${i + 1}</td>
                <td class="py-2 px-3 text-left text-white font-black">${cName}</td>
                <td class="py-2 px-3 text-center text-blue-400 font-mono font-bold">${vNo}</td>
                <td class="py-2 px-3 text-right font-mono font-black text-emerald-400">৳ ${formatAmountWithComma(paidAmt)}</td>
            </tr>`;
    });

    Swal.fire({
        title: `<div class="flex flex-col items-center gap-1 font-bn">
                    <div class="flex items-center gap-2 text-xl text-white font-black">
                        <i class="fa-solid ${category === 'Bank' ? 'fa-building-columns text-blue-400' : 'fa-hand-holding-dollar text-emerald-400'}"></i>
                        <span>${name}</span>
                    </div>
                    <span class="text-xs text-slate-400 font-bold">তারিখ: ${formattedDate} • মোট ${txns.length}টি এন্ট্রি</span>
                </div>`,
        html: `
            <div class="text-left font-bn space-y-3">
                <div class="max-h-60 overflow-y-auto custom-scrollbar rounded-xl border border-slate-800 bg-slate-950/90">
                    <table class="w-full text-xs">
                        <thead>
                            <tr class="bg-slate-900 text-slate-400 font-black border-b border-slate-800 text-[11px] uppercase">
                                <th class="py-2 px-3 text-center">ক্রমিক</th>
                                <th class="py-2 px-3 text-left">কাস্টমারের নাম</th>
                                <th class="py-2 px-3 text-center">ভাউচার</th>
                                <th class="py-2 px-3 text-right">জমা টাকা (৳)</th>
                            </tr>
                        </thead>
                        <tbody>${rowsHtml}</tbody>
                    </table>
                </div>
                <div class="flex items-center justify-between p-3 bg-blue-600/10 border border-blue-500/30 rounded-xl font-bn">
                    <span class="text-xs font-black text-slate-300">মোট জমা যোগফল:</span>
                    <span class="text-base font-black text-blue-400 font-mono">৳ ${formatAmountWithComma(sourceData.total)}</span>
                </div>
            </div>
        `,
        confirmButtonText: 'ঠিক আছে',
        customClass: {
            popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn max-w-lg',
            confirmButton: 'm3-btn-primary !bg-blue-600 hover:!bg-blue-500 !px-8 !py-2 !rounded-xl font-bold'
        }
    });
}

export async function printExecutiveSummary() {
    try {
        const today = getTodayLocalDateString();
        const dueEl = document.getElementById('dash-total-due')?.innerText || '৳ ০';
        const colEl = document.getElementById('dash-today-col')?.innerText || '৳ ০';
        const expEl = document.getElementById('dash-today-exp')?.innerText || '৳ ০';
        const custEl = document.getElementById('dash-total-cust')?.innerText || '০ জন';
        const cashColEl = document.getElementById('dash-col-cash')?.innerText || '৳ ০';
        const bankColEl = document.getElementById('dash-col-bank')?.innerText || '৳ ০';
        const netCashRaw = document.getElementById('dash-net-cash')?.innerText || '';
        const netCashLabel = netCashRaw.includes('ঘাটতি') ? 'ঘাটতি (Deficit)' : 'উদ্বৃত্ত (Surplus)';
        const netCashColor = netCashRaw.includes('ঘাটতি') ? '#dc2626' : '#059669';
        const netCashDisplay = netCashRaw.replace(/\s*\(.*?\)\s*/g, '').replace('নিট ক্যাশ:', '').trim();

        const settings = await SettingsDAO.getAppSettings();

        const customers = getCustomerCache();
        const topDues = [...customers]
            .filter(c => (Number(c.totalDue) || 0) > 0)
            .sort((a, b) => (Number(b.totalDue) || 0) - (Number(a.totalDue) || 0))
            .slice(0, 10);

        let topDuesHtml = '';
        if (topDues.length > 0) {
            topDuesHtml = topDues.map((c, i) => `
                <tr>
                    <td style="text-align:center; padding: 6px; border: 1px solid #cbd5e1; font-weight:bold;">${String(i + 1).padStart(2, '0')}</td>
                    <td style="padding: 6px; border: 1px solid #cbd5e1; font-weight:bold;">${c.name || '-'}</td>
                    <td style="text-align:center; padding: 6px; border: 1px solid #cbd5e1; font-size: 10px;">${c.accountNo || '-'}</td>
                    <td style="text-align:center; padding: 6px; border: 1px solid #cbd5e1; font-size: 10px;">${c.zone || '-'}</td>
                    <td style="text-align:center; padding: 6px; border: 1px solid #cbd5e1; font-size: 10px;">${c.phone || '-'}</td>
                    <td style="text-align:right; padding: 6px; border: 1px solid #cbd5e1; font-weight:900; color:#dc2626;">৳ ${formatAmountWithComma(Number(c.totalDue) || 0)}</td>
                </tr>
            `).join('');
        } else {
            topDuesHtml = `<tr><td colspan="6" style="text-align:center; padding:12px; color:#64748b; font-style:italic;">কোনো বকেয়া কাস্টমার পাওয়া যায়নি</td></tr>`;
        }

        const headerHtml = renderPrintHeader({
            title: 'EXECUTIVE REPORT',
            dateRangeStr: `তারিখ: ${formatAppDate(today)} • সময়: ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
        }, settings);

        let container = document.getElementById('print-receipt-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'print-receipt-container';
            document.body.appendChild(container);
        }

        container.className = 'print-a4';
        container.innerHTML = `
            <table class="print-layout-table" style="width: 100%; border-collapse: collapse;">
                <thead><tr><td><div class="print-header-space"></div></td></tr></thead>
                <tbody>
                    <tr>
                        <td>
                            <div class="a4-wrapper font-bn">
                                ${headerHtml}

                                <div style="font-size: 11px; font-weight: 900; color: #0284c7; text-transform: uppercase; border-bottom: 2px solid #0284c7; padding-bottom: 4px; margin-bottom: 12px; letter-spacing: 0.5px;">
                                    দৈনিক ব্যবসায়িক সারসংক্ষেপ (KEY PERFORMANCE METRICS)
                                </div>

                                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px;">
                                    <div style="background: #fdf2f2; border: 1px solid #fecaca; border-left: 4px solid #dc2626; padding: 12px; border-radius: 10px;">
                                        <div style="font-size: 9px; font-weight: 900; color: #991b1b; text-transform: uppercase; margin-bottom: 4px;">মার্কেটে মোট বকেয়া</div>
                                        <strong style="font-size: 15px; font-weight: 900; color: #dc2626;">${dueEl}</strong>
                                    </div>
                                    <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-left: 4px solid #059669; padding: 12px; border-radius: 10px;">
                                        <div style="font-size: 9px; font-weight: 900; color: #166534; text-transform: uppercase; margin-bottom: 4px;">আজকের আদায় (Collection)</div>
                                        <strong style="font-size: 15px; font-weight: 900; color: #059669;">${colEl}</strong>
                                    </div>
                                    <div style="background: #fffbe6; border: 1px solid #ffe58f; border-left: 4px solid #d97706; padding: 12px; border-radius: 10px;">
                                        <div style="font-size: 9px; font-weight: 900; color: #856404; text-transform: uppercase; margin-bottom: 4px;">আজকের মোট খরচ</div>
                                        <strong style="font-size: 15px; font-weight: 900; color: #d97706;">${expEl}</strong>
                                    </div>
                                    <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-left: 4px solid #2563eb; padding: 12px; border-radius: 10px;">
                                        <div style="font-size: 9px; font-weight: 900; color: #1e40af; text-transform: uppercase; margin-bottom: 4px;">মোট কাস্টমার সংখ্যা</div>
                                        <strong style="font-size: 15px; font-weight: 900; color: #2563eb;">${custEl}</strong>
                                    </div>
                                </div>

                                <div style="font-size: 11px; font-weight: 900; color: #0284c7; text-transform: uppercase; border-bottom: 2px solid #0284c7; padding-bottom: 4px; margin-bottom: 10px; letter-spacing: 0.5px; margin-top: 4px;">
                                    দৈনিক ক্যাশ ফ্লো বিভাজন (DAILY CASH FLOW BREAKDOWN)
                                </div>
                                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px;">
                                    <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-left: 4px solid #059669; padding: 10px; border-radius: 10px;">
                                        <div style="font-size: 8px; font-weight: 900; color: #166534; text-transform: uppercase; margin-bottom: 3px;">ক্যাশ আদায়</div>
                                        <strong style="font-size: 13px; font-weight: 900; color: #059669;">${cashColEl}</strong>
                                    </div>
                                    <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-left: 4px solid #2563eb; padding: 10px; border-radius: 10px;">
                                        <div style="font-size: 8px; font-weight: 900; color: #1e40af; text-transform: uppercase; margin-bottom: 3px;">ব্যাংক আদায়</div>
                                        <strong style="font-size: 13px; font-weight: 900; color: #2563eb;">${bankColEl}</strong>
                                    </div>
                                    <div style="background: #fffbe6; border: 1px solid #ffe58f; border-left: 4px solid #d97706; padding: 10px; border-radius: 10px;">
                                        <div style="font-size: 8px; font-weight: 900; color: #856404; text-transform: uppercase; margin-bottom: 3px;">মোট খরচ</div>
                                        <strong style="font-size: 13px; font-weight: 900; color: #d97706;">${expEl}</strong>
                                    </div>
                                    <div style="background: ${netCashColor === '#dc2626' ? '#fdf2f2' : '#f0fdf4'}; border: 1px solid ${netCashColor === '#dc2626' ? '#fecaca' : '#bbf7d0'}; border-left: 4px solid ${netCashColor}; padding: 10px; border-radius: 10px;">
                                        <div style="font-size: 8px; font-weight: 900; color: ${netCashColor}; text-transform: uppercase; margin-bottom: 3px;">নিট ক্যাশ · ${netCashLabel}</div>
                                        <strong style="font-size: 13px; font-weight: 900; color: ${netCashColor};">${netCashDisplay}</strong>
                                    </div>
                                </div>

                                <div style="font-size: 11px; font-weight: 900; color: #0f172a; text-transform: uppercase; border-bottom: 2px solid #0f172a; padding-bottom: 4px; margin-bottom: 10px; letter-spacing: 0.5px;">
                                    শীর্ষ ১০ জন সর্বাধিক বকেয়া কাস্টমার (TOP OUTSTANDING DUES)
                                </div>

                                <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 11px;">
                                    <thead>
                                        <tr style="background: #f1f5f9; border-bottom: 1.5px solid #0f172a; font-size: 9px; font-weight: 900; text-transform: uppercase;">
                                            <th style="padding: 6px; width: 6%; text-align: center; border: 1px solid #cbd5e1;">SL</th>
                                            <th style="padding: 6px; text-align: left; border: 1px solid #cbd5e1;">কাস্টমারের নাম</th>
                                            <th style="padding: 6px; width: 12%; text-align: center; border: 1px solid #cbd5e1;">A/C NO</th>
                                            <th style="padding: 6px; width: 14%; text-align: center; border: 1px solid #cbd5e1;">জোন</th>
                                            <th style="padding: 6px; width: 16%; text-align: center; border: 1px solid #cbd5e1;">মোবাইল</th>
                                            <th style="padding: 6px; width: 20%; text-align: right; border: 1px solid #cbd5e1;">বর্তমান বকেয়া (৳)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${topDuesHtml}
                                    </tbody>
                                </table>

                                <div style="margin-top: 45px; page-break-inside: avoid;">
                                    <div style="display: flex; justify-content: space-between; padding: 0 40px;">
                                        <div style="border-top: 1.5px dashed #64748b; padding-top: 6px; width: 150px; text-align: center; font-size: 11px; font-weight: 700; color: #334155;">প্রস্তুতকারীর স্বাক্ষর<br><span style="font-size:8px; font-weight:normal;">Prepared By</span></div>
                                        <div style="border-top: 1.5px dashed #64748b; padding-top: 6px; width: 150px; text-align: center; font-size: 11px; font-weight: 700; color: #334155;">কর্তৃপক্ষের স্বাক্ষর<br><span style="font-size:8px; font-weight:normal;">Authorized Signature</span></div>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
                <tfoot><tr><td><div class="print-footer-space"></div></td></tr></tfoot>
            </table>
        `;

        triggerUniversalPrint(container);

    } catch (e) {
        console.error("Executive Print Error:", e);
        Swal.fire('Error', 'রিপোর্ট প্রিন্ট করতে সমস্যা হয়েছে', 'error');
    }
}

// Global API Bindings
if (typeof window !== 'undefined') {
    window.sendDashWhatsAppReminder = sendDashWhatsAppReminder;
    window.toggleDashCustomerForm = toggleDashCustomerForm;
    window.saveDashCustomer = saveDashCustomer;
    window.showBreakdownDetails = showBreakdownDetails;
}
