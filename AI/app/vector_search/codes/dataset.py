# dataset.py

import os
import json
import glob
import re
from torch.utils.data import Dataset
from transformers import AutoTokenizer
from konlpy.tag import Mecab

class PaperDataset(Dataset):
    def __init__(self, data_dir, tokenizer, mecab):
        self.data_dir = data_dir
        # 하위 디렉토리의 모든 JSON 파일 찾기
        self.file_list = glob.glob(os.path.join(data_dir, '**', '*.json'), recursive=True)
        self.tokenizer = tokenizer
        self.mecab = mecab

    def __len__(self):
        return len(self.file_list)

    def __getitem__(self, idx):
        with open(self.file_list[idx], 'r', encoding='utf-8') as f:
            row = json.load(f)
        
        # 데이터에서 필요한 정보 추출
        contents = ''
        contents += row['title'].get('ko', '')  # 한국어 제목
        contents += row['title'].get('en', '')  # 영어 제목

        if 'authors' in row:
            contents += '저자: ' + row['authors']  # 저자
        contents += row['journal'].get('ko', '')  # 한국어 저널
        contents += row['journal'].get('en', '')  # 영어 저널
        contents += '연도: ' + str(row.get('year', ''))  # 연도

        if 'abstract' in row:
            contents += row['abstract'].get('ko', '')  # 한국어 초록
            contents += row['abstract'].get('en', '')  # 영어 초록

        if 'keywords' in row:
            contents += row['keywords'].get('en', '')

        # 본문 텍스트 추출
        if 'body_text' in row:
            for section in row['body_text']:
                if 'text' in section:
                    contents += section.get('text', '')[0]

        # 텍스트 전처리
        preprocessed_contents = self._preprocess_text(contents)
        inputs = self.tokenizer(preprocessed_contents, truncation=True, padding='max_length', max_length=512, return_tensors='pt')
        
        return {key: val.squeeze(0) for key, val in inputs.items()}

    def _preprocess_text(self, text):
        # 텍스트 정제(특수 문자 제거 등) 추가
        text = re.sub(r'[^가-힣0-9a-zA-Z\s]', '', text)  # 한글, 숫자, 영문 및 공백만 남기기
        tokens = self.mecab.morphs(text)
        return ' '.join(tokens)
