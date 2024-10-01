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
from dotenv import load_dotenv
import mysql.connector
from mysql.connector import Error

from elasticsearch import Elasticsearch, helpers


current_dir = os.path.dirname(os.path.abspath(__file__))

# .env 파일이 있는 경로 지정
env_path = os.path.join(current_dir, "../../config/.env")

# .env 파일 로드
load_dotenv(dotenv_path=env_path)


# Elasticsearch 설정
ES_HOST = os.getenv('ES_HOST')  # 예: 'localhost' 또는 'your-ec2-public-dns'
ES_PORT = os.getenv('ES_PORT')  # 기본 포트; 다를 경우 변경
ES_USER = os.getenv('ES_USER')  # 인증이 필요한 경우
ES_PASSWORD = os.getenv('ES_PASSWORD')  # 인증이 필요한 경우
ES_APIKEY = os.getenv('ES_APIKEY')
INDEX_NAME = 'papers'

# MySQL 연결 설정
MYSQL_HOST = os.getenv('MYSQL_HOST')
MYSQL_PORT = os.getenv('MYSQL_PORT')
MYSQL_USER = os.getenv('MYSQL_USER')
MYSQL_PASSWORD = os.getenv('MYSQL_PASSWORD')
MYSQL_DATABASE = os.getenv('MYSQL_DATABASE')

# 피클 파일 경로

PICKLE_FILE = os.path.join(current_dir, "../models/paper_similarities_partial.pkl")

index = 1

def load_pickle_data(pickle_file):
    """
    피클 파일에서 데이터를 로드합니다.
    """
    if not os.path.exists(pickle_file):
        raise FileNotFoundError(f"피클 파일 {pickle_file}을 찾을 수 없습니다.")
    
    with open(pickle_file, 'rb') as f:
        data = pickle.load(f)
    return data

def create_mysql_connection():
    """
    MySQL 데이터베이스에 연결합니다.
    """
    try:
        connection = mysql.connector.connect(
            host=MYSQL_HOST,
            user=MYSQL_USER,
            password=MYSQL_PASSWORD,
            database=MYSQL_DATABASE
        )
        if connection.is_connected():
            print("MySQL에 성공적으로 연결되었습니다.")
            return connection
    except Error as e:
        print(f"MySQL 연결 중 오류 발생: {e}")
        return None

def insert_paper_to_mysql(connection, category, index):
    """
    paper 테이블에 (id, bookmark_cnt, category) 값을 삽입합니다.
    """
    try:
        cursor = connection.cursor()
        print(f"Inserting paper with id: {index}, category: {category}")  # 로그로 id와 category 값 출력
        query = "INSERT INTO paper (id, bookmark_cnt, category) VALUES (%s, %s, %s)"
        cursor.execute(query, (index, 0, category))  # id를 포함하여 bookmark_cnt와 category 삽입
        connection.commit()
        print(f"paper 테이블에 값 삽입 완료: (id={index}, bookmark_cnt=0, category={category})")
    except Error as e:
        print(f"paper 테이블에 데이터 삽입 중 오류 발생: {e}")
    except AttributeError:
        print(f"category 값에서 숫자를 추출할 수 없습니다: {category}")

    
# Elasticsearch 클라이언트 생성
def create_es_client(host, port, user=None, password=None):
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


# Elasticsearch 인덱스 생성 및 매핑 정의
def create_index(es, index_name):
    """
    인덱스가 존재하지 않으면 매핑을 정의하여 생성합니다.
    """
    if es.indices.exists(index=index_name):
        print(f"인덱스 '{index_name}'가 이미 존재합니다.")
        return
    
    # 매핑 및 설정 정의
    mappings = {
        "settings": {
            "max_ngram_diff": 11,
            "analysis": {
                "tokenizer": {
                    "ngram_tokenizer": {
                        "type": "ngram",
                        "min_gram": 1,
                        "max_gram": 10,
                        "token_chars": [
                            "letter",
                            "digit"
                        ]
                    }
                },
                "analyzer": {
                    "ngram_analyzer": {
                        "type": "custom",
                        "tokenizer": "ngram_tokenizer",
                        "filter": [
                            "lowercase"
                        ]
                    }
                }
            }
        },
        "mappings": {
            "properties": {
                "doc_id": {"type": "keyword"},
                "category": {"type": "keyword"},
                "original_json": {
                    "properties": {
                        "title": {
                            "properties": {
                                "ko": {
                                    "type": "text",
                                    "analyzer": "ngram_analyzer"
                                },
                                "en": {
                                    "type": "text",
                                    "analyzer": "ngram_analyzer"
                                }
                            }
                        }
                    }
                },
                "content": {"type": "text"},
                "similar_papers": {
                    "type": "nested",
                    "properties": {
                        "doc_id": {"type": "keyword"},
                        "score": {"type": "float"}
                    }
                },
                "papers_above_threshold": {
                    "type": "nested",
                    "properties": {
                        "doc_id": {"type": "keyword"},
                        "score": {"type": "float"}
                    }
                },
                "top_keywords": {"type": "text"}
            }
        }
    }

    es.indices.create(index=index_name, body=mappings)
    print(f"인덱스 '{index_name}'가 매핑과 함께 생성되었습니다.")


