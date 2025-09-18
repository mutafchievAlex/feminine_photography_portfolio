# Feminine Photography API

Quarkus 3 service that powers the portfolio web experience with REST resources for photographers, albums, photos, inquiries, and bookings.

## Prerequisites
- **Java 21** (Temurin/OpenJDK). The Maven compiler is temporarily set to 17; install a Java 21 runtime so you can develop against the upcoming baseline while remaining compatible with the current build.【F:api/pom.xml†L14-L25】
- **Maven 3.9+** for dependency management and the Quarkus CLI goals.【F:api/pom.xml†L11-L186】
- **Docker** when running tests or local dependencies; the suite uses Testcontainers to launch PostgreSQL automatically.【F:api/src/test/java/com/feminine/api/config/PostgresResource.java†L1-L34】

## Environment setup
1. Copy the template and provide local secrets:
   ```bash
   cp api/.env.example api/.env
   ```
   Populate JDBC credentials, OIDC client values, and mail configuration as needed. Never commit populated `.env` files—use GitHub Secrets or your platform secret manager for non-local environments.【F:api/.env.example†L1-L23】【F:api/.env†L1-L6】
2. Ensure `application.properties` stays secret-free by referencing environment variables (`DB_*`, `OIDC_*`, `MAIL_*`, `S3_*`, etc.) when promoting to shared environments.【F:api/src/main/resources/application.properties†L1-L63】

## Running locally
1. Start PostgreSQL and Keycloak via the root docker-compose file or your preferred services.
   ```bash
   docker compose up -d postgres keycloak
   ```
2. Launch Quarkus in dev mode:
   ```bash
   cd api
   mvn quarkus:dev
   ```
   Dev services auto-run Flyway migrations and expose Swagger UI at `http://localhost:8080/swagger-ui` and OpenAPI at `/q/openapi`. Seed data from `db/migration` populates reference photographers, albums, and bookings.【F:api/src/main/resources/db/migration/V1__create_tables.sql†L1-L200】
3. Use the `/api/v1` endpoints for CRUD operations; authentication expects the Keycloak realm defined in `docker/keycloak/feminine-realm.json`.【F:api/src/main/java/com/feminine/api/resource/PhotographerResource.java†L1-L58】【F:docker/keycloak/feminine-realm.json†L1-L48】

## Database migrations
- Flyway migrations live under `src/main/resources/db/migration` and run automatically at application start. Use `mvn quarkus:dev` or `mvn quarkus:run` to apply them locally, or execute `mvn -Dflyway.clean`/`mvn -Dflyway.migrate` for manual control if needed.【F:api/src/main/resources/application.properties†L1-L63】
- When adding migrations, follow the `V#__description.sql` naming convention so Flyway orders them correctly.

## Testing
- Execute the full suite with:
  ```bash
  mvn verify
  ```
  This command runs unit tests, Quarkus integration tests, and enforces the Jacoco 70% coverage threshold. Docker must be running for Testcontainers to provision PostgreSQL.【F:api/pom.xml†L145-L186】【F:api/src/test/java/com/feminine/api/config/PostgresResource.java†L1-L34】
- Use `mvn test` for faster feedback when you do not need integration tests or coverage checks.

## Common issues
- **Testcontainers cannot start PostgreSQL**: Verify Docker is installed and running, and that ports 5432/5433 are free. Retry `mvn verify` after pruning old containers.【F:api/src/test/java/com/feminine/api/config/PostgresResource.java†L1-L34】
- **OIDC failures (401/403)**: Confirm the `OIDC_*` values in `api/.env` match the Keycloak realm imported from `docker/keycloak/feminine-realm.json`, and that the Keycloak server is reachable.【F:api/.env.example†L1-L23】【F:docker/keycloak/feminine-realm.json†L1-L48】
- **Image upload errors**: The `PhotoService` depends on an `ImageStorageService` adapter that has not been implemented yet; expect failures on `/api/v1/photos` upload/update operations until the storage layer is delivered.【F:api/src/main/java/com/feminine/api/service/PhotoService.java†L1-L69】

## Secret management
- Keep all runtime secrets in GitHub Secrets or your deployment platform’s vault. Reference them from CI/CD workflows and (future) infrastructure code instead of modifying repository files.
- If you must share local defaults, update `api/.env.example` with sanitized placeholders rather than pushing populated `.env` files.【F:api/.env.example†L1-L23】
