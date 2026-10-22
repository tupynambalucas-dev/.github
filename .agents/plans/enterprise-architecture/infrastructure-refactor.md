# Infrastructure Refactor

Renames `infrastructure/` to `k8s/` and reorganizes it by bounded context and resource
domain, with one overlay per environment and deploy target.

## 1. Target Tree

```text
k8s/
  skaffold.yaml                 root config, requires the two modules below
  skaffold.hub.yaml             hub artifacts and deploy
  skaffold.corporate.yaml       corporate artifacts (web, api, portal) and deploy
  manifests/
    hub/
      namespaces/               cortex, platform, studio
      observability/            grafana, loki, prometheus, tempo, otelcol, fluentbit, kube-state-metrics
      network/                  cloudflared, traefik
      tools/                    headlamp, turbocache
      studio/
        penpot/
        memos/
      cortex/
        gateway/                agentgateway routing and config
        memory/                 mongodb, api, web, ingress
        mcp/                    context7, firecrawl, github, grafana, guardrails, inspector, kubectl, memory, playwright
    corporate/
      namespaces/               corporate
      network/                  cloudflared
      redis/                    redis deployment, pvc, service
      api/                      api deployment, service, ingress
      web/                      web deployment, service, ingress
      mongodb/                  mongodb deployment, pvc, service (dev only)
      portal/                   docusaurus portal deployment, service, ingress, namespace (dev only)
  charts/                       vendored Helm charts (traefik-26.0.0, agentgateway)
  overlays/
    dev/
      hub/                      k3d-hub overlay with *-dev host patches and .env secretGenerator
      corporate/                k3d-corporate overlay with *-dev host patches, portal, mongodb
    staging/
      hub/                      staging hub overlay with *-stg host patches
      corporate/                staging corporate overlay with web-stg and api-stg host patches
    prod/
      hub/                      prod hub overlay (2 cloudflared replicas)
      corporate/                prod corporate overlay (2 cloudflared replicas)
  references/
    explanation/ guides/ reference/   Diataxis documentation
  .env.example
  AGENTS.md
  README.md
  package.json
```

## 2. File Mapping

| Current file in `infrastructure/`                                | New location in `k8s/`                                                                                          |
| :--------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------- |
| `manifests/cert-manager-namespace.yaml`                          | removed, obsolete (cert-manager eliminated)                                                                     |
| `manifests/cortex-namespace.yaml`                                | `manifests/hub/namespaces/cortex.yaml`                                                                          |
| `manifests/docs-namespace.yaml`                                  | `manifests/corporate/portal/namespace.yaml` (dev only)                                                          |
| `manifests/platform-namespace.yaml`                              | `manifests/hub/namespaces/platform.yaml`                                                                        |
| `manifests/studio-namespace.yaml`                                | `manifests/hub/namespaces/studio.yaml`                                                                          |
| `manifests/platform-grafana.yaml`                                | `manifests/hub/observability/grafana/grafana.yaml`                                                              |
| `manifests/platform-prometheus.yaml`                             | `manifests/hub/observability/prometheus/prometheus.yaml`                                                        |
| `manifests/platform-loki.yaml`                                   | `manifests/hub/observability/loki/loki.yaml`                                                                    |
| `manifests/platform-tempo.yaml`                                  | `manifests/hub/observability/tempo/tempo.yaml`                                                                  |
| `manifests/platform-otelcol.yaml`                                | `manifests/hub/observability/otelcol/otelcol.yaml`                                                              |
| `manifests/platform-fluentbit.yaml`                              | `manifests/hub/observability/fluentbit/fluentbit.yaml`                                                          |
| `manifests/platform-kubestatemetrics.yaml`                       | `manifests/hub/observability/kube-state-metrics.yaml`                                                           |
| `manifests/platform-cloudflared.yaml`                            | `manifests/hub/network/cloudflared.yaml`                                                                        |
| `manifests/traefik-ingress.yaml`                                 | `manifests/hub/network/traefik.yaml`                                                                            |
| `manifests/platform-headlamp.yaml`                               | `manifests/hub/tools/headlamp.yaml`                                                                             |
| `manifests/platform-turbocache.yaml`                             | `manifests/hub/tools/turbocache.yaml`                                                                           |
| `manifests/studio-penpot.yaml`                                   | `manifests/hub/studio/penpot/penpot.yaml`                                                                       |
| `manifests/studio-penpot-seed.yaml`                              | `manifests/hub/studio/penpot/seed.yaml`                                                                         |
| `manifests/studio-memos.yaml`                                    | `manifests/hub/studio/memos/memos.yaml`                                                                         |
| `manifests/studio-memos-seed.yaml`                               | `manifests/hub/studio/memos/seed.yaml`                                                                          |
| `manifests/cortex-mcp.yaml`                                      | split into `manifests/hub/cortex/mcp/`                                                                          |
| `manifests/cortex-memory.yaml`                                   | split into `manifests/hub/cortex/memory/` (`mongodb.yaml`, `api.yaml`, `web.yaml`, `ingress.yaml`)              |
| `manifests/kb-docusaurus-portal.yaml`                            | `manifests/corporate/portal/portal.yaml` (dev only)                                                             |
| _New: Corporate Web_                                             | `manifests/corporate/web/web.yaml`                                                                              |
| _New: Corporate API_                                             | `manifests/corporate/api/api.yaml`                                                                              |
| _New: Corporate Redis_                                           | `manifests/corporate/redis/redis.yaml`                                                                          |
| _New: Corporate MongoDB (Dev)_                                   | `manifests/corporate/mongodb/mongodb.yaml`                                                                      |
| `charts/agentgateway`                                            | `charts/agentgateway`                                                                                           |
| `charts/cert-manager-v1.14.4`                                    | removed, obsolete (cert-manager eliminated)                                                                     |
| `charts/traefik-26.0.0`                                          | `charts/traefik-26.0.0`                                                                                         |
| `environments/local/kustomization.yaml`                          | split into `overlays/dev/hub` and `overlays/dev/corporate`                                                      |
| `environments/local/helm-values/traefik-values.yaml`             | `overlays/dev/hub/helm-values/traefik-values.yaml` and `overlays/dev/corporate/helm-values/traefik-values.yaml` |
| `environments/local/traefik-rbac-patch.json`                     | removed, RBAC injected through `extraObjects` in `traefik-values.yaml`                                          |
| `environments/local/charts/*`                                    | removed, duplicate of `charts/`                                                                                 |
| `skaffold.yaml`                                                  | split into `k8s/skaffold.yaml`, `k8s/skaffold.hub.yaml`, `k8s/skaffold.corporate.yaml`                          |
| `.env`, `.env.example`, `AGENTS.md`, `README.md`, `package.json` | same names at `k8s/` root                                                                                       |

