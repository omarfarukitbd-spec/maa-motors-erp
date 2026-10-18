import os
import subprocess
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor, Mm
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

from ishrak_doc_helpers import (
    COLOR_MAROON, COLOR_RED, COLOR_NAVY, COLOR_BLACK,
    HEX_YELLOW, HEX_CYAN, HEX_WHITE,
    set_cell_properties, format_run, set_row_height,
    add_header_block, add_footer_signature
)

def add_compact_header_block(doc, is_page_2=False):
    """Adds a compact header block to ensure 100% single page fit."""
    top_tbl = doc.add_table(rows=1, cols=2)
    top_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    top_tbl.autofit = False
    
    # Col 0: Bismillah centered
    c0 = top_tbl.cell(0, 0)
    c0.width = Mm(135)
    p0 = c0.paragraphs[0]
    p0.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p0.paragraph_format.space_before = Pt(0)
    p0.paragraph_format.space_after = Pt(0)
    p0.paragraph_format.line_spacing = 1.0
    r0 = p0.add_run('বিসমিল্লাহির রাহমানির রাহিম')
    format_run(r0, size_pt=10, bold=True)
    
    # Col 1: Date & Month right aligned
    c1 = top_tbl.cell(0, 1)
    c1.width = Mm(55)
    p1 = c1.paragraphs[0]
    p1.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    p1.paragraph_format.space_before = Pt(0)
    p1.paragraph_format.space_after = Pt(0)
    p1.paragraph_format.line_spacing = 1.0
    r1 = p1.add_run('তারিখ: ____________\nমাস: ____________')
    format_run(r1, size_pt=9, bold=True)
    
    for cell in [c0, c1]:
        tcPr = cell._tc.get_or_add_tcPr()
        tcBorders = parse_xml(f'''
            <w:tcBorders {nsdecls("w")}>
                <w:top w:val="none"/>
                <w:left w:val="none"/>
                <w:bottom w:val="none"/>
                <w:right w:val="none"/>
            </w:tcBorders>
        ''')
        tcPr.append(tcBorders)

    # Title: ইশরাক টাওয়ার
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(1)
    p_title.paragraph_format.space_after = Pt(0)
    p_title.paragraph_format.line_spacing = 1.0
    r_title = p_title.add_run('ইশরাক টাওয়ার')
    format_run(r_title, size_pt=21, bold=True, color=COLOR_MAROON)
    
    # Owner Line
    p_owner = doc.add_paragraph()
    p_owner.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_owner.paragraph_format.space_before = Pt(0)
    p_owner.paragraph_format.space_after = Pt(0)
    p_owner.paragraph_format.line_spacing = 1.0
    owner_text = 'মালিক মোহাম্মদ এমরান' if is_page_2 else 'মালিক: মোহাম্মদ এমরান'
    r_owner = p_owner.add_run(owner_text)
    format_run(r_owner, size_pt=10.5, bold=True)
    
    # Address Line
    p_addr = doc.add_paragraph()
    p_addr.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_addr.paragraph_format.space_before = Pt(0)
    p_addr.paragraph_format.space_after = Pt(0)
    p_addr.paragraph_format.line_spacing = 1.0
    r_addr = p_addr.add_run('৩৩৩১/৫০৫৩, ফিরোজশাহ্, বা/এ, ডাকঘর: ফিরোজশাহ্-৪২০৭, থানা: আকবরশাহ্, জেলা: চট্টগ্রাম।')
    format_run(r_addr, size_pt=9, bold=True)
    
    # Mobile Line
    p_mob = doc.add_paragraph()
    p_mob.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_mob.paragraph_format.space_before = Pt(0)
    p_mob.paragraph_format.space_after = Pt(1.5)
    p_mob.paragraph_format.line_spacing = 1.0
    mob_text = 'মালিক-০১৮১৫-৭০৭৯৩৪, দারোয়ান ০১৯১৯-৭০৭৯৩৪।' if is_page_2 else 'মোবাইল: ০১৮১৫-৭০৭৯৩৪ (মালিক), দারোয়ান: ০১৯১৯-৭০৭৯৩৪।'
    r_mob = p_mob.add_run(mob_text)
    format_run(r_mob, size_pt=9, bold=True)
    
    if is_page_2:
        p_sub = doc.add_paragraph()
        p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_sub.paragraph_format.space_before = Pt(0)
        p_sub.paragraph_format.space_after = Pt(2)
        p_sub.paragraph_format.line_spacing = 1.0
        r_sub = p_sub.add_run('মাসিক ভাড়ার হিসাব-২০২৫ইং')
        format_run(r_sub, size_pt=10, bold=True, underline=True)

