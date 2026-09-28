import pymupdf
from PIL import Image, ImageEnhance
import io
import os

os.makedirs(r"E:\maa-motors-erp\Memo Book Editor\sample", exist_ok=True)
doc = pymupdf.open(r"E:\maa-motors-erp\Memo Book Editor\Memo Book.pdf")

for i in range(3):
    page = doc[i]
    il = page.get_images()
    xref = il[0][0]
    base_img = doc.extract_image(xref)
    image_bytes = base_img["image"]
    
    img = Image.open(io.BytesIO(image_bytes))
    
    # Save original preview resized for easy inspection
    img_preview = img.copy()
    img_preview.thumbnail((1200, 1600))
    img_preview.save(rf"E:\maa-motors-erp\Memo Book Editor\sample\page_{i+1}_preview.jpg", quality=80)
    print(f"Saved page {i+1} preview, size={img_preview.size}")
