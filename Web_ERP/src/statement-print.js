import Swal from 'sweetalert2';
import { SettingsDAO } from './dao.js';
import { formatAmountWithComma, formatAppDate, renderPrintHeader, triggerUniversalPrint, getTodayLocalDateString, paginateStatementRows, safeRound } from './utils.js';
import { smartPaginateStatement, printViaIframe } from './utils/smart-print-engine.js';


function generateRowsArray(initialDue, docs) {
    const rowsArray = [];
    let running = initialDue;

    const row0 = `<tr style="background:#f1f5f9; border-bottom:2px solid #cbd5e1;">
        <td colspan="2" style="font-weight:900; color:#0f172a; text-transform:uppercase; font-size:10px; padding: 8px 12px; letter-spacing: 1px;">Opening Balance</td>
        <td style="text-align:right; color:#0f172a; padding: 8px 12px;">-</td>
        <td style="text-align:right; color:#0f172a; padding: 8px 12px;">-</td>
        <td style="text-align:right; font-weight:900; color:#0f172a; padding: 8px 12px; border-left:1px solid #cbd5e1; background:#fff;">
            ৳ ${formatAmountWithComma(Math.abs(initialDue))} ${initialDue < 0 ? '(Adv)' : ''}
        </td>
    </tr>`;

    rowsArray.push({ html: row0, textLength: 15 });

    docs.forEach(txn => {
        const b = Number(txn.bill) || 0, p = Number(txn.paid) || 0;
        const type = txn.receivedType || '';
        running += (b - p);

        let entryTime = '';
        if (txn.createdAt) {
            try {
                const dt = txn.createdAt.toDate ? txn.createdAt.toDate() : (txn.createdAt.toMillis ? new Date(txn.createdAt.toMillis()) : new Date(txn.createdAt));
                if (!isNaN(dt.getTime())) {
                    entryTime = dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
                }
            } catch (e) {
                console.error('Time parsing error in statement print:', e);
            }
        }

        let typeDisp = '-';
        if (p > 0) {
            const rType = txn.receivedType || 'Bank';
            const rFrom = (txn.receivedFrom || '').trim();
            const label = rFrom ? `${rType}: ${rFrom}` : rType;
            if (rType === 'Less') {
                typeDisp = `<strong style="color:#7c3aed; font-size:10px; background:#f5f3ff; border:1px solid #ddd6fe; padding:1px 6px; border-radius:5px; display:inline-block;">[LESS] ${rFrom || ''}</strong>`;
            } else if (rType === 'Bank') {
                typeDisp = `<strong style="color:#0284c7; font-size:10px; background:#f0f9ff; border:1px solid #bae6fd; padding:1px 6px; border-radius:5px; display:inline-block;">${label}</strong>`;
            } else {
                typeDisp = `<strong style="color:#059669; font-size:10px; background:#ecfdf5; border:1px solid #a7f3d0; padding:1px 6px; border-radius:5px; display:inline-block;">${label}</strong>`;
            }
        } else if (b > 0 && txn.notes) {
            typeDisp = `<span style="font-size:10px; color:#475569;">${txn.notes}</span>`;
        }
        const voucher = txn.voucherNo && txn.voucherNo !== 'OPENING' ? `<span style="font-size:9.5px; color:#0284c7; font-weight:900; font-family:monospace; margin-left:4px;">#${txn.voucherNo}</span>` : '';

        const rowHtml = `<tr>
            <td style="font-size:10.5px; border-bottom:1px solid #e2e8f0; padding: 5px 8px; color:#0f172a; line-height: 1.2; vertical-align: middle;">
                <div style="font-weight: 700;">${formatAppDate(txn.date)}</div>
                ${entryTime ? `<div style="font-size: 8px; color: #64748b; font-weight: 500; margin-top: 1px;">${entryTime}</div>` : ''}
            </td>
            <td style="font-size:11px; border-bottom:1px solid #e2e8f0; padding: 5px 10px; color:#0f172a; vertical-align: middle;">${typeDisp}${voucher}</td>
            <td style="text-align:right; color:#dc2626; font-weight:700; border-bottom:1px solid #e2e8f0; padding: 5px 10px; vertical-align: middle;">${b > 0 ? formatAmountWithComma(b) : '-'}</td>
            <td style="text-align:right; color:#059669; font-weight:700; border-bottom:1px solid #e2e8f0; padding: 5px 10px; vertical-align: middle;">${p > 0 ? formatAmountWithComma(p) : '-'}</td>
            <td style="text-align:right; font-weight:900; color:#0f172a; border-bottom:1px solid #e2e8f0; padding: 5px 10px; border-left:1px solid #e2e8f0; vertical-align: middle;">
                ৳ ${formatAmountWithComma(Math.abs(running))} ${running < 0 ? '<span style="font-size:8px; color:#059669;">(Adv)</span>' : ''}
            </td>
        </tr>`;

        rowsArray.push({ html: rowHtml, textLength: (txn.receivedFrom || '').length });
    });

    return { rowsArray, running };
}

