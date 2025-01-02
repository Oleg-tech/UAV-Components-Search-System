from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class ComponentsResultPagination(PageNumberPagination):
    page_size = 32
    max_page_size = 100
    shops = None
    countries = None
    min_price = None
    max_price = None
    companies = None
    parameters = None

    def get_paginated_response(self, data):
        return Response({
            'detail': 'Query processed successfully',
            'count': self.page.paginator.count,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'search_result': data,
            'shop_list': self.shops or [],
            'countries_list': self.countries or [],
            'companies_list': self.companies or [],
            'parameters_dict': self.parameters or {},
            'min_price': str(self.min_price) or None,
            'max_price': str(self.max_price) or None
        })

    def paginate_queryset(
            self, queryset, request, view=None,
            shops=None, countries=None, companies=None,
            parameters=None, min_price=None, max_price=None
    ):
        self.shops = shops
        self.countries = countries
        self.min_price = min_price
        self.max_price = max_price
        self.companies = companies
        self.parameters = parameters

        return super().paginate_queryset(queryset, request, view)


class CategoryResultPagination(PageNumberPagination):
    page_size = 32
    max_page_size = 100
    category=None
    shops = None
    countries = None
    companies = None
    parameters = None

    def get_paginated_response(self, data):
        return Response({
            'detail': 'Query processed successfully',
            'count': self.page.paginator.count,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'search_result': data,
            'category_name': self.category,
            'shop_list': self.shops or [],
            'countries_list': self.countries or [],
            'companies_list': self.companies or [],
            'parameters_dict': self.parameters or {},
        })

    def paginate_queryset(
            self, queryset, request, view=None, category=None,
            shops=None, countries=None, companies=None,parameters=None
    ):
        self.shops = shops
        self.countries = countries
        self.category = category
        self.companies = companies
        self.parameters = parameters

        return super().paginate_queryset(queryset, request, view)


class ShopsPagination(PageNumberPagination):
    page_size = 10
    max_page_size = 100

    def get_paginated_response(self, data):
        return Response({
            'detail': 'Query processed successfully',
            'count': self.page.paginator.count,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'shops': data['shops'],
            'user_messages': data['user_messages']
        })


class UserMessagesPagination(PageNumberPagination):
    page_size = 10
    max_page_size = 100

    def get_paginated_response(self, data):
        return Response({
            'detail': 'Query processed successfully',
            'count': self.page.paginator.count if self.page else 0,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'user_messages': data
        })
