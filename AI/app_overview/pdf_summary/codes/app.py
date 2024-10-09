import warnings
import os
from pdf_summary.codes.crawler import download_pdf  # 수정된 download_pdf 사용
from contextlib import asynccontextmanager
import uvicorn
import pickle
from dotenv import load_dotenv
from fastapi import FastAPI, Query, HTTPException, Depends
from pydantic import BaseModel
import numpy as np
import re
import urllib.parse
from fastapi.middleware.cors import CORSMiddleware

from langchain_community.document_loaders import PDFPlumberLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import PromptTemplate
from operator import itemgetter
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.runnables import chain
from langchain_core.documents import Document
from langchain_text_splitters import MarkdownHeaderTextSplitter
from langchain.prompts import PromptTemplate
from elasticsearch import Elasticsearch
from langchain import hub
import openai
import pymupdf4llm
import asyncio
from concurrent.futures import ThreadPoolExecutor
from selenium import webdriver
from queue import Queue
from threading import Lock

import logging

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# WebDriver 풀 클래스 정의
class WebDriverPool:
    def __init__(self, max_size=5):
        self.pool = Queue(max_size)
        self.lock = Lock()
        for _ in range(max_size):
            driver = create_driver()
            self.pool.put(driver)
            logger.info(f"WebDriver 인스턴스 초기화 완료. 현재 풀 크기: {self.pool.qsize()}")

    def get_driver(self):
        driver = self.pool.get()
        logger.info(f"WebDriver 인스턴스 가져옴. 현재 풀 크기: {self.pool.qsize()}")
        return driver

    def return_driver(self, driver):
        self.pool.put(driver)
        logger.info(f"WebDriver 인스턴스 풀에 반환됨. 현재 풀 크기: {self.pool.qsize()}")

    def close_all(self):
        while not self.pool.empty():
            driver = self.pool.get()
            driver.quit()
            logger.info(f"WebDriver 인스턴스 종료됨. 남은 풀 크기: {self.pool.qsize()}")

# WebDriver 생성 함수
def create_driver():
    from selenium.webdriver.chrome.service import Service
    from selenium.webdriver.chrome.options import Options

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

# WebDriver 풀 초기화 (최대 5개)
driver_pool = WebDriverPool(max_size=5)

current_dir = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(current_dir, "../config/.env")

# Define paths
MAPPING_PICKLE_FILE = os.path.join(current_dir, "../models/doc_id_index_mapping.pkl")
PAPER_STORAGE_PATH = os.path.join(current_dir, "../datas/")

load_dotenv(dotenv_path=env_path)

openai.api_key = os.getenv("OPENAI_API_KEY")

# Elasticsearch 설정
ES_HOST = os.getenv('ES_HOST')  # 예: 'localhost' 또는 'your-ec2-public-dns'
ES_PORT = os.getenv('ES_PORT')  # 기본 포트; 다를 경우 변경
ES_USER = os.getenv('ES_USER')  # 인증이 필요한 경우
ES_PASSWORD = os.getenv('ES_PASSWORD')  # 인증이 필요한 경우
ES_APIKEY = os.getenv('ES_APIKEY')
INDEX_NAME = 'papers'

mapper = None
reverse_mapper = None
llm = None

# CORS 설정 추가
origins = [
    "http://localhost:5173",
    "https://localhost:5173",  # 예를 들어 리액트 로컬 서버
    "https://j11b208.p.ssafy.io",  # 실제로 사용하는 도메인 추가
]

headers_to_split_on = [
    ("#", "Header 1"),
    ("##", "Header 2"),
    ("###", "Header 3"),
]

prompt_template = """
다음 텍스트를 읽고 되도록 한글로 핵심 내용을 요약해 주세요. 요약 시에는 markdown 태그를 적극 활용해주세요. '#' 헤더가 있다면 각 문단에 어울리는 이모지를 헤더에 포함해 꾸며주세요.

"{text}"

요약:
"""

PROMPT = PromptTemplate(template=prompt_template, input_variables=["text"])

