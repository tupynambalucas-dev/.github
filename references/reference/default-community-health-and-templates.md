# Default Community Health Files, Intake Templates & Inheritance Mechanics

This document specifies how GitHub resolves, inherits, and overrides default community health files and contributor intake templates hosted in an organization's `<org>/.github` repository.

---

## 1. Platform Prerequisites

1. **Repository Name**: Must be named `.github` at the root of the organization (or personal account).
2. **Public Visibility Mandate**: The `<org>/.github` repository **MUST** be **Public**. Private or internal `.github` repositories cannot serve default community health files.
3. **Default Branch Requirement**: All community health files and issue/PR/discussion templates must exist on the `.github` repository's **default branch** (`main`). Files committed only on feature branches remain inactive.
4. **Universal Downstream Coverage**: Once active in a public `<org>/.github` repository, defaults apply to **all** repositories owned by the organization—**both public and private**—whenever a target repository lacks its own corresponding file.

---

## 2. Complete Catalog of Supported Default Files

GitHub supports automatic organization-wide inheritance exclusively for the file types listed below:

| File / Asset Category | Allowed Storage Paths in `<org>/.github` | Platform UI Behavior in Downstream Repositories |
| :--- | :--- | :--- |
| **`ACCESSIBILITY.md`** | `.github/`, `/`, or `docs/` | Linked in repository navigation/community standards describing accessibility conformance and barrier reporting. |
| **`CODE_OF_CONDUCT.md`** | `.github/`, `/`, or `docs/` | Displayed in the repository "Code of conduct" tab and linked during contributor interactions. |
| **`CONTRIBUTING.md`** | `.github/`, `/`, or `docs/` | Linked automatically in banners whenever a user opens a new Issue or Pull Request. |
| **`SECURITY.md`** | `.github/`, `/`, or `docs/` | Rendered in the repository **Security > Policy** tab with vulnerability reporting instructions. |
| **`SUPPORT.md`** | `.github/`, `/`, or `docs/` | Linked when contributors open new issues to redirect support questions away from bug trackers. |
| **`FUNDING.yml`** | Strictly `.github/FUNDING.yml` | Renders the **Sponsor** button on repositories where sponsorship display is enabled. |
| **`VULNERABILITY_REPORT.yml` / `.yaml`** | Strictly `.github/VULNERABILITY_REPORT.yml` (or `.yaml`) | Customizes structured intake fields when researchers submit private advisories via GitHub Private Vulnerability Reporting. |
| **Issue Templates & Issue Forms** | Strictly `.github/ISSUE_TEMPLATE/*.md`, `*.yml`, and `config.yml` | Populates the "New Issue" template chooser across repositories lacking a local `.github/ISSUE_TEMPLATE` directory. |
| **Pull Request Templates** | `.github/`, `/`, or `docs/` (`PULL_REQUEST_TEMPLATE.md` / `.txt` or `PULL_REQUEST_TEMPLATE/*.md`) | Pre-populates the Pull Request description body when opening a PR. |
| **Discussion Category Forms** | Strictly `.github/DISCUSSION_TEMPLATE/<category-slug>.yml` | Renders structured YAML web forms when opening discussions in matching category slugs (excludes Polls). |

---

## 3. Precedence & Override Resolution Algorithm

When evaluating whether to display a community health file for a target repository `<org>/<repo>`, GitHub executes a two-stage lookup:

### Stage 1: Local Repository Lookup (Highest Priority)

For files supporting multiple directories (`ACCESSIBILITY.md`, `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`, `SECURITY.md`, `SUPPORT.md`, `PULL_REQUEST_TEMPLATE.md`), GitHub checks `<org>/<repo>` in exact order:

1. `<org>/<repo>/.github/<FILE>`
2. `<org>/<repo>/<FILE>` (repository root)
3. `<org>/<repo>/docs/<FILE>`

If found in any of these three locations, the local file wins and `<org>/.github` is bypassed for that specific file type.

### Stage 2: Organization `.github` Fallback

If Stage 1 finds no local file for that type, GitHub queries `<org>/.github` using the exact same directory precedence:

1. `<org>/.github/.github/<FILE>`
2. `<org>/.github/<FILE>` (repository root)
3. `<org>/.github/docs/<FILE>`

