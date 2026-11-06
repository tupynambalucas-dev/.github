# Manual Setup Guide: tupynambalucas-org-manager (Tier 1 App)
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

### 6.3 Step-by-Step Walkthrough for App 1: `tupynambalucas-org-manager` (Tier 1 - Near-Total Freedom)

Follow each field sequentially:

#### Step 1: App Metadata
- **GitHub App name**: `tupynambalucas-org-manager`  
  *(Must be unique across all of GitHub, maximum 34 characters).*
- **Description** *(Markdown supported - copy and paste the formatted block below directly into GitHub's Description field)*:

````markdown
### Sovereign Organizational Governance & Machine Identity Operator

`tupynambalucas-org-manager` is the Tier-1 executive machine identity for `tupynambalucas-dev`, providing automated organizational governance, team RBAC orchestration, security posture oversight, and package lifecycle administration.

#### Core Responsibilities
- **RBAC & Team Administration**: Programmatic management of functional teams (`lead-architects`, `security-managers`, `infra-ops`, `core-engineers`) and direct assignment of organization roles to teams.
- **Rulesets & Protection**: Enforcement of organization-wide branch protection rulesets, tag protection policies, and required status checks.
- **Security Auditing**: Comprehensive oversight of Secret Scanning alerts, Dependabot vulnerabilities, and CodeQL security scanning via `@tupynambalucas-dev/mcp-github`.
- **Package Governance**: Administrative deletion and cleanup of obsolete package versions on GitHub Packages (`npm.pkg.github.com`).
- **Secrets & Token Governance**: Centralized audit and management of fine-grained personal access tokens and organization variables.

#### Custody & Security Architecture
- **Authentication**: Headless Server-to-Server via 2048-bit RSA Private Key (`.pem`) minting ephemeral 60-minute Installation Access Tokens (IAT).
- **Custody**: Strictly restricted to the Organization Owner (`@tupynambalucas-dev`) and executive leadership (`lead-architects` / `core-maintainers`).
- **Vaulting**: Vaulted in Infisical Cloud (`tupynambalucas-dev-platform [prod] /governance/`) and repository-scoped GitHub Organization Secrets (`.github`, `org-core`).
- **Webhooks**: Strictly disabled (`Active: false`) for outbound-only on-demand operations.

> [!NOTE]
> Automated operations authored by this machine identity carry GitHub's official **Verified** badge under `@tupynambalucas-org-manager[bot]`.
````

- **Homepage URL**:  
  `https://docs.tupynambalucas.dev`

#### Step 2: Identifying and Authorizing Users (User-to-Server)
- **Callback URL**: *Leave completely empty*  
  *(Not used for headless server-to-server operations).*
- **Allow wildcard matching**: **UNCHECKED**
- **Expire user authorization tokens**: **CHECKED**  
  *(Enforces secure 8-hour expiry if OAuth is ever invoked).*
- **Request user authorization (OAuth) during installation**: **UNCHECKED**  
  *(Prevents confusing user login prompts during organization installation).*
- **Enable Device Flow**: **UNCHECKED**

#### Step 3: Post Installation
- **Setup URL**: *Leave completely empty*
- **Redirect on update**: **UNCHECKED**

#### Step 4: Webhook Configuration
- **Active**: **UNCHECKED (Desmarcado / Inactive)**  
  *(CRITICAL: Disables outbound webhook POST requests from GitHub).*
- **Webhook URL**: *Disabled / Leave empty*
- **Webhook secret**: *Disabled / Leave empty*
- **SSL verification**: *Disabled / Leave default*

#### Step 5: Repository Permissions (Permissions -> Repository permissions)
Click each dropdown and configure the exact values below:

| Permission Name in GitHub UI | Required Setting | Technical Operational Rationale |
| :--- | :--- | :--- |
| **Actions** | **Read and write** | Trigger, cancel, or re-run workflows via API. |
| **Administration** | **Read and write** | Manage repository settings, branch protections, and repo rules. |
| **Artifact metadata** | **Read and write** | Inspect and publish metadata and attestations for build artifacts. |
| **Attestations** | **Read and write** | Cryptographically sign and write artifact provenance attestations (Sigstore/SLSA). |
| **Checks** | **Read and write** | Create and update status checks and automated annotations. |
| **Code scanning alerts** | **Read and write** | Needed for `@tupynambalucas-dev/mcp-github` security audits. |
| **Commit statuses** | **Read and write** | Publish build status markers on commits. |
| **Contents** | **Read and write** | Read code, commit files, create branches, push tags (`v1.0.0`). |
| **Custom properties** | **Read and write** | Read and set repository-specific custom property values. |
| **Dependabot alerts** | **Read and write** | Needed for `@tupynambalucas-dev/mcp-github` vulnerability triage. |
| **Dependabot secrets** | **Read and write** | Manage private registry tokens consumed by Dependabot. |
| **Deployments** | **Read and write** | Create deployment records, track environment rollouts. |
| **Environments** | **Read and write** | Manage deployment environment rules and approvals. |
| **GitHub App installation repository access** | **Read and write** | Manage which GitHub App installations have access to the repo. |
| **Issues** | **Read and write** | Open governance issues and automated notices. |
| **Metadata** | **Read-only (Mandatory)** | Automatically set by GitHub; allows reading repository names. |
| **Packages** | **Read and write** | **CRITICAL: Grants REST API rights to list and delete package versions.** |
| **Pull requests** | **Read and write** | Inspect, comment, approve, and manage pull requests. |
| **Repository creation** | **Read and write** | Allows the bot to create new repositories in the organization. |
| **Repository security advisories** | **Read and write** | Audit repository CVE status and manage security disclosures. |
| **Secret scanning alerts** | **Read and write** | Needed for `@tupynambalucas-dev/mcp-github` secret audits. |
| **Secrets** | **Read and write** | Manage repository-level encrypted secrets for GitHub Actions. |
| **Variables** | **Read and write** | Manage repository-level configuration variables. |
| **Workflows** | **Read and write** | Update workflow files in `.github/workflows/`. |
| **Merge queues** | **Read and write** | Programmatic control and inspection of repository merge queues. |
| **Repository license policy** | **Read-only** | Audit repository license policy and check package compliance via `@tupynambalucas-dev/plugin-repo` (`license-architect`). *(Note: GitHub UI supports view-only for repository license policies).* |
| **License compliance alerts** | **Read-only** | Audit license compliance warnings on external dependencies. |
| **Secret scanning alert dismissal requests** | **Read and write** | Review, approve, or reject secret alert dismissal requests. |
| **Secret scanning push protection bypass requests** | **Read and write** | Review and manage push protection bypass requests when developers attempt to push sensitive data. |

*(All other repository permissions not listed above should remain **No access**).*

#### Step 6: Organization Permissions (Permissions -> Organization permissions)
Click each dropdown and configure the exact values below:

| Permission Name in GitHub UI | Required Setting | Technical Operational Rationale |
| :--- | :--- | :--- |
| **Administration** | **Read and write** | **CRITICAL (Governs Organization Rulesets)**: Full programmatic management of organization settings, security managers, Actions policies, and all organization-wide branch/tag rulesets (`/orgs/{org}/rulesets`). *(Note: GitHub UI embeds ruleset management inside Administration rather than having a standalone checkbox).* |
| **API Insights** | **Read-only** | Retrieve API rate usage statistics by actor, route, and subject. |
| **Blocking users** | **Read and write** | Block abusive accounts from interacting with organization repos. |
| **Custom organization roles** | **Read and write** | Manage custom organization roles and retrieve IDs for team assignment. |
| **Custom properties** | **Read and write** | Define org property schemas and bulk assign values to repos. |
| **Events** | **Read-only** | Organization-wide event audit logs for compliance tracking. |
| **Members** | **Read and write** | **MASTER RBAC: Create teams, update teams, set team repo access, and assign organization roles directly to teams.** |
| **Organization private registries** | **Read and write** | Configure access to external private package registries. |
| **Personal access tokens** | **Read and write** | Audit and revoke fine-grained personal access tokens. |
| **Personal access token requests** | **Read and write** | Approve or deny fine-grained PAT requests. |
| **Projects** | **Read and write** | Manage organization-level GitHub Projects (v2) boards and views. |
| **Organization announcement banners** | **Read and write** | Broadcast operational and maintenance announcements across the organization. |
| **Organization bypass requests for secret scanning** | **Read and write** | Triage organization-wide secret push protection bypass requests. |
| **Organization dismissal requests for Dependabot** | **Read and write** | Triage and audit Dependabot vulnerability dismissal requests. |
| **Organization dismissal requests for code scanning** | **Read and write** | Triage and audit CodeQL code scanning dismissal requests. |
| **Secrets** | **Read and write** | Manage organization-wide secrets for Actions and Dependabot. |
| **Self-hosted runners** | **Read and write** | Manage organization runner groups and runner registrations. |
| **Variables** | **Read and write** | Manage organization-wide configuration variables. |

*(All other organization permissions not listed above should remain **No access**).*

#### Step 7: Account Permissions
- Keep all Account permissions set to **No access**.

#### Step 8: Subscribe to Events
- Inactive / Grayed out per Webhook Unchecked setting.

#### Step 9: Where Can This GitHub App Be Installed?
- Select: **Only on this account** (`@tupynambalucas-dev`).

#### Step 10: Complete Creation
- Click the green button: **Create GitHub App**.

---

---

## Navigation

- [GitHub App Architecture Suite README](./README.md)
- Previous: [Three-Tier Identity Topology & Master Permissions Catalog](./topology-and-permissions-catalog.md)
- Next: [Setup Guide - CI/CD Automation Bot (Tier 2)](./setup-ci-bot-app.md)
- Related: [Secret Governance, Key Generation & Workflows](./secrets-governance-and-workflows.md)
- [Parent Architectural Plans Index](../README.md)
