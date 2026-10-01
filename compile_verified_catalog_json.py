import re
import json

bn_digits = {'০':'0', '১':'1', '২':'2', '৩':'3', '৪':'4', '৫':'5', '৬':'6', '৭':'7', '৮':'8', '৯':'9'}

def parse_price(s):
    if not s:
        return 0, 0
    # Clean up trailing /- or /
    s_clean = re.sub(r'/[-\s]*$', '', s).strip()
    # Split range by em-dash, en-dash, or hyphen
    parts = [p.strip() for p in re.split(r'[—–]|\s*-\s*', s_clean) if p.strip()]
    res = []
    for p in parts:
        d = ''.join(bn_digits.get(c, c if c.isdigit() else '') for c in p)
        if d:
            res.append(int(d))
    if not res:
        return 0, 0
    if len(res) == 1:
        return res[0], res[0]
    return res[0], res[-1]

# Load old data for enrichment (part numbers, secret codes, etc.)
old_map = {}
try:
    with open('Web_ERP/src/parts_catalog/initial-catalog-data.json', encoding='utf-8') as f:
        old_data = json.load(f)
        for item in old_data:
            clean = re.sub(r'\s*\([^)]*\)\s*$', '', item.get('nameBn', '')).strip().lower()
            old_map[clean] = item
except Exception as e:
    print("Old data load warning:", e)

# Read ground truth markdown
with open(r'C:\Users\Joni-pc\.gemini\antigravity-ide\brain\6d3404e3-87b6-4425-bf7e-a7216090c041\extracted_memo_parts_catalog.md', encoding='utf-8') as f:
    lines = f.readlines()

category_map = {
    '১': 'ইঞ্জিন ও ট্রান্সমিশন',
    '২': 'ইঞ্জিন ও ট্রান্সমিশন',
    '৩': 'ব্রেকিং সিস্টেম',
    '৪': 'স্টিয়ারিং ও সাসপেনশন',
    '৫': 'স্টিয়ারিং ও সাসপেনশন',
    '৬': 'ইঞ্জিন ও ট্রান্সমিশন',
    '৭': 'ইলেকট্রিক্যাল ও সেন্সর',
    '৮': 'কুলিং ও এসি',
    '৯': 'বডি ও সাসপেনশন'
}

current_category = 'ইঞ্জিন ও ট্রান্সমিশন'
catalog = []
item_idx = 1001