> [!IMPORTANT]
> **All-or-Nothing Directory Override for `ISSUE_TEMPLATE`:**
> Per-file merging does **not** occur inside `.github/ISSUE_TEMPLATE/`. If a downstream repository defines **any** valid issue template or `config.yml` inside its own `.github/ISSUE_TEMPLATE/` folder, **none** of the default templates or `config.yml` links from `<org>/.github/.github/ISSUE_TEMPLATE/` are inherited by that repository.

---

## 4. Template Authoring Nuances

### A. YAML Issue Forms vs. Markdown Issue Templates

- **YAML Issue Forms (`.github/ISSUE_TEMPLATE/<name>.yml`)**: Use GitHub's Form Schema (`body` array with `markdown`, `textarea`, `input`, `dropdown`, `checkboxes` elements and `validations.required: true`) to enforce deterministic, machine-parseable bug reports and feature proposals. Must include top-level `name:` and `description:` keys.
- **Markdown Templates (`.github/ISSUE_TEMPLATE/<name>.md`)**: Free-form templates requiring YAML frontmatter with `name:` and `about:` keys.
- **Template Chooser (`config.yml`)**: Placed at `.github/ISSUE_TEMPLATE/config.yml`, supports `blank_issues_enabled: false` and `contact_links` redirecting users to external portals (e.g., `https://docs.tupynambalucas.dev` or security advisories).
- **Label Caveat**: If an issue template in `<org>/.github` specifies automatic `labels:`, those exact label names **must exist** in each downstream repository where the issue is opened, otherwise label assignment is skipped.

### B. Git Tree & Clone Isolation

Inherited files from `<org>/.github` are resolved virtually by GitHub's web and API presentation layers:

- They **do not** appear in the downstream repository's file tree, Git commit log, `git clone` working directory, release archives (`.tar.gz` / `.zip`), or published registry packages.

---

## 5. Critical Non-Inherited Files (Common Misconceptions)

A frequent architectural mistake is placing operational or legal manifests in `<org>/.github` expecting automatic inheritance across child repositories. GitHub **does NOT inherit** the following files from `<org>/.github`:

| File | Inherited via `.github`? | Official Reason & Enterprise Alternative |
| :--- | :--- | :--- |
| **`LICENSE` / `LICENSE.md`** | **No** | Explicitly excluded by GitHub so cloned source trees, release tarballs, and packages legally carry their own license file on disk. Each repository must commit its own `LICENSE`. (The `LICENSE` in `<org>/.github` licenses only the `.github` repository itself.) |
| **`CODEOWNERS`** | **No** | Code ownership paths and team review gates are repository-tree specific. Must be committed per repository (`.github/CODEOWNERS`) and enforced via **Organization Repository Rulesets** ("Require review from Code Owners"). |
| **`dependabot.yml`** | **No** | Ecosystem directories (`directory: "/"`) vary per repository. Manage fleet-wide Dependabot alerts/security updates via **Organization Settings > Code security > Global settings**, or use centralized Renovate presets (`extends: ["github>tupynambalucas-dev/.github//renovate-preset"]`). |
| **Active `.github/workflows/*.yml`** | **No** | Workflows inside `<org>/.github/.github/workflows/` trigger **only** on events occurring inside `<org>/.github` itself. To enforce organization-wide CI checks, configure **Organization Rulesets > Require workflows to pass before merging** or invoke **Reusable Workflows (`workflow_call`)**. |
| **`.gitignore` / `.editorconfig` / `.prettierrc`** | **No** | Git and local CLI tools only read files physically present in the cloned workspace or parent meta-repository (`org-core`). Share configs via npm packages (`@tupynambalucas-dev/shared-config`). |

---

## 6. Canonical Sources

- [Creating a default community health file - GitHub Docs](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/creating-a-default-community-health-file)
- [About issue and pull request templates - GitHub Docs](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/about-issue-and-pull-request-templates)
- [Creating discussion category forms - GitHub Docs](https://docs.github.com/en/discussions/managing-discussions-for-your-community/creating-discussion-category-forms)
- [About community profiles for public repositories - GitHub Docs](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/about-community-profiles-for-public-repositories)
- [Parent Reference Index](./README.md)
