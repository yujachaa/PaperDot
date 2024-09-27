FROM node:20-alpine as build
WORKDIR /app  
# 컨테이너 내에서의 워킹 디렉토리 변경

COPY package*.json ./ 
#먼저 패키지 인스톨
RUN npm install
COPY . . 
# 그 후 소스코드들을 복붙

RUN npm run build

FROM nginx:stable-alpine as production-stage
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 3000

CMD ["nginx", "-g","daemon off;"]