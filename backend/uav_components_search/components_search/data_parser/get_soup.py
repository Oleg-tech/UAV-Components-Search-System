import requests
from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup


def scroll_down_page(page):
    _scroll_step = 200
    _scroll_delay = 0.4

    _prev_height = -1
    _max_scrolls = 50
    _scroll_count = 0

    while _scroll_count < _max_scrolls:
        current_height = page.evaluate("document.documentElement.scrollTop")

        new_height = current_height + _scroll_step
        page.evaluate(f"window.scrollTo(0, {new_height})")

        page.wait_for_timeout(_scroll_delay * 1000)

        max_height = page.evaluate("document.body.scrollHeight")
        if new_height >= max_height:
            break

        _prev_height = new_height
        _scroll_count += 1


def get_soup_playwright(url, selector_to_wait, scroll_down):
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False, slow_mo=50)
        page = browser.new_page()
        page.goto(url)

        # Зачекати повного провантаження сторінки
        if selector_to_wait:
            page.wait_for_selector(selector_to_wait)

        # page.wait_for_selector('div.rps-main-content-container')
        # page.wait_for_timeout(10000)

        if scroll_down:
            scroll_down_page(page)

        html = page.content()
        browser.close()

        soup = BeautifulSoup(html, 'html.parser')

        return soup


def get_soup_requests(url, headers):
    response = requests.get(url=url, headers=headers)
    response_body = response.text

    print("Status = ", response.status_code)

    soup = BeautifulSoup(response_body, 'html.parser')

    return soup

