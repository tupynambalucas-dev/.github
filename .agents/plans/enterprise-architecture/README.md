# Enterprise Architecture Migration Plan

Migration plan for moving the enterprise monorepo to a native Linux development environment,
a Domain Driven Design (DDD) folder layout, and a Kubernetes manifest tree that supports the
`dev`, `staging`, and `prod` environments.

## Decisions

- **Local runtime**: WSL2 Ubuntu, native Docker Engine, and k3d. Podman Machine and Windows NTFS
  are retired from the development loop.
- **Local topology**: two isolated k3d clusters (`k3d-hub` and `k3d-corporate`) running on
  a shared Docker network and registry, mirroring cloud architecture locally.
- **Cloud topology**: `hub` and `corporate` run in separate clusters per environment (staging and
  prod).
- **Bounded contexts**: `hub` groups `observability`, `network`, `tools`, `studio`, and `cortex`.
  `corporate` groups `web` (React), `api` (Fastify), `redis`, `mongodb` (`dev` only), and `portal`
  (`dev` only).
- **Ingress model**: Cloudflare Tunnel across all clusters (`dev`, `staging`, and `prod`). Each
  cluster runs its own dedicated tunnel connector, eliminating public IPs, cloud LoadBalancers, and
  cert-manager.
- **Documentation delivery**: documentation portal is deployed to Cloudflare Pages in `staging` and
  `prod` (`docs.tupynambalucas.dev`). It runs in Kubernetes only in `dev` (`docs-dev.tupynambalucas.dev`)
  for hot reloading via Skaffold.
- **Secret management**: local `.env` with Kustomize `secretGenerator` for `dev`; Bitnami Sealed Secrets
  for `staging` and `prod` clusters under GitOps.
- **Skaffold scope**: local development only, deploying to `k3d-hub` and `k3d-corporate` via
  `kubeContext`. Cloud deployments use GitOps (ArgoCD).

## Execution Roadmap

Track completed deliverables, immediate operational runbooks, and cloud GitOps phases in the
authoritative [Enterprise Architecture Roadmap](./roadmap.md).

## Documents

1. [Roadmap](./roadmap.md): Comprehensive execution status matrix, completed milestones, and pending actions.
2. [Ubuntu setup & readiness gates](./ubuntu-setup.md): WSL2, Docker, k3d, registry, validation
   gates (U0-U12), Git landing, and Freelens.
3. [Enterprise structure](./enterprise-structure.md): topology, environments, domains, and
   deployment tooling.
4. [Cloudflared tunnels](./cloudflared-tunnels.md): tunnel design for dev, staging, and prod.
5. [Monorepo restructure](./monorepo-restructure.md): bounded context moves and workspace changes.
6. [Infrastructure refactor](./infrastructure-refactor.md): new `k8s` tree, file mapping,
   overlays, and Skaffold modules.
7. [Migration phases](./migration-phases.md): execution order, validation, and rollback.
8. [Enterprise architecture review](./enterprise-architecture-review.md): post-migration audit,
   regression fixes, and domain analysis.
9. [Secrets management](./secrets-management.md): Multi-provider secrets architecture evaluating Infisical, Google Cloud Secret Manager, and GitHub Environment Secrets.
10. [Tunnel provisioning strategy](./tunnel-provisioning-strategy.md): 6-tunnel architecture evaluation,
    origins mapping, and bootstrap runbook.
11. [GitHub governance & storage architecture](./github-governance-and-storage.md): Organization RBAC,
    unified Windows/WSL2 Git auth, SSH commit signing, and native ext4 vs. NTFS storage analysis.
12. [Corporate restructure](./corporate-restructure.md): collections as a package, kind-first content
    layout, UI string extraction, `services/website` rename, and sub-domain boundary options.
13. [GitHub organization plugin](./github-organization-plugin.md): Enterprise plugin architecture
    combining github-mcp-server with the github-org-manager skill for teams, RBAC, and rulesets.
