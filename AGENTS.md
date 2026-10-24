# tupynambalucas-dev .github AI Context & Router

This document serves as the root context router for AI agents operating in the
`tupynambalucas-dev/.github` organization governance repository and cross-repository ecosystem.

## Workspace Ecosystem

- [agent-toolkit](../agent-toolkit/AGENTS.md): Universal AI agent governance plugin, shared MCPs, and skills.
- [platform](../platform/AGENTS.md): Core platform monorepo containing corporate products, portal, internal hub, and Kubernetes infrastructure.
- [docs](../docs/AGENTS.md): Standalone documentation hub and technical reference archives.
- [profile/](./profile/AGENTS.md): Public organization profile, brand copy, and vector assets.
- [.agents/](./.agents/AGENTS.md): Organization-level operational plans and legacy reference archives.
- [.vscode/](./.vscode/README.md): Developer workstation tooling, tasks, and terminal profiles.
- [tupynambalucas-dev.code-workspace](./tupynambalucas-dev.code-workspace): Canonical multi-root workspace definition.

## Governance Standards

- [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md): Organization-wide standard of conduct.
- [CONTRIBUTING.md](./CONTRIBUTING.md): Organization contribution process and Git standards.
- [SECURITY.md](./SECURITY.md): Vulnerability reporting policy and security SLA.
- [SUPPORT.md](./SUPPORT.md): Official support channels and documentation resources.
- [LICENSE](./LICENSE): Repository licensing terms.

## Global Guardrails

- MUST maintain a strict senior, objective, and technical tone in all communications and docs.
- MUST avoid preambles, introductory chatter, conversational filler, or conclusion summaries.
- MUST conduct all conversational chat responses in Brazilian Portuguese (pt-BR).
- MUST write all code, configuration, technical documentation, commit messages, and Markdown in English (en-US).
- MUST NOT use emojis in any conversational response, chat message, document, or README.
- MUST NOT use placeholders (e.g., TODO, TBD).
- MUST sign all Git commits with SSH: `git commit -S -m "..."`.
- MUST use relative paths for all Markdown links. Absolute filesystem paths are forbidden.
- MUST format all files according to Prettier standards (2-space indent, max 100-character line width).
- MUST hardcode the concrete organization name and domain (`tupynambalucas-dev`, `tupynambalucas.dev`).

## Cross-Repository Governance Protocol

- When launched in Organization Governance Scope (`--add-dir ../platform --add-dir ../docs --add-dir ../agent-toolkit`), the agent holds cross-repository operational oversight.
- The agent MUST read and adhere to each repository's local `AGENTS.md` before creating or modifying files within that repository's bounded context.
- Each repository maintains an autonomous Git history, independent dependencies, and dedicated CI/CD pipelines.

## Required Skills

When performing documentation tasks in this repository, agents MUST activate the appropriate skill by name:

- **`agent-router-expert`**: Active when creating, updating, or reviewing any `AGENTS.md` file anywhere in the ecosystem.
- **`markdown-expert`**: Active when creating, updating, or reviewing any `README.md`, `.md` skill file, or general Markdown document.
- **`github-org-manager`**: Active when configuring organization teams, rulesets, or permissions.
