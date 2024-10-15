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

from elasticsearch import Elasticsearch
from langchain import hub
from sklearn.cluster import KMeans
from sklearn.manifold import TSNE
import openai
from langchain_core.runnables import chain


@chain
def map_refine_chain(docs):

    # map chain 생성
    map_summary = hub.pull("teddynote/map-summary-prompt")

    map_chain = (
        map_summary
        | ChatOpenAI(
            model_name="gpt-4o-mini",
            temperature=0,
        )
        | StrOutputParser()
    )

    input_doc = [{"documents": doc.page_content, "language": "Korean"} for doc in docs]

    # 첫 번째 프롬프트, ChatOpenAI, 문자열 출력 파서를 연결하여 체인을 생성합니다.
    doc_summaries = map_chain.batch(input_doc)

    refine_prompt = hub.pull("teddynote/refine-prompt")

    refine_llm = ChatOpenAI(
        model_name="gpt-4o-mini",
        temperature=0,
        streaming=True,
    )

    refine_chain = refine_prompt | refine_llm | StrOutputParser()

    previous_summary = doc_summaries[0]

    for current_summary in doc_summaries[1:]:

        previous_summary = refine_chain.invoke(
            {
                "previous_summary": previous_summary,
                "current_summary": current_summary,
                "language": "Korean",
            }
        )
        print("\n\n-----------------\n\n")

    return previous_summary

def load_mapping_pickle_data(pickle_file):
    """
    피클 파일에서 데이터를 로드합니다.
    """
    if not os.path.exists(pickle_file):
        raise FileNotFoundError(f"피클 파일 {pickle_file}을 찾을 수 없습니다.")
    
    with open(pickle_file, 'rb') as f:
        data = pickle.load(f)
    return data

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
mapper = load_mapping_pickle_data(MAPPING_PICKLE_FILE)
reverse_mapper = {v: k for k, v in mapper.items()}

llm = ChatOpenAI(
        model_name="gpt-4o-mini",
        streaming=True,
        temperature=0,
    )

map_llm = ChatOpenAI(
    temperature=0,
    model_name="gpt-4o-mini",
)
map_summary = hub.pull("teddynote/map-summary-prompt")
map_chain = map_summary | llm | StrOutputParser()
refine_prompt = hub.pull("teddynote/refine-prompt")

# refine llm 생성
refine_llm = ChatOpenAI(
    temperature=0,
    model_name="gpt-4o-mini",
)

# refine chain 생성
refine_chain = refine_prompt | refine_llm | StrOutputParser()
warnings.filterwarnings("ignore")

# es에 있다면


# es에 없다면 pdf 로더
paper_path = f"{PAPER_STORAGE_PATH}1.pdf"

if not os.path.exists(paper_path):
    download_pdf(reverse_mapper[1], paper_path)
with open(paper_path, "rb") as f:
        pdf_content = f.read()

loader = PDFPlumberLoader(paper_path)
docs = loader.load()
texts = "\n\n".join([doc.page_content for doc in docs])
text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100)
split_docs = text_splitter.split_text(texts)

embeddings = OpenAIEmbeddings()

vectors = embeddings.embed_documents(split_docs)

num_clusters = 10

kmeans = KMeans(n_clusters=num_clusters, random_state=123).fit(vectors)

tsne = TSNE(n_components=2, random_state=42)
reduced_data_tsne = tsne.fit_transform(np.array(vectors))

closest_indices = []

for i in range(num_clusters):
    # 해당 클러스터 중심으로부터의 거리 목록 구하기
    distances = np.linalg.norm(vectors - kmeans.cluster_centers_[i], axis=1)

    # 가장 가까운 점의 인덱스 찾기 (argmin을 사용하여 최소 거리 찾기)
    closest_index = np.argmin(distances)

    # 해당 인덱스를 가장 가까운 인덱스 리스트에 추가
    closest_indices.append(closest_index)

selected_indices = sorted(closest_indices)

selected_docs = [Document(page_content=split_docs[doc]) for doc in selected_indices]

# refined_summary = map_refine_chain.invoke(selected_docs)

# print(refined_summary)

import pymupdf4llm
llama_reader = pymupdf4llm.LlamaMarkdownReader()
llama_docs = llama_reader.load_data(paper_path)
doc_list = []
for doc in llama_docs:
    doc_list.append(doc.text)

print(doc_list)

print("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")

print(texts)

# from pymupdf_rag import to_markdown
md_text = pymupdf4llm.to_markdown(paper_path)

# now work with the markdown text, e.g. store as a UTF8-encoded file
import pathlib
pathlib.Path("output.md").write_bytes(md_text.encode())