import pymupdf
from PIL import Image, ImageEnhance
import io
import os
import subprocess
import json

base_dir = r"E:\maa-motors-erp\Memo Book Editor"
pdf_path = os.path.join(base_dir, "Memo Book.pdf")
crops_dir = os.path.join(base_dir, "crops")
temp_webp_dir = os.path.join(base_dir, "temp_webp")
output_dir = os.path.join(base_dir, "memos_webp")

os.makedirs(crops_dir, exist_ok=True)
os.makedirs(temp_webp_dir, exist_ok=True)
os.makedirs(output_dir, exist_ok=True)

doc = pymupdf.open(pdf_path)
total_pages = len(doc)
print(f"Total Pages to process: {total_pages}")

# Step 1: Extract and convert all pages to high quality, low-KB WebP & save top-left crops for OCR
page_info = []

for i in range(total_pages):
    page = doc[i]
    il = page.get_images()
    if not il:
        print(f"Warning: Page {i+1} has no images!")
        continue
    xref = il[0][0]
    base_img = doc.extract_image(xref)
    img_bytes = base_img["image"]
    
    img = Image.open(io.BytesIO(img_bytes))
    
    # Standardize orientation if needed (usually portrait)
    if img.size[0] > img.size[1]:
        # Might be rotated landscape
        pass
        
    orig_w, orig_h = img.size
    
    # 1. Resize for low-KB WebP (max width 950)
    target_w = 950
    scale = target_w / orig_w
    target_h = int(orig_h * scale)
    img_resized = img.resize((target_w, target_h), Image.Resampling.LANCZOS)
    
    # Contrast and Brightness
    enh_c = ImageEnhance.Contrast(img_resized).enhance(1.15)
    enh_b = ImageEnhance.Brightness(enh_c).enhance(1.02)
    
    # WebP save (quality 30 gives ~40-70 KB crisp image)
    webp_temp_path = os.path.join(temp_webp_dir, f"page_{i+1:03d}.webp")
    enh_b.save(webp_temp_path, format="WEBP", quality=30, method=6)
    size_kb = os.path.getsize(webp_temp_path) / 1024
    
    # 2. Extract top-left crop specifically for memo number OCR
    # Memo number is around x: 5% to 35%, y: 5% to 25%
    crop_x1 = int(orig_w * 0.04)
    crop_y1 = int(orig_h * 0.04)
    crop_x2 = int(orig_w * 0.45)
    crop_y2 = int(orig_h * 0.28)
    
    crop_img = img.crop((crop_x1, crop_y1, crop_x2, crop_y2))
    crop_path = os.path.join(crops_dir, f"crop_{i+1:03d}.png")
    # Enhance crop contrast for OCR
    crop_enh = ImageEnhance.Contrast(crop_img).enhance(1.4)
    crop_enh.save(crop_path)
    
    page_info.append({
        "page_num": i + 1,
        "webp_temp": webp_temp_path,
        "crop_path": crop_path,
        "size_kb": size_kb
    })

print(f"Extracted and converted {len(page_info)} pages.")
