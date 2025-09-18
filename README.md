# Feminine Photography Portfolio

A full-stack project that pairs a React frontend with a Quarkus-based API for managing albums, photos, inquiries, and bookings for a boutique photography studio.

## Prerequisites

Ensure the following tools are available locally:

- [Node.js](https://nodejs.org/) 20+
- [npm](https://www.npmjs.com/) 10+
- [Java](https://adoptium.net/) 17 (Temurin is recommended)
- [Maven](https://maven.apache.org/) 3.9+
- [Docker](https://docs.docker.com/) (optional, required for container builds)

## Frontend development

```bash
# install dependencies
yarn install  # or npm install

# run the development server
npm run dev

# run static analysis (optional)
npm run lint --if-present

# execute Vitest with coverage thresholds (≥70 % lines/statements/functions)
npm test -- --coverage
```

Vitest writes coverage artifacts to `coverage/` and enforces 70 % minimum line, statement, and function coverage (50 % branches) for the exercised components, hooks, and utilities.

## Backend development

```bash
cd api

# run the Quarkus dev server for local iteration
mvn quarkus:dev

# run the full verification suite with coverage and quality gates
mvn clean verify
```

`mvn clean verify` executes unit and integration tests, produces a JaCoCo report under `api/target/site/jacoco`, and fails the build when aggregated line coverage drops below 70 %. Additional quality tools (Checkstyle, PMD, SpotBugs, OWASP Dependency Check) can be invoked individually via their respective Maven goals.

## Continuous integration

Automated checks live in [`.github/workflows/ci.yml`](.github/workflows/ci.yml) and trigger for pushes and pull requests against `main`.

### Frontend job

1. Detects the active JavaScript lockfile and configures caching for the matching package manager.
2. Installs dependencies with Node.js 20, then runs linting, the Vitest coverage suite, and a production build.
3. Uploads the Vitest coverage report as a workflow artifact.

### Backend job

1. Uses Temurin JDK 17 and caches the Maven repository plus OWASP Dependency Check data.
2. Runs `mvn clean verify` to compile, test, and enforce the 70 % JaCoCo coverage rule.
3. Executes OWASP Dependency Check, Checkstyle, PMD, and SpotBugs as failing gates.
4. Publishes the generated JaCoCo HTML report as an artifact.

### Docker publication

After the frontend and backend jobs succeed, a final job logs in to GitHub Container Registry and publishes the API Docker image using metadata-driven `latest` and commit SHA tags.

## Required GitHub secrets

Configure these repository secrets before enabling the workflow:

| Secret | Description |
| --- | --- |
| `GHCR_USERNAME` | GitHub username or organization that will own the published GHCR image. |
| `GHCR_TOKEN` | Personal Access Token with `read:packages`, `write:packages`, and `delete:packages` scopes used for the registry login. |

The Docker job pushes to `ghcr.io/<GHCR_USERNAME>/feminine-photography-portfolio` with these credentials.

## Docker usage

```bash
# Build the API image locally
cd api
docker build -t feminine-photography-portfolio:latest .

# Run the container (requires application properties and database configuration)
docker run --rm -p 8080:8080 feminine-photography-portfolio:latest
```

## Helpful resources

- [Quarkus documentation](https://quarkus.io/guides/)
- [Vitest guide](https://vitest.dev/guide/)
- [Tailwind CSS documentation](https://tailwindcss.com/docs)
