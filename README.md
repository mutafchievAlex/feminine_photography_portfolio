# Feminine Photography Portfolio

A full-stack platform that combines a Vite-powered marketing site with a Quarkus API for managing photographers, bookings, inquiries, albums, and galleries.

## Prerequisites
- **Java 21 (Temurin or OpenJDK)** for the Quarkus API. The current Maven compiler target is 17 and will be bumped to 21 during the modernization effort, so ensure your toolchain can run both.【F:api/pom.xml†L14-L25】
- **Maven 3.9+** to build and run the API module.【F:api/pom.xml†L11-L186】
- **Node.js 20+ and npm** for the front-end Vite application and its development tooling.【F:package.json†L1-L52】
- **Docker & Docker Compose v2** for running PostgreSQL, Keycloak, and full-stack smoke environments.【F:docker-compose.yml†L1-L73】

## Environment configuration
1. Copy the web template and supply local values:
   ```bash
   cp .env.example .env
   ```
   Customize the Vite variables to point at your API/Keycloak endpoints. Never commit `.env`; rely on the template instead.【F:.env.example†L1-L10】
2. Copy the backend template and provide JDBC, OIDC, and mail settings:
   ```bash
   cp api/.env.example api/.env
   ```
   The committed file is for illustration only—store real credentials outside of Git and rotate them through GitHub Secrets for CI/CD environments.【F:api/.env.example†L1-L23】【F:api/.env†L1-L6】
3. Production secrets (database passwords, OIDC clients, SMTP credentials, S3 keys) must live in GitHub Secrets or your runtime secret manager. Reference them from CI workflows and infrastructure automation rather than hard-coding values in Compose files or application properties.【F:docker-compose.yml†L23-L60】【F:api/src/main/resources/application.properties†L1-L63】

## Module structure
| Module | Location | Description |
| --- | --- | --- |
| `web` | `/` | React 18 + Vite marketing site, localization provider, and API-aware services for bookings, galleries, and stories.【F:src/Routes.jsx†L1-L37】【F:src/services/booking.js†L1-L42】 |
| `api` | `/api` | Quarkus 3 service with REST resources, Flyway migrations, Testcontainers-based tests, and email workflows.【F:api/pom.xml†L11-L109】【F:api/src/main/resources/db/migration/V1__create_tables.sql†L1-L200】 |
| `infra` | *(planned)* | Infrastructure-as-code definition for cloud databases, object storage, identity, and networking. Until it lands, docker-compose provides local orchestration only.【F:docker-compose.yml†L1-L73】 |

## Quick start
### Local development (manual processes)
1. Ensure Docker is running, then start backing services:
   ```bash
   docker compose up -d postgres keycloak
   ```
   The services expose PostgreSQL on `5432` and Keycloak on `8080` with the imported `feminine` realm.【F:docker-compose.yml†L4-L44】【F:docker/keycloak/feminine-realm.json†L1-L48】
2. Launch the API in dev mode:
   ```bash
   cd api
   mvn quarkus:dev
   ```
   Quarkus auto-runs Flyway migrations and serves OpenAPI/Swagger on `/q/openapi` and `/swagger-ui`.【F:api/src/main/resources/application.properties†L1-L63】
3. In a new terminal, install web dependencies and start Vite:
   ```bash
   npm install
   npm run dev
   ```
   The site runs on `http://localhost:5173` and proxies API requests using the values from `.env`.【F:package.json†L1-L52】【F:src/services/apiClient.js†L1-L9】

### Local development (docker-compose)
1. Build and run the full stack:
   ```bash
   docker compose up --build
   ```
2. Compose exposes the web app on `5173`, the API on `8081`, Keycloak on `8080`, and PostgreSQL on `5432`. Update `.env` files before running so containers pick up the correct secrets and redirect URIs.【F:docker-compose.yml†L1-L73】
3. Stop the stack with `docker compose down` when finished. Use `docker compose down -v` to reset local PostgreSQL data volumes.

## CI/CD overview
- GitHub Actions workflows will build/test the `web` and `api` modules, publish container images, and apply infrastructure changes once the `infra` module lands. Secrets such as database passwords, OIDC credentials, and AWS keys must be injected via GitHub Secrets to keep pipelines compliant with the epic’s security requirements.【d93ced†L1-L9】【F:api/.env.example†L1-L23】
- Until automation is added, run `mvn verify` in `api/` (requires Docker for Testcontainers) and `npm run build` in the repo root before opening pull requests.【F:api/src/test/java/com/feminine/api/config/PostgresResource.java†L1-L34】【F:package.json†L35-L52】

## Troubleshooting
- **Testcontainers errors**: Ensure Docker is running and accessible when executing `mvn verify`; the suite starts a PostgreSQL 16 container automatically.【F:api/src/test/java/com/feminine/api/config/PostgresResource.java†L1-L34】
- **Flyway migration failures**: Confirm your database credentials in `api/.env` match the target database and that the schema is empty or versioned; migrations live under `src/main/resources/db/migration`.【F:api/src/main/resources/db/migration/V1__create_tables.sql†L1-L200】
- **OIDC login issues**: Verify Keycloak is using the imported realm and that the Vite `.env` values for `VITE_OIDC_*` line up with the compose-hosted Keycloak endpoints.【F:docker/keycloak/feminine-realm.json†L1-L48】【F:.env.example†L1-L10】
- **Port conflicts**: Adjust host port mappings in `docker-compose.yml` if 5173, 8080, 8081, or 5432 are occupied locally.【F:docker-compose.yml†L1-L73】
- **Missing Bun runtime**: The web `test` script currently points to `bun test`. Replace it with Jest or Vitest locally until the script is updated in source control.【F:package.json†L43-L52】

## Secret management
- Treat `.env.example` and `api/.env.example` as the single source of documented configuration; copy them locally, but never commit real credentials.【F:.env.example†L1-L10】【F:api/.env.example†L1-L23】
- Store production secrets in GitHub Secrets or your cloud secret manager and reference them from CI/CD and IaC modules. Remove any default credentials from `docker-compose.yml` or Keycloak exports before promoting to shared environments.【F:docker-compose.yml†L23-L60】【F:docker/keycloak/feminine-realm.json†L1-L48】
