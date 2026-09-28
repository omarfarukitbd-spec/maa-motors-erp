import pymupdf
from PIL import Image, ImageEnhance
import io, os

pdf_path = r"E:\maa-motors-erp\Memo Book Editor\Memo Book.pdf"
doc = pymupdf.open(pdf_path)

il = doc[0].get_images()
base_img = doc.extract_image(il[0][0])
img = Image.open(io.BytesIO(base_img["image"]))

for w_test in [1100, 950, 850]:
    scale = w_test / img.size[0]
    h_test = int(img.size[1] * scale)
    r = img.resize((w_test, h_test), Image.Resampling.LANCZOS)
    enh_c = ImageEnhance.Contrast(r).enhance(1.15)
    enh_b = ImageEnhance.Brightness(enh_c).enhance(1.02)
    
    for q in [35, 28, 22]:
        p = rf"E:\maa-motors-erp\Memo Book Editor\sample_webp\test_{w_test}_q{q}.webp"
        enh_b.save(p, format="WEBP", quality=q, method=6)
        print(f"w={w_test}, q={q}: size={os.path.getsize(p)/1024:.1f} KB")
