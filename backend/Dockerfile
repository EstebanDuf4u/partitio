# FROM maven:3.9.11-eclipse-temurin-21-alpine AS build

# WORKDIR /app

# COPY pom.xml ./
# RUN mvn dependency:go-offline

# COPY src ./src
# RUN mvn package -DskipTests

# FROM eclipse-temurin:21-jre-alpine

# WORKDIR /app

# COPY --from=build /app/target/partitio-backend.jar app.jar

# EXPOSE 3000
# CMD ["java", "-jar", "app.jar"]

# Dockerfile "multistage build" en 2 étapes :
# 1. la compilation du projet dans un conteneur "maven"
# 2. le déploiement du projet dans un conteneur "eclipse temurin"

# Etape 1 : compilation du projet
FROM maven:3.9.9-eclipse-temurin-21-alpine AS builder
# paramétrage du dossier de travail, le nom est libre
WORKDIR /opt/app
# copie uniquement du pom.xml dans le conteneur
COPY pom.xml .
# copie du code source
COPY ./src ./src
# compilation du projet (sans les tests) et création d'un .jar
RUN mvn clean install -DskipTests

# Etape 2 : conteneur en production
# utilisation d'une image recommandée pour sa légèreté
FROM eclipse-temurin:21-jre-alpine
EXPOSE 3000
WORKDIR /opt/app
COPY --from=builder /opt/app/target/partitio-backend.jar partitio-backend.jar
ENTRYPOINT ["java", "-jar", "/opt/app/partitio-backend.jar"]
