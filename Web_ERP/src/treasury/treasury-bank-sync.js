import Swal from 'sweetalert2';
import { BankTransactionDAO } from '../dao.js';
import { TreasuryDAO } from './treasury-dao.js';
import { 
    formatAmountWithComma, 
    formatAppDate, 
    getTodayLocalDateString, 
    toDBDate, 
    safeRound, 
    showToast, 
    promptSecurityPin 
} from '../utils.js';
import { auditLog } from '../audit/audit-logger.js';
import { firebase } from '../firebase-config.js';
import { buildRowsHTML, buildSyncModalHTML } from './treasury-bank-sync-ui.js';

/**
 * [BANK-SYNC] Treasury Bank Sync Engine
 * One-click banking ledger clearing & staging import into Master Treasury
 */

export async function openBankSyncModal(getState) {
    Swal.fire({
        title: 'ব্যাংক ডাটা লোড হচ্ছে...',
        html: '<div class="text-xs text-slate-400 mt-2 font-bn">ব্যাংকিং লেজার ও ট্রেজারি ট্রানজাকশন যাচাই করা হচ্ছে...</div>',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
        customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-800' }
    });

    try {
        // 1. Fetch Bank Transactions & Existing Treasury Transactions in Parallel
        const [bankTxnSnap, existingTreasury] = await Promise.all([
            BankTransactionDAO.collection.orderBy('date', 'desc').get(),
            TreasuryDAO.getAll()
        ]);

        const allBankTxns = [];
        bankTxnSnap.forEach(doc => allBankTxns.push({ id: doc.id, ...doc.data() }));

        // Track already synced bank IDs to permanently prevent duplicate entries
        const syncedBankTxnIds = new Set();
        (existingTreasury || []).forEach(t => {
            if (t.bankTxnId) {
                syncedBankTxnIds.add(t.bankTxnId);
                if (t.bankTxnId.includes('_')) {
                    syncedBankTxnIds.add(t.bankTxnId.split('_')[0]);
                }
            }
        });

        // Exclude Bank Opening Balance Anchors & Showroom Cash from pending count
        const pendingCount = allBankTxns.filter(t => {
            const bName = String(t.bankName || '').trim();
            const isCash = (bName === 'শোরুম ক্যাশ' || bName === 'Cash' || bName === 'ক্যাশ');
            if (isCash) return false;
            
            const noteText = String(t.note || '').toLowerCase();
            const isOpening = noteText.includes('opening balance') || noteText.includes('প্রারম্ভিক ব্যালেন্স');
            if (isOpening) return false;

            return !syncedBankTxnIds.has(t.id);
        }).length;

        Swal.close();
        await renderSyncChecklistModal(allBankTxns, syncedBankTxnIds, pendingCount, getState);

    } catch (err) {
        console.error('Bank sync init error:', err);
        Swal.fire({
            icon: 'error',
            title: 'ডাটা লোড ব্যর্থ',
            text: 'ব্যাংকিং লেনদেন ফেচ করতে সমস্যা হয়েছে: ' + (err.message || 'অজানা ত্রুটি'),
            customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-800' }
        });
    }
}

/**
 * Render Interactive Staging Checklist Dialog
 */
