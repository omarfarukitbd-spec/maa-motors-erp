import { getExpenseUIHTML } from './expense-ui.js';
import { initExpenses, loadExpensesByDate, filterExpenses, handleExportExpenseExcel } from './expense-logic.js';
import { toDBDate } from '../utils.js';

export function renderExpenses(container) {
    if (!container) return;
    container.innerHTML = getExpenseUIHTML();
    initExpenses();

    window.onExpenseDateChange = (val) => {
        if (!val) return;
        const dbDate = toDBDate(val);
        loadExpensesByDate(dbDate);
    };

    window.filterExpenseList = filterExpenses;
    window.exportExpenseExcel = handleExportExpenseExcel;
}
