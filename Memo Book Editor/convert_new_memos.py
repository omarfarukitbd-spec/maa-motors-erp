import pymupdf
from PIL import Image, ImageEnhance
import io
import os
import json

base_dir = r"E:\maa-motors-erp\Memo Book Editor"
pdf_path = os.path.join(base_dir, "Memo Book.pdf")
new_output_dir = os.path.join(base_dir, "New_Memos_WebP")
all_output_dir = os.path.join(base_dir, "Converted_Memos_WebP")

os.makedirs(new_output_dir, exist_ok=True)
os.makedirs(all_output_dir, exist_ok=True)

# Mapping of PDF page -> Memo number for the 22 new pages
# Page 79: Memo 146 (previously missing)
# Page 80: Memo 159 (previously missing)
# Pages 81 to 100: Memos 181 to 200
new_memo_mapping = {
    79: 146,
    80: 159,
}
for p in range(81, 101):
    new_memo_mapping[p] = p + 100  # 81 -> 181, ..., 100 -> 200

doc = pymupdf.open(pdf_path)
print(f"Total Pages in PDF: {len(doc)}")
print(f"Total New Memos to generate: {len(new_memo_mapping)}")

results = []

for page_num, memo_no in sorted(new_memo_mapping.items()):
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
    
    # Filename
    out_filename = f"{memo_no}.webp"
    new_path = os.path.join(new_output_dir, out_filename)
    all_path = os.path.join(all_output_dir, out_filename)
    
    # Quality target (low KB, crisp text)
    quality = 28
    enh_b.save(new_path, format="WEBP", quality=quality, method=6)
    size_kb = os.path.getsize(new_path) / 1024
    
    if size_kb > 65 and quality > 22:
        quality = 22
        enh_b.save(new_path, format="WEBP", quality=quality, method=6)
        size_kb = os.path.getsize(new_path) / 1024
        
    # Also save to master Converted_Memos_WebP folder
    enh_b.save(all_path, format="WEBP", quality=quality, method=6)
    
    results.append({
        "page": page_num,
        "memo_no": memo_no,
        "filename": out_filename,
        "size_kb": round(size_kb, 1),
        "dimensions": f"{target_w}x{target_h}",
        "category": "Recovered Missing Memo" if memo_no in (146, 159) else "New Book Range"
    })
    print(f"Generated {out_filename} (Page {page_num}) -> {size_kb:.1f} KB")

print(f"\nSuccessfully converted and saved all {len(results)} new WebP memos.")
avg_size = sum(r["size_kb"] for r in results) / len(results)
print(f"Average File Size: {avg_size:.1f} KB")
print(f"Min Size: {min(r['size_kb'] for r in results):.1f} KB, Max Size: {max(r['size_kb'] for r in results):.1f} KB")

# Save report
with open(os.path.join(base_dir, "new_memos_report.json"), "w", encoding="utf-8") as f:
    json.dump({
        "total_new_memos": len(results),
        "new_memo_folder": new_output_dir,
        "master_memo_folder": all_output_dir,
        "average_size_kb": round(avg_size, 1),
        "memos": results
    }, f, indent=2, ensure_ascii=False)

print("Saved new_memos_report.json successfully.")
