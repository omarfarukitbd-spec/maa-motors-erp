import os
import subprocess
import pymupdf

def generate_exact_a4_pdf():
    base_dir = r"E:\maa-motors-erp"
    excel_path = os.path.join(base_dir, "ARIYAN-104 PI.xlsx")
    raw_pdf_path = os.path.join(base_dir, "temp_raw_export.pdf")
    final_pdf_path = os.path.join(base_dir, "ARIYAN-104 PI.pdf")
    
    if os.path.exists(raw_pdf_path):
        os.remove(raw_pdf_path)

    # PowerShell script to export Excel using exact PrintArea A1:L50 and 1-page fit
    ps_script = f'''
$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

$wb = $excel.Workbooks.Open("{excel_path}")
$ws = $wb.Sheets.Item(1)

$excel.PrintCommunication = $false
$ws.PageSetup.PaperSize = 9 # xlPaperA4
$ws.PageSetup.Orientation = 1 # xlPortrait
$ws.PageSetup.PrintArea = "`$A`$1:`$L`$50"
$ws.PageSetup.Zoom = $false
$ws.PageSetup.FitToPagesWide = 1
$ws.PageSetup.FitToPagesTall = 1
$ws.PageSetup.CenterHorizontally = $true
$ws.PageSetup.CenterVertically = $false
$ws.PageSetup.TopMargin = $excel.InchesToPoints(0.2)
$ws.PageSetup.BottomMargin = $excel.InchesToPoints(0.2)
$ws.PageSetup.LeftMargin = $excel.InchesToPoints(0.2)
$ws.PageSetup.RightMargin = $excel.InchesToPoints(0.2)
$excel.PrintCommunication = $true

$ws.ExportAsFixedFormat(0, "{raw_pdf_path}", 0, $true, $false, 1, 1, $false)

$wb.Close($false)
$excel.Quit()
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($ws) | Out-Null
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($wb) | Out-Null
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($excel) | Out-Null
'''
    
    ps_file = os.path.join(base_dir, "temp_export.ps1")
    with open(ps_file, "w", encoding="utf-8") as f:
        f.write(ps_script)

    print("Step 1: Exporting from Microsoft Excel COM...")
    res = subprocess.run(["powershell", "-ExecutionPolicy", "Bypass", "-File", ps_file], capture_output=True, text=True)
    if res.returncode != 0:
        print("Excel export error:", res.stderr)
        return False

    if not os.path.exists(raw_pdf_path):
        print("Error: raw_pdf_path not created")
        return False

    print("Step 2: Fitting into true ISO A4 portrait page with proportional margins...")
    src_doc = pymupdf.open(raw_pdf_path)
    
    # Standard ISO A4: 210mm x 297mm (595.28 x 841.89 points)
    a4_w = 595.28
    a4_h = 841.89

    # The exact border box in the raw export is:
    # left: ~62.64, top: ~17.76, right: ~548.40, bottom: ~712.78
    # We clip exactly to the document border
    clip_box = pymupdf.Rect(62.0, 17.0, 549.0, 713.5)

    # Margin on A4 page: 20 points
    margin = 20.0
    target_rect = pymupdf.Rect(margin, margin, a4_w - margin, a4_h - margin)

    a4_doc = pymupdf.open()
    a4_page = a4_doc.new_page(width=a4_w, height=a4_h)

    # Embed with vector fidelity and proportional scaling
    a4_page.show_pdf_page(target_rect, src_doc, 0, clip=clip_box, keep_proportion=True)

    a4_doc.save(final_pdf_path)
    a4_doc.close()
    src_doc.close()
    print(f"Successfully generated: {final_pdf_path}")

    # Validate output
    val_doc = pymupdf.open(final_pdf_path)
    print("Page Count:", len(val_doc))
    print("Page Size:", val_doc[0].rect)
    print(f"File Size: {os.path.getsize(final_pdf_path) / 1024:.1f} KB")
    val_doc.close()

    # Clean up temp files
    try:
        if os.path.exists(raw_pdf_path):
            os.remove(raw_pdf_path)
        if os.path.exists(ps_file):
            os.remove(ps_file)
    except Exception as e:
        print("Cleanup note:", e)

    return True

if __name__ == "__main__":
    generate_exact_a4_pdf()
