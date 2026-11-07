# Organization Starter Workflows, Reusable Workflows & CI/CD Governance

This document details how `<org>/.github` and `<org>/.github-private` centralize GitHub Actions workflow templates, reusable CI/CD pipelines, and composite actions across an organization.

---

## 1. Organization Starter Workflows (`workflow-templates/`)

Starter workflows (workflow templates) appear natively in the **Actions > New workflow** gallery of every eligible repository in the organization under a dedicated **"By `<Organization Name>`"** section, accelerating standardized pipeline bootstrapping.

### A. Required Directory Layout

Starter workflows are discovered **exclusively** from the `workflow-templates/` directory at the root of `<org>/.github` (they are not loaded from `.github-private`):

```text
.github/
└── workflow-templates/
    ├── node-monorepo-ci.yml
    ├── node-monorepo-ci.properties.json
    └── tupynambalucas-mark.svg
```

### B. Visibility & Downstream Availability Matrix

| `<org>/.github` Visibility | Eligible Target Repositories | Additional Access Requirement |
| :--- | :--- | :--- |
| **`Public`** | All repositories (`public`, `internal`, and `private`). | None (preserves Community Health and Public Profile compatibility). |
| **`Internal`** | `internal` and `private` repositories only. | Users/teams must hold **Read** access to `<org>/.github`. *(Breaks public profile & community health!)* |
| **`Private`** | `private` repositories only. | Users/teams must hold **Read** access to `<org>/.github`. *(Breaks public profile & community health!)* |

### C. Template YAML & `$default-branch` Placeholder

Inside `workflow-templates/<slug>.yml`, use the special `$default-branch` token wherever the target repository's primary branch should be substituted automatically upon instantiation:

```yaml
name: Enterprise TypeScript CI

on:
  push:
    branches: [$default-branch]
  pull_request:
    branches: [$default-branch]

permissions:
  contents: read

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v6
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm turbo run typecheck lint test
```

### D. Metadata Schema (`.properties.json`)

Every `<slug>.yml` file in `workflow-templates/` **MUST** have a sibling `<slug>.properties.json` file with identical basename:

```json
{
  "name": "tupynambalucas-dev TypeScript Monorepo CI",
  "description": "Standard Turborepo, pnpm catalog, strict TypeScript, and ESLint verification pipeline.",
  "iconName": "tupynambalucas-mark",
  "categories": [
    "Continuous integration",
    "TypeScript"
  ],
  "filePatterns": [
    "^pnpm-workspace\\.yaml$",
    "^turbo\\.json$",
    "^package\\.json$"
  ]
}
```

| Property | Required | Specification |
| :--- | :--- | :--- |
| `name` | Yes | Display title rendered on the starter workflow card in the Actions UI. |
| `description` | Yes | Summary text displayed beneath the card title. |
| `iconName` | No | Either the basename (without `.svg`) of an SVG stored inside `workflow-templates/`, or a GitHub Octicon prefixed with `octicon ` (e.g., `"octicon shield-check"`). |
| `categories` | No | Array of general categories (from `actions/starter-workflows`), Linguist language names (`TypeScript`, `Go`, `Python`), or supported tech stacks. |
| `filePatterns` | No | Array of regular expressions evaluated against files in the **root directory** of the target repository to recommend matching templates automatically. |

---

## 2. Reusable Workflows (`on: workflow_call`)

While starter workflows copy boilerplate YAML into new repositories once, **Reusable Workflows** centralize execution logic so downstream repositories invoke a single canonical pipeline (`uses: tupynambalucas-dev/.github/.github/workflows/reusable-release.yml@main` or pinned commit SHA).

### A. Hosting Strategy: `.github` vs. Private Automation Repo

1. **Public `<org>/.github` Hosting**:
   - Accessible by **both public and private** caller repositories across the organization with zero extra token configuration.
   - Ideal for non-sensitive CI steps (Commitlint, Conventional Commits verification, Prettier/ESLint checks, Changesets release orchestration, Docusaurus MDX builds).
