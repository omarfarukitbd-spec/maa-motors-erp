import Swal from 'sweetalert2';
import { db, firebase } from '../firebase-config.js';
import { TransactionDAO, CustomerDAO } from '../dao.js';
import { parseAmount, formatAmountWithComma, numberToBanglaWords, toDBDate, safeRound } from '../utils.js';
import { auditLog } from '../audit.js';
import { renderInvoice, renderInvoiceItems, calcItemTotals, loadInvoiceCustomers, updateCashTenderUI } from './invoice-ui.js';

/**
 * World-Class Invoice Action & Data Logic
 */

let invoiceItems = [];
let holdBills = [];
let _priceHintDebounce;

export function getInvoiceItems() { return invoiceItems; }
export function setInvoiceItems(val) { invoiceItems = val; }
export function getHoldBills() { return holdBills; }

export function addInvoiceItemRow() {
    invoiceItems.push({ desc: '', qty: 1, unit: 'Pcs', rate: 0, total: 0 });
    renderInvoiceItems();
}

export function removeInvoiceItem(index) {
    invoiceItems.splice(index, 1);
    renderInvoiceItems();
    calcItemTotals();
}

export function updateInvoiceItem(index, field, element) {
    const value = element.value;
    if(field === 'desc') {
        invoiceItems[index].desc = value;
        if (value.length >= 3) checkItemPriceHistory(index, value);
    } else if (field === 'unit') {
        invoiceItems[index].unit = value;
    } else {
        const numVal = Math.max(0, parseAmount(value));
        invoiceItems[index][field] = numVal;
        if (field === 'qty' || field === 'rate') {
            const qty = parseAmount(invoiceItems[index].qty);
            const rate = parseAmount(invoiceItems[index].rate);
            const total = qty * rate;
            invoiceItems[index].total = total;
            const totalInput = document.getElementById(`inv-item-total-${index}`);
            if (totalInput) totalInput.value = formatAmountWithComma(total);
            
            const wordsEl = document.getElementById(`item-live-words-${index}`);
            if (wordsEl) {
                if (total > 0) {
                    wordsEl.innerHTML = `<i class="fa-solid fa-coins text-[9px] text-amber-400"></i> <span>${numberToBanglaWords(total)}</span>`;
                    wordsEl.classList.remove('hidden');
                } else {
                    wordsEl.classList.add('hidden');
                }
            }
        }
    }
    calcItemTotals();
}

export function checkItemPriceHistory(index, itemName) {
    const sel = document.getElementById('inv-customer-select');
    if (!sel || sel.selectedIndex <= 0) return;
    const customerId = sel.value;
    clearTimeout(_priceHintDebounce);
    _priceHintDebounce = setTimeout(async () => {
        try {
            const txns = await TransactionDAO.collection.where('customerId', '==', customerId).orderBy('createdAt', 'desc').limit(30).get();
            let lastPrice = null;
            txns.forEach(doc => {
                const t = doc.data();
                if (t.hasItems && t.items && !lastPrice) {
                    const match = t.items.find(it => (it.desc || '').toLowerCase().trim() === itemName.toLowerCase().trim());
                    if (match) lastPrice = match.rate;
                }
            });
            const hintEl = document.getElementById(`price-hint-${index}`);
            if (hintEl && lastPrice) {
                hintEl.innerHTML = `<button type="button" onclick="window.applyHistoryPrice(${index}, ${lastPrice})" class="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded-md font-bold hover:bg-blue-600 hover:text-white transition-all cursor-pointer">আগের রেট: ৳${formatAmountWithComma(lastPrice)}</button>`;
                hintEl.classList.remove('hidden');
            }
        } catch (e) { console.error("Price hint error:", e); }
    }, 400);
}

export function applyHistoryPrice(index, price) {
    invoiceItems[index].rate = price;
    invoiceItems[index].total = invoiceItems[index].qty * price;
    renderInvoiceItems();
    calcItemTotals();
}

export function setInvoiceTender(amt) {
    const paidInput = document.getElementById('inv-paid');
    const netText = document.getElementById('inv-net-total-display')?.innerText || '0';
    const grandTotal = parseAmount(netText.replace(/[^0-9.]/g, ''));

    let paidVal = amt;
    if (amt === 'exact') paidVal = grandTotal;

    if (paidInput) {
        paidInput.value = paidVal;
        window.calcInvoiceTotals();
        window.toggleInvoiceRecvSection();
    }
    updateCashTenderUI(paidVal, grandTotal);
}

