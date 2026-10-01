/**
 * Auto Parts Catalog Feature Module Barrel Export
 */
export { renderPartsCatalog } from './parts-catalog-ui.js';
export { PartsCatalogDAO } from './parts-dao.js';
export { 
    initPartsCatalogCache, 
    getPartsCatalogCache, 
    searchParts, 
    getAvailableCategories, 
    unsubscribePartsCatalog 
} from './parts-state.js';
export { 
    handleInvoiceItemDescInput, 
    selectTypeaheadPart, 
    handleInvoiceItemKeyDown 
} from './parts-typeahead.js';
export { 
    openPartModal, 
    promptDeletePart, 
    exportPartsToExcel, 
    promptBulkPriceShift 
} from './parts-catalog-actions.js';
