import os
import subprocess
import base64
import pymupdf

base_dir = r"E:\maa-motors-erp"
logo_path = os.path.join(base_dir, r"Web_ERP\public\shop-official-logo.jpg")

logo_b64 = ""
if os.path.exists(logo_path):
    with open(logo_path, "rb") as f:
        logo_b64 = base64.b64encode(f.read()).decode("utf-8")

def format_bd(n):
    if n is None or n == '': return ''
    s = str(int(round(float(n))))
    if len(s) <= 3: return s
    last3 = s[-3:]
    rest = s[:-3]
    groups = []
    while len(rest) > 2:
        groups.insert(0, rest[-2:])
        rest = rest[:-2]
    if rest: groups.insert(0, rest)
    return ','.join(groups) + ',' + last3

css = """
@import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800;900&display=swap');

@page {
    size: A4 portrait;
    margin: 4mm 7mm 4mm 7mm;
}

* {
    box-sizing: border-box;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
}

html, body {
    margin: 0;
    padding: 0;
    font-family: 'Hind Siliguri', 'Kalpurush', sans-serif;
    background-color: #f1f5f9;
    color: #0f172a;
    font-size: 9px;
}

.num {
    font-family: 'Inter', 'Segoe UI', Arial, sans-serif !important;
    font-feature-settings: 'tnum' 1;
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.2px;
}

.a4-page {
    width: 210mm;
    box-sizing: border-box;
    padding: 4mm 8mm;
    margin: 10px auto;
    background: #ffffff;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border-radius: 4px;
}

@media print {
    body {
        background: transparent;
        padding: 0;
    }
    .a4-page {
        width: 100%;
        box-shadow: none;
        padding: 0;
        margin: 0;
    }
    .no-print {
        display: none !important;
    }
    tr {
        page-break-inside: avoid !important;
    }
    thead {
        display: table-header-group !important;
    }
    tfoot {
        display: table-footer-group !important;
    }
}

.header-banner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
    border-radius: 6px;
    padding: 6px 12px;
    color: #ffffff;
    margin-bottom: 5px;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 9px;
}

.shop-logo {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 2px solid #ffffff;
    background: #fff;
    object-fit: cover;
}

.shop-info h1 {
    font-size: 16px;
    font-weight: 700;
    margin: 0 0 1px 0;
    letter-spacing: 0.4px;
}

.shop-info .owner {
    font-size: 9px;
    font-weight: 600;
    color: #e0f2fe;
    margin-bottom: 1px;
}

.shop-info .address {
    font-size: 8px;
    color: #bae6fd;
    line-height: 1.15;
}

.header-right {
    text-align: right;
}

.voucher-badge {
    background: rgba(255, 255, 255, 0.22);
    border: 1px solid rgba(255, 255, 255, 0.45);
    padding: 2px 7px;
    border-radius: 4px;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.6px;
    display: inline-block;
    margin-bottom: 2px;
}

.header-date {
    font-size: 8px;
    color: #e0f2fe;
}

.doc-title-bar {
    background: #0f172a;
    color: #ffffff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 10px;
    border-radius: 4px;
    margin-bottom: 5px;
}

.doc-title-bar h2 {
    margin: 0;
    font-size: 11.5px;
    font-weight: 700;
}

.consignment-status {
    background: #10b981;
    color: #ffffff;
    font-size: 8.5px;
    font-weight: 700;
    padding: 2px 7px;
    border-radius: 12px;
    display: inline-flex;
    align-items: center;
    gap: 4px;
}

.meta-grid-4 {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 5px;
    margin-bottom: 5px;
}

.kpi-card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    padding: 4px 6px;
    text-align: center;
}

.kpi-title {
    font-size: 8px;
    font-weight: 700;
    color: #64748b;
    margin-bottom: 1px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.kpi-val {
    font-size: 11px;
    font-weight: 900;
    line-height: 1.2;
}

.kpi-sub {
    font-size: 7.8px;
    color: #475569;
    font-weight: 600;
}

.table-custom {
    width: 100%;
    border-collapse: collapse;
    font-size: 9px;
    border: 1px solid #cbd5e1;
}

.table-custom th {
    background: #1e293b;
    color: #ffffff;
    font-weight: 700;
    padding: 3px 4px;
    text-align: left;
    border: 1px solid #334155;
    font-size: 8.5px;
}

.table-custom td {
    padding: 2.2px 4px;
    border: 1px solid #e2e8f0;
    vertical-align: middle;
}

.table-custom tr:nth-child(even) td {
    background: #f8fafc;
}

.table-custom .t-right {
    text-align: right;
}

.table-custom .t-center {
    text-align: center;
}

.badge-status {
    background: #ecfdf5;
    color: #047857;
    border: 1px solid #a7f3d0;
    padding: 1px 4px;
    border-radius: 3px;
    font-size: 7.5px;
    font-weight: 700;
    display: inline-block;
}

.subtotal-row {
    background: #f8fafc !important;
    font-weight: 700;
    border-top: 1.5px solid #cbd5e1;
    color: #475569;
}

.session-total-row {
    background: #f0fdf4 !important;
    font-weight: 800;
    border-top: 1.5px solid #10b981;
    color: #065f46;
}

.grand-total-row {
    background: #eff6ff !important;
    font-weight: 900;
    border-top: 2px solid #0284c7;
    border-bottom: 2px solid #0284c7;
}

.grand-total-row td {
    padding: 3.5px 4px;
}

/* Master Consignment Closure Block */
.consignment-closure-box {
    margin-top: 5px;
    background: #fffbeb;
    border: 1.5px solid #f59e0b;
    border-radius: 5px;
    padding: 5px 8px;
    font-size: 8.5px;
    color: #78350f;
}

.closure-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px dashed #d97706;
    padding-bottom: 3px;
    margin-bottom: 4px;
}

.closure-header h3 {
    margin: 0;
    font-size: 9.5px;
    font-weight: 800;
    color: #92400e;
}

.closure-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 6px;
    text-align: center;
    margin-bottom: 4px;
}

.closure-cell {
    background: #ffffff;
    border: 1px solid #fde68a;
    border-radius: 3px;
    padding: 3px;
}

.closure-cell-lbl {
    font-size: 7.5px;
    font-weight: 700;
    color: #92400e;
}

.closure-cell-val {
    font-size: 10px;
    font-weight: 900;
}

.closure-policy {
    font-size: 8px;
    line-height: 1.25;
    color: #451a03;
    background: rgba(254, 243, 199, 0.6);
    padding: 3px 6px;
    border-radius: 3px;
}

.sign-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    margin-top: 8px;
}

.sign-box {
    text-align: center;
    border-top: 1.2px dashed #64748b;
    padding-top: 2px;
    font-size: 8px;
    color: #334155;
    font-weight: 600;
}

.print-btn-bar {
    text-align: center;
    margin: 8px 0;
}

.print-btn {
    background: #0284c7;
    color: #ffffff;
    border: none;
    padding: 7px 16px;
    font-size: 12px;
    font-weight: 700;
    border-radius: 4px;
    cursor: pointer;
    font-family: inherit;
}
"""

