/**
 * App State for Boss / Client Portal
 */
export const AppState = {
    currentView: 'dashboard',
    currentUser: null,
    currentUserRole: 'Boss',
    currentUserEmail: 'owner@maamotors.com',
    customerCache: [],
    selectedCustomerId: null,
    selectedCustomer: null,
    lastActiveTime: Date.now()
};

window.AppState = AppState;
