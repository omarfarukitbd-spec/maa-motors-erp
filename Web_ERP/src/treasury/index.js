import { renderTreasuryUI, unsubscribeTreasuryListener } from './treasury-ui.js';

/**
 *  Master Treasury & Central Fund Flow Module
 */
export function renderTreasury(container) {
    if (!container) return;
    renderTreasuryUI(container);
}

export function unsubscribeTreasury() {
    unsubscribeTreasuryListener();
}

window.renderTreasury = renderTreasury;
window.unsubscribeTreasury = unsubscribeTreasury;
