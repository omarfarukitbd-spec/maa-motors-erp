import { getInvoiceUIHTML } from './invoice-ui.js';
import { loadInvoices, filterInvoices, handleExportInvoiceExcel } from './invoice-logic.js';
import { printSingleTransactionReceipt } from '../statement-print.js';

export function renderInvoice(container) {
    if (!container) return;
    container.innerHTML = getInvoiceUIHTML();
    loadInvoices();

    window.filterInvoiceList = filterInvoices;
    window.exportInvoiceExcel = handleExportInvoiceExcel;
    window.printSingleReceipt = (txn) => printSingleTransactionReceipt(txn);
}
