# Organization-Wide .github Directory Standardization & Plugin Architecture Plan

## Executive Summary

This architectural plan defines the enterprise standard for `.github` directory structures across all repositories within the `tupynambalucas-dev` organization (`.github`, `agent-mesh`, `platform`, `docs`, and `gh-tl`). It establishes clear rules governing GitHub native organizational inheritance, repository-level overrides, workflow structures, and code ownership. 

Furthermore, this plan provides an exhaustive operational analysis of the package release lifecycle in `agent-mesh`: the relationship between [`publish-packages.js`](file:///C:/Users/tupyn/projects/organizations/tupynambalucas-dev/org-core/agent-mesh/scripts/publish-packages.js), `@changesets/cli`, and pnpm native release management (`pnpm version -r`), as well as the governance model for renaming, deprecating, and deleting legacy packages on GitHub Packages.

Finally, it defines the plugin expansion strategy within `agent-mesh`, adding the `github-standards-architect` skill to `@tupynambalucas-dev/plugin-repo` to programmatically govern, scaffold, and audit `.github` structures across the organization.

---

## 1. Deep Dive: Package Release Management & Registry Governance

### 1.1 Purpose and Architecture of `publish-packages.js`

The script [`agent-mesh/scripts/publish-packages.js`](file:///C:/Users/tupyn/projects/organizations/tupynambalucas-dev/org-core/agent-mesh/scripts/publish-packages.js) is an idempotent publishing controller designed for monorepos distributing multiple packages to GitHub Packages (`npm.pkg.github.com`).

```
                    +------------------------------------+
                    |  agent-mesh/.github/workflows/     |
                    |            publish.yml             |
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

#### Key Operational Mechanics:
1. **Topological Order Execution**: Publishes shared MCP core servers first (`mcp/packages/*`), followed by plugin distributions (`plugins/packages/*`), ensuring downstream dependencies exist in the registry before consuming packages are published.
2. **Pre-flight Existence Verification**: Queries `npm view <packageName>@<version> version --registry=https://npm.pkg.github.com`. If the version exists, it cleanly skips.
3. **Prevention of CI Pipeline Crashes**: GitHub Packages strictly rejects republishing an existing semantic version with HTTP 403 / 409 conflict errors. In a monorepo where only one package was bumped (e.g. `plugin-web` bumped to `1.0.1` while `plugin-repo` remains `1.0.0`), a naive `pnpm -r publish` fails the entire CI pipeline when encountering the unchanged packages. `publish-packages.js` guarantees idempotency.
4. **Authentication via `NODE_AUTH_TOKEN`**: Consumes `process.env.NODE_AUTH_TOKEN`, supplied in CI by `secrets.GITHUB_TOKEN` with `packages: write` permissions.

---

### 1.2 Relationship Between `publish-packages.js` and `.changeset`

Currently in `agent-mesh`, there is an **architectural disconnect** between `.changeset` and `publish-packages.js`:

```
Current Disconnected State:
[Developer edits package.json manually] ---> [git push main] ---> [publish.yml] ---> [publish-packages.js]
                                                                        |
[.changeset/config.json exists, but is unused in CI] <-----------------+ (Disconnected)
```

#### How They Influence Each Other Architecturally:
- **`.changeset` (Version & Changelog Intent)**:
  - `.changeset` is responsible for **capturing change intent during development**.
  - When developers create features or bugfixes, they generate a markdown file (e.g., `.changeset/calm-cats-resolve.md`) specifying which packages are affected, whether the bump is `major`, `minor`, or `patch`, and the summary message.
  - When release time arrives, the versioning engine consumes these intents, bumps `package.json` across packages, updates internal dependency ranges (`updateInternalDependencies: patch`), and writes `CHANGELOG.md`.
- **`publish-packages.js` (Registry Delivery Execution)**:
  - `publish-packages.js` operates **downstream** of versioning. It does not decide versions; it delivers already-bumped packages to GitHub Packages safely without failing on unchanged packages.
- **The Ideal Interaction**:
  - In an automated enterprise pipeline, Changesets or pnpm native release management orchestrates the version bumps and changelogs, while `publish-packages.js` (or native `pnpm publish -r`) executes the final registry push.

---

### 1.3 pnpm Native Release Management (`pnpm version -r`) vs. Changesets

Based on official documentation (`https://pnpm.io/versioning`), pnpm (v10+) includes **native release management** that directly consumes the `.changeset/` format without requiring `@changesets/cli`:

```
pnpm Native Release Architecture:
1. Development:  pnpm change          --> Generates .changeset/<slug>.md
2. Validation:   pnpm change status   --> Previews planned bumps and affected dependents
3. Release:      pnpm version -r      --> Bumps versions, resolves dependencies, writes ledger
4. Delivery:     pnpm publish -r      --> Publishes to npm / GitHub Packages
```

#### Key Capabilities of pnpm Native Release Management:
1. **The Ledger (`.changeset/ledger.yaml`)**:
   `pnpm version -r` records consumed intents in a committed, append-only file (`.changeset/ledger.yaml`). An intent file is deleted only once every project it names has released. This makes cherry-picks and merge-backs between release branches completely safe.
2. **First Release Registry Detection**:
   When a new package debuts, `pnpm version -r` queries the registry. If the package has never been published, it publishes the initial manifest version verbatim rather than advancing it immediately.
3. **Fixed Groups & Epics (`pnpm-workspace.yaml`)**:
   Enables locking packages to shared versions (`versioning.fixed`) or binding major versions to a lead package (`versioning.epics`).
4. **CI Drift Prevention**:
   Running `pnpm change check` in CI catches unauthorized version drift before code merges into `main`.

#### Comparative Evaluation:

| Criterion | `@changesets/cli` + Action | pnpm Native (`pnpm version -r`) | `semantic-release` (Monorepo) |
| :--- | :--- | :--- | :--- |
| **Monorepo Cohesion** | High (Industry standard) | Native (Zero extra dependencies) | Low (Brittle in monorepos) |
| **Automated PR Flow** | Yes (`changesets/action` creates Version PR) | Manual or requires custom GH Action | Yes (Fully automated on branch) |
| **Git Ledger / Cherry-picks** | No (Intents deleted immediately) | Yes (`ledger.yaml` prevents duplicate runs) | No |
| **GitHub Packages Idempotency**| Requires custom publish script | Built-in registry verification | Requires registry plugins |
| **Enterprise Fit** | Ideal for team PR collaboration | Ideal for lean CI/CD and Turborepo | Fragile with multi-package changes |

---

### 1.4 Governance of Renamed, Deprecated, and Deleted Packages

During the evolution of `agent-mesh`, several packages were renamed (e.g. `@tupynambalucas-dev/agent-toolkit` renamed to `@tupynambalucas-dev/agent-mesh`, and experimental plugins like `plugin-git-flow` replaced by `plugin-github-flow`). These historical artifacts remain visible in the GitHub Packages registry.

#### 1.4.1 Can the Publish Workflow Automatically Delete Packages?
**NO.** Running automated package deletion inside `publish.yml` is an anti-pattern and poses severe supply-chain risks:
1. **Safety Hazard**: If a build fails, a filter is misconfigured, or a branch temporarily excludes a package, an automated deletion script would wipe production registry packages.
2. **Permission Barrier**: In GitHub Actions, the default `GITHUB_TOKEN` only has `packages: write` (and `contents: read`). Deleting packages requires administrative permissions and the `delete:packages` scope, which `GITHUB_TOKEN` does not possess.
3. **The 5,000 Download Hard Boundary**: GitHub REST API permanently blocks deleting any public package where any version has more than 5,000 downloads (to prevent "left-pad" breaking changes).

#### 1.4.2 Official GitHub Packages REST API Capabilities
GitHub provides explicit REST endpoints for package lifecycle management:

- **List Organization Packages**:
  ```http
  GET /orgs/{org}/packages?package_type=npm
  Accept: application/vnd.github+json
  ```
- **Delete an Entire Package**:
  ```http
  DELETE /orgs/{org}/packages/npm/{package_name}
  Accept: application/vnd.github+json
  ```
  *Requirements*: Token with `read:packages` and `delete:packages` scopes; admin role in the organization. Returns `204 No Content`.
- **Restore a Deleted Package**:
  ```http
  POST /orgs/{org}/packages/npm/{package_name}/restore
  ```
  *Capability*: Can restore deleted packages within 30 days of deletion.

#### 1.4.3 Two-Tier Enterprise Strategy: Deletion vs. Deprecation

```
                               Package Governance Decision
                                            |
                    +-----------------------+-----------------------+
                    |                                               |
                    v                                               v
       [Internal Ghost Packages]                        [Publicly Consumed Packages]
       - 0 external downloads                           - Active external consumers
       - Renamed during early dev                       - Downstream dependency locks
                    |                                               |
                    v                                               v
        [Hard Deletion via API]                         [Supply Chain Deprecation]
        DELETE /orgs/{org}/packages/npm/...             npm deprecate <pkg> "Renamed..."
```

1. **Tier 1: Administrative Hard Deletion for Internal Ghost Packages**:
   - For internal packages that were renamed and have no active downstream consumers (such as old test plugins or `agent-toolkit`), hard deletion via the GitHub REST API is safe, eliminates catalog clutter, and removes security surface area.
   - **Operational Mechanism**: Executed via an administrative maintenance script [`scripts/manage-legacy-packages.js`](file:///C:/Users/tupyn/projects/organizations/tupynambalucas-dev/org-core/agent-mesh/scripts/) invoked manually or through an admin workflow (`admin-packages.yml` with `workflow_dispatch`), authenticated with an administrative token.

2. **Tier 2: Supply-Chain Deprecation (`npm deprecate`)**:
   - For packages that have external consumers, hard deletion breaks downstream package manager locks (`ERR_PNPM_FETCH_404`).
   - The enterprise standard is to deprecate the package:
     ```bash
     npm deprecate @tupynambalucas-dev/<old-package> "Package renamed to @tupynambalucas-dev/<new-package>. Please update your package.json dependencies."
     ```
   - This keeps existing locks functional while issuing visual warnings in npm/pnpm CLI on install and marking the package as deprecated in the GitHub Packages UI.

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
│       ├── publish.yml
│       └── admin-packages.yml      # Optional: Administrative package maintenance
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
    default: "10.33.2"

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
1. **Audit Organization Repositories**: Scans `.github` folders across `.github`, `agent-mesh`, `platform`, `docs`, and `gh-tl`. Identifies missing `CODEOWNERS`, redundant/shadowing `ISSUE_TEMPLATE` files, and outdated workflow configurations.
2. **Scaffold Canonical Files**: Generates standard `.github/CODEOWNERS`, `.github/dependabot.yml`, and `.github/actions/setup-pnpm-env/action.yml`.
3. **Enforce Shadowing Isolation**: Removes redundant local issue templates from child monorepos to ensure seamless inheritance of the organization-level YAML issue forms in `tupynambalucas-dev/.github`.
4. **Synchronize Composite Actions**: Provides uniform Node/pnpm caching across all monorepos, reducing CI runtimes and cache misses.

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
| - Author admin-packages.js maintenance tool for legacy package cleanup             |
| - Verify clean run across all monorepos                                           |
+-----------------------------------------------------------------------------------+
```

---

## 7. Verification & Compliance Criteria

1. **Zero-Emoji Compliance**: No emoji icons anywhere in documentation, configs, or commit logs.
2. **Commit Signature Compliance**: All commits and tags signed via SSH (`git commit -S`).
3. **Code Ownership Verification**: Running `gh codeowners verify` (or checking GitHub PR reviews) automatically assigns `@tupynambalucas-dev/core-maintainers` on all files across all 5 repositories.
4. **Template Inheritance Verification**: Visiting the `/issues/new/choose` endpoint on any repository displays the global YAML forms from `tupynambalucas-dev/.github` without shadow suppression.
5. **Registry Idempotency**: Running release workflows never produces HTTP 403 / 409 conflict errors on unmodified monorepo packages.
