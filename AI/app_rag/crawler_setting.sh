#!/bin/bash
# chmod +x crawler_setting.sh
# conda activate paper-rag

# 1. linux
# wget https://storage.googleapis.com/chrome-for-testing-public/129.0.6668.89/linux64/chrome-linux64.zip
# wget 	https://storage.googleapis.com/chrome-for-testing-public/129.0.6668.89/linux64/chromedriver-linux64.zip
# unzip chrome-linux64.zip
# unzip chromedriver-linux64.zip

# export CHROME_BIN_PATH="$(pwd)/chrome-linux64/chrome"
# export CHROMEDRIVER_PATH="$(pwd)/chromedriver-linux64/chromedriver"


# 2. window
# Invoke-WebRequest -Uri "https://storage.googleapis.com/chrome-for-testing-public/129.0.6668.89/win64/chrome-win64.zip" -OutFile "chrome-win64.zip"
# Invoke-WebRequest -Uri "https://storage.googleapis.com/chrome-for-testing-public/129.0.6668.89/win64/chromedriver-win64.zip" -OutFile "chromedriver-win64.zip"

curl -# -O https://storage.googleapis.com/chrome-for-testing-public/129.0.6668.89/win64/chrome-win64.zip
curl -# -O https://storage.googleapis.com/chrome-for-testing-public/129.0.6668.89/win64/chromedriver-win64.zip
unzip chrome-win64.zip
unzip chromedriver-win64.zip

# # Chrome binary 경로를 전역 변수로 설정 (예: chrome-linux64 내 chrome 실행 파일)
# export CHROME_BIN_PATH="$(pwd)/chrome-win64/chrome.exe"
# export CHROMEDRIVER_PATH="$(pwd)/chromedriver-win64/chromedriver.exe"




# # conda 환경 설정 파일을 업데이트하여 환경 변수 추가
# conda env config vars set CHROME_BIN_PATH=$CHROME_BIN_PATH
# conda env config vars set CHROMEDRIVER_PATH=$CHROMEDRIVER_PATH

# echo "Chrome binary path: $CHROME_BIN_PATH"
# echo "ChromeDriver path: $CHROMEDRIVER_PATH"