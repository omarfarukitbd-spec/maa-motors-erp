/**
 * --- INVOICE BARREL FILE ---
 */
import { renderInvoice, loadInvoiceCustomers, invoiceCustomerChanged, toggleInvoiceDiscMode, toggleInvoiceRecvSection, setInvoiceRecvType } from './invoice/invoice-ui.js';
import * as Logic from './invoice/invoice-logic.js';

export { renderInvoice };

window.addInvoiceItemRow = Logic.addInvoiceItemRow;
window.removeInvoiceItem = Logic.removeInvoiceItem;
window.updateInvoiceItem = Logic.updateInvoiceItem;
window.applyHistoryPrice = Logic.applyHistoryPrice;
window.saveAndPrintInvoice = Logic.saveAndPrintInvoice;
window.setInvoiceTender = Logic.setInvoiceTender;
window.holdCurrentBill = Logic.holdCurrentBill;
window.resumeHoldBill = Logic.resumeHoldBill;

window.invoiceCustomerChanged = invoiceCustomerChanged;
window.toggleInvoiceDiscMode = toggleInvoiceDiscMode;
window.toggleInvoiceRecvSection = toggleInvoiceRecvSection;
window.setInvoiceRecvType = setInvoiceRecvType;
window.quickAddCustomerFromInvoice = async () => {
    if(window.quickAddCustomer) {
        await window.quickAddCustomer();
        await loadInvoiceCustomers();
    }
};
