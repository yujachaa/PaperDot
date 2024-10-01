import os
import json
import numpy as np
import torch
from torch.utils.data import Dataset, DataLoader
from transformers import AutoTokenizer, AutoModel
from torch.amp import autocast, GradScaler
from konlpy.tag import Mecab, Okt
from tqdm import tqdm
import glob
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re
import pickle


# os.environ["CUDA_DEVICE_ORDER"]="PCI_BUS_ID"
# os.environ["CUDA_VISIBLE_DEVICES"]="9"

current_dir = os.path.dirname(os.path.abspath(__file__))

# KoNLPy의 Okt(Open Korean Text) 초기화
okt = Okt()

CATEGORY_MAPPING = {
    '../cutting/category1/': 'Category 1',
    '../cutting/category2/': 'Category 2',
    # 필요에 따라 다른 경로와 카테고리를 추가
}

def get_category_from_path(file_path):
    """
    파일 경로를 기반으로 대분류 폴더명을 카테고리로 반환하는 함수.
    예: 'cutting/1-국어/...' -> '1-국어'
    """
    # 경로에서 대분류 폴더명을 추출
    category = file_path.split('/')[2]  # 'cutting/대분류/파일명' 구조에서 대분류 추출
    return category if category else "Unknown"


def load_papers_from_directory(directory):
    raw_set = []
    
    # os.walk를 사용하여 재귀적으로 하위 디렉토리까지 탐색
    all_files = []
    for root, dirs, files in os.walk(directory):
        for filename in files:
            if filename.endswith('.json'):  # .json 파일만 선택
                file_path = os.path.join(root, filename)  # 파일 경로 생성
                all_files.append(file_path)

    # tqdm을 사용하여 모든 파일을 순회하며 로드 진행 표시
    for file_path in tqdm(all_files, desc="Loading JSON files", unit="file"):
        with open(file_path, 'r', encoding='utf-8') as f:
            try:
                # 파일 내용을 읽고 JSON 객체로 변환
                data = json.load(f)
                # 논문에서 필요한 필드만 추출
                paper = extract_paper_info(data)
                category = get_category_from_path(file_path)
                paper['category'] = category
                raw_set.append({'original_json': data, 'processed': paper})  # 원본 JSON과 처리된 정보 둘 다 저장
            except json.JSONDecodeError as e:
                print(f"Error reading {file_path}: {e}")
    
    return raw_set

def extract_paper_info(data):
    # 논문 정보에서 필요한 부분을 추출하는 함수
    contents = ''
    
    # 제목
    contents += data['title'].get('ko', '')  # 한국어 제목
    contents += data['title'].get('en', '')  # 영어 제목
    
    # 저널 정보
    contents += data['journal'].get('ko', '')  # 한국어 저널
    contents += data['journal'].get('en', '')  # 영어 저널
    
    # 초록
    if 'abstract' in data:
        contents += data['abstract'].get('ko', '')  # 한국어 초록
        contents += data['abstract'].get('en', '')

    # 키워드
    if 'keywords' in data:
        contents += data['keywords'].get('en', '')
        keywords = data['keywords'].get('en', '')
    
    # 본문 텍스트 추출 (필요한 경우)
    if 'body_text' in data:
        for section in data['body_text']:
            if 'text' in section:
                contents += section.get('text', '')[0]
    
    # 텍스트 전처리
    preprocessed_contents = preprocess_korean_text(contents)

    doc_id = data['doc_id']
    
    return {'doc_id': doc_id, 'content': preprocessed_contents}

def preprocess_korean_text(text):
    # 형태소 분석 및 명사 추출
    nouns = okt.nouns(text)
    return ' '.join(nouns)

def load_or_process_data(directory, pickle_file):
    # 피클 파일이 존재하는지 확인
    if os.path.exists(pickle_file):
        print(f"피클 파일 {pickle_file}에서 데이터를 불러옵니다...")
        with open(pickle_file, 'rb') as f:
            papers = pickle.load(f)
    else:
        # 피클 파일이 없을 경우, 데이터를 디렉토리에서 로딩
        print(f"데이터를 {directory}에서 불러옵니다...")
        papers = load_papers_from_directory(directory)
        print(f"데이터를 {pickle_file}에 저장합니다...")
        with open(pickle_file, 'wb') as f:
            pickle.dump(papers, f)
    return papers

def preprocess_papers(contents):
    # TF-IDF 벡터화를 수행
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(contents)
    return tfidf_matrix, vectorizer

def calculate_similarity(tfidf_matrix):
    # 코사인 유사도를 계산
    return cosine_similarity(tfidf_matrix)

