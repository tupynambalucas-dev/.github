# Migration Phases

Execution order, validation, and rollback. Each phase ends in a state that works on its own.

> **Status Summary**:
>
> - **Phase 0 (Preparation)**: Completed.
> - **Phase 1 (Ubuntu Environment)**: In progress / ready for verification on WSL2.
> - **Phase 2 (Infrastructure Refactor)**: Completed (all 6 overlays render cleanly; corporate
>   manifests added; `studio-secrets` restored; cloudflared prod replicas set to 2).
> - **Phase 3 (Cloudflare Dev Tunnels)**: In progress (provisioning `dev-hub` and `dev-corporate`
>   tunnels via Zero Trust Dashboard).
> - **Phase 4 (Monorepo Restructure)**: Completed (DDD structure in `hub/` and `corporate/` active;
>   obsolete services removed; build and sync paths updated).
> - **Phase 5 (Cloud Environments)**: Planned (Sealed Secrets, ArgoCD GitOps, Terraform).

---

## Phase 0: Preparation (Completed)

- **Sync Main:** Synchronized `main` and `develop` to establish a clean baseline.
- **Create Branch:** Created `chore/enterprise-architecture`.
- **Local Backup (Critical):** Created full local backup in `tupynambalucas-backup` outside Git.
- **Handling Tracked vs Untracked Files:**
  - Preserved git history via `git mv`.
  - Regenerated `node_modules` via `pnpm install`.
  - Migrated unversioned configurations from backup to `k8s/.env`.
- **Baseline:** Recorded and validated.

---

## Phase 1: Ubuntu Environment (Verification Ready)

Follow [Ubuntu setup](./ubuntu-setup.md). Clone the repository into the Linux filesystem and copy
the `.env` files.

Validation:

- `kubectl --context k3d-hub get nodes` and `kubectl --context k3d-corporate get nodes` list nodes.
- `pnpm install` completes on the Linux clone.
- Local registry responds on `localhost:5000`.

Rollback: delete the clusters with:
`k3d cluster delete hub corporate && k3d registry delete k3d-registry.localhost && docker network rm k3d-enterprise-net`.

---

## Phase 2: Infrastructure Refactor (Completed & Audited)

Follow [Infrastructure refactor](./infrastructure-refactor.md) and
[Enterprise architecture review](./enterprise-architecture-review.md).

Executed Steps:

1. Renamed `infrastructure/` to `k8s/`.
2. Reorganized manifests into bounded contexts (`manifests/hub` and `manifests/corporate`).
3. Removed obsolete `cert-manager` charts and namespaces.
4. Added Kubernetes manifests for corporate products: `web`, `api`, `redis`, `mongodb` (dev),
   and `portal` (dev).
5. Created isolated namespace `corporate` for public stack and kept `docs` namespace for local dev portal.
6. Generated `studio-secrets` across all hub overlays to unblock Penpot and Memos.
7. Split Skaffold into root (`k8s/skaffold.yaml`), `skaffold.hub.yaml`, and `skaffold.corporate.yaml`.
8. Configured `cloudflared` with 2 replicas in `prod/hub` and `prod/corporate` overlays.

Validation:

- `kubectl kustomize --load-restrictor=LoadRestrictionsNone k8s/overlays/<env>/<context>` renders with
  exit code 0 across all 6 overlays (`dev/hub`, `dev/corporate`, `staging/hub`, `staging/corporate`,
  `prod/hub`, `prod/corporate`).

---

## Phase 3: Cloudflare Dev Tunnels (Active)

Follow [Cloudflared tunnels](./cloudflared-tunnels.md) and
[Tunnel provisioning strategy](./tunnel-provisioning-strategy.md).

Steps:

1. Create remotely-managed tunnel `dev-hub` in Cloudflare Zero Trust Dashboard and configure its
   11 public hostnames pointing to `http://traefik.platform.svc.cluster.local:80`.
2. Create remotely-managed tunnel `dev-corporate` in Cloudflare Zero Trust Dashboard and configure its
   3 public hostnames (`docs-dev`, `web-dev`, `api-dev`) pointing to
   `http://traefik.corporate.svc.cluster.local:80`.
3. Save tokens into `k8s/.env` as `CLOUDFLARE_TUNNEL_TOKEN_HUB` and
   `CLOUDFLARE_TUNNEL_TOKEN_CORPORATE`.
4. Configure Cloudflare Zero Trust Access policies on all `hub` hostnames.

Validation:

- Tunnel connector pods in `k3d-hub` and `k3d-corporate` show healthy connection logs.
- `curl -I https://grafana-dev.tupynambalucas.dev` returns HTTP 200 or Cloudflare Access login.

---

## Phase 4: Monorepo Restructure (Completed)

Follow [Monorepo restructure](./monorepo-restructure.md).

Executed Steps:

1. Migrated `hub/services/web` and `hub/services/api` into `corporate/services/`.
2. Merged `knowledge-base/` into `corporate/collections`, `corporate/packages`, and `corporate/services/portal`.
3. Dissolved `platform/` directly into root subdomains: `hub/observability`, `hub/network`, `hub/tools`.
4. Moved `studio/` into `hub/studio` and `cortex/` into `hub/cortex`.
5. Removed obsolete compose scripts and custom Dockerfiles (`corporate/services/mongodb`, `corporate/services/redis`).
6. Updated `pnpm-workspace.yaml`, Dockerfiles, `skaffold` configs, and context router files.

Validation:

- `pnpm install` and `pnpm -r typecheck` pass.
- Skaffold builds artifacts for both `hub` and `corporate`.

---

## Phase 5: Cloud Environments & Secrets Management (Planned)

Follow [Secrets management](./secrets-management.md) and
[Tunnel provisioning strategy](./tunnel-provisioning-strategy.md).

Steps:

1. Provision cloud Kubernetes clusters (`staging` and `prod`) via Terraform in `terraform/`.
2. Provision Cloudflare Tunnels (`staging-hub`, `staging-corporate`, `prod-hub`, `prod-corporate`)
   and DNS records via Terraform.
3. Install Bitnami Sealed Secrets controller in each cloud cluster with sync wave `-1`.
4. Run `k8s/scripts/seal-secrets.sh` to seal environment secrets into
   `overlays/<env>/<context>/sealed-secrets/`.
5. Back up controller private keys immediately to secure off-cluster storage.
6. Deploy ArgoCD and create Applications syncing `staging` and `prod` overlays from git.
7. Verify documentation deployment workflow (`deploy-docs.yaml`) publishes `docs.tupynambalucas.dev`
   to Cloudflare Pages.

Validation:

- ArgoCD reports all Applications as Synced and Healthy.
- Ingress hostnames resolve securely through cloud tunnels.

---

## Exit Criteria

- One command starts the entire `dev` environment from a clean clone on Ubuntu.
- No `-dev` hostname remains in `manifests/`.
- All 6 overlays render with 0 errors via Kustomize.
- Staging and prod clusters contain zero plain text secrets in Git.
- `pnpm -r typecheck`, docs build, and renderer workflow pass cleanly.
- No references to obsolete directories (`infrastructure/`, `knowledge-base/`, `platform/`).
