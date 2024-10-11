# 📚 논문을 흥미롭게 `PaperDot.` (논문 요약 및 라디오 서비스)




### 🌟 서비스 주소
- 서비스의 실제 동작을 확인할 수 있는 [서비스 링크](https://j11b208.p.ssafy.io) 🌍
---

<h3 style="text-align: left;">주요 기능의 스크린샷을 통해 인터페이스와 사용 방법을 미리 확인하세요 📸</h1>
<table style="width: 100%; text-align: center;">
  <tr>
    <th>기능 이름</th>
    <th>데스크탑</th>
    <th>모바일 반응형</th>
    <th>다크모드</th>
  </tr>
  <tr>
    <td>라디오 채널</td>
    <td><img src="radio-web.jpg" alt="fitPose" width="200"/></td>
    <td><img src="radio-app.jpg" alt="fitDepth" width="200"/></td>
    <td><img src="radio-dark.jpg" alt="rain_28" width="200"/></td>
  </tr>
  <tr>
    <td>논문요약</td>
    <td><img src="summary-web.jpg" alt="rain_34" width="200"/></td>
    <td><img src="summary-app.jpg" alt="m3" width="200"/></td>
    <td><img src="summary-dark.jpg" alt="m3_2" width="200"/></td>
  </tr>
  <tr>
   <td>북마크별자리</td>
    <td><img src="star-web.jpg" alt="rain_34" width="200"/></td>
    <td><img src="star-dark.jpg" alt="m3" width="200"/></td>
  </tr>
</table>

이 서비스는 사용자가 `논문`을 `검색`하고 `요약`본을 확인하면서, `챗봇을 통해` `질문`할 수 있는 `논문 웹 서비스`입니다. `논문을 요약`해서 `읽어주는 라디오`와 `논문 간 연관도를 시각화`한 논문 `별자리 서비스` 등을 통해 논문을 흥미롭게 접할 수 있는 요소를 더했습니다. 이 README는 서비스의 기능과 설치 방법에 대해 안내합니다.

---



## 📝 문제 정의
- 사용자가 원하는 논문을 쉽고 빠르게 검색하고, 챗봇을 통해 필요한 정보를 효율적으로 얻는 것이 어려운 문제를 해결하기 위해 개발되었습니다. 연구자들이 필요한 논문을 찾고, 요약된 정보를 바탕으로 빠르게 이해할 수 있도록 돕습니다.

## 👥 팀원 소개

**팀명**: 곰국

<table>
  <tr>
    <td style="text-align: center; padding: 10px;">
      <img src="./docs_assets/LCH.jpg" alt="이찬호" height="150" width="150" style="border-radius: 50%;"/>
      <h4>이찬호</h4>
      <p><strong>역할:</strong> 팀장, INFRA</p>
      <p><strong>연락처:</strong> @navere.com</p>
      <p><strong>GIT:</strong> <a href="https://sangphilpark.github.io/about/" target="_blank">github.com/찬호</a></p>
    </td>
    <td style="text-align: center; padding: 10px;">
      <img src="./docs_assets/KSM.jpg" alt="권성민" height="150" width="150" style="border-radius: 50%;"/>
      <h4>권성민</h4>
      <p><strong>역할:</strong> FE / HLS </p>
      <p><strong>연락처:</strong> @gmail.com</p>
      <p><strong>GIT:</strong> <a href="https://sangphilpark.github.io/about/" target="_blank">github.com/성민</a></p>
    </td>
    <td style="text-align: center; padding: 10px;">
      <img src="./docs_assets/KMK.jpg" alt="김민경" height="150" width="150" style="border-radius: 50%;"/>
      <h4>김민경</h4>
      <p><strong>역할:</strong> BE</p>
      <p><strong>연락처:</strong> pagerank990@gmail.com </p>
      <p><strong>기술 블로그:</strong> <a href="https://sangphilpark.github.io/about/" target="_blank">Git-io</a></p>
    </td>
  </tr>
  <tr>
    <td style="text-align: center; padding: 10px;">
      <img src="./docs_assets/PSP.jpg" alt="박상필" height="150" width="150" style="border-radius: 50%;"/>
      <h4>박상필</h4>
      <p><strong>역할:</strong> AI / DATA</p>
      <p><strong>연락처:</strong> pagerank990@gmail.com</p>
      <p><strong>기술 블로그:</strong> <a href="https://sangphilpark.github.io/about/" target="_blank">Git-io</a></p>
    </td>
    <td style="text-align: center; padding: 10px;">
      <img src="./docs_assets/LYJ.jpg" alt="이윤주" height="150" width="150" style="border-radius: 50%;"/>
      <h4>이윤주</h4>
      <p><strong>역할:</strong> FE </p>
      <p><strong>연락처:</strong> @gmail.com</p>
      <p><strong>GIT:</strong> <a href="https://sangphilpark.github.io/about/" target="_blank">github.com/현지</a></p>
    </td>
    <td style="text-align: center; padding: 10px;">
      <img src="./docs_assets/JHS.jpg" alt="장현수" height="150" width="150" style="border-radius: 50%;"/>
      <h4>장현수</h4>
      <p><strong>역할:</strong> FE</p>
      <p><strong>연락처:</strong> wkdalsrud113@naver.com</p>
      <p><strong>GIT:</strong> <a href="https://github.com/baek-yak" target="_blank">github.com/현수</a></p>
    </td>
  </tr>
</table>


## 🔑 핵심 기능 소개
- **논문 검색 및 요약**: 사용자가 원하는 논문을 쉽게 찾고 요약된 정보를 제공하여 시간 절약 ⏱️
- **챗봇 기반 질의응답**: 논문 내용을 바탕으로 실시간으로 질문에 대한 답변을 제공해주는 인터랙티브 챗봇 🤖
- **PDF 분석 및 벡터 임베딩**: 논문 PDF를 다운로드하고 벡터 임베딩을 통해 효율적인 데이터 검색 및 분석 🔍

1. **논문 검색 및 요약** ✨
   - 사용자가 원하는 논문을 검색하고, 논문의 목차, 주요 요약, 챕터별 요약을 제공합니다.

2. **챗봇 질의응답** 🤖
   - 논문 내용에 대한 질의응답이 가능한 **RAG 기법**을 활용한 챗봇을 제공합니다. 논문에서 직접 답을 찾아드립니다!

3. **논문 PDF 다운로드 및 분석** 📄
   - 사용자의 질문에 따라 해당 논문의 PDF를 다운로드하고, 이를 청크로 분할하여 분석합니다.

4. **임베딩 및 벡터 검색** 🔍
   - **OpenAI 임베딩 라이브러리**를 이용하여 논문 데이터를 벡터화하고, **Faiss**에 저장하여 효율적인 검색을 지원합니다.

## 🚀 설치 및 실행 방법
### 1. 요구사항
- **Docker**가 설치되어 있어야 합니다 🐳
- **Python 3.12.3** 버전을 사용합니다 🐍
- **MySQL** 데이터베이스 연결 정보가 필요합니다 (자세한 정보는 아래 참조)

### 2. 클론 및 설정
```bash
$ git clone https://lab.ssafy.com/s11-bigdata-dist-sub1/S11P21B208.git
$ cd S11P21B208
```

### 3. 환경 변수 설정
- `.env` 파일을 생성하고 아래와 같은 정보로 설정합니다:
  ```
  MYSQL_HOST=j11b208.p.ssafy.io
  MYSQL_PORT=3306
  MYSQL_USER=root
  MYSQL_PASSWORD=paperdot1!2@nonemoon
  DATABASE=paperdot
  ```

### 4. Docker 컨테이너 실행
```bash
$ docker-compose up -d
```
- 서비스가 Docker 컨테이너로 실행됩니다. 프론트엔드와 백엔드가 모두 구성되어 있습니다.

## 🛠 기술 스택
| 분야           | 기술스택       | 담당자                      |
|:--------------:|:-------------------------:|:----------:|
| **FE** | React, TypeScript, Zustand | `권성민`, `이윤주`, `장현수`  |
| **BE** | JDK(17), HDFS(2.7.3), SpringBoot(3.3.3) | `김민경`, `이찬호` |
| **데이터베이스** | MySQL(8.0.23), Redis(7.4.0), Elastic Search(8.15.1) | `김민경`, `박상필`, `이찬호` |
| **임베딩 및 벡터 검색** | Faiss(cpu-1.8.0.post1), KR-SBERT-V40K-klueNLI-augSTS | `박상필`, `장현수` |
| **컨테이너 관리 및 배포** | Jenkins(2.476), Docker(27.2.1) | `이찬호` |
| **AI 기술** | LangChain(0.3.2), Scikit-Learn(1.3.0), FastAPI(0.115.0) | `박상필` |
| **LLM 모델** | LLama3.1-ko-Bllossom-8B, GPT-4o | `박상필`, `권성민`  |



## 💡 사용 방법
1. 라디오를 들으며 유저들과 채팅으로 지식을 함양해보세요 ✨
2. 논문 내용에서 궁금한 점은 챗봇에게 질문해보세요 🤖
1. 웹사이트에 접속하여 원하는 논문을 검색하세요 🔍
2. 논문 요약을 확인하고, 나만의 정리 노트를 작성해보세요 📖 
3. 논문에 대한 추가 정보를 쉽게 얻을 수 있습니다 📘



## 📋 FAQ
- 궁금한 점은 질문과 답변을 통해 빠르게 문제를 해결하세요! ❓
  - **Q: Docker 설치가 필요한가요?**
    - **A: 네, 서비스는 Docker를 통해 배포됩니다.**
  - **Q: 어떤 데이터베이스를 사용하나요?**
    - **A: `MySQ`L을 사용합니다.**
  - **Q: 유사 논문 추천 기능**
    - MapReduce 분산처리로 `벡터` 및 `TF-IDF` 유사도를 계산합니다.
  - **Q: 사용자 북마크 및 개인화 서비스**
    - `논문(Node)` 간 `연관 관계(Edge)` 를 기반으로 알고리즘이 계산됩니다.



<br>

## 프로젝트 구조
```
feed-me/
S11P12B104
├─ .gitignore  📄
├─ AI  🤖
│  └─ gpu-server  🖥️
│     └─ lab-phil  🧪
│        ├─ 0_codes  💻
│        ├─ assets  🎨
│        ├─ configs  ⚙️
│        ├─ consumer.sh  🔄
│        ├─ data  📊
│        ├─ LICENSE-CODE  📜
│        ├─ model  🧠
│        │  ├─ anything_control_pipeline.py  📝
│        │  ├─ assets  🎨
│        │  ├─ consumer.py  📝
│        │  ├─ pixel_model.py  📝
│        │  ├─ segment_anything_model.py  📝
│        │  └─ utils.py  🛠️
│        ├─ pyproject.toml  📝
│        ├─ pytest.ini  🧪
│        ├─ README.md  📄
│        ├─ requirements  📋
│        ├─ scripts  📜
│        └─ tests  🧪
├─ Backend-feedme  💻
│  ├─ feedme  🍽️
│  │  ├─ .env  🌍
│  │  ├─ Dockerfile  🐳
│  │  ├─ gradle  📦
│  │  ├─ gradlew  ⚙️
│  │  ├─ gradlew.bat  ⚙️
│  │  └─ src  📂
│  │     ├─ main  🚀
│  │     │  ├─ java  ☕
│  │     │  │  └─ com  🌐
│  │     │  │     └─ todoslave  💼
│  │     │  │        └─ feedme  🍽️
│  │     │  │           ├─ config  ⚙️
│  │     │  │           ├─ controller  🎮
│  │     │  │           ├─ domain  🌱
│  │     │  │           │  └─ entity  🏛️
│  │     │  │           ├─ DTO  📦
│  │     │  │           ├─ repository  🗄️
│  │     │  │           └─ service  🛠️
│  │     └─ resources  📂
│  │     └─ test  🧪
├─ Front-feedme  🖼️
│  ├─ .gitignore  📄
│  ├─ default.conf  ⚙️
│  ├─ docker-compose.yml  🐳
│  ├─ Dockerfile  🐳
│  ├─ package-lock.json  📦
│  ├─ package.json  📦
│  ├─ public  🌐
│  └─ src  📂
└─ README.md  📄
```

### 설명
- **AI**: AI 모델 관련 파일들이 포함된 디렉토리.
- **Backend-feedme**: 백엔드 애플리케이션 코드.
- **Front-feedme**: 프론트엔드 애플리케이션 코드.



## 🤝 형상 관리 컨벤션
기여를 원하시면 이 저장소를 포크하고, 브랜치를 생성한 후 풀 리퀘스트를 보내주세요! 🙌

### 🔧 기여 규칙
- **코드 스타일**: PEP8을 준수해주세요 📝
- **PR 설명**: 변경 사항과 의도를 명확하게 설명해주세요 📄

## 🔒 보안 주의사항
- 데이터베이스와 환경 변수를 설정할 때 민감한 정보는 `.env` 파일에 안전하게 보관하세요 🔐
- 외부에 노출되지 않도록 주의해주세요!

## 📞 문의
- 이슈나 질문은 MatterMost 혹은 이메일을 통해 남겨주세요 📝
- 이메일 문의: pagerank990@gmail.com ✉️

<br>

감사합니다! 🙇‍♂️🙇‍♀️


---

#### 주관: 삼성전자, 삼성 청년 소프트웨어 아카데미(SSAFY)
