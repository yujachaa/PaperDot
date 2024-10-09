from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
import requests
import time
import os
from dotenv import load_dotenv
from concurrent.futures import ThreadPoolExecutor
from pdf_summary.codes import driver_pool  # WebDriverPool을 가져옵니다.
import requests
import re
import time
import os

def download_pdf(doc_id, save_path):
    url = f"https://scienceon.kisti.re.kr/srch/selectPORSrchArticle.do?cn={doc_id}&oCn={doc_id}&dbt=JAKO"

    driver = driver_pool.get_driver()
    
    try:
        print(f"{doc_id} - 논문 페이지로 이동 중...")
        driver.get(url)
        
        print(f"{doc_id} - 'ScienceON 원문보기' 버튼 찾는 중...")
        view_button = WebDriverWait(driver, 30).until(
            EC.element_to_be_clickable((By.XPATH, "//a[contains(@onclick, 'fncOrgDown') and contains(text(), 'ScienceON 원문보기')]"))
        )
        
        driver.execute_script("arguments[0].scrollIntoView(true);", view_button)
        time.sleep(1)  # 페이지 렌더링을 위한 짧은 대기
        print(f"{doc_id} - 'ScienceON 원문보기' 버튼 클릭 중...")
        driver.execute_script("arguments[0].click();", view_button)
        
        print(f"{doc_id} - 새 창으로 전환 중...")
        WebDriverWait(driver, 10).until(EC.number_of_windows_to_be(2))
        driver.switch_to.window(driver.window_handles[-1])
        
        print(f"{doc_id} - 새 창 URL: {driver.current_url}")
    
        print(f"{doc_id} - PDF URL 탐지 중...")
        # 페이지 소스에서 직접 PDF URL 탐지 시도
        page_source = driver.page_source
        pdf_url_start = page_source.find("/commons/util/orgDocDown.do")
        if pdf_url_start != -1:
            pdf_url_end = page_source.find("'", pdf_url_start)  # URL이 '로 끝날 것으로 가정
            pdf_url = "https://scienceon.kisti.re.kr" + page_source[pdf_url_start:pdf_url_end]
            print(f"{doc_id} - PDF URL 탐지됨: {pdf_url}")

            pdf_url = clean_pdf_url(pdf_url)
            
            print(f"{doc_id} - 변환된 PDF URL: {pdf_url}")
            
            download_pdf_with_session(pdf_url, save_path, driver)
        else:
            print(f"{doc_id} - PDF 링크를 찾지 못했습니다.")
            print(f"{doc_id} - 현재 페이지 제목: {driver.title}")
            print(f"{doc_id} - 현재 페이지 URL: {driver.current_url}")
            # 스크린샷 저장
            screenshot_path = f"./screenshot_{doc_id}.png"
            driver.save_screenshot(screenshot_path)
            print(f"{doc_id} - 스크린샷 저장됨: {screenshot_path}")
    
    except Exception as e:
        print(f"{doc_id} - 오류 발생: {e}")
        # 스크린샷 저장
        screenshot_path = f"./error_screenshot_{doc_id}.png"
        driver.save_screenshot(screenshot_path)
        print(f"{doc_id} - 오류 시 스크린샷 저장됨: {screenshot_path}")
    finally:
        print(f"{doc_id} - WebDriver 반환 중...")
        driver_pool.return_driver(driver)

def clean_pdf_url(pdf_url):
    pdf_url = pdf_url.replace("&amp;", "&")
    return pdf_url

def download_pdf_with_session(pdf_url, save_path, driver):
    try:
        # Selenium에서 쿠키 추출
        session = requests.Session()
        for cookie in driver.get_cookies():
            session.cookies.set(cookie['name'], cookie['value'])
        
        response = session.get(pdf_url, stream=True)
        response.raise_for_status()
        
        with open(save_path, "wb") as file:
            for chunk in response.iter_content(chunk_size=8192):
                if chunk:
                    file.write(chunk)
        
        print(f"{save_path} - PDF 다운로드 완료!")
    except requests.exceptions.RequestException as e:
        print(f"{save_path} - PDF 다운로드 실패: {e}")



# from selenium import webdriver
# from selenium.webdriver.common.by import By
# from selenium.webdriver.chrome.service import Service
# from selenium.webdriver.support.ui import WebDriverWait
# from selenium.webdriver.support import expected_conditions as EC
# from selenium.webdriver.chrome.options import Options
# import requests
# import time
# import os
# from dotenv import load_dotenv
# from concurrent.futures import ThreadPoolExecutor

# current_dir = os.path.dirname(os.path.abspath(__file__))
# env_path = os.path.join(current_dir, "../../config/.env")

# # .env 파일 로드
# load_dotenv(dotenv_path=env_path)

# CHROME_PATH = os.path.join(current_dir, os.getenv('LINUX_CHROME_PATH'))
# DRIVER_PATH = os.path.join(current_dir, os.getenv('LINUX_DRIVER_PATH'))

# def download_pdf(doc_id, save_path):
#     url = f"https://scienceon.kisti.re.kr/srch/selectPORSrchArticle.do?cn={doc_id}&oCn={doc_id}&dbt=JAKO"
    
#     driver = create_driver()
    
#     try:
#         print(f"{doc_id} - 논문 페이지로 이동 중...")
#         driver.get(url)
        
#         print(f"{doc_id} - 'ScienceON 원문보기' 버튼 찾는 중...")
#         view_button = WebDriverWait(driver, 30).until(
#             EC.element_to_be_clickable((By.XPATH, "//a[contains(@onclick, 'fncOrgDown') and contains(text(), 'ScienceON 원문보기')]"))
#         )
        
#         driver.execute_script("arguments[0].scrollIntoView(true);", view_button)
#         time.sleep(1)  # 페이지 렌더링을 위한 짧은 대기
#         print(f"{doc_id} - 'ScienceON 원문보기' 버튼 클릭 중...")
#         driver.execute_script("arguments[0].click();", view_button)
        
#         print(f"{doc_id} - 새 창으로 전환 중...")
#         WebDriverWait(driver, 10).until(EC.number_of_windows_to_be(2))
#         driver.switch_to.window(driver.window_handles[-1])
        
#         print(f"{doc_id} - 새 창 URL: {driver.current_url}")
    
#         print(f"{doc_id} - PDF URL 탐지 중...")
#         # 페이지 소스에서 직접 PDF URL 탐지 시도
#         page_source = driver.page_source
#         pdf_url_start = page_source.find("/commons/util/orgDocDown.do")
#         if pdf_url_start != -1:
#             pdf_url_end = page_source.find("'", pdf_url_start)  # URL이 '로 끝날 것으로 가정
#             pdf_url = "https://scienceon.kisti.re.kr" + page_source[pdf_url_start:pdf_url_end]
#             print(f"{doc_id} - PDF URL 탐지됨: {pdf_url}")

#             pdf_url = clean_pdf_url(pdf_url)
            
#             print(f"{doc_id} - 변환된 PDF URL: {pdf_url}")
            
#             download_pdf_with_session(pdf_url, save_path, driver)
#         else:
#             print(f"{doc_id} - PDF 링크를 찾지 못했습니다.")
#             print(f"{doc_id} - 현재 페이지 제목: {driver.title}")
#             print(f"{doc_id} - 현재 페이지 URL: {driver.current_url}")
#             # 스크린샷 저장
#             screenshot_path = f"./screenshot_{doc_id}.png"
#             driver.save_screenshot(screenshot_path)
#             print(f"{doc_id} - 스크린샷 저장됨: {screenshot_path}")
    
#     except Exception as e:
#         print(f"{doc_id} - 오류 발생: {e}")
#         # 스크린샷 저장
#         screenshot_path = f"./error_screenshot_{doc_id}.png"
#         driver.save_screenshot(screenshot_path)
#         print(f"{doc_id} - 오류 시 스크린샷 저장됨: {screenshot_path}")
#     finally:
#         print(f"{doc_id} - 웹드라이버 종료 중...")
#         driver.quit()

# def clean_pdf_url(pdf_url):
#     pdf_url = pdf_url.replace("&amp;", "&")
#     return pdf_url

# def create_driver():
#     options = Options()
    
#     # 헤드리스 모드 활성화
#     options.add_argument('--headless')
    
#     # 보안 관련 옵션
#     options.add_argument('--no-sandbox')
#     options.add_argument('--disable-dev-shm-usage')
#     options.add_argument('--disable-gpu')  # GPU 가속 비활성화
#     options.add_argument('--window-size=1920,1080')  # 창 크기 설정
    
#     # 디버깅 관련 옵션
#     options.add_argument('--remote-debugging-port=9222')
#     options.add_argument('--log-level=3')
    
#     # 브라우저 자동 테스트 감지 방지
#     options.add_argument('--disable-blink-features=AutomationControlled')
    
#     # 바이너리 경로 설정 (자신의 Chrome 경로로 설정)
#     options.binary_location = CHROME_PATH
    
#     # 로그 수준 설정 (디버깅 시 유용)
#     options.add_argument('--log-level=3')
    
#     # Headless 모드의 일부 문제를 해결하기 위해 필요할 수 있는 추가 옵션
#     options.add_argument('--disable-extensions')
#     options.add_argument('--disable-infobars')
#     options.add_argument('--disable-browser-side-navigation')
#     options.add_argument('--disable-features=VizDisplayCompositor')
    
#     service = Service(DRIVER_PATH)
#     driver = webdriver.Chrome(service=service, options=options)
#     return driver

# def download_pdf_with_session(pdf_url, save_path, driver):
#     try:
#         # Selenium에서 쿠키 추출
#         session = requests.Session()
#         for cookie in driver.get_cookies():
#             print(f"쿠키 이름: {cookie['name']}, 값: {cookie['value']}")  # 쿠키 정보 출력
#             session.cookies.set(cookie['name'], cookie['value'])
        
#         response = session.get(pdf_url, stream=True)
#         response.raise_for_status()
        
#         with open(save_path, "wb") as file:
#             for chunk in response.iter_content(chunk_size=8192):
#                 if chunk:
#                     file.write(chunk)
        
#         print(f"{save_path} - PDF 다운로드 완료!")
#     except requests.exceptions.RequestException as e:
#         print(f"{save_path} - PDF 다운로드 실패: {e}")

# def download_pdfs_in_parallel(doc_ids):
#     save_dir = "./downloads"
#     os.makedirs(save_dir, exist_ok=True)

#     with ThreadPoolExecutor(max_workers=10) as executor:
#         futures = []
#         for doc_id in doc_ids:
#             save_path = os.path.join(save_dir, f"{doc_id}.pdf")
#             futures.append(executor.submit(download_pdf, doc_id, save_path))

#         for future in futures:
#             try:
#                 future.result()  # 예외 발생 시 처리
#             except Exception as e:
#                 print(f"다운로드 작업 중 오류 발생: {e}")

# if __name__ == "__main__":
#     # 예시 논문 ID 목록
#     document_ids = [
#         "DOC_ID_1",
#         "DOC_ID_2",
#         "DOC_ID_3",
#         "DOC_ID_4",
#         "DOC_ID_5",
#         "DOC_ID_6",
#         "DOC_ID_7",
#         "DOC_ID_8",
#         "DOC_ID_9",
#         "DOC_ID_10",
#     ]
#     download_pdfs_in_parallel(document_ids)


