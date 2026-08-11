import os
import sys

try:
    import xlsxwriter
except ImportError:
    os.system(f'"{sys.executable}" -m pip install xlsxwriter')
    import xlsxwriter

filepath = r'd:\Office Excel\Business_Ledger.xlsx'
os.makedirs(os.path.dirname(filepath), exist_ok=True)

workbook = xlsxwriter.Workbook(filepath)

# Formats
header_format = workbook.add_format({
    'bold': True, 'font_color': 'white', 'bg_color': '#4F81BD',
    'border': 1, 'align': 'center', 'valign': 'vcenter'
})
cell_format = workbook.add_format({'border': 1, 'valign': 'vcenter'})
currency_format = workbook.add_format({'border': 1, 'valign': 'vcenter', 'num_format': '#,##0.00'})
date_format = workbook.add_format({'border': 1, 'valign': 'vcenter', 'num_format': 'dd/mm/yyyy'})
highlight_format = workbook.add_format({'border': 1, 'valign': 'vcenter', 'bg_color': '#EBF1DE', 'bold': True})

# --- Sheet 1: Customers ---
ws_customers = workbook.add_worksheet('Customers')
headers_cust = ['Customer ID', 'Customer Name', 'Phone Number', 'Address', 'Total Due (Auto)']
ws_customers.write_row(0, 0, headers_cust, header_format)
ws_customers.set_column('A:A', 15)
ws_customers.set_column('B:B', 35)
ws_customers.set_column('C:C', 20)
ws_customers.set_column('D:D', 40)
ws_customers.set_column('E:E', 25)

for row in range(1, 305):  
    ws_customers.write_blank(row, 0, '', cell_format)
    ws_customers.write_blank(row, 1, '', cell_format)
    ws_customers.write_blank(row, 2, '', cell_format)
    ws_customers.write_blank(row, 3, '', cell_format)
    formula = f'=SUMIF(Ledger!B:B, A{row+1}, Ledger!F:F) - SUMIF(Ledger!B:B, A{row+1}, Ledger!G:G)'
    ws_customers.write_formula(row, 4, formula, highlight_format)

# Add 2 sample customers
ws_customers.write(1, 0, 'C-001', cell_format)
ws_customers.write(1, 1, 'তপু ভাই, আল রাফি মোটরস', cell_format)
ws_customers.write(1, 2, '01720-643322', cell_format)
ws_customers.write(1, 3, 'ধোলাইখাল, ঢাকা', cell_format)

ws_customers.write(2, 0, 'C-002', cell_format)
ws_customers.write(2, 1, 'জামাল, রহমান টাওয়ার', cell_format)
ws_customers.write(2, 2, '01676-218863', cell_format)
ws_customers.write(2, 3, '', cell_format)

# --- Sheet 2: Ledger ---
ws_ledger = workbook.add_worksheet('Ledger')
headers_ledger = ['Date', 'Customer ID', 'Customer Name (Auto)', 'Particulars', 'Voucher No', 'Debit (Sale/Due)', 'Credit (Payment)', 'Running Balance (Auto)']
ws_ledger.write_row(0, 0, headers_ledger, header_format)
ws_ledger.set_column('A:A', 15)
ws_ledger.set_column('B:B', 15)
ws_ledger.set_column('C:C', 35)
ws_ledger.set_column('D:D', 30)
ws_ledger.set_column('E:E', 15)
ws_ledger.set_column('F:H', 20)

for row in range(1, 1005): 
    ws_ledger.data_validation(row, 1, row, 1, {
        'validate': 'list',
        'source': '=Customers!$A$2:$A$305'
    })
    
    formula_name = f'=IF(ISBLANK(B{row+1}), "", VLOOKUP(B{row+1}, Customers!$A$2:$B$305, 2, FALSE))'
    ws_ledger.write_formula(row, 2, formula_name, highlight_format)
    
    ws_ledger.write_blank(row, 0, '', date_format) 
    ws_ledger.write_blank(row, 3, '', cell_format) 
    ws_ledger.write_blank(row, 4, '', cell_format) 
    ws_ledger.write_blank(row, 5, '', currency_format) 
    ws_ledger.write_blank(row, 6, '', currency_format) 
    
    formula_balance = f'=IF(ISBLANK(B{row+1}), "", SUMIFS(F$2:F{row+1}, B$2:B{row+1}, B{row+1}) - SUMIFS(G$2:G{row+1}, B$2:B{row+1}, B{row+1}))'
    ws_ledger.write_formula(row, 7, formula_balance, highlight_format)

# Add some sample transactions
ws_ledger.write(1, 0, '19/09/2022', date_format)
ws_ledger.write(1, 1, 'C-001', cell_format)
ws_ledger.write(1, 3, 'পূর্বের জের', cell_format)
ws_ledger.write(1, 4, '2203', cell_format)
ws_ledger.write(1, 5, 118000, currency_format)

ws_ledger.write(2, 0, '28/09/2022', date_format)
ws_ledger.write(2, 1, 'C-001', cell_format)
ws_ledger.write(2, 4, '2295', cell_format)
ws_ledger.write(2, 5, 85000, currency_format)

ws_ledger.write(3, 0, '02/11/2022', date_format)
ws_ledger.write(3, 1, 'C-001', cell_format)
ws_ledger.write(3, 3, 'Received এমদাদ', cell_format)
ws_ledger.write(3, 6, 240600, currency_format)

workbook.close()
print("Excel file generated successfully!")
