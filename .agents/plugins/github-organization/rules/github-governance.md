# GitHub Organization Governance & Access Rules

> **CRITICAL AGENT INSTRUCTION (BRANCH SAFETY & STRICT RBAC):**
> Agents operating in this repository MUST strictly follow centralized GitHub organization governance.
> Direct pushes to `main` or `develop` are strictly prohibited. All code changes MUST be submitted via
> pull requests adhering to branch rulesets, cryptographic SSH commit signing, and functional team RBAC.

---

## 1. Branch Safety & Push Policies

1. **Direct Push Ban**: Agents MUST NEVER execute `git push` directly to protected branches (`main`, `develop`).
2. **Dedicated Feature Branches**: All changes must be authored on isolated branches adhering to the
   standard naming convention:
   - `feat/<feature-name>`
   - `fix/<issue-name>`
   - `chore/<task-name>`
   - `refactor/<scope-name>`
   - `docs/<subject-name>`
3. **Linear History**: Merge commits are forbidden on `main`. Pull requests must be merged using
   Squash and Merge or Rebase and Merge.

---

## 2. Commit Cryptography & Verification

1. **Mandatory SSH Commit Signing**: Every commit authored in the repository MUST be
   cryptographically signed using SSH (`git config --global commit.gpgsign true`). Unsigned commits
   fail branch ruleset validation.
2. **Conventional Commits**: Commit messages MUST comply with Conventional Commits specification:
   `^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\([a-z0-9\-]+\))?: .{1,100}`.

---

## 3. Model Context Protocol (`github-mcp`) Integration

The `github-organization` plugin provides the `github-mcp` server configured via `pnpm dlx`.

### Active Organization Identifiers

- **Organization Name**: `tupynambalucas-dev`
- **Monorepo Repository**: `tupynambalucas-dev/tupynambalucas`
- **Protected Branches**: `main` (production), `develop` (integration)
- **Target Functional Teams**: `@core-engineers`, `@infra-ops`, `@creative-team`

### Tool Execution Guidelines

- **Autonomous Tool Operations**: Use `github-mcp` tools for reading repository files, querying
  commits, managing issues, and creating pull requests.
- **Administrative Mutations**: Operations outside the MCP server schema (team creation, team member
  assignment, repository team RBAC binding, and Actions secrets) MUST be executed through the
  `github-org-manager` skill runbooks via `gh api` and `gh secret`.

---

## 4. Role-Based Access Control (RBAC) Taxonomy

Organization repository permissions are delegated strictly through functional teams:

1. **Base Permissions**: Repository base permissions across the organization must be configured
   to `none` (or `read-only`).
2. **Functional Team Delegation**:
   - `@tupynambalucas-dev/core-engineers`: Write permissions (`push`) for monorepo packages.
   - `@tupynambalucas-dev/infra-ops`: Maintainer permissions (`maintain`) for infrastructure and CI/CD.
   - `@tupynambalucas-dev/creative-team`: Write permissions (`push`) scoped to studio and brand assets.

---

## 5. Domain Partitioned Secrets Architecture

Secrets must be strictly segregated across operational domains:

1. **Cluster Domain (Infisical)**: All Kubernetes runtime credentials (MongoDB, Redis, JWT private
   keys, Cloudflared tunnel credentials) reside strictly in Infisical and are injected via the
   Infisical Kubernetes Operator.
2. **CI/CD Domain (GitHub Secrets)**: GitHub Actions build and deployment tokens (GHCR tokens,
   Cloudflare Pages tokens) reside strictly in GitHub Actions Secrets.
3. **Cross-Domain Ban**: Database master passwords and internal cluster service keys must NEVER be
   synced or mirrored into GitHub Actions.
