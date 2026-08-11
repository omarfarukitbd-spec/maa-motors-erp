// --- Invoice UI Module (Modular Architecture) ---
import { renderInvoiceUI } from './invoice-form-ui.js';
import { 
    renderInvoiceItems, updateCashTenderUI, calcItemTotals, calcInvoiceTotals, 
    loadInvoiceCustomers, filterInvoiceCustomerSearch, selectInvoiceCustomer, 
    clearInvoiceCustomerSearch, invoiceCustomerChanged, toggleInvoiceDiscMode, 
    toggleInvoiceRecvSection, setInvoiceRecvType 
} from './invoice-item-table.js';

export function renderInvoice(container, params = null) {
    renderInvoiceUI(container, params, { loadInvoiceCustomers, renderInvoiceItems });
}

export { 
    renderInvoiceItems, updateCashTenderUI, calcItemTotals, calcInvoiceTotals, 
    loadInvoiceCustomers, filterInvoiceCustomerSearch, selectInvoiceCustomer, 
    clearInvoiceCustomerSearch, invoiceCustomerChanged, toggleInvoiceDiscMode, 
    toggleInvoiceRecvSection, setInvoiceRecvType 
};

// Global API Bindings
if (typeof window !== 'undefined') {
    window.renderInvoiceItems = renderInvoiceItems;
    window.calcItemTotals = calcItemTotals;
    window.calcInvoiceTotals = calcInvoiceTotals;
    window.loadInvoiceCustomers = loadInvoiceCustomers;
    window.filterInvoiceCustomerSearch = filterInvoiceCustomerSearch;
    window.selectInvoiceCustomer = selectInvoiceCustomer;
    window.clearInvoiceCustomerSearch = clearInvoiceCustomerSearch;
    window.invoiceCustomerChanged = invoiceCustomerChanged;
    window.toggleInvoiceDiscMode = toggleInvoiceDiscMode;
    window.toggleInvoiceRecvSection = toggleInvoiceRecvSection;
    window.setInvoiceRecvType = setInvoiceRecvType;
}

document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('inv-cust-dropdown');
    const searchInput = document.getElementById('inv-cust-search-input');
    if (dropdown && !dropdown.contains(e.target) && e.target !== searchInput) {
        dropdown.classList.add('hidden');
    }
});
