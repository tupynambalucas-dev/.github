# GitHub Governance Repositories Reference (`references/`)

Authoritative technical reference library documenting GitHub's special organization governance repositories (`<org>/.github` and `<org>/.github-private`), extracted and synthesized from upstream GitHub Docs.

---

## 1. Executive Summary

GitHub reserves two special repository names at the organization (and enterprise) level to centralize public presentation, internal member onboarding, default community health standards, CI/CD starter templates, and AI agent governance without polluting downstream application repositories:

| Repository | Required Visibility | Primary Native Platform Capabilities |
| :--- | :--- | :--- |
| **`<org>/.github`** | **Public** *(required for Profile & Community Health; Internal/Private supported only for restricted Starter Workflows & Custom Agents)* | Public organization profile (`profile/README.md`), organization-wide fallback Community Health files (`SECURITY.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SUPPORT.md`, `ACCESSIBILITY.md`, `FUNDING.yml`, `VULNERABILITY_REPORT.yml`), default Issue/PR/Discussion templates, GitHub Actions Starter Workflows (`workflow-templates/`), public Reusable Workflows, and organization-level AI Custom Agents (`/agents/`). |
| **`<org>/.github-private`** | **Private** *(strictly required for Member-Only Profile; Private or Internal supported for Enterprise AI Governance)* | Member-only organization profile (`profile/README.md` rendered exclusively to authenticated organization members), organization and enterprise AI Custom Agents (`/agents/*.md`), staging agents (`.github/agents/*.md`), and server-managed GitHub Copilot governance (`copilot/managed-settings.json`, `copilot/team-mappings.json`, plugin marketplace enforcement). |

---

## 2. Reference Architecture Catalog

| Document | Focus Area & Scope |
| :--- | :--- |
| [github-vs-github-private-architecture.md](./github-vs-github-private-architecture.md) | Deep architectural comparison between `.github` and `.github-private`, visibility constraints, dual-view organization profile rendering (`Public` vs `Member`), pinned repository segmentation, and resolution topology. |
| [default-community-health-and-templates.md](./default-community-health-and-templates.md) | Exhaustive specification of all supported default Community Health files, Issue Forms, Pull Request templates, Discussion Category forms, directory precedence rules, and critical non-inherited files (`LICENSE`, `CODEOWNERS`, `dependabot.yml`). |
| [actions-workflows-and-ci-governance.md](./actions-workflows-and-ci-governance.md) | Technical reference for Organization Starter Workflows (`workflow-templates/`, `.properties.json`, `$default-branch`), Reusable Workflows (`workflow_call`), runner billing, `GITHUB_TOKEN` permission monotonicity, and concurrency rules. |
| [ai-agents-and-enterprise-governance.md](./ai-agents-and-enterprise-governance.md) | Reference for Organization and Enterprise Custom Agents (`/agents/`), server-managed Copilot settings (`copilot/managed-settings.json`), plugin marketplace controls, ruleset protection, and strategic domain boundaries within `tupynambalucas-dev`. |

---

## 3. Canonical Upstream Sources

All specifications in this directory were retrieved and verified from official GitHub documentation:

- [Customizing your organization's profile](https://docs.github.com/en/organizations/collaborating-with-groups-in-organizations/customizing-your-organizations-profile)
- [Creating a default community health file](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/creating-a-default-community-health-file)
- [About issue and pull request templates](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/about-issue-and-pull-request-templates)
- [Creating discussion category forms](https://docs.github.com/en/discussions/managing-discussions-for-your-community/creating-discussion-category-forms)
- [Creating workflow templates for your organization](https://docs.github.com/en/actions/how-tos/reuse-automations/create-workflow-templates)
- [Reusing workflow configurations](https://docs.github.com/en/actions/reference/workflows-and-actions/reusing-workflow-configurations)
- [Sharing actions and workflows with your organization](https://docs.github.com/en/actions/how-tos/reuse-automations/share-with-your-organization)
- [Creating a .github-private repository](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-agents/create-github-private-repo)
- [Preparing to use custom agents in your organization](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/prepare-for-custom-agents)
- [Preparing to use custom agents in your enterprise](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-agents/prepare-for-custom-agents)
- [Getting started with enterprise-managed settings](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/use-managed-settings/get-started)
- [Choosing how to deploy enterprise-managed settings to users](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/use-managed-settings/deploy-managed-settings)
- [Managing plugin marketplaces and plugins with enterprise-managed settings](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/use-managed-settings/manage-plugin-marketplaces-and-plugins)
- [Copilot customization cheat sheet](https://docs.github.com/en/copilot/reference/customization-cheat-sheet)

---

## 4. Navigation

- [Repository Root README](../README.md)
- [Repository Agent Context (`AGENTS.md`)](../AGENTS.md)
