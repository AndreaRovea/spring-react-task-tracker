# Spring + React Task Tracker

> Personal portfolio project — a minimal full-stack task management app
> demonstrating the integration of a Spring Boot REST backend with a
> React (TypeScript) frontend over MySQL or H2.

## Status

**Work in progress** — built as a personal portfolio exercise to consolidate
practical full-stack integration skills (Java/Spring Boot backend + React
frontend + relational persistence).

## Tech Stack

**Backend** — Java 21, Spring Boot 3.3, Spring Web, Spring Data JPA, Bean Validation
**Persistence** — H2 in-memory (default) · MySQL (via `mysql` profile)
**Frontend** — React 18, TypeScript, Vite
**Testing** — JUnit 5, Spring Boot Test, MockMvc
**Tooling** — Maven, npm, Makefile

## Architecture

```
[ React + TypeScript + Vite ]  ⇄  REST/JSON  ⇄  [ Spring Boot ]  ⇄  JPA  ⇄  [ H2 / MySQL ]
        :5173                                          :8080
                          (Vite proxies /api → :8080)
```

## Project structure

```
spring-react-task-tracker/
├── backend/                            Spring Boot Maven project
│   ├── pom.xml
│   ├── src/main/java/.../tasktracker/
│   │   ├── TaskTrackerApplication.java
│   │   ├── task/                       (Task entity, repository, service, controller, DTOs)
│   │   └── shared/                     (ApiErrorAdvice)
│   ├── src/main/resources/
│   │   ├── application.yml             (H2 default)
│   │   └── application-mysql.yml       (MySQL profile)
│   └── src/test/java/.../tasktracker/task/
│       └── TaskControllerIntegrationTest.java
├── frontend/                           Vite + React + TypeScript
│   ├── package.json
│   ├── vite.config.ts                  (dev proxy: /api → :8080)
│   ├── tsconfig.json
│   └── src/
│       ├── main.tsx
│       ├── App.tsx                     (Task list UI)
│       ├── api/tasks.ts                (typed REST client)
│       └── styles.css
└── Makefile                            (orchestration targets)
```

## Getting started

Requires **JDK 21**, **Maven 3.9+**, **Node 20+**.

```bash
git clone https://github.com/AndreaRovea/spring-react-task-tracker.git
cd spring-react-task-tracker

# install everything
make install

# run the backend on :8080 (H2 in-memory, profile default)
make run-backend
# … in a second terminal:
make run-frontend     # Vite on :5173, proxies /api to the backend

# run the test suite
make test             # JUnit 5 + Spring Boot integration tests
```

Open <http://localhost:5173> — the UI talks to the backend through the Vite proxy.

### Switching to MySQL

```bash
SPRING_PROFILES_ACTIVE=mysql MYSQL_USER=... MYSQL_PASSWORD=... make run-backend
```

The `application-mysql.yml` profile expects a local MySQL server on `:3306`
and auto-creates the `tasktracker` database.

## REST API

| Method | Path              | Description |
| ------ | ----------------- | ----------- |
| GET    | `/api/tasks`      | List tasks (optional `?status=TODO\|IN_PROGRESS\|DONE` filter) |
| GET    | `/api/tasks/{id}` | Get task by id |
| POST   | `/api/tasks`      | Create task |
| PUT    | `/api/tasks/{id}` | Partial update |
| DELETE | `/api/tasks/{id}` | Delete task |

## Roadmap

- [x] Backend scaffolding (Maven, Spring Boot 3.3, Java 21)
- [x] Task entity, repository, service and REST controller
- [x] DTOs with Bean Validation
- [x] Global error handler (`ApiErrorAdvice`)
- [x] Integration tests covering CRUD happy paths and validation errors
- [x] Frontend scaffold (Vite + React + TypeScript)
- [x] Typed REST client and Task list UI
- [ ] Optimistic UI updates and inline editing
- [ ] Search and pagination on the listing endpoint
- [ ] Docker Compose with backend + MySQL
- [ ] CI workflow (GitHub Actions)

## Scope and disclaimer

This repository contains code written from scratch as a personal learning
exercise. It includes no proprietary material from any employer or third party.

## Author

Andrea Rovea — [LinkedIn](https://www.linkedin.com/in/andrea-rovea)

## License

MIT — see `LICENSE` file.
