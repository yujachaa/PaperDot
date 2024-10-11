import requests
import json

def test_summary_api():
    url = "http://localhost:3333/summary"
    paper_id = "7000"  # 테스트할 논문 ID (적절한 ID로 변경 필요)
    gen_flag = True  # `overview` 필드가 없는 경우 새로 생성하려면 True

    params = {
        "paper_id": paper_id,
        "gen": gen_flag
    }

    try:
        response = requests.get(url, params=params)
        response.raise_for_status()  # HTTP 에러가 있을 경우 예외 발생
        
        # 응답 내용 출력
        results = response.json()
        print(json.dumps(results, indent=4, ensure_ascii=False))

    except requests.exceptions.RequestException as e:
        print(f"API 요청 중 오류 발생: {e}")

if __name__ == "__main__":
    test_summary_api()