raw_records = [
    ("০", "13/10/2026", "সাবেক (পূর্ববর্তী কিউমুলেটিভ ব্যালেন্স)", 34.51, 1692497, 58421109, "সাবেক শুরু", True),
    ("১", "14/10/2026", "মিনহাজ মারফত", 34.50, 50000, 1725000, "পরিশোধিত", False),
    ("২", "15/10/2026", "মিনহাজ মারফত", 34.50, 50000, 1725000, "পরিশোধিত", False),
    ("৩", "18/10/2026", "মিনহাজ মারফত", 34.55, 72400, 2501420, "পরিশোধিত", False),
    ("৪", "25/10/2026", "মিনহাজ মারফত", 34.60, 50000, 1730000, "পরিশোধিত", False),
    ("৫", "25/10/2026", "আলতাফ মারফত", 34.50, 30000, 1035000, "পরিশোধিত", False),
    ("৬", "27/10/2026", "মিনহাজ মারফত", 34.65, 50000, 1732500, "পরিশোধিত", False),
    ("৭", "27/10/2026", "নুরুল হক মারফত", 34.50, 52000, 1794000, "পরিশোধিত", False),
    ("৮", "27/10/2026", "মিনহাজ মারফত", 34.60, 50000, 1730000, "পরিশোধিত", False),
    ("৯", "01/11/2026", "মিনহাজ মারফত", 34.75, 30000, 1042500, "পরিশোধিত", False),
    ("১০", "03/11/2026", "নুরুল হক / সাইফুল", 34.65, 50000, 1732500, "পরিশোধিত", False),
    ("১১", "03/11/2026", "হৃদয় মারফত", 34.40, 15000, 516000, "পরিশোধিত", False),
    ("১২", "03/11/2026", "মিনহাজ মারফত", 34.75, 80000, 2780000, "পরিশোধিত", False),
    ("১৩", "04/11/2026", "একরাম / সোহেল", 34.75, 50000, 1737500, "পরিশোধিত", False),
    ("১৪", "05/11/2026", "মিনহাজ মারফত", 34.80, 50000, 1740000, "পরিশোধিত", False),
    ("১৫", "05/11/2026", "একরাম / ফারুক", 34.75, 50000, 1737500, "পরিশোধিত", False),
    ("১৬", "05/11/2026", "সাইফুল / নুরুল হক", 34.80, 50000, 1740000, "পরিশোধিত", False),
    ("১৭", "08/11/2026", "নুরুল হক / সাইফুল", 34.80, 50000, 1740000, "পরিশোধিত", False),
    ("১৮", "08/11/2026", "একরাম / সোহেল", 34.70, 50072, 1737500, "পরিশোধিত", False),
    ("১৯", "09/11/2026", "একরাম / সোহেল", 34.75, 50000, 1737500, "পরিশোধিত", False),
]