async function renderSyncChecklistModal(allBankTxns, syncedBankTxnIds, initialPendingCount, getState) {
    // ALWAYS default to Today's date as requested by user
    const todayStr = getTodayLocalDateString();
    let activeFilterMode = 'today';
    let selectedDateFilter = todayStr;
    let showShowroomCash = false;
    let searchQuery = '';

    // Filter items based on current settings
    function getFilteredList() {
        return allBankTxns.filter(t => {
            // 1. Showroom Cash Filter
            const bName = String(t.bankName || '').trim();
            const isCash = (bName === 'শোরুম ক্যাশ' || bName === 'Cash' || bName === 'ক্যাশ');
            if (isCash && !showShowroomCash) {
                return false;
            }

            // 2. Exclude Bank Opening Balance Anchors (Not daily operational cash flows)
            const noteText = String(t.note || '').toLowerCase();
            const isOpening = noteText.includes('opening balance') || noteText.includes('প্রারম্ভিক ব্যালেন্স');
            if (isOpening) {
                return false;
            }

            // 3. Active Mode Filter
            if (activeFilterMode === 'today' || activeFilterMode === 'date') {
                const tDate = toDBDate(t.date || '');
                const targetDate = toDBDate(selectedDateFilter || todayStr);
                if (tDate !== targetDate) return false;
            } else if (activeFilterMode === 'pending') {
                if (syncedBankTxnIds.has(t.id)) return false;
            }

            // 4. Search Query Filter
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                const bank = String(t.bankName || '').toLowerCase();
                const note = String(t.note || '').toLowerCase();
                const amt = String(t.amount || '');
                if (!bank.includes(q) && !note.includes(q) && !amt.includes(q)) {
                    return false;
                }
            }

            return true;
        });
    }

    const currentPendingTotal = () => {
        return allBankTxns.filter(t => {
            const bName = String(t.bankName || '').trim();
            const isCash = (bName === 'শোরুম ক্যাশ' || bName === 'Cash' || bName === 'ক্যাশ');
            if (isCash && !showShowroomCash) return false;
            const noteText = String(t.note || '').toLowerCase();
            if (noteText.includes('opening balance') || noteText.includes('প্রারম্ভিক ব্যালেন্স')) return false;
            return !syncedBankTxnIds.has(t.id);
        }).length;
    };

    const modalHtml = buildSyncModalHTML(
        todayStr, 
        showShowroomCash, 
        initialPendingCount
    );

    // Global listener for live calc inside modal
    window.updateTreasurySyncLiveCalc = () => {
        let selectedCount = 0;
        let totalInflow = 0;
        let totalOutflow = 0;

        const allVisibleChecks = document.querySelectorAll('.tr-sync-check:not([disabled])');
        const checkedBoxes = document.querySelectorAll('.tr-sync-check:checked');

        checkedBoxes.forEach(cb => {
            selectedCount++;
            const type = cb.getAttribute('data-type');
            const amt = Number(cb.getAttribute('data-amount') || 0);
            if (type === 'DEPOSIT') {
                totalInflow = safeRound(totalInflow + amt);
            } else if (type === 'TRANSFER') {
                totalInflow = safeRound(totalInflow + amt);
                totalOutflow = safeRound(totalOutflow + amt);
            } else {
                totalOutflow = safeRound(totalOutflow + amt);
            }
        });

        const net = safeRound(totalInflow - totalOutflow);

        const countEl = document.getElementById('tr-sync-count-badge');
        const inEl = document.getElementById('tr-sync-sum-inflow');
        const outEl = document.getElementById('tr-sync-sum-outflow');
        const netEl = document.getElementById('tr-sync-sum-net');
        const masterCheck = document.getElementById('tr-sync-master-check');

        if (countEl) countEl.innerHTML = `<span class="text-blue-400 font-black">${selectedCount}</span> টি নির্বাচিত`;
        if (inEl) inEl.innerText = `+৳ ${formatAmountWithComma(totalInflow)}`;
        if (outEl) outEl.innerText = `-৳ ${formatAmountWithComma(totalOutflow)}`;
        if (netEl) {
            netEl.innerText = `${net >= 0 ? '+' : '-'}৳ ${formatAmountWithComma(Math.abs(net))}`;
            netEl.className = net >= 0 ? 'font-black text-emerald-400 text-sm' : 'font-black text-red-400 text-sm';
        }

        // Master checkbox state sync
        if (masterCheck && allVisibleChecks.length > 0) {
            masterCheck.checked = selectedCount === allVisibleChecks.length;
            masterCheck.indeterminate = selectedCount > 0 && selectedCount < allVisibleChecks.length;
        } else if (masterCheck) {
            masterCheck.checked = false;
            masterCheck.indeterminate = false;
        }
    };

    const { value: isConfirmed } = await Swal.fire({
        title: '<div class="flex items-center justify-center gap-2.5 font-bn font-black text-lg text-white"><i class="fa-solid fa-building-columns text-blue-400"></i><span>ব্যাংক ফান্ড ট্রেজারিতে সিঙ্ক করুন</span></div>',
        html: modalHtml,
        width: '860px',
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-cloud-arrow-down mr-1.5"></i>নির্বাচিত লেনদেন ট্রেজারিতে যুক্ত করুন',
        cancelButtonText: 'বাতিল',
        confirmButtonColor: '#2563eb',
        cancelButtonColor: '#475569',
        customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-800' },
        didOpen: () => {
            const tbody = document.getElementById('tr-sync-tbody');
            const dateInput = document.getElementById('tr-sync-date-picker');
            const searchInput = document.getElementById('tr-sync-search-input');
            const filterLabel = document.getElementById('tr-sync-active-filter-label');
            const masterCheck = document.getElementById('tr-sync-master-check');

            const refreshTableRows = () => {
                const filtered = getFilteredList();
                if (tbody) {
                    tbody.innerHTML = buildRowsHTML(
                        filtered, 
                        syncedBankTxnIds, 
                        activeFilterMode, 
                        selectedDateFilter, 
                        currentPendingTotal()
                    );
                }
                window.updateTreasurySyncLiveCalc();

                // Re-bind empty state quick action button if rendered
                const emptyGotoBtn = document.getElementById('tr-sync-empty-goto-pending');
                if (emptyGotoBtn) {
                    emptyGotoBtn.addEventListener('click', () => {
                        setFilterMode('pending');
                    });
                }
            };

            const updateTabPillStyles = () => {
                const tabToday = document.getElementById('tr-sync-tab-today');
                const tabYesterday = document.getElementById('tr-sync-tab-yesterday');
                const tabPending = document.getElementById('tr-sync-tab-pending');
                const tabAll = document.getElementById('tr-sync-tab-all');

                const resetClass = 'px-2.5 py-1 text-xs font-bold rounded-xl border whitespace-nowrap shrink-0 transition-all flex items-center gap-1 cursor-pointer bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800';
                const activeClass = 'px-2.5 py-1 text-xs font-bold rounded-xl border whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5 cursor-pointer bg-blue-600/30 text-blue-300 border-blue-500/50 hover:bg-blue-600/40';

                const isTodayActive = (activeFilterMode === 'today') || (activeFilterMode === 'date' && selectedDateFilter === todayStr);
                if (tabToday) tabToday.className = isTodayActive ? activeClass : resetClass;
                
                const yDate = new Date();
                yDate.setDate(yDate.getDate() - 1);
                const yDateStr = toDBDate(yDate);
                const isYesterdayActive = (activeFilterMode === 'date' && selectedDateFilter === yDateStr);
                if (tabYesterday) tabYesterday.className = isYesterdayActive ? activeClass : resetClass;
                
                if (tabPending) tabPending.className = activeFilterMode === 'pending' ? activeClass : resetClass;
                if (tabAll) tabAll.className = activeFilterMode === 'all' ? activeClass : resetClass;

                // Update text label badge
                if (filterLabel) {
                    if (isTodayActive) {
                        filterLabel.innerText = `আজকের তারিখ (${formatAppDate(todayStr)})`;
                        filterLabel.className = 'text-[11px] font-bold text-blue-400 whitespace-nowrap shrink-0 bg-blue-500/10 px-2 py-0.5 rounded-lg border border-blue-500/20';
                    } else if (isYesterdayActive) {
                        filterLabel.innerText = `গতকাল (${formatAppDate(yDateStr)})`;
                        filterLabel.className = 'text-[11px] font-bold text-purple-400 whitespace-nowrap shrink-0 bg-purple-500/10 px-2 py-0.5 rounded-lg border border-purple-500/20';
                    } else if (activeFilterMode === 'pending') {
                        filterLabel.innerText = 'সকল অপেক্ষমান';
                        filterLabel.className = 'text-[11px] font-bold text-amber-400 whitespace-nowrap shrink-0 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20';
                    } else if (activeFilterMode === 'all') {
                        filterLabel.innerText = 'সকল লেনদেন';
                        filterLabel.className = 'text-[11px] font-bold text-slate-400 whitespace-nowrap shrink-0 bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-700';
                    } else if (activeFilterMode === 'date') {
                        filterLabel.innerText = `${formatAppDate(selectedDateFilter)}`;
                        filterLabel.className = 'text-[11px] font-bold text-blue-400 whitespace-nowrap shrink-0 bg-blue-500/10 px-2 py-0.5 rounded-lg border border-blue-500/20';
                    }
                }
            };

            const setFilterMode = (mode, dateVal = '') => {
                activeFilterMode = mode;
                if (mode === 'today') {
                    selectedDateFilter = todayStr;
                    if (dateInput) dateInput.value = formatAppDate(todayStr);
                } else if (mode === 'date') {
                    selectedDateFilter = toDBDate(dateVal || todayStr);
                    if (dateInput) dateInput.value = formatAppDate(selectedDateFilter);
                } else if (mode === 'pending' || mode === 'all') {
                    selectedDateFilter = '';
                    if (dateInput) dateInput.value = '';
                }
                updateTabPillStyles();
                refreshTableRows();
            };

            // Initialize UI elements with Today's Date
            updateTabPillStyles();
            refreshTableRows();

            // Initialize global Flatpickr with safety observer
            if (typeof window.initDatePickers === 'function') {
                setTimeout(() => window.initDatePickers(), 50);
            }

            // Date Picker Auto-Display Listener (Handles multi-day absence catch-up)
            if (dateInput) {
                const onDateChanged = (val) => {
                    const clean = String(val || '').trim();
                    if (!clean) return;
                    setFilterMode('date', clean);
                };

                dateInput.addEventListener('change', (e) => onDateChanged(e.target.value));
                dateInput.addEventListener('input', (e) => onDateChanged(e.target.value));
            }

            // Quick Filter Buttons
            document.getElementById('tr-sync-tab-today')?.addEventListener('click', () => setFilterMode('today'));
            document.getElementById('tr-sync-tab-yesterday')?.addEventListener('click', () => {
                const y = new Date();
                y.setDate(y.getDate() - 1);
                setFilterMode('date', toDBDate(y));
            });
            document.getElementById('tr-sync-tab-pending')?.addEventListener('click', () => setFilterMode('pending'));
            document.getElementById('tr-sync-tab-all')?.addEventListener('click', () => setFilterMode('all'));

            // Showroom Cash Toggle Listener
            document.getElementById('tr-sync-include-cash')?.addEventListener('change', (e) => {
                showShowroomCash = e.target.checked;
                refreshTableRows();
            });

            // Live Search Listener
            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    searchQuery = e.target.value.trim();
                    refreshTableRows();
                });
            }

            // Master Checkbox Toggle
            if (masterCheck) {
                masterCheck.addEventListener('change', (e) => {
                    const isChecked = e.target.checked;
                    document.querySelectorAll('.tr-sync-check:not([disabled])').forEach(cb => {
                        cb.checked = isChecked;
                    });
                    window.updateTreasurySyncLiveCalc();
                });
            }
        },
        preConfirm: () => {
            const selectedIds = [];
            document.querySelectorAll('.tr-sync-check:checked').forEach(cb => {
                selectedIds.push(cb.getAttribute('data-id'));
            });

            if (selectedIds.length === 0) {
                Swal.showValidationMessage('কমপক্ষে ১টি লেনদেন নির্বাচন করুন!');
                return false;
            }

            return selectedIds;
        }
    });

    if (isConfirmed && Array.isArray(isConfirmed) && isConfirmed.length > 0) {
        await executeBatchBankSync(isConfirmed, allBankTxns, getState);
    }
}