function getSharedHtmlTemplates(customer, totalBill, totalPaid, totalDue, running, settings, title, subtitle, dateRangeStr) {
    const cleanCustomerName = (customer.name || '').replace(/^\[.*?\]\s*/, '').trim();
    const page1HeaderHtml = renderPrintHeader(settings, { title, subtitle, dateRangeStr });
    const repeatHeaderHtml = `
        <div style="display:flex; justify-content:space-between; align-items:flex-end; border-bottom:2px solid #0284c7; padding-bottom:4px; margin-bottom:8px;">
            <div style="font-size:14px; font-weight:900; color:#0f172a; font-family:'Inter',sans-serif;">${title} <span style="font-size:10px; color:#475569; font-weight:normal;">(Continued)</span></div>
            <div style="font-size:10px; color:#475569; font-family:'Hind Siliguri',sans-serif;">${dateRangeStr || subtitle}</div>
        </div>
    `;

    const page1ExtraHtml = `
        <div style="position: relative; display: grid; grid-template-columns: 1.35fr 1fr; gap: 16px; margin-bottom: 16px; align-items: stretch; margin-top: 10px;">
            <div style="position: absolute; left: 54%; top: 50%; transform: translate(-50%, -50%) rotate(-12deg); pointer-events: none; opacity: 0.22; border: 4px double ${running <= 0 ? '#059669' : '#dc2626'}; color: ${running <= 0 ? '#059669' : '#dc2626'}; padding: 5px 18px; border-radius: 8px; font-weight: 900; font-size: 20px; text-transform: uppercase; letter-spacing: 1.5px; text-align: center; line-height: 1.1; z-index: 10; font-family: sans-serif; background: rgba(255,255,255,0.85); backdrop-filter: blur(2px);">
                ${running <= 0 ? 'PAID<br><span style="font-size:10px;">পরিশোধিত</span>' : 'DUE<br><span style="font-size:10px;">বকেয়া হিসাব</span>'}
            </div>

            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; border-left: 4px solid #0284c7; padding: 12px 16px; display: flex; flex-direction: column; justify-content: flex-start;">
                <div style="font-size: 10px; font-weight: 900; color: #0284c7; text-transform: uppercase; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin-bottom: 8px;">CUSTOMER DETAILS</div>
                <p style="font-size:15px; font-weight: 900; color:#0f172a; margin-bottom: 4px; line-height: 1.2;">${cleanCustomerName}</p>
                <div style="display: flex; flex-wrap: wrap; gap: 14px; font-size:11px; color:#475569; margin-bottom: 6px;">
                    <span><strong style="color:#0f172a;">A/C No:</strong> ${customer.accountNo || '-'}</span>
                    <span><strong style="color:#0f172a;">Mobile:</strong> ${customer.phone || '-'}</span>
                </div>
                <div style="border-top: 1px dashed #cbd5e1; padding-top: 6px;">
                    <p style="font-size: 10px; color: #334155; line-height: 1.4; margin: 0; font-weight: 600;">${customer.address || '-'}</p>
                </div>
            </div>

            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; border-left: 4px solid #0369a1; padding: 12px 16px; display: flex; flex-direction: column;">
                <div style="font-size: 10px; font-weight: 900; color: #0369a1; text-transform: uppercase; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin-bottom: 8px;">FINANCIAL SUMMARY</div>
                <div style="flex-grow: 1; display: flex; flex-direction: column; justify-content: center; gap: 4px;">
                    <div style="border-left: 3px solid #dc2626; background: #fff; display: flex; justify-content: space-between; align-items: center; padding: 4px 10px; border-radius: 6px; border: 1px solid #f1f5f9;">
                        <span style="font-size:10px; font-weight:900; color:#64748b;">DEBIT</span>
                        <strong style="font-size:13px; color:#dc2626;">${totalBill}</strong>
                    </div>
                    <div style="border-left: 3px solid #059669; background: #fff; display: flex; justify-content: space-between; align-items: center; padding: 4px 10px; border-radius: 6px; border: 1px solid #f1f5f9;">
                        <span style="font-size:10px; font-weight:900; color:#64748b;">CREDIT</span>
                        <strong style="font-size:13px; color:#059669;">${totalPaid}</strong>
                    </div>
                    <div style="border-left: 4px solid #1e40af; background: #eff6ff !important; display: flex; justify-content: space-between; align-items: center; padding: 4px 10px; border-radius: 6px;">
                        <span style="font-size:10px; font-weight:900; color:#1e40af;">BALANCE</span>
                        <strong style="font-size:14px; color:#1e40af;">${totalDue}</strong>
                    </div>
                </div>
            </div>
        </div>
    `;

    const tableColHeaderHtml = `
        <thead>
            <tr style="background:#f1f5f9; border-bottom:1.5px solid #0f172a;">
                <th style="width:12%; padding:6px 8px; text-align:left; font-size:9px; font-weight:900; text-transform:uppercase;">Date</th>
                <th style="width:40%; padding:6px 8px; text-align:left; font-size:9px; font-weight:900; text-transform:uppercase;">Description / Voucher</th>
                <th style="width:15%; padding:6px 8px; text-align:right; font-size:9px; font-weight:900; text-transform:uppercase;">Debit</th>
                <th style="width:15%; padding:6px 8px; text-align:right; font-size:9px; font-weight:900; text-transform:uppercase;">Credit</th>
                <th style="width:18%; padding:6px 8px; text-align:right; font-size:9px; font-weight:900; text-transform:uppercase; border-left:1px solid #cbd5e1;">Balance</th>
            </tr>
        </thead>
    `;

    const signatureHtml = `
        <div class="signature-last-page-block" style="margin-top: 40px; page-break-inside: avoid; break-inside: avoid;">
            <div style="display: flex; justify-content: space-between; padding: 0 30px;">
                <div style="border-top: 1.5px dashed #64748b; padding-top: 6px; width: 150px; text-align: center; font-size: 11px; font-weight: 700; color: #334155;">গ্রাহকের স্বাক্ষর<br><span style="font-size:8px; font-weight:normal;">Customer Signature</span></div>
                <div style="border-top: 1.5px dashed #64748b; padding-top: 6px; width: 150px; text-align: center; font-size: 11px; font-weight: 700; color: #334155;">কর্তৃপক্ষের স্বাক্ষর<br><span style="font-size:8px; font-weight:normal;">Authorized Signature</span></div>
            </div>
        </div>
    `;

    return { page1HeaderHtml, repeatHeaderHtml, page1ExtraHtml, tableColHeaderHtml, signatureHtml };
}