def load_mapping_pickle_data(pickle_file):
    """
    피클 파일에서 데이터를 로드합니다.
    """
    if not os.path.exists(pickle_file):
        logger.error(f"피클 파일 {pickle_file}을 찾을 수 없습니다.")
        raise FileNotFoundError(f"피클 파일 {pickle_file}을 찾을 수 없습니다.")
    
    with open(pickle_file, 'rb') as f:
        data = pickle.load(f)
    logger.info(f"피클 파일 {pickle_file} 로드 완료.")
    return data

def create_internal_links(markdown_text):
    header_pattern = re.compile(r'^(#)\s+(.*)', re.MULTILINE)
    headers = header_pattern.findall(markdown_text)
    
    links = []
    for i, header in enumerate(headers, start=1):
        hashes, header_text = header
        anchor = re.sub(r'\s+', '-', header_text.strip()).lower()
        anchor = re.sub(r'[^\w\-\u2600-\u27BF\u1F300-\u1FAFF\u1F900-\u1F9FF\u1F600-\u1F64F]', '', anchor)
        link = f"[{i}. {header_text}](#{anchor})"
        links.append(link)
    links = "<br>".join(links)
    return links

def get_pdf(paper_path, paper_id, reverse_mapper, driver):
    doc_id = reverse_mapper.get(paper_id)
    if not doc_id:
        logger.error(f"paper_id {paper_id}에 대한 doc_id를 찾을 수 없습니다.")
        raise ValueError(f"paper_id {paper_id}에 대한 doc_id를 찾을 수 없습니다.")
    
    logger.info(f"Paper ID: {paper_id} maps to Doc ID: {doc_id}")
    
    if not os.path.exists(paper_path):
        logger.info(f"Paper ID: {paper_id}에 해당하는 PDF가 존재하지 않습니다. 다운로드 시작.")
        download_pdf(doc_id, paper_path, driver)
    else:
        logger.info(f"Paper ID: {paper_id}에 해당하는 PDF가 이미 존재합니다.")
    
    with open(paper_path, "rb") as f:
        pdf_document = f.read()
    return pdf_document

# Elasticsearch 클라이언트 생성
def create_es_client(host=ES_HOST, port=ES_PORT, user=ES_USER, password=ES_PASSWORD):
    """
    Elasticsearch 클라이언트에 연결합니다.
    """
    try:
        if user and password:
            es = Elasticsearch(
                f"http://{host}:{port}",
                basic_auth=(user, password),
                request_timeout=60,
            )
        else:
            es = Elasticsearch(
                f"http://{host}:{port}",
                request_timeout=60,
            )
        # 연결 확인
        if not es.ping():
            logger.error("Elasticsearch 연결에 실패했습니다.")
            raise ValueError("Elasticsearch 연결에 실패했습니다.")
        logger.info("Elasticsearch에 성공적으로 연결되었습니다.")
        return es
    except Exception as e:
        logger.error(f"Elasticsearch 연결 중 오류 발생: {e}")
        raise e

class QueryResponse(BaseModel):
    answer: str
    model: int

# FastAPI 상태 클래스 정의
class AppState:
    def __init__(self):
        self.mapper = load_mapping_pickle_data(MAPPING_PICKLE_FILE)
        self.reverse_mapper = {v: k for k, v in self.mapper.items()}
        self.llm = ChatOpenAI(
            model_name="gpt-4o-mini",
            streaming=True,
            temperature=0,
        )
        self.es = create_es_client()

# 의존성 주입 함수
async def get_app_state():
    return app.state

# FastAPI lifespan 이벤트 핸들러
@asynccontextmanager
async def lifespan(app: FastAPI):
    # 애플리케이션 시작 시 실행될 초기화 로직
    logger.info("Initializing embedding system...")
    app.state = AppState()
    
    # lifespan에 진입 (애플리케이션 실행 중)
    yield
    
    # 애플리케이션 종료 시 실행될 정리 작업
    logger.info("Shutting down...")
    driver_pool.close_all()

