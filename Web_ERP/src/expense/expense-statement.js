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
    const dateRangeStr = `${formatAppDate(start)} হতে ${formatAppDate(end)}`;

    // Sort ascending for chronological report
    data.sort((a, b) => {
        const dA = toDBDate(a.date || start), dB = toDBDate(b.date || start);
        if (dA !== dB) return dA.localeCompare(dB);
        const tA = a.createdAt?.toMillis?.() || (new Date(a.createdAt || 0).getTime()) || 0;
        const tB = b.createdAt?.toMillis?.() || (new Date(b.createdAt || 0).getTime()) || 0;
        return tA - tB;
    });

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
            .a4-wrapper { padding: 0; color: #0f172a; font-family: 'Anek Bangla', 'Hind Siliguri', 'Inter', sans-serif; }

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
            .footer-block { margin-top: 48px; display: flex; justify-content: space-between; font-size: 11px; font-weight: 800; color: #64748b; font-family: 'Anek Bangla', 'Hind Siliguri', sans-serif; }
            .sig-line { border-top: 1.2px dashed #64748b; padding-top: 6px; width: 165px; text-align: center; color: #1e293b; }
        </style>

        <div class="a4-wrapper font-bn">
            ${renderSharedPrintHeader(settings, { title: 'ব্যয় বিবরণী / খরচ স্টেটমেন্ট', pageLabel: 'সময়কাল', dateRangeStr })}

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
