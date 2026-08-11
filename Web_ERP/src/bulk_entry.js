/**
 * --- BULK ENTRY BARREL FILE ---
 */
import { renderBulkEntry, switchBulkTab, loadCustomerDatalist } from './bulk_entry/bulk-main.js';
import * as GridLogic from './bulk_entry/spreadsheet-grid.js';
import * as ExcelLogic from './bulk_entry/excel-processor.js';
import * as SaveLogic from './bulk_entry/bulk-save-engine.js';

// Export for main navigation
export { renderBulkEntry };

// Maintain Global compatibility for HTML events
window.switchBulkTab = switchBulkTab;
window.loadCustomerDatalist = loadCustomerDatalist;
window.addSpreadsheetRow = GridLogic.addSpreadsheetRow;
window.handleGridKey = GridLogic.handleGridKey;
window.saveSpreadsheetData = GridLogic.saveSpreadsheetData;
window.processExcelUpload = ExcelLogic.processExcelUpload;
window.executeBulkSave = GridLogic.saveSpreadsheetData; // Restore exact backup behavior
