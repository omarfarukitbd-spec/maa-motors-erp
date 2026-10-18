import os
import subprocess
import docx
from docx import Document
from docx.shared import Pt, RGBColor, Mm
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

import bijoy2unicode.util as u
def safe_mbCharAt(s, i):
    if i < 0 or i >= len(s):
        return ''
    return s[i]
u.mbCharAt = safe_mbCharAt

from bijoy2unicode import converter
conv = converter.Unicode()

COLOR_MAROON = RGBColor(123, 17, 19)
COLOR_RED = RGBColor(192, 0, 0)
COLOR_NAVY = RGBColor(0, 51, 102)
COLOR_BLACK = RGBColor(0, 0, 0)

HEX_YELLOW = "FFFF99"
HEX_CYAN = "D2F4FA"
HEX_WHITE = "FFFFFF"

def set_cell_properties(cell, fill_hex=None, v_align="center", pad_top=28, pad_bot=28, pad_left=50, pad_right=50):
    tcPr = cell._tc.get_or_add_tcPr()
    if v_align:
        vAlign = parse_xml(f'<w:vAlign {nsdecls("w")} w:val="{v_align}"/>')
        tcPr.append(vAlign)
    if fill_hex:
        shd = parse_xml(f'<w:shd {nsdecls("w")} w:val="clear" w:color="auto" w:fill="{fill_hex}"/>')
        tcPr.append(shd)
    tcBorders = parse_xml(f'''
        <w:tcBorders {nsdecls("w")}>
            <w:top w:val="single" w:sz="4" w:space="0" w:color="000000"/>
            <w:left w:val="single" w:sz="4" w:space="0" w:color="000000"/>
            <w:bottom w:val="single" w:sz="4" w:space="0" w:color="000000"/>
            <w:right w:val="single" w:sz="4" w:space="0" w:color="000000"/>
        </w:tcBorders>
    ''')
    tcPr.append(tcBorders)
    tcMar = parse_xml(f'''
        <w:tcMar {nsdecls("w")}>
            <w:top w:w="{pad_top}" w:type="dxa"/>
            <w:bottom w:w="{pad_bot}" w:type="dxa"/>
            <w:left w:w="{pad_left}" w:type="dxa"/>
            <w:right w:w="{pad_right}" w:type="dxa"/>
        </w:tcMar>
    ''')
    tcPr.append(tcMar)

def set_run_font_clean(run, font_name, size_pt=9.5, bold=False, color=COLOR_BLACK, italic=False, underline=False):
    """Sets font with a clean single w:rFonts element to prevent Word UI locking."""
    run.font.size = Pt(size_pt)
    run.bold = bold
    run.italic = italic
    run.underline = underline
    run.font.color.rgb = color
    
    rPr = run._r.get_or_add_rPr()
    # remove any existing rFonts
    for old_rf in rPr.findall(qn('w:rFonts')):
        rPr.remove(old_rf)
    
    rFonts = OxmlElement('w:rFonts')
    rFonts.set(qn('w:ascii'), font_name)
    rFonts.set(qn('w:hAnsi'), font_name)
    rFonts.set(qn('w:cs'), font_name)
    rPr.append(rFonts)

def set_row_compact(row, height_pt):
    trPr = row._tr.get_or_add_trPr()
    trHeight = parse_xml(f'<w:trHeight {nsdecls("w")} w:val="{int(height_pt * 20)}" w:hRule="atLeast"/>')
    trPr.append(trHeight)
    cantSplit = parse_xml(f'<w:cantSplit {nsdecls("w")}/>')
    trPr.append(cantSplit)

def t(text, is_sutonny_ansi=False):
    """Translates text: if is_sutonny_ansi is True, converts Bengali to Bijoy."""
    if not is_sutonny_ansi:
        return text
    # Convert Bengali text to Bijoy
    try:
        return conv.convertUnicodeToBijoy(text)
    except Exception as e:
        return text

