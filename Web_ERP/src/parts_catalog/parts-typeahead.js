import { searchParts } from './parts-state.js';
import { formatAmountWithComma } from '../utils.js';

let activeDropdownIndex = null;
let currentHighlightedIndex = 0;
let currentMatches = [];

/**
 * Handle input event on invoice item description field
 * @param {number} rowIndex Invoice item row index
 * @param {HTMLInputElement} inputEl The input element being typed in
 */
export function handleInvoiceItemDescInput(rowIndex, inputEl) {
    const query = (inputEl.value || '').trim();
    const dropdownEl = document.getElementById(`parts-typeahead-dropdown-${rowIndex}`);
    const hintEl = document.getElementById(`price-hint-${rowIndex}`);
    if (!dropdownEl) return;

    // Reset floor price metadata if user changes description away from selected part
    if (inputEl.dataset.selectedName && inputEl.value !== inputEl.dataset.selectedName) {
        delete inputEl.dataset.selectedName;
        delete inputEl.dataset.partId;
        delete inputEl.dataset.floorPrice;
        delete inputEl.dataset.askingPrice;
        if (hintEl) hintEl.classList.add('hidden');
    }

    if (query.length < 2) {
        dropdownEl.classList.add('hidden');
        dropdownEl.innerHTML = '';
        activeDropdownIndex = null;
        return;
    }

    const matches = searchParts(query).slice(0, 8); // Top 8 matches
    currentMatches = matches;
    currentHighlightedIndex = 0;

    if (matches.length === 0) {
        dropdownEl.classList.add('hidden');
        dropdownEl.innerHTML = '';
        activeDropdownIndex = null;
        return;
    }

    activeDropdownIndex = rowIndex;

    dropdownEl.innerHTML = matches.map((item, idx) => {
        const models = Array.isArray(item.popularModels) ? item.popularModels.slice(0, 3).join(', ') : (item.popularModels || '');
        const years = (item.yearStart && item.yearEnd) ? ` (${item.yearStart}—${item.yearEnd})` : '';
        const cleanName = (item.memoOriginalName || item.nameBn || '').replace(/\s*\([a-zA-Z0-9\s\/\-\.]+\)\s*$/, '').trim();
        return `
            <div id="typeahead-item-${rowIndex}-${idx}" 
                 class="typeahead-row p-2.5 hover:bg-slate-800/80 cursor-pointer border-b border-slate-800/60 last:border-b-0 transition-colors flex items-center justify-between gap-2 ${idx === 0 ? 'bg-slate-800/40' : ''}" 
                 onclick="window.partsTypeahead.selectItem(${rowIndex}, ${idx})">
                <div class="min-w-0 flex-1">
                    <div class="text-xs font-bold text-white truncate flex items-center gap-1.5">
                        <span>${cleanName}</span>
                        ${item.secretCode ? `<span class="text-[9px] font-mono px-1 rounded bg-purple-500/20 text-purple-300 font-bold">[${item.secretCode}]</span>` : ''}
                    </div>
                    <div class="text-[10px] text-slate-400 font-mono mt-0.5 truncate flex items-center gap-2">
                        <span class="text-blue-400 font-bold">${item.id}</span>
                        ${item.oemPartNumber && item.oemPartNumber !== 'OEM N/A' ? `<span class="text-slate-600">•</span><span class="text-slate-300">${item.oemPartNumber}</span>` : ''}
                        ${models ? `<span class="text-slate-600">•</span><span class="text-amber-300 font-sans">${models}${years}</span>` : ''}
                    </div>
                    ${item.mismatchWarning ? `<div class="text-[9px] text-amber-400 font-bold truncate mt-0.5"><i class="fa-solid fa-triangle-exclamation text-[8px] mr-1"></i>${item.mismatchWarning}</div>` : ''}
                </div>
                <div class="text-right shrink-0">
                    <div class="text-xs font-black text-emerald-400">৳ ${formatAmountWithComma(item.askingPrice || 0)}</div>
                    <div class="text-[9px] font-bold text-red-400">ফ্লোর: ৳ ${formatAmountWithComma(item.floorPrice || 0)}</div>
                    <div class="text-[9px] text-slate-400 font-bold">${item.defaultUnit || 'পিছ'}</div>
                </div>
            </div>
        `;
    }).join('');

    dropdownEl.classList.remove('hidden');
}

