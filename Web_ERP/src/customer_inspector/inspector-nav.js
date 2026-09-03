import { getSortedInspectorCustomers, findCustomerIndexByQuery } from './inspector-calc.js';
import { getOrCreateInspectorModal, renderInspectorCard } from './inspector-ui.js';

let isInspectorOpen = false;
let currentInspectorIndex = 0;
let inspectorCustomers = [];

/**
 * Initializes listeners for search input and keyboard events
 */
export function initInspectorNav() {
    const modal = getOrCreateInspectorModal();
    const input = document.getElementById('inspector-query-input');

    if (input) {
        input.addEventListener('input', (e) => {
            const q = e.target.value;
            if (!q || !q.trim()) return;
            const idx = findCustomerIndexByQuery(inspectorCustomers, q);
            if (idx !== -1) {
                currentInspectorIndex = idx;
                renderCurrent();
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                openCurrentCustomerLedger();
            } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                nextInspectorCustomer();
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                prevInspectorCustomer();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                closeCustomerInspector();
            }
        });
    }

    // Global Keydown Handler when modal is active
    window.addEventListener('keydown', (e) => {
        if (!isInspectorOpen) return;

        if (e.key === 'Escape') {
            e.preventDefault();
            closeCustomerInspector();
        } else if (document.activeElement?.id !== 'inspector-query-input') {
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                nextInspectorCustomer();
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                prevInspectorCustomer();
            } else if (e.key === 'Enter') {
                e.preventDefault();
                openCurrentCustomerLedger();
            }
        }
    });
}

function renderCurrent() {
    if (inspectorCustomers.length === 0) {
        renderInspectorCard(null, 0, 0);
        return;
    }
    const current = inspectorCustomers[currentInspectorIndex];
    renderInspectorCard(current, currentInspectorIndex, inspectorCustomers.length);
}

/**
 * Opens the inspector modal
 * @param {string} initialQuery Optional initial A/C no, phone or name
 */
export function openCustomerInspector(initialQuery = '') {
    const modal = getOrCreateInspectorModal();
    const box = document.getElementById('inspector-card-box');
    const input = document.getElementById('inspector-query-input');

    inspectorCustomers = getSortedInspectorCustomers();
    isInspectorOpen = true;

    if (initialQuery) {
        const found = findCustomerIndexByQuery(inspectorCustomers, initialQuery);
        currentInspectorIndex = found !== -1 ? found : 0;
    } else if (currentInspectorIndex >= inspectorCustomers.length) {
        currentInspectorIndex = 0;
    }

    modal.classList.remove('hidden');
    requestAnimationFrame(() => {
        box.classList.remove('scale-95', 'opacity-0');
        box.classList.add('scale-100', 'opacity-100');
    });

    if (input) {
        input.value = initialQuery || '';
        input.focus();
        input.select();
    }

    renderCurrent();
}

/**
 * Closes the inspector modal
 */
export function closeCustomerInspector() {
    const modal = document.getElementById('customer-inspector-modal');
    const box = document.getElementById('inspector-card-box');
    if (!modal || !box) return;

    isInspectorOpen = false;
    box.classList.remove('scale-100', 'opacity-100');
    box.classList.add('scale-95', 'opacity-0');
    setTimeout(() => modal.classList.add('hidden'), 150);
}

export function nextInspectorCustomer() {
    if (inspectorCustomers.length === 0) return;
    currentInspectorIndex = (currentInspectorIndex + 1) % inspectorCustomers.length;
    renderCurrent();
}

export function prevInspectorCustomer() {
    if (inspectorCustomers.length === 0) return;
    currentInspectorIndex = (currentInspectorIndex - 1 + inspectorCustomers.length) % inspectorCustomers.length;
    renderCurrent();
}

export function openCurrentCustomerLedger() {
    const current = inspectorCustomers[currentInspectorIndex];
    if (current) {
        inspectorOpenLedger(current.id);
    }
}

export function inspectorOpenLedger(custId) {
    if (!custId) return;
    closeCustomerInspector();

    if (typeof window.navigate === 'function') {
        window.navigate('ledger', { custId });
    } else if (typeof window.navigateTo === 'function') {
        window.navigateTo('ledger', { custId });
    }
}