def add_compact_footer(doc, is_page_2=False):
    """Adds compact footer signature."""
    p_foot = doc.add_paragraph()
    p_foot.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    p_foot.paragraph_format.space_before = Pt(2)
    p_foot.paragraph_format.space_after = Pt(0)
    p_foot.paragraph_format.line_spacing = 1.0
    
    foot_color = COLOR_NAVY if is_page_2 else COLOR_BLACK
    r_sig = p_foot.add_run('(মোঃ এমরান)\n')
    format_run(r_sig, size_pt=9.5, bold=True, color=foot_color)
    
    if is_page_2:
        r_txt = p_foot.add_run('ইশরাক টাওয়ার সি/৩৪, ফিরোজশাহ, বা/এ\nথানা- আকবরশাহ, জেলা- চট্টগ্রাম।')
    else:
        r_txt = p_foot.add_run('ইশরাক টাওয়ার, সি/৩৪, ফিরোজশাহ্, বা/এ\nআকবরশাহ্, চট্টগ্রাম।')
    format_run(r_txt, size_pt=8.5, bold=True, color=foot_color)

def set_row_compact(row, height_pt):
    trPr = row._tr.get_or_add_trPr()
    trHeight = parse_xml(f'<w:trHeight {nsdecls("w")} w:val="{int(height_pt * 20)}" w:hRule="atLeast"/>')
    trPr.append(trHeight)
    cantSplit = parse_xml(f'<w:cantSplit {nsdecls("w")}/>')
    trPr.append(cantSplit)

