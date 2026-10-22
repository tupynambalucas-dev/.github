# Secrets Expert Plugin

This plugin provides enterprise secrets management capabilities integrating Infisical Cloud,
Universal Auth, the Infisical MCP server, and Kubernetes InfisicalSecret manifests.

---

## Components

- **Manifest**: [plugin.json](./plugin.json)
- **MCP Configuration**: [mcp_config.json](./mcp_config.json)
- **Rules**: [rules/secrets-management.md](./rules/secrets-management.md)
- **Skill**: [skills/secrets-manager/SKILL.md](./skills/secrets-manager/SKILL.md)

---

## Secret Management Taxonomy

1. **Cluster Secrets (Infisical)**: Runtime secrets for Kubernetes workloads injected dynamically
   via the Infisical Operator.
2. **GitOps Manifests (Bitnami Sealed Secrets)**:
   Encrypted secret objects committed safely into Git.
3. **CI/CD Secrets (GitHub Secrets)**: Automated pipeline build tokens isolated to specific
   repositories and deployment environments.
