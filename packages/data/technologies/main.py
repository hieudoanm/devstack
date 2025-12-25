import csv
import json
import re


def slugify(value: str) -> str:
    value = value.lower()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-")


sections = {}

with open("csv/technologies.csv", newline="", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        category_id: str = row["category_id"].strip()
        category: str = row["category"].strip()

        if category_id not in sections:
            sections[category_id] = {
                "id": slugify(category_id),
                "category": category,
                "technologies": [],
            }

        tech = {
            "id": slugify(row["name"]),
            "name": row["name"],
            # ✅ keep href even if empty
            "href": row.get("href", "").strip(),
        }

        sections[category_id]["technologies"].append(tech)

output = list(sections.values())

with open("json/technologies.json", "w", encoding="utf-8") as f:
    json.dump(output, f, indent=2, ensure_ascii=False)

print("✅ json/technologies.json generated (href preserved)")
