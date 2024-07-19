import pyodbc
from helpers import connect_to_db

# Bağlantıyı kurma
conn = connect_to_db()
cursor = conn.cursor()

# markets tablosunu oluşturma
create_markets_table = """
CREATE TABLE  markets (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(255) NOT NULL
)
"""

# products tablosunu oluşturma
create_products_table = """
CREATE TABLE  products (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    ig_price FLOAT,
    ig_url VARCHAR(255),
    cf_price FLOAT,
    cf_url VARCHAR(255),
    mg_price FLOAT,
    mg_url VARCHAR(255)
)
"""
 
# price_history tablosunu oluşturma
create_price_history_table = """
CREATE TABLE  price_history (
    product_id INT,
    market_id INT,
    price FLOAT NOT NULL,
    date DATE NOT NULL,
    PRIMARY KEY (product_id, date, market_id),
    FOREIGN KEY (market_id) REFERENCES markets(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
)
"""

# Tabloları oluşturma
try:
    cursor.execute(create_markets_table)
    cursor.execute(create_products_table)
    cursor.execute(create_price_history_table)
    conn.commit()
    print("Tables created successfully.")
except Exception as e:
    print(f"Failed creating table: {e}")
    conn.rollback()

# Bağlantıyı kapatma
cursor.close()
conn.close()