/**
 * Batch Commit Selected Transactions to Treasury
 */
async function executeBatchBankSync(selectedIds, allBankTxns, getState) {
    const isPinValid = await promptSecurityPin('ব্যাংক ফান্ড ট্রেজারিতে অন্তর্ভুক্তকরণ', 'treasuryBankSync');
    if (!isPinValid) return;

    Swal.fire({
        title: 'ট্রেজারিতে যুক্ত হচ্ছে...',
        html: '<div class="text-xs text-slate-400 mt-2 font-bn">ডাটাবেজে লেনদেনগুলো সফলভাবে পোস্টিং হচ্ছে...</div>',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
        customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-800' }
    });

    try {
        const idSet = new Set(selectedIds);
        const txnsToSync = allBankTxns.filter(t => idSet.has(t.id));
        let successCount = 0;

        for (const tx of txnsToSync) {
            const rawType = String(tx.type || '').toUpperCase();
            const isDeposit = rawType === 'DEPOSIT';
            const isTransfer = rawType === 'TRANSFER';
            const bankName = tx.bankName || 'ব্যাংক অ্যাকাউন্ট';

            if (isTransfer) {
                const targetBankName = tx.targetBankName || 'অন্য ব্যাংক';
                const outPayload = {
                    title: `${bankName} (ট্রান্সফার বহির্গমন ➔ ${targetBankName})`,
                    type: 'outflow',
                    category: 'bank_sync',
                    amount: Number(tx.amount || 0),
                    date: toDBDate(tx.date || getTodayLocalDateString()),
                    note: tx.note ? `[ট্রান্সফার ➔ ${targetBankName}] ${tx.note}` : `ট্রান্সফার ➔ ${targetBankName}`,
                    bankTxnId: `${tx.id}_out`,
                    bankName: bankName,
                    targetBankName: targetBankName,
                    createdBy: firebase.auth().currentUser?.email || 'Admin'
                };
                const inPayload = {
                    title: `${targetBankName} (ট্রান্সফার আগমন ➔ ${bankName})`,
                    type: 'inflow',
                    category: 'bank_sync',
                    amount: Number(tx.amount || 0),
                    date: toDBDate(tx.date || getTodayLocalDateString()),
                    note: tx.note ? `[ট্রান্সফার ➔ ${bankName} থেকে প্রাপ্ত] ${tx.note}` : `ট্রান্সফার ➔ ${bankName} থেকে প্রাপ্ত`,
                    bankTxnId: `${tx.id}_in`,
                    bankName: targetBankName,
                    targetBankName: bankName,
                    createdBy: firebase.auth().currentUser?.email || 'Admin'
                };
                await TreasuryDAO.addTransaction(outPayload);
                await TreasuryDAO.addTransaction(inPayload);
                successCount++;
            } else {
                const title = isDeposit ? `${bankName} (জমা)` : `${bankName} (উত্তোলন)`;
                const type = isDeposit ? 'inflow' : 'outflow';
                const isCashAcc = (bankName === 'শোরুম ক্যাশ' || bankName === 'Cash' || bankName === 'ক্যাশ');
                const cleanNote = tx.note ? tx.note : (isCashAcc ? 'শোরুম ক্যাশ লেজার থেকে সিঙ্ক' : `ব্যাংক লেজার থেকে সিঙ্ক (${bankName})`);

                const payload = {
                    title,
                    type,
                    category: 'bank_sync',
                    amount: Number(tx.amount || 0),
                    date: toDBDate(tx.date || getTodayLocalDateString()),
                    note: cleanNote,
                    bankTxnId: tx.id,
                    bankName: bankName,
                    targetBankName: null,
                    createdBy: firebase.auth().currentUser?.email || 'Admin'
                };
                await TreasuryDAO.addTransaction(payload);
                successCount++;
            }
        }

        auditLog(
            'TREASURY_BANK_SYNC',
            'Admin',
            'MasterTreasury',
            `Synced ${successCount} banking transactions into Master Treasury Ledger`
        );

        Swal.close();
        showToast(`${successCount} টি ব্যাংক লেনদেন সফলভাবে ট্রেজারিতে যুক্ত হয়েছে!`, 'success');

        // Trigger State Re-render if callback available
        if (typeof getState === 'function') {
            const state = getState();
            if (state && typeof state.render === 'function') {
                state.render();
            }
        }
    } catch (err) {
        console.error('Batch bank sync error:', err);
        Swal.fire({
            icon: 'error',
            title: 'সংরক্ষণে ব্যর্থ',
            text: 'ট্রেজারিতে লেনদেন সেভ করতে সমস্যা হয়েছে: ' + (err.message || 'অজানা ত্রুটি'),
            customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-800' }
        });
    }
}
