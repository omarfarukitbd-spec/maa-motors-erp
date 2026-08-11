import os
import sys

try:
    import xlsxwriter
except ImportError:
    os.system(f'"{sys.executable}" -m pip install xlsxwriter')
    import xlsxwriter

filepath = r'd:\Office Excel\Business_Ledger_Pro_UI_Design.xlsx'
os.makedirs(os.path.dirname(filepath), exist_ok=True)

workbook = xlsxwriter.Workbook(filepath)

# ==========================================
# FORMATS FOR DASHBOARD UI
# ==========================================
sheet_bg = workbook.add_format({'bg_color': '#F4F6F7'}) # Light gray background for the app feel

header_box = workbook.add_format({
    'bg_color': '#154360', 'font_color': 'white', 'bold': True, 
    'font_size': 18, 'align': 'center', 'valign': 'vcenter', 'text_wrap': True,
    'border': 1, 'border_color': '#1A5276', 'locked': True
})

footer_box = workbook.add_format({
    'bg_color': '#EBF5FB', 'font_color': '#2874A6', 'font_size': 11, 
    'align': 'center', 'valign': 'vcenter', 'border': 1, 'border_color': '#AED6F1', 'locked': True
})

# Card 1: Total Due (Green)
strip_green = workbook.add_format({'bg_color': '#27AE60', 'top': 1, 'bottom': 1, 'left': 1, 'border_color': '#D5DBDB', 'locked': True})
icon_green = workbook.add_format({'bg_color': '#FFFFFF', 'top': 1, 'bottom': 1, 'align': 'center', 'valign': 'vcenter', 'font_size': 26, 'border_color': '#D5DBDB', 'locked': True})
title_green = workbook.add_format({'bg_color': '#FFFFFF', 'top': 1, 'align': 'left', 'valign': 'bottom', 'font_color': '#2C3E50', 'bold': True, 'font_size': 15, 'border_color': '#D5DBDB', 'locked': True})
sub_green = workbook.add_format({'bg_color': '#FFFFFF', 'bottom': 1, 'align': 'left', 'valign': 'top', 'font_color': '#7F8C8D', 'font_size': 11, 'border_color': '#D5DBDB', 'locked': True})
val_green = workbook.add_format({'bg_color': '#FFFFFF', 'top': 1, 'bottom': 1, 'right': 1, 'align': 'right', 'valign': 'vcenter', 'font_color': '#1E8449', 'bold': True, 'font_size': 22, 'num_format': '#,##0.00 "৳"', 'border_color': '#D5DBDB', 'locked': True})

# Card 2: Customers (Blue)
strip_blue = workbook.add_format({'bg_color': '#2980B9', 'top': 1, 'bottom': 1, 'left': 1, 'border_color': '#D5DBDB', 'locked': True})
icon_blue = workbook.add_format({'bg_color': '#FFFFFF', 'top': 1, 'bottom': 1, 'align': 'center', 'valign': 'vcenter', 'font_size': 26, 'border_color': '#D5DBDB', 'locked': True})
title_blue = workbook.add_format({'bg_color': '#FFFFFF', 'top': 1, 'align': 'left', 'valign': 'bottom', 'font_color': '#2C3E50', 'bold': True, 'font_size': 15, 'border_color': '#D5DBDB', 'locked': True})
sub_blue = workbook.add_format({'bg_color': '#FFFFFF', 'bottom': 1, 'align': 'left', 'valign': 'top', 'font_color': '#7F8C8D', 'font_size': 11, 'border_color': '#D5DBDB', 'locked': True})
val_blue = workbook.add_format({'bg_color': '#FFFFFF', 'top': 1, 'bottom': 1, 'right': 1, 'align': 'right', 'valign': 'vcenter', 'font_color': '#21618C', 'bold': True, 'font_size': 22, 'num_format': '0 "জন"', 'border_color': '#D5DBDB', 'locked': True})

