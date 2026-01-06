# Delivery Epic Audit Report

## Executive summary
- The front-end Vite/React application is feature-rich with localized marketing pages and admin tooling, but automated tests and runtime observability are not yet wired to the Quarkus back end the way the epic envisions.
- The Quarkus service exposes a comprehensive domain model (photographers, albums, photos, inquiries, bookings) with Flyway migrations and email workflows, yet key integrations such as object storage and hardened configuration for higher environments remain incomplete.
- Infrastructure automation currently stops at docker-compose for local orchestration; there is no codified cloud baseline or CI/CD workflow managing secrets, so the epic’s deployment and compliance goals are still unmet.

## Front-end (web module)
### Current state
- Routes are implemented for all public marketing surfaces plus the admin dashboard, backed by a language provider that toggles between Bulgarian and English strings for core UI copy.【F:src/Routes.jsx†L1-L37】【F:src/hooks/useLanguage.jsx†L1-L99】
- API service wrappers are in place for bookings, galleries, and stories, reusing a shared Axios client that reads the base URL from Vite environment variables to call the Quarkus API.【F:src/services/booking.js†L1-L42】【F:src/services/gallery.js†L1-L15】【F:src/services/apiClient.js†L1-L9】
- The admin dashboard renders extensive UI scaffolding (stats, notifications, schedule widgets) but currently relies on hard-coded sample data rather than live API payloads.【F:src/pages/admin-dashboard/index.jsx†L1-L86】

### Gaps and risks
- The project scripts still rely on `bun test` even though Bun is neither installed nor documented, leaving the front-end test suite effectively unusable for contributors following Node/NPM workflows.【F:package.json†L43-L52】
- There is no documented or implemented telemetry/monitoring hook from the front end to surface API health, making it difficult to satisfy the epic’s operational readiness expectations.
- Localization only covers copy strings; date/time formatting and API payloads remain single-locale, and there is no fallback content strategy for untranslated assets, risking inconsistent UX.

### Implementation plan
1. Replace the `bun test` script with a supported Jest or Vitest runner and add smoke tests that exercise the Axios client against a mocked API to reestablish the red/green feedback loop envisioned in the epic.
2. Wire the admin dashboard widgets to the booking, inquiry, and gallery endpoints (via Redux Toolkit or React Query) and add loading/error states so the UI reflects real operational data.
3. Expand the localization provider to wrap API-bound content (e.g., booking form labels, currency formatting) and document language toggle constraints for content editors.

## Back-end (api module)
### Current state
- Maven builds a Quarkus 3.8 application targeting Java 17 with RESTEasy Reactive, Hibernate Panache, Flyway, OIDC, metrics, and Mailer integrations; S3 support is declared for future image storage work.【F:api/pom.xml†L11-L109】
- Domain aggregates, DTOs, and REST resources cover photographers, albums, photos, inquiries, and bookings, matching the epic’s CRUD and workflow scope.【F:api/src/main/java/com/feminine/api/resource/PhotographerResource.java†L1-L58】【F:api/src/main/java/com/feminine/api/service/EmailService.java†L1-L120】
- Environment-aware configuration values default via Quarkus properties, and Flyway SQL migrations seed initial data for local environments.【F:api/src/main/resources/application.properties†L1-L63】【F:api/src/main/resources/db/migration/V1__create_tables.sql†L1-L200】
- The test suite bootstraps PostgreSQL through Testcontainers and enables Flyway cleaning to keep database fixtures deterministic.【F:api/src/test/java/com/feminine/api/config/PostgresResource.java†L1-L34】【F:api/src/test/resources/application.properties†L1-L6】

### Gaps and risks
- The service layer references an `ImageStorageService` in an `infrastructure` package that is absent from the repository, so photo uploads will fail at runtime until the storage adapter is implemented.【F:api/src/main/java/com/feminine/api/service/PhotoService.java†L1-L69】
- Security is configured for OIDC, yet the committed `.env` file and Keycloak realm expose default secrets that should be rotated and stored in a secrets manager before staging or production releases.【F:api/.env†L1-L6】【F:docker/keycloak/feminine-realm.json†L1-L48】
- The Maven compiler release remains pinned to Java 17 while the epic targets Java 21, and there is no CI gate enforcing the Jacoco coverage rule declared in the POM.【F:api/pom.xml†L12-L25】【F:api/pom.xml†L145-L186】

### Implementation plan
1. Deliver the missing `ImageStorageService` abstraction with local filesystem and S3 implementations, validating multipart upload flows via integration tests.
2. Upgrade the Maven toolchain to Java 21, align container images and Compose services with that baseline, and add compatibility notes for contributors.
3. Harden secrets by replacing the committed `.env` defaults with template files, provisioning GitHub environment secrets for CI/CD, and updating Keycloak client credentials across environments.

## Infrastructure
### Current state
- Docker Compose provisions PostgreSQL 16, Keycloak 25, the Quarkus API, and the Vite web app for local development, wiring environment variables for OIDC and service discovery.【F:docker-compose.yml†L1-L73】
- A Keycloak realm export defines web and API clients plus a seeded operator account to support the OIDC flow exercised by the application.【F:docker/keycloak/feminine-realm.json†L1-L48】
- Environment templates exist for the web app, and a new API template has been added to guide local secret population without committing production values.【F:.env.example†L1-L10】【F:api/.env.example†L1-L23】

### Gaps and risks
- There is no dedicated `infra` module or IaC definition for cloud databases, storage, identity, or networking, leaving the epic’s deployment targets undefined beyond local Compose files.【d94442†L1-L4】
- The repository lacks GitHub Actions or any CI/CD automation, so tests, security scans, and deployments are entirely manual at this stage.【d93ced†L1-L9】
- Secrets required for Compose and Keycloak are checked into source control, conflicting with the epic’s compliance needs and raising rotation risks if reused outside local development.【F:api/.env†L1-L6】【F:docker/keycloak/feminine-realm.json†L1-L48】

### Implementation plan
1. Stand up an `infra/` module (Terraform or Pulumi) that codifies PostgreSQL, object storage, Keycloak, and networking for non-local environments, seeded from the Compose topology.
2. Author GitHub Actions workflows that build/test the `web` and `api` modules, publish container images, and promote infrastructure changes, sourcing credentials from GitHub Secrets.
3. Externalize local secrets by relying on the new `.env` templates, removing committed secrets, and documenting secret rotation procedures for both local Compose and GitHub-hosted environments.

## Implementation roadmap
1. **Stabilize developer workflows** — Fix front-end testing, provide storage stubs, and migrate secrets to templates so contributors can run the stack locally with confidence.
2. **Align with production standards** — Upgrade to Java 21, implement storage and email providers, and introduce monitoring/telemetry hooks across web and API tiers.
3. **Automate delivery** — Add CI/CD pipelines, codify infrastructure, and connect pipelines to GitHub Secrets for deployments that satisfy the epic’s governance requirements.
