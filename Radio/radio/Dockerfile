FROM openjdk:17-alpine
ARG JAR_FILE=build/libs/radio-0.0.1-SNAPSHOT.jar
RUN apk add --no-cache ffmpeg
COPY ${JAR_FILE} /app.jar
EXPOSE 8081
ENTRYPOINT ["java","-jar","-Duser.timezone=Asia/Seoul","/app.jar"]
