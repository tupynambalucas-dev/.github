# Tupynamba Lucas Organization Governance (`.github`)

Central governance, default community health, public organization profile, and IDE workstation configuration repository (`tupynambalucas-dev/.github`) for the `@tupynambalucas-dev` GitHub organization.

---

## 1. Architecture Overview

GitHub treats the `.github` repository as a specialized administrative repository at the organization root. It renders the public landing profile on `https://github.com/tupynambalucas-dev`, provides fallback community health files inherited by all organization repositories, and preserves cross-repository architectural plans and workstation profiles.

```text
.github/
├── .agents/               # Architectural master plans, corporate references, hooks, and agent scripts
│   ├── plans/             # Cross-repository architecture specifications and migration runbooks
│   ├── references/        # Corporate engineering guides and platform reference archives
│   ├── scripts/           # Agent-executed validation and maintenance scripts
│   ├── AGENTS.md          # Bounded context router for .agents/
│   ├── README.md          # Subsystem overview for .agents/
│   └── hooks.json         # Antigravity PreToolUse safety gate definitions
├── .github/               # Organization-wide intake templates and code ownership
│   ├── ISSUE_TEMPLATE/    # Default YAML Issue Forms (bug_report.yml, feature_request.yml, config.yml)
│   ├── CODEOWNERS         # Repository code ownership assignments
│   └── PULL_REQUEST_TEMPLATE.md # Organization-wide default Pull Request checklist
├── .vscode/               # Shared IDE settings, tasks, and workspace extension recommendations
│   ├── README.md          # Workstation IDE configuration documentation
│   ├── extensions.json    # Recommended workspace extensions
│   ├── settings.json      # Editor formatting, linting, and schema settings
│   └── tasks.json         # Standalone .github Antigravity CLI launch task
├── profile/               # Public organization landing profile and brand vector assets
│   ├── assets/            # Official SVG logos, isotypes, and theme-adaptive marks
│   ├── AGENTS.md          # Bounded context router for profile maintainers
│   └── README.md          # Public landing page rendered at github.com/tupynambalucas-dev
├── references/            # Upstream GitHub governance reference (.github & .github-private)
│   └── README.md          # Reference index and architectural specifications
├── templates/             # Exportable developer workstation templates
│   ├── profiles/          # VS Code / Antigravity IDE .code-profile bundles
│   └── README.md          # Workstation template import guide
├── AGENTS.md              # Sovereign Layer-1 AI agent context router
├── CODE_OF_CONDUCT.md     # Organization-wide Contributor Covenant v2.1 code of conduct
├── CONTRIBUTING.md        # GitHub Flow workflow, SSH commit signing, and PR standards
├── LICENSE                # Apache License 2.0 governing repository assets
├── README.md              # Primary repository documentation
├── SECURITY.md            # Vulnerability disclosure policy, supported versions, and SLAs
└── SUPPORT.md             # Documentation portal, issue tracking, and support channels
```

---

## 2. Subsystems and Navigation

| Subsystem / File | Context Router | Documentation / Entrypoint | Purpose |
| :--- | :--- | :--- | :--- |
| **Organization Profile** | [profile/AGENTS.md](./profile/AGENTS.md) | [profile/README.md](./profile/README.md) | Public landing page rendered on `github.com/tupynambalucas-dev` and brand SVG assets. |
| **Agent Plans & Hooks** | [.agents/AGENTS.md](./.agents/AGENTS.md) | [.agents/README.md](./.agents/README.md) | Architectural master plans, corporate reference archives, lifecycle hooks, and utility scripts. |
| **IDE Configuration** | *(inherits root)* | [.vscode/README.md](./.vscode/README.md) | Shared editor formatting rules, YAML/Kubernetes schemas, extensions, and local tasks. |
| **Governance References** | *(inherits root)* | [references/README.md](./references/README.md) | Technical reference on `.github` vs `.github-private` profiles, community health, Actions templates, and AI governance. |
| **Workstation Templates** | *(inherits root)* | [templates/README.md](./templates/README.md) | Exportable IDE profile bundle (`tupynambalucas-dev.code-profile`). |
| **Code of Conduct** | *(inherits root)* | [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) | Contributor Covenant v2.1 behavioral standards and enforcement contacts. |
| **Contribution Guide** | *(inherits root)* | [CONTRIBUTING.md](./CONTRIBUTING.md) | Branch naming conventions, mandatory SSH commit signing, and pull request gates. |
| **Security Policy** | *(inherits root)* | [SECURITY.md](./SECURITY.md) | Supported ecosystem versions, private disclosure channels, and remediation SLAs. |
| **Support Directory** | *(inherits root)* | [SUPPORT.md](./SUPPORT.md) | Official documentation portal links, GitHub Discussions, and commercial inquiries. |
| **Intake Templates** | *(inherits root)* | [.github/PULL_REQUEST_TEMPLATE.md](./.github/PULL_REQUEST_TEMPLATE.md) | Default Pull Request checklist and structured YAML Issue Forms (`.github/ISSUE_TEMPLATE/`). |
| **License** | *(inherits root)* | [LICENSE](./LICENSE) | Apache License 2.0 (`Copyright (c) 2026 tupynambalucas.dev`). |

