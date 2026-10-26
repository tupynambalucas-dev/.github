# Tupynambá Lucas Organization Configuration (.github)

This repository (`tupynambalucas-dev/.github`) is the central governance, default community health, organization profile, and repository configuration hub for the `@tupynambalucas-dev` GitHub organization.

---

## Repository Purpose and Layout

GitHub treats the `.github` repository as a specialized administrative repository for organizations. It provides public profile rendering, organizational community health defaults, and workspace tooling across the entire ecosystem.

```text
.github/
├── .agents/          # Enterprise AI agent plans, historical references, and execution runbooks
├── .vscode/           # Shared IDE workspace settings, tasks, and terminal profiles
├── profile/           # Organization public landing profile and brand SVG assets
│   ├── assets/        # Official vector logos, marks, and monochrome variants
│   ├── AGENTS.md      # Bounded context router for profile maintainers
│   └── README.md      # Public profile rendered on github.com/tupynambalucas-dev
├── AGENTS.md          # Root AI agent router and global guardrails
├── CODE_OF_CONDUCT.md # Organization-wide contributor code of conduct
├── CONTRIBUTING.md    # Development workflow, commit signing, and PR standards
├── LICENSE            # Organization licensing terms (MIT)
├── README.md          # Technical repository overview
├── SECURITY.md        # Vulnerability disclosure policy and reporting SLAs
└── SUPPORT.md         # Support resources, documentation channels, and inquiries
```

---

## Core Components

### 1. Organization Profile (`profile/`)

The [profile/](./profile/) directory contains the presentation layer for the `@tupynambalucas-dev` organization. GitHub renders [profile/README.md](./profile/README.md) as the public landing page on `https://github.com/tupynambalucas-dev`. It showcases our engineering philosophy, enterprise services, dual-cluster Kubernetes architecture, autonomous AI ecosystems, and technology stack.

### 2. Organization Community Health Defaults

Files placed in the root of this repository act as organizational defaults. Any repository under the `@tupynambalucas-dev` organization that does not define its own community files automatically inherits these standards:

- **[CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)**: Standards of professional conduct and enforcement.
- **[CONTRIBUTING.md](./CONTRIBUTING.md)**: Contribution guidelines, mandatory SSH commit signing, and branch conventions.
- **[SECURITY.md](./SECURITY.md)**: Security policy, vulnerability disclosure SLAs, and reporting.
- **[SUPPORT.md](./SUPPORT.md)**: Support channels, documentation links, and contact routes.

### 3. Enterprise AI Agent Governance

AI agent governance, shared MCP servers, and reusable skills are authored and sovereignly maintained within the [`agent-mesh`](https://github.com/tupynambalucas-dev/agent-mesh) repository. The local [.agents/](./.agents/) directory within this repository preserves operational refactor plans and domain reference documents.

### 4. Developer Workstation Automation (`.vscode/`)

The [.vscode/](./.vscode/) directory contains workspace configurations, automated tasks, and terminal profiles providing parity between host operating systems and containerized development workflows.

---

## Connected Ecosystem

- **Meta-Repository**: [tupynambalucas-dev/org-core](https://github.com/tupynambalucas-dev/org-core)
- **Agent Governance**: [tupynambalucas-dev/agent-mesh](https://github.com/tupynambalucas-dev/agent-mesh)
- **Primary Monorepo**: [tupynambalucas-dev/platform](https://github.com/tupynambalucas-dev/platform)
- **Documentation Portal**: [https://docs.tupynambalucas.dev](https://docs.tupynambalucas.dev) ([tupynambalucas-dev/docs](https://github.com/tupynambalucas-dev/docs))
- **Product Repository**: [tupynambalucas-dev/tessel](https://github.com/tupynambalucas-dev/tessel)
- **Enterprise Website**: [https://tupynambalucas.dev](https://tupynambalucas.dev)
- **Direct Contact**: [contato@tupynambalucas.dev](mailto:contato@tupynambalucas.dev)

---

## Governance and Contribution

1. **Cryptographic Signing**: All Git commits and annotated tags must be signed using SSH: `git commit -S -m "..."`.
2. **Conventional Commits**: Strict adhere to Conventional Commits v1.0.0.
3. **Zero-Emoji Policy**: Emojis are strictly forbidden across all repositories and communications.
