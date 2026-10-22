# Enterprise Structure

Defines the bounded contexts, environments, clusters, domains, and deployment tooling for
the enterprise monorepo.

## 1. Bounded Contexts

| Context     | Audience      | Contains                                                                                                       |
| :---------- | :------------ | :------------------------------------------------------------------------------------------------------------- |
| `hub`       | Internal team | `observability`, `network`, `tools`, `studio`, `cortex`                                                        |
| `corporate` | Public        | Website (`web`), API (`api`), `redis`, `mongodb` (`dev` only), and documentation portal (`portal`, `dev` only) |

### Hub services

| Area            | Services                                                                                  |
| :-------------- | :---------------------------------------------------------------------------------------- |
| `observability` | Grafana, Prometheus, Loki, Tempo, OpenTelemetry Collector, Fluent Bit, kube-state-metrics |
| `network`       | Traefik, Cloudflared                                                                      |
| `tools`         | Headlamp, Turbocache                                                                      |
| `studio`        | Penpot, Memos, design assets, bucket sync                                                 |
| `cortex`        | AgentGateway, MCP services, Memory API and web                                            |

### Corporate services

| Service   | Description                            | Deployed in K8s Environments                             |
| :-------- | :------------------------------------- | :------------------------------------------------------- |
| `web`     | Company website (React SPA via Nginx). | `dev`, `staging`, `prod`                                 |
| `api`     | Company API (Fastify).                 | `dev`, `staging`, `prod`                                 |
| `redis`   | Session store and cache.               | `dev`, `staging`, `prod`                                 |
| `mongodb` | Database container with replica set.   | `dev` only (staging and prod connect to MongoDB Atlas)   |
| `portal`  | Documentation portal (Docusaurus).     | `dev` only (staging and prod deploy to Cloudflare Pages) |

## 2. Environments and Clusters

| Environment | Where it runs     | Clusters                                                                | Deployed by     |
| :---------- | :---------------- | :---------------------------------------------------------------------- | :-------------- |
| `dev`       | Local k3d on WSL2 | Two isolated clusters (`k3d-hub` and `k3d-corporate`) on shared network | Skaffold        |
| `staging`   | Cloud             | Two isolated clusters (`hub` and `corporate`)                           | GitOps (ArgoCD) |
| `prod`      | Cloud             | Two isolated clusters (`hub` and `corporate`)                           | GitOps (ArgoCD) |

```mermaid
flowchart LR
  direction LR
  subgraph local["Local WSL2: dev"]
    direction TB
    devhub["k3d-hub cluster"]
    devcorp["k3d-corporate cluster"]
  end
  subgraph cloud["Cloud: staging and prod"]
    direction TB
    hubc["hub cluster"]
    corpc["corporate cluster"]
  end
  local -. "100% architectural parity" .-> cloud
```

Running two isolated clusters in dev achieves **full architectural parity with production**.
Internal tooling (Hub) and customer-facing products (Corporate) stay strictly isolated across all
lifecycle stages. Skaffold dispatches workloads to `k3d-hub` and `k3d-corporate` via `kubeContext`.

## 3. Domains

Cloudflare Universal SSL covers one subdomain level, so environments use a suffix instead of a
nested subdomain.

| Environment | Pattern                       | Example                                                        |
| :---------- | :---------------------------- | :------------------------------------------------------------- |
| `dev`       | `NAME-dev.tupynambalucas.dev` | `grafana-dev.tupynambalucas.dev`, `web-dev.tupynambalucas.dev` |
| `staging`   | `NAME-stg.tupynambalucas.dev` | `grafana-stg.tupynambalucas.dev`, `web-stg.tupynambalucas.dev` |
| `prod`      | `NAME.tupynambalucas.dev`     | `grafana.tupynambalucas.dev`, `web.tupynambalucas.dev`         |

Base manifests declare the production hostnames without environment suffixes. The `dev` and
`staging` overlays replace each Ingress `host` via inline JSON 6902 patches.

Documentation Portal exception: In `staging` and `prod`, `docs.tupynambalucas.dev` is hosted on
Cloudflare Pages. In `dev`, `docs-dev.tupynambalucas.dev` is served through Traefik and the
`dev-corporate` tunnel.

## 4. Ingress

Each cluster runs its own Traefik configured as `ClusterIP`. A central ingress for several clusters
would be a single point of failure and would couple environments.

Cloudflare Tunnel is the unified ingress mechanism across all environments (`dev`, `staging`,
and `prod`). TLS terminates at Cloudflare edge with automatic DDoS protection and WAF. No public
IPs, cloud LoadBalancers, or cert-manager are required in any environment. See
[Cloudflared tunnels](./cloudflared-tunnels.md) and
[Tunnel provisioning strategy](./tunnel-provisioning-strategy.md) for architecture, configuration,
and security rules.

## 5. Tooling by Stage

| Stage                | Tool                      | Role                                                               |
| :------------------- | :------------------------ | :----------------------------------------------------------------- |
| Local loop           | Skaffold                  | Build, push to the k3d registry, deploy, and sync files.           |
| Manifests            | Kustomize and Helm        | Base manifests plus per-environment overlays.                      |
| Secrets (Local)      | Kustomize secretGenerator | Injects uncommitted `k8s/.env` into local clusters.                |
| Secrets (Cloud)      | Bitnami Sealed Secrets    | Encrypts secrets for GitOps repository commits without plain text. |
| Cloud delivery       | ArgoCD                    | Pulls from git and applies the `staging` and `prod` overlays.      |
| Cloud infrastructure | Terraform                 | Creates the cloud clusters and Cloudflare Zero Trust resources.    |
| Cluster inspection   | Freelens                  | Desktop client for every cluster context.                          |
| Team dashboard       | Headlamp                  | In-cluster web dashboard, deployed from `hub`.                     |

Kustomize overlays are consumed by both Skaffold and ArgoCD, so one manifest tree serves every
stage. Terraform lives outside `k8s`, in its own top-level folder, because it provisions
the clusters and Cloudflare resources.

## 6. Cross-Context Dependency

`hub/studio/assets` holds design tokens and brand assets that `corporate` consumes. This is an
accepted dependency. Rules:

- `corporate` may import only packages published from `hub/studio/assets` through the workspace
  package boundary.
- `corporate` must not import anything else from `hub`.
- `hub` must not import from `corporate`.
