/**
 * --- EXCEL SYNC BARREL FILE ---
 */
import { downloadAdminExcelBackup } from './excel/excel-export.js';
import { uploadAdminExcelBackup } from './excel/excel-import.js';

// Export for main navigation/admin panel
export { downloadAdminExcelBackup, uploadAdminExcelBackup };

// Maintain Global compatibility for HTML onclick events
window.downloadAdminExcelBackup = downloadAdminExcelBackup;
window.uploadAdminExcelBackup = uploadAdminExcelBackup;
