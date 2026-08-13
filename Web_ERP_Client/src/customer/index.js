import { getCustomerUIHTML } from './customer-ui.js';
import { loadCustomersData, filterCustomers, printFilteredCustomers } from './customer-logic.js';

export function renderCustomers(container) {
    if (!container) return;
    container.innerHTML = getCustomerUIHTML();
    loadCustomersData();

    window.loadCustomers = loadCustomersData;
    window.filterCustomerList = filterCustomers;
    window.printFilteredCustomerList = printFilteredCustomers;
}
