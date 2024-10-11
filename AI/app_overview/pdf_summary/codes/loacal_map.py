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
from sklearn.cluster import KMeans
from sklearn.manifold import TSNE
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
다음 텍스트를 읽고 핵심 내용을 요약해 주세요. 요약 시에는 markdown 태그를 적극 활용해주세요. '#'과 '##'의 헤더가 있다면 각 문단에 어울리는 이모지를 헤더에 포함해 꾸며주세요.

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


def shoot(paper_id=5966):
    global mapper, reverse_mapper, headers_to_split_on
    mapper = load_mapping_pickle_data(MAPPING_PICKLE_FILE)
    reverse_mapper = {v: k for k, v in mapper.items()}
    toc_entries = []


    paper_path = f"{PAPER_STORAGE_PATH}{paper_id}.pdf"

    if not os.path.exists(paper_path):
        download_pdf(reverse_mapper[paper_id], paper_path)
    # with open(paper_path, "rb") as f:
    #         pdf_document = f.read()



    markdown_document = pymupdf4llm.to_markdown(paper_path)

    markdown_splitter = MarkdownHeaderTextSplitter(
        headers_to_split_on=headers_to_split_on,
        strip_headers=False, # 헤더 제거 off
    )

    md_header_splits = markdown_splitter.split_text(markdown_document)

    md_header_splits = [section.page_content for section in md_header_splits]

    print(md_header_splits)
    print("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")

    # for header in md_header_splits:
    #     print(f"{header.page_content}")
    #     print(f"{header.metadata}", end="\n=====================\n")

    # chunk_size = 700  # 분할된 청크의 크기를 지정합니다.
    # chunk_overlap = 10  # 분할된 청크 간의 중복되는 문자 수를 지정합니다.
    # text_splitter = RecursiveCharacterTextSplitter(
    #     chunk_size=chunk_size, chunk_overlap=chunk_overlap
    # )

    # splits = text_splitter.split_documents(md_header_splits)
    # 분할된 결과를 출력합니다.
    # for header in splits:
    #     print(f"{header.page_content}")
    #     print(f"{header.metadata}", end="\n=====================\n")

    llm = ChatOpenAI(
        temperature=0,
        model_name="gpt-4o-mini",
        streaming=True,
    )

    map_chain = PROMPT | llm | StrOutputParser()

    doc_summaries = map_chain.batch(md_header_splits)

    len(doc_summaries)

    print(doc_summaries)
    print("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")

    # print(doc_summaries)

    doc_summaries = '\n\n'.join(doc_summaries)


    internal_links = create_internal_links(doc_summaries)

    # for link in internal_links:
    #     print(link)


    toc_markdown = "# 목차\n\n" + '\n'.join(internal_links) + '\n\n'
    final_markdown = toc_markdown + doc_summaries

    print(final_markdown)



def main():
    shoot()


if __name__ == "__main__":
    main()


# now work with the markdown text, e.g. store as a UTF8-encoded file
# import pathlib
# pathlib.Path("output.md").write_bytes(md_text.encode())