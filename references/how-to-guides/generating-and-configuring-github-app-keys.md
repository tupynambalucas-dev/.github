# How-To Guide: Generating, Encoding, and Configuring GitHub App Keys

**Classification**: Diataxis How-To Guide (Task-Oriented)  
**Target Audience**: DevOps Engineers, Platform Operators, and System Administrators  
**Organization**: `tupynambalucas-dev`  
**Prerequisites**: An existing GitHub App registered in `tupynambalucas-dev`  
**Standard**: en-US Technical Specification (Strict Zero-Emoji Policy)

---

## 1. Goal and Overview

This operational guide details the complete procedure for generating, encoding, and distributing RSA private keys for GitHub Apps across local developer workstations, GitHub Actions CI/CD workflows, and Kubernetes clusters (`platform/k8s`).

We follow the enterprise standard:
* **Base64 String (`_BASE64`)**: Recommended for local `.env` files and cloud environment variables.
* **Filesystem Path (`_PATH`)**: Recommended for Kubernetes Secret volumes and containerized production daemons.
* **Raw Multiline PEM**: Used exclusively in GitHub Actions Organization Secrets web forms.

---

## 2. Generating a Private Key on GitHub

1. Navigate to your App's settings in the organization dashboard:
   ```text
   https://github.com/organizations/tupynambalucas-dev/settings/apps/<app-slug>
   ```
2. In the left navigation sidebar, click **Credentials**.
3. Under **Key pairs** / **Private keys**, click the button **Generate a private key**.
4. Your browser will download a file named `<app-slug>.<timestamp>.private-key.pem` (e.g. `tupynambalucas-org-manager.2026-11-07.private-key.pem`).
5. Move this file to a temporary, git-ignored directory on your machine (such as `keys/` in the workspace root).

---

## 3. Encoding Private Keys to Base64 for `.env` and Cloud Vaults

To prevent parsing errors caused by multiline strings and cross-platform line endings (`\r\n` vs `\n`), convert the downloaded `.pem` file into a Base64-encoded string.

### Windows (PowerShell)
```powershell
$keyPath = "keys/tupynambalucas-org-manager.2026-11-07.private-key.pem"
$base64Key = [Convert]::ToBase64String([IO.File]::ReadAllBytes($keyPath))

# Copy to clipboard for easy pasting into .env:
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

## 4. Configuring Local Environment Variables (`.env`)

In your local configuration files (`org-core/.env` and `agent-mesh/.env`), populate the Base64 variable:

```dotenv
# -- Tier 1: tupynambalucas-org-manager (Administrative Headless Machine Identity)
GITHUB_ORG_MANAGER_APP_ID="5648756"
GITHUB_ORG_MANAGER_APP_CLIENT_ID="Iv23lijGKyMy4ZmR8kAa"
GITHUB_ORG_MANAGER_APP_INSTALLATION_ID="179571234"
GITHUB_ORG_MANAGER_APP_PRIVATE_KEY_BASE64="LS0tLS1CRUdJTiBSU0EgUFJJVkFURSBLRVktLS0tLQpNSUlFc..."
GITHUB_ORG_MANAGER_APP_PRIVATE_KEY_PATH=""

