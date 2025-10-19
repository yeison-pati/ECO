# Stage 1: Build the application using a Maven image
# Using a specific version ensures build reproducibility.
# 'AS build' names this stage, so we can refer to it later.
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy pom.xml and .mvn directory to leverage Docker's layer caching.
# 'mvn dependency:go-offline' will only re-run if these files change.
COPY pom.xml .
COPY .mvn .mvn
RUN mvn dependency:go-offline -B

# Copy the rest of the source code
COPY src ./src

# Package the application. We skip tests as they should be run in a CI pipeline.
# The '-B' flag runs Maven in non-interactive (batch) mode.
RUN mvn package -B -DskipTests

# Stage 2: Create the final, lightweight runtime image
# We use a JRE (Java Runtime Environment) image, which is smaller than a JDK.
FROM eclipse-temurin:21-jre-alpine

# Set the working directory
WORKDIR /app

# Copy the executable JAR file from the 'build' stage
COPY --from=build /app/target/*.jar app.jar

# Expose the port the application will run on (matches server.port in application.properties)
EXPOSE 8082

# The command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