rows_html = ""
for sl, dt, part, rate, aed_raw, bdt_raw, st, is_op in raw_records:
    bg_style = 'background: #eff6ff;' if is_op else ''
    color_sl = 'color: #0284c7; font-weight:800;' if is_op else 'color: #64748b; font-weight:700;'
    aed_str = format_bd(aed_raw)
    bdt_str = format_bd(bdt_raw)
    rows_html += f"""
    <tr style="{bg_style}">
        <td class="t-center" style="{color_sl}">{sl}</td>
        <td class="t-center num" style="font-weight:600;">{dt}</td>
        <td style="font-weight:{'800' if is_op else '600'}; color:{'#0369a1' if is_op else '#0f172a'};">{part}</td>
        <td class="t-center num" style="font-weight:700; color:#475569;">{rate:.2f}</td>
        <td class="t-right num" style="font-weight:800; color:#059669;">{aed_str}</td>
        <td class="t-right num" style="font-weight:800; color:#dc2626;">৳ {bdt_str}</td>
        <td class="t-center"><span class="badge-status">{st}</span></td>
    </tr>
    """

# 1. 2025 Stage 1
p1_aed = 4285350
p1_bdt = 145802430
p1_rate = 34.02

# 2. 2026 Stage 2 (Former balance)
p2_aed = 1692497
p2_bdt = 58421109
p2_rate = 34.51

# 3. 2026 Stage 3 (Running 19 entries)
p3_aed = 929472
p3_bdt = 32213920
p3_rate = 34.66

# 4. 2026 Session Cumulative (Stage 2 + Stage 3)
s2026_aed = p2_aed + p3_aed
s2026_bdt = p2_bdt + p3_bdt
s2026_rate = s2026_bdt / s2026_aed

# 5. ALL-TIME 1ST CONSIGNMENT GRAND TOTAL (Stage 1 + Stage 2 + Stage 3)
grand_aed = p1_aed + p2_aed + p3_aed
grand_bdt = p1_bdt + p2_bdt + p3_bdt
grand_rate = grand_bdt / grand_aed

