# Organization Technical Documentation Hub (`references/`)

Authoritative technical documentation library for `tupynambalucas-dev`, structured strictly according to the **Diataxis Documentation Framework** across four cognitive quadrants: **Tutorials**, **How-To Guides**, **Reference Specifications**, and **Architectural Explanations**.

---

## 1. Diataxis Framework Architecture

The documentation in this library is partitioned by intent and audience needs:

```
                                  LEARNING ORIENTED
                                          |
                                          |
               Tutorials                  |              How-To Guides
       (Step-by-step onboarding)          |        (Task-oriented runbooks)
                                          |
    --------------------------------------+--------------------------------------
                                          |
              Explanation                 |                Reference
        (Architecture & rationale)        |         (Schemas, specs & catalogs)
                                          |
                                          |
                                 INFORMATION ORIENTED
```

* **Tutorials (Learning-Oriented)**: Step-by-step guided lessons teaching core concepts and end-to-end setups from scratch.
* **How-To Guides (Problem-Oriented)**: Practical recipes and task-focused runbooks solving concrete operational challenges.
* **Reference (Information-Oriented)**: Authoritative catalogs, permissions matrices, environment schemas, and configuration specifications.
* **Explanation (Understanding-Oriented)**: Deep architectural rationale, threat models, design decisions, and background context.

---

## 2. Documentation Catalog

### A. Tutorials (Learning-Oriented)

| Document | Primary Focus & Target Outcome | Audience |
| :--- | :--- | :--- |
| [tutorials/creating-a-github-app-end-to-end.md](./tutorials/creating-a-github-app-end-to-end.md) | Step-by-step walkthrough creating, configuring scopes, disabling webhooks, installing, delegating App Managers, and registering private keys for an enterprise GitHub App. | Platform Architects, DevOps Engineers |

### B. How-To Guides (Problem-Oriented)

| Document | Primary Focus & Target Outcome | Audience |
| :--- | :--- | :--- |
| [how-to-guides/generating-and-configuring-github-app-keys.md](./how-to-guides/generating-and-configuring-github-app-keys.md) | Generating RSA `.pem` keys, encoding to Base64 for `.env` and Infisical, configuring GitHub Actions Org Secrets, and mounting filesystem Secret volumes in Kubernetes (`platform/k8s`). | DevOps, SecOps, SRE |
| [how-to-guides/authenticating-with-a-github-app-on-behalf-of-a-user.md](./how-to-guides/authenticating-with-a-github-app-on-behalf-of-a-user.md) | Executing OAuth 2.0 Device Flow (`https://github.com/login/device`) from terminal interfaces without web redirects, minting auto-expiring 8-hour user access tokens. | CLI Developers, Engineers |
| [how-to-guides/automacao-de-onboarding-no-github.md](./how-to-guides/automacao-de-onboarding-no-github.md) | Automated developer onboarding, conditional Git includes (`hasconfig:remote.*.url`), unified SSH keys for authentication, and cryptographic Ed25519 commit signing. | Team Leads, Maintainers |

### C. Reference (Information-Oriented)

| Document | Primary Focus & Target Outcome | Audience |
| :--- | :--- | :--- |
| [reference/github-apps-catalog-and-credentials.md](./reference/github-apps-catalog-and-credentials.md) | Master catalog of the organization's three sovereign GitHub Apps (`org-manager`, `ci-bot`, `developer-tools`), App IDs, Client IDs, Installation IDs, and environment variable schema matrix. | All Engineers & Operators |
| [reference/permissions-required-for-github-apps.md](./reference/permissions-required-for-github-apps.md) | Master reference mapping GitHub App permissions to underlying REST and GraphQL API endpoints, rate limits, and security scope definitions. | Security Engineers, App Owners |
| [reference/actions-workflows-and-ci-governance.md](./reference/actions-workflows-and-ci-governance.md) | Specification of organization Starter Workflows (`workflow-templates/`), Reusable Workflows (`workflow_call`), billing rules, and concurrency cancellation. | CI/CD Maintainers, DevOps |
| [reference/github-packages-and-token-boundary-governance.md](./reference/github-packages-and-token-boundary-governance.md) | Subsystem token boundaries across the 3-Tier GitHub Apps and `secrets.GITHUB_TOKEN`, Separation of Duties (`github.actor` attribution), GitHub Packages public visibility governance, and dynamic Git-history obsolete package reconciliation. | Platform Architects, CI/CD & SecOps |
| [reference/default-community-health-and-templates.md](./reference/default-community-health-and-templates.md) | Exhaustive inventory of fallback Community Health files (`SECURITY.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`), Issue Forms, and PR templates. | Open Source Maintainers |

### D. Explanation (Understanding-Oriented)

| Document | Primary Focus & Target Outcome | Audience |
| :--- | :--- | :--- |
| [explanation/github-app-identity-architecture.md](./explanation/github-app-identity-architecture.md) | Deep architectural explanation of the Three-Tier Identity Topology, why we eliminate static PATs, cascading workflow automation, and Base64 vs Kubernetes file mount security analysis. | Enterprise Architects, SecOps |
| [explanation/github-vs-github-private-architecture.md](./explanation/github-vs-github-private-architecture.md) | Architectural comparison between public `.github` and private `.github-private`, dual-view organization profile rendering (`Public` vs `Member`), and resolution topology. | Organization Owners |
| [explanation/org-ecosystem-architecture-and-portfolio-governance.md](./explanation/org-ecosystem-architecture-and-portfolio-governance.md) | Dual meta-repository architecture separating Enterprise Foundation (`org-core`) from Portfolio Solutions (`org-ecosystem`), namespace layout, and Mani tag orchestration. | Engineering Leadership |
| [explanation/ai-agents-and-enterprise-governance.md](./explanation/ai-agents-and-enterprise-governance.md) | Organization-wide and enterprise AI custom agents (`/agents/`), server-managed Copilot settings (`copilot/managed-settings.json`), and marketplace controls. | AI Engineers, Team Leads |

---

## 3. Canonical Upstream Sources

All architectural patterns and technical specifications in this library are aligned with official GitHub documentation:

- [Customizing your organization's profile](https://docs.github.com/en/organizations/collaborating-with-groups-in-organizations/customizing-your-organizations-profile)
- [Creating a default community health file](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/creating-a-default-community-health-file)
- [Creating workflow templates for your organization](https://docs.github.com/en/actions/how-tos/reuse-automations/create-workflow-templates)
- [Reusing workflow configurations](https://docs.github.com/en/actions/reference/workflows-and-actions/reusing-workflow-configurations)
- [Creating GitHub Apps](https://docs.github.com/en/apps/creating-github-apps/about-creating-github-apps/about-creating-github-apps)
- [Authenticating with GitHub Apps](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/about-authentication-with-a-github-app)
- [Managing GitHub App Managers](https://docs.github.com/en/apps/managing-github-apps/modifying-a-github-app/managing-access-to-your-github-app)
- [Using the OAuth 2.0 Device Flow](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps#device-flow)

---

## 4. Navigation

- [Organization Governance Root (`.github/README.md`)](../README.md)
- [Organization Agent Context (`.github/AGENTS.md`)](../AGENTS.md)
- [Enterprise Meta-Repository Root (`org-core/README.md`)](../../README.md)
