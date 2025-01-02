import re

from ..models import Currency

currency_values = {
    "UAH": 1.0,
    "USD": Currency.objects.filter(currency_acronym="USD").first().current_rate or 0,
    # "GBP": Currency.objects.filter(currency_acronym="GBP").first().current_rate or 0,
    # "EUR": Currency.objects.filter(currency_acronym="EUR").first().current_rate or 0
}

# print("CURRENCY VALUE DATA = ", currency_values)


def convert_to_uah(value, currency):
    return value * currency_values[currency]


def extract_price(price_str, pattern, has_price_interval, separator, currency):
    try:
        # Декодування рядка з використанням кодування cp1251
        # price_str = price_str.encode('cp1251').decode('cp1251')
        # separator = separator.encode('cp1251').decode('cp1251')
        # print("Decoded =", price_str)

        parts = [price_str.replace('\xa0', '')]
        if separator and price_str.find(separator):
            parts = price_str.replace('\xa0', '').split(separator)

        if not has_price_interval:
            match = re.search(pattern, parts[-1])
            if match:
                price = float(match.group(1).replace(',', '').replace(' ', ''))
                return convert_to_uah(price, currency)

        # Finish this part
        if len(parts) > 2:
            print("Сталась помилка при конвертації ціни")
            return

        if len(parts) == 1:
            match = re.search(pattern, parts[-1])
            if match:
                price = float(match.group(1).replace(',', '').replace(' ', ''))
                return price

        interval_price_1 = float(parts[0].strip().replace(',', '').replace(' ', ''))

        compiled_pattern = re.compile(pattern)
        interval_match_2 = compiled_pattern.search(parts[1])

        if interval_match_2:
            interval_price_2 = float(interval_match_2.group(1).replace(',', '').replace(' ', ''))
            return f"{interval_price_1} - {interval_price_2}"

    except Exception as ex:
        print("Error happened while converting the price:\n", ex)
        return price_str