# -------------------------------------------------------------
# PAGE 1: Electricity Meter Sheet (বিদ্যুৎ মিটার ও রিডিং বিল শিট)
# -------------------------------------------------------------
def build_electricity_meter_sheet(doc):
    sec = doc.sections[-1] if len(doc.sections) > 1 else doc.sections[0]
    sec.page_width = Mm(210)
    sec.page_height = Mm(297)
    sec.top_margin = Mm(6)
    sec.bottom_margin = Mm(6)
    sec.left_margin = Mm(10)
    sec.right_margin = Mm(10)
    
    add_compact_header_block(doc, is_page_2=False)
    
    # Printable width = 210 - 20 = 190 mm
    col_widths_mm = [14, 16, 49, 24, 23, 23, 18, 23]  # Total = 190 mm
    
    # 35 rows
    table = doc.add_table(rows=35, cols=8)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    
    ROW_HEIGHT_PT = 12.8
    
    # 1. Header Row
    hdr_titles = ['ফ্লোর নং', 'ফ্ল্যাট নং', 'ভাড়াটিয়ার নাম', 'মিটার নং', 'চাহিদাকৃত লোড', 'বর্তমান রিডিং', 'টাকা', 'কর্তৃপক্ষের স্বাক্ষর']
    hdr_row = table.rows[0]
    set_row_compact(hdr_row, 14)
    for c_idx, title in enumerate(hdr_titles):
        cell = hdr_row.cells[c_idx]
        cell.width = Mm(col_widths_mm[c_idx])
        set_cell_properties(cell, fill_hex=HEX_WHITE, v_align="center", pad_top=10, pad_bot=10)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(0)
        p.paragraph_format.line_spacing = 1.0
        r = p.add_run(title)
        format_run(r, size_pt=8, bold=True)
        
    # Tenant Data (22 rows)
    tenants = [
        ('1F', 'B-1', 'মোহাম্মদ ইমন', '1089500', '2KW'),
        ('1F', 'C-1', 'মোহাম্মদ ইসমাইল', '1089499', '2KW'),
        ('2F', 'A-2', 'মোহাম্মদ আবিদ হাসান তানভির', '1089497', '3KW'),
        ('3F', 'A-3', 'মোহাম্মদ শাহজাহান', '1089494', '3KW'),
        ('3F', 'B-3', 'মোঃ মিনহাজুল হক', '1089495', '3KW'),
        ('3F', 'C-3', 'মোঃ রহিম', '1089496', '3KW'),
        ('4F', 'A-4', 'মোঃ আব্দুর রহমান', '1089491', '3KW'),
        ('4F', 'B-4', 'মোঃ মিনহাজ', '1089492', '3KW'),
        ('4F', 'C-4', 'মোঃ বেলাল মোল্লা', '1089493', '3KW'),
        ('5F', 'A-5', 'মোঃ নাইম', '1089488', '3KW'),
        ('5F', 'B-5', 'মোঃ নাইম হাসান', '1089489', '3KW'),
        ('5F', 'C-5', 'মোঃ মামুন', '1089490', '3KW'),
        ('6F', 'A-6', 'মোঃ সুমন', '1089485', '3KW'),
        ('6F', 'B-6', 'মোঃ আবুল বশর', '1089486', '3KW'),
        ('6F', 'C-6', 'প্রীতি', '1089487', '3KW'),
        ('7F', 'A-7', 'মোঃ হারুনুর রশিদ', '1089482', '3KW'),
        ('7F', 'B-7', 'মোঃ দেলোয়ার হোসেন', '1089483', '3KW'),
        ('7F', 'C-7', 'মোঃ খালেদ সিদ্দিকি', '1089484', '3KW'),
        ('8F', 'A-8', 'মোঃ মাসুদ পারভেজ', '1089485', '3KW'),
        ('8F', 'B-8', 'মোঃ রাজিব', '1089460', '3KW'),
        ('8F', 'C-8', 'মোহাম্মদ আবুল বশর', '1089481', '3KW'),
        ('9F', 'A-9', 'মোঃ ফারহান', '1089459', '3KW'),
        ('9F', 'B-9', 'মোঃ হিরু', '1089458', '00KW'),
    ]
    
    for idx, (fl, flat, name, meter, load) in enumerate(tenants):
        r_idx = idx + 1
        row = table.rows[r_idx]
        set_row_compact(row, ROW_HEIGHT_PT)
        
        # Col 0: Floor
        c0 = row.cells[0]
        c0.width = Mm(col_widths_mm[0])
        set_cell_properties(c0, fill_hex=HEX_WHITE, v_align="center", pad_top=8, pad_bot=8)
        p0 = c0.paragraphs[0]
        p0.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p0.paragraph_format.space_before = Pt(0)
        p0.paragraph_format.space_after = Pt(0)
        p0.paragraph_format.line_spacing = 1.0
        r0 = p0.add_run(fl)
        format_run(r0, size_pt=8.5, bold=True)
        
        # Col 1: Flat (Yellow)
        c1 = row.cells[1]
        c1.width = Mm(col_widths_mm[1])
        set_cell_properties(c1, fill_hex=HEX_YELLOW, v_align="center", pad_top=8, pad_bot=8)
        p1 = c1.paragraphs[0]
        p1.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p1.paragraph_format.space_before = Pt(0)
        p1.paragraph_format.space_after = Pt(0)
        p1.paragraph_format.line_spacing = 1.0
        r1 = p1.add_run(flat)
        format_run(r1, size_pt=8.5, bold=True)
        
        # Col 2: Name (Yellow accent)
        c2 = row.cells[2]
        c2.width = Mm(col_widths_mm[2])
        set_cell_properties(c2, fill_hex=HEX_YELLOW, v_align="center", pad_top=8, pad_bot=8, pad_left=30)
        p2 = c2.paragraphs[0]
        p2.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p2.paragraph_format.space_before = Pt(0)
        p2.paragraph_format.space_after = Pt(0)
        p2.paragraph_format.line_spacing = 1.0
        r2 = p2.add_run(name)
        format_run(r2, size_pt=8, bold=True)
        
        # Col 3: Meter (Yellow)
        c3 = row.cells[3]
        c3.width = Mm(col_widths_mm[3])
        set_cell_properties(c3, fill_hex=HEX_YELLOW, v_align="center", pad_top=8, pad_bot=8)
        p3 = c3.paragraphs[0]
        p3.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p3.paragraph_format.space_before = Pt(0)
        p3.paragraph_format.space_after = Pt(0)
        p3.paragraph_format.line_spacing = 1.0
        r3 = p3.add_run(meter)
        format_run(r3, size_pt=8.5, bold=True)
        
        # Col 4: Load (Yellow)
        c4 = row.cells[4]
        c4.width = Mm(col_widths_mm[4])
        set_cell_properties(c4, fill_hex=HEX_YELLOW, v_align="center", pad_top=8, pad_bot=8)
        p4 = c4.paragraphs[0]
        p4.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p4.paragraph_format.space_before = Pt(0)
        p4.paragraph_format.space_after = Pt(0)
        p4.paragraph_format.line_spacing = 1.0
        r4 = p4.add_run(load)
        format_run(r4, size_pt=8.5, bold=True)
        
        # Col 5, 6, 7: Reading, Taka, Signature
        for c_idx in [5, 6, 7]:
            cell = row.cells[c_idx]
            cell.width = Mm(col_widths_mm[c_idx])
            set_cell_properties(cell, fill_hex=HEX_WHITE, v_align="center", pad_top=8, pad_bot=8)
            p = cell.paragraphs[0]
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)
            p.paragraph_format.line_spacing = 1.0

    # Merge Floor Cells vertically
    table.cell(1, 0).merge(table.cell(2, 0))
    table.cell(4, 0).merge(table.cell(6, 0))
    table.cell(7, 0).merge(table.cell(9, 0))
    table.cell(10, 0).merge(table.cell(12, 0))
    table.cell(13, 0).merge(table.cell(15, 0))
    table.cell(16, 0).merge(table.cell(18, 0))
    table.cell(19, 0).merge(table.cell(21, 0))
    table.cell(22, 0).merge(table.cell(23, 0))
    
    # 3. Tenant Subtotal Row (Row 23)
    sub_row = table.rows[23]
    set_row_compact(sub_row, ROW_HEIGHT_PT)
    
    sub_cell_left = sub_row.cells[0].merge(sub_row.cells[4])
    set_cell_properties(sub_cell_left, fill_hex=HEX_WHITE, v_align="center", pad_top=8, pad_bot=8)
    p_sub_left = sub_cell_left.paragraphs[0]
    p_sub_left.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub_left.paragraph_format.space_before = Pt(0)
    p_sub_left.paragraph_format.space_after = Pt(0)
    p_sub_left.paragraph_format.line_spacing = 1.0
    r_sub_left = p_sub_left.add_run('২২মিটার')
    format_run(r_sub_left, size_pt=9, bold=True)
    
    c5 = sub_row.cells[5]
    set_cell_properties(c5, fill_hex=HEX_WHITE, v_align="center", pad_top=8, pad_bot=8)
    p5 = c5.paragraphs[0]
    p5.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p5.paragraph_format.space_before = Pt(0)
    p5.paragraph_format.space_after = Pt(0)
    p5.paragraph_format.line_spacing = 1.0
    r5 = p5.add_run('ভাড়াটিয়ার মোট বিল=')
    format_run(r5, size_pt=8, bold=True)
    
    for c_idx in [6, 7]:
        c = sub_row.cells[c_idx]
        set_cell_properties(c, fill_hex=HEX_WHITE, v_align="center", pad_top=8, pad_bot=8)
        p = c.paragraphs[0]
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(0)

    # 4. Owner / Service Rows (Rows 24 to 31) - Cyan Fill
    owners = [
        ('B-2', 'মোহাম্মদ এমরান', '1089498', '4KW'),
        ('P-1', 'মোহাম্মদ এমরান', '1096853', '2KW'),
        ('P-2', 'মোহাম্মদ এমরান', 'E670970', '2KW'),
        ('M-1', 'মোহাম্মদ এমরান', '1096854', '3KW'),
        ('M-2', 'মোহাম্মদ এমরান', 'E670976', '3KW'),
        ('D-1', 'মোহাম্মদ এমরান', 'E0134058', '2KW'),
        ('D-2', 'মোহাম্মদ এমরান', 'E0134051', '2KW'),
        ('ST', 'মোহাম্মদ এমরান', 'লিফট', '80KW'),
    ]
    
    for idx, (flat, name, meter, load) in enumerate(owners):
        r_idx = 24 + idx
        row = table.rows[r_idx]
        set_row_compact(row, ROW_HEIGHT_PT)
        
        c0 = row.cells[0]
        c0.width = Mm(col_widths_mm[0])
        set_cell_properties(c0, fill_hex=HEX_CYAN, v_align="center", pad_top=8, pad_bot=8)
        p0 = c0.paragraphs[0]
        p0.paragraph_format.space_before = Pt(0)
        p0.paragraph_format.space_after = Pt(0)
        
        c1 = row.cells[1]
        c1.width = Mm(col_widths_mm[1])
        set_cell_properties(c1, fill_hex=HEX_CYAN, v_align="center", pad_top=8, pad_bot=8)
        p1 = c1.paragraphs[0]
        p1.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p1.paragraph_format.space_before = Pt(0)
        p1.paragraph_format.space_after = Pt(0)
        r1 = p1.add_run(flat)
        format_run(r1, size_pt=8.5, bold=True)
        
        c2 = row.cells[2]
        c2.width = Mm(col_widths_mm[2])
        set_cell_properties(c2, fill_hex=HEX_CYAN, v_align="center", pad_top=8, pad_bot=8, pad_left=30)
        p2 = c2.paragraphs[0]
        p2.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p2.paragraph_format.space_before = Pt(0)
        p2.paragraph_format.space_after = Pt(0)
        r2 = p2.add_run(name)
        format_run(r2, size_pt=8, bold=True)
        
        c3 = row.cells[3]
        c3.width = Mm(col_widths_mm[3])
        set_cell_properties(c3, fill_hex=HEX_CYAN, v_align="center", pad_top=8, pad_bot=8)
        p3 = c3.paragraphs[0]
        p3.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p3.paragraph_format.space_before = Pt(0)
        p3.paragraph_format.space_after = Pt(0)
        r3 = p3.add_run(meter)
        format_run(r3, size_pt=8.5, bold=True)
        
        c4 = row.cells[4]
        c4.width = Mm(col_widths_mm[4])
        set_cell_properties(c4, fill_hex=HEX_CYAN, v_align="center", pad_top=8, pad_bot=8)
        p4 = c4.paragraphs[0]
        p4.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p4.paragraph_format.space_before = Pt(0)
        p4.paragraph_format.space_after = Pt(0)
        r4 = p4.add_run(load)
        format_run(r4, size_pt=8.5, bold=True)
        
        for c_idx in [5, 6, 7]:
            cell = row.cells[c_idx]
            cell.width = Mm(col_widths_mm[c_idx])
            set_cell_properties(cell, fill_hex=HEX_CYAN, v_align="center", pad_top=8, pad_bot=8)
            p = cell.paragraphs[0]
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)

    # 5. Grand Total Rows (Rows 32, 33, 34)
    r32 = table.rows[32]
    set_row_compact(r32, ROW_HEIGHT_PT)
    c_left_32 = r32.cells[0].merge(r32.cells[4])
    set_cell_properties(c_left_32, fill_hex=HEX_WHITE, v_align="center", pad_top=8, pad_bot=8)
    p32_l = c_left_32.paragraphs[0]
    p32_l.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p32_l.paragraph_format.space_before = Pt(0)
    p32_l.paragraph_format.space_after = Pt(0)
    r32_l = p32_l.add_run('৮টি মিটার = ২২ +৮=৩০')
    format_run(r32_l, size_pt=8.5, bold=True)
    
    c32_mid = r32.cells[5]
    set_cell_properties(c32_mid, fill_hex=HEX_WHITE, v_align="center", pad_top=8, pad_bot=8)
    p32_m = c32_mid.paragraphs[0]
    p32_m.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p32_m.paragraph_format.space_before = Pt(0)
    p32_m.paragraph_format.space_after = Pt(0)
    r32_m = p32_m.add_run('মালিকের মোট বিল=')
    format_run(r32_m, size_pt=8, bold=True)
    
    for c_idx in [6, 7]:
        c = r32.cells[c_idx]
        set_cell_properties(c, fill_hex=HEX_WHITE, v_align="center", pad_top=8, pad_bot=8)
        p = c.paragraphs[0]
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(0)

    # Row 33: 'ভাড়াটিয়ার মোট বিল='
    r33 = table.rows[33]
    set_row_compact(r33, ROW_HEIGHT_PT)
    c_left_33 = r33.cells[0].merge(r33.cells[4])
    set_cell_properties(c_left_33, fill_hex=HEX_WHITE, v_align="center", pad_top=8, pad_bot=8)
    p33_l = c_left_33.paragraphs[0]
    p33_l.paragraph_format.space_before = Pt(0)
    p33_l.paragraph_format.space_after = Pt(0)
    
    c33_mid = r33.cells[5]
    set_cell_properties(c33_mid, fill_hex=HEX_WHITE, v_align="center", pad_top=8, pad_bot=8)
    p33_m = c33_mid.paragraphs[0]
    p33_m.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p33_m.paragraph_format.space_before = Pt(0)
    p33_m.paragraph_format.space_after = Pt(0)
    r33_m = p33_m.add_run('ভাড়াটিয়ার মোট বিল=')
    format_run(r33_m, size_pt=8, bold=True)
    
    for c_idx in [6, 7]:
        c = r33.cells[c_idx]
        set_cell_properties(c, fill_hex=HEX_WHITE, v_align="center", pad_top=8, pad_bot=8)
        p = c.paragraphs[0]
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(0)

    # Row 34: 'মোট বিল='
    r34 = table.rows[34]
    set_row_compact(r34, ROW_HEIGHT_PT)
    c_left_34 = r34.cells[0].merge(r34.cells[4])
    set_cell_properties(c_left_34, fill_hex=HEX_WHITE, v_align="center", pad_top=8, pad_bot=8)
    p34_l = c_left_34.paragraphs[0]
    p34_l.paragraph_format.space_before = Pt(0)
    p34_l.paragraph_format.space_after = Pt(0)
    
    c34_mid = r34.cells[5]
    set_cell_properties(c34_mid, fill_hex=HEX_WHITE, v_align="center", pad_top=8, pad_bot=8)
    p34_m = c34_mid.paragraphs[0]
    p34_m.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p34_m.paragraph_format.space_before = Pt(0)
    p34_m.paragraph_format.space_after = Pt(0)
    r34_m = p34_m.add_run('মোট বিল=')
    format_run(r34_m, size_pt=8, bold=True)
    
    for c_idx in [6, 7]:
        c = r34.cells[c_idx]
        set_cell_properties(c, fill_hex=HEX_WHITE, v_align="center", pad_top=8, pad_bot=8)
        p = c.paragraphs[0]
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(0)

    add_compact_footer(doc, is_page_2=False)

