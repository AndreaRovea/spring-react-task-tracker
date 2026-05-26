.PHONY: help install test build run-backend run-frontend clean

JAVA_HOME ?= /opt/homebrew/opt/openjdk@21
export JAVA_HOME

help:
	@echo "Targets:"
	@echo "  install        install backend + frontend dependencies"
	@echo "  test           run backend tests"
	@echo "  build          build backend jar and frontend bundle"
	@echo "  run-backend    start the Spring Boot backend on :8080"
	@echo "  run-frontend   start the Vite dev server on :5173 (proxies /api → :8080)"
	@echo "  clean          remove build artefacts"

install:
	cd backend  && mvn dependency:resolve -q
	cd frontend && npm install --silent

test:
	cd backend && mvn -q test

build:
	cd backend  && mvn -q package -DskipTests
	cd frontend && npm run build

run-backend:
	cd backend && mvn spring-boot:run

run-frontend:
	cd frontend && npm run dev

clean:
	cd backend  && mvn -q clean
	rm -rf frontend/dist frontend/node_modules
