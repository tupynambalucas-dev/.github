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
| **Plan** | **Read-only** | Query user billing tier for CLI capability validation. |
| **Profile** | **Read-only** | Retrieve developer avatar, name, and username for terminal UI. |
| **Starring** | **Read and write** | Developer bookmarking and starring repositories. |
| **Watching** | **Read and write** | Managing repository subscriptions and notifications. |
| **SSH signing keys** | **Read and write** | **CRITICAL FOR GH-TL**: Allows `gh tl onboard` to inspect and register the developer's public SSH Ed25519 signing key on GitHub. |
| **Git SSH keys** | **Read-only** | Verify developer authentication SSH keys during workstation onboarding. |
| **GPG keys** | **Read-only** | Audit legacy GPG keys if used by developers. |

*(All other account permissions should remain **No access**).*

#### Step 8: Subscribe to Events
- Grayed out / Inactive.

#### Step 9: Where Can This GitHub App Be Installed?
- Select: **Only on this account** (`@tupynambalucas-dev`).

#### Step 10: Complete Creation
- Click the green button: **Create GitHub App**.
- *Note for Tier 3*: Developers consume exclusively the **Client ID** (alphanumeric string). No RSA private key is ever generated or distributed for Tier 3.

---

---

## Navigation

- [GitHub App Architecture Suite README](./README.md)
- Previous: [Setup Guide - CI/CD Automation Bot (Tier 2)](./setup-ci-bot-app.md)
- Next: [Secret Governance, Key Generation & Workflows](./secrets-governance-and-workflows.md)
- [Parent Architectural Plans Index](../README.md)
