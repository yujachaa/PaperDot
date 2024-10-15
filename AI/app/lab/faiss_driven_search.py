import faiss
import numpy as np

# 예시 논문 벡터 (50000개의 논문에 대한 벡터를 사전에 생성)
document_vectors = np.random.rand(50000, 512).astype('float32')  # 512 차원 벡터

# FAISS 인덱스 생성 (L2 거리 기준)
index = faiss.IndexFlatL2(512)  # 벡터 차원 크기를 맞춰줘야 함
index.add(document_vectors)     # 논문 벡터 추가

# 질의 벡터 생성 (512 차원)
query_vector = np.random.rand(1, 512).astype('float32')

# 유사도 검색 (상위 5개 결과)
k = 5
distances, indices = index.search(query_vector, k)

# 결과 출력
print("Nearest documents:", indices)
print("Distances:", distances)