export function holdCurrentBill() {
    const sel = document.getElementById('inv-customer-select');
    const custName = (sel && sel.selectedIndex > 0) ? sel.options[sel.selectedIndex].dataset.name : 'Unknown';

    if (invoiceItems.length === 0 || (invoiceItems.length === 1 && !invoiceItems[0].desc && !invoiceItems[0].total)) {
        return Swal.fire('Error', 'হোল্ড করার মত কোনো আইটেম নেই', 'error');
    }

    holdBills.push({
        id: Date.now(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        customerName: custName,
        customerId: sel ? sel.value : '',
        items: JSON.parse(JSON.stringify(invoiceItems)),
        notes: document.getElementById('inv-notes')?.value || ''
    });

    Swal.fire({
        toast: true, position: 'top-end', icon: 'success',
        title: `বিল হোল্ড করা হয়েছে (${custName})`, showConfirmButton: false, timer: 2000,
        customClass: { popup: '!bg-slate-900 !text-white border border-slate-700' }
    });

    // Reset items
    setInvoiceItems([{ desc: '', qty: 1, unit: 'Pcs', rate: 0, total: 0 }]);
    document.getElementById('inv-notes').value = '';
    renderInvoiceItems();
    calcItemTotals();
}

export function resumeHoldBill(index) {
    if (!holdBills[index]) return;
    const item = holdBills[index];
    setInvoiceItems(item.items);
    if (document.getElementById('inv-notes')) document.getElementById('inv-notes').value = item.notes;
    if (document.getElementById('inv-customer-select') && item.customerId) {
        document.getElementById('inv-customer-select').value = item.customerId;
        window.invoiceCustomerChanged();
    }
    holdBills.splice(index, 1);
    renderInvoiceItems();
    calcItemTotals();

    Swal.fire({
        toast: true, position: 'top-end', icon: 'info',
        title: 'হোল্ড বিল রিজিউম করা হয়েছে', showConfirmButton: false, timer: 2000,
        customClass: { popup: '!bg-slate-900 !text-white border border-slate-700' }
    });
}

export async function saveAndPrintInvoice(layoutType) {
    const mainBtns = document.querySelectorAll('button[onclick*="saveAndPrintInvoice"]');
    try {
        const sel = document.getElementById('inv-customer-select');
        if (!sel || sel.selectedIndex <= 0) return Swal.fire('এরর', 'কাস্টমার সিলেক্ট করুন!', 'error');

        const customerId = sel.value;
        const opt = sel.options[sel.selectedIndex];
        const customerName = opt.dataset.name;
        const customerPhone = opt.dataset.phone;

        const date = toDBDate(document.getElementById('inv-date').value);
        const voucherNo = document.getElementById('inv-voucher').value;
        const notes = document.getElementById('inv-notes').value;
        const subtotal = parseAmount(document.getElementById('inv-subtotal').value);
        const discountInputVal = parseAmount(document.getElementById('inv-discount').value);
        const mode = document.getElementById('inv-disc-mode-btn')?.dataset.mode || 'fixed';
        const paid = parseAmount(document.getElementById('inv-paid').value);

        let calculatedDiscount = mode === 'percent' ? safeRound((subtotal * discountInputVal) / 100) : discountInputVal;
        const bill = safeRound(Math.max(0, subtotal - calculatedDiscount));
        if (bill === 0 && paid === 0) throw new Error("বিল বা জমা এন্ট্রি দিন");

        const confirmPreview = await Swal.fire({
            title: '<div class="flex items-center justify-center gap-2 font-bn font-black text-xl text-white"><i class="fa-solid fa-file-invoice text-blue-400"></i><span>ইনভয়েস যাচাই করুন</span></div>',
            html: `
                <div class="text-left font-bn p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2.5 shadow-inner">
                    <div class="flex justify-between items-center border-b border-slate-800/80 pb-2"><span class="text-xs text-slate-400 font-bold">কাস্টমার:</span><strong class="text-sm text-white font-black">${customerName}</strong></div>
                    <div class="flex justify-between items-center border-b border-slate-800/80 pb-2"><span class="text-xs text-slate-400 font-bold">মোট বিল:</span><strong class="text-base text-blue-400 font-black font-mono">৳ ${formatAmountWithComma(bill)}</strong></div>
                    <div class="flex justify-between items-center"><span class="text-xs text-slate-400 font-bold">আদায় (Paid):</span><strong class="text-base text-emerald-400 font-black font-mono">৳ ${formatAmountWithComma(paid)}</strong></div>
                </div>`,
            showCancelButton: true, 
            confirmButtonText: '<i class="fa-solid fa-print mr-2"></i>সেভ ও প্রিন্ট করুন', 
            cancelButtonText: '<i class="fa-solid fa-pen-to-square mr-2"></i>সংশোধন করব',
            customClass: { 
                popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn', 
                confirmButton: 'm3-btn-primary !bg-blue-600 hover:!bg-blue-500 !px-7 !py-2.5 !rounded-xl font-bold shadow-lg shadow-blue-600/30', 
                cancelButton: 'm3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-5 !py-2.5 !rounded-xl font-bold border border-slate-700' 
            }
        });

        if (!confirmPreview.isConfirmed) return;

        mainBtns.forEach(b => b.disabled = true);
        Swal.fire({ title: 'সেভ হচ্ছে...', didOpen: () => Swal.showLoading(), allowOutsideClick: false });

        const batch = db.batch();
        const txnRef = TransactionDAO.getRef();
        const validItems = invoiceItems.filter(i => (i.desc && i.desc.trim() !== '') || i.total > 0);

        const currentCustomer = (await CustomerDAO.getById(customerId)) || {};
        const prevDue = Number(currentCustomer.totalDue) || 0;
        const currentDue = safeRound(prevDue + (bill - paid));

        const txnData = {
            customerId, customerName, date, voucherNo, notes,
            bill, paid, subtotal, discount: calculatedDiscount,
            discountInput: discountInputVal, discountMode: mode,
            prevDue, currentDue,
            hasItems: validItems.length > 0,
            createdBy: window.AppState?.currentUserEmail || 'Unknown',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        if (validItems.length > 0) txnData.items = validItems.map(it => ({ ...it }));

        batch.set(txnRef, txnData);
        batch.update(CustomerDAO.getRef(customerId), { totalDue: firebase.firestore.FieldValue.increment(safeRound(bill - paid)) });
        await batch.commit();

        auditLog('CREATE', 'Invoice', txnRef.id, customerName, { bill, paid });

        const shareOnWhatsApp = () => {
            const formattedDue = formatAmountWithComma(Math.abs(currentDue));
            const dueText = currentDue < 0 ? `অ্যাডভান্স জমা: ৳ ${formattedDue}` : `বর্তমান মোট বকেয়া: ৳ ${formattedDue}`;
            const directMemoLink = `${window.location.origin}${window.location.pathname}?view=public-memo&id=${txnRef.id}`;
            const msg = `আসসালামু আলাইকুম ${customerName},\nমেসার্স মা মোটরস্ থেকে আপনার মেমো সেভ হয়েছে।\n\nআজকের বিল: ৳ ${formatAmountWithComma(bill)}\nআজকের জমা: ৳ ${formatAmountWithComma(paid)}\n---------------------------------\n${dueText}\n\nআপনার ডিজিটাল মেমোর PDF দেখতে নিচের লিংকে ক্লিক করুন:\n${directMemoLink}\n\nধন্যবাদ! — মেসার্স মা মোটরস্`;
            window.sendWhatsApp(customerPhone, msg);
        };

        if (customerPhone) {
            const res = await Swal.fire({
                title: 'সফল!', text: 'কাস্টমারকে হোয়াটসঅ্যাপে ডিজিটাল ইনভয়েস পাঠাবেন?', icon: 'success', showCancelButton: true,
                confirmButtonText: '<i class="fa-brands fa-whatsapp mr-1.5"></i> হোয়াটসঅ্যাপ মেসেজ', cancelButtonText: 'প্রিন্ট এ যাব', confirmButtonColor: '#25D366'
            });
            if (res.isConfirmed) shareOnWhatsApp();
        }

        if(window.printReceiptEngine) await window.printReceiptEngine(txnRef.id, layoutType);

        // Reset Form
        document.getElementById('inv-subtotal').value = '';
        document.getElementById('inv-discount').value = '';
        document.getElementById('inv-paid').value = '';
        document.getElementById('inv-voucher').value = '';
        document.getElementById('inv-notes').value = '';
        setInvoiceItems([{ desc: '', qty: 1, unit: 'Pcs', rate: 0, total: 0 }]);
        renderInvoice(document.getElementById('view-container'));

    } catch (e) {
        handleError(e, 'ইনভয়েস সেভ করা যায়নি');
    } finally {
        mainBtns.forEach(b => b.disabled = false);
    }
}
