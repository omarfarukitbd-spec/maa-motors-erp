import os
import io
import re
import pymupdf
from PIL import Image

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

def build_pdf_from_images(image_files, pdf_name, folder, root_folder):
    PAGE_W = 595.28  # Exact A4 width in points
    PAGE_H = 841.89  # Exact A4 height in points
    MID_Y = PAGE_H / 2.0  # 420.945 pt
    GAP = 12.0  # ~4.2 mm cutting gap in the exact middle

    # Zero margins: edge-to-edge full bleed on left, right, top and bottom
    rect_top = pymupdf.Rect(0, 0, PAGE_W, MID_Y - (GAP / 2.0))
    rect_bot = pymupdf.Rect(0, MID_Y + (GAP / 2.0), PAGE_W, PAGE_H)

    doc = pymupdf.open()

    for i in range(0, len(image_files), 2):
        page = doc.new_page(width=PAGE_W, height=PAGE_H)

        # 1. Top Image (Full bleed, 0 margin on left, right, top)
        b_top = get_optimized_bytes(os.path.join(folder, image_files[i]))
        page.insert_image(rect_top, stream=b_top, keep_proportion=False)

        # 2. Bottom Image (Full bleed, 0 margin on left, right, bottom)
        if i + 1 < len(image_files):
            b_bot = get_optimized_bytes(os.path.join(folder, image_files[i + 1]))
            page.insert_image(rect_bot, stream=b_bot, keep_proportion=False)

            # Middle cutting dashed line (subtle light grey guide)
            page.draw_line(
                pymupdf.Point(0, MID_Y),
                pymupdf.Point(PAGE_W, MID_Y),
                color=(0.78, 0.78, 0.78),
                width=1.0,
                dashes="[6 4] 0"
            )

        print(f"[{pdf_name}] Page {len(doc)}: {image_files[i]} + {image_files[i+1] if i+1 < len(image_files) else 'None'}")

    pdf_out = os.path.join(folder, pdf_name)
    root_pdf = os.path.join(root_folder, pdf_name)

    doc.save(pdf_out, garbage=4, deflate=True)
    doc.save(root_pdf, garbage=4, deflate=True)

    size_mb = os.path.getsize(pdf_out) / (1024 * 1024)
    print(f"==> [{pdf_name}] Successfully created with {len(doc)} pages! Size: {size_mb:.2f} MB")
    print(f"    Saved at: {pdf_out}")
    print(f"    Saved at: {root_pdf}\n")

def get_num(s):
    m = re.search(r'(\d+)', s)
    return int(m.group(1)) if m else 0

def main():
    folder = r"E:\maa-motors-erp\Lulu exchange image"
    root_folder = r"E:\maa-motors-erp"

    # 1. Federal Exchange
    fed_files = sorted([
        f for f in os.listdir(folder)
        if f.lower().startswith('federal exchange') and f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp'))
    ], key=get_num)
    print(f"Found {len(fed_files)} Federal Exchange images: {fed_files}")
    build_pdf_from_images(fed_files, "Federal_Exchange_A4_Print.pdf", folder, root_folder)

    # 2. Lulu Exchange (All 1 to 19)
    lulu_files = sorted([
        f for f in os.listdir(folder)
        if f.lower().startswith('lulu exchange') and f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp'))
    ], key=get_num)
    print(f"Found {len(lulu_files)} Lulu Exchange images: {lulu_files}")
    build_pdf_from_images(lulu_files, "Lulu_Exchange_A4_Print.pdf", folder, root_folder)

    # 2b. Lulu Exchange (New images: 15 to 19)
    lulu_new_files = [f for f in lulu_files if get_num(f) >= 15]
    if lulu_new_files:
        print(f"Found {len(lulu_new_files)} new Lulu Exchange images: {lulu_new_files}")
        build_pdf_from_images(lulu_new_files, "Lulu_Exchange_New_A4_Print.pdf", folder, root_folder)

    # 3. Remit Exchange
    remit_files = sorted([
        f for f in os.listdir(folder)
        if f.lower().startswith('remit exchange') and f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp'))
    ], key=get_num)
    print(f"Found {len(remit_files)} Remit Exchange images: {remit_files}")
    build_pdf_from_images(remit_files, "Remit_Exchange_A4_Print.pdf", folder, root_folder)

if __name__ == "__main__":
    main()
