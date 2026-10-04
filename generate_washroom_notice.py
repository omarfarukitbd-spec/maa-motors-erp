import os
import subprocess
import pymupdf

def build_washroom_notice_html():
    html_content = """<!DOCTYPE html>
<html lang="bn">
<head>
<meta charset="UTF-8">
<title>ওয়াশরুম নোটিশ — A4 Landscape</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@500;600;700;800&family=Inter:wght@600;700;800;900&display=swap');

  @page {
    size: A4 landscape;
    margin: 0;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    width: 297mm;
    height: 210mm;
    margin: 0;
    padding: 8mm;
    font-family: 'Hind Siliguri', 'Inter', sans-serif;
    background: #0f172a;
    color: #0f172a;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .sign-container {
    width: 100%;
    height: 100%;
    background: #ffffff;
    border: 6px solid #1e3a8a;
    border-radius: 18px;
    padding: 7mm 12mm;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: inset 0 0 0 3px #cbd5e1, 0 10px 30px rgba(0,0,0,0.15);
    position: relative;
    overflow: hidden;
  }

  /* Top Accent Color Bar */
  .sign-container::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 10px;
    background: linear-gradient(90deg, #dc2626 0%, #dc2626 48%, #cbd5e1 48%, #cbd5e1 52%, #059669 52%, #059669 100%);
  }

  /* Header Section */
  .header-box {
    text-align: center;
    padding-top: 1mm;
    padding-bottom: 3.5mm;
    border-bottom: 2px dashed #cbd5e1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
  }

  .notice-badge {
    background: linear-gradient(135deg, #dc2626, #b91c1c);
    color: #ffffff;
    font-weight: 800;
    font-size: 26px;
    padding: 5px 28px;
    border-radius: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.35);
    display: inline-flex;
    align-items: center;
    gap: 12px;
  }

  .notice-sub {
    font-size: 22px;
    font-weight: 700;
    color: #1e3a8a;
    letter-spacing: 0.5px;
  }

  /* Main Action Cards (Two Column Grid) */
  .cards-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8mm;
    margin: 4mm 0;
    flex: 1;
    align-items: stretch;
  }

  /* Card 1: Prohibition (Red) */
  .card-prohibit {
    background: #fff5f5;
    border: 4px solid #dc2626;
    border-radius: 18px;
    padding: 6mm 8mm;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    box-shadow: 0 8px 20px rgba(220, 38, 38, 0.12);
    position: relative;
  }

  .card-action {
    background: #f0fdf4;
    border: 4px solid #059669;
    border-radius: 18px;
    padding: 6mm 8mm;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    box-shadow: 0 8px 20px rgba(5, 150, 105, 0.12);
    position: relative;
  }

  .icon-wrap-red {
    width: 95px;
    height: 95px;
    border-radius: 50%;
    background: #fee2e2;
    border: 4px solid #dc2626;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 12px;
    box-shadow: 0 4px 10px rgba(220, 38, 38, 0.2);
  }

  .icon-wrap-green {
    width: 95px;
    height: 95px;
    border-radius: 50%;
    background: #d1fae5;
    border: 4px solid #059669;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 12px;
    box-shadow: 0 4px 10px rgba(5, 150, 105, 0.2);
  }

  .card-prohibit h2 {
    color: #991b1b;
    font-size: 33px;
    font-weight: 800;
    line-height: 1.25;
    margin-bottom: 5px;
  }

  .card-prohibit .eng-title {
    color: #b91c1c;
    font-size: 15px;
    font-weight: 800;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    margin-bottom: 12px;
  }

  .card-prohibit .instruction {
    color: #7f1d1d;
    font-size: 17px;
    font-weight: 700;
    background: #fee2e2;
    padding: 7px 18px;
    border-radius: 8px;
    border: 1.5px dashed #ef4444;
  }

  .card-action h2 {
    color: #065f46;
    font-size: 33px;
    font-weight: 800;
    line-height: 1.25;
    margin-bottom: 5px;
  }

  .card-action .eng-title {
    color: #047857;
    font-size: 15px;
    font-weight: 800;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    margin-bottom: 12px;
  }

  .card-action .instruction {
    color: #064e3b;
    font-size: 17px;
    font-weight: 700;
    background: #d1fae5;
    padding: 7px 18px;
    border-radius: 8px;
    border: 1.5px dashed #10b981;
  }

  /* Slogan / Courtesy Bar */
  .slogan-bar {
    background: #f8fafc;
    border: 2px solid #cbd5e1;
    border-radius: 10px;
    padding: 3mm 8mm;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    font-size: 17px;
    font-weight: 700;
    color: #334155;
    margin-bottom: 2mm;
  }

  .slogan-highlight {
    color: #047857;
    font-weight: 800;
  }

  /* Footer Section */
  .footer-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 2.5mm;
    border-top: 2px solid #e2e8f0;
  }

  .footer-left {
    font-size: 15px;
    font-weight: 700;
    color: #475569;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .footer-right {
    background: linear-gradient(135deg, #1e3a8a, #0f172a);
    color: #ffffff;
    font-size: 19px;
    font-weight: 800;
    padding: 6px 26px;
    border-radius: 30px;
    box-shadow: 0 4px 12px rgba(30, 58, 138, 0.3);
    letter-spacing: 0.5px;
  }
</style>
</head>
<body>

<div class="sign-container">

  <!-- Header -->
  <div class="header-box">
    <div class="notice-badge">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>
      জরুরি নোটিশ / NOTICE
    </div>
    <div class="notice-sub">ওয়াশরুম পরিচ্ছন্নতা নির্দেশিকা</div>
  </div>

  <!-- Cards Grid -->
  <div class="cards-grid">
    
    <!-- Left Card: Prohibition -->
    <div class="card-prohibit">
      <div class="icon-wrap-red">
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
          <!-- Prohibition circle and diagonal slash -->
          <circle cx="12" cy="12" r="10" stroke-width="2.4"></circle>
          <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" stroke-width="2.4"></line>
          <!-- Shoe Outline Inside -->
          <path d="M6.5 15.5c1-1.5 2.5-2 5-2 1.5 0 3 .5 4.5 1.5l1.5.5c.5.2.8.7.8 1.2v.3c0 .6-.4 1-.9 1H6.5a1 1 0 0 1-1-1v-.3c0-.6.4-1.1 1-1.2z"></path>
        </svg>
      </div>
      <h2>বাইরের জুতা পরে<br>প্রবেশ সম্পূর্ণ নিষেধ</h2>
      <div class="eng-title">NO OUTSIDE SHOES ALLOWED</div>
      <div class="instruction">
        অনুগ্রহ করে আপনার জুতা বাইরে জুতার র্যাকে রাখুন
      </div>
    </div>

    <!-- Right Card: Permitted Action -->
    <div class="card-action">
      <div class="icon-wrap-green">
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
          <!-- Flip-flop / Bathroom Slipper Shape -->
          <path d="M7 5c0-1.8 1.8-3 4-3s4 1.2 4 3v11c0 2.8-1.8 4-4 4s-4-1.2-4-4V5z" stroke-width="2.2"></path>
          <!-- Strap Y-shape -->
          <path d="M8.5 9c1 1.8 2.5 2.5 2.5 2.5s1.5-.7 2.5-2.5" stroke-width="2.2"></path>
          <line x1="11" y1="11.5" x2="11" y2="13.5" stroke-width="2.2"></line>
          <!-- Prominent Checkmark -->
          <path d="M15 17l2.5 2.5L22 15" stroke="#047857" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path>
        </svg>
      </div>
      <h2>ওয়াশরুমের নির্ধারিত<br>স্যান্ডেল ব্যবহার করুন</h2>
      <div class="eng-title">PLEASE USE INSIDE SLIPPERS</div>
      <div class="instruction">
        ভিতরে রক্ষিত পরিষ্কার স্যান্ডেল পরিধান করুন
      </div>
    </div>

  </div>

  <!-- Courtesy / Hygiene Slogan -->
  <div class="slogan-bar">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#047857" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
      <path d="M9 12l2 2 4-4"></path>
    </svg>
    <span>
      <span class="slogan-highlight">পরিচ্ছন্নতা ঈমানের অঙ্গ</span> — আপনার ব্যবহৃত ওয়াশরুমটি পরিষ্কার ও পরিচ্ছন্ন রাখা আপনার নাগরিক দায়িত্ব।
    </span>
  </div>

  <!-- Footer -->
  <div class="footer-box">
    <div class="footer-left">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </svg>
      MAA MOTORS OFFICE MANAGEMENT
    </div>
    <div class="footer-right">
      আদেশক্রমে: কর্তৃপক্ষ
    </div>
  </div>

</div>

</body>
</html>
"""
    html_file = r"e:\maa-motors-erp\washroom_notice.html"
    with open(html_file, "w", encoding="utf-8") as f:
        f.write(html_content)
    print(f"Updated HTML file: {html_file}")

    # Export to PDF via Chrome headless
    pdf_file = r"e:\maa-motors-erp\Washroom_Notice_A4_Landscape.pdf"
    chrome_exe = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
    
    cmd = [
        chrome_exe,
        "--headless",
        "--disable-gpu",
        "--no-margins",
        "--run-all-compositor-stages-before-draw",
        f"--print-to-pdf={pdf_file}",
        html_file
    ]
    
    res = subprocess.run(cmd, capture_output=True, text=True)

    if os.path.exists(pdf_file):
        doc = pymupdf.open(pdf_file)
        pix = doc[0].get_pixmap(dpi=200)
        preview_file = r"e:\maa-motors-erp\washroom_notice_preview.png"
        pix.save(preview_file)
        print(f"Saved preview: {preview_file}")
        doc.close()
        return True
    return False

if __name__ == "__main__":
    build_washroom_notice_html()
