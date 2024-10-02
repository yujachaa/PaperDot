# embedding.py

import os
import numpy as np
import torch
from torch.utils.data import DataLoader
from transformers import AutoTokenizer, AutoModel
from torch.amp import autocast
from konlpy.tag import Mecab
from sklearn.metrics.pairwise import cosine_similarity
from tqdm import tqdm
import re
import json
import subprocess

from vector_search.codes.dataset import PaperDataset  # dataset.py에서 가져옴

def get_mecabrc_path():
    try:
        sysconfdir = subprocess.check_output(['mecab-config', '--sysconfdir']).decode('utf-8').strip()
        mecabrc_path = f"{sysconfdir}/mecabrc"
        return mecabrc_path
    except subprocess.CalledProcessError:
        raise FileNotFoundError("mecabrc 경로를 찾을 수 없습니다. Mecab이 제대로 설치되었는지 확인하세요.")

class LargeScaleKoreanPaperEmbedding:
    def __init__(self, data_dir):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.tokenizer = AutoTokenizer.from_pretrained("snunlp/KR-SBERT-V40K-klueNLI-augSTS")
        self.model = AutoModel.from_pretrained("snunlp/KR-SBERT-V40K-klueNLI-augSTS").to(self.device)
        dic_path = get_mecabrc_path()
        self.mecab = Mecab(dicpath=dic_path)
        self.data_dir = data_dir
        self.embeddings = None

        # PaperDataset 인스턴스 생성
        self.dataset = PaperDataset(self.data_dir, self.tokenizer, self.mecab)

    def create_embeddings(self, batch_size=32):
        dataloader = DataLoader(self.dataset, batch_size=batch_size, shuffle=False, num_workers=4)

        self.model.eval()
        all_embeddings = []

        with torch.no_grad():
            for batch in tqdm(dataloader, desc="Processing papers"):
                batch = {k: v.to(self.device) for k, v in batch.items()}
                with autocast(device_type=self.device.type):
                    outputs = self.model(**batch)
                batch_embeddings = outputs.last_hidden_state.mean(dim=1).cpu().numpy()
                all_embeddings.extend(batch_embeddings)

        self.embeddings = np.array(all_embeddings)
        print(f"Created embeddings for {len(self.embeddings)} papers.")
        print(f"Total files: {len(self.dataset.file_list)}")  # 파일 수 출력

    def save_embeddings(self, file_path):
        np.save(file_path, self.embeddings)
        print(f"Saved embeddings to {file_path}")

    def load_embeddings(self, file_path):
        self.embeddings = np.load(file_path)
        print(f"Loaded embeddings from {file_path}")

    def search(self, query, top_k=5):
        if self.embeddings is None:
            raise ValueError("Embeddings not created or loaded. Call create_embeddings() or load_embeddings() first.")
    
        query_embedding = self._get_query_embedding(query)
        similarities = cosine_similarity(self.embeddings, query_embedding).squeeze()
        
        threshold = 0.5
        top_indices = np.where(similarities >= threshold)[0]
        
        if len(top_indices) == 0:
            top_indices = similarities.argsort()[-top_k:][::-1]
        else:
            sorted_indices = similarities[top_indices].argsort()[::-1]
            top_indices = top_indices[sorted_indices][:top_k]
    
        results = []
        for idx in top_indices:
            file_path = self.dataset.file_list[idx]
            with open(file_path, 'r', encoding='utf-8') as f:
                paper = json.load(f)
            results.append({'doc_id': paper.get('doc_id', idx), 'similarity': similarities[idx]})
    
        return results

    def _get_query_embedding(self, query):
        preprocessed_query = self._preprocess_text(query)
        inputs = self.tokenizer(preprocessed_query, return_tensors="pt", truncation=True, padding=True, max_length=512)
        inputs = {k: v.to(self.device) for k, v in inputs.items()}
        with torch.no_grad(), autocast(device_type=self.device.type):
            outputs = self.model(**inputs)
        return outputs.last_hidden_state.mean(dim=1).cpu().numpy()

    def _preprocess_text(self, text):
        text = re.sub(r'[^가-힣0-9a-zA-Z\s]', '', text)
        tokens = self.mecab.morphs(text)
        print(tokens)
        return ' '.join(tokens)