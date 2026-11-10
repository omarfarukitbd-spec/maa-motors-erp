import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=60, bottom=60, left=70, right=70):
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

def create_styled_document():
    base_dir = r"E:\maa-motors-erp"
    doc = Document()

    # Page Margins
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(0.3)
        section.bottom_margin = Inches(0.3)
        section.left_margin = Inches(0.4)
        section.right_margin = Inches(0.4)

    # 1. Header Banner
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(0)
    p_title.paragraph_format.space_after = Pt(1)
    run_title = p_title.add_run("মেসার্স মা মোটরস (M/S. MAA-MOTOR'S)")
    run_title.font.name = "Arial"
    run_title.font.size = Pt(15)
    run_title.font.bold = True
    run_title.font.color.rgb = RGBColor(2, 132, 199)

    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_before = Pt(0)
    p_sub.paragraph_format.space_after = Pt(1)
    run_sub = p_sub.add_run("ডুবাই টাকা পাঠানো এর হিসাব ও অফিসিয়াল রেমিট্যান্স মাস্টার বুক")
    run_sub.font.size = Pt(11)
    run_sub.font.bold = True
    run_sub.font.color.rgb = RGBColor(15, 23, 42)

    p_batch = doc.add_paragraph()
    p_batch.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_batch.paragraph_format.space_before = Pt(0)
    p_batch.paragraph_format.space_after = Pt(4)
    run_batch = p_batch.add_run("এমরান ব্যক্তিগত ১ম কনসোলমেন্ট, ডুবাই মাল ক্রয় ইনভেস্ট | স্ট্যাটাস: চলমান (Active) — সমাপ্তির পর ২য় কনসোলমেন্টে রোল-ওভার হবে")
    run_batch.font.size = Pt(8.5)
    run_batch.font.bold = True
    run_batch.font.color.rgb = RGBColor(71, 85, 105)

    # 2. Master 4 KPI Table
    p1_aed, p1_bdt, p1_rate = 4285350, 145802430, 34.02
    p2_aed, p2_bdt, p2_rate = 1692497, 58421109, 34.51
    p3_aed, p3_bdt, p3_rate = 929472, 32213920, 34.66
    grand_aed = p1_aed + p2_aed + p3_aed
    grand_bdt = p1_bdt + p2_bdt + p3_bdt
    grand_rate = grand_bdt / grand_aed

    kpi_table = doc.add_table(rows=1, cols=4)
    kpi_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    kpi_table.autofit = False

    kpis = [
        ("১. পর্যায় ১ (২০২৫ ইনভেস্ট)", f"{format_bd(p1_aed)} AED", f"৳ {format_bd(p1_bdt)} (রেট ৩৪.০২)", "f8fafc", "4f46e5"),
        ("২. পর্যায় ২ (২০২৬ সাবেক)", f"{format_bd(p2_aed)} AED", f"৳ {format_bd(p2_bdt)} (রেট ৩৪.৫১)", "f0f9ff", "0284c7"),
        ("৩. পর্যায় ৩ (রানিং খাতা ১৯ কিস্তি)", f"{format_bd(p3_aed)} AED", f"৳ {format_bd(p3_bdt)} (গড় ৩৪.৬৬)", "f0fdf4", "059669"),
        ("৪. ১ম কনসোলমেন্ট সর্বমোট তহবিল", f"{format_bd(grand_aed)} AED", f"৳ {format_bd(grand_bdt)} (গড় ৩৪.২৩)", "fffbeb", "b45309"),
    ]

    for i, (title, main_val, sub_val, bg, color_hex) in enumerate(kpis):
        cell = kpi_table.cell(0, i)
        cell.width = Inches(1.9)
        set_cell_background(cell, bg)
        set_cell_margins(cell, top=50, bottom=50, left=60, right=60)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(1)
        p.paragraph_format.space_after = Pt(1)

        r1 = p.add_run(title + "\n")
        r1.font.size = Pt(7.5)
        r1.font.bold = True
        r1.font.color.rgb = RGBColor(71, 85, 105)

        r2 = p.add_run(main_val + "\n")
        r2.font.size = Pt(8.5)
        r2.font.bold = True
        if color_hex == "4f46e5":
            r2.font.color.rgb = RGBColor(79, 70, 229)
        elif color_hex == "0284c7":
            r2.font.color.rgb = RGBColor(2, 132, 199)
        elif color_hex == "059669":
            r2.font.color.rgb = RGBColor(5, 150, 105)
        else:
            r2.font.color.rgb = RGBColor(180, 83, 9)

        r3 = p.add_run(sub_val)
        r3.font.size = Pt(7)
        r3.font.color.rgb = RGBColor(100, 116, 139)

    doc.add_paragraph().paragraph_format.space_after = Pt(2)

    # 3. Detailed Ledger Table
    raw_records = [
        ("০", "১৩/১০/২০২৬", "সাবেক (পূর্ববর্তী কিউমুলেটিভ ব্যালেন্স)", "৩৪.৫১", 1692497, 58421109, "সাবেক শুরু"),
        ("১", "১৪/১০/২০২৬", "মিনহাজ মারফত", "৩৪.৫০", 50000, 1725000, "পরিশোধিত"),
        ("২", "১৫/১০/২০২৬", "মিনহাজ মারফত", "৩৪.৫০", 50000, 1725000, "পরিশোধিত"),
        ("৩", "১৮/১০/২০২৬", "মিনহাজ মারফত", "৩৪.৫৫", 72400, 2501420, "পরিশোধিত"),
        ("৪", "২৫/১০/২০২৬", "মিনহাজ মারফত", "৩৪.৬০", 50000, 1730000, "পরিশোধিত"),
        ("৫", "২৫/১০/২০২৬", "আলতাফ মারফত", "৩৪.৫০", 30000, 1035000, "পরিশোধিত"),
        ("৬", "২৭/১০/২০২৬", "মিনহাজ মারফত", "৩৪.৬৫", 50000, 1732500, "পরিশোধিত"),
        ("৭", "২৭/১০/২০২৬", "নুরুল হক মারফত", "৩৪.৫০", 52000, 1794000, "পরিশোধিত"),
        ("৮", "২৭/১০/২০২৬", "মিনহাজ মারফত", "৩৪.৬০", 50000, 1730000, "পরিশোধিত"),
        ("৯", "০১/১১/২০২৬", "মিনহাজ মারফত", "৩৪.৭৫", 30000, 1042500, "পরিশোধিত"),
        ("১০", "০৩/১১/২০২৬", "নুরুল হক / সাইফুল", "৩৪.৬৫", 50000, 1732500, "পরিশোধিত"),
        ("১১", "০৩/১১/২০২৬", "হৃদয় মারফত", "৩৪.৪০", 15000, 516000, "পরিশোধিত"),
        ("১২", "০৩/১১/২০২৬", "মিনহাজ মারফত", "৩৪.৭৫", 80000, 2780000, "পরিশোধিত"),
        ("১৩", "০৪/১১/২০২৬", "একরাম / সোহেল", "৩৪.৭৫", 50000, 1737500, "পরিশোধিত"),
        ("১৪", "০৫/১১/২০২৬", "মিনহাজ মারফত", "৩৪.৮০", 50000, 1740000, "পরিশোধিত"),
        ("১৫", "০৫/১১/২০২৬", "একরাম / ফারুক", "৩৪.৭৫", 50000, 1737500, "পরিশোধিত"),
        ("১৬", "০৫/১১/২০২৬", "সাইফুল / নুরুল হক", "৩৪.৮০", 50000, 1740000, "পরিশোধিত"),
        ("১৭", "০৮/১১/২০২৬", "নুরুল হক / সাইফুল", "৩৪.৮০", 50000, 1740000, "পরিশোধিত"),
        ("১৮", "০৮/১১/২০২৬", "একরাম / সোহেল", "৩৪.৭০", 50072, 1737500, "পরিশোধিত"),
        ("১৯", "০৯/১১/২০২৬", "একরাম / সোহেল", "৩৪.৭৫", 50000, 1737500, "পরিশোধিত"),
    ]

    records = []
    for sl, dt, part, rate, aed_val, bdt_val, st in raw_records:
        records.append((sl, dt, part, rate, format_bd(aed_val), format_bd(bdt_val), st))

    col_widths = [Inches(0.35), Inches(0.95), Inches(2.1), Inches(0.75), Inches(1.15), Inches(1.4), Inches(0.75)]
    table = doc.add_table(rows=len(records) + 4, cols=7)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False

    headers = ["ক্র.নং", "তারিখ", "বিবরণ / মারফত (Particulars)", "রেট (Rate)", "দিরহাম (AED)", "বাংলাদেশি টাকা (TK)", "স্ট্যাটাস"]
    hdr_cells = table.rows[0].cells
    for i, h in enumerate(headers):
        hdr_cells[i].width = col_widths[i]
        set_cell_background(hdr_cells[i], "1e293b")
        set_cell_margins(hdr_cells[i], top=40, bottom=40, left=45, right=45)
        p = hdr_cells[i].paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER if i in [0, 1, 3, 6] else (WD_ALIGN_PARAGRAPH.RIGHT if i in [4, 5] else WD_ALIGN_PARAGRAPH.LEFT)
        r = p.add_run(h)
        r.font.size = Pt(8)
        r.font.bold = True
        r.font.color.rgb = RGBColor(255, 255, 255)

    # Data Rows
    for row_idx, r_data in enumerate(records):
        row_cells = table.rows[row_idx + 1].cells
        is_opening = (row_idx == 0)
        bg = "eff6ff" if is_opening else ("ffffff" if row_idx % 2 == 1 else "f8fafc")

        for col_idx, val in enumerate(r_data):
            cell = row_cells[col_idx]
            cell.width = col_widths[col_idx]
            set_cell_background(cell, bg)
            set_cell_margins(cell, top=30, bottom=30, left=45, right=45)
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER if col_idx in [0, 1, 3, 6] else (WD_ALIGN_PARAGRAPH.RIGHT if col_idx in [4, 5] else WD_ALIGN_PARAGRAPH.LEFT)
            p.paragraph_format.space_before = Pt(0.5)
            p.paragraph_format.space_after = Pt(0.5)

            r = p.add_run(val)
            r.font.size = Pt(7.5)
            if is_opening:
                r.font.bold = True
                r.font.color.rgb = RGBColor(2, 132, 199)
            elif col_idx in [4, 5]:
                r.font.bold = True
                r.font.color.rgb = RGBColor(15, 23, 42)
            else:
                r.font.color.rgb = RGBColor(51, 65, 85)

    # Subtotal Row (Running 19 entries)
    subtot_cells = table.rows[len(records) + 1].cells
    for i in range(7):
        subtot_cells[i].width = col_widths[i]
        set_cell_background(subtot_cells[i], "f8fafc")
        set_cell_margins(subtot_cells[i], top=35, bottom=35, left=45, right=45)

    p_sub_lbl = subtot_cells[0].paragraphs[0]
    p_sub_lbl.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r = p_sub_lbl.add_run("চলমান খাতার উপ-মোট (১৯ টি লেনদেন):")
    r.font.size = Pt(7.5)
    r.font.bold = True
    r.font.color.rgb = RGBColor(71, 85, 105)

    p_sub_rate = subtot_cells[3].paragraphs[0]
    p_sub_rate.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_sr = p_sub_rate.add_run("৩৪.৬৬")
    r_sr.font.size = Pt(7.5)
    r_sr.font.bold = True

    p_sub_aed = subtot_cells[4].paragraphs[0]
    p_sub_aed.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r_sa = p_sub_aed.add_run(f"{format_bd(p3_aed)} AED")
    r_sa.font.size = Pt(8)
    r_sa.font.bold = True
    r_sa.font.color.rgb = RGBColor(5, 150, 105)

    p_sub_bdt = subtot_cells[5].paragraphs[0]
    p_sub_bdt.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r_sb = p_sub_bdt.add_run(f"৳ {format_bd(p3_bdt)}")
    r_sb.font.size = Pt(8)
    r_sb.font.bold = True
    r_sb.font.color.rgb = RGBColor(220, 38, 38)

    p_sub_st = subtot_cells[6].paragraphs[0]
    p_sub_st.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_sst = p_sub_st.add_run("উপ-মোট")
    r_sst.font.size = Pt(7)

    # 2026 Session Total Row
    s2026_cells = table.rows[len(records) + 2].cells
    for i in range(7):
        s2026_cells[i].width = col_widths[i]
        set_cell_background(s2026_cells[i], "f0fdf4")
        set_cell_margins(s2026_cells[i], top=35, bottom=35, left=45, right=45)

    p_s_lbl = s2026_cells[0].paragraphs[0]
    p_s_lbl.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r = p_s_lbl.add_run("২০২৬ সেশনের মোট তহবিল (সাবেক সহ):")
    r.font.size = Pt(8)
    r.font.bold = True
    r.font.color.rgb = RGBColor(4, 120, 87)

    p_s_rate = s2026_cells[3].paragraphs[0]
    p_s_rate.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_sr = p_s_rate.add_run("৩৪.৫৭")
    r_sr.font.size = Pt(8)
    r_sr.font.bold = True
    r_sr.font.color.rgb = RGBColor(4, 120, 87)

    p_s_aed = s2026_cells[4].paragraphs[0]
    p_s_aed.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r_sa = p_s_aed.add_run(f"{format_bd(p2_aed + p3_aed)} AED")
    r_sa.font.size = Pt(8.5)
    r_sa.font.bold = True
    r_sa.font.color.rgb = RGBColor(4, 120, 87)

    p_s_bdt = s2026_cells[5].paragraphs[0]
    p_s_bdt.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r_sb = p_s_bdt.add_run(f"৳ {format_bd(p2_bdt + p3_bdt)}")
    r_sb.font.size = Pt(8.5)
    r_sb.font.bold = True
    r_sb.font.color.rgb = RGBColor(4, 120, 87)

    p_s_st = s2026_cells[6].paragraphs[0]
    p_s_st.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_sst = p_s_st.add_run("২০২৬ মোট")
    r_sst.font.size = Pt(7)
    r_sst.font.bold = True

    # ALL-TIME 1ST CONSIGNMENT GRAND TOTAL ROW
    grand_cells = table.rows[len(records) + 3].cells
    for i in range(7):
        grand_cells[i].width = col_widths[i]
        set_cell_background(grand_cells[i], "eff6ff")
        set_cell_margins(grand_cells[i], top=45, bottom=45, left=45, right=45)

    p_g_lbl = grand_cells[0].paragraphs[0]
    p_g_lbl.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r = p_g_lbl.add_run("১ম কনসোলমেন্টের সর্বমোট তহবিল (পর্যায় ১ + ২ + ৩):")
    r.font.size = Pt(8.5)
    r.font.bold = True
    r.font.color.rgb = RGBColor(15, 23, 42)

    p_g_rate = grand_cells[3].paragraphs[0]
    p_g_rate.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_gr = p_g_rate.add_run(f"{grand_rate:.2f}")
    r_gr.font.size = Pt(8.5)
    r_gr.font.bold = True
    r_gr.font.color.rgb = RGBColor(2, 132, 199)

    p_g_aed = grand_cells[4].paragraphs[0]
    p_g_aed.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r_ga = p_g_aed.add_run(f"{format_bd(grand_aed)} AED")
    r_ga.font.size = Pt(9.5)
    r_ga.font.bold = True
    r_ga.font.color.rgb = RGBColor(4, 120, 87)

    p_g_bdt = grand_cells[5].paragraphs[0]
    p_g_bdt.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r_gb = p_g_bdt.add_run(f"৳ {format_bd(grand_bdt)}")
    r_gb.font.size = Pt(9.5)
    r_gb.font.bold = True
    r_gb.font.color.rgb = RGBColor(185, 28, 28)

    p_g_st = grand_cells[6].paragraphs[0]
    p_g_st.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_gst = p_g_st.add_run("সর্বমোট")
    r_gst.font.size = Pt(7.5)
    r_gst.font.bold = True

    # 4. Consignment Closure & Rollover Certificate Box
    p_cl = doc.add_paragraph()
    p_cl.paragraph_format.space_before = Pt(4)
    p_cl.paragraph_format.space_after = Pt(1)
    r_cl = p_cl.add_run("📌 এমরান ব্যক্তিগত ১ম কনসোলমেন্ট — সার্বিক সমাপ্তি ও ২য় কনসোলমেন্টে স্থানান্তর বিবরণী")
    r_cl.font.size = Pt(9)
    r_cl.font.bold = True
    r_cl.font.color.rgb = RGBColor(146, 64, 14)

    p_cp = doc.add_paragraph()
    p_cp.paragraph_format.space_before = Pt(0)
    p_cp.paragraph_format.space_after = Pt(4)
    r_cp = p_cp.add_run(
        "💡 ক্লোজিং ও ২য় কনসোলমেন্ট রোল-ওভার নীতি: এই ১ম কনসোলমেন্টের অধীনে আরও লেনদেন যুক্ত করা যাবে। "
        "১ম কনসোলমেন্টের সম্পূর্ণ মাল ক্রয় শেষ হলে হিসাবটি আনুষ্ঠানিকভাবে 'ক্লোজ / সমাপ্ত' হবে এবং এর "
        f"চূড়ান্ত সমাপনী স্থিতি (সর্বমোট {format_bd(grand_aed)} AED বা ৳ {format_bd(grand_bdt)}) "
        "স্বয়ংক্রিয়ভাবে 'এমরান ব্যক্তিগত ২য় কনসোলমেন্ট'-এর প্রারম্ভিক তহবিল (Opening Balance) হিসেবে স্থানান্তরিত হবে।"
    )
    r_cp.font.size = Pt(7.8)
    r_cp.font.color.rgb = RGBColor(69, 26, 3)

    # 5. 4 Signatures Grid
    sign_table = doc.add_table(rows=1, cols=4)
    sign_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    sign_table.autofit = False
    signs = ["প্রস্তুতকারক (হিসাব বিভাগ)", "অভ্যন্তরীণ নিরীক্ষক (অফিস ইনচার্জ)", "পার্টনার অনুমোদন", "মোহাম্মদ এমরান (স্বত্বাধিকারী)"]
    for i, s_title in enumerate(signs):
        c = sign_table.cell(0, i)
        c.width = Inches(1.9)
        p = c.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(8)
        r = p.add_run("--------------------------\n" + s_title)
        r.font.size = Pt(7.5)
        r.font.bold = True
        r.font.color.rgb = RGBColor(51, 65, 85)

    # Save
    out_path = os.path.join(base_dir, "ডুবাই_টাকা_পাঠানোর_অফিসিয়াল_বুক_২০২৬_আপডেটেড.docx")
    doc.save(out_path)
    print("Saved updated docx to:", out_path)

    android_dir = r"E:\Android\Porject\Class 1\Audio File\banjonborno"
    if os.path.exists(android_dir):
        dest_docx = os.path.join(android_dir, "ডুবাই_টাকা_পাঠানোর_অফিসিয়াল_বুক_২০২৬_আপডেটেড.docx")
        doc.save(dest_docx)
        print("Copied updated docx to Android directory")

if __name__ == "__main__":
    create_styled_document()
