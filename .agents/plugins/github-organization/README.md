# GitHub Organization Governance Plugin

This plugin establishes enterprise-grade GitHub organization governance, managing team-based
Role-Based Access Control (RBAC), repository rulesets, SSH commit verification, and GitHub Actions
secrets across the `@tupynambalucas` ecosystem.

---

## Components

- **Manifest**: [plugin.json](./plugin.json)
- **MCP Configuration**: [mcp_config.json](./mcp_config.json)
- **Rules**: [rules/github-governance.md](./rules/github-governance.md)
- **Skill**: [skills/github-org-manager/SKILL.md](./skills/github-org-manager/SKILL.md)

---

## Governance Standards

1. **Functional Teams**:
   - `@core-engineers`: Write access on monorepo product packages.
   - `@infra-ops`: Maintainer permissions on infrastructure manifests and CI/CD pipelines.
   - `@creative-team`: Write access on brand and studio design workspaces.
2. **Branch Protection Rulesets**:
   - Linear Git history on `main` and `develop`.
   - Mandatory cryptographic SSH commit signing (`ed25519`).
   - Required status checks (linter, type-check, unit tests).
   - Direct push bans on protected branches.
3. **Execution Tooling**:
   - Autonomous read/mutation operations via `github-mcp` tools.
   - Administrative team and ruleset provisioning via the `github-org-manager` skill scripts.
