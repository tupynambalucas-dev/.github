# Manual Setup Guide: tupynambalucas-ci-bot (Tier 2 App)
**Organization**: `tupynambalucas-dev`  
**Domain**: Enterprise Identity, Governance, CI/CD Automation & Workstation Integration  
**Suite**: [GitHub App Architecture Suite](./README.md)  
**Classification**: Didactic Manual Web UI Runbook  
**Standard**: en-US Technical Specification (Strict Zero-Emoji Policy)

---

## 1. Accessing the Organization App Registration Interface

1. Navigate to: `https://github.com/organizations/tupynambalucas-dev/settings/apps/new`
2. Authenticate as an **Organization Owner** of `tupynambalucas-dev`.
3. Follow the field-by-field instructions below.

---

### 6.4 Step-by-Step Walkthrough for App 2: `tupynambalucas-ci-bot` (Tier 2 - Operational Delivery)

Follow each field sequentially:

#### Step 1: App Metadata
- **GitHub App name**: `tupynambalucas-ci-bot`
- **Description** *(Markdown supported - copy and paste the formatted block below directly into GitHub's Description field)*:

````markdown
### Autonomous CI/CD Delivery & Package Release Automation Bot

`tupynambalucas-ci-bot` is the Tier-2 headless delivery identity for `tupynambalucas-dev`, driving routine continuous integration, automated package releases, dependency maintenance, and build attestations across all monorepos.

#### Core Responsibilities
- **Package Publishing**: Automated publishing of workspace packages to GitHub Packages (`npm.pkg.github.com`) with Sigstore/SLSA provenance attestations.
- **Continuous Integration**: Reporting commit status markers, publishing check runs, and surfacing automated test/lint annotations.
- **Dependency Automation**: Opening, updating, and auto-merging dependency PRs via Renovate Bot (`platform/.github/workflows/renovate.yml`).
- **Binary Releases**: Compiling, tagging, and distributing multi-platform release binaries for `gh-tl` via `cli/gh-extension-precompile`.
- **Documentation Localization**: Synchronizing CrowdIn translation pull requests and previews for `docs`.

#### Custody & Security Architecture
- **Authentication**: Server-to-Server Installation Access Tokens (IAT) generated in-memory on ephemeral GitHub Actions runners.
- **Principle of Least Privilege**: Strictly isolated from organization administration, repository deletion, member management, and security ruleset modification.
- **Custody**: Co-managed by `lead-architects` and `infra-ops`.
- **Webhooks**: Strictly disabled (`Active: false`) for outbound-only token consumption via `actions/create-github-app-token`.

> [!NOTE]
> Routine CI/CD commits and release tags authored by this bot carry the cryptographic **Verified** badge under `@tupynambalucas-ci-bot[bot]`.
````

- **Homepage URL**:  
  `https://docs.tupynambalucas.dev`

#### Step 2: Identifying and Authorizing Users (User-to-Server)
- **Callback URL**: *Leave completely empty*
- **Allow wildcard matching**: **UNCHECKED**
- **Expire user authorization tokens**: **CHECKED**
- **Request user authorization (OAuth) during installation**: **UNCHECKED**
- **Enable Device Flow**: **UNCHECKED**

#### Step 3: Post Installation
- **Setup URL**: *Leave completely empty*
- **Redirect on update**: **UNCHECKED**

#### Step 4: Webhook Configuration
- **Active**: **UNCHECKED (Desmarcado / Inactive)**
- **Webhook URL**: *Disabled / Leave empty*
- **Webhook secret**: *Disabled / Leave empty*
- **SSL verification**: *Disabled / Leave default*

#### Step 5: Repository Permissions (Permissions -> Repository permissions)
Click each dropdown and configure the exact values below:

| Permission Name in GitHub UI | Required Setting | Technical Operational Rationale |
| :--- | :--- | :--- |
| **Actions** | **Read-only** | Check workflow run states without power to cancel pipelines. |
| **Administration** | **No access** | Strict PoLP isolation: CI bot cannot modify repo settings. |
| **Artifact metadata** | **Read and write** | Publish metadata and build digests during package release. |
| **Attestations** | **Read and write** | Write Sigstore artifact provenance attestations for releases. |
| **Checks** | **Read and write** | Emit test reports and linting status checks. |
| **Commit statuses** | **Read and write** | Report build status badges on commits. |
| **Contents** | **Read and write** | **Push release tags (`v1.0.0`) and automated changelog commits.** |
| **Deployments** | **Read and write** | Track deployment statuses and environments for releases. |
| **Environments** | **Read and write** | Manage deployment environment rules and release gate approvals. |
| **Issues** | **Read and write** | Open and comment on build failure tracking issues. |
| **Metadata** | **Read-only (Mandatory)** | Automatically set by GitHub. |
| **Packages** | **Read and write** | **Publish tarballs (`pnpm -r publish`). Cannot delete.** |
| **Pull requests** | **Read and write** | Renovate Bot and release automations to open PRs. |
| **Workflows** | **Read and write** | Automated PRs modifying `.github/workflows/` files. |

*(All other repository permissions should remain **No access**).*

#### Step 6: Organization Permissions
- Set all Organization permissions to **No access**.

#### Step 7: Account Permissions
- Set all Account permissions to **No access**.

#### Step 8: Subscribe to Events
- Grayed out / Inactive.

#### Step 9: Where Can This GitHub App Be Installed?
- Select: **Only on this account** (`@tupynambalucas-dev`).

#### Step 10: Complete Creation
- Click the green button: **Create GitHub App**.

---

---

## Navigation

- [GitHub App Architecture Suite README](./README.md)
- Previous: [Setup Guide - Organization Manager App (Tier 1)](./setup-org-manager-app.md)
- Next: [Setup Guide - Developer Tools Workstation Identity (Tier 3)](./setup-developer-tools-app.md)
- Related: [Secret Governance, Key Generation & Workflows](./secrets-governance-and-workflows.md)
- [Parent Architectural Plans Index](../README.md)
