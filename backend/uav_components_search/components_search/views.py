import os
import json
import asyncio
import concurrent.futures

from rest_framework.pagination import PageNumberPagination
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import HttpResponse
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .data_parser.get_json_data import find_json_files_list, parse_json
from .data_parser.asyncio_main_parser import asyncio_main_parser, asyncio_main_parser_for_categories
from .data_parser.remove_inappropriate import remove_inappropriate_components
from .models import UserMassage
from .utils import (
    get_user_ip, extract_shops, extract_countries, get_shops_data,
    extract_shop_json, insert_parameters, extract_companies, extract_parameters
)
from .services import get_redis_connection
from .api.pagination import ComponentsResultPagination, CategoryResultPagination, ShopsPagination, UserMessagesPagination
from .api.serializers import ComponentSerializer
from .api.filters import create_result_components_list, get_min_and_max
from .get_current_exchange_rate import main_exchange_rate


def index(request):
    return HttpResponse("Hello, world. You're at the polls index.")


def extract_parameter_filters(parameters):
    new_parameters = {}

    if parameters:
        for key, value in parameters.items():
            if value:
                new_parameters[key] = value

    return new_parameters


def run_asyncio_main_parser(user_ip, query):
    loop = asyncio.new_event_loop()
    try:
        components = loop.run_until_complete(asyncio_main_parser(user_ip, query))
    finally:
        loop.close()
    return components


class FindComponentView(APIView):
    pagination_class = ComponentsResultPagination

    def post(self, request, *args, **kwargs):
        query = request.data.get('query').lower()
        all_filters = self.request.query_params.dict()
        shop_filters = all_filters.get('shops')
        countries_filters = all_filters.get('countries')
        companies_filters = all_filters.get('companies')
        parameters_filters = extract_parameter_filters(parameters=request.data.get('parameters'))
        min_price_filter = all_filters.get('min_price')
        max_price_filter = all_filters.get('max_price')
        sorting = all_filters.get('sorting')

        print("Query = ", query)
        print("All filters = ", all_filters)
        print("Shop filters = ", shop_filters)
        print("Countries filters = ", countries_filters)
        print("Parameters filters = ", parameters_filters)
        print("Minimal price = ", min_price_filter)
        print("Maximal price = ", max_price_filter)
        print("Sorting = ", sorting)

        if not query:
            return Response({'detail': 'Введіть товар для пошуку'}, status=status.HTTP_400_BAD_REQUEST)

        paginator = self.pagination_class()

        user_ip = get_user_ip(request)
        redis_client = get_redis_connection()

        # Оновлення курсу валют
        main_exchange_rate()

        # Перевірка наявності такого запиту протягом останніх 20 хвилин
        query_recent_request = redis_client.get(query.strip())
        if query_recent_request:
            components = json.loads(query_recent_request)

            min_price, max_price = get_min_and_max(components=components)
            print(min_price, max_price)

            shops = extract_shops(components=components)
            countries = extract_countries(components=components)
            companies = extract_companies(components=components)
            parameters = extract_parameters(components=components)

            components = create_result_components_list(
                components=components,
                shop_filters=shop_filters,
                countries_filters=countries_filters,
                companies_filters=companies_filters,
                parameters_filters=parameters_filters,
                min_price_filter=min_price_filter,
                max_price_filter=max_price_filter,
                sorting=sorting
            )

            print("Shops = ", shops)
            print("Number of components = ", len(components))
            result_page = paginator.paginate_queryset(
                queryset=components,
                request=request,
                shops=shops,
                countries=countries,
                companies=companies,
                parameters=parameters,
                min_price=min_price,
                max_price=max_price
            )
            serializer = ComponentSerializer(result_page, many=True)

            return paginator.get_paginated_response(
                serializer.data
            )

        # Перевірка користувача на велику кількість запитів
        user_recent_request = redis_client.get(user_ip)
        if user_recent_request:
            return Response({
                'detail': 'Too many requests. Wait a minute.'
            })

        with concurrent.futures.ThreadPoolExecutor() as executor:
            future = executor.submit(run_asyncio_main_parser, user_ip, query)
            components = future.result()

        # Відсіяти зайві результати
        components = remove_inappropriate_components(
            query=query,
            components=components
        )

        # Додати додаткові параметри для фільтрів
        components = insert_parameters(
            components=components
        )

        # Зберегти результат запиту в Redis
        redis_client = get_redis_connection()
        redis_key = f"{query}"
        redis_value = json.dumps(components)
        redis_client.set(redis_key, redis_value, ex=60 * 30)

        min_price, max_price = get_min_and_max(components=components)
        print(min_price, max_price)

        shops = extract_shops(components=components)
        countries = extract_countries(components=components)
        companies = extract_companies(components=components)
        parameters = extract_parameters(components=components)

        components = create_result_components_list(
            components=components,
            shop_filters=shop_filters,
            countries_filters=countries_filters,
            companies_filters=companies_filters,
            parameters_filters=parameters_filters,
            min_price_filter=min_price_filter,
            max_price_filter=max_price_filter,
            sorting=sorting
        )

        # Пагінація
        print("Shops = ", shops)
        result_page = paginator.paginate_queryset(
            queryset=components,
            request=request,
            shops=shops,
            countries=countries,
            companies=companies,
            parameters=parameters,
            min_price=min_price,
            max_price=max_price
        )
        serializer = ComponentSerializer(result_page, many=True)

        return paginator.get_paginated_response(serializer.data)


class DownloadComponentView(APIView):
    def post(self, request, *args, **kwargs):
        query = request.data.get('query')
        all_filters = self.request.query_params.dict()
        shop_filters = all_filters.get('shops')
        countries_filters = all_filters.get('countries')
        companies_filters = all_filters.get('companies')
        parameters_filters = request.data.get('parameters')
        min_price_filter = all_filters.get('min_price')
        max_price_filter = all_filters.get('max_price')
        sorting = all_filters.get('sorting')

        if not query:
            return Response({'detail': 'Введіть товар для пошуку'}, status=status.HTTP_400_BAD_REQUEST)

        redis_client = get_redis_connection()

        # Перевірка наявності такого запиту протягом останніх 20 хвилин
        query_recent_request = redis_client.get(query.strip())
        if not query_recent_request:
            return Response({'detail': 'Дані не знайдено'}, status=status.HTTP_400_BAD_REQUEST)

        components = json.loads(query_recent_request)

        components = create_result_components_list(
            components=components,
            shop_filters=shop_filters,
            countries_filters=countries_filters,
            companies_filters=companies_filters,
            parameters_filters=parameters_filters,
            min_price_filter=min_price_filter,
            max_price_filter=max_price_filter,
            sorting=sorting
        )

        print("Number of components 2 = ", len(components))

        serializer = ComponentSerializer(components, many=True)

        return Response(serializer.data)


def delete_shop(shop_url):
    json_files = find_json_files_list()

    try:
        for json_file in json_files:
            extracted_data = parse_json(json_file)
            if extracted_data["base_url"] == shop_url:
                os.remove(json_file)
                print("Файл успішно видалено")
    except FileNotFoundError:
        print("Файл не знайдено")
    except PermissionError:
        print("Немає дозволу на видалення файлу")
    except Exception as e:
        print("Помилка при видаленні файлу:", e)

    return Response({"detail": "Shop deleted successfully"})


def update_file(shop_url, new_file):
    json_files = find_json_files_list()

    try:
        for json_file in json_files:
            extracted_data = parse_json(json_file)
            if extracted_data["base_url"] == shop_url:
                # os.remove(json_file)
                print("URL = ", extracted_data["base_url"])
                print("Json file = ", json_file)
                print("new file = ", new_file)

                with open(json_file, 'wb') as f:
                    f.write(new_file.read())

                print("Файл успішно оновлено")
    except FileNotFoundError:
        print("Файл не знайдено")
    except PermissionError:
        print("Немає дозволу на видалення файлу")
    except Exception as e:
        print("Помилка при видаленні файлу:", e)

    return Response({"detail": "Shop updated successfully"})


class SuperUserLoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)

        if user is not None and user.is_superuser:
            refresh = TokenObtainPairSerializer.get_token(user)
            data = {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
            return Response(data)
        else:
            return Response({'error': 'Invalid credentials or user is not a superuser'}, status=status.HTTP_401_UNAUTHORIZED)


class AdminComponentFileView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    # pagination_class = ShopsPagination

    def get(self, request, *args, **kwargs):
        if request.user.is_superuser:
            shops = get_shops_data()

            return Response(
                {
                    "shops": shops
                }
            )
        return Response({"detail": "Permission denied"})

    def post(self, request, *args, **kwargs):
        operation = request.data.get('operation')
        shop_url = request.data.get('shop_url')

        print("Operation = ", operation)
        print("Shop URL = ", shop_url)

        if operation == "add":
            full_path = "./components_search/data_parser/component_source_data"

            new_file = request.data.get('file')
            new_file_name = f"{full_path}\\{request.data.get('filename')}"

            with open(new_file_name, 'wb') as f:
                f.write(new_file.read())
            print("File successfully saved:", new_file_name)

        if operation == "download":
            shop_data = extract_shop_json(
                shop_url=shop_url
            )
            return Response({"data": shop_data})

        if operation == "send":
            print("Filename = ", request.data.get('filename'))
            full_path = "./components_search/data_parser/component_source_data"

            new_file = request.data.get('file')
            new_file_name = f"{full_path}\\{request.data.get('filename')}"

            update_file(
                shop_url=shop_url,
                new_file=new_file
            )

        if operation == "delete":
            delete_shop(
                shop_url=shop_url
            )

        return Response({"shops": 1})


class CustomPageNumberPagination(PageNumberPagination):
    page_size = 7


class AdminUserMessageView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPageNumberPagination

    def get(self, request, *args, **kwargs):
        if request.user.is_superuser:
            unchecked_messages = UserMassage.objects.filter(message_is_checked=False)

            user_messages = []
            for message in unchecked_messages:
                message_data = {
                    'id': message.id,
                    'message_email': message.message_email,
                    'message_user_ip': message.message_user_ip,
                    'message_text': message.message_text
                }
                user_messages.append(message_data)

            paginator = self.pagination_class()
            page = paginator.paginate_queryset(user_messages, request)
            return paginator.get_paginated_response({
                "user_messages": page
            })
        return Response({"detail": "Permission denied"})

    def post(self, request, *args, **kwargs):
        message_id = request.data.get('message_id')

        print("Message ID = ", message_id)

        if message_id:
            try:
                message = UserMassage.objects.get(id=message_id)
                message.message_is_checked = True
                message.save()

                return Response({"detail": "Статус повідомлення змінено на перевірено."}, status=status.HTTP_200_OK)
            except UserMassage.DoesNotExist:
                return Response({"detail": "Повідомлення з вказаним ID не існує."}, status=status.HTTP_404_NOT_FOUND)

        return Response({"detail": "Message status successfully changed."})


category_names = {
    "Motor": "Мотори",
    "Propellers": "Пропелери",
    "Turn regulator": "Регулятори обертання",
    "Flight controller": "Контроллери польотів",
    "Stack": "Стеки",
    "Battery": "Акумулятори",
    "Frame": "Каркаси",
    "Camera": "Камери",
    "Video transmitter": "Відеопередавачі",
    "VTX": "Відеосистеми",
    "Receiver": "Приймачі",
    "Antenna": "Антени",
    "Control panel": "Пульти керування",
    "Glasses": "Окуляри",
    "Quadcopter": "Квадрокоптери",
    "Hexacopter": "Гексакоптери",
    "Octocopter": "Октокоптери",
    "Wing": "Крила"
}

category_query = {
    "Motor": ["мотор"],
    "Propellers": ["пропелери"],
    "Turn regulator": ["Регулятор обертання"],
    "Flight controller": ["польотний контролер"],
    "Stack": ["стек"],
    "Battery": ["акумулятор"],
    "Frame": ["рама"],
    "Camera": ["камера"],
    "Video transmitter": ["відеопередавач"],
    "VTX": ["Відеосистема"],
    "Receiver": ["приймач"],
    "Antenna": ["антена"],
    "Control panel": ["пульт керування"],
    "Glasses": ["окуляри"],
    "Quadcopter": ["квадрокоптер"],
    "Hexacopter": ["гексакоптер"],
    "Octocopter": ["октокоптер"],
    "Wing": ["бпла крило"]
}

category_must_be = {
    "Motor": [
        "мотор ", "двигун ", "motor "
    ],
    "Propellers": [],
    "Turn regulator": [],
    "Flight controller": [],
    "Stack": [
        "stack", "стек", "aio"
    ],
    "Battery": [
        "акумулятор ", "аккумулятор ", "battery "
    ],
    "Frame": [],
    "Camera": [
        "камера", "camera"
    ],
    "Video transmitter": [],
    "VTX": [],
    "Receiver": [],
    "Antenna": [],
    "Control panel": [],
    "Glasses": [],
    "Quadcopter": [
        "квадрокоптер"
    ],
    "Hexacopter": [
        "гексакоптер"
    ],
    "Octocopter": [
        "октокоптер"
    ],
    "Wing": []
}

category_exceptions = {
    "Motor": [
        "квадрокоптер ", "електросамокат", "колесо", "плата", "сервопривід",
        "кріплення ", "драйвер ", "рама", "болт", "підшипник", "контролер",
        "світлодіод", "захист дротів", "серводвигун", "гума", "радіатор"
    ],
    "Propellers": [
        "плата", "ключ", "дрон ", "рама ", "квадрокоптер ", "сумка ", "гайки ", "двигун "
    ],
    "Turn regulator": [
        "радіоприймач", "польотний контролер", "конвертор", "захист", "окуляри", "коннектори", "роз'єми",
        "стек", "резистор", "редуктор", "радіомодуль", "двигун avenger", "серводвигун", "мотор постійного"
    ],
    "Flight controller": [
        "шлейф", "заряд", "оборот", "кришка", "антена", "пульт", "стік", "квадрокоптер", "смарт контролер",
        "гексакоптер", "камера", "кейс", "stack", "стек", "мультикоптер", "октокоптер", "модуль", "damping",
        "радіоприймач"
    ],
    "Stack": [
        "дисплей", "квадрокоптер", "скло", "рама", "стекл", "затиск", "карта", "фарба"
    ],
    "Battery": [
        "універсальний", "електросамокат", "корпус ", "зварювання ", "пристрій", "iphone", "sigma",
        "дисплей", "huawei", "ergo", "prestigio", "tecno", "acer", "nomi", "кришка", "квадрокоптер",
        "пульт", "проектор", "генератор", "окуляри", "стедікам", "станція", "камера", "акумулятора",
        "xiaomi", "акб", "nokia", "apple", "k&f", "pavilion", "godox", "gold mount", "canon",
        "nanlite", "np-f", "fuji", "arlo"
    ],
    "Frame": [
        "програматор", "шлейф", "плата", "модуль", "камера", "діорама", "моторама", "рама kh"
    ],
    "Camera": [
        "шлейф ", "фіксатор ", "корпус", "квадрокоптер ", "обмежувач повороту ",
        "кріплення ", "кришка ", "демпфер ", "захист підвіса ", "поглинач вібрації",
        "realme", "iphone", "телефон", "google pixel", "кабель ", "пульт керування ",
        "Экшн-камера ", "action-камера ", "екшн", "екшен", "фотокамера", "вертоліт",
        "гексакоптер", "панорамна камера", "фільтри", "відеокамера", "lens", "відеоспостереження"
    ],
    "Video transmitter": [
        "стедікам", "антена", "радіоприймач"
    ],
    "VTX": [],
    "Receiver": [
        "квадрокоптер", "окуляри", "пульт", "іч", "інфрачервоний", "лазер", "плата", "набір", "антена для",
        "монітор", "відеошолом", "відеоприймач", "апаратура", "відеопередавач", "бокс", "кришка", "конвертор",
        "діверсіті", "скремблер", "fpv дрон", "радіосистема", "комплект", "boya", "польотний контролер"
    ],
    "Antenna": [
        "виносні антени", "квадрокоптер", "пульт керування", "goggles"
    ],
    "Control panel": [
        "квадрокоптер", "шлейф", "кулер", "тримач", "вал", "корпус", "кабель", "акумулятор", "комплекс", "проектор",
        "гексакоптер", "стедікам", "октокоптер", "камера", "сумка", "одноканальним", "драйвер", "іч", "стек",
        "сервопривод", "модуль", "клавіатура", "плата", "ремінець", "fpv система", "радіоприймач", "відеоприймач",
        "діверсіті", "відеопередавач", "запобіжник", "старотовий набір", "старотовый набір", "autel evo max 4t protect+",
        "кожух", "одноканальным", "одноканальний", "кріплення", "перехідник", "окуляри", "рама", "польотний контролер"
    ],
    "Glasses": [
        "3d-окуляри", "бінокуляри", "захисні окуляри", "квадрокоптер", "xreal air", "діверсіті", "мішечок", "ремінець",
        "захист для", "рюкзак", "радіомодуль", "радіоприймач"
    ],
    "Quadcopter": [
        "кейс", "акумулятор", "рама", "майданчик", "рюкзак", "підсилювач", "шлейф", "плата", "кулер", "фільтр", "корпус",
        "камер", "кабель", "частин", "мотор", "двигун", "кріплення", "кришка", "пульт", "пропелер", "аккумулятор", "модуль",
        "сенсор", "подушки"
    ],
    "Hexacopter": [
        "кейс", "акумулятор", "рама", "майданчик", "рюкзак", "підсилювач", "шлейф", "плата", "кулер", "фільтр",
        "корпус",
        "камер", "кабель", "частин", "мотор", "двигун", "кріплення", "кришка", "пульт", "пропелер", "аккумулятор",
        "модуль",
        "сенсор", "подушки"
    ],
    "Octocopter": [
        "кейс", "акумулятор", "рама", "майданчик", "рюкзак", "підсилювач", "шлейф", "плата", "кулер", "фільтр",
        "корпус",
        "камер", "кабель", "частин", "мотор", "двигун", "кріплення", "кришка", "пульт", "пропелер", "аккумулятор",
        "модуль",
        "сенсор", "подушки"
    ],
    "Wing": []
}


class FindByCategoryView(APIView):
    pagination_class = CategoryResultPagination

    def post(self, request, *args, **kwargs):
        category_name = request.data.get('category')

        all_filters = self.request.query_params.dict()
        shop_filters = all_filters.get('shops')
        countries_filters = all_filters.get('countries')
        companies_filters = all_filters.get('companies')
        parameters_filters = extract_parameter_filters(parameters=request.data.get('parameters'))
        min_price_filter = all_filters.get('min_price')
        max_price_filter = all_filters.get('max_price')
        sorting = all_filters.get('sorting')

        print("Category = ", category_name)
        print("All filters = ", all_filters)
        print("Shop filters = ", shop_filters)
        print("Countries filters = ", countries_filters)
        print("Parameters filters = ", parameters_filters)
        print("Minimal price = ", min_price_filter)
        print("Maximal price = ", max_price_filter)
        print("Sorting = ", sorting)

        if not category_name:
            return Response({'detail': 'Виберіть категорію для пошуку'}, status=status.HTTP_400_BAD_REQUEST)

        paginator = self.pagination_class()

        redis_client = get_redis_connection()

        ##############################
        if category_name == "Wing":
            result_components = category_wing
            # shops = extract_shops(components=result_components)
            # countries = extract_countries(components=result_components)
            # companies = extract_companies(components=result_components)
            # parameters = extract_parameters(components=result_components)

            result_components = create_result_components_list(
                components=result_components,
                shop_filters=shop_filters,
                countries_filters=countries_filters,
                companies_filters=companies_filters,
                parameters_filters=parameters_filters,
                min_price_filter=min_price_filter,
                max_price_filter=max_price_filter,
                sorting=sorting
            )

            result_page = paginator.paginate_queryset(
                queryset=result_components,
                request=request,
                category=category_names[category_name],
                shops=[],
                countries=[],
                companies=[],
                parameters=[]
            )

            serializer = ComponentSerializer(result_page, many=True)
            return paginator.get_paginated_response(serializer.data)
        ##############################

        query_recent_request = redis_client.get(f"{category_name}_CATEGORY")
        if query_recent_request:
            result_components = json.loads(query_recent_request)

            shops = extract_shops(components=result_components)
            countries = extract_countries(components=result_components)
            companies = extract_companies(components=result_components)
            parameters = extract_parameters(components=result_components)

            result_components = create_result_components_list(
                components=result_components,
                shop_filters=shop_filters,
                countries_filters=countries_filters,
                companies_filters=companies_filters,
                parameters_filters=parameters_filters,
                min_price_filter=min_price_filter,
                max_price_filter=max_price_filter,
                sorting=sorting
            )

            result_page = paginator.paginate_queryset(
                queryset=result_components,
                request=request,
                category=category_names[category_name],
                shops=shops,
                countries=countries,
                companies=companies,
                parameters=parameters
            )

            serializer = ComponentSerializer(result_page, many=True)
            return paginator.get_paginated_response(serializer.data)
        else:
            user_ip = get_user_ip(request)
            result_components = []

            for component_query in category_query[category_name]:
                with concurrent.futures.ThreadPoolExecutor() as executor:
                    future = executor.submit(run_asyncio_main_parser_category, component_query, category_name)
                    components = future.result()

                for new_component in components:
                    result_components.append(new_component)

            components = discard_wrong_by_needed_word(
                components=components,
                category=category_name
            )

            result_components = discard_wrong_by_key_word(
                components=components,
                category=category_name
            )

            result_components = insert_parameters(
                components=result_components
            )

            # Зберегти результат запиту в Redis
            redis_client = get_redis_connection()
            redis_key = f"{category_name}_CATEGORY"
            redis_value = json.dumps(result_components)
            redis_client.set(redis_key, redis_value, ex=60 * 270)

            shops = extract_shops(components=result_components)
            countries = extract_countries(components=result_components)
            companies = extract_companies(components=result_components)
            parameters = extract_parameters(components=result_components)

            print("Shops = ", shops)
            print("Countries = ", countries)
            print("Companies = ", companies)
            print("Parameters = ", parameters)

            result_components = create_result_components_list(
                components=result_components,
                shop_filters=shop_filters,
                countries_filters=countries_filters,
                companies_filters=companies_filters,
                parameters_filters=parameters_filters,
                min_price_filter=min_price_filter,
                max_price_filter=max_price_filter,
                sorting=sorting
            )

            result_page = paginator.paginate_queryset(
                queryset=result_components,
                request=request,
                category=category_names[category_name],
                shops=shops,
                countries=countries,
                companies=companies,
                parameters=parameters
            )

            serializer = ComponentSerializer(result_page, many=True)
            return paginator.get_paginated_response(serializer.data)


def run_asyncio_main_parser_category(query, category):
    loop = asyncio.new_event_loop()
    try:
        components = loop.run_until_complete(asyncio_main_parser_for_categories(query, category))
    finally:
        loop.close()
    return components


def discard_wrong_by_key_word(components, category):
    key_words = category_exceptions[category]

    filtered_components = []

    for i in components:
        found_match = False
        for key_word in key_words:
            if key_word in i["componentName"].lower():
                found_match = True
                break

        if not found_match:
            filtered_components.append(i)

    return filtered_components


def discard_wrong_by_needed_word(components, category):
    key_words = category_must_be[category]

    if len(key_words) == 0:
        return components

    filtered_components = []

    for component in components:
        component_name_lower = component["componentName"].lower()

        for key_word in key_words:
            if key_word.lower() in component_name_lower:
                filtered_components.append(component)
                break
                break

    return filtered_components


class SaveUserMessageView(APIView):
    def post(self, request, *args, **kwargs):
        message_email = request.data.get('user_email')
        message_text = request.data.get('user_message')

        print("Email = ", message_email)
        print("Message = ", message_text)

        if message_email and message_text:
            new_message = UserMassage(
                message_email=message_email,
                message_text=message_text
            )

            new_message.save()

            return Response({"detail": "Повідомлення успішно збережено та буде розглянуто найближчим часом."})

        return Response({"detail": "При збереженні повідомлення сталася помилка. Спробуйте ще раз пізніше."})


















# Дані про найдорожчі БПЛА
category_wing = [
    {
        "componentName": "БпЛА Манул 2 Р (Л011)",
        "componentPrice": "1092130.0",
        "componentImageURL": "https://y.ua/pimg/293x293/13/30/3299572.jpeg",
        "componentExternalURL": "https://y.ua/bpla-manul-2-r-l011/p1260083/?gclid=EAIaIQobChMI9b_9nsiMhgMVs42DBx38kgrFEAQYASABEgKVufD_BwE",

    },
    {
        "componentName": "БпЛА Манул 2 Р (Л011)",
        "componentPrice": "1108250.0",
        "componentImageURL": "https://y.ua/pimg/293x293/13/30/3299572.jpeg",
        "componentExternalURL": "https://stylus.ua/uk/bpla-manul-2-r-l011-p1260083c15731.html?gad_source=1&gclid=EAIaIQobChMI9b_9nsiMhgMVs42DBx38kgrFEAQYAyABEgIMc_D_BwE",
    },
    {
        "componentName": "Дрон Розвідник БПЛА Крило для військових",
        "componentPrice": "49999.0",
        "componentImageURL": "https://images.prom.ua/5412260422_w640_h640_dron-razvedchik-bpla.jpg",
        "componentExternalURL": "https://prom.ua/ua/p2101620687-dron-razvedchik-bpla.html?utm_source=google_pmax&utm_medium=cpc&utm_content=pmax&utm_campaign=Pmax_cpa_kvadrokoptery_5297199152&gad_source=1&gclid=EAIaIQobChMI5sPoqMiMhgMVIouDBx2WswQREAQYAyABEgLvQvD_BwE",
    },
    {
        "componentName": "Дрон Розвідник ( Моделі развідника - ретранслятора )",
        "componentPrice": "480000.0",
        "componentImageURL": "https://images.prom.ua/5412165423_w640_h640_dron-razvedchik-.jpg",
        "componentExternalURL": "https://prom.ua/ua/p2101600842-dron-razvedchik-modeli.html?token=v2%3AT6JWO5ILsBDj5nVZsQL6ohnQ55TWlG-RMZ6MMc0K_a90-nTH4Toz51UEp-Zldf0S2vCvLjjbP_9t6DMoqDDfX3kobvRJPrBK-oPCqc2-fLsR7adzq_yRbgBb3VqrU5wG&campaign_id=3840679&product_id=2101600842&source=prom%3Apremium_adv%3Ablock&locale=uk&category_ids=2657&primelead=Mi41Mg&from_spa=true",
    },
    {
        "componentName": "БПЛА FPV камікадзе Алігатор",
        "componentPrice": "39494.0",
        "componentImageURL": "https://images.prom.ua/5412165423_w640_h640_dron-razvedchik-.jpg",
        "componentExternalURL": "https://stylus.ua/uk/bpla-alligator-p1250639c15731.html?gad_source=1&gclid=EAIaIQobChMI5sPoqMiMhgMVIouDBx2WswQREAQYCCABEgJc__D_BwE",
    },
    {
        "componentName": "Mfe fighter pnp 2.5 метра бпла набір з електронікою",
        "componentPrice": "69200.0",
        "componentImageURL": "https://image-thumbs.shafastatic.net/2053923474_310_430",
        "componentExternalURL": "https://shafa.ua/sport/dlya-dosuga/nastolnyye-igry/153871270-mfe-fighter-pnp-25-metra-bpla-nabir-z-elektronikoyu-noviy-v-n?srsltid=AfmBOoomKkaPypnQt8cJ1zeiPMfaEKWydXRM8Qv2ZbFFXpyaITpiROM0jIc",
    },
    {
        "componentName": "Безпілотний літальний апарат Swan-K1 PRO",
        "componentPrice": "55000.0",
        "componentImageURL": "https://drone-azimyth.com.ua/image/cache/catalog/Photo%20Main/Industrial%20drones%20(111620382)/Drone_Swan-K1_PRO_unmanned_aircraft_vehicle/Drone_Swan-K1_PRO_unmanned_aircraft_vehicle_www.azimyt.com.ua_1-900x900.png",
        "componentExternalURL": "https://drone-azimyth.com.ua/promislovi-droni/bespilotnyy-letatelnyy-apparatt-swan-k1-pro/",
    },
    {
        "componentName": "Дрон Розсадчик БПЛА Крило для військових",
        "componentPrice": "49000.0",
        "componentImageURL": "https://images.prom.ua/5750632960_w640_h640_dron-razvedchik-bpla.jpg",
        "componentExternalURL": "https://prom.ua/ua/p2193977062-dron-razvedchik-bpla.html?token=v2%3ADpTJbtwSQElu3QDYlVRinAQajhv7bIlYNif1IL2u_n-MKzh8n8V7l0WTbAJnepDXebjmQ2mY8_8jtB8iiXBtf3c8iwc_pKYVfnVNV_IJ3BQJO0wJFvMtAuRZ_FxNm57o&campaign_id=3868975&product_id=2193977062&source=prom%3Arecommended_for_you&locale=uk&category_ids=2657&from_spa=true",
    },
    {
        "componentName": "Безпілотний літак розвідувальний БПЛА UAV",
        "componentPrice": "22000.0",
        "componentImageURL": "https://ireland.apollo.olxcdn.com/v1/files/v4p6wm08jbf2-UA/image;s=1000x700",
        "componentExternalURL": "https://www.olx.ua/d/uk/obyavlenie/bezplotniy-ltak-rozvduvalniy-bpla-uav-IDSb6XB.html",
    },
    {
        "componentName": "БПЛА \"КРУК\", безпілотник літакового типу (крило)",
        "componentPrice": "61000.0",
        "componentImageURL": "https://hazardous.com.ua/content/images/29/449x266l80mc0/bezpilotnyk-kruk-85720556629513.webp",
        "componentExternalURL": "https://hazardous.com.ua/bezpilotnyk-kruk/?srsltid=AfmBOorCORnTRJQb5ZixAYrg5tUjwOPS8lhBwkPiC7RZjZ63hMg6pi_UcSI",
    }
]
