import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor, Mm
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn
import subprocess

# Color definitions
COLOR_MAROON = RGBColor(123, 17, 19)      # #7B1113 (Title)
COLOR_RED = RGBColor(192, 0, 0)          # #C00000 (Total Rent in Col 6)
COLOR_NAVY = RGBColor(0, 51, 102)        # #003366 (Footer signature)
COLOR_BLACK = RGBColor(0, 0, 0)

HEX_YELLOW = "FFFF99"   # Yellow accent for meter/load/flat cols
HEX_CYAN = "D2F4FA"     # Light sky blue/cyan for owner section
HEX_WHITE = "FFFFFF"

def set_cell_properties(cell, fill_hex=None, v_align="center", pad_top=28, pad_bot=28, pad_left=50, pad_right=50):
    """Sets background shading, vertical alignment, and cell margins (padding)."""
    tcPr = cell._tc.get_or_add_tcPr()
    
    # Vertical alignment
    if v_align:
        vAlign = parse_xml(f'<w:vAlign {nsdecls("w")} w:val="{v_align}"/>')
        tcPr.append(vAlign)
        
    # Shading
    if fill_hex:
        shd = parse_xml(f'<w:shd {nsdecls("w")} w:val="clear" w:color="auto" w:fill="{fill_hex}"/>')
        tcPr.append(shd)
        
    # Borders: clean thin black border
    tcBorders = parse_xml(f'''
        <w:tcBorders {nsdecls("w")}>
            <w:top w:val="single" w:sz="4" w:space="0" w:color="000000"/>
            <w:left w:val="single" w:sz="4" w:space="0" w:color="000000"/>
            <w:bottom w:val="single" w:sz="4" w:space="0" w:color="000000"/>
            <w:right w:val="single" w:sz="4" w:space="0" w:color="000000"/>
        </w:tcBorders>
    ''')
    tcPr.append(tcBorders)
    
    # Cell padding (in dxa: 20 dxa = 1 pt)
    tcMar = parse_xml(f'''
        <w:tcMar {nsdecls("w")}>
            <w:top w:w="{pad_top}" w:type="dxa"/>
            <w:bottom w:w="{pad_bot}" w:type="dxa"/>
            <w:left w:w="{pad_left}" w:type="dxa"/>
            <w:right w:w="{pad_right}" w:type="dxa"/>
        </w:tcMar>
    ''')
    tcPr.append(tcMar)

def format_run(run, font_name="Nirmala UI", size_pt=9.5, bold=False, color=COLOR_BLACK, italic=False, underline=False):
    """Sets font styling including complex script properties for Bengali."""
    run.font.name = font_name
    run.font.size = Pt(size_pt)
    run.bold = bold
    run.italic = italic
    run.underline = underline
    run.font.color.rgb = color
    
    rPr = run._r.get_or_add_rPr()
    rFonts = parse_xml(f'<w:rFonts {nsdecls("w")} w:ascii="{font_name}" w:hAnsi="{font_name}" w:cs="{font_name}"/>')
    rPr.append(rFonts)

def set_row_height(row, height_pt):
    """Sets exact row height in points."""
    trPr = row._tr.get_or_add_trPr()
    trHeight = parse_xml(f'<w:trHeight {nsdecls("w")} w:val="{int(height_pt * 20)}" w:hRule="atLeast"/>')
    trPr.append(trHeight)

