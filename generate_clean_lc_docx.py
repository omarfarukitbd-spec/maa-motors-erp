import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, hex_color):
    shading_elm = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
    cell._tc.get_or_add_tcPr().append(shading_elm)

def set_cell_margins(cell, top=100, bottom=100, left=120, right=120):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def create_document():
    doc = Document()

    # Set page margins (0.5 inch)
    for section in doc.sections:
        section.top_margin = Inches(0.5)
        section.bottom_margin = Inches(0.5)
        section.left_margin = Inches(0.5)
        section.right_margin = Inches(0.5)
        section.page_width = Inches(8.5)
        section.page_height = Inches(11.0)

    # 1. Clean Bengali Header (No English Bloat)
    p_header = doc.add_paragraph()
    p_header.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_header.paragraph_format.space_before = Pt(0)
    p_header.paragraph_format.space_after = Pt(2)
    run_org = p_header.add_run("মেসার্স মা মোটরস")
    run_org.font.name = "Nirmala UI"
    run_org.font.size = Pt(18)
    run_org.font.bold = True
    run_org.font.color.rgb = RGBColor(15, 23, 42)

    # Clean Bengali Title
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(0)
    p_title.paragraph_format.space_after = Pt(2)
    run_title = p_title.add_run("কন্টেইনার এলসি ও ব্যাংক খরচ রেজিস্টার")
    run_title.font.name = "Nirmala UI"
    run_title.font.size = Pt(14)
    run_title.font.bold = True
    run_title.font.color.rgb = RGBColor(3, 105, 161)

    # Subtitle
    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_before = Pt(0)
    p_sub.paragraph_format.space_after = Pt(6)
    run_sub = p_sub.add_run("১ম কনসোলমেন্ট কন্টেইনার এলসি মার্জিন ও ব্যাংক পেমেন্ট বুক | খাতা পাতা: ০০০৩ | সময়কাল: ২১/১০/২০২৫ হইতে ০৯/১১/২০২৬ পর্যন্ত")
    run_sub.font.name = "Nirmala UI"
    run_sub.font.size = Pt(9.5)
    run_sub.font.bold = True
    run_sub.font.color.rgb = RGBColor(100, 116, 139)

    # 2. Top 3 KPI Cards
    kpi_table = doc.add_table(rows=1, cols=3)
    kpi_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    kpi_table.autofit = False

    kpi_data = [
        ("১. মোট কন্টেইনার সংখ্যা", "৯ টি কন্টেইনার", "১ নং হতে ৯ নং কন্টেইনার এলসি", "0284c7"),
        ("২. প্রধান বেনিফিশিয়ারি / কোম্পানি", "আরিয়ান মোটর ও আরমান", "ব্যাংক এলসি ওপেনিং ও ক্লিয়ারেন্স", "0d9488"),
        ("৩. সর্বমোট এলসি মার্জিন ও ব্যাংক খরচ", "$ 41,880 ডলার  |  ৳ 60,20,400 টাকা", "১ হতে ৯ নং কন্টেইনার সর্বসাকুল্যে এলসি ব্যয়", "b91c1c")
    ]

    for col_idx, (t_no, main_val, sub_val, hex_c) in enumerate(kpi_data):
        cell = kpi_table.cell(0, col_idx)
        set_cell_background(cell, "f8fafc")
        set_cell_margins(cell, 80, 80, 100, 100)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(0)
        
        r1 = p.add_run(f"{t_no}\n")
        r1.font.name = "Nirmala UI"
        r1.font.size = Pt(8.5)
        r1.font.bold = True
        r1.font.color.rgb = RGBColor(100, 116, 139)

        r2 = p.add_run(f"{main_val}\n")
        r2.font.name = "Nirmala UI"
        r2.font.size = Pt(11)
        r2.font.bold = True
        rv, gv, bv = int(hex_c[:2], 16), int(hex_c[2:4], 16), int(hex_c[4:], 16)
        r2.font.color.rgb = RGBColor(rv, gv, bv)

        r3 = p.add_run(sub_val)
        r3.font.name = "Nirmala UI"
        r3.font.size = Pt(8)
        r3.font.color.rgb = RGBColor(71, 85, 105)

    doc.add_paragraph().paragraph_format.space_after = Pt(4)

    # 3. Main Table with Delivery Date (খালি ঘর রাখা হয়েছে ডেলিভারি তারিখের জন্য)
    headers = [
        "নং",
        "তারিখ",
        "কন্টেইনার নং ও এলসি নং",
        "কোম্পানি / বেনিফিশিয়ারি",
        "ডলার ($ USD)",
        "টাকা (BDT)",
        "ডেলিভারি তারিখ (Delivery Date)"
    ]
    col_widths = [Inches(0.4), Inches(0.9), Inches(1.5), Inches(1.8), Inches(1.1), Inches(1.2), Inches(1.6)]

    # Notice: Column 6 is empty/clean for Delivery Date as requested!
    table_data = [
        ("১", "২১/১০/২০২৫\n৩১/১০/২০২৫", "১ নং কন্টেইনার\n(এলসি নং: 10541)", "আরিয়ান মো: ওয়ার্কশপ\n(ক্যাশ এলসি পেমেন্ট আরিয়ান)", "$ 4,530", "৳ 3,65,550", ""),
        ("২", "৩০/১০/২০২৫\n০৪/১১/২০২৫", "২ নং কন্টেইনার\n(এলসি নং: 10602)", "আরিয়ান মো: ওয়ার্কশপ\n(এলসি পেমেন্ট আরিয়ান)", "$ 4,620", "৳ 5,64,000", ""),
        ("৩", "১৭/১১/২০২৫\n১৮/১২/২০২৫", "৩ নং কন্টেইনার\n(এলসি নং: 10641)", "আরিয়ান মো: ওয়ার্কশপ\n(আরিয়ান এলসি পেমেন্ট আরমান)", "$ 6,110", "৳ 7,60,000", ""),
        ("৪", "১৯/১২/২০২৫\n২৬/০১/২০২৬", "৪ নং কন্টেইনার\n(এলসি নং: 10701)", "আরিয়ান মো: ওয়ার্কশপ\n(সম্পূর্ণ হিসাব মার্টিনের সাথে কথা হয়েছে)", "$ 5,725", "৳ 9,00,000", ""),
        ("৫", "২২/০১/২০২৬\n০৩/০৩/২০২৬", "৫ নং কন্টেইনার\n(এলসি নং: 10646)", "আরিয়ান মোটর\n(এলসি ক্লিয়ারেন্স ও সেটেলমেন্ট)", "$ 5,780", "৳ 7,00,000", ""),
        ("৬", "২৩/০৬/২০২৬\n০৩/০৭/২০২৬", "৬ নং কন্টেইনার\n(এলসি নং: 10354)", "আরিয়ান মোট: ওয়ার্কশপ\n(কন্টেইনার ৬ এলসি ও চার্জ)", "$ 5,141", "৳ 6,20,000", ""),
        ("৭", "১৫/০৮/২০২৬\n০৫/০৯/২০২৬", "৭ নং কন্টেইনার\n(এলসি নং: 10395)", "আরিয়ান মোটর ওয়ার্কশপ\n(কন্টেইনার ৭ এলসি ও চার্জ)", "$ 4,805", "৳ 7,10,850", ""),
        ("৮", "০১/১০/২০২৬", "৮ নং কন্টেইনার\n(এলসি নং: 10476)", "আরিয়ান মোটর ওয়ার্ক", "$ 5,169", "৳ 6,00,000", ""),
        ("৯", "০৯/১১/২০২৬", "৯ নং কন্টেইনার\n(এলসি নং: 10542)", "আরিয়ান মোটর (N)\nমারফত / মাধ্যম: এমরান", "—", "৳ 8,00,000", "")
    ]

    main_table = doc.add_table(rows=1, cols=7)
    main_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    main_table.autofit = False

    # Header Row
    hdr_cells = main_table.rows[0].cells
    for i, title in enumerate(headers):
        hdr_cells[i].text = title
        set_cell_background(hdr_cells[i], "0f172a")
        set_cell_margins(hdr_cells[i], 100, 100, 70, 70)
        p = hdr_cells[i].paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        for r in p.runs:
            r.font.name = "Nirmala UI"
            r.font.size = Pt(8.5)
            r.font.bold = True
            r.font.color.rgb = RGBColor(255, 255, 255)

    # Data Rows
    for row_idx, r_data in enumerate(table_data):
        row = main_table.add_row()
        cells = row.cells
        bg_col = "ffffff" if row_idx % 2 == 0 else "f8fafc"
        for c_idx, val in enumerate(r_data):
            cell = cells[c_idx]
            cell.text = val
            set_cell_background(cell, bg_col)
            set_cell_margins(cell, 70, 70, 70, 70)
            p = cell.paragraphs[0]
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)
            p.paragraph_format.line_spacing = 1.15

            if c_idx in (0, 1, 2, 6):
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            elif c_idx in (4, 5):
                p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
            else:
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT

            for r in p.runs:
                r.font.name = "Nirmala UI"
                r.font.size = Pt(8.5)
                if c_idx == 5:
                    r.font.bold = True
                    r.font.color.rgb = RGBColor(185, 28, 28)
                elif c_idx == 4:
                    r.font.bold = True
                    r.font.color.rgb = RGBColor(13, 148, 136)
                elif c_idx == 0:
                    r.font.bold = True
                    r.font.color.rgb = RGBColor(3, 105, 161)
                else:
                    r.font.color.rgb = RGBColor(30, 41, 59)

    # Grand Total Row
    tot_row = main_table.add_row()
    c0 = tot_row.cells[0]
    c0.merge(tot_row.cells[1])
    c0.merge(tot_row.cells[2])
    c0.merge(tot_row.cells[3])
    c0.text = "সর্বমোট কন্টেইনার এলসি ও ব্যাংক খরচ (১ হতে ৯ নং):"
    set_cell_background(c0, "0f172a")
    set_cell_margins(c0, 90, 90, 80, 80)
    p0 = c0.paragraphs[0]
    p0.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    for r in p0.runs:
        r.font.name = "Nirmala UI"
        r.font.size = Pt(9)
        r.font.bold = True
        r.font.color.rgb = RGBColor(255, 255, 255)

    c_usd = tot_row.cells[4]
    c_usd.text = "$ 41,880"
    set_cell_background(c_usd, "0f172a")
    set_cell_margins(c_usd, 90, 90, 80, 80)
    p_usd = c_usd.paragraphs[0]
    p_usd.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    for r in p_usd.runs:
        r.font.name = "Nirmala UI"
        r.font.size = Pt(9.5)
        r.font.bold = True
        r.font.color.rgb = RGBColor(45, 212, 191)

    c_bdt = tot_row.cells[5]
    c_bdt.text = "৳ 60,20,400"
    set_cell_background(c_bdt, "0f172a")
    set_cell_margins(c_bdt, 90, 90, 80, 80)
    p_bdt = c_bdt.paragraphs[0]
    p_bdt.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    for r in p_bdt.runs:
        r.font.name = "Nirmala UI"
        r.font.size = Pt(10)
        r.font.bold = True
        r.font.color.rgb = RGBColor(248, 113, 113)

    c_status = tot_row.cells[6]
    c_status.text = "সর্বমোট চূড়ান্ত"
    set_cell_background(c_status, "0f172a")
    set_cell_margins(c_status, 90, 90, 80, 80)
    p_st = c_status.paragraphs[0]
    p_st.alignment = WD_ALIGN_PARAGRAPH.CENTER
    for r in p_st.runs:
        r.font.name = "Nirmala UI"
        r.font.size = Pt(9)
        r.font.bold = True
        r.font.color.rgb = RGBColor(255, 255, 255)

    for row in main_table.rows:
        for idx, width in enumerate(col_widths):
            if idx < len(row.cells):
                row.cells[idx].width = width

    # 4. In Words
    p_words = doc.add_paragraph()
    p_words.paragraph_format.space_before = Pt(6)
    p_words.paragraph_format.space_after = Pt(4)
    r_w1 = p_words.add_run("কথায়: ")
    r_w1.font.name = "Nirmala UI"
    r_w1.font.size = Pt(9.5)
    r_w1.font.bold = True
    r_w1.font.color.rgb = RGBColor(15, 23, 42)

    r_w2 = p_words.add_run("ষাট লাখ বিশ হাজার চারশত টাকা মাত্র (বৈদেশিক মুদ্রা: একচল্লিশ হাজার আটশত আশি ইউএস ডলার)।")
    r_w2.font.name = "Nirmala UI"
    r_w2.font.size = Pt(9.5)
    r_w2.font.bold = True
    r_w2.font.color.rgb = RGBColor(185, 28, 28)

    # 5. Four Corporate Signatures Table
    sig_table = doc.add_table(rows=1, cols=4)
    sig_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    sig_table.autofit = False

    sig_data = [
        "____________________\nপ্রস্তুতকারক (হিসাব বিভাগ)",
        "____________________\nএলসি নিরীক্ষক (ব্যাংক ইনচার্জ)",
        "____________________\nপার্টনার অনুমোদন",
        "____________________\nমোহাম্মদ এমরান (স্বত্বাধিকারী)"
    ]

    for idx, text in enumerate(sig_data):
        cell = sig_table.cell(0, idx)
        set_cell_background(cell, "ffffff")
        set_cell_margins(cell, 150, 50, 50, 50)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.text = text
        for r in p.runs:
            r.font.name = "Nirmala UI"
            r.font.size = Pt(8.5)
            r.font.bold = True
            r.font.color.rgb = RGBColor(71, 85, 105)

    for cell in sig_table.rows[0].cells:
        cell.width = Inches(1.85)

    # Save to locations
    paths = [
        r"E:\Android\Porject\Class 1\Audio File\banjonborno\কন্টেইনার_এলসি_হিসাব_রেজিস্টার_০০০৩.docx",
        r"E:\maa-motors-erp\কন্টেইনার_এলসি_হিসাব_রেজিস্টার_০০০৩.docx",
        r"C:\Users\Joni-pc\.gemini\antigravity\brain\ccbee499-099f-4002-9392-9cf4dfc0d527\কন্টেইনার_এলসি_হিসাব_রেজিস্টার_০০০৩.docx"
    ]

    for p in paths:
        try:
            doc.save(p)
            print("Saved:", p)
        except Exception as e:
            print(f"Error saving to {p}: {e}")
            alt_p = p.replace(".docx", "_সংশোধিত.docx")
            try:
                doc.save(alt_p)
                print("Saved alternative:", alt_p)
            except Exception as e2:
                print(f"Error saving alternative {alt_p}: {e2}")

if __name__ == "__main__":
    create_document()
