---
name: agent-router-expert
description: Use this skill to create, analyze, or update local and root router context files (AGENTS.md) across monorepo workspaces.
---

# Agent Router Expert

This skill defines the standards, structure, design patterns, and validation workflow for `AGENTS.md` context router files in the monorepo.

## 1. Global Documentation Standards

The following rules apply to all documentation tasks, regardless of file extension or location.

### A. Tone of Voice

- Maintain a senior, objective, and technical tone at all times, including in conversational responses, logs, and documentation.
- Avoid preambles, introductory chatter, or conclusion summaries in all communications.
- Keep sentences concise, clear, and direct.

### B. Strict English-First

- All code, configuration, technical documentation, READMEs, architectural briefs, code comments/examples, commit messages, and pull request descriptions MUST be written in English (en-US).
- Conversational chat responses with the user MUST be conducted in Brazilian Portuguese (pt-BR).

### C. Zero Emojis

- Emojis are strictly forbidden in all agent conversational responses, chat messages, technical documents, READMEs, and skill files to maintain a professional, corporate appearance.

### D. Mermaid Diagram Standards

- Always define layout direction explicitly (e.g., `direction TD` or `direction LR`).
- Use clear node labels wrapped in double quotes (e.g., `node["label"]`) to prevent parser issues with special characters.
- Use subgraphs to explicitly illustrate Bounded Context boundaries (e.g., separating `extension/` logic from `studio/` logic).
- Do not use HTML formatting tags within Mermaid labels; rely on plain Markdown where supported.

### E. Zero Placeholders

- Never include empty sections, "TBD", or "TODO" notes in documentation. If a section is not yet ready, omit it completely.

### F. Prettier Formatting Standards

- All files must comply with the root Prettier formatting rules (2-space indentation, max 100-character line width, hyphen-based unordered lists, and proper JavaScript/TypeScript code block styling).

### G. Project Variables and Identifiers

- **Concrete Names Required**: Project names, package identifiers, and domains MUST use their actual concrete values corresponding to the target repository in all `AGENTS.md` router files.
- **No Unresolved Placeholder Tokens**: You MUST NOT leave unresolved placeholder tokens (such as `%PROJECT_DOMAIN%`, `<TBD>`, or TODO markers) in router context files unless specifically processed by an automated templating engine.

---

## 1.5. Context Hierarchy Directive

Every Layer-2 and Layer-3 `AGENTS.md` file MUST include a `<context-hierarchy>` XML block as the
very first content in the file. This directive instructs AI agents to read the parent context file
before proceeding and sets explicit bounded context constraints.

- The directive MUST appear before the H1 heading.
- The `src` attribute MUST use a relative path to the parent `AGENTS.md`.
- The `<system-instruction>` MUST use imperative language ("stop now and read").
- The `<system-instruction>` MUST explicitly declare the bounded context using the **exact directory name** it resides in (e.g., "AGENT: You are operating in the `k8s` bounded context. You must read..."). This strict 1:1 mapping prevents path hallucination and grounds the agent's context.
- The directive MUST NOT contain external URLs or absolute paths.

See [references/syntax.md](references/syntax.md) for the complete directive syntax specification.
See [references/templates.md](references/templates.md) for layer-specific directive examples.

---

## 2. Document Guidelines

Use these guidelines when creating, updating, or analyzing `AGENTS.md` context files across monorepo workspaces and packages.

- **Purpose**: Act as local and root routers/guardrail lists to provide high-fidelity context for AI agents without cluttering developer-facing READMEs.
- **Rules**:
  - Every referenced file, schema, or configuration directory MUST use clickable relative markdown links (e.g. [tsconfig.json](./tsconfig.json)) to facilitate rapid tool-based navigation.
  - Clickable relative links MUST NEVER be wrapped in backticks (e.g., `[label](path)`) because it prevents parsers from identifying them as interactive links.
  - Absolute file system paths (e.g. `/absolute/path/to/project`, `/projects/...`) and external web URLs (e.g. `https://github.com/...`, `https://docusaurus.io/...`) MUST NEVER be used inside `AGENTS.md` files. Local development localhost links (e.g. `http://localhost:3000`) are permitted solely in commands execution logs/guidance.
  - Write using clear, absolute constraints ("NEVER", "MUST", "ALWAYS") rather than conversational prose.
  - Do not duplicate global rules (English-First, Zero Emojis, Zero Placeholders) in local sub-workspace context files.
  - **Line Budget**: Each layer has a maximum line budget. Exceeding the budget degrades token efficiency. Layer 1: 80 lines. Layer 2: 120 lines. Layer 3: 100 lines. Extract concrete code patterns to separate linked reference files when needed.
