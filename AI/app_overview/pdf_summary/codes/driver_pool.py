from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import re
import requests
import logging
import asyncio
import os
from dotenv import load_dotenv
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options

logger = logging.getLogger(__name__)

# WebDriver 생성 함수
def create_driver():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    env_path = os.path.join(current_dir, "../../config/.env")
    load_dotenv(dotenv_path=env_path)
    CHROME_PATH = os.path.join(current_dir, os.getenv('LINUX_CHROME_PATH'))
    DRIVER_PATH = os.path.join(current_dir, os.getenv('LINUX_DRIVER_PATH'))

    options = Options()
    options.add_argument('--headless')  # 필요시 주석 해제
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--disable-gpu')
    options.add_argument('--window-size=1920,1080')
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

async def download_pdf(doc_id, save_path, driver):
    """
    주어진 WebDriver 인스턴스를 사용하여 PDF를 다운로드합니다.
    
    Parameters:
    - doc_id (str): 문서 ID
    - save_path (str): 저장할 경로
    - driver (selenium.webdriver): Selenium WebDriver 인스턴스
    """
    url = f"https://scienceon.kisti.re.kr/srch/selectPORSrchArticle.do?cn={doc_id}&oCn={doc_id}&dbt=JAKO"
    
    try:
        logger.info(f"{doc_id} - 논문 페이지로 이동 중...")
        driver.get(url)
        
        logger.info(f"{doc_id} - 'ScienceON 원문보기' 버튼 찾는 중...")
        view_button = WebDriverWait(driver, 30).until(
            EC.element_to_be_clickable((By.XPATH, "//a[contains(@onclick, 'fncOrgDown') and contains(text(), 'ScienceON 원문보기')]"))
        )
        
        driver.execute_script("arguments[0].scrollIntoView(true);", view_button)
        await asyncio.sleep(1)  # 페이지 렌더링을 위한 짧은 대기
        logger.info(f"{doc_id} - 'ScienceON 원문보기' 버튼 클릭 중...")
        driver.execute_script("arguments[0].click();", view_button)
        
        logger.info(f"{doc_id} - 새 창으로 전환 중...")
        WebDriverWait(driver, 10).until(EC.number_of_windows_to_be(2))
        driver.switch_to.window(driver.window_handles[-1])
        
        logger.info(f"{doc_id} - 새 창 URL: {driver.current_url}")
    
        logger.info(f"{doc_id} - PDF URL 탐지 중...")
        page_source = driver.page_source
        pdf_url_start = page_source.find("/commons/util/orgDocDown.do")
        if pdf_url_start != -1:
            pdf_url_end = page_source.find("'", pdf_url_start)  # URL이 '로 끝날 것으로 가정
            pdf_url = "https://scienceon.kisti.re.kr" + page_source[pdf_url_start:pdf_url_end]
            logger.info(f"{doc_id} - PDF URL 탐지됨: {pdf_url}")

            pdf_url = clean_pdf_url(pdf_url)
            
            logger.info(f"{doc_id} - 변환된 PDF URL: {pdf_url}")
            
            await download_pdf_with_session(pdf_url, save_path, driver)
        else:
            logger.warning(f"{doc_id} - PDF 링크를 찾지 못했습니다.")
            logger.warning(f"{doc_id} - 현재 페이지 제목: {driver.title}")
            logger.warning(f"{doc_id} - 현재 페이지 URL: {driver.current_url}")
            # 스크린샷 저장
            screenshot_path = f"./screenshot_{doc_id}.png"
            driver.save_screenshot(screenshot_path)
            logger.info(f"{doc_id} - 스크린샷 저장됨: {screenshot_path}")

    except Exception as e:
        logger.error(f"{doc_id} - 오류 발생: {e}")
        # 스크린샷 저장
        screenshot_path = f"./error_screenshot_{doc_id}.png"
        driver.save_screenshot(screenshot_path)
        logger.error(f"{doc_id} - 오류 시 스크린샷 저장됨: {screenshot_path}")
        raise e  # 예외를 다시 던져서 호출자에게 알림

def clean_pdf_url(pdf_url):
    pdf_url = pdf_url.replace("&amp;", "&")
    return pdf_url

async def download_pdf_with_session(pdf_url, save_path, driver):
    try:
        # Selenium에서 쿠키 추출
        session = requests.Session()
        for cookie in driver.get_cookies():
            logger.info(f"쿠키 이름: {cookie['name']}, 값: {cookie['value']}")  # 쿠키 정보 출력
            session.cookies.set(cookie['name'], cookie['value'])
        
        response = session.get(pdf_url, stream=True)
        response.raise_for_status()
        
        with open(save_path, "wb") as file:
            for chunk in response.iter_content(chunk_size=8192):
                if chunk:
                    file.write(chunk)
        
        logger.info(f"{save_path} - PDF 다운로드 완료!")
    except requests.exceptions.RequestException as e:
        logger.error(f"{save_path} - PDF 다운로드 실패: {e}")
        raise e  # 예외를 다시 던져서 호출자에게 알림