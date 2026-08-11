import os
import sys

try:
    import xlsxwriter
except ImportError:
    os.system(f'"{sys.executable}" -m pip install xlsxwriter')
    import xlsxwriter

filepath = r'd:\Office Excel\Business_Ledger_Final_Fixed.xlsx'
os.makedirs(os.path.dirname(filepath), exist_ok=True)

workbook = xlsxwriter.Workbook(filepath)

# --- Formats ---
header_format = workbook.add_format({
    'bold': True, 'font_color': 'white', 'bg_color': '#2C3E50',
    'border': 1, 'align': 'center', 'valign': 'vcenter'
})
cell_format = workbook.add_format({'border': 1, 'valign': 'vcenter'})
currency_format = workbook.add_format({'border': 1, 'valign': 'vcenter', 'num_format': '#,##0.00'})
date_format = workbook.add_format({'border': 1, 'valign': 'vcenter', 'num_format': 'dd/mm/yyyy'})
highlight_format = workbook.add_format({'border': 1, 'valign': 'vcenter', 'bg_color': '#ECF0F1', 'bold': True})

# Conditional Formatting Formats
red_format = workbook.add_format({'bg_color': '#FFC7CE', 'font_color': '#9C0006', 'bold': True})
green_format = workbook.add_format({'bg_color': '#C6EFCE', 'font_color': '#006100', 'bold': True})

# Link Format for WhatsApp
link_format = workbook.add_format({
    'font_color': 'blue', 'underline': True, 'border': 1, 
    'align': 'center', 'valign': 'vcenter', 'bold': True, 'bg_color': '#D6EAF8'
})

# Dashboard formats
dash_title = workbook.add_format({'bold': True, 'font_size': 20, 'align': 'center', 'bg_color': '#34495E', 'font_color': 'white'})
dash_label = workbook.add_format({'bold': True, 'font_size': 14, 'align': 'right'})
dash_value = workbook.add_format({'bold': True, 'font_size': 16, 'align': 'left', 'font_color': '#C0392B', 'num_format': '#,##0.00'})

# ==========================================
# 1. Dashboard Sheet
# ==========================================
ws_dash = workbook.add_worksheet('ড্যাশবোর্ড')
ws_dash.merge_range('B2:E3', 'তপু ভাই, আল রাফি মোটরস - ড্যাশবোর্ড', dash_title)
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
headers_cust = ['কাস্টমার আইডি', 'কাস্টমারের নাম', 'মোবাইল নম্বর', 'ঠিকানা', 'মোট বকেয়া (অটো)', 'হোয়াটসঅ্যাপ মেসেজ (অটো)']
ws_customers.write_row(0, 0, headers_cust, header_format)
ws_customers.set_column('A:A', 15)
ws_customers.set_column('B:B', 35)
ws_customers.set_column('C:C', 20)
ws_customers.set_column('D:D', 35)
ws_customers.set_column('E:E', 20)
ws_customers.set_column('F:F', 30)

ws_customers.conditional_format('E2:E305', {'type': 'cell', 'criteria': '>', 'value': 0, 'format': red_format})
ws_customers.conditional_format('E2:E305', {'type': 'cell', 'criteria': '<=', 'value': 0, 'format': green_format})

for row in range(1, 305):  
    ws_customers.write_blank(row, 0, '', cell_format)
    ws_customers.write_blank(row, 1, '', cell_format)
    ws_customers.write_blank(row, 2, '', cell_format)
    ws_customers.write_blank(row, 3, '', cell_format)
    
    formula_due = f'=SUMIF(\'খতিয়ান\'!C:C, A{row+1}, \'খতিয়ান\'!F:F) - SUMIF(\'খতিয়ান\'!C:C, A{row+1}, \'খতিয়ান\'!G:G)'
    ws_customers.write_formula(row, 4, formula_due, currency_format)
    
    # FIX: Corrected WhatsApp hyperlink syntax
    wa_msg = f'"https://wa.me/88"&C{row+1}&"?text=আসসালামু আলাইকুম "&B{row+1}&", আপনার মোট বকেয়া "&E{row+1}&" টাকা। অনুগ্রহ করে পরিশোধ করবেন।"'
    formula_wa = f'=IF(OR(ISBLANK(C{row+1}), E{row+1}<=0), "", HYPERLINK({wa_msg}, "✉️ মেসেজ পাঠান"))'
    ws_customers.write_formula(row, 5, formula_wa, link_format)

# Sample customers
ws_customers.write(1, 0, 'C-001', cell_format)
ws_customers.write(1, 1, 'তপু ভাই, আল রাফি মোটরস', cell_format)
ws_customers.write(1, 2, '01720643322', cell_format) 
ws_customers.write(1, 3, 'ধোলাইখাল, ঢাকা', cell_format)

