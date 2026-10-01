import { PartsCatalogDAO } from './parts-dao.js';

/**
 * Global In-Memory Cache and Search Engine for Auto Parts Catalog
 */
let cachedParts = [];
let catalogListenerUnsubscribe = null;
let isCacheLoaded = false;

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
 * Initialize cache with real-time listener
 */
export function initPartsCatalogCache(onUpdateCallback = null) {
    if (catalogListenerUnsubscribe) {
        if (typeof onUpdateCallback === 'function') {
            onUpdateCallback(cachedParts);
        }
        return;
    }

    catalogListenerUnsubscribe = PartsCatalogDAO.listen((parts) => {
        setPartsCatalogCache(parts);
        if (typeof onUpdateCallback === 'function') {
            onUpdateCallback(parts);
        }
    });
}

/**
 * Unsubscribe listener on view change
 */
export function unsubscribePartsCatalog() {
    if (catalogListenerUnsubscribe) {
        catalogListenerUnsubscribe();
        catalogListenerUnsubscribe = null;
    }
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
