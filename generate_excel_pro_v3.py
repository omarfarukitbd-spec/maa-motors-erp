import os
import sys

try:
    import xlsxwriter
except ImportError:
    os.system(f'"{sys.executable}" -m pip install xlsxwriter')
    import xlsxwriter

filepath = r'd:\Office Excel\Business_Ledger_Pro_Final_v3.xlsx'
os.makedirs(os.path.dirname(filepath), exist_ok=True)

workbook = xlsxwriter.Workbook(filepath)

# --- Base Formats ---
header_format = workbook.add_format({
    'bold': True, 'font_color': 'white', 'bg_color': '#2C3E50',
    'border': 1, 'align': 'center', 'valign': 'vcenter'
})

locked_text = workbook.add_format({'border': 1, 'valign': 'vcenter', 'bg_color': '#F4F6F6', 'locked': True})
locked_currency = workbook.add_format({'border': 1, 'valign': 'vcenter', 'num_format': '#,##0.00', 'bg_color': '#F4F6F6', 'bold': True, 'locked': True})
link_format = workbook.add_format({
    'font_color': '#2874A6', 'underline': True, 'border': 1, 
    'align': 'center', 'valign': 'vcenter', 'bold': True, 'bg_color': '#EBF5FB', 'locked': True
})

unlocked_text = workbook.add_format({'border': 1, 'valign': 'vcenter', 'locked': False})
unlocked_date = workbook.add_format({'border': 1, 'valign': 'vcenter', 'num_format': 'dd/mm/yyyy', 'locked': False})
debit_format = workbook.add_format({'border': 1, 'valign': 'vcenter', 'num_format': '#,##0.00', 'bg_color': '#FDEDEC', 'locked': False}) 
credit_format = workbook.add_format({'border': 1, 'valign': 'vcenter', 'num_format': '#,##0.00', 'bg_color': '#EAFAF1', 'locked': False}) 

red_format = workbook.add_format({'bg_color': '#F2D7D5', 'font_color': '#922B21', 'bold': True})
green_format = workbook.add_format({'bg_color': '#D5F5E3', 'font_color': '#148F77', 'bold': True})
search_highlight = workbook.add_format({'bg_color': '#F9E79F', 'font_color': '#7D6608', 'bold': True})

dash_title = workbook.add_format({'bold': True, 'font_size': 20, 'align': 'center', 'bg_color': '#1A5276', 'font_color': 'white', 'locked': True, 'border': 1})
dash_label = workbook.add_format({'bold': True, 'font_size': 14, 'align': 'right', 'locked': True})
dash_value = workbook.add_format({'bold': True, 'font_size': 16, 'align': 'left', 'font_color': '#C0392B', 'num_format': '#,##0.00', 'locked': True})

search_label = workbook.add_format({'bold': True, 'font_size': 12, 'align': 'right', 'valign': 'vcenter', 'font_color': '#1F618D', 'locked': True})
search_box = workbook.add_format({'bold': True, 'font_size': 12, 'align': 'left', 'valign': 'vcenter', 'border': 2, 'bg_color': '#FEF9E7', 'locked': False})

# Protection options allowing formatting
protect_options = {
    'format_cells': True,
    'format_columns': True,
    'format_rows': True
}

# ==========================================
# 1. Dashboard Sheet
# ==========================================
ws_dash = workbook.add_worksheet('ড্যাশবোর্ড')
ws_dash.hide_gridlines(2)
ws_dash.protect('451060', protect_options) 

ws_dash.merge_range('B2:E3', 'তপু ভাই, আল রাফি মোটরস - ড্যাশবোর্ড', dash_title)
ws_dash.set_column('A:A', 5)
ws_dash.set_column('B:B', 25)
ws_dash.set_column('C:C', 30)

ws_dash.write('B6', 'মার্কেটে মোট বকেয়া:', dash_label)
ws_dash.write_formula('C6', '=SUM(\'কাস্টমার তালিকা\'!E:E)', dash_value)
ws_dash.write('B8', 'মোট কাস্টমার সংখ্যা:', dash_label)
ws_dash.write_formula('C8', '=COUNTA(\'কাস্টমার তালিকা\'!A:A)-1', dash_value)
ws_dash.write('B10', 'আজকের মোট কালেকশন:', dash_label)
ws_dash.write_formula('C10', '=SUMIFS(\'খতিয়ান\'!G:G, \'খতিয়ান\'!A:A, TODAY())', dash_value)

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
print("Business_Ledger_Pro_Final_v3 generated successfully!")
