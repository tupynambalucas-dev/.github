# AI Agents Context File Patterns

This reference defines the templates and structural standards for `AGENTS.md` files at the root, bounded context, application, and library package levels.

---

## 1. Global Monorepo Router Pattern (`/AGENTS.md`)

The root `AGENTS.md` must act as the primary entry point, outlining monorepo topology, global guardrails, and AI personas.

### Outline Layout

```markdown
# workspace - Monorepo AI Master Context & Router

This file establishes the authoritative monorepo context, global rules, and interaction standards for AI agents.

## Navigation & Context Routing

- Link mappings to all root bounded contexts.

## Global Guardrails (Non-Negotiable)

- List of absolute requirements (English-First, No Emojis, No Placeholders, etc.).

## Unified Orchestration Commands

- Top-level pnpm dev/prod commands.

## AI Interaction Persona

- Role, tone, proactiveness, and validation rules.
```

---

## 2. Bounded Context Router Pattern (`/[context]/AGENTS.md`)

Created at the root of a domain directory (e.g. `cortex/`, `studio/`, `hub/`) to route agents to
its apps and packages.

### Outline Layout

```markdown
<context-hierarchy>
  <parent src="../AGENTS.md" type="global-rules" />
  <system-instruction>
    AGENT: If you have not read "../AGENTS.md" in this session, stop now and read it using your
    file-reading tools before proceeding. Global constraints are mandatory.
  </system-instruction>
</context-hierarchy>

# Bounded Context: [Context Name]

This file defines the domain rules, local stack services, and workspace structure for the
[Context Name] bounded context.

## Bounded Context Navigation

- Links to sub-workspaces (Core, services/api, services/web, etc.).
- When workspaces are grouped under category folders, use a nested tree:
  - [packages/](./packages/): Shared libraries and configuration modules.
    - [preset/](./packages/preset/AGENTS.md): Reusable presets and plugin bundles.
    - [theme/](./packages/theme/AGENTS.md): Presentation layer and shadowed components.
  - [services/](./services/): Deployable applications and background processes.
    - [portal/](./services/portal/AGENTS.md): Primary web application or portal service.

## Ubiquitous Language

| Term   | Definition              | Forbidden Synonyms      |
| :----- | :---------------------- | :---------------------- |
| `Term` | Domain-specific meaning | forbidden, alternatives |

## Bounded Context Architecture

- High-level role of this context, database name definitions, port mappings, and topological charts.

## Context Isolation Guardrails

- Rules preventing cross-context imports.

## Local Lifecycle Commands

- Stack execution and database setup commands.
```

---

## 3. Core Package Context Pattern (`/[context]/packages/core/AGENTS.md`)

Details the validation and type requirements of the core library.

### Outline Layout

```markdown
<context-hierarchy>
  <parent src="../../../AGENTS.md" type="global-rules" />
  <parent src="../../AGENTS.md" type="bounded-context-rules" />
  <system-instruction>
    AGENT: If you have not read "../../../AGENTS.md" and "../../AGENTS.md" in this session, stop
    now and read both files using your file-reading tools before proceeding.
  </system-instruction>
</context-hierarchy>

# Local Context: [Context] Core Package

This package is the Single Source of Truth (SSOT) for data contracts, validation schemas, and
TypeScript interfaces.

## Local Architecture & Directory Map

- Paths to schemas, types, and constants.

## Core Package Guardrails

- Schema suffix conventions, import guidelines, and type assertions restrictions.

## Scoped Operations

- Compilation, watch mode, and typechecking scripts.
```

---

## 4. API Context Pattern (`/[context]/services/api/AGENTS.md`)

Defines controllers, services, repositories, and models.

### Outline Layout

```markdown
<context-hierarchy>
  <parent src="../../../AGENTS.md" type="global-rules" />
  <parent src="../../AGENTS.md" type="bounded-context-rules" />
  <system-instruction>
    AGENT: If you have not read "../../../AGENTS.md" and "../../AGENTS.md" in this session, stop
    now and read both files using your file-reading tools before proceeding.
  </system-instruction>
</context-hierarchy>

# Local Context: [Context] API Application

This workspace contains the REST API for this bounded context.

## Local Architecture & Directory Map

- Paths to domains, config, plugins, and models.

## API Coding Guardrails

- Layered sequence rules, model injection syntax, idempotency requirements, and security rules.

## Local Lifecycle Commands

- Development server execution, build, and linting.
```

---

## 5. Web Context Pattern (`/[context]/services/web/AGENTS.md`)

Specifies Zustand selectors, JSX rendering, and CSS rules.

### Outline Layout

```markdown
<context-hierarchy>
  <parent src="../../../AGENTS.md" type="global-rules" />
  <parent src="../../AGENTS.md" type="bounded-context-rules" />
  <system-instruction>
    AGENT: If you have not read "../../../AGENTS.md" and "../../AGENTS.md" in this session, stop
    now and read both files using your file-reading tools before proceeding.
  </system-instruction>
</context-hierarchy>

# Local Context: [Context] Web Client Application

This workspace contains the React Single Page Application client.

## Local Architecture & Directory Map

- Paths to shared/ui, features, domains, and assets.

## Web Coding Guardrails

- Zustand selector pattern, explicit JSX checks, relative CSS unit rules, and console logging
  constraints.

## Local Lifecycle Commands

- dev and build commands.
```

---

## 6. Infrastructure / Deployment Context Pattern (`/[context]/infrastructure/AGENTS.md`)

Used for Kubernetes manifests, Docker Compose configurations, and environment variable templates.

### Outline Layout

```markdown
<context-hierarchy>
  <parent src="../../../AGENTS.md" type="global-rules" />
  <parent src="../AGENTS.md" type="bounded-context-rules" />
  <system-instruction>
    AGENT: If you have not read "../../../AGENTS.md" and "../AGENTS.md" in this session, stop now
    and read both files using your file-reading tools before proceeding.
  </system-instruction>
</context-hierarchy>

# Local Context: [Context] Infrastructure & Deployment

This workspace ([infrastructure/](./)) contains orchestration configurations for [Context].
Read [../AGENTS.md](../AGENTS.md) for parent bounded context rules before operating here.

## 1. Directory Layout

- **[kubernetes/](./kubernetes/)**: Kubernetes manifests and Kustomize overlays.
- **[docker/](./docker/)**: Docker Compose service definitions.
- **[.env.example](./.env.example)**: Environment variable template.

## 2. Operational Guardrails

- Kustomize `secretGenerator` MUST include `options.disableNameSuffixHash: true`.
- Compose services MUST declare `restart: unless-stopped` for always-on services.
- MUST mirror all new environment variables in `.env.example`.
```
