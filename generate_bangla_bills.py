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

# Common CSS for guaranteed single-page A4 Portrait with enhanced typography
css = """
@import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800;900&display=swap');

@page {
    size: A4 portrait;
    margin: 6mm 10mm 6mm 10mm;
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
}

.amount-font {
    font-family: 'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, Arial, sans-serif !important;
    font-feature-settings: 'tnum' 1;
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.5px;
}

.a4-page {
    width: 210mm;
    box-sizing: border-box;
    padding: 6mm 10mm;
    margin: 10px auto;
    background: #ffffff;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border-radius: 4px;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
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
}

.header-banner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
    border-radius: 8px;
    padding: 8px 14px;
    color: #ffffff;
    margin-bottom: 8px;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 12px;
}

.shop-logo {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    border: 2px solid #ffffff;
    background: #fff;
    object-fit: cover;
}

.shop-info h1 {
    font-size: 18px;
    font-weight: 700;
    margin: 0 0 1px 0;
    letter-spacing: 0.5px;
}

.shop-info .owner {
    font-size: 10.5px;
    font-weight: 600;
    color: #e0f2fe;
    margin-bottom: 1px;
}

.shop-info .address {
    font-size: 9px;
    color: #bae6fd;
    line-height: 1.25;
}

.header-right {
    text-align: right;
}

.voucher-badge {
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.4);
    padding: 3px 8px;
    border-radius: 5px;
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 0.8px;
    display: inline-block;
    margin-bottom: 2px;
}

.header-date {
    font-size: 9.5px;
    color: #e0f2fe;
}

.doc-title-bar {
    background: #0f172a;
    color: #ffffff;
    text-align: center;
    padding: 6px 10px;
    border-radius: 5px;
    margin-bottom: 8px;
}

.doc-title-bar h2 {
    margin: 0;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.5px;
}

.meta-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 6px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 5px;
    padding: 6px 10px;
    margin-bottom: 8px;
}

.meta-item {
    font-size: 10.5px;
}

.meta-label {
    color: #64748b;
    font-size: 9.5px;
    font-weight: 600;
    margin-bottom: 1px;
}

.meta-value {
    color: #0f172a;
    font-weight: 700;
}

.section-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 5px;
    overflow: hidden;
    margin-bottom: 8px;
}

.section-head {
    background: #1e293b;
    color: #ffffff;
    padding: 4px 10px;
    font-size: 11px;
    font-weight: 700;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.section-head.green {
    background: #065f46;
}

.table-custom {
    width: 100%;
    border-collapse: collapse;
    font-size: 10.5px;
}

.table-custom th {
    background: #f1f5f9;
    color: #475569;
    font-weight: 700;
    padding: 4px 8px;
    text-align: left;
    border-bottom: 1px solid #cbd5e1;
    font-size: 9.5px;
}

.table-custom td {
    padding: 4px 8px;
    border-bottom: 1px solid #f1f5f9;
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

.badge-expense {
    background: #fef2f2;
    color: #b91c1c;
    border: 1px solid #fecaca;
    padding: 1px 5px;
    border-radius: 3px;
    font-size: 8.5px;
    font-weight: 700;
}

.badge-credit {
    background: #ecfdf5;
    color: #047857;
    border: 1px solid #a7f3d0;
    padding: 1px 5px;
    border-radius: 3px;
    font-size: 8.5px;
    font-weight: 700;
}

.total-row {
    background: #f8fafc;
    font-weight: 700;
    border-top: 1.5px solid #cbd5e1;
}

.total-row td {
    padding: 5px 8px;
}

.summary-box {
    background: #f8fafc;
    border: 1.5px dashed #94a3b8;
    border-radius: 5px;
    padding: 7px 10px;
    margin-bottom: 8px;
}

.summary-formula {
    font-size: 11px;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.balance-result {
    padding: 3px 8px;
    border-radius: 5px;
}

.balance-surplus {
    background: #ecfdf5;
    color: #065f46;
    border: 1px solid #10b981;
}

.balance-deficit {
    background: #fef2f2;
    color: #991b1b;
    border: 1px solid #ef4444;
}

.in-words {
    font-size: 10px;
    color: #475569;
    background: #f1f5f9;
    padding: 3px 6px;
    border-radius: 3px;
    margin-top: 3px;
}

.explanation-card {
    background: #f0fdf4;
    border: 1px solid #86efac;
    border-radius: 5px;
    padding: 6px 10px;
    font-size: 10px;
    line-height: 1.35;
    color: #166534;
    margin-bottom: 10px;
}

.explanation-card.orange {
    background: #fffbeb;
    border-color: #fde68a;
    color: #92400e;
}

.explanation-card h4 {
    margin: 0 0 2px 0;
    font-size: 10.5px;
    font-weight: 700;
}

.sign-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    margin-top: 16px;
}

.sign-box {
    text-align: center;
    border-top: 1.5px dashed #64748b;
    padding-top: 4px;
    font-size: 10px;
    color: #334155;
    font-weight: 600;
}

.print-btn-bar {
    text-align: center;
    margin: 10px 0;
}

.print-btn {
    background: #0284c7;
    color: #ffffff;
    border: none;
    padding: 8px 20px;
    font-size: 13px;
    font-weight: 700;
    border-radius: 5px;
    cursor: pointer;
    box-shadow: 0 3px 6px rgba(2, 132, 199, 0.3);
    font-family: inherit;
}

.print-btn:hover {
    background: #0369a1;
}
"""

