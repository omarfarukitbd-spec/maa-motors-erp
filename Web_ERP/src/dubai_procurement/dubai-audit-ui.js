/**
 * Dubai Procurement & Weekly Audit - Main UI Controller
 * 4-Pillar rolling reconciliation dashboard with fast memo generation and separated assets.
 */

import { DubaiActions } from './dubai-audit-actions.js';
import { calculateNetTheoreticalCash, calculateVariance } from './dubai-calc.js';
import { initMemoGrid, renderMemoGridContainer, getMemoItems } from './dubai-memo-grid.js';
import { initAssetManager, renderAssetSectionContainer, getAssetData } from './dubai-asset-modal.js';
import { initFlowGrids, renderRemittanceSection, renderExpenseSection, getFlowData } from './dubai-flow-grids.js';
import { printDubaiAuditSheet } from './dubai-print.js';
import { getDubaiAuditMainTemplate, buildReconciliationBarHtml } from './dubai-audit-template.js';
import { 
    formatAmountWithComma, parseAmount, safeRound, getTodayLocalDateString, 
    showToast 
} from '../utils.js';

let currentAuditId = null;
let auditHistory = [];

export async function renderDubaiProcurement(container) {
    if (!container) return;

    container.innerHTML = getDubaiAuditMainTemplate();

    initMemoGrid([], () => updateLiveCalculations());
    initAssetManager({}, () => updateLiveCalculations());
    initFlowGrids([], [], () => updateLiveCalculations());

    renderMemoGridContainer('dubai-memo-grid-section');
    renderAssetSectionContainer('dubai-asset-modal-section');
    renderRemittanceSection('dubai-remittance-grid-section');
    renderExpenseSection('dubai-expense-grid-section');

    setupTopActionButtons();
    listenToHistory();
}

function setupTopActionButtons() {
    const btnSave = document.getElementById('btn-dubai-save');
    if (btnSave) btnSave.onclick = () => onSaveAuditClick();

    const btnPrint = document.getElementById('btn-dubai-print');
    if (btnPrint) btnPrint.onclick = () => onPrintAuditClick();

    const btnNew = document.getElementById('btn-dubai-new');
    if (btnNew) btnNew.onclick = () => onNewAuditClick();

    const btnRoll = document.getElementById('btn-dubai-roll-forward');
    if (btnRoll) btnRoll.onclick = () => onRollForwardClick();
}

export function updateLiveCalculations() {
    const prevRem = safeRound(parseAmount(document.getElementById('dubai-prev-rem-input')?.value || 0));
    const prevPur = safeRound(parseAmount(document.getElementById('dubai-prev-pur-input')?.value || 0));
    const prevExp = safeRound(parseAmount(document.getElementById('dubai-prev-exp-input')?.value || 0));

    const flowData = getFlowData();
    const memoItems = getMemoItems();
    let newPur = 0;
    memoItems.forEach(m => { newPur = safeRound(newPur + safeRound(parseAmount(m.amount))); });

    const newRem = flowData.weeklyRemittanceTotal;
    const newExp = flowData.weeklyExpenseTotal;

    const cumRem = safeRound(prevRem + newRem);
    const cumPur = safeRound(prevPur + newPur);
    const cumExp = safeRound(prevExp + newExp);

    const calcCash = calculateNetTheoreticalCash(cumRem, cumPur, cumExp);
    const assetData = getAssetData();
    const variance = calculateVariance(assetData.totalPhysicalAssets, calcCash);

    const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    setVal('card-dubai-cum-remittance', `${formatAmountWithComma(cumRem)} AED`);
    setVal('card-dubai-prev-rem', formatAmountWithComma(prevRem));
    setVal('card-dubai-new-rem', `+${formatAmountWithComma(newRem)}`);

    setVal('card-dubai-cum-purchase', `${formatAmountWithComma(cumPur)} AED`);
    setVal('card-dubai-prev-pur', formatAmountWithComma(prevPur));
    setVal('card-dubai-new-pur', `+${formatAmountWithComma(newPur)}`);

    setVal('card-dubai-cum-expense', `${formatAmountWithComma(cumExp)} AED`);
    setVal('card-dubai-prev-exp', formatAmountWithComma(prevExp));
    setVal('card-dubai-new-exp', `+${formatAmountWithComma(newExp)}`);

    setVal('card-dubai-calc-cash', `${formatAmountWithComma(calcCash)} AED`);

    const barEl = document.getElementById('dubai-reconciliation-bar');
    if (barEl) {
        const config = buildReconciliationBarHtml(calcCash, assetData.totalPhysicalAssets, variance);
        barEl.className = config.className;
        barEl.innerHTML = config.html;
    }
}

window.handleDubaiPrevChange = function() {
    updateLiveCalculations();
};

async function onRollForwardClick() {
    const latest = await DubaiActions.rollForward();
    if (!latest) return;
    document.getElementById('dubai-prev-rem-input').value = formatAmountWithComma(latest.cumulativeRemittance || 0);
    document.getElementById('dubai-prev-pur-input').value = formatAmountWithComma(latest.cumulativePurchaseTotal || 0);
    document.getElementById('dubai-prev-exp-input').value = formatAmountWithComma(latest.cumulativeExpenseTotal || 0);
    updateLiveCalculations();
}