/**
 * Select a part item from the typeahead dropdown
 * @param {number} rowIndex Row index
 * @param {number} matchIndex Match index in currentMatches
 */
export function selectTypeaheadPart(rowIndex, matchIndex) {
    if (!currentMatches || !currentMatches[matchIndex]) return;
    const part = currentMatches[matchIndex];

    const descInput = document.getElementById(`inv-item-desc-${rowIndex}`);
    const unitSelect = document.getElementById(`inv-item-unit-${rowIndex}`);
    const rateInput = document.getElementById(`inv-item-rate-${rowIndex}`);
    const dropdownEl = document.getElementById(`parts-typeahead-dropdown-${rowIndex}`);
    const hintEl = document.getElementById(`price-hint-${rowIndex}`);

    // Strictly clean Bengali description as written in physical shop memos (e.g. 'Axio নিউ রেক খোলা')
    // NEVER append models, years, or English brackets to the customer memo / invoice text!
    let cleanDesc = part.memoOriginalName || part.nameBn || '';
    cleanDesc = cleanDesc.replace(/\s*\([a-zA-Z0-9\s\/\-\.]+\)\s*$/, '').trim();

    if (descInput) {
        descInput.value = cleanDesc;
        descInput.dataset.selectedName = cleanDesc;
        descInput.dataset.partId = part.id;
        descInput.dataset.floorPrice = part.floorPrice || 0;
        descInput.dataset.askingPrice = part.askingPrice || 0;
    }
    if (unitSelect) {
        // Map unit to select options
        if (part.defaultUnit === 'জোড়া' || part.defaultUnit === 'Pair') unitSelect.value = 'Set';
        else if (part.defaultUnit === 'সেট' || part.defaultUnit === 'Set') unitSelect.value = 'Set';
        else unitSelect.value = 'Pcs';
    }
    if (rateInput) {
        rateInput.value = formatAmountWithComma(part.askingPrice || 0);
    }

    // Update global invoice item state if available
    if (window.updateInvoiceItem) {
        if (descInput) window.updateInvoiceItem(rowIndex, 'desc', descInput);
        if (unitSelect) window.updateInvoiceItem(rowIndex, 'unit', unitSelect);
        if (rateInput) window.updateInvoiceItem(rowIndex, 'rate', rateInput);
    }

    // Show price hint with floor guidance AND vehicle fitment / mismatch warning on screen
    if (hintEl) {
        const models = Array.isArray(part.popularModels) ? part.popularModels.join(', ') : (part.popularModels || '');
        const years = (part.yearStart && part.yearEnd) ? `${part.yearStart}—${part.yearEnd}` : '';
        const fitmentText = [models, years].filter(Boolean).join(' • ');

        let memoTrailHtml = '';
        if (Array.isArray(part.memoHistory) && part.memoHistory.length > 0) {
            const memoTags = part.memoHistory.map(m => `মেমো #${m.memoNoBn || m.memoNo}: ৳${formatAmountWithComma(m.rate || 0)}`).join(' • ');
            memoTrailHtml = `
                <span class="text-slate-600">•</span>
                <button type="button" 
                        onclick="window.partsCatalogActions && window.partsCatalogActions.showMemoHistory('${part.id}')" 
                        class="text-amber-300 hover:text-amber-200 font-bold underline decoration-dotted flex items-center gap-1 cursor-pointer" 
                        title="ক্লিক করে মেমো দর প্রমাণ ও আসল ছবি দেখুন">
                    <i class="fa-solid fa-receipt text-[8px]"></i>
                    <span>${memoTags}</span>
                </button>
            `;
        }

        hintEl.innerHTML = `
            <div class="flex flex-wrap items-center gap-2 text-[10px] bg-slate-900 border border-slate-700/80 px-2.5 py-1.5 rounded-lg mt-1 shadow-sm">
                <span class="text-amber-400 font-bold"><i class="fa-solid fa-shield-halved text-[9px] mr-1"></i>ফ্লোর দর: ৳${formatAmountWithComma(part.floorPrice || 0)}</span>
                <span class="text-slate-600">•</span>
                <span class="text-emerald-400 font-bold">আস্কিং: ৳${formatAmountWithComma(part.askingPrice || 0)}</span>
                ${memoTrailHtml}
                ${fitmentText ? `<span class="text-slate-600">•</span><span class="text-sky-300 font-semibold"><i class="fa-solid fa-car-side text-[9px] mr-1"></i>${fitmentText}</span>` : ''}
                ${part.mismatchWarning ? `<span class="text-slate-600">•</span><span class="text-amber-300 font-bold"><i class="fa-solid fa-triangle-exclamation text-[9px] mr-1"></i>${part.mismatchWarning}</span>` : ''}
                ${part.singlePiecePrice && part.singlePiecePrice !== part.askingPrice ? `<span class="text-slate-600">•</span><span class="text-slate-300">১ পিছ: ৳${formatAmountWithComma(part.singlePiecePrice)}</span>` : ''}
            </div>
        `;
        hintEl.classList.remove('hidden');
    }

    if (dropdownEl) {
        dropdownEl.classList.add('hidden');
        dropdownEl.innerHTML = '';
    }
    activeDropdownIndex = null;
}