def add_header(doc, is_page_2=False, is_sutonny_ansi=False):
    font_bn = "SutonnyMJ" if is_sutonny_ansi else "SutonnyUniGMJ"
    
    top_tbl = doc.add_table(rows=1, cols=2)
    top_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    top_tbl.autofit = False
    
    c0 = top_tbl.cell(0, 0)
    c0.width = Mm(135)
    p0 = c0.paragraphs[0]
    p0.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p0.paragraph_format.space_before = Pt(0)
    p0.paragraph_format.space_after = Pt(0)
    p0.paragraph_format.line_spacing = 1.0
    r0 = p0.add_run(t('বিসমিল্লাহির রাহমানির রাহিম', is_sutonny_ansi))
    set_run_font_clean(r0, font_bn, size_pt=10.5, bold=True)
    
    c1 = top_tbl.cell(0, 1)
    c1.width = Mm(55)
    p1 = c1.paragraphs[0]
    p1.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    p1.paragraph_format.space_before = Pt(0)
    p1.paragraph_format.space_after = Pt(0)
    p1.paragraph_format.line_spacing = 1.0
    r1 = p1.add_run(t('তারিখ: ____________\nমাস: ____________', is_sutonny_ansi))
    set_run_font_clean(r1, font_bn, size_pt=9.5, bold=True)
    
    for cell in [c0, c1]:
        tcPr = cell._tc.get_or_add_tcPr()
        tcBorders = parse_xml(f'''
            <w:tcBorders {nsdecls("w")}>
                <w:top w:val="none"/><w:left w:val="none"/><w:bottom w:val="none"/><w:right w:val="none"/>
            </w:tcBorders>
        ''')
        tcPr.append(tcBorders)

    # Title
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(1)
    p_title.paragraph_format.space_after = Pt(0)
    p_title.paragraph_format.line_spacing = 1.0
    r_title = p_title.add_run(t('ইশরাক টাওয়ার', is_sutonny_ansi))
    set_run_font_clean(r_title, font_bn, size_pt=22, bold=True, color=COLOR_MAROON)
    
    # Owner
    p_owner = doc.add_paragraph()
    p_owner.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_owner.paragraph_format.space_before = Pt(0)
    p_owner.paragraph_format.space_after = Pt(0)
    p_owner.paragraph_format.line_spacing = 1.0
    owner_text = 'মালিক মোহাম্মদ এমরান' if is_page_2 else 'মালিক: মোহাম্মদ এমরান'
    r_owner = p_owner.add_run(t(owner_text, is_sutonny_ansi))
    set_run_font_clean(r_owner, font_bn, size_pt=10.5, bold=True)
    
    # Address
    p_addr = doc.add_paragraph()
    p_addr.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_addr.paragraph_format.space_before = Pt(0)
    p_addr.paragraph_format.space_after = Pt(0)
    p_addr.paragraph_format.line_spacing = 1.0
    r_addr = p_addr.add_run(t('৩৩৩১/৫০৫৩, ফিরোজশাহ্, বা/এ, ডাকঘর: ফিরোজশাহ্-৪২০৭, থানা: আকবরশাহ্, জেলা: চট্টগ্রাম।', is_sutonny_ansi))
    set_run_font_clean(r_addr, font_bn, size_pt=9.5, bold=True)
    
    # Mobile
    p_mob = doc.add_paragraph()
    p_mob.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_mob.paragraph_format.space_before = Pt(0)
    p_mob.paragraph_format.space_after = Pt(1.5)
    p_mob.paragraph_format.line_spacing = 1.0
    mob_text = 'মালিক-০১৮১৫-৭০৭৯৩৪, দারোয়ান ০১৯১৯-৭০৭৯৩৪।' if is_page_2 else 'মোবাইল: ০১৮১৫-৭০৭৯৩৪ (মালিক), দারোয়ান: ০১৯১৯-৭০৭৯৩৪।'
    r_mob = p_mob.add_run(t(mob_text, is_sutonny_ansi))
    set_run_font_clean(r_mob, font_bn, size_pt=9.5, bold=True)
    
    if is_page_2:
        p_sub = doc.add_paragraph()
        p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_sub.paragraph_format.space_before = Pt(0)
        p_sub.paragraph_format.space_after = Pt(2)
        p_sub.paragraph_format.line_spacing = 1.0
        r_sub = p_sub.add_run(t('মাসিক ভাড়ার হিসাব-২০২৫ইং', is_sutonny_ansi))
        set_run_font_clean(r_sub, font_bn, size_pt=10.5, bold=True, underline=True)

