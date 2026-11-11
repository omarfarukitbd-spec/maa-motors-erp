/**
 * Nothi Book (নথি বুক) - Interactive Banner & Section Title Editor Modal
 * Provides a live WYSIWYG preview matching the Navy/Gold A4 print header bar.
 */

import Swal from 'sweetalert2';
import { NOTHI_BOOK_CATEGORIES } from './dubai-subbook-header.js';
import {
    DEFAULT_SECTION_BANNERS,
    BANNER_TONE_PALETTES,
    resolveSectionBannerConfig,
    renderNothiPrintBannerHtml,
    renderNothiScreenBannerBar
} from './dubai-section-banner.js';
import { DubaiRemittanceDAO } from './dubai-remittance-dao.js';
import { escapeHTML, showToast, promptSecurityPin, ensureOnline } from '../utils.js';

const PREFIX_PRESETS = ['কনসোলমেন্ট:', 'খাতার বিবরণ:', 'প্রজেক্ট:', 'হিসাব:', ''];
const STATUS_PRESETS = [
    'চলমান কনসোলমেন্ট (Active)',
    'চলমান রেজিস্টার (Active)',
    'সমন্বিত হিসাব',
    'সমাপ্ত (Closed)'
];

/**
 * Helper used by sub-book UI controllers to mount/refresh the banner bar and bind events cleanly.
 */
export function mountNothiBannerBar({
    slotId,
    sectionKey,
    getConsignment,
    getAllConsignments,
    selectId = '',
    showSelector = true,
    onConsignmentChange = null,
    onSaved = null
}) {
    const slot = document.getElementById(slotId);
    if (!slot) return;

    const consignment = typeof getConsignment === 'function' ? getConsignment() : null;
    const consignments = typeof getAllConsignments === 'function' ? getAllConsignments() : [];

    slot.innerHTML = renderNothiScreenBannerBar({
        sectionKey,
        consignment,
        consignments,
        selectId,
        showSelector
    });

    if (selectId && typeof onConsignmentChange === 'function') {
        const selectEl = document.getElementById(selectId);
        if (selectEl) {
            selectEl.onchange = (e) => onConsignmentChange(e.target.value);
        }
    }

    slot.querySelectorAll(`[data-edit-nothi-banner="${sectionKey}"]`).forEach(el => {
        el.onclick = () => {
            openNothiBannerEditorModal({
                sectionKey,
                consignment: typeof getConsignment === 'function' ? getConsignment() : consignment,
                allConsignments: typeof getAllConsignments === 'function' ? getAllConsignments() : consignments,
                onSaved
            });
        };
    });
}

/**
 * Opens a multi-section dark-mode modal with live Navy Print Banner WYSIWYG preview.
 */
