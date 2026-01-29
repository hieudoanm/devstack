import csv
import json
import re

ALL_FILE = "./csv/all.csv"
RANK_FILE = "./csv/passport_ranking.csv"
COUNTRIES_CSV = "./csv/countries.csv"
COUNTRIES_JSON = "./json/countries.json"


def normalize(name: str) -> str:
    """
    Normalize country names for matching:
    - lowercase
    - remove punctuation
    - collapse whitespace
    """
    name = name.lower()
    name = name.replace(" ", "")
    name = re.sub(r"[^\w\s]", "", name)
    name = re.sub(r"\s+", " ", name)
    return name.strip()


# --- Load passport ranks ---
rank_by_country = {}

with open(RANK_FILE, newline="", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        key = normalize(row["country"])
        rank_by_country[key] = row["rank"]


# --- Load countries and merge ---
merged_rows = []

with open(ALL_FILE, newline="", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    fieldnames = reader.fieldnames + ["passport_rank"]

    for row in reader:
        key = normalize(row["name"])
        row["passport_rank"] = rank_by_country.get(key)
        merged_rows.append(row)


# --- Write CSV ---
with open(COUNTRIES_CSV, "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(merged_rows)


# --- Write JSON ---
json_rows = []
for row in merged_rows:
    row_copy = dict(row)
    row_copy["passport_rank"] = (
        int(row_copy["passport_rank"]) if row_copy.get("passport_rank") else None
    )
    json_rows.append(row_copy)

with open(COUNTRIES_JSON, "w", encoding="utf-8") as f:
    json.dump(json_rows, f, ensure_ascii=False, indent=2)


print(f"✅ Merged {len(merged_rows)} countries → {COUNTRIES_CSV} & {COUNTRIES_JSON}")