def add_footer(doc, is_page_2=False, is_sutonny_ansi=False):
    font_bn = "SutonnyMJ" if is_sutonny_ansi else "SutonnyUniGMJ"
    p_foot = doc.add_paragraph()
    p_foot.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    p_foot.paragraph_format.space_before = Pt(2)
    p_foot.paragraph_format.space_after = Pt(0)
    p_foot.paragraph_format.line_spacing = 1.0
    
    foot_color = COLOR_NAVY if is_page_2 else COLOR_BLACK
    r_sig = p_foot.add_run(t('(মোঃ এমরান)\n', is_sutonny_ansi))
    set_run_font_clean(r_sig, font_bn, size_pt=9.5, bold=True, color=foot_color)
    
    if is_page_2:
        r_txt = p_foot.add_run(t('ইশরাক টাওয়ার সি/৩৪, ফিরোজশাহ, বা/এ\nথানা- আকবরশাহ, জেলা- চট্টগ্রাম।', is_sutonny_ansi))
    else:
        r_txt = p_foot.add_run(t('ইশরাক টাওয়ার, সি/৩৪, ফিরোজশাহ্, বা/এ\nআকবরশাহ্, চট্টগ্রাম।', is_sutonny_ansi))
    set_run_font_clean(r_txt, font_bn, size_pt=8.5, bold=True, color=foot_color)