2. **Private Repository Hosting (`<org>/.github-private` or `<org>/ci-workflows`)**:
   - Accessible **only by `private` (and `internal`)** caller repositories; **public caller repositories cannot invoke reusable workflows stored in private repositories**.
   - Must be explicitly enabled in the host repository via **Settings > Actions > General > Access > Accessible from repositories in the `<org>` organization**.

> [!WARNING]
> **Outside Collaborator Log Exposure in Shared Private Workflows:**
> When a private repository shares actions or reusable workflows with the organization, GitHub injects a temporary 1-hour read-scoped installation token on the runner. Outside collaborators with access to a downstream caller repository can view workflow execution logs produced by the private reusable workflow even without direct read access to the private workflow repository.

### B. Supported Caller Job Keywords

A job calling a reusable workflow (`jobs.<job_id>.uses`) cannot define `steps` or `runs-on`; it supports exclusively:

- `name`, `uses`, `with` (`with.<input_id>`), `secrets` (`secrets.<secret_id>` or `secrets: inherit`)
- `strategy`, `needs`, `if`, `concurrency`, `permissions`, `cache-mode`

### C. Platform Limits & Execution Semantics

| Dimension | Official GitHub Platform Rule |
| :--- | :--- |
| **Maximum Nesting Depth** | Up to **10 levels** of nested reusable workflows (`A -> B -> C ...`). |
| **Maximum Workflow Fan-Out** | Up to **50 unique reusable workflows** invoked across the entire call tree of a single run. |
| **Environment Variable Isolation** | Caller workflow-level `env:` variables do **not** propagate to the called workflow, nor do called `env:` variables leak back. Pass data explicitly via `inputs`, job `outputs`, or organization `vars` context. |
| **`GITHUB_TOKEN` Monotonicity** | Token permissions passed down a call chain can **only stay equal or be downgraded**—never elevated. If caller `A` grants `packages: read`, nested workflow `B` cannot request `packages: write`. |
| **Concurrency Group Trap** | Inside a called workflow, `${{ github.workflow }}` evaluates to the **caller's** workflow name. Never set identical `concurrency.group` expressions with `cancel-in-progress: true` in both caller and callee, or starting the callee cancels the caller. |
| **Runner Assignment & Billing** | GitHub-hosted runner selection and billing are **always** evaluated against the **caller repository's** context. |
| **No Rename Redirects** | For security against namespace hijacking, GitHub Actions **does not follow redirects** if a workflow's repository or owner is renamed; callers break immediately until updated. |
| **Re-Run Pinning Semantics** | Re-running *failed jobs* reuses the exact commit SHA from the initial run; re-running *all jobs* resolves the branch/tag reference anew unless pinned to a 40-character SHA. |

---

## 3. Mandatory Organization Workflows via Rulesets

Because workflows inside `<org>/.github/.github/workflows/` do not auto-trigger on other repositories, organization-wide mandatory compliance gates (e.g., secret hygiene, license compliance, commitlint, SBOM generation) should be enforced via **Organization Repository Rulesets**:

1. Author the compliance workflow inside `<org>/.github/.github/workflows/<gate>.yml` (triggered on `pull_request`).
2. Navigate to **Organization Settings > Repository > Rulesets**.
3. Create an organization-level branch ruleset targeting `~DEFAULT_BRANCH` across `All repositories` (or filtered by naming pattern).
4. Enable **Require workflows to pass before merging** and select the workflow hosted in `<org>/.github`. GitHub automatically executes that workflow against every pull request across targeted repositories without requiring any YAML file inside the downstream repositories.

---

## 4. Canonical Sources

- [Creating workflow templates for your organization - GitHub Docs](https://docs.github.com/en/actions/how-tos/reuse-automations/create-workflow-templates)
- [Reusing workflow configurations - GitHub Docs](https://docs.github.com/en/actions/reference/workflows-and-actions/reusing-workflow-configurations)
- [Sharing actions and workflows with your organization - GitHub Docs](https://docs.github.com/en/actions/how-tos/reuse-automations/share-with-your-organization)
- [Sharing actions and workflows from your private repository - GitHub Docs](https://docs.github.com/en/actions/how-tos/reuse-automations/share-across-private-repositories)
- [Parent Reference Index](./README.md)
