FROM nvidia/cuda:11.8.0-cudnn8-runtime-ubuntu22.04

RUN apt-get update && apt-get install -y \
    wget \
    bzip2 \
    ca-certificates \
    curl \
    git \
    build-essential \
    swig \
    libmecab-dev \
    mecab \
    mecab-ipadic-utf8 \
    && rm -rf /var/lib/apt/lists/*

# MeCab-ko 및 MeCab-ko-dic 설치
RUN cd /tmp && \
    curl -LO https://bitbucket.org/eunjeon/mecab-ko/downloads/mecab-0.996-ko-0.9.2.tar.gz && \
    tar zxfv mecab-0.996-ko-0.9.2.tar.gz && \
    cd mecab-0.996-ko-0.9.2 && \
    ./configure && \
    make && \
    make check && \
    make install && \
    ldconfig && \
    cd /tmp && \
    curl -LO https://bitbucket.org/eunjeon/mecab-ko-dic/downloads/mecab-ko-dic-2.1.1-20180720.tar.gz && \
    tar -zxvf mecab-ko-dic-2.1.1-20180720.tar.gz && \
    cd mecab-ko-dic-2.1.1-20180720 && \
    ./configure && \
    make && \
    make install

# Conda 설치
RUN wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh && \
    bash Miniconda3-latest-Linux-x86_64.sh -b -p /opt/conda && \
    rm Miniconda3-latest-Linux-x86_64.sh

ENV PATH="/opt/conda/bin:$PATH"

# 작업 디렉토리 설정
WORKDIR /app

# 환경 파일을 컨테이너로 복사
COPY environment.yml /app/environment.yml

# Conda 환경 생성
RUN conda env create -f /app/environment.yml

# pip 업그레이드
RUN conda run -n doc2vec pip install --upgrade pip setuptools wheel

# Conda 환경 활성화 (bash 쉘에서 작동하도록 설정)
SHELL ["conda", "run", "-n", "doc2vec", "/bin/bash", "-c"]

# 애플리케이션 코드 복사
COPY . /app

# MeCab 설정 파일 복사 (필요한 경우)
RUN mkdir -p /usr/local/etc && \
    echo "dicdir=/usr/local/lib/mecab/dic/mecab-ko-dic" > /usr/local/etc/mecabrc

# 포트 노출
EXPOSE 8000

# 컨테이너 시작 시 FastAPI 서버 실행
ENTRYPOINT ["conda", "run", "--no-capture-output", "-n", "doc2vec", "uvicorn", "vector_search.codes.app:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

# # Miniconda가 포함된 기본 이미지 사용
# # FROM continuumio/miniconda3
# FROM nvidia/cuda:11.8.0-cudnn8-runtime-ubuntu22.04

# RUN apt-get update && apt-get install -y \
#     wget \
#     bzip2 \
#     ca-certificates \
#     curl \
#     git \
#     build-essential \
#     swig \
#     libmecab-dev \
#     mecab \
#     mecab-ipadic-utf8 \
#     && rm -rf /var/lib/apt/lists/*
    
# # Conda 설치
# RUN apt-get update && apt-get install -y wget && \
#     wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh && \
#     bash Miniconda3-latest-Linux-x86_64.sh -b -p /opt/conda && \
#     rm Miniconda3-latest-Linux-x86_64.sh

# ENV PATH="/opt/conda/bin:$PATH"

# # 작업 디렉토리 설정
# WORKDIR /app

# # 환경 파일을 컨테이너로 복사
# COPY environment.yml /app/environment.yml

# # Conda 환경 생성
# RUN conda env create -f /app/environment.yml

# # pip 업그레이드
# RUN conda run -n doc2vec pip install --upgrade pip setuptools wheel

# # Conda 환경 활성화 (bash 쉘에서 작동하도록 설정)
# SHELL ["conda", "run", "-n", "doc2vec", "/bin/bash", "-c"]

# # 애플리케이션 코드 복사
# COPY . /app

# # 포트 노출
# EXPOSE 8000

# # 컨테이너 시작 시 FastAPI 서버 실행
# ENTRYPOINT ["conda", "run", "--no-capture-output", "-n", "doc2vec", "uvicorn", "vector_search.codes.app:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]