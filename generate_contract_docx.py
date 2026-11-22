import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.section import WD_SECTION
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

def set_nikosh_font(run, size_pt=12, bold=False, italic=False, underline=False):
    """
    Sets font to Nikosh for both Western and Complex Script (Bengali Unicode) in MS Word,
    and enforces strict monochrome pure black color (No color).
    """
    run.font.name = 'Nikosh'
    run.font.size = Pt(size_pt)
    run.bold = bold
    run.italic = italic
    run.underline = underline
    run.font.color.rgb = RGBColor(0, 0, 0)  # Pure Black (কোনো কালার নেই)
    
    # XML level enforcement for Bengali Complex Script (w:cs="Nikosh")
    rPr = run._r.get_or_add_rPr()
    rFonts = rPr.find(qn('w:rFonts'))
    if rFonts is None:
        rFonts = OxmlElement('w:rFonts')
        rPr.append(rFonts)
    rFonts.set(qn('w:ascii'), 'Nikosh')
    rFonts.set(qn('w:hAnsi'), 'Nikosh')
    rFonts.set(qn('w:cs'), 'Nikosh')

def set_cell_margins(cell, top=60, bottom=60, left=60, right=60):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def build_contract(filename, is_stamp_mode=True):
    doc = Document()
    
    # Configure Default Style
    style = doc.styles['Normal']
    font = style.font
    font.name = 'Nikosh'
    font.size = Pt(12)
    font.color.rgb = RGBColor(0, 0, 0)
    
    # Page setup
    p_width = Inches(8.5) if is_stamp_mode else Inches(8.27)
    p_height = Inches(14.0) if is_stamp_mode else Inches(11.69)
    top_m = Inches(4.25) if is_stamp_mode else Inches(1.0)
    bot_m = Inches(1.0)
    left_m = Inches(1.25)
    right_m = Inches(1.0)
    
    # ----------------------------------------------------
    # SECTION 1: প্রথম পাতা (১ম স্ট্যাম্প বা পাতা ১)
    # ----------------------------------------------------
    s1 = doc.sections[0]
    s1.page_width = p_width
    s1.page_height = p_height
    s1.top_margin = top_m
    s1.bottom_margin = bot_m
    s1.left_margin = left_m
    s1.right_margin = right_m
    
    # Bismillah
    p_bis = doc.add_paragraph()
    p_bis.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_bis.paragraph_format.space_after = Pt(4)
    r_bis = p_bis.add_run("।। বিসমিল্লাহির রাহমানির রাহিম ।।")
    set_nikosh_font(r_bis, size_pt=12.5, bold=True)
    
    # Title
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_after = Pt(2)
    r_title = p_title.add_run("দ্বিপাক্ষিক ব্যবসায়িক / আর্থিক লেনদেন সংক্রান্ত চুক্তিনামা")
    set_nikosh_font(r_title, size_pt=15.5, bold=True)
    
    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_after = Pt(12)
    sub_text = "(অত্র চুক্তিনামা ৩০০ টাকার নন-জুডিশিয়াল স্ট্যাম্পে সম্পাদিত)" if is_stamp_mode else "(দ্বিপাক্ষিক অফিসিয়াল চুক্তিনামার প্রাথমিক খসড়া)"
    r_sub = p_sub.add_run(sub_text)
    set_nikosh_font(r_sub, size_pt=10, italic=True)
    
    # Party 1 Box/Section
    p_p1 = doc.add_paragraph()
    p_p1.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p_p1.paragraph_format.line_spacing = 1.15
    p_p1.paragraph_format.space_after = Pt(6)
    
    r1_h = p_p1.add_run("১ম পক্ষ (অর্থ প্রদানকারী / মালিক / ঋণদাতা / প্রথম পক্ষ):\n")
    set_nikosh_font(r1_h, size_pt=12, bold=True)
    
    p1_body = (
        "নাম: [১ম পক্ষের পূর্ণ নাম লিখুন]\n"
        "পিতা: [পিতার নাম],  মাতা: [মাতার নাম]\n"
        "জাতীয় পরিচয়পত্র (NID) নম্বর: [-------------------------],  মোবাইল: [০১XXXXXXXXX]\n"
        "বর্তমান ঠিকানা: [বাসা/হোল্ডিং, গ্রাম/মহল্লা, থানা/উপজেলা, জেলা]\n"
        "স্থায়ী ঠিকানা: [গ্রাম/মহল্লা, ডাকঘর, থানা/উপজেলা, জেলা]\n"
        "ধর্ম: [ধর্ম], পেশা: [পেশা], জাতীয়তা: বাংলাদেশি।\n"
    )
    r1_b = p_p1.add_run(p1_body)
    set_nikosh_font(r1_b, size_pt=12)
    
    r1_t = p_p1.add_run("--------------------------------------------------------- (১ম পক্ষ)")
    set_nikosh_font(r1_t, size_pt=11, bold=True, italic=True)
    
    # Versus
    p_vs = doc.add_paragraph()
    p_vs.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_vs.paragraph_format.space_before = Pt(4)
    p_vs.paragraph_format.space_after = Pt(4)
    r_vs = p_vs.add_run("=== বনাম ===")
    set_nikosh_font(r_vs, size_pt=12, bold=True)
    
    # Party 2 Box/Section
    p_p2 = doc.add_paragraph()
    p_p2.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p_p2.paragraph_format.line_spacing = 1.15
    p_p2.paragraph_format.space_after = Pt(8)
    
    r2_h = p_p2.add_run("২য় পক্ষ (অর্থ গ্রহণকারী / অংশীদার / ঋণগ্রহীতা / দ্বিতীয় পক্ষ):\n")
    set_nikosh_font(r2_h, size_pt=12, bold=True)
    
    p2_body = (
        "নাম: [২য় পক্ষের পূর্ণ নাম লিখুন]\n"
        "পিতা: [পিতার নাম],  মাতা: [মাতার নাম]\n"
        "জাতীয় পরিচয়পত্র (NID) নম্বর: [-------------------------],  মোবাইল: [০১XXXXXXXXX]\n"
        "বর্তমান ঠিকানা: [বাসা/হোল্ডিং, গ্রাম/মহল্লা, থানা/উপজেলা, জেলা]\n"
        "স্থায়ী ঠিকানা: [গ্রাম/মহল্লা, ডাকঘর, থানা/উপজেলা, জেলা]\n"
        "ধর্ম: [ধর্ম], পেশা: [পেশা], জাতীয়তা: বাংলাদেশি।\n"
    )
    r2_b = p_p2.add_run(p2_body)
    set_nikosh_font(r2_b, size_pt=12)
    
    r2_t = p_p2.add_run("--------------------------------------------------------- (২য় পক্ষ)")
    set_nikosh_font(r2_t, size_pt=11, bold=True, italic=True)
    
    # Preamble
    p_pre = doc.add_paragraph()
    p_pre.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p_pre.paragraph_format.line_spacing = 1.2
    p_pre.paragraph_format.space_after = Pt(8)
    pre_text = (
        "পরম করুণাময় মহান আল্লাহতায়ালার পবিত্র নাম স্মরণ করিয়া অদ্য ইং [তারিখ লিখুন, যেমন: ০১/১০/২০২৬ইং] "
        "তারিখে [স্থান, যেমন: ঢাকা]-এ আমরা উভয় পক্ষ সুস্থ শরীরে, সুস্থ মস্তিষ্কে, সজ্ঞানে এবং অন্যের বিনা প্ররোচনায় "
        "স্বেচ্ছায় উপস্থিত হইয়া নিম্নবর্ণিত শর্ত সাপেক্ষে অত্র দ্বিপাক্ষিক চুক্তিনামা সম্পাদন করিতেছি:"
    )
    r_pre = p_pre.add_run(pre_text)
    set_nikosh_font(r_pre, size_pt=12)
    
    # Bottom Note for Page 1
    p_foot1 = doc.add_paragraph()
    p_foot1.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p_foot1.paragraph_format.space_before = Pt(16)
    r_foot1 = p_foot1.add_run("১ম পাতার সমাপ্তি _________________________________ [১ম পক্ষের স্বাক্ষর]          [২য় পক্ষের স্বাক্ষর]")
    set_nikosh_font(r_foot1, size_pt=9.5, italic=True)

    # ----------------------------------------------------
    # SECTION 2: দ্বিতীয় পাতা (২য় স্ট্যাম্প বা পাতা ২)
    # ----------------------------------------------------
    s2 = doc.add_section(WD_SECTION.NEW_PAGE)
    s2.page_width = p_width
    s2.page_height = p_height
    s2.top_margin = top_m
    s2.bottom_margin = bot_m
    s2.left_margin = left_m
    s2.right_margin = right_m
    
    # Clause Heading
    p_c_head = doc.add_paragraph()
    p_c_head.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_c_head.paragraph_format.space_after = Pt(10)
    r_ch = p_c_head.add_run("।। চুক্তিনামার মৌলিক শর্তাবলী ও নিয়মাবলী ।।")
    set_nikosh_font(r_ch, size_pt=13, bold=True, underline=True)
    
    clauses = [
        ("১. চুক্তির উদ্দেশ্য ও প্রেক্ষাপট:", 
         "উভয় পক্ষের মধ্যকার পারস্পরিক ব্যবসায়িক সমঝোতা এবং সুনাম বজায় রাখিয়া [চুক্তির বিষয়বস্তু, যেমন: ব্যবসায়িক বিনিয়োগ / অংশীদারি ব্যবসা পরিচালনা / অফিস স্পেস ভাড়া]-এর উদ্দেশ্যে এই চুক্তি সম্পাদিত হইল। অত্র চুক্তিনামার সকল শর্ত উভয় পক্ষ নিষ্ঠার সহিত মানিয়া চলিতে বাধ্য থাকিবেন।"),
        
        ("২. মোট আর্থিক প্রতিদান ও লেনদেনের বিবরণ:", 
         "উক্ত চুক্তির বাবদ সর্বমোট অর্থের পরিমাণ ধার্য করা হইল [টাকার অঙ্ক, যেমন: ৫,০০,০০০/-] টাকা (কথায়: [পাঁচ লক্ষ টাকা মাত্র])। উক্ত অর্থ ২য় পক্ষ ১ম পক্ষের নিকট হইতে অদ্য তারিখে [নগদ গ্রহণ করিলেন / একাউন্ট পেয়ী চেক নং: -------------------, ব্যাংক: -------------------, শাখা: ------------------- এর মাধ্যমে গ্রহণ করিলেন]।"),
        
        ("৩. পরিশোধ / লভ্যাংশ প্রদানের সময়সীমা:", 
         "২য় পক্ষ প্রাপ্ত অর্থ বা নির্ধারিত লভ্যাংশ আগামী [তারিখ লিখুন, যেমন: ৩১/১২/২০২৬ইং] তারিখের মধ্যে ১ম পক্ষকে পরিশোধ করিতে বাধ্য থাকিবেন। যদি কিস্তিতে পরিশোধের বিষয় থাকে, তবে প্রতি ইংরেজি মাসের [০৫] তারিখের মধ্যে মাসিক নির্ধারিত কিস্তির টাকা ১ম পক্ষের ব্যাংক হিসাবে প্রদান নিশ্চিত করিবেন।"),
        
        ("৪. নিরাপত্তা জামানত ও সিকিউরিটি চেক সংক্রান্ত শর্ত:", 
         "আর্থিক নিরাপত্তা ও পারস্পরিক নিশ্চয়তার স্বার্থে ২য় পক্ষ ১ম পক্ষকে [ব্যাংকের নাম]-এর [হিসাব নম্বর]-এর বিপরীতে [চেক নম্বর লিখুন]-এর একটি নিরাপত্তা চেক (Security Cheque) প্রদান করিলেন। ২য় পক্ষ চুক্তি মোতাবেক সমুদয় পাওনা পরিশোধ সম্পন্ন করিলে ১ম পক্ষ উক্ত চেকটি অক্ষত অবস্থায় ২য় পক্ষকে ফেরত প্রদান করিবেন।"),
        
        ("৫. চুক্তির মেয়াদ ও নবায়নের শর্ত:", 
         "অত্র চুক্তিনামা স্বাক্ষরের তারিখ হইতে আগামী [মেয়াদকাল, যেমন: ০১ (এক) বছর] পর্যন্ত অর্থাৎ ইং [সমাপ্তির তারিখ] পর্যন্ত পূর্ণ বলবৎ থাকিবে। মেয়াদের পূর্বে বা পরে উভয় পক্ষের পারস্পরিক লিখিত সম্মতির ভিত্তিতে অত্র চুক্তি নবায়ন বা মেয়াদ বৃদ্ধি করা যাইবে।"),
        
        ("৬. গোপনীয়তা রক্ষা (Confidentiality):", 
         "উভয় পক্ষ এই চুক্তির বিষয়বস্তু, আর্থিক লেনদেনের পরিমাণ এবং ব্যবসায়িক তথ্যাবলীর পূর্ণ গোপনীয়তা রক্ষা করিবেন। কোনো পক্ষই তৃতীয় পক্ষের নিকট অপর পক্ষের ব্যবসায়িক ক্ষতি বা সুনাম ক্ষুণ্ণ হয় এমন কোনো তথ্য প্রকাশ করিতে পারিবেন না।")
    ]
    
    for title, desc in clauses:
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p.paragraph_format.line_spacing = 1.15
        p.paragraph_format.space_after = Pt(6)
        r_t = p.add_run(title + " ")
        set_nikosh_font(r_t, size_pt=12, bold=True)
        r_d = p.add_run(desc)
        set_nikosh_font(r_d, size_pt=12)
        
    # Bottom Note for Page 2
    p_foot2 = doc.add_paragraph()
    p_foot2.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p_foot2.paragraph_format.space_before = Pt(16)
    r_foot2 = p_foot2.add_run("২য় পাতার সমাপ্তি _________________________________ [১ম পক্ষের স্বাক্ষর]          [২য় পক্ষের স্বাক্ষর]")
    set_nikosh_font(r_foot2, size_pt=9.5, italic=True)

    # ----------------------------------------------------
    # SECTION 3: তৃতীয় পাতা (৩য় স্ট্যাম্প বা পাতা ৩)
    # ----------------------------------------------------
    s3 = doc.add_section(WD_SECTION.NEW_PAGE)
    s3.page_width = p_width
    s3.page_height = p_height
    s3.top_margin = top_m
    s3.bottom_margin = bot_m
    s3.left_margin = left_m
    s3.right_margin = right_m
    
    clauses_p3 = [
        ("৭. চুক্তিভঙ্গ ও ক্ষতিপূরণ (Breach & Penalty):", 
         "যদি কোনো পক্ষ অত্র চুক্তিনামার কোনো শর্ত লঙ্ঘন করে বা সময়মতো অর্থ বা দায়িত্ব পালনে ব্যর্থ হয়, তবে অপর পক্ষ উক্ত ক্ষতির জন্য [ক্ষতিপূরণের পরিমাণ, যেমন: নির্ধারিত জরিমানা] দাবি করিতে পারিবেন এবং দেশের প্রচলিত দেওয়ানি ও ফৌজদারি আইনে (দণ্ডবিধি ও এনআই অ্যাক্ট ১৩৮ ধারা মোতাবেক) উপযুক্ত আদালতে আইনগত প্রতিকার পাইতে অধিকারী হইবেন।"),
        
        ("৮. চুক্তি বাতিলকরণ বা অবসান (Termination):", 
         "যদি কোনো পক্ষ চুক্তির মেয়াদ শেষ হইবার পূর্বে অত্র চুক্তি অবসান বা বাতিল করিতে চাহেন, তবে অপর পক্ষকে ন্যূনতম [৩০ (ত্রিশ)] দিন পূর্বে লিখিত নোটিশ প্রদান করিতে হইবে এবং যাবতীয় পাওনা বা হিসাব-নিকাশ কড়ায়-গণ্ডায় নিষ্পত্তি করিতে হইবে।"),
        
        ("৯. অপ্রত্যাশিত দুর্যোগ (Force Majeure):", 
         "যুদ্ধ, মহামারি, সরকারি কঠোর বিধিনিষেধ বা মারাত্মক প্রাকৃতিক দুর্যোগের কারণে কোনো পক্ষ চুক্তি পালনে সাময়িক ব্যর্থ হইলে উভয় পক্ষ আলোচনার ভিত্তিতে সময় বর্ধিতকরণ বা যৌক্তিক সমাধান নির্ধারণ করিবেন।"),
        
        ("১০. বিরোধ নিষ্পত্তি ও আইনগত এখতিয়ার (Dispute Resolution):", 
         "অত্র চুক্তির কোনো বিষয় লইয়া বিরোধ দেখা দিলে উভয় পক্ষ প্রথমে আলোচনার মাধ্যমে সৌহার্দ্যপূর্ণ নিষ্পত্তির চেষ্টা করিবেন। তাহাতে ব্যর্থ হইলে বাংলাদেশের 'সালিশি আইন, ২০০১' (The Arbitration Act, 2001) অনুযায়ী সালিশের মাধ্যমে নিষ্পত্তি হইবে এবং বিরোধ নিষ্পত্তির এখতিয়ারভুক্ত এলাকা হইবে [যেমন: ঢাকা] আদালত।"),
         
        ("১১. চূড়ান্ত অঙ্গীকার ও সম্মতি:", 
         "আমরা উভয় পক্ষ অত্র চুক্তিনামার প্রতিটি ধারা ও শর্ত নিজেরা পাঠ করিয়া এবং আইনজীবীর পরামর্শে অর্থ ও মর্ম সম্পূর্ণ অবগত হইয়া, সুস্থ মস্তিষ্কে এবং সাক্ষীগণের সম্মুখে স্বেচ্ছায় নিজ নিজ নাম স্বাক্ষর করিলাম।")
    ]
    
    for title, desc in clauses_p3:
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p.paragraph_format.line_spacing = 1.15
        p.paragraph_format.space_after = Pt(6)
        r_t = p.add_run(title + " ")
        set_nikosh_font(r_t, size_pt=12, bold=True)
        r_d = p.add_run(desc)
        set_nikosh_font(r_d, size_pt=12)

    # Date and Place of Execution
    p_date = doc.add_paragraph()
    p_date.paragraph_format.space_before = Pt(8)
    p_date.paragraph_format.space_after = Pt(12)
    p_date.alignment = WD_ALIGN_PARAGRAPH.LEFT
    r_d = p_date.add_run("চুক্তি সম্পাদনের তারিখ: [ইং তারিখ লিখুন]                           সম্পাদনের স্থান: [স্থান, যেমন: ঢাকা]")
    set_nikosh_font(r_d, size_pt=12, bold=True)
    
    # Signatures Table (100% Monochrome Black)
    t_sig = doc.add_table(rows=1, cols=2)
    t_sig.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_sig.autofit = False
    
    cell_w = Inches(3.0)
    for row in t_sig.rows:
        for cell in row.cells:
            cell.width = cell_w
            set_cell_margins(cell, top=60, bottom=60, left=60, right=60)
            
    c00 = t_sig.cell(0, 0).paragraphs[0]
    c00.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_s1_l = c00.add_run("______________________________\n")
    set_nikosh_font(r_s1_l, size_pt=12, bold=True)
    r_s1_t = c00.add_run("১ম পক্ষের পূর্ণাঙ্গ স্বাক্ষর\n")
    set_nikosh_font(r_s1_t, size_pt=12, bold=True)
    r_s1_i = c00.add_run("নাম: [..............................................]\nমোবাইল: [..........................................]\n")
    set_nikosh_font(r_s1_i, size_pt=11.5)
    
    c01 = t_sig.cell(0, 1).paragraphs[0]
    c01.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_s2_l = c01.add_run("______________________________\n")
    set_nikosh_font(r_s2_l, size_pt=12, bold=True)
    r_s2_t = c01.add_run("২য় পক্ষের পূর্ণাঙ্গ স্বাক্ষর\n")
    set_nikosh_font(r_s2_t, size_pt=12, bold=True)
    r_s2_i = c01.add_run("নাম: [..............................................]\nমোবাইল: [..........................................]\n")
    set_nikosh_font(r_s2_i, size_pt=11.5)

    # Witness Title
    p_wit_title = doc.add_paragraph()
    p_wit_title.paragraph_format.space_before = Pt(14)
    p_wit_title.paragraph_format.space_after = Pt(6)
    p_wit_title.alignment = WD_ALIGN_PARAGRAPH.LEFT
    r_wt = p_wit_title.add_run("উভয় পক্ষের উপস্থিতিতে সাক্ষীগণের স্বাক্ষর ও পরিচয়:")
    set_nikosh_font(r_wt, size_pt=11.5, bold=True, underline=True)

    # Witnesses Table
    t_wit = doc.add_table(rows=1, cols=2)
    t_wit.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_wit.autofit = False
    
    for row in t_wit.rows:
        for cell in row.cells:
            cell.width = cell_w
            set_cell_margins(cell, top=60, bottom=60, left=60, right=60)
            
    w1 = t_wit.cell(0, 0).paragraphs[0]
    w1.paragraph_format.line_spacing = 1.15
    r_w1_s = w1.add_run("১ নং সাক্ষীর স্বাক্ষর: ____________________\n")
    set_nikosh_font(r_w1_s, size_pt=11.5, bold=True)
    w1_info = (
        "নাম: [সাক্ষীর পূর্ণ নাম]\n"
        "পিতা: [পিতার নাম]\n"
        "এনআইডি: [---------------------------------]\n"
        "ঠিকানা: [ঠিকানা]\n"
        "মোবাইল: [০১XXXXXXXXX]\n"
    )
    r_w1_i = w1.add_run(w1_info)
    set_nikosh_font(r_w1_i, size_pt=11)
    
    w2 = t_wit.cell(0, 1).paragraphs[0]
    w2.paragraph_format.line_spacing = 1.15
    r_w2_s = w2.add_run("২ নং সাক্ষীর স্বাক্ষর: ____________________\n")
    set_nikosh_font(r_w2_s, size_pt=11.5, bold=True)
    w2_info = (
        "নাম: [সাক্ষীর পূর্ণ নাম]\n"
        "পিতা: [পিতার নাম]\n"
        "এনআইডি: [---------------------------------]\n"
        "ঠিকানা: [ঠিকানা]\n"
        "মোবাইল: [০১XXXXXXXXX]\n"
    )
    r_w2_i = w2.add_run(w2_info)
    set_nikosh_font(r_w2_i, size_pt=11)

    # Save document safely
    safe_save(doc, filename)

def safe_save(doc, filename):
    import os
    try:
        doc.save(filename)
        print(f"Successfully saved: {filename}")
    except PermissionError:
        base, ext = os.path.splitext(filename)
        fallback = f"{base}_Nikosh{ext}"
        doc.save(fallback)
        print(f"Original file was open in Word. Saved with Nikosh as: {fallback}")

def create_documents():
    # 1. Legal Size with 4.25" Top Margin for Physical 300 Tk Stamp (3 Pages)
    build_contract(
        filename="Deed_of_Agreement_Stamp_Paper.docx",
        is_stamp_mode=True
    )
    
    # 2. Standard A4 Size for Office Review / General Agreement
    build_contract(
        filename="Deed_of_Agreement_Standard_A4.docx",
        is_stamp_mode=False
    )
    print("All files updated with Nikosh font & 100% monochrome black text.")


if __name__ == "__main__":
    create_documents()
