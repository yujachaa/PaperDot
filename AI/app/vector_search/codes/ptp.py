import os
import json
import glob
import pickle

class PaperDataset:
    def __init__(self, data_dir, pickle_file='ordering_mapping.pkl'):
        current_dir = os.path.dirname(os.path.abspath(__file__))
        pickle_file = os.path.join(current_dir, "../models/ordering_mapping.pkl")
        
        self.data_dir = data_dir
        self.pickle_file = pickle_file

        # 피클 파일이 존재하면 불러오기, 없으면 생성하고 저장
        if os.path.exists(self.pickle_file):
            print(f"Loading ordering_mapping from {self.pickle_file}")
            with open(self.pickle_file, 'rb') as f:
                self.ordering_mapping = pickle.load(f)
        else:
            print("Creating ordering_mapping and saving to pickle.")
            self.file_list = glob.glob(os.path.join(data_dir, '**', '*.json'), recursive=True)
            self.ordering_mapping = self._create_ordering_mapping(self.file_list)
            with open(self.pickle_file, 'wb') as f:
                pickle.dump(self.ordering_mapping, f)
            print(f"ordering_mapping saved to {self.pickle_file}")

    def _create_ordering_mapping(self, file_list):
        """파일 목록에서 doc_id와 파일 경로를 매핑하여 딕셔너리 생성"""
        ordering_mapping = {}
        for file_path in file_list:
            with open(file_path, 'r', encoding='utf-8') as f:
                row = json.load(f)
                doc_id = row['doc_id']
                ordering_mapping[doc_id] = file_path
        return ordering_mapping

def main():
    data_dir = 'path/to/data'  # 데이터 디렉토리 경로 설정

    # PaperDataset 클래스 초기화 (ordering_mapping 추출 및 피클 저장)
    dataset = PaperDataset(data_dir)

if __name__ == "__main__":
    main()
