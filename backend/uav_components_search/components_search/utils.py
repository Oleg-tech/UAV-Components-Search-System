from .data_parser.get_json_data import find_json_files_list, parse_json
from .models import Component


# Returns an IP address of a user
def get_user_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


def extract_shops(components):
    list_of_shops = [component['componentShopName'] for component in components]
    return set(list_of_shops)


def extract_countries(components):
    list_of_countries = [component.get('componentCountry') for component in components]
    return set(list_of_countries)


def extract_companies(components):
    list_of_companies = [component['company'] for component in components if component.get('company')]
    return set(list_of_companies)


def extract_parameters(components):
    parameters_dict = {}

    for component in components:
        parameters_str = component.get('parameters')
        if parameters_str:
            parameters = parameters_str
            for param, value in parameters.items():
                if param in parameters_dict:
                    parameters_dict[param].add(value)
                else:
                    parameters_dict[param] = {value}

    return parameters_dict


def get_shops_data():
    shops_data = []
    json_files = find_json_files_list()

    for json_file in json_files:
        try:
            extracted_data = parse_json(json_file)
            shops_data.append(
                {
                    "name": extracted_data["shop_name"],
                    "base_url": extracted_data["base_url"],
                    "country": extracted_data["country"]
                }
            )
        except Exception as ex:
            print("Error with extracting data from json file:\n", ex)

    return shops_data


def extract_shop_json(shop_url):
    json_files = find_json_files_list()

    for json_file in json_files:
        extracted_data = parse_json(json_file)
        if extracted_data["base_url"] == shop_url:
            data = {
                "file_name": json_file.split('\\')[-1],
                "data": extracted_data
            }

            return data

    return None


def insert_parameters(components) -> list:
    for component in components:
        name = component['componentName']
        for db_component in Component.objects.all():
            if not component.get('company') and db_component.component_company in name:
                component['company'] = db_component.component_company

            db_name_words = db_component.component_name.split()
            similarity_count = 0
            for word in db_name_words:
                if word.lower() in name.lower():
                    similarity_count += 1
            if similarity_count == len(db_name_words):
                component['parameters'] = db_component.component_parameters

    return components
