# Organization-Wide .github Directory Standardization & Plugin Architecture Plan

## Executive Summary

This architectural plan defines the enterprise standard for `.github` directory structures across all repositories within the `tupynambalucas-dev` organization (`.github`, `agent-mesh`, `platform`, `docs`, and `gh-tl`). It establishes clear rules governing GitHub native organizational inheritance, repository-level overrides, workflow structures, and code ownership. Furthermore, it defines the plugin expansion strategy within `agent-mesh`, adding the `github-standards-architect` skill to `@tupynambalucas-dev/plugin-repo` to programmatically govern, scaffold, and audit `.github` structures across the organization.

---

## 1. Deep Dive: Package Publishing Script (`publish-packages.js`)

### 1.1 Purpose and Architectural Rationale

The script [`agent-mesh/scripts/publish-packages.js`](file:///C:/Users/tupyn/projects/organizations/tupynambalucas-dev/org-core/agent-mesh/scripts/publish-packages.js) is an idempotent publishing controller designed for monorepos distributing multiple packages to GitHub Packages (`npm.pkg.github.com`).

```
                    +------------------------------------+
                    |  agent-mesh/scripts/publish.yml    |
                    +-----------------+------------------+
                                      |
                                      v
                    +------------------------------------+
                    |    scripts/publish-packages.js     |
                    +-----------------+------------------+
                                      |
                     Iterates packages in order:
                     1. mcp/packages/*
                     2. plugins/packages/*
                                      |
            +-------------------------+-------------------------+
            |                                                   |
            v                                                   v
+-----------------------+                           +-----------------------+
| npm view <pkg>@<ver>  |                           | npm view <pkg>@<ver>  |
| returns 0 (Found)     |                           | returns non-zero (404)|
+-----------+-----------+                           +-----------+-----------+
            |                                                   |
            v                                                   v
   [SKIP: Already Pub]                                 [EXEC: pnpm publish]
   Exit code 0                                         Auth via NODE_AUTH_TOKEN
```

### 1.2 Key Mechanics

1. **Topological Order Execution**:
   Publishes shared MCP core servers first (`mcp/packages/*`), followed by plugin distributions (`plugins/packages/*`), ensuring downstream dependencies exist in the registry before consuming packages are published.

2. **Pre-flight Existence Verification**:
   Before invoking `pnpm publish`, the script runs:
   ```bash
   npm view <packageName>@<version> version --registry=https://npm.pkg.github.com
   ```
   - If the version already exists in the GitHub Packages registry, the script logs `Skipping <pkg>@<ver> (already published)` and exits cleanly.
   - If the version does not exist, it proceeds to publish.

3. **Prevention of CI Pipeline Crashes**:
   GitHub Packages strictly rejects republishing an existing semantic version with HTTP 403 / 409 conflict errors. In a monorepo where only one package was bumped (e.g. `plugin-web` bumped to `1.0.1` while `plugin-repo` remains `1.0.0`), a naive `pnpm -r publish` fails the entire CI pipeline when encountering the unchanged packages. `publish-packages.js` guarantees idempotency.

4. **Authentication (`NODE_AUTH_TOKEN`)**:
   Consumes `process.env.NODE_AUTH_TOKEN`, supplied in CI by `secrets.GITHUB_TOKEN` with `packages: write` permissions, mapped through `.npmrc`:
   ```ini
   @tupynambalucas-dev:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
   ```

---

## 2. GitHub Organizational Inheritance vs. Shadowing Analysis

Based on official GitHub platform specifications and enterprise repository audits, `.github` assets fall into three distinct operational behaviors:

### 2.1 Asset Behavior Matrix

| Asset | Location in `tupynambalucas-dev/.github` | Inherited by Child Repos? | Behavior When Local File Exists in Child Repo |
| :--- | :--- | :--- | :--- |
| **Community Health Files** (`CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`, `SECURITY.md`, `SUPPORT.md`) | Repository Root or `.github/` | **YES** (Automatic Fallback) | Local file overrides (shadows) organization default. |
| **Issue Forms & Templates** (`.github/ISSUE_TEMPLATE/*.yml`) | `.github/ISSUE_TEMPLATE/` | **YES** (If child repo has NO issue templates) | **SHADOW TRAP**: If child repo has *any* template in `.github/ISSUE_TEMPLATE/`, GitHub suppresses **ALL** org-level issue templates. |
| **Pull Request Template** (`.github/PULL_REQUEST_TEMPLATE.md`) | `.github/PULL_REQUEST_TEMPLATE.md` | **YES** (Automatic Fallback) | Local file in child repo overrides org template. |
| **Code Ownership** (`CODEOWNERS`) | `.github/CODEOWNERS` | **NO** (Strictly Per-Repository) | GitHub ignores org-level `CODEOWNERS`. Every repository **MUST** define its own local `CODEOWNERS`. |
| **Dependabot Config** (`dependabot.yml`) | `.github/dependabot.yml` | **NO** (Per-Repository) | Must be defined locally in every repository containing package dependencies. |
| **Workflows & Actions** (`workflows/*.yml`, `actions/*`) | `.github/workflows/` | **NO** (Per-Repository) | Must be defined locally or invoked via reusable workflow syntax (`uses: org/.github/...@main`). |

### 2.2 The Shadowing Anti-Pattern (Audit Finding)

In the current workspace:
- `tupynambalucas-dev/.github` declares modern, structured YAML Issue Forms (`bug_report.yml`, `feature_request.yml`) and configuration (`config.yml`).
- `platform/.github/ISSUE_TEMPLATE/` declared legacy Markdown templates (`bug_report.md`, `feature_request.md`).
- **Consequence**: Users opening issues on `platform` were served outdated Markdown templates, completely blinding them to the organization's standardized YAML Issue Forms.

**Standard Policy**: Child repositories MUST NOT define local `.github/ISSUE_TEMPLATE/` directories unless they require bespoke, domain-specific forms that cannot be served by the organization defaults.

### 2.3 The CODEOWNERS Gap (Audit Finding)

`CODEOWNERS` is evaluated strictly within the boundaries of each repository.
Currently:
- `platform/.github/CODEOWNERS` exists.
- `agent-mesh/.github/CODEOWNERS` is **MISSING**.
- `docs/.github/CODEOWNERS` is **MISSING**.
- `gh-tl/.github/CODEOWNERS` is **MISSING**.

**Standard Policy**: Every repository across the organization MUST define `.github/CODEOWNERS` mapping critical paths to `@tupynambalucas-dev/core-maintainers`.

---

## 3. Organization-Wide .github Directory Taxonomy

### 3.1 Taxonomy Matrix by Repository Type

```
                                      Organization Repositories
                                                  |
           +--------------------------------------+--------------------------------------+
           |                                      |                                      |
           v                                      v                                      v
  [Governance Hub]                       [Monorepos]                             [Tooling / CLI]
  Repo: .github                          Repos: platform, agent-mesh, docs       Repo: gh-tl
  - profile/README.md                    - .github/CODEOWNERS                    - .github/CODEOWNERS
  - .github/ISSUE_TEMPLATE/*.yml         - .github/dependabot.yml                - .github/dependabot.yml
  - .github/PULL_REQUEST_TEMPLATE.md     - .github/workflows/*.yml               - .github/workflows/*.yml
  - .github/workflows/*.yml              - .github/actions/ (if reusable)
  - Community Health (root)              - NO local ISSUE_TEMPLATE/
```

### 3.2 Canonical Directory Specifications

#### Type A: Governance Repository (`tupynambalucas-dev/.github`)
```
.github/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.yml          # Structured YAML form
│   │   ├── config.yml              # Contact links, blank issues toggle
│   │   └── feature_request.yml     # Structured YAML form
│   ├── PULL_REQUEST_TEMPLATE.md    # Canonical PR template for entire org
│   └── workflows/
│       ├── labeler.yml             # Automatic issue/PR triage
│       └── organization-sync.yml   # Global health checks
├── profile/
│   └── README.md                   # Public organization profile overview
├── CODE_OF_CONDUCT.md              # Organization-wide default
├── CONTRIBUTING.md                 # Organization-wide default
├── SECURITY.md                     # Organization-wide default
├── SUPPORT.md                      # Organization-wide default
├── LICENSE                         # Apache-2.0
└── README.md                       # Governance runbook
```

#### Type B: Monorepos (`platform`, `agent-mesh`, `docs`)
```
<repo-root>/
├── .github/
│   ├── CODEOWNERS                  # Mandatory: Team code ownership mappings
│   ├── dependabot.yml              # Mandatory: Ecosystem update automation
│   ├── actions/                    # Optional: In-tree composite actions
│   │   └── setup-pnpm-env/action.yml
│   └── workflows/                  # Mandatory: CI, CD, Security, CodeQL
│       ├── ci.yml
│       ├── codeql.yml
│       └── publish.yml
├── LICENSE                         # Mandatory: Local Apache-2.0 license
├── README.md                       # Mandatory: Root architectural overview
└── AGENTS.md                       # Mandatory: Root context router
```

#### Type C: Standalone Tools / CLI (`gh-tl`)
```
gh-tl/
├── .github/
│   ├── CODEOWNERS                  # Mandatory: Team code ownership mappings
│   ├── dependabot.yml              # Mandatory: Go/npm ecosystem updates
│   └── workflows/                  # Mandatory: Test, Release, GoReleaser
│       ├── test.yml
│       ├── release.yml
│       └── codeql.yml
├── LICENSE                         # Mandatory: Apache-2.0
├── README.md                       # Mandatory: Tool documentation
└── AGENTS.md                       # Mandatory: Context router
```

---

## 4. Standard File Content Models

### 4.1 Standard `.github/CODEOWNERS`
```ini
# Global owners for all files in this repository
* @tupynambalucas-dev/core-maintainers

# Security critical configurations
/.github/workflows/ @tupynambalucas-dev/core-maintainers
/pnpm-lock.yaml @tupynambalucas-dev/core-maintainers
/package.json @tupynambalucas-dev/core-maintainers
```

### 4.2 Standard `.github/dependabot.yml` (For pnpm Monorepos)
```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
      time: "06:00"
      timezone: "America/Sao_Paulo"
    open-pull-requests-limit: 10
    commit-message:
      prefix: "chore"
      prefix-development: "chore"
      include: "scope"
    groups:
      dependencies:
        patterns:
          - "*"

  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
      time: "06:00"
      timezone: "America/Sao_Paulo"
    open-pull-requests-limit: 5
    commit-message:
      prefix: "ci"
      include: "scope"
```

### 4.3 Standard Reusable Composite Action (`.github/actions/setup-pnpm-env/action.yml`)
Standardizes pnpm store caching, Node version resolution, and lockfile validation across monorepos:
```yaml
name: "Setup Node.js & pnpm"
description: "Configures Node.js, pnpm binary, and global virtual store caching"

inputs:
  node-version:
    description: "Node.js runtime version"
    required: false
    default: "22"
  pnpm-version:
    description: "pnpm package manager version"
    required: false
    default: "9"

runs:
  using: "composite"
  steps:
    - name: Install pnpm
      uses: pnpm/action-setup@v4
      with:
        version: ${{ inputs.pnpm-version }}

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ inputs.node-version }}
        cache: "pnpm"

    - name: Get pnpm store directory
      shell: bash
      run: echo "STORE_PATH=$(pnpm store path --silent)" >> $GITHUB_ENV

    - name: Setup pnpm cache
      uses: actions/cache@v4
      with:
        path: ${{ env.STORE_PATH }}
        key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
        restore-keys: |
          ${{ runner.os }}-pnpm-store-
```

---

## 5. Plugin Architecture: Expansion of `@tupynambalucas-dev/plugin-repo`

### 5.1 Plugin Strategy Evaluation

Three implementation paths were analyzed to maintain `.github` directory standards across the organization:

| Option | Architecture | Evaluation |
| :--- | :--- | :--- |
| **Option 1: New Dedicated Plugin** (`@tupynambalucas-dev/plugin-github-structure`) | Create an isolated package in `agent-mesh/plugins/packages/github-structure`. | **Rejected**: Violates Anti-Proliferation governance. The workspace already maintains 10 plugins. Adding another plugin adds package boilerplate and overhead for managing in-repo static files. |
| **Option 2: Expand `plugin-github-org`** | Add skills to `@tupynambalucas-dev/plugin-github-org`. | **Rejected**: Domain boundary mismatch. `plugin-github-org` is explicitly bounded to remote GitHub REST/GraphQL API interactions (teams, RBAC, branch protection rulesets, org webhooks). It does not manage local filesystem repository assets. |
| **Option 3: Expand `plugin-repo` (Recommended)** | Add `github-standards-architect` to `@tupynambalucas-dev/plugin-repo`. | **Selected**: Perfect cohesion. `plugin-repo` is already the designated bounded context for local repository assets (`README.md`, `LICENSE.md`, `CONTRIBUTING.md`, `pnpm-workspace.yaml`, `tsconfig*.json`). Managing `.github/` folder taxonomy is a direct extension of its repository governance mandate. |

### 5.2 Skill Definition: `github-standards-architect`

The skill will be implemented at:
[`agent-mesh/plugins/packages/repo/skills/github-standards-architect/SKILL.md`](file:///C:/Users/tupyn/projects/organizations/tupynambalucas-dev/org-core/agent-mesh/plugins/packages/repo/skills/github-standards-architect/SKILL.md)

#### Skill Frontmatter & Capabilities:
```yaml
---
name: github-standards-architect
description: Audits, scaffolds, and standardizes .github directories, CODEOWNERS, dependabot.yml, composite actions, and GitHub Actions workflows across organization repositories.
---
```

#### Responsibilities:
1. **Audit Organization Repositories**:
   Scans `.github` folders across `.github`, `agent-mesh`, `platform`, `docs`, and `gh-tl`. Identifies missing `CODEOWNERS`, redundant/shadowing `ISSUE_TEMPLATE` files, and outdated workflow configurations.
2. **Scaffold Canonical Files**:
   Generates standard `.github/CODEOWNERS`, `.github/dependabot.yml`, and `.github/actions/setup-pnpm-env/action.yml`.
3. **Enforce Shadowing Isolation**:
   Removes redundant local issue templates from child monorepos to ensure seamless inheritance of the organization-level YAML issue forms in `tupynambalucas-dev/.github`.
4. **Synchronize Composite Actions**:
   Provides uniform Node/pnpm caching across all monorepos, reducing CI runtimes and cache misses.

### 5.3 Modifications to Existing Files in `plugin-repo`

1. **`agent-mesh/plugins/packages/repo/package.json`**:
   No new dependencies required; leverages standard node filesystem utilities.
2. **`agent-mesh/plugins/packages/repo/plugin.json`**:
   Add `github-standards-architect` to the plugin manifest `skills` list.
3. **`agent-mesh/plugins/packages/repo/rules/AGENTS.md`**:
   Add rule item specifying autonomous enforcement of `.github` directory taxonomy and mandatory local `CODEOWNERS`.
4. **`agent-mesh/plugins/packages/repo/README.md`**:
   Document the new skill in the skills table and usage examples.

---

## 6. Execution Roadmap & Milestones

```
+-----------------------------------------------------------------------------------+
| Milestone 1: Plugin Extension                                                     |
| - Implement skills/github-standards-architect/SKILL.md in plugin-repo           |
| - Update plugin.json, rules/AGENTS.md, and README.md in plugin-repo               |
| - Validate with pnpm typecheck and tests                                          |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
| Milestone 2: Immediate Repository Alignment                                      |
| - agent-mesh: Add .github/CODEOWNERS and .github/actions/setup-pnpm-env            |
| - docs: Add .github/CODEOWNERS                                                    |
| - gh-tl: Add .github/CODEOWNERS                                                   |
| - platform: Align .github/ISSUE_TEMPLATE/ to eliminate shadowing                  |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
| Milestone 3: CI/CD Pipeline Modernization                                         |
| - Update agent-mesh/.github/workflows/ci.yml to use composite action              |
| - Verify clean run across all monorepos                                           |
+-----------------------------------------------------------------------------------+
```

---

## 7. Verification & Compliance Criteria

1. **Zero-Emoji Compliance**: No emoji icons anywhere in documentation, configs, or commit logs.
2. **Commit Signature Compliance**: All commits and tags signed via SSH (`git commit -S`).
3. **Code Ownership Verification**: Running `gh codeowners verify` (or checking GitHub PR reviews) automatically assigns `@tupynambalucas-dev/core-maintainers` on all files across all 5 repositories.
4. **Template Inheritance Verification**: Visiting the `/issues/new/choose` endpoint on any repository displays the global YAML forms from `tupynambalucas-dev/.github` without shadow suppression.
