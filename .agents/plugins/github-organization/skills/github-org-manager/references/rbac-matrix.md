# Organization RBAC Matrix and Role Specifications

This document defines the Role-Based Access Control (RBAC) matrix for the `tupynambalucas-dev`
organization and monorepo.

---

## 1. Functional Teams & Granular Roles

Access to repositories and services within the organization is managed through functional teams
rather than direct user bindings.

| Team Slug        | GitHub Permission | Equivalent Role | Scoped Workspace Directories             |
| :--------------- | :---------------- | :-------------- | :--------------------------------------- |
| `core-engineers` | `push`            | Write           | `corporate/`, `shared/`, `tools/`        |
| `infra-ops`      | `maintain`        | Maintain        | `k8s/`, `hub/observability/`, `.github/` |
| `creative-team`  | `push`            | Write           | `hub/studio/`, creative vector assets    |

---

## 2. Organization Fine-Grained PAT Permissions

When configuring a Fine-Grained Personal Access Token (PAT) for the organization, assign the
following scopes:

### Repository Permissions (`tupynambalucas-dev/tupynambalucas-dev`)

- **Administration**: `Read & Write`
- **Metadata**: `Read-only`
- **Contents**: `Read & Write`
- **Pull Requests**: `Read & Write`
- **Issues**: `Read & Write`
- **Actions**: `Read & Write`
- **Secrets**: `Read & Write`
- **Custom Properties**: `Read & Write`
- **Security Events**: `Read-only`

### Organization Permissions (`@tupynambalucas-dev`)

- **Members**: `Read & Write`
- **Secrets**: `Read & Write`
- **Administration**: `Read-only`
