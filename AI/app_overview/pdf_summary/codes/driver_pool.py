# driver_pool.py
from queue import Queue
from threading import Lock
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
import os
from dotenv import load_dotenv

class WebDriverPool:
    def __init__(self, max_size=5):
        self.pool = Queue(max_size)
        self.lock = Lock()
        for _ in range(max_size):
            driver = self.create_driver()
            self.pool.put(driver)

    def create_driver(self):
        current_dir = os.path.dirname(os.path.abspath(__file__))
        env_path = os.path.join(current_dir, "../../config/.env")
        load_dotenv(dotenv_path=env_path)
        CHROME_PATH = os.path.join(current_dir, os.getenv('LINUX_CHROME_PATH'))
        DRIVER_PATH = os.path.join(current_dir, os.getenv('LINUX_DRIVER_PATH'))

        options = Options()
        options.add_argument('--headless')
        options.add_argument('--no-sandbox')
        options.add_argument('--disable-dev-shm-usage')
        options.add_argument('--disable-gpu')
        options.add_argument('--window-size=1920,1080')
        options.add_argument('--remote-debugging-port=9222')
        options.add_argument('--log-level=3')
        options.add_argument('--disable-blink-features=AutomationControlled')
        options.binary_location = CHROME_PATH
        options.add_argument('--disable-extensions')
        options.add_argument('--disable-infobars')
        options.add_argument('--disable-browser-side-navigation')
        options.add_argument('--disable-features=VizDisplayCompositor')

        service = Service(DRIVER_PATH)
        driver = webdriver.Chrome(service=service, options=options)
        return driver

    def get_driver(self):
        return self.pool.get()

    def return_driver(self, driver):
        self.pool.put(driver)

    def close_all(self):
        while not self.pool.empty():
            driver = self.pool.get()
            driver.quit()
