# Master Plan: Git Submodules, Umbrella Meta-Repository Architecture, and Worktree/Subtree Evaluation

This document establishes the official architectural reference and operational runbook for Git
Submodule orchestration in the `tupynambalucas-dev/org-core` meta-repository. It details how
submodules function across our ecosystem, evaluates advantages and operational hazards, and provides
an exhaustive technical assessment of **Git Worktrees (`git worktree`)** and **Git Subtrees
(`git subtree`)** within our multi-repo governance model.

---

## 1. Executive Summary & Architectural Topology

`org-core` functions as an **Umbrella Meta-Repository (Layer 1 Governance Root)**. Rather than
amalgamating all code into an unwieldy monolithic repository, `org-core` uses Git Submodules to
bind four sovereign repositories into a single, cohesive, version-controlled developer workspace:

```mermaid
graph TD
  OrgCore["org-core (Umbrella Meta-Repository)<br/>Role: Architecture Orchestrator, Master Runbooks, Root AGENTS.md"]

  OrgCore -->|".gitmodules (branch: main)"| DotGithub[".github<br/>Role: Org Profile, Community Standards, Master Plans"]
  OrgCore -->|".gitmodules (branch: main)"| AgentToolkit["agent-toolkit<br/>Role: AI Agent Governance, Shared MCPs, Skills & Rules"]
  OrgCore -->|".gitmodules (branch: develop)"| PlatformMonorepo["platform<br/>Role: Monorepo Services, Apps, Kubernetes Manifests"]
  OrgCore -->|".gitmodules (branch: develop)"| DocsHub["docs<br/>Role: Sovereign Docusaurus v3 Documentation Portal"]
```

### 1.1 The Mechanics of a Submodule: Gitlink Pointers

Inside the Git object database of `org-core`, submodules do not store the physical source tree of
child repositories. Instead, they are recorded as special 160-bit SHA tree entries called
**gitlinks** (mode `160000`):

```text
160000 commit e631ba4a4da3c5cbe853917af091ae76d4375bf4    .github
160000 commit 7d2cf0ab9ac37041bb8fab3998434e42d9709673    agent-toolkit
160000 commit 8f975fec245e485c88a964e4d81283cf6683c6bf    docs
160000 commit 14683bdc6b962c95eed3e9bba2c12030d60ee0cb    platform
```

The matching [`.gitmodules`](file:///C:/Users/tupyn/projects/organizations/tupynambalucas-dev/org-core/.gitmodules) file maps the logical submodule name to its remote URL and tracking branch:

```ini
[submodule ".github"]
	path = .github
	url = git@github.com:tupynambalucas-dev/.github.git
	branch = main
[submodule "platform"]
	path = platform
	url = git@github.com:tupynambalucas-dev/platform.git
	branch = develop
[submodule "docs"]
	path = docs
	url = git@github.com:tupynambalucas-dev/docs.git
	branch = develop
[submodule "agent-toolkit"]
	path = agent-toolkit
	url = git@github.com:tupynambalucas-dev/agent-toolkit.git
	branch = main
```

---

## 2. Strategic Advantages of the `org-core` Submodule Pattern

1. **Autonomous CI/CD Lifecycles & Zero Blast Radius**:
   - Each child repository runs its own focused CI/CD pipeline.
   - An MDX documentation edit in [`docs`](file:///C:/Users/tupyn/projects/organizations/tupynambalucas-dev/org-core/docs) deploys immediately to Cloudflare Pages in under 60 seconds without triggering continuous integration tests, container builds, or Kubernetes linting in [`platform`](file:///C:/Users/tupyn/projects/organizations/tupynambalucas-dev/org-core/platform).
2. **Granular RBAC and Secret Segregation**:
   - GitHub permissions are enforced at the repository boundary.
   - Members of `@technical-writers` hold `maintain` rights on `docs`, while retaining read-only (`pull`) rights on `platform`. In a traditional monorepo, restricting write access to specific subdirectories requires expensive third-party tools or complex CODEOWNERS rulesets that fail to protect Actions secrets.
3. **Selective Workstation Footprints**:
   - Engineers only clone what they need. A frontend developer working on Docusaurus can clone `docs` directly without downloading gigabytes of backend cluster Docker layers.
   - Architects and AI agents clone `org-core` with `--recursive` to obtain holistic, cross-system context.
4. **Deterministic Snapshot Reproducibility**:
   - Bumping submodule pointers in `org-core` creates an immutable cryptographic checkpoint.
   - Rolling back `org-core` to a previous commit restores the exact historical combination of platform code, documentation, and agent tooling that was active at that instant.

---

## 3. Operational Risks, Gotchas, and Hazard Mitigation

While architecturally sound, Git Submodules introduce friction if developers are unfamiliar with
their mechanics. Below are the 4 primary operational hazards and their standard mitigation protocols:

### Hazard 1: The Detached HEAD State Trap

- **The Problem**: When running `git submodule update`, Git checks out the exact commit SHA recorded
  in the superproject rather than tracking the tip of a branch. If a developer edits files and commits
  while in this state, their commits are created on a detached HEAD and will become unreachable
  (orphaned) once another update is triggered.
- **The Mitigation**:
  - Always verify branch status before authoring code inside a submodule:
    ```bash
    cd agent-toolkit
    git checkout main   # or develop for platform/docs
    ```
  - Alternatively, use the `--remote` and `--merge` flags when updating:
    ```bash
    git submodule update --remote --merge
    ```

### Hazard 2: Submodule Pointer Drift

- **The Problem**: An engineer commits and pushes changes within `platform`, but forgets to stage
  and commit the updated gitlink pointer in `org-core`.
  - The child repository has the new code, but the parent repository continues pointing to the older
    commit SHA.
- **The Mitigation**:
  - Enforce the **Pointer Bumping Runbook** in `org-core`:
    ```bash
    git -C platform commit -S -m "feat(api): add healthcheck endpoint"
    git -C platform push origin develop
    # Stage pointer update in superproject
    git add platform
    git commit -S -m "chore(submodules): bump platform to latest develop"
    git push origin main
    ```

### Hazard 3: The Out-of-Order Push Disaster

- **The Problem**: A developer commits a new submodule pointer in `org-core` and pushes `org-core`
  to GitHub **before** pushing the commit in the child submodule.
  - Anyone else pulling `org-core` will encounter a fatal error: `fatal: reference is not a tree`
    because the referenced commit does not exist on the remote child repository.
- **The Mitigation**:
  - Configure Git to automatically block out-of-order pushes:
    ```bash
    git config --global push.recurseSubmodules check
    ```
  - If unpushed submodule commits exist, Git aborts the push on `org-core` immediately.
  - Use `push.recurseSubmodules on-demand` to push submodule commits automatically prior to the parent.

### Hazard 4: Empty Directory on First Clone

- **The Problem**: Running `git clone git@github.com:tupynambalucas-dev/org-core.git` leaves all
  submodule directories (`platform`, `docs`, `agent-toolkit`, `.github`) completely empty.
- **The Mitigation**:
  - Always instruct developers to clone with the `--recursive` flag:
    ```bash
    git clone --recursive git@github.com:tupynambalucas-dev/org-core.git
    ```
  - If already cloned without `--recursive`, initialize them:
    ```bash
    git submodule update --init --recursive
    ```

---

## 4. Deep-Dive Evaluation: Git Worktree (`git worktree`)

### 4.1 What is a Git Worktree?

A Git Worktree allows multiple working directories (worktrees) to be attached to a **single local
repository `.git` database**:

```text
main-repository/              # Main worktree on branch 'main'
├── .git/                     # Authoritative object and ref database
└── src/
worktrees/
├── feature-auth/             # Linked worktree on branch 'feat/oauth'
│   └── .git (gitfile)        # Points to main-repository/.git/worktrees/feature-auth
└── emergency-fix/            # Linked worktree on branch 'hotfix/patch-1'
    └── .git (gitfile)        # Points to main-repository/.git/worktrees/emergency-fix
```

Instead of performing expensive `git stash` and `git checkout` sequences (which discard uncommitted
changes, trigger editor re-indexing, and invalidate language server caches), `git worktree add`
creates an independent folder checked out to a different branch instantly.

### 4.2 Git Worktrees in Multi-Agent AI Systems

In autonomous coding environments, **Git Worktrees are the foundational primitive for parallel agent
execution**:

1. **Parallel Execution Without File Lock Contention**: Two AI agents can work on the same repository
   simultaneously—one fixing a bug on `fix/test-race` while another implements a feature on `feat/ui`—without
   overwriting each other's files or colliding on `.git/index.lock`.
2. **Instantaneous Setup (Zero Network Transfer)**: Because all worktrees share the same local object
   database (`.git`), creating a new worktree takes under 100 milliseconds and consumes zero network
   bandwidth.

### 4.3 Should We Implement Git Worktrees in `org-core`?

#### The Verdict: YES, but strictly at the Child Submodule Level (NOT from the Umbrella Root).

- **Why Worktrees at the Root (`org-core`) are an Anti-Pattern**:
  - Running `git worktree add ../org-core-feature feat/branch` from the root of `org-core` creates
    a new parent directory, but the nested submodule pointers break unless every submodule is also
    independently re-initialized and synchronized in the linked worktree.
  - Submodule relative gitdir paths (`gitdir: ../.git/modules/platform`) fail or corrupt when
    relocated outside the primary umbrella hierarchy.
- **The Recommended Pattern (Child Worktrees)**:
  - When an engineer or AI agent needs to work on multiple branches in [`platform`](file:///C:/Users/tupyn/projects/organizations/tupynambalucas-dev/org-core/platform)
    or [`docs`](file:///C:/Users/tupyn/projects/organizations/tupynambalucas-dev/org-core/docs), create the worktree **inside that specific child repository**:
    ```bash
    cd platform
    # Create an isolated worktree for an agent task
    git worktree add ../../worktrees/platform-hotfix hotfix/cluster-cortex
    cd ../../worktrees/platform-hotfix
    # Work freely with 0 impact on the main platform directory
    ```
  - When the task completes, merge the branch, push to remote, and prune:
    ```bash
    cd ../../org-core/platform
    git worktree remove ../../worktrees/platform-hotfix
    ```

---

## 5. Deep-Dive Evaluation: Git Subtree (`git subtree`)

### 5.1 What is a Git Subtree?

`git subtree` is an alternative subproject management mechanism where an external repository's
entire directory tree and commit history are physically merged directly into a subdirectory of
the parent repository:

```mermaid
graph TD
  subgraph Submodule ["Git Submodule Architecture"]
    Parent1["Superproject (.git)"] -->|Pointer (SHA: 160000)| Gitlink["Pointers only (Zero source files in parent Git object store)"]
    Gitlink -.-> ExtRepo["Child Repository (Separate .git)"]
  end

  subgraph Subtree ["Git Subtree Architecture"]
    Parent2["Superproject (.git)"] --> Embedded["Embedded Source Files + Monolithic Commit Graph"]
    Embedded -->|Every external commit copied into parent| MergedHist["Merged History (Single giant Git object store)"]
  end
```

### 5.2 Submodule vs. Subtree vs. Worktree Comparison Matrix

| Dimension | Git Submodule (`git submodule`) | Git Subtree (`git subtree`) | Git Worktree (`git worktree`) |
| :--- | :--- | :--- | :--- |
| **Primary Concept** | **Pointer/Link**: Child repo linked by commit SHA. | **Physical Vendoring**: Child repo merged into parent commit graph. | **Parallel Checkout**: Multiple working folders sharing one `.git`. |
| **History Storage** | **Completely Decoupled**: Parent only stores 1 commit pointer. | **Tightly Coupled**: All upstream commits merged into parent history. | **Shared Object Store**: Single `.git` database. |
| **GitHub RBAC Granularity** | **Strictly Preserved**: Each repo retains independent permissions. | **Completely Lost**: Anyone with parent repo write access can modify files. | **Inherited**: Same permissions as underlying repository. |
| **Clone Complexity** | Requires `--recursive` or `submodule init`. | Normal `git clone` (zero submodule knowledge required). | N/A (local workstation workflow only). |
| **Upstream Sync Complexity** | Simple: `git checkout` & bump pointer. | Complex: `git subtree pull` and `git subtree push` (slow, merge conflicts). | N/A |
| **CI/CD Pipeline Impact** | Isolated per repo; zero noise. | High noise: Parent CI triggers on every vendored file change. | N/A |

### 5.3 Should We Implement Git Subtree in `org-core`?

#### The Verdict: NO. Git Subtrees are strongly rejected for `org-core`.

1. **Loss of Sovereign RBAC**: If we converted `platform`, `docs`, and `agent-toolkit` to subtrees,
   the entire enterprise becomes a single monolithic repository. A technical writer committing to
   Docusaurus would possess write access to Kubernetes manifests and cluster secrets in `platform`.
2. **Commit History Pollution**: Merging the histories of 4 repositories into `org-core` would inflate
   the repository size by hundreds of megabytes, slowing down Git operations across all developer machines.
3. **Friction with Conventional Commits and Signed Commits**: Extracting commits back upstream via
   `git subtree push --prefix=platform origin develop` rewrites commit hashes, breaking cryptographic
   SSH signatures (`-S`) and corrupting our strict Conventional Commits audit trails.
4. **The Only Valid Use Case for Subtree**: If a specific service inside `platform` ever needs to
   vendor a static, third-party, read-only open-source library without adding an external dependency
   manager, a localized `git subtree` inside `platform/vendor/` is acceptable. However, it must
   never replace submodules at the meta-repository governance layer.

---

## 6. Enterprise Developer Runbook for Submodules

### 6.1 Initial Setup (First-Time Clone)

```bash
git clone --recursive git@github.com:tupynambalucas-dev/org-core.git
cd org-core
```

### 6.2 Synchronizing and Updating All Submodules

To update all submodules to the latest development heads tracked in `.gitmodules`:

```bash
# Pulls latest updates on tracking branches and fast-forwards
git submodule update --remote --merge
```

### 6.3 Working Inside a Submodule

Always switch to a concrete branch before writing code:

```bash
cd agent-toolkit
git checkout main
# ... author changes ...
git add .
git commit -S -m "feat(plugin): add new governance hook"
git push origin main
```

### 6.4 Staging and Committing Submodule Pointer Bumps in `org-core`

Whenever a child repository advances, stage the updated pointer in `org-core`:

```bash
cd /path/to/org-core
# Verify pointer status
git status
# Output shows: modified: agent-toolkit (new commits)

# Stage and commit with SSH signature
git add agent-toolkit
git commit -S -m "chore(submodules): bump agent-toolkit to latest development head"
git push origin main
```

### 6.5 Safe Out-of-Order Push Configuration

Ensure your workstation never pushes an unpushed submodule commit pointer:

```bash
git config --global push.recurseSubmodules check
```
