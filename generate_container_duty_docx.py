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

def create_container_duty_document():
    target_dir = r"E:\Android\Porject\Class 1\Audio File\banjonborno"
    os.makedirs(target_dir, exist_ok=True)
    out_path_1 = os.path.join(target_dir, "কন্টেইনার_ডিউটি_সিএন্ডএফ_পোর্ট_বিল_রেজিস্টার_০০০৪.docx")
    out_path_2 = os.path.join(r"E:\maa-motors-erp", "কন্টেইনার_ডিউটি_সিএন্ডএফ_পোর্ট_বিল_রেজিস্টার_০০০৪.docx")
    
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
    r_title = p_title.add_run("কন্টেইনার ডিউটি, সিএন্ডএফ (C&F), পোর্ট বিল ও শিপিং বিল রেজিস্টার")
    r_title.font.size = Pt(12)
    r_title.font.bold = True
    r_title.font.color.rgb = RGBColor(15, 23, 42)

    p_meta = doc.add_paragraph()
    p_meta.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_meta.paragraph_format.space_before = Pt(0)
    p_meta.paragraph_format.space_after = Pt(6)
    r_meta = p_meta.add_run("১ম কনসোলমেন্ট কন্টেইনার ক্লিয়ারেন্স ও খালাস রেজিস্টার | খাতা পাতা: ০০০৪ | সময়কাল: ১২/১১/২০২৫ হইতে ২১/১০/২০২৬ পর্যন্ত")
    r_meta.font.size = Pt(9)
    r_meta.font.bold = True
    r_meta.font.color.rgb = RGBColor(71, 85, 105)

    # 2. Instruction Banner for User Review
    p_alert = doc.add_paragraph()
    p_alert.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p_alert.paragraph_format.space_before = Pt(2)
    p_alert.paragraph_format.space_after = Pt(6)
    r_al1 = p_alert.add_run("📌 ব্যবহারকারীর সম্পাদনা ও সংশোধন নির্দেশিকা (User Correction Guide): ")
    r_al1.font.bold = True
    r_al1.font.size = Pt(9.5)
    r_al1.font.color.rgb = RGBColor(180, 83, 9)
    r_al2 = p_alert.add_run(
        "হস্তলিখিত খাতা (পাতা নং ০০০৪: কন্টেইনার ডিউটি/CSF/পোর্ট বিল/শিপিং বিল) থেকে ১ হতে ৭ নং কন্টেইনারের প্রতিটি এন্ট্রি নিচে সাজানো হয়েছে। "
        "যদি কোনো কন্টেইনারের সাইজ (২০ ফুট / ৪০ ফুট), সিএন্ডএফ এজেন্ট/মারফতের নাম (আরমান, মিতুল, আরিয়ান), তারিখ বা টাকার অঙ্কে ভুল বা অস্পষ্টতা থাকে, "
        "আপনি এই ওয়ার্ড ফাইলে সরাসরি টাইপ করে সংশোধন করে দিন। আপনার সংশোধিত ফাইলটি দিলেই আমরা ডাটাবেস ও সিস্টেমে লাইভ করে দেব।"
    )
    r_al2.font.size = Pt(9)
    r_al2.font.color.rgb = RGBColor(30, 41, 59)

    # 3. Master 3 KPI Summary Cards
    total_duty = 24900993 # 2,49,00,993 BDT
    twenty_ft_total = 3504526 # 4 no
    forty_ft_total = 3312401 + 4446607 # 6 no + 7 no = 77,59,008

    kpi_table = doc.add_table(rows=1, cols=3)
    kpi_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    kpi_table.autofit = False

    kpis = [
        ("১. মোট কন্টেইনার সংখ্যা", "৭ টি কন্টেইনার", "১ নং হতে ৭ নং কন্টেইনার খালাস", "f0f9ff", RGBColor(2, 132, 199)),
        ("২. প্রধান সিএন্ডএফ / মারফত", "আরমান ও মিতুল", "চট্টগ্রাম বন্দর ক্লিয়ারিং ও ফরওয়ার্ডিং", "f0fdf4", RGBColor(5, 150, 105)),
        ("৩. সর্বমোট কন্টেইনার ডিউটি ও পোর্ট বিল", f"৳ {format_bd(total_duty)}", "১ হতে ৭ নং কন্টেইনার সর্বসাকুল্যে খালাস ব্যয়", "fffbeb", RGBColor(180, 83, 9)),
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

    # 4. Detailed Data Table (7 Containers)
    # (নং, তারিখ, কন্টেইনার নং ও সাইজ, সিএন্ডএফ এজেন্ট / মারফত, বিবরণ / খাত, টাকা BDT, স্ট্যাটাস / মন্তব্য)
    table_data = [
        ("১", "১২/১১/২০২৫", "১ নং কন্টেইনার", "আরমান (আরিয়ান)", "কন্টেইনার ডিউটি, সিএন্ডএফ ও পোর্ট বিল", 3800000, "চূড়ান্ত পরিশোধিত (হলুদ হাইলাইট করা)"),
        ("২", "১৯/১২/২০২৫", "২ নং কন্টেইনার", "আরমান (আরিয়ান)", "কন্টেইনার ডিউটি, সিএন্ডএফ ও পোর্ট বিল", 3550000, "চূড়ান্ত পরিশোধিত"),
        ("৩", "১৮/০১/২০২৬", "৩ নং কন্টেইনার", "আরমান", "কন্টেইনার ডিউটি, সিএন্ডএফ ও পোর্ট বিল", 3500000, "চূড়ান্ত পরিশোধিত (১৮/১/২৫ বা ১৮/১/২৬)"),
        ("৪", "২৫/০১/২০২৬", "৪ নং কন্টেইনার (২০ ফুট)", "আরমান ও মিতুল", "কন্টেইনার ডিউটি, সিএন্ডএফ ও পোর্ট বিল", 3504526, "চূড়ান্ত পরিশোধিত (২০ ফুট)"),
        ("৫", "২৪/০২/২০২৬", "৫ নং কন্টেইনার", "আরমান ও মিতুল", "কন্টেইনার ডিউটি, সিএন্ডএফ ও পোর্ট বিল", 2787459, "চূড়ান্ত পরিশোধিত"),
        ("৬", "১৮/০৪/২০২৬", "৬ নং কন্টেইনার (৪০ ফুট)", "আরমান ও মিতুল", "কন্টেইনার ডিউটি, সিএন্ডএফ ও পোর্ট বিল", 3312401, "চূড়ান্ত পরিশোধিত (৪০ ফুট)"),
        ("৭", "২১/১০/২০২৬", "৭ নং কন্টেইনার (৪০ ফুট)", "আরমান ও মিতুল", "কন্টেইনার ডিউটি, সিএন্ডএফ ও পোর্ট বিল", 4446607, "চূড়ান্ত পরিশোধিত (৪০ ফুট)"),
    ]

    table = doc.add_table(rows=len(table_data) + 2, cols=7)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False

    col_widths = [Inches(0.4), Inches(1.05), Inches(1.5), Inches(1.35), Inches(1.55), Inches(1.2), Inches(0.9)]
    headers = ["নং", "তারিখ", "কন্টেইনার নং ও সাইজ", "এজেন্ট / মারফত", "বিল বিবরণ / খাত", "টাকা (BDT)", "স্ট্যাটাস"]

    # Header Row
    hdr_cells = table.rows[0].cells
    for i, h_text in enumerate(headers):
        hdr_cells[i].width = col_widths[i]
        set_cell_background(hdr_cells[i], "1e293b")
        set_cell_margins(hdr_cells[i], top=70, bottom=70, left=60, right=60)
        p = hdr_cells[i].paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.RIGHT if i == 5 else (WD_ALIGN_PARAGRAPH.CENTER if i in [0, 1, 6] else WD_ALIGN_PARAGRAPH.LEFT)
        r = p.add_run(h_text)
        r.font.bold = True
        r.font.size = Pt(8.5)
        r.font.color.rgb = RGBColor(255, 255, 255)

    # Data Rows
    for row_idx, data_tuple in enumerate(table_data):
        row_cells = table.rows[row_idx + 1].cells
        num_str, dt_str, cont_str, agent_str, desc_str, amt_val, status_str = data_tuple

        bg_hex = "f8fafc" if row_idx % 2 == 1 else "ffffff"
        if row_idx == 0:
            bg_hex = "fefce8" # subtle yellow tint matching highlighter in book

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
                color = RGBColor(2, 132, 199)
            elif c_idx == 1:
                val_str = dt_str
                align = WD_ALIGN_PARAGRAPH.CENTER
                color = RGBColor(51, 65, 85)
            elif c_idx == 2:
                val_str = cont_str
                bold = True
                color = RGBColor(3, 105, 161)
            elif c_idx == 3:
                val_str = agent_str
                color = RGBColor(71, 85, 105)
            elif c_idx == 4:
                val_str = desc_str
                color = RGBColor(51, 65, 85)
            elif c_idx == 5:
                val_str = f"৳ {format_bd(amt_val)}"
                align = WD_ALIGN_PARAGRAPH.RIGHT
                bold = True
                color = RGBColor(220, 38, 38)
            elif c_idx == 6:
                val_str = status_str
                align = WD_ALIGN_PARAGRAPH.CENTER
                color = RGBColor(5, 150, 105)

            r = p.add_run(val_str)
            r.font.size = Pt(8)
            r.font.bold = bold
            r.font.color.rgb = color

    # Grand Total Row
    grand_row_cells = table.rows[len(table_data) + 1].cells
    for c_idx in range(7):
        grand_row_cells[c_idx].width = col_widths[c_idx]
        set_cell_background(grand_row_cells[c_idx], "fffbeb")
        set_cell_margins(grand_row_cells[c_idx], top=75, bottom=75, left=60, right=60)
        p = grand_row_cells[c_idx].paragraphs[0]
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(0)

    p_gr = grand_row_cells[1].paragraphs[0]
    p_gr.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r_gr = p_gr.add_run("সর্বমোট কন্টেইনার ডিউটি ও পোর্ট বিল (১ হতে ৭ নং কন্টেইনার):")
    r_gr.font.bold = True
    r_gr.font.size = Pt(9.5)
    r_gr.font.color.rgb = RGBColor(180, 83, 9)

    p_gr_val = grand_row_cells[5].paragraphs[0]
    p_gr_val.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r_gr_val = p_gr_val.add_run(f"৳ {format_bd(total_duty)}")
    r_gr_val.font.bold = True
    r_gr_val.font.size = Pt(10.5)
    r_gr_val.font.color.rgb = RGBColor(185, 28, 28)

    p_gr_tag = grand_row_cells[6].paragraphs[0]
    p_gr_tag.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_gr_tag = p_gr_tag.add_run("সর্বমোট")
    r_gr_tag.font.size = Pt(8.5)
    r_gr_tag.font.bold = True
    r_gr_tag.font.color.rgb = RGBColor(180, 83, 9)

    doc.add_paragraph().paragraph_format.space_after = Pt(10)

    # 5. Words Representation & Integration Info Box
    p_words = doc.add_paragraph()
    p_words.paragraph_format.space_before = Pt(0)
    p_words.paragraph_format.space_after = Pt(6)
    r_w1 = p_words.add_run("কথায়: ")
    r_w1.font.bold = True
    r_w1.font.size = Pt(9)
    r_w2 = p_words.add_run("দুই কোটি ঊনপঞ্চাশ লাখ নয়শত তিরানব্বই টাকা মাত্র।")
    r_w2.font.bold = True
    r_w2.font.color.rgb = RGBColor(180, 83, 9)

    # 6. Four Signatures
    sig_table = doc.add_table(rows=1, cols=4)
    sig_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    sig_table.autofit = False

    sigs = [
        "প্রস্তুতকারক (হিসাব বিভাগ)",
        "সিএন্ডএফ নিরীক্ষক (পোর্ট ইনচার্জ)",
        "পার্টনার অনুমোদন",
        "মোহাম্মদ এমরান (স্বত্বাধিকারী)"
    ]

    for i, name in enumerate(sigs):
        cell = sig_table.cell(0, i)
        cell.width = Inches(1.85)
        set_cell_margins(cell, top=50, bottom=50, left=50, right=50)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(16)
        r = p.add_run("____________________\n" + name)
        r.font.size = Pt(8)
        r.font.bold = True
        r.font.color.rgb = RGBColor(71, 85, 105)

    doc.save(out_path_1)
    doc.save(out_path_2)
    print(f"Successfully generated Word documents at:\n1. {out_path_1}\n2. {out_path_2}")

if __name__ == '__main__':
    create_container_duty_document()
