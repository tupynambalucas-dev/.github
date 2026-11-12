# tupynambalucas-dev .github Agent Context

This document serves as the sovereign root context router (Layer 1) for AI agents operating in the
`tupynambalucas-dev/.github` organization governance repository.

## Navigation

- [README.md](./README.md): Repository overview, directory layout, and ecosystem architecture.
- [profile/](./profile/AGENTS.md): Public organization profile (`github.com/tupynambalucas-dev`), brand copy, and official SVG assets.
- [.agents/](./.agents/AGENTS.md): Architectural master plans, corporate reference archives, lifecycle hooks, and agent utility scripts.
- [.vscode/](./.vscode/README.md): Shared IDE workspace settings, automated tasks, and recommended extensions.
- [templates/](./templates/README.md): Exportable IDE workstation profile templates (`tupynambalucas-dev.code-profile`).
- [references/](./references/README.md): Extracted upstream GitHub technical reference covering `.github` and `.github-private` governance capabilities.

## Organization Community Health Defaults

- [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md): Organization-wide Contributor Covenant v2.1 standard of conduct.
- [CONTRIBUTING.md](./CONTRIBUTING.md): GitHub Flow branch conventions, SSH commit signing, and pull request gates.
- [SECURITY.md](./SECURITY.md): Vulnerability disclosure policy, supported versions matrix, and security SLAs.
- [SUPPORT.md](./SUPPORT.md): Official documentation portal, issue tracking, and corporate inquiry channels.
- [LICENSE](./LICENSE): Organization default licensing terms (`Apache-2.0`).
- [.github/](./.github/PULL_REQUEST_TEMPLATE.md): Default Pull Request template, YAML Issue Forms (`ISSUE_TEMPLATE/`), and `CODEOWNERS`.

## Scoped Guardrails

- MUST maintain a strict senior, objective, and technical tone across all communications and documentation.
- MUST avoid preambles, introductory chatter, conversational filler, or conclusion summaries.
- MUST conduct all conversational chat responses in Brazilian Portuguese (pt-BR).
- MUST write all code, configuration files, commit messages, and technical Markdown documentation in English (en-US).
- MUST NOT use emojis anywhere in chat responses, code comments, commit messages, PR descriptions, or documentation (Zero-Emoji Invariant).
- MUST NOT use placeholders (e.g., `TODO`, `TBD`).
- MUST sign all Git commits and annotated tags with SSH: `git commit -S -m "..."`.
- MUST adhere strictly to Conventional Commits v1.0.0 (`<type>(<scope>): <description>`).
- MUST use relative paths for all internal Markdown links. Absolute filesystem paths (`C:/...`, `file:///...`) are strictly forbidden.
- MUST format all files according to Prettier standards (2-space indent, max 100-character line width).
- MUST hardcode concrete organization identifiers (`tupynambalucas-dev`, `tupynambalucas.dev`).
- **Context Routing**: When working within a nested bounded context (`profile/`, `.agents/`), agents MUST read the corresponding local `AGENTS.md` before modifying files.

## Umbrella Meta-Repository Alignment

Cross-repository orchestration and the canonical multi-root workspace (`tupynambalucas-dev.code-workspace`) are managed by the `tupynambalucas-dev/org-core` umbrella meta-repository via [Mani](https://manicli.com). When opened as part of the `org-core` multi-root workspace, this repository operates as an autonomous sovereign repository while adhering to the cross-repository context defined in `org-core/AGENTS.md`.

## Architectural Plans & Artifact Dual-Storage Standard

Architectural blueprints, technical analyses, and master plans follow strict enterprise storage standards:
- **Storage Location**: Blueprints, analyses, and reports reside in `plans/<artifact-slug>/` (or `plans/<artifact-slug>.md`), with `.agents/plans/<artifact-slug>/` fully recognized for backward compatibility.
- **Topologies**: Topology 1 (Single-File Artifact) for atomic refactors, analyses, and reports; Topology 2 (Multi-Artifact Suite) for multi-domain frameworks with master `README.md` and numbered domain documents.
- **Dual-Storage Invariant**: Whenever an agent creates an architectural plan, analysis, or report artifact in the Antigravity conversation directory (`<appDataDir>/brain/<conversation-id>/`), an identical synchronized copy MUST ALWAYS be mirrored in `plans/<artifact-slug>/` (or `plans/<artifact-slug>.md`).
- **Ignore & Index Triad**: All repositories ignore `plans/` and `.agents/plans/` in `.gitignore`, while explicitly un-ignoring them in `.ignore` and `.rgignore` (`!plans/`, `!plans/**`, `!.agents/plans/`, `!.agents/plans/**`) and setting `"search.useIgnoreFiles": false` in `.vscode/settings.json` so files can always be attached with `@`.

## Required Skills

Agents operating in this repository MUST autonomously engage the corresponding domain skills provided by `tupynambalucas-dev/agent-mesh`:

- **Atelier Plugin (`@tupynambalucas-dev/plugin-atelier`)**:
  - **`plan-architect`**: Designing, structuring, authoring, and auditing architectural plans, technical analyses, and governance reports following the dual-storage standard.
  - **`router-architect`**: Authoring, auditing, or updating hierarchical `AGENTS.md` context routers.
  - **`hook-architect`**: Authoring or validating Antigravity lifecycle hooks (`hooks.json`).
- **Repository Governance Plugin (`@tupynambalucas-dev/plugin-repo`)**:
  - **`readme-architect`**: Authoring or auditing `README.md` files, recursive directory navigation, and the AGENTS-README co-existence invariant.
  - **`community-health-architect`**: Authoring or auditing `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`, `SECURITY.md`, and `SUPPORT.md`.
  - **`license-architect`**: Auditing `LICENSE` files, copyright headers, and SPDX compliance.
  - **`github-standards-architect`**: Standardizing `.github` workflows, CODEOWNERS, and composite actions.
- **GitHub Governance Plugins (`@tupynambalucas-dev/plugin-github-org`, `@tupynambalucas-dev/plugin-github-flow`)**:
  - **`github-org-operator`**: Managing organization RBAC, teams, and repository provisioning.
  - **`github-ruleset-operator`**: Defining, auditing, and enforcing branch and tag protection rulesets.
  - **`github-security-auditor`**: Auditing Dependabot, Secret Scanning, and Code Scanning alerts.
  - **`github-flow-operator`**: Executing Git branching, SSH-signed Conventional Commits, and pull request workflows.
