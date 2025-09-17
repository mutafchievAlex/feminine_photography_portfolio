# syntax=docker/dockerfile:1

FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /project
COPY pom.xml .
COPY src ./src
RUN mvn -B -DskipTests package

FROM quay.io/quarkus/quarkus-micro-image:3.8
WORKDIR /work/
COPY --from=build /project/target/quarkus-app/lib/ /work/lib/
COPY --from=build /project/target/quarkus-app/app/ /work/app/
COPY --from=build /project/target/quarkus-app/quarkus/ /work/quarkus/
COPY --from=build /project/target/quarkus-app/quarkus-run.jar /work/quarkus-run.jar
RUN mkdir -p /opt/quarkus/storage \
    && chown -R quarkus:quarkus /opt/quarkus/storage
USER quarkus
EXPOSE 8080
ENTRYPOINT ["java","-jar","/work/quarkus-run.jar"]