# FastAPI 인스턴스 생성, lifespan 이벤트 핸들러 사용
app = FastAPI(lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # 허용할 도메인
    allow_credentials=True,
    allow_methods=["*"],  # 모든 메서드 허용 (GET, POST 등)
    allow_headers=["*"],  # 모든 헤더 허용
)

def agent_pipeline(paper_path, paper_id, state: AppState):
    driver = driver_pool.get_driver()
    try:
        pdf_document = get_pdf(paper_path, paper_id, state.reverse_mapper, driver)

        markdown_document = pymupdf4llm.to_markdown(paper_path)

        markdown_splitter = MarkdownHeaderTextSplitter(
            headers_to_split_on=headers_to_split_on,
            strip_headers=False, # 헤더 제거 off
        )

        md_header_splits = markdown_splitter.split_text(markdown_document)

        md_header_splits = [section.page_content for section in md_header_splits]

        # 이미 state.llm이 초기화되어 있으므로 재초기화하지 않음
        llm = state.llm

        map_chain = PROMPT | llm | StrOutputParser()

        doc_summaries = map_chain.batch(md_header_splits)

        doc_summaries = '\n\n'.join(doc_summaries)

        internal_links = create_internal_links(doc_summaries)

        toc_markdown = f"# 목차\n\n{internal_links}\n\n"
        final_markdown = toc_markdown + '\n --- \n' + doc_summaries

        logger.info(f"Paper ID: {paper_id} 요약 완료.")
        return final_markdown
    finally:
        driver_pool.return_driver(driver)

# ThreadPoolExecutor 초기화
executor = ThreadPoolExecutor(max_workers=5)

async def agent_pipeline_async(paper_path, paper_id, state: AppState):
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(executor, agent_pipeline, paper_path, paper_id, state)

@app.get("/summary")
async def summary_paper(
    paper_id: str = Query(..., description="Paper ID to search"),
    gen: bool = Query(..., description="RE:generate flag"),
    state: AppState = Depends(get_app_state)
):
    """
    요약 API 엔드포인트로, GET 요청으로 전달된 id에 대해 요약된 markdown 반환.
    """
    es = state.es

    try:
        res = es.get(index=INDEX_NAME, id=paper_id, ignore=404)
    except Exception as e:
        logger.error(f"Elasticsearch 오류: {e}")
        raise HTTPException(status_code=500, detail=f"Elasticsearch 오류: {e}")

    if res['found']:
        doc = res['_source']
        if 'overview' in doc and doc['overview'] and not gen:
            logger.info(f"Paper ID: {paper_id}의 기존 요약 반환.")
            return {"results": doc['overview'], "model": 0}
        else:
            paper_path = os.path.join(PAPER_STORAGE_PATH, f"{paper_id}.pdf")
            try:
                results = await agent_pipeline_async(paper_path, paper_id, state)
                es.update(index=INDEX_NAME, id=paper_id, body={"doc": {"overview": results}})
                logger.info(f"Paper ID: {paper_id}의 요약 생성 및 Elasticsearch 업데이트 완료.")
                return {"results": results, "model": 1}
            except Exception as e:
                logger.error(f"요약 생성 오류: {e}")
                raise HTTPException(status_code=500, detail=f"요약 생성 오류: {e}")
    else:
        logger.warning(f"Paper ID: {paper_id}을 Elasticsearch에서 찾을 수 없습니다.")
        results = "\n\n ## 🙏 재요약 버튼을 눌러주세요. 🙏"
        return {"results": results, "model": 0}

def main():
    """
    편의성을 위한 main 함수. uvicorn을 사용해 FastAPI 애플리케이션을 실행.
    """
    uvicorn.run("app:app", host="0.0.0.0", port=3333, reload=True)

if __name__ == "__main__":
    try:
        # 기존 코드 실행
        main()  # 주 실행 코드
    except Exception as e:
        logger.error(f"오류 발생: {e}", exc_info=True)
