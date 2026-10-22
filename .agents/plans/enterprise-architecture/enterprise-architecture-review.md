# Enterprise Architecture Review

Review of the executed [enterprise-architecture](./README.md) plan against
the current repository and the pre-migration backup (`tupynambalucas-backup`). Covers regressions,
Cloudflare domains, tunnels, tokens, and plan gaps.

## 1. Method

- Read all documents of the plan recursively.
- Inspected the current `k8s/` tree, overlays, manifests, Skaffold files, `.env`, and workflows.
- Compared tracked files and `.env` keys against `tupynambalucas-backup`.
- Rendered all 6 overlays with `kubectl kustomize --load-restrictor=LoadRestrictionsNone`. All
  render without errors (exit code 0).

## 2. Regressions and Status Versus the Backup

| #   | Finding                                                                                           | Severity | Resolution Status                                                                                                   |
| :-- | :------------------------------------------------------------------------------------------------ | :------- | :------------------------------------------------------------------------------------------------------------------ |
| 1   | `studio-secrets` was lost in hub overlays. Penpot and Memos consume it.                           | High     | **Fixed**: Added `studio-secrets` (`namespace: studio`) to `secretGenerator` across all hub overlays.               |
| 2   | Corporate `web` and `api` had no Kubernetes manifests.                                            | High     | **Fixed**: Created manifests for `web`, `api`, `redis`, and dev `mongodb`. Added them to `skaffold.corporate.yaml`. |
| 3   | `corporate/services/mongodb` and `corporate/services/redis` legacy custom docker setups remained. | Medium   | **Fixed**: Removed via `git rm`. Using official upstream container images in `k8s/`.                                |
| 4   | `traefik-rbac-patch.json` and `cert-manager` charts removed.                                      | OK       | **Verified**: Traefik RBAC moved to `extraObjects` in `traefik-values.yaml`. cert-manager eliminated.               |
| 5   | Vendored chart `charts/agentgateway` is unused.                                                   | Medium   | **Retained for reference**: Hand-crafted manifest `agentgateway.yaml` is deployed via Kustomize.                    |
| 6   | `.env`: only `CLOUDFLARE_TUNNEL_TOKEN` was split into `_HUB` and `_CORPORATE`.                    | OK       | **Verified**: All other 108 variables preserved.                                                                    |
| 7   | Legacy plans removed from `.agents/plans`.                                                        | Info     | **Documented**: Relevant decisions incorporated into `enterprise-architecture/`.                                    |
| 8   | Backup `.env.prod` contains real MongoDB Atlas password in plain text.                            | Security | **Action required**: User must rotate `elo-admin-prod` credential and purge backup.                                 |

## 3. Domains and Cloudflare

### 3.1 Architectural Resolutions

1. **`docs.tupynambalucas.dev` conflict**: Resolved. Portal deploys to Cloudflare Pages in `staging`
   and `prod`. In `dev`, it runs in Kubernetes behind `docs-dev.tupynambalucas.dev` for Skaffold hot reload.
2. **`dev-hub` hostnames**: Updated. All 11 public hostnames (including the 3 `agentgateway` endpoints)
   are documented in [Cloudflared tunnels](./cloudflared-tunnels.md) and
   [Tunnel provisioning strategy](./tunnel-provisioning-strategy.md).
3. **`host: localhost` in `agentgateway.yaml`**: Removed from base manifest. Direct debugging uses
   Skaffold `portForward` to the `agentgateway` service on port 8080.
4. **Corporate overlays coverage**: `dev`, `staging`, and `prod` corporate overlays now cover `web`
   and `api`.
5. **High availability replicas**: Configured `replicas: 2` in both `prod/hub` and `prod/corporate`.
6. **Corporate namespace isolation**: Traefik, Cloudflared, Web, API, and Redis run in `corporate`
   namespace. In-cluster origin URL is `http://traefik.corporate.svc.cluster.local:80`.

### 3.2 Tunnels Topology

Total: **6** tunnels (1 per cluster):

| Tunnel              | Cluster                 | Hostnames                        | Origin                                          |
| :------------------ | :---------------------- | :------------------------------- | :---------------------------------------------- |
| `dev-hub`           | `k3d-hub`               | 11 `*-dev` endpoints             | `http://traefik.platform.svc.cluster.local:80`  |
| `dev-corporate`     | `k3d-corporate`         | `docs-dev`, `web-dev`, `api-dev` | `http://traefik.corporate.svc.cluster.local:80` |
| `staging-hub`       | Cloud Staging Hub       | 11 `*-stg` endpoints             | `http://traefik.platform.svc.cluster.local:80`  |
| `staging-corporate` | Cloud Staging Corporate | `web-stg`, `api-stg`             | `http://traefik.corporate.svc.cluster.local:80` |
| `prod-hub`          | Cloud Prod Hub          | 11 clean endpoints               | `http://traefik.platform.svc.cluster.local:80`  |
| `prod-corporate`    | Cloud Prod Corporate    | `web`, `api`                     | `http://traefik.corporate.svc.cluster.local:80` |

## 4. Decisions Summary

1. **Documentation Portal**: Cloudflare Pages for staging and prod (`docs.tupynambalucas.dev`).
   Kubernetes for local development (`docs-dev.tupynambalucas.dev`).
2. **Corporate Web and API**: First-class Kubernetes workloads managed in `manifests/corporate` and
   synced via `skaffold.corporate.yaml`.
3. **Secrets Management**: Bitnami Sealed Secrets adopted for `staging` and `prod`. Detailed in
   [Secrets management](./secrets-management.md).

## 5. Validation Checklist

- [x] All 6 Kustomize overlays render cleanly with `kubectl kustomize`.
- [x] Base manifests contain no `-dev` or `localhost` hostnames.
- [x] `prod` overlays patch `cloudflared` deployment to `replicas: 2`.
- [x] `studio-secrets` generated across all hub overlays.
- [ ] Connect `dev-hub` and `dev-corporate` tunnel tokens in `k8s/.env`.
- [ ] Verify pod startup and tunnel health in `k3d-hub` and `k3d-corporate`.
- [ ] Verify Cloudflare Zero Trust Access policies on `hub` hostnames.
