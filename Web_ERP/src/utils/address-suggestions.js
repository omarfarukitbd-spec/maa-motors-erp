import { getCustomerCache } from '../customer/customer-state.js';
import { englishToBanglaPhonetic } from './address-phonetic.js';

export { englishToBanglaPhonetic };

export function extractUniqueAddressData(customers = []) {
    const custList = (customers && customers.length) ? customers : (getCustomerCache() || window.customerCache || []);
    
    const fullAddresses = new Set();
    const phraseCounts = {};

    custList.forEach(c => {
        if (!c.address || typeof c.address !== 'string') return;
        const rawAddr = c.address.trim();
        if (rawAddr.length >= 3) {
            fullAddresses.add(rawAddr);
        }

        const parts = rawAddr.split(/[,,\-।]/);
        parts.forEach(part => {
            const clean = part.trim();
            if (clean.length >= 2 && !/^\d+$/.test(clean)) {
                phraseCounts[clean] = (phraseCounts[clean] || 0) + 1;
            }
        });
    });

    const sortedPhrases = Object.keys(phraseCounts).sort((a, b) => phraseCounts[b] - phraseCounts[a]);
    return {
        fullAddresses: Array.from(fullAddresses),
        phrases: sortedPhrases
    };
}

export function populateAddressSuggestions(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;

    const chipsContainer = document.getElementById(inputId + '-chips');
    if (chipsContainer) chipsContainer.innerHTML = '';

    let dropdown = document.getElementById(inputId + '-dropdown');
    if (!dropdown) {
        dropdown = document.createElement('div');
        dropdown.id = inputId + '-dropdown';
        dropdown.className = 'hidden absolute left-0 right-0 top-full mt-1 bg-slate-900/95 border border-slate-700/90 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.95)] z-[999999] max-h-64 overflow-y-auto custom-scrollbar p-1.5 flex flex-col gap-1 backdrop-blur-2xl font-bn';
        if (input.parentNode) {
            input.parentNode.classList.add('relative');
            input.parentNode.appendChild(dropdown);
        }
    }

    const getRelevanceScore = (text, q, bn) => {
        if (!text) return 0;
        const lower = text.toLowerCase().trim();
        const bnClean = (bn || '').trim();
        
        if (lower === q || (bnClean && lower === bnClean)) return 1000;
        if (lower.startsWith(q) || (bnClean && lower.startsWith(bnClean))) return 500;
        
        const words = lower.split(/[\s,,\-।]+/);
        if (words.some(w => w.startsWith(q) || (bnClean && w.startsWith(bnClean)))) return 200;
        if (lower.includes(q) || (bnClean && lower.includes(bnClean))) return 50;
        
        if (typeof window.toBanglishName === 'function') {
            const banglish = window.toBanglishName(text).toLowerCase();
            if (banglish.startsWith(q)) return 150;
            if (banglish.includes(q)) return 30;
        }
        return 0;
    };

    const handleInput = () => {
        const val = input.value;
        const q = val.toLowerCase().trim();
        
        const lastCommaIdx = val.lastIndexOf(',');
        const activeSegment = (lastCommaIdx >= 0 ? val.slice(lastCommaIdx + 1) : val).trim();
        const activeSegmentLower = activeSegment.toLowerCase();

        const { fullAddresses, phrases } = extractUniqueAddressData();

        if (!q && !activeSegmentLower) {
            dropdown.classList.add('hidden');
            return;
        }

        const fullBnPhonetic = englishToBanglaPhonetic(val);
        const segmentBnPhonetic = englishToBanglaPhonetic(activeSegment || val);
        const isEnglish = /[a-zA-Z]/.test(val);

        let matchesFull = fullAddresses
            .map(a => ({ addr: a, score: getRelevanceScore(a, activeSegmentLower || q, segmentBnPhonetic) }))
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .map(item => item.addr);

        let matchesPhrases = phrases
            .map(p => ({ phrase: p, score: getRelevanceScore(p, activeSegmentLower || q, segmentBnPhonetic) }))
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .map(item => item.phrase);

        if (!isEnglish && matchesFull.length === 0 && matchesPhrases.length === 0) {
            dropdown.classList.add('hidden');
            return;
        }

        let html = '';

        if (isEnglish && fullBnPhonetic && fullBnPhonetic !== val) {
            html += `
                <div class="addr-suggest-item p-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 cursor-pointer transition-all flex items-center justify-between text-xs font-black text-emerald-400" onclick="window.selectAddressPhoneticFull('${inputId}', '${fullBnPhonetic.replace(/'/g, "\\'")}')">
                    <div class="flex items-center gap-2">
                        <i class="fa-solid fa-wand-magic-sparkles text-emerald-400 text-sm"></i>
                        <span>বাংলায় রূপান্তর: <strong>${fullBnPhonetic}</strong></span>
                    </div>
                    <span class="text-[10px] bg-emerald-500/30 px-2.5 py-1 rounded-lg font-mono text-emerald-300 border border-emerald-500/40">Enter / Tab</span>
                </div>
            `;
        }

        if (matchesFull.length > 0) {
            html += `<div class="px-2 py-1 text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-1 border-b border-slate-800/80"><i class="fa-solid fa-clock-rotate-left"></i> পূর্বের সম্পূর্ণ ঠিকানা (${matchesFull.length})</div>`;
            html += matchesFull.slice(0, 5).map(addr => `
                <div class="addr-suggest-item p-2 rounded-xl hover:bg-blue-600/20 hover:border-blue-500/30 cursor-pointer border border-transparent transition-all text-xs font-bold text-white flex items-center gap-2" onclick="window.selectAddressFull('${inputId}', '${addr.replace(/'/g, "\\'")}')">
                    <i class="fa-solid fa-location-dot text-amber-400 text-xs"></i>
                    <span>${addr}</span>
                </div>
            `).join('');
        }

        if (matchesPhrases.length > 0) {
            html += `<div class="px-2 py-1 text-[10px] font-black text-purple-400 uppercase tracking-widest flex items-center gap-1 border-b border-slate-800/80 mt-1"><i class="fa-solid fa-tags"></i> দ্রুত ঠিকানা ফ্রেজ (${matchesPhrases.length})</div>`;
            html += matchesPhrases.slice(0, 10).map(phrase => `
                <div class="addr-suggest-item p-2 rounded-xl hover:bg-purple-600/20 hover:border-purple-500/30 cursor-pointer border border-transparent transition-all text-xs font-bold text-slate-200 flex items-center justify-between gap-2" onclick="window.selectAddressPhrase('${inputId}', '${phrase.replace(/'/g, "\\'")}')">
                    <div class="flex items-center gap-2">
                        <i class="fa-solid fa-plus text-purple-400 text-[10px]"></i>
                        <span>${phrase}</span>
                    </div>
                    <span class="text-[10px] text-slate-500 font-normal">কমা সংযোগ</span>
                </div>
            `).join('');
        }

        dropdown.innerHTML = html;
        dropdown.classList.remove('hidden');
        dropdown.scrollTop = 0;

        input._addrActiveIdx = -1;
        const items = dropdown.querySelectorAll('.addr-suggest-item');
        if (items && items.length > 0) {
            highlightItem(items, -1);
        }
    };

    const handleKeydown = (e) => {
        const dropdown = document.getElementById(inputId + '-dropdown');
        if (!dropdown || dropdown.classList.contains('hidden')) return;

        const items = dropdown.querySelectorAll('.addr-suggest-item');
        if (!items || items.length === 0) return;

        let activeIdx = input._addrActiveIdx !== undefined ? input._addrActiveIdx : -1;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            activeIdx = activeIdx < 0 ? 0 : (activeIdx + 1) % items.length;
            input._addrActiveIdx = activeIdx;
            highlightItem(items, activeIdx);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            activeIdx = activeIdx <= 0 ? items.length - 1 : activeIdx - 1;
            input._addrActiveIdx = activeIdx;
            highlightItem(items, activeIdx);
        } else if (e.key === 'Enter') {
            if (activeIdx >= 0 && items[activeIdx]) {
                e.preventDefault();
                items[activeIdx].click();
                input._addrActiveIdx = -1;
            } else {
                dropdown.classList.add('hidden');
                input._addrActiveIdx = -1;
            }
        } else if (e.key === 'Tab') {
            if (activeIdx >= 0 && items[activeIdx]) {
                e.preventDefault();
                items[activeIdx].click();
                input._addrActiveIdx = -1;
            } else {
                dropdown.classList.add('hidden');
                input._addrActiveIdx = -1;
            }
        } else if (e.key === 'Escape') {
            dropdown.classList.add('hidden');
            input._addrActiveIdx = -1;
        }
    };

    function highlightItem(items, index) {
        items.forEach((item, idx) => {
            if (idx === index && index >= 0) {
                item.classList.add('bg-blue-600/40', 'border-blue-500', '!text-white', 'ring-2', 'ring-blue-500/50');
                item.scrollIntoView({ block: 'nearest' });
            } else {
                item.classList.remove('bg-blue-600/40', 'border-blue-500', '!text-white', 'ring-2', 'ring-blue-500/50');
            }
        });
    }

    input.removeEventListener('input', input._addrHandler || (() => {}));
    input.removeEventListener('focus', input._addrHandler || (() => {}));
    input.removeEventListener('keydown', input._addrKeyHandler || (() => {}));
    input._addrHandler = handleInput;
    input._addrKeyHandler = handleKeydown;
    input.addEventListener('input', handleInput);
    input.addEventListener('focus', handleInput);
    input.addEventListener('keydown', handleKeydown);
}

