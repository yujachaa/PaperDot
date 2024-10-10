import asyncio
from dotenv import load_dotenv
from contextlib import asynccontextmanager
import uvicorn
import pickle
from elasticsearch import Elasticsearch
from codes.crawler import download_pdf
import openai
import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
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
from langchain_text_splitters import MarkdownHeaderTextSplitter
import pymupdf4llm

current_dir = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(current_dir, "../config/.env")

# Define paths
FAISS_INDEX_PATH = os.path.join(current_dir, "../caches/")
PAPER_STORAGE_PATH = os.path.join(current_dir, "../datas/")
MAPPING_PICKLE_FILE = os.path.join(current_dir, "../models/doc_id_index_mapping.pkl")

# Ensure directories exist
os.makedirs(FAISS_INDEX_PATH, exist_ok=True)
os.makedirs(PAPER_STORAGE_PATH, exist_ok=True)
load_dotenv(dotenv_path=env_path)

openai.api_key = os.getenv("OPENAI_API_KEY")

# Elasticsearch settings
ES_HOST = os.getenv('ES_HOST')
ES_PORT = os.getenv('ES_PORT')
ES_USER = os.getenv('ES_USER')
ES_PASSWORD = os.getenv('ES_PASSWORD')
INDEX_NAME = 'papers'

mapper = None
reverse_mapper = None
store = {}
download_queue = asyncio.Queue()  # 비동기 다운로드 큐 추가

PROMPT = """
You are an assistant for question-answering tasks, specifically focused on providing information related to academic papers. 
Use the following pieces of retrieved context to answer the question. 
If the question involves terms that are not found in the retrieved context, but are common academic terms, please provide a standard definition.
If the question is unrelated to academic papers, or if the context does not provide sufficient information, politely respond that this is beyond your scope.
Answer in Korean.

#Previous Chat History:
{chat_history}

#Question:
{question}

#Context:
{context}

#Answer:
"""


# CORS 설정 추가
origins = [
    "http://localhost:5173",
    "https://localhost:5173",
    "https://j11b208.p.ssafy.io",
]

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


def load_mapping_pickle_data(pickle_file):
    if not os.path.exists(pickle_file):
        raise FileNotFoundError(f"피클 파일 {pickle_file}을 찾을 수 없습니다.")
    with open(pickle_file, 'rb') as f:
        data = pickle.load(f)
    return data


# 비동기 다운로드 작업자 함수 추가
async def download_worker():
    while True:
        paper_id, paper_path = await download_queue.get()
        try:
            # Download the paper PDF using the existing crawling function
            download_pdf(reverse_mapper[int(paper_id)], paper_path)
        except Exception as e:
            print(f"Error downloading paper {paper_id}: {e}")
        finally:
            download_queue.task_done()


# FastAPI lifespan event handler
@asynccontextmanager
async def lifespan(app: FastAPI):
    global mapper, reverse_mapper, store
    print("Initializing embedding system...")
    mapper = load_mapping_pickle_data(MAPPING_PICKLE_FILE)
    reverse_mapper = {v: k for k, v in mapper.items()}
    asyncio.create_task(download_worker())  # 비동기 다운로드 작업자 태스크 생성
    yield
    print("Shutting down...")


