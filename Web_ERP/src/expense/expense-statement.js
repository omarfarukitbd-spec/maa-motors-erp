import Swal from 'sweetalert2';
import { ExpenseDAO, SettingsDAO } from '../dao.js';
import { formatAmountWithComma, formatAppDate, toDBDate, escapeHTML, getTodayLocalDateString, triggerUniversalPrint } from '../utils.js';
import { renderSharedPrintHeader } from '../shared/print/print-header.js';

/**
 * Expense Report Generation Logic
 * 100% Premium Design matched to Customer Statement image.
 */

export async function generateExpenseReport() {
    const today = getTodayLocalDateString();

    const { value: formValues } = await Swal.fire({
        title: '<i class="fa-solid fa-chart-pie text-blue-400 mr-2"></i>খরচের রিপোর্ট তৈরি করুন',
        html: `
            <div class="text-left space-y-4 font-bn p-2">
                <div>
                    <label class="block text-[11px] font-black text-blue-400 uppercase tracking-widest mb-1.5 ml-1">শুরুর তারিখ</label>
                    <input id="rep-start" class="m3-field datepicker" value="${today}">
                </div>
                <div>
                    <label class="block text-[11px] font-black text-blue-400 uppercase tracking-widest mb-1.5 ml-1">শেষ তারিখ</label>
                    <input id="rep-end" class="m3-field datepicker" value="${today}">
                </div>
            </div>`,
        showCancelButton: true,
        confirmButtonText: 'রিপোর্ট তৈরি করুন',
        cancelButtonText: 'বাতিল',
        customClass: {
            popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700',
            title: '!text-white',
            confirmButton: 'm3-btn-primary !bg-blue-600',
            cancelButton: 'm3-btn-tonal'
        },
        preConfirm: () => {
            const start = document.getElementById('rep-start').value;
            const end = document.getElementById('rep-end').value;
            if(!start || !end) return Swal.showValidationMessage('উভয় তারিখ দেওয়া আবশ্যক!');
            return { start: toDBDate(start), end: toDBDate(end) };
        }
    });

    if (formValues) {
        Swal.fire({ title: 'রিপোর্ট তৈরি হচ্ছে...', didOpen: () => Swal.showLoading(), allowOutsideClick: false });
        try {
            const allExpenses = await ExpenseDAO.getAll('date', 'desc');
            const filtered = allExpenses.filter(e => e.date >= formValues.start && e.date <= formValues.end);

            if (filtered.length === 0) {
                return Swal.fire('Error', 'এই সময়ের মধ্যে কোনো খরচ পাওয়া যায়নি!', 'error');
            }

            await executePrintReport(filtered, formValues.start, formValues.end);
            Swal.close();
        } catch(e) {
            console.error(e);
            Swal.fire('Error', 'রিপোর্ট জেনারেট ব্যর্থ হয়েছে', 'error');
        }
    }
}

