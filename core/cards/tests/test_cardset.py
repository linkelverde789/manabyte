from django.urls import reverse

from cards.models import ScryfallCard
from cards.tests.test_search import check_name_in_response
from cards.utils.utils import collector_number_sort_key
