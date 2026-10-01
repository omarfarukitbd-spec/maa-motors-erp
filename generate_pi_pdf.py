import os
import subprocess
import pymupdf

def build_bengali_pi_html():
    html_content = """<!DOCTYPE html>
<html lang="bn">
<head>
<meta charset="UTF-8">
<title>প্রোফরমা ইনভয়েস — আরিয়ান-১০৪</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap');

  @page {
    size: A4 portrait;
    margin: 8mm 10mm;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Hind Siliguri', 'Inter', sans-serif;
    color: #1e293b;
    background: #ffffff;
    font-size: 11px;
    line-height: 1.35;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .page-container {
    width: 100%;
    max-width: 190mm;
    margin: 0 auto;
  }

  /* Header */
  .header-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 6px;
    border-bottom: 2px solid #1e3a8a;
    padding-bottom: 4px;
  }

  .header-title-box {
    text-align: center;
    background: linear-gradient(135deg, #1e3a8a, #0f172a);
    color: #ffffff;
    padding: 6px 12px;
    border-radius: 4px;
    margin-bottom: 6px;
  }

  .header-title-box h1 {
    font-size: 17px;
    font-weight: 700;
    letter-spacing: 1px;
    margin: 0;
  }

  .header-title-box .sub-title {
    font-size: 11px;
    opacity: 0.9;
    font-weight: 500;
  }

  /* Top Info 3-Column Bar */
  .meta-bar {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 6px;
    background: #f1f5f9;
    border: 1px solid #cbd5e1;
    border-radius: 4px;
    font-size: 10.5px;
  }

  .meta-bar td {
    padding: 4px 8px;
    border-right: 1px solid #cbd5e1;
    vertical-align: middle;
  }
  .meta-bar td:last-child {
    border-right: none;
  }

  /* Exporter & Consignee Grid */
  .parties-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 6px;
  }

  .party-card {
    width: 50%;
    vertical-align: top;
    padding: 5px 8px;
    border: 1px solid #cbd5e1;
    background: #ffffff;
    font-size: 10px;
    line-height: 1.35;
  }

  .party-card.left {
    border-right: 1px dashed #cbd5e1;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }
  .party-card.right {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }

  .party-badge {
    display: inline-block;
    background: #1e3a8a;
    color: #ffffff;
    padding: 1px 6px;
    border-radius: 3px;
    font-weight: 700;
    font-size: 9.5px;
    margin-bottom: 3px;
  }

  .party-badge.consignee {
    background: #047857;
  }

  .party-name {
    font-weight: 700;
    font-size: 11px;
    color: #0f172a;
  }

  /* Description Banner */
  .desc-banner {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-left: 3px solid #1e3a8a;
    padding: 3px 8px;
    font-size: 9.5px;
    color: #334155;
    margin-bottom: 6px;
  }

  /* Main Items Table */
  .items-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 6px;
    font-size: 9.8px;
  }

  .items-table th {
    background: #1e3a8a;
    color: #ffffff;
    padding: 4px 5px;
    border: 1px solid #1e3a8a;
    text-align: center;
    font-weight: 600;
    font-size: 9.5px;
  }

  .items-table td {
    padding: 3.5px 5px;
    border: 1px solid #cbd5e1;
    vertical-align: middle;
  }

  .items-table tr:nth-child(even) {
    background: #f8fafc;
  }

  .text-center { text-align: center; }
  .text-right { text-align: right; }
  .font-bold { font-weight: 700; }

  .total-row td {
    background: #e2e8f0 !important;
    font-weight: 700;
    border-top: 2px solid #1e3a8a;
    border-bottom: 2px solid #1e3a8a;
    color: #0f172a;
    font-size: 10.5px;
  }

  /* Amount in words & Notes */
  .words-box {
    background: #ecfdf5;
    border: 1px solid #a7f3d0;
    padding: 4px 8px;
    border-radius: 4px;
    margin-bottom: 6px;
    font-size: 10px;
    color: #065f46;
  }

  /* Certification & Terms Grid */
  .terms-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 6px;
    font-size: 9px;
  }

  .terms-cell {
    border: 1px solid #cbd5e1;
    padding: 4px 6px;
    vertical-align: top;
    background: #ffffff;
  }

  .terms-title {
    font-weight: 700;
    color: #1e3a8a;
    font-size: 9.5px;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 2px;
    margin-bottom: 3px;
  }

  /* Signatures */
  .signatures-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
  }

  .sign-box {
    width: 50%;
    text-align: center;
    vertical-align: bottom;
    padding: 0 20px;
  }

  .sign-line {
    border-top: 1px dashed #64748b;
    margin-top: 28px;
    padding-top: 3px;
    font-size: 9.5px;
    font-weight: 600;
    color: #334155;
  }
</style>
</head>
<body>

<div class="page-container">

  <!-- Header Title -->
  <div class="header-title-box">
    <h1>প্রোফরমা ইনভয়েস (PROFORMA INVOICE)</h1>
    <div class="sub-title">আমদানি ও আন্তর্জাতিক রিকন্ডিশনড পার্টস ক্রয় চুক্তিপত্র</div>
  </div>

  <!-- Meta Info Bar -->
  <table class="meta-bar">
    <tr>
      <td width="30%"><strong>ইনভয়েস নং:</strong> <span style="font-family:'Inter'; font-weight:700; color:#1e3a8a;">ARIYAN-104</span></td>
      <td width="25%"><strong>তারিখ:</strong> ৩০ সেপ্টেম্বর ২০২৬</td>
      <td width="22%"><strong>উৎপত্তির দেশ:</strong> জাপান (Japan)</td>
      <td width="23%"><strong>পরিবহন:</strong> সমুদ্রপথে (By Sea)</td>
    </tr>
    <tr>
      <td colspan="2"><strong>লোডিং বন্দর:</strong> দুবাই বন্দর, সংযুক্ত আরব আমিরাত (Dubai, UAE)</td>
      <td colspan="2"><strong>চূড়ান্ত গন্তব্য:</strong> আইসিডি কমলাপুর, ঢাকা (চট্টগ্রাম হয়ে)</td>
    </tr>
  </table>

  <!-- Exporter & Consignee -->
  <table class="parties-table">
    <tr>
      <!-- Exporter -->
      <td class="party-card left">
        <span class="party-badge">রপ্তানিকারক (EXPORTER)</span><br>
        <span class="party-name">ARAB JAPAN USED CARS & SPARE PARTS CO. L.L.C.</span><br>
        পোস্ট বক্স নং- ৩৫৬৯৮, জে অ্যান্ড পি রোড, ইন্ডাস্ট্রিয়াল এরিয়া নং ৬, শারজাহ, ইউএই।<br>
        <strong>ফোন:</strong> 0507575805 &nbsp;|&nbsp; <strong>ইমেইল:</strong> arabjapanuae@yahoo.com
      </td>

      <!-- Consignee -->
      <td class="party-card right">
        <span class="party-badge consignee">আমদানিকারক (CONSIGNEE)</span><br>
        <span class="party-name">আরিয়ান মোটর ওয়ার্কশপ (ARIYAN MOTOR WORKSHOP)</span><br>
        বঙ্গবন্ধু এভিনিউ, নয়াহাট, বায়েজিদ বোস্তামী থানা, চট্টগ্রাম-৪২১০, বাংলাদেশ।<br>
        <strong>টিইন:</strong> 7570-5990-6181 &nbsp;|&nbsp; <strong>আইআরসি:</strong> 260315120100020<br>
        <strong>ভ্যাট নিবন্ধন:</strong> 002468804-0506 &nbsp;|&nbsp; <strong>ইমেইল:</strong> armanmohammad473@gmail.com
      </td>
    </tr>
  </table>

  <!-- Description Banner -->
  <div class="desc-banner">
    <strong>পণ্যের সাধারণ বিবরণ:</strong> মোটর যানবাহনের পুরাতন ও ব্যবহৃত অটো পার্টস, যন্ত্রাংশ এবং গিয়ারবক্সসহ ইঞ্জিন ("OLD & USED AUTO PARTS & ACCESSORIES AND ENGINE FITTED WITH GEAR BOX" OF MOTOR VEHICLES)।
  </div>

  <!-- Items Table -->
  <table class="items-table">
    <thead>
      <tr>
        <th width="4%">ক্র.</th>
        <th width="38%">মালের বিস্তারিত বিবরণ (Description of Goods)</th>
        <th width="14%">এইচ.এস কোড</th>
        <th width="10%">পরিমাণ (পিছ)</th>
        <th width="12%">মোট ওজন (কেজি)</th>
        <th width="10%">একক দর ($)</th>
        <th width="12%">মোট মূল্য (USD)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="text-center font-bold">১</td>
        <td>ব্যবহৃত গিয়ার বক্স অ্যাসেম্বলি (Used Gear Box Assembly)</td>
        <td class="text-center">8708.40.00</td>
        <td class="text-center font-bold">১০</td>
        <td class="text-right">৪৫০</td>
        <td class="text-right">$১০.০০</td>
        <td class="text-right font-bold">$১০০.০০</td>
      </tr>
      <tr>
        <td class="text-center font-bold">২</td>
        <td>ব্যবহৃত সাসপেনশন ও শক অ্যাবজরবার অ্যাসেম্বলি</td>
        <td class="text-center">8708.80.00</td>
        <td class="text-center font-bold">৫</td>
        <td class="text-right">১২০</td>
        <td class="text-right">$৩.০০</td>
        <td class="text-right font-bold">$১৫.০০</td>
      </tr>
      <tr>
        <td class="text-center font-bold">৩</td>
        <td>ব্যবহৃত ভ্যাকুয়াম বুস্টার ব্রেক মাস্টারসহ (Brake Master Assembly)</td>
        <td class="text-center">8708.30.00</td>
        <td class="text-center font-bold">১৫</td>
        <td class="text-right">৭৫</td>
        <td class="text-right">$১.০০</td>
        <td class="text-right font-bold">$১৫.০০</td>
      </tr>
      <tr>
        <td class="text-center font-bold">৪</td>
        <td>ব্যবহৃত ব্রেক বুস্টার অ্যাসেম্বলি (Brake Booster Assembly)</td>
        <td class="text-center">8708.30.00</td>
        <td class="text-center font-bold">৫</td>
        <td class="text-right">৫৫</td>
        <td class="text-right">$১.০০</td>
        <td class="text-right font-bold">$৫.০০</td>
      </tr>
      <tr>
        <td class="text-center font-bold">৫</td>
        <td>ব্যবহৃত পাওয়ার স্টিয়ারিং - রেক টাইপ (Power Steering Rack)</td>
        <td class="text-center">8708.94.00</td>
        <td class="text-center font-bold">১৫</td>
        <td class="text-right">৬৫</td>
        <td class="text-right">$১.০০</td>
        <td class="text-right font-bold">$১৫.০০</td>
      </tr>
      <tr>
        <td class="text-center font-bold">৬</td>
        <td>ব্যবহৃত এক্সেল অ্যাসেম্বলি (Used Axle Assembly)</td>
        <td class="text-center">8708.50.00</td>
        <td class="text-center font-bold">২০</td>
        <td class="text-right">৬০</td>
        <td class="text-right">$৫.০০</td>
        <td class="text-right font-bold">$১০০.০০</td>
      </tr>
      <tr>
        <td class="text-center font-bold">৭</td>
        <td>ব্যবহৃত হুইল হাবস অ্যাসেম্বলি (Used Hubs Assembly)</td>
        <td class="text-center">8708.29.00</td>
        <td class="text-center font-bold">১৪</td>
        <td class="text-right">১২০</td>
        <td class="text-right">$১.০০</td>
        <td class="text-right font-bold">$১৪.০০</td>
      </tr>
      <tr>
        <td class="text-center font-bold">৮</td>
        <td>ব্যবহৃত মাউন্টিং অ্যাসেম্বলি (Used Mounting Assembly)</td>
        <td class="text-center">8302.30.00</td>
        <td class="text-center font-bold">১০</td>
        <td class="text-right">৩০</td>
        <td class="text-right">$১.০০</td>
        <td class="text-right font-bold">$১০.০০</td>
      </tr>
      <tr>
        <td class="text-center font-bold">৯</td>
        <td>এয়ার ফিল্টার ক্লিনার বক্স (Air Cleaner Box Assembly)</td>
        <td class="text-center">8421.31.00</td>
        <td class="text-center font-bold">১৫</td>
        <td class="text-right">৫০</td>
        <td class="text-right">$১.০০</td>
        <td class="text-right font-bold">$১৫.০০</td>
      </tr>
      <tr>
        <td class="text-center font-bold">১০</td>
        <td>স্টার্টার মোটর ও অল্টারনেটর ডায়নামা (Starter / Alternator)</td>
        <td class="text-center">8511.40.00</td>
        <td class="text-center font-bold">৮০</td>
        <td class="text-right">১৯৫</td>
        <td class="text-right">$১.০০</td>
        <td class="text-right font-bold">$৮০.০০</td>
      </tr>
      <tr>
        <td class="text-center font-bold">১১</td>
        <td>ব্যবহৃত পেট্রোল ইঞ্জিন গিয়ারবক্সসহ (Gasoline 4-Cyl Engine)</td>
        <td class="text-center">8407.34.90</td>
        <td class="text-center font-bold">৮০</td>
        <td class="text-right">২৬,৩৮০</td>
        <td class="text-right">$৬০.০০</td>
        <td class="text-right font-bold">$৪,৮০০.০০</td>
      </tr>

      <!-- Total Row -->
      <tr class="total-row">
        <td colspan="3" class="text-center font-bold">সর্বমোট সর্বসাকুল্যে (TOTAL ALL)</td>
        <td class="text-center font-bold">২৬৯ পিছ</td>
        <td class="text-right font-bold">২৭,৬০০ কেজি</td>
        <td class="text-center">মার্কিন ডলার</td>
        <td class="text-right font-bold" style="color:#1e3a8a; font-size:11px;">$৫,১৬৯.০০</td>
      </tr>
    </tbody>
  </table>

  <!-- In Words & Freight Note -->
  <div class="words-box">
    <strong>কথায় (মার্কিন ডলার):</strong> পাঁচ হাজার একশত ঊনসত্তর ডলার মাত্র (জাহাজের সমুদ্র ফ্রেইট চার্জ ৯০০.০০ ডলার সহ) — CFR কামালাপুর, ঢাকা।<br>
    <span style="font-family:'Inter'; font-size:9.5px; color:#047857;"><strong>IN WORDS (USD):</strong> FIVE THOUSAND ONE HUNDRED SIXTY NINE ONLY (INCLUDING OCEAN FREIGHT USD 900.00) CFR.</span>
  </div>

  <!-- Certification & Terms -->
  <table class="terms-table">
    <tr>
      <!-- Certification -->
      <td width="48%" class="terms-cell">
        <div class="terms-title">স্থায়িত্বকাল সংক্রান্ত ঘোষণা (Certification)</div>
        আমরা এতদ্বারা প্রত্যয়ন করিতেছি যে, মোটর যানবাহনের ব্যবহৃত পার্টস ও যন্ত্রাংশের অর্থনৈতিক স্থায়িত্বকাল শিপমেন্টের তারিখ হইতে <strong>০২ (দুই) বছরের বেশি</strong> এবং গিয়ারবক্সসহ সেকেন্ড হ্যান্ড ইঞ্জিনের অর্থনৈতিক স্থায়িত্বকাল <strong>১০ (দশ) বছরের বেশি</strong> সক্রিয় ও ব্যবহারযোগ্য থাকিবে।
      </td>

      <!-- Terms & Bank Details -->
      <td width="52%" class="terms-cell">
        <div class="terms-title">এল/সি শর্তাবলি ও ব্যাংক হিসাব বিবরণ (L/C & Bank Info)</div>
        <strong>ব্যাংক:</strong> মাশরেক ব্যাংক পিএসসি (শেখ জায়েদ রোড শাখা), দুবাই, ইউএই।<br>
        <strong>হিসাব নং:</strong> <span style="font-family:'Inter'; font-weight:700;">019100277588</span> &nbsp;|&nbsp; <strong>সুইফট:</strong> <span style="font-family:'Inter'; font-weight:700;">BOMLAEAD</span><br>
        <strong>আইবান (IBAN):</strong> <span style="font-family:'Inter'; font-weight:700;">AE020330000019100277588</span><br>
        <strong>পরিশোধ:</strong> ১৪ দিনের অপ্রত্যাহারযোগ্য ও নিঃশর্ত এল/সি (L/C 14 Days at Sight)।<br>
        <strong>শিপমেন্ট ও শর্ত:</strong> এল/সি প্রাপ্তির ১২০ দিনের মধ্যে শিপমেন্ট | আংশিক শিপমেন্ট গ্রহণযোগ্য | পরিমাণ ও মূল্যে ১০% কম-বেশি (±10% Variance) গ্রহণযোগ্য।
      </td>
    </tr>
  </table>

  <!-- Signatures -->
  <table class="signatures-table">
    <tr>
      <td class="sign-box">
        <div class="sign-line">
          রপ্তানিকারকের অনুমোদিত স্বাক্ষর ও সিল<br>
          <span style="font-size:8.5px; color:#64748b;">(For ARAB JAPAN USED CARS & SPARE PARTS CO. L.L.C.)</span>
        </div>
      </td>
      <td class="sign-box">
        <div class="sign-line">
          আমদানিকারকের স্বাক্ষর ও সিল<br>
          <span style="font-size:8.5px; color:#64748b;">(For ARIYAN MOTOR WORKSHOP)</span>
        </div>
      </td>
    </tr>
  </table>

</div>

</body>
</html>
"""

    html_path = r"e:\maa-motors-erp\ARIYAN_104_PI_Bengali.html"
    with open(html_path, "w", encoding="utf-8") as f:
        f.write(html_content)
    print(f"Created HTML template at {html_path}")

    # Generate PDF via Chrome headless
    pdf_out1 = r"e:\maa-motors-erp\ARIYAN-104 PI.pdf"
    pdf_out2 = r"e:\maa-motors-erp\ARIYAN-104_PI_Bangla_A4.pdf"
    chrome_exe = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
    
    cmd = [
        chrome_exe,
        "--headless",
        "--disable-gpu",
        "--no-margins",
        "--run-all-compositor-stages-before-draw",
        f"--print-to-pdf={pdf_out1}",
        html_path
    ]
    
    print("Running Chrome headless to print PDF...")
    res = subprocess.run(cmd, capture_output=True, text=True)
    print("Chrome return code:", res.returncode)

    import shutil
    shutil.copy2(pdf_out1, pdf_out2)

    for pdf_out in [pdf_out1, pdf_out2]:
        if os.path.exists(pdf_out):
            doc = pymupdf.open(pdf_out)
            page_count = len(doc)
            size_kb = os.path.getsize(pdf_out) / 1024
            print(f"PDF Successfully Generated! Path: {pdf_out}, Pages: {page_count}, Size: {size_kb:.1f} KB")
        return page_count, pdf_out
    else:
        print("Error: PDF was not generated.")
        return 0, None

if __name__ == "__main__":
    build_bengali_pi_html()
