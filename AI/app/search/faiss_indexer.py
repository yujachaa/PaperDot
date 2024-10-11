# faiss_indexer.py

import faiss
import numpy as np
import torch

# FAISS 인덱스 생성 (L2 거리 기준)
def create_faiss_index(embeddings):
    d = embeddings.shape[1]  # 벡터 차원
    index = faiss.IndexFlatL2(d)  # L2 거리 사용
    index.add(embeddings.numpy())  # FAISS에 벡터 추가
    faiss.write_index(index, 'faiss_index.bin')
    return index

# FAISS 인덱스 로드 및 검색
def search_faiss_index(query_embedding, k=5):
    index = faiss.read_index('faiss_index.bin')
    distances, indices = index.search(query_embedding.numpy(), k)  # k개의 유사 문서 검색
    return distances, indices

# 임베딩 불러오기
embeddings = torch.load('embedding_model.pth')

# FAISS 인덱스 생성
if __name__ == "__main__":
    index = create_faiss_index(embeddings)
    print("FAISS 인덱스 생성 완료")
