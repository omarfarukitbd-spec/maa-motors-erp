import Swal from 'sweetalert2';
import { CustomerDAO, ZoneDAO, SettingsDAO } from '../dao.js';
import { promptSecurityPin } from '../utils.js';
import { auditLog } from '../audit.js';

/**
 * 1-Click Automated Corrupted Account Healing Tool
 * Fixes duplicated/repeated zone codes like 220001 -> 20001, 2220002 -> 20002
 */
export async function healAccountNumbersFlow() {
    const isPinValid = await promptSecurityPin("ভুল একাউন্ট আইডি কারেকশন (Admin PIN)");
    if (!isPinValid) return;

    try {
        Swal.fire({
            title: '<div class="flex items-center justify-center gap-2 font-bn font-black text-amber-400"><i class="fa-solid fa-wand-magic-sparkles"></i><span>আইডি স্ক্যান হচ্ছে...</span></div>',
            html: '<p class="text-xs text-slate-300 font-bn">ডাটাবেসের সকল কাস্টমার আইডি যাচাই ও ফিক্স করা হচ্ছে...</p>',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        const [zones, customers] = await Promise.all([
            ZoneDAO.getAllZones(),
            CustomerDAO.getAll()
        ]);

        if (!zones || zones.length === 0 || !customers || customers.length === 0) {
            return Swal.fire('তথ্য পাওয়া যায়নি', 'কোনো জোন বা কাস্টমার ডাটাবেসে নিবন্ধিত নেই।', 'info');
        }

        const zoneCodeMap = {};
        zones.forEach(z => {
            if (z.name && z.code) zoneCodeMap[z.name.trim()] = z.code.trim();
        });

        let repairedCount = 0;
        const repairedDetails = [];
        const zoneMaxSerialMap = {};

        for (const c of customers) {
            const zName = (c.zone || 'General').trim();
            const zCode = zoneCodeMap[zName] || '';
            const currentAcc = (c.accountNo || '').trim();

            if (!currentAcc) continue;

            // Extract pure digits from end of account number string (last 4 digits serial)
            const digitsOnly = currentAcc.replace(/\D/g, '');
            if (!digitsOnly) continue;

            // Extract 4-digit serial from the end
            const serialNo = parseInt(digitsOnly.slice(-4), 10) || 1;
            const paddedSerial = String(serialNo).padStart(4, '0');
            const targetAcc = zCode ? (zCode + paddedSerial) : paddedSerial;

            // Track max serial per zone for counter sync
            if (!zoneMaxSerialMap[zName] || serialNo > zoneMaxSerialMap[zName]) {
                zoneMaxSerialMap[zName] = serialNo;
            }

            // Check if current account number has repeated zone codes or incorrect format
            if (currentAcc !== targetAcc) {
                await CustomerDAO.update(c.id, { accountNo: targetAcc });
                repairedCount++;
                repairedDetails.push(`${c.name} (${zName}): ${currentAcc} -> ${targetAcc}`);
            }
        }

        // Sync zone counters in SettingsDAO
        for (const [zName, maxSer] of Object.entries(zoneMaxSerialMap)) {
            await SettingsDAO.updateZoneCounter(zName, maxSer);
        }

        auditLog('HEAL_ACCOUNT_NUMBERS', 'Admin', 'BulkHeal', `${repairedCount} accounts repaired`);

        if (repairedCount > 0) {
            Swal.fire({
                title: '<i class="fa-solid fa-circle-check text-emerald-400 mr-2"></i>সফলভাবে ফিক্স হয়েছে!',
                html: `
                    <div class="text-left space-y-2 font-bn p-2">
                        <p class="text-xs text-emerald-400 font-bold">মোট ${repairedCount} টি ভুল কাস্টমার একাউন্ট আইডি সফলভাবে কারেক্ট করা হয়েছে।</p>
                        <div class="max-h-40 overflow-y-auto bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 space-y-1">
                            ${repairedDetails.slice(0, 10).map(d => `<div>• ${d}</div>`).join('')}
                            ${repairedDetails.length > 10 ? `<div class="text-amber-400 font-bold">...এবং আরও ${repairedDetails.length - 10} টি একাউন্ট</div>` : ''}
                        </div>
                    </div>
                `,
                icon: 'success',
                customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn' }
            });
        } else {
            Swal.fire({
                title: 'সকল একাউন্ট আইডি সঠিক আছে!',
                text: 'ডাটাবেসে কোনো ভুল বা ডুপ্লিকেট জোন কোডযুক্ত একাউন্ট পাওয়া যায়নি।',
                icon: 'info',
                customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn' }
            });
        }

        if (window.loadCustomers) window.loadCustomers();
        if (window.loadZoneList) window.loadZoneList();
    } catch (err) {
        console.error("healAccountNumbersFlow error:", err);
        Swal.fire('ত্রুটি!', 'আইডি কারেকশন করার সময় সমস্যা হয়েছে।', 'error');
    }
}

window.healAccountNumbersFlow = healAccountNumbersFlow;
