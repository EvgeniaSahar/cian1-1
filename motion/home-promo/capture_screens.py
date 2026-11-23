from pathlib import Path

from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[2]
OUTPUT = Path(__file__).resolve().parent / "assets"


def capture(page, name):
    page.screenshot(path=str(OUTPUT / f"{name}.png"), full_page=False)


def main():
    OUTPUT.mkdir(exist_ok=True)
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch()
        page = browser.new_page(viewport={"width": 430, "height": 932}, device_scale_factor=2)
        page.goto((ROOT / "index.html").as_uri())
        page.wait_for_timeout(200)
        capture(page, "home")
        page.locator("#recommendations-title").scroll_into_view_if_needed()
        page.wait_for_timeout(100)
        capture(page, "recommendations")
        page.evaluate("window.scrollTo(0, 1150)")
        page.wait_for_timeout(100)
        capture(page, "feed")
        page.evaluate("window.scrollTo(0, 0)")

        page.get_by_text("Купить квартиру", exact=True).click()
        page.wait_for_timeout(100)
        capture(page, "saved-search")

        page.get_by_role("button", name="Купить", exact=True).click()
        page.wait_for_timeout(100)
        capture(page, "buy")
        page.locator("#direction-sheet .close").click()

        page.locator(".search-trigger").click()
        page.locator("#query-input").fill("Савёловская")
        page.wait_for_timeout(100)
        capture(page, "search")
        browser.close()


if __name__ == "__main__":
    main()
