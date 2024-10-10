#!/usr/bin/env python3

import json
import re
import sys
from konlpy.tag import Hannanum

hannanum = Hannanum()

def is_valid_word(word):
    """한글과 영어로만 이루어진 단어인지 체크하는 함수"""
    return bool(re.match(r'^[가-힣a-zA-Z]+$', word))

def chunk_text(text, size=10000):
    """주어진 텍스트를 지정된 크기로 쪼개는 함수"""
    return [text[i:i + size] for i in range(0, len(text), size)]

def mapper(_, line):
    # 각 라인이 JSON 문서라고 가정
    try:
        doc = json.loads(line)
    except json.JSONDecodeError:
        print("Error decoding JSON: Invalid JSON format", file=sys.stderr)
        return

    doc_id = doc["doc_id"]

    # title, abstract, body_text 텍스트를 결합
    text_parts = [doc["title"]["ko"], doc["abstract"]["ko"]]
    
    for section in doc.get("body_text", []):
        if 'text' in section:
            text_parts.extend(section["text"])

    # 텍스트를 소문자로 변환
    text = ' '.join(text_parts).lower()

    # 텍스트를 10,000자씩 쪼갬
    chunks = chunk_text(text)

    # 각 청크에 대해 명사 추출
    for chunk in chunks:
        words = hannanum.nouns(chunk)

        # 각 단어에 대해 (단어, 문서 ID) 출력
        for word in words:
            if is_valid_word(word):
                print(f'{word}\t{doc_id}')

if __name__ == "__main__":
    json_data = sys.stdin.read()
    mapper(None, json_data)
