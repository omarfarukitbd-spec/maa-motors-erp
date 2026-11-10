import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=80, bottom=80, left=100, right=100):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'''
        <w:tcMar {nsdecls("w")}>
            <w:top w:w="{top}" w:type="dxa"/>
            <w:bottom w:w="{bottom}" w:type="dxa"/>
            <w:left w:w="{left}" w:type="dxa"/>
            <w:right w:w="{right}" w:type="dxa"/>
        </w:tcMar>
    ''')
    tcPr.append(tcMar)

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

def create_bd_expense_document():
    target_dir = r"E:\Android\Porject\Class 1\Audio File\banjonborno"
    os.makedirs(target_dir, exist_ok=True)
    out_path = os.path.join(target_dir, "বাংলাদেশ_খরচ_১ম_কনসোলমেন্ট_অফিসিয়াল_বুক.docx")
    
    doc = Document()

    # Page Margins (A4 Portrait)
    for section in doc.sections:
        section.top_margin = Inches(0.4)
        section.bottom_margin = Inches(0.4)
        section.left_margin = Inches(0.45)
        section.right_margin = Inches(0.45)

    # 1. Header Banner
    p_comp = doc.add_paragraph()
    p_comp.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_comp.paragraph_format.space_before = Pt(0)
    p_comp.paragraph_format.space_after = Pt(1)
    r_comp = p_comp.add_run("মেসার্স মা মোটরস (M/S. MAA-MOTOR'S)")
    r_comp.font.name = "Arial"
    r_comp.font.size = Pt(15)
    r_comp.font.bold = True
    r_comp.font.color.rgb = RGBColor(2, 132, 199)

    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(0)
    p_title.paragraph_format.space_after = Pt(1)
    r_title = p_title.add_run("বাংলাদেশ খরচ, মাল ক্রয়, গোডাউন খরচ ও চালানি কেরিং রেজিস্টার")
    r_title.font.size = Pt(12)
    r_title.font.bold = True
    r_title.font.color.rgb = RGBColor(15, 23, 42)

    p_meta = doc.add_paragraph()
    p_meta.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_meta.paragraph_format.space_before = Pt(0)
    p_meta.paragraph_format.space_after = Pt(6)
    r_meta = p_meta.add_run("এমরান ব্যক্তিগত ১ম কনসোলমেন্ট | রেজিস্টার খাতা পাতা: ০০০২ | সময়কাল: ০১/১১/২০২৫ হইতে ০৯/১১/২০২৬ পর্যন্ত")
    r_meta.font.size = Pt(9)
    r_meta.font.bold = True
    r_meta.font.color.rgb = RGBColor(71, 85, 105)

    # 2. Instruction Banner for User Review
    p_alert = doc.add_paragraph()
    p_alert.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p_alert.paragraph_format.space_before = Pt(2)
    p_alert.paragraph_format.space_after = Pt(6)
    r_al1 = p_alert.add_run("📌 নির্দেশনা (User Correction Guide): ")
    r_al1.font.bold = True
    r_al1.font.size = Pt(9.5)
    r_al1.font.color.rgb = RGBColor(180, 83, 9)
    r_al2 = p_alert.add_run(
        "হস্তলিখিত খাতা (পাতা নং ০০০২) থেকে প্রতিটি ডাটা হুবহু নিচে সাজানো হয়েছে। "
        "যদি কোনো বানান, মেমো নম্বর, তারিখ বা টাকার অঙ্কে ভুল বা অস্পষ্টতা থাকে, আপনি এই ওয়ার্ড ফাইলে সরাসরি এডিট/সংশোধন করে সংরক্ষণ করে দিন। "
        "বিশেষ করে লাল দাগে কাটা ২টি সারির স্ট্যাটাস যাচাই করে আপনার চূড়ান্ত সিদ্ধান্ত দিন।"
    )
    r_al2.font.size = Pt(9)
    r_al2.font.color.rgb = RGBColor(30, 41, 59)

    # 3. Master 3 KPI Summary Cards
    bf_amount = 30303773
    target_grand = 57894052
    running_subtotal = target_grand - bf_amount # 27,590,279

    kpi_table = doc.add_table(rows=1, cols=3)
    kpi_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    kpi_table.autofit = False

    kpis = [
        ("১. সাবেক ব্যালেন্স (B/F)", f"৳ {format_bd(bf_amount)}", "০১/১১/২০২৫ হতে ১৮/০৮/২০২৬ পূর্ববর্তী সেশন", "f0f9ff", RGBColor(2, 132, 199)),
        ("২. রানিং খাতার খরচ (১৮ কিস্তি)", f"৳ {format_bd(running_subtotal)}", "১৯/০৮/২০২৬ হতে ০৯/১১/২০২৬ চলমান খাতা", "f0fdf4", RGBColor(5, 150, 105)),
        ("৩. সর্বমোট বাংলাদেশ খরচ", f"৳ {format_bd(target_grand)}", "০১/১১/২০২৫ হতে ০৯/১১/২০২৬ সর্বসাকুল্যে মোট", "fffbeb", RGBColor(180, 83, 9)),
    ]

    for i, (title, main_val, sub_val, bg, color_rgb) in enumerate(kpis):
        cell = kpi_table.cell(0, i)
        cell.width = Inches(2.45)
        set_cell_background(cell, bg)
        set_cell_margins(cell, top=70, bottom=70, left=80, right=80)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(1)
        p.paragraph_format.space_after = Pt(1)

        r1 = p.add_run(title + "\n")
        r1.font.size = Pt(8.5)
        r1.font.bold = True
        r1.font.color.rgb = RGBColor(71, 85, 105)

        r2 = p.add_run(main_val + "\n")
        r2.font.size = Pt(11)
        r2.font.bold = True
        r2.font.color.rgb = color_rgb

        r3 = p.add_run(sub_val)
        r3.font.size = Pt(7.5)
        r3.font.color.rgb = RGBColor(100, 116, 139)

    doc.add_paragraph().paragraph_format.space_after = Pt(4)

    # 4. Detailed Data Table
    # Rows: 1 header + 1 B/F + 19 ledger rows + 1 subtotal + 1 grand total
    table_data = [
        # (নং, তারিখ, বিবরণ / বিক্রেতা / মারফত, খরচের ক্যাটাগরি, মেমো নং, টাকা BDT, স্ট্যাটাস/মন্তব্য, is_crossed, is_special)
        ("০", "০১/১১/২৫ - ১৮/০৮/২৬", "B/F (পূর্ববর্তী স্থানান্তরিত কিউমুলেটিভ ব্যালেন্স)", "প্রারম্ভিক ব্যালেন্স", "—", 30303773, "সাবেক ব্যালেন্স শুরু", False, True),
        ("১", "১৯/০৮/২০২৬", "আলতাফ চালানী ৬ নং", "চালানি কেরিং", "চালান-৬", 1223000, "চূড়ান্ত পরিশোধিত", False, False),
        ("২", "১৯/০৮/২০২৬", "আলতাফ চালানী ৫ নং", "চালানি কেরিং", "চালান-৫", 510000, "চূড়ান্ত পরিশোধিত", False, False),
        ("৩", "২১/০৮/২০২৬", "নুরুন নাহার মোটর মাল ক্রয় (ইঞ্জিন ১০ পিস)", "স্থানীয় মাল ক্রয়", "—", 2500000, "চূড়ান্ত পরিশোধিত", False, False),
        ("৪", "৩০/০৮/২০২৬", "আগস্ট মাস গোডাউন খরচ", "গোডাউন খরচ", "—", 55650, "চূড়ান্ত পরিশোধিত (৫৫,৬৫০)", False, False),
        ("৫", "০৭/০৯/২০২৬", "সাদেক ২নং কনটেইনার খরচ", "কন্টেইনার খরচ", "২নং কন্টেইনার", 1092252, "চূড়ান্ত পরিশোধিত", False, False),
        ("৬", "১৬/০৯/২০২৬", "সুমাইয়া মোটর হতে মাল ক্রয়", "স্থানীয় মাল ক্রয়", "—", 2548800, "চূড়ান্ত পরিশোধিত", False, False),
        ("৭", "২৯/০৯/২০২৬", "রফিকুল অটো উত্তরা হতে মাল ক্রয়", "স্থানীয় মাল ক্রয়", "—", 1102000, "চূড়ান্ত পরিশোধিত", False, False),
        ("৮", "৩০/০৯/২০২৬", "সেপ্টেম্বর মাস গোডাউন খরচ", "গোডাউন খরচ", "—", 197391, "চূড়ান্ত পরিশোধিত", False, False),
        ("৯", "০৪/১০/২০২৬", "আলতাফ চালানী কেরিং ৭ নং", "চালানি কেরিং", "কেরিং-৭", 797500, "চূড়ান্ত পরিশোধিত", False, False),
        ("১০", "০৪/১০/২০২৬", "আরমান হতে মাল ক্রয় (Voxy সাসপেনশন)", "স্থানীয় মাল ক্রয়", "Voxy", 560000, "চূড়ান্ত পরিশোধিত", False, False),
        ("১১", "১৪/১০/২০২৬", "জাবেদ হতে মাল ক্রয়", "স্থানীয় মাল ক্রয়", "—", 18000, "চূড়ান্ত পরিশোধিত", False, False),
        ("১২", "১৪/১০/২০২৬", "ওবনি হতে মাল ক্রয়", "স্থানীয় মাল ক্রয়", "—", 28000, "চূড়ান্ত পরিশোধিত", False, False),
        ("—", "১৪/১০/২০২৬", "মা মোটর দোকান হতে ABS ক্রয়", "অভ্যন্তরীণ সমন্বয়", "ABS", 75000, "⚠️ খাতায় লাল দাগে কাটা (বাদ)", True, False),
        ("১৩", "১৯/১০/২০২৬", "মা মোটর দোকান হতে মাল ক্রয়", "স্থানীয় মাল ক্রয়", "—", 1350000, "চূড়ান্ত পরিশোধিত", False, False),
        ("১৪", "৩০/১০/২০২৬", "অক্টোবর মাস গোডাউন খরচ", "গোডাউন খরচ", "—", 673687, "চূড়ান্ত পরিশোধিত (৬,৭৩,৬৮৭)", False, False),
        ("১৫", "৩১/১০/২০২৬", "এমরান (চট্টগ্রাম) মা মোটর চালান কেরিং", "চালানি কেরিং", "চালান কেরিং", 418900, "চূড়ান্ত পরিশোধিত", False, False),
        ("১৬", "০৫/১১/২০২৬", "আরমান হতে মাল ক্রয় (মেমো-১২৭৫)", "স্থানীয় মাল ক্রয়", "১২৭৫", 1790000, "চূড়ান্ত পরিশোধিত", False, False),
        ("১৭", "০৫/১১/২০২৬", "আরমান হতে মাল ক্রয় (মেমো-১০৭৪)", "স্থানীয় মাল ক্রয়", "১০৭৪", 7050000, "চূড়ান্ত পরিশোধিত", False, False),
        ("১৮", "০৫/১১/২০২৬", "আরমান হতে মাল ক্রয় (মেমো-২৬৭)", "স্থানীয় মাল ক্রয়", "২৬৭", 2600000, "চূড়ান্ত পরিশোধিত", False, False),
        ("—", "০৭/০৭/২০২৫", "৭ নং কন্টেইনার ডুবাই পাঠাইছে", "দুবাই সমন্বয়", "৭নং কন্টেইনার", 2883470, "⚠️ খাতায় লাল দাগে 'বাদ যাবে'", True, False),
    ]

    table = doc.add_table(rows=len(table_data) + 3, cols=7)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False

    col_widths = [Inches(0.4), Inches(1.1), Inches(2.2), Inches(1.1), Inches(0.7), Inches(1.15), Inches(0.95)]
    headers = ["নং", "তারিখ", "বিবরণ / বিক্রেতা / মারফত", "ক্যাটাগরি", "মেমো", "টাকা (BDT)", "স্ট্যাটাস"]

    # Header Row
    hdr_cells = table.rows[0].cells
    for i, h_text in enumerate(headers):
        hdr_cells[i].width = col_widths[i]
        set_cell_background(hdr_cells[i], "1e293b")
        set_cell_margins(hdr_cells[i], top=70, bottom=70, left=60, right=60)
        p = hdr_cells[i].paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.RIGHT if i == 5 else (WD_ALIGN_PARAGRAPH.CENTER if i in [0, 1, 4, 6] else WD_ALIGN_PARAGRAPH.LEFT)
        r = p.add_run(h_text)
        r.font.bold = True
        r.font.size = Pt(8.5)
        r.font.color.rgb = RGBColor(255, 255, 255)

    # Data Rows
    for row_idx, data_tuple in enumerate(table_data):
        row_cells = table.rows[row_idx + 1].cells
        num_str, dt_str, desc_str, cat_str, memo_str, amt_val, status_str, is_crossed, is_special = data_tuple

        # Zebra background or special highlight
        if is_special:
            bg_hex = "f0f9ff" # Sky blue for B/F
        elif is_crossed:
            bg_hex = "fef2f2" # Light red for crossed rows
        elif row_idx % 2 == 1:
            bg_hex = "f8fafc"
        else:
            bg_hex = "ffffff"

        for c_idx in range(7):
            row_cells[c_idx].width = col_widths[c_idx]
            set_cell_background(row_cells[c_idx], bg_hex)
            set_cell_margins(row_cells[c_idx], top=55, bottom=55, left=60, right=60)
            p = row_cells[c_idx].paragraphs[0]
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)

            val_str = ""
            align = WD_ALIGN_PARAGRAPH.LEFT
            bold = False
            color = RGBColor(15, 23, 42)

            if c_idx == 0:
                val_str = num_str
                align = WD_ALIGN_PARAGRAPH.CENTER
                bold = True
                color = RGBColor(2, 132, 199) if is_special else (RGBColor(220, 38, 38) if is_crossed else RGBColor(100, 116, 139))
            elif c_idx == 1:
                val_str = dt_str
                align = WD_ALIGN_PARAGRAPH.CENTER
                color = RGBColor(51, 65, 85)
            elif c_idx == 2:
                val_str = desc_str
                align = WD_ALIGN_PARAGRAPH.LEFT
                bold = is_special or not is_crossed
                color = RGBColor(3, 105, 161) if is_special else (RGBColor(153, 27, 27) if is_crossed else RGBColor(15, 23, 42))
            elif c_idx == 3:
                val_str = cat_str
                align = WD_ALIGN_PARAGRAPH.LEFT
                color = RGBColor(71, 85, 105)
            elif c_idx == 4:
                val_str = memo_str
                align = WD_ALIGN_PARAGRAPH.CENTER
                color = RGBColor(100, 116, 139)
            elif c_idx == 5:
                val_str = f"৳ {format_bd(amt_val)}"
                align = WD_ALIGN_PARAGRAPH.RIGHT
                bold = True
                color = RGBColor(220, 38, 38) if not is_crossed else RGBColor(153, 27, 27)
            elif c_idx == 6:
                val_str = status_str
                align = WD_ALIGN_PARAGRAPH.CENTER
                color = RGBColor(2, 132, 199) if is_special else (RGBColor(220, 38, 38) if is_crossed else RGBColor(5, 150, 105))

            r = p.add_run(val_str)
            r.font.size = Pt(8)
            r.font.bold = bold
            r.font.color.rgb = color
            if is_crossed:
                r.font.strike = True

    # Footer Row 1: Subtotal of Running Rows
    sub_row_cells = table.rows[len(table_data) + 1].cells
    for c_idx in range(7):
        sub_row_cells[c_idx].width = col_widths[c_idx]
        set_cell_background(sub_row_cells[c_idx], "f8fafc")
        set_cell_margins(sub_row_cells[c_idx], top=65, bottom=65, left=60, right=60)
        p = sub_row_cells[c_idx].paragraphs[0]
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(0)

    # Merge cells for subtotal label
    p_sub = sub_row_cells[1].paragraphs[0]
    p_sub.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r_sub = p_sub.add_run("চলমান খাতার উপ-মোট (১৮টি রানিং খরচ — কাটা ২টি বাদে):")
    r_sub.font.bold = True
    r_sub.font.size = Pt(8.5)
    r_sub.font.color.rgb = RGBColor(51, 65, 85)

    p_sub_val = sub_row_cells[5].paragraphs[0]
    p_sub_val.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r_sub_val = p_sub_val.add_run(f"৳ {format_bd(running_subtotal)}")
    r_sub_val.font.bold = True
    r_sub_val.font.size = Pt(9)
    r_sub_val.font.color.rgb = RGBColor(220, 38, 38)

    p_sub_tag = sub_row_cells[6].paragraphs[0]
    p_sub_tag.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_sub_tag = p_sub_tag.add_run("উপ-মোট")
    r_sub_tag.font.size = Pt(8)
    r_sub_tag.font.bold = True
    r_sub_tag.font.color.rgb = RGBColor(71, 85, 105)

    # Footer Row 2: Grand Total
    grand_row_cells = table.rows[len(table_data) + 2].cells
    for c_idx in range(7):
        grand_row_cells[c_idx].width = col_widths[c_idx]
        set_cell_background(grand_row_cells[c_idx], "fffbeb")
        set_cell_margins(grand_row_cells[c_idx], top=75, bottom=75, left=60, right=60)
        p = grand_row_cells[c_idx].paragraphs[0]
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(0)

    p_gr = grand_row_cells[1].paragraphs[0]
    p_gr.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r_gr = p_gr.add_run("সর্বমোট বাংলাদেশ খরচ (B/F সাবেক + রানিং খাতা):")
    r_gr.font.bold = True
    r_gr.font.size = Pt(9.5)
    r_gr.font.color.rgb = RGBColor(180, 83, 9)

    p_gr_val = grand_row_cells[5].paragraphs[0]
    p_gr_val.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r_gr_val = p_gr_val.add_run(f"৳ {format_bd(target_grand)}")
    r_gr_val.font.bold = True
    r_gr_val.font.size = Pt(10)
    r_gr_val.font.color.rgb = RGBColor(185, 28, 28)

    p_gr_tag = grand_row_cells[6].paragraphs[0]
    p_gr_tag.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_gr_tag = p_gr_tag.add_run("সর্বমোট")
    r_gr_tag.font.size = Pt(8.5)
    r_gr_tag.font.bold = True
    r_gr_tag.font.color.rgb = RGBColor(180, 83, 9)

    doc.add_paragraph().paragraph_format.space_after = Pt(8)

    # 5. Combined Mega Summary Box: Consignment 1 CapEx
    dubai_total_bdt = 236437459
    mega_grand_bdt = dubai_total_bdt + target_grand

    comb_box = doc.add_table(rows=1, cols=3)
    comb_box.alignment = WD_TABLE_ALIGNMENT.CENTER
    comb_box.autofit = False

    comb_cells = [
        ("দুবাই পার্ট (পাতা ০০০১ রেমিট্যান্স)", "69,07,319 AED", f"৳ {format_bd(dubai_total_bdt)}", "f0f9ff", RGBColor(2, 132, 199)),
        ("বাংলাদেশ পার্ট (পাতা ০০০২ খরচ)", "১৮ কিস্তি + সাবেক", f"৳ {format_bd(target_grand)}", "fffbeb", RGBColor(180, 83, 9)),
        ("১ম কনসোলমেন্ট সর্বসাকুল্যে মোট বিনিয়োগ", "দুবাই + বাংলাদেশ", f"৳ {format_bd(mega_grand_bdt)}", "ecfdf5", RGBColor(4, 120, 87)),
    ]

    for i, (title, sub, val, bg, col) in enumerate(comb_cells):
        c = comb_box.cell(0, i)
        c.width = Inches(2.45)
        set_cell_background(c, bg)
        set_cell_margins(c, top=60, bottom=60, left=70, right=70)
        p = c.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(1)
        p.paragraph_format.space_after = Pt(1)

        r1 = p.add_run(title + "\n")
        r1.font.size = Pt(8)
        r1.font.bold = True
        r1.font.color.rgb = RGBColor(71, 85, 105)

        r2 = p.add_run(val + "\n")
        r2.font.size = Pt(10.5)
        r2.font.bold = True
        r2.font.color.rgb = col

        r3 = p.add_run(sub)
        r3.font.size = Pt(7)
        r3.font.color.rgb = RGBColor(100, 116, 139)

    doc.add_paragraph().paragraph_format.space_after = Pt(16)

    # 6. Four Signatures
    sig_table = doc.add_table(rows=1, cols=4)
    sig_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    sig_table.autofit = False

    sigs = [
        "প্রস্তুতকারক (হিসাব বিভাগ)",
        "অভ্যন্তরীণ নিরীক্ষক (অফিস ইনচার্জ)",
        "পার্টনার অনুমোদন",
        "মোহাম্মদ এমরান (স্বত্বাধিকারী)"
    ]

    for i, name in enumerate(sigs):
        cell = sig_table.cell(0, i)
        cell.width = Inches(1.85)
        set_cell_margins(cell, top=50, bottom=50, left=50, right=50)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(12)
        r = p.add_run("____________________\n" + name)
        r.font.size = Pt(8)
        r.font.bold = True
        r.font.color.rgb = RGBColor(71, 85, 105)

    doc.save(out_path)
    print(f"Successfully generated Word document at: {out_path}")

if __name__ == '__main__':
    create_bd_expense_document()
