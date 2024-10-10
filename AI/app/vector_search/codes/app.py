import os
import torch
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from vector_search.codes.paper_embedding import LargeScaleKoreanPaperEmbedding  # embedding.py에서 가져옴
from contextlib import asynccontextmanager
import uvicorn

current_dir = os.path.dirname(os.path.abspath(__file__))

# 임베딩 시스템 초기화
embedding_system = None
embedding_file_path = os.path.join(current_dir, "../models/paper_embeddings.npy")
random_access_file_path = os.path.join(current_dir, "../models/random_access_list.pkl")

# FastAPI 모델 정의
class QueryModel(BaseModel):
    query: str
    top_k: int = 100

# FastAPI lifespan event handler
@asynccontextmanager
async def lifespan(app: FastAPI):
    global embedding_system
    # 애플리케이션 시작 시 실행될 초기화 로직
    print("Initializing embedding system...")
    embedding_system = LargeScaleKoreanPaperEmbedding(os.path.join(current_dir, "../datas/"), random_access_file_path)
    if os.path.exists(embedding_file_path):
        embedding_system.load_embeddings(embedding_file_path)
    else:
        embedding_system.create_embeddings()
        embedding_system.save_embeddings(embedding_file_path)

    # lifespan에 진입 (애플리케이션 실행 중)
    yield

    # 애플리케이션 종료 시 실행될 정리 작업
    print("Shutting down...")

# FastAPI 인스턴스 생성, lifespan 이벤트 핸들러 사용
app = FastAPI(lifespan=lifespan)

@app.post("/search")
def search_papers(query_model: QueryModel):
    """
    검색 API 엔드포인트로, POST 요청으로 전달된 query에 대해 상위 top_k개의 결과를 반환.
    """
    results = embedding_system.search(query_model.query, top_k=query_model.top_k)
    return {"results": results}

def main():
    """
    편의성을 위한 main 함수. uvicorn을 사용해 FastAPI 애플리케이션을 실행.
    """
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)

if __name__ == "__main__":
    main()
