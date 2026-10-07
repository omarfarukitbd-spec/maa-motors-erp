import { openGoogleSyncAdminModal } from './google-sync-admin-modal.js';
import { triggerSilentCustomerGoogleSync, executeFullGoogleContactsSync } from './google-contact-sync-service.js';

/**
 * Google People API ক্লাউড অটো-সিঙ্ক মূল কন্ট্রোলার (এডমিন মডাল ওপেন করে)
 */
export async function startGooglePeopleSyncFlow() {
    return await openGoogleSyncAdminModal();
}

export {
    openGoogleSyncAdminModal,
    triggerSilentCustomerGoogleSync,
    executeFullGoogleContactsSync
};
