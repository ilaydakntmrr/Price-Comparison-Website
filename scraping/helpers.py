import pyodbc
import datetime

# MSSQL bağlantı bilgileri
server = 'desktop-cmsc15r\sqlexpress'  # MSSQL sunucusuna bağlanmak için
database = 'MagazaDb'  # Varsayılan veritabanı
username = 'safaksafak'
password = 'safak'
driver = 'SQL Server'  # ODBC Driver 17 for SQL Server


# Veritabanı bağlantısı fonksiyonu
def connect_to_db():
    conn = pyodbc.connect(f'DRIVER={driver};SERVER={server};DATABASE={database};Trusted_Connection=yes;')
    return conn

# markets tablosundaki tüm kayıtları getirir
def get_markets(conn):
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM markets")
    markets = cursor.fetchall()
    cursor.close()
    return markets

# products tablosundaki tüm kayıtları getirir
def get_products(conn):
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM products")
    products = cursor.fetchall()
    cursor.close()
    return products

# products tablosundaki bir ürünün fiyatını günceller
def change_product_price(conn, product_id, ig_price, cf_price, mg_price):
    cursor = conn.cursor()
    try:
        update_product_price = ("UPDATE products SET ig_price = ?, cf_price = ?, mg_price = ? WHERE id = ?")
        cursor.execute(update_product_price, (ig_price, cf_price, mg_price, product_id))
        conn.commit()
        print(f"Product ID {product_id} prices updated successfully.")
    except Exception as e:
        print(f"Failed to update product price: {e}")
        conn.rollback()
    finally:
        cursor.close()

# price_history tablosuna yeni bir fiyat geçmişi kaydı ekler
def insert_price_history(conn, product_id, market_id, price, date):
    cursor = conn.cursor()
    try:
        add_price_history = ("INSERT INTO price_history (product_id, market_id, price, date) VALUES (?, ?, ?, ?)")
        cursor.execute(add_price_history, (product_id, market_id, price, date))
        conn.commit()
        print("Price history inserted successfully.")
    except Exception as e:
        print(f"Failed to insert price history: {e}")
        conn.rollback()
    finally:
        cursor.close()

def insert_market(conn, name):
    cursor = conn.cursor()
    try:
        add_market = ("INSERT INTO markets (name) VALUES (?)")
        cursor.execute(add_market, (name,))
        conn.commit()
        print("Market inserted successfully.")
    except Exception as e:
        print(f"Failed to insert market: {e}")
        conn.rollback()
    finally:
        cursor.close()


def insert_product(conn, name, description, image_url, ig_price, ig_url, cf_price, cf_url, mg_price, mg_url):
    cursor = conn.cursor()
    try:
        add_product = ("INSERT INTO products (name, description, image_url, ig_price, ig_url, cf_price, cf_url, mg_price, mg_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")
        cursor.execute(add_product, (name, description, image_url, ig_price, ig_url, cf_price, cf_url, mg_price, mg_url))
        conn.commit()
        print("Product inserted successfully.")
    except Exception as e:
        print(f"Failed to insert product: {e}")
        conn.rollback()
    finally:
        cursor.close()
