#!/usr/bin/env python3

import math
import sys
from collections import defaultdict

def calculate_tfidf(doc_word_count, total_docs):
    tfidf_results = []

    # 문서별로 TF-IDF 계산
    for word, doc_counts in doc_word_count.items():
        for doc_id, count in doc_counts.items():
            tf = count / sum(doc_counts.values())  # 단어 빈도 (TF)
            idf = math.log(total_docs / len(doc_counts))  # 역문서 빈도 (IDF)
            tf_idf = tf * idf
            tfidf_results.append(f'{doc_id}\t{word}\t{tf_idf}')

    return tfidf_results

def reducer():
    doc_word_count = defaultdict(lambda: defaultdict(int))
    total_docs = 0

    # 표준 입력으로부터 데이터 읽기
    for line in sys.stdin:
        word, doc_id = line.strip().split('\t')
        doc_word_count[word][doc_id] += 1
        total_docs += 1

    # 각 문서의 TF-IDF 계산
    tfidf_results = calculate_tfidf(doc_word_count, total_docs)

    # 결과 출력
    for result in tfidf_results:
        print(result)

if __name__ == "__main__":
    reducer()
#!/usr/bin/env python3

import math
import sys
from collections import defaultdict

def calculate_tfidf(doc_word_count, total_docs):
    tfidf_results = []

    # 문서별로 TF-IDF 계산
    for word, doc_counts in doc_word_count.items():
        for doc_id, count in doc_counts.items():
            tf = count / sum(doc_counts.values())  # 단어 빈도 (TF)
            idf = math.log(total_docs / len(doc_counts))  # 역문서 빈도 (IDF)
            tf_idf = tf * idf
            tfidf_results.append(f'{doc_id}\t{word}\t{tf_idf}')

    return tfidf_results

def reducer():
    doc_word_count = defaultdict(lambda: defaultdict(int))
    total_docs = 0

    # 표준 입력으로부터 데이터 읽기
    for line in sys.stdin:
        word, doc_id = line.strip().split('\t')
        doc_word_count[word][doc_id] += 1
        total_docs += 1

    # 각 문서의 TF-IDF 계산
    tfidf_results = calculate_tfidf(doc_word_count, total_docs)

    # 결과 출력
    for result in tfidf_results:
        print(result)

if __name__ == "__main__":
    reducer()

