# backend/Dockerfile

FROM openjdk:21-jdk-slim

WORKDIR /app

COPY target/debit_manager_backend-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8081

ENTRYPOINT ["java", "-jar", "app.jar"]
