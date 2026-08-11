// --- Statement Module (Modular Architecture) ---
import { renderStatementUI } from './statement/statement-ui.js';
import { loadStatementData as loadStatementDataCalc, setStmtPresetDate as setStmtPresetDateCalc, quickCollectPaymentFromStmt as quickCollectPaymentFromStmtCalc, sendStmtReminderSMS as sendStmtReminderSMSCalc, sendStmtReminderWhatsApp as sendStmtReminderWhatsAppCalc } from './statement/statement-calc.js';

let currentStatementData = [], currentOpeningBalance = 0, currentCustomerInfo = {}, currentFinalBalance = 0;
const stateRef = {
    get currentStatementData() { return currentStatementData; },
    set currentStatementData(v) { currentStatementData = v; },
    get currentOpeningBalance() { return currentOpeningBalance; },
    set currentOpeningBalance(v) { currentOpeningBalance = v; },
    get currentCustomerInfo() { return currentCustomerInfo; },
    set currentCustomerInfo(v) { currentCustomerInfo = v; },
    get currentFinalBalance() { return currentFinalBalance; },
    set currentFinalBalance(v) { currentFinalBalance = v; }
};

export function renderStatement(container, params) {
    renderStatementUI(container, params, stateRef, { loadStatementData });
}

export async function loadStatementData() {
    return loadStatementDataCalc(stateRef);
}

export function setStmtPresetDate(type) {
    return setStmtPresetDateCalc(type, { loadStatementData });
}

export async function quickCollectPaymentFromStmt() {
    return quickCollectPaymentFromStmtCalc(stateRef, { loadStatementData });
}

export async function sendStmtReminderSMS() {
    return sendStmtReminderSMSCalc(stateRef);
}

export async function sendStmtReminderWhatsApp() {
    return sendStmtReminderWhatsAppCalc(stateRef);
}

export function clearStatementFilter() {
    const s = document.getElementById('stmt-start-date');
    const e = document.getElementById('stmt-end-date');
    if (s) s.value = '';
    if (e) e.value = '';
    loadStatementData();
}

export function toggleStmtFilterCollapse() {
    document.getElementById('stmt-filter-grid')?.classList.toggle('hidden');
}

export async function printStatement() {
    const customNote = document.getElementById('stmt-custom-note')?.value || '';
    const { printStatement: printFn } = await import('./statement-print.js');
    return await printFn(currentCustomerInfo, currentOpeningBalance, currentStatementData, customNote);
}

// Global API Bindings
if (typeof window !== 'undefined') {
    window.clearStatementFilter = clearStatementFilter;
    window.toggleStmtFilterCollapse = toggleStmtFilterCollapse;
    window.setStmtPresetDate = setStmtPresetDate;
    window.quickCollectPaymentFromStmt = quickCollectPaymentFromStmt;
    window.sendStmtReminderSMS = sendStmtReminderSMS;
    window.sendStmtReminderWhatsApp = sendStmtReminderWhatsApp;
    window.loadStatementData = loadStatementData;
    window.printStatement = printStatement;
}
