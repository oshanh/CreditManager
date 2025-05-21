# base image for running the application
FROM openjdk:21-jdk-slim

# Set the working directory
WORKDIR /app

# Copy the build JAR file 
COPY target/CrediManage-0.0.1-SNAPSHOT.jar /app/app.jar

# Expose the port on which the Spring Boot application will run
EXPOSE 8081

# Command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
