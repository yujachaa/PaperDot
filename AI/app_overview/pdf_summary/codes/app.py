import warnings
import os
from crawler import download_pdf  # embedding.py에서 가져옴
from contextlib import asynccontextmanager
import uvicorn
import pickle
from dotenv import load_dotenv
from fastapi import FastAPI, Query, HTTPException
from pydantic import BaseModel
import numpy as np
import re
import urllib
import urllib.parse

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
# from sklearn.cluster import KMeans
# from sklearn.manifold import TSNE
import openai
from langchain_core.runnables import chain
import pymupdf4llm


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
mapper = None

headers_to_split_on = [
    (
        "#",
        "Header 1",
    ),
    (
        "##",
        "Header 2",
    ),
    (
        "###",
        "Header 3",
    ),
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
        raise FileNotFoundError(f"피클 파일 {pickle_file}을 찾을 수 없습니다.")
    
    with open(pickle_file, 'rb') as f:
        data = pickle.load(f)
    return data

def create_internal_links(markdown_text):
    # 정규 표현식 패턴: 줄 시작에서 하나 이상의 '#' 뒤에 공백과 텍스트가 오는 패턴
    # header_pattern = re.compile(r'^(#{1,6})\s+(.*)', re.MULTILINE)
    header_pattern = re.compile(r'^(#)\s+(.*)', re.MULTILINE)
    
    # 모든 헤더 찾기
    headers = header_pattern.findall(markdown_text)
    
    links = []
    for i, header in enumerate(headers, start=1):
        hashes, header_text = header
        # 공백을 '-'로 대체하고 소문자로 변환 (GitHub 스타일 앵커 기준)
        anchor = re.sub(r'\s+', '-', header_text.strip()).lower()
        # 특수 문자 제거 (필요에 따라 조정 가능)
        anchor = re.sub(r'[^\w\-]', '', anchor)
        # 내부 링크 형식 생성
        # anchor = urllib.parse.quote(anchor)
        # link = f"[{header_text}](#{anchor})"
        link = f"[{i}. {header_text}](#{anchor})"
        links.append(link)
    
    return links

def get_pdf(paper_path, paper_id, reverse_mapper):
    if not os.path.exists(paper_path):
        download_pdf(reverse_mapper[int(paper_id)], paper_path)
    with open(paper_path, "rb") as f:
        pdf_document = f.read()
    return pdf_document

# Elasticsearch 클라이언트 생성
def create_es_client(host=ES_HOST, port=ES_PORT, user=ES_USER, password=ES_PASSWORD):
    """
    Elasticsearch 클라이언트에 연결합니다.
    """
    if user and password:
        es = Elasticsearch(
            f"http://{host}:{port}",
            #api_key=f"{ES_APIKEY}",
            basic_auth=(user, password),
            request_timeout=60,
            # max_retries=10,  # 재시도 횟수를 늘림
            # retry_on_timeout=True
        )
    else:
        es = Elasticsearch(
            f"http://{host}:{port}",
            #api_key=f"{ES_APIKEY}",
            request_timeout=60,
            # max_retries=10,  # 재시도 횟수를 늘림
            # retry_on_timeout=True
        )
    # 연결 확인
    if not es.ping():
        raise ValueError("Elasticsearch 연결에 실패했습니다.")
    print("Elasticsearch에 성공적으로 연결되었습니다.")
    return es

class QueryResponse(BaseModel):
    answer: str


# FastAPI lifespan event handler
@asynccontextmanager
async def lifespan(app: FastAPI):
    global mapper, reverse_mapper, llm
    # 애플리케이션 시작 시 실행될 초기화 로직
    print("Initializing embedding system...")
    mapper = load_mapping_pickle_data(MAPPING_PICKLE_FILE)
    reverse_mapper = {v: k for k, v in mapper.items()}

    # es = create_es_client()
    llm = ChatOpenAI(
        model_name="gpt-4o-mini",
        streaming=True,
        temperature=0,
    )

    # lifespan에 진입 (애플리케이션 실행 중)
    yield

    # 애플리케이션 종료 시 실행될 정리 작업
    print("Shutting down...")

# FastAPI 인스턴스 생성, lifespan 이벤트 핸들러 사용
app = FastAPI(lifespan=lifespan)



def agent_pipeline(paper_path, paper_id):
    global mapper, reverse_mapper
    pdf_document = get_pdf(paper_path, paper_id, reverse_mapper)

    markdown_document = pymupdf4llm.to_markdown(paper_path)

    markdown_splitter = MarkdownHeaderTextSplitter(
        headers_to_split_on=headers_to_split_on,
        strip_headers=False, # 헤더 제거 off
    )

    md_header_splits = markdown_splitter.split_text(markdown_document)

    md_header_splits = [section.page_content for section in md_header_splits]

    llm = ChatOpenAI(
        temperature=0,
        model_name="gpt-4o-mini",
        streaming=True,
    )

    map_chain = PROMPT | llm | StrOutputParser()

    doc_summaries = map_chain.batch(md_header_splits)

    len(doc_summaries)

    # print(doc_summaries)

    doc_summaries = '\n\n'.join(doc_summaries)


    internal_links = create_internal_links(doc_summaries)

    toc_markdown = "# 목차\n\n" + '\n'.join(internal_links) + '\n\n'
    final_markdown = toc_markdown + '\n --- \n' + doc_summaries

    return final_markdown


@app.get("/summary")
def summary_paper(paper_id: str = Query(..., description="Paper ID to search"), gen: bool = Query(..., description="RE:generate flag")):
    """
    요약 API 엔드포인트로, GET 요청으로 전달된 id에 대해 요약된 markdown 반환.
    """
    # import warnings
    # warnings.filterwarnings("ignore")

    global mapper, reverse_mapper
    es = create_es_client()

    res = es.get(index=INDEX_NAME, id=paper_id, ignore=404)

    # es에 있다면
    if res['found']:
        doc = res['_source']
        # overview 필드가 비어 있는지 확인
        if 'overview' in doc and doc['overview'] and not gen:
            # 이미 요약된 내용이 있다면 그 내용을 반환
            return {"results": doc['overview']}

        # es에 없다면 pdf 로더
        else:
            paper_path = f"{PAPER_STORAGE_PATH}{paper_id}.pdf"
            results = agent_pipeline(paper_path, paper_id)

            es.update(index=INDEX_NAME, id=paper_id, body={"doc": {"overview": results}})

            return {"results": results}


    # es 에 삽입

    # es 종료


    return {"results": results}

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
        print(f"오류 발생: {e}")
        import traceback
        traceback.print_exc()
