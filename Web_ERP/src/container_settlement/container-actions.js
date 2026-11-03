import Swal from 'sweetalert2';
import { 
    getActiveSettlement, 
    setActiveSettlement, 
    recalculateActiveSettlement, 
    createNewBlankSettlement, 
    getSavedSettlementsList 
} from './container-state.js';
import { ContainerSettlementDAO } from './container-dao.js';
import { printContainerSettlement } from './container-print.js';
import { 
    formatAppDate,
    formatAmountWithComma, 
    parseAmount, 
    showToast, 
    promptSecurityPin, 
    escapeHTML,
    safeRound 
} from '../utils.js';

let uiRefreshCallback = null;

export function registerUiRefresh(cb) {
    uiRefreshCallback = cb;
}

function refreshUi() {
    if (typeof uiRefreshCallback === 'function') {
        uiRefreshCallback();
    }
}

export function handleTitleChange(val) {
    getActiveSettlement().title = val;
}

export function handleSubtitleChange(val) {
    getActiveSettlement().subtitle = val;
}

export function handlePeriodChange(val) {
    getActiveSettlement().fiscalPeriod = val;
}

export function toggleRowOp(section, idx) {
    const st = getActiveSettlement();
    const rows = section === 'sc' ? st.salesAndCosts : st.capitalSettlements;
    if (rows[idx]) {
        rows[idx].op = rows[idx].op === '+' ? '-' : '+';
        refreshUi();
    }
}

export function handleRowDescChange(section, idx, val) {
    const st = getActiveSettlement();
    const rows = section === 'sc' ? st.salesAndCosts : st.capitalSettlements;
    if (rows[idx]) {
        rows[idx].desc = val;
    }
}

export function handleRowAmountChange(section, idx, val) {
    const st = getActiveSettlement();
    const rows = section === 'sc' ? st.salesAndCosts : st.capitalSettlements;
    if (rows[idx]) {
        rows[idx].amount = parseAmount(val);
        refreshUi();
    }
}

export function handlePartnerFieldChange(idx, field, val, isManualAmt = false) {
    const st = getActiveSettlement();
    const p = st.profitSharing[idx];
    if (!p) return;

    if (field === 'percentage') {
        p.percentage = Number(val) || 0;
        p.manualOverride = false;
    } else if (field === 'calculatedAmount') {
        p.calculatedAmount = parseAmount(val);
        p.manualOverride = Boolean(isManualAmt);
        if (st.netProfit > 0) {
            p.percentage = safeRound((p.calculatedAmount / st.netProfit) * 100);
        }
    } else {
        p[field] = val;
    }

    refreshUi();
}

export function addSalesCostRow() {
    const st = getActiveSettlement();
    st.salesAndCosts.push({
        id: `sc-${Date.now()}`,
        desc: 'নতুন বিক্রয় বা খরচ',
        op: '-',
        amount: 0
    });
    refreshUi();
}

export function addPartnerRow() {
    const st = getActiveSettlement();
    st.profitSharing.push({
        id: `ps-${Date.now()}`,
        partnerName: 'নতুন পার্টনার',
        shareType: 'লভ্যাংশ',
        percentage: 0,
        calculatedAmount: 0
    });
    refreshUi();
}

export function addCapitalRow() {
    const st = getActiveSettlement();
    st.capitalSettlements.push({
        id: `cs-${Date.now()}`,
        desc: 'নতুন সমন্বয় বা মারফত দেনা-পাওনা',
        op: '+',
        amount: 0
    });
    refreshUi();
}

export function removeRow(section, idx) {
    const st = getActiveSettlement();
    if (section === 'sc') {
        if (st.salesAndCosts.length <= 1) {
            showToast('অন্তত একটি লাইন থাকতে হবে', 'warning');
            return;
        }
        st.salesAndCosts.splice(idx, 1);
    } else if (section === 'ps') {
        if (st.profitSharing.length <= 1) {
            showToast('অন্তত একজন পার্টনার থাকতে হবে', 'warning');
            return;
        }
        st.profitSharing.splice(idx, 1);
    } else if (section === 'cs') {
        st.capitalSettlements.splice(idx, 1);
    }
    refreshUi();
}

