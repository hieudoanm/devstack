from playwright.sync_api import sync_playwright
import csv

URL = "https://www.passportindex.org/byRank.php"
OUTPUT = "./csv/passport_ranking.csv"

with sync_playwright() as p:
    browser = p.firefox.launch(headless=False)
    page = browser.new_page()

    page.goto(URL, timeout=60000)

    # Wait for ranking table to render
    page.wait_for_selector("div.rank-table")

    # Select all divs with data-pr inside rank-table
    rows = page.query_selector_all("div.rank-table div[data-pr]")

    results = []

    for row in rows:
        rank = row.get_attribute("data-pr")

        name_el = row.query_selector("div.name_country")
        name = name_el.inner_text().strip() if name_el else ""

        results.append(
            {
                "rank": rank,
                "country": name,
            }
        )

    browser.close()

# Write to CSV
with open(OUTPUT, "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=["rank", "country"])
    writer.writeheader()
    writer.writerows(results)

print(f"✅ Scraped {len(results)} rows → {OUTPUT}")