export async function openNothiBannerEditorModal({
    sectionKey = 'remittance',
    consignment = null,
    allConsignments = [],
    onSaved = null,
    initialDrafts = null
}) {
    const consList = Array.isArray(allConsignments) && allConsignments.length > 0
        ? allConsignments
        : (consignment ? [consignment] : [{ id: 'CONSIGNMENT-01', name: 'মূল হিসাব সেশন ০১', status: 'active' }]);

    const targetConsignment = consignment || consList.find(c => c.status === 'active') || consList[0];
    const drafts = {};
    const dirtyKeys = new Set();

    NOTHI_BOOK_CATEGORIES.forEach(cat => {
        const resolved = resolveSectionBannerConfig(targetConsignment, cat.key);
        if (initialDrafts && initialDrafts[cat.key]) {
            drafts[cat.key] = { ...initialDrafts[cat.key] };
            dirtyKeys.add(cat.key);
        } else {
            drafts[cat.key] = {
                prefixLabel: resolved.prefixLabel,
                title: resolved.title,
                statusText: resolved.statusText,
                statusTone: resolved.statusTone
            };
        }
    });

    let activeTab = NOTHI_BOOK_CATEGORIES.some(c => c.key === sectionKey) ? sectionKey : 'remittance';

    const buildTabsHtml = () => NOTHI_BOOK_CATEGORIES.map(cat => {
        const isCurrent = cat.key === activeTab;
        const isDirty = dirtyKeys.has(cat.key);
        const cls = isCurrent
            ? 'bg-sky-600 text-white border-sky-400 shadow-sm'
            : 'bg-slate-900 text-slate-400 hover:text-white border-slate-700';
        return `
            <button type="button" data-banner-tab="${cat.key}"
                class="px-2.5 py-1.5 rounded-xl border text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${cls}">
                <i class="fa-solid ${cat.icon} text-[10px]"></i>
                <span>${escapeHTML(cat.shortLabel)}</span>
                ${isDirty ? '<span class="w-1.5 h-1.5 rounded-full bg-amber-400" title="পরিবর্তিত"></span>' : ''}
            </button>
        `;
    }).join('');

    const buildToneButtonsHtml = (selectedTone) => Object.entries(BANNER_TONE_PALETTES).map(([toneKey, p]) => {
        const isSel = toneKey === selectedTone;
        return `
            <button type="button" data-banner-tone="${toneKey}"
                class="px-2.5 py-1.5 rounded-xl border text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${isSel ? 'border-white text-white shadow-md scale-[1.02]' : 'border-slate-700 bg-slate-950 text-slate-400 hover:text-white'}"
                style="${isSel ? `background:${p.bgHex};` : ''}">
                <span class="w-2.5 h-2.5 rounded-full" style="background:${p.dotHex}; border:1px solid ${p.borderHex};"></span>
                <span>${escapeHTML(p.label)}</span>
            </button>
        `;
    }).join('');

    const result = await Swal.fire({
        title: '<span class="text-base sm:text-lg font-black text-white"><i class="fa-solid fa-pen-ruler text-sky-400 mr-2"></i>নথি বুক সেকশন ব্যানার কাস্টমাইজার</span>',
        width: '740px',
        background: '#0f172a',
        color: '#f8fafc',
        html: `
            <div class="text-left font-bn flex flex-col gap-3.5 text-xs">
                <!-- Section Switcher Pills -->
                <div class="bg-slate-950/70 border border-slate-800 rounded-2xl p-2.5 flex flex-col gap-2">
                    <div class="flex items-center justify-between text-[11px] text-slate-400 px-1">
                        <span><i class="fa-solid fa-layer-group text-sky-400 mr-1"></i>যে সেকশনের ব্যানার লিখবেন তা বেছে নিন:</span>
                        <span class="font-mono text-slate-500">${escapeHTML(targetConsignment?.id || 'CONSIGNMENT-01')}</span>
                    </div>
                    <div id="banner-modal-tabs" class="flex flex-wrap gap-1.5">${buildTabsHtml()}</div>
                </div>

                <!-- Live Navy Print Banner Preview -->
                <div class="bg-white rounded-2xl p-3 border border-slate-300 shadow-inner">
                    <div class="text-[10px] font-bold text-slate-500 mb-1.5 flex items-center justify-between">
                        <span><i class="fa-solid fa-eye text-sky-600 mr-1"></i>প্রিন্ট ও স্ক্রিন লাইভ প্রিভিউ:</span>
                        <span id="banner-modal-active-label" class="text-sky-700 font-black"></span>
                    </div>
                    <div id="nothi-banner-live-preview"></div>
                </div>

                <!-- Form Inputs -->
                <div class="bg-slate-950/60 border border-slate-800 rounded-2xl p-3.5 flex flex-col gap-3">
                    <div>
                        <div class="flex items-center justify-between mb-1">
                            <label class="text-[11px] font-bold text-slate-300">১. বাম পাশের প্রিফিক্স লেবেল (ঐচ্ছিক):</label>
                            <span class="text-[10px] text-slate-500">না চাইলে খালি রাখুন</span>
                        </div>
                        <input type="text" id="nothi-banner-prefix" maxlength="40" placeholder="যেমন: কনসোলমেন্ট: (অথবা খালি রাখুন)"
                            class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold focus:border-sky-500 outline-none">
                        <div class="flex flex-wrap gap-1.5 mt-1.5">
                            ${PREFIX_PRESETS.map(p => `
                                <button type="button" data-prefix-preset="${escapeHTML(p)}"
                                    class="px-2 py-0.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[10px] font-bold text-slate-300 cursor-pointer">
                                    ${p ? escapeHTML(p) : 'খালি রাখুন'}
                                </button>
                            `).join('')}
                        </div>
                    </div>

                    <div>
                        <div class="flex items-center justify-between mb-1">
                            <label class="text-[11px] font-bold text-amber-300">২. ব্যানারের মূল লেখা / শিরোনাম (সোনালী রঙের অংশ):</label>
                            <button type="button" id="btn-reset-banner-default" class="text-[10px] text-sky-400 hover:text-sky-300 font-bold cursor-pointer">
                                <i class="fa-solid fa-rotate-left mr-0.5"></i>ডিফল্ট লেখায় ফেরান
                            </button>
                        </div>
                        <input type="text" id="nothi-banner-title" maxlength="120" placeholder="এই সেকশনের ব্যানারে যা লেখা থাকবে..."
                            class="w-full bg-slate-900 border border-amber-500/40 rounded-xl px-3 py-2 text-xs sm:text-sm text-amber-200 font-bold focus:border-amber-400 outline-none">
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label class="block text-[11px] font-bold text-slate-300 mb-1">৩. ডান পাশের স্ট্যাটাস ব্যাজ লেখা:</label>
                            <input type="text" id="nothi-banner-status" maxlength="40" placeholder="যেমন: চলমান রেজিস্টার (Active)"
                                class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold focus:border-sky-500 outline-none">
                            <div class="flex flex-wrap gap-1 mt-1.5">
                                ${STATUS_PRESETS.map(s => `
                                    <button type="button" data-status-preset="${escapeHTML(s)}"
                                        class="px-2 py-0.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[10px] text-slate-300 cursor-pointer">
                                        ${escapeHTML(s)}
                                    </button>
                                `).join('')}
                            </div>
                        </div>

                        <div>
                            <label class="block text-[11px] font-bold text-slate-300 mb-1">৪. স্ট্যাটাস ব্যাজের রঙ:</label>
                            <div id="banner-modal-tones" class="flex flex-wrap gap-1.5"></div>
                        </div>
                    </div>
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-floppy-disk mr-1.5"></i>সংরক্ষণ করুন',
        cancelButtonText: 'বাতিল',
        confirmButtonColor: '#0284c7',
        cancelButtonColor: '#334155',
        didOpen: () => {
            const prefixEl = document.getElementById('nothi-banner-prefix');
            const titleEl = document.getElementById('nothi-banner-title');
            const statusEl = document.getElementById('nothi-banner-status');
            const previewEl = document.getElementById('nothi-banner-live-preview');
            const tabsEl = document.getElementById('banner-modal-tabs');
            const tonesEl = document.getElementById('banner-modal-tones');
            const activeLabelEl = document.getElementById('banner-modal-active-label');

            const syncPreviewAndTabs = () => {
                const cur = drafts[activeTab];
                const meta = NOTHI_BOOK_CATEGORIES.find(c => c.key === activeTab);
                if (activeLabelEl && meta) {
                    activeLabelEl.textContent = `${meta.title} (${meta.pageBadge})`;
                }
                if (previewEl) {
                    previewEl.innerHTML = renderNothiPrintBannerHtml(cur, true);
                }
                if (tabsEl) {
                    tabsEl.innerHTML = buildTabsHtml();
                    tabsEl.querySelectorAll('[data-banner-tab]').forEach(btn => {
                        btn.onclick = () => {
                            activeTab = btn.getAttribute('data-banner-tab');
                            loadActiveTabIntoInputs();
                        };
                    });
                }
                if (tonesEl) {
                    tonesEl.innerHTML = buildToneButtonsHtml(cur.statusTone);
                    tonesEl.querySelectorAll('[data-banner-tone]').forEach(btn => {
                        btn.onclick = () => {
                            drafts[activeTab].statusTone = btn.getAttribute('data-banner-tone');
                            dirtyKeys.add(activeTab);
                            syncPreviewAndTabs();
                        };
                    });
                }
            };

            const loadActiveTabIntoInputs = () => {
                const cur = drafts[activeTab];
                if (prefixEl) prefixEl.value = cur.prefixLabel || '';
                if (titleEl) titleEl.value = cur.title || '';
                if (statusEl) statusEl.value = cur.statusText || '';
                syncPreviewAndTabs();
            };

            const handleFieldInput = () => {
                drafts[activeTab].prefixLabel = prefixEl?.value ?? '';
                drafts[activeTab].title = titleEl?.value ?? '';
                drafts[activeTab].statusText = statusEl?.value ?? '';
                dirtyKeys.add(activeTab);
                syncPreviewAndTabs();
            };

            if (prefixEl) prefixEl.oninput = handleFieldInput;
            if (titleEl) titleEl.oninput = handleFieldInput;
            if (statusEl) statusEl.oninput = handleFieldInput;

            document.querySelectorAll('[data-prefix-preset]').forEach(btn => {
                btn.onclick = () => {
                    if (prefixEl) prefixEl.value = btn.getAttribute('data-prefix-preset') || '';
                    handleFieldInput();
                };
            });

            document.querySelectorAll('[data-status-preset]').forEach(btn => {
                btn.onclick = () => {
                    if (statusEl) statusEl.value = btn.getAttribute('data-status-preset') || '';
                    handleFieldInput();
                };
            });

            const resetBtn = document.getElementById('btn-reset-banner-default');
            if (resetBtn) {
                resetBtn.onclick = () => {
                    const def = DEFAULT_SECTION_BANNERS[activeTab] || DEFAULT_SECTION_BANNERS.remittance;
                    drafts[activeTab] = { ...def };
                    dirtyKeys.add(activeTab);
                    loadActiveTabIntoInputs();
                };
            }

            loadActiveTabIntoInputs();
        },
        preConfirm: () => {
            if (dirtyKeys.size === 0) {
                dirtyKeys.add(activeTab);
            }
            const updates = {};
            for (const key of dirtyKeys) {
                const item = drafts[key];
                const cleanTitle = String(item?.title || '').trim();
                if (!cleanTitle) {
                    const meta = NOTHI_BOOK_CATEGORIES.find(c => c.key === key);
                    Swal.showValidationMessage(`${meta?.title || key}-এর মূল শিরোনাম খালি রাখা যাবে না!`);
                    return false;
                }
                updates[key] = {
                    prefixLabel: String(item.prefixLabel || '').trim(),
                    title: cleanTitle,
                    statusText: String(item.statusText || '').trim(),
                    statusTone: item.statusTone || 'emerald'
                };
            }
            return updates;
        }
    });

    if (!result.isConfirmed || !result.value) return;
    if (!ensureOnline('নথি বুক সেকশন ব্যানার সংরক্ষণ')) return;

    const pinOk = await promptSecurityPin('নথি বুক সেকশন ব্যানার এডিট');
    if (!pinOk) {
        await openNothiBannerEditorModal({
            sectionKey: activeTab,
            consignment: targetConsignment,
            allConsignments: consList,
            onSaved,
            initialDrafts: result.value
        });
        return;
    }

    try {
        await DubaiRemittanceDAO.updateSectionBannersBatch(targetConsignment.id, result.value);
        showToast('নথি বুকের সেকশন ব্যানার সফলভাবে সংরক্ষিত হয়েছে', 'success');
        if (typeof onSaved === 'function') {
            onSaved(result.value);
        }
    } catch (e) {
        console.error('Error saving section banner:', e);
        showToast('ব্যানার সংরক্ষণ করতে সমস্যা হয়েছে', 'error');
    }
}
