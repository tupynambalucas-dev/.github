# Technical Reference: GitHub Packages Visibility, Dynamic Lifecycle & Token Boundary Governance

**Classification**: Diataxis Reference (Information-Oriented)  
**Scope**: Enterprise Token Boundaries, Separation of Duties (SoD), and GitHub Packages (`npm.pkg.github.com`) Administration  
**Organization**: `tupynambalucas-dev`  
**Standard**: en-US Technical Specification (Strict Zero-Emoji Policy)

---

## 1. Subsystem Token Boundary Matrix

Within `tupynambalucas-dev`, authentication credentials follow strict Separation of Duties (SoD) aligned with upstream GitHub platform boundaries:

| Subsystem / Operation | Authorized Identity Principal | Secret / Token Source | Architectural Rationale |
| :--- | :--- | :--- | :--- |
| **Organization Control Plane** (Teams, RBAC, Repo Creation, Rulesets, Security Alerts) | Tier 1: `tupynambalucas-org-manager[bot]` (`5648756`) | `ORG_MANAGER_APP_ID` + `ORG_MANAGER_APP_PRIVATE_KEY` (`getOctokitClient('org-manager')`) | Sovereign administrative authority restricted strictly to `@tupynambalucas-dev/mcp-github-org`. Never used for routine code PRs or CI workflow triggers. |
| **CI/CD Git, PR, Release & Cascade Workflows** (`renovate.yml`, `renderer-generate.yml`, `deploy-docs.yaml`, `release.yml`) | Tier 2: `tupynambalucas-ci-bot[bot]` (`5650100`) | `CI_BOT_APP_ID` + `CI_BOT_APP_PRIVATE_KEY` (`actions/create-github-app-token` / `getOctokitClient('ci-bot')`) | Mints 1-hour installation tokens capable of pushing signed commits/tags, opening/approving automated PRs, and triggering downstream workflow cascades without administrative blast radius. |
| **Interactive Developer Git & PR Flow** (`gh pr create`, `gh pr merge`, `@tupynambalucas-dev/mcp-github-flow`) | Tier 3: Human Engineer (`tupynambalucas`) / `tupynambalucas-developer-tools` (`5650238`) | `gh auth token` / OAuth 2.0 Device Flow (`getOctokitClient('developer-tools')`) | Ensures all code commits, PR merges, and resulting `push` workflow runs (`github.actor`) are attributed to the responsible human engineer. |
| **GitHub Packages Registry & Granular Package Purge** (`npm.pkg.github.com`, `publish.yml`, `admin-packages.yml`) | Native Repository Runner (`github-actions[bot]`) | `secrets.GITHUB_TOKEN` (`permissions: packages: write`) | GitHub Packages `npm.pkg.github.com` does not support GitHub App installation tokens (`ghs_*`). Publishing via `secrets.GITHUB_TOKEN` grants the repository native `admin` permission on its packages. |

---

## 2. Separation of Duties (SoD) & Workflow Actor Attribution (`github.actor`)

### 2.1 Why `org-manager` Must Never Trigger Routine Code Merges or CI Runs
In GitHub Actions, the actor displayed beside a workflow execution (`github.actor` / *"Triggered by ..."*) reflects the identity that performed the triggering event (such as merging a pull request into `main` or invoking `workflow_dispatch`).

To maintain clean audit logs and strict Separation of Duties:
1. **No-Privilege-Escalation Fallback Invariant**:
   In [`@tupynambalucas-dev/mcp-core-github`](../../../agent-mesh/mcp/core/github/src/auth/github-app.auth.ts), `getOctokitClient(tier)` isolates Tier 1 (`'org-manager'`) so that lower-privilege tiers (`'developer-tools'`, `'ci-bot'`, `'auto'`) **never** fall back to `createOrgManagerOctokit()`.
2. **Pull Request Creation, Review, and Merge Attribution**:
   - Developers open pull requests using `gh pr create` (attributed to `tupynambalucas`).
   - Under the `enterprise-production-main` ruleset (`require_last_push_approval: true`, `OrganizationAdmin` `bypass_mode: "pull_request"`), merges are executed either:
     - After automated compliance review by `tupynambalucas-ci-bot[bot]` followed by `gh pr merge --squash --delete-branch`, or
     - Directly by the Organization Owner via `gh pr merge <number> --squash --delete-branch --admin`.
   - Consequently, resulting `push` workflows on `main` are always attributed to **`tupynambalucas`** (or **`tupynambalucas-ci-bot[bot]`** for automated delivery pipelines), never `tupynambalucas-org-manager[bot]`.

---

## 3. GitHub Packages Public Visibility Governance (`npm.pkg.github.com`)

### 3.1 Organization-Level Public Creation Prerequisite
By default, GitHub Organizations restrict granular package creation to `private`. Even when `pnpm -r publish --access public` is executed from a public repository (`agent-mesh`), `npm.pkg.github.com` initializes new packages as `private` unless public creation is enabled at the organization level.

To ensure all newly published packages honor `--access public` automatically:
1. Navigate to `https://github.com/organizations/tupynambalucas-dev/settings/packages` (**Organization Settings -> Packages**).
2. Under **Package Creation**, enable **Public** and save.

