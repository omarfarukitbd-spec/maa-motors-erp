import os
import re
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Paths
catalog_json_path = r"E:\maa-motors-erp\Web_ERP\src\parts_catalog\initial-catalog-data.json"
memos_folder = r"E:\maa-motors-erp\Memo Book Editor\Memo_Markdown_201_300"

CATALOG_VERSION = "v3_wholesale_memos_201_300_2026"

bengali_digits = {'0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'}
def to_bn_num(n):
    return ''.join(bengali_digits.get(c, c) for c in str(n))

def parse_num(val):
    if not val:
        return 0
    clean = re.sub(r"[^\d]", "", str(val))
    return int(clean) if clean else 0

def assign_category(name, car_model=''):
    n = (name + ' ' + car_model).lower()
    if any(k in n for k in ['ইঞ্জিন', 'engine', 'ব্লক', 'হেড', 'পিস্টন', 'মন্টিন', 'মাউন্টিং', 'mounting', 'বাটারফ্লাই', 'ট্যাপেট', 'vvti', 'কয়েল', 'কয়েল', 'গিয়ার', 'গিয়ার', 'gear', 'cvt', 'ক্লাচ', 'clutch', 'নজেল', 'ইনজেক্টর', 'মেনিফুল', 'চেম্বারের', 'অয়েল পাম্প', 'অয়েল পাম্প', 'এডজেস্টার', 'পুলি']):
        return 'ইঞ্জিন ও ট্রান্সমিশন'
    elif any(k in n for k in ['রেক', 'rack', 'স্টিয়ারিং', 'পাওয়ার পাম্প', 'পাওয়ার পাম্প', 'টাই রড', 'হাবস', 'হাব', 'hub', 'জুয়েন্ট', 'জুয়েন্ট', 'cv', 'এক্সেল', 'flange', 'কুলব', 'স্প্রিং', 'শক', 'টানা রড', 'ব্যালেন্স', 'কন্ট্রোল আর্ম']):
        return 'স্টিয়ারিং ও সাসপেনশন'
    elif any(k in n for k in ['বুস্টার', 'booster', 'ড্রাম', 'drum', 'ডিস্ক', 'disc', 'abs', 'ব্রেক', 'brake', 'হুইল সিলেন্ডার', 'হুইল সেলেন্ডার', 'ডাস্ট প্লেট', 'ক্যালিফার', 'ব্রেক সু', 'ব্রেক প্যাড']):
        return 'ব্রেকিং সিস্টেম'
    elif any(k in n for k in ['ডায়নামা', 'ডায়নামা', 'অল্টারনেটর', 'সেল', 'স্টার্টার', 'ডায়নামো', 'সেন্সার', 'সেন্সর', 'প্লাগ', 'কন্ট্রোলার', 'রিলে', 'হর্ন', 'সুইচ', 'মিটার', 'ইগনিশন']):
        return 'ইলেকট্রিক্যাল ও সেন্সর'
    elif any(k in n for k in ['থার্মোস্টার', 'রেডিয়েটর', 'রেডিয়েটর', 'ফ্যান', 'কুলার', 'cooler', 'কুলিং', 'ওয়াটার', 'ওয়াটার', 'এসি', 'ac', 'কম্প্রেসার', 'কন্ডেন্সার', 'পেপসুল পাইপ', 'পেসকুল', 'পানির t', 'হোস পাইপ']):
        return 'কুলিং ও এসি'
    else:
        return 'বডি ও সাসপেনশন'

# 1. Load existing catalog
with open(catalog_json_path, "r", encoding="utf-8") as f:
    catalog = json.load(f)

print(f"Loaded existing catalog items: {len(catalog)}")

# Find highest numeric ID e.g. PART-1134 -> 1134
highest_id_num = 1000
for item in catalog:
    item["catalogVersion"] = CATALOG_VERSION
    pid = item.get("id", "")
    m = re.search(r"PART-(\d+)", pid)
    if m:
        num = int(m.group(1))
        if num > highest_id_num:
            highest_id_num = num

print(f"Highest existing Part ID number: {highest_id_num}")

# Index existing parts by clean names & aliases
parts_by_name = {}
for p in catalog:
    clean_bn = p["nameBn"].strip().lower()
    parts_by_name[clean_bn] = p
    for alias in p.get("aliasesBn", []):
        parts_by_name[alias.strip().lower()] = p

# Regex for table rows
row_pattern = re.compile(r"^\|\s*(\d+|--)\s*\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|")

merged_existing_count = 0
new_parts_created_count = 0
lot_chalan_skipped = 0

