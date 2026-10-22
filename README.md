# Tupynambá Lucas Organization Configuration (.github)

This repository (`tupynambalucas/.github`) is the central governance, default community health,
organization profile, and AI agent configuration hub for the `@tupynambalucas` GitHub organization.

---

## Repository Purpose and Layout

GitHub treats the `.github` repository as a specialized administrative repository for
organizations. It provides public profile rendering, organizational community health defaults,
and workspace tooling across the entire ecosystem.

```text
.github/
├── .agents/          # Enterprise AI agent plugins, rules, skills, and architecture plans
├── .vscode/           # Shared IDE workspace settings, tasks, and terminal profiles
├── profile/           # Organization public landing profile and brand SVG assets
│   ├── assets/        # Official vector logos, marks, and monochrome variants
│   ├── AGENTS.md      # Bounded context router for profile maintainers
│   └── README.md      # Public profile rendered on github.com/tupynambalucas
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

The [profile/](./profile/) directory contains the presentation layer for the
`@tupynambalucas` organization. GitHub renders [profile/README.md](./profile/README.md) as
the public landing page on `https://github.com/tupynambalucas`. It showcases our engineering
philosophy, enterprise services, dual-cluster Kubernetes architecture, autonomous AI
ecosystems, and technology stack.

### 2. Organization Community Health Defaults

Files placed in the root of this repository act as organizational defaults. Any repository under
the `@tupynambalucas` organization that does not define its own community files automatically
inherits these standards:

- **[CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)**: Standards of professional conduct and enforcement.
- **[CONTRIBUTING.md](./CONTRIBUTING.md)**: Contribution guidelines, mandatory SSH commit signing,
  and branch conventions.
- **[SECURITY.md](./SECURITY.md)**: Security policy, vulnerability disclosure SLAs, and reporting.
- **[SUPPORT.md](./SUPPORT.md)**: Support channels, documentation links, and contact routes.

### 3. Enterprise AI Agent Infrastructure (`.agents/`)

The [.agents/](./.agents/) directory encapsulates custom agentic AI configurations adhering to the
Antigravity (AGY) customization architecture:

- **Plugins**: Bundled MCP servers and toolsets (`cortex`, `github-organization`, `k8s-expert`,
  `secrets-expert`).
- **Skills**: Progressive-disclosure runbooks and expert personas (`agent-router-expert`,
  `markdown-expert`, `skill-expert`, `plugin-expert`).
- **Rules**: Context-injected constraints enforcing TypeScript strictness, Git governance, and
  architecture patterns.
- **Plans**: Version-controlled architectural execution plans for infrastructure refactors.

### 4. Developer Workstation Automation (`.vscode/`)

The [.vscode/](./.vscode/) directory contains workspace configurations, automated tasks, and
Windows Terminal fragment definitions providing seamless parity between Windows 11 host suites
and native WSL2 Ubuntu environments.

---

## Connected Ecosystem

- **Enterprise Website**: [https://tupynambalucas.dev](https://tupynambalucas.dev)
- **Documentation Portal**: [https://docs.tupynambalucas.dev](https://docs.tupynambalucas.dev)
- **Primary Monorepo**:
  [tupynambalucas/tupynambalucas](https://github.com/tupynambalucas/tupynambalucas)
- **Direct Contact**: [contato@tupynambalucas.dev](mailto:contato@tupynambalucas.dev)