for line in lines:
    line = line.strip()
    # Check category header
    if line.startswith('## '):
        for num, cat in category_map.items():
            if f'## {num}.' in line or f'## {bn_digits.get(num, num)}.' in line:
                current_category = cat
                break
        continue

    if line.startswith('|') and not line.startswith('| ক্র:') and not line.startswith('| :---'):
        parts = [p.strip() for p in line.split('|')[1:-1]]
        if len(parts) >= 8:
            serial_bn = parts[0]
            raw_memo_name = parts[1]
            memo_ref = parts[2]
            std_bn_name = parts[3]
            tech_name_en = parts[4]
            vehicles = parts[5]
            raw_price = parts[6]
            unit = parts[7]

            # clean memo name (strip markdown bold)
            clean_memo_name = re.sub(r'[*_]', '', raw_memo_name).strip()
            # Primary name if multiple alternatives separated by '/'
            primary_name = clean_memo_name.split('/')[0].strip()

            min_val, max_val = parse_price(raw_price)
            # The actual memo price is the true wholesale baseline (Floor)
            floor = min_val if min_val > 0 else max_val

            # Wholesale Asking Buffer (হোলসেলারদের বাস্তব নেগোসিয়েশন করিডোর: বড় ফিগারে ৩-৪ হাজার, ছোটতে সামঞ্জস্যপূর্ণ)
            if max_val >= 100000:
                asking = max_val + 4000
            elif max_val >= 50000:
                asking = max_val + 2000
            elif max_val >= 20000:
                asking = max_val + 1500
            elif max_val >= 10000:
                asking = max_val + 800
            elif max_val >= 5000:
                asking = max_val + 600
            elif max_val >= 2000:
                asking = max_val + 300
            elif max_val >= 1000:
                asking = max_val + 200
            elif max_val >= 500:
                asking = max_val + 100
            elif max_val > 0:
                asking = max_val + 50
            else:
                asking = 0
                floor = 0

            # Determine Japanese OEM production year range and chassis codes
            v_lower = vehicles.lower()
            name_lower = clean_memo_name.lower()
            
            y_start = 2006
            y_end = 2012
            chassis = []
            engines = []
            warning = ""

            if '160' in v_lower or '2014' in v_lower or '160' in name_lower or '2014' in name_lower:
                y_start = 2012
                y_end = 2020
                chassis = ['NRE160', 'NZE161', 'NKE165']
                engines = ['1NZ-FE', '1NR-FE']
                warning = "পুরাতন 141 মডেলে ফিট হবে না (160 আলাদা বডি ও সিস্টেম)"
            elif '141' in v_lower or '141' in name_lower:
                y_start = 2006
                y_end = 2012
                chassis = ['NZE141', 'ZRE142']
                engines = ['1NZ-FE']
                if '260' in v_lower or 'allion' in v_lower or 'premio' in v_lower:
                    warning = "Axio 141 এবং Allion 260 উভয়ে ব্যবহারযোগ্য"
            elif '260' in v_lower or 'allion' in v_lower or 'premio' in v_lower or '260' in name_lower:
                y_start = 2007
                y_end = 2020
                chassis = ['NZT260', 'ZRT260']
                engines = ['1NZ-FE', '2ZR-FAE']
            elif '121' in v_lower or 'nze' in v_lower or 'corolla' in v_lower or 'nze' in name_lower:
                if '2005' in v_lower or '2005' in name_lower:
                    y_start = 2004
                    y_end = 2006
                    warning = "অপটিক্যাল রিফ্রেশ মডেল (২০০১-২০০৩ সকেটের সাথে মিলবে না)"
                elif '2003' in v_lower or '2003' in name_lower:
                    y_start = 2001
                    y_end = 2004
                    warning = "আর্লি মডেল (২০০৪ এর পরের অপটিক্যালে সকেট ভিন্ন)"
                else:
                    y_start = 2001
                    y_end = 2006
                chassis = ['NZE121', 'ZZE122']
                engines = ['1NZ-FE']
            elif 'probox' in v_lower or 'probox' in name_lower or 'প্রোবক্স' in name_lower:
                y_start = 2002
                y_end = 2014
                chassis = ['NCP50', 'NCP51', 'NCP58']
                engines = ['1NZ-FE', '2NZ-FE']
            elif 'rush' in v_lower or 'রাশের' in name_lower:
                y_start = 2006
                y_end = 2017
                chassis = ['J200', 'F700']
                warning = "টয়োটা রাশ ও ডাইহাটসু তেরিওস স্পেসিফিক (করোলায় মিলবে না)"
            elif 'voxy 70' in v_lower or '2010' in v_lower or 'zrr70' in v_lower or '2010' in name_lower:
                y_start = 2007
                y_end = 2014
                chassis = ['ZRR70', 'ZRR75']
                engines = ['3ZR-FAE']
                warning = "ভক্সি/নোহা ৭০ সিরিজ (৬০ সিরিজে ফিট হবে না)"
            elif 'voxy 60' in v_lower or '2003' in v_lower or 'azr60' in v_lower or 'স্কয়ার' in name_lower:
                y_start = 2001
                y_end = 2007
                chassis = ['AZR60', 'AZR65']
                engines = ['1AZ-FSE']
            elif 'trh' in v_lower or 'hiace' in v_lower or 'trh' in name_lower:
                y_start = 2004
                y_end = 2020
                chassis = ['TRH200', 'KDH200']
                engines = ['1TR-FE']
            elif 'kr42' in v_lower or 'townace' in v_lower or '7k' in name_lower or 'kr42' in name_lower:
                y_start = 1996
                y_end = 2007
                chassis = ['KR42', 'CR42']
                engines = ['7K-E']
            elif 'vezel' in v_lower or 'ভেজেল' in name_lower:
                y_start = 2013
                y_end = 2020
                chassis = ['RU1', 'RU3']
                warning = "হোন্ডা ইলেকট্রিক পাওয়ার স্টিয়ারিং (টয়োটায় মিলবে না)"
            elif '100' in v_lower or 'ae100' in v_lower or '5a' in name_lower or '100' in name_lower:
                y_start = 1991
                y_end = 2000
                chassis = ['AE100', 'AE110']
                engines = ['5A-FE']
            elif 'wish' in v_lower or 'wish' in name_lower:
                y_start = 2003
                y_end = 2009
                chassis = ['ZNE10', 'ANE10']
                engines = ['1ZZ-FE']
            elif 'harrier' in v_lower or 'হেরিয়ার' in name_lower:
                if '2015' in name_lower or '2015' in v_lower:
                    y_start = 2013
                    y_end = 2020
                    chassis = ['AVU65', 'ZSU60']
                else:
                    y_start = 2003
                    y_end = 2013
                    chassis = ['ACU30', 'MCU30']
            else:
                y_start = 2006
                y_end = 2012
                chassis = ['NZE141']
                engines = ['1NZ-FE']

            # Match with old data if available
            old_item = old_map.get(primary_name.lower()) or old_map.get(clean_memo_name.lower())
            
            part_id = f"PART-{item_idx}"
            item_idx += 1

            oem_part = old_item.get('oemPartNumber', '') if old_item else ''
            secret_code = old_item.get('secretCode', '') if old_item else ''
            location = old_item.get('locationShop', 'দোকান তাক A') if old_item else 'দোকান তাক A'
            container = old_item.get('lastContainerTag', 'CT-2026-AUG-DXB') if old_item else 'CT-2026-AUG-DXB'
            if old_item and old_item.get('mismatchWarning'):
                warning = old_item['mismatchWarning']

            # Vehicle models clean list
            models_list = [m.strip() for m in re.split(r'[,/]', vehicles) if m.strip()]

            # Specific manual mappings for the 10 multi-memo items with price ranges
            range_rate_mappings = {
                'vvti কাভার': {'107': 1200, '113': 1400, '132': 1300, '170': 1200},
                'রাশের বুস্টার': {'105': 3800, '112': 4000},
                'trh বুস্টার': {'103': 13000, '112': 13500},
                'axio ২০১৪ রেক': {'103': 5000, '106': 5000, '111': 5200, '131': 5000},
                'axio ২০১৪ মেইন মনটিন': {'101': 2500, '113': 2700},
                '৪০/৬৫ কয়েল': {'108': 10300, '132': 10500},
                '১২ পিন ইনজেকটার': {'101': 2800, '108': 2900},
                'axio তারওয়ালা মোটর': {'106': 1500, '113': 1700, '170': 1500},
                'axio ফ্যান মোটর': {'106': 1500, '113': 1700, '170': 1500},
                'axio ওয়াটার জেকেট পাইপসহ': {'107': 1100, '114': 1300},
                'wish প্লেইন কাটিং': {'103': 9300, '104': 9500, '107': 9500, '111': 10000}
            }

            memo_history = []
            matches = re.findall(r'মেমো\s*([০-৯]+)\s*(?:\(লাইন\s*([^)]+)\))?', memo_ref)
            for m_bn, line_bn in matches:
                m_en = ''.join(bn_digits.get(c, c) for c in m_bn)
                item_rate = max_val
                for k, vmap in range_rate_mappings.items():
                    if k in clean_memo_name.lower():
                        if m_en in vmap:
                            item_rate = vmap[m_en]
                        break

                memo_history.append({
                    "memoNo": m_en,
                    "memoNoBn": m_bn,
                    "line": line_bn.strip() if line_bn else "",
                    "rate": item_rate,
                    "unit": unit,
                    "memoImageUrl": f"/memos/{m_en}.webp"
                })

            entry = {
                "id": part_id,
                "nameBn": primary_name,
                "memoOriginalName": clean_memo_name,
                "aliasesBn": [clean_memo_name, std_bn_name, primary_name],
                "nameEn": tech_name_en,
                "oemPartNumber": oem_part or "OEM N/A",
                "category": current_category,
                "sideAvailable": "প্রযোজ্য নয়",
                "defaultUnit": unit,
                "pcsPerUnit": 1,
                "askingPrice": asking,
                "floorPrice": floor,
                "singlePiecePrice": asking if unit == 'পিছ' else round(asking / 2),
                "oldCoreDiscount": round(asking * 0.08) if asking >= 5000 else 0,
                "engineCC": "1500cc / 1800cc",
                "transmissionType": "CVT / Automatic",
                "popularModels": models_list,
                "generationCode": (chassis[0] + " Series") if chassis else "Toyota OEM",
                "compatibleChassis": chassis,
                "compatibleEngines": engines,
                "yearStart": y_start,
                "yearEnd": y_end,
                "mismatchWarning": warning,
                "secretCode": secret_code,
                "locationShop": location,
                "lastContainerTag": container,
                "memoReference": memo_ref,
                "memoHistory": memo_history
            }
            catalog.append(entry)

print(f"Compiled {len(catalog)} ground-truth parts.")
with open('Web_ERP/src/parts_catalog/initial-catalog-data.json', 'w', encoding='utf-8') as f:
    json.dump(catalog, f, ensure_ascii=False, indent=2)

print("Saved to Web_ERP/src/parts_catalog/initial-catalog-data.json successfully!")
