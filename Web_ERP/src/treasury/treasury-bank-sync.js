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
            if (t.bankTxnId) syncedBankTxnIds.add(t.bankTxnId);
        });

        const todayStr = getTodayLocalDateString();
        let selectedDateFilter = todayStr;
        let includeShowroomCash = false;

        Swal.close();
        await renderSyncChecklistModal(allBankTxns, syncedBankTxnIds, selectedDateFilter, includeShowroomCash, getState);

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
async function renderSyncChecklistModal(allBankTxns, syncedBankTxnIds, initialDate, initialShowroomFlag, getState) {
    let currentDateFilter = initialDate;
    let showShowroomCash = initialShowroomFlag;

    // Filter items based on current settings
    function getFilteredList() {
        return allBankTxns.filter(t => {
            const tDate = toDBDate(t.date || '');
            if (currentDateFilter && tDate !== toDBDate(currentDateFilter)) {
                return false;
            }
            const bName = String(t.bankName || '').trim();
            const isCash = (bName === 'শোরুম ক্যাশ' || bName === 'Cash' || bName === 'ক্যাশ');
            if (isCash && !showShowroomCash) {
                return false;
            }
            return true;
        });
    }

    function buildRowsHTML(items) {
        if (items.length === 0) {
            return `
                <tr>
                    <td colspan="6" class="text-center py-10 text-slate-400 font-bn">
                        <i class="fa-solid fa-calendar-xmark text-3xl text-slate-600 mb-2"></i>
                        <div class="font-bold text-sm text-slate-300">এই তারিখে কোনো ব্যাংকিং লেনদেন পাওয়া যায়নি</div>
                        <div class="text-[11px] text-slate-500 mt-0.5">তারিখ পরিবর্তন করে পেছনের লেনদেন দেখতে পারেন।</div>
                    </td>
                </tr>
            `;
        }

        return items.map((tx) => {
            const isSynced = syncedBankTxnIds.has(tx.id);
            const rawType = String(tx.type || '').toUpperCase();
            const isDeposit = rawType === 'DEPOSIT';
            const isTransfer = rawType === 'TRANSFER';
            const amount = Number(tx.amount || 0);
            const noteText = String(tx.note || '').trim();

            // Check for cash deposit warning (Risk 1)
            const isCashDepositRisk = isDeposit && (
                noteText.includes('ক্যাশ') || 
                noteText.includes('cash') || 
                noteText.includes('শোরুম') ||
                noteText.includes('আদায়')
            );

            let typeBadge = '';
            if (isDeposit) {
                typeBadge = '<span class="px-2 py-0.5 rounded-lg text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"><i class="fa-solid fa-arrow-down mr-1"></i>জমা (+ ইন)</span>';
            } else if (isTransfer) {
                typeBadge = `<span class="px-2 py-0.5 rounded-lg text-[10px] font-black bg-blue-500/20 text-blue-300 border border-blue-500/30"><i class="fa-solid fa-right-left mr-1"></i>ট্রান্সফার ➔ ${tx.targetBankName || 'অন্য ব্যাংক'}</span>`;
            } else {
                typeBadge = '<span class="px-2 py-0.5 rounded-lg text-[10px] font-black bg-red-500/20 text-red-400 border border-red-500/30"><i class="fa-solid fa-arrow-up mr-1"></i>উত্তোলন (- আউট)</span>';
            }

            let statusBadge = '';
            if (isSynced) {
                statusBadge = '<span class="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-500/40"><i class="fa-solid fa-circle-check mr-1"></i>যুক্ত আছে</span>';
            } else if (isCashDepositRisk) {
                statusBadge = '<span class="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40" title="সতর্কতা: শোরুম ক্যাশ থেকে জমা হলে ট্রেজারিতে অলরেডি দৈনিক কালেকশনে থাকতে পারে!"><i class="fa-solid fa-triangle-exclamation mr-1"></i>ক্যাশ ডিপোজিট?</span>';
            }

            // Checked by default if not already synced
            const isChecked = !isSynced;
            const disabledAttr = isSynced ? 'disabled' : '';
            const rowOpacity = isSynced ? 'opacity-60 bg-slate-900/40' : 'hover:bg-slate-800/40 transition-colors';

            return `
                <tr class="border-b border-slate-800/70 ${rowOpacity} font-bn" data-id="${tx.id}">
                    <td class="py-2.5 px-3 text-center">
                        <input 
                            type="checkbox" 
                            class="tr-sync-check w-4 h-4 rounded text-blue-600 bg-slate-800 border-slate-600 focus:ring-blue-500 focus:ring-1 cursor-pointer" 
                            data-id="${tx.id}" 
                            data-type="${rawType}"
                            data-amount="${amount}"
                            ${isChecked ? 'checked' : ''} 
                            ${disabledAttr}
                            onchange="window.updateTreasurySyncLiveCalc()"
                        />
                    </td>
                    <td class="py-2.5 px-3 whitespace-nowrap">
                        <div class="font-black text-xs text-white flex items-center gap-1.5">
                            <i class="fa-solid fa-building-columns text-blue-400 text-[11px]"></i>
                            <span>${tx.bankName || 'অজানা ব্যাংক'}</span>
                        </div>
                        <div class="text-[10px] text-slate-400 font-mono mt-0.5">${formatAppDate(tx.date)}</div>
                    </td>
                    <td class="py-2.5 px-3 text-center whitespace-nowrap">
                        ${typeBadge}
                    </td>
                    <td class="py-2.5 px-3 max-w-[200px]">
                        <div class="text-xs text-slate-200 truncate" title="${noteText || 'বিবরণ নেই'}">${noteText || '<span class="text-slate-500 italic">কোনো নোট নেই</span>'}</div>
                        ${statusBadge ? `<div class="mt-1">${statusBadge}</div>` : ''}
                    </td>
                    <td class="py-2.5 px-3 text-right whitespace-nowrap font-mono font-bold text-xs ${isDeposit ? 'text-emerald-400' : 'text-red-400'}">
                        ${isDeposit ? '+' : '-'} ৳ ${formatAmountWithComma(amount)}
                    </td>
                </tr>
            `;
        }).join('');
    }

    const modalHtml = `
        <div class="text-left font-bn space-y-3.5 select-none">
            <!-- Filter Bar: Date & Showroom Cash Toggle -->
            <div class="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
                <div class="flex items-center gap-2">
                    <label class="text-xs font-bold text-slate-300 whitespace-nowrap">
                        <i class="fa-solid fa-calendar-day text-blue-400 mr-1"></i>তারিখ:
                    </label>
                    <input 
                        type="text" 
                        id="tr-sync-date-picker" 
                        class="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono outline-none datepicker cursor-pointer w-28 text-center" 
                        value="${currentDateFilter}"
                    />
                    <button type="button" id="tr-sync-today-btn" class="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold rounded-lg border border-slate-700 cursor-pointer">
                        আজ
                    </button>
                    <button type="button" id="tr-sync-all-dates-btn" class="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold rounded-lg border border-slate-700 cursor-pointer" title="সকল তারিখের অ-সিঙ্ককৃত লেনদেন">
                        সকল তারিখ
                    </button>
                </div>

                <div class="flex items-center gap-2">
                    <label class="flex items-center gap-1.5 text-[11px] text-slate-400 cursor-pointer hover:text-slate-200">
                        <input type="checkbox" id="tr-sync-include-cash" class="w-3.5 h-3.5 rounded bg-slate-800 border-slate-700 text-blue-600" ${showShowroomCash ? 'checked' : ''} />
                        <span>শোরুম ক্যাশের এন্ট্রি দেখাও</span>
                    </label>
                </div>
            </div>

            <!-- Warning Alert Banner for Cash Trap -->
            <div class="p-2.5 bg-blue-950/30 border border-blue-500/20 rounded-xl text-[11px] text-blue-300 flex items-start gap-2">
                <i class="fa-solid fa-circle-info text-blue-400 text-xs mt-0.5 shrink-0"></i>
                <div>
                    <strong>স্বয়ংক্রিয় গার্ড:</strong> যে লেনদেনগুলো অলরেডি ট্রেজারিতে যুক্ত আছে তা ডুপ্লিকেট রোধে লক করা আছে। যেসব এন্ট্রি যুক্ত করতে চান শুধু সেগুলো টিক রাখুন।
                </div>
            </div>

            <!-- Table Header with Select All Toggle -->
            <div class="flex items-center justify-between px-1">
                <div class="flex items-center gap-2">
                    <button type="button" id="tr-sync-select-all" class="text-xs text-blue-400 hover:text-blue-300 font-bold cursor-pointer">
                        <i class="fa-solid fa-check-double mr-1"></i>সবগুলো নির্বাচন
                    </button>
                    <span class="text-slate-600">|</span>
                    <button type="button" id="tr-sync-deselect-all" class="text-xs text-slate-400 hover:text-slate-300 font-bold cursor-pointer">
                        সব আনচেক
                    </button>
                </div>
                <div id="tr-sync-count-badge" class="text-xs font-bold text-slate-300">
                    লোড হচ্ছে...
                </div>
            </div>

            <!-- Staging Table Scroll Container -->
            <div class="max-h-[320px] overflow-y-auto border border-slate-800 rounded-2xl bg-slate-950/60 custom-scrollbar">
                <table class="w-full text-left border-collapse">
                    <thead class="sticky top-0 bg-slate-900 border-b border-slate-800 text-[11px] font-black text-slate-400 uppercase tracking-wider z-10">
                        <tr>
                            <th class="py-2.5 px-3 text-center w-10">সিলেক্ট</th>
                            <th class="py-2.5 px-3">ব্যাংক ও তারিখ</th>
                            <th class="py-2.5 px-3 text-center">ধরন</th>
                            <th class="py-2.5 px-3">বিবরণ / নোট</th>
                            <th class="py-2.5 px-3 text-right">পরিমাণ</th>
                        </tr>
                    </thead>
                    <tbody id="tr-sync-tbody">
                        ${buildRowsHTML(getFilteredList())}
                    </tbody>
                </table>
            </div>

            <!-- Live Summary Counter Box -->
            <div class="p-3 bg-slate-950 border border-slate-800/90 rounded-2xl flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
                <div class="flex items-center gap-4">
                    <div>
                        <span class="text-[10px] text-slate-400 block font-sans font-bold">মোট জমা (+)</span>
                        <span id="tr-sync-sum-inflow" class="font-black text-emerald-400">+৳ ০</span>
                    </div>
                    <div>
                        <span class="text-[10px] text-slate-400 block font-sans font-bold">মোট উত্তোলন (-)</span>
                        <span id="tr-sync-sum-outflow" class="font-black text-red-400">-৳ ০</span>
                    </div>
                </div>
                <div class="text-right">
                    <span class="text-[10px] text-amber-400 block font-sans font-bold">নিট ফান্ড প্রভাব</span>
                    <span id="tr-sync-sum-net" class="font-black text-amber-300 text-sm">৳ ০</span>
                </div>
            </div>
        </div>
    `;

    // Global listener for live calc inside modal
    window.updateTreasurySyncLiveCalc = () => {
        let selectedCount = 0;
        let totalInflow = 0;
        let totalOutflow = 0;

        const checkboxes = document.querySelectorAll('.tr-sync-check:checked');
        checkboxes.forEach(cb => {
            selectedCount++;
            const type = cb.getAttribute('data-type');
            const amt = Number(cb.getAttribute('data-amount') || 0);
            if (type === 'DEPOSIT') {
                totalInflow = safeRound(totalInflow + amt);
            } else if (type === 'TRANSFER') {
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

        if (countEl) countEl.innerHTML = `<span class="text-blue-400">${selectedCount}</span> টি নির্বাচিত`;
        if (inEl) inEl.innerText = `+৳ ${formatAmountWithComma(totalInflow)}`;
        if (outEl) outEl.innerText = `-৳ ${formatAmountWithComma(totalOutflow)}`;
        if (netEl) {
            netEl.innerText = `${net >= 0 ? '+' : '-'}৳ ${formatAmountWithComma(Math.abs(net))}`;
            netEl.className = net >= 0 ? 'font-black text-emerald-400 text-sm' : 'font-black text-red-400 text-sm';
        }
    };

    const { value: isConfirmed } = await Swal.fire({
        title: '<div class="flex items-center justify-center gap-2 font-bn font-black text-lg text-white"><i class="fa-solid fa-building-columns text-blue-400"></i><span>ব্যাংক ফান্ড ট্রেজারিতে সিঙ্ক করুন</span></div>',
        html: modalHtml,
        width: '740px',
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-cloud-arrow-down mr-1.5"></i>নির্বাচিত লেনদেন ট্রেজারিতে যুক্ত করুন',
        cancelButtonText: 'বাতিল',
        confirmButtonColor: '#2563eb',
        cancelButtonColor: '#475569',
        customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-800' },
        didOpen: () => {
            window.updateTreasurySyncLiveCalc();

            const tbody = document.getElementById('tr-sync-tbody');
            const refreshTableRows = () => {
                const filtered = getFilteredList();
                if (tbody) tbody.innerHTML = buildRowsHTML(filtered);
                window.updateTreasurySyncLiveCalc();
            };

            // Date Picker Change Listener
            const dateInput = document.getElementById('tr-sync-date-picker');
            if (dateInput) {
                dateInput.addEventListener('change', (e) => {
                    currentDateFilter = e.target.value.trim();
                    refreshTableRows();
                });
            }

            // Quick 'Today' Button
            document.getElementById('tr-sync-today-btn')?.addEventListener('click', () => {
                currentDateFilter = getTodayLocalDateString();
                if (dateInput) dateInput.value = currentDateFilter;
                refreshTableRows();
            });

            // Quick 'All Dates' Button
            document.getElementById('tr-sync-all-dates-btn')?.addEventListener('click', () => {
                currentDateFilter = '';
                if (dateInput) dateInput.value = '';
                refreshTableRows();
            });

            // Showroom Cash Toggle Listener
            document.getElementById('tr-sync-include-cash')?.addEventListener('change', (e) => {
                showShowroomCash = e.target.checked;
                refreshTableRows();
            });

            // Select All Button
            document.getElementById('tr-sync-select-all')?.addEventListener('click', () => {
                document.querySelectorAll('.tr-sync-check:not([disabled])').forEach(cb => cb.checked = true);
                window.updateTreasurySyncLiveCalc();
            });

            // Deselect All Button
            document.getElementById('tr-sync-deselect-all')?.addEventListener('click', () => {
                document.querySelectorAll('.tr-sync-check:not([disabled])').forEach(cb => cb.checked = false);
                window.updateTreasurySyncLiveCalc();
            });
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

            let title = '';
            let type = 'inflow';
            if (isDeposit) {
                title = `${bankName} (জমা)`;
                type = 'inflow';
            } else if (isTransfer) {
                title = `${bankName} ➔ ${tx.targetBankName || 'অন্য ব্যাংক'} (ট্রান্সফার)`;
                type = 'outflow';
            } else {
                title = `${bankName} (উত্তোলন)`;
                type = 'outflow';
            }

            const payload = {
                title,
                type,
                category: 'bank_sync',
                amount: Number(tx.amount || 0),
                date: toDBDate(tx.date || getTodayLocalDateString()),
                note: tx.note ? `[ব্যাংক] ${tx.note}` : `ব্যাংকিং লেজার থেকে সিঙ্ক (${bankName})`,
                bankTxnId: tx.id,
                bankName: bankName,
                targetBankName: tx.targetBankName || null,
                createdBy: firebase.auth().currentUser?.email || 'Admin'
            };

            await TreasuryDAO.addTransaction(payload);
            successCount++;
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