/**
 * Keyboard Navigation for Typeahead (ArrowUp, ArrowDown, Enter, Escape)
 */
export function handleInvoiceItemKeyDown(rowIndex, event) {
    const dropdownEl = document.getElementById(`parts-typeahead-dropdown-${rowIndex}`);
    if (!dropdownEl || dropdownEl.classList.contains('hidden') || !currentMatches.length) return;

    if (event.key === 'ArrowDown') {
        event.preventDefault();
        currentHighlightedIndex = (currentHighlightedIndex + 1) % currentMatches.length;
        updateHighlight(rowIndex);
    } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        currentHighlightedIndex = (currentHighlightedIndex - 1 + currentMatches.length) % currentMatches.length;
        updateHighlight(rowIndex);
    } else if (event.key === 'Enter') {
        event.preventDefault();
        selectTypeaheadPart(rowIndex, currentHighlightedIndex);
    } else if (event.key === 'Escape') {
        dropdownEl.classList.add('hidden');
        activeDropdownIndex = null;
    }
}

function updateHighlight(rowIndex) {
    const rows = document.querySelectorAll(`#parts-typeahead-dropdown-${rowIndex} .typeahead-row`);
    rows.forEach((row, idx) => {
        row.classList.toggle('bg-slate-800/80', idx === currentHighlightedIndex);
        row.classList.toggle('bg-slate-800/40', idx !== currentHighlightedIndex);
    });
}

// Global click outside listener to close dropdown
document.addEventListener('click', (e) => {
    if (activeDropdownIndex !== null) {
        const container = document.getElementById(`inv-item-row-container-${activeDropdownIndex}`);
        if (container && !container.contains(e.target)) {
            const dropdownEl = document.getElementById(`parts-typeahead-dropdown-${activeDropdownIndex}`);
            if (dropdownEl) dropdownEl.classList.add('hidden');
            activeDropdownIndex = null;
        }
    }
});

// Global binding
window.partsTypeahead = {
    handleInput: handleInvoiceItemDescInput,
    handleKeyDown: handleInvoiceItemKeyDown,
    selectItem: selectTypeaheadPart
};
