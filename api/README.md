# Feminine Photography API

A Quarkus 3 based REST API that powers the feminine photography portfolio platform. The service exposes `/api/v1` endpoints for managing photographer profiles, albums, photos, inquiries and bookings. It integrates with PostgreSQL 16, Flyway migrations, Hibernate Panache, Bean Validation, OIDC/JWT security, rate limiting, OpenAPI/Swagger UI, health and metrics, plus an image storage abstraction that stores files locally in development and targets Amazon S3 in production.

## Getting started

### Prerequisites

* Java 17+
* Maven 3.9+
* PostgreSQL 16 (for local development)
* Docker (for running the Testcontainers powered test-suite)

### First run

```bash
cd api
mvn quarkus:dev
```

This will start Quarkus in dev mode on <http://localhost:8080>. Swagger UI is served from [`/swagger-ui`](http://localhost:8080/swagger-ui) and the OpenAPI contract lives at [`/q/openapi`](http://localhost:8080/q/openapi).

Flyway automatically runs the SQL migrations in `src/main/resources/db/migration`. The seed data inserts two photographers, sample albums, photos, inquiries and bookings.

### Configuration profiles

* **Dev** (`quarkus.profile=dev`) — Uses the local PostgreSQL connection configured through the `DEV_DB_*` environment variables (defaults are provided). Images are stored under `build/dev-images`.
* **Test** (`quarkus.profile=test`) — Bootstrapped by the Testcontainers based `PostgresResource`. Stored images are written to `target/test-images`.
* **Prod** (`quarkus.profile=prod`) — Reads all DB and S3 configuration from the `PROD_*` environment variables. Enables the S3 storage adapter.

OIDC/JWT validation is pre-configured; provide `OIDC_AUTH_SERVER_URL`, `OIDC_CLIENT_ID`, `OIDC_CLIENT_SECRET` and a PEM encoded public key at `src/main/resources/keys/publicKey.pem` (or override `quarkus.smallrye-jwt.verify.key.location`).

### Core endpoints

| Resource | Endpoint | Description |
| --- | --- | --- |
| Photographers | `GET /api/v1/photographers` | List photographer profiles |
|  | `POST /api/v1/photographers` | Create a profile |
|  | `GET/PUT/DELETE /api/v1/photographers/{id}` | Retrieve, update or delete a profile |
| Albums | `GET /api/v1/photographers/{photographerId}/albums` | List albums for a photographer |
|  | `POST /api/v1/albums` | Create an album |
|  | `GET/PUT/DELETE /api/v1/albums/{id}` | Retrieve, update or delete an album |
| Photos | `GET /api/v1/albums/{albumId}/photos` | List photos |
|  | `POST /api/v1/photos` *(multipart)* | Upload a new photo and metadata |
|  | `PUT /api/v1/photos/{id}` | Update metadata |
|  | `POST /api/v1/photos/{id}/image` *(multipart)* | Replace the stored image |
|  | `DELETE /api/v1/photos/{id}` | Delete a photo |
| Inquiries | `GET /api/v1/photographers/{photographerId}/inquiries` | List inquiries |
|  | `POST /api/v1/inquiries` | Create inquiry |
|  | `PUT /api/v1/inquiries/{id}` | Update inquiry |
|  | `POST /api/v1/inquiries/{id}/status` | Update status |
|  | `DELETE /api/v1/inquiries/{id}` | Delete inquiry |
| Bookings | `GET /api/v1/photographers/{photographerId}/bookings` | List bookings |
|  | `POST /api/v1/bookings` | Create booking |
|  | `PUT /api/v1/bookings/{id}` | Update booking |
|  | `POST /api/v1/bookings/{id}/status` | Update status and contract URL |
|  | `DELETE /api/v1/bookings/{id}` | Delete booking |

Rate limiting is enforced for every `/api/` call using Bucket4j. Default values (120 requests/minute) can be tuned with `RATE_LIMIT_CAPACITY` and `RATE_LIMIT_REFILL` environment variables.

### Health, metrics and tracing

* Liveness/readiness checks at `/q/health` and `/q/health/ready` (database readiness check included)
* Prometheus metrics at `/q/metrics`
* Audit logging is applied to all mutating service operations

### Testing & coverage

Run the full test-suite (requires Docker):

```bash
cd api
mvn verify
```

`mvn verify` executes unit tests plus the Quarkus/RestAssured integration tests on a PostgreSQL 16 Testcontainer. JaCoCo is configured to enforce a minimum 70% line coverage across the module.