def find_similar_papers(similarity_matrix, papers, top_k, threshold=0.2):
    # 각 논문에 대해 유사한 논문 인덱스를 찾음
    similar_papers = []
    papers_above_threshold = []

    for idx, similarities in enumerate(similarity_matrix):
        # 자신을 제외한 가장 유사한 논문 top_k개를 찾음
        similar_idxs = similarities.argsort()[-(top_k+1):-1][::-1]  # 자신을 제외한 top_k개의 논문
        similar_doc_ids_with_scores = {papers[i]['processed']['doc_id']: similarities[i] for i in similar_idxs}  # doc_id를 키, 유사도를 값으로 사전 생성
        similar_papers.append(similar_doc_ids_with_scores)  # 사전 형태로 저장
    
        # 유사도가 0.2 이상인 논문 찾기
        threshold_idxs = [i for i, score in enumerate(similarities) if score >= threshold and i != idx]
        threshold_doc_ids_with_scores = {
            papers[i]['processed']['doc_id']: similarities[i] for i in threshold_idxs
        }
        papers_above_threshold.append(threshold_doc_ids_with_scores)  # 유사도 0.2 이상 논문 저장
    
    return similar_papers, papers_above_threshold

def extract_top_keywords(vectorizer, tfidf_matrix, top_n=5):
    # 각 문서에서 TF-IDF 값이 가장 높은 상위 top_n 단어 추출
    feature_names = vectorizer.get_feature_names_out()
    top_keywords_per_paper = []
    
    for row in tfidf_matrix:
        sorted_indices = row.toarray().argsort()[0, -top_n:][::-1]  # 상위 top_n 단어의 인덱스를 추출
        top_keywords = [feature_names[i] for i in sorted_indices]  # 상위 단어에 해당하는 단어명 추출
        top_keywords_per_paper.append(top_keywords)
    
    return top_keywords_per_paper

def main(top_k=5, top_n_keywords=10):  # top_k 인자를 추가하여 조정 가능
    
    paper_directory = os.path.join(current_dir, "../datas/")  # JSON 파일이 있는 디렉토리 경로
    pickle_file = os.path.join(current_dir, "../models/papers_data.pkl") # 피클 파일 이름
    output_file = os.path.join(current_dir, "../models/paper_similarities_partial.pkl") # 결과를 저장할 파일 이름
    
    print("논문 불러오는 중...")
    papers = load_or_process_data(paper_directory, pickle_file)
    
    print("논문 전처리 중...")
    contents = [paper['processed']['content'] for paper in papers]
    tfidf_matrix, vectorizer = preprocess_papers(contents)
    
    print("유사도 계산 중...")
    similarities = calculate_similarity(tfidf_matrix)
    similar_papers, papers_above_threshold = find_similar_papers(similarities, papers, top_k, threshold=0.2)
    
    # 각 문서별로 핵심 단어 추출
    print("핵심 단어 추출 중...")
    top_keywords_per_paper = extract_top_keywords(vectorizer, tfidf_matrix, top_n=top_n_keywords)

    # 논문별로 원본 JSON, doc_id, content, similar_papers를 묶어서 저장
    output_data = []
    for i, paper in enumerate(papers):
        output_data.append({
            'original_json': paper['original_json'],  # 원본 JSON 데이터 추가
            'category': paper['processed']['category'],
            'doc_id': paper['processed']['doc_id'],
            'content': paper['processed']['content'],
            'similar_papers': similar_papers[i],  # top_k 유사한 논문들
            'papers_above_threshold': papers_above_threshold[i],  # 유사도가 0.2 이상인 논문들
            'top_keywords': top_keywords_per_paper[i],  # 각 문서의 핵심 단어
            'vectorizer': vectorizer
        })

    print("결과 저장 중...")
    with open(output_file, 'wb') as f:
        pickle.dump(output_data, f)

    print(f"결과가 {output_file}에 저장되었습니다.")

    
def load_and_print_results(pickle_file):
    if os.path.exists(pickle_file):
        print(f"피클 파일 {pickle_file}에서 데이터를 불러옵니다...")
        with open(pickle_file, 'rb') as f:
            results = pickle.load(f)
        
        # 불러온 결과를 출력
        for i, paper in enumerate(results):
            print(f"논문 ID: {paper['doc_id']}")
            print(f"내용: {paper['content']}")
            print(f"유사한 논문 인덱스: {paper['similar_papers']}")
            print("="*80)
            if i == 5:
                break
    else:
        print(f"피클 파일 {pickle_file}을 찾을 수 없습니다.")

if __name__ == "__main__":
    top_k = int(input("Enter the number of top similar papers to retrieve: "))  # 사용자가 top_k 값을 입력
    main(top_k)
    
    # 저장된 피클 파일 불러와 출력
    
    output_file = os.path.join(current_dir, "../models/paper_similarities_partial.pkl")  # 저장된 결과 파일 이름
    load_and_print_results(output_file)