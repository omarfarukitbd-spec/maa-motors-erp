import { db } from '../config.js';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { safeRound } from './erp_bridge.js';

/**
 * 🗺️ ERP Zone & Market Reader — Geographic Due & Dormant Debtors Intelligence
 */

export async function getZoneWiseAnalytics() {
    try {
        const snap = await getDocs(collection(db, 'customers'));
        const zoneMap = new Map();

        snap.forEach(doc => {
            const c = doc.data();
            const zone = String(c.zone || 'সাধারণ জোন').trim() || 'সাধারণ জোন';
            const totalDue = Number(c.totalDue || 0);

            let group = zoneMap.get(zone);
            if (!group) {
                group = {
                    zoneName: zone,
                    customerCount: 0,
                    totalDue: 0,
                    totalAdvance: 0,
                    clearCount: 0,
                    topDebtor: null
                };
                zoneMap.set(zone, group);
            }

            group.customerCount += 1;
            if (totalDue > 0) {
                group.totalDue = safeRound(group.totalDue + totalDue);
                if (!group.topDebtor || totalDue > group.topDebtor.totalDue) {
                    group.topDebtor = {
                        id: doc.id,
                        name: c.name || 'অজ্ঞাত',
                        phone: c.phone || '',
                        address: c.address || '',
                        totalDue
                    };
                }
            } else if (totalDue < 0) {
                group.totalAdvance = safeRound(group.totalAdvance + Math.abs(totalDue));
            } else {
                group.clearCount += 1;
            }
        });

        const zonesList = Array.from(zoneMap.values()).sort((a, b) => b.totalDue - a.totalDue);
        const grandTotalDue = zonesList.reduce((acc, z) => safeRound(acc + z.totalDue), 0);

        return {
            success: true,
            type: 'zone_wise_analytics',
            zonesCount: zonesList.length,
            grandTotalDue,
            zones: zonesList
        };
    } catch (err) {
        console.error('[ERPZoneReader] getZoneWiseAnalytics error:', err);
        return { success: false, error: err.message };
    }
}

/**
 * Identify Dormant Customers (Customers with active due who haven't paid in X days)
 */
export async function getDormantCustomers(daysThreshold = 30) {
    try {
        const [custSnap, txnsSnap] = await Promise.all([
            getDocs(collection(db, 'customers')),
            getDocs(collection(db, 'transactions'))
        ]);

        // Find last payment date for each customer
        const lastPaymentMap = new Map();
        txnsSnap.forEach(doc => {
            const t = doc.data();
            const paid = Number(t.paid || 0);
            if (paid > 0 && t.date && t.customerId) {
                const existingDate = lastPaymentMap.get(t.customerId);
                if (!existingDate || t.date > existingDate) {
                    lastPaymentMap.set(t.customerId, t.date);
                }
            }
        });

        const now = new Date();
        const dormantCustomers = [];

        custSnap.forEach(doc => {
            const c = doc.data();
            const totalDue = Number(c.totalDue || 0);
            if (totalDue <= 0) return; // Only debtors

            const lastPaidDate = lastPaymentMap.get(doc.id);
            let daysSince = 999;
            if (lastPaidDate) {
                const diffTime = Math.abs(now - new Date(lastPaidDate));
                daysSince = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            }

            if (!lastPaidDate || daysSince >= daysThreshold) {
                dormantCustomers.push({
                    id: doc.id,
                    name: c.name || 'অজ্ঞাত',
                    phone: c.phone || '',
                    address: c.address || '',
                    zone: c.zone || '',
                    totalDue,
                    lastPaymentDate: lastPaidDate || 'কখনও দেননি',
                    daysSincePayment: daysSince === 999 ? 'অজ্ঞাত' : daysSince
                });
            }
        });

        dormantCustomers.sort((a, b) => b.totalDue - a.totalDue);

        return {
            success: true,
            type: 'dormant_customers',
            thresholdDays: daysThreshold,
            dormantCount: dormantCustomers.length,
            topDormant: dormantCustomers.slice(0, 25),
            totalDormantDue: dormantCustomers.reduce((acc, c) => safeRound(acc + c.totalDue), 0)
        };
    } catch (err) {
        console.error('[ERPZoneReader] getDormantCustomers error:', err);
        return { success: false, error: err.message };
    }
}

/**
 * Total Market Due and Portfolio Breakdown
 */
export async function getTotalMarketSummary() {
    try {
        const snap = await getDocs(collection(db, 'customers'));
        let totalDueSum = 0;
        let totalAdvanceSum = 0;
        let debtorCount = 0;
        let advanceCount = 0;
        let clearCount = 0;

        snap.forEach(doc => {
            const c = doc.data();
            const due = Number(c.totalDue || 0);
            if (due > 0) {
                totalDueSum = safeRound(totalDueSum + due);
                debtorCount += 1;
            } else if (due < 0) {
                totalAdvanceSum = safeRound(totalAdvanceSum + Math.abs(due));
                advanceCount += 1;
            } else {
                clearCount += 1;
            }
        });

        return {
            success: true,
            type: 'market_summary',
            totalCustomers: snap.size,
            debtorCount,
            advanceCount,
            clearCount,
            totalDueSum,
            totalAdvanceSum,
            netMarketDue: safeRound(totalDueSum - totalAdvanceSum)
        };
    } catch (err) {
        console.error('[ERPZoneReader] getTotalMarketSummary error:', err);
        return { success: false, error: err.message };
    }
}
