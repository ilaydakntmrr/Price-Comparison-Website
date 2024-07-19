import helpers
import carrefoursa as cf
import migros as mg
import istegelsin as ig
import time

# Bağlantıyı kurma
conn = helpers.connect_to_db()

# Tüm marketleri getir
markets = {}
for market in helpers.get_markets(conn):
    markets[market[1]] = market[0]


while True:
    # Tüm ürünleri getir
    products = helpers.get_products(conn)

    for product in products:
        product_id = product[0]
        product_name = product[1]
        ig_url, cf_url, mg_url = product[5], product[7], product[9]

        # Ürün fiyatlarını getir
        ig_price = ig.get_price(ig_url)
        cf_price = cf.get_price(cf_url)
        mg_price = mg.get_price(mg_url)

        # Ürün fiyatlarını güncelle
        helpers.change_product_price(conn, product_id, ig_price, cf_price, mg_price)

        # Tarih bilgisini al
        date = time.strftime("%Y-%m-%d")

        # Fiyat geçmişi kaydı ekle
        helpers.insert_price_history(conn, product_id, markets['İstegelsin'], ig_price, date)
        helpers.insert_price_history(conn, product_id, markets['CarrefourSA'], cf_price, date)
        helpers.insert_price_history(conn, product_id, markets['Migros'], mg_price, date)

        print(f"{time.strftime('%Y-%m-%d %H:%M:%S')} {product_name} prices updated successfully.")
        
    # 1 saat bekleyerek tekrar fiyatları kontrol et
    # time.sleep(3600)