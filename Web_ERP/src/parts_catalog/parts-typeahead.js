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
    if (!dropdownEl) return;

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
        const models = Array.isArray(item.popularModels) ? item.popularModels.slice(0, 3).join(', ') : '';
        return `
            <div id="typeahead-item-${rowIndex}-${idx}" 
                 class="typeahead-row p-2.5 hover:bg-slate-800/80 cursor-pointer border-b border-slate-800/60 last:border-b-0 transition-colors flex items-center justify-between gap-2 ${idx === 0 ? 'bg-slate-800/40' : ''}" 
                 onclick="window.partsTypeahead.selectItem(${rowIndex}, ${idx})">
                <div class="min-w-0 flex-1">
                    <div class="text-xs font-bold text-white truncate flex items-center gap-1.5">
                        <span>${item.nameBn}</span>
                        ${item.secretCode ? `<span class="text-[9px] font-mono px-1 rounded bg-purple-500/20 text-purple-300 font-bold">[${item.secretCode}]</span>` : ''}
                    </div>
                    <div class="text-[10px] text-slate-400 font-mono mt-0.5 truncate flex items-center gap-2">
                        <span class="text-blue-400 font-bold">${item.id}</span>
                        <span class="text-slate-600">•</span>
                        <span class="text-slate-300">${item.oemPartNumber || 'OEM N/A'}</span>
                        ${models ? `<span class="text-slate-600">•</span><span class="text-amber-300">${models}</span>` : ''}
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

    // Clean display description with popular model tag
    const modelTag = Array.isArray(part.popularModels) && part.popularModels.length > 0 
        ? ` (${part.popularModels.slice(0, 2).join(', ')})` 
        : '';
    const cleanDesc = `${part.nameBn}${modelTag}`;

    if (descInput) descInput.value = cleanDesc;
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
        window.updateInvoiceItem(rowIndex, 'desc', { value: cleanDesc });
        window.updateInvoiceItem(rowIndex, 'unit', { value: unitSelect ? unitSelect.value : 'Pcs' });
        window.updateInvoiceItem(rowIndex, 'rate', { value: part.askingPrice || 0 });
    }

    // Attach metadata to the row for floor validation
    if (descInput) {
        descInput.dataset.partId = part.id;
        descInput.dataset.floorPrice = part.floorPrice || 0;
        descInput.dataset.askingPrice = part.askingPrice || 0;
    }

    // Show price hint with floor guidance
    if (hintEl) {
        hintEl.innerHTML = `
            <div class="flex items-center gap-2 text-[10px] bg-slate-900 border border-slate-700/80 px-2.5 py-1 rounded-lg">
                <span class="text-amber-400 font-bold"><i class="fa-solid fa-shield-halved text-[9px] mr-1"></i>ফ্লোর দর: ৳${formatAmountWithComma(part.floorPrice || 0)}</span>
                <span class="text-slate-600">•</span>
                <span class="text-emerald-400 font-bold">আস্কিং: ৳${formatAmountWithComma(part.askingPrice || 0)}</span>
                ${part.singlePiecePrice ? `<span class="text-slate-600">•</span><span class="text-slate-300">১ পিছ: ৳${formatAmountWithComma(part.singlePiecePrice)}</span>` : ''}
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