# HTML for Bill 3
html_bill_3 = f"""<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <title>কন্টেইনার বিল-৩ (বিল ও সমন্বয় বিবরণী) - মা মোটরস</title>
    <style>{css}</style>
</head>
<body>
    <div class="print-btn-bar no-print">
        <button class="print-btn" onclick="window.print()">🖨️ A4 প্রিন্ট করুন (Print Bill-3)</button>
    </div>

    <div class="a4-page">
        <!-- Header -->
        <div class="header-banner">
            <div class="header-left">
                <img src="data:image/jpeg;base64,{logo_b64}" class="shop-logo" alt="Logo">
                <div class="shop-info">
                    <h1>মেসার্স মা মোটরস (M/S. MAA-MOTOR'S)</h1>
                    <div class="owner">স্বত্বাধিকারী: মোহাম্মদ এমরান (Mohammed Amran)</div>
                    <div class="address">দোকান নং-২২, রহমান টাওয়ার, ১ম রেলগেট, মুরাদপুর, হাটহাজারী রোড, চট্টগ্রাম।<br>মোবাইল: 01819-397669, 01815-707934</div>
                </div>
            </div>
            <div class="header-right">
                <div class="voucher-badge">CONTAINER SETTLEMENT</div>
                <div class="header-date">ভাউচার নং: <span class="amount-font" style="font-weight:700;">CONT-BILL-03</span></div>
            </div>
        </div>

        <!-- Title Bar -->
        <div class="doc-title-bar">
            <h2>কন্টেইনার বিল ও এলসি সমন্বয় বিবরণী (বিল নং: ৩)</h2>
        </div>

        <!-- Metadata -->
        <div class="meta-grid">
            <div class="meta-item">
                <div class="meta-label">এলসি নম্বর (LC No):</div>
                <div class="meta-value amount-font" style="font-size: 12px; letter-spacing: 0.5px;">087426010395</div>
            </div>
            <div class="meta-item">
                <div class="meta-label">এলসি মালিক / নাম:</div>
                <div class="meta-value">মোহাম্মদ এমরান (AMRAN)</div>
            </div>
            <div class="meta-item">
                <div class="meta-label">হিসাবের ধরন:</div>
                <div class="meta-value">কন্টেইনার ছাড়করণ ও ফ্রেইট</div>
            </div>
            <div class="meta-item">
                <div class="meta-label">চূড়ান্ত স্ট্যাটাস:</div>
                <div class="meta-value" style="color: #047857;">উদ্বৃত্ত / এমরানের জমা</div>
            </div>
        </div>

        <!-- Section 1: Expenses -->
        <div class="section-card">
            <div class="section-head">
                <span>১. কন্টেইনার খালাস, ফ্রেইট ও বন্দর খরচসমূহ (Expenses / Charges)</span>
                <span class="badge-expense">(-) খরচ / ডেবিট</span>
            </div>
            <table class="table-custom">
                <thead>
                    <tr>
                        <th style="width: 7%;" class="t-center">ক্র.নং</th>
                        <th style="width: 45%;">খরচের বিবরণ (Description)</th>
                        <th style="width: 25%;">মূল ইংরেজী বিবরণ</th>
                        <th style="width: 23%;" class="t-right">টাকার পরিমাণ (টাকা)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="t-center" style="font-weight: 700; color: #64748b;">১</td>
                        <td><strong>জাহাজ ভাড়া / ফ্রেইট চার্জ (১ম অংশ)</strong></td>
                        <td style="color: #64748b; font-family: 'Inter', sans-serif; font-size: 9.5px;">1 FREIGTY CHARGE</td>
                        <td class="t-right">
                            <div class="amount-font" style="color: #dc2626; font-size: 13px; font-weight: 800;">৳ 41,500</div>
                            <div style="font-size: 8.5px; color: #64748b;">(৪১,৫০০ টাকা)</div>
                        </td>
                    </tr>
                    <tr>
                        <td class="t-center" style="font-weight: 700; color: #64748b;">২</td>
                        <td><strong>পরিবহন খরচ (ট্রান্সপোর্ট)</strong></td>
                        <td style="color: #64748b; font-family: 'Inter', sans-serif; font-size: 9.5px;">TRANSPORT</td>
                        <td class="t-right">
                            <div class="amount-font" style="color: #dc2626; font-size: 13px; font-weight: 800;">৳ 4,000</div>
                            <div style="font-size: 8.5px; color: #64748b;">(৪,০০০ টাকা)</div>
                        </td>
                    </tr>
                    <tr>
                        <td class="t-center" style="font-weight: 700; color: #64748b;">৩</td>
                        <td><strong>বন্দর হ্যান্ডলিং চার্জ (Port Handling)</strong></td>
                        <td style="color: #64748b; font-family: 'Inter', sans-serif; font-size: 9.5px;">PORT HANDLING CHARGE</td>
                        <td class="t-right">
                            <div class="amount-font" style="color: #dc2626; font-size: 13px; font-weight: 800;">৳ 315</div>
                            <div style="font-size: 8.5px; color: #64748b;">(৩১৫ টাকা)</div>
                        </td>
                    </tr>
                    <tr>
                        <td class="t-center" style="font-weight: 700; color: #64748b;">৪</td>
                        <td><strong>ব্যাংক চার্জ (এলসি সংশোধনী / Amendment)</strong></td>
                        <td style="color: #64748b; font-family: 'Inter', sans-serif; font-size: 9.5px;">BANK CHARGE AMNDMENT</td>
                        <td class="t-right">
                            <div class="amount-font" style="color: #dc2626; font-size: 13px; font-weight: 800;">৳ 1,000</div>
                            <div style="font-size: 8.5px; color: #64748b;">(১,০০০ টাকা)</div>
                        </td>
                    </tr>
                    <tr>
                        <td class="t-center" style="font-weight: 700; color: #64748b;">৫</td>
                        <td><strong>ডকুমেন্ট চার্জ (চট্টগ্রাম টু কমলাপুর আইসিডি বিএল)</strong></td>
                        <td style="color: #64748b; font-family: 'Inter', sans-serif; font-size: 9.5px;">DOCUMENT CHARGE BL CGP TO ICD</td>
                        <td class="t-right">
                            <div class="amount-font" style="color: #dc2626; font-size: 13px; font-weight: 800;">৳ 1,000</div>
                            <div style="font-size: 8.5px; color: #64748b;">(১,০০০ টাকা)</div>
                        </td>
                    </tr>
                    <tr>
                        <td class="t-center" style="font-weight: 700; color: #64748b;">৬</td>
                        <td><strong>শারজাহ বন্দর আনয়ন মাশুল (SHJ to Port)</strong></td>
                        <td style="color: #64748b; font-family: 'Inter', sans-serif; font-size: 9.5px;">PORT CHARGE SHJ TO PORT</td>
                        <td class="t-right">
                            <div class="amount-font" style="color: #dc2626; font-size: 13px; font-weight: 800;">৳ 700</div>
                            <div style="font-size: 8.5px; color: #64748b;">(৭০০ টাকা)</div>
                        </td>
                    </tr>
                    <tr class="total-row">
                        <td colspan="3" class="t-right"><strong>সর্বমোট খরচ (Total Expenses):</strong></td>
                        <td class="t-right">
                            <div class="amount-font" style="color: #dc2626; font-size: 14.5px; font-weight: 900;">৳ 48,515</div>
                            <div style="font-size: 9.5px; color: #475569; font-weight: 700;">(৪৮,৫১৫ টাকা)</div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Section 2: LC Funds Received -->
        <div class="section-card">
            <div class="section-head green">
                <span>২. এলসি ফান্ড প্রাপ্তি / জমাকৃত অর্থ (LC Funds Received / Credit)</span>
                <span class="badge-credit">(+) জমা / ক্রেডিট</span>
            </div>
            <table class="table-custom">
                <thead>
                    <tr>
                        <th style="width: 7%;" class="t-center">ক্র.নং</th>
                        <th style="width: 70%;">ফান্ডের বিবরণ (Fund Allocation)</th>
                        <th style="width: 23%;" class="t-right">টাকার পরিমাণ (টাকা)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="t-center" style="font-weight: 700; color: #64748b;">১</td>
                        <td>এলসি ফান্ড ১ম অংশ (LC Amount 1st Part)</td>
                        <td class="t-right">
                            <div class="amount-font" style="color: #059669; font-size: 13px; font-weight: 800;">৳ 17,465</div>
                            <div style="font-size: 8.5px; color: #64748b;">(১৭,৪৬৫ টাকা)</div>
                        </td>
                    </tr>
                    <tr>
                        <td class="t-center" style="font-weight: 700; color: #64748b;">২</td>
                        <td>এলসি ফান্ড ২য় অংশ (LC Amount 2nd Part)</td>
                        <td class="t-right">
                            <div class="amount-font" style="color: #059669; font-size: 13px; font-weight: 800;">৳ 6,292</div>
                            <div style="font-size: 8.5px; color: #64748b;">(৬,২৯২ টাকা)</div>
                        </td>
                    </tr>
                    <tr>
                        <td class="t-center" style="font-weight: 700; color: #64748b;">৩</td>
                        <td>এলসি ফান্ড ৩য় অংশ / প্রধান বরাদ্দ (LC Amount 3rd Part)</td>
                        <td class="t-right">
                            <div class="amount-font" style="color: #059669; font-size: 13px; font-weight: 800;">৳ 50,000</div>
                            <div style="font-size: 8.5px; color: #64748b;">(৫০,০০০ টাকা)</div>
                        </td>
                    </tr>
                    <tr class="total-row">
                        <td colspan="2" class="t-right"><strong>সর্বমোট জমাকৃত এলসি ফান্ড (Total LC Fund):</strong></td>
                        <td class="t-right">
                            <div class="amount-font" style="color: #059669; font-size: 14.5px; font-weight: 900;">৳ 73,757</div>
                            <div style="font-size: 9.5px; color: #475569; font-weight: 700;">(৭৩,৭৫৭ টাকা)</div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Section 3: Summary & Settlement -->
        <div class="summary-box">
            <div class="summary-formula">
                <span>৩. চূড়ান্ত আর্থিক সমন্বয় (Net Financial Settlement):</span>
                <span class="balance-result balance-surplus">
                    <span class="amount-font" style="font-size: 15px; font-weight: 900;">উদ্বৃত্ত: + ৳ 25,242</span>
                    <span style="font-size: 10.5px; font-weight: 700;"> (২৫,২৪২ টাকা)</span>
                </span>
            </div>
            <div style="font-size: 10.5px; color: #334155; margin-bottom: 2px;">
                <strong>গাণিতিক সূত্র:</strong> সর্বমোট ফান্ড (<span class="amount-font" style="font-weight:700;">৳ 73,757</span>) – সর্বমোট খরচ (<span class="amount-font" style="font-weight:700;">৳ 48,515</span>) = <strong>অবশিষ্ট জমা <span class="amount-font" style="font-weight:800; color: #065f46;">৳ 25,242</span> (২৫,২৪২ টাকা)</strong>
            </div>
            <div class="in-words">
                <strong>কথায়:</strong> পঁচিশ হাজার দুই শত বিয়াল্লিশ টাকা মাত্র (এমরানের প্রাপ্য/উদ্বৃত্ত জমা)।
            </div>
        </div>

        <!-- Explanation Card -->
        <div class="explanation-card">
            <h4>💡 বিল-৩ এর সহজ ব্যাখ্যা ও সিদ্ধান্ত:</h4>
            এই কন্টেইনারটির (LC No: 087426010395) বিপরীতে সর্বমোট <strong>৪৮,৫১৫ টাকা (৳ 48,515)</strong> খালাস ও পরিবহন খরচ হয়েছে। মোট ফান্ড জমা হয়েছিল <strong>৭৩,৭৫৭ টাকা (৳ 73,757)</strong>। ফলে খরচ মেটানোর পরও <strong>২৫,২৪২ টাকা (৳ 25,242) উদ্বৃত্ত</strong> ছিল। মূল বিলে <strong>"FOR AMRAN"</strong> লিখে বোঝানো হয়েছে যে এই ২৫,২৪২ টাকা এমরান সাহেবের পাওনা বা পরবর্তী বিলে সমন্বয়যোগ্য ফান্ড।
        </div>

        <!-- Signatures -->
        <div class="sign-grid">
            <div class="sign-box">প্রস্তুতকারক (অ্যাকাউন্টস)</div>
            <div class="sign-box">সাদেক (যাচাইকারী)</div>
            <div class="sign-box">আলতাফ (পার্টনার)</div>
            <div class="sign-box">মোহাম্মদ এমরান (স্বত্বাধিকারী)</div>
        </div>
    </div>
</body>
</html>
"""

