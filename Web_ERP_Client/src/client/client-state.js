/**
 * Client Application State Management Module
 */

export let activeCustomer = null;
export let customerTransactions = [];
export let allCustomersCache = [];
export let appSettings = {};
export let previousViewName = 'dashboard';

export let unsubscribeCustomers = null;
export let unsubscribeToday = null;

export function setActiveCustomer(customer) {
    activeCustomer = customer;
}

export function setCustomerTransactions(txns) {
    customerTransactions = txns;
}

export function setAllCustomersCache(customers) {
    allCustomersCache = customers;
}

export function setAppSettings(settings) {
    appSettings = settings;
}

export function setPreviousViewName(name) {
    previousViewName = name;
}

export function setUnsubscribeCustomers(fn) {
    if (unsubscribeCustomers) unsubscribeCustomers();
    unsubscribeCustomers = fn;
}

export function setUnsubscribeToday(fn) {
    if (unsubscribeToday) unsubscribeToday();
    unsubscribeToday = fn;
}
