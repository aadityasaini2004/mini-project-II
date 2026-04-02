# Build Stage
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app

# Sabse pehle poora backend folder copy karo
COPY backend/ .

# Check karne ke liye ki files aayi ya nahi (sirf logs ke liye)
RUN ls -la

# Ab mvn command run karo
RUN mvn clean package -DskipTests

# Run Stage
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
# Build stage se jar file uthao
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]