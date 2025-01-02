import requests
from bs4 import BeautifulSoup
from django.utils import timezone

from .models import Currency


request_url = 'https://minfin.com.ua/ua/currency/nbu/'

headers = {
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'accept-language': 'uk,ru-RU;q=0.9,ru;q=0.8,en-US;q=0.7,en;q=0.6',
    'cache-control': 'max-age=0',
    'priority': 'u=0, i',
    'referer': 'https://www.google.com/',
    'sec-ch-ua': '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
    'sec-ch-ua-mobile': '?1',
    'sec-ch-ua-platform': '"Android"',
    'sec-fetch-dest': 'document',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-site': 'cross-site',
    'sec-fetch-user': '?1',
    'upgrade-insecure-requests': '1',
    'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
}


def get_soup():
    response = requests.get(
        url=request_url,
        headers=headers
    )
    response_body = response.text

    print("Status = ", response.status_code)

    soup = BeautifulSoup(response_body, 'html.parser')

    return soup


def parse_currency_rate(soup):
    currency_dict = {}

    section_object = soup.find(
        name="section", attrs={"class": "sc-1g5vxh6-0 sc-1isfolc-0 jOWCCW iupcZc"}
    )

    table_object = section_object.find(
        name="table", attrs={"class": "sc-1x32wa2-1 dYkgjk"}
    )

    body = table_object.tbody

    currency_list = body.find_all(
        name="tr",
        attrs={"class": "sc-1x32wa2-4 dKDsVV"}
    )

    for currency in currency_list:
        acronym = currency.find(
            name="td", attrs={"class": "sc-1x32wa2-6 bIIiwq"}
        )

        rate = currency.find(
            name="div", attrs={"class": "sc-1x32wa2-9 fevpFL"}
        ).contents[0]

        currency_dict[acronym.text] = float(rate.text.replace(',', '.'))

    return currency_dict


def main_exchange_rate():
    # Check if the exchange rate data was updated today
    today = timezone.now().date()

    currency = Currency.objects.get(id=2)
    last_updated_date = currency.last_updated_at.date()

    if last_updated_date < today:
        soup = get_soup()

        parse_result = parse_currency_rate(soup)

        for acronym, rate in parse_result.items():
            try:
                currency = Currency.objects.get(currency_acronym=acronym)
                currency.current_rate = rate
                currency.last_updated_at = timezone.now()
                currency.save()
                print(f"Оновлено курс для {acronym} до {rate}.")
            except Exception as ex:
                print(f"Запис для {acronym} не знайдено:\n", ex)
