# src/products/tasks.py
from celery import shared_task
import requests
from bs4 import BeautifulSoup
import re

from .models import Product, PriceHistory

@shared_task
def update_product_price(product_id):
    try:
        product = Product.objects.get(id=product_id)
        print(f"Iniciando scraping para: {product.name} (ID: {product.id})")
    except Product.DoesNotExist:
        print(f"Produto com ID {product_id} não encontrado.")
        return

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9,pt;q=0.8"
    }

    try:
        page = requests.get(product.url, headers=headers)
        page.raise_for_status()
        soup = BeautifulSoup(page.content, "html.parser")
        price_float = None

        # Lógica de seletores...
        # ... (a lógica if/elif continua a mesma) ...
        if 'mercadolivre.com.br' in product.url:
            # ... (código do Mercado Livre) ...
            pass
        elif 'amazon.com.br' in product.url:
            price_whole_element = soup.find('span', class_='a-price-whole')
            price_fraction_element = soup.find('span', class_='a-price-fraction')
            if price_whole_element and price_fraction_element:
                price_whole = price_whole_element.get_text().strip().replace('.', '').replace(',', '')
                price_fraction = price_fraction_element.get_text().strip()
                price_float = float(f"{price_whole}.{price_fraction}")

        if price_float is not None:
            # ... (lógica de sucesso continua a mesma) ...
            print(f"SUCESSO! Preço atualizado para R$ {price_float:.2f} para o produto ID {product.id}")
        else:
            print(f"FALHA: Seletor de preço não encontrado para o produto ID {product.id}")
            # --- ADIÇÃO IMPORTANTE AQUI ---
            # Salva o HTML recebido para que possamos depurar
            with open(f"/usr/src/app/falha_scraping_produto_{product.id}.html", "w", encoding="utf-8") as f:
                f.write(soup.prettify())
            print(f"HTML da página de falha salvo em 'src/falha_scraping_produto_{product.id}.html'")


    except Exception as e:
        print(f"Erro inesperado ao raspar produto ID {product.id}: {e}")

@shared_task
def scrape_all_products():
    """
    Tarefa principal que encontra todos os produtos e dispara
    uma tarefa de scraping para cada um.
    """
    print("--- Iniciando a tarefa de scraping de TODOS os produtos ---")
    products = Product.objects.all()
    for product in products:
        update_product_price.delay(product.id)
    print(f"--- Tarefa de scraping enfileirada para {products.count()} produtos ---")