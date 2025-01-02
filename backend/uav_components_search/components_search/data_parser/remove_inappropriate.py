def check_component(component, key_words):
    for key_word in key_words:
        if key_word not in component['componentName'].lower():
            return False
    return True


def remove_inappropriate_components(query, components) -> list:
    verified_components = []

    key_words = [word.strip() for word in query.split(' ') if len(word) > 3]

    for component in components:
        check_result = check_component(component=component, key_words=key_words)
        if check_result:
            verified_components.append(component)

    return verified_components


