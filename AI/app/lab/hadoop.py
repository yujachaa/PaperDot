from collections import defaultdict
from hdfs import InsecureClient
import numpy as np

def extract_tfidf_from_hdfs(hdfs_path):
    client = InsecureClient('http://localhost:9870', user='hadoop')
    tfidf_results = []

    with client.read(hdfs_path) as reader:
        for line in reader:
            line = line.decode('utf-8')
            doc_id, word, tfidf = line.strip().split('\t')
            tfidf_results.append((doc_id, word, float(tfidf)))

    return tfidf_results

def calculate_cosine_similarity(tfidf_results):
    # 문서별 TF-IDF 저장
    doc_tfidf = defaultdict(dict)
    
    for doc_id, word, tfidf in tfidf_results:
        doc_tfidf[doc_id][word] = tfidf

    # 모든 문서에서 사용된 단어 목록
    all_words = set()
    for word_dict in doc_tfidf.values():
        all_words.update(word_dict.keys())

    # 문서 ID 리스트
    doc_ids = list(doc_tfidf.keys())
    similarity_matrix = np.zeros((len(doc_ids), len(doc_ids)))

    for i in range(len(doc_ids)):
        for j in range(i, len(doc_ids)):
            # TF-IDF 벡터 생성 (모든 단어를 기준으로)
            vector_a = np.array([doc_tfidf[doc_ids[i]].get(word, 0) for word in all_words])
            vector_b = np.array([doc_tfidf[doc_ids[j]].get(word, 0) for word in all_words])
            
            # 코사인 유사도 계산
            norm_a = np.linalg.norm(vector_a)
            norm_b = np.linalg.norm(vector_b)

            if norm_a > 0 and norm_b > 0:
                cosine_similarity = np.dot(vector_a, vector_b) / (norm_a * norm_b)
            else:
                cosine_similarity = 0  # 벡터가 모두 0일 경우

            similarity_matrix[i][j] = cosine_similarity
            similarity_matrix[j][i] = cosine_similarity  # 대칭행렬

    return doc_ids, similarity_matrix

def main():
    hdfs_path = "/user/hadoop/output/tfidf_results/part-00000"
    tfidf_results = extract_tfidf_from_hdfs(hdfs_path)
    doc_ids, similarity_matrix = calculate_cosine_similarity(tfidf_results)

    # 유사도 출력
    for i in range(len(doc_ids)):
        for j in range(i + 1, len(doc_ids)):
            print(f"문서 {doc_ids[i]}와 문서 {doc_ids[j]}의 유사도: {similarity_matrix[i][j]}")

if __name__ == "__main__":
    main()
