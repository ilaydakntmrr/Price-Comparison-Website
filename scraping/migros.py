from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import json
import logging

# Suppress other warnings
logging.getLogger('WDM').setLevel(logging.NOTSET)

options = Options()
options.add_argument("--headless")
options.add_argument("--no-sandbox")
options.add_argument("--log-level=3")  # Suppress logs
options.add_experimental_option('excludeSwitches', ['enable-logging'])  # Suppress logs
# Initialize the webdriver
driver = webdriver.Chrome(options=options)

def get_price(url: str) -> float:
    # Disable Selenium logging

    driver.get(url)

    try:
        # Wait for the script element to be present
        element_present = EC.presence_of_element_located((By.CSS_SELECTOR, 'style + script'))
        WebDriverWait(driver, 10).until(element_present)

        # Extract the price
        price_script = driver.find_element(By.CSS_SELECTOR, 'style + script').get_attribute('innerHTML')
        price_json = json.loads(price_script)
        price = float(price_json['mainEntity']['offers']['itemOffered'][0]['offers']['price'])
    except Exception as e:
        print(f"An error occurred: {e}")
        price = None

    return price