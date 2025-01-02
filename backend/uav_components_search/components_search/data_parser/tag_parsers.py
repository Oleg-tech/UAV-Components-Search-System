def parse_div(tag_object):
    return tag_object.div


def parse_text(tag_object):
    return tag_object.text.strip()


def parse_img(tag_object):
    return tag_object.img


def parse_a(tag_object):
    return tag_object.a


def parse_span(tag_object):
    return tag_object.span


def parse_form(tag_object):
    return tag_object.form


def parse_h2(tag_object):
    return tag_object.h2


def parse_tag(tag_object, path_to_data):
    for step in path_to_data:
        if step == "div":
            tag_object = parse_div(tag_object)
            continue
        if step == "img":
            tag_object = parse_img(tag_object)
            continue
        if step == "a":
            tag_object = parse_a(tag_object)
            continue
        if step == "span":
            tag_object = parse_span(tag_object)
            continue
        if step == "form":
            tag_object = parse_form(tag_object)
            continue
        if step == "h2":
            tag_object = parse_h2(tag_object)
            continue

    return tag_object


def parse_tag_element(tag_object, data_source):
    if data_source == "text":
        tag_object = parse_text(tag_object)
        return tag_object
    if data_source in ("src", "href", "onmouseover", "alt", "data-src"):
        tag_object = tag_object[data_source]
        return tag_object


def get_parsed_object(tag_object, path_to_data, data_source):
    tag_object = parse_tag(tag_object, path_to_data)

    parsed_object = parse_tag_element(tag_object=tag_object, data_source=data_source)

    return parsed_object
