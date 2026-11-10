/**
 * Dubai Procurement & Weekly Audit - Module Entry Barrel File
 */

export { renderDubaiProcurement, unsubscribeDubaiAudits } from './dubai-audit-ui.js';
export { DubaiDAO } from './dubai-dao.js';
export { printDubaiAuditSheet } from './dubai-print.js';
export { DubaiRemittanceDAO } from './dubai-remittance-dao.js';
export { printDubaiRemittanceBook } from './dubai-remittance-print.js';
export { calculateConsignmentSummary } from './dubai-remittance-calc.js';
export { DubaiBDExpenseDAO } from './dubai-bd-expense-dao.js';
export { printDubaiBDExpenseBook } from './dubai-bd-expense-print.js';
export { calculateBDExpenseSummary, calculateConsolidatedCapEx } from './dubai-bd-expense-calc.js';

