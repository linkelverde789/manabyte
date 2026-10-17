from django.db.models import Q

SEARCH_LIMIT = 60
FIELD_LOOKUPS = {
    "name": lambda value: Q(name__icontains=value) | Q(faces__name__icontains=value),
    "type": lambda value: Q(faces__type_line__icontains=value),
    "oracle": lambda value: Q(faces__oracle_text__icontains=value),
    "set": lambda value: Q(set__code__iexact=value) | Q(set__name__iexact=value),
    "set_code": lambda value: Q(set__code__iexact=value),
    "set_name": lambda value: Q(set__name__iexact=value),
    "keywords": lambda value: Q(keywords__icontains=value),
    "color": lambda value: (
        Q(faces__colors__icontains=value)
        if value.lower() != "c"
        else Q(faces__colors=[])
    ),
    "text": lambda value: (
        Q(name__icontains=value)
        | Q(faces__name__icontains=value)
        | Q(faces__type_line__icontains=value)
        | Q(faces__oracle_text__icontains=value)
    ),
}
