import requests

# Free foreign exchange rates API.
url = "https://api.exchangeratesapi.io/latest"
base_currency = 'KRW'

def get_currency_list():
    r = requests.get(url, params={'base': base_currency})
    if r.status_code != 200:
        raise Exception("ERROR: API request unsuccessful.")
    currency_list = [k for k in r.json()['rates']]

    return currency_list

def get_exchange_rate(base):
    # Get exchange rate using external API.
    r = requests.get(url, params={'base': base, 'symbol': 'KRW'})
    if r.status_code !=200:
        raise Exception("ERROR: API request unsuccessful.")
    exchange_rate = r.json()['rates']['KRW']

    return exchange_rate