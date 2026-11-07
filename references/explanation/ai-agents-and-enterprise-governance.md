# AI Custom Agents, Managed Settings & Strategic Governance Use Cases

This document details how `<org>/.github` and `<org>/.github-private` act as centralized control planes for GitHub Copilot Custom Agents, Server-Managed AI Client Policies, Plugin Marketplaces, and broader organizational governance, concluding with the concrete architectural mapping for `@tupynambalucas-dev`.

---

## 1. Organization & Enterprise Custom AI Agents (`/agents/`)

GitHub allows organizations and enterprises to define specialist AI agent personas with scoped instructions, tool restrictions, and MCP bindings that become available across GitHub.com, Copilot Cloud Agent, Copilot CLI, VS Code, Visual Studio, and JetBrains IDEs.

### A. Multi-Tier Agent Discovery Hierarchy

| Scope Tier | Host Repository & Path | Availability & Access Behavior |
| :--- | :--- | :--- |
| **Repository-Scoped (or Staging)** | `<any-repo>/.github/agents/<agent-name>.md` | Available **only** within that specific repository to collaborators with access. Used inside `.github-private/.github/agents/` to **sandbox and test** new agents before org-wide promotion. |
| **Organization-Wide** | `<org>/.github/agents/<agent-name>.md` **OR** `<org>/.github-private/agents/<agent-name>.md` *(note root `/agents/`, not `/.github/agents/`)* | Available across **all repositories in the organization** to all organization members—**even if members do NOT have Read access to `.github-private`**. |
| **Enterprise-Wide** | `<designated-org>/.github-private/agents/<agent-name>.md` | Configured under **Enterprise Settings > AI controls > Agents > Configuration source**. Available across **all organizations and repositories in the enterprise**. |

### B. Custom Agent Profile Format

Each `/agents/<agent-name>.md` file combines YAML frontmatter with deterministic Markdown instructions:

```markdown
---
name: security-ruleset-auditor
description: Read-only security and branch ruleset auditor enforcing SSH signing and secret hygiene
---

You are a security governance auditor for tupynambalucas-dev. Your responsibilities:

- Inspect repository rulesets, branch protections, workflows, and package manifests.
- Verify mandatory cryptographic SSH signing, linear history, and least-privilege GITHUB_TOKEN scopes.
- Flag any plaintext secret exposure or unpinned third-party Action references.
- Operate strictly read-only unless explicitly instructed to remediate a configuration file.
```

---

## 2. Server-Managed AI & Plugin Governance (`.github-private`)

At the enterprise governance tier, `<designated-org>/.github-private` serves as the authoritative **server-managed policy source** for Copilot CLI, VS Code, JetBrains IDEs, the GitHub Copilot app, and Copilot Cloud Agent.

### A. Configuration Files in `<org>/.github-private`

```text
.github-private/
├── agents/
│   └── <enterprise-agent>.md        # Promoted organization/enterprise custom agents
├── .github/
│   └── agents/
│       └── <candidate-agent>.md     # Staged custom agents restricted to AI managers for testing
├── copilot/
│   ├── managed-settings.json        # Global baseline policy enforced across licensed clients
│   ├── team-mappings.json           # Maps enterprise teams to specialized override files
│   └── teams/
│       └── platform-sre.json        # Team-specific model, sandbox, or plugin overrides
└── profile/
    └── README.md                    # Member-only organization landing page (requires Private visibility)
```

### B. Plugin Marketplace & Plugin Enforcement (`copilot/managed-settings.json`)

Administrators control internal plugin distribution, auto-updates, sandbox enforcement, and mandatory/blocked plugins directly from `copilot/managed-settings.json`:

```json
{
  "model": "auto",
  "forceRemoteSettingsRefresh": true,
  "strictKnownMarketplaces": true,
  "extraKnownMarketplaces": {
    "tupynambalucas-agent-mesh": {
      "source": {
        "source": "github",
        "repo": "tupynambalucas-dev/agent-mesh"
      },
      "autoUpdate": true
    }
  },
  "enabledPlugins": {
    "atelier@tupynambalucas-agent-mesh": true,
    "repo@tupynambalucas-agent-mesh": true,
    "secrets@tupynambalucas-agent-mesh": true,
    "unapproved-third-party@external": false
  }
}
```

- **Refresh Cadence**: Supported clients poll server-managed settings from `.github-private` approximately every **60 minutes** (or immediately on client restart / `Developer: Sync Account Policy` in VS Code).
- **Optional Project Plugins**: Because `managed-settings.json` only enforces *required* (`true`) or *blocked* (`false`) states, optional per-repository plugin defaults belong in each target repository's `.github/copilot/settings.json`.

### C. Policy Delivery Precedence Order

When multiple management planes coexist on a developer workstation, GitHub resolves settings in strict priority order:

