/**
 * 🎯 DisambiguationManager — Smart Multi-Match Clarifier
 * When an entity search (customer, voucher, bank, etc.) produces multiple matches,
 * this manager maintains conversational state, formats spoken prompts, and resolves user responses.
 */

export class DisambiguationManager {
    constructor() {
        this.pending = null; // { type: 'customer', query: '...', options: [...], timestamp: Date.now() }
    }

    /**
     * Check if there is an active pending clarification awaiting user selection
     */
    hasPending() {
        if (!this.pending) return false;
        // Expire after 2 minutes of inactivity
        if (Date.now() - this.pending.timestamp > 120000) {
            this.clearPending();
            return false;
        }
        return true;
    }

    /**
     * Get active pending clarification
     */
    getPending() {
        return this.hasPending() ? this.pending : null;
    }

    /**
     * Clear pending state
     */
    clearPending() {
        this.pending = null;
    }

    /**
     * Create a new pending disambiguation session
     * @param {string} type - 'customer' | 'voucher' | 'bank'
     * @param {string} originalQuery - The user's search query
     * @param {Array} options - Array of matched objects
     * @param {string} intentAction - The intended action e.g. 'get_customer_due'
     */
    createPending(type, originalQuery, options, intentAction = 'get_customer_due') {
        this.pending = {
            type,
            originalQuery,
            options: options.slice(0, 5), // Max 5 options for cognitive clarity
            intentAction,
            timestamp: Date.now()
        };

        return this.formatClarificationPrompt(this.pending);
    }

    /**
     * Format a spoken and visual prompt asking the user to choose
     */
    formatClarificationPrompt(pending) {
        const { type, originalQuery, options } = pending;

        if (type === 'customer') {
            const countStr = options.length.toLocaleString('bn-BD');
            const spokenLines = options.map((c, idx) => {
                const num = (idx + 1).toLocaleString('bn-BD');
                const addr = c.address ? `, ${c.address}` : (c.zone ? `, ${c.zone}` : '');
                const due = Number(c.totalDue || 0);
                const dueTxt = due > 0 
                    ? `বকেয়া ${due.toLocaleString('bn-BD')} টাকা` 
                    : (due < 0 ? `অগ্রিম জমা ${Math.abs(due).toLocaleString('bn-BD')} টাকা` : 'পরিশোধিত');
                return `${num} নম্বর: ${c.name}${addr} (${dueTxt})`;
            }).join('। ');

            const spoken = `ভাইয়া, "${originalQuery}" নামে ${countStr}টি কাস্টমার পাওয়া গেছে। ${spokenLines}। আপনি কোন কাস্টমারের হিসাব দেখতে চান? এক, দুই নাকি তিন বলুন।`;

            return {
                spoken,
                data: {
                    type: 'disambiguation_options',
                    entityType: 'customer',
                    originalQuery,
                    options: options.map((c, idx) => ({
                        index: idx + 1,
                        id: c.id,
                        name: c.name,
                        accountNo: c.accountNo || '',
                        address: c.address || '',
                        zone: c.zone || '',
                        phone: c.phone || '',
                        totalDue: Number(c.totalDue || 0)
                    }))
                }
            };
        }

        // Generic fallback
        return {
            spoken: `ভাইয়া, "${originalQuery}" এর জন্য একাধিক তথ্য পাওয়া গেছে। আপনি নির্দিষ্ট কোনটি দেখতে চান বলুন।`,
            data: {
                type: 'disambiguation_options',
                entityType: type,
                originalQuery,
                options
            }
        };
    }

    /**
     * Attempt to resolve user input against the pending options
     * Supports:
     * - Numbers: "১", "২", "৩", "1", "2", "3"
     * - Ordinals: "প্রথমটা", "দ্বিতীয়টা", "তৃতীয়টা", "১ নম্বর", "এক", "দুই"
     * - Name substring / Area match: "মুরাদপুর", "রহিম মোটরস"
     * @param {string} userInput
     * @returns {Object|null} Resolved option or null
     */
    resolveInput(userInput) {
        if (!this.hasPending()) return null;

        const text = String(userInput || '').trim().toLowerCase();
        const { options } = this.pending;

        // 1. Direct Bengali Number Match: ১, ২, ৩, ৪, ৫
        const bnNumberMap = {
            '১': 1, 'এক': 1, 'প্রথম': 1, 'প্রথমটা': 1, '১টা': 1, '১ নম্বর': 1, '১ নং': 1,
            '২': 2, 'দুই': 2, 'দ্বিতীয়': 2, 'দ্বিতীয়টা': 2, '২টা': 2, '২ নম্বর': 2, '২ নং': 2,
            '৩': 3, 'তিন': 3, 'তৃতীয়': 3, 'তৃতীয়টা': 3, '৩টা': 3, '৩ নম্বর': 3, '৩ নং': 3,
            '৪': 4, 'চার': 4, 'চতুর্থ': 4, '৪টা': 4, '৪ নম্বর': 4, '৪ নং': 4,
            '৫': 5, 'পাঁচ': 5, 'পঞ্চম': 5, '৫টা': 5, '৫ নম্বর': 5, '৫ নং': 5
        };

        for (const [key, idx] of Object.entries(bnNumberMap)) {
            if (text === key || text.startsWith(key + ' ') || text.includes(key)) {
                if (options[idx - 1]) {
                    const chosen = options[idx - 1];
                    this.clearPending();
                    return chosen;
                }
            }
        }

        // 2. English Digits: 1, 2, 3, 4, 5
        const digitMatch = text.match(/^[#\s]*([1-5])(?:\s| নম্বর| নং|টা|$)/);
        if (digitMatch && digitMatch[1]) {
            const idx = parseInt(digitMatch[1], 10);
            if (options[idx - 1]) {
                const chosen = options[idx - 1];
                this.clearPending();
                return chosen;
            }
        }

        // 3. Name or Address/Zone Match
        for (const opt of options) {
            const optName = String(opt.name || '').toLowerCase();
            const optAddr = String(opt.address || '').toLowerCase();
            const optZone = String(opt.zone || '').toLowerCase();

            if (text.includes(optName) || optName.includes(text)) {
                this.clearPending();
                return opt;
            }
            if (optAddr && (text.includes(optAddr) || optAddr.includes(text))) {
                this.clearPending();
                return opt;
            }
            if (optZone && (text.includes(optZone) || optZone.includes(text))) {
                this.clearPending();
                return opt;
            }
        }

        return null;
    }
}

export const disambiguationManager = new DisambiguationManager();
