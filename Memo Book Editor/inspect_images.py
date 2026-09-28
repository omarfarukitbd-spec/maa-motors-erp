import pymupdf

pdf_path = r"E:\maa-motors-erp\Memo Book Editor\Memo Book.pdf"
doc = pymupdf.open(pdf_path)

for i in range(min(5, len(doc))):
    page = doc[i]
    il = page.get_images()
    for img_info in il:
        xref = img_info[0]
        base_img = doc.extract_image(xref)
        print(f"Page {i+1}: xref={xref}, ext={base_img['ext']}, width={base_img['width']}, height={base_img['height']}, bpc={base_img['bpc']}, colorspace={base_img['colorspace']}")