1. **MDM-Managed Settings** (Windows Registry `HKLM\SOFTWARE\Policies\GitHubCopilot` / macOS `com.github.copilot` managed preferences)
2. **Server-Managed Settings** (`<org>/.github-private/copilot/managed-settings.json` + `team-mappings.json`)
3. **File-Based Settings** (`/etc/github-copilot/managed-settings.json` or `%ProgramFiles%\GitHubCopilot\managed-settings.json` — ideal for DevContainers/Codespaces)
4. **User-Level & Repository Settings**

> [!NOTE]
> **Most-Restrictive Composition Exception:**
> Unlike scalar keys (where higher-priority sources override lower ones), `sandbox` settings and `permissions.deny` / `permissions.ask` / `permissions.allow` lists compose across **all** active layers in the **most restrictive direction**.

### D. Protecting `.github-private` with Rulesets

GitHub provides a one-click ruleset generator under **Enterprise > AI controls > Agents > Protect agent files using rulesets** (or manual Repository Rulesets) to guarantee that only designated AI managers or organization owners can merge changes to `/agents/*` and `copilot/*`, while still permitting engineers with write/read access to propose improvements via Pull Requests.

---

## 3. Comprehensive Use-Case Taxonomy & `@tupynambalucas-dev` Alignment

In the `@tupynambalucas-dev` federated architecture, responsibilities are cleanly partitioned across four complementary repositories so that GitHub-native platform hooks and cross-vendor Antigravity (`agy`) / Claude Code ecosystems reinforce one another without duplication:

| Governance Repository | Visibility | What It Should Do (Recommended Responsibilities) |
| :--- | :--- | :--- |
| **`tupynambalucas-dev/.github`** | `Public` | 1. **Public Organization Profile**: `profile/README.md` + `profile/assets/*.svg` (`github.com/tupynambalucas-dev`).<br>2. **Community Health Fallbacks**: `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`, `SECURITY.md`, `SUPPORT.md`, `ACCESSIBILITY.md`, `.github/VULNERABILITY_REPORT.yml`.<br>3. **Standardized Intake Forms**: `.github/ISSUE_TEMPLATE/*.yml` (bug/feature YAML forms + `config.yml`), `.github/PULL_REQUEST_TEMPLATE.md`, `.github/DISCUSSION_TEMPLATE/*.yml`.<br>4. **CI/CD Starter & Reusable Workflows**: `workflow-templates/*.yml` + `.properties.json` and public `workflow_call` pipelines (Commitlint, Conventional Commits, Changesets, MDX lint).<br>5. **Renovate / Linter Presets**: Shareable JSON presets (`renovate-preset.json`) consumed remotely by child repos.<br>6. **Architecture Blueprints & Governance Docs**: `references/` and `.agents/plans/`. |
| **`tupynambalucas-dev/.github-private`** *(Optional Companion)* | `Private` | 1. **Member-Only Organization Profile (`profile/README.md`)**: Internal engineering landing page displaying private cluster endpoints (ArgoCD, Grafana, Traefik, Infisical projects), onboarding checklists, and architecture runbooks.<br>2. **Private Copilot & Cloud Agent Governance**: `/agents/*.md` (internal security/SRE Copilot agents) and `copilot/managed-settings.json` binding `tupynambalucas-dev/agent-mesh` as an approved plugin marketplace.<br>3. **Internal Reusable Workflows**: Private `workflow_call` deployment pipelines referencing internal infrastructure topologies. |
| **`tupynambalucas-dev/agent-mesh`** | `Public` | **Sovereign AI Toolchain Monorepo**: Cross-vendor `agent-plugins.org` v1.0.0 domain plugins (`@tupynambalucas-dev/plugin-*`), modular `SKILL.md` assets, active `rules/AGENTS.md` mandates, and dual-transport MCP servers (`@tupynambalucas-dev/mcp-*`). |
| **`tupynambalucas-dev/org-core`** | `Public` | **Umbrella Meta-Repository**: Pins deterministic `160000` Git submodule pointers across `.github`, `agent-mesh`, `platform`, and `docs`, and provides the canonical local multi-root IDE workspace (`tupynambalucas-dev.code-workspace`). |

---

## 4. Canonical Sources

- [Creating a .github-private repository - GitHub Docs](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-agents/create-github-private-repo)
- [Preparing to use custom agents in your organization - GitHub Docs](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/prepare-for-custom-agents)
- [Preparing to use custom agents in your enterprise - GitHub Docs](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-agents/prepare-for-custom-agents)
- [Getting started with enterprise-managed settings - GitHub Docs](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/use-managed-settings/get-started)
- [Choosing how to deploy enterprise-managed settings to users - GitHub Docs](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/use-managed-settings/deploy-managed-settings)
- [Managing plugin marketplaces and plugins with enterprise-managed settings - GitHub Docs](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/use-managed-settings/manage-plugin-marketplaces-and-plugins)
- [Copilot customization cheat sheet - GitHub Docs](https://docs.github.com/en/copilot/reference/customization-cheat-sheet)
- [Parent Reference Index](./README.md)
