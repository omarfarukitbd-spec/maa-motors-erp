import os
import sys
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

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
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

    # Set page margins (0.5 inch for maximum space)
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(0.5)
        section.bottom_margin = Inches(0.5)
        section.left_margin = Inches(0.5)
        section.right_margin = Inches(0.5)
        section.page_width = Inches(8.5)
        section.page_height = Inches(11.0)

    # 1. Official Header
    p_header = doc.add_paragraph()
    p_header.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_header.paragraph_format.space_before = Pt(0)
    p_header.paragraph_format.space_after = Pt(2)
    run_org = p_header.add_run("মেসার্স মা মোটরস (M/S. MAA MOTORS)")
    run_org.font.name = "Nirmala UI"
    run_org.font.size = Pt(17)
    run_org.font.bold = True
    run_org.font.color.rgb = RGBColor(15, 23, 42)

    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_before = Pt(0)
    p_sub.paragraph_format.space_after = Pt(4)
    run_sub = p_sub.add_run("আমদানি ডকুমেন্টেশন, কন্টেইনার L/C মার্জিন ও ব্যাংক পেমেন্ট রেজিস্টার খাতা")
    run_sub.font.name = "Nirmala UI"
    run_sub.font.size = Pt(12)
    run_sub.font.bold = True
    run_sub.font.color.rgb = RGBColor(3, 105, 161)

    p_meta = doc.add_paragraph()
    p_meta.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_meta.paragraph_format.space_before = Pt(0)
    p_meta.paragraph_format.space_after = Pt(8)
    run_meta = p_meta.add_run("নথিবুক নং: ০২ | রেজিস্টার খাতা পাতা নং: ০০০৩ (পৃষ্ঠা ১ ও পৃষ্ঠা ২) | ১ হতে ৯ নং কন্টেইনার এল/সি হিসাব")
    run_meta.font.name = "Nirmala UI"
    run_meta.font.size = Pt(9.5)
    run_meta.font.bold = True
    run_meta.font.color.rgb = RGBColor(100, 116, 139)

    # 2. Executive Summary KPI Table
    kpi_table = doc.add_table(rows=2, cols=4)
    kpi_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    kpi_table.autofit = False

    kpi_data = [
        ("সর্বমোট কন্টেইনার এল/সি", "৯টি কন্টেইনার (১ হতে ৯ নং)", "0284c7"),
        ("বৈদেশিক মুদ্রা (USD $)", "$41,880 USD (১-৮ নং)", "0d9488"),
        ("সর্বমোট এল/সি খরচ (BDT)", "৳ ৬০,২০,৪০০ টাকা", "b91c1c"),
        ("গড় এল/সি খরচ / কন্টেইনার", "৳ ৬,৬৮,৯৩৩ টাকা", "4338ca")
    ]

    # Row 0: Labels, Row 1: Values
    for col_idx, (title, val, color_hex) in enumerate(kpi_data):
        c0 = kpi_table.cell(0, col_idx)
        c1 = kpi_table.cell(1, col_idx)
        set_cell_background(c0, "f1f5f9")
        set_cell_background(c1, "f8fafc")
        set_cell_margins(c0, 60, 40, 100, 100)
        set_cell_margins(c1, 40, 60, 100, 100)

        p0 = c0.paragraphs[0]
        p0.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p0.paragraph_format.space_before = Pt(0)
        p0.paragraph_format.space_after = Pt(0)
        r0 = p0.add_run(title)
        r0.font.name = "Nirmala UI"
        r0.font.size = Pt(8.5)
        r0.font.bold = True
        r0.font.color.rgb = RGBColor(71, 85, 105)

        p1 = c1.paragraphs[0]
        p1.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p1.paragraph_format.space_before = Pt(0)
        p1.paragraph_format.space_after = Pt(0)
        r1 = p1.add_run(val)
        r1.font.name = "Nirmala UI"
        r1.font.size = Pt(11)
        r1.font.bold = True
        # Parse hex color
        r_val = int(color_hex[:2], 16)
        g_val = int(color_hex[2:4], 16)
        b_val = int(color_hex[4:], 16)
        r1.font.color.rgb = RGBColor(r_val, g_val, b_val)

    doc.add_paragraph().paragraph_format.space_after = Pt(4)

    # 3. Main Data Table
    table_headers = [
        "নং",
        "তারিখ",
        "কোম্পানি / বেনিফিশিয়ারি বিবরণ",
        "এল/সি নং (L/C No)",
        "বৈদেশিক মুদ্রা (USD $)",
        "বাংলাদেশি টাকা (BDT TK)",
        "অফিসিয়াল স্ট্যাটাস / নোট"
    ]

    col_widths = [Inches(0.4), Inches(0.9), Inches(2.2), Inches(1.1), Inches(1.1), Inches(1.3), Inches(1.5)]

    # Detailed rows for both pages
    # Format: (is_header/type, no, date, company, lc_no, usd, bdt, note)
    rows_data = [
        ("SECTION", "পৃষ্ঠা নং ১: কন্টেইনার ১ হতে ৫ নং L/C হিসাব (নথিবুক ০২, পাতা ০০০৩)"),
        ("ROW", "১", "২১/১০/২০২৫\n৩১/১০/২০২৫", "আরিয়ান মো: ওয়ার্কশপ\n(ক্যাশ L/C পেমেন্ট আরিয়ান)", "10541\n—", "$4,530\n—", "৩,৫০,০০০\n১৫,৫৫০\nমোট: ৩,৬৫,৫৫০", "মালিক বেলাল হোসেন স্বাক্ষরিত (০৩/১১/২৫)\nমা মোটরস সিল মোহরকৃত"),
        ("ROW", "২", "৩০/১০/২০২৫\n০৪/১১/২০২৫", "আরিয়ান মো: ওয়ার্কশপ\n(L/C পেমেন্ট আরিয়ান)", "10602\n—", "$4,620\n—", "৫,৫০,০০০\n১৪,০০০\nমোট: ৫,৬৪,০০০", "মালিক স্বাক্ষরিত (০৪/১১/২৫)\nমা মোটরস সিল মোহরকৃত"),
        ("ROW", "৩", "১৭/১১/২০২৫\n১৮/১২/২০২৫", "আরিয়ান মো: ওয়ার্কশপ\n(আরিয়ান L/C পেমেন্ট আরমান)", "10641\n—", "$6,110\n(+)", "৭,৫০,০০০\n১০,০০০\nমোট: ৭,৬০,০০০", "হলুদ হাইলাইট: আরিয়ান LC ১৫,০০০ টাকা আরমান\nমালিক স্বাক্ষরিত (১৮/১২/২৫)"),
        ("ROW", "৪", "১৯/১২/২০২৫\n২৬/০১/২০২৬", "আরিয়ান মো: ওয়ার্কশপ\n(সম্পূর্ণ হিসাব L/C মার্টিনের সাথে কথা হয়েছে)", "10701\n—", "$5,725\n—", "৯,০০,০০০\n(Paid 26/1/26)", "সম্পূর্ণ পরিশোধিত (Paid 26/01/26)\nমালিক স্বাক্ষরিত ১৯/১২/২৫ ও ২৬/১/২৬"),
        ("ROW", "৫", "২২/০১/২০২৬\n০৩/০৩/২০২৬", "আরিয়ান মোটর\n(L/C ক্লিয়ারেন্স ও সেটেলমেন্ট)", "10646\n—", "$5,780\n—", "৭,০০,০০০\n(Paid 3/3/26)", "সম্পূর্ণ পরিশোধিত (Paid 03/03/26)\nমালিক স্বাক্ষরিত ২২/১/২৬ ও ৩/৩/২৬"),
        ("CROSSED", "—", "—", "আলতাফ আরিয়ান মোটর\n(নোট: কেনা ছিল আরিয়ান — মূল খাতা হতে বাতিল)", "10191\n(বাতিল)", "$6,830\n(বাতিল)", "৮,০০,০০০\n(বাতিল)", "হস্তলিখিত খাতায় লাল কালিতে ক্রস (Crossed Out)\nহিসাবে অন্তর্ভুক্ত নহে"),
        ("SUBTOTAL_P1", "পৃষ্ঠা ১ উপ-মোট (কন্টেইনার ১ হতে ৫): $26,765 USD | ৳ ৩২,৮৯,৫৫০/- টাকা"),
        ("SECTION", "পৃষ্ঠা নং ২: কন্টেইনার ৬ হতে ৯ নং L/C হিসাব (নথিবুক ০২, পাতা ০০০৩)"),
        ("BF", "পূর্বের পাতা ১ হতে জের/ব্যালেন্স আনয়ন (B/F): ৩২,৮৯,৫৫০/- টাকা (Place বক্সে প্রদর্শিত)"),
        ("ROW", "৬", "২৩/০৬/২০২৬\n০৩/০৭/২০২৬", "আরিয়ান মোট: ওয়ার্কশপ\n(কন্টেইনার ৬ L/C ও চার্জ)", "10354\n—", "$5,141\n—", "৬,০০,০০০\n২০,০০০\nমোট: ৬,২০,০০০", "বেলাল হোসাইন মালিক স্বাক্ষরিত (০৩/০৭/২৬)\nমা মোটরস সিল মোহরকৃত"),
        ("ROW", "৭", "১৫/০৮/২০২৬\n০৫/০৯/২০২৬", "আরিয়ান মোটর ওয়ার্কশপ\n(কন্টেইনার ৭ L/C ও পেমেন্ট)", "10395\n—", "$4,805\n—", "৭,০০,০০০\n১০,৮৫০\nমোট: ৭,১০,৮৫০", "M/S. MAA MOTORS Proprietor সিল\nস্বাক্ষরিত ১৫/০৮/২৬ ও ০৫/০৯/২৬"),
        ("ROW", "৮", "০১/১০/২০২৬", "আরিয়ান মোটর ওয়ার্ক\n(কন্টেইনার ৮ L/C পেমেন্ট)", "10476", "$5,169", "৬,০০,০০০", "সার্কেল ৮ নং কন্টেইনার"),
        ("ROW", "৯", "০৯/১১/২০২৬", "আরিয়ান মোটর (N)\nমারফত / মাধ্যম: এমরান", "10542", "—", "৮,০০,০০০", "সার্কেল ৯ নং কন্টেইনার\nএমরান মারফত আরিয়ান মোটরকে প্রদান"),
        ("SUBTOTAL_P2", "পৃষ্ঠা ২ উপ-মোট (কন্টেইনার ৬ হতে ৯): $15,115 USD | ৳ ২৭,৩০,৮৫০/- টাকা"),
        ("GRAND_TOTAL", "সর্বমোট ৯টি কন্টেইনার L/C মার্জিন ও ব্যাংক পেমেন্ট: $41,880 USD | ৳ ৬০,২০,৪০০/- টাকা")
    ]

    table = doc.add_table(rows=1, cols=7)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False

    # Header Row
    hdr_cells = table.rows[0].cells
    for i, title in enumerate(table_headers):
        hdr_cells[i].text = title
        set_cell_background(hdr_cells[i], "0f172a")
        set_cell_margins(hdr_cells[i], 120, 120, 80, 80)
        p = hdr_cells[i].paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        for run in p.runs:
            run.font.name = "Nirmala UI"
            run.font.size = Pt(9)
            run.font.bold = True
            run.font.color.rgb = RGBColor(255, 255, 255)

    for item in rows_data:
        row_type = item[0]
        if row_type == "SECTION":
            row = table.add_row()
            cell = row.cells[0]
            # Merge all 7 cells
            for c in row.cells[1:]:
                cell.merge(c)
            set_cell_background(cell, "0284c7")
            set_cell_margins(cell, 80, 80, 100, 100)
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            r = p.add_run(item[1])
            r.font.name = "Nirmala UI"
            r.font.size = Pt(9.5)
            r.font.bold = True
            r.font.color.rgb = RGBColor(255, 255, 255)

        elif row_type in ("SUBTOTAL_P1", "SUBTOTAL_P2", "BF"):
            row = table.add_row()
            cell = row.cells[0]
            for c in row.cells[1:]:
                cell.merge(c)
            bg = "fef3c7" if row_type == "BF" else "e0e7ff"
            text_color = RGBColor(180, 83, 9) if row_type == "BF" else RGBColor(30, 58, 138)
            set_cell_background(cell, bg)
            set_cell_margins(cell, 80, 80, 100, 100)
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
            r = p.add_run(item[1])
            r.font.name = "Nirmala UI"
            r.font.size = Pt(9.5)
            r.font.bold = True
            r.font.color.rgb = text_color

        elif row_type == "GRAND_TOTAL":
            row = table.add_row()
            cell = row.cells[0]
            for c in row.cells[1:]:
                cell.merge(c)
            set_cell_background(cell, "b91c1c")
            set_cell_margins(cell, 120, 120, 100, 100)
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            r = p.add_run(item[1])
            r.font.name = "Nirmala UI"
            r.font.size = Pt(11)
            r.font.bold = True
            r.font.color.rgb = RGBColor(255, 255, 255)

        elif row_type in ("ROW", "CROSSED"):
            _, no, date, comp, lc_no, usd, bdt, note = item
            row = table.add_row()
            cells = row.cells
            is_crossed = (row_type == "CROSSED")

            bg_color = "fff1f2" if is_crossed else ("ffffff" if int(no) % 2 == 1 else "f8fafc")

            for c_idx, val in enumerate([no, date, comp, lc_no, usd, bdt, note]):
                cell = cells[c_idx]
                set_cell_background(cell, bg_color)
                set_cell_margins(cell, 80, 80, 80, 80)
                cell.text = val
                p = cell.paragraphs[0]
                p.paragraph_format.space_before = Pt(0)
                p.paragraph_format.space_after = Pt(0)
                p.paragraph_format.line_spacing = 1.15

                # Alignments
                if c_idx in (0, 1, 3):
                    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                elif c_idx in (4, 5):
                    p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
                else:
                    p.alignment = WD_ALIGN_PARAGRAPH.LEFT

                for r in p.runs:
                    r.font.name = "Nirmala UI"
                    r.font.size = Pt(8.5)
                    if is_crossed:
                        r.font.strike = True
                        r.font.color.rgb = RGBColor(156, 163, 175)
                    else:
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

    # Set column widths
    for row in table.rows:
        for idx, width in enumerate(col_widths):
            if idx < len(row.cells):
                row.cells[idx].width = width

    doc.add_paragraph().paragraph_format.space_after = Pt(8)

    # 4. Master 4-Tier Project CapEx Table
    p_capex_title = doc.add_paragraph()
    p_capex_title.paragraph_format.space_before = Pt(6)
    p_capex_title.paragraph_format.space_after = Pt(2)
    r_ct = p_capex_title.add_run("★ মেসার্স মা মোটরস — ১ম কনসোলমেন্টের ৪-স্তরের সমন্বিত প্রকল্প পুঁজী (Master 4-Tier CapEx)")
    r_ct.font.name = "Nirmala UI"
    r_ct.font.size = Pt(11.5)
    r_ct.font.bold = True
    r_ct.font.color.rgb = RGBColor(15, 23, 42)

    capex_table = doc.add_table(rows=6, cols=5)
    capex_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    capex_table.autofit = False

    c_headers = ["স্তর", "ব্যয় খাত / রেজিস্টার বই", "উৎস নথি ও রেফারেন্স", "টাকার অঙ্ক (BDT)", "অনুপাত (%)"]
    c_widths = [Inches(0.6), Inches(2.6), Inches(1.8), Inches(1.5), Inches(1.0)]

    for i, title in enumerate(c_headers):
        cell = capex_table.cell(0, i)
        cell.text = title
        set_cell_background(cell, "1e293b")
        set_cell_margins(cell, 80, 80, 80, 80)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        for r in p.runs:
            r.font.name = "Nirmala UI"
            r.font.size = Pt(8.5)
            r.font.bold = True
            r.font.color.rgb = RGBColor(255, 255, 255)

    capex_rows = [
        ("স্তর ১", "দুবাই এফওবি পার্টস ক্রয় ও বৈদেশিক রেমিট্যান্স", "খাতা পাতা: ০০০১ (৬৯,০৭,৩১৯ AED)", "৳ ২৩,৬৪,৩৭,৪৫৯", "৭২.৬৪%"),
        ("স্তর ২", "কন্টেইনার L/C মার্জিন ও ব্যাংক পেমেন্ট বুক", "খাতা পাতা: ০০০৩ ($41,880 USD)", "৳ ৬০,২০,৪০০", "১.৮৫%"),
        ("স্তর ৩", "কন্টেইনার কাস্টমস ডিউটি ও পোর্ট বিল রেজিস্টার", "খাতা পাতা: ০০০৪ (৭টি কন্টেইনার)", "৳ ২,৫১,৫০,৭১৩", "৭.৭৩%"),
        ("স্তর ৪", "বাংলাদেশ ল্যান্ডেড খরচ, লোকাল ক্রয় ও গোডাউন/কেরিং", "খাতা পাতা: ০০০২ (১৯ কিস্তি + সাবেক)", "৳ ৫,৭৮,৯৪,০৫২", "১৭.৭৮%"),
        ("মোট", "সর্বমোট ১ম কনসোলমেন্ট মেগা পুঁজী (Grand CapEx)", "৪টি রেজিস্টার বই সমন্বিত", "৳ ৩২,৫৫,০২,৬২৪", "১০০.০০%")
    ]

    for r_idx, row_data in enumerate(capex_rows):
        is_total = (r_idx == len(capex_rows) - 1)
        bg = "0f172a" if is_total else ("ffffff" if r_idx % 2 == 0 else "f8fafc")
        for c_idx, val in enumerate(row_data):
            cell = capex_table.cell(r_idx + 1, c_idx)
            cell.text = val
            set_cell_background(cell, bg)
            set_cell_margins(cell, 70, 70, 80, 80)
            p = cell.paragraphs[0]
            if c_idx in (0, 4):
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            elif c_idx == 3:
                p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
            else:
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            for r in p.runs:
                r.font.name = "Nirmala UI"
                r.font.size = Pt(9 if not is_total else 10)
                r.font.bold = is_total or (c_idx == 3)
                if is_total:
                    r.font.color.rgb = RGBColor(255, 255, 255)
                else:
                    r.font.color.rgb = RGBColor(185, 28, 28) if c_idx == 3 else RGBColor(30, 41, 59)

    for row in capex_table.rows:
        for idx, width in enumerate(c_widths):
            if idx < len(row.cells):
                row.cells[idx].width = width

    doc.add_paragraph().paragraph_format.space_after = Pt(8)

    # 5. User Review & Correction Instruction Box
    p_rev = doc.add_paragraph()
    p_rev.paragraph_format.space_before = Pt(6)
    p_rev.paragraph_format.space_after = Pt(4)
    r_rev = p_rev.add_run("✍️ সম্মানিত ব্যবহারকারীর জন্য নির্দেশনা ও রিভিউ নোট (User Correction Area):")
    r_rev.font.name = "Nirmala UI"
    r_rev.font.size = Pt(10.5)
    r_rev.font.bold = True
    r_rev.font.color.rgb = RGBColor(180, 83, 9)

    p_notes = doc.add_paragraph()
    p_notes.paragraph_format.space_before = Pt(0)
    p_notes.paragraph_format.space_after = Pt(4)
    run_notes_text = (
        "১. কন্টেইনার নং ৪-এর টাকার অঙ্কটি মূল খাতায় ৯,০০,০০০/- এবং USD $5,725। আপনার হস্তলিখিত যোগফল ৩২,৮৯,৫৫০/- এর সাথে এটি শতভাগ মিলেছে। অনুগ্রহ করে যাচাই করুন।\n"
        "২. আলতাফ আরিয়ান মোটর (L/C 10191, $6830, ৮,০০,০০০/-) মূল খাতায় লাল কালিতে কাটা ছিল, তাই এটিকে মূল যোগফলের বাইরে রাখা হয়েছে।\n"
        "৩. কন্টেইনার নং ৯-এর এল/সি ১০৫৪২-তে কোনো ইউএসডি লেখা নেই, টাকার অঙ্ক ৮,০০,০০০/- টাকা। যদি কোনো ইউএসডি থাকে তবে তা সংশোধন করে দিন।\n"
        "৪. কোনো তারিখ, এল/সি নম্বর, ডলার বা টাকার অঙ্কে সংশোধন প্রয়োজন হলে এই ফাইলে সরাসরি এডিট করে সেভ করতে পারেন অথবা চ্যাটে জানালেই সিস্টেমে চূড়ান্তভাবে যুক্ত করা হবে।"
    )
    r_nt = p_notes.add_run(run_notes_text)
    r_nt.font.name = "Nirmala UI"
    r_nt.font.size = Pt(8.5)
    r_nt.font.color.rgb = RGBColor(71, 85, 105)

    # 6. Corporate Signature Signoff
    p_sig = doc.add_paragraph()
    p_sig.paragraph_format.space_before = Pt(20)
    p_sig.paragraph_format.space_after = Pt(0)
    p_sig.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_sig = p_sig.add_run(
        "প্রস্তুতকারক: মা মোটরস অডিট সেল          |          নিরীক্ষক: সিএন্ডএফ অ্যাকাউন্টস          |          অনুমোদনকারী: স্বত্বাধিকারী / মালিক"
    )
    r_sig.font.name = "Nirmala UI"
    r_sig.font.size = Pt(8.5)
    r_sig.font.color.rgb = RGBColor(148, 163, 184)

    # Save to primary location
    out_dir_1 = r"E:\Android\Porject\Class 1\Audio File\banjonborno"
    file_name = "কন্টেইনার_এলসি_হিসাব_রেজিস্টার_০০০৩.docx"
    path_1 = os.path.join(out_dir_1, file_name)

    # Save to secondary workspace location
    out_dir_2 = r"E:\maa-motors-erp"
    path_2 = os.path.join(out_dir_2, file_name)

    saved_paths = []

    try:
        doc.save(path_1)
        saved_paths.append(path_1)
        print(f"Saved successfully: {path_1}")
    except Exception as e:
        print(f"Error saving to path 1: {e}")
        alt_path_1 = os.path.join(out_dir_1, "কন্টেইনার_এলসি_হিসাব_রেজিস্টার_০০০৩_সংশোধিত.docx")
        try:
            doc.save(alt_path_1)
            saved_paths.append(alt_path_1)
            print(f"Saved to alternative path: {alt_path_1}")
        except Exception as e2:
            print(f"Error saving to alternative path 1: {e2}")

    try:
        doc.save(path_2)
        saved_paths.append(path_2)
        print(f"Saved successfully: {path_2}")
    except Exception as e:
        print(f"Error saving to path 2: {e}")
        alt_path_2 = os.path.join(out_dir_2, "কন্টেইনার_এলসি_হিসাব_রেজিস্টার_০০০৩_সংশোধিত.docx")
        try:
            doc.save(alt_path_2)
            saved_paths.append(alt_path_2)
            print(f"Saved to alternative path: {alt_path_2}")
        except Exception as e2:
            print(f"Error saving to alternative path 2: {e2}")

    # Also save to artifacts folder for user download
    artifact_dir = r"C:\Users\Joni-pc\.gemini\antigravity\brain\ccbee499-099f-4002-9392-9cf4dfc0d527"
    path_art = os.path.join(artifact_dir, file_name)
    try:
        doc.save(path_art)
        saved_paths.append(path_art)
        print(f"Saved to artifact folder: {path_art}")
    except Exception as e:
        print(f"Error saving to artifact folder: {e}")

    return saved_paths

if __name__ == "__main__":
    paths = create_document()
    print("Done generating DOCX. Files:", paths)