# HTML for Bill 4
html_bill_4 = f"""<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <title>কন্টেইনার বিল-৪ (বিল ও সমন্বয় বিবরণী) - মা মোটরস</title>
    <style>{css}</style>
</head>
<body>
    <div class="print-btn-bar no-print">
        <button class="print-btn" onclick="window.print()">🖨️ A4 প্রিন্ট করুন (Print Bill-4)</button>
    </div>

    <div class="a4-page">
        <!-- Header -->
        <div class="header-banner">
            <div class="header-left">
                <img src="data:image/jpeg;base64,{logo_b64}" class="shop-logo" alt="Logo">
                <div class="shop-info">
                    <h1>মেসার্স মা মোটরস (M/S. MAA-MOTOR'S)</h1>
                    <div class="owner">স্বত্বাধিকারী: মোহাম্মদ এমরান (Mohammed Amran)</div>
                    <div class="address">দোকান নং-২২, রহমান টাওয়ার, ১ম রেলগেট, মুরাদপুর, হাটহাজারী রোড, চট্টগ্রাম।<br>মোবাইল: 01819-397669, 01815-707934</div>
                </div>
            </div>
            <div class="header-right">
                <div class="voucher-badge">CONTAINER SETTLEMENT</div>
                <div class="header-date">ভাউচার নং: <span class="amount-font" style="font-weight:700;">CONT-BILL-04</span></div>
            </div>
        </div>

        <!-- Title Bar -->
        <div class="doc-title-bar">
            <h2>কন্টেইনার বিল ও এলসি সমন্বয় বিবরণী (বিল নং: ৪)</h2>
        </div>

        <!-- Metadata -->
        <div class="meta-grid">
            <div class="meta-item">
                <div class="meta-label">এলসি নম্বর (LC No):</div>
                <div class="meta-value amount-font" style="font-size: 12px; letter-spacing: 0.5px;">087426010394</div>
            </div>
            <div class="meta-item">
                <div class="meta-label">এলসি মালিক / নাম:</div>
                <div class="meta-value">মোহাম্মদ এমরান (AMRAN)</div>
            </div>
            <div class="meta-item">
                <div class="meta-label">হিসাবের ধরন:</div>
                <div class="meta-value">কন্টেইনার খালাস ও সমন্বয়</div>
            </div>
            <div class="meta-item">
                <div class="meta-label">চূড়ান্ত স্ট্যাটাস:</div>
                <div class="meta-value" style="color: #b91c1c;">ঘাটতি / সাদেকের নিকট নিষ্পত্তি</div>
            </div>
        </div>

        <!-- Section 1: Expenses -->
        <div class="section-card">
            <div class="section-head">
                <span>১. কন্টেইনার খালাস, ফ্রেইট ও বন্দর খরচসমূহ (Expenses / Charges)</span>
                <span class="badge-expense">(-) খরচ / ডেবিট</span>
            </div>
            <table class="table-custom">
                <thead>
                    <tr>
                        <th style="width: 7%;" class="t-center">ক্র.নং</th>
                        <th style="width: 45%;">খরচের বিবরণ (Description)</th>
                        <th style="width: 25%;">মূল ইংরেজী বিবরণ</th>
                        <th style="width: 23%;" class="t-right">টাকার পরিমাণ (টাকা)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="t-center" style="font-weight: 700; color: #64748b;">১</td>
                        <td><strong>জাহাজ ভাড়া / ফ্রেইট চার্জ (১ম অংশ)</strong></td>
                        <td style="color: #64748b; font-family: 'Inter', sans-serif; font-size: 9.5px;">1 FREIGTY CHARGE</td>
                        <td class="t-right">
                            <div class="amount-font" style="color: #dc2626; font-size: 13px; font-weight: 800;">৳ 42,068</div>
                            <div style="font-size: 8.5px; color: #64748b;">(৪২,০৬৮ টাকা)</div>
                        </td>
                    </tr>
                    <tr>
                        <td class="t-center" style="font-weight: 700; color: #64748b;">২</td>
                        <td><strong>পরিবহন খরচ (ট্রান্সপোর্ট)</strong></td>
                        <td style="color: #64748b; font-family: 'Inter', sans-serif; font-size: 9.5px;">TRANSPORT</td>
                        <td class="t-right">
                            <div class="amount-font" style="color: #dc2626; font-size: 13px; font-weight: 800;">৳ 4,000</div>
                            <div style="font-size: 8.5px; color: #64748b;">(৪,০০০ টাকা)</div>
                        </td>
                    </tr>
                    <tr>
                        <td class="t-center" style="font-weight: 700; color: #64748b;">৩</td>
                        <td><strong>বন্দর হ্যান্ডলিং চার্জ (Port Handling)</strong></td>
                        <td style="color: #64748b; font-family: 'Inter', sans-serif; font-size: 9.5px;">PORT HANDLING CHARGE</td>
                        <td class="t-right">
                            <div class="amount-font" style="color: #dc2626; font-size: 13px; font-weight: 800;">৳ 315</div>
                            <div style="font-size: 8.5px; color: #64748b;">(৩১৫ টাকা)</div>
                        </td>
                    </tr>
                    <tr>
                        <td class="t-center" style="font-weight: 700; color: #64748b;">৪</td>
                        <td><strong>ব্যাংক চার্জ (এলসি সংশোধনী / Amendment)</strong></td>
                        <td style="color: #64748b; font-family: 'Inter', sans-serif; font-size: 9.5px;">BANK CHARGE AMNDMENT</td>
                        <td class="t-right">
                            <div class="amount-font" style="color: #dc2626; font-size: 13px; font-weight: 800;">৳ 1,000</div>
                            <div style="font-size: 8.5px; color: #64748b;">(১,০০০ টাকা)</div>
                        </td>
                    </tr>
                    <tr>
                        <td class="t-center" style="font-weight: 700; color: #64748b;">৫</td>
                        <td><strong>ডকুমেন্ট চার্জ (চট্টগ্রাম টু কমলাপুর আইসিডি বিএল)</strong></td>
                        <td style="color: #64748b; font-family: 'Inter', sans-serif; font-size: 9.5px;">DOCUMENT CHARGE BL CGP TO ICD</td>
                        <td class="t-right">
                            <div class="amount-font" style="color: #dc2626; font-size: 13px; font-weight: 800;">৳ 1,000</div>
                            <div style="font-size: 8.5px; color: #64748b;">(১,০০০ টাকা)</div>
                        </td>
                    </tr>
                    <tr>
                        <td class="t-center" style="font-weight: 700; color: #64748b;">৬</td>
                        <td><strong>শারজাহ বন্দর আনয়ন মাশুল (SHJ to Port)</strong></td>
                        <td style="color: #64748b; font-family: 'Inter', sans-serif; font-size: 9.5px;">PORT CHARGE SHJ TO PORT</td>
                        <td class="t-right">
                            <div class="amount-font" style="color: #dc2626; font-size: 13px; font-weight: 800;">৳ 800</div>
                            <div style="font-size: 8.5px; color: #64748b;">(৮০০ টাকা)</div>
                        </td>
                    </tr>
                    <tr class="total-row">
                        <td colspan="3" class="t-right"><strong>সর্বমোট খরচ (Total Expenses):</strong></td>
                        <td class="t-right">
                            <div class="amount-font" style="color: #dc2626; font-size: 14.5px; font-weight: 900;">৳ 49,183</div>
                            <div style="font-size: 9.5px; color: #475569; font-weight: 700;">(৪৯,১৮৩ টাকা)</div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Section 2: Funds & Adjustment -->
        <div class="section-card">
            <div class="section-head green">
                <span>২. এলসি ফান্ড ও পূর্বের উদ্বৃত্ত তহবিল সমন্বয় (Funds & Surplus Adjustment)</span>
                <span class="badge-credit">(+) লভ্য ফান্ড</span>
            </div>
            <table class="table-custom">
                <thead>
                    <tr>
                        <th style="width: 7%;" class="t-center">ক্র.নং</th>
                        <th style="width: 70%;">ফান্ডের বিবরণ (Fund Description)</th>
                        <th style="width: 23%;" class="t-right">টাকার পরিমাণ (টাকা)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="t-center" style="font-weight: 700; color: #64748b;">১</td>
                        <td>বিল-৪ এর নতুন বরাদ্দকৃত এলসি ফান্ড (LC Amount)</td>
                        <td class="t-right">
                            <div class="amount-font" style="color: #059669; font-size: 13px; font-weight: 800;">৳ 19,293</div>
                            <div style="font-size: 8.5px; color: #64748b;">(১৯,২৯৩ টাকা)</div>
                        </td>
                    </tr>
                    <tr>
                        <td class="t-center" style="font-weight: 700; color: #64748b;">২</td>
                        <td><strong>বিল-৩ হতে আনীত এমরানের উদ্বৃত্ত ফান্ড সমন্বয় (amran ezza)</strong></td>
                        <td class="t-right">
                            <div class="amount-font" style="color: #059669; font-size: 13px; font-weight: 800;">৳ 25,242</div>
                            <div style="font-size: 8.5px; color: #64748b;">(২৫,২৪২ টাকা)</div>
                        </td>
                    </tr>
                    <tr class="total-row">
                        <td colspan="2" class="t-right"><strong>মোট লভ্য তহবিল (Total Available Funds):</strong></td>
                        <td class="t-right">
                            <div class="amount-font" style="color: #059669; font-size: 14.5px; font-weight: 900;">৳ 44,535</div>
                            <div style="font-size: 9.5px; color: #475569; font-weight: 700;">(৪৪,৫৩৫ টাকা)</div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Section 3: Summary & Settlement -->
        <div class="summary-box">
            <div class="summary-formula">
                <span>৩. চূড়ান্ত আর্থিক সমন্বয় (Net Financial Settlement):</span>
                <span class="balance-result balance-deficit">
                    <span class="amount-font" style="font-size: 15px; font-weight: 900;">ঘাটতি: - ৳ 4,648</span>
                    <span style="font-size: 10.5px; font-weight: 700;"> (৪,৬৪৮ টাকা)</span>
                </span>
            </div>
            <div style="font-size: 10.5px; color: #334155; margin-bottom: 2px;">
                <strong>গাণিতিক সূত্র:</strong> মোট ফান্ড (<span class="amount-font" style="font-weight:700;">৳ 44,535</span>) – সর্বমোট খরচ (<span class="amount-font" style="font-weight:700;">৳ 49,183</span>) = <strong>ঘাটতি / বকেয়া <span class="amount-font" style="font-weight:800; color: #991b1b;">- ৳ 4,648</span> (৪,৬৪৮ টাকা)</strong>
            </div>
            <div class="in-words">
                <strong>কথায়:</strong> চার হাজার ছয় শত আটচল্লিশ টাকা মাত্র (সাদেক কর্তৃক সমন্বয়কৃত / সাদেকের দায়)।
            </div>
        </div>

        <!-- Explanation Card -->
        <div class="explanation-card orange">
            <h4>💡 বিল-৪ এর সহজ ব্যাখ্যা ও সিদ্ধান্ত:</h4>
            এই কন্টেইনারে (LC No: 087426010394) মোট খরচ হয়েছে <strong>৪৯,১৮৩ টাকা (৳ 49,183)</strong>। নতুন ফান্ড বরাদ্দ ছিল <strong>১৯,২৯৩ টাকা (৳ 19,293)</strong> এবং পূর্ববর্তী বিল-৩ এ এমরানের বেঁচে যাওয়া উদ্বৃত্ত <strong>২৫,২৪২ টাকা (৳ 25,242)</strong> এখানে এনে যোগ করা হয়। মোট ফান্ড দাঁড়ায় <strong>৪৪,৫৩৫ টাকা (৳ 44,535)</strong>। কিন্তু খরচের তুলনায় ফান্ড <strong>৪,৬৪৮ টাকা (৳ 4,648) কম পড়ে</strong>। নোটে <strong>"4648 sadek"</strong> লিখে বোঝানো হয়েছে যে এই ৪,৬৪৮ টাকা ঘাটতি সাদেক সাহেব পরিশোধ/সমন্বয় করেছেন।
        </div>

        <!-- Signatures -->
        <div class="sign-grid">
            <div class="sign-box">প্রস্তুতকারক (অ্যাকাউন্টস)</div>
            <div class="sign-box">সাদেক (নিষ্পত্তিকারী)</div>
            <div class="sign-box">আলতাফ (পার্টনার)</div>
            <div class="sign-box">মোহাম্মদ এমরান (স্বত্বাধিকারী)</div>
        </div>
    </div>
</body>
</html>
"""