# Card 3: Collection (Orange)
strip_orange = workbook.add_format({'bg_color': '#D35400', 'top': 1, 'bottom': 1, 'left': 1, 'border_color': '#D5DBDB', 'locked': True})
icon_orange = workbook.add_format({'bg_color': '#FFFFFF', 'top': 1, 'bottom': 1, 'align': 'center', 'valign': 'vcenter', 'font_size': 26, 'border_color': '#D5DBDB', 'locked': True})
title_orange = workbook.add_format({'bg_color': '#FFFFFF', 'top': 1, 'align': 'left', 'valign': 'bottom', 'font_color': '#2C3E50', 'bold': True, 'font_size': 15, 'border_color': '#D5DBDB', 'locked': True})
sub_orange = workbook.add_format({'bg_color': '#FFFFFF', 'bottom': 1, 'align': 'left', 'valign': 'top', 'font_color': '#7F8C8D', 'font_size': 11, 'border_color': '#D5DBDB', 'locked': True})
val_orange = workbook.add_format({'bg_color': '#FFFFFF', 'top': 1, 'bottom': 1, 'right': 1, 'align': 'right', 'valign': 'vcenter', 'font_color': '#BA4A00', 'bold': True, 'font_size': 22, 'num_format': '#,##0.00 "৳"', 'border_color': '#D5DBDB', 'locked': True})


# ==========================================
# COMMON FORMATS FOR OTHER SHEETS
# ==========================================
header_format = workbook.add_format({'bold': True, 'font_color': 'white', 'bg_color': '#2C3E50', 'border': 1, 'align': 'center', 'valign': 'vcenter'})
locked_text = workbook.add_format({'border': 1, 'valign': 'vcenter', 'bg_color': '#F4F6F6', 'locked': True})
locked_currency = workbook.add_format({'border': 1, 'valign': 'vcenter', 'num_format': '#,##0.00', 'bg_color': '#F4F6F6', 'bold': True, 'locked': True})
link_format = workbook.add_format({'font_color': '#2874A6', 'underline': True, 'border': 1, 'align': 'center', 'valign': 'vcenter', 'bold': True, 'bg_color': '#EBF5FB', 'locked': True})
unlocked_text = workbook.add_format({'border': 1, 'valign': 'vcenter', 'locked': False})
unlocked_date = workbook.add_format({'border': 1, 'valign': 'vcenter', 'num_format': 'dd/mm/yyyy', 'locked': False})
debit_format = workbook.add_format({'border': 1, 'valign': 'vcenter', 'num_format': '#,##0.00', 'bg_color': '#FDEDEC', 'locked': False}) 
credit_format = workbook.add_format({'border': 1, 'valign': 'vcenter', 'num_format': '#,##0.00', 'bg_color': '#EAFAF1', 'locked': False}) 
red_format = workbook.add_format({'bg_color': '#F2D7D5', 'font_color': '#922B21', 'bold': True})
green_format = workbook.add_format({'bg_color': '#D5F5E3', 'font_color': '#148F77', 'bold': True})
search_highlight = workbook.add_format({'bg_color': '#F9E79F', 'font_color': '#7D6608', 'bold': True})
search_label = workbook.add_format({'bold': True, 'font_size': 12, 'align': 'right', 'valign': 'vcenter', 'font_color': '#1F618D', 'locked': True})
search_box = workbook.add_format({'bold': True, 'font_size': 12, 'align': 'left', 'valign': 'vcenter', 'border': 2, 'bg_color': '#FEF9E7', 'locked': False})

protect_options = {'format_cells': True, 'format_columns': True, 'format_rows': True, 'autofilter': True, 'sort': True}

# ==========================================
# 1. Dashboard Sheet (NEW UI)
# ==========================================
ws_dash = workbook.add_worksheet('ড্যাশবোর্ড')
ws_dash.hide_gridlines(2)
ws_dash.protect('451060', protect_options) 

# Set background for the entire visible area
for col in range(0, 15):
    ws_dash.set_column(col, col, 10, sheet_bg)

ws_dash.set_column('A:A', 5, sheet_bg)
ws_dash.set_column('B:B', 1, sheet_bg)  # Strip
ws_dash.set_column('C:C', 8, sheet_bg)  # Icon
ws_dash.set_column('D:D', 35, sheet_bg) # Text
ws_dash.set_column('E:E', 25, sheet_bg) # Value
ws_dash.set_column('F:F', 5, sheet_bg)  # Right Margin

# Header Box
ws_dash.merge_range('B2:E4', 'তপু ভাই, আল রাফি মোটরস - ড্যাশবোর্ড\nসার্বিক আর্থিক সারসংক্ষেপ', header_box)

# Space
ws_dash.set_row(4, 15, sheet_bg)

# Card 1: Total Due
ws_dash.merge_range('B6:B8', '', strip_green)
ws_dash.merge_range('C6:C8', '💼', icon_green)
ws_dash.merge_range('D6:D7', 'মার্কেট মোট বকেয়া', title_green)
ws_dash.write('D8', 'মোট বকেয়ার পরিমাণ', sub_green)
ws_dash.merge_range('E6:E8', '=SUM(\'কাস্টমার তালিকা\'!E:E)', val_green)
ws_dash.set_row(5, 20)
ws_dash.set_row(6, 20)

