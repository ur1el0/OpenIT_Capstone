# Paldo Architecture Overview

## 1. System Architecture
Paldo uses a classic decoupled Client-Server architecture:
- **Frontend:** React + Vite Single Page Application (SPA).
- **Backend:** ASP.NET Core Web API.
- **Database:** PostgreSQL accessed via Entity Framework Core.
- **Deployment:** Docker & Docker Compose for orchestrated local development and potential production deployment.

## 2. Backend Design (ASP.NET Core)
- **Layered Architecture:** Controllers, Services, and Data Access Layers.
- **Security:** JWT authentication with role-based access control (RBAC).
- **Database Access:** EF Core with code-first migrations.
- **API Documentation:** OpenAPI/Swagger for contract-first development.
- **Health Checks:** `/health` endpoint for monitoring.

## 3. Frontend Design (React + Vite)
- **Component-based UI:** Modular and reusable React components.
- **Routing:** Client-side routing for seamless navigation.
- **State Management:** (TBD based on complexity - React Context or Redux/Zustand).

## 4. Containerization
- **docker-compose.yaml:** Orchestrates the frontend, backend, and PostgreSQL services. Uses service hostnames for inter-container communication.