export async function printStatement(currentCustomerInfo, currentOpeningBalance, currentStatementData, customNote = '') {
    try {
        const settings = await SettingsDAO.getAppSettings();
        let container = document.getElementById('print-receipt-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'print-receipt-container';
            document.body.appendChild(container);
        }

        const start = document.getElementById('stmt-start-date')?.value || '';
        const end = document.getElementById('stmt-end-date')?.value || '';
        const dateRangeStr = (start || end) ? `${start ? formatAppDate(start) : 'শুরু'} হতে ${end ? formatAppDate(end) : 'আজ'}` : 'সকল লেনদেন';

        const totalBill = document.getElementById('stmt-total-bill')?.innerText || '৳ 0';
        const totalPaid = document.getElementById('stmt-total-paid')?.innerText || '৳ 0';
        const totalDue = document.getElementById('stmt-total-due')?.innerText || '৳ 0';

        const { rowsArray, running } = generateRowsArray(currentOpeningBalance, currentStatementData);
        
        const { page1HeaderHtml, repeatHeaderHtml, page1ExtraHtml, tableColHeaderHtml, signatureHtml } = getSharedHtmlTemplates(
            currentCustomerInfo, totalBill, totalPaid, totalDue, running, settings, 'CUSTOMER KHATIYAN', 'কাস্টমার বকেয়া খতিয়ান', dateRangeStr
        );

        const customNoteHtml = customNote && customNote.trim() ? `
            <div style="margin-top: 15px; padding: 10px 14px; background: #fffbe6; border: 1px solid #ffe58f; border-radius: 8px; font-size: 11px; color: #856404; font-family: sans-serif; page-break-inside: avoid; break-inside: avoid;">
                <strong style="display: block; font-weight: 900; margin-bottom: 3px; color: #533f03;">বিশেষ নোটিশ / শর্তাবলি:</strong>
                ${customNote.replace(/\n/g, '<br>')}
            </div>` : '';

        const todayStr = getTodayLocalDateString();
        const [y, m, d] = todayStr.split('-');

        // Smart DOM-measured pagination — auto column widths, no blank pages
        const paginatedHtml = await smartPaginateStatement({
            rowsArray, page1HeaderHtml, repeatHeaderHtml, tableColHeaderHtml, page1ExtraHtml,
            summaryHtml: customNoteHtml, signatureHtml, formattedDate: `${d}/${m}/${y}`
        });

        // iframe print — suppresses Chrome URL/date header+footer
        printViaIframe(paginatedHtml);
    } catch(err) {
        console.error("Statement print error:", err);
        Swal.fire('Error', 'প্রিন্ট করতে সমস্যা হয়েছে', 'error');
    }
}

