import {
    initInspectorNav,
    openCustomerInspector,
    closeCustomerInspector,
    nextInspectorCustomer,
    prevInspectorCustomer,
    inspectorOpenLedger
} from './inspector-nav.js';

export {
    openCustomerInspector,
    closeCustomerInspector,
    nextInspectorCustomer,
    prevInspectorCustomer,
    inspectorOpenLedger
};

/**
 * Initializes the Customer Inspector module and registers global window bindings
 */
export function initCustomerInspector() {
    initInspectorNav();

    // Bind to window for global access
    window.openCustomerInspector = openCustomerInspector;
    window.closeCustomerInspector = closeCustomerInspector;
    window.inspectorNext = nextInspectorCustomer;
    window.inspectorPrev = prevInspectorCustomer;
    window.inspectorOpenLedger = inspectorOpenLedger;
}
