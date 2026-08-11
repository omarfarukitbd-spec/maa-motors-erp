/**
 * --- EXPENSE BARREL FILE ---
 */
import { renderExpenses, loadRecentExpenses, changeExpensePage } from './expense/expense-ui.js';
import { saveExpense, deleteExpense, editExpense, handleCategoryChange } from './expense/expense-actions.js';
import { generateExpenseReport } from './expense/expense-statement.js';
import { promptSecurityPin } from './utils.js';

// Export for main navigation
export { renderExpenses };

// Maintain Global compatibility for HTML events (onclick="saveExpense()")
window.saveExpense = saveExpense;
window.deleteExpense = deleteExpense;
window.editExpense = editExpense;
window.handleCategoryChange = handleCategoryChange;
window.loadRecentExpenses = loadRecentExpenses;
window.changeExpensePage = changeExpensePage;
window.generateExpenseReport = generateExpenseReport;
window.promptSecurityPin = promptSecurityPin; // Barrel reference for guard