# -------------------------------------------------------------
# PAGE 2: Monthly Rent Sheet (মাসিক ভাড়ার হিসাব-২০২৫ইং)
# -------------------------------------------------------------
def build_monthly_rent_sheet(doc):
    sec = doc.sections[-1] if len(doc.sections) > 1 else doc.sections[0]
    sec.page_width = Mm(210)
    sec.page_height = Mm(297)
    sec.top_margin = Mm(8)
    sec.bottom_margin = Mm(8)
    sec.left_margin = Mm(10)
    sec.right_margin = Mm(10)
    
    add_compact_header_block(doc, is_page_2=True)
    
    # Printable width = 190 mm
    col_widths_mm = [14, 16, 44, 21, 18, 22, 17, 16, 22]  # Total = 190 mm
    
    # 25 rows
    table = doc.add_table(rows=25, cols=9)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    
    ROW_HEIGHT_PT = 17
    
    # 1. Header Row
    hdr_titles = ['ফ্লোর নং', 'ফ্ল্যাট নং', 'ভাড়াটিয়ার নাম', 'মাসিক ভাড়া', 'গ্যাস বিল', 'মোট ভাড়া', 'অন্যান্য চার্জ', 'তারিখ', 'কর্তৃপক্ষের স্বাক্ষর']
    hdr_row = table.rows[0]
    set_row_compact(hdr_row, 18)
    for c_idx, title in enumerate(hdr_titles):
        cell = hdr_row.cells[c_idx]
        cell.width = Mm(col_widths_mm[c_idx])
        set_cell_properties(cell, fill_hex=HEX_WHITE, v_align="center", pad_top=20, pad_bot=20)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(0)
        p.paragraph_format.line_spacing = 1.0
        r = p.add_run(title)
        format_run(r, size_pt=8.5, bold=True)
        
    # Tenant Rent Data (23 rows)
    rent_data = [
        ('1F', 'B-1', 'মোঃ ইমন', '১০,৫০০', '১,৫০০', '১২,০০০'),
        ('1F', 'C-1', 'মোঃ ইসমাইল', '১০,০০০', '১,৫০০', '১১,৫০০'),
        ('2F', 'A-2', 'আবিদ হাসান তানভির', '১২,০০০', '১,৫০০', '১৩,৫০০'),
        ('2F', 'B-2', 'মোঃ এমরান (মালিক)', '২০,০০০', '১,৫০০', '২১,৫০০'),
        ('3F', 'A-3', 'মোঃ শাহজাহান', '১২,০০০', '১,৫০০', '১৩,৫০০'),
        ('3F', 'B-3', 'মোঃ মিনহাজুল হক', '১৩,৫০০', '১,৫০০', '১৫,০০০'),
        ('3F', 'C-3', 'মোঃ রহিম', '১৩,০০০', '১,৫০০', '১৪,৫০০'),
        ('4F', 'A-4', 'মোঃ আব্দুর রহমান', '১২,০০০', '১,৫০০', '১৩,৫০০'),
        ('4F', 'B-4', 'মোঃ মিনহাজ', '১৩,৫০০', '১,৫০০', '১৫,০০০'),
        ('4F', 'C-4', 'মোঃ বেলাল মোল্লা', '১৪,০০০', '১,৫০০', '১৫,৫০০'),
        ('5F', 'A-5', 'মোঃ নাইম', '১২,০০০', '১,৫০০', '১৩,৫০০'),
        ('5F', 'B-5', 'মোঃ নাইম হাসান', '১৪,০০০', '১,৫০০', '১৫,৫০০'),
        ('5F', 'C-5', 'মোঃ মামুন', '১৩,০০০', '১,৫০০', '১৪,৫০০'),
        ('6F', 'A-6', 'মোঃ সুমন ভাই', '১২,০০০', '১,৫০০', '১৩,৫০০'),
        ('6F', 'B-6', 'মোঃ আবুল বশর', '১৩,০০০', '১,৫০০', '১৪,৫০০'),
        ('6F', 'C-6', 'প্রীতি', '১৩,০০০', '১,৫০০', '১৪,৫০০'),
        ('7F', 'A-7', 'মোঃ হারুনুর রশিদ', '১৪,০০০', '১,৫০০', '১৫,৫০০'),
        ('7F', 'B-7', 'মোঃ দেলোয়ার হোসেন', '১৩,০০০', '১,৫০০', '১৪,৫০০'),
        ('7F', 'C-7', 'মোঃ খালেদ সিদ্দিকি', '১৩,০০০', '১,৫০০', '১৪,৫০০'),
        ('8F', 'A-8', 'মোঃ মাসুদ পারভেজ', '১২,০০০', '১,৫০০', '১৩,৫০০'),
        ('8F', 'B-8', 'রাজিব', '১২,৫০০', '১,৫০০', '১৪,০০০'),
        ('8F', 'C-8', 'মোহাম্মদ আবুল বশর', '১২,০০০', '১,৫০০', '১৩,৫০০'),
        ('9F', 'A-9', 'মোঃ ফারহান', '১০,০০০', '-------', '১০,০০০'),
        ('9F', 'B-9', 'মোঃ হিরু', '১২,০০০', '১,৫০০', '১৩,৫০০'),
    ]
    
    for idx, (fl, flat, name, rent, gas, total) in enumerate(rent_data):
        r_idx = idx + 1
        row = table.rows[r_idx]
        set_row_compact(row, ROW_HEIGHT_PT)
        
        c0 = row.cells[0]
        c0.width = Mm(col_widths_mm[0])
        set_cell_properties(c0, fill_hex=HEX_WHITE, v_align="center", pad_top=12, pad_bot=12)
        p0 = c0.paragraphs[0]
        p0.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p0.paragraph_format.space_before = Pt(0)
        p0.paragraph_format.space_after = Pt(0)
        p0.paragraph_format.line_spacing = 1.0
        r0 = p0.add_run(fl)
        format_run(r0, size_pt=9, bold=True)
        
        c1 = row.cells[1]
        c1.width = Mm(col_widths_mm[1])
        set_cell_properties(c1, fill_hex=HEX_WHITE, v_align="center", pad_top=12, pad_bot=12)
        p1 = c1.paragraphs[0]
        p1.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p1.paragraph_format.space_before = Pt(0)
        p1.paragraph_format.space_after = Pt(0)
        p1.paragraph_format.line_spacing = 1.0
        r1 = p1.add_run(flat)
        format_run(r1, size_pt=9, bold=True)
        
        c2 = row.cells[2]
        c2.width = Mm(col_widths_mm[2])
        set_cell_properties(c2, fill_hex=HEX_WHITE, v_align="center", pad_top=12, pad_bot=12, pad_left=30)
        p2 = c2.paragraphs[0]
        p2.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p2.paragraph_format.space_before = Pt(0)
        p2.paragraph_format.space_after = Pt(0)
        p2.paragraph_format.line_spacing = 1.0
        r2 = p2.add_run(name)
        format_run(r2, size_pt=8.5, bold=True)
        
        c3 = row.cells[3]
        c3.width = Mm(col_widths_mm[3])
        set_cell_properties(c3, fill_hex=HEX_WHITE, v_align="center", pad_top=12, pad_bot=12)
        p3 = c3.paragraphs[0]
        p3.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p3.paragraph_format.space_before = Pt(0)
        p3.paragraph_format.space_after = Pt(0)
        p3.paragraph_format.line_spacing = 1.0
        r3 = p3.add_run(rent)
        format_run(r3, size_pt=9, bold=True)
        
        c4 = row.cells[4]
        c4.width = Mm(col_widths_mm[4])
        set_cell_properties(c4, fill_hex=HEX_WHITE, v_align="center", pad_top=12, pad_bot=12)
        p4 = c4.paragraphs[0]
        p4.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p4.paragraph_format.space_before = Pt(0)
        p4.paragraph_format.space_after = Pt(0)
        p4.paragraph_format.line_spacing = 1.0
        r4 = p4.add_run(gas)
        format_run(r4, size_pt=9, bold=True)
        
        c5 = row.cells[5]
        c5.width = Mm(col_widths_mm[5])
        set_cell_properties(c5, fill_hex=HEX_WHITE, v_align="center", pad_top=12, pad_bot=12)
        p5 = c5.paragraphs[0]
        p5.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p5.paragraph_format.space_before = Pt(0)
        p5.paragraph_format.space_after = Pt(0)
        p5.paragraph_format.line_spacing = 1.0
        r5 = p5.add_run(total)
        format_run(r5, size_pt=9, bold=True, color=COLOR_RED)
        
        for c_idx in [6, 7, 8]:
            cell = row.cells[c_idx]
            cell.width = Mm(col_widths_mm[c_idx])
            set_cell_properties(cell, fill_hex=HEX_WHITE, v_align="center", pad_top=12, pad_bot=12)
            p = cell.paragraphs[0]
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)
            p.paragraph_format.line_spacing = 1.0

    # Merge Floor Cells
    table.cell(1, 0).merge(table.cell(2, 0))
    table.cell(3, 0).merge(table.cell(4, 0))
    table.cell(5, 0).merge(table.cell(7, 0))
    table.cell(8, 0).merge(table.cell(10, 0))
    table.cell(11, 0).merge(table.cell(13, 0))
    table.cell(14, 0).merge(table.cell(16, 0))
    table.cell(17, 0).merge(table.cell(19, 0))
    table.cell(20, 0).merge(table.cell(22, 0))
    table.cell(23, 0).merge(table.cell(24, 0))

    # Total Row (Row 24 of table)
    tot_row = table.rows[24]
    set_row_compact(tot_row, ROW_HEIGHT_PT)
    
    tot_label_cell = tot_row.cells[0].merge(tot_row.cells[2])
    set_cell_properties(tot_label_cell, fill_hex=HEX_WHITE, v_align="center", pad_top=12, pad_bot=12, pad_right=30)
    p_tot = tot_label_cell.paragraphs[0]
    p_tot.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    p_tot.paragraph_format.space_before = Pt(0)
    p_tot.paragraph_format.space_after = Pt(0)
    p_tot.paragraph_format.line_spacing = 1.0
    r_tot = p_tot.add_run('মোট=')
    format_run(r_tot, size_pt=9.5, bold=True)
    
    c3_tot = tot_row.cells[3]
    set_cell_properties(c3_tot, fill_hex=HEX_WHITE, v_align="center", pad_top=12, pad_bot=12)
    p3_tot = c3_tot.paragraphs[0]
    p3_tot.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p3_tot.paragraph_format.space_before = Pt(0)
    p3_tot.paragraph_format.space_after = Pt(0)
    p3_tot.paragraph_format.line_spacing = 1.0
    r3_tot = p3_tot.add_run('৩০৫,০০০')
    format_run(r3_tot, size_pt=9.5, bold=True)
    
    c4_tot = tot_row.cells[4]
    set_cell_properties(c4_tot, fill_hex=HEX_WHITE, v_align="center", pad_top=12, pad_bot=12)
    p4_tot = c4_tot.paragraphs[0]
    p4_tot.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p4_tot.paragraph_format.space_before = Pt(0)
    p4_tot.paragraph_format.space_after = Pt(0)
    p4_tot.paragraph_format.line_spacing = 1.0
    r4_tot = p4_tot.add_run('৩৪,৫০০')
    format_run(r4_tot, size_pt=9.5, bold=True)
    
    c5_tot = tot_row.cells[5]
    set_cell_properties(c5_tot, fill_hex=HEX_WHITE, v_align="center", pad_top=12, pad_bot=12)
    p5_tot = c5_tot.paragraphs[0]
    p5_tot.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p5_tot.paragraph_format.space_before = Pt(0)
    p5_tot.paragraph_format.space_after = Pt(0)
    p5_tot.paragraph_format.line_spacing = 1.0
    r5_tot = p5_tot.add_run('৩৪৯,০০০')
    format_run(r5_tot, size_pt=9.5, bold=True, color=COLOR_RED)
    
    for c_idx in [6, 7, 8]:
        c = tot_row.cells[c_idx]
        set_cell_properties(c, fill_hex=HEX_WHITE, v_align="center", pad_top=12, pad_bot=12)
        p = c.paragraphs[0]
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(0)
        p.paragraph_format.line_spacing = 1.0

    add_compact_footer(doc, is_page_2=True)

