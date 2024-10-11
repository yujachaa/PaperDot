import os
import random
import json
import torch
import pandas as pd
import numpy as np

from konlpy.tag import Okt
from gensim.models.doc2vec import TaggedDocument, Doc2Vec
from sklearn.cluster import KMeans
import faiss

from tqdm import tqdm
from konlpy import jvm

# 랜덤 시드 설정
def seed_everything(seed):
    torch.manual_seed(seed) #torch를 거치는 모든 난수들의 생성순서를 고정한다
    torch.cuda.manual_seed(seed) #cuda를 사용하는 메소드들의 난수시드는 따로 고정해줘야한다 
    torch.cuda.manual_seed_all(seed)  # if use multi-GPU
    torch.backends.cudnn.deterministic = True #딥러닝에 특화된 CuDNN의 난수시드도 고정 
    torch.backends.cudnn.benchmark = False
    torch.use_deterministic_algorithms(True)
    np.random.seed(seed) #numpy를 사용할 경우 고정
    random.seed(seed) #파이썬 자체 모듈 random 모듈의 시드 고정
    os.environ["PYTHONHASHSEED"] = str(seed)
    os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"
seed_everything(42)


# 0-1. 단일 데이터 로드
def load_data(file_path):
    df = pd.read_json(file_path, lines=True) # 여러 줄의 JSON 파일일 경우
    return df

# 0-2. 세트 데이터 로드
def load_data_from_directory(directory_path):
    raw_set = []
    for filename in os.listdir(directory_path):
        if filename.endswith('.json'):
            file_path = os.path.join(directory_path, filename)
            with open(file_path, 'r', encoding='utf-8') as f:
                try:
                    # 파일 내용을 읽고 JSON 객체로 변환
                    data = json.loads(f.read())
                    raw_set.append(data)
                except json.JSONDecodeError as e:
                    print(f"Error reading {file_path}: {e}")
    
    # combined_df = pd.concat(raw_set, ignore_index=True)  # 모든 데이터를 하나의 DataFrame으로 결합
    combined_df = pd.DataFrame(raw_set)
    return combined_df

# 1. Transform Words-Tag Pair (words, Tag)
def tokenize_and_tag(df, tokenizer, column_name='abstract'):
    okt = Okt()
    documents = []

    for index, row in tqdm(df.iterrows(), total=len(df)):
        contents = row['title'].get('ko', '')
        contents += row['title'].get('en', '')
        contents += row['authors']
        contents += row['journal'].get('ko', '')
        contents += row['journal'].get('en', '')
        contents += '저자: ' + row['year']
        contents += row['abstract'].get('ko', '')
        contents += row['abstract'].get('en', '')
        contents += row['keywords'].get('en', '')

        for section in row['body_text']:
            if 'text' in section:
                contents += section.get('text', '')[0]

        # words = okt.nouns(contents)  # 문장을 명사로 토큰화
        words = okt.morphs(contents)

        documents.append(TaggedDocument(words, [row['doc_id']]))  # doc_id를 태그로 사용
        

    return documents

# 2. Using the gensim library (doc2vec)
def train_doc2vec(documents, vector_size=300, window=5, min_count=2, epochs=1000):
    # model = Doc2Vec(vector_size=300, alpha=0.025, min_alpha=0.025, workers=8, window=8)
    model = Doc2Vec(vector_size=vector_size, window=window, min_count=min_count, workers=4, epochs=epochs, seed=42)
    model.build_vocab(documents)
    model.train(documents, total_examples=model.corpus_count, epochs=model.epochs)
    return model

# 3. 유사도 계산
def compute_similarity(model, query, top_n=5):
    okt = Okt()
    tokenized_query = okt.morphs(query)
    inferred_vector = model.infer_vector(tokenized_query)
    similar_docs = model.dv.most_similar([inferred_vector], topn=top_n)
    print(tokenized_query)
    return similar_docs

# 절취선@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

# (서비스) 4. 모델 (캐시 or 영구) 저장
def save_model(model, model_path='doc2vec_model'):
    model.save(model_path)

# (서비스) 5. 모델 load
def load_model(model_path='doc2vec_model'):
    if os.path.exists(model_path):
        model = Doc2Vec.load(model_path)
        return model
    else:
        raise FileNotFoundError(f"Model file not found at {model_path}")

# (서비스) 6. preTrained Model 유사도 계산 테스트
def test_pretrained_model(model, query):
    similar_docs = compute_similarity(model, query)
    return similar_docs

# 실행 예시
if __name__ == '__main__':
    # JSON 파일들이 있는 디렉토리 경로
    jvm.init_jvm()
    directory_path = './json_files/'
    
    # 데이터 로드
    df = load_data_from_directory(directory_path)

    # 토큰화 및 태깅
    documents = tokenize_and_tag(df, Okt())

    # Doc2Vec 모델 학습
    doc2vec_model = train_doc2vec(documents)

    # 모델 저장
    save_model(doc2vec_model)

    # 유사도 테스트
    query = "이동현상 및 식품공정"
    model = load_model()
    result = test_pretrained_model(model, query)
    print(result)