html_content = f"""<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <title>এমরান ব্যক্তিগত ১ম কনসোলমেন্ট - দুবাই টাকা পাঠানো ও রেমিট্যান্স মাস্টার বুক</title>
    <style>{css}</style>
</head>
<body>
    <div class="print-btn-bar no-print">
        <button class="print-btn" onclick="window.print()">🖨️ A4 প্রিন্ট করুন (Print Official Register)</button>
    </div>

    <div class="a4-page">
        <!-- Header Banner -->
        <div class="header-banner">
            <div class="header-left">
                <img src="data:image/jpeg;base64,{logo_b64}" class="shop-logo" alt="Logo">
                <div class="shop-info">
                    <h1>মেসার্স মা মোটরস (M/S. MAA-MOTOR'S)</h1>
                    <div class="owner">স্বত্বাধিকারী: মোহাম্মদ এমরান (Mohammed Amran)</div>
                    <div class="address">দোকান নং-২২, রহমান টাওয়ার, ১ম রেলগেট, মুরাদপুর, হাটহাজারী রোড, চট্টগ্রাম। | মোবাইল: 01819-397669, 01815-707934</div>
                </div>
            </div>
            <div class="header-right">
                <div class="voucher-badge">DUBAI REMITTANCE BOOK</div>
                <div class="header-date">রেজিস্টার খাতা পাতা: <span class="num" style="font-weight:700;">০০০১</span></div>
            </div>
        </div>

        <!-- Title Bar with Consignment Status -->
        <div class="doc-title-bar">
            <h2>ডুবাই টাকা পাঠানো এর হিসাব — এমরান ব্যক্তিগত ১ম কনসোলমেন্ট, ডুবাই মাল ক্রয় ইনভেস্ট</h2>
            <span class="consignment-status">● চলমান কনসোলমেন্ট (Active)</span>
        </div>

        <!-- 4 KPI Summary Grid (Bangladeshi Comma Format) -->
        <div class="meta-grid-4">
            <div class="kpi-card" style="border-left: 2.5px solid #6366f1;">
                <div class="kpi-title">১. পর্যায় ১ (২৯/০৮/২৫ - ১৮/১২/২৫)</div>
                <div class="kpi-val num" style="color: #4f46e5;">{format_bd(p1_aed)} AED</div>
                <div class="kpi-sub">৳ {format_bd(p1_bdt)} (রেট: {p1_rate})</div>
            </div>
            <div class="kpi-card" style="border-left: 2.5px solid #0284c7;">
                <div class="kpi-title">২. পর্যায় ২ সাবেক (১৬/০৪/২৬ - ১৩/১০/২৬)</div>
                <div class="kpi-val num" style="color: #0284c7;">{format_bd(p2_aed)} AED</div>
                <div class="kpi-sub">৳ {format_bd(p2_bdt)} (রেট: {p2_rate})</div>
            </div>
            <div class="kpi-card" style="border-left: 2.5px solid #059669;">
                <div class="kpi-title">৩. পর্যায় ৩ রানিং (১৪/১০/২৬ - ০৯/১১/২৬)</div>
                <div class="kpi-val num" style="color: #059669;">{format_bd(p3_aed)} AED</div>
                <div class="kpi-sub">৳ {format_bd(p3_bdt)} (গড়: {p3_rate:.2f})</div>
            </div>
            <div class="kpi-card" style="border-left: 2.5px solid #d97706; background: #fffbeb;">
                <div class="kpi-title" style="color: #b45309; font-weight: 800;">৪. ১ম কনসোলমেন্ট সর্বমোট তহবিল</div>
                <div class="kpi-val num" style="color: #b45309;">{format_bd(grand_aed)} AED</div>
                <div class="kpi-sub" style="color: #92400e; font-weight:700;">৳ {format_bd(grand_bdt)} (গড়: {grand_rate:.2f})</div>
            </div>
        </div>

        <!-- Detail Table -->
        <table class="table-custom">
            <thead>
                <tr>
                    <th style="width: 4%;" class="t-center">নং</th>
                    <th style="width: 11%;" class="t-center">তারিখ</th>
                    <th style="width: 32%;">বিবরণ / মারফত (Particulars)</th>
                    <th style="width: 10%;" class="t-center">রেট (Rate)</th>
                    <th style="width: 17%;" class="t-right">দিরহাম (AED)</th>
                    <th style="width: 18%;" class="t-right">টাকা (BDT / TK)</th>
                    <th style="width: 8%;" class="t-center">স্ট্যাটাস</th>
                </tr>
            </thead>
            <tbody>
                {rows_html}
                
                <!-- 1. Subtotal of Current Sheet -->
                <tr class="subtotal-row">
                    <td colspan="3" class="t-right" style="font-weight: 700;">
                        চলমান খাতার উপ-মোট (১৯ টি লেনদেন):
                    </td>
                    <td class="t-center num" style="font-weight: 700; color: #475569;">{p3_rate:.2f}</td>
                    <td class="t-right num" style="font-weight: 800; color: #059669;">{format_bd(p3_aed)} AED</td>
                    <td class="t-right num" style="font-weight: 800; color: #dc2626;">৳ {format_bd(p3_bdt)}</td>
                    <td class="t-center" style="font-size: 7.5px; color: #64748b;">উপ-মোট</td>
                </tr>

                <!-- 2. 2026 Session Cumulative Total -->
                <tr class="session-total-row">
                    <td colspan="3" class="t-right" style="font-weight: 800;">
                        ২০২৬ সেশনের মোট তহবিল (সাবেক সহ):
                    </td>
                    <td class="t-center num" style="font-weight: 800; color: #047857;">{s2026_rate:.2f}</td>
                    <td class="t-right num" style="font-weight: 800; color: #047857;">{format_bd(s2026_aed)} AED</td>
                    <td class="t-right num" style="font-weight: 800; color: #047857;">৳ {format_bd(s2026_bdt)}</td>
                    <td class="t-center"><span class="badge-status" style="background:#d1fae5; color:#065f46;">২০২৬ মোট</span></td>
                </tr>

                <!-- 3. ALL-TIME 1ST CONSIGNMENT GRAND TOTAL -->
                <tr class="grand-total-row">
                    <td colspan="3" class="t-right" style="font-weight: 900; color: #0f172a; font-size: 10px;">
                        ১ম কনসোলমেন্টের সর্বমোট তহবিল (পর্যায় ১ + ২ + ৩):
                    </td>
                    <td class="t-center num" style="font-weight: 900; color: #0284c7; font-size: 9.5px;">{grand_rate:.2f}</td>
                    <td class="t-right num" style="font-size: 11px; font-weight: 900; color: #047857;">{format_bd(grand_aed)} AED</td>
                    <td class="t-right num" style="font-size: 11px; font-weight: 900; color: #b91c1c;">৳ {format_bd(grand_bdt)}</td>
                    <td class="t-center"><span class="badge-status" style="background:#0284c7; color:#fff; border-color:#0284c7;">সর্বমোট</span></td>
                </tr>
            </tbody>
        </table>

        <!-- Master Consignment Closure & Rollover Certificate Box -->
        <div class="consignment-closure-box">
            <div class="closure-header">
                <h3>📌 এমরান ব্যক্তিগত ১ম কনসোলমেন্ট — সার্বিক সমাপ্তি ও ২য় কনসোলমেন্টে স্থানান্তর বিবরণী</h3>
                <span style="font-weight: 700; color: #92400e;">স্ট্যাটাস: চলমান (মাল ক্রয় শেষে ক্লোজ হবে)</span>
            </div>
            <div class="closure-grid">
                <div class="closure-cell">
                    <div class="closure-cell-lbl">১ম পর্যায় (২০২৫)</div>
                    <div class="closure-cell-val num" style="color: #4f46e5;">{format_bd(p1_aed)} AED</div>
                    <div style="font-size:7.2px; color:#475569;">৳ {format_bd(p1_bdt)}</div>
                </div>
                <div class="closure-cell">
                    <div class="closure-cell-lbl">২য় পর্যায় (২০২৬ সাবেক)</div>
                    <div class="closure-cell-val num" style="color: #0284c7;">{format_bd(p2_aed)} AED</div>
                    <div style="font-size:7.2px; color:#475569;">৳ {format_bd(p2_bdt)}</div>
                </div>
                <div class="closure-cell">
                    <div class="closure-cell-lbl">৩য় পর্যায় (চলমান খাতা)</div>
                    <div class="closure-cell-val num" style="color: #059669;">{format_bd(p3_aed)} AED</div>
                    <div style="font-size:7.2px; color:#475569;">৳ {format_bd(p3_bdt)}</div>
                </div>
                <div class="closure-cell" style="background: #fef3c7; border-color: #f59e0b;">
                    <div class="closure-cell-lbl" style="color: #92400e; font-weight:800;">১ম কনসোলমেন্ট সর্বমোট তহবিল</div>
                    <div class="closure-cell-val num" style="color: #b45309; font-size:10.5px;">{format_bd(grand_aed)} AED</div>
                    <div style="font-size:7.5px; font-weight:700; color:#b91c1c;">৳ {format_bd(grand_bdt)}</div>
                </div>
            </div>
            <div class="closure-policy">
                💡 <strong>ক্লোজিং ও ২য় কনসোলমেন্ট রোল-ওভার নীতি:</strong> এই ১ম কনসোলমেন্টের অধীনে আরও লেনদেন যুক্ত করা যাবে। ১ম কনসোলমেন্টের সম্পূর্ণ মাল ক্রয় শেষ হলে হিসাবটি আনুষ্ঠানিকভাবে <strong>"ক্লোজ / সমাপ্ত"</strong> হবে এবং এর চূড়ান্ত সমাপনী ব্যালেন্স স্বয়ংক্রিয়ভাবে <strong>'এমরান ব্যক্তিগত ২য় কনসোলমেন্ট'</strong>-এর প্রারম্ভিক তহবিল (Opening Balance) হিসেবে স্থানান্তরিত হবে।
            </div>
        </div>

        <!-- 4 Signatures Block -->
        <div class="sign-grid">
            <div class="sign-box">প্রস্তুতকারক (হিসাব বিভাগ)</div>
            <div class="sign-box">অভ্যন্তরীণ নিরীক্ষক (অফিস ইনচার্জ)</div>
            <div class="sign-box">পার্টনার অনুমোদন</div>
            <div class="sign-box">মোহাম্মদ এমরান (স্বত্বাধিকারী)</div>
        </div>
    </div>
</body>
</html>
"""