- **Reference Files**:
  - AI Agent syntax and path reference: [references/syntax.md](references/syntax.md)
  - Root, core, api, and web layouts: [references/patterns.md](references/patterns.md)
  - Verification, emoji auditing, and rule alignment: [references/workflow.md](references/workflow.md)

---

## 2.2. AGENTS.md Placement Policy

An `AGENTS.md` file MUST only be created in directories that meet at least one of the following
criteria:

- The directory is a **monorepo root** (Layer 1).
- The directory is a **bounded context root** — a top-level domain directory containing
  architecture, ubiquitous language, or cross-service guardrails (Layer 2).
- The directory is a **sub-domain** with its own source code, coding patterns, or non-trivial
  architecture that agents need context to operate correctly (Layer 3).

An `AGENTS.md` file MUST NOT be created in:

- **Dockerfile-only service wrapper directories** — folders that contain only a `Dockerfile`
  wrapping an upstream image with no local source code (e.g., `platform/services/grafana/`,
  `cortex/mcp/services/firecrawl/`, `studio/penpot/services/frontend/`). All guardrails for
  these services MUST be consolidated into the parent bounded context or sub-domain `AGENTS.md`.
- **Asset or data directories** — folders containing only static files, images, raw creative
  assets, or generated output with no operational rules for agents.
- **Deep leaf directories** — directories more than 3 levels below the monorepo root that do not
  have significant independent architecture warranting their own context file.

Fragmented `AGENTS.md` files in shallow leaf directories degrade token efficiency by forcing
agents to traverse excessive read steps before acting. Bounded context and sub-domain files are
the correct consolidation points for service-level guardrails.

---

## 2.3. Grouped Directory Tree Pattern

When an intermediate router directory (such as a bounded context or sub-domain hub) organizes child
workspaces inside structural category folders (e.g. `packages/`, `services/`, `plugins/`):

- Intermediate category folders without independent architecture MUST NOT receive their own
  standalone `AGENTS.md` file (in compliance with the Placement Policy).
- The parent router's `AGENTS.md` MUST reference both the category folder and all child workspaces
  in an indented tree structure.
- The parent category directory must be linked as a directory (e.g., `- [packages/](./packages/): ...`),
  followed by indented items linking directly to each child workspace's `AGENTS.md`
  (e.g., `  - [preset/](./packages/preset/AGENTS.md): ...`).
- Each child Layer-3 `AGENTS.md` points its `<context-hierarchy>` parent attribute directly to the
  parent router file (e.g., `../../AGENTS.md`).

---

## 2.5. Required Skills Declaration Standard

When an `AGENTS.md` file governs a workspace where agents perform documentation tasks requiring a specialized skill, the skill MUST be declared in a `Required Skill` (or `Required Skills`) section.

**Rules**:

- Skills MUST be declared by name only (e.g., `agent-router-expert`, `docusaurus-expert`).
- Skills MUST NOT be referenced by filesystem path (e.g., `.agents/skills/agent-router-expert/`).
- Name-only resolution is mandatory because agents running in isolated container environments resolve skills exclusively through the active runtime's skill registry, not the filesystem.
- The Layer-1 root `AGENTS.md` declares global document-authoring skills (`agent-router-expert` and `markdown-expert`).
- Bounded context `AGENTS.md` files declare context-specific skills only when the bounded context has a specialized authoring workflow (e.g., `docs/AGENTS.md` declares `docusaurus-expert`).
- Layer-3 sub-domain files do NOT repeat skill declarations from parent files.

---

## 3. Build and Content Validation Workflow

Before completing any documentation task, you must execute the verification steps defined in the workflow guide:

- Follow the verification and audit steps in [references/workflow.md](references/workflow.md).
