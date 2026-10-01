import { PartsCatalogDAO } from './parts-dao.js';

/**
 * Global In-Memory Cache and Search Engine for Auto Parts Catalog
 */
let cachedParts = [];
let catalogListenerUnsubscribe = null;
let isCacheLoaded = false;
const activeUiListeners = new Set();

export function getPartsCatalogCache() {
    return cachedParts;
}

export function setPartsCatalogCache(parts) {
    cachedParts = Array.isArray(parts) ? parts : [];
    window.partsCatalogCache = cachedParts;
    isCacheLoaded = true;
}

export function isPartsCacheReady() {
    return isCacheLoaded && cachedParts.length > 0;
}

/**
 * Subscribe a UI callback to parts catalog updates
 * @param {Function} callback Function to call with updated parts
 * @returns {Function} Unsubscribe function
 */
export function subscribePartsCatalog(callback) {
    if (typeof callback === 'function') {
        activeUiListeners.add(callback);
        // Call immediately with existing cache if ready
        if (cachedParts.length > 0) {
            callback(cachedParts);
        }
    }
    return () => {
        activeUiListeners.delete(callback);
    };
}

/**
 * Initialize permanent background cache listener
 */
export function initPartsCatalogCache(onUpdateCallback = null) {
    if (typeof onUpdateCallback === 'function') {
        activeUiListeners.add(onUpdateCallback);
        if (cachedParts.length > 0) {
            onUpdateCallback(cachedParts);
        }
    }

    if (catalogListenerUnsubscribe) {
        return;
    }

    catalogListenerUnsubscribe = PartsCatalogDAO.listen((parts) => {
        setPartsCatalogCache(parts);
        activeUiListeners.forEach(cb => {
            try {
                cb(parts);
            } catch (err) {
                console.error('Error in parts catalog listener callback:', err);
            }
        });
    });
}

/**
 * Unsubscribe all listeners on logout or cleanup
 */
export function unsubscribePartsCatalog() {
    activeUiListeners.clear();
}

/**
 * Tokenized Multi-Field Fuzzy Search Engine
 * Matches Bengali name, aliases, OEM number, chassis, engine, and models.
 * @param {string} query Search keyword
 * @param {string} categoryFilter Optional category filter
 * @returns {Array} Matched and ranked items
 */
export function searchParts(query = '', categoryFilter = 'all') {
    if (!cachedParts || cachedParts.length === 0) return [];

    let filtered = cachedParts;

    if (categoryFilter && categoryFilter !== 'all') {
        filtered = filtered.filter(item => item.category === categoryFilter);
    }

    const cleanQuery = (query || '').trim().toLowerCase();
    if (!cleanQuery) return filtered;

    // Split query by whitespace to support multi-word search (e.g. "axio rack", "141 ব্রেক")
    const tokens = cleanQuery.split(/\s+/).filter(t => t.length > 0);

    return filtered.filter(item => {
        // Build a searchable corpus string for this part
        const id = (item.id || '').toLowerCase();
        const nameBn = (item.nameBn || '').toLowerCase();
        const nameEn = (item.nameEn || '').toLowerCase();
        const oem = (item.oemPartNumber || '').toLowerCase().replace(/[-\s]/g, '');
        const secret = (item.secretCode || '').toLowerCase();
        const aliases = Array.isArray(item.aliasesBn) ? item.aliasesBn.join(' ').toLowerCase() : '';
        const models = Array.isArray(item.popularModels) ? item.popularModels.join(' ').toLowerCase() : '';
        const chassis = Array.isArray(item.compatibleChassis) ? item.compatibleChassis.join(' ').toLowerCase() : '';
        const engines = Array.isArray(item.compatibleEngines) ? item.compatibleEngines.join(' ').toLowerCase() : '';

        const searchableText = `${id} ${nameBn} ${nameEn} ${oem} ${secret} ${aliases} ${models} ${chassis} ${engines}`;

        // Every token must be present in the searchable corpus
        return tokens.every(token => {
            const cleanToken = token.replace(/[-\s]/g, '');
            return searchableText.includes(token) || (cleanToken.length > 2 && searchableText.includes(cleanToken));
        });
    });
}

/**
 * Get distinct categories present in the cache
 */
export function getAvailableCategories() {
    const cats = new Set();
    cachedParts.forEach(p => {
        if (p.category) cats.add(p.category);
    });
    return Array.from(cats);
}
