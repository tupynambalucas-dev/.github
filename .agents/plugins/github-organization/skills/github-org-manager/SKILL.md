---
name: github-org-manager
description: Use this skill to manage GitHub organization teams, assign repository RBAC permissions, configure branch protection rulesets, and manage GitHub Actions secrets using the GitHub CLI (gh) and the GitHub MCP server.
---

# GitHub Organization Manager Skill

This skill defines the operational runbooks and protocols for managing the GitHub organization,
functional teams, repository rulesets, and GitHub Actions pipeline secrets for `tupynambalucas-dev`.

---

## 1. Tool Selection Protocol

Select the appropriate interface based on the operational context:

| Context / Operation                  | Preferred Interface | Mechanism                                                |
| :----------------------------------- | :------------------ | :------------------------------------------------------- |
| **Autonomous Repository Operations** | `github-mcp`        | MCP stdio tool calling (`get_file_contents`, PR tools)   |
| **Team Lifecycle & Memberships**     | GitHub CLI (`gh`)   | `gh api /orgs/{org}/teams` REST mutations                |
| **Team Repository RBAC Binding**     | GitHub CLI (`gh`)   | `gh api /orgs/{org}/teams/{slug}/repos/{owner}/{repo}`   |
| **Branch Ruleset Enforcement**       | GitHub CLI (`gh`)   | `gh api /repos/{owner}/{repo}/rulesets` REST mutations   |
| **Pipeline Secrets Management**      | GitHub CLI (`gh`)   | `gh secret set --org` / `gh secret set --env`            |
| **Local Code Transport**             | Git over HTTPS/SSH  | Windows GCM / WSL2 SSH commit signing (`commit.gpgsign`) |

---

## 2. Organization & Repository Scope

- **Organization Name**: `tupynambalucas-dev`
- **Monorepo Repository**: `tupynambalucas-dev/tupynambalucas`
- **Functional Teams**:
  - `core-engineers`: Core software engineers authoring applications and packages.
  - `infra-ops`: Platform and DevOps engineers managing Kubernetes clusters and CI/CD.
  - `creative-team`: Designers managing studio assets, brand vectors, and Penpot.

For detailed team matrix and Fine-Grained PAT permissions, consult [rbac-matrix.md](./references/rbac-matrix.md).

---

## 3. Team Lifecycle Management Runbook

Execute [bootstrap-teams.sh](./scripts/bootstrap-teams.sh) to provision or update functional teams:

```bash
bash .agents/plugins/github-organization/skills/github-org-manager/scripts/bootstrap-teams.sh "tupynambalucas-dev"
```

The script idempotently creates or updates the closed teams `@core-engineers`, `@infra-ops`, and
`@creative-team`.

---

## 4. Repository RBAC Binding Runbook

To bind monorepo access to functional teams, execute [sync-team-permissions.sh](./scripts/sync-team-permissions.sh):

```bash
bash .agents/plugins/github-organization/skills/github-org-manager/scripts/sync-team-permissions.sh "tupynambalucas-dev" "tupynambalucas-dev"
```

Permissions applied:

- `@core-engineers`: `push` (Write access to author branches and PRs).
- `@infra-ops`: `maintain` (Maintain access to workflows, releases, and settings).
- `@creative-team`: `push` (Write access scoped to creative assets).

---

## 5. Branch Ruleset Enforcement Runbook

Branch protection rulesets guarantee linear history and verified commit signatures. For detailed JSON
schemas, consult [ruleset-schemas.md](./references/ruleset-schemas.md).

Execute [configure-rulesets.sh](./scripts/configure-rulesets.sh) to apply rulesets:

```bash
bash .agents/plugins/github-organization/skills/github-org-manager/scripts/configure-rulesets.sh "tupynambalucas-dev" "tupynambalucas-dev"
```

Enforced policies:

- **`main` Ruleset**: Requires PR with >= 1 approval, passing CI status checks, linear history, and
  mandatory SSH commit signatures. Blocks deletion and force pushes.
- **`develop` Ruleset**: Requires passing CI status checks. Blocks deletion and direct force pushes.

---

## 6. GitHub Actions Secrets Management

Manage pipeline secrets natively within GitHub Actions without bridging cluster runtime keys:

```bash
# Organization-level secrets (shared container registries)
gh secret set CONTAINER_REGISTRY_TOKEN --org "tupynambalucas-dev" --visibility selected --repos "tupynambalucas-dev"

# Environment-level secrets (bound to dev, staging, prod)
gh secret set CLOUDFLARE_PAGES_TOKEN --env "prod" --repo "tupynambalucas-dev/tupynambalucas"
gh secret set CODECOV_TOKEN --env "dev" --repo "tupynambalucas-dev/tupynambalucas"
```

---

## 7. Gotchas & Edge Cases

1. **Fine-Grained PAT Organization Policy**: Fine-grained tokens fail with HTTP 403 unless the
   organization owner enables access under `Organization Settings -> Personal access tokens -> Settings`.
2. **Team Member Invitations**: Adding users to teams via `gh api` requires the token to have the
   `Members: write` organization permission.
3. **Linear History**: Rebase and Squash are permitted on `main`. Merge commits without squash are
   rejected by ruleset policy.