---

## 3. Core Capabilities

### A. Organization Profile (`profile/`)

The [profile/](./profile/README.md) directory defines the public presentation layer for `@tupynambalucas-dev`. GitHub renders [profile/README.md](./profile/README.md) directly on `https://github.com/tupynambalucas-dev`, showcasing cloud-native Kubernetes topologies, autonomous agentic AI infrastructure, engineering disciplines, and official brand marks stored in `profile/assets/`.

### B. Organization Community Health Inheritance

Files placed at the root of this repository act as organization-wide defaults on GitHub. Any repository under `@tupynambalucas-dev` that does not define its own local override automatically inherits [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md), [CONTRIBUTING.md](./CONTRIBUTING.md), [SECURITY.md](./SECURITY.md), and [SUPPORT.md](./SUPPORT.md).

### C. Meta-Repository and Agent Mesh Separation of Concerns

- **Multi-Root Workspace Orchestration**: Cross-repository multi-root IDE workspaces and multi-repository task execution are orchestrated via [Mani](https://manicli.com) in [`tupynambalucas-dev/org-core`](https://github.com/tupynambalucas-dev/org-core).
- **Reusable Agent Capabilities**: Domain plugins (`@tupynambalucas-dev/plugin-*`), dual-transport MCP servers (`@tupynambalucas-dev/mcp-*`), active domain rules, and modular skills are maintained in [`tupynambalucas-dev/agent-mesh`](https://github.com/tupynambalucas-dev/agent-mesh). The local [.agents/](./.agents/README.md) directory in this repository is strictly scoped to architectural decision records, reference guides, and local repository hooks.

---

## 4. Connected Ecosystem

| Repository / Portal | Location | Role |
| :--- | :--- | :--- |
| **Umbrella Meta-Repository** | [tupynambalucas-dev/org-core](https://github.com/tupynambalucas-dev/org-core) | Multi-repository Mani orchestrator and canonical multi-root IDE workspace. |
| **Enterprise Agent Mesh** | [tupynambalucas-dev/agent-mesh](https://github.com/tupynambalucas-dev/agent-mesh) | Domain plugins, modular AI skills, active rules, and shared MCP servers. |
| **Core Platform Monorepo** | [tupynambalucas-dev/platform](https://github.com/tupynambalucas-dev/platform) | Corporate web/API services, Cortex AI gateway, internal hub, and Kubernetes GitOps manifests. |
| **Documentation Hub** | [tupynambalucas-dev/docs](https://github.com/tupynambalucas-dev/docs) | Sovereign Docusaurus v3 documentation portal ([docs.tupynambalucas.dev](https://docs.tupynambalucas.dev)). |
| **Product Engine** | [tupynambalucas-dev/tessel](https://github.com/tupynambalucas-dev/tessel) | Autonomous TypeScript/WebAssembly web game engine. |
| **Corporate Website** | [tupynambalucas.dev](https://tupynambalucas.dev) | Public corporate portal and engineering showcase. |

---

## 5. Governance Standards

1. **Cryptographic Commit Signing**: All Git commits and annotated tags MUST be signed using SSH (`git commit -S -m "..."`).
2. **Conventional Commits**: All commit messages MUST conform to Conventional Commits v1.0.0 (`<type>(<scope>): <description>`).
3. **Zero-Emoji Invariant**: Emojis are strictly prohibited across all documentation, code comments, commit messages, and pull requests.
