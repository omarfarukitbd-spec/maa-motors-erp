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
  @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@500;600;700;800;900&family=Inter:wght@600;700;800;900&display=swap');

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
    padding: 7mm;
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
    border: 5px solid #1e3a8a;
    border-radius: 18px;
    padding: 6mm 10mm;
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
    height: 9px;
    background: linear-gradient(90deg, #dc2626 0%, #dc2626 48%, #cbd5e1 48%, #cbd5e1 52%, #059669 52%, #059669 100%);
  }

  /* Header Section: Hadith */
  .header-box {
    text-align: center;
    padding-top: 1mm;
    padding-bottom: 3mm;
    border-bottom: 2px dashed #cbd5e1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .hadith-banner {
    background: linear-gradient(135deg, #047857, #065f46);
    color: #ffffff;
    padding: 6px 36px;
    border-radius: 12px;
    display: inline-flex;
    align-items: center;
    gap: 14px;
    box-shadow: 0 4px 14px rgba(4, 120, 87, 0.25);
    border: 2px solid #a7f3d0;
  }

  .hadith-text {
    font-size: 27px;
    font-weight: 800;
    letter-spacing: 0.5px;
  }

  .hadith-source {
    background: #fef08a;
    color: #854d0e;
    font-size: 17px;
    font-weight: 800;
    padding: 2px 14px;
    border-radius: 20px;
    margin-left: 6px;
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
    border: 5px solid #dc2626;
    border-radius: 20px;
    padding: 6mm 8mm;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    box-shadow: 0 8px 24px rgba(220, 38, 38, 0.15);
  }

  .icon-wrap-red {
    width: 112px;
    height: 112px;
    border-radius: 50%;
    background: #fee2e2;
    border: 5px solid #dc2626;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 14px;
    box-shadow: 0 6px 16px rgba(220, 38, 38, 0.25);
  }

  .card-prohibit h2 {
    color: #991b1b;
    font-size: 45px;
    font-weight: 900;
    line-height: 1.18;
    margin-bottom: 8px;
    letter-spacing: -0.5px;
  }

  .card-prohibit .eng-title {
    color: #b91c1c;
    font-size: 18px;
    font-weight: 900;
    letter-spacing: 2px;
    text-transform: uppercase;
  }

  /* Card 2: Permitted Action (Green) */
  .card-action {
    background: #f0fdf4;
    border: 5px solid #059669;
    border-radius: 20px;
    padding: 6mm 8mm;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    box-shadow: 0 8px 24px rgba(5, 150, 105, 0.15);
  }

  .icon-wrap-green {
    width: 112px;
    height: 112px;
    border-radius: 50%;
    background: #d1fae5;
    border: 5px solid #059669;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 14px;
    box-shadow: 0 6px 16px rgba(5, 150, 105, 0.25);
  }

  .card-action h2 {
    color: #065f46;
    font-size: 45px;
    font-weight: 900;
    line-height: 1.18;
    margin-bottom: 8px;
    letter-spacing: -0.5px;
  }

  .card-action .eng-title {
    color: #047857;
    font-size: 18px;
    font-weight: 900;
    letter-spacing: 2px;
    text-transform: uppercase;
  }

  /* Bathroom Dua Bar */
  .dua-bar {
    background: #f8fafc;
    border: 2px solid #cbd5e1;
    border-left: 6px solid #1e3a8a;
    border-radius: 10px;
    padding: 3mm 6mm;
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 2mm;
  }

  .dua-badge {
    background: #1e3a8a;
    color: #ffffff;
    font-size: 16px;
    font-weight: 800;
    padding: 5px 16px;
    border-radius: 6px;
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .dua-content {
    flex: 1;
    font-size: 15px;
    line-height: 1.35;
    color: #1e293b;
  }

  .dua-arabic-bn {
    font-weight: 800;
    color: #0f172a;
    font-size: 16.5px;
  }

  .dua-meaning {
    color: #475569;
    font-size: 14px;
    font-weight: 600;
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
    padding: 5px 26px;
    border-radius: 30px;
    box-shadow: 0 4px 12px rgba(30, 58, 138, 0.3);
    letter-spacing: 0.5px;
  }
</style>
</head>
<body>

<div class="sign-container">

  <!-- Header: Hadith -->
  <div class="header-box">
    <div class="hadith-banner">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fef08a" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
      </svg>
      <span class="hadith-text">“পরিষ্কার পরিচ্ছন্নতা ঈমানের অঙ্গ”</span>
      <span class="hadith-source">আল-হাদীস</span>
    </div>
  </div>

  <!-- Cards Grid -->
  <div class="cards-grid">
    
    <!-- Left Card: Prohibition -->
    <div class="card-prohibit">
      <div class="icon-wrap-red">
        <svg width="74" height="74" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <!-- Prohibition circle and diagonal slash -->
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
          <!-- Shoe Outline Inside -->
          <path d="M6.5 15.5c1-1.5 2.5-2 5-2 1.5 0 3 .5 4.5 1.5l1.5.5c.5.2.8.7.8 1.2v.3c0 .6-.4 1-.9 1H6.5a1 1 0 0 1-1-1v-.3c0-.6.4-1.1 1-1.2z"></path>
        </svg>
      </div>
      <h2>বাইরের জুতা পরে<br>প্রবেশ নিষেধ</h2>
      <div class="eng-title">NO OUTSIDE SHOES ALLOWED</div>
    </div>

    <!-- Right Card: Permitted Action -->
    <div class="card-action">
      <div class="icon-wrap-green">
        <svg width="74" height="74" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <!-- Flip-flop / Bathroom Slipper Shape -->
          <path d="M7 5c0-1.8 1.8-3 4-3s4 1.2 4 3v11c0 2.8-1.8 4-4 4s-4-1.2-4-4V5z" stroke-width="2.2"></path>
          <!-- Strap Y-shape -->
          <path d="M8.5 9c1 1.8 2.5 2.5 2.5 2.5s1.5-.7 2.5-2.5" stroke-width="2.2"></path>
          <line x1="11" y1="11.5" x2="11" y2="13.5" stroke-width="2.2"></line>
          <!-- Prominent Checkmark -->
          <path d="M15 17l2.5 2.5L22 15" stroke="#047857" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path>
        </svg>
      </div>
      <h2>ভিতরের স্যান্ডেল<br>ব্যবহার করুন</h2>
      <div class="eng-title">PLEASE USE INSIDE SLIPPERS</div>
    </div>

  </div>

  <!-- Bathroom Dua Bar -->
  <div class="dua-bar">
    <div class="dua-badge">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
      </svg>
      বাথরুমে প্রবেশের দোয়া
    </div>
    <div class="dua-content">
      <div class="dua-arabic-bn">
        উচ্চারণ: “আল্লাহুম্মা ইন্নি আউজু বিকা মিনাল খুবুসি ওয়াল খাবায়িস।”
      </div>
      <div class="dua-meaning">
        অর্থ: “হে আল্লাহ! আমি আপনার নিকট অপবিত্র নর ও নারী শয়তান (জিন) হতে আশ্রয় প্রার্থনা করছি।”
      </div>
    </div>
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
