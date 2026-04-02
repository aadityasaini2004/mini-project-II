# Build Stage
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
# COPY . . ki jagah ye likho 👇
COPY backend/ . 
RUN mvn clean package -DskipTests

# Baki sab same rahega...
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]