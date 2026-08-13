import { CustomerDAO, ZoneDAO } from '../dao.js';
import { AppState } from '../state.js';
import { formatAmountWithComma, cleanCustomerName, safeRound } from '../utils.js';
import { printCustomerListA4 } from '../statement-print.js';

let allCustomers = [];

export async function loadCustomersData() {
    try {
        // Load Zones
        const zones = await ZoneDAO.getAllZones();
        const zoneSelect = document.getElementById('cust-zone-filter');
        if (zoneSelect) {
            let zHtml = '<option value="">সকল জোন (All Zones)</option>';
            zones.forEach(z => zHtml += `<option value="${z.name}">${z.name}</option>`);
            zoneSelect.innerHTML = zHtml;
        }

        // Load Customers
        CustomerDAO.listenAll(customers => {
            allCustomers = customers;
            AppState.customerCache = customers;
            filterCustomers();
        });
    } catch (e) {
        console.error("Load Customers Error:", e);
    }
}

export function filterCustomers() {
    const q = (document.getElementById('cust-search-input')?.value || '').toLowerCase().trim();
    const selectedZone = document.getElementById('cust-zone-filter')?.value || '';

    const filtered = allCustomers.filter(c => {
        const name = (c.name || '').toLowerCase();
        const phone = (c.phone || '').toLowerCase();
        const acc = (c.accountNo || '').toLowerCase();
        const addr = (c.address || '').toLowerCase();
        const zone = (c.zone || '');

        const matchQuery = !q || name.includes(q) || phone.includes(q) || acc.includes(q) || addr.includes(q);
        const matchZone = !selectedZone || zone === selectedZone;
        return matchQuery && matchZone;
    });

    // Update Summary Badges
    let totalDue = 0;
    filtered.forEach(c => {
        const d = Number(c.totalDue) || 0;
        if (d > 0) totalDue = safeRound(totalDue + d);
    });

    const countBadge = document.getElementById('cust-count-badge');
    const dueBadge = document.getElementById('cust-total-due-badge');
    if (countBadge) countBadge.innerText = `${filtered.length} জন`;
    if (dueBadge) dueBadge.innerText = "৳ " + formatAmountWithComma(totalDue);

    renderCustomerCards(filtered);
    populateExportTable(filtered);
}

function renderCustomerCards(customers) {
    const container = document.getElementById('customer-list-container');
    if (!container) return;

    if (customers.length === 0) {
        container.innerHTML = `<div class="col-span-full text-center py-12 text-slate-500 text-sm italic">কোনো কাস্টমার পাওয়া যায়নি</div>`;
        return;
    }

    let html = '';
    customers.forEach(c => {
        const cleanName = cleanCustomerName(c.name || 'Unknown');
        const due = Number(c.totalDue) || 0;
        const isDue = due > 0;
        const dueClass = isDue ? 'text-red-400 border-red-500/30 bg-red-500/10' : 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
        const dueLabel = isDue ? 'বকেয়া' : (due < 0 ? 'জমা (অ্যাডভান্স)' : 'পরিশোধিত');

        html += `
            <div class="m3-card bg-slate-900/70 border border-slate-800/80 hover:border-slate-700/90 p-4 rounded-2xl shadow-xl flex flex-col justify-between gap-3 transition-all hover:translate-y-[-2px]">
                <div class="flex items-start justify-between gap-2 border-b border-slate-800/60 pb-2.5">
                    <div class="flex items-center gap-2.5 overflow-hidden">
                        <div class="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center text-xs font-black shrink-0">
                            ${(cleanName[0] || 'C').toUpperCase()}
                        </div>
                        <div class="overflow-hidden">
                            <h4 class="text-sm font-bold text-white truncate cursor-pointer hover:text-blue-400" onclick="navigate('ledger', { customerId: '${c.id}' })">${cleanName}</h4>
                            <div class="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                                <span class="text-blue-400 font-bold">${c.accountNo ? `A/C: ${c.accountNo}` : ''}</span>
                                ${c.zone ? `<span>•</span><span>${c.zone}</span>` : ''}
                            </div>
                        </div>
                    </div>
                    <div class="text-right shrink-0">
                        <span class="text-xs font-black font-inter px-2 py-0.5 rounded-lg border ${dueClass}">৳ ${formatAmountWithComma(Math.abs(due))}</span>
                        <p class="text-[9px] text-slate-400 mt-0.5">${dueLabel}</p>
                    </div>
                </div>

                <div class="space-y-1 text-xs text-slate-300">
                    <div class="flex items-center gap-2 text-slate-400">
                        <i class="fa-solid fa-phone text-[10px] text-blue-400 w-3.5"></i>
                        <span class="font-mono text-slate-200">${c.phone || 'মোবাইল নেই'}</span>
                    </div>
                    <div class="flex items-start gap-2 text-slate-400 truncate">
                        <i class="fa-solid fa-location-dot text-[10px] text-amber-400 w-3.5 mt-0.5"></i>
                        <span class="text-[11px] truncate text-slate-300">${c.address || 'ঠিকানা নেই'}</span>
                    </div>
                </div>

                <!-- Read-Only Quick Action Bar -->
                <div class="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
                    <button onclick="navigate('ledger', { customerId: '${c.id}' })" class="px-3 py-1.5 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer" title="খতিয়ান ও স্টেটমেন্ট">
                        <i class="fa-solid fa-book-open"></i><span>স্টেটমেন্ট</span>
                    </button>
                    <div class="flex items-center gap-1.5">
                        ${c.phone ? `
                        <a href="tel:${c.phone}" class="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all border border-slate-700/60" title="কল করুন">
                            <i class="fa-solid fa-phone text-xs"></i>
                        </a>
                        <a href="https://wa.me/88${c.phone.replace(/^(\+88|88)/, '')}" target="_blank" class="w-8 h-8 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center transition-all" title="হোয়াটসঅ্যাপ">
                            <i class="fa-brands fa-whatsapp text-sm"></i>
                        </a>` : ''}
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function populateExportTable(customers) {
    const tbody = document.getElementById('customer-export-tbody');
    if (!tbody) return;
    let html = '';
    customers.forEach(c => {
        html += `<tr><td>${c.accountNo || ''}</td><td>${cleanCustomerName(c.name)}</td><td>${c.phone || ''}</td><td>${c.zone || ''}</td><td>${c.address || ''}</td><td>${c.totalDue || 0}</td></tr>`;
    });
    tbody.innerHTML = html;
}

export function printFilteredCustomers() {
    printCustomerListA4(allCustomers);
}
