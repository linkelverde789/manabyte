import requests


class CardMarket:
    PRICE_GUIDE_URL = "https://downloads.s3.cardmarket.com/productCatalog/priceGuide/price_guide_1.json"
    HEADERS = {"Content-Type": "application/json", "User-Agent": "Manabyte/1.0"}  # noqa: RUF012

    @staticmethod
    def download_price_guide():
        """Use to download JSON card price from cardmarket.
        Only return priceGuides in a cardmarket_id:prices key:value

        Example:

        {
        "version": 1,
        "createdAt": "2026-11-05T02:49:44+0100",
        "priceGuides": [
            {
                "idProduct": 1,
                "idCategory": 1,
                "avg": 0.07,
                "low": 0.02,
                "trend": 0.07,
                "avg1": 0.04,
                "avg7": 0.08,
                "avg30": 0.07,
                "avg-foil": null,
                "low-foil": 0.05,
                "trend-foil": 0.38,
                "avg1-foil": 0.59,
                "avg7-foil": 0.33,
                "avg30-foil": 0.36
            }],
        }
        """

        response = requests.get(
            CardMarket.PRICE_GUIDE_URL,
            headers=CardMarket.HEADERS,
            timeout=30,
        )

        response.raise_for_status()

        return {str(card["idProduct"]): card for card in response.json()["priceGuides"]}
