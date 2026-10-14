/**
 * godown-contact-modal.js
 * Modal dialog for Creating and Editing Godown Logistics & Support Contacts
 */

import Swal from 'sweetalert2';
import { GodownContactDAO } from './godown-contact-dao.js';
import { normalizePhoneNumber } from './godown-contact-calc.js';
import { showToast } from '../utils/ui-helpers.js';
import { escapeHTML } from '../utils.js';

export async function openGodownContactModal(existing = null) {
    const isEdit = Boolean(existing && existing.id);
    const data = existing || {
        name: '',
        category: 'transport',
        role: '',
        phone: '',
        altPhone: '',
        location: '',
        standardRate: '',
        vehicleNo: '',
        notes: ''
    };

    const modalTitle = isEdit 
        ? `<div class="flex items-center justify-center gap-2 font-bn font-black text-lg text-white"><i class="fa-solid fa-user-pen text-cyan-400"></i><span>কন্টাক্ট তথ্য সংশোধন</span></div>`
        : `<div class="flex items-center justify-center gap-2 font-bn font-black text-lg text-white"><i class="fa-solid fa-user-plus text-emerald-400"></i><span>নতুন গোডাউন কন্টাক্ট যুক্ত করুন</span></div>`;

    const { value: formValues } = await Swal.fire({
        title: modalTitle,
        width: 'min(95vw, 550px)',
        html: `
            <div class="text-left font-bn p-1 space-y-3 text-xs">
                <div>
                    <label class="block text-slate-400 font-bold mb-1">ব্যক্তি বা প্রতিষ্ঠানের নাম <span class="text-red-400">*</span></label>
                    <input type="text" id="g-c-name" value="${escapeHTML(data.name || '')}" placeholder="যেমন: মোঃ কাশেম / আমানত ক্রেন সার্ভিস" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-bold text-white outline-none focus:border-cyan-500 shadow-inner">
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                        <label class="block text-slate-400 font-bold mb-1">ক্যাটাগরি <span class="text-red-400">*</span></label>
                        <select id="g-c-category" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none focus:border-cyan-500">
                            <option value="transport" ${data.category === 'transport' ? 'selected' : ''}>পরিবহন ও গাড়ি (ভ্যান, পিকআপ, ট্রাক)</option>
                            <option value="labor" ${data.category === 'labor' ? 'selected' : ''}>শ্রমিক ও হ্যান্ডলিং (লেবার, ক্রেন)</option>
                            <option value="technical" ${data.category === 'technical' ? 'selected' : ''}>ওয়ার্কশপ ও মিস্ত্রি (লেদ, মেকানিক)</option>
                            <option value="packaging" ${data.category === 'packaging' ? 'selected' : ''}>প্যাকিং ও স্টোরেজ (কার্টুন, বস্তা)</option>
                            <option value="emergency" ${data.category === 'emergency' ? 'selected' : ''}>জরুরি সেবা ও প্রশাসন</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-slate-400 font-bold mb-1">ভূমিকা / গাড়ির ধরন</label>
                        <input type="text" id="g-c-role" value="${escapeHTML(data.role || '')}" placeholder="যেমন: পিকআপ ১ টন / লেবার সর্দার / ভ্যান" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-500">
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                        <label class="block text-slate-400 font-bold mb-1">প্রধান মোবাইল নম্বর <span class="text-red-400">*</span></label>
                        <input type="text" id="g-c-phone" value="${escapeHTML(data.phone || '')}" placeholder="018XXXXXXXX" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-cyan-300 outline-none focus:border-cyan-500">
                    </div>
                    <div>
                        <label class="block text-slate-400 font-bold mb-1">বিকল্প মোবাইল নম্বর</label>
                        <input type="text" id="g-c-altphone" value="${escapeHTML(data.altPhone || '')}" placeholder="017XXXXXXXX (ঐচ্ছিক)" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 outline-none focus:border-cyan-500">
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                        <label class="block text-slate-400 font-bold mb-1">স্ট্যান্ড বা ঠিকানা</label>
                        <input type="text" id="g-c-location" value="${escapeHTML(data.location || '')}" placeholder="যেমন: মুরাদপুর রেলগেট স্ট্যান্ড" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-500">
                    </div>
                    <div>
                        <label class="block text-slate-400 font-bold mb-1">গাড়ির নম্বর (প্রযোজ্য ক্ষেত্রে)</label>
                        <input type="text" id="g-c-vehicleno" value="${escapeHTML(data.vehicleNo || '')}" placeholder="যেমন: চট্ট-মেট্রো-ন ১১-২২৩৩" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-amber-300 outline-none focus:border-cyan-500">
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                        <label class="block text-slate-400 font-bold mb-1">সাধারণ ভাড়া বা মজুরি রেট</label>
                        <input type="text" id="g-c-rate" value="${escapeHTML(data.standardRate || '')}" placeholder="যেমন: ৫০০ টাকা (প্রতি ট্রিপ) / ৭৫০ টাকা হাজিরা" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-emerald-300 outline-none focus:border-cyan-500">
                    </div>
                    <div>
                        <label class="block text-slate-400 font-bold mb-1">নোট বা বিশেষ দক্ষতা</label>
                        <input type="text" id="g-c-notes" value="${escapeHTML(data.notes || '')}" placeholder="যেমন: দ্রুত মাল খালাসের অভিজ্ঞ" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none focus:border-cyan-500">
                    </div>
                </div>

                <div class="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-[11px] text-cyan-300 flex items-center gap-2">
                    <i class="fa-brands fa-google text-cyan-400 text-sm"></i>
                    <span>সেভ করার সাথে সাথে এই কন্টাক্ট স্বয়ংক্রিয়ভাবে আপনার <strong>Google Contacts</strong>-এ সিঙ্ক হয়ে যাবে।</span>
                </div>
            </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: isEdit ? '<i class="fa-solid fa-check mr-1.5"></i> আপডেট করুন' : '<i class="fa-solid fa-plus mr-1.5"></i> সেভ করুন',
        cancelButtonText: 'বাতিল',
        customClass: {
            popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn',
            confirmButton: 'm3-btn-primary !bg-cyan-600 hover:!bg-cyan-500 !px-6 !py-2.5 !rounded-xl font-bold',
            cancelButton: 'm3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-4 !py-2.5 !rounded-xl font-bold'
        },
        preConfirm: () => {
            const name = document.getElementById('g-c-name')?.value?.trim();
            const category = document.getElementById('g-c-category')?.value || 'transport';
            const role = document.getElementById('g-c-role')?.value?.trim() || '';
            const phone = normalizePhoneNumber(document.getElementById('g-c-phone')?.value);
            const altPhone = normalizePhoneNumber(document.getElementById('g-c-altphone')?.value);
            const location = document.getElementById('g-c-location')?.value?.trim() || '';
            const vehicleNo = document.getElementById('g-c-vehicleno')?.value?.trim() || '';
            const standardRate = document.getElementById('g-c-rate')?.value?.trim() || '';
            const notes = document.getElementById('g-c-notes')?.value?.trim() || '';

            if (!name) {
                Swal.showValidationMessage('অনুগ্রহ করে ব্যক্তি বা প্রতিষ্ঠানের নাম লিখুন!');
                return false;
            }
            if (!phone || phone.length < 10) {
                Swal.showValidationMessage('সঠিক ১১ সংখ্যার মোবাইল নম্বর লিখুন!');
                return false;
            }

            return {
                name,
                category,
                role,
                phone,
                altPhone,
                location,
                vehicleNo,
                standardRate,
                notes
            };
        }
    });

    if (!formValues) return;

    try {
        if (isEdit) {
            await GodownContactDAO.update(existing.id, formValues);
            showToast('কন্টাক্ট সফলভাবে আপডেট হয়েছে এবং গুগল কন্টাক্টসে সিঙ্ক হচ্ছে!', 'success');
        } else {
            await GodownContactDAO.create(formValues);
            showToast('নতুন কন্টাক্ট সফলভাবে যুক্ত হয়েছে এবং গুগল কন্টাক্টসে সিঙ্ক হচ্ছে!', 'success');
        }
    } catch (err) {
        console.error('Save godown contact error:', err);
        showToast('কন্টাক্ট সেভ করতে সমস্যা হয়েছে', 'error');
    }
}

export async function promptDeleteGodownContact(contact) {
    if (!contact || !contact.id) return;
    const res = await Swal.fire({
        title: 'মুছে ফেলার নিশ্চিতকরণ',
        text: `আপনি কি "${contact.name}" এর কন্টাক্ট তথ্য মুছে ফেলতে চান?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'হ্যাঁ, মুছে ফেলুন',
        cancelButtonText: 'বাতিল',
        customClass: {
            popup: '!bg-slate-950 !text-white !rounded-3xl border border-red-500/30 font-bn',
            confirmButton: 'm3-btn-primary !bg-red-600 hover:!bg-red-500 !px-5 !py-2 !rounded-xl font-bold',
            cancelButton: 'm3-btn-tonal !bg-slate-800 !text-slate-300 !px-4 !py-2 !rounded-xl font-bold'
        }
    });

    if (res.isConfirmed) {
        try {
            await GodownContactDAO.delete(contact.id);
            showToast('কন্টাক্ট সফলভাবে মুছে ফেলা হয়েছে', 'success');
        } catch (e) {
            console.error('Delete godown contact error:', e);
            showToast('কন্টাক্ট মুছতে সমস্যা হয়েছে', 'error');
        }
    }
}
