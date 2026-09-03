import { renderTreasuryUI } from './treasury-ui.js';

/**
 * ️ Master Treasury & Central Fund Flow Module
 */
export function renderTreasury(container) {
    if (!container) return;
    renderTreasuryUI(container);
}

window.renderTreasury = renderTreasury;
