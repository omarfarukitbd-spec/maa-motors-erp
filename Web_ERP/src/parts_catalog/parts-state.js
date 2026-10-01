import { PartsCatalogDAO } from './parts-dao.js';
import { INITIAL_PARTS_CATALOG } from './initial-catalog-data.js';

/**
 * Global In-Memory Cache and Search Engine for Auto Parts Catalog
 */
let cachedParts = Array.isArray(INITIAL_PARTS_CATALOG) ? [...INITIAL_PARTS_CATALOG] : [];
let catalogListenerUnsubscribe = null;
let isCacheLoaded = true;
let isAutoSeeding = false;
const activeUiListeners = new Set();
window.partsCatalogCache = cachedParts;

export function getPartsCatalogCache() {
    return cachedParts;
}

export function setPartsCatalogCache(parts) {
    if (Array.isArray(parts) && parts.length > 0) {
        cachedParts = parts;
    } else if (cachedParts.length === 0 && Array.isArray(INITIAL_PARTS_CATALOG)) {
        cachedParts = [...INITIAL_PARTS_CATALOG];
    }
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
        const masterCount = Array.isArray(INITIAL_PARTS_CATALOG) ? INITIAL_PARTS_CATALOG.length : 0;
        
        // Enrich any parts missing memoHistory or needing wholesale price corridor upgrade
        const enriched = (Array.isArray(parts) ? parts : []).map(p => {
            const initItem = INITIAL_PARTS_CATALOG.find(i => i.id === p.id);
            if (initItem) {
                const isOldPrice = (initItem.id === 'PART-1001' && p.askingPrice < 239000);
                return {
                    ...p,
                    askingPrice: isOldPrice ? initItem.askingPrice : (p.askingPrice || initItem.askingPrice),
                    floorPrice: isOldPrice ? initItem.floorPrice : (p.floorPrice || initItem.floorPrice),
                    singlePiecePrice: isOldPrice ? initItem.singlePiecePrice : (p.singlePiecePrice || initItem.singlePiecePrice),
                    memoHistory: (p.memoHistory && p.memoHistory.length > 0) ? p.memoHistory : initItem.memoHistory,
                    memoReference: p.memoReference || initItem.memoReference
                };
            }
            return p;
        });

        const needsMemoUpgrade = enriched.length >= masterCount && parts && parts.some(p => !p.memoHistory || p.memoHistory.length === 0);
        const needsPriceUpgrade = parts && parts.some(p => p.id === 'PART-1001' && p.askingPrice < 239000);
        const needsUpgrade = needsMemoUpgrade || needsPriceUpgrade;

        if (enriched.length >= masterCount && !needsUpgrade) {
            setPartsCatalogCache(enriched);
        } else if (!isAutoSeeding && masterCount > 0) {
            isAutoSeeding = true;
            (async () => {
                try {
                    const count = await PartsCatalogDAO.seedBatch(INITIAL_PARTS_CATALOG);
                    console.log(`Auto-upgraded ${count} verified parts with wholesale corridor to Firestore`);
                } catch (err) {
                    console.warn('Auto-seed note:', err);
                } finally {
                    isAutoSeeding = false;
                }
            })();
            // Immediately render full 134 verified parts with wholesale corridor in memory & UI
            setPartsCatalogCache(INITIAL_PARTS_CATALOG);
        } else if (enriched.length > 0) {
            setPartsCatalogCache(enriched);
        }

        activeUiListeners.forEach(cb => {
            try {
                cb(cachedParts);
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
        const memoName = (item.memoOriginalName || '').toLowerCase();
        const nameEn = (item.nameEn || '').toLowerCase();
        const oem = (item.oemPartNumber || '').toLowerCase().replace(/[-\s]/g, '');
        const secret = (item.secretCode || '').toLowerCase();
        const aliases = Array.isArray(item.aliasesBn) ? item.aliasesBn.join(' ').toLowerCase() : (item.aliasesBn || '').toLowerCase();
        const models = Array.isArray(item.popularModels) ? item.popularModels.join(' ').toLowerCase() : (item.popularModels || '').toLowerCase();
        const chassis = Array.isArray(item.compatibleChassis) ? item.compatibleChassis.join(' ').toLowerCase() : (item.compatibleChassis || '').toLowerCase();
        const engines = Array.isArray(item.compatibleEngines) ? item.compatibleEngines.join(' ').toLowerCase() : (item.compatibleEngines || '').toLowerCase();
        const years = `${item.yearStart || ''} ${item.yearEnd || ''}`;

        const searchableText = `${id} ${nameBn} ${memoName} ${nameEn} ${oem} ${secret} ${aliases} ${models} ${chassis} ${engines} ${years}`;

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
