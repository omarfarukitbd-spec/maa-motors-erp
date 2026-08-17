import Swal from 'sweetalert2';
import { db } from '../firebase-config.js';
import { SettingsDAO, ZoneDAO, CustomerDAO } from '../dao.js';
import { promptSecurityPin } from '../utils.js';
import { auditLog } from '../audit.js';

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
