import Swal from 'sweetalert2';
import { ZoneDAO, CustomerDAO, SettingsDAO } from '../dao.js';
import { promptSecurityPin } from '../utils.js';
import { auditLog } from '../audit.js';

/**
 * Render Zone Management Section HTML for Settings Page
 */
export function renderZoneManagementSection() {
    return `
        <div class="m3-card lg:col-span-2 space-y-4 border border-indigo-500/20 bg-slate-900/60 backdrop-blur-xl">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                    <h3 class="font-black text-white text-base flex items-center gap-2">
                        <i class="fa-solid fa-map-location-dot text-indigo-400 text-lg"></i>
                        <span>জোন ও অঞ্চল ব্যবস্থাপনা (Zone Setup & Routing)</span>
                    </h3>
                    <p class="text-xs text-slate-400 mt-0.5">দোকানের প্রতিটি জোনের শর্ট কোড ও কাস্টমার হিসাব আইডি পরিচালনা করুন</p>
                </div>
                <div class="flex items-center gap-2">
                    <button type="button" onclick="window.healAccountNumbersFlow()" class="px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 text-xs font-bold transition flex items-center gap-1.5" title="ভুল একাউন্ট নম্বর অটো ফিক্স করুন">
                        <i class="fa-solid fa-wand-magic-sparkles"></i>
                        <span>একাউন্ট আইডি ফিক্স</span>
                    </button>
                    <button type="button" onclick="window.showAddZoneModal()" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-indigo-600/30">
                        <i class="fa-solid fa-circle-plus"></i>
                        <span>নতুন জোন যোগ করুন</span>
                    </button>
                </div>
            </div>

            <div id="zone-list-container" class="overflow-x-auto min-h-[140px]">
                <div class="text-center text-slate-400 py-8 text-xs font-bn">
                    <i class="fa-solid fa-spinner fa-spin text-indigo-400 text-lg mb-2"></i>
                    <p>জোন ডাটা লোড হচ্ছে...</p>
                </div>
            </div>
        </div>
    `;
}

/**
 * Load and render zone items list inside the container
 */