async function onSaveAuditClick() {
    const containerNo = document.getElementById('dubai-container-no')?.value?.trim() || 'CT-DXB-01';
    const weekEndDate = document.getElementById('dubai-week-date')?.value?.trim() || getTodayLocalDateString();
    const note = document.getElementById('dubai-audit-note')?.value?.trim() || '';

    const prevRem = safeRound(parseAmount(document.getElementById('dubai-prev-rem-input')?.value || 0));
    const prevPur = safeRound(parseAmount(document.getElementById('dubai-prev-pur-input')?.value || 0));
    const prevExp = safeRound(parseAmount(document.getElementById('dubai-prev-exp-input')?.value || 0));

    const flowData = getFlowData();
    const memoItems = getMemoItems();
    let weeklyPur = 0;
    memoItems.forEach(m => { weeklyPur = safeRound(weeklyPur + safeRound(parseAmount(m.amount))); });

    const cumRem = safeRound(prevRem + flowData.weeklyRemittanceTotal);
    const cumPur = safeRound(prevPur + weeklyPur);
    const cumExp = safeRound(prevExp + flowData.weeklyExpenseTotal);
    const calcCash = calculateNetTheoreticalCash(cumRem, cumPur, cumExp);
    const assetData = getAssetData();
    const variance = calculateVariance(assetData.totalPhysicalAssets, calcCash);

    const payload = {
        containerNo,
        weekEndDate,
        note,
        prevRemittance: prevRem,
        weeklyRemittanceTotal: flowData.weeklyRemittanceTotal,
        cumulativeRemittance: cumRem,
        prevPurchaseTotal: prevPur,
        weeklyPurchaseTotal: weeklyPur,
        cumulativePurchaseTotal: cumPur,
        memoCount: memoItems.length,
        prevExpenseTotal: prevExp,
        weeklyExpenseTotal: flowData.weeklyExpenseTotal,
        cumulativeExpenseTotal: cumExp,
        calculatedCashBalance: calcCash,
        cashInHand: assetData.cashInHand,
        marketAdvance: assetData.marketAdvance,
        personalHoldings: assetData.personalHoldings,
        messBalance: assetData.messBalance,
        totalPhysicalAssets: assetData.totalPhysicalAssets,
        varianceAmount: variance,
        status: 'CLOSED'
    };
    if (currentAuditId) payload.id = currentAuditId;

    const savedId = await DubaiActions.saveAudit(payload, memoItems);
    if (savedId) currentAuditId = savedId;
}

function onPrintAuditClick() {
    const prevRem = safeRound(parseAmount(document.getElementById('dubai-prev-rem-input')?.value || 0));
    const prevPur = safeRound(parseAmount(document.getElementById('dubai-prev-pur-input')?.value || 0));
    const prevExp = safeRound(parseAmount(document.getElementById('dubai-prev-exp-input')?.value || 0));

    const flowData = getFlowData();
    const memoItems = getMemoItems();
    let weeklyPur = 0;
    memoItems.forEach(m => { weeklyPur = safeRound(weeklyPur + safeRound(parseAmount(m.amount))); });

    const cumRem = safeRound(prevRem + flowData.weeklyRemittanceTotal);
    const cumPur = safeRound(prevPur + weeklyPur);
    const cumExp = safeRound(prevExp + flowData.weeklyExpenseTotal);
    const calcCash = calculateNetTheoreticalCash(cumRem, cumPur, cumExp);
    const assetData = getAssetData();
    const variance = calculateVariance(assetData.totalPhysicalAssets, calcCash);

    const auditObj = {
        containerNo: document.getElementById('dubai-container-no')?.value || 'CT-DXB-01',
        weekEndDate: document.getElementById('dubai-week-date')?.value || getTodayLocalDateString(),
        prevRemittance: prevRem,
        weeklyRemittanceTotal: flowData.weeklyRemittanceTotal,
        cumulativeRemittance: cumRem,
        prevPurchaseTotal: prevPur,
        weeklyPurchaseTotal: weeklyPur,
        cumulativePurchaseTotal: cumPur,
        memoCount: memoItems.length,
        prevExpenseTotal: prevExp,
        weeklyExpenseTotal: flowData.weeklyExpenseTotal,
        cumulativeExpenseTotal: cumExp,
        calculatedCashBalance: calcCash,
        cashInHand: assetData.cashInHand,
        marketAdvance: assetData.marketAdvance,
        personalHoldings: assetData.personalHoldings,
        messBalance: assetData.messBalance,
        totalPhysicalAssets: assetData.totalPhysicalAssets,
        varianceAmount: variance,
        status: 'CLOSED'
    };

    printDubaiAuditSheet(auditObj, memoItems, flowData.remittances, flowData.expenses);
}