let currentPublicPrintData = null;

export async function renderPublicStatementView(customerId) {
    if (!customerId) return;
    const loginScreen = document.getElementById('login-screen');
    const appContainer = document.getElementById('app-container');
    if (loginScreen) loginScreen.style.display = 'none';
    if (appContainer) appContainer.classList.add('hidden');

    let publicContainer = document.getElementById('public-stmt-view');
    if (!publicContainer) {
        publicContainer = document.createElement('div');
        publicContainer.id = 'public-stmt-view';
        publicContainer.className = 'fixed inset-0 z-[9999] overflow-y-auto bg-slate-950 p-3 sm:p-6 font-bn flex flex-col items-center justify-start';
        document.body.appendChild(publicContainer);
    }
    publicContainer.innerHTML = `<div class="text-center py-20 text-white font-bold"><i class="fa-solid fa-spinner fa-spin text-2xl text-blue-500 mb-3"></i><p>মেসার্স মা মোটরস্ বিবরণী লোড হচ্ছে...</p></div>`;

    try {
        const { CustomerDAO, TransactionDAO, SettingsDAO } = await import('./dao.js');
        const customer = await CustomerDAO.getById(customerId);
        if (!customer) return publicContainer.innerHTML = `<div class="m3-card text-center py-12 text-red-400 font-bold max-w-md mx-auto">কাস্টমার হিসাব পাওয়া যায়নি!</div>`;

        const settings = await SettingsDAO.getAppSettings();
        let docs = (await TransactionDAO.getByCustomer(customerId)).filter(d => d.voucherNo !== 'OPENING');
        docs.sort((a, b) => {
            const dDiff = new Date(a.date) - new Date(b.date);
            if (dDiff !== 0) return dDiff;
            return (a.createdAt?.toMillis() || 0) - (b.createdAt?.toMillis() || 0);
        });

        const initialDue = Number(customer.initialDue || 0);
        let billSum = 0, paidSum = 0, lessSum = 0;
        docs.forEach(txn => {
            if (txn.receivedType === 'Less') lessSum = safeRound(lessSum + (Number(txn.paid) || 0));
            else paidSum = safeRound(paidSum + (Number(txn.paid) || 0));
            billSum = safeRound(billSum + (Number(txn.bill) || 0));
        });
        const running = safeRound(initialDue + billSum - paidSum - lessSum);

        const { rowsArray } = generateRowsArray(initialDue, docs);
        currentPublicPrintData = { customer, docs, settings, initialDue, billSum, paidSum, lessSum, running };

        const { page1HeaderHtml, page1ExtraHtml } = getSharedHtmlTemplates(
            customer, `৳ ${formatAmountWithComma(billSum)}`, `৳ ${formatAmountWithComma(paidSum)}`, `৳ ${formatAmountWithComma(Math.abs(running))} ${running < 0 ? '(Adv)' : ''}`, running, settings, 'STATEMENT SUMMARY', 'সকল লেনদেন', 'সকল লেনদেন'
        );

        publicContainer.innerHTML = `
            <div class="w-full max-w-4xl bg-slate-900 rounded-3xl border border-slate-800 p-4 sm:p-6 shadow-2xl mb-6 font-bn">
                <div class="flex items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-4">
                    <div class="flex items-center gap-2 text-white font-black text-sm sm:text-base"><i class="fa-solid fa-file-invoice text-blue-400"></i> মেসার্স মা মোটরস্ - হিসাব বিবরণী</div>
                    <button onclick="window.printPublicStatement()" class="h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5"><i class="fa-solid fa-print"></i><span>প্রিন্ট / PDF</span></button>
                </div>
                <div id="public-print-area" class="bg-white text-slate-900 p-4 sm:p-8 rounded-2xl">
                    ${page1HeaderHtml}
                    ${page1ExtraHtml}
                    <table style="width:100%; border-collapse:collapse; margin-bottom:12px; border: 1px solid #cbd5e1;">
                        <thead><tr style="background:#f1f5f9; border-bottom:1.5px solid #0f172a;"><th style="width:12%; padding:6px 8px; text-align:left; font-size:9px; font-weight:900;">Date</th><th style="width:40%; padding:6px 8px; text-align:left; font-size:9px; font-weight:900;">Description</th><th style="width:15%; padding:6px 8px; text-align:right; font-size:9px; font-weight:900;">Debit</th><th style="width:15%; padding:6px 8px; text-align:right; font-size:9px; font-weight:900;">Credit</th><th style="width:18%; padding:6px 8px; text-align:right; font-size:9px; font-weight:900;">Balance</th></tr></thead>
                        <tbody style="font-size: 10px;">${rowsArray.join('')}</tbody>
                    </table>
                    <div style="margin-top: 40px; display: flex; justify-content: space-between; padding: 0 30px;">
                        <div style="border-top: 1.5px dashed #64748b; padding-top: 6px; width: 150px; text-align: center; font-size: 11px; font-weight: 700; color: #334155;">গ্রাহকের স্বাক্ষর</div>
                        <div style="border-top: 1.5px dashed #64748b; padding-top: 6px; width: 150px; text-align: center; font-size: 11px; font-weight: 700; color: #334155;">কর্তৃপক্ষের স্বাক্ষর</div>
                    </div>
                </div>
            </div>`;
    } catch(e) {
        console.error(e);
        publicContainer.innerHTML = `<div class="m3-card text-center py-12 text-red-400 font-bold max-w-md mx-auto">স্টেটমেন্ট লোড করতে ব্যর্থ!</div>`;
    }
}

