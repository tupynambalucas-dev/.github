# AGENTS.md Canonical Templates

This document defines the authoritative templates for each layer of the 3-layer AGENTS.md
hierarchy. All files MUST conform to the template for their layer after refactoring.

---

## 1. Layer 1 Template: Global Monorepo Router (`/AGENTS.md`)

The root file establishes global rules, bounded context discovery, and technology stack. It does
NOT contain implementation details.

```markdown
# example.com Agents Context

This document is the root context router for AI agents operating in the example.com
monorepo. Read this file before operating in any bounded context.

## Repository Entry Points

- [MONOREPO.readme.md](./MONOREPO.readme.md): Official developer entry point and technical README.
- [skaffold.yaml](./skaffold.yaml): Kubernetes orchestration pipeline definition.

## Bounded Contexts

- [cortex](./cortex/AGENTS.md): Unified AI processing hub...
- [platform](./platform/AGENTS.md): Always-on cluster infrastructure...
- [studio](./studio/AGENTS.md): Brand identity and design infrastructure...
- [hub](./hub/AGENTS.md): Developer website client, REST API, and data core.
- [renderer](./renderer/AGENTS.md): Dynamic asset generator and profile compiler.
- [docs](./docs/AGENTS.md): Docusaurus v3 knowledge base.
- [tools](./tools/AGENTS.md): GitHub CLI automation and provisioning scripts.

## Technology Stack

- **Runtime**: Node.js 22+ with PNPM 11+ workspaces.
- **Language**: TypeScript (strict mode) across all workspaces.
- **Container Runtime**: Podman with Compose extension (development), Kubernetes via Skaffold
  (production).
- **Formatting**: Prettier (2-space indent, 100-character line width, single quotes).

## Kubernetes Orchestration

The monorepo uses Skaffold v4beta11 with three composable modules:

- `platform-dev` ([platform/skaffold.yaml](./platform/skaffold.yaml)): Base infrastructure.
- `cortex-dev` ([cortex/skaffold.yaml](./cortex/skaffold.yaml)): AI services (requires platform).
- `studio-dev` ([studio/skaffold.yaml](./studio/skaffold.yaml)): Design services (requires platform).

## Global Constraints

- MUST conduct all conversational chat responses in Brazilian Portuguese (pt-BR).
- MUST write all code, configuration, technical documentation, commit messages, and Markdown files in English (en-US).
- MUST NOT use emojis in any conversational response, chat message, technical document, README, or skill file.
- MUST NOT use placeholders (e.g., TODO, TBD).
- MUST use relative paths for all Markdown links. Absolute filesystem paths are strictly forbidden.
- MUST format all files according to Prettier standards.

## AI Interaction Persona

- Operate as a Senior TypeScript/DevOps engineer with DDD expertise.
- Apply the 3-layer context hierarchy: read the root file, then the bounded context file, then
  any relevant sub-domain file before taking any action.
- Prefer targeted, minimal changes. Never modify files outside the current task scope.
- Validate all Markdown links resolve correctly relative to the file location.

## Required Skills

When performing documentation tasks in this monorepo, agents MUST activate the appropriate skill
by name before beginning:

- **`agent-router-expert`**: MUST be active when creating, updating, or reviewing any `AGENTS.md`
  file anywhere in the monorepo. This skill defines the 3-layer context hierarchy standard,
  `<context-hierarchy>` directive syntax, line budgets, and validation workflow.
- **`markdown-expert`**: MUST be active when creating, updating, or reviewing any `README.md`,
  `.md` skill file, or general Markdown document outside the `docs/` workspace.

These skills are referenced by name only and are resolved by the active agent runtime. Do not
reference skill files by filesystem path, as agents running in isolated container environments
resolve skills exclusively by their registered name.

## Routing

When working within a specific bounded context, agents MUST read the local `AGENTS.md` file
within that directory before proceeding.
```

---

## 2. Layer 2 Template: Bounded Context Router (`/[context]/AGENTS.md`)

Each bounded context file establishes domain identity, ubiquitous language, and architectural
rules. It instructs agents to read the parent before proceeding.

