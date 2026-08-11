import { CustomerDAO } from '../dao.js';
import { formatAmountWithComma } from '../utils.js';

// Pagination State for Customers
export let lastVisibleCust = null;
export let pageStackCust = [];
export let currentCustPage = 1;
export const custPageSize = 20;
export let isSearchingCust = false;

export let cachedCustomers = [];
export let cachedZones = [];
export let customerCacheListener = null;

import { populateAddressSuggestions } from '../utils/address-suggestions.js';

export function setLastVisibleCust(val) { lastVisibleCust = val; }
export function setCurrentCustPage(val) { currentCustPage = val; }
export function resetPagination() {
    lastVisibleCust = null;
    pageStackCust = [];
    currentCustPage = 1;
}
export function setIsSearchingCust(val) { isSearchingCust = val; }
export function setCachedCustomers(val) { cachedCustomers = val; }
export function setCachedZones(val) { cachedZones = val; }

export function getCustomerCache() {
    return cachedCustomers;
}

export function updateStatsUI() {
    const countBadge = document.getElementById('cust-count-badge');
    const dueBadge = document.getElementById('cust-total-due-badge');
    if (!countBadge || !dueBadge) return;

    let totalMarketDue = 0;
    cachedCustomers.forEach(data => {
        totalMarketDue += (Number(data.totalDue) || 0);
    });

    countBadge.innerText = cachedCustomers.length;
    dueBadge.innerText = "৳ " + formatAmountWithComma(totalMarketDue);
}

export function initCustomerCache() {
    if (customerCacheListener) {
        // Hardening: Always update UI with existing cache if listener is already active
        updateStatsUI();
        return;
    }

    customerCacheListener = CustomerDAO.listenToAll(customers => {
        setCachedCustomers(customers);
        window.customerCache = cachedCustomers;

        updateStatsUI();
        populateAddressSuggestions('cust-address', 'cust-address-datalist', 'cust-address-chips');
        populateAddressSuggestions('dash-cust-address', 'dash-cust-address-datalist', 'dash-cust-address-chips');

        if (isSearchingCust && document.getElementById('customer-list')) {
            if (window.filterCustomerList) window.filterCustomerList();
        }
    });
}
