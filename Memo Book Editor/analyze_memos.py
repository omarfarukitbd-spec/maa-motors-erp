import json
import re

with open(r"E:\maa-motors-erp\Memo Book Editor\ocr_results.json", "r", encoding="utf-8-sig") as f:
    data = json.load(f)

print(f"Loaded OCR results for {len(data)} pages.")

results = []

for item in data:
    page = item["Page"]
    raw_text = item.get("RawText", "")
    words = item.get("Words", [])
    
    # Candidate numbers: look for 2-4 digit numbers, especially starting with 1
    candidates = []
    for w in words:
        txt = w["Text"].strip()
        # Clean common OCR artifacts
        cleaned = re.sub(r'[^\d]', '', txt)
        if cleaned and 2 <= len(cleaned) <= 4:
            # Check position: memo number is near the top-left of the memo
            candidates.append({
                "num": int(cleaned),
                "str": cleaned,
                "x": w["X"],
                "y": w["Y"],
                "raw": txt
            })
            
    # Sort candidates by Y (highest on page first), then X (leftmost first)
    # The printed memo number is usually around y: 50-400 and x: 30-400 in the crop
    filtered = [c for c in candidates if c["y"] < 500 and c["x"] < 500]
    
    results.append({
        "page": page,
        "raw_text": raw_text.replace("\n", " | "),
        "candidates": filtered
    })

print("\n--- Detected Numbers per Page ---")
for r in results:
    cand_strs = [f"{c['num']} (x={c['x']}, y={c['y']})" for c in r["candidates"]]
    print(f"Page {r['page']:02d}: {', '.join(cand_strs) if cand_strs else 'NO CANDIDATE'}")