ws_customers.write(2, 0, 'C-002', cell_format)
ws_customers.write(2, 1, 'জামাল, রহমান টাওয়ার', cell_format)
ws_customers.write(2, 2, '01676218863', cell_format)
ws_customers.write(2, 3, '', cell_format)

ws_customers.write(3, 0, 'C-003', cell_format)
ws_customers.write(3, 1, 'মিজান মোটরস', cell_format)
ws_customers.write(3, 2, '01811223344', cell_format)
ws_customers.write(3, 3, 'মিরপুর', cell_format)

# ==========================================
# 3. Ledger Sheet
# ==========================================
ws_ledger = workbook.add_worksheet('খতিয়ান')
headers_ledger = ['তারিখ', 'কাস্টমারের নাম (সিলেক্ট করুন)', 'কাস্টমার আইডি (অটো)', 'বিবরণ', 'ভাউচার নং', 'খরচ / বাকি (Debit)', 'জমা (Credit)', 'বর্তমান ব্যালেন্স (অটো)']

ws_ledger.write_row(0, 0, headers_ledger, header_format)
ws_ledger.set_column('A:A', 15)
ws_ledger.set_column('B:B', 35)
ws_ledger.set_column('C:C', 20)
ws_ledger.set_column('D:D', 30)
ws_ledger.set_column('E:E', 15)
ws_ledger.set_column('F:H', 25)

# Adding table
ws_ledger.add_table('A1:H1005', {'name': 'LedgerTable', 'columns': [{'header': h} for h in headers_ledger], 'style': 'Table Style Medium 9'})

for row in range(1, 1005): 
    ws_ledger.data_validation(row, 1, row, 1, {
        'validate': 'list',
        'source': '=\'কাস্টমার তালিকা\'!$B$2:$B$305'
    })
    
    formula_id = f'=IF(ISBLANK(B{row+1}), "", INDEX(\'কাস্টমার তালিকা\'!$A$2:$A$305, MATCH(B{row+1}, \'কাস্টমার তালিকা\'!$B$2:$B$305, 0)))'
    ws_ledger.write_formula(row, 2, formula_id, highlight_format)
    
    ws_ledger.write_blank(row, 0, '', date_format) 
    ws_ledger.write_blank(row, 3, '', cell_format) 
    ws_ledger.write_blank(row, 4, '', cell_format) 
    ws_ledger.write_blank(row, 5, '', currency_format) 
    ws_ledger.write_blank(row, 6, '', currency_format) 
    
    formula_balance = f'=IF(ISBLANK(C{row+1}), "", SUMIFS(F$2:F{row+1}, C$2:C{row+1}, C{row+1}) - SUMIFS(G$2:G{row+1}, C$2:C{row+1}, C{row+1}))'
    ws_ledger.write_formula(row, 7, formula_balance, highlight_format)

# Sample transactions
ws_ledger.write(1, 0, '19/09/2022', date_format)
ws_ledger.write(1, 1, 'তপু ভাই, আল রাফি মোটরস', cell_format)
ws_ledger.write(1, 3, 'পূর্বের জের', cell_format)
ws_ledger.write(1, 4, '2203', cell_format)
ws_ledger.write(1, 5, 118000, currency_format)

ws_ledger.write(2, 0, '28/09/2022', date_format)
ws_ledger.write(2, 1, 'তপু ভাই, আল রাফি মোটরস', cell_format)
ws_ledger.write(2, 4, '2295', cell_format)
ws_ledger.write(2, 5, 85000, currency_format)

ws_ledger.write(3, 0, '02/11/2022', date_format)
ws_ledger.write(3, 1, 'তপু ভাই, আল রাফি মোটরস', cell_format)
ws_ledger.write(3, 3, 'Received এমদাদ', cell_format)
ws_ledger.write(3, 6, 240600, currency_format)

ws_ledger.write(4, 0, '05/11/2022', date_format)
ws_ledger.write(4, 1, 'মিজান মোটরস', cell_format)
ws_ledger.write(4, 3, 'পূর্বের জের', cell_format)
ws_ledger.write(4, 5, 10000, currency_format)

ws_ledger.write(5, 0, '06/11/2022', date_format)
ws_ledger.write(5, 1, 'মিজান মোটরস', cell_format)
ws_ledger.write(5, 3, 'Cash Payment', cell_format)
ws_ledger.write(5, 6, 10000, currency_format)

workbook.close()
print("Fixed Final Excel file generated successfully!")