def generate_actions(data, index_name, mysql_connection):
    """
    Elasticsearch에 삽입할 액션을 생성하고, MySQL의 paper 테이블에 (bookmark_cnt, category)를 삽입합니다.
    """
    global index
    for record in data:
        doc_id = record.get('doc_id')
        if not doc_id:
            continue  # doc_id가 없는 경우 건너뜁니다.

        category = record.get('category', '')
        # category의 첫 글자만 추출하여 정수로 변환
        if isinstance(category, str):
            # 첫 글자가 숫자인지 확인 후 변환
            category = int(re.match(r'\d+', category).group())
        else:
            category = 0  # 만약 문자열이 아니면 기본값 0을 사용하거나 다른 로직 적용

        # similar_papers, papers_above_threshold 필드를 딕셔너리에서 배열로 변환
        similar_papers_dict = record.get('similar_papers', {})
        similar_papers = [{'doc_id': k, 'score': v} for k, v in similar_papers_dict.items()]  # 배열로 변환

        papers_above_threshold_dict = record.get('papers_above_threshold', {})
        papers_above_threshold = [{'doc_id': k, 'score': v} for k, v in papers_above_threshold_dict.items()]  # 배열로 변환

        # top_keywords는 이미 리스트 형식이므로 그대로 사용
        top_keywords = record.get('top_keywords', [])
        
        action = {
            "_index": index_name,
            # "_id": doc_id,  # 고유 ID 설정
            "_id": index,  # Auto Increment Version
            "_source": {
                "doc_id": record.get('doc_id'),
                "category": category,
                "original_json": record.get('original_json', {}),
                "content": record.get('content', ''),
                "similar_papers": similar_papers,  # 배열로 저장된 유사 논문
                "papers_above_threshold": papers_above_threshold,  # 배열로 저장된 유사도 0.2 이상의 논문
                "top_keywords": top_keywords  # 리스트 그대로 저장
                # 필요에 따라 추가 필드 포함 가능
            }
        }

        # MySQL에 (bookmark_cnt=0, category) 삽입
        insert_paper_to_mysql(mysql_connection, category, index)
        yield action
        index += 1

def bulk_insert(es, actions, chunk_size=500):
    """
    데이터를 배치로 Elasticsearch에 삽입합니다.
    """
    helpers.bulk(es, actions, chunk_size=chunk_size, request_timeout=60)


def main():
    # 피클 파일에서 데이터 로드
    print("피클 파일에서 데이터를 로드하는 중...")
    data = load_pickle_data(PICKLE_FILE)
    print(f"총 {len(data)}개의 논문 데이터를 로드했습니다.")
    
    # Elasticsearch 연결
    print("Elasticsearch에 연결하는 중...")
    es = create_es_client(host=ES_HOST, port=ES_PORT, user=ES_USER, password=ES_PASSWORD)
    
    # MySQL 연결
    print("MySQL에 연결하는 중...")
    mysql_connection = create_mysql_connection()

    if mysql_connection is None:
        print("MySQL 연결 실패로 프로그램을 종료합니다.")
        return
    
    # 인덱스 생성 (매핑 포함)
    create_index(es, INDEX_NAME)
    
    # 액션 생성기 준비
    actions = generate_actions(data, INDEX_NAME, mysql_connection)
    
    # 데이터 삽입
    print("Elasticsearch에 데이터를 삽입하는 중...")
    try:
        bulk_insert(es, actions)
        print("데이터 삽입이 완료되었습니다.")
    except Exception as e:
        print(f"데이터 삽입 중 오류가 발생했습니다: {e}")
    
    # MySQL 연결 종료
    if mysql_connection.is_connected():
        mysql_connection.close()
        print("MySQL 연결을 종료합니다.")

if __name__ == "__main__":
    main()