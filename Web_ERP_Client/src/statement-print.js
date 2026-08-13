import { formatAmountWithComma, formatAppDate, cleanCustomerName, safeRound, numberToBanglaWords } from './utils.js';

export function printCustomerStatementA4(customer, transactions) {
    const printContainer = document.getElementById('print-receipt-container');
    if (!printContainer) return;

    const rawName = customer.name || 'সম্মানিত গ্রাহক';
    const cleanName = cleanCustomerName(rawName);
    const accNo = customer.accountNo ? customer.accountNo : 'N/A';
    const phone = customer.phone || 'N/A';
    const address = customer.address || 'N/A';

    let running = 0;
    let totBill = 0, totPaid = 0;

    let rowsHtml = '';
    transactions.forEach(t => {
        const b = Number(t.bill) || 0;
        const p = Number(t.paid) || 0;
        totBill = safeRound(totBill + b);
        totPaid = safeRound(totPaid + p);
        running = safeRound(running + (b - p));

        const method = (t.receivedFrom || t.receivedType || '').trim();
        const desc = t.notes || (method ? `পেমেন্ট: ${method}` : 'সাধারণ লেনদেন');

        rowsHtml += `
            <tr style="border-bottom: 1px solid #cbd5e1;">
                <td style="padding: 6px 8px; font-family: monospace; font-size: 11px;">${formatAppDate(t.date)}</td>
                <td style="padding: 6px 8px; font-family: monospace; font-size: 11px; color: #1e40af; font-weight: bold;">${t.voucherNo || '-'}</td>
                <td style="padding: 6px 8px; font-size: 11px;">${desc}</td>
                <td style="padding: 6px 8px; text-align: right; font-family: sans-serif; font-size: 11px; color: #dc2626; font-weight: bold;">${b > 0 ? formatAmountWithComma(b) : '-'}</td>
                <td style="padding: 6px 8px; text-align: right; font-family: sans-serif; font-size: 11px; color: #059669; font-weight: bold;">${p > 0 ? formatAmountWithComma(p) : '-'}</td>
                <td style="padding: 6px 8px; text-align: right; font-family: sans-serif; font-size: 11px; font-weight: bold; color: ${running > 0 ? '#dc2626' : '#059669'};">${formatAmountWithComma(Math.abs(running))} ${running < 0 ? '(Adv)' : ''}</td>
            </tr>
        `;
    });

    const isDue = running > 0;
    const balanceLabel = isDue ? 'বর্তমান বকেয়া (Current Due)' : (running < 0 ? 'অ্যাডভান্স জমা (Advance Balance)' : 'পরিশোধিত ব্যালেন্স');

    const html = `
        <div style="font-family: 'Hind Siliguri', 'Inter', sans-serif; color: #0f172a; padding: 20px; max-width: 800px; margin: 0 auto; background: #fff;">
            <!-- Header -->
            <div style="text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 16px;">
                <h1 style="font-size: 24px; font-weight: 900; margin: 0; text-transform: uppercase; color: #0f172a;">মা মোটরস (MAA MOTORS)</h1>
                <p style="font-size: 12px; margin: 2px 0; color: #475569;">মাইজভাণ্ডার রোড, নানুপুর, ফটিকছড়ি, চট্টগ্রাম | মোবাইল: ০১৮১৯-১৮৯৪০২, ০১৭২১-৭২৯৯৩৫</p>
                <h3 style="font-size: 14px; font-weight: 800; margin: 6px 0 0; display: inline-block; background: #f1f5f9; padding: 4px 16px; border-radius: 6px; border: 1px solid #cbd5e1;">গ্রাহকের খতিয়ান বিবরণী (Customer Ledger Statement)</h3>
            </div>

            <!-- Customer Info Box -->
            <div style="display: flex; justify-content: space-between; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 16px; font-size: 12px;">
                <div>
                    <div style="font-size: 15px; font-weight: 800; color: #0f172a;">${cleanName}</div>
                    <div style="color: #475569; margin-top: 2px;"><strong>A/C No:</strong> <span style="font-family: monospace; color: #1e40af; font-weight: 700;">${accNo}</span></div>
                    <div style="color: #475569;"><strong>ঠিকানা:</strong> ${address}</div>
                </div>
                <div style="text-align: right;">
                    <div style="color: #475569;"><strong>মোবাইল:</strong> <span style="font-family: monospace; font-weight: 700;">${phone}</span></div>
                    <div style="color: #475569; margin-top: 2px;"><strong>তারিখ:</strong> ${formatAppDate(new Date().toISOString().split('T')[0])}</div>
                    <div style="margin-top: 4px; font-size: 13px; font-weight: 800; color: ${isDue ? '#dc2626' : '#059669'};">
                        ${balanceLabel}: ৳ ${formatAmountWithComma(Math.abs(running))}
                    </div>
                </div>
            </div>

            <!-- Transactions Table -->
            <table style="width: 100%; border-collapse: collapse; border: 1px solid #cbd5e1; margin-bottom: 20px;">
                <thead>
                    <tr style="background: #f1f5f9; border-bottom: 2px solid #0f172a; font-size: 11px; text-transform: uppercase;">
                        <th style="padding: 8px; text-align: left; width: 12%;">তারিখ</th>
                        <th style="padding: 8px; text-align: left; width: 15%;">ভাউচার নং</th>
                        <th style="padding: 8px; text-align: left; width: 35%;">বিবরণ</th>
                        <th style="padding: 8px; text-align: right; width: 12%;">বিল (Debit)</th>
                        <th style="padding: 8px; text-align: right; width: 12%;">জমা (Credit)</th>
                        <th style="padding: 8px; text-align: right; width: 14%;">ব্যালেন্স</th>
                    </tr>
                </thead>
                <tbody>
                    ${rowsHtml}
                </tbody>
                <tfoot>
                    <tr style="background: #f8fafc; border-top: 2px solid #0f172a; font-weight: 900; font-size: 12px;">
                        <td colspan="3" style="padding: 8px; text-align: right;">সর্বমোট:</td>
                        <td style="padding: 8px; text-align: right; color: #dc2626; font-family: sans-serif;">৳ ${formatAmountWithComma(totBill)}</td>
                        <td style="padding: 8px; text-align: right; color: #059669; font-family: sans-serif;">৳ ${formatAmountWithComma(totPaid)}</td>
                        <td style="padding: 8px; text-align: right; color: ${isDue ? '#dc2626' : '#059669'}; font-family: sans-serif;">৳ ${formatAmountWithComma(Math.abs(running))}</td>
                    </tr>
                </tfoot>
            </table>

            <!-- Footer Signatures -->
            <div style="margin-top: 40px; display: flex; justify-content: space-between; font-size: 11px; font-weight: bold; color: #334155; padding: 0 20px;">
                <div style="border-top: 1px dashed #64748b; padding-top: 5px; width: 150px; text-align: center;">গ্রাহকের স্বাক্ষর</div>
                <div style="border-top: 1px dashed #64748b; padding-top: 5px; width: 150px; text-align: center;">কর্তৃপক্ষের স্বাক্ষর</div>
            </div>
        </div>
    `;

    executePrint(html);
}

export function printCustomerStatementPOS(customer, transactions) {
    const rawName = customer.name || 'গ্রাহক';
    const cleanName = cleanCustomerName(rawName);
    const accNo = customer.accountNo || 'N/A';
    const phone = customer.phone || 'N/A';

    let running = 0;
    let rowsHtml = '';
    transactions.slice(-15).forEach(t => {
        const b = Number(t.bill) || 0;
        const p = Number(t.paid) || 0;
        running = safeRound(running + (b - p));
        rowsHtml += `
            <tr style="border-bottom: 1px dashed #ccc; font-size: 10px;">
                <td style="padding: 3px 0;">${formatAppDate(t.date)}</td>
                <td style="text-align: right; padding: 3px 0;">${b > 0 ? formatAmountWithComma(b) : '-'}</td>
                <td style="text-align: right; padding: 3px 0;">${p > 0 ? formatAmountWithComma(p) : '-'}</td>
                <td style="text-align: right; padding: 3px 0; font-weight: bold;">${formatAmountWithComma(Math.abs(running))}</td>
            </tr>
        `;
    });

    const html = `
        <div style="width: 78mm; font-family: monospace, sans-serif; font-size: 11px; color: #000; padding: 5px; line-height: 1.3;">
            <div style="text-align: center; border-bottom: 1px dashed #000; padding-bottom: 5px; margin-bottom: 5px;">
                <h3 style="margin: 0; font-size: 14px; font-weight: bold;">MAA MOTORS</h3>
                <p style="margin: 0; font-size: 9px;">মাইজভাণ্ডার রোড, চট্টগ্রাম</p>
                <p style="margin: 0; font-size: 9px;">মোবাইল: 01819-189402</p>
            </div>
            <div style="border-bottom: 1px dashed #000; padding-bottom: 4px; margin-bottom: 4px; font-size: 10px;">
                <div><strong>গ্রাহক:</strong> ${cleanName}</div>
                <div><strong>A/C:</strong> ${accNo} | <strong>ফোন:</strong> ${phone}</div>
            </div>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="border-bottom: 1px solid #000; font-size: 10px;">
                        <th style="text-align: left; padding: 2px 0;">তারিখ</th>
                        <th style="text-align: right; padding: 2px 0;">বিল</th>
                        <th style="text-align: right; padding: 2px 0;">জমা</th>
                        <th style="text-align: right; padding: 2px 0;">ব্যালেন্স</th>
                    </tr>
                </thead>
                <tbody>${rowsHtml}</tbody>
            </table>
            <div style="border-top: 1px dashed #000; margin-top: 5px; padding-top: 4px; text-align: right; font-weight: bold;">
                বর্তমান ব্যালেন্স: ৳ ${formatAmountWithComma(Math.abs(running))}
            </div>
        </div>
    `;

    executePrint(html);
}

