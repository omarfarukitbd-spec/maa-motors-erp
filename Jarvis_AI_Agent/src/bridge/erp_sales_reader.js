import { db } from '../config.js';
import { collection, getDocs } from 'firebase/firestore';
import { safeRound, getTodayLocalDateString } from './erp_bridge.js';

/**
 * 📊 ERP Sales Reader — Sales Turnover, Invoices & Top Buyers
 */

/**
 * Get Total Sales Turnover for a given period (default 30 days)
 * Answers: "এই মাসে মোট কত টাকার মাল বিক্রি হলো?" / "চলতি সপ্তাহে কত বিক্রি হলো?"
 */
export async function getPeriodSalesTurnover(days = 30, customStartDate = null, customEndDate = null) {
    try {
        const d = new Date();
        const endDate = customEndDate || getTodayLocalDateString();
        const startDateObj = new Date(d.getTime() - days * 24 * 60 * 60 * 1000);
        const startDate = customStartDate || startDateObj.toISOString().split('T')[0];

        const txnsSnap = await getDocs(collection(db, 'transactions'));
        let totalSalesSum = 0;
        let invoiceCount = 0;
        const buyerSet = new Set();
        const activeDates = new Set();

        txnsSnap.forEach(doc => {
            const t = doc.data();
            const date = t.date || '';
            if (date < startDate || date > endDate) return;

            // Exclude opening vouchers
            const v = String(t.voucherNo || '').trim().toUpperCase();
            if (v === 'OPENING' || v === 'OPEN' || v === 'প্রারম্ভিক ব্যালেন্স' || v === 'প্রারম্ভিক জের') return;

            const bill = Number(t.bill || 0);
            if (isNaN(bill) || bill <= 0) return;

            totalSalesSum = safeRound(totalSalesSum + bill);
            invoiceCount += 1;
            if (t.customerId) buyerSet.add(t.customerId);
            if (date) activeDates.add(date);
        });

        const activeDays = activeDates.size || 1;
        const dailyAverageSales = safeRound(totalSalesSum / activeDays);

        return {
            success: true,
            type: 'sales_turnover',
            days,
            startDate,
            endDate,
            totalSalesSum,
            invoiceCount,
            buyingCustomersCount: buyerSet.size,
            dailyAverageSales
        };
    } catch (err) {
        console.error('[ERPSalesReader] getPeriodSalesTurnover error:', err);
        return { success: false, error: err.message };
    }
}

/**
 * Get Today's or Date-wise Sales Invoices
 * Answers: "আজকে কার কার কাছে কত টাকার মাল বিক্রি হলো?" / "আজকে কয়টা চালান হয়েছে?"
 */
export async function getTodaySalesInvoices(targetDate = null) {
    const date = targetDate || getTodayLocalDateString();
    try {
        const txnsSnap = await getDocs(collection(db, 'transactions'));
        const invoices = [];
        let todayTotalBills = 0;

        txnsSnap.forEach(doc => {
            const t = doc.data();
            if (t.date !== date) return;

            const v = String(t.voucherNo || '').trim().toUpperCase();
            if (v === 'OPENING' || v === 'OPEN' || v === 'প্রারম্ভিক ব্যালেন্স' || v === 'প্রারম্ভিক জের') return;

            const bill = Number(t.bill || 0);
            if (isNaN(bill) || bill <= 0) return;

            todayTotalBills = safeRound(todayTotalBills + bill);
            invoices.push({
                id: doc.id,
                customerName: t.customerName || 'অজানা কাস্টমার',
                customerId: t.customerId || '',
                voucherNo: t.voucherNo || '',
                amount: bill,
                currentDue: safeRound(t.currentDue || 0),
                notes: t.notes || ''
            });
        });

        return {
            success: true,
            type: 'today_sales',
            date,
            todayTotalBills,
            invoiceCount: invoices.length,
            invoices
        };
    } catch (err) {
        console.error('[ERPSalesReader] getTodaySalesInvoices error:', err);
        return { success: false, error: err.message };
    }
}

/**
 * Get Top Buying Customers by Invoice Volume
 * Answers: "এই মাসের সেরা ৫ জন ক্রেতা কে কে?" / "সবচেয়ে বেশি টাকার মাল কে নিয়েছে?"
 */
export async function getTopBuyingCustomers(limitCount = 5, days = 30) {
    try {
        const d = new Date();
        const endDate = getTodayLocalDateString();
        const startDateObj = new Date(d.getTime() - days * 24 * 60 * 60 * 1000);
        const startDate = startDateObj.toISOString().split('T')[0];

        const [txnsSnap, custSnap] = await Promise.all([
            getDocs(collection(db, 'transactions')),
            getDocs(collection(db, 'customers'))
        ]);

        const custMeta = new Map();
        custSnap.forEach(doc => {
            const c = doc.data();
            custMeta.set(doc.id, {
                name: c.name || 'অজ্ঞাত',
                address: c.address || '',
                zone: c.zone || '',
                totalDue: safeRound(c.totalDue || 0)
            });
        });

        const buyerAgg = new Map();
        txnsSnap.forEach(doc => {
            const t = doc.data();
            const date = t.date || '';
            if (date < startDate || date > endDate) return;

            const v = String(t.voucherNo || '').trim().toUpperCase();
            if (v === 'OPENING' || v === 'OPEN' || v === 'প্রারম্ভিক ব্যালেন্স' || v === 'প্রারম্ভিক জের') return;

            const bill = Number(t.bill || 0);
            if (isNaN(bill) || bill <= 0) return;

            const cId = t.customerId || t.customerName || 'unknown';
            const curr = buyerAgg.get(cId) || {
                customerId: t.customerId || '',
                customerName: t.customerName || 'অজানা কাস্টমার',
                totalPurchases: 0,
                invoiceCount: 0
            };
            curr.totalPurchases = safeRound(curr.totalPurchases + bill);
            curr.invoiceCount += 1;
            buyerAgg.set(cId, curr);
        });

        const buyersList = Array.from(buyerAgg.values()).map(b => {
            const meta = b.customerId ? custMeta.get(b.customerId) : null;
            return {
                ...b,
                customerName: meta?.name || b.customerName,
                address: meta?.address || '',
                zone: meta?.zone || '',
                currentDue: meta?.totalDue || 0
            };
        });

        buyersList.sort((a, b) => b.totalPurchases - a.totalPurchases);

        return {
            success: true,
            type: 'top_buyers',
            days,
            startDate,
            endDate,
            topBuyers: buyersList.slice(0, limitCount),
            totalBuyersCount: buyersList.length
        };
    } catch (err) {
        console.error('[ERPSalesReader] getTopBuyingCustomers error:', err);
        return { success: false, error: err.message };
    }
}
