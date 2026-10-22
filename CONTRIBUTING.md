# Contributing to Tupynambá Lucas Projects

Thank you for your interest in contributing to Tupynambá Lucas repositories. We maintain rigorous
engineering standards across our monorepo and auxiliary packages to guarantee security, stability,
and deterministic delivery.

---

## Code of Conduct

All contributors and maintainers are expected to abide by our
[Code of Conduct](./CODE_OF_CONDUCT.md). Please read it prior to engaging with our community.

---

## Development Workflow and Git Standards

### 1. Branch Safety and Naming Conventions

Direct commits to protected branches (`main`, `develop`) are strictly prohibited by
repository rulesets. All changes must be authored on isolated branches adhering to the
following naming pattern:

- `feat/<feature-name>`: New capabilities or functional additions.
- `fix/<issue-name>`: Bug fixes and defect resolutions.
- `chore/<task-name>`: Maintenance, dependency updates, and configuration tasks.
- `refactor/<scope-name>`: Code restructuring without feature alteration.
- `docs/<subject-name>`: Documentation, guides, and architectural plans.

### 2. Mandatory SSH Commit Signing

Every commit submitted to an organization repository MUST be cryptographically signed using SSH
or GPG keys. Unsigned commits will fail pre-receive and branch ruleset gates.

Configure Git to sign commits via SSH:

```bash
git config --global gpg.format ssh
git config --global user.signingkey ~/.ssh/id_ed25519.pub
git config --global commit.gpgsign true
```

### 3. Conventional Commits Specification

Commit messages must comply with the Conventional Commits specification:

```text
<type>(<optional scope>): <description>

[optional body]

[optional footer(s)]
```

- Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`,
  `ci`, `chore`, `revert`.
- Description must start in lowercase and not end with a period.
- Maximum line length for headers is 100 characters.

### 4. Code Quality and Testing Gates

Before opening a pull request, ensure your local changes pass all automated validation gates:

- **Type Checking**: TypeScript strict mode validation with zero errors.
- **Linting & Formatting**: Clean passes under Biome/ESLint and Prettier.
- **Unit Tests**: Full test suite execution with passing assertions.
- **Zero Emojis**: Documentation, commit messages, and PR titles must not contain emojis.

---

## Pull Request Process

1. Fork or branch from the canonical repository.
2. Verify that local unit tests, linting, and formatting checks pass.
3. Push your branch and open a Pull Request targeting `develop` (for application code) or `main`
   (for configuration repositories).
4. Provide a clear summary of changes, motivation, and test verification evidence.
5. All pull requests require at least one approving review and green CI checks before merging.
6. Merges enforce linear history via Squash and Merge or Rebase and Merge.
