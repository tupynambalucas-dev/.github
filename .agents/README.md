# Organization Agent Plans, References, and Hooks (`.agents/`)

Bounded context inside `tupynambalucas-dev/.github` preserving cross-repository architectural plans, corporate governance reference archives, local lifecycle safety hooks, and agent-executed utility scripts.

---

## 1. Overview

Following the migration of reusable AI plugins, MCP servers, rules, and modular skills to [`tupynambalucas-dev/agent-mesh`](https://github.com/tupynambalucas-dev/agent-mesh), this `.agents/` directory serves strictly as the organization-level archive for architectural blueprints and repository-local safety hooks.

---

## 2. Directory Navigation

| Subsystem / File | Documentation / Target | Description |
| :--- | :--- | :--- |
| **Context Router** | [AGENTS.md](./AGENTS.md) | Bounded context instructions and operational guardrails for AI agents. |
| **Architectural Plans** | [plans/README.md](./plans/README.md) | Master architectural specifications, meta-repository runbooks, and governance plans. |
| **Reference Archives** | [references/README.md](./references/README.md) | Corporate GitHub/GitLab governance guides and Cloudflare Agents technical references. |
| **Lifecycle Hooks** | [hooks.json](./hooks.json) | Antigravity `PreToolUse` hook enforcing the root script ban across workspaces. |
| **Utility Scripts** | [scripts/prevent-root-scripts.js](./scripts/prevent-root-scripts.js) | Node.js enforcement handler invoked by `hooks.json` plus maintenance helpers (`fix.cjs`, `split-yamls.cjs`). |

---

## 3. Operational Boundaries

1. **No Local Plugins or Skills**: Author all reusable `SKILL.md` workflows, `rules/AGENTS.md` mandates, and MCP configurations inside [`tupynambalucas-dev/agent-mesh`](https://github.com/tupynambalucas-dev/agent-mesh).
2. **Root Script Gate**: `hooks.json` intercepts `write_file` and `write_to_file` operations targeting `.js`, `.cjs`, `.mjs`, `.ts`, `.py`, `.sh`, `.ps1`, or `.bat` files at workspace roots unless explicitly allowlisted as standard tool configurations (`eslint.config.*`, `prettier.config.*`, `vite.config.*`, etc.).
3. **Relative Link Discipline**: All internal links across `plans/` and `references/` must remain relative and portable across operating systems.

---

## 4. Navigation

- [Repository Root README](../README.md)
- [Architectural Plans Index](./plans/README.md)
- [Reference Archives Index](./references/README.md)