def add_header_block(doc, is_page_2=False):
    """Adds the authentic header block matching the scanned document."""
    # Top Line: Bismillah (Center) & Date/Month (Right)
    # Using a 2-column borderless table for perfect alignment
    top_tbl = doc.add_table(rows=1, cols=2)
    top_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    top_tbl.autofit = False
    
    # Col 0: Bismillah centered
    c0 = top_tbl.cell(0, 0)
    c0.width = Mm(130)
    p0 = c0.paragraphs[0]
    p0.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p0.paragraph_format.space_before = Pt(0)
    p0.paragraph_format.space_after = Pt(0)
    p0.paragraph_format.line_spacing = 1.0
    r0 = p0.add_run('বিসমিল্লাহির রাহমানির রাহিম')
    format_run(r0, size_pt=10.5, bold=True)
    
    # Col 1: Date & Month right aligned
    c1 = top_tbl.cell(0, 1)
    c1.width = Mm(50)
    p1 = c1.paragraphs[0]
    p1.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    p1.paragraph_format.space_before = Pt(0)
    p1.paragraph_format.space_after = Pt(0)
    p1.paragraph_format.line_spacing = 1.0
    r1 = p1.add_run('তারিখ: ____________\nমাস: ____________')
    format_run(r1, size_pt=9.5, bold=True)
    
    # Remove borders from top_tbl
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
    p_title.paragraph_format.space_before = Pt(2)
    p_title.paragraph_format.space_after = Pt(1)
    p_title.paragraph_format.line_spacing = 1.0
    r_title = p_title.add_run('ইশরাক টাওয়ার')
    format_run(r_title, size_pt=23, bold=True, color=COLOR_MAROON)
    
    # Owner Line
    p_owner = doc.add_paragraph()
    p_owner.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_owner.paragraph_format.space_before = Pt(0)
    p_owner.paragraph_format.space_after = Pt(1)
    p_owner.paragraph_format.line_spacing = 1.0
    owner_text = 'মালিক মোহাম্মদ এমরান' if is_page_2 else 'মালিক: মোহাম্মদ এমরান'
    r_owner = p_owner.add_run(owner_text)
    format_run(r_owner, size_pt=11.5, bold=True)
    
    # Address Line
    p_addr = doc.add_paragraph()
    p_addr.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_addr.paragraph_format.space_before = Pt(0)
    p_addr.paragraph_format.space_after = Pt(1)
    p_addr.paragraph_format.line_spacing = 1.0
    r_addr = p_addr.add_run('৩৩৩১/৫০৫৩, ফিরোজশাহ্, বা/এ, ডাকঘর: ফিরোজশাহ্-৪২০৭, থানা: আকবরশাহ্, জেলা: চট্টগ্রাম।')
    format_run(r_addr, size_pt=9.5, bold=True)
    
    # Mobile Line
    p_mob = doc.add_paragraph()
    p_mob.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_mob.paragraph_format.space_before = Pt(0)
    p_mob.paragraph_format.space_after = Pt(2 if not is_page_2 else 1)
    p_mob.paragraph_format.line_spacing = 1.0
    mob_text = 'মালিক-০১৮১৫-৭০৭৯৩৪, দারোয়ান ০১৯১৯-৭০৭৯৩৪।' if is_page_2 else 'মোবাইল: ০১৮১৫-৭০৭৯৩৪ (মালিক), দারোয়ান: ০১৯১৯-৭০৭৯৩৪।'
    r_mob = p_mob.add_run(mob_text)
    format_run(r_mob, size_pt=9.5, bold=True)
    
    # Subtitle for Page 2
    if is_page_2:
        p_sub = doc.add_paragraph()
        p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_sub.paragraph_format.space_before = Pt(0)
        p_sub.paragraph_format.space_after = Pt(3)
        p_sub.paragraph_format.line_spacing = 1.0
        r_sub = p_sub.add_run('মাসিক ভাড়ার হিসাব-২০২৫ইং')
        format_run(r_sub, size_pt=10.5, bold=True, underline=True)

def add_footer_signature(doc, is_page_2=False):
    """Adds the landlord signature and address block at bottom right."""
    p_foot = doc.add_paragraph()
    p_foot.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    p_foot.paragraph_format.space_before = Pt(4)
    p_foot.paragraph_format.space_after = Pt(0)
    p_foot.paragraph_format.line_spacing = 1.05
    
    foot_color = COLOR_NAVY if is_page_2 else COLOR_BLACK
    r_sig = p_foot.add_run('(মোঃ এমরান)\n')
    format_run(r_sig, size_pt=10, bold=True, color=foot_color)
    
    if is_page_2:
        r_txt = p_foot.add_run('ইশরাক টাওয়ার সি/৩৪, ফিরোজশাহ, বা/এ\nথানা- আকবরশাহ, জেলা- চট্টগ্রাম।')
    else:
        r_txt = p_foot.add_run('ইশরাক টাওয়ার, সি/৩৪, ফিরোজশাহ্, বা/এ\nআকবরশাহ্, চট্টগ্রাম।')
    format_run(r_txt, size_pt=9, bold=True, color=foot_color)

print("Helper functions ready")
