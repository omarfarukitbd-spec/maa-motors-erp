import zipfile, io, re
import xml.etree.ElementTree as ET
from PIL import Image, ImageDraw

def patch_logo():
    # 1. Create transparent circular logo
    orig = Image.open(r"E:\maa-motors-erp\Web_ERP\public\shop-official-logo.jpg").convert("RGBA")
    w, h = orig.size
    scale = 4
    big_w, big_h = w * scale, h * scale
    mask = Image.new("L", (big_w, big_h), 0)
    draw = ImageDraw.Draw(mask)
    cx, cy = 511.0 * scale, 510.0 * scale
    r = 503 * scale
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=255)
    smooth_mask = mask.resize((w, h), Image.Resampling.LANCZOS)
    logo_png = orig.copy()
    logo_png.putalpha(smooth_mask)

    logo_bytes = io.BytesIO()
    logo_png.save(logo_bytes, format="PNG")
    logo_bytes = logo_bytes.getvalue()

    # 2. Read existing docx bytes
    with open("Container_Expense_Statement_Form.docx", "rb") as f:
        orig_docx_bytes = f.read()

    in_zip = zipfile.ZipFile(io.BytesIO(orig_docx_bytes), "r")
    out_buf = io.BytesIO()
    out_zip = zipfile.ZipFile(out_buf, "w", compression=zipfile.ZIP_DEFLATED)

    for item in in_zip.infolist():
        name = item.filename
        if name == "word/media/hdphoto1.wdp":
            continue
        
        content = in_zip.read(name)
        
        if name == "word/media/image1.png":
            content = logo_bytes
        elif name == "word/document.xml":
            xml = content.decode("utf-8")
            old_pic_pattern = r"<pic:pic\b.*?</pic:pic>"
            new_pic = (
                '<pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">'
                '<pic:nvPicPr><pic:cNvPr id="0" name="shop-official-logo.png"/><pic:cNvPicPr/></pic:nvPicPr>'
                '<pic:blipFill><a:blip r:embed="rId8"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill>'
                '<pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="777240" cy="777240"/></a:xfrm>'
                '<a:prstGeom prst="ellipse"><a:avLst/></a:prstGeom></pic:spPr></pic:pic>'
            )
            xml = re.sub(old_pic_pattern, new_pic, xml)
            content = xml.encode("utf-8")
        elif name == "word/_rels/document.xml.rels":
            root = ET.fromstring(content)
            for child in list(root):
                if child.attrib.get("Id") == "rId9" or "hdphoto" in child.attrib.get("Type", ""):
                    root.remove(child)
            content = ET.tostring(root, xml_declaration=True, encoding="utf-8")
        elif name == "[Content_Types].xml":
            root = ET.fromstring(content)
            for child in list(root):
                if child.attrib.get("Extension") == "wdp":
                    root.remove(child)
            content = ET.tostring(root, xml_declaration=True, encoding="utf-8")
            
        out_zip.writestr(item, content)

    out_zip.close()
    in_zip.close()

    final_bytes = out_buf.getvalue()
    with open("Container_Expense_Statement_Form_RoundLogo.docx", "wb") as f:
        f.write(final_bytes)
    print("Container_Expense_Statement_Form_RoundLogo.docx created successfully! Size:", len(final_bytes))

    # Also try to overwrite Container_Expense_Statement_Form.docx if unlocked
    try:
        with open("Container_Expense_Statement_Form.docx", "wb") as f:
            f.write(final_bytes)
        print("Container_Expense_Statement_Form.docx OVERWRITTEN successfully!")
        return True
    except PermissionError:
        print("Container_Expense_Statement_Form.docx is currently locked by Word.")
        return False

if __name__ == "__main__":
    patch_logo()
