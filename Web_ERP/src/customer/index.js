import { initCustomerCache, getCustomerCache, lastVisibleCust, pageStackCust, currentCustPage, setCurrentCustPage, resetPagination } from './customer-state.js';
import { renderCustomers, renderCustomerRows } from './customer-ui.js';
import { saveNewCustomer, editCustomer, quickAddCustomer, resetAddCustomerForm } from './customer-actions.js';
import { deleteCustomer } from './customer-delete.js';
import { loadAllZones, loadCustomerPage, filterCustomerList, sendReminderSMS, handleZoneChange, printFilteredCustomerList, loadCustomersForDropdown } from './customer-handlers.js';
import { CustomerDAO, ZoneDAO } from '../dao.js';
import Swal from 'sweetalert2';
import { formatAmountWithComma } from '../utils.js';

import { triggerBulkReminderFlow } from './customer-bulk-messaging.js';
import { initCustomerHotkeys, showCustomerKeyboardGuide } from './customer-hotkeys.js';

export { renderCustomers, initCustomerCache, getCustomerCache, quickAddCustomer, triggerBulkReminderFlow, initCustomerHotkeys, showCustomerKeyboardGuide };

export async function loadCustomers() {
    initCustomerCache();
    loadAllZones();

    // Reset pagination
    resetPagination();

    loadCustomerPage();
}

export function changeCustomerPage(dir) {
    if (dir === 'next') setCurrentCustPage(currentCustPage + 1);
    else setCurrentCustPage(currentCustPage - 1);
    loadCustomerPage(dir);
}

export function openCustomerLedger(id) { window.navigate('ledger', { customerId: id }); }
export function openCustomerStatement(id, name, accountNo, phone, address) {
    window.navigate('statement', { customerId: id, customerName: name, accountNo: accountNo || '', customerPhone: phone || '', customerAddress: address || '' });
}

// Attach to window for HTML access
window.renderCustomers = renderCustomers;
window.loadCustomers = loadCustomers;
window.initCustomerCache = initCustomerCache;
window.getCustomerCache = getCustomerCache;
window.saveNewCustomer = saveNewCustomer;
window.editCustomer = editCustomer;
window.deleteCustomer = deleteCustomer;
window.filterCustomerList = filterCustomerList;
window.handleZoneChange = handleZoneChange;
window.sendReminderSMS = sendReminderSMS;
window.printFilteredCustomerList = printFilteredCustomerList;
window.changeCustomerPage = changeCustomerPage;
window.openCustomerLedger = openCustomerLedger;
window.openCustomerStatement = openCustomerStatement;
window.resetAddCustomerForm = resetAddCustomerForm;
window.loadAllZones = loadAllZones;
window.triggerBulkReminderFlow = triggerBulkReminderFlow;
import { populateAddressSuggestions } from '../utils/address-suggestions.js';

window.toggleAddCustomerForm = () => {
    const form = document.getElementById('add-customer-form');
    if (!form) return;
    form.classList.toggle('hidden');
    if (!form.classList.contains('hidden')) {
        resetAddCustomerForm();
        if (window.handleZoneChange) window.handleZoneChange();
        populateAddressSuggestions('cust-address', 'cust-address-datalist', 'cust-address-chips');
        setTimeout(() => {
            form.scrollIntoView({ behavior: 'smooth', block: 'start' });
            const nameInput = document.getElementById('cust-name');
            if (nameInput) nameInput.focus();
        }, 80);
    }
};

// Re-implement quickAddZone locally or import from actions if needed
window.quickAddZone = async function () {
    const { value: formValues } = await Swal.fire({
        title: 'নতুন জোন (অঞ্চল) যোগ করুন',
        html: `
            <div class="space-y-4 text-left p-1 font-bn">
                <div>
                    <label class="block text-[11px] font-black text-blue-400 uppercase tracking-widest mb-1 ml-1">জোনের নাম *</label>
                    <input id="sw-zn" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 text-sm transition-all" placeholder="যেমন: ঢাকা, চট্টগ্রাম">
                </div>
                <div>
                    <label class="block text-[11px] font-black text-blue-400 uppercase tracking-widest mb-1 ml-1">জোন কোড (ম্যানুয়াল) *</label>
                    <input id="sw-zc" type="number" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 text-sm transition-all" placeholder="যেমন: 1 বা 11">
                </div>
            </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'সেভ করুন',
        cancelButtonText: 'বাতিল',
        customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' },
        preConfirm: () => {
            const name = document.getElementById('sw-zn').value.trim();
            const code = document.getElementById('sw-zc').value.trim();
            if (!name || !code) {
                Swal.showValidationMessage('নাম ও কোড উভয়ই আবশ্যক!');
                return false;
            }
            return { name, code };
        }
    });

    if (formValues) {
        try {
            Swal.fire({ title: 'চেক করা হচ্ছে...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
            const existing = await ZoneDAO.getByCode(formValues.code);
            if (existing) {
                return Swal.fire('Error!', `জোন কোড "${formValues.code}" ইতিমধ্যে "${existing.name}" জোনের জন্য ব্যবহার করা হয়েছে!`, 'error');
            }
            await ZoneDAO.add({ name: formValues.name, code: formValues.code });
            Swal.fire('সফল!', `জোন "${formValues.name}" সফলভাবে তৈরি হয়েছে।`, 'success');
            loadAllZones();
        } catch (e) {
            console.error(e);
            Swal.fire('Error', 'জোন সেভ করা যায়নি: ' + (e.message || e), 'error');
        }
    }
};
