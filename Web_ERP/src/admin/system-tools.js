import Swal from 'sweetalert2';
import { db } from '../firebase-config.js';
import { SettingsDAO, ZoneDAO, CustomerDAO } from '../dao.js';
import { promptSecurityPin } from '../utils.js';
import { initCustomerCache, getCustomerCache } from '../customer/index.js';
import { auditLog } from '../audit.js';

export async function setNextAccountNo() {
    try {
        initCustomerCache();
        const zones = await ZoneDAO.getAllZones();
        if (!zones || zones.length === 0) {
            return Swal.fire({ title: 'কোনো জোন পাওয়া যায়নি!', text: 'সিরিয়াল আপডেট করার আগে আপনাকে অন্তত একটি জোন তৈরি করতে হবে।', icon: 'warning', customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' } });
        }

        let zoneOpts = '<option value="">-- জোন সিলেক্ট করুন --</option>';
        zones.forEach(z => { zoneOpts += `<option value="${z.name}">${z.name}</option>`; });

        const { value: formValues } = await Swal.fire({
            title: 'অটো-সিরিয়াল কাউন্টার সেট করুন',
            html: `<div class="text-left space-y-4 font-bn p-2">
                    <div><label class="block text-xs font-bold text-slate-400 mb-1">জোন সিলেক্ট করুন</label><select id="set-next-zone" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500">${zoneOpts}</select></div>
                    <div><label class="block text-xs font-bold text-slate-400 mb-1">বর্তমান সিরিয়াল নম্বর (e.g. 5 মানে পরবর্তী আইডি 0006 হবে)</label><input id="set-next-val" type="number" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500" placeholder="e.g. 5"></div>
                </div>`,
            showCancelButton: true, confirmButtonText: 'আপডেট করুন', cancelButtonText: 'বাতিল',
            customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' },
            preConfirm: () => {
                const zone = document.getElementById('set-next-zone').value;
                const val = parseInt(document.getElementById('set-next-val').value);
                if (!zone || isNaN(val)) return Swal.showValidationMessage('সবগুলো ঘর পূরণ করুন');
                return { zone, val };
            }
        });

        if (formValues) {
            const isPinValid = await promptSecurityPin("অটো-সিরিয়াল কাউন্টার পরিবর্তন");
            if (!isPinValid) return;
            try {
                await SettingsDAO.updateZoneCounter(formValues.zone, formValues.val);
                Swal.fire('সফল!', `জোনের (${formValues.zone}) পরবর্তী সিরিয়াল আপডেট করা হয়েছে।`, 'success');
            } catch (e) { Swal.fire('Error', 'কাউন্টার আপডেট করা যায়নি।', 'error'); }
        }
    } catch (err) {
        console.error("setNextAccountNo error:", err);
        Swal.fire('ত্রুটি!', 'ডাটা লোড করতে সমস্যা হয়েছে। দয়া করে পেজ রিফ্রেশ করে আবার চেষ্টা করুন।', 'error');
    }
}

export async function showIndividualFixer() {
    initCustomerCache();
    const customers = getCustomerCache();
    let optionsHtml = '<option value="">-- কাস্টমার সিলেক্ট করুন --</option>';
    customers.forEach(c => {
        optionsHtml += `<option value="${c.id}" data-acc="${c.accountNo || ''}">${c.accountNo ? '['+c.accountNo+'] ' : ''}${c.name}</option>`;
    });

    const { value: formValues } = await Swal.fire({
        title: 'ID ম্যানেজার',
        html: `<div class="text-left space-y-4 font-bn p-2">
                <div><label class="block text-xs font-bold text-slate-400 mb-1">কাস্টমার সিলেক্ট করুন</label><select id="fix-cust-sel" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500" onchange="document.getElementById('fix-new-acc').value = this.options[this.selectedIndex].dataset.acc">${optionsHtml}</select></div>
                <div><label class="block text-xs font-bold text-slate-400 mb-1">নতুন অ্যাকাউন্ট নং (৪ ডিজিট)</label><input id="fix-new-acc" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500" placeholder="e.g. 0001"></div>
            </div>`,
        showCancelButton: true, confirmButtonText: 'পরিবর্তন করুন', cancelButtonText: 'বাতিল',
        customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' },
        preConfirm: () => {
            const id = document.getElementById('fix-cust-sel').value;
            const newAcc = document.getElementById('fix-new-acc').value.trim();
            if (!id || !newAcc) return Swal.showValidationMessage('সবগুলো ঘর পূরণ করুন');
            return { id, newAcc };
        }
    });

    if (formValues) {
        const isPinValid = await promptSecurityPin("অ্যাকাউন্ট নং পরিবর্তন");
        if (!isPinValid) return;
        try {
            await CustomerDAO.update(formValues.id, { accountNo: formValues.newAcc });
            auditLog('ID_FIX', 'Admin', formValues.id, '', { newAccountNo: formValues.newAcc });
            Swal.fire('সফল!', 'অ্যাকাউন্ট নাম্বার পরিবর্তন করা হয়েছে।', 'success');
        } catch (e) { Swal.fire('Error', 'পরিবর্তন করা যায়নি।', 'error'); }
    }
}

export async function autoSyncZoneCounters() {
    if (window.AppState.currentUserRole !== 'Admin') {
        return Swal.fire('অ্যাক্সেস ডিনাইড!', 'শুধুমাত্র অ্যাডমিন জোন কাউন্টার সিঙ্ক করতে পারবেন।', 'error');
    }

    const isPinValid = await promptSecurityPin("জোন কাউন্টার অটো-সিঙ্ক (Auto Reset)");
    if (!isPinValid) return;

    try {
        Swal.fire({
            title: 'সিঙ্ক হচ্ছে...', text: 'সকল জোনের কাস্টমার সিরিয়াল ও কাউন্টার স্ক্যান করা হচ্ছে...', allowOutsideClick: false,
            didOpen: () => Swal.showLoading(), customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn' }
        });

        const zones = await ZoneDAO.getAllZones();
        const customers = await CustomerDAO.getAll();
        if (!zones || zones.length === 0) return Swal.fire('তথ্য পাওয়া যায়নি', 'কোনো জোন নিবন্ধিত নেই।', 'warning');

        const summaryResults = [];
        for (const zone of zones) {
            const zName = zone.name;
            const zoneCusts = customers.filter(c => (c.zone || '').trim() === zName);

            let maxSerial = 0;
            zoneCusts.forEach(c => {
                const acc = c.accountNo || '';
                const match = acc.match(/\d+/);
                if (match) {
                    const num = parseInt(match[0], 10);
                    if (!isNaN(num) && num > maxSerial) maxSerial = num;
                }
            });

            await SettingsDAO.updateZoneCounter(zName, maxSerial);
            summaryResults.push(`• <strong>${zName}</strong>: সক্রিয় কাস্টমার ${zoneCusts.length} জন <i class="fa-solid fa-arrow-right text-cyan-400 mx-1"></i> কাউন্টার সেট: <strong>${maxSerial}</strong> (পরবর্তী: ${maxSerial + 1})`);
        }

        auditLog('AUTO_SYNC_COUNTERS', 'Admin', 'Counters', 'Zone Counters Auto Synced');

        Swal.fire({
            title: '<i class="fa-solid fa-rotate text-emerald-400 mr-2"></i>জোন কাউন্টার সিঙ্ক সফল!',
            html: `<div class="text-left space-y-2 font-bn p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-300">
                    <p class="font-bold text-white mb-2">ডাটাবেসের বর্তমান সক্রিয় কাস্টমার সংখ্যা অনুযায়ী সিরিয়াল কাউন্টার আপডেট করা হয়েছে:</p>
                    ${summaryResults.join('<br>')}
                </div>`,
            icon: 'success', confirmButtonText: 'ঠিক আছে',
            customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn' }
        });

        if (window.loadCustomers) window.loadCustomers();
    } catch (err) {
        console.error("autoSyncZoneCounters error:", err);
        Swal.fire('ত্রুটি!', 'কাউন্টার সিঙ্ক করার সময় সমস্যা হয়েছে।', 'error');
    }
}

export async function resequenceZoneAccountNumbers(presetZoneName = null) {
    if (window.AppState.currentUserRole !== 'Admin') {
        return Swal.fire('অ্যাক্সেস ডিনাইড!', 'শুধুমাত্র অ্যাডমিন সিরিয়াল সাজাতে পারবেন।', 'error');
    }

    const zones = await ZoneDAO.getAllZones();
    if (!zones || zones.length === 0) return Swal.fire('warning', 'কোনো জোন নেই!');

    let selectedZone = presetZoneName;
    if (!selectedZone) {
        let zoneOpts = '<option value="">-- জোন সিলেক্ট করুন --</option>';
        zones.forEach(z => { zoneOpts += `<option value="${z.name}">${z.name}</option>`; });

        const { value: sel } = await Swal.fire({
            title: 'সিরিয়াল অনুযায়ী অ্যাকাউন্ট পুনঃসাজানো',
            html: `<div class="text-left space-y-3 font-bn p-2">
                    <p class="text-xs text-amber-400 font-bold bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
                        <i class="fa-solid fa-triangle-exclamation text-amber-400 mr-1.5"></i>সতর্কবার্তা: এটি সিলেক্ট করা জোনের সকল সক্রিয় কাস্টমারের অ্যাকাউন্ট নম্বর ১, ২, ৩... ক্রমানুসারে পুনরায় সেট করবে।
                    </p>
                    <div><label class="block text-xs font-bold text-slate-400 mb-1">জোন সিলেক্ট করুন</label><select id="reseq-zone-sel" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500">${zoneOpts}</select></div>
                </div>`,
            showCancelButton: true, confirmButtonText: 'পুনরায় সাজান', cancelButtonText: 'বাতিল',
            customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' },
            preConfirm: () => {
                const z = document.getElementById('reseq-zone-sel').value;
                if (!z) return Swal.showValidationMessage('জোন সিলেক্ট করুন');
                return z;
            }
        });
        selectedZone = sel;
    }

    if (!selectedZone) return;

    const isPinValid = await promptSecurityPin("কাস্টমার সিরিয়াল পুনঃসাজানো");
    if (!isPinValid) return;

    try {
        Swal.fire({ title: 'প্রসেস হচ্ছে...', text: 'কাস্টমারদের অ্যাকাউন্ট নম্বর ক্রমানুসারে আপডেট হচ্ছে...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

        const customers = await CustomerDAO.getAll();
        const zoneObj = zones.find(z => z.name === selectedZone);
        const zoneCode = zoneObj ? (zoneObj.code || '') : '';
        const zoneCusts = customers.filter(c => (c.zone || '').trim() === selectedZone);

        zoneCusts.sort((a, b) => (a.accountNo || '').localeCompare(b.accountNo || '', undefined, { numeric: true }));

        let updatedCount = 0;
        const ops = [];
        for (let i = 0; i < zoneCusts.length; i++) {
            const c = zoneCusts[i];
            const newSerialStr = String(i + 1).padStart(4, '0');
            const newAccNo = zoneCode + newSerialStr;
            if (c.accountNo !== newAccNo) {
                ops.push({ ref: CustomerDAO.getRef(c.id), newAccNo });
                updatedCount++;
            }
        }

        const CHUNK_SIZE = 400;
        for (let i = 0; i < ops.length; i += CHUNK_SIZE) {
            const batch = db.batch();
            ops.slice(i, i + CHUNK_SIZE).forEach(item => batch.update(item.ref, { accountNo: item.newAccNo }));
            await batch.commit();
        }

        await SettingsDAO.updateZoneCounter(selectedZone, zoneCusts.length);
        auditLog('RESEQUENCE_ACC_NO', 'Admin', selectedZone, `${updatedCount} updated`);

        Swal.fire('সফল!', `জোনের (${selectedZone}) ${zoneCusts.length} জন কাস্টমারের আইডি ১ থেকে ${zoneCusts.length} সিরিয়ালে সুন্দরভাবে সাজানো হয়েছে।`, 'success');
        if (window.loadCustomers) window.loadCustomers();
    } catch (err) {
        console.error("resequenceZoneAccountNumbers error:", err);
        Swal.fire('ত্রুটি!', 'সিরিয়াল পুনঃসাজানোর সময় সমস্যা হয়েছে।', 'error');
    }
}

export async function syncSingleZoneCounter(zoneName) {
    if (!zoneName) return;
    try {
        const customers = await CustomerDAO.getAll();
        const zoneCusts = customers.filter(c => (c.zone || '').trim() === zoneName);
        let maxSerial = 0;
        zoneCusts.forEach(c => {
            const acc = c.accountNo || '';
            const match = acc.match(/\d+/);
            if (match) {
                const num = parseInt(match[0], 10);
                if (!isNaN(num) && num > maxSerial) maxSerial = num;
            }
        });
        await SettingsDAO.updateZoneCounter(zoneName, maxSerial);
    } catch (e) { console.error('syncSingleZoneCounter error:', e); }
}

window.resequenceZoneModal = resequenceZoneAccountNumbers;

import { downloadFullSystemBackup, restoreSystemFromBackup } from '../backup/index.js';
window.downloadFullSystemBackup = downloadFullSystemBackup;
window.restoreSystemFromBackup = restoreSystemFromBackup;
