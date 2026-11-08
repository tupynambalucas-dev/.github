# Technical Reference: GitHub Apps Master Catalog & Credential Specifications

**Classification**: Diataxis Reference (Information-Oriented)  
**Scope**: Enterprise Machine Identity, CI/CD Automation & Developer Workstation Topology  
**Organization**: `tupynambalucas-dev`  
**Standard**: en-US Technical Specification (Strict Zero-Emoji Policy)

---

## 1. Master Identity Catalog

The `tupynambalucas-dev` organization enforces a three-tier sovereign identity topology separating administrative operations, automated CI/CD pipelines, and interactive developer tooling.

| Attribute | Tier 1: Organization Manager | Tier 2: CI/CD Bot | Tier 3: Developer Tools |
| :--- | :--- | :--- | :--- |
| **GitHub App Name** | `tupynambalucas-org-manager` | `tupynambalucas-ci-bot` | `tupynambalucas-developer-tools` |
| **App ID** | `5648756` | `5650100` | `5650238` |
| **Client ID** | `Iv23lijGKyMy4ZmR8kAa` | `Iv23liVfQ814P54tQusd` | `Iv23li0HsZejytkVkbTl` |
| **Installation ID** | `179571234` | `179570999` | *(Inherited at runtime via OAuth)* |
| **Cryptographic Model** | RSA 2048-bit Private Key | RSA 2048-bit Private Key | Public Client (Zero Private Key) |
| **Authentication Flow** | Server-to-Server (JWT signed) | Server-to-Server (JWT signed) | OAuth 2.0 Device Flow (`/login/device`) |
| **Token Lifetime** | 1 Hour (Installation Access Token) | 1 Hour (Installation Access Token) | 8 Hours (User Access Token + Refresh) |
| **App Managers (Delegated)** | `lead-architects` | `lead-architects`, `infra-ops` | `lead-architects` |
| **Primary Runtime Consumers** | `@tupynambalucas-dev/mcp-github-org` | GitHub Actions (`renovate.yml`, `renderer-generate.yml`, `deploy-docs.yaml`, `release.yml`), `getOctokitClient('ci-bot')` | `@tupynambalucas-dev/mcp-github-flow`, `gh-tl` CLI suite |

---

## 2. Environment Variable Schema Matrix

To maintain cross-platform compatibility across local developer machines, GitHub Actions Organization Secrets, and Kubernetes clusters, credentials use standardized prefix-less names.

> [!NOTE]
> GitHub Actions strictly forbids secrets starting with the `GITHUB_` prefix. Our codebase and configuration templates standardize on `ORG_MANAGER_APP_*`, `CI_BOT_APP_*`, and `DEVELOPER_TOOLS_APP_*`, with automatic fallback to legacy aliases in `@tupynambalucas-dev/mcp-core-github`.

### Tier 1: `tupynambalucas-org-manager` (Administrative Machine Identity)

| Variable Name | Required? | Accepted Format | Default Destination | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `ORG_MANAGER_APP_ID` | Yes | Numeric string (`5648756`) | `.env`, Infisical, GitHub Org Secret | Identifies App to GitHub API |
| `ORG_MANAGER_APP_CLIENT_ID` | Yes | Alphanumeric (`Iv23lijGKyMy4ZmR8kAa`) | `.env`, Infisical | Public OAuth / App Client ID |
| `ORG_MANAGER_APP_INSTALLATION_ID` | Yes | Numeric string (`179571234`) | `.env`, Infisical, K8s ConfigMap | Targets org installation context |
| `ORG_MANAGER_APP_PRIVATE_KEY_BASE64` | Conditional | Base64-encoded PEM string | `.env`, Infisical Vault | In-memory private key resolution |
| `ORG_MANAGER_APP_PRIVATE_KEY_PATH` | Conditional | Absolute/relative file path | Kubernetes Pod manifests | Mount-point resolution (`/var/run/secrets/`) |
| `ORG_MANAGER_APP_PRIVATE_KEY` | Conditional | Raw multiline PEM string | GitHub Actions Organization Secret | Passed to `actions/create-github-app-token` |

### Tier 2: `tupynambalucas-ci-bot` (Autonomous CI/CD Identity)

| Variable Name | Required? | Accepted Format | Default Destination | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `CI_BOT_APP_ID` | Yes | Numeric string (`5650100`) | GitHub Org Secret, `.env`, Infisical | Workflows `create-github-app-token` |
| `CI_BOT_APP_CLIENT_ID` | Yes | Alphanumeric (`Iv23liVfQ814P54tQusd`) | `.env`, Infisical | Public identifier |
| `CI_BOT_APP_INSTALLATION_ID` | Yes | Numeric string (`179570999`) | `.env`, Infisical | Org installation target |
| `CI_BOT_APP_PRIVATE_KEY_BASE64` | Conditional | Base64-encoded PEM string | `.env`, Infisical Vault | Local development & runner injection |
| `CI_BOT_APP_PRIVATE_KEY_PATH` | Conditional | File path string | Runner disk / K8s volume | Filesystem resolution |
| `CI_BOT_APP_PRIVATE_KEY` | Yes | Raw multiline PEM text | GitHub Actions Organization Secret | Secret passed to `actions/create-github-app-token` |

### Tier 3: `tupynambalucas-developer-tools` (Workstation Self-Service Identity)

| Variable Name | Required? | Accepted Format | Default Destination | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `DEVELOPER_TOOLS_APP_ID` | Optional | Numeric string (`5650238`) | `.env`, Infisical (`/tooling`) | App identifier |
| `DEVELOPER_TOOLS_APP_CLIENT_ID` | Yes | Alphanumeric (`Iv23li0HsZejytkVkbTl`) | `.env`, Infisical (`/tooling`), CLI | Public client ID for Device Flow |

---

## 3. Permissions and Scope Matrix

| Permission Category | Scope Name | Tier 1 (Org Manager) | Tier 2 (CI Bot) | Tier 3 (Developer Tools) |
| :--- | :--- | :--- | :--- | :--- |
| **Repository** | `Actions` | Read and write | Read and write | Read-only |
| | `Administration` | Read and write | No access | No access |
| | `Checks` | Read and write | Read and write | Read-only |
| | `Commit statuses` | Read and write | Read and write | Read-only |
| | `Contents` | Read and write | Read and write | Read and write |
| | `Deployments` | Read and write | Read and write | Read-only |
| | `Discussions` | Read and write | No access | Read and write |
| | `Issues` | Read and write | Read and write | Read and write |
| | `Metadata` | Read-only (Mandatory) | Read-only (Mandatory) | Read-only (Mandatory) |
| | `Packages` | Read and write | Read and write | No access |
| | `Pull requests` | Read and write | Read and write | Read and write |
| | `Workflows` | Read and write | Read and write | Read and write |
| **Organization** | `Administration` | Read and write | No access | No access |
| | `Custom properties` | Read and write | No access | No access |
| | `Events` | Read-only | Read-only | Read-only |
| | `Members` | Read and write | Read-only | Read-only |
| **Account** | `Email addresses` | No access | No access | Read-only |
| | `Git SSH keys` | No access | No access | Read and write |
| | `Plan` | No access | No access | Read-only |
| | `Profile` | No access | No access | Read and write |
| | `SSH signing keys` | No access | No access | Read and write |
| | `Starring` | No access | No access | Read and write |
| | `Watching` | No access | No access | Read and write |

---

## 4. Kubernetes Secret Manifest Specifications (`platform/k8s`)

In `platform/k8s`, pods consume GitHub credentials via native Kubernetes Secrets or Infisical Secret operators:

### Native Secret Specification (`github-org-manager-secret.yaml`)
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: github-org-manager-credentials
  namespace: cortex
type: Opaque
stringData:
  app-id: "5648756"
  client-id: "Iv23lijGKyMy4ZmR8kAa"
  installation-id: "179571234"
data:
  # Base64-encoded raw PEM file:
  private-key.pem: <BASE64_ENCODED_PEM_FILE>
```

### Infisical Secret Synchronization Custom Resource
```yaml
apiVersion: secrets.infisical.com/v1alpha1
kind: InfisicalSecret
metadata:
  name: github-app-infisical-sync
  namespace: cortex
spec:
  resyncInterval: 60
  authentication:
    universalAuth:
      secretsRef:
        secretName: infisical-universal-auth
        secretNamespace: cortex
  managedSecretReference:
    secretName: github-org-manager-synced-secret
    secretNamespace: cortex
```

---

## 5. Client Resolution & Separation of Duties Matrix (`@tupynambalucas-dev/mcp-core-github`)

`getOctokitClient(tier: GitHubIdentityTier)` enforces strict Separation of Duties (SoD) and the **No-Privilege-Escalation Fallback Invariant**:

| Requested `tier` | Primary Consumer | Priority 1 | Priority 2 (Fallback) | Priority 3 (Fallback) | Tier 1 (`org-manager`) Isolation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `'org-manager'` | `@tupynambalucas-dev/mcp-github-org` | `createOrgManagerOctokit()` (`ORG_MANAGER_APP_*`) | `GITHUB_PERSONAL_ACCESS_TOKEN` / `GITHUB_TOKEN` | Unauthenticated `Octokit` | Explicit opt-in only |
| `'ci-bot'` | CI/CD & Repository Automation | `createCiBotOctokit()` (`CI_BOT_APP_*`) | `GITHUB_PERSONAL_ACCESS_TOKEN` / `GITHUB_TOKEN` | Unauthenticated `Octokit` | **Never calls `org-manager`** |
| `'developer-tools'` / `'auto'` | `@tupynambalucas-dev/mcp-github-flow` | `GITHUB_PERSONAL_ACCESS_TOKEN` -> `GITHUB_TOKEN` -> `gh auth token` | `createCiBotOctokit()` (`CI_BOT_APP_*`) | Unauthenticated `Octokit` | **Never calls `org-manager`** |

---

## 6. Navigation

- [Parent Reference Index](../README.md)
- [How-To: Generating and Configuring GitHub App Keys](../how-to-guides/generating-and-configuring-github-app-keys.md)
- [Tutorial: Creating a GitHub App End-to-End](../tutorials/creating-a-github-app-end-to-end.md)
- [Explanation: Three-Tier GitHub App Identity Architecture](../explanation/github-app-identity-architecture.md)
- [Reference: GitHub Packages and Token Boundary Governance](./github-packages-and-token-boundary-governance.md)
