import requests

# 서버 주소와 엔드포인트 설정
url = "http://localhost:7777/chatAI"

# 요청 데이터 생성
request_data = {
    "paper_id": "2",
    "question": "논문의 실험 방법을 설명해줘",
    "user_id": "1"
}

# POST 요청 보내기
response = requests.post(url, json=request_data)

# 응답 처리
if response.status_code == 200:
    print("응답 성공:")
    print(response.json())
else:
    print(f"응답 실패, 상태 코드: {response.status_code}")
    print(response.text)