export function printSingleTransactionReceipt(txn) {
    const cleanName = cleanCustomerName(txn.customerName || 'গ্রাহক');
    const amt = Number(txn.paid || txn.bill || 0);
    const isPaid = Number(txn.paid) > 0;

    const html = `
        <div style="font-family: 'Hind Siliguri', 'Inter', sans-serif; max-width: 650px; margin: 20px auto; padding: 25px; border: 2px solid #0f172a; border-radius: 12px; background: #fff; color: #0f172a;">
            <div style="text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 10px; margin-bottom: 15px;">
                <h2 style="margin: 0; font-size: 22px; font-weight: 900;">মা মোটরস (MAA MOTORS)</h2>
                <p style="margin: 2px 0; font-size: 12px; color: #475569;">মাইজভাণ্ডার রোড, নানুপুর, চট্টগ্রাম | ০১৮১৯-১৮৯৪০২</p>
                <div style="display: inline-block; background: #f1f5f9; padding: 4px 14px; border-radius: 6px; font-weight: 800; margin-top: 4px; font-size: 12px;">
                    ${isPaid ? 'জমা রশিদ (Money Receipt)' : 'বিল ভাউচার (Invoice Voucher)'}
                </div>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 15px;">
                <div>
                    <div><strong>গ্রাহকের নাম:</strong> ${cleanName}</div>
                    <div style="margin-top: 3px;"><strong>পেমেন্ট মেথড:</strong> ${txn.receivedFrom || txn.receivedType || 'Cash'}</div>
                </div>
                <div style="text-align: right;">
                    <div><strong>ভাউচার নং:</strong> <span style="font-family: monospace; font-weight: bold; color: #1e40af;">${txn.voucherNo || '-'}</span></div>
                    <div style="margin-top: 3px;"><strong>তারিখ:</strong> ${formatAppDate(txn.date)}</div>
                </div>
            </div>
            <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 15px; text-align: center; margin-bottom: 20px;">
                <span style="font-size: 12px; color: #64748b; font-weight: bold;">মোট পরিশোধিত টাকা</span>
                <h1 style="margin: 5px 0; font-size: 28px; font-weight: 900; color: ${isPaid ? '#059669' : '#dc2626'}; font-family: sans-serif;">৳ ${formatAmountWithComma(amt)}</h1>
                <p style="margin: 0; font-size: 12px; font-style: italic; color: #334155;">(${numberToBanglaWords(amt)})</p>
            </div>
            <div style="margin-top: 40px; display: flex; justify-content: space-between; font-size: 11px; font-weight: bold; color: #475569; padding: 0 20px;">
                <div>গ্রাহকের স্বাক্ষর</div>
                <div>আদায়কারীর স্বাক্ষর</div>
            </div>
        </div>
    `;

    executePrint(html);
}

export function printCustomerListA4(customers) {
    let rows = '';
    customers.forEach((c, i) => {
        rows += `
            <tr style="border-bottom: 1px solid #cbd5e1; font-size: 11px;">
                <td style="padding: 6px;">${i + 1}</td>
                <td style="padding: 6px; font-family: monospace; font-weight: bold;">${c.accountNo || '-'}</td>
                <td style="padding: 6px; font-weight: bold;">${cleanCustomerName(c.name)}</td>
                <td style="padding: 6px; font-family: monospace;">${c.phone || '-'}</td>
                <td style="padding: 6px;">${c.zone || '-'}</td>
                <td style="padding: 6px; text-align: right; font-weight: bold; color: ${Number(c.totalDue) > 0 ? '#dc2626' : '#059669'};">৳ ${formatAmountWithComma(c.totalDue || 0)}</td>
            </tr>
        `;
    });

    const html = `
        <div style="font-family: 'Hind Siliguri', 'Inter', sans-serif; padding: 20px;">
            <div style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 15px;">
                <h2 style="margin: 0; font-size: 20px; font-weight: 900;">মা মোটরস - কাস্টমার তালিকা</h2>
                <p style="margin: 2px 0; font-size: 11px;">তারিখ: ${formatAppDate(new Date().toISOString().split('T')[0])} | মোট কাস্টমার: ${customers.length} জন</p>
            </div>
            <table style="width: 100%; border-collapse: collapse; border: 1px solid #cbd5e1;">
                <thead>
                    <tr style="background: #f1f5f9; border-bottom: 2px solid #000; font-size: 11px;">
                        <th style="padding: 6px; text-align: left;">ক্র.নং</th>
                        <th style="padding: 6px; text-align: left;">A/C No</th>
                        <th style="padding: 6px; text-align: left;">কাস্টমারের নাম</th>
                        <th style="padding: 6px; text-align: left;">মোবাইল নম্বর</th>
                        <th style="padding: 6px; text-align: left;">জোন</th>
                        <th style="padding: 6px; text-align: right;">বর্তমান ব্যালেন্স</th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        </div>
    `;

    executePrint(html);
}

function executePrint(html) {
    const printContainer = document.getElementById('print-receipt-container');
    if (!printContainer) return;
    printContainer.innerHTML = html;
    printContainer.classList.remove('hidden');
    window.print();
    setTimeout(() => {
        printContainer.classList.add('hidden');
        printContainer.innerHTML = '';
    }, 1000);
}
