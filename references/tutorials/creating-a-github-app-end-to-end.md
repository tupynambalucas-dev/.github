# Tutorial: Creating and Installing a GitHub App End-to-End

**Classification**: Diataxis Tutorial (Learning-Oriented)  
**Target Audience**: DevOps Engineers, Platform Architects, and System Administrators  
**Organization**: `tupynambalucas-dev`  
**Prerequisites**: Organization Owner or Admin role in `tupynambalucas-dev`  
**Standard**: en-US Technical Specification (Strict Zero-Emoji Policy)

---

## 1. Overview and Learning Objectives

By following this tutorial, you will create, configure, and install an enterprise-grade GitHub App within the `tupynambalucas-dev` organization. You will learn:

1. How to register a new GitHub App in the organization settings.
2. How to configure OAuth 2.0 Device Flow and token expiration boundaries.
3. How to define least-privilege repository, organization, and account permissions.
4. How to install the application across organization repositories.
5. How to delegate administrative authority using **App managers** without elevating user roles to Organization Owner.
6. How to generate an RSA cryptographic key pair and obtain client credentials.

---

## 2. Navigating to the Organization App Portal

1. Open your browser and navigate to the GitHub organization dashboard:
   ```text
   https://github.com/organizations/tupynambalucas-dev/settings/apps
   ```
2. In the top-right corner, click **New GitHub App**.
3. Authenticate with your administrative credentials or security key when prompted.

---

## 3. Step 1: Configuring Application Metadata

In the **GitHub App name** and metadata section:

1. **GitHub App name**: Enter a unique, deterministic name conforming to organization naming standards:
   * Pattern: `tupynambalucas-<domain>-<identity>`
   * Example: `tupynambalucas-org-manager`, `tupynambalucas-ci-bot`, or `tupynambalucas-developer-tools`.
2. **Description**: Author an informative markdown description explaining:
   * The purpose of the identity (administrative machine, CI runner, or developer tooling).
   * Core capabilities and operational boundaries.
   * Security constraints (e.g. read-only, non-admin, ephemeral token minting).
3. **Homepage URL**:
   ```text
   https://docs.tupynambalucas.dev
   ```

---

## 4. Step 2: User Authorization and Authentication Mechanics

Configure the authentication protocols according to the identity type:

1. **Callback URL**:
   * For headless machine identities (Tier 1 & Tier 2) and Device Flow CLI tools (Tier 3), leave this field **completely empty**.
2. **Expire user authorization tokens**:
   * **Checked (Mandatory)**: Enforces short-lived 8-hour user tokens with automatic refresh token rotation.
3. **Request user authorization (OAuth) during installation**:
   * **Unchecked**: Keeps installation separate from individual user OAuth consent.
4. **Enable Device Flow**:
   * **Checked** for developer CLI applications (`tupynambalucas-developer-tools`).
   * **Unchecked** for headless background identities (`tupynambalucas-org-manager`, `tupynambalucas-ci-bot`).

---

## 5. Step 3: Webhook Configuration

1. **Active**:
   * **Unchecked** (unless you are explicitly deploying an event-driven webhook listener daemon in Kubernetes or serverless).
   * Leaving webhooks disabled eliminates unnecessary network traffic and avoids webhook delivery failure alerts.
2. If webhooks are required for an active listener service:
   * **Webhook URL**: Must use HTTPS (`https://api.tupynambalucas.dev/webhooks/github`).
   * **Webhook secret**: Generate a high-entropy 64-character secret and store it in Infisical Cloud Vault (`/governance/webhooks`).

---

## 6. Step 4: Configuring Least-Privilege Scopes

Navigate to **Permissions** and expand each scope section:

### A. Repository Permissions
Select only the permissions strictly required for the application's operational boundary:
* **Contents**: Read-only (or Read and write if commits/branches are required).
* **Pull requests**: Read and write (for CI bots authoring review comments or PRs).
* **Checks & Commit statuses**: Read and write (for test verification bots).
* **Metadata**: Read-only (mandatory and set automatically by GitHub).

### B. Organization Permissions
* **Members**: Read-only (to verify team membership rosters).
* **Administration**: No access (reserved strictly for Tier 1 Org Manager).

### C. Account Permissions
* For developer tools apps enabling SSH key onboarding:
  * **Git SSH keys**: Read and write.
  * **SSH signing keys**: Read and write.
  * **Profile**: Read and write.
  * **Email addresses**: Read-only.

---

## 7. Step 5: Installation Scope and Creation

1. Under **Where can this GitHub App be installed?**, select:
   * **Only on this account** (`@tupynambalucas-dev`).
2. Click the green button: **Create GitHub App**.
3. GitHub generates the application and redirects you to the App's **General** settings dashboard.

---

## 8. Step 6: Obtaining Identifiers and Generating Cryptographic Keys

On the application dashboard:

1. Under **About**, record the following public identifiers:
   * **App ID**: A numeric identifier (e.g. `5648756`).
   * **Client ID**: A public alphanumeric string starting with `Iv23...` (e.g. `Iv23lijGKyMy4ZmR8kAa`).
2. In the left navigation sidebar, click **Credentials**:
   * **For Headless Machine Identities (Tier 1 & Tier 2)**:
     1. Scroll to **Private keys** (or Key pairs).
     2. Click **Generate a private key**.
     3. A cryptographic `.pem` file will download to your local machine (e.g. `tupynambalucas-org-manager.2026-11-07.private-key.pem`).
     4. Store this file securely; it is never shown again by GitHub.
   * **For Interactive Developer Tooling (Tier 3)**:
     * **Do NOT generate a private key or client secret**. Tier 3 applications identify themselves via the public Client ID using OAuth 2.0 Device Flow.

---

## 9. Step 7: Installing the Application on the Organization

1. In the left navigation sidebar of the App settings, click **Install App**.
2. Locate `@tupynambalucas-dev` and click **Install**.
3. Under **Repository access**:
   * Select **All repositories** (for organization-wide tools and CI bots).
   * Or select **Only select repositories** (for isolated service bots).
4. Click **Install**.
5. After installation, observe the URL in your browser:
   ```text
   https://github.com/organizations/tupynambalucas-dev/settings/installations/179571234
   ```
   The trailing number (`179571234`) is your **Installation ID**. Record this number.

---

## 10. Step 8: Delegating Administration via App Managers

To maintain the principle of least privilege, do not require team leads to become Organization Owners just to manage app settings:

1. Return to the App settings page:
   ```text
   https://github.com/organizations/tupynambalucas-dev/settings/apps/<app-slug>
   ```
2. In the left navigation sidebar, click **App managers**.
3. Click **Add people or teams**.
4. In the search box, type `lead-architects` and click **Grant**.
5. (For CI bots, additionally add `infra-ops`).
6. Confirm that the team appears in the App managers list.
7. Verify that general developer teams (`core-engineers`, `contractors`) are **never** added to App managers.

---

## 11. Next Steps and Related Documentation

Now that your GitHub App is created and installed, proceed to:

- [How-To: Generating and Configuring GitHub App Keys](../how-to-guides/generating-and-configuring-github-app-keys.md)
- [Reference: GitHub Apps Catalog and Credentials](../reference/github-apps-catalog-and-credentials.md)
- [Explanation: Three-Tier GitHub App Identity Architecture](../explanation/github-app-identity-architecture.md)