if (typeof window !== 'undefined') {
    window.selectAddressFull = (inputId, fullAddr) => {
        const input = document.getElementById(inputId);
        const dropdown = document.getElementById(inputId + '-dropdown');
        if (input) {
            input.value = fullAddr;
            input.focus();
            input.dispatchEvent(new Event('input', { bubbles: true }));
        }
        if (dropdown) dropdown.classList.add('hidden');
    };

    window.selectAddressPhrase = (inputId, phrase) => {
        const input = document.getElementById(inputId);
        const dropdown = document.getElementById(inputId + '-dropdown');
        if (input) {
            let val = input.value;
            const lastCommaIdx = val.lastIndexOf(',');
            if (lastCommaIdx >= 0) {
                input.value = val.slice(0, lastCommaIdx + 1).trim() + ' ' + phrase + ', ';
            } else {
                input.value = phrase + ', ';
            }
            input.focus();
            input.dispatchEvent(new Event('input', { bubbles: true }));
        }
        if (dropdown) dropdown.classList.add('hidden');
    };

    window.selectAddressPhoneticFull = (inputId, bnText) => {
        const input = document.getElementById(inputId);
        const dropdown = document.getElementById(inputId + '-dropdown');
        if (input) {
            input.value = bnText;
            input.focus();
            input.dispatchEvent(new Event('input', { bubbles: true }));
        }
        if (dropdown) dropdown.classList.add('hidden');
    };
}

document.addEventListener('click', (e) => {
    ['cust-address', 'dash-cust-address'].forEach(id => {
        const dropdown = document.getElementById(id + '-dropdown');
        const input = document.getElementById(id);
        if (dropdown && !dropdown.contains(e.target) && e.target !== input) {
            dropdown.classList.add('hidden');
        }
    });
});
