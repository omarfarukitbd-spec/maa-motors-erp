import os
import io
import re
import pymupdf
from PIL import Image

def generate_pdf():
    folder = r"E:\maa-motors-erp\Lulu exchange image"
    pdf_out = os.path.join(folder, "Lulu_Exchange_A4_Print.pdf")
    root_pdf = r"E:\maa-motors-erp\Lulu_Exchange_A4_Print.pdf"

    # Find and sort all image files numerically
    files = [
        f for f in os.listdir(folder)
        if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')) and not f.startswith(('thumb', 'preview'))
    ]

    def get_num(s):
        m = re.search(r'(\d+)', s)
        return int(m.group(1)) if m else 0

    files.sort(key=get_num)
    print(f"Total files found: {len(files)}")

    doc = pymupdf.open()
    PAGE_W = 595.28  # Exact A4 width in points
    PAGE_H = 841.89  # Exact A4 height in points
    MID_Y = PAGE_H / 2.0  # 420.945 pt
    GAP = 12.0  # ~4.2 mm cutting gap in the exact middle

    # Zero margins: edge-to-edge full bleed on left, right, top and bottom
    rect_top = pymupdf.Rect(0, 0, PAGE_W, MID_Y - (GAP / 2.0))
    rect_bot = pymupdf.Rect(0, MID_Y + (GAP / 2.0), PAGE_W, PAGE_H)

    def get_optimized_bytes(f_path):
        img = Image.open(f_path)
        if img.mode != 'RGB':
            bg = Image.new('RGB', img.size, (255, 255, 255))
            if img.mode == 'RGBA':
                bg.paste(img, mask=img.split()[3])
            else:
                bg.paste(img.convert('RGB'))
            img = bg
        buf = io.BytesIO()
        img.save(buf, format='JPEG', quality=92, optimize=True)
        return buf.getvalue()

    for i in range(0, len(files), 2):
        page = doc.new_page(width=PAGE_W, height=PAGE_H)

        # 1. Top Image (Full bleed, 0 margin on left, right, top)
        b_top = get_optimized_bytes(os.path.join(folder, files[i]))
        page.insert_image(rect_top, stream=b_top, keep_proportion=False)

        # 2. Bottom Image (Full bleed, 0 margin on left, right, bottom)
        if i + 1 < len(files):
            b_bot = get_optimized_bytes(os.path.join(folder, files[i + 1]))
            page.insert_image(rect_bot, stream=b_bot, keep_proportion=False)

            # Middle cutting dashed line (subtle light grey guide)
            page.draw_line(
                pymupdf.Point(0, MID_Y),
                pymupdf.Point(PAGE_W, MID_Y),
                color=(0.78, 0.78, 0.78),
                width=1.0,
                dashes="[6 4] 0"
            )

        print(f"Added Page {len(doc)} (Zero Margin): {files[i]} + {files[i+1] if i+1 < len(files) else 'None'}")

    # Save to both locations
    doc.save(pdf_out, garbage=4, deflate=True)
    doc.save(root_pdf, garbage=4, deflate=True)
    size_mb = os.path.getsize(pdf_out) / (1024 * 1024)
    print(f"Success! Saved {len(doc)} pages to {pdf_out}. Size: {size_mb:.2f} MB")

if __name__ == "__main__":
    generate_pdf()
