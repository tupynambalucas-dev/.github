# Secrets Management & Infisical Governance Rules

> **CRITICAL AGENT INSTRUCTION (SECRETS ZERO & LEAST PRIVILEGE):**
> Agents operating in this repository MUST strictly follow centralized secrets governance.
> Plaintext secrets, tokens, or credentials MUST NEVER be committed to Git or written to
> unencrypted files on disk outside secure memory injection.

---

## 1. Secrets Zero & Storage Constraints

1. **Root & Workspace Script Ban**: Agents MUST NEVER hardcode passwords, API keys, or private tokens
   into application source files, Dockerfiles, or unencrypted local `.env` files.
2. **Git Commit Scrubbing**: All Git commits must be inspected prior to committing. Any inadvertent
   secret exposure must be neutralized immediately using interactive rebase or history scrubbing.
3. **In-Memory Injection**: For local execution and tests, use the Infisical CLI process runner:
   `infisical run --env=<ENV> --path=<PATH> -- <COMMAND>`.

---

## 2. Model Context Protocol (`infisical-mcp`) Integration

The `secrets-expert` plugin provides the `@infisical/mcp` server configured with Universal Auth.

### Active Project Identifiers

- **Project Name**: `tupynambalucas-core`
- **Project ID**: `134783dd-8a83-4dfc-9fd5-979b52bed86d`
- **Project Slug**: `tupynambalucas-core-ez7a`
- **Organization ID**: `c4d4eb7f-37ca-4e90-93a0-1d015735df5b`

### Tool Execution Guidelines

- **Project Discovery**: Use `list-projects` to discover active workspaces and environments.
- **Listing Secrets**: Use `list-secrets` specifying `projectId`, `environmentSlug` (`dev`, `staging`,
  `prod`), and `secretPath` (`/hub/platform`, `/hub/cortex`, `/hub/studio`, `/corporate`).
- **Mutation Safety**: When creating or updating secrets (`create-secret`, `update-secret`), verify
  the exact key casing and ensure value parity across dependent environments where required.
- **Log Masking**: Keep `INFISICAL_MASK_SECRET_VALUES` configured appropriately to avoid accidental
  token leakage in conversation transcripts.

---

## 3. Kubernetes Operator Credentials Taxonomy

When provisioning or validating Kubernetes secrets for the Infisical Operator:

1. **Canonical Secret Name**: The secret resource MUST be named `infisical-auth-credentials` across
   all namespaces (`platform`, `corporate`, `cortex`, `studio`).
2. **Contractual Keys**: The Secret payload MUST contain exactly two stringData keys:
   - `clientId`
   - `clientSecret`
3. **Cluster Operator Machine Identity Mapping**:
   - **Dev (`k3d-hub`, `k3d-corporate`)**: Identity `tupynambalucas-dev-operator`
     - Client ID: `2e411f31-005d-4e40-8404-94b031c711df`
   - **Staging**: Identity `tupynambalucas-staging-operator`
     - Client ID: `4c5c836d-5a81-4b3d-9b9d-027036239170`
   - **Prod**: Identity `tupynambalucas-prod-operator`
     - Client ID: `6ad9fd63-5078-4a22-bf91-f2697c3ae54f`
   - **AI Agent MCP Server**: Identity `tupynambalucas-mcp-agent`
     - Client ID: `dc82b415-bb7a-41d9-900f-5993a9b159c0`

---

## 4. Zero-Downtime Secret Rotation

To rotate Client Secrets without service disruption:

1. Generate an incremented versioned secret in Infisical (e.g., `cloud-prod-operator-v2`).
2. Update the Kubernetes Secret manifest `infisical-auth-credentials`.
3. Verify cluster operator synchronization.
4. Revoke the retired credential version (`cloud-prod-operator-v1`) in the Infisical dashboard.

Consult the authoritative [Secrets Management Plan](../../plans/enterprise-architecture/secrets-management.md)
for comprehensive architectural details.
