import pymupdf
from PIL import Image, ImageEnhance
import io
import os

pdf_path = r"E:\maa-motors-erp\Memo Book Editor\Memo Book.pdf"
doc = pymupdf.open(pdf_path)

output_dir = r"E:\maa-motors-erp\Memo Book Editor\sample_webp"
os.makedirs(output_dir, exist_ok=True)

for i in range(3):
    page = doc[i]
    il = page.get_images()
    xref = il[0][0]
    base_img = doc.extract_image(xref)
    image_bytes = base_img["image"]
    
    img = Image.open(io.BytesIO(image_bytes))
    
    # 1. Resize to max 1200 width
    max_w = 1200
    max_h = 1600
    w, h = img.size
    scale = min(max_w / w, max_h / h, 1.0)
    new_w, new_h = int(w * scale), int(h * scale)
    img_resized = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    # 2. Enhance contrast and brightness
    enhancer_c = ImageEnhance.Contrast(img_resized)
    img_enhanced = enhancer_c.enhance(1.15)
    enhancer_b = ImageEnhance.Brightness(img_enhanced)
    img_final = enhancer_b.enhance(1.02)
    
    # 3. WebP compression loop (target 25 - 45 KB)
    quality = 55
    out_path = os.path.join(output_dir, f"sample_{i+1}.webp")
    img_final.save(out_path, format="WEBP", quality=quality, method=6)
    size_kb = os.path.getsize(out_path) / 1024
    
    while size_kb > 48 and quality > 30:
        quality -= 5
        img_final.save(out_path, format="WEBP", quality=quality, method=6)
        size_kb = os.path.getsize(out_path) / 1024
        
    while size_kb < 25 and quality < 80:
        quality += 5
        img_final.save(out_path, format="WEBP", quality=quality, method=6)
        size_kb = os.path.getsize(out_path) / 1024
        
    print(f"Page {i+1}: dimensions={img_final.size}, quality={quality}, size={size_kb:.1f} KB")
