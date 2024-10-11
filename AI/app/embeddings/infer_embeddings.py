# infer_embeddings.py

from sentence_transformers import SentenceTransformer
import torch

# 임베딩 모델 불러오기
model = SentenceTransformer('paraphrase-MiniLM-L6-v2')

# 임베딩 추론 함수
def get_embedding(query):
    return model.encode(query, convert_to_tensor=True)

# 예시
if __name__ == "__main__":
    query = "논문의 주제를 설명해 주세요"
    embedding = get_embedding(query)
    print("추론된 임베딩:", embedding)
