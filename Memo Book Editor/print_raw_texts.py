import json

with open("ocr_results.json", "r", encoding="utf-8-sig") as f:
    data = json.load(f)

for d in data:
    txt = d.get("RawText", "").replace("\n", " | ")
    words = [w["Text"] for w in d.get("Words", [])]
    print(f"Page {d['Page']:02d}: text={repr(txt)}")
