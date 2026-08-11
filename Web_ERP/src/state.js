/**
 * Global Application State
 * Separated to avoid circular dependencies between main.js and feature modules.
 */
export const AppState = {
    currentUserRole: null,
    currentUserEmail: null,
    currentView: 'dashboard',
    permissions: {},
    shopName: 'M/S. Maa Motors',
    shopOwner: 'Mohammed Amran',
};

window.AppState = AppState;
