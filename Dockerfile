# Build Stage
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app

# Poora backend folder copy karo
COPY backend/ .

# 🔥 ASLI FIX: Maven ko us folder ke andar bhejo jahan POM file hai
WORKDIR /app/collegeHelpDeskPro

# Ab build karo
RUN mvn clean package -DskipTests

# Run Stage
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app

# 🔥 Yahan bhi path sahi karna hoga
COPY --from=build /app/collegeHelpDeskPro/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]