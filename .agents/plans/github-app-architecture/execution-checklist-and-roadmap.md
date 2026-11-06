# GitHub App Implementation Checklist, Actionable Phases & Roadmap
**Organization**: `tupynambalucas-dev`  
**Domain**: Enterprise Identity, Governance, CI/CD Automation & Workstation Integration  
**Suite**: [GitHub App Architecture Suite](./README.md)  
**Classification**: Actionable Operational Execution Checklist  
**Standard**: en-US Technical Specification (Strict Zero-Emoji Policy)

---

## 10. Conclusion & Actionable Execution Checklist

Use this checklist during manual setup:

### Phase 1: Register Tier 1 (`tupynambalucas-org-manager`)
1. [ ] Navigate to `https://github.com/organizations/tupynambalucas-dev/settings/apps/new`.
2. [ ] Enter Name: `tupynambalucas-org-manager` and Homepage URL: `https://docs.tupynambalucas.dev`.
3. [ ] In the **Description** field, copy and paste the formatted GitHub Flavored Markdown block from Section 6.3 (Step 1).
4. [ ] Uncheck **Active** under Webhook.
4. [ ] Configure Repository Permissions:
   - [ ] Actions: `Read and write`
   - [ ] Administration: `Read and write`
   - [ ] Artifact metadata: `Read and write`
   - [ ] Attestations: `Read and write`
   - [ ] Checks: `Read and write`
   - [ ] Code scanning alerts: `Read and write`
   - [ ] Commit statuses: `Read and write`
   - [ ] Contents: `Read and write`
   - [ ] Custom properties: `Read and write`
   - [ ] Dependabot alerts: `Read and write`
   - [ ] Dependabot secrets: `Read and write`
   - [ ] Deployments: `Read and write`
   - [ ] Environments: `Read and write`
   - [ ] GitHub App installation repository access: `Read and write`
   - [ ] Issues: `Read and write`
   - [ ] Metadata: `Read-only`
   - [ ] Packages: `Read and write`
   - [ ] Pull requests: `Read and write`
   - [ ] Repository creation: `Read and write`
   - [ ] Repository security advisories: `Read and write`
   - [ ] Secret scanning alerts: `Read and write`
    - [ ] Secret scanning push protection bypass requests: `Read and write`
    - [ ] Secret scanning alert dismissal requests: `Read and write`
    - [ ] Repository license policy: `Read-only`
    - [ ] Merge queues: `Read and write`
   - [ ] Secrets: `Read and write`
   - [ ] Variables: `Read and write`
   - [ ] Workflows: `Read and write`
5. [ ] Configure Organization Permissions:
   - [ ] Administration: `Read and write`
   - [ ] API Insights: `Read-only`
   - [ ] Blocking users: `Read and write`
   - [ ] Custom organization roles: `Read and write`
   - [ ] Custom properties: `Read and write`
   - [ ] Events: `Read-only`
   - [ ] Members: `Read and write` (Enables team creation and org-role assignments)
   - [ ] Organization private registries: `Read and write`
   - [ ] Administration: `Read and write` (Encompasses all organization branch and tag rulesets)
   - [ ] Organization security advisories: `Read and write`
   - [ ] Packages: `Read and write`
   - [ ] Personal access tokens: `Read and write`
   - [ ] Personal access token requests: `Read and write`
   - [ ] Projects: `Read and write`
    - [ ] Organization bypass requests for secret scanning: `Read and write`
    - [ ] Organization dismissal requests for Dependabot: `Read and write`
    - [ ] Organization dismissal requests for code scanning: `Read and write`
    - [ ] Organization announcement banners: `Read and write`
   - [ ] Secrets: `Read and write`
   - [ ] Self-hosted runners: `Read and write`
   - [ ] Variables: `Read and write`
6. [ ] Select **Only on this account** and click **Create GitHub App**.
7. [ ] Generate RSA Private Key: Click **Generate a private key** and download `tupynambalucas-org-manager.*.private-key.pem`.
8. [ ] Install App on Organization: Select **All repositories**, install, and capture numeric **Installation ID** from redirect URL.
9. [ ] Vault Credentials: Configure `GITHUB_APP_ID`, `GITHUB_APP_INSTALLATION_ID`, and `GITHUB_APP_PRIVATE_KEY` across `.env`, Infisical (`/governance`), and Actions Org Secrets (`ORGANIZATION_APP_ID`, `ORGANIZATION_APP_PRIVATE_KEY`). Purge local `.pem` file.
10. [ ] Assign App Managers: Add team `lead-architects`.

### Phase 2: Register Tier 2 (`tupynambalucas-ci-bot`)
1. [ ] Navigate to `https://github.com/organizations/tupynambalucas-dev/settings/apps/new`.
2. [ ] Enter Name: `tupynambalucas-ci-bot` and Homepage URL: `https://docs.tupynambalucas.dev`.
3. [ ] In the **Description** field, copy and paste the formatted GitHub Flavored Markdown block from Section 6.4 (Step 1).
4. [ ] Uncheck **Active** under Webhook.
4. [ ] Configure Repository Permissions:
   - [ ] Actions: `Read-only`
   - [ ] Artifact metadata: `Read and write`
   - [ ] Attestations: `Read and write`
   - [ ] Checks: `Read and write`
   - [ ] Commit statuses: `Read and write`
   - [ ] Contents: `Read and write`
   - [ ] Deployments: `Read and write`
   - [ ] Environments: `Read and write`
   - [ ] Issues: `Read and write`
   - [ ] Metadata: `Read-only`
   - [ ] Packages: `Read and write`
   - [ ] Pull requests: `Read and write`
   - [ ] Workflows: `Read and write`
5. [ ] Organization Permissions: All set to `No access`.
6. [ ] Select **Only on this account** and click **Create GitHub App**.
7. [ ] Generate RSA Private Key: Click **Generate a private key** and download `tupynambalucas-ci-bot.*.private-key.pem`.
8. [ ] Install App on Organization: Select **All repositories**, install, and capture numeric `CI_APP_INSTALLATION_ID`.
9. [ ] Vault Credentials: Configure `CI_APP_ID` and `CI_APP_PRIVATE_KEY` in Actions Org Secrets (All repositories) and Infisical (`/ci-cd`). Purge local `.pem` file.
10. [ ] Assign App Managers: Add teams `lead-architects` and `infra-ops`.

### Phase 3: Register Tier 3 (`tupynambalucas-developer-tools`)
1. [ ] Navigate to `https://github.com/organizations/tupynambalucas-dev/settings/apps/new`.
2. [ ] Enter Name: `tupynambalucas-developer-tools` and Homepage URL: `https://docs.tupynambalucas.dev`.
3. [ ] In the **Description** field, copy and paste the formatted GitHub Flavored Markdown block from Section 6.5 (Step 1).
4. [ ] Check **Enable Device Flow** under Identifying & Authorizing Users.
4. [ ] Check **Expire user authorization tokens**.
5. [ ] Uncheck **Active** under Webhook.
6. [ ] Configure Repository Permissions:
   - [ ] Actions: `Read-only`
   - [ ] Checks: `Read-only`
   - [ ] Commit statuses: `Read-only`
   - [ ] Contents: `Read and write`
   - [ ] Deployments: `Read-only`
   - [ ] Discussions: `Read and write`
   - [ ] Issues: `Read and write`
   - [ ] Metadata: `Read-only`
   - [ ] Pull requests: `Read and write`
   - [ ] Workflows: `Read and write`
7. [ ] Configure Organization Permissions:
   - [ ] Events: `Read-only`
   - [ ] Members: `Read-only`
8. [ ] Configure Account Permissions:
   - [ ] Email addresses: `Read-only`
    - [ ] SSH signing keys: `Read and write` (Required for gh tl onboard auto-provisioning)
    - [ ] Git SSH keys: `Read and write` (Required for gh tl onboard authentication key registration)
   - [ ] Plan: `Read-only`
   - [ ] Profile: `Read-only`
   - [ ] Starring: `Read and write`
   - [ ] Watching: `Read and write`
9. [ ] Select **Only on this account** and click **Create GitHub App**.
10. [ ] Cryptographic Invariant: Verify zero private key generation (Public Client / Device Flow).
11. [ ] Record Client ID: Copy public alphanumeric Client ID from General settings tab.
12. [ ] Install App on Organization: Select **All repositories** and install on `@tupynambalucas-dev`.
13. [ ] Configure Developer Tooling: Set `GITHUB_DEVELOPER_TOOLS_CLIENT_ID` in `.env` and Infisical (`/tooling`).

### Phase 4: Configure GitHub App Managers
1. [ ] In `tupynambalucas-org-manager` settings -> **App managers**: Add team `lead-architects`.
2. [ ] In `tupynambalucas-ci-bot` settings -> **App managers**: Add teams `lead-architects` and `infra-ops`.
3. [ ] In `tupynambalucas-developer-tools` settings -> **App managers**: Add team `lead-architects`.

### Phase 5: Configure Organization Secrets & Run Clean Release
1. [ ] Configure `ORGANIZATION_APP_ID`, `ORGANIZATION_APP_PRIVATE_KEY`, `CI_APP_ID`, and `CI_APP_PRIVATE_KEY` in GitHub Organization Secrets.
2. [ ] Trigger `admin-packages.yml` to purge remote packages.
3. [ ] Trigger `publish.yml` to publish inaugural clean `1.0.0` packages to GitHub Packages.

---

## Navigation

- [GitHub App Architecture Suite README](./README.md)
- Previous: [Secret Governance, Key Generation & Workflows](./secrets-governance-and-workflows.md)
- [Parent Architectural Plans Index](../README.md)
