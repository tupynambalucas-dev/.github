# Manual Setup Guide: tupynambalucas-developer-tools (Tier 3 App)
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

### 6.5 Step-by-Step Walkthrough for App 3: `tupynambalucas-developer-tools` (Tier 3 - Interactive Developer Self-Service)

Follow each field sequentially:

#### Step 1: App Metadata
- **GitHub App name**: `tupynambalucas-developer-tools`
- **Description** *(Markdown supported - copy and paste the formatted block below directly into GitHub's Description field)*:

````markdown
### Interactive Developer Tooling & Workstation Self-Service Identity

`tupynambalucas-developer-tools` is the Tier-3 developer enablement identity for `tupynambalucas-dev`, providing secure, passwordless authentication for developer workstations, internal CLI extensions (`gh-tl`), IDE tools, and local engineering workflows without static access tokens.

#### Core Capabilities
- **OAuth Device Flow Integration**: Authenticates engineers via `https://github.com/login/device` with auto-expiring 8-hour User Access Tokens (UAT) and automatic refresh rotation.
- **Zero Static Personal Access Tokens**: Completely eliminates high-risk classic and fine-grained PATs from developer laptops.
- **Workstation Verification & Onboarding**: Powers `gh tl onboard` and `gh tl verify` to validate local Git configuration, SSH commit signing keys, and repository remotes.
- **Interactive Developer Workflows**: Enables human-attributed Git branching, PR authoring, code review comments, and issue triage from terminal and IDE interfaces.

#### Dual-Boundary Security Architecture
- **Zero Private Key Distribution**: No RSA private key is ever generated or distributed to developer machines; CLI clients embed only the public `Client ID`.
- **Intersection of Rights**: Operates strictly within the intersection of the App permissions and the individual developer's team RBAC (`Effective Rights = App Scopes ∩ Team RBAC`).
- **Zero Administrative Authority**: Holds zero organization-level administrative scopes, ensuring developer sessions cannot alter security rulesets, teams, or billing.
- **Instant Revocation**: Compromised or decommissioned workstations can be revoked instantly by an administrator via Organization Settings with zero key rotation impact on CI/CD.

> [!IMPORTANT]
> Commits and pull request reviews created through this tool are attributed to the individual developer's verified human username with `programmatic_access_type: GitHub App user-to-server token`.
````

- **Homepage URL**:  
  `https://docs.tupynambalucas.dev`

#### Step 2: Identifying and Authorizing Users (User-to-Server)
- **Callback URL**: *Leave completely empty*
- **Allow wildcard matching**: **UNCHECKED**
- **Expire user authorization tokens**: **CHECKED**  
  *(Enforces secure 8-hour token expiration with refresh tokens).*
- **Request user authorization (OAuth) during installation**: **UNCHECKED**
- **Enable Device Flow**: **CHECKED (Obrigatório / Mandatory)**  
  *(CRITICAL: Allows CLI tools like `gh-tl` to authenticate developers via `https://github.com/login/device` without web redirects).*

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
| **Actions** | **Read-only** | Inspect workflow logs and run statuses from CLI. |
| **Administration** | **No access** | Strict PoLP isolation: Developer App cannot alter repository configurations. |
| **Checks** | **Read-only** | Inspect test check suites and annotations from CLI. |
| **Commit statuses** | **Read-only** | View status indicators on pull request branches. |
| **Contents** | **Read and write** | **Push feature branches and create commits on assigned repos.** |
| **Deployments** | **Read-only** | View environment rollout states from developer CLI. |
| **Discussions** | **Read and write** | Participate in repository discussions and technical Q&A. |
| **Issues** | **Read and write** | Open, comment, and triage issues on user behalf. |
| **Metadata** | **Read-only (Mandatory)** | Automatically set by GitHub. |
| **Pull requests** | **Read and write** | Author PRs, add review comments, and inspect review statuses. |
| **Workflows** | **Read and write** | Allow developers to create and edit workflow files in feature branches. |

*(All other repository permissions should remain **No access**).*

#### Step 6: Organization Permissions (Permissions -> Organization permissions)
| Permission Name in GitHub UI | Required Setting | Technical Operational Rationale |
| :--- | :--- | :--- |
| **Events** | **Read-only** | Query organization activity stream from developer dashboard. |
| **Members** | **Read-only** | Query functional team rosters and organization collaborators. |

*(All other organization permissions should remain **No access**).*

#### Step 7: Account Permissions (Permissions -> Account permissions)
| Permission Name in GitHub UI | Required Setting | Technical Operational Rationale |
| :--- | :--- | :--- |
| **Email addresses** | **Read-only** | Retrieve verified primary email for local Git signature configuration. |
| **Git SSH keys** | **Read and write** | **REQUIRED FOR GH-TL**: Allows `gh tl onboard` to register the developer public SSH authentication key on GitHub (`POST /user/keys`). |
| **Plan** | **Read-only** | Query user billing tier for CLI capability validation. |
| **Profile** | **Read and write** | Retrieve developer avatar, name, and profile data for terminal UI. *(GitHub UI only offers 'No access' or 'Read and write' for Profile; select 'Read and write').* |
| **SSH signing keys** | **Read and write** | **CRITICAL FOR GH-TL**: Allows `gh tl onboard` to inspect and register the developer's public SSH Ed25519 signing key on GitHub (`POST /user/ssh_signing_keys`). |
| **Starring** | **Read and write** | Developer bookmarking and starring repositories. |
| **Watching** | **Read and write** | Managing repository subscriptions and notifications. |

> [!NOTE]
> **GitHub UI Options for Profile and Keys**:
> - **Profile**: GitHub does not provide a "Read-only" option in the UI; it only supports **Read and write** or **No access**. Select **Read and write**.
> - **Git SSH keys**: Must be explicitly selected as **Read and write** alongside **SSH signing keys** to allow `gh tl onboard` to provision both authentication and cryptographic signing keys.
> - **Total Account Permissions Selected**: Exactly **7 selected** (`Email addresses`, `Git SSH keys`, `Plan`, `Profile`, `SSH signing keys`, `Starring`, `Watching`).

*(All other account permissions should remain **No access**).*

#### Step 8: Subscribe to Events
- Grayed out / Inactive.

#### Step 9: Where Can This GitHub App Be Installed?
- Select: **Only on this account** (`@tupynambalucas-dev`).

#### Step 10: Complete Creation
- Click the green button: **Create GitHub App**.
- GitHub creates the application and redirects you to the App's **General** settings dashboard (`https://github.com/organizations/tupynambalucas-dev/settings/apps/tupynambalucas-developer-tools`).

#### Step 11: Cryptographic Invariant - Zero Private Key Generation (Tier 3 Rule)
> [!IMPORTANT]
> **DO NOT GENERATE A PRIVATE KEY OR CLIENT SECRET FOR THIS APP.**
>
> **Technical Rationale**:
> - `tupynambalucas-developer-tools` operates exclusively as a **Public Client** utilizing the **OAuth 2.0 Device Authorization Flow** (`https://github.com/login/device`).
> - An RSA private key represents machine-level authorization (the power to act as the App itself without an interactive user session). Distributing private keys to developer workstations violates organizational security policies and zero-trust principles.
> - With Device Flow, developer CLI tools (such as `gh tl onboard` and local developer tooling) identify themselves strictly using the public **Client ID**. Authentication occurs through interactive web-based browser approval by the human engineer, which issues short-lived, user-scoped OAuth tokens.
> - In the **Credentials** tab, leave both **Key pairs** (`0`) and **Client secrets** (`0`) completely empty. Never click "Generate a private key" or "New client secret" for Tier 3.

#### Step 12: Record Public Client ID
1. On the **General** settings tab under the **About** section, locate the **Client ID** (an alphanumeric string such as `Iv23...`).
2. Copy and record this value. This is the **`GITHUB_DEVELOPER_TOOLS_CLIENT_ID`**.

#### Step 13: Install App on Organization
1. In the left navigation sidebar of the App settings, click **Install App**.
2. Locate `@tupynambalucas-dev` and click the green **Install** button.
3. Under **Repository access**, select: **All repositories** (enabling developer CLI tools to interact with all org repositories).
4. Click the green **Install** button.

#### Step 14: Configure Developer Workstation & Tooling Environment
1. **Local Developer Environment (`.env`)**:
   In `org-core/.env` and `agent-mesh/.env`, configure:
   ```dotenv
   GITHUB_DEVELOPER_TOOLS_CLIENT_ID="<Client ID from General tab>"
   ```

2. **Infisical Cloud Vault (`/tooling`)**:
   Enroll the client ID into the developer tooling folder:
   ```bash
   infisical secrets set --env=dev --path=/tooling DEVELOPER_TOOLS_CLIENT_ID="<Client ID from General tab>"
   ```

3. **Verification with CLI**:
   Developers running `gh tl onboard` or local CLI utilities will automatically read `GITHUB_DEVELOPER_TOOLS_CLIENT_ID` to trigger device flow onboarding without needing any private key files.

---

---

## Navigation

- [GitHub App Architecture Suite README](./README.md)
- Previous: [Setup Guide - CI/CD Automation Bot (Tier 2)](./setup-ci-bot-app.md)
- Next: [Secret Governance, Key Generation & Workflows](./secrets-governance-and-workflows.md)
- [Parent Architectural Plans Index](../README.md)
