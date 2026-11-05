import { calcSalesAndCosts, calcProfitSharing, calcCapitalWaterfall, calcCustomSection } from './container-calc.js';

export const DEFAULT_27_CONTAINER_DATA = {
    id: 'CONT-BATCH-27-2024-2025',
    title: '২৭ কন্টেইনার মাল বিক্রয় ও খরচের হিসাব (২০২৪/২০২৫)',
    subtitle: '(এমরান + আলতাফ + সজীব) চালানী',
    containerCount: 27,
    fiscalPeriod: '2024 - 2025',
    settlementDate: '25/02/2026',
    status: 'final',
    salesAndCosts: [
        { id: 'sc-1', desc: 'সর্বমোট মাল বিক্রয়', op: '+', amount: 165834596 },
        { id: 'sc-2', desc: 'সর্বমোট খরচ ও লেন্স', op: '-', amount: 144247620 }
    ],
    profitSharing: [
        { id: 'ps-1', partnerName: 'এমরান', shareType: 'লভ্যাংশ', percentage: 45, calculatedAmount: 9714140, manualOverride: true },
        { id: 'ps-2', partnerName: 'আলতাফ', shareType: 'লভ্যাংশ', percentage: 45, calculatedAmount: 9714140, manualOverride: true },
        { id: 'ps-3', partnerName: 'সজীব', shareType: 'ওয়ার্কিং', percentage: 10, calculatedAmount: 2158697, manualOverride: true }
    ],
    capitalSettlements: [
        { id: 'cs-1', desc: 'এমরান ২৭ কন্টেইনার মূলধন', op: '+', amount: 144247620 },
        { id: 'cs-2', desc: '২৫/০২/২৬ পর্যন্ত L/C মার্জিন ও ক্যাশ রিসিভ সজীব হইতে (-)', op: '-', amount: 140331825 },
        { id: 'cs-3', desc: 'জাহেদ ভাই মারফত আলতাফ দিবে (+)', op: '+', amount: 500000 },
        { id: 'cs-4', desc: 'সুরাইয়া মারফত আলতাফ দিবে (+)', op: '+', amount: 300000 }
    ],
    customSections: [],
    notes: '২৭ কন্টেইনারের মালামাল বিক্রয়, খরচ, পার্টনার লভ্যাংশ বণ্টন এবং এলসি মার্জিন ও ক্যাশ রিসিভ সমন্বয় হিসাব।'
};

let activeSettlement = JSON.parse(JSON.stringify(DEFAULT_27_CONTAINER_DATA));
let savedSettlementsList = [];

export function getActiveSettlement() {
    return activeSettlement;
}

export function setActiveSettlement(data) {
    if (data && typeof data === 'object') {
        activeSettlement = JSON.parse(JSON.stringify(data));
    }
    return activeSettlement;
}

export function setSavedSettlementsList(list) {
    savedSettlementsList = Array.isArray(list) ? list : [];
}

export function getSavedSettlementsList() {
    return savedSettlementsList;
}

export function createNewBlankSettlement() {
    const timestamp = Date.now();
    activeSettlement = {
        id: `CONT-${timestamp}`,
        title: 'নতুন কন্টেইনার মাল বিক্রয় ও খরচের হিসাব',
        subtitle: '(এমরান + আলতাফ + সজীব) চালানী',
        containerCount: 1,
        fiscalPeriod: `${new Date().getFullYear()} - ${new Date().getFullYear() + 1}`,
        settlementDate: new Date().toLocaleDateString('en-GB'),
        status: 'draft',
        salesAndCosts: [
            { id: `sc-${timestamp}-1`, desc: 'সর্বমোট মাল বিক্রয়', op: '+', amount: 0 },
            { id: `sc-${timestamp}-2`, desc: 'সর্বমোট খরচ ও লেন্স', op: '-', amount: 0 }
        ],
        profitSharing: [
            { id: `ps-${timestamp}-1`, partnerName: 'এমরান', shareType: 'লভ্যাংশ', percentage: 45, calculatedAmount: 0 },
            { id: `ps-${timestamp}-2`, partnerName: 'আলতাফ', shareType: 'লভ্যাংশ', percentage: 45, calculatedAmount: 0 },
            { id: `ps-${timestamp}-3`, partnerName: 'সজীব', shareType: 'ওয়ার্কিং', percentage: 10, calculatedAmount: 0 }
        ],
        capitalSettlements: [
            { id: `cs-${timestamp}-1`, desc: 'এমরান কন্টেইনার মূলধন', op: '+', amount: 0 },
            { id: `cs-${timestamp}-2`, desc: 'L/C মার্জিন ও ক্যাশ রিসিভ সজীব হইতে (-)', op: '-', amount: 0 }
        ],
        customSections: [],
        notes: ''
    };
    return activeSettlement;
}

/**
 * Re-calculate all three sections of the active settlement plus dynamic custom sections
 */
export function recalculateActiveSettlement() {
    // 1. Sales & Costs
    const sc = calcSalesAndCosts(activeSettlement.salesAndCosts);
    activeSettlement.totalSales = sc.totalSales;
    activeSettlement.totalExpenses = sc.totalExpenses;
    activeSettlement.netProfit = sc.netProfit;

    // 2. Profit Sharing
    const ps = calcProfitSharing(activeSettlement.netProfit, activeSettlement.profitSharing);
    activeSettlement.profitSharing = ps.partners;
    activeSettlement.totalDistributedProfit = ps.totalDistributed;
    activeSettlement.totalPercentage = ps.totalPercentage;
    activeSettlement.isPercentageBalanced = ps.isPercentageBalanced;

    // 3. Capital & Settlements
    const cs = calcCapitalWaterfall(activeSettlement.capitalSettlements);
    activeSettlement.capitalSettlements = cs.rows;
    activeSettlement.finalNetBalance = cs.finalNetBalance;

    // 4. Dynamic Custom Sections (৪, ৫...)
    if (!Array.isArray(activeSettlement.customSections)) {
        activeSettlement.customSections = [];
    }
    activeSettlement.customSections = activeSettlement.customSections.map(sec => {
        const res = calcCustomSection(sec.rows);
        return {
            ...sec,
            rows: res.rows,
            totalPlus: res.totalPlus,
            totalMinus: res.totalMinus,
            subtotal: res.subtotal
        };
    });

    return activeSettlement;
}

// Initial calculation on load
recalculateActiveSettlement();

