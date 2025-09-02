import requests
from bs4 import BeautifulSoup
import re

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9,pt;q=0.8",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Connection": "keep-alive"
}

def get_price(url):
    print(f"Buscando a página do produto em: {url}")
    try:
        page = requests.get(url, headers=headers)
        page.raise_for_status()

        soup = BeautifulSoup(page.content, "html.parser")
        price_float = None

        if 'mercadolivre.com.br' in url:
            print("Site detectado: Mercado Livre")
            price_container = soup.find(class_="ui-pdp-price__second-line")
            if price_container:
                price_element = price_container.find('span', class_="andes-money-amount__fraction")
                if price_element:
                    price_text = price_element.get_text().strip()
                    price_clean = re.sub(r'[^\d,]', '', price_text).replace(',', '.')
                    price_float = float(price_clean)

        elif 'amazon.com.br' in url:
            print("Site detectado: Amazon")
            price_whole_element = soup.find('span', class_='a-price-whole')
            price_fraction_element = soup.find('span', class_='a-price-fraction')

            if price_whole_element and price_fraction_element:
                price_whole = price_whole_element.get_text().strip().replace('.', '').replace(',', '')
                price_fraction = price_fraction_element.get_text().strip()
                price_float = float(f"{price_whole}.{price_fraction}")

        if price_float is not None:
            print(f"SUCESSO! O preço encontrado é: R$ {price_float:.2f}")
        else:
            print("FALHA! Elemento do preço não encontrado. O seletor CSS pode estar desatualizado ou a página pode ser um CAPTCHA.")
            # with open("pagina_falha.html", "w", encoding="utf-8") as f:
            #     f.write(soup.prettify())
            # print("HTML da página salvo em 'pagina_falha.html' para análise.")

    except requests.exceptions.HTTPError as err:
        print(f"Erro HTTP: {err}")
    except Exception as e:
        print(f"Ocorreu um erro: {e}")


URL_PARA_TESTAR = 'https://www.amazon.com.br/dp/B0CX8MT2M2'

get_price(URL_PARA_TESTAR)