# Space
ws_dash.set_row(8, 10, sheet_bg)

# Card 2: Customers
ws_dash.merge_range('B10:B12', '', strip_blue)
ws_dash.merge_range('C10:C12', '👥', icon_blue)
ws_dash.merge_range('D10:D11', 'মোট কাস্টমার সংখ্যা', title_blue)
ws_dash.write('D12', 'সর্বমোট কাস্টমারের সংখ্যা', sub_blue)
ws_dash.merge_range('E10:E12', '=COUNTA(\'কাস্টমার তালিকা\'!A:A)-1', val_blue)
ws_dash.set_row(9, 20)
ws_dash.set_row(10, 20)

# Space
ws_dash.set_row(12, 10, sheet_bg)

# Card 3: Collection
ws_dash.merge_range('B14:B16', '', strip_orange)
ws_dash.merge_range('C14:C16', '💰', icon_orange)
ws_dash.merge_range('D14:D15', 'আজকের মোট কালেকশন', title_orange)
ws_dash.write('D16', 'আজকের মোট আদায়কৃত অর্থ', sub_orange)
ws_dash.merge_range('E14:E16', '=SUMIFS(\'খতিয়ান\'!G:G, \'খতিয়ান\'!A:A, TODAY())', val_orange)
ws_dash.set_row(13, 20)
ws_dash.set_row(14, 20)

# Space
ws_dash.set_row(16, 15, sheet_bg)

# Footer
ws_dash.merge_range('B18:E18', 'ℹ️ নিয়মিত হালনাগাদের জন্য ড্যাশবোর্ড রিফ্রেশ করুন', footer_box)
ws_dash.set_row(17, 30)

# ==========================================
# 2. Customers Sheet
# ==========================================
ws_customers = workbook.add_worksheet('কাস্টমার তালিকা')
ws_customers.hide_gridlines(2)
ws_customers.freeze_panes(3, 0)
ws_customers.protect('451060', protect_options)

ws_customers.set_column('A:A', 15)
ws_customers.set_column('B:B', 35)
ws_customers.set_column('C:C', 20)
ws_customers.set_column('D:D', 35)
ws_customers.set_column('E:E', 20)
ws_customers.set_column('F:F', 30)

ws_customers.set_row(0, 25)
ws_customers.write('B1', '🔍 কাস্টমার বা মোবাইল নম্বর দিয়ে খুঁজুন ➔', search_label)
ws_customers.write('C1', '', search_box)

headers_cust = ['কাস্টমার আইডি', 'কাস্টমারের নাম', 'মোবাইল নম্বর', 'ঠিকানা', 'মোট বকেয়া (অটো)', 'হোয়াটসঅ্যাপ মেসেজ (অটো)']
ws_customers.write_row(2, 0, headers_cust, header_format)

ws_customers.conditional_format('A4:F305', {
    'type': 'formula', 
    'criteria': '=AND($C$1<>"", OR(ISNUMBER(SEARCH($C$1, $B4)), ISNUMBER(SEARCH($C$1, $C4))))', 
    'format': search_highlight
})
ws_customers.conditional_format('E4:E305', {'type': 'cell', 'criteria': '>', 'value': 0, 'format': red_format})
ws_customers.conditional_format('E4:E305', {'type': 'cell', 'criteria': '<=', 'value': 0, 'format': green_format})

for row in range(3, 305):  
    ws_customers.write_blank(row, 0, '', unlocked_text)
    ws_customers.write_blank(row, 1, '', unlocked_text)
    ws_customers.write_blank(row, 2, '', unlocked_text)
    ws_customers.write_blank(row, 3, '', unlocked_text)
    
    formula_due = f'=SUMIF(\'খতিয়ান\'!C:C, A{row+1}, \'খতিয়ান\'!F:F) - SUMIF(\'খতিয়ান\'!C:C, A{row+1}, \'খতিয়ান\'!G:G)'
    ws_customers.write_formula(row, 4, formula_due, locked_currency)
    
    wa_msg = f'"https://wa.me/88"&C{row+1}&"?text=আসসালামু আলাইকুম "&B{row+1}&", আপনার মোট বকেয়া "&TEXT(E{row+1},"0")&" টাকা। অনুগ্রহ করে পরিশোধ করবেন।"'
    formula_wa = f'=IF(OR(ISBLANK(C{row+1}), E{row+1}<=0), "", HYPERLINK({wa_msg}, "✉️ মেসেজ পাঠান"))'
    ws_customers.write_formula(row, 5, formula_wa, link_format)

ws_customers.write(3, 0, 'C-001', unlocked_text)
ws_customers.write(3, 1, 'তপু ভাই, আল রাফি মোটরস', unlocked_text)
ws_customers.write(3, 2, '01720643322', unlocked_text) 
ws_customers.write(3, 3, 'ধোলাইখাল, ঢাকা', unlocked_text)
ws_customers.write(4, 0, 'C-002', unlocked_text)
ws_customers.write(4, 1, 'জামাল, রহমান টাওয়ার', unlocked_text)
ws_customers.write(4, 2, '01676218863', unlocked_text)
ws_customers.write(4, 3, '', unlocked_text)

# ==========================================
# 3. Ledger Sheet
# ==========================================
ws_ledger = workbook.add_worksheet('খতিয়ান')
ws_ledger.hide_gridlines(2)
ws_ledger.freeze_panes(1, 0) 
ws_ledger.protect('451060', protect_options) 

headers_ledger = ['তারিখ', 'কাস্টমারের নাম (সিলেক্ট করুন)', 'কাস্টমার আইডি (অটো)', 'বিবরণ', 'ভাউচার নং', 'খরচ / বাকি (Debit)', 'জমা (Credit)', 'বর্তমান ব্যালেন্স (অটো)']
ws_ledger.write_row(0, 0, headers_ledger, header_format)
ws_ledger.set_column('A:A', 15)
ws_ledger.set_column('B:B', 35)
ws_ledger.set_column('C:C', 20)
ws_ledger.set_column('D:D', 30)
ws_ledger.set_column('E:E', 15)
ws_ledger.set_column('F:H', 25)

ws_ledger.add_table('A1:H1005', {
    'name': 'LedgerTable',
    'total_row': True,
    'columns': [
        {'header': headers_ledger[0], 'total_string': 'সর্বমোট:'},
        {'header': headers_ledger[1]},
        {'header': headers_ledger[2]},
        {'header': headers_ledger[3]},
        {'header': headers_ledger[4]},
        {'header': headers_ledger[5], 'total_function': 'sum', 'format': debit_format},
        {'header': headers_ledger[6], 'total_function': 'sum', 'format': credit_format},
        {'header': headers_ledger[7], 'format': locked_currency}
    ],
    'style': 'Table Style Light 9'
})

for row in range(1, 1004): 
    ws_ledger.set_row(row, 18) 
    ws_ledger.data_validation(row, 1, row, 1, {
        'validate': 'list',
        'source': '=\'কাস্টমার তালিকা\'!$B$4:$B$305'
    })
    formula_id = f'=IF(ISBLANK(B{row+1}), "", INDEX(\'কাস্টমার তালিকা\'!$A$4:$A$305, MATCH(B{row+1}, \'কাস্টমার তালিকা\'!$B$4:$B$305, 0)))'
    ws_ledger.write_formula(row, 2, formula_id, locked_text)
    ws_ledger.write_blank(row, 0, '', unlocked_date) 
    ws_ledger.write_blank(row, 3, '', unlocked_text) 
    ws_ledger.write_blank(row, 4, '', unlocked_text) 
    ws_ledger.write_blank(row, 5, '', debit_format) 
    ws_ledger.write_blank(row, 6, '', credit_format) 
    formula_balance = f'=IF(ISBLANK(C{row+1}), "", SUMIFS(F$2:F{row+1}, C$2:C{row+1}, C{row+1}) - SUMIFS(G$2:G{row+1}, C$2:C{row+1}, C{row+1}))'
    ws_ledger.write_formula(row, 7, formula_balance, locked_currency)

ws_ledger.write(1, 0, '19/09/2022', unlocked_date)
ws_ledger.write(1, 1, 'তপু ভাই, আল রাফি মোটরস', unlocked_text)
ws_ledger.write(1, 3, 'পূর্বের জের', unlocked_text)
ws_ledger.write(1, 4, '2203', unlocked_text)
ws_ledger.write(1, 5, 118000, debit_format)

ws_ledger.write(2, 0, '28/09/2022', unlocked_date)
ws_ledger.write(2, 1, 'তপু ভাই, আল রাফি মোটরস', unlocked_text)
ws_ledger.write(2, 4, '2295', unlocked_text)
ws_ledger.write(2, 5, 85000, debit_format)

workbook.close()
print("Business_Ledger_Pro_UI_Design generated successfully!")
