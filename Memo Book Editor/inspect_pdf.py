import fitz  # PyMuPDF
import os

pdf_path = r"E:\maa-motors-erp\Memo Book Editor\Memo Book.pdf"
doc = fitz.open(pdf_path)

print(f"Total Pages: {len(doc)}")
for i in range(min(5, len(doc))):
    page = doc[i]
    images = page.get_images()
    rect = page.rect
    text = page.get_text()
    print(f"Page {i+1}: rect={rect}, images_count={len(images)}, text_len={len(text.strip())}")
    if text.strip():
        print(f"  Sample text: {repr(text.strip()[:100])}")
