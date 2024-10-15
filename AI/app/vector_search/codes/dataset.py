# dataset.py
#version 1->2시작

import os
import json
import glob
import re
import pickle
from torch.utils.data import Dataset
from transformers import AutoTokenizer
from konlpy.tag import Mecab


class PaperDataset(Dataset):
    def __init__(self, data_dir, tokenizer, mecab):
        current_dir = os.path.dirname(os.path.abspath(__file__))
        pickle_file = os.path.join(current_dir, "../models/ordering_mapping.pkl")
        self.data_dir = data_dir
        self.pickle_file = pickle_file
        self.tokenizer = tokenizer
        self.mecab = mecab

        # 피클 파일이 존재하면 ordering_mapping을 불러오기, 없으면 생성하여 피클로 저장
        if os.path.exists(self.pickle_file):
            print(f"Loading ordering_mapping from {self.pickle_file}")
            with open(self.pickle_file, 'rb') as f:
                self.ordering_mapping = pickle.load(f)
        else:
            print(f"Creating ordering_mapping and saving to {self.pickle_file}")
            file_list = glob.glob(os.path.join(self.data_dir, '**', '*.json'), recursive=True)
            self.ordering_mapping = self._create_ordering_mapping(file_list)
            with open(self.pickle_file, 'wb') as f:
                pickle.dump(self.ordering_mapping, f)

    def __len__(self):
        return len(self.ordering_mapping)

    def __getitem__(self, idx):
        # 인덱스를 통해 doc_id를 가져오고, doc_id로 파일 경로를 찾기
        doc_id = list(self.ordering_mapping.keys())[idx]
        file_path = self.ordering_mapping[doc_id]

        with open(file_path, 'r', encoding='utf-8') as f:
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

    def _create_ordering_mapping(self, file_list):
        """파일 목록에서 doc_id와 파일 경로를 매핑하여 딕셔너리 생성"""
        ordering_mapping = {}
        for file_path in file_list:
            with open(file_path, 'r', encoding='utf-8') as f:
                row = json.load(f)
                doc_id = row['doc_id']
                ordering_mapping[doc_id] = file_path
        return ordering_mapping

    def _preprocess_text(self, text):
        # 텍스트 정제(특수 문자 제거 등) 추가
        text = re.sub(r'[^가-힣0-9a-zA-Z\s]', '', text)  # 한글, 숫자, 영문 및 공백만 남기기
        tokens = self.mecab.morphs(text)
        return ' '.join(tokens)