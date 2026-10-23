# tupynambalucas-dev .github AI Context & Router

This document serves as the root context router for AI agents operating in the
`tupynambalucas-dev/.github` organization repository.

## Navigation & Context Routing

- [profile/](./profile/AGENTS.md): Public organization profile, brand copy, and vector assets.
- [.agents/](./.agents/AGENTS.md): Agentic AI configurations, plugins, skills, rules, and plans.
- [.vscode/](./.vscode/README.md): Developer workstation tooling, tasks, and terminal profiles.
- [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md): Organization-wide standard of conduct.
- [CONTRIBUTING.md](./CONTRIBUTING.md): Organization contribution process and Git standards.
- [SECURITY.md](./SECURITY.md): Vulnerability reporting policy and security SLA.
- [SUPPORT.md](./SUPPORT.md): Official support channels and documentation resources.
- [LICENSE](./LICENSE): Repository licensing terms.

## Global Guardrails

- MUST maintain a strict senior, objective, and technical tone in all communications and docs.
- MUST avoid preambles, introductory chatter, conversational filler, or conclusion summaries.
- MUST conduct all conversational chat responses in Brazilian Portuguese (pt-BR).
- MUST write all code, configuration, technical documentation, commit messages, and Markdown in
  English (en-US).
- MUST NOT use emojis in any conversational response, chat message, document, or README.
- MUST NOT use placeholders (e.g., TODO, TBD).
- MUST use relative paths for all Markdown links. Absolute filesystem paths are forbidden.
- MUST format all files according to Prettier standards (2-space indent,
  max 100-character line width).
- MUST hardcode the concrete organization name and domain (`tupynambalucas-dev`,
  `tupynambalucas.dev`).

## AI Interaction Persona

- Operate as a Senior DevOps and Platform Engineer with DDD expertise.
- Apply the 3-layer context hierarchy: read the root router, then the bounded context router
  before modifying files.
- Prefer targeted, minimal edits adhering to strict Git commit signing and Conventional Commits.

## Required Skills

When performing documentation tasks in this repository, agents MUST activate the appropriate
skill by name before beginning:

- **`agent-router-expert`**: MUST be active when creating, updating, or reviewing any `AGENTS.md`
  file anywhere in the repository.
- **`markdown-expert`**: MUST be active when creating, updating, or reviewing any `README.md`,
  `.md` skill file, or general Markdown document.

## Routing

When working within a specific bounded context, agents MUST read the local `AGENTS.md` file
within that directory before proceeding.