```markdown
<context-hierarchy>
  <parent src="../AGENTS.md" type="global-rules" />
  <system-instruction>
    AGENT: If you have not read "../AGENTS.md" in this session, stop now and read it using your
    file-reading tools before proceeding. Global constraints are mandatory.
  </system-instruction>
</context-hierarchy>

# Bounded Context: [Context Name]

This file defines the domain rules, architecture, and workspace navigation for the [Context Name]
bounded context in the example.com monorepo.

---

## 1. Bounded Context Navigation

- **[sub-domain/](./sub-domain/AGENTS.md)**: Description of the sub-domain.

---

## 2. Ubiquitous Language

The following terms MUST be used in all code, variables, schemas, comments, and documentation
within this bounded context. Using synonyms or informal alternatives is forbidden.

| Term    | Definition                   | Forbidden Synonyms    |
| :------ | :--------------------------- | :-------------------- |
| `TermA` | What it means in this domain | user, person, account |
| `TermB` | What it means in this domain | item, record          |

---

## 3. Bounded Context Architecture

[Mermaid diagram showing services, ports, and data flows]

### Port Allocation & Service Mapping

| Service   | Internal Port | Host Port | Protocol |
| :-------- | :------------ | :-------- | :------- |
| `service` | XXXX          | XXXX      | HTTP     |

---

## 4. Context Isolation Guardrails

- MUST NOT import modules from other bounded contexts.
- MUST communicate with other contexts exclusively via [define the interface: API calls / events].

---

## 5. Local Lifecycle Commands

| Target             | Purpose          | Command             |
| :----------------- | :--------------- | :------------------ |
| **Docker Compose** | Boot local stack | `pnpm [context]:up` |

## Required Skill (if applicable)

If this bounded context maps to a specialized authoring skill, declare it here by name only:

When creating, updating, or reviewing any `.mdx` (or relevant file type) within this workspace,
agents MUST activate the `[skill-name]` skill by name before beginning.

This skill is referenced by name only and is resolved by the active agent runtime.
```

---

## 3. Layer 3 Template: Technical Sub-Domain (`/[context]/[sub]/AGENTS.md`)

Sub-domain files contain only technology-specific patterns and implementation rules. They MUST
NOT duplicate content from parent files.

```markdown
<context-hierarchy>
  <parent src="../AGENTS.md" type="bounded-context-rules" />
  <system-instruction>
    AGENT: If you have not read "../AGENTS.md" in this session, stop now and read it using your
    file-reading tools before proceeding. Bounded context rules and ubiquitous language are mandatory.
  </system-instruction>
</context-hierarchy>

# Local Context: [Sub-Domain Name]

This workspace ([sub-domain/](./)) contains [description]. Read [../AGENTS.md](../AGENTS.md) for
the parent bounded context rules before operating here.

---

## 1. Directory Layout

- **[src/domain/](./src/domain/)**: [Description].
- **[src/infrastructure/](./src/infrastructure/)**: [Description].

---

## 2. Coding Guardrails

- MUST follow the [specific pattern] pattern.
- NEVER [specific violation to prevent].

## 3. Implementation Patterns

[Concrete, copy-pasteable TypeScript or configuration code blocks demonstrating correct patterns]

---

## 4. Scoped Operations

- `pnpm dev`: Starts the [service description] in development mode.
- `pnpm build`: Compiles TypeScript output.
- `pnpm typecheck`: Validates TypeScript compilation.
- `pnpm lint`: Runs ESLint validation.
```

---

## 4. The `<context-hierarchy>` Directive

The `<context-hierarchy>` XML block is placed at the very top of every Layer-2 and Layer-3 file.
Its purpose is to force agents to read the parent context before processing the current file.

### Rules for the Directive

- MUST be the first content in the file, before the H1 title.
- The `src` attribute MUST use a relative path from the current file to the parent `AGENTS.md`.
- The `<system-instruction>` block MUST use imperative language: "stop now and read".
- MUST NOT include any external URLs in the directive.

### Layer-2 Directive Example

```xml
<context-hierarchy>
  <parent src="../AGENTS.md" type="global-rules" />
  <system-instruction>
    AGENT: If you have not read "../AGENTS.md" in this session, stop now and read it using your
    file-reading tools before proceeding. Global constraints are mandatory.
  </system-instruction>
</context-hierarchy>
```

### Layer-3 Directive Example (two levels deep)

```xml
<context-hierarchy>
  <parent src="../../AGENTS.md" type="global-rules" />
  <parent src="../AGENTS.md" type="bounded-context-rules" />
  <system-instruction>
    AGENT: If you have not read "../../AGENTS.md" and "../AGENTS.md" in this session, stop now
    and read both files using your file-reading tools before proceeding. Both global constraints
    and bounded context rules are mandatory.
  </system-instruction>
</context-hierarchy>
```

---

## 5. Line Budget Enforcement

| Layer   | Maximum Lines | Rationale                                 |
| :------ | :------------ | :---------------------------------------- |
| Layer 1 | 80            | Loaded in every session; must be minimal  |
| Layer 2 | 120           | Loaded when entering a bounded context    |
| Layer 3 | 100           | Loaded on-demand for specific sub-domains |

If a file exceeds its budget, extract concrete code examples to a separate local `.agents/` directory
referenced by a link rather than inlining them.