### 3.2 Bulk Visibility Transition Without Version Bumps (`force_republish: true`)
GitHub does not expose a `PATCH` REST/GraphQL endpoint to toggle existing packages from `private` to `public` because making a package `public` on GitHub Packages is irreversible and locks API deletion once any version exceeds 5,000 downloads.

When transitioning existing `private` packages (under 5,000 downloads) to `public` in bulk after enabling **Package Creation -> Public**:
1. Dispatch [`agent-mesh/.github/workflows/publish.yml`](../../../agent-mesh/.github/workflows/publish.yml) with `force_republish: true`.
2. The workflow executes `node .github/scripts/manage-packages.js` with `ADMIN_ACTION: purge-all`, deleting all existing `private` package records via `DELETE /orgs/tupynambalucas-dev/packages/npm/{shortName}` using `secrets.GITHUB_TOKEN`.
3. The workflow immediately executes `pnpm run packages:publish` (`pnpm -r publish --access public --no-git-checks --report-summary` followed by `node ./scripts/publish-root.cjs`), recreating all workspace packages and the root umbrella package at their current versions with **`visibility: public`**.

### 3.3 Read Access Authentication Requirement for Public Packages (`npm.pkg.github.com`)
Unlike `registry.npmjs.org`, GitHub Packages (`npm.pkg.github.com`) enforces authentication even for `public` packages. Any consumer attempting to fetch `@tupynambalucas-dev/*` packages via npm or pnpm must provide a Personal Access Token (classic with `read:packages` or fine-grained with read access to repository packages) or a valid GitHub Actions `GITHUB_TOKEN`:

```ini
# ~/.npmrc or project .npmrc
@tupynambalucas-dev:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

Without an authenticated token, npm and pnpm requests to `npm.pkg.github.com` return `401 Unauthorized` or `404 Not Found`.

### 3.4 Zero-Token Git Package Distribution & Committed MCP Bundles
To decouple external services and automated agents from external package registry tokens, `@tupynambalucas-dev/agent-mesh` supports direct Git consumption as an enterprise alternative to GitHub Packages:

```yaml
# pnpm-workspace.yaml
catalogs:
  plugins-stack:
    '@tupynambalucas-dev/agent-mesh': 'github:tupynambalucas-dev/agent-mesh'
```

Under this model:
- **No Token Overhead**: Any developer or CI runner with Git access to the public repository can install dependencies without configuring `.npmrc` authentication tokens.
- **Committed MCP Bundles Invariant**: All 8 MCP servers track their standalone CommonJS bundles (`dist/bin.cjs` and `dist/index.cjs`) in Git via `!mcp/servers/*/dist/`. Downstream consumers (`omnichannel`, `platform`, `docs`) execute MCP tools immediately with zero build steps and zero missing-dependency failures.

---

## 4. Zero-Declaration Dynamic Obsolete Package Reconciliation

To allow packages in `agent-mesh` (`mcp/servers/*`, `mcp/core/*`, `plugins/packages/*`, `plugins/core/*`) to be added, renamed, or removed continuously without maintaining static lists of deprecated package names in `.github/scripts/manage-packages.js`:

1. **Full History Checkout (`fetch-depth: 0`)**:
   Both `publish.yml` and `admin-packages.yml` check out the repository with `fetch-depth: 0`.
2. **Dual-Source Package Discovery**:
   - **Organization Listing (`GET /orgs/tupynambalucas-dev/packages?package_type=npm`)**: Returns all `public` npm packages in the organization directly to `secrets.GITHUB_TOKEN`.
   - **Git Commit History Discovery (`getHistoricalPackagesFromGit`)**: Executes `git log --all -p -- "**/package.json" "package.json"` and extracts every `"name": "@tupynambalucas-dev/<shortName>"` ever committed across the repository's history, probing `GET /orgs/tupynambalucas-dev/packages/npm/{shortName}` to catch any legacy `private` packages.
3. **Automated Purge (`purge-obsolete`)**:
   Every remote package whose unscoped short name is absent from `getActivePackages()` (the active workspace tree at `HEAD`) is automatically deleted via `DELETE /orgs/tupynambalucas-dev/packages/npm/{shortName}` (`204 No Content`) prior to `pnpm run packages:publish`.

---

## 5. Canonical Upstream Sources

- [Configuring a package's access control and visibility - GitHub Docs](https://docs.github.com/en/packages/learn-github-packages/configuring-a-packages-access-control-and-visibility)
- [Working with the npm registry - GitHub Docs](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry)
- [Deleting and restoring a package - GitHub Docs](https://docs.github.com/en/packages/learn-github-packages/deleting-and-restoring-a-package)
- [REST API endpoints for packages - GitHub Docs](https://docs.github.com/en/rest/packages/packages?apiVersion=2026-03-10)

---

## 6. Navigation

- [Parent Reference Index](../README.md)
- [Reference: GitHub Apps Catalog and Credentials](./github-apps-catalog-and-credentials.md)
- [Reference: Actions Workflows and CI Governance](./actions-workflows-and-ci-governance.md)
- [Explanation: Three-Tier GitHub App Identity Architecture](../explanation/github-app-identity-architecture.md)
