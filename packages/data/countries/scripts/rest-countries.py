import csv
import json
import requests
from pathlib import Path

API_URL = (
    "https://restcountries.com/v3.1/all?fields=name,region,subregion,cca2,cca3,flag"
)

CSV_DIR = Path("./csv")
JSON_DIR = Path("./json")

CSV_DIR.mkdir(exist_ok=True)
JSON_DIR.mkdir(exist_ok=True)

csv_path = CSV_DIR / "all.csv"
json_path = JSON_DIR / "all.json"

# 1️⃣ Fetch data from API
response = requests.get(API_URL)
response.raise_for_status()
all = response.json()

# 2️⃣ Write CSV
with open(csv_path, "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(
        ["name", "official_name", "region", "subregion", "cca2", "cca3", "flag"]
    )

    for c in all:
        writer.writerow(
            [
                c.get("name", {}).get("common", ""),
                c.get("name", {}).get("official", ""),
                c.get("region", ""),
                c.get("subregion", ""),
                c.get("cca2", ""),
                c.get("cca3", ""),
                c.get("flag", ""),
            ]
        )

print("✅ CSV generated:", csv_path)

# 3️⃣ Convert CSV → JSON
data = []

with open(csv_path, newline="", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        data.append(row)

with open(json_path, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("✅ JSON generated:", json_path)