window.printPublicStatement = async () => {
    if (!currentPublicPrintData) return;
    const { customer, docs, settings, initialDue, billSum, paidSum, running } = currentPublicPrintData;

    let container = document.getElementById('print-receipt-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'print-receipt-container';
        document.body.appendChild(container);
    }

    const { rowsArray } = generateRowsArray(initialDue, docs);
    const { page1HeaderHtml, repeatHeaderHtml, page1ExtraHtml, tableColHeaderHtml, signatureHtml } = getSharedHtmlTemplates(
        customer, `৳ ${formatAmountWithComma(billSum)}`, `৳ ${formatAmountWithComma(paidSum)}`, `৳ ${formatAmountWithComma(Math.abs(running))} ${running < 0 ? '(Adv)' : ''}`, running, settings, 'STATEMENT SUMMARY', 'সকল লেনদেন', 'সকল লেনদেন'
    );

    const todayStr = getTodayLocalDateString();
    const [y, m, d] = todayStr.split('-');

    // Smart DOM-measured pagination — auto column widths, no blank pages
    const paginatedHtml = await smartPaginateStatement({
        rowsArray, page1HeaderHtml, repeatHeaderHtml, tableColHeaderHtml, page1ExtraHtml,
        summaryHtml: '', signatureHtml, formattedDate: `${d}/${m}/${y}`
    });
    printViaIframe(paginatedHtml);
};
window.renderPublicStatementView = renderPublicStatementView;