async function executePrintReport(data, start, end) {
    const settings = await SettingsDAO.getAppSettings();
    const shopName = settings.shopName || "M/S. Maa Motors";
    const shopOwner = settings.shopOwner || "Mohammed Amran";
    const shopPhone = settings.shopPhone || "০১৮১৯-৩৯৭৬৬৯";
    const shopAddress = settings.shopAddress || "চট্টগ্রাম।";
    const dateRangeStr = `${formatAppDate(start)} হতে ${formatAppDate(end)}`;

    // Sort ascending for chronological report
    data.sort((a,b) => new Date(a.date) - new Date(b.date));

    let total = 0;
    const catSum = {};
    data.forEach(e => {
        const amt = Number(e.amount) || 0;
        total += amt;
        catSum[e.category] = (catSum[e.category] || 0) + amt;
    });

    let container = document.getElementById('print-receipt-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'print-receipt-container';
        document.body.appendChild(container);
    }

    container.className = 'print-a4';
    container.innerHTML = `
        <style>
            .a4-wrapper { padding: 0; color: #0f172a; font-family: 'Kalpurush', 'Hind Siliguri', sans-serif; }
            .header-card {
                background: #0369a1 !important;
                color: white !important;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-radius: 12px;
                margin-bottom: 20px;
                box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
                padding: 15px 30px;
                -webkit-print-color-adjust: exact;
            }
            .logo-box {
                width: 85px; height: 85px; background: white; border-radius: 50%;
                display: flex; align-items: center; justify-content: center;
                overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
                padding: 6px; flex-shrink: 0;
            }
            .shop-info h1 { font-size: 28px; font-weight: 900; margin: 0; letter-spacing: -0.5px; text-transform: uppercase; }
            .shop-info p { font-size: 12px; margin: 4px 0 0 0; opacity: 0.9; font-weight: 500; }

            .badge-box {
                font-size: 22px; font-weight: 900; background: rgba(255,255,255,0.15);
                padding: 8px 25px; border-radius: 12px; border: 1.5px solid rgba(255,255,255,0.3);
                text-align: center;
            }
            .date-range { font-size: 10px; font-weight: 700; margin-top: 8px; opacity: 0.8; text-align: right; }

            .summary-grid { display: grid; grid-template-columns: 1.4fr 1fr; gap: 15px; margin-bottom: 20px; align-items: stretch; }
            .compact-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px 18px; border-left: 5px solid #0f172a; }
            .card-title { font-size: 9px; font-weight: 900; color: #64748b; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 10px; letter-spacing: 0.5px; }

            .sum-row { display: flex; justify-content: space-between; align-items: center; padding: 6px 12px; border-left: 5px solid transparent; margin-bottom: 6px; background: white; border-radius: 6px; border: 1px solid #e2e8f0; }
            .sum-row.total { border-left-color: #dc2626; }
            .sum-row.count { border-left-color: #10b981; }
            .sum-row.balance { border-left-color: #1e40af; background: #eff6ff !important; border-left-width: 5px; }

            .cat-pill { font-size: 9px; font-weight: 900; background: #f1f5f9; padding: 3px 8px; border-radius: 6px; border: 1px solid #cbd5e1; color: #0369a1; display: inline-block; margin: 2px; }

            .report-table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 11px; border: 1px solid #cbd5e1; }
            .report-table th { background: #f1f5f9 !important; color: #0f172a !important; padding: 10px; text-align: left; font-weight: 900; text-transform: uppercase; border-bottom: 1.5px solid #0f172a; -webkit-print-color-adjust: exact; }
            .report-table td { border-bottom: 1px solid #e2e8f0; padding: 8px 12px; color: #0f172a; }
            .report-table .text-right { text-align: right; }
            .footer-block { margin-top: 60px; display: flex; justify-content: space-between; font-size: 11px; font-weight: 800; color: #64748b; }
            .sig-line { border-top: 1.5px dashed #64748b; padding-top: 6px; width: 160px; text-align: center; color: #0f172a; }
        </style>

        <div class="a4-wrapper font-bn">
            ${renderSharedPrintHeader(settings, { title: 'EXPENSE STATEMENT', dateRangeStr })}

            <div class="summary-grid">
                <!-- CATEGORY SUMMARY (Matches Column 1 style) -->
                <div class="compact-card">
                    <div class="card-title">Category-wise Summary</div>
                    <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                        ${Object.keys(catSum).map(c => `
                            <div class="cat-pill">${escapeHTML(c)}: ৳${formatAmountWithComma(catSum[c])}</div>
                        `).join('')}
                    </div>
                </div>

                <!-- FINANCIAL SUMMARY (Matches Column 2 style) -->
                <div class="compact-card" style="border-left: 0; padding: 12px 15px;">
                    <div class="card-title">Expense Summary</div>
                    <div class="sum-row total">
                        <span style="font-size:10px; font-weight:900; color:#64748b;">TOTAL EXPENSE</span>
                        <strong style="font-size:14px; color:#dc2626;">৳ ${formatAmountWithComma(total)}</strong>
                    </div>
                    <div class="sum-row count">
                        <span style="font-size:10px; font-weight:900; color:#64748b;">TOTAL ENTRIES</span>
                        <strong style="font-size:14px; color:#059669;">${data.length} টি</strong>
                    </div>
                    <div class="sum-row balance">
                        <span style="font-size:10px; font-weight:900; color:#1e40af;">NET DEBIT</span>
                        <strong style="font-size:15px; color:#1e40af;">৳ ${formatAmountWithComma(total)}</strong>
                    </div>
                </div>
            </div>

            <table class="report-table">
                <thead>
                    <tr>
                        <th style="width: 15%">Date</th>
                        <th style="width: 25%">Category</th>
                        <th style="width: 40%">Description</th>
                        <th style="width: 20%; text-align: right;">Amount (৳)</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(e => `
                        <tr>
                            <td style="font-weight: 700;">${formatAppDate(e.date)}</td>
                            <td><strong>${escapeHTML(e.category)}</strong></td>
                            <td style="color: #475569;">${escapeHTML(e.details || '-')}</td>
                            <td class="text-right" style="font-weight: 900;">${formatAmountWithComma(e.amount)}</td>
                        </tr>
                    `).join('')}
                </tbody>
                <tfoot>
                    <tr style="background: #f1f5f9; font-weight: 900;">
                        <td colspan="3" class="text-right" style="padding: 12px;">সর্বমোট খরচ:</td>
                        <td class="text-right" style="padding: 12px; font-size: 14px; color: #dc2626;">৳ ${formatAmountWithComma(total)}</td>
                    </tr>
                </tfoot>
            </table>

            <div class="footer-block">
                <p>রিপোর্ট জেনারেট: ${new Date().toLocaleString('en-GB')}</p>
                <div class="sig-line">কর্তৃপক্ষের স্বাক্ষর</div>
            </div>
        </div>
    `;

    triggerUniversalPrint(container);
}