def generate_meter_sheet(doc, is_sutonny_ansi=False):
    font_bn = "SutonnyMJ" if is_sutonny_ansi else "SutonnyUniGMJ"
    font_en = "SutonnyMJ" if is_sutonny_ansi else "Arial"
    
    sec = doc.sections[-1] if len(doc.sections) > 1 else doc.sections[0]
    sec.page_width = Mm(210)
    sec.page_height = Mm(297)
    sec.top_margin = Mm(6)
    sec.bottom_margin = Mm(6)
    sec.left_margin = Mm(10)
    sec.right_margin = Mm(10)
    
    add_header(doc, is_page_2=False, is_sutonny_ansi=is_sutonny_ansi)
    
    col_widths_mm = [14, 16, 49, 24, 23, 23, 18, 23]
    table = doc.add_table(rows=35, cols=8)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    
    ROW_HEIGHT_PT = 12.8
    
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
        r = p.add_run(t(title, is_sutonny_ansi))
        set_run_font_clean(r, font_bn, size_pt=8.5, bold=True)
        
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
        r0 = p0.add_run(fl)
        set_run_font_clean(r0, font_en, size_pt=9, bold=True)
        
        # Col 1: Flat (Yellow)
        c1 = row.cells[1]
        c1.width = Mm(col_widths_mm[1])
        set_cell_properties(c1, fill_hex=HEX_YELLOW, v_align="center", pad_top=8, pad_bot=8)
        p1 = c1.paragraphs[0]
        p1.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p1.paragraph_format.space_before = Pt(0)
        p1.paragraph_format.space_after = Pt(0)
        r1 = p1.add_run(flat)
        set_run_font_clean(r1, font_en, size_pt=9, bold=True)
        
        # Col 2: Name (Yellow)
        c2 = row.cells[2]
        c2.width = Mm(col_widths_mm[2])
        set_cell_properties(c2, fill_hex=HEX_YELLOW, v_align="center", pad_top=8, pad_bot=8, pad_left=30)
        p2 = c2.paragraphs[0]
        p2.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p2.paragraph_format.space_before = Pt(0)
        p2.paragraph_format.space_after = Pt(0)
        r2 = p2.add_run(t(name, is_sutonny_ansi))
        set_run_font_clean(r2, font_bn, size_pt=8.5, bold=True)
        
        # Col 3: Meter (Yellow)
        c3 = row.cells[3]
        c3.width = Mm(col_widths_mm[3])
        set_cell_properties(c3, fill_hex=HEX_YELLOW, v_align="center", pad_top=8, pad_bot=8)
        p3 = c3.paragraphs[0]
        p3.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p3.paragraph_format.space_before = Pt(0)
        p3.paragraph_format.space_after = Pt(0)
        r3 = p3.add_run(meter)
        set_run_font_clean(r3, font_en, size_pt=9, bold=True)
        
        # Col 4: Load (Yellow)
        c4 = row.cells[4]
        c4.width = Mm(col_widths_mm[4])
        set_cell_properties(c4, fill_hex=HEX_YELLOW, v_align="center", pad_top=8, pad_bot=8)
        p4 = c4.paragraphs[0]
        p4.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p4.paragraph_format.space_before = Pt(0)
        p4.paragraph_format.space_after = Pt(0)
        r4 = p4.add_run(load)
        set_run_font_clean(r4, font_en, size_pt=9, bold=True)
        
        for c_idx in [5, 6, 7]:
            cell = row.cells[c_idx]
            cell.width = Mm(col_widths_mm[c_idx])
            set_cell_properties(cell, fill_hex=HEX_WHITE, v_align="center", pad_top=8, pad_bot=8)
            p = cell.paragraphs[0]
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)

    # Merges
    table.cell(1, 0).merge(table.cell(2, 0))
    table.cell(4, 0).merge(table.cell(6, 0))
    table.cell(7, 0).merge(table.cell(9, 0))
    table.cell(10, 0).merge(table.cell(12, 0))
    table.cell(13, 0).merge(table.cell(15, 0))
    table.cell(16, 0).merge(table.cell(18, 0))
    table.cell(19, 0).merge(table.cell(21, 0))
    table.cell(22, 0).merge(table.cell(23, 0))
    
    # Subtotal Row
    sub_row = table.rows[23]
    set_row_compact(sub_row, ROW_HEIGHT_PT)
    
    sub_cell_left = sub_row.cells[0].merge(sub_row.cells[4])
    set_cell_properties(sub_cell_left, fill_hex=HEX_WHITE, v_align="center", pad_top=8, pad_bot=8)
    p_sub_left = sub_cell_left.paragraphs[0]
    p_sub_left.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub_left.paragraph_format.space_before = Pt(0)
    p_sub_left.paragraph_format.space_after = Pt(0)
    r_sub_left = p_sub_left.add_run(t('২২মিটার', is_sutonny_ansi))
    set_run_font_clean(r_sub_left, font_bn, size_pt=9.5, bold=True)
    
    c5 = sub_row.cells[5]
    set_cell_properties(c5, fill_hex=HEX_WHITE, v_align="center", pad_top=8, pad_bot=8)
    p5 = c5.paragraphs[0]
    p5.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p5.paragraph_format.space_before = Pt(0)
    p5.paragraph_format.space_after = Pt(0)
    r5 = p5.add_run(t('ভাড়াটিয়ার মোট বিল=', is_sutonny_ansi))
    set_run_font_clean(r5, font_bn, size_pt=8.5, bold=True)
    
    for c_idx in [6, 7]:
        c = sub_row.cells[c_idx]
        set_cell_properties(c, fill_hex=HEX_WHITE, v_align="center", pad_top=8, pad_bot=8)
        p = c.paragraphs[0]
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(0)

    # Owner Rows (Rows 24 to 31) - Cyan Fill
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
        set_run_font_clean(r1, font_en, size_pt=9, bold=True)
        
        c2 = row.cells[2]
        c2.width = Mm(col_widths_mm[2])
        set_cell_properties(c2, fill_hex=HEX_CYAN, v_align="center", pad_top=8, pad_bot=8, pad_left=30)
        p2 = c2.paragraphs[0]
        p2.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p2.paragraph_format.space_before = Pt(0)
        p2.paragraph_format.space_after = Pt(0)
        r2 = p2.add_run(t(name, is_sutonny_ansi))
        set_run_font_clean(r2, font_bn, size_pt=8.5, bold=True)
        
        c3 = row.cells[3]
        c3.width = Mm(col_widths_mm[3])
        set_cell_properties(c3, fill_hex=HEX_CYAN, v_align="center", pad_top=8, pad_bot=8)
        p3 = c3.paragraphs[0]
        p3.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p3.paragraph_format.space_before = Pt(0)
        p3.paragraph_format.space_after = Pt(0)
        if meter == 'লিফট':
            r3 = p3.add_run(t(meter, is_sutonny_ansi))
            set_run_font_clean(r3, font_bn, size_pt=9, bold=True)
        else:
            r3 = p3.add_run(meter)
            set_run_font_clean(r3, font_en, size_pt=9, bold=True)
        
        c4 = row.cells[4]
        c4.width = Mm(col_widths_mm[4])
        set_cell_properties(c4, fill_hex=HEX_CYAN, v_align="center", pad_top=8, pad_bot=8)
        p4 = c4.paragraphs[0]
        p4.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p4.paragraph_format.space_before = Pt(0)
        p4.paragraph_format.space_after = Pt(0)
        r4 = p4.add_run(load)
        set_run_font_clean(r4, font_en, size_pt=9, bold=True)
        
        for c_idx in [5, 6, 7]:
            cell = row.cells[c_idx]
            cell.width = Mm(col_widths_mm[c_idx])
            set_cell_properties(cell, fill_hex=HEX_CYAN, v_align="center", pad_top=8, pad_bot=8)
            p = cell.paragraphs[0]
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)

    # Grand Total Rows (32, 33, 34)
    r32 = table.rows[32]
    set_row_compact(r32, ROW_HEIGHT_PT)
    c_left_32 = r32.cells[0].merge(r32.cells[4])
    set_cell_properties(c_left_32, fill_hex=HEX_WHITE, v_align="center", pad_top=8, pad_bot=8)
    p32_l = c_left_32.paragraphs[0]
    p32_l.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p32_l.paragraph_format.space_before = Pt(0)
    p32_l.paragraph_format.space_after = Pt(0)
    r32_l = p32_l.add_run(t('৮টি মিটার = ২২ +৮=৩০', is_sutonny_ansi))
    set_run_font_clean(r32_l, font_bn, size_pt=8.5, bold=True)
    
    c32_mid = r32.cells[5]
    set_cell_properties(c32_mid, fill_hex=HEX_WHITE, v_align="center", pad_top=8, pad_bot=8)
    p32_m = c32_mid.paragraphs[0]
    p32_m.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p32_m.paragraph_format.space_before = Pt(0)
    p32_m.paragraph_format.space_after = Pt(0)
    r32_m = p32_m.add_run(t('মালিকের মোট বিল=', is_sutonny_ansi))
    set_run_font_clean(r32_m, font_bn, size_pt=8, bold=True)
    
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
    r33_m = p33_m.add_run(t('ভাড়াটিয়ার মোট বিল=', is_sutonny_ansi))
    set_run_font_clean(r33_m, font_bn, size_pt=8, bold=True)
    
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
    r34_m = p34_m.add_run(t('মোট বিল=', is_sutonny_ansi))
    set_run_font_clean(r34_m, font_bn, size_pt=8, bold=True)
    
    for c_idx in [6, 7]:
        c = r34.cells[c_idx]
        set_cell_properties(c, fill_hex=HEX_WHITE, v_align="center", pad_top=8, pad_bot=8)
        p = c.paragraphs[0]
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(0)

    add_footer(doc, is_page_2=False, is_sutonny_ansi=is_sutonny_ansi)

