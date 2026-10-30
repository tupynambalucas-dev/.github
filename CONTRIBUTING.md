# Contributing to Tupynamba Lucas Projects

Thank you for your interest in contributing to `@tupynambalucas-dev` repositories. We maintain strict engineering standards across our umbrella meta-repository, domain monorepos, and published packages to guarantee cryptographic provenance, security, and deterministic delivery.

---

## Code of Conduct and Licensing

- **Code of Conduct**: All contributors and maintainers are bound by our [Code of Conduct](./CODE_OF_CONDUCT.md) (Contributor Covenant v2.1).
- **Contribution Licensing**: Unless explicitly stated otherwise by a repository-specific license, all public `@tupynambalucas-dev` repositories, packages, and plugins are licensed under the [Apache License 2.0](./LICENSE) (`Copyright (c) 2026 tupynambalucas.dev`). Per Section 5 of Apache-2.0, any contribution intentionally submitted for inclusion is licensed under the same terms without additional conditions.

---

## Prerequisites

- **Git**: `>= 2.36` configured with `ed25519` SSH commit and tag signing.
- **Node.js**: `>= 22.x` LTS.
- **pnpm**: `>= 10.x` (managed via Corepack).
- **Mani**: Multi-repository orchestrator (`scoop install mani` or binary in PATH).
- **Infisical CLI**: Required for zero-plaintext runtime secret injection (`dev` environment).
- **Docker & k3d / Skaffold v4**: Required only when working on Kubernetes cluster workloads in `tupynambalucas-dev/platform`.

---

## Development Workflow and Git Standards

### 1. Single-Branch GitHub Flow & Branch Naming Taxonomy

All repositories across `tupynambalucas-dev` enforce **Single-Branch GitHub Flow** anchored on `main` (long-lived `develop` branches and `git-flow` CLI workflows are deprecated). Direct human pushes to `main` are blocked by repository rulesets.

Create short-lived branches off `main` using `<type>/<kebab-slug>` matching our Conventional Commit types:

- `feat/<slug>`: New capabilities, endpoints, packages, or user-facing features.
- `fix/<slug>`: Bug fixes and defect resolutions.
- `docs/<slug>`: Documentation updates, Diataxis articles, and architectural specifications.
- `chore/<slug>`: Maintenance, dependency bumps, workspace tasks, and manifest updates.
- `refactor/<slug>`: Internal code restructuring without external behavioral changes.
- `ci/<slug>`: GitHub Actions workflows, composite actions, and pipeline automation.
- `perf/<slug>`: Measurable runtime or build performance optimizations.
- `test/<slug>`: Unit, integration, or end-to-end test additions and corrections.
- `build/<slug>`: Bundler, TypeScript, Turborepo, or container build configuration changes.
- `style/<slug>`: Formatting or whitespace adjustments with zero semantic impact.
- `revert/<slug>`: Controlled rollback of a previously merged commit.
- `hotfix/<slug>`: Urgent production defect or security remediation targeting `main`.

### 2. Mandatory Cryptographic SSH Commit Signing

Every Git commit and annotated tag submitted to an organization repository MUST carry a verified cryptographic signature:

- **Developers & Local AI Agents**: Sign using an `ed25519` SSH key (`git commit -S -m "..."`, `git tag -s vX.Y.Z -m "..."`).
- **CI / Automated Workflows**: Create commits exclusively via a GitHub App installation token invoking GitHub's GraphQL `createCommitOnBranch` mutation (automatically GPG-signed by GitHub `web-flow`). Unsigned CLI commits are rejected by `required_signatures` rulesets.

```bash
git config --global gpg.format ssh
git config --global user.signingkey ~/.ssh/id_ed25519.pub
git config --global commit.gpgsign true
git config --global tag.gpgSign true
```

### 3. Conventional Commits v1.0.0

Commit messages and Pull Request titles MUST conform strictly to the [Conventional Commits v1.0.0](https://www.conventionalcommits.org/en/v1.0.0/) specification and `@commitlint/config-conventional`:

```text
<type>[optional (<scope>)][!]: <description>

[optional body]

[optional footer(s)]
```

- **Permitted types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
- **Subject formatting**: Start `<description>` in lowercase, use imperative mood (`add`, `fix`, `align`, not `added` or `fixes`), and omit trailing periods.
- **Header length**: Aim for `<= 72` characters for optimal Git log readability; headers MUST NOT exceed `100` characters (enforced by `@commitlint/config-conventional`).
- **Breaking changes**: Append `!` before `:` (e.g., `feat(api)!: remove legacy v1 transport`) and/or include a `BREAKING CHANGE: <explanation>` footer.

### 4. Versioning and Package Releases (Changesets)

- **Published Package Monorepos (`tupynambalucas-dev/agent-mesh`)**: Pull Requests introducing user-facing or API changes to `@tupynambalucas-dev/mcp-*` or `@tupynambalucas-dev/plugin-*` packages MUST include a changeset file generated via `pnpm changeset` (`baseBranch: "main"`).
- **Application, Infrastructure & Portal Repositories (`platform`, `docs`, `.github`, `org-core`)**: Deploy continuously from `main` without synthetic Changesets files.

### 5. Multi-Repository Orchestration (`org-core`)

The umbrella meta-repository [`tupynambalucas-dev/org-core`](https://github.com/tupynambalucas-dev/org-core) coordinates sovereign repositories (`.github`, `agent-mesh`, `platform`, `docs`) via [Mani](https://manicli.com) and multi-root IDE workspaces:

1. Each repository is a 100% autonomous Git repository with its own native `.git` directory, branches, and remotes. Git submodules and fragile `160000` commit gitlinks have been eliminated.
2. Developers create feature branches (`feat/<slug>`, `fix/<slug>`) directly inside each target repository, commit with SSH signatures, and open Pull Requests against `main`.
3. Daily multi-repository operations (status checks, pulling, fetching) are executed seamlessly using `mani run status`, `mani run pull`, or `mani run fetch`.

### 6. Quality and Compliance Gates

Before opening a Pull Request, verify that all local checks pass:

- **Type Checking**: Strict TypeScript project-reference validation (`pnpm typecheck`) with zero errors.
- **Linting & Formatting**: Clean passes under ESLint and Prettier (2-space indentation, 100-character line width, LF line endings).
- **Automated Tests**: Full unit and integration test suite execution (`pnpm test`) where applicable.
- **Secret Hygiene**: Zero plaintext credentials, tokens, private keys, or `.env` files staged in Git.
- **Zero-Emoji Invariant**: Zero emojis across code comments, documentation, commit messages, PR titles, and PR descriptions.

---

## Pull Request Process

1. Create a branch off `main` using an approved `<type>/<slug>` prefix.
2. Author atomic, SSH-signed Conventional Commits (`git commit -S`) and verify local quality gates.
3. Push your branch (`git push -u origin <branch>`) and open a Pull Request targeting `main` following the organization Pull Request template.
4. Resolve all review threads and ensure required status checks pass.
5. Merge using linear history enforcement (**Squash and Merge** or **Rebase and Merge**; merge commits are disabled by the `enterprise-production-main` ruleset).
