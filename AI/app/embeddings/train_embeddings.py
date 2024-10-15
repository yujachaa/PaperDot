# train_embeddings.py

from sentence_transformers import SentenceTransformer
import torch
import json

# 임베딩 모델 불러오기 (SBERT)
model = SentenceTransformer('paraphrase-MiniLM-L6-v2')

# 논문 데이터를 불러와 학습
def load_data(file_path):
    with open(file_path, 'r') as f:
        papers = json.load(f)
    return [paper['content'] for paper in papers]  # 논문 내용 추출

# 임베딩 생성
def train_embeddings(data):
    embeddings = model.encode(data, convert_to_tensor=True)
    torch.save(embeddings, 'embedding_model.pth')  # 임베딩을 저장

if __name__ == "__main__":
    data = load_data('papers.json')  # 논문 데이터 로드
    train_embeddings(data)
    print("임베딩 저장 완료")
