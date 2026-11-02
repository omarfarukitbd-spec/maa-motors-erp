import pymupdf
from PIL import Image, ImageEnhance
import io
import os
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

base_dir = r"E:\maa-motors-erp\Memo Book Editor"
pdf_path = os.path.join(base_dir, "Memo Book 3.pdf")
out_dir_201_300 = os.path.join(base_dir, "Converted_Memos_WebP_201_300")
master_out_dir = os.path.join(base_dir, "Converted_Memos_WebP")

os.makedirs(out_dir_201_300, exist_ok=True)
os.makedirs(master_out_dir, exist_ok=True)

# Build the exact mapping for Memos 201 to 300:
# memo_no -> (page_num_1_based, 'color' or 'white')
memo_map = {}

# 201 to 229 -> White pages 46 to 74
for m in range(201, 230):
    memo_map[m] = (m - 155, 'white')

# 230 to 257 -> Color pages 1 to 28
for m in range(230, 258):
    memo_map[m] = (m - 229, 'color')

# 258 to 260 -> White pages 103 to 105
for m in range(258, 261):
    memo_map[m] = (m - 155, 'white')

# 261 to 273 -> Color pages 29 to 41
for m in range(261, 274):
    memo_map[m] = (29 + (m - 261), 'color')

# 274 -> White page 119
memo_map[274] = (119, 'white')

# 275 to 278 -> Color pages 42 to 45
for m in range(275, 279):
    memo_map[m] = (42 + (m - 275), 'color')

# 279 to 300 -> White pages 124 to 145
for m in range(279, 301):
    memo_map[m] = (m - 155, 'white')

assert len(memo_map) == 100, f"Expected 100 memos, got {len(memo_map)}"
for m in range(201, 301):
    assert m in memo_map, f"Missing memo {m}"

print(f"Verified complete mapping for all 100 memos (201 - 300).")
color_count = sum(1 for m, (p, t) in memo_map.items() if t == 'color')
white_count = sum(1 for m, (p, t) in memo_map.items() if t == 'white')
print(f"Color copies selected: {color_count} | White copies selected: {white_count}")

doc = pymupdf.open(pdf_path)
print(f"Loaded PDF: {pdf_path} (Total Pages: {len(doc)})")

conversion_results = []

for memo_no in range(201, 301):
    page_num, paper_type = memo_map[memo_no]
    page = doc[page_num - 1]
    il = page.get_images()
    xref = il[0][0]
    base_img = doc.extract_image(xref)
    img_bytes = base_img["image"]
    
    img = Image.open(io.BytesIO(img_bytes))
    orig_w, orig_h = img.size
    
    # Standard ERP Memo sizing: Max width 950px
    target_w = 950
    scale = target_w / orig_w
    target_h = int(orig_h * scale)
    img_resized = img.resize((target_w, target_h), Image.Resampling.LANCZOS)
    
    # Enhance ink contrast and brightness for crystal clear handwriting & rubber stamps
    enh_c = ImageEnhance.Contrast(img_resized).enhance(1.15)
    enh_b = ImageEnhance.Brightness(enh_c).enhance(1.02)
    
    out_filename = f"{memo_no}.webp"
    path_201_300 = os.path.join(out_dir_201_300, out_filename)
    path_master = os.path.join(master_out_dir, out_filename)
    
    # Target 30-55 KB
    quality = 28
    enh_b.save(path_201_300, format="WEBP", quality=quality, method=6)
    size_kb = os.path.getsize(path_201_300) / 1024
    
    if size_kb > 65 and quality > 22:
        quality = 22
        enh_b.save(path_201_300, format="WEBP", quality=quality, method=6)
        size_kb = os.path.getsize(path_201_300) / 1024
        
    # Also save to master Converted_Memos_WebP
    enh_b.save(path_master, format="WEBP", quality=quality, method=6)
    
    conversion_results.append({
        "memo_no": memo_no,
        "page_in_pdf": page_num,
        "type": paper_type,
        "filename": out_filename,
        "size_kb": round(size_kb, 1),
        "dimensions": f"{target_w}x{target_h}"
    })
    
    if memo_no % 10 == 0 or memo_no == 201 or memo_no == 300:
        print(f"Processed Memo #{memo_no}: Page {page_num:03d} ({paper_type.upper()}) -> {size_kb:.1f} KB")

avg_kb = sum(r["size_kb"] for r in conversion_results) / len(conversion_results)
min_kb = min(r["size_kb"] for r in conversion_results)
max_kb = max(r["size_kb"] for r in conversion_results)

report_data = {
    "total_memos": len(conversion_results),
    "range": "201 - 300",
    "color_copies_kept": color_count,
    "white_copies_kept": white_count,
    "white_duplicates_discarded": color_count,
    "avg_size_kb": round(avg_kb, 1),
    "min_size_kb": round(min_kb, 1),
    "max_size_kb": round(max_kb, 1),
    "items": conversion_results
}

report_path = os.path.join(base_dir, "book3_conversion_report.json")
with open(report_path, "w", encoding="utf-8") as f:
    json.dump(report_data, f, indent=2, ensure_ascii=False)

print("\n================ CONVERSION SUMMARY ================")
print(f"Total Memos Processed: {len(conversion_results)}")
print(f"Average File Size: {avg_kb:.1f} KB (Min: {min_kb:.1f} KB, Max: {max_kb:.1f} KB)")
print(f"Report saved to: {report_path}")

