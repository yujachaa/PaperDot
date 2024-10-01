# Miniconda가 포함된 기본 이미지 사용
FROM continuumio/miniconda3

# 작업 디렉토리 설정
WORKDIR /app

# 환경 파일을 컨테이너로 복사
COPY environment.yml /app/environment.yml

# Conda 환경 생성
RUN conda env create -f /app/environment.yml

# Conda 환경 활성화 (bash 쉘에서 작동하도록 설정)
SHELL ["conda", "run", "-n", "doc2vec", "/bin/bash", "-c"]

# 애플리케이션 코드 복사
COPY . /app

# 포트 노출
EXPOSE 8000

# 컨테이너 시작 시 FastAPI 서버 실행
ENTRYPOINT ["conda", "run", "--no-capture-output", "-n", "doc2vec", "uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