def generate_rent_sheet(doc, is_sutonny_ansi=False):
    font_bn = "SutonnyMJ" if is_sutonny_ansi else "SutonnyUniGMJ"
    font_en = "SutonnyMJ" if is_sutonny_ansi else "Arial"
    
    sec = doc.sections[-1] if len(doc.sections) > 1 else doc.sections[0]
    sec.page_width = Mm(210)
    sec.page_height = Mm(297)
    sec.top_margin = Mm(8)
    sec.bottom_margin = Mm(8)
    sec.left_margin = Mm(10)
    sec.right_margin = Mm(10)
    
    add_header(doc, is_page_2=True, is_sutonny_ansi=is_sutonny_ansi)
    
    col_widths_mm = [14, 16, 44, 21, 18, 22, 17, 16, 22]
    table = doc.add_table(rows=25, cols=9)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    
    ROW_HEIGHT_PT = 17
    
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
        r = p.add_run(t(title, is_sutonny_ansi))
        set_run_font_clean(r, font_bn, size_pt=8.5, bold=True)
        
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
        r0 = p0.add_run(fl)
        set_run_font_clean(r0, font_en, size_pt=9, bold=True)
        
        c1 = row.cells[1]
        c1.width = Mm(col_widths_mm[1])
        set_cell_properties(c1, fill_hex=HEX_WHITE, v_align="center", pad_top=12, pad_bot=12)
        p1 = c1.paragraphs[0]
        p1.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p1.paragraph_format.space_before = Pt(0)
        p1.paragraph_format.space_after = Pt(0)
        r1 = p1.add_run(flat)
        set_run_font_clean(r1, font_en, size_pt=9, bold=True)
        
        c2 = row.cells[2]
        c2.width = Mm(col_widths_mm[2])
        set_cell_properties(c2, fill_hex=HEX_WHITE, v_align="center", pad_top=12, pad_bot=12, pad_left=30)
        p2 = c2.paragraphs[0]
        p2.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p2.paragraph_format.space_before = Pt(0)
        p2.paragraph_format.space_after = Pt(0)
        r2 = p2.add_run(t(name, is_sutonny_ansi))
        set_run_font_clean(r2, font_bn, size_pt=8.5, bold=True)
        
        c3 = row.cells[3]
        c3.width = Mm(col_widths_mm[3])
        set_cell_properties(c3, fill_hex=HEX_WHITE, v_align="center", pad_top=12, pad_bot=12)
        p3 = c3.paragraphs[0]
        p3.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p3.paragraph_format.space_before = Pt(0)
        p3.paragraph_format.space_after = Pt(0)
        r3 = p3.add_run(t(rent, is_sutonny_ansi))
        set_run_font_clean(r3, font_bn, size_pt=9, bold=True)
        
        c4 = row.cells[4]
        c4.width = Mm(col_widths_mm[4])
        set_cell_properties(c4, fill_hex=HEX_WHITE, v_align="center", pad_top=12, pad_bot=12)
        p4 = c4.paragraphs[0]
        p4.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p4.paragraph_format.space_before = Pt(0)
        p4.paragraph_format.space_after = Pt(0)
        r4 = p4.add_run(t(gas, is_sutonny_ansi))
        set_run_font_clean(r4, font_bn, size_pt=9, bold=True)
        
        c5 = row.cells[5]
        c5.width = Mm(col_widths_mm[5])
        set_cell_properties(c5, fill_hex=HEX_WHITE, v_align="center", pad_top=12, pad_bot=12)
        p5 = c5.paragraphs[0]
        p5.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p5.paragraph_format.space_before = Pt(0)
        p5.paragraph_format.space_after = Pt(0)
        r5 = p5.add_run(t(total, is_sutonny_ansi))
        set_run_font_clean(r5, font_bn, size_pt=9, bold=True, color=COLOR_RED)
        
        for c_idx in [6, 7, 8]:
            cell = row.cells[c_idx]
            cell.width = Mm(col_widths_mm[c_idx])
            set_cell_properties(cell, fill_hex=HEX_WHITE, v_align="center", pad_top=12, pad_bot=12)
            p = cell.paragraphs[0]
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)

    # Merges
    table.cell(1, 0).merge(table.cell(2, 0))
    table.cell(3, 0).merge(table.cell(4, 0))
    table.cell(5, 0).merge(table.cell(7, 0))
    table.cell(8, 0).merge(table.cell(10, 0))
    table.cell(11, 0).merge(table.cell(13, 0))
    table.cell(14, 0).merge(table.cell(16, 0))
    table.cell(17, 0).merge(table.cell(19, 0))
    table.cell(20, 0).merge(table.cell(22, 0))
    table.cell(23, 0).merge(table.cell(24, 0))

    # Total Row
    tot_row = table.rows[24]
    set_row_compact(tot_row, ROW_HEIGHT_PT)
    
    tot_label_cell = tot_row.cells[0].merge(tot_row.cells[2])
    set_cell_properties(tot_label_cell, fill_hex=HEX_WHITE, v_align="center", pad_top=12, pad_bot=12, pad_right=30)
    p_tot = tot_label_cell.paragraphs[0]
    p_tot.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    p_tot.paragraph_format.space_before = Pt(0)
    p_tot.paragraph_format.space_after = Pt(0)
    r_tot = p_tot.add_run(t('মোট=', is_sutonny_ansi))
    set_run_font_clean(r_tot, font_bn, size_pt=9.5, bold=True)
    
    c3_tot = tot_row.cells[3]
    set_cell_properties(c3_tot, fill_hex=HEX_WHITE, v_align="center", pad_top=12, pad_bot=12)
    p3_tot = c3_tot.paragraphs[0]
    p3_tot.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p3_tot.paragraph_format.space_before = Pt(0)
    p3_tot.paragraph_format.space_after = Pt(0)
    r3_tot = p3_tot.add_run(t('৩০৫,০০০', is_sutonny_ansi))
    set_run_font_clean(r3_tot, font_bn, size_pt=9.5, bold=True)
    
    c4_tot = tot_row.cells[4]
    set_cell_properties(c4_tot, fill_hex=HEX_WHITE, v_align="center", pad_top=12, pad_bot=12)
    p4_tot = c4_tot.paragraphs[0]
    p4_tot.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p4_tot.paragraph_format.space_before = Pt(0)
    p4_tot.paragraph_format.space_after = Pt(0)
    r4_tot = p4_tot.add_run(t('৩৪,৫০০', is_sutonny_ansi))
    set_run_font_clean(r4_tot, font_bn, size_pt=9.5, bold=True)
    
    c5_tot = tot_row.cells[5]
    set_cell_properties(c5_tot, fill_hex=HEX_WHITE, v_align="center", pad_top=12, pad_bot=12)
    p5_tot = c5_tot.paragraphs[0]
    p5_tot.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p5_tot.paragraph_format.space_before = Pt(0)
    p5_tot.paragraph_format.space_after = Pt(0)
    r5_tot = p5_tot.add_run(t('৩৪৯,০০০', is_sutonny_ansi))
    set_run_font_clean(r5_tot, font_bn, size_pt=9.5, bold=True, color=COLOR_RED)
    
    for c_idx in [6, 7, 8]:
        c = tot_row.cells[c_idx]
        set_cell_properties(c, fill_hex=HEX_WHITE, v_align="center", pad_top=12, pad_bot=12)
        p = c.paragraphs[0]
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(0)

    add_footer(doc, is_page_2=True, is_sutonny_ansi=is_sutonny_ansi)

