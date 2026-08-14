/**
 * --- ADMIN BARREL FILE ---
 * Orchestrates sub-modules for User Management, System Tools, and Permissions.
 */
import { renderAdmin } from './admin/admin-main.js';
import { loadAdminUsers } from './admin/user-manager.js';
import * as AuthActions from './admin/user-auth-actions.js';
import * as Permissions from './admin/user-permissions.js';
import * as SystemTools from './admin/system-tools.js';

import * as Banking from './admin/admin-banking.js';
import * as BalanceRecon from './admin/balance-reconciliation.js';

// Export for main navigation
export { renderAdmin };

// Maintain Global compatibility for HTML onclick="appAdmin.func()"
window.appAdmin = {
    loadAdminUsers,
    ...AuthActions,
    ...Permissions,
    ...SystemTools,
    ...Banking,
    ...BalanceRecon
};