html_path = os.path.join(base_dir, "ডুবাই_টাকা_পাঠানোর_অফিসিয়াল_বুক_২০২৬.html")
with open(html_path, "w", encoding="utf-8") as f:
    f.write(html_content)

chrome = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
pdf_path = os.path.join(base_dir, "ডুবাই_টাকা_পাঠানোর_অফিসিয়াল_বুক_২০২৬.pdf")
res = subprocess.run([chrome, '--headless=new', '--disable-gpu', '--no-pdf-header-footer', f'--print-to-pdf={pdf_path}', html_path], capture_output=True, text=True)

# Also copy to Android folder
android_dir = r"E:\Android\Porject\Class 1\Audio File\banjonborno"
if os.path.exists(android_dir):
    dest_pdf = os.path.join(android_dir, "ডুবাই_টাকা_পাঠানোর_অফিসিয়াল_বুক_২০২৬.pdf")
    dest_html = os.path.join(android_dir, "ডুবাই_টাকা_পাঠানোর_অফিসিয়াল_বুক_২০২৬.html")
    with open(dest_html, "w", encoding="utf-8") as f:
        f.write(html_content)
    subprocess.run([chrome, '--headless=new', '--disable-gpu', '--no-pdf-header-footer', f'--print-to-pdf={dest_pdf}', dest_html], capture_output=True, text=True)
    print("Copied updated HTML & PDF to Android directory")

doc = pymupdf.open(pdf_path)
print("Updated Remittance Book PDF page count:", len(doc))
