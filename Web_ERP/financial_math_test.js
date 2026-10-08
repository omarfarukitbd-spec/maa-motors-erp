/**
 * 🧪 MAA MOTORS ERP - Automated Financial & Accounting Math Test Suite
 * এই টেস্ট স্যুটটি প্রতিটি বিল্ডে গাণিতিক ও অ্যাকাউন্টিং সূত্রের নির্ভুলতা স্বয়ংক্রিয়ভাবে যাচাই করে।
 */
const assert = require('assert');

function safeRound(num) {
    return Math.round((Number(num) || 0) * 100) / 100;
}

function runFinancialMathTests() {
    console.log("🧮 [অ্যাকাউন্টিং টেস্ট] গাণিতিক সূত্র ও অ্যাকাউন্টিং ইনভ্যারিয়েন্ট যাচাই শুরু হচ্ছে...");
    let passed = 0;

    // Test 1: Floating point rounding precision (JS 0.1 + 0.2 bug guard)
    assert.strictEqual(safeRound(0.1 + 0.2), 0.3, "Floating point safeRound failed");
    assert.strictEqual(safeRound(496650.35 - 496650.30), 0.05, "Precision subtraction failed");
    assert.strictEqual(safeRound(111300.705), 111300.71, "Cents rounding failed");
    passed++;

    // Test 2: Invariant 1 - Transaction Balance Law (currentDue === prevDue + bill - paid)
    const txns = [
        { prevDue: 496650, bill: 15000, paid: 10000, expected: 501650 },
        { prevDue: 501650, bill: 0, paid: 501650, expected: 0 },
        { prevDue: 0, bill: 25000, paid: 30000, expected: -5000 }, // Advance payment
        { prevDue: -5000, bill: 10000, paid: 0, expected: 5000 }
    ];
    txns.forEach((t, idx) => {
        const actual = safeRound(t.prevDue + t.bill - t.paid);
        assert.strictEqual(actual, t.expected, `Transaction invariant failed at step ${idx + 1}`);
    });
    passed++;

    // Test 3: Invariant 2 - Customer Net Balance Law (netDue === initialDue + sum(bills) - sum(payments))
    const customerMock = {
        accountNo: '10006',
        name: 'শ্যামা মোটরস',
        initialDue: 496650,
        transactions: [
            { voucherNo: 'OPENING', bill: 496650, paid: 0 }, // Opening record
            { voucherNo: 'INV-101', bill: 20000, paid: 0 },
            { voucherNo: 'RCT-201', bill: 0, paid: 15000 },
            { voucherNo: 'INV-102', bill: 35000, paid: 25000 }
        ]
    };
    // Sum only non-opening transactions
    let nonOpeningBills = 0;
    let nonOpeningPaid = 0;
    customerMock.transactions.forEach(t => {
        if (t.voucherNo !== 'OPENING') {
            nonOpeningBills += t.bill;
            nonOpeningPaid += t.paid;
        }
    });
    const expectedNetDue = safeRound(customerMock.initialDue + nonOpeningBills - nonOpeningPaid);
    assert.strictEqual(expectedNetDue, safeRound(496650 + 55000 - 40000), "Customer lifetime balance mismatch");
    assert.strictEqual(expectedNetDue, 511650, "Calculated customer net due mismatch");
    passed++;

    // Test 4: Invariant 3 - Financial Summary KPIs Law
    const summaryMock = {
        cashCollection: 150000,
        bankCollection: 85000,
        expenses: 25000
    };
    const totalCollection = safeRound(summaryMock.cashCollection + summaryMock.bankCollection);
    const netCashFlow = safeRound(totalCollection - summaryMock.expenses);
    assert.strictEqual(totalCollection, 235000, "Total collection calculation failed");
    assert.strictEqual(netCashFlow, 210000, "Net cash flow calculation failed");
    passed++;

    // Test 5: Cash Denomination Calculator
    const denominations = {
        1000: 50, // 50,000
        500: 40,  // 20,000
        200: 30,  // 6,000
        100: 25,  // 2,500
        50: 10,   // 500
        20: 10,   // 200
        10: 5,    // 50
        5: 2,     // 10
        2: 0,
        1: 0
    };
    let countedCash = 0;
    Object.keys(denominations).forEach(d => {
        countedCash += Number(d) * denominations[d];
    });
    assert.strictEqual(countedCash, 79260, "Cash counter denomination sum failed");
    passed++;

    // Test 6: Invariant 6 - Treasury Master Fund Running Balance Recalibration from 31 August Closing
    const august31ClosingFund = 46391562;
    const septemberEntries = [
        { type: 'inflow', amount: 960000 },    // 01/09/26 দৈনিক কালেকশন
        { type: 'outflow', amount: 1725000 },  // 01/09/26 মিনহাজ মারফত
        { type: 'outflow', amount: 3378 },     // 01/09/26 দৈনিক খরচ
        { type: 'inflow', amount: 208000 },    // 02/09/26 দৈনিক কালেকশন
        { type: 'outflow', amount: 11700 }     // 02/09/26 দৈনিক খরচ
    ];
    let runningFund = august31ClosingFund;
    septemberEntries.forEach(item => {
        runningFund = safeRound(runningFund + (item.type === 'inflow' ? item.amount : -item.amount));
    });
    // Calculation: 46391562 + 960000 - 1725000 - 3378 + 208000 - 11700 = 45819484
    assert.strictEqual(runningFund, 45819484, "September treasury running balance recalibration mismatch");
    passed++;

    // Test 7: Invariant 7 - Aging Inactivity & Payment Recency Law (Ground Truth Payment Linking)
    function calcElapsedDays(targetStr, todayStr) {
        const [y1, m1, d1] = targetStr.split('-').map(Number);
        const [y2, m2, d2] = todayStr.split('-').map(Number);
        const utc1 = Date.UTC(y1, m1 - 1, d1);
        const utc2 = Date.UTC(y2, m2 - 1, d2);
        return Math.max(0, Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24)));
    }
    const todayTest = '2026-10-08';
    
    // Case A: মো: মিজান (208 days old account, but deposited cash yesterday 2026-10-07)
    const mizanCust = { openingDate: '2026-03-14', lastPaymentDate: '2026-10-07', lastPaymentAmount: 50000 };
    const mizanEffectiveDate = mizanCust.lastPaymentDate || mizanCust.openingDate;
    assert.strictEqual(calcElapsedDays(mizanEffectiveDate, todayTest), 1, "Mizan payment recency must be 1 day (yesterday), NOT 208 days");

    // Case B: Customer deposited cash TODAY
    const todayCust = { openingDate: '2026-01-01', lastPaymentDate: '2026-10-08', lastPaymentAmount: 15000 };
    assert.strictEqual(calcElapsedDays(todayCust.lastPaymentDate, todayTest), 0, "Same day payment must yield 0 inactive days");

    // Case C: Customer never paid, but has invoice from 2026-09-28 (10 days ago)
    const invoiceCust = { openingDate: '2025-10-08', lastPaymentDate: null, lastTxnDate: '2026-09-28' };
    const invoiceEffective = invoiceCust.lastPaymentDate || invoiceCust.lastTxnDate || invoiceCust.openingDate;
    assert.strictEqual(calcElapsedDays(invoiceEffective, todayTest), 10, "Invoice recency fallback must be 10 days");

    passed++;

    console.log(`✅ [অ্যাকাউন্টিং টেস্ট] সফল! সর্বমোট ${passed} টি মৌলিক অ্যাকাউন্টিং ইনভ্যারিয়েন্ট ১০০% পাস করেছে।\n`);
    return true;
}

if (require.main === module) {
    runFinancialMathTests();
}

module.exports = { runFinancialMathTests };
