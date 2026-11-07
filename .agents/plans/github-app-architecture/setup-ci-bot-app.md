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
- GitHub creates the application and redirects you to the App's **General** settings dashboard (`https://github.com/organizations/tupynambalucas-dev/settings/apps/tupynambalucas-ci-bot`).

#### Step 11: Generate RSA Private Key (.pem) via Credentials Tab
1. In the left navigation sidebar of the App settings, click the **Credentials** tab (located right beneath the **General** tab).
2. The **Credentials** page displays two sections:
   - **Client secrets** (Leave empty / 0 secrets: Not needed for automated CI/CD bot).
   - **Key pairs** (Currently shows `0`: *"You need a private key to sign access token requests"*).
3. In the **Key pairs** section, click the green button: **Generate a private key** (or **Generate key pair**).
4. GitHub automatically generates a secure 2048-bit RSA keypair, registers the public key on GitHub servers, increments the **Key pairs** counter to `1`, and initiates an immediate browser download of:
   `tupynambalucas-ci-bot.<timestamp>.private-key.pem`
5. Confirm the success banner appears: *"A private key has been generated and downloaded to your computer."*

> [!CAUTION]
> GitHub never displays or re-downloads this private key. Protect this `.pem` file during configuration and purge it immediately after enrolling into secrets vaults.

#### Step 12: Install App on Organization & Capture Installation ID
1. In the left navigation sidebar of the App settings, click **Install App**.
2. Locate `@tupynambalucas-dev` and click the green **Install** button.
3. Under **Repository access**, select: **All repositories** (allowing automated CI/CD checks, releases, and dependency PRs across every repo in the organization).
4. Click the green **Install** button.
5. GitHub redirects you to:
   `https://github.com/organizations/tupynambalucas-dev/settings/installations/<INSTALLATION_ID>`
6. **Capture the Installation ID**: Inspect the URL in your browser address bar. The numeric value at the end is your **`CI_APP_INSTALLATION_ID`**. Record this value alongside the **App ID** (from the General tab).

#### Step 13: Configure Credentials across CI/CD Secrets & Vaults
1. **GitHub Actions Organization Secrets (`settings/secrets/actions`)**:
   Navigate to `https://github.com/organizations/tupynambalucas-dev/settings/secrets/actions` and enroll:
   - Secret **`CI_APP_ID`**: Paste the numeric App ID. Set Repository Access to **All repositories**.
   - Secret **`CI_APP_PRIVATE_KEY`**: Paste the entire raw text content of the `tupynambalucas-ci-bot.*.private-key.pem` file. Set Repository Access to **All repositories**.

2. **Infisical Cloud Vault (`/ci-cd`)**:
   Enroll the credentials for infrastructure automation and staging pipelines:
   ```bash
   infisical secrets set --env=staging --path=/ci-cd CI_APP_ID="<Numeric App ID>"
   infisical secrets set --env=staging --path=/ci-cd CI_APP_CLIENT_ID="<Client ID from General tab>"
   infisical secrets set --env=staging --path=/ci-cd CI_APP_INSTALLATION_ID="<Numeric Installation ID>"
   infisical secrets set --env=staging --path=/ci-cd CI_APP_PRIVATE_KEY="$(cat tupynambalucas-ci-bot.*.private-key.pem)"
   ```

3. **Cryptographic Hygiene & Cleanup**:
   Permanently delete the unencrypted `.pem` file from your workstation downloads directory:
   ```powershell
   Remove-Item "$HOME\Downloads\tupynambalucas-ci-bot.*.private-key.pem"
   ```

#### Step 14: Assign App Managers
1. In the App settings left sidebar, click **App managers**.
2. Click **Add people or teams**.
3. Search for and select the teams: `lead-architects` and `infra-ops`.

---

---

## Navigation

- [GitHub App Architecture Suite README](./README.md)
- Previous: [Setup Guide - Organization Manager App (Tier 1)](./setup-org-manager-app.md)
- Next: [Setup Guide - Developer Tools Workstation Identity (Tier 3)](./setup-developer-tools-app.md)
- Related: [Secret Governance, Key Generation & Workflows](./secrets-governance-and-workflows.md)
- [Parent Architectural Plans Index](../README.md)
