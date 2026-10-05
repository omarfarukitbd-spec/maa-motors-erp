import time, os, shutil

src = "Container_Expense_Statement_Form_RoundLogo.docx"
dst = "Container_Expense_Statement_Form.docx"

for i in range(120):
    try:
        with open(dst, "r+b") as f:
            pass
        # If no error, overwrite it
        shutil.copyfile(src, dst)
        print("SUCCESS: Container_Expense_Statement_Form.docx replaced successfully!")
        break
    except PermissionError:
        time.sleep(1)
else:
    print("TIMED OUT waiting for file to unlock.")
