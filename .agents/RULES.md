# Paldo Development Rules & Guidelines

*Note: These rules supplement the core instructions in `AGENTS.md`.*

## 1. Teaching & Pacing
- **Teach First:** Explain concepts, architecture, and security before writing code.
- **One Step at a Time:** Deliver one logical chunk, wait for confirmation.
- **Learner Types:** Do not edit user project code directly if possible; provide snippets and let the user type to build muscle memory.

## 2. Code Quality & Version Control
- **Branching:** Use `feature/module-name`. Never push directly to `main`.
- **Commits:** Atomic commits with concise conventional messages (feat, fix, refactor).
- **File Manifest:** Always list affected files per commit.

## 3. Security
- **RBAC:** Use explicit roles for `[Authorize]`.
- **DTOs:** Never trust client-provided state fields (e.g., status, assignments). Override them in the backend based on auth context.
- **Query Isolation:** Filter EF Core queries by user claims to prevent data exposure.

## 4. Development Standards
- **Backend:** No unused using statements. Rely on injected services. Maintain unit tests for business logic.
- **Frontend:** Enforce responsive design and a11y standards.
- **Database:** Use EF Migrations. No manual schema edits.
