import os
import pickle
import re


current_dir = os.path.dirname(os.path.abspath(__file__))

# 피클 파일 저장 경로 설정
LOAD_PICKLE = os.path.join(current_dir, "../models/paper_similarities_partial.pkl")
PICKLE_FILE = os.path.join(current_dir, "../../vector_search/models/doc_id_index_mapping.pkl")

index = 1
doc_id_index_mapping = {}

def load_pickle_data(pickle_file):
    """
    피클 파일에서 데이터를 로드합니다.
    """
    if not os.path.exists(pickle_file):
        raise FileNotFoundError(f"피클 파일 {pickle_file}을 찾을 수 없습니다.")
    
    with open(pickle_file, 'rb') as f:
        data = pickle.load(f)
    return data

def generate_index_mapping(data):
    """
    데이터를 순회하면서 doc_id 별로 index 값을 매핑합니다.
    """
    global index
    global doc_id_index_mapping

    for record in data:
        doc_id = record.get('doc_id')
        if not doc_id:
            continue  # doc_id가 없는 경우 건너뜁니다.

        if doc_id not in doc_id_index_mapping:
            doc_id_index_mapping[doc_id] = index
            index += 1

    return doc_id_index_mapping

def save_mapping_to_pickle(mapping, pickle_file):
    """
    doc_id와 index 매핑을 피클 파일로 저장합니다.
    """
    with open(pickle_file, 'wb') as f:
        pickle.dump(mapping, f)
    print(f"doc_id와 index 매핑이 {pickle_file}에 저장되었습니다.")

def main():
    # 피클 파일에서 데이터 로드
    print("피클 파일에서 데이터를 로드하는 중...")
    data = load_pickle_data(LOAD_PICKLE)
    print(f"총 {len(data)}개의 논문 데이터를 로드했습니다.")
    
    # doc_id와 index 매핑 생성
    print("doc_id 별 index 매핑 생성 중...")
    doc_id_index_mapping = generate_index_mapping(data)
    
    # 매핑을 피클 파일로 저장
    print("매핑을 피클 파일로 저장하는 중...")
    save_mapping_to_pickle(doc_id_index_mapping, PICKLE_FILE)

if __name__ == "__main__":
    main()
