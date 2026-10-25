# Meta-Repository Architecture and Multi-Repo Orchestration Plan

Master architectural plan and operational framework for the `tupynambalucas-dev` umbrella
meta-repository (`org-core`), workstation multi-tenant namespace isolation, Git submodule
governance, and developer onboarding.

## Decisions

- **Umbrella Meta-Repository (`org-core`)**: Central orchestrator managing child repositories via
  native Git Submodules (`.github`, `agent-toolkit`, `platform`, `docs`). Zero business code is
  stored at the root; only orchestration configurations and master agent context files exist here.
- **Physical Namespace Segregation (`projects/`)**: Clear two-tier filesystem boundary separating
  `personal/` (`github.com/tupynambalucas/*`) and `organizations/` (`github.com/tupynambalucas-dev/*`
  and future third-party client contracts).
- **Automated Identity Switching (`includeIf:gitdir`)**: Path-based dynamic Git configuration in
  `~/.gitconfig` delegating commit author names, emails, and SSH signing keys without manual switching.
- **Cryptographic Commit Signing**: Mandatory SSH keypair Ed25519 commit signing (`commit.gpgsign = true`)
  across all organizational repositories, verified by GitHub branch rulesets.
- **Submodule Pointer Pinning**: Gitlinks recorded as deterministic `160000 commit` pointers.
  Autonomous child-to-parent synchronization via GitHub Actions `repository_dispatch` and the
  `@tupynambalucas-org-manager[bot]` GitHub App.
- **Zero-Disk Secret Management**: Infisical CLI with volatile RAM injection (`infisical run -- ...`)
  eliminating persistent plaintext `.env` credential files on disk.
- **Worktree Coexistence (`git worktree`)**: Recommended for concurrent branch development inside child
  repositories, while `git subtree` is rejected due to commit graph bloating and history pollution.

## Execution Status & Topology

The `tupynambalucas-dev` organizational architecture operates under a 4-tier federated hybrid model:

```mermaid
flowchart TD
  subgraph Level4 ["Level 4: Multi-Tenant Workstation Namespace"]
    Projects["projects/"]
    Personal["personal/ (Personal Profile, Labs, Personal Forks)"]
    Orgs["organizations/ (Enterprise & Client Contracts)"]
    Projects --> Personal
    Projects --> Orgs
  end

  subgraph Level3 ["Level 3: Umbrella Meta-Repository"]
    CoreUmbrella["tupynambalucas-dev/org-core (Zero Business Code - Pure Orchestration)"]
    Orgs --> CoreUmbrella
  end

  subgraph Level2 ["Level 2: Sovereign Specialized Submodules"]
    GovRepo[".github/ (Org Governance, Central CI/CD, Agent Rules)"]
    ToolkitRepo["agent-toolkit/ (AI Governance, MCPs, Shared Skills)"]
    PlatformRepo["platform/ (Domain Monorepo K8s & Infra Services)"]
    DocsRepo["docs/ (Sovereign Docusaurus v3 Documentation Portal)"]
    CoreUmbrella -. "Git Submodule" .-> GovRepo
    CoreUmbrella -. "Git Submodule" .-> ToolkitRepo
    CoreUmbrella -. "Git Submodule" .-> PlatformRepo
    CoreUmbrella -. "Git Submodule" .-> DocsRepo
  end

  subgraph Level1 ["Level 1: Autonomous Satellite Products & Clients"]
    TesselProd["tessel/ (Web Game Engine TS/Wasm)"]
    OmniProd["omni-channel/ (WhatsApp API Service)"]
    ClientWork["[clients]/ (Third-Party Client Projects under NDA)"]
    Orgs --> TesselProd
    Orgs --> OmniProd
    Orgs --> ClientWork
  end
```

## Documents

1. [Meta-Repository Architecture](./meta-repository-architecture.md): Complete architectural
   specification for the workstation multi-tenant namespace layout (`projects/personal` vs
   `projects/organizations`), the umbrella meta-repository pattern (`org-core`), Antigravity AI
   context window sandboxing, and dynamic Git identity switching via `includeIf:gitdir`.
2. [Git Submodules & Multi-Repo Orchestration](./git-submodules-and-multi-repo-orchestration-plan.md):
   In-depth engineering analysis of Git Submodules mechanics, `gitlink` pointers, evaluation against
   `git worktree` and `git subtree`, operational hazards (Detached HEAD, pointer drift, out-of-order
   pushes, empty directories, and Hazard 5: Standalone Developer Workflow), and automated GitHub
   Actions dispatch mitigation runbooks.
3. [Developer Workstation & GitHub Onboarding](./developer-workstation-and-github-onboarding-plan.md):
   Automated workstation bootstrapping (`bootstrap-workstation.ps1` / `.sh`), pre-flight readiness gate
   evaluation (7 compliance gates GV1-GV7), team-by-team capability matrix, Ed25519 SSH commit signing,
   GitHub CLI (`gh`) standard setup, and local pre-push hook enforcement.
4. [GitHub Organization Security & Rulesets](./github-organization-security-and-rulesets-plan.md):
   Centralized security baseline, secret scanning push protection, branch protection rulesets on
   `main` and `develop` (mandatory commit signing, linear history, review threads), CODEOWNERS submodule
   governance, and automated REST provisioning runbooks.