# Save HTML files
html3_path = os.path.join(base_dir, "BILL_ALTAF_AMRAN_3_BANGLA.html")
html4_path = os.path.join(base_dir, "BILL_ALTAF_AMRAN_4_BANGLA.html")

with open(html3_path, "w", encoding="utf-8") as f:
    f.write(html_bill_3)

with open(html4_path, "w", encoding="utf-8") as f:
    f.write(html_bill_4)

print("Generated HTML 3:", html3_path)
print("Generated HTML 4:", html4_path)

# Convert to PDF using headless Chrome
chrome = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
pdf3_path = os.path.join(base_dir, "BILL_ALTAF_AMRAN_3_BANGLA.pdf")
pdf4_path = os.path.join(base_dir, "BILL_ALTAF_AMRAN_4_BANGLA.pdf")

res3 = subprocess.run([chrome, '--headless=new', '--disable-gpu', '--no-pdf-header-footer', f'--print-to-pdf={pdf3_path}', html3_path], capture_output=True, text=True)
res4 = subprocess.run([chrome, '--headless=new', '--disable-gpu', '--no-pdf-header-footer', f'--print-to-pdf={pdf4_path}', html4_path], capture_output=True, text=True)

# Verify page counts using pymupdf
doc3 = pymupdf.open(pdf3_path)
doc4 = pymupdf.open(pdf4_path)
print("Doc 3 page count:", len(doc3))
print("Doc 4 page count:", len(doc4))
