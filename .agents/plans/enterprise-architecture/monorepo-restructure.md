# Monorepo Restructure

Moves the root bounded contexts into two parent contexts, `hub` and `corporate`, following the
DDD and SSOT principles documented in the knowledge base.

## 1. Current to Target Map

| Current path                           | Target path                                                          |
| :------------------------------------- | :------------------------------------------------------------------- |
| `hub/` (website)                       | `corporate/` (see section 3)                                         |
| `knowledge-base/collections`           | `corporate/collections`                                              |
| `knowledge-base/docusaurus/packages/*` | `corporate/packages/*`                                               |
| `knowledge-base/docusaurus/services/*` | `corporate/services/*`                                               |
| `platform/services/` (observability)   | `hub/observability/` (grafana, loki, prometheus, tempo, otelcol)     |
| `platform/services/` (tools)           | `hub/tools/` (headlamp, turbocache)                                  |
| `platform/` (network)                  | `hub/network/` (traefik, cloudflared configs)                        |
| `studio/`                              | `hub/studio/`                                                        |
| `cortex/`                              | `hub/cortex/`                                                        |
| `infrastructure/`                      | `k8s/` (see [Infrastructure refactor](./infrastructure-refactor.md)) |

`renderer/`, `shared/`, and `tools/` stay at the root.

The current `hub/` directory must be moved to `corporate/` before the new `hub/` is created,
because both use the same name.

## 2. Target Layout

```text
hub/
  observability/     grafana, loki, prometheus, tempo, otelcol
  network/           traefik, cloudflared
  tools/             headlamp, turbocache
  studio/            assets/ bucket/ creative/ memos/ penpot/ references/
  cortex/            gateway/ mcp/ memory/
corporate/
  collections/       from knowledge-base/collections
  packages/          core (from hub/packages/core) and docusaurus packages
  services/          web, api (from hub/services) and portal (from knowledge-base)
k8s/
renderer/
shared/
tools/
```

## 3. Corporate Context

The website and the documentation portal each have their own `packages` and `services` folders.
They are merged under one parent instead of nested, to avoid paths such as
`corporate/services/docs/docusaurus/services/portal`.

| Source                                      | Target                                         |
| :------------------------------------------ | :--------------------------------------------- |
| `hub/services/web`                          | `corporate/services/web`                       |
| `hub/services/api`                          | `corporate/services/api`                       |
| `hub/packages/core`                         | `corporate/packages/core`                      |
| `knowledge-base/docusaurus/services/portal` | `corporate/services/portal`                    |
| `knowledge-base/docusaurus/packages/*`      | `corporate/packages/*`                         |
| `knowledge-base/collections`                | `corporate/collections`                        |
| `knowledge-base/docusaurus/references`      | `corporate/references`                         |
| `hub/services/mongodb`                      | removed (obsolete custom docker setup)         |
| `hub/services/redis`                        | removed (obsolete custom docker setup)         |
| `platform/references/architecture.md`       | `hub/observability/references/architecture.md` |

`hub/infrastructure/docker` is removed. It is the outdated Docker Compose deployment of the old
website (`compose.yaml`, `compose.override.yaml`, `compose.prod.yaml`, `.env.dev`, `.env.staging`,
`.env.prod`, and the `backup.sh`, `deploy.sh`, `setup.sh`, and `healthcheck.sh` scripts). It is
replaced by the Kubernetes manifests and overlays in `k8s`. Delete it with `git rm` in the
same commit that moves the old `hub/` to `corporate/`. Before deleting, search the repository for
references to those scripts and `.env` files and remove them.

## 4. Platform Dissolution into Hub Subdomains

The monolithic `platform/` directory is completely eliminated. Its contents are distributed
directly into explicit root subdomains under `hub/`:

| Domain               | Services & Contents                                       |
| :------------------- | :-------------------------------------------------------- |
| `hub/observability/` | grafana, loki, prometheus, tempo, otelcol                 |
| `hub/tools/`         | headlamp, turbocache                                      |
| `hub/network/`       | traefik values, cloudflared tunnel configuration and docs |

`hub/network/` has no source code folder today. Traefik and Cloudflared exist only as Helm values
and Kubernetes configurations, so this directory is created new to hold network routing configs
and documentation.

Fluent Bit and kube-state-metrics also have no source folder. They remain manifests under
`manifests/hub/observability/`.

## 5. Studio Split

`studio/` contains `assets`, `bucket`, `creative`, `memos`, `penpot`, and `references`. All of it
moves into `hub/studio`.

`assets` is consumed by `corporate` (website and portal). This follows the dependency rule in
[Enterprise structure](./enterprise-structure.md): `corporate` imports only the `assets` workspace
package and nothing else from `hub`.

## 6. Workspace Packages and pnpm-workspace.yaml

The repository currently defines 16 glob patterns in `pnpm-workspace.yaml`. After restructuring,
the `packages` field becomes cleaner, collapsing 7 disparate patterns into unified `corporate/*`
and `hub/*` entries.

