# Organization-Wide .github Directory Standardization & Monorepo Release Architecture Plan

## Executive Summary

This architectural plan establishes the authoritative enterprise standard for `.github` directory structures across all repositories within the `tupynambalucas-dev` organization (`.github`, `agent-mesh`, `platform`, `docs`, and `gh-tl`). It defines clear governance for GitHub native organizational inheritance, repository-level overrides, workflow structures, and code ownership.

Furthermore, this plan delivers a comprehensive architectural review of the package release lifecycle in `agent-mesh`. Based on deep-dive audits of official documentation from [pnpm Release Management](https://pnpm.io/versioning), [pnpm Registries](https://pnpm.io/registries), [pnpm Registry Revisions](https://pnpm.io/registry-revisions), [pnpm Publish CLI](https://pnpm.io/cli/publish), [Turborepo Publishing Guides](https://turborepo.dev/docs/guides/publishing-libraries), and [GitHub Packages REST API](https://docs.github.com/en/rest/packages/packages), this document provides:
1. **The Deprecation and Elimination Strategy for Custom Scripts**: Proves why [`agent-mesh/scripts/publish-packages.js`](file:///C:/Users/tupyn/projects/organizations/tupynambalucas-dev/org-core/agent-mesh/scripts/publish-packages.js) is obsolete and how native `pnpm -r publish` with Turborepo achieves "Zero-Script Overhead".
2. **State of the Art Release Tooling Comparison**: Evaluates Changesets (`@changesets/cli` + `changesets/action`) versus pnpm Native Versioning (`pnpm change` + `pnpm version -r` + `.changeset/ledger.yaml`).
3. **Professional Changelog Generation**: Architecture for per-package `CHANGELOG.md` generation, Conventional Commits integration, and automated GitHub Releases.
4. **Registry Governance for Legacy / Renamed Packages**: Rules for deleting orphaned internal packages via GitHub REST API versus formal supply-chain deprecation (`npm deprecate`).
5. **Organization Governance Plugin Strategy**: Expansion of `@tupynambalucas-dev/plugin-repo` with the `github-standards-architect` skill.

---

## 1. Deep Dive: Package Release Management & Registry Governance

### 1.1 The Custom Script Elimination Case (`publish-packages.js` vs. Native `pnpm`)

Historically, monorepo publishers utilized custom Node.js scripts (such as [`agent-mesh/scripts/publish-packages.js`](file:///C:/Users/tupyn/projects/organizations/tupynambalucas-dev/org-core/agent-mesh/scripts/publish-packages.js)) to iterate over package directories, query registries via `npm view`, and prevent CI crashes caused by HTTP 403 / 409 conflict errors when attempting to republish unchanged packages.

#### Formal Finding: `publish-packages.js` is Architecturally Redundant
According to the official pnpm CLI documentation ([pnpm publish](https://pnpm.io/cli/publish)):
> *"When running this command recursively (`pnpm -r publish`), pnpm will publish all the packages that have versions not yet published to the registry."*

Modern `pnpm` (v9/v10+) natively executes registry pre-flight verification out of the box:
- **Automatic Registry Pre-check**: For every package in the workspace, `pnpm -r publish` checks whether `name@version` already exists on the target registry (`https://npm.pkg.github.com`). If it already exists, pnpm skips it cleanly without failing the pipeline.
- **Root Package Exclusion**: Because root `package.json` contains `"private": true`, `pnpm -r publish` automatically excludes the monorepo root container.
- **Topological Publishing**: Consistently publishes packages in topological order, resolving internal workspace dependencies (`workspace:^`) into exact published versions before uploading.
- **Summary Reporting (`--report-summary`)**: Native flag `--report-summary` generates `pnpm-publish-summary.json`, outputting an exact structured manifest of which packages were published during that run:
  ```json
  {
    "publishedPackages": [
      { "name": "@tupynambalucas-dev/plugin-web", "version": "1.0.1" }
    ]
  }
  ```

#### Architectural Recommendation: Zero-Script Overhead
Maintaining custom Node.js scripts in `scripts/` introduces maintenance liability, code drift, and test overhead. The enterprise industry standard is to rely strictly on documented toolchain primitives:
- Remove [`agent-mesh/scripts/publish-packages.js`](file:///C:/Users/tupyn/projects/organizations/tupynambalucas-dev/org-core/agent-mesh/scripts/publish-packages.js).
- Update [`agent-mesh/package.json`](file:///C:/Users/tupyn/projects/organizations/tupynambalucas-dev/org-core/agent-mesh/package.json) to use native pnpm:
  ```json
  "packages:publish": "pnpm -r publish --access public --no-git-checks --report-summary"
  ```
- This eliminates the need for any runtime scripts inside `agent-mesh/scripts/`.

---

### 1.2 Declarative Registry Architecture (`pnpm-workspace.yaml`)

Based on [pnpm Registries](https://pnpm.io/registries), enterprise monorepos declare registry routing declaratively in `pnpm-workspace.yaml` instead of scattering flags across npm scripts:

```yaml
# agent-mesh/pnpm-workspace.yaml
packages:
  - 'mcp/packages/*'
  - 'plugins/packages/*'

registries:
  https://npm.pkg.github.com/:
    scopes: ["@tupynambalucas-dev"]
```

#### Security & Credential Isolation:
- `pnpm-workspace.yaml` is committed to version control and **strictly refuses** inline credentials.
- Authentication tokens belong exclusively in `.npmrc`:
  ```ini
  //npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
  ```
- In GitHub Actions CI, `NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}` provides authenticated upload permissions (`packages: write`).

---

### 1.3 Registry Revisions Protocol (`pnpm.io/registry-revisions`)

The pnpm documentation specifies support for **Registry Revisions** (`+r1`, `+r2`), introduced in modern package managers to allow registries (such as [pnpr](https://pnpm.io/pnpr)) to serve patched replacement artifacts for a given version without mutating semver numbers or breaking lockfiles.

While GitHub Packages currently enforces strict immutable semver (every fix requires a new semantic version), declaring explicit registry routes in `pnpm-workspace.yaml` ensures that `agent-mesh` remains forward-compatible with emerging enterprise registry caching proxies and artifact revisions.

---

### 1.4 State of the Art: Changesets vs. pnpm Native Release Management

To achieve the highest standard of automated releases, two modern architectures exist:

```
                            Release Intent Lifecycle
                                       |
          +----------------------------+----------------------------+
          |                                                         |
          v                                                         v
[Option A: Changesets Action]                           [Option B: pnpm Native Versioning]
- PR Workflow: Developer adds .changeset/*.md           - PR Workflow: Developer adds .changeset/*.md
- CI Automation: changesets/action opens Version PR     - CI Automation: pnpm version -r in CI
- Review: Maintainer reviews changelog & version PR     - Ledger: .changeset/ledger.yaml tracks intent
- Publish: Merging Version PR publishes to registry     - Publish: pnpm -r publish
```

#### Detailed Comparison:

| Feature | Changesets (`@changesets/cli` + Action) | pnpm Native (`pnpm version -r`) |
| :--- | :--- | :--- |
| **Industry Adoption** | Turborepo, Vite, Vitest, Remix, TRPC, SvelteKit, Chakra UI | Advanced pnpm monorepos, pnpr ecosystems |
| **Release PR Flow** | **Yes** (Automated "Version Packages" PR with full diff) | No automated PR (Direct commit or CI script) |
| **Branch Safety** | Intents deleted upon release | **Ledger** (`ledger.yaml`) prevents duplicate consumption across cherry-picks |
| **Tooling Dependencies** | Requires `@changesets/cli` | **Zero external dependencies** (Built into pnpm binary) |
| **Changelog Quality** | High (Categorized, links PRs and authors) | High (Written directly into package `CHANGELOG.md`) |
| **Best Used For** | Team collaboration with PR code reviews | Fully automated trunk-based continuous deployment |

#### The Recommended Standard:
Both architectures consume the **exact same format**: `.changeset/*.md` intent files.
1. During development, developers create change intents using `pnpm changeset` (or `pnpm change`).
2. In CI, we leverage `changesets/action@v2` (or a native pnpm release workflow) to assemble per-package changelogs and publish packages using native `pnpm -r publish`.

---

### 1.5 Professional Changelog Generation Architecture

Enterprise monorepos avoid monolithic root changelogs. Release documentation must follow these standards:

1. **Per-Package `CHANGELOG.md`**:
   Every publishable package in `mcp/packages/*` and `plugins/packages/*` maintains its own independent `CHANGELOG.md` adhering to [Keep a Changelog](https://keepachangelog.com/) and [SemVer 2.0.0](https://semver.org/):
   ```markdown
   # @tupynambalucas-dev/plugin-web

   ## 1.0.1

   ### Patch Changes
   - Update Playwright CDP connection loopback timeout ([#15](https://github.com/tupynambalucas-dev/agent-mesh/pull/15))
   ```
2. **Automated GitHub Releases with Individual Git Tags**:
   Releases are tagged per package: `<package-name>@<version>` (e.g. `@tupynambalucas-dev/mcp-playwright@1.0.0`).
   The GitHub Actions workflow reads `pnpm-publish-summary.json` (from `pnpm -r publish --report-summary`) and automatically creates a GitHub Release for each published package with its specific release notes.

---

### 1.6 Registry Governance: Handling Renamed, Deprecated, and Deleted Packages

During the evolution of `agent-mesh`, several packages were renamed (e.g. `@tupynambalucas-dev/agent-toolkit` renamed to `@tupynambalucas-dev/agent-mesh`, and legacy experimental plugins).

#### 1.6.1 Why Publish Workflows Must NEVER Automatically Delete Packages
1. **Supply Chain Catastrophe**: If an automated deletion step runs during `publish.yml`, a temporary build failure or `--filter` misconfiguration could wipe valid production packages from GitHub Packages.
2. **Permission Boundary**: The standard `GITHUB_TOKEN` provided to Actions only has `packages: write`. Package deletion requires organizational admin permissions and the `delete:packages` scope.
3. **The 5,000 Download Hard Boundary**: The GitHub REST API permanently blocks deleting any public package where any version has more than 5,000 downloads to protect downstream users from breaking changes.

#### 1.6.2 The Two-Tier Governance Strategy

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
   - **Operational Mechanism**: Executed via a dedicated administrative GitHub Actions workflow ([`.github/workflows/admin-packages.yml`](file:///C:/Users/tupyn/projects/organizations/tupynambalucas-dev/org-core/agent-mesh/.github/workflows/)) triggered via `workflow_dispatch`, authenticated with an administrative token.
   - **Endpoint REST**:
     ```http
     DELETE /orgs/tupynambalucas-dev/packages/npm/<legacy-package-name>
     Accept: application/vnd.github+json
     ```
     *(GitHub supports restoring deleted packages within 30 days if needed).*

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
| Milestone 1: Zero-Script Transition & Plugin Extension                            |
| - Replace publish-packages.js with native pnpm -r publish in agent-mesh           |
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
| - Update agent-mesh/.github/workflows/publish.yml to use native pnpm & composite  |
| - Add administrative admin-packages.yml workflow for legacy package purging      |
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