# Parse all 100 memos
for m_num in range(201, 301):
    fpath = os.path.join(memos_folder, f"memo_{m_num}.md")
    if not os.path.exists(fpath):
        continue
    
    with open(fpath, "r", encoding="utf-8", errors="ignore") as f:
        lines = f.readlines()
    
    # Metadata from header
    date_val = ""
    customer_val = ""
    memo_img_url = ""
    
    for l in lines[:10]:
        l_s = l.strip()
        if "**তারিখ**:" in l_s:
            date_val = l_s.split("**তারিখ**:")[1].strip()
        elif "**গ্রাহকের নাম**:" in l_s:
            customer_val = l_s.split("**গ্রাহকের নাম**:")[1].strip()
            # Clean customer ID prefix e.g. [10022]
            customer_val = re.sub(r"^\[\d+\]\s*", "", customer_val)
        elif "**মেমো ছবির লিংক**:" in l_s:
            memo_img_url = l_s.split("**মেমো ছবির লিংক**:")[1].strip()
    
    in_table = False
    for line in lines:
        line_s = line.strip()
        if line_s.startswith("| লাইন") or line_s.startswith("|লাইন"):
            in_table = True
            continue
        if in_table and line_s.startswith("| :---"):
            continue
        if in_table and line_s.startswith("|"):
            m_row = row_pattern.match(line_s)
            if m_row:
                l_no = m_row.group(1).strip()
                raw_name = m_row.group(2).strip()
                car_model = m_row.group(3).strip()
                qty = m_row.group(4).strip()
                rate_str = m_row.group(5).strip()
                status = m_row.group(7).strip()
                
                # Check for struck-out / canceled items
                if "~~" in raw_name or "বাতিল" in status:
                    continue
                
                clean_name = re.sub(r"\[.*?\]", "", raw_name).strip().replace("~~", "")
                if not clean_name:
                    continue
                
                # Rule: চালানি মালামাল এবং লট হিসেবে যেগুলোর রেইট আছে সেগুলো আসবে না
                is_lot_or_chalan = (
                    "লট" in qty or 
                    "lot" in qty.lower() or 
                    any(k in clean_name for k in ["চালান", "চালানী", "লট"]) or 
                    clean_name in ["মাল", "মালামাল", "খুচরা মালামাল", "কেরিং", "কেরিং খরচ"]
                )
                if is_lot_or_chalan:
                    lot_chalan_skipped += 1
                    continue
                
                # Parse numeric rate
                rate = parse_num(rate_str)
                unit = "পিছ"
                if "সেট" in qty:
                    unit = "সেট"
                elif "জোড়া" in qty or "জোড়া" in qty:
                    unit = "জোড়া"
                
                history_entry = {
                    "memoNo": str(m_num),
                    "memoNoBn": to_bn_num(m_num),
                    "line": l_no,
                    "rate": rate,
                    "unit": unit,
                    "date": date_val,
                    "customerName": customer_val,
                    "memoImageUrl": memo_img_url
                }
                
                name_lookup = clean_name.lower()
                
                # Check if existing part matches
                if name_lookup in parts_by_name:
                    target_part = parts_by_name[name_lookup]
                    
                    # Ensure memoHistory exists
                    if "memoHistory" not in target_part or not isinstance(target_part["memoHistory"], list):
                        target_part["memoHistory"] = []
                    
                    # Avoid duplicate history entries
                    already_in_hist = any(
                        h.get("memoNo") == str(m_num) and h.get("line") == l_no
                        for h in target_part["memoHistory"]
                    )
                    
                    if not already_in_hist:
                        target_part["memoHistory"].append(history_entry)
                        merged_existing_count += 1
                    
                    # Price Corridor adjustment
                    if rate > 0:
                        if target_part.get("askingPrice", 0) == 0 or rate > target_part.get("askingPrice", 0):
                            target_part["askingPrice"] = rate
                        if target_part.get("floorPrice", 0) == 0 or rate < target_part.get("floorPrice", 0):
                            target_part["floorPrice"] = rate
                    
                    # Popular models update
                    if car_model and car_model != "-" and car_model not in target_part.get("popularModels", []):
                        if "popularModels" not in target_part:
                            target_part["popularModels"] = []
                        target_part["popularModels"].append(car_model)
                else:
                    # Brand New Part!
                    highest_id_num += 1
                    new_id = f"PART-{highest_id_num}"
                    
                    cat = assign_category(clean_name, car_model)
                    models = [car_model] if car_model and car_model != "-" else []
                    
                    new_part = {
                        "id": new_id,
                        "catalogVersion": CATALOG_VERSION,
                        "nameBn": clean_name,
                        "memoOriginalName": clean_name,
                        "aliasesBn": [clean_name],
                        "nameEn": car_model if car_model and car_model != "-" else clean_name,
                        "oemPartNumber": "",
                        "category": cat,
                        "sideAvailable": "প্রযোজ্য নয়",
                        "defaultUnit": unit,
                        "pcsPerUnit": 1,
                        "askingPrice": rate,
                        "floorPrice": rate,
                        "singlePiecePrice": rate,
                        "oldCoreDiscount": round(rate * 0.08),
                        "engineCC": "",
                        "transmissionType": "",
                        "popularModels": models,
                        "generationCode": "",
                        "compatibleChassis": [],
                        "compatibleEngines": [],
                        "yearStart": None,
                        "yearEnd": None,
                        "mismatchWarning": "",
                        "secretCode": "",
                        "locationShop": "গোডাউন-১",
                        "lastContainerTag": "CT-2026-OCT-DXB",
                        "memoReference": f"মেমো {m_num} (লাইন {l_no})",
                        "memoHistory": [history_entry]
                    }
                    
                    catalog.append(new_part)
                    parts_by_name[name_lookup] = new_part
                    new_parts_created_count += 1
        elif in_table and not line_s.startswith("|") and line_s:
            in_table = False

print(f"Skipped lot/chalan items: {lot_chalan_skipped}")
print(f"Merged history lines into existing parts: {merged_existing_count}")
print(f"New unique parts created: {new_parts_created_count}")
print(f"Total parts in final consolidated catalog: {len(catalog)}")

# Write to file
with open(catalog_json_path, "w", encoding="utf-8") as f:
    json.dump(catalog, f, ensure_ascii=False, indent=2)

print(f"Successfully saved updated catalog to: {catalog_json_path}")