export async function saveToCloud() {
    const st = getActiveSettlement();
    const dateInput = document.getElementById('cont-date-input');
    if (dateInput) st.settlementDate = dateInput.value;

    try {
        Swal.fire({
            title: 'সংরক্ষণ হচ্ছে...',
            text: 'কন্টেইনার অডিট ক্লাউড ফায়ারস্টোরে সেভ করা হচ্ছে',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        const savedId = await ContainerSettlementDAO.save(st);
        st.id = savedId;
        Swal.close();
        showToast('কন্টেইনার হিসাব ক্লাউডে সফলভাবে সংরক্ষিত হয়েছে!', 'success');
    } catch (e) {
        Swal.close();
        console.error('Save container error:', e);
        showToast('সংরক্ষণ ব্যর্থ হয়েছে', 'error');
    }
}

export async function newContainerPrompt() {
    const { isConfirmed } = await Swal.fire({
        title: 'নতুন কন্টেইনার হিসাব শুরু?',
        text: 'বর্তমান স্ক্রিন পরিষ্কার করে একটি নতুন ফাঁকা কন্টেইনার অডিট শুরু করা হবে।',
        icon: 'question',
        background: '#0F172A',
        color: '#F8FAFC',
        showCancelButton: true,
        confirmButtonColor: '#14B8A6',
        cancelButtonColor: '#334155',
        confirmButtonText: 'হ্যাঁ, নতুন শুরু করুন',
        cancelButtonText: 'বাতিল'
    });

    if (isConfirmed) {
        createNewBlankSettlement();
        refreshUi();
        showToast('নতুন কন্টেইনার হিসাব তৈরি হয়েছে', 'info');
    }
}

export async function printReport() {
    const st = getActiveSettlement();
    const dateInput = document.getElementById('cont-date-input');
    if (dateInput) st.settlementDate = dateInput.value;
    const subInput = document.getElementById('cont-subtitle-input');
    if (subInput) st.subtitle = subInput.value;
    await printContainerSettlement(st);
}

export function exportExcel() {
    const st = getActiveSettlement();
    const rows = [
        ['মেসার্স মা মোটরস — কন্টেইনার পার্টনারশিপ হিসাব'],
        [`শিরোনাম: ${st.title}`],
        [`উপ-শিরোনাম: ${st.subtitle || ''}`],
        [`তারিখ: ${formatAppDate(st.settlementDate)}`, `অর্থবছর: ${st.fiscalPeriod || ''}`],
        [],
        ['১. মাল বিক্রয় ও কন্টেইনার লাভ হিসাব'],
        ['ক্র:', 'বিবরণ', 'প্রকার', 'টাকা (BDT)'],
        ...(st.salesAndCosts || []).map((r, i) => [i + 1, r.desc, r.op === '+' ? '(+) আয়' : '(-) বাদ', r.amount]),
        ['', 'সর্বমোট মাল বিক্রয়', '', st.totalSales],
        ['', 'সর্বমোট খরচ ও লেন্স', '', st.totalExpenses],
        ['', 'সর্বমোট কন্টেইনার লাভ', '', st.netProfit],
        [],
        ['২. পার্টনারদের লভ্যাংশ বণ্টন'],
        ['ক্র:', 'পার্টনারের নাম', 'শেয়ার প্রকার', 'হার (%)', 'লভ্যাংশ (টাকা)'],
        ...(st.profitSharing || []).map((p, i) => [i + 1, p.partnerName, p.shareType, `${p.percentage}%`, p.calculatedAmount]),
        ['', 'মোট বণ্টিত লভ্যাংশ', '', `${st.totalPercentage}%`, st.totalDistributedProfit],
        [],
        ['৩. মূলধন, এলসি মার্জিন ও সমন্বয় নিষ্পত্তি হিসাব'],
        ['ক্র:', 'বিবরণ', 'প্রকার', 'টাকা (BDT)'],
        ...(st.capitalSettlements || []).map((r, i) => [i + 1, r.desc, r.op === '+' ? '(+) যোগ' : '(-) বাদ', r.amount]),
        ['', 'সর্বমোট অবশিষ্ট সমন্বিত ব্যালেন্স', '', st.finalNetBalance]
    ];

    const escapeCsv = (val) => `"${String(val ?? '').replace(/"/g, '""')}"`;
    const csvContent = '\uFEFF' + rows.map(r => r.map(escapeCsv).join(',')).join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Container_Settlement_${st.containerCount || 'Audit'}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('এক্সেল ফাইল ডাউনলোড সম্পন্ন হয়েছে', 'success');
}

export async function openHistoryModal() {
    const list = getSavedSettlementsList();
    if (!list || list.length === 0) {
        await Swal.fire({
            title: 'কোনো হিস্ট্রি নেই',
            text: 'এখনো ক্লাউডে কোনো কন্টেইনার হিসাব সেভ করা হয়নি। বর্তমান ২৭ কন্টেইনারের হিসাবটি সংরক্ষণ বাটনে চাপ দিয়ে সেভ করতে পারেন।',
            icon: 'info',
            background: '#0F172A',
            color: '#F8FAFC',
            confirmButtonColor: '#14B8A6'
        });
        return;
    }

    const rowsHtml = list.map(item => `
        <div class="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-teal-500/50 transition-all">
            <div>
                <div class="text-sm font-black text-white">${escapeHTML(item.title || 'কন্টেইনার হিসাব')}</div>
                <div class="text-xs text-slate-400 mt-0.5">
                    তারিখ: ${escapeHTML(item.settlementDate || '')} • লাভ: <strong class="text-emerald-400 font-mono">৳ ${formatAmountWithComma(item.netProfit || 0)}</strong>
                </div>
            </div>
            <div class="flex items-center gap-2">
                <button type="button" onclick="window.containerActions.loadBatch('${escapeHTML(item.id)}')" class="px-3 py-1.5 rounded-lg bg-teal-500/20 hover:bg-teal-500 text-teal-300 hover:text-slate-950 font-bold text-xs transition-colors cursor-pointer">
                    <i class="fa-solid fa-arrow-down-to-bracket mr-1"></i>লোড করুন
                </button>
                <button type="button" onclick="window.containerActions.deleteBatchPrompt('${escapeHTML(item.id)}')" class="w-8 h-8 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 flex items-center justify-center transition-colors cursor-pointer" title="মুছে ফেলুন">
                    <i class="fa-solid fa-trash-can text-xs"></i>
                </button>
            </div>
        </div>
    `).join('');

    await Swal.fire({
        title: '<div class="text-base font-black text-white font-bn">সংরক্ষিত কন্টেইনার হিসাবসমূহ</div>',
        width: '700px',
        background: '#0F172A',
        color: '#F8FAFC',
        showConfirmButton: false,
        showCloseButton: true,
        customClass: { popup: 'border border-slate-800 rounded-3xl font-bn' },
        html: `<div class="space-y-2.5 max-h-[60vh] overflow-y-auto custom-scrollbar p-1 text-left font-bn">${rowsHtml}</div>`
    });
}

export async function loadBatch(id) {
    Swal.close();
    const doc = await ContainerSettlementDAO.getById(id);
    if (doc) {
        setActiveSettlement(doc);
        refreshUi();
        showToast(`"${doc.title}" সফলভাবে লোড হয়েছে`, 'success');
    } else {
        showToast('কন্টেইনার ডাটা খুঁজে পাওয়া যায়নি', 'error');
    }
}

export async function deleteBatchPrompt(id) {
    const verified = await promptSecurityPin();
    if (!verified) return;

    try {
        await ContainerSettlementDAO.delete(id);
        Swal.close();
        showToast('কন্টেইনার রেকর্ড সফলভাবে মুছে ফেলা হয়েছে', 'success');
    } catch (e) {
        console.error('Delete container error:', e);
        showToast('মুছে ফেলতে সমস্যা হয়েছে', 'error');
    }
}

