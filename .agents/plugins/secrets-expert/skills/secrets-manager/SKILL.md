---
name: secrets-manager
description: Use this skill to manage, inspect, sync, and rotate secrets using Infisical Cloud, Universal Auth, the Infisical MCP server, and Kubernetes InfisicalSecret manifests.
---

# Secrets Manager Skill

This skill defines the operational runbook and protocols for managing enterprise secrets across
`dev`, `staging`, and `prod` environments within the `tupynambalucas` monorepo.

---

## 1. Tool Selection Protocol

Select the appropriate secrets interface based on the operational context:

| Context / Operation               | Preferred Interface | Mechanism                                                         |
| :-------------------------------- | :------------------ | :---------------------------------------------------------------- |
| **Agent Autonomous Manipulation** | `@infisical/mcp`    | MCP stdio tool calling (`create-secret`, `update-secret`)         |
| **Local Process Execution**       | Infisical CLI       | `infisical run --env=dev --path=/corporate -- <command>`          |
| **Cluster Runtime Sync**          | Kubernetes Operator | `InfisicalSecret` CRD referencing `infisical-auth-credentials`    |
| **CI/CD Build Pipelines**         | GitHub Actions      | `ext_sync_secrets.sh` synchronizing to GitHub Environment Secrets |

---

## 2. Monorepo Project Scope

- **Project ID**: `134783dd-8a83-4dfc-9fd5-979b52bed86d`
- **Project Slug**: `tupynambalucas-core-ez7a`
- **Environments**: `dev`, `staging`, `prod`

---

## 3. Standard Context Paths

Secrets are partitioned into four canonical folder paths:

1. `/hub/platform`: Infrastructure credentials (`CLOUDFLARE_TUNNEL_TOKEN_HUB`, `GRAFANA_ADMIN_PASSWORD`).
2. `/hub/cortex`: AI foundation model API keys (`OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `FIRECRAWL_API_KEY`).
3. `/hub/studio`: Studio tooling tokens (`PENPOT_PUBLIC_URI`, `PENPOT_SECRET_KEY`).
4. `/corporate`: Public product credentials (`CLOUDFLARE_TUNNEL_TOKEN_CORPORATE`, `MONGO_PASSWORD`, `REDIS_PASSWORD`, `FASTIFY_JWT_SECRET`).

---

## 3. Kubernetes Secret Generation Workflow

To provision or update the cluster authentication credentials secret:

```bash
kubectl create secret generic infisical-auth-credentials \
  --namespace=<TARGET_NAMESPACE> \
  --from-literal=clientId="<OPERATOR_CLIENT_ID>" \
  --from-literal=clientSecret="<OPERATOR_CLIENT_SECRET>" \
  --dry-run=client -o yaml > k8s/overlays/<ENV>/<CONTEXT>/patches/infisical-credentials.yaml
```

Always verify that the resulting manifest is added to the overlay `kustomization.yaml`.
