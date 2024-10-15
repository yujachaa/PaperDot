# api_server.py

from fastapi import FastAPI, Request
from embeddings.infer_embeddings import get_embedding
from search.faiss_indexer import search_faiss_index
import torch

app = FastAPI()

# 질의에 대한 임베딩 생성 및 FAISS 검색
@app.post("/search")
async def search_papers(request: Request):
    body = await request.json()
    query = body['query']
    
    # 질의 벡터화
    query_embedding = get_embedding(query).unsqueeze(0)
    
    # FAISS 검색
    distances, indices = search_faiss_index(query_embedding)
    
    return {"indices": indices.tolist(), "distances": distances.tolist()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
