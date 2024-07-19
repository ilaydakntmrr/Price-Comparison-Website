import helpers
import carrefoursa as cf
import migros as mg
import istegelsin as ig
import time
import json

# Bağlantıyı kurma
conn = helpers.connect_to_db()

market_names = ['İstegelsin', 'CarrefourSA', 'Migros']
for market_name in market_names:
    helpers.insert_market(conn, market_name)

# Seed için json dosyasını oku
seeds = json.load(open('seed.json', 'r', encoding= 'utf-8'))

for seed in seeds:
    ig_url = seed['ig_url']
    cf_url = seed['cf_url']
    mg_url = seed['mg_url']
    name, image_url, description = ig.get_datas(ig_url)

    ig_price = ig.get_price(ig_url)
    cf_price = cf.get_price(cf_url)
    mg_price = mg.get_price(mg_url)

    helpers.insert_product(conn, name, description, image_url, ig_price, ig_url, cf_price, cf_url, mg_price, mg_url)

    print(f"{time.strftime('%Y-%m-%d %H:%M:%S')} {name} inserted successfully.")

# Bağlantıyı kapatma
conn.close()