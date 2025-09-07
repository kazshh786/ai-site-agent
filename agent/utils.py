import re

def sanitize_component_name(name: str) -> str:
    """
    Sanitizes a component name to be a valid PascalCase filename.

    - Removes special characters and whitespace.
    - Converts the name to PascalCase.

    Example:
        "Homepage Hero Banner" -> "HomepageHeroBanner"
        "Service List Component: Courier" -> "ServiceListComponentCourier"
    """
    # Capitalize the first letter of each word and remove spaces
    s = name.title()
    # Remove non-alphanumeric characters
    s = re.sub(r'[^a-zA-Z0-9]', '', s)
    return s