## 3. Base Manifest Rules

- Base manifests contain no environment-specific values: no `-dev` hostnames, no replica counts, no
  debug log levels.
- Ingress hosts, replicas, resource limits, log levels, and image references are set by overlay
  patches.
- Namespaces:
  - Hub: `platform`, `cortex`, `studio`.
  - Corporate: `corporate` (for web, api, redis, traefik, cloudflared) and `docs` (`dev` only, for portal).

## 4. Overlays

Every environment has a `hub` and a `corporate` overlay:

| Overlay             | Target cluster            | Hostnames | Tunnel              | Cloudflared Replicas |
| :------------------ | :------------------------ | :-------- | :------------------ | :------------------- |
| `dev/hub`           | `k3d-hub`                 | `*-dev`   | `dev-hub`           | 1                    |
| `dev/corporate`     | `k3d-corporate`           | `*-dev`   | `dev-corporate`     | 1                    |
| `staging/hub`       | staging hub cluster       | `*-stg`   | `staging-hub`       | 1                    |
| `staging/corporate` | staging corporate cluster | `*-stg`   | `staging-corporate` | 1                    |
| `prod/hub`          | prod hub cluster          | clean     | `prod-hub`          | 2                    |
| `prod/corporate`    | prod corporate cluster    | clean     | `prod-corporate`    | 2                    |

In dev, secrets are populated via `secretGenerator` from `k8s/.env`:

- Hub dev overlay generates `platform-secrets`, `cortex-secrets`, and `studio-secrets`.
- Corporate dev overlay generates `corporate-secrets`.

In staging and prod, secrets are managed via Bitnami Sealed Secrets (see
[Secrets management](./secrets-management.md)).

## 5. Skaffold

Skaffold is used only for local development (`dev`):

- `k8s/skaffold.yaml`: Root orchestrator requiring `skaffold.hub.yaml` and `skaffold.corporate.yaml`.
- `k8s/skaffold.hub.yaml`:
  - Builds platform and studio artifacts.
  - Deploys `overlays/dev/hub` into `k3d-hub`.
  - Installs Traefik Helm release in namespace `platform`.
  - Port forwards `agentgateway`, `memory-api`, and `penpot-frontend`.
- `k8s/skaffold.corporate.yaml`:
  - Builds `corporate-api`, `corporate-web`, and `kb-docusaurus-portal`.
  - Configures file sync for real-time hot reloading.
  - Deploys `overlays/dev/corporate` into `k3d-corporate`.
  - Installs Traefik Helm release in namespace `corporate`.

Usage:

| Command                                   | Result                                                                    |
| :---------------------------------------- | :------------------------------------------------------------------------ |
| `skaffold dev -f skaffold.hub.yaml`       | Builds and deploys hub stack to `k3d-hub`.                                |
| `skaffold dev -f skaffold.corporate.yaml` | Builds and deploys corporate stack to `k3d-corporate`.                    |
| `skaffold dev` (from `k8s/`)              | Builds and deploys both stacks concurrently to their respective clusters. |

## 6. Cloud Delivery

Staging and prod overlays are delivered via ArgoCD GitOps. Terraform provisions the cloud clusters,
networking, and Cloudflare Zero Trust configurations.
