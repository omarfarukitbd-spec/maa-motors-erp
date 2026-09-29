import os
import re
from PIL import Image, ImageDraw

def generate_pdf():
    folder = r"E:\maa-motors-erp\Lulu exchange image"
    pdf_out_path = os.path.join(folder, "Lulu_Exchange_A4_Print.pdf")
    root_pdf_path = r"E:\maa-motors-erp\Lulu_Exchange_A4_Print.pdf"

    # Find and sort all image files
    files = [f for f in os.listdir(folder) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')) and not f.startswith('thumb')]
    
    def get_num(s):
        m = re.search(r'(\d+)', s)
        return int(m.group(1)) if m else 0
    
    files.sort(key=get_num)
    print(f"Total images found: {len(files)}")

    # Standard A4 at 300 DPI
    PAGE_W = 2480
    PAGE_H = 3508
    MID_Y = PAGE_H // 2  # 1754
    
    # Gap between top and bottom slip: 90 px (~7.6 mm)
    GAP_PX = 90
    SIDE_MARGIN = 35
    TOP_MARGIN = 35
    BOTTOM_MARGIN = 35

    top_box = (SIDE_MARGIN, TOP_MARGIN, PAGE_W - SIDE_MARGIN, MID_Y - (GAP_PX // 2))
    bot_box = (SIDE_MARGIN, MID_Y + (GAP_PX // 2), PAGE_W - SIDE_MARGIN, PAGE_H - BOTTOM_MARGIN)

    def prepare_image(img_path, box):
        img = Image.open(img_path)
        if img.mode != 'RGB':
            bg = Image.new('RGB', img.size, (255, 255, 255))
            if img.mode == 'RGBA':
                bg.paste(img, mask=img.split()[3])
            else:
                bg.paste(img.convert('RGB'))
            img = bg
        
        bx0, by0, bx1, by1 = box
        bw = bx1 - bx0
        bh = by1 - by0
        
        iw, ih = img.size
        scale = min(bw / iw, bh / ih)
        nw = int(iw * scale)
        nh = int(ih * scale)
        
        resized = img.resize((nw, nh), Image.Resampling.LANCZOS)
        
        # Center horizontally and vertically within the half-page box
        x = bx0 + (bw - nw) // 2
        y = by0 + (bh - nh) // 2
        return resized, (x, y)

    pages = []
    
    # Pair images 2 per page
    for i in range(0, len(files), 2):
        canvas = Image.new('RGB', (PAGE_W, PAGE_H), (255, 255, 255))
        draw = ImageDraw.Draw(canvas)
        
        # 1. Top Image
        file_top = files[i]
        path_top = os.path.join(folder, file_top)
        img_top, pos_top = prepare_image(path_top, top_box)
        canvas.paste(img_top, pos_top)
        
        # 2. Bottom Image (if exists)
        if i + 1 < len(files):
            file_bot = files[i + 1]
            path_bot = os.path.join(folder, file_bot)
            img_bot, pos_bot = prepare_image(path_bot, bot_box)
            canvas.paste(img_bot, pos_bot)
            
            # Draw subtle cutting guide line in the exact middle
            dash_len = 30
            space_len = 20
            line_color = (200, 200, 200) # Subtle light grey
            for x in range(SIDE_MARGIN, PAGE_W - SIDE_MARGIN, dash_len + space_len):
                draw.line([(x, MID_Y), (min(x + dash_len, PAGE_W - SIDE_MARGIN), MID_Y)], fill=line_color, width=3)
        
        pages.append(canvas)
        print(f"Generated Page {len(pages)}: {file_top} + {files[i+1] if i+1 < len(files) else 'None'}")

    # Save multi-page PDF
    if pages:
        first_page = pages[0]
        other_pages = pages[1:] if len(pages) > 1 else []
        
        # Save to Lulu exchange image folder
        first_page.save(
            pdf_out_path,
            "PDF",
            resolution=300.0,
            save_all=True,
            append_images=other_pages,
            quality=88,
            optimize=True
        )
        print(f"Saved PDF to: {pdf_out_path}")
        
        # Also save copy to root for quick access
        first_page.save(
            root_pdf_path,
            "PDF",
            resolution=300.0,
            save_all=True,
            append_images=other_pages,
            quality=88,
            optimize=True
        )
        print(f"Saved copy to: {root_pdf_path}")

        pdf_size_mb = os.path.getsize(pdf_out_path) / (1024 * 1024)
        print(f"PDF Size: {pdf_size_mb:.2f} MB ({len(pages)} Pages)")

if __name__ == "__main__":
    generate_pdf()
