import { GodownChallansDAO } from './godown-challans-dao.js';
import { showToast } from '../utils.js';
import { promptSecurityPin } from '../security/pin-prompt.js';

/**
 * Format timestamp or date string to readable Bengali/English
 */
function formatDate(dateVal) {
    if (!dateVal) return '—';
    try {
        let d;
        if (typeof dateVal === 'string') {
            d = new Date(dateVal);
        } else if (dateVal.toDate) {
            d = dateVal.toDate();
        } else if (dateVal.seconds) {
            d = new Date(dateVal.seconds * 1000);
        } else {
            d = new Date(dateVal);
        }
        if (isNaN(d.getTime())) return String(dateVal);
        return d.toLocaleDateString('bn-BD', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }) + ' ' + d.toLocaleTimeString('bn-BD', {
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (e) {
        console.error('Date format error:', e);
        return String(dateVal);
    }
}

/**
 * Open detail and print modal for a challan
 */
export async function viewGodownChallanDetail(id, challansCache) {
    const challan = (challansCache || []).find(c => c.id === id);
    if (!challan) {
        showToast('চালানের তথ্য পাওয়া যায়নি', 'error');
        return;
    }

    const isInward = challan.sessionType === 'inward';
    const typeLabel = isInward ? 'আনলোডিং চালান (গাড়ি থেকে নামানো)' : 'ডেলিভারি চালান (গাড়িতে মাল তোলা)';
    const partyLabel = isInward ? 'মাল প্রেরণকারী / উৎস' : 'মাল প্রাপক / কাস্টমার';
    const items = challan.items || [];

    const itemsHtml = items.length > 0 ? items.map((it, idx) => `
        <tr class="border-b border-slate-700/60">
            <td class="py-2 px-3 text-center text-slate-400">${idx + 1}</td>
            <td class="py-2 px-3 font-bold text-white">${it.partNameBn || it.name || '—'}</td>
            <td class="py-2 px-3 text-slate-300">${it.rootGroup || it.category || 'অন্যান্য'}</td>
            <td class="py-2 px-3 text-right font-black text-white font-mono">${(Number(it.quantity) || 0).toLocaleString('en-IN')} ${it.unit || 'পিস'}</td>
            <td class="py-2 px-3 text-slate-400 text-xs">${it.remarks || '—'}</td>
        </tr>
    `).join('') : `
        <tr><td colspan="5" class="py-4 text-center text-slate-500">কোনো পার্টস বিবরণ যুক্ত নেই</td></tr>
    `;

    const modalHtml = `
        <div id="challan-print-area" class="text-left font-bn p-2">
            <!-- Header -->
            <div class="text-center border-b border-slate-700 pb-3 mb-4">
                <h3 class="text-xl font-black text-white">মেসার্স মা মোটরস</h3>
                <p class="text-xs text-slate-300">প্রোপ্রাইটর: মোঃ ওমর ফারুক • মোবাইল: ০১৮১৯-৩৯৭৬৬৯</p>
                <p class="text-[11px] text-slate-400">গোডাউন-১, রেলগেট সংলগ্ন, মুরাদপুর, চট্টগ্রাম</p>
                <div class="mt-2 inline-block px-3 py-1 rounded-full text-xs font-black ${isInward ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}">
                    ${typeLabel}
                </div>
            </div>

            <!-- Meta details grid -->
            <div class="grid grid-cols-2 gap-2 text-xs bg-slate-950/60 p-3 rounded-xl border border-slate-800 mb-4">
                <div><span class="text-slate-400">চালান নং:</span> <strong class="text-white font-mono">${challan.challanNo || challan.id}</strong></div>
                <div><span class="text-slate-400">তারিখ:</span> <strong class="text-white">${formatDate(challan.date)}</strong></div>
                <div><span class="text-slate-400">${partyLabel}:</span> <strong class="text-white">${challan.customerName || challan.destinationFor || 'মেসার্স মা মোটরস'}</strong></div>
                <div><span class="text-slate-400">মোবাইল:</span> <strong class="text-white">${challan.customerPhone || '—'}</strong></div>
                <div><span class="text-slate-400">গাড়ির নম্বর:</span> <strong class="text-white font-mono">${challan.vehicleNo || '—'}</strong></div>
                <div><span class="text-slate-400">ড্রাইভার:</span> <strong class="text-white">${challan.driverName || '—'} ${challan.driverMobile ? `(${challan.driverMobile})` : ''}</strong></div>
            </div>

            <!-- Items Table -->
            <div class="rounded-lg border border-slate-700 overflow-hidden mb-4">
                <table class="w-full text-xs text-left">
                    <thead class="bg-slate-800/80 text-slate-300">
                        <tr>
                            <th class="py-2 px-3 text-center">নং</th>
                            <th class="py-2 px-3">মালামালের বিবরণ</th>
                            <th class="py-2 px-3">ক্যাটাগরি</th>
                            <th class="py-2 px-3 text-right">পরিমাণ</th>
                            <th class="py-2 px-3">মন্তব্য</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-800">
                        ${itemsHtml}
                    </tbody>
                    <tfoot class="bg-slate-950 font-bold border-t border-slate-700">
                        <tr>
                            <td colspan="3" class="py-2 px-3 text-right text-slate-300">সর্বমোট মাল:</td>
                            <td class="py-2 px-3 text-right text-emerald-400 font-mono text-sm">${(Number(challan.totalPcs) || 0).toLocaleString('en-IN')} পিস</td>
                            <td></td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <!-- Institutional Signatures -->
            <div class="grid grid-cols-3 gap-4 pt-8 text-center text-xs text-slate-400 border-t border-slate-800 mt-6">
                <div>
                    <div class="border-t border-dashed border-slate-600 pt-1.5 font-bold text-white">কাউন্টার কর্মী</div>
                    <div class="text-[10px] text-slate-500">${challan.countedByUserName || 'মোঃ এমরান'}</div>
                </div>
                <div>
                    <div class="border-t border-dashed border-slate-600 pt-1.5 font-bold text-white">মাল প্রাপক / ড্রাইভার</div>
                    <div class="text-[10px] text-slate-500">সই ও তারিখ</div>
                </div>
                <div>
                    <div class="border-t border-dashed border-slate-600 pt-1.5 font-bold text-white">মোঃ এমরান (ইনচার্জ)</div>
                    <div class="text-[10px] text-slate-500">গোডাউন-১, মা মোটরস</div>
                </div>
            </div>
        </div>
    `;

    const res = await Swal.fire({
        title: '',
        html: modalHtml,
        width: '680px',
        background: '#0F172A',
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-print mr-1"></i> A4 চালান প্রিন্ট',
        cancelButtonText: '<i class="fa-solid fa-xmark mr-1"></i> বন্ধ করুন',
        confirmButtonColor: '#2563EB',
        cancelButtonColor: '#475569',
        customClass: {
            popup: 'rounded-2xl border border-slate-700'
        }
    });

    if (res.isConfirmed) {
        printChallanArea();
    }
}

/**
 * Print challan area using native browser window.print()
 */
export function printChallanArea() {
    const printArea = document.getElementById('challan-print-area');
    if (!printArea) return;

    const printWin = window.open('', '_blank', 'width=800,height=900');
    if (!printWin) {
        showToast('পপআপ উইন্ডো ব্লক করা রয়েছে', 'error');
        return;
    }

    printWin.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>গোডাউন চালান প্রিন্ট - মা মোটরস</title>
            <meta charset="utf-8">
            <style>
                body { font-family: 'Hind Siliguri', 'Segoe UI', Arial, sans-serif; margin: 20px; color: #000; font-size: 13px; }
                .text-center { text-align: center; }
                .text-right { text-align: right; }
                .font-bold { font-weight: bold; }
                .font-black { font-weight: 900; }
                table { width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 15px; }
                th, td { border: 1px solid #999; padding: 6px 8px; }
                th { background-color: #f1f5f9; font-weight: bold; }
                .grid-meta { display: flex; flex-wrap: wrap; gap: 10px; margin: 15px 0; border: 1px solid #ccc; padding: 10px; border-radius: 4px; }
                .grid-meta div { flex: 1 1 45%; }
                .sig-grid { display: flex; justify-content: space-between; margin-top: 50px; text-align: center; }
                .sig-box { width: 28%; border-top: 1px dashed #000; padding-top: 5px; font-weight: bold; }
                @media print {
                    @page { margin: 15mm; }
                }
            </style>
        </head>
        <body>
            ${printArea.innerHTML}
            <script>
                window.onload = function() {
                    window.print();
                    setTimeout(() => window.close(), 1000);
                };
            </script>
        </body>
        </html>
    `);
    printWin.document.close();
}

/**
 * Delete a challan with security PIN verification
 */
export async function deleteGodownChallan(id, challanNo, onSuccess) {
    const verified = await promptSecurityPin();
    if (!verified) return;

    const confirmRes = await Swal.fire({
        title: 'চালান মুছে ফেলতে চান?',
        text: `চালান নং "${challanNo}" স্থায়ীভাবে মুছে ফেলা হবে।`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'হ্যাঁ, মুছুন',
        cancelButtonText: 'বাতিল',
        confirmButtonColor: '#EF4444',
        cancelButtonColor: '#475569',
        background: '#0F172A',
        color: '#FFFFFF'
    });

    if (!confirmRes.isConfirmed) return;

    try {
        await GodownChallansDAO.delete(id);
        if (onSuccess) onSuccess();
        showToast('চালান সফলভাবে মুছে ফেলা হয়েছে', 'success');
    } catch (e) {
        console.error('Delete challan error:', e);
        showToast('চালান মুছতে সমস্যা হয়েছে', 'error');
    }
}
