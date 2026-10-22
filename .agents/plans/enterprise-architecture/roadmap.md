# Enterprise Architecture Roadmap

Comprehensive execution matrix tracking completed milestones, immediate operational actions, and
future deployment phases for the enterprise architecture migration.

---

## 1. Executive Status Matrix

```mermaid
flowchart LR
  direction LR
  p0["Phase 0: Prep (Done)"] --> p2["Phase 2: K8s Refactor (Done)"]
  p2 --> p4["Phase 4: Monorepo DDD (Done)"]
  p4 --> p3["Phase 3: Dev Tunnels (Active)"]
  p3 --> p1["Phase 1: Ubuntu Loop (Pending)"]
  p1 --> git["Git Landing (Pending)"]
  git --> p5["Phase 5: Cloud GitOps (Planned)"]

  classDef completed fill:#22c55e,stroke:#16a34a,color:#ffffff;
  classDef active fill:#eab308,stroke:#ca8a04,color:#ffffff;
  classDef pending fill:#64748b,stroke:#475569,color:#ffffff;

  class p0,p2,p4 completed;
  class p3 active;
  class p1,git,p5 pending;
```

| Phase           | Domain                  | Status          | Key Deliverable                                                     | Anchor Reference                                                                                                                                                       |
| :-------------- | :---------------------- | :-------------- | :------------------------------------------------------------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Phase 0**     | Preparation             | Completed       | Clean baseline, backup `tupynambalucas-backup`                      | [migration-phases.md#phase-0-preparation-completed](./migration-phases.md#phase-0-preparation-completed)                                                               |
| **Phase 2**     | Infrastructure Refactor | Completed       | Componentized `k8s/` manifests, 6 valid overlays                    | [infrastructure-refactor.md](./infrastructure-refactor.md)                                                                                                             |
| **Phase 4**     | Monorepo Restructure    | Completed       | DDD hierarchy (`hub/` & `corporate/`), clean workspace              | [monorepo-restructure.md](./monorepo-restructure.md)                                                                                                                   |
| **Phase 3**     | Cloudflare Dev Tunnels  | **In Progress** | Remote tunnels `dev-hub` & `dev-corporate` active                   | [tunnel-provisioning-strategy.md#4-initial-bootstrap-runbook-first-instance-setup](./tunnel-provisioning-strategy.md#4-initial-bootstrap-runbook-first-instance-setup) |
| **Phase 1**     | Ubuntu Environment      | **Pending**     | WSL2 Ubuntu, k3d clusters, toolchain verification                   | [ubuntu-setup.md](./ubuntu-setup.md)                                                                                                                                   |
| **Git Landing** | Branch Integration      | **Pending**     | Merge `chore/enterprise-architecture` into `develop` without squash | [ubuntu-setup.md#6-branch-integration-procedure-landing-into-develop-and-main](./ubuntu-setup.md#6-branch-integration-procedure-landing-into-develop-and-main)         |
| **Phase 5**     | Cloud Staging & Prod    | **Planned**     | Sealed Secrets, Terraform Zero Trust, ArgoCD GitOps                 | [secrets-management.md](./secrets-management.md)                                                                                                                       |

---

## 2. Completed Milestones

### 2.1 Monorepo Restructure (Phase 4)

- [x] Merged website and API into `corporate/services/web` and `corporate/services/api`.
- [x] Merged documentation into `corporate/collections`, `corporate/packages`, and `corporate/services/portal`.
- [x] Dissolved legacy `platform/` directly into root subdomains: `hub/observability`, `hub/network`, `hub/tools`.
- [x] Moved `studio/` to `hub/studio` and `cortex/` to `hub/cortex`.
- [x] Eliminated legacy docker-compose deployment scripts (`hub/infrastructure/docker`).
- [x] Removed obsolete custom database wrappers (`corporate/services/mongodb`, `corporate/services/redis`) in favor of official container images.
- [x] Consolidated `pnpm-workspace.yaml` into clean glob patterns.

### 2.2 Kubernetes Infrastructure Refactor (Phase 2)

- [x] Renamed `infrastructure/` to `k8s/` with strict DDD component layout.
- [x] Partitioned manifests into `manifests/hub/` and `manifests/corporate/`.
- [x] Split namespaces: `platform`, `cortex`, `studio` under Hub; `corporate` (and dev `docs`) under Corporate.
- [x] Created full Kubernetes workloads for Corporate products:
  - `web`: React SPA Deployment, Service, and Ingress.
  - `api`: Fastify backend Deployment, Service, Ingress, and health probes.
  - `redis`: Redis Deployment, PersistentVolumeClaim, and Service.
  - `mongodb`: MongoDB Deployment and PVC (`dev` only).
- [x] Removed legacy `cert-manager` charts and CRDs; ingress TLS is unified under Cloudflare Edge.
- [x] Injected Traefik RBAC via Helm values `extraObjects`.
- [x] Externalized hostnames: base manifests declare production hosts; dev and staging overlays inject `-dev` and `-stg` via JSON 6902 patches.
- [x] Restored `studio-secrets` generation in all hub overlays for Penpot and Memos.
- [x] Configured `cloudflared` Deployment with 2 replicas in production overlays (`prod/hub` and `prod/corporate`).
- [x] Removed `host: localhost` from base `agentgateway.yaml` Ingress; direct debugging uses Skaffold `portForward`.
- [x] Configured Skaffold multi-module architecture (`k8s/skaffold.yaml`, `skaffold.hub.yaml`, `skaffold.corporate.yaml`) with file sync and image push to local registry.
- [x] Validated that all 6 overlays render with exit code 0:
  ```bash
  kubectl kustomize --load-restrictor=LoadRestrictionsNone k8s/overlays/<env>/<ctx>
  ```

### 2.3 Documentation Portal Delivery Model

- [x] Configured Docusaurus portal to run in Kubernetes only in `dev` (`docs-dev.tupynambalucas.dev`) for hot reloading.
- [x] Configured Cloudflare Pages for staging and production hosting (`docs.tupynambalucas.dev`) via `.github/workflows/deploy-docs.yaml`.

---

## 3. Remaining Action Items

### 3.1 Step 1: Cloudflare Dev Tunnels Activation (Immediate)

Runbook reference: [Tunnel provisioning runbook](./tunnel-provisioning-strategy.md#4-initial-bootstrap-runbook-first-instance-setup)

- [ ] Create `dev-hub` tunnel in Cloudflare Zero Trust Dashboard.
- [ ] Add 11 public hostnames targeting `http://traefik.platform.svc.cluster.local:80`:
  - `traefik-dev.tupynambalucas.dev`
  - `grafana-dev.tupynambalucas.dev`
  - `headlamp-dev.tupynambalucas.dev`
  - `turbocache-dev.tupynambalucas.dev`
  - `memos-dev.tupynambalucas.dev`
  - `penpot-dev.tupynambalucas.dev`
  - `memory-dev.tupynambalucas.dev`
  - `memory-api-dev.tupynambalucas.dev`
  - `agentgateway-dev.tupynambalucas.dev`
  - `agentgateway-ingress-dev.tupynambalucas.dev`
  - `agentgateway-mcp-dev.tupynambalucas.dev`
- [ ] Create `dev-corporate` tunnel in Cloudflare Zero Trust Dashboard.
- [ ] Add 3 public hostnames targeting `http://traefik.corporate.svc.cluster.local:80`:
  - `web-dev.tupynambalucas.dev`
  - `api-dev.tupynambalucas.dev`
  - `docs-dev.tupynambalucas.dev`
- [ ] Paste tunnel tokens into `k8s/.env`:
  ```bash
  CLOUDFLARE_TUNNEL_TOKEN_HUB=<token>
  CLOUDFLARE_TUNNEL_TOKEN_CORPORATE=<token>
  ```
- [ ] Create Cloudflare Access application protecting `*-dev.tupynambalucas.dev` hub endpoints with GitHub/Google OAuth IdP.

### 3.2 Step 2: Native Ubuntu Dev Environment (Phase 1)

Runbook reference: [Ubuntu setup & readiness gates](./ubuntu-setup.md)

- [ ] Unregister old distribution and install dedicated instance (`tupynambalucasdev-ubuntu`) with user `tupy`.
- [ ] Configure host `.wslconfig` (16GB RAM, 8 vCPUs) and enable `systemd=true` in `/etc/wsl.conf`.
- [ ] Disable Docker Desktop WSL integration and install native Docker Engine.
- [ ] Install pinned CLI tools: k3d v5.8.3, kubectl v1.31, Helm v3.16.4, Skaffold v2.13.2, kubeseal v0.27.1, Node 22, pnpm 12.6.0.
- [ ] Create shared Docker network `k3d-enterprise-net` and local registry `registry.localhost:5000`.
- [ ] Create isolated clusters `hub` and `corporate` without host port bindings.
- [ ] Clone repository into `~/projects/tupynambalucas` on `ext4` and copy `k8s/.env` from Windows checkout.
- [ ] Run `skaffold dev -f k8s/skaffold.hub.yaml` and `skaffold dev -f k8s/skaffold.corporate.yaml`.
- [ ] Verify tunnel pod logs report registered edge connections.

### 3.3 Step 3: Git Branch Landing

Runbook reference: [Landing into develop and main](./ubuntu-setup.md#6-branch-integration-procedure-landing-into-develop-and-main)

- [ ] Run quality gates: `pnpm install --frozen-lockfile` and `pnpm -r typecheck`.
- [ ] Stage and commit working tree on `chore/enterprise-architecture` (ensure `.env` is uncommitted).
- [ ] Push branch to remote: `git push origin chore/enterprise-architecture`.
- [ ] Open Pull Request into `develop` using `Rebase and merge` or merge commit (no squash).
- [ ] Create short-lived branch `chore/sync-main` and merge `develop` into `main` cleanly.

### 3.4 Step 4: Cloud Environments & GitOps (Phase 5)

Runbook reference: [Secrets management](./secrets-management.md) and [Cloud delivery](./infrastructure-refactor.md#6-cloud-delivery)

- [ ] Provision cloud Kubernetes clusters for staging and production via Terraform (`terraform/`).
- [ ] Provision Cloudflare Tunnels (`staging-hub`, `staging-corporate`, `prod-hub`, `prod-corporate`) and DNS records via Terraform.
- [ ] Deploy Bitnami Sealed Secrets controller to all cloud clusters (sync wave `-1`).
- [ ] Implement `k8s/scripts/seal-secrets.sh` to seal staging and production secrets.
- [ ] Back up controller private keys immediately to off-cluster secure storage.
- [ ] Replace `secretGenerator` in hub staging and prod overlays with `SealedSecret` resources.
- [ ] Install ArgoCD and create Applications for all four cloud overlays.

### 3.5 Security Action Item

Runbook reference: [Security notes](./enterprise-architecture-review.md#2-regressions-and-status-versus-the-backup)

- [ ] Rotate MongoDB Atlas credential `elo-admin-prod` exposed in backup `.env.prod`.
- [ ] Purge `tupynambalucas-backup` once Ubuntu validation passes.

---

## 4. Verification Checkpoints

| Checkpoint            | Target            | Success Criteria                                                                   |
| :-------------------- | :---------------- | :--------------------------------------------------------------------------------- |
| **C1: Overlays**      | Local workstation | `kubectl kustomize` succeeds on all 6 overlays without errors.                     |
| **C2: Dev Ingress**   | Cloudflare Edge   | `curl -I https://grafana-dev.tupynambalucas.dev` returns HTTP 200 or Access login. |
| **C3: Local Loop**    | WSL2 Ubuntu       | Skaffold synchronizes changes in `< 1s` on `ext4` filesystem.                      |
| **C4: Git Integrity** | GitHub            | `git log --follow` tracks file history across renames in `develop`.                |
| **C5: Cloud GitOps**  | ArgoCD            | Staging and Production Applications report `Synced` and `Healthy`.                 |