export async function loadZoneList() {
    const container = document.getElementById('zone-list-container');
    if (!container) return;

    try {
        const [zones, customers] = await Promise.all([
            ZoneDAO.getAllZones(),
            CustomerDAO.getAll()
        ]);

        if (!zones || zones.length === 0) {
            container.innerHTML = `
                <div class="text-center text-slate-400 py-8 text-xs font-bn bg-slate-950/40 rounded-2xl border border-slate-800">
                    <i class="fa-solid fa-folder-open text-slate-500 text-2xl mb-2"></i>
                    <p>কোনো জোন নিবন্ধিত নেই। "নতুন জোন যোগ করুন" বাটনে ক্লিক করে প্রথম জোন যোগ করুন।</p>
                </div>`;
            return;
        }

        // Count customers per zone
        const custCountMap = {};
        customers.forEach(c => {
            const zName = (c.zone || 'General').trim();
            custCountMap[zName] = (custCountMap[zName] || 0) + 1;
        });

        let rowsHTML = zones.map(z => {
            const count = custCountMap[z.name] || 0;
            const codeDisp = z.code || 'N/A';
            return `
                <tr class="border-b border-slate-800/60 hover:bg-slate-800/30 transition text-xs font-bn">
                    <td class="py-3 px-4 text-white font-bold flex items-center gap-2">
                        <div class="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-mono font-bold text-xs">
                            ${codeDisp}
                        </div>
                        <span>${z.name}</span>
                    </td>
                    <td class="py-3 px-4 text-slate-300 font-mono font-bold">
                        <span class="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-amber-400 text-[11px]">${codeDisp}</span>
                    </td>
                    <td class="py-3 px-4 text-slate-300">
                        <span class="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-bold border border-blue-500/20">${count} জন কাস্টমার</span>
                    </td>
                    <td class="py-3 px-4 text-right">
                        <div class="flex items-center justify-end gap-1.5">
                            <button type="button" onclick="window.resequenceZoneModal('${z.name}')" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-bold transition flex items-center gap-1" title="সিরিয়াল ১, ২, ৩... অনুযায়ী পুনঃসাজান">
                                <i class="fa-solid fa-list-ol text-blue-400"></i>
                                <span class="hidden sm:inline">পুনঃসাজান</span>
                            </button>
                            <button type="button" onclick="window.showEditZoneModal('${z.id}', '${z.name}', '${codeDisp}')" class="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition" title="এডিট করুন">
                                <i class="fa-solid fa-pen-to-square"></i>
                            </button>
                            <button type="button" onclick="window.deleteZoneFlow('${z.id}', '${z.name}')" class="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition" title="ডিলেট করুন">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        container.innerHTML = `
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="border-b border-slate-800 text-[11px] text-slate-400 font-black uppercase tracking-wider bg-slate-950/40">
                        <th class="py-2.5 px-4">জোনের নাম</th>
                        <th class="py-2.5 px-4">জোন কোড</th>
                        <th class="py-2.5 px-4">মোট কাস্টমার</th>
                        <th class="py-2.5 px-4 text-right">অ্যাকশন</th>
                    </tr>
                </thead>
                <tbody>${rowsHTML}</tbody>
            </table>
        `;
    } catch (err) {
        console.error("loadZoneList error:", err);
        container.innerHTML = `<div class="text-center text-red-400 py-6 text-xs font-bn">জোন ডাটা লোড করতে ব্যর্থ হয়েছে</div>`;
    }
}

/**
 * Modal to Add New Zone
 */
export async function showAddZoneModal() {
    const { value: formValues } = await Swal.fire({
        title: '<div class="flex items-center justify-center gap-2 text-indigo-400 font-bn font-black"><i class="fa-solid fa-map-location-dot"></i><span>নতুন জোন যোগ করুন</span></div>',
        html: `
            <div class="space-y-3 text-left font-bn p-2">
                <div>
                    <label class="block text-xs font-bold text-slate-300 mb-1">জোনের নাম * (যেমন: চট্টগ্রাম জোন)</label>
                    <input id="sw-zn-name" class="m3-field text-xs font-bold" placeholder="জোনের নাম">
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-300 mb-1">জোন শর্ট কোড * (যেমন: 2, 3 বা CTG)</label>
                    <input id="sw-zn-code" class="m3-field text-xs font-bold font-mono uppercase" placeholder="যেমন: 2">
                    <p class="text-[10px] text-slate-400 mt-1">এই কোডটি কাস্টমার একাউন্ট আইডির পূর্বে যুক্ত হবে (যেমন: জোন ২ হলে আইডি ২০০০০১)</p>
                </div>
            </div>`,
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-floppy-disk mr-1.5"></i>সেভ করুন',
        cancelButtonText: 'বাতিল',
        customClass: { popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn' },
        preConfirm: () => {
            const name = document.getElementById('sw-zn-name')?.value?.trim();
            const code = document.getElementById('sw-zn-code')?.value?.trim()?.toUpperCase();
            if (!name || !code) return Swal.showValidationMessage('জোনের নাম ও শর্ট কোড উভয়ই আবশ্যক!');
            return { name, code };
        }
    });

    if (!formValues) return;

    try {
        const existing = await ZoneDAO.getByCode(formValues.code);
        if (existing) {
            return Swal.fire('সতর্কতা!', `জোন কোড "${formValues.code}" ইতোমধ্যে "${existing.name}" জোনে ব্যবহৃত হচ্ছে!`, 'warning');
        }

        await ZoneDAO.add({ name: formValues.name, code: formValues.code });
        auditLog('CREATE_ZONE', 'Settings', formValues.name, `Code: ${formValues.code}`);
        Swal.fire('সফল!', `নতুন জোন "${formValues.name}" (কোড: ${formValues.code}) তৈরি হয়েছে।`, 'success');
        loadZoneList();
        if (window.loadAllZones) window.loadAllZones();
    } catch (e) {
        console.error("showAddZoneModal error:", e);
        Swal.fire('ত্রুটি!', 'জোন সেভ করতে সমস্যা হয়েছে।', 'error');
    }
}

/**
 * Modal to Edit Zone Name or Code
 */
export async function showEditZoneModal(zoneId, currentName, currentCode) {
    const { value: formValues } = await Swal.fire({
        title: '<div class="flex items-center justify-center gap-2 text-indigo-400 font-bn font-black"><i class="fa-solid fa-pen-to-square"></i><span>জোন এডিট করুন</span></div>',
        html: `
            <div class="space-y-3 text-left font-bn p-2">
                <div>
                    <label class="block text-xs font-bold text-slate-300 mb-1">জোনের নাম *</label>
                    <input id="sw-ezn-name" class="m3-field text-xs font-bold" value="${currentName}">
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-300 mb-1">জোন শর্ট কোড *</label>
                    <input id="sw-ezn-code" class="m3-field text-xs font-bold font-mono uppercase" value="${currentCode}">
                </div>
            </div>`,
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-check mr-1.5"></i>আপডেট করুন',
        cancelButtonText: 'বাতিল',
        customClass: { popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn' },
        preConfirm: () => {
            const name = document.getElementById('sw-ezn-name')?.value?.trim();
            const code = document.getElementById('sw-ezn-code')?.value?.trim()?.toUpperCase();
            if (!name || !code) return Swal.showValidationMessage('জোনের নাম ও কোড উভয়ই আবশ্যক!');
            return { name, code };
        }
    });

    if (!formValues) return;

    try {
        const isCodeChanged = (formValues.code !== currentCode);
        let updateCustomersAcc = false;

        if (isCodeChanged) {
            const confirmCascade = await Swal.fire({
                title: 'জোন কোড পরিবর্তন সতর্কতা!',
                text: `আপনি জোন কোড "${currentCode}" থেকে "${formValues.code}"-এ পরিবর্তন করছেন। আপনি কি এই জোনের সকল কাস্টমারের একাউন্ট আইডি নতুন জোন কোডে অটোমেটিক আপডেট করতে চান?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'হ্যাঁ, কাস্টমার একাউন্ট আপডেট করুন',
                cancelButtonText: 'না, শুধু জোন আপডেট করুন',
                customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn' }
            });
            updateCustomersAcc = confirmCascade.isConfirmed;
        }

        await ZoneDAO.update(zoneId, { name: formValues.name, code: formValues.code });

        if (updateCustomersAcc) {
            Swal.fire({ title: 'কাস্টমার আইডি আপডেট হচ্ছে...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
            const customers = await CustomerDAO.getAll();
            const zoneCusts = customers.filter(c => (c.zone || '').trim() === currentName || (c.zone || '').trim() === formValues.name);

            for (const c of zoneCusts) {
                const oldAcc = c.accountNo || '';
                // Strip old code or repeated code to extract pure 4-digit serial
                const digitsMatch = oldAcc.match(/\d+$/);
                const serialNum = digitsMatch ? digitsMatch[0].slice(-4) : '0001';
                const newAcc = formValues.code + serialNum.padStart(4, '0');
                
                await CustomerDAO.update(c.id, { zone: formValues.name, accountNo: newAcc });
            }
        }

        auditLog('UPDATE_ZONE', 'Settings', zoneId, `${formValues.name} (${formValues.code})`);
        Swal.fire('সফল!', 'জোনের তথ্য আপডেট হয়েছে।', 'success');
        loadZoneList();
        if (window.loadAllZones) window.loadAllZones();
    } catch (e) {
        console.error("showEditZoneModal error:", e);
        Swal.fire('ত্রুটি!', 'জোন আপডেট করা সম্ভব হয়নি।', 'error');
    }
}

/**
 * Delete Zone with PIN Security
 */
export async function deleteZoneFlow(zoneId, zoneName) {
    const isPinValid = await promptSecurityPin("জোন ডিলেট করা (Security Check)");
    if (!isPinValid) return;

    try {
        const customers = await CustomerDAO.getAll();
        const attachedCusts = customers.filter(c => (c.zone || '').trim() === zoneName);

        if (attachedCusts.length > 0) {
            return Swal.fire({
                title: 'ডিলেট করা যাবে না!',
                text: `এই জোনে (${zoneName}) ${attachedCusts.length} জন কাস্টমার নিবন্ধিত আছেন। প্রথমে কাস্টমারদের অন্য জোনে সরান।`,
                icon: 'warning',
                customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn' }
            });
        }

        await ZoneDAO.delete(zoneId);
        auditLog('DELETE_ZONE', 'Settings', zoneId, zoneName);
        Swal.fire('সফল!', `জোন "${zoneName}" সফলভাবে ডিলেট করা হয়েছে।`, 'success');
        loadZoneList();
        if (window.loadAllZones) window.loadAllZones();
    } catch (e) {
        console.error("deleteZoneFlow error:", e);
        Swal.fire('ত্রুটি!', 'জোন ডিলেট করা সম্ভব হয়নি।', 'error');
    }
}

// Bind globally on window for inline handlers
window.showAddZoneModal = showAddZoneModal;
window.showEditZoneModal = showEditZoneModal;
window.deleteZoneFlow = deleteZoneFlow;