# -------------------------------------------------------------
# Main Generation Function
# -------------------------------------------------------------
def main():
    workspace_root = r"e:\maa-motors-erp"
    
    # 1. Page 1 Standalone Document
    doc1 = Document()
    build_electricity_meter_sheet(doc1)
    file1_docx = os.path.join(workspace_root, "Ishrak_Tower_Electricity_Meter_Sheet.docx")
    file1_pdf = os.path.join(workspace_root, "Ishrak_Tower_Electricity_Meter_Sheet.pdf")
    doc1.save(file1_docx)
    print("Saved:", file1_docx)
    
    cmd1 = ['powershell', '-ExecutionPolicy', 'Bypass', '-File', os.path.join(workspace_root, 'convert_to_pdf.ps1'), '-docxPath', file1_docx, '-pdfPath', file1_pdf]
    res1 = subprocess.run(cmd1, capture_output=True, text=True)
    print("PDF Page 1:", res1.stdout)
    
    # 2. Page 2 Standalone Document
    doc2 = Document()
    build_monthly_rent_sheet(doc2)
    file2_docx = os.path.join(workspace_root, "Ishrak_Tower_Monthly_Rent_Sheet.docx")
    file2_pdf = os.path.join(workspace_root, "Ishrak_Tower_Monthly_Rent_Sheet.pdf")
    doc2.save(file2_docx)
    print("Saved:", file2_docx)
    
    cmd2 = ['powershell', '-ExecutionPolicy', 'Bypass', '-File', os.path.join(workspace_root, 'convert_to_pdf.ps1'), '-docxPath', file2_docx, '-pdfPath', file2_pdf]
    res2 = subprocess.run(cmd2, capture_output=True, text=True)
    print("PDF Page 2:", res2.stdout)
    
    # 3. Master Combined Document
    doc_master = Document()
    build_electricity_meter_sheet(doc_master)
    # add section break instead of just page break to inherit clean margins
    sec2 = doc_master.add_section(docx.enum.section.WD_SECTION_START.NEW_PAGE)
    build_monthly_rent_sheet(doc_master)
    
    file_master_docx = os.path.join(workspace_root, "Ishrak_Tower_Master_Sheets.docx")
    file_master_pdf = os.path.join(workspace_root, "Ishrak_Tower_Master_Sheets.pdf")
    doc_master.save(file_master_docx)
    print("Saved:", file_master_docx)
    
    cmd_m = ['powershell', '-ExecutionPolicy', 'Bypass', '-File', os.path.join(workspace_root, 'convert_to_pdf.ps1'), '-docxPath', file_master_docx, '-pdfPath', file_master_pdf]
    res_m = subprocess.run(cmd_m, capture_output=True, text=True)
    print("PDF Master:", res_m.stdout)

if __name__ == "__main__":
    main()