function onNewAuditClick() {
    currentAuditId = null;
    initMemoGrid([], () => updateLiveCalculations());
    initAssetManager({}, () => updateLiveCalculations());
    initFlowGrids([], [], () => updateLiveCalculations());

    renderMemoGridContainer('dubai-memo-grid-section');
    renderAssetSectionContainer('dubai-asset-modal-section');
    renderRemittanceSection('dubai-remittance-grid-section');
    renderExpenseSection('dubai-expense-grid-section');

    document.getElementById('dubai-week-date').value = getTodayLocalDateString();
    document.getElementById('dubai-audit-note').value = '';
    updateLiveCalculations();
    showToast('নতুন সপ্তাহের ব্ল্যাঙ্ক অডিট ফরম প্রস্তুত', 'info');
}

function listenToHistory() {
    DubaiActions.listenAudits(audits => {
        auditHistory = audits;
        renderHistoryRows();
    });
}

function renderHistoryRows() {
    const tbody = document.getElementById('dubai-history-tbody');
    if (!tbody) return;

    if (auditHistory.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" class="p-4 text-center text-slate-500 italic">কোনো পূর্ববর্তী অডিট হিস্ট্রি পাওয়া যায়নি।</td></tr>`;
        return;
    }

    let html = '';
    auditHistory.forEach(a => {
        const vAmt = safeRound(parseAmount(a.varianceAmount));
        const vClass = vAmt === 0 ? 'text-emerald-400 font-bold' : vAmt > 0 ? 'text-sky-400 font-bold' : 'text-red-400 font-bold';
        html += `
            <tr class="border-b border-slate-800/60 hover:bg-slate-800/40 transition-colors">
                <td class="p-2.5 font-bold font-mono text-white">${a.weekEndDate || ''}</td>
                <td class="p-2.5 text-slate-400">${a.containerNo || ''}</td>
                <td class="p-2.5 text-right font-mono text-emerald-400">${formatAmountWithComma(a.cumulativeRemittance)}</td>
                <td class="p-2.5 text-right font-mono text-amber-400">${formatAmountWithComma(a.cumulativePurchaseTotal)}</td>
                <td class="p-2.5 text-right font-mono text-red-400">${formatAmountWithComma(a.cumulativeExpenseTotal)}</td>
                <td class="p-2.5 text-right font-mono text-emerald-400">${formatAmountWithComma(a.cashInHand)}</td>
                <td class="p-2.5 text-right font-mono text-cyan-400">${formatAmountWithComma(a.marketAdvance)}</td>
                <td class="p-2.5 text-right font-mono ${vClass}">${formatAmountWithComma(vAmt)}</td>
                <td class="p-2.5 text-center">
                    <div class="flex items-center justify-center gap-1.5">
                        <button type="button" onclick="window.loadDubaiAuditHistory('${a.id}')" class="p-1 rounded hover:bg-slate-700 text-sky-400" title="লোড করুন">
                            <i class="fa-solid fa-folder-open text-xs"></i>
                        </button>
                        <button type="button" onclick="window.printDubaiAuditHistory('${a.id}')" class="p-1 rounded hover:bg-slate-700 text-slate-300" title="প্রিন্ট করুন">
                            <i class="fa-solid fa-print text-xs"></i>
                        </button>
                        <button type="button" onclick="window.deleteDubaiAuditHistory('${a.id}')" class="p-1 rounded hover:bg-red-500/20 text-red-400" title="মুছে ফেলুন">
                            <i class="fa-solid fa-trash-can text-xs"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
}

window.loadDubaiAuditHistory = async function(id) {
    const data = await DubaiActions.loadAudit(id);
    if (!data) return;
    const { audit, memos } = data;

    currentAuditId = audit.id;
    document.getElementById('dubai-container-no').value = audit.containerNo || 'CT-DXB-01';
    document.getElementById('dubai-week-date').value = audit.weekEndDate || '';
    document.getElementById('dubai-audit-note').value = audit.note || '';

    document.getElementById('dubai-prev-rem-input').value = formatAmountWithComma(audit.prevRemittance || 0);
    document.getElementById('dubai-prev-pur-input').value = formatAmountWithComma(audit.prevPurchaseTotal || 0);
    document.getElementById('dubai-prev-exp-input').value = formatAmountWithComma(audit.prevExpenseTotal || 0);

    initMemoGrid(memos || [], () => updateLiveCalculations());
    renderMemoGridContainer('dubai-memo-grid-section');

    initAssetManager({
        cashInHand: audit.cashInHand || 0,
        marketAdvance: audit.marketAdvance || 0,
        personalHoldings: audit.personalHoldings || [],
        messBalance: audit.messBalance || 0
    }, () => updateLiveCalculations());
    renderAssetSectionContainer('dubai-asset-modal-section');

    updateLiveCalculations();
    showToast(`অডিট রেকর্ড লোড করা হয়েছে (${audit.weekEndDate || ''})`, 'info');
};

window.printDubaiAuditHistory = async function(id) {
    await DubaiActions.printAudit(id);
};

window.deleteDubaiAuditHistory = async function(id) {
    const deleted = await DubaiActions.deleteAudit(id);
    if (deleted && currentAuditId === id) onNewAuditClick();
};

export function unsubscribeDubaiAudits() {
    DubaiActions.unsubscribe();
}
