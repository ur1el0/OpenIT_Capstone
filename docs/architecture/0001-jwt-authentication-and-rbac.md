# 1. JWT Authentication and Role-Based Access Control (RBAC)

Date: 2026-08-19

## Status

Accepted

## Context

The Paldo (Barangay Scholarship System) requires secure endpoints for both standard applicants (Students) and administrators (Barangay Officials). We need a stateless, scalable way to authenticate users and ensure they only access authorized data.

## Decision

We will use JSON Web Tokens (JWT) for authentication and ASP.NET Core's built-in Role-Based Access Control (`[Authorize(Roles = "...")]`) for authorization.

- The `AuthService` will handle password hashing and generating the JWT.
- The React frontend will persist the token in `localStorage` and attach it to the `Authorization: Bearer <token>` header via a custom `apiRequest` wrapper.
- The React `AuthContext` will manage the session boundary and handle auto-logout on expiration.

## Consequences

- **Positive:** Stateless architecture allows the API to scale easily without managing session state in the database.
- **Positive:** Clear separation of concerns between the React client and the ASP.NET Core API.
- **Negative:** If a token is compromised, it remains valid until it expires. (Future mitigation: implement a Refresh Token rotation strategy or a token blacklist).
