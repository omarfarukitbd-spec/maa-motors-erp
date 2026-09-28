import pymupdf
from PIL import Image, ImageEnhance
import io
import os
import json

base_dir = r"E:\maa-motors-erp\Memo Book Editor"
pdf_path = os.path.join(base_dir, "Memo Book.pdf")
output_dir = os.path.join(base_dir, "Converted_Memos_WebP")
os.makedirs(output_dir, exist_ok=True)

# Complete verified mapping of Page Index -> Memo Number
# Page 1 to 45 -> 101 to 145
# Page 46 to 57 -> 147 to 158  (146 missing)
# Page 58 to 75 -> 160 to 177  (159 missing)

memo_mapping = {}

for p in range(1, 46):
    memo_mapping[p] = 100 + p

for p in range(46, 58):
    memo_mapping[p] = 101 + p  # p=46 -> 147, p=57 -> 158

for p in range(58, 76):
    memo_mapping[p] = 102 + p  # p=58 -> 160, p=75 -> 177

doc = pymupdf.open(pdf_path)
print(f"Total Pages in PDF: {len(doc)}")
print(f"Total Memos to generate: {len(memo_mapping)}")

results = []

for page_num, memo_no in memo_mapping.items():
    page = doc[page_num - 1]
    il = page.get_images()
    xref = il[0][0]
    base_img = doc.extract_image(xref)
    img_bytes = base_img["image"]
    
    img = Image.open(io.BytesIO(img_bytes))
    orig_w, orig_h = img.size
    
    # Resize to 950 max width
    target_w = 950
    scale = target_w / orig_w
    target_h = int(orig_h * scale)
    img_resized = img.resize((target_w, target_h), Image.Resampling.LANCZOS)
    
    # Enhance ink contrast and brightness for crystal clear handwriting & rubber stamps
    enh_c = ImageEnhance.Contrast(img_resized).enhance(1.15)
    enh_b = ImageEnhance.Brightness(enh_c).enhance(1.02)
    
    # Save as WebP
    out_filename = f"{memo_no}.webp"
    out_path = os.path.join(output_dir, out_filename)
    
    # Target 30-55 KB
    quality = 28
    enh_b.save(out_path, format="WEBP", quality=quality, method=6)
    size_kb = os.path.getsize(out_path) / 1024
    
    if size_kb > 65 and quality > 22:
        quality = 22
        enh_b.save(out_path, format="WEBP", quality=quality, method=6)
        size_kb = os.path.getsize(out_path) / 1024
        
    results.append({
        "page": page_num,
        "memo_no": memo_no,
        "filename": out_filename,
        "size_kb": round(size_kb, 1),
        "dimensions": f"{target_w}x{target_h}"
    })

print(f"Successfully converted and saved {len(results)} WebP memos.")
avg_size = sum(r["size_kb"] for r in results) / len(results)
print(f"Average File Size: {avg_size:.1f} KB")
print(f"Min Size: {min(r['size_kb'] for r in results):.1f} KB, Max Size: {max(r['size_kb'] for r in results):.1f} KB")

with open(os.path.join(base_dir, "conversion_report.json"), "w", encoding="utf-8") as f:
    json.dump({
        "total_pages": len(doc),
        "total_converted": len(results),
        "missing_memos": [146, 159],
        "duplicate_memos": [],
        "min_memo": 101,
        "max_memo": 177,
        "average_size_kb": round(avg_size, 1),
        "memos": results
    }, f, indent=2, ensure_ascii=False)
