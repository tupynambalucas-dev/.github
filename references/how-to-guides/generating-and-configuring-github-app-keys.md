# How-To Guide: Generating, Encoding, and Configuring GitHub App Keys

**Classification**: Diataxis How-To Guide (Task-Oriented)  
**Target Audience**: DevOps Engineers, Platform Operators, and System Administrators  
**Organization**: `tupynambalucas-dev`  
**Prerequisites**: An existing GitHub App registered in `tupynambalucas-dev`  
**Standard**: en-US Technical Specification (Strict Zero-Emoji Policy)

---

## 1. Goal and Overview

This operational guide details the complete procedure for generating, encoding, and configuring RSA private keys and identity credentials for GitHub Apps across:
* **Local Developer Workstations**: `.env` and `.env.example` files.
* **GitHub Actions CI/CD Workflows**: GitHub Organization Secrets (`https://github.com/organizations/tupynambalucas-dev/settings/secrets/actions`).
* **Kubernetes Clusters (`platform/k8s`)**: Posix-mounted Secret volumes and InfisicalSecret Custom Resources.

We enforce the following enterprise configuration formats:
* **Base64 String (`_BASE64`)**: Recommended for local `.env` files and cloud environment variables to prevent newline corruption.
* **Filesystem Path (`_PATH`)**: Recommended for Kubernetes Secret volumes (`chmod 0400`) and production container pods.
* **Raw Multiline PEM Text**: Used exclusively when pasting keys into GitHub Actions Organization Secrets.

> [!IMPORTANT]
> **GitHub Secrets Naming Constraint**: GitHub Actions strictly forbids secret names beginning with the `GITHUB_` prefix, returning the validation error `Secret names must not start with the GITHUB_ prefix.`.
> To maintain strict alignment across local `.env` files, CI/CD runners, and cloud infrastructure, our organizational taxonomy uses prefix-less variable names:
> * `ORG_MANAGER_APP_*` (Tier 1)
> * `CI_BOT_APP_*` (Tier 2)
> * `DEVELOPER_TOOLS_APP_*` (Tier 3)

---

## 2. Generating a Private Key on GitHub

1. Navigate to your App's settings in the organization dashboard:
   ```text
   https://github.com/organizations/tupynambalucas-dev/settings/apps/<app-slug>
   ```
2. In the left navigation sidebar, click **Credentials**.
3. Under **Key pairs** / **Private keys**, click the button **Generate a private key**.
4. Your browser will download an RSA private key file named `<app-slug>.<timestamp>.private-key.pem` (e.g. `tupynambalucas-ci-bot.2026-11-07.private-key.pem`).
5. Move this file to a temporary, git-ignored directory on your machine (such as `keys/` in the workspace root).

---

## 3. Encoding Private Keys to Base64 for `.env` Files

Line-oriented `.env` parsers (such as `dotenv`) often truncate or fail to parse unescaped multiline PEM strings containing `\r\n` line endings. Converting the downloaded `.pem` file into a single-line Base64-encoded string guarantees atomic, corruption-free parsing across Windows, macOS, and Linux.

### Windows (PowerShell)
```powershell
$keyPath = "keys/tupynambalucas-org-manager.2026-11-07.private-key.pem"
$base64Key = [Convert]::ToBase64String([IO.File]::ReadAllBytes($keyPath))

# Copy directly to clipboard for pasting into .env:
$base64Key | Set-Clipboard
```

### Linux / macOS / Git Bash
```bash
keyPath="keys/tupynambalucas-org-manager.2026-11-07.private-key.pem"
base64Key=$(base64 -w 0 "$keyPath")

# Copy to clipboard (macOS: pbcopy; Linux: xclip -selection clipboard):
echo "$base64Key" | pbcopy
```

---

## 4. Configuring Local Environment Files (`.env` and `.env.example`)

In your local configuration files (`org-core/.env`, `agent-mesh/.env`, and `platform/k8s/.env`), define the variables using the standardized prefix-less taxonomy:

```dotenv
# ============================================================================== #
# 1. GITHUB MACHINE IDENTITY & REPOSITORY GOVERNANCE
# ============================================================================== #

# -- GitHub Organization Identifier
GITHUB_ORG=tupynambalucas-dev

# -- Tier 1: tupynambalucas-org-manager (Administrative Headless Machine Identity)
# Consumed by @tupynambalucas-dev/mcp-github in administrative and governance modes.
ORG_MANAGER_APP_ID="5648756"
ORG_MANAGER_APP_CLIENT_ID="Iv23lijGKyMy4ZmR8kAa"
ORG_MANAGER_APP_INSTALLATION_ID="179571234"
ORG_MANAGER_APP_PRIVATE_KEY_BASE64="LS0tLS1CRUdJTiBSU0EgUFJJVkFURSBLRVktLS0tLQpNSUlFc..."
ORG_MANAGER_APP_PRIVATE_KEY_PATH=""

# -- Tier 2: tupynambalucas-ci-bot (Autonomous Continuous Delivery Identity)
# Consumed by automated CI/CD runners for packages, releases, and dependency PRs.
CI_BOT_APP_ID="5650100"
CI_BOT_APP_CLIENT_ID="Iv23liVfQ814P54tQusd"
CI_BOT_APP_INSTALLATION_ID="179570999"
CI_BOT_APP_PRIVATE_KEY_BASE64="LS0tLS1CRUdJTiBSU0EgUFJJVkFURSBLRVktLS0tLQpNSUlFc..."
CI_BOT_APP_PRIVATE_KEY_PATH=""

# -- Tier 3: tupynambalucas-developer-tools (Developer Workstation Identity)
# Public Client ID used by developers during OAuth 2.0 Device Flow (gh-tl CLI).
DEVELOPER_TOOLS_APP_ID="5650238"
DEVELOPER_TOOLS_APP_CLIENT_ID="Iv23li0HsZejytkVkbTl"
```

The runtime loader ([`@tupynambalucas-dev/mcp-github`](../../../agent-mesh/mcp/packages/github)) automatically resolves the private key in order of priority:
1. `_PATH` (if defined and the file exists on disk).
2. `_BASE64` (decoding from Base64 into UTF-8 in memory).
3. Raw key / legacy aliases (for backward compatibility).

---

## 5. Configuring GitHub Actions Organization Secrets

GitHub Actions workflows running on cloud runners require organization secrets to mint ephemeral Installation Access Tokens via `actions/create-github-app-token`.

### Step-by-Step Configuration in GitHub Web UI

1. Open your browser and navigate to Organization Actions Secrets:
   ```text
   https://github.com/organizations/tupynambalucas-dev/settings/secrets/actions
   ```
2. Click the button **New organization secret**.

3. **Configure Tier 2 Secrets (`tupynambalucas-ci-bot`)**:
   These secrets allow automated CI/CD workflows (such as `publish.yml` in `agent-mesh` and `release.yml` in `gh-tl`) to publish packages, create git tags, and trigger downstream verification runs.

   * **Secret 1: CI Bot App ID**
     * **Name**: `CI_BOT_APP_ID` *(Note: `CI_APP_ID` is also supported as an alias)*
     * **Secret**: `5650100`
     * **Repository access**: Select **All repositories**.
     * Click **Add secret**.

   * **Secret 2: CI Bot Private Key**
     * **Name**: `CI_BOT_APP_PRIVATE_KEY` *(Note: `CI_APP_PRIVATE_KEY` is also supported as an alias)*
     * **Secret**: Open `tupynambalucas-ci-bot.2026-11-07.private-key.pem` in a text editor (e.g. VS Code or Notepad).
     * Select all contents (`Ctrl+A`), copy (`Ctrl+C`), and paste directly into the textarea.
     * Ensure the secret begins with `-----BEGIN RSA PRIVATE KEY-----` and terminates with `-----END RSA PRIVATE KEY-----`. Do not add quotation marks.
     * **Repository access**: Select **All repositories**.
     * Click **Add secret**.

4. **Configure Tier 1 Secrets (`tupynambalucas-org-manager`)**:
   These secrets allow high-privilege governance workflows (such as `admin-packages.yml` and `sync-rulesets.yml`) to manage organization-level resources.

   * **Secret 3: Org Manager App ID**
     * **Name**: `ORG_MANAGER_APP_ID` *(Note: `ORGANIZATION_APP_ID` is also supported as an alias)*
     * **Secret**: `5648756`
     * **Repository access**: Select **All repositories**.
     * Click **Add secret**.

   * **Secret 4: Org Manager Private Key**
     * **Name**: `ORG_MANAGER_APP_PRIVATE_KEY` *(Note: `ORGANIZATION_APP_PRIVATE_KEY` is also supported as an alias)*
     * **Secret**: Copy and paste the raw unencoded PEM text from `tupynambalucas-org-manager.2026-11-07.private-key.pem`.
     * **Repository access**: Select **All repositories**.
     * Click **Add secret**.

---

## 6. How Workflows Consume GitHub App Secrets

Workflows in `.github/workflows/` map these secrets to runner step environments, avoiding expression parser errors while maintaining least-privilege fallbacks:

```yaml
      - name: Generate GitHub App Token
        id: app-token
        env:
          APP_ID: ${{ secrets.CI_BOT_APP_ID || secrets.CI_APP_ID || secrets.ORG_MANAGER_APP_ID || secrets.ORGANIZATION_APP_ID || secrets.APP_ID }}
          APP_PRIVATE_KEY: ${{ secrets.CI_BOT_APP_PRIVATE_KEY || secrets.CI_APP_PRIVATE_KEY || secrets.ORG_MANAGER_APP_PRIVATE_KEY || secrets.ORGANIZATION_APP_PRIVATE_KEY || secrets.APP_PRIVATE_KEY }}
        if: ${{ env.APP_ID != '' && env.APP_PRIVATE_KEY != '' }}
        uses: actions/create-github-app-token@c1a285145b9d317df6ced56c09f525b5c2b6f755 # v1.11.1
        with:
          app-id: ${{ env.APP_ID }}
          private-key: ${{ env.APP_PRIVATE_KEY }}
          owner: ${{ github.repository_owner }}
```

If organization secrets are configured, `steps.app-token.outputs.token` provides an ephemeral 60-minute Installation Access Token. Downstream steps consume this token via `NODE_AUTH_TOKEN: ${{ steps.app-token.outputs.token || secrets.GITHUB_TOKEN }}`.

---

## 7. Configuring Keys in Kubernetes Clusters (`platform/k8s`)

In containerized production environments, exposing private keys as environment variables introduces security risks (e.g. leakage via `docker inspect`, core dumps, or APM traces). The enterprise standard is to **mount the `.pem` file as a read-only filesystem volume**.

### Pattern 1: Native Kubernetes Secret Volume Mount
1. Create a native Kubernetes Secret containing the raw `.pem` file:
   ```bash
   kubectl create secret generic github-org-manager-app-key \
     --namespace=cortex \
     --from-file=org-manager.pem=keys/tupynambalucas-org-manager.2026-11-07.private-key.pem
   ```
2. Mount the secret as a read-only volume in your deployment manifest:
   ```yaml
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: cortex-mcp-github
     namespace: cortex
   spec:
     template:
       spec:
         containers:
           - name: mcp-github
             image: ghcr.io/tupynambalucas-dev/mcp-github:latest
             env:
               - name: ORG_MANAGER_APP_ID
                 value: "5648756"
               - name: ORG_MANAGER_APP_INSTALLATION_ID
                 value: "179571234"
               # Provide path to the mounted file:
               - name: ORG_MANAGER_APP_PRIVATE_KEY_PATH
                 value: "/var/run/secrets/github-app/org-manager.pem"
             volumeMounts:
               - name: github-app-secret-volume
                 mountPath: /var/run/secrets/github-app
                 readOnly: true
         volumes:
           - name: github-app-secret-volume
             secret:
               secretName: github-org-manager-app-key
               defaultMode: 0400
   ```

### Pattern 2: Infisical Secret Synchronization (GitOps)
When managing cluster secrets with the Infisical Kubernetes Operator:
1. Store the Base64 key in Infisical Cloud Vault at `/governance/github-apps/ORG_MANAGER_APP_PRIVATE_KEY_BASE64`.
2. Declare an `InfisicalSecret` Custom Resource in `platform/k8s/manifests/` to automatically generate the Kubernetes Secret with zero manual `kubectl` intervention.

---

## 8. Verifying Authentication

To test that your credentials and key are functioning correctly from your local machine:

```bash
cd agent-mesh/mcp/packages/github
node -e "
require('dotenv').config({ path: '../../../.env' });
const { getOctokitClient } = require('./dist/auth/github-app.auth');
(async () => {
  try {
    const octokit = await getOctokitClient();
    const res = await octokit.request('GET /installation/repositories');
    console.log('GitHub App Auth SUCCESS! Total accessible repositories:', res.data.total_count);
  } catch (err) {
    console.error('GitHub App Auth ERROR:', err.message);
  }
})();
"
```

Expected output:
```text
GitHub App Auth SUCCESS! Total accessible repositories: 9
```

---

## 9. Cryptographic Hygiene and Workstation Cleanup

Once your private keys are safely stored in Infisical Cloud Vault, configured in GitHub Actions Organization Secrets, and set in local `.env`:

1. Delete unencrypted `.pem` files from your workstation:
   ```powershell
   Remove-Item "keys/*.pem" -Force
   ```
2. Verify that `git status` shows zero unstaged or untracked `.pem` files:
   ```bash
   git status
   ```
3. Never commit `.pem` files, plaintext keys, or unredacted tokens to any repository.

---

## 10. Navigation

- [Parent Reference Index](../README.md)
- [Tutorial: Creating a GitHub App End-to-End](../tutorials/creating-a-github-app-end-to-end.md)
- [Reference: GitHub Apps Catalog and Credentials](../reference/github-apps-catalog-and-credentials.md)
- [Explanation: Three-Tier GitHub App Identity Architecture](../explanation/github-app-identity-architecture.md)
