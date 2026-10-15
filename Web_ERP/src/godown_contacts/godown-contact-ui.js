/**
 * godown-contact-ui.js
 * User Interface Grid and Interactive Management for Godown Logistics & Support Contacts
 */

import Swal from 'sweetalert2';
import { GodownContactDAO } from './godown-contact-dao.js';
import { extractUniqueCategories, getCategoryMeta, buildWhatsAppLink, buildCallLink } from './godown-contact-calc.js';
import { openGodownContactModal, promptDeleteGodownContact } from './godown-contact-modal.js';
import { executeBulkGodownGoogleSync, syncSingleGodownContactToGoogle } from './godown-google-sync.js';
import { escapeHTML } from '../utils.js';
import { showToast } from '../utils/ui-helpers.js';

let _activeCategory = 'all';
let _searchQuery = '';
let _allContacts = [];
let _unsubscribe = null;

export async function renderGodownContactDirectory(container) {
    if (!container) return;

    if (_unsubscribe) {
        _unsubscribe();
        _unsubscribe = null;
    }

    container.innerHTML = `
        <div class="space-y-3.5 animate-fade-in font-bn">
            <!-- Top Master Header Hub -->
            <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-xl space-y-3">
                <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                    <div class="flex items-center gap-2.5">
                        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600/30 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-lg shadow-sm">
                            <i class="fa-solid fa-address-book"></i>
                        </div>
                        <div>
                            <h2 class="text-base sm:text-lg font-black text-white flex items-center gap-2">
                                <span>গোডাউন লজিস্টিকস ও সহায়ক কন্টাক্ট ডিরেক্টরি</span>
                                <span class="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">Google Synced</span>
                            </h2>
                            <p class="text-[11px] text-slate-400">ভ্যান, পিকআপ, ট্রাক, কন্টেইনার ট্রেইলার, লেবার ও ওয়ার্কশপ কন্টাক্ট সার্বক্ষণিক হাতের নাগালে</p>
                        </div>
                    </div>

                    <!-- Top Action Buttons -->
                    <div class="flex items-center gap-2 flex-wrap w-full sm:w-auto">
                        <button id="g-c-clear-samples-btn" onclick="window.triggerClearSampleGodownContacts()" class="hidden px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-red-950/50 text-slate-400 hover:text-red-400 border border-slate-700/80 font-bold text-xs items-center gap-1.5 transition-all cursor-pointer" title="নমুনা (ডেমো) কন্টাক্টগুলো মুছে ফেলুন">
                            <i class="fa-solid fa-trash-can text-red-400"></i>
                            <span>নমুনা ডাটা মুছুন</span>
                        </button>
                        <button onclick="window.triggerBulkGodownGoogleSync()" class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white border border-slate-700 font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer" title="সকল কন্টাক্ট গুগলে সিঙ্ক করুন">
                            <i class="fa-brands fa-google text-cyan-400"></i>
                            <span>গুগল সিঙ্ক করুন</span>
                        </button>
                        <button onclick="window.openNewGodownContactModal()" class="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-xs shadow-lg shadow-cyan-600/30 flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer">
                            <i class="fa-solid fa-user-plus text-xs"></i>
                            <span>নতুন কন্টাক্ট যুক্ত করুন</span>
                        </button>
                    </div>
                </div>

                <!-- Search Bar Row -->
                <div class="relative flex items-center bg-slate-950 border border-slate-700/80 hover:border-slate-600 focus-within:!border-cyan-500 rounded-xl px-3.5 py-2 shadow-inner">
                    <i class="fa-solid fa-magnifying-glass text-xs text-slate-400 mr-2.5"></i>
                    <input type="text" id="g-c-search-input" placeholder="নাম, দোকান বা ব্যবসা প্রতিষ্ঠান, গাড়ির ধরন, ঠিকানা বা মোবাইল নম্বর দিয়ে খুঁজুন..." 
                        class="w-full bg-transparent text-white text-xs outline-none placeholder:text-slate-500 font-medium">
                    <button id="g-c-search-clear" class="hidden text-slate-400 hover:text-white text-xs ml-1 cursor-pointer p-1" onclick="window.clearGodownContactSearch()">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <!-- Category Chips Horizontal Scroll Bar (Full Width with Chevrons & Wheel Scroll) -->
                <div class="relative flex items-center gap-1.5 pt-0.5">
                    <button onclick="window.scrollGodownCategories('left')" class="hidden sm:flex shrink-0 w-7 h-7 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-400 hover:text-cyan-300 items-center justify-center text-[10px] border border-slate-700/80 cursor-pointer shadow-sm active:scale-95 transition-all" title="বামে স্ক্রোল করুন">
                        <i class="fa-solid fa-chevron-left"></i>
                    </button>

                    <div id="g-c-category-chips" class="flex-1 flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 text-xs scroll-smooth select-none">
                        <!-- Dynamic chips rendered by renderCategoryChips() -->
                    </div>

                    <button onclick="window.scrollGodownCategories('right')" class="hidden sm:flex shrink-0 w-7 h-7 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-400 hover:text-cyan-300 items-center justify-center text-[10px] border border-slate-700/80 cursor-pointer shadow-sm active:scale-95 transition-all" title="ডানে স্ক্রোল করুন">
                        <i class="fa-solid fa-chevron-right"></i>
                    </button>
                </div>
            </div>

            <!-- Contacts Cards Grid Container -->
            <div id="g-c-cards-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                <div class="col-span-full p-8 text-center bg-slate-900/40 rounded-2xl border border-slate-800 space-y-2">
                    <div class="inline-block animate-spin text-cyan-400 text-xl"><i class="fa-solid fa-circle-notch"></i></div>
                    <div class="text-xs text-slate-400 font-bold">কন্টাক্ট তালিকা লোড হচ্ছে...</div>
                </div>
            </div>
        </div>
    `;

    // Global window bridges
    window.scrollGodownCategories = (direction) => {
        const el = document.getElementById('g-c-category-chips');
        if (!el) return;
        const scrollAmount = direction === 'left' ? -220 : 220;
        el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    };
    window.openNewGodownContactModal = () => openGodownContactModal(null, _allContacts);
    window.openEditGodownContact = (id) => {
        const item = _allContacts.find(c => c.id === id);
        if (item) openGodownContactModal(item, _allContacts);
    };
    window.triggerDeleteGodownContact = (id) => {
        const item = _allContacts.find(c => c.id === id);
        if (item) promptDeleteGodownContact(item);
    };
    window.triggerSingleGoogleSync = async (id) => {
        showToast('গুগল কন্টাক্টসে সিঙ্ক হচ্ছে...', 'info');
        const res = await syncSingleGodownContactToGoogle(id);
        if (res.success) {
            showToast('গুগল কন্টাক্টসে সফলভাবে সিঙ্ক সম্পন্ন!', 'success');
        } else {
            showToast(`সিঙ্ক ব্যর্থ: ${res.error || 'অজানা ত্রুটি'}`, 'error');
        }
    };
    window.selectGodownCategory = (catId) => {
        _activeCategory = catId;
        renderCategoryChips();
        renderCardsList();
    };
    window.clearGodownContactSearch = () => {
        const input = document.getElementById('g-c-search-input');
        if (input) {
            input.value = '';
            _searchQuery = '';
            document.getElementById('g-c-search-clear')?.classList.add('hidden');
            renderCardsList();
        }
    };
    window.triggerBulkGodownGoogleSync = async () => {
        Swal.fire({
            title: 'গুগল কন্টাক্টস সিঙ্ক চলছে...',
            html: '<div class="text-xs text-slate-300 font-bn">গোডাউন কন্টাক্টগুলো আপনার সকল সংযুক্ত ডিভাইসে পুশ করা হচ্ছে...</div>',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading(),
            customClass: { popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn' }
        });

        try {
            const res = await executeBulkGodownGoogleSync();
            Swal.fire({
                title: 'সিঙ্ক সম্পন্ন!',
                text: `${res.total || 0} টি কন্টাক্ট সফলভাবে গুগলে আপডেট করা হয়েছে।`,
                icon: 'success',
                customClass: { popup: '!bg-slate-950 !text-white !rounded-3xl font-bn' }
            });
        } catch (err) {
            Swal.fire('এরর', err.message || 'সিঙ্ক করতে সমস্যা হয়েছে', 'error');
        }
    };

    window.triggerClearSampleGodownContacts = async () => {
        const res = await Swal.fire({
            title: 'নমুনা ডাটা মোছার নিশ্চিতকরণ',
            text: 'আপনি কি ডিরেক্টরির প্রাথমিক ডামি / নমুনা কন্টাক্টগুলো মুছে ফেলতে চান?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'হ্যাঁ, নমুনা ডাটা মুছুন',
            cancelButtonText: 'বাতিল',
            customClass: {
                popup: '!bg-slate-950 !text-white !rounded-3xl border border-red-500/30 font-bn',
                confirmButton: 'm3-btn-primary !bg-red-600 hover:!bg-red-500 !px-5 !py-2 !rounded-xl font-bold',
                cancelButton: 'm3-btn-tonal !bg-slate-800 !text-slate-300 !px-4 !py-2 !rounded-xl font-bold'
            }
        });

        if (res.isConfirmed) {
            try {
                const count = await GodownContactDAO.clearSampleContacts();
                showToast(`${count} টি নমুনা কন্টাক্ট মুছে ফেলা হয়েছে`, 'success');
            } catch (e) {
                console.error('Clear sample contacts error:', e);
                showToast('নমুনা কন্টাক্ট মুছতে সমস্যা হয়েছে', 'error');
            }
        }
    };

    // Setup Search Listener
    const sInput = document.getElementById('g-c-search-input');
    const sClear = document.getElementById('g-c-search-clear');
    if (sInput) {
        sInput.addEventListener('input', (e) => {
            _searchQuery = (e.target.value || '').trim().toLowerCase();
            if (sClear) sClear.classList.toggle('hidden', _searchQuery.length === 0);
            renderCardsList();
        });
    }

    // Setup Mouse Wheel Horizontal Scroll Listener for Category Chips
    const chipsContainer = document.getElementById('g-c-category-chips');
    if (chipsContainer) {
        chipsContainer.addEventListener('wheel', (e) => {
            if (e.deltaY !== 0) {
                e.preventDefault();
                chipsContainer.scrollLeft += e.deltaY;
            }
        }, { passive: false });
    }

    // Auto Seed default contacts if empty
    await GodownContactDAO.seedDefaultContactsIfEmpty();

    // Start Live Firestore Listener
    _unsubscribe = GodownContactDAO.listenAllContacts(list => {
        _allContacts = list;
        updateSampleClearButtonVisibility();
        renderCategoryChips();
        renderCardsList();
    });
}

function updateSampleClearButtonVisibility() {
    const btn = document.getElementById('g-c-clear-samples-btn');
    if (!btn) return;
    const dummyPhones = ['01819397669', '01711000000', '01822000000', '01833000000'];
    const hasSample = _allContacts.some(c => c.isSample === true || (c.phone && dummyPhones.includes(c.phone)));
    if (hasSample) {
        btn.classList.remove('hidden');
        btn.classList.add('flex');
    } else {
        btn.classList.add('hidden');
        btn.classList.remove('flex');
    }
}

function renderCategoryChips() {
    const container = document.getElementById('g-c-category-chips');
    if (!container) return;

    const categories = extractUniqueCategories(_allContacts);
    const totalCount = _allContacts.length;

    const allActive = _activeCategory === 'all';
    const allBtnHtml = `
        <button onclick="window.selectGodownCategory('all')" class="px-2.5 py-1.5 rounded-xl border text-xs flex items-center gap-1.5 shrink-0 whitespace-nowrap transition-all cursor-pointer ${allActive ? 'bg-cyan-600 text-white font-black shadow-md shadow-cyan-600/30 border-cyan-500' : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 border-slate-800'}">
            <i class="fa-solid fa-layer-group"></i>
            <span>সকল কন্টাক্ট</span>
            <span class="px-1.5 py-0.2 rounded-md ${allActive ? 'bg-black/30 text-white' : 'bg-slate-800 text-slate-400'} text-[10px] font-mono font-bold">${totalCount}</span>
        </button>
    `;

    const catBtnsHtml = categories.map(cat => {
        const isActive = _activeCategory === cat.id;
        const count = _allContacts.filter(c => c.category === cat.id).length;
        const activeClass = isActive 
            ? 'bg-cyan-600 text-white font-black shadow-md shadow-cyan-600/30 border-cyan-500' 
            : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 border-slate-800';

        return `
            <button onclick="window.selectGodownCategory('${escapeHTML(cat.id)}')" class="px-2.5 py-1.5 rounded-xl border text-xs flex items-center gap-1.5 shrink-0 whitespace-nowrap transition-all cursor-pointer ${activeClass}">
                <span>${cat.icon}</span>
                <span>${escapeHTML(cat.title)}</span>
                <span class="px-1.5 py-0.2 rounded-md ${isActive ? 'bg-black/30 text-white' : 'bg-slate-800 text-slate-400'} text-[10px] font-mono font-bold">${count}</span>
            </button>
        `;
    }).join('');

    container.innerHTML = allBtnHtml + catBtnsHtml;
}

function renderCardsList() {
    const grid = document.getElementById('g-c-cards-grid');
    if (!grid) return;

    let filtered = _allContacts;

    if (_activeCategory !== 'all') {
        filtered = filtered.filter(c => c.category === _activeCategory);
    }

    if (_searchQuery) {
        filtered = filtered.filter(c => {
            const name = (c.name || '').toLowerCase();
            const shopName = (c.shopName || '').toLowerCase();
            const role = (c.role || '').toLowerCase();
            const cat = (c.category || '').toLowerCase();
            const loc = (c.address || c.location || '').toLowerCase();
            const phone = (c.phone || '').toLowerCase();
            const altPhone = (c.altPhone || '').toLowerCase();
            const vNo = (c.vehicleNo || '').toLowerCase();
            const notes = (c.notes || '').toLowerCase();
            return name.includes(_searchQuery) || 
                   shopName.includes(_searchQuery) ||
                   role.includes(_searchQuery) || 
                   cat.includes(_searchQuery) ||
                   loc.includes(_searchQuery) || 
                   phone.includes(_searchQuery) || 
                   altPhone.includes(_searchQuery) ||
                   vNo.includes(_searchQuery) || 
                   notes.includes(_searchQuery);
        });
    }

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full p-10 text-center bg-slate-900/30 rounded-2xl border border-dashed border-slate-800 space-y-2">
                <div class="w-12 h-12 rounded-2xl bg-slate-800/40 border border-slate-700/40 flex items-center justify-center mx-auto text-slate-500 text-xl">
                    <i class="fa-solid fa-address-book"></i>
                </div>
                <div class="text-sm font-bold text-slate-300">কোনো কন্টাক্ট পাওয়া যায়নি</div>
                <div class="text-xs text-slate-500">নতুন কন্টাক্ট যুক্ত করতে উপরের "নতুন কন্টাক্ট যুক্ত করুন" বাটনে ক্লিক করুন</div>
            </div>
        `;
        return;
    }

    grid.innerHTML = filtered.map(c => {
        const catMeta = getCategoryMeta(c.category);
        const callUrl = buildCallLink(c.phone);
        const waUrl = buildWhatsAppLink(c.phone, c.name);
        const fullAddress = c.address || c.location || '';

        return `
            <div class="bg-slate-900/90 hover:bg-slate-900 border border-slate-800/90 hover:border-slate-700/80 rounded-2xl p-3.5 shadow-lg flex flex-col justify-between space-y-3 transition-all group">
                <!-- Header: Name & Role Badge -->
                <div>
                    <div class="flex items-start justify-between gap-2">
                        <div class="min-w-0 flex-1">
                            ${c.shopName ? `
                                <div class="text-[11px] font-bold text-amber-400 flex items-center gap-1.5 mb-0.5 truncate" title="${escapeHTML(c.shopName)}">
                                    <i class="fa-solid fa-store text-[10px]"></i>
                                    <span class="truncate">${escapeHTML(c.shopName)}</span>
                                </div>
                            ` : ''}
                            <h3 class="text-sm font-black text-white group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                                <span>${escapeHTML(c.name)}</span>
                            </h3>
                            <div class="flex items-center gap-1.5 flex-wrap mt-1">
                                <span class="px-2 py-0.5 rounded-md text-[10px] font-bold border ${catMeta.color} flex items-center gap-1">
                                    ${catMeta.icon}
                                    <span>${escapeHTML(c.role || catMeta.title)}</span>
                                </span>
                                ${c.vehicleNo ? `
                                    <span class="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                                        <i class="fa-solid fa-car text-[9px] mr-1"></i>${escapeHTML(c.vehicleNo)}
                                    </span>
                                ` : ''}
                            </div>
                        </div>

                        <!-- Google Sync Status Indicator -->
                        <button onclick="window.triggerSingleGoogleSync('${c.id}')" class="shrink-0 p-1.5 rounded-lg ${c.isGoogleSynced ? 'text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30' : 'text-slate-500 bg-slate-800 hover:text-cyan-300 border border-slate-700'} text-[11px] transition-all cursor-pointer" title="${c.isGoogleSynced ? 'গুগলে সিঙ্কড (পুনরায় সিঙ্ক করতে ক্লিক করুন)' : 'গুগলে সিঙ্ক করতে ক্লিক করুন'}">
                            <i class="fa-brands fa-google text-xs"></i>
                        </button>
                    </div>

                    <!-- Details Hub -->
                    <div class="mt-2.5 space-y-1.5 text-xs text-slate-300">
                        <div class="flex items-center gap-2">
                            <i class="fa-solid fa-phone text-cyan-400 text-[11px] w-3.5 text-center"></i>
                            <span class="font-mono font-bold text-white tracking-wide">${escapeHTML(c.phone)}</span>
                            ${c.altPhone ? `<span class="text-slate-500 text-[11px] font-mono">(${escapeHTML(c.altPhone)})</span>` : ''}
                        </div>
                        ${fullAddress ? `
                            <div class="flex items-center gap-2 text-slate-400">
                                <i class="fa-solid fa-location-dot text-red-400 text-[11px] w-3.5 text-center"></i>
                                <span class="truncate" title="${escapeHTML(fullAddress)}">${escapeHTML(fullAddress)}</span>
                            </div>
                        ` : ''}
                        ${c.standardRate ? `
                            <div class="flex items-center gap-2 text-emerald-400 font-semibold">
                                <i class="fa-solid fa-tag text-emerald-400 text-[11px] w-3.5 text-center"></i>
                                <span>${escapeHTML(c.standardRate)}</span>
                            </div>
                        ` : ''}
                        ${c.notes ? `
                            <div class="flex items-start gap-2 text-slate-400 text-[11px] bg-slate-950/60 p-1.5 rounded-lg border border-slate-800/80">
                                <i class="fa-solid fa-circle-info text-cyan-400 text-[10px] mt-0.5 w-3.5 text-center"></i>
                                <span class="line-clamp-2">${escapeHTML(c.notes)}</span>
                            </div>
                        ` : ''}
                    </div>
                </div>

                <!-- Footer 1-Click Action Bar -->
                <div class="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-1.5">
                    <div class="flex items-center gap-1.5">
                        <a href="${callUrl}" class="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-1 shadow-sm active:scale-95 transition-all" title="সরাসরি ফোন দিন">
                            <i class="fa-solid fa-phone text-[10px]"></i>
                            <span>কল</span>
                        </a>
                        <a href="${waUrl}" target="_blank" rel="noopener" class="px-2.5 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white font-bold text-xs flex items-center gap-1 border border-emerald-500/30 active:scale-95 transition-all" title="WhatsApp বার্তা পাঠান">
                            <i class="fa-brands fa-whatsapp text-xs"></i>
                            <span>WhatsApp</span>
                        </a>
                    </div>

                    <div class="flex items-center gap-1">
                        <button onclick="window.openEditGodownContact('${c.id}')" class="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white flex items-center justify-center text-xs transition-all cursor-pointer" title="তথ্য এডিট করুন">
                            <i class="fa-solid fa-pen-to-square text-[10px]"></i>
                        </button>
                        <button onclick="window.triggerDeleteGodownContact('${c.id}')" class="w-7 h-7 rounded-lg bg-slate-800 hover:bg-red-600 text-slate-400 hover:text-white flex items-center justify-center text-xs transition-all cursor-pointer" title="মুছে ফেলুন">
                            <i class="fa-solid fa-trash text-[10px]"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}
