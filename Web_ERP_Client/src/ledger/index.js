import { getLedgerUIHTML } from './ledger-ui.js';
import { initLedger, onLedgerCustomerSelect, filterLedgerDateRange, handlePrintStatement, handleExportExcel } from './ledger-logic.js';

export function renderLedger(container, params = {}) {
    if (!container) return;
    container.innerHTML = getLedgerUIHTML();
    initLedger(params);

    window.onLedgerCustomerChange = onLedgerCustomerSelect;
    window.filterLedgerRows = filterLedgerDateRange;
    window.printLedgerStatement = handlePrintStatement;
    window.exportLedgerExcel = handleExportExcel;
}