### Target `pnpm-workspace.yaml`

```yaml
packages:
  - 'corporate/collections'
  - 'corporate/packages/*'
  - 'corporate/services/*'
  - 'hub/studio/*'
  - 'hub/cortex/mcp/guardrails'
  - 'hub/cortex/mcp/services/*'
  - 'hub/cortex/memory/packages/*'
  - 'hub/cortex/memory/services/*'
  - 'k8s'
  - 'renderer'
  - 'shared/*'
  - 'tools/*'
```

### Complete `package.json` Migration Inventory

| Current `package.json` path                 | Target `package.json` path                      | Workspace glob pattern         |
| :------------------------------------------ | :---------------------------------------------- | :----------------------------- |
| `hub/packages/core`                         | `corporate/packages/core`                       | `corporate/packages/*`         |
| `knowledge-base/docusaurus/packages/preset` | `corporate/packages/preset`                     | `corporate/packages/*`         |
| `knowledge-base/docusaurus/packages/theme`  | `corporate/packages/theme`                      | `corporate/packages/*`         |
| `hub/services/api`                          | `corporate/services/api`                        | `corporate/services/*`         |
| `hub/services/web`                          | `corporate/services/web`                        | `corporate/services/*`         |
| `knowledge-base/docusaurus/services/portal` | `corporate/services/portal`                     | `corporate/services/*`         |
| `knowledge-base/collections`                | `corporate/collections`                         | `corporate/collections`        |
| `studio/assets`                             | `hub/studio/assets`                             | `hub/studio/*`                 |
| `studio/bucket`                             | `hub/studio/bucket`                             | `hub/studio/*`                 |
| `cortex/mcp/guardrails`                     | `hub/cortex/mcp/guardrails`                     | `hub/cortex/mcp/guardrails`    |
| `cortex/mcp/services/firecrawl`             | `hub/cortex/mcp/services/firecrawl`             | `hub/cortex/mcp/services/*`    |
| `cortex/mcp/services/memory`                | `hub/cortex/mcp/services/memory`                | `hub/cortex/mcp/services/*`    |
| `cortex/memory/packages/core`               | `hub/cortex/memory/packages/core`               | `hub/cortex/memory/packages/*` |
| `cortex/memory/services/api`                | `hub/cortex/memory/services/api`                | `hub/cortex/memory/services/*` |
| `cortex/memory/services/web`                | `hub/cortex/memory/services/web`                | `hub/cortex/memory/services/*` |
| `infrastructure`                            | `k8s`                                           | `k8s`                          |
| `renderer`                                  | `renderer` (unchanged)                          | `renderer`                     |
| `shared/config`, `shared/git`               | `shared/config`, `shared/git` (unchanged)       | `shared/*`                     |
| `tools/github`, `tools/provisioner`         | `tools/github`, `tools/provisioner` (unchanged) | `tools/*`                      |
| `platform`                                  | removed (obsolete podman-compose scripts)       | n/a                            |

Note on `platform/package.json`: the existing `platform/` had only a root `package.json` with
scripts invoking deleted Docker Compose files (`infrastructure/docker/compose.yaml`). Its
underlying services (`grafana`, `loki`, `headlamp`, etc.) are pure Docker images without Node
`package.json` files, so no `package.json` is required for them unless future scripts are added.

## 7. Required Edits

- `pnpm-workspace.yaml`: apply the target `packages` configuration defined above.
- Dockerfiles: update `COPY` paths and build contexts that reference moved folders.
- Skaffold artifacts: update every `context`, `dockerfile`, and `sync.manual` path.
- `turbo.json`, `tsconfig.json` references, and `package.json` workspace filters.
- `.github/workflows/deploy-docs.yaml` and `renderer-generate.yml`: update path filters and
  working directories.
- Router files: root `AGENTS.md`, every moved context `AGENTS.md`, and its `<context-hierarchy>`
  parent link. Add `AGENTS.md` and `README.md` for `hub`, `corporate`, `hub/observability`,
  `hub/tools`, `hub/network`.
- Documentation: `bounded-contexts.mdx`, workspace pages under `/workspaces`, and the principles
  pages that name contexts.
- Package names: keep the scope pattern and rename only paths and workspace names that embed
  `hub`, `knowledge-base`, or `platform`.

Reference counts per path, from `git grep`, to size the work:

| Path             | Files referencing it |
| :--------------- | :------------------- |
| `infrastructure` | 152                  |
| `hub/`           | 105                  |
| `cortex/`        | 86                   |
| `studio/`        | 75                   |
| `knowledge-base` | 53                   |
| `platform/`      | 49                   |

## 8. Method

- Use `git mv` for every move so history is preserved.
- Move one context per commit and run `pnpm install` and `pnpm -r typecheck` after each.
- Run the migration on a dedicated branch.
