import csv


path_to_file = 'products_data.csv'


def put_into_csv(shop_name, names, prices, img_urls, product_urls):
    shop_names = [shop_name for i in range(len(prices))]
    rows = zip(shop_names, names, prices, img_urls, product_urls)

    # Fields: shop, name, price, image url, product url
    with open(path_to_file, 'a', newline='', encoding='utf-8') as csvfile:
        spamwriter = csv.writer(csvfile, delimiter=';', quotechar='"', quoting=csv.QUOTE_MINIMAL)
        spamwriter.writerow(['Shop', 'Name', 'Price', 'Image URL', 'Product URL'])
        spamwriter.writerows(rows)
