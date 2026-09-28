import pymupdf
from PIL import Image, ImageEnhance
import io, os

doc = pymupdf.open(r"E:\maa-motors-erp\Memo Book Editor\Memo Book.pdf")
os.makedirs(r"E:\maa-motors-erp\Memo Book Editor\inspect_crops", exist_ok=True)

pages_to_check = [6, 15, 17, 18, 20, 24, 27, 28, 29, 32, 33, 40, 42, 44, 45, 46, 47, 48, 51, 58, 60, 61, 62, 63, 70, 71, 74]

for p in pages_to_check:
    page = doc[p - 1]
    il = page.get_images()
    base_img = doc.extract_image(il[0][0])
    img = Image.open(io.BytesIO(base_img["image"]))
    w, h = img.size
    
    # Save a top-third preview
    crop = img.crop((0, 0, int(w * 0.6), int(h * 0.4)))
    crop.thumbnail((800, 600))
    crop_path = rf"E:\maa-motors-erp\Memo Book Editor\inspect_crops\page_{p:02d}.jpg"
    crop.save(crop_path, quality=85)
    print(f"Saved inspect crop for Page {p:02d}")
