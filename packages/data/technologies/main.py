import csv
import json
import re
from pathlib import Path


def slugify(value: str) -> str:
    value = value.lower()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-")


# Read CSV and organize sections
sections = {}
csv_path = "csv/technologies.csv"

with open(csv_path, newline="", encoding="utf-8") as f:
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
            "href": row.get("href", "").strip(),
            "group": category_id,  # Added group
            "category": category,  # Added category
        }

        sections[category_id]["technologies"].append(tech)

# Convert to JSON
output = list(sections.values())
Path("json").mkdir(exist_ok=True)
with open("json/technologies.json", "w", encoding="utf-8") as f:
    json.dump(output, f, indent=2, ensure_ascii=False)
print("✅ json/technologies.json generated (href preserved)")

# Convert to Markdown tables with additional columns
md_lines = []
for cat in output:
    md_lines.append(f"## {cat['category']}\n")
    md_lines.append("| Group | Category | Name | URL |")
    md_lines.append("| ----- | -------- | ---- | --- |")
    for tech in cat["technologies"]:
        href = tech["href"] if tech["href"] else ""
        url_md = f"[{tech['name']}]({href})" if href else ""
        md_lines.append(
            f"| {tech['group']} | {tech['category']} | {tech['name']} | {url_md} |"
        )
    md_lines.append("\n")

md_path = Path("md/README.md")
md_path.parent.mkdir(exist_ok=True)
with open(md_path, "w", encoding="utf-8") as f:
    f.write("\n".join(md_lines))

print(f"✅ {md_path} generated with Group and Category columns")
