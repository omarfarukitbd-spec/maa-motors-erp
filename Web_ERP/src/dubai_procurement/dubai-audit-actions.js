/**
 * Dubai Procurement & Weekly Audit - Action Handlers & History Manager
 * Manages save, delete, roll-forward, and history loading for weekly audits.
 */

import { DubaiDAO } from './dubai-dao.js';
import { safeRound, showToast, promptSecurityPin } from '../utils.js';
import { printDubaiAuditSheet } from './dubai-print.js';

let unsubscribeAudits = null;

export const DubaiActions = {
    async saveAudit(auditPayload, memoItems) {
        try {
            const savedId = await DubaiDAO.saveWeeklyAudit(auditPayload);
            await DubaiDAO.saveMemos(savedId, Array.isArray(memoItems) ? memoItems : []);
            showToast('দুবাই সাপ্তাহিক অডিট সফলভাবে সংরক্ষিত হয়েছে!', 'success');
            return savedId;
        } catch (err) {
            console.error('Save audit error:', err);
            showToast('অডিট সংরক্ষণ করতে সমস্যা হয়েছে', 'error');
            throw err;
        }
    },

    async rollForward() {
        const latest = await DubaiDAO.getPreviousAudit();
        if (!latest) {
            showToast('কোনো পূর্ববর্তী সংরক্ষিত অডিট রেকর্ড পাওয়া যায়নি', 'error');
            return null;
        }
        showToast(`গত অডিটের ব্যালেন্স রোল-ফরওয়ার্ড করা হয়েছে (${latest.weekEndDate || ''})`, 'success');
        return latest;
    },

    async loadAudit(id) {
        try {
            const audit = await DubaiDAO.getAuditById(id);
            if (!audit) return null;
            const memos = await DubaiDAO.getMemosByAuditId(id);
            return { audit, memos };
        } catch (e) {
            console.error('Error loading audit:', e);
            return null;
        }
    },

    async printAudit(id) {
        try {
            const audit = await DubaiDAO.getAuditById(id);
            if (!audit) return;
            const memos = await DubaiDAO.getMemosByAuditId(id);
            printDubaiAuditSheet(audit, memos, [], []);
        } catch (e) {
            console.error('Error printing audit:', e);
        }
    },

    async deleteAudit(id) {
        const pinOk = await promptSecurityPin('দুবাই অডিট রেকর্ড ডিলিট');
        if (!pinOk) return false;

        try {
            await DubaiDAO.deleteWeeklyAudit(id);
            showToast('অডিট রেকর্ড মুছে ফেলা হয়েছে', 'success');
            return true;
        } catch (e) {
            console.error('Delete audit error:', e);
            showToast('অডিট মুছতে সমস্যা হয়েছে', 'error');
            return false;
        }
    },

    listenAudits(callback) {
        if (unsubscribeAudits) unsubscribeAudits();
        unsubscribeAudits = DubaiDAO.listenWeeklyAudits(callback);
    },

    unsubscribe() {
        if (unsubscribeAudits) {
            unsubscribeAudits();
            unsubscribeAudits = null;
        }
    }
};
