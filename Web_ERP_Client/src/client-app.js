/**
 * BARREL FILE: Client Application Main Entry Point
 * Re-exports sub-modules from src/client/ according to AGENT_RULES.md (Rule 12).
 */

export {
    activeCustomer,
    allCustomersCache,
    appSettings,
    customerTransactions,
    previousViewName,
    setActiveCustomer,
    setAllCustomersCache,
    setAppSettings,
    setCustomerTransactions,
    setPreviousViewName
} from './client/client-state.js';

export {
    formatMoney,
    renderCustomerDirectoryView,
    renderCustomerLedgerView,
    renderDashboardView,
    renderDirectoryCardsHtml,
    renderLoginView,
    renderTodayCollectionView,
    renderTxnCardsHtml,
    renderWelcomeBossCard
} from './client/client-ui.js';

export {
    applyDatePreset,
    filterDirectoryList,
    handleOmniSearch,
    loadAndRenderCustomerLedger,
    triggerPrintCurrentStatement
} from './client/client-logic.js';
