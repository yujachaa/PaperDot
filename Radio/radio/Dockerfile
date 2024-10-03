FROM openjdk:17-alpine
ARG JAR_FILE=build/libs/radio-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE} /app.jar
COPY /home/ubuntu/radio-mp3 /home/ubuntu/radio-mp3
EXPOSE 8081
ENTRYPOINT ["java","-jar","-Duser.timezone=Asia/Seoul","/app.jar"]