def build_all():
    ws = r"e:\maa-motors-erp"
    
    # 1. Native SutonnyMJ Files (Direct SutonnyMJ in Word)
    print("Building SutonnyMJ files...")
    doc1_s = Document()
    generate_meter_sheet(doc1_s, is_sutonny_ansi=True)
    doc1_s.save(os.path.join(ws, "Ishrak_Tower_Electricity_Meter_Sheet_SutonnyMJ.docx"))
    
    doc2_s = Document()
    generate_rent_sheet(doc2_s, is_sutonny_ansi=True)
    doc2_s.save(os.path.join(ws, "Ishrak_Tower_Monthly_Rent_Sheet_SutonnyMJ.docx"))
    
    doc_m_s = Document()
    generate_meter_sheet(doc_m_s, is_sutonny_ansi=True)
    doc_m_s.add_section(docx.enum.section.WD_SECTION_START.NEW_PAGE)
    generate_rent_sheet(doc_m_s, is_sutonny_ansi=True)
    doc_m_s.save(os.path.join(ws, "Ishrak_Tower_Master_Sheets_SutonnyMJ.docx"))
    
    # 2. Unicode Files with clean SutonnyUniGMJ (No duplicate conflicting tags)
    print("Building clean Unicode files (SutonnyUniGMJ)...")
    doc1_u = Document()
    generate_meter_sheet(doc1_u, is_sutonny_ansi=False)
    doc1_u.save(os.path.join(ws, "Ishrak_Tower_Electricity_Meter_Sheet.docx"))
    
    doc2_u = Document()
    generate_rent_sheet(doc2_u, is_sutonny_ansi=False)
    doc2_u.save(os.path.join(ws, "Ishrak_Tower_Monthly_Rent_Sheet.docx"))
    
    doc_m_u = Document()
    generate_meter_sheet(doc_m_u, is_sutonny_ansi=False)
    doc_m_u.add_section(docx.enum.section.WD_SECTION_START.NEW_PAGE)
    generate_rent_sheet(doc_m_u, is_sutonny_ansi=False)
    doc_m_u.save(os.path.join(ws, "Ishrak_Tower_Master_Sheets.docx"))

    print("All documents generated successfully!")

if __name__ == "__main__":
    build_all()
