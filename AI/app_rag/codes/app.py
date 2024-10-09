
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

# Elasticsearch 설정
ES_HOST = os.getenv('ES_HOST')  # 예: 'localhost' 또는 'your-ec2-public-dns'
ES_PORT = os.getenv('ES_PORT')  # 기본 포트; 다를 경우 변경
ES_USER = os.getenv('ES_USER')  # 인증이 필요한 경우
ES_PASSWORD = os.getenv('ES_PASSWORD')  # 인증이 필요한 경우
ES_APIKEY = os.getenv('ES_APIKEY')
INDEX_NAME = 'papers'

mapper = None
reverse_mapper = None
store = {}

# CORS 설정 추가
origins = [
    "http://localhost:5173",
    "https://localhost:5173",  # 예를 들어 리액트 로컬 서버
    "https://j11b208.p.ssafy.io",  # 실제로 사용하는 도메인 추가
]



def load_mapping_pickle_data(pickle_file):
    """
    피클 파일에서 데이터를 로드합니다.
    """
    if not os.path.exists(pickle_file):
        raise FileNotFoundError(f"피클 파일 {pickle_file}을 찾을 수 없습니다.")
    
    with open(pickle_file, 'rb') as f:
        data = pickle.load(f)
    return data

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

class QueryRequest(BaseModel):
    paper_id: str
    question: str
    user_id: str = "guest"

class QueryResponse(BaseModel):
    answer: str

# FastAPI lifespan event handler
@asynccontextmanager
async def lifespan(app: FastAPI):
    global mapper, reverse_mapper, store
    # 애플리케이션 시작 시 실행될 초기화 로직
    print("Initializing embedding system...")

    mapper = load_mapping_pickle_data(MAPPING_PICKLE_FILE)

    reverse_mapper = {v: k for k, v in mapper.items()}

    # store = {}
    
    # embedding_system = LargeScaleKoreanPaperEmbedding(os.path.join(current_dir, "../datas/"), random_access_file_path)
    # if os.path.exists(embedding_file_path):
    #     embedding_system.load_embeddings(embedding_file_path)
    # else:
    #     embedding_system.create_embeddings()
    #     embedding_system.save_embeddings(embedding_file_path)

    
    
    # lifespan에 진입 (애플리케이션 실행 중)
    yield

    # 애플리케이션 종료 시 실행될 정리 작업
    print("Shutting down...")

# FastAPI 인스턴스 생성, lifespan 이벤트 핸들러 사용
app = FastAPI(lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # 허용할 도메인
    allow_credentials=True,
    allow_methods=["*"],  # 모든 메서드 허용 (GET, POST 등)
    allow_headers=["*"],  # 모든 헤더 허용
)

@app.post("/chatAI", response_model=QueryResponse)
async def ask_question(request: QueryRequest):
    global mapper, reverse_mapper, store
    paper_id = request.paper_id
    question = request.question
    user_id = f'{request.user_id}_{paper_id}'

    # Step 1: Check if paper is already downloaded
    paper_path = f"{PAPER_STORAGE_PATH}{paper_id}.pdf"

    
    

    # Step 2: Check if FAISS index for the paper exists
    index_file = f"{FAISS_INDEX_PATH}{paper_id}_index"
    if not os.path.exists(index_file):
        if not os.path.exists(paper_path):
            # Download the paper PDF using the existing crawling function
            download_pdf(reverse_mapper[int(paper_id)], paper_path)

        # Step 3: Store the paper PDF in Elasticsearch
        # with open(paper_path, "rb") as f:
        #     pdf_content = f.read()
            # es.index(index=INDEX_NAME, id=paper_id, body={"pdf": pdf_content})
        
        
        # Create a new FAISS index
        # 단계 1: 문서 로드(Load Documents)
        loader = PDFPlumberLoader(paper_path)
        docs = loader.load()

        # 단계 2: 문서 분할(Split Documents)
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=50)
        split_documents = text_splitter.split_documents(docs)

        # 단계 3: 임베딩(Embedding) 생성
        embeddings = OpenAIEmbeddings()

        # 단계 4: DB 생성(Create DB) 및 저장
        # 벡터스토어를 생성합니다.
        vectorstore = FAISS.from_documents(documents=split_documents, embedding=embeddings)

        # 단계 5: Save index to disk
        # with open(index_file, "wb") as f:
        #     pickle.dump(vectorstore, f)
        vectorstore.save_local(index_file)
    else:
        # Load existing FAISS index
        # with open(index_file, "rb") as f:
        #     vectorstore = pickle.load(f)
        embeddings = OpenAIEmbeddings()
        vectorstore = FAISS.load_local(index_file, embeddings, allow_dangerous_deserialization=True)

    # Step 4: 검색기(Retriever) 생성
    # 문서에 포함되어 있는 정보를 검색하고 생성합니다.
    retriever = vectorstore.as_retriever()

    # Step 5: 프롬프트 생성(Create Prompt)
    prompt = PromptTemplate.from_template(
    #     """You are an assistant for question-answering tasks. 
    # Use the following pieces of retrieved context to answer the question. 
    # If you don't know the answer, just say that you don't know. 
    # Answer in Korean.
        """You are an assistant for question-answering tasks, specifically focused on providing information related to academic papers. 
            Use the following pieces of retrieved context to answer the question. 
            If the question is unrelated to academic papers, or if the context does not provide sufficient information, politely respond that this is beyond your scope.
            Answer in Korean.

        #Previous Chat History:
        {chat_history}

        #Question: 
        {question} 

        #Context: 
        {context} 

        #Answer:"""
    )

    # Step 6: 언어모델(LLM) 생성
    llm = ChatOpenAI(model_name="gpt-4o-mini", temperature=0)

    # Step 7: 체인 (Chain) 생성
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

    # 대화를 기록하는 RAG 체인 생성
    rag_with_history = RunnableWithMessageHistory(
        chain,
        get_session_history,  # 세션 기록을 가져오는 함수
        input_messages_key="question",  # 사용자의 질문이 템플릿 변수에 들어갈 key
        history_messages_key="chat_history",  # 기록 메시지의 키
    )

    answer = rag_with_history.invoke(
        # 질문 입력
        {"question": f"{question}"},
        # 세션 ID 기준으로 대화를 기록합니다.
        config={"configurable": {"session_id": f"{user_id}"}},
    )
    
    print(answer)

    return QueryResponse(answer=answer)


