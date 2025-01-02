from tag_parsers import get_parsed_object, parse_tag, parse_tag_element


def get_page_url(search_url, query):
    REPLACE_WITH_QUERY = "REPLACE_WITH_QUERY"
    search_url = search_url.replace(REPLACE_WITH_QUERY, query)

    return search_url


def get_next_page_parameter(next_page_parameter, page_counter):
    PAGE_COUNTER = 'PAGE_COUNTER'
    next_page_parameter = next_page_parameter.replace(PAGE_COUNTER, str(page_counter))
    return next_page_parameter


def get_next_page(search_url, query, next_page_parameter, page_counter):
    url = get_page_url(
        search_url=search_url,
        query=query
    )

    url = url + get_next_page_parameter(next_page_parameter, page_counter)

    return url