# FastAPI 인스턴스 생성, lifespan 이벤트 핸들러 사용
app = FastAPI(lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class QueryRequest(BaseModel):
    paper_id: str
    question: str
    user_id: str = "guest"


class QueryResponse(BaseModel):
    answer: str


@app.post("/chatAI", response_model=QueryResponse)
async def ask_question(request: QueryRequest):
    global mapper, reverse_mapper, store
    paper_id = request.paper_id
    question = request.question
    user_id = f'{request.user_id}_{paper_id}'

    paper_path = f"{PAPER_STORAGE_PATH}{paper_id}.pdf"
    index_file = f"{FAISS_INDEX_PATH}{paper_id}_index"

    if not os.path.exists(index_file):
        if not os.path.exists(paper_path):
            await download_queue.put((paper_id, paper_path))  # 다운로드 작업을 큐에 추가
            await download_queue.join()  # 다운로드 완료 대기

        loader = PDFPlumberLoader(paper_path)
        docs = loader.load()
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=50)
        split_documents = text_splitter.split_documents(docs)
        embeddings = OpenAIEmbeddings()
        vectorstore = FAISS.from_documents(documents=split_documents, embedding=embeddings)
        vectorstore.save_local(index_file)
    else:
        embeddings = OpenAIEmbeddings()
        vectorstore = FAISS.load_local(index_file, embeddings, allow_dangerous_deserialization=True)

    retriever = vectorstore.as_retriever()

    
    prompt = PromptTemplate.from_template(PROMPT)

    llm = ChatOpenAI(model_name="gpt-4o-mini", temperature=0)
    chain = (
        {
            "context": itemgetter("question") | retriever,
            "question": itemgetter("question"),
            "chat_history": itemgetter("chat_history"),
        }
        | prompt
        | llm
        | StrOutputParser()
    )

    rag_with_history = RunnableWithMessageHistory(
        chain,
        get_session_history,
        input_messages_key="question",
        history_messages_key="chat_history",
    )

    answer = rag_with_history.invoke(
        {"question": f"{question}"},
        config={"configurable": {"session_id": f"{user_id}"}},
    )

    print(answer)
    return QueryResponse(answer=answer)


# chatAI-2 부분 추가
@app.post("/chatAI-2", response_model=QueryResponse)
async def ask_question_v2(request: QueryRequest):
    global mapper, reverse_mapper, store
    paper_id = request.paper_id
    question = request.question
    user_id = f'{request.user_id}_{paper_id}'

    paper_path = f"{PAPER_STORAGE_PATH}{paper_id}.pdf"
    index_file = f"{FAISS_INDEX_PATH}{paper_id}_index_ver_md"

    if not os.path.exists(index_file):
        if not os.path.exists(paper_path):
            await download_queue.put((paper_id, paper_path))  # 다운로드 작업을 큐에 추가
            await download_queue.join()  # 다운로드 완료 대기

        docs = pymupdf4llm.to_markdown(paper_path)

        markdown_splitter = MarkdownHeaderTextSplitter(
            headers_to_split_on=headers_to_split_on,
            strip_headers=False, # 헤더 제거 off
        )

        docs = markdown_splitter.split_text(docs)
        
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=50)
        split_documents = text_splitter.split_documents(docs)
        embeddings = OpenAIEmbeddings()
        vectorstore = FAISS.from_documents(documents=split_documents, embedding=embeddings)
        vectorstore.save_local(index_file)
    else:
        embeddings = OpenAIEmbeddings()
        vectorstore = FAISS.load_local(index_file, embeddings, allow_dangerous_deserialization=True)

    retriever = vectorstore.as_retriever()
    prompt = PromptTemplate.from_template(PROMPT)

    llm = ChatOpenAI(model_name="gpt-4o-mini", temperature=0)
    chain = (
        {
            "context": itemgetter("question") | retriever,
            "question": itemgetter("question"),
            "chat_history": itemgetter("chat_history"),
        }
        | prompt
        | llm
        | StrOutputParser()
    )

    rag_with_history = RunnableWithMessageHistory(
        chain,
        get_session_history,
        input_messages_key="question",
        history_messages_key="chat_history",
    )

    answer = rag_with_history.invoke(
        {"question": f"{question}"},
        config={"configurable": {"session_id": f"{user_id}"}},
    )

    print(answer)
    return QueryResponse(answer=answer)


# 세션 ID를 기반으로 세션 기록을 가져오는 함수
def get_session_history(session_ids):
    if session_ids not in store:
        store[session_ids] = ChatMessageHistory()
    return store[session_ids]


def main():
    uvicorn.run("app:app", host="0.0.0.0", port=7777, reload=True)


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"오류 발생: {e}")
        import traceback
        traceback.print_exc()