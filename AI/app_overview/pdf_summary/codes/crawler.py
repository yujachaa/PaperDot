# crawler.py
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
