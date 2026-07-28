# syntax=docker/dockerfile:1.7

FROM node:24-alpine AS frontend-build

WORKDIR /frontend

COPY partitio/package*.json ./
RUN npm ci

COPY partitio/ ./
RUN npm run build

FROM maven:3.9.11-eclipse-temurin-21-alpine AS backend-build

WORKDIR /backend

COPY backend/pom.xml ./
RUN --mount=type=cache,target=/root/.m2 mvn -B -ntp dependency:go-offline

COPY backend/src ./src
COPY --from=frontend-build /frontend/dist ./src/main/resources/static
RUN --mount=type=cache,target=/root/.m2 mvn -B -ntp package -DskipTests

FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

RUN addgroup -S partitio \
  && adduser -S partitio -G partitio \
  && mkdir -p /app/uploads \
  && chown -R partitio:partitio /app

COPY --from=backend-build --chown=partitio:partitio /backend/target/partitio-backend.jar /app/app.jar

ENV PORT=3000
ENV JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=75"

EXPOSE 3000

USER partitio

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
