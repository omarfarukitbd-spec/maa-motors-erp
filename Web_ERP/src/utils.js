/**
 * --- UTILS BARREL FILE ---
 * Re-exports functions from modularized files for backward compatibility.
 */

// 1. Formatting & Helpers
export * from './utils/formatters.js';

// 2. Date Handling
export * from './utils/date-logic/date-converter.js';

// 3. Business Logic (SMS, Security, Currency Words)
export * from './utils/business-logic.js';

// 4. Printing Logic
export { renderSharedPrintHeader as renderPrintHeader } from './shared/print/print-header.js';
export * from './utils/print-paginator.js';
export * from './utils/smart-print-engine.js';

// 5. Error Handling
export * from './utils/error-handler.js';

// 6. UI Helpers & Omnisearch
export * from './utils/ui-helpers.js';
export * from './utils/omnisearch.js';
export * from './utils/address-suggestions.js';

// 7. Phone Dialer & Communication
export * from './utils/phone-dialer.js';