@app.post("/chatAI-2", response_model=QueryResponse)
async def ask_question(request: QueryRequest):
    global mapper, reverse_mapper, store
    paper_id = request.paper_id
    question = request.question
    user_id = f'{request.user_id}_{paper_id}'

    # Step 1: Check if paper is already downloaded
    paper_path = f"{PAPER_STORAGE_PATH}{paper_id}.pdf"

    
    

    # Step 2: Check if FAISS index for the paper exists
    index_file = f"{FAISS_INDEX_PATH}{paper_id}_index_ver_md"
    if not os.path.exists(index_file):
        if not os.path.exists(paper_path):
            # Download the paper PDF using the existing crawling function
            download_pdf(reverse_mapper[int(paper_id)], paper_path)

        # Step 3: Store the paper PDF in Elasticsearch
        # with open(paper_path, "rb") as f:
        #     pdf_content = f.read()
            # es.index(index=INDEX_NAME, id=paper_id, body={"pdf": pdf_content})
        
        
        # Create a new FAISS index
        # 단계 1: 문서 로드(Load Documents)
        docs = pymupdf4llm.to_markdown(paper_path)

        # markdown_splitter = MarkdownHeaderTextSplitter(
        #     headers_to_split_on=headers_to_split_on,
        #     strip_headers=False, # 헤더 제거 off
        # )

        # md_header_splits = markdown_splitter.split_text(markdown_document)

        # 단계 2: 문서 분할(Split Documents)
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=50)
        split_documents = text_splitter.split_documents(docs)

        # 단계 3: 임베딩(Embedding) 생성
        embeddings = OpenAIEmbeddings()

        # 단계 4: DB 생성(Create DB) 및 저장
        # 벡터스토어를 생성합니다.
        vectorstore = FAISS.from_documents(documents=split_documents, embedding=embeddings)

        # 단계 5: Save index to disk
        # with open(index_file, "wb") as f:
        #     pickle.dump(vectorstore, f)
        vectorstore.save_local(index_file)
    else:
        # Load existing FAISS index
        # with open(index_file, "rb") as f:
        #     vectorstore = pickle.load(f)
        embeddings = OpenAIEmbeddings()
        vectorstore = FAISS.load_local(index_file, embeddings, allow_dangerous_deserialization=True)

    # Step 4: 검색기(Retriever) 생성
    # 문서에 포함되어 있는 정보를 검색하고 생성합니다.
    retriever = vectorstore.as_retriever()

    # Step 5: 프롬프트 생성(Create Prompt)
    prompt = PromptTemplate.from_template(
    #     """You are an assistant for question-answering tasks. 
    # Use the following pieces of retrieved context to answer the question. 
    # If you don't know the answer, just say that you don't know. 
    # Answer in Korean.
        """You are an assistant for question-answering tasks, specifically focused on providing information related to academic papers. 
            Use the following pieces of retrieved context to answer the question. 
            If the question is unrelated to academic papers, or if the context does not provide sufficient information, politely respond that this is beyond your scope.
            Answer in Korean.

        #Previous Chat History:
        {chat_history}

        #Question: 
        {question} 

        #Context: 
        {context} 

        #Answer:"""
    )

    # Step 6: 언어모델(LLM) 생성
    llm = ChatOpenAI(model_name="gpt-4o-mini", temperature=0)

    # Step 7: 체인 (Chain) 생성
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

    # 대화를 기록하는 RAG 체인 생성
    rag_with_history = RunnableWithMessageHistory(
        chain,
        get_session_history,  # 세션 기록을 가져오는 함수
        input_messages_key="question",  # 사용자의 질문이 템플릿 변수에 들어갈 key
        history_messages_key="chat_history",  # 기록 메시지의 키
    )

    answer = rag_with_history.invoke(
        # 질문 입력
        {"question": f"{question}"},
        # 세션 ID 기준으로 대화를 기록합니다.
        config={"configurable": {"session_id": f"{user_id}"}},
    )
    
    print(answer)

    return QueryResponse(answer=answer)

# 세션 ID를 기반으로 세션 기록을 가져오는 함수
def get_session_history(session_ids):
    print(f"[대화 세션ID]: {session_ids}")
    if session_ids not in store:
        store[session_ids] = ChatMessageHistory()
    print(store[session_ids])
    return store[session_ids]

def main():
    uvicorn.run("app:app", host="0.0.0.0", port=7777, reload=True)



if __name__ == "__main__":
    try:
        # 기존 코드 실행
        main()  # 주 실행 코드
    except Exception as e:
        print(f"오류 발생: {e}")
        import traceback
        traceback.print_exc()