# -- Tier 2: tupynambalucas-ci-bot (Autonomous Continuous Delivery Identity)
GITHUB_CI_BOT_APP_ID="5650100"
GITHUB_CI_BOT_APP_CLIENT_ID="Iv23liVfQ814P54tQusd"
GITHUB_CI_BOT_APP_INSTALLATION_ID="179570999"
GITHUB_CI_BOT_APP_PRIVATE_KEY_BASE64="LS0tLS1CRUdJTiBSU0EgUFJJVkFURSBLRVktLS0tLQpNSUlFc..."
GITHUB_CI_BOT_APP_PRIVATE_KEY_PATH=""
```

The runtime loader (`@tupynambalucas-dev/mcp-github`) automatically detects the Base64 string and decodes it in memory via `Buffer.from(key, 'base64')`.

---

## 5. Configuring GitHub Actions Organization Secrets (CI/CD)

GitHub Actions workflows run in cloud virtual machines and require organization secrets to execute autonomous tasks.

1. Navigate to Organization Actions Secrets:
   ```text
   https://github.com/organizations/tupynambalucas-dev/settings/secrets/actions
   ```
2. Click **New organization secret**.
3. Create the following secrets for **`tupynambalucas-ci-bot`**:
   * **Secret 1: App ID**
     * **Name**: `CI_APP_ID`
     * **Secret**: `5650100`
     * **Repository access**: **All repositories**.
   * **Secret 2: Private Key**
     * **Name**: `CI_APP_PRIVATE_KEY`
     * **Secret**: Open `tupynambalucas-ci-bot.2026-11-07.private-key.pem` in a text editor. Select all content (`Ctrl+A`), copy (`Ctrl+C`), and paste directly into the textarea.  
       *(Do not wrap in quotes or escape newlines; GitHub Actions expects the raw PEM text).*
     * **Repository access**: **All repositories**.
4. *(Optional)* Add `ORGANIZATION_APP_ID` and `ORGANIZATION_APP_PRIVATE_KEY` for workflows requiring Tier 1 administrative fallback.

---

## 6. Configuring Keys in Kubernetes Clusters (`platform/k8s`)

In containerized production environments, exposing private keys as environment variables introduces security risks (e.g. leakage via `docker inspect`, core dumps, or APM traces). The enterprise standard is to **mount the `.pem` file as a read-only filesystem volume**.

### Pattern 1: Kubernetes Secret Volume Mount
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
               - name: GITHUB_ORG_MANAGER_APP_ID
                 value: "5648756"
               - name: GITHUB_ORG_MANAGER_APP_INSTALLATION_ID
                 value: "179571234"
               # Provide path to the mounted file:
               - name: GITHUB_ORG_MANAGER_APP_PRIVATE_KEY_PATH
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
1. Store the Base64 key in Infisical Cloud Vault at `/governance/github-apps/GITHUB_ORG_MANAGER_APP_PRIVATE_KEY_BASE64`.
2. Declare an `InfisicalSecret` Custom Resource in `platform/k8s/manifests/` to automatically generate the Kubernetes Secret with zero manual `kubectl` intervention.

---

## 7. Verifying Authentication

To test that your credentials and key are functioning correctly:

1. Run the verification script against the GitHub API:
   ```bash
   node -e "
   import('./agent-mesh/mcp/packages/github/dist/auth/github-app.auth.js').then(async m => {
     const octokit = await m.getOctokitClient();
     const res = await octokit.request('GET /orgs/{org}', { org: 'tupynambalucas-dev' });
     console.log('GitHub App Auth SUCCESS! Authenticated as:', res.data.login);
   });
   "
   ```
2. Expected output:
   ```text
   GitHub App Auth SUCCESS! Authenticated as: tupynambalucas-dev
   ```

---

## 8. Cryptographic Hygiene and Workstation Cleanup

Once your private keys are safely stored in Infisical Cloud Vault, configured in GitHub Actions secrets, and set in local `.env`:

1. Delete unencrypted `.pem` files from your workstation:
   ```powershell
   Remove-Item "keys/*.pem" -Force
   ```
2. Verify that `git status` shows zero unstaged or untracked `.pem` files:
   ```bash
   git status
   ```
3. Never commit `.pem` files or plaintext keys to any repository.

---

## 9. Navigation

- [Tutorial: Creating a GitHub App End-to-End](../tutorials/creating-a-github-app-end-to-end.md)
- [Reference: GitHub Apps Catalog and Credentials](../reference/github-apps-catalog-and-credentials.md)
- [Explanation: Three-Tier GitHub App Identity Architecture](../explanation/github-app-identity-architecture.md)
