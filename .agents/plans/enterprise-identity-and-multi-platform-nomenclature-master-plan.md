# Master Architectural Plan: Enterprise Identity, Sovereign Brand Demarcation, and Multi-Platform Nomenclature Architecture

## 1. Executive Summary & Master Governance Charter

As modern software engineering organizations evolve toward AI-driven platform engineering, sovereign distributed systems, and elastic contractor scaling, maintaining unambiguous boundaries between the **individual founder (Pessoa Física)** and the **corporate consulting firm (Pessoa Jurídica)** is paramount.

### 1.1 The Core Identity Invariant
1. **The Corporate Entity / Commercial Firm**: **`tupynambalucas.dev`**.
   - This is the sovereign legal and commercial trading name of the engineering studio.
   - It is **NOT** "Tupynambá Lucas" or "Tupynamba Lucas".
   - The `.dev` is an inseparable part of the company's brand identity, signaling tech-native authority and platform engineering excellence.
2. **The Individual Founder / Principal Architect**: **`Tupynambá Lucas`** (civil name: `Tupynambá Lucas Varela Rodrigues`).
   - Serves as Founder, Principal Systems Architect, and Fractional CTO.
   - Provides architectural oversight, cryptographic sign-off (`-S`), and technical leadership.
3. **The Personal Handle (Pessoa Física)**: **`tupynambalucas`** (Strictly NO `-dev`).
   - Used for the personal GitHub profile (`github.com/tupynambalucas`), personal Infisical organization (`tupynambalucas`), personal Cloudflare account (`tupynambalucas`), personal open-source experiments, dotfiles, and individual career reputation.
4. **The Corporate Technical Handle (Pessoa Jurídica)**: **`tupynambalucas-dev`** (WITH `-dev` suffix).
   - Used across technical platforms where the dot (`.`) is prohibited by validation schemas (GitHub Organization `github.com/tupynambalucas-dev`, NPM package scope `@tupynambalucas-dev`, Infisical organization slug `tupynambalucas-dev`).
5. **The Universal Demarcator Rule**:
   - **No suffix (`tupynambalucas`)** = Pessoa Física (Personal boundary, personal accounts, personal credentials).
   - **Suffix `-dev` / `.dev` (`tupynambalucas-dev` / `tupynambalucas.dev`)** = Pessoa Jurídica (Corporate studio, enterprise platform, contractor access).

### 1.2 Purpose of this Master Plan
This document establishes the **Single Source of Truth (SSOT)** for all branding, nomenclature, and infrastructure asset naming across the organization. It consolidates, formalizes, and harmonizes the guidelines previously defined in:
- [`personal-github-profile-strategy.md`](file:///C:/Users/tupyn/projects/organizations/tupynambalucas-dev/org-core/.github/.agents/plans/personal-github-profile-strategy.md)
- [`company-nomenclature-and-branding-strategy.md`](file:///C:/Users/tupyn/projects/organizations/tupynambalucas-dev/org-core/.github/.agents/plans/company-nomenclature-and-branding-strategy.md)
- [`infisical-secret-governance-and-multi-layer-fallback.md`](file:///C:/Users/tupyn/projects/organizations/tupynambalucas-dev/org-core/.github/.agents/plans/infisical-secret-governance-and-multi-layer-fallback.md)

---

## 2. The Dual-Entity Taxonomy: Physical Person vs. Enterprise Firm

To prevent operational ambiguity, client expectation mismatches, and compliance friction, every asset in the ecosystem maps strictly to one of two boundaries:

```mermaid
flowchart TD
  subgraph PhysicalPerson ["Pessoa Física / Personal Domain (tupynambalucas)"]
    direction TB
    PF_ID["Individual: Tupynambá Lucas"]
    PF_GH["GitHub Profile: @tupynambalucas"]
    PF_Role["Role: Software Engineer & Systems Architect"]
    PF_Assets["Personal Dotfiles, Homelab, Independent OSS"]
    PF_Secrets["Personal Credentials & Private Keys"]
  end

  subgraph EnterpriseEntity ["Pessoa Jurídica / Corporate Domain (tupynambalucas.dev)"]
    direction TB
    PJ_ID["Firm: tupynambalucas.dev (Studio)"]
    PJ_GH["GitHub Org: @tupynambalucas-dev"]
    PJ_Role["Enterprise Platform, Consulting, Systems Architecture"]
    PJ_Assets["platform, docs, agent-toolkit, org-core, .github"]
    PJ_Secrets["Infisical Cloud (Cluster & Toolkit Projects)"]
    PJ_Team["Elastic Contractor Bench & Associated Engineers"]
  end

  PF_ID -->|Directs & Governs as Founder| PJ_ID
  PF_GH -->|Links Authority To| PJ_GH
  PJ_Team -->|Contributes under Quality Gates| PJ_Assets
```

### 2.1 Demarcation Matrix

| Operational Dimension | Personal Boundary (`tupynambalucas`) | Enterprise Boundary (`tupynambalucas.dev`) |
| :--- | :--- | :--- |
| **Legal / Brand Entity** | Tupynambá Lucas (Individual Citizen / Architect) | `tupynambalucas.dev` (Engineering Studio & Consultancy) |
| **Universal Demarcator** | **No Suffix**: `tupynambalucas` | **Suffix `-dev` / `.dev`**: `tupynambalucas-dev` / `tupynambalucas.dev` |
| **Public GitHub Handle** | `github.com/tupynambalucas` | `github.com/tupynambalucas-dev` |
| **Infisical Tenant** | Org: `tupynambalucas` (Personal, zero contractors) | Org: `tupynambalucas-dev` (Corporate, RBAC enabled) |
| **Cloudflare Account** | Account: `tupynambalucas` (Personal homelab/hobby) | Account: `tupynambalucas.dev` (Corporate apex & tunnels) |
| **Repository Ownership** | Personal repositories, research prototypes, dotfiles | Corporate monorepos (`platform`, `docs`, `agent-toolkit`) |
| **Commit Authorship** | Author name: `Tupynambá Lucas Varela Rodrigues` | Founder Executive (`lucas@tupynambalucas.dev`) or `contato@tupynambalucas.dev` |
| **Email Architecture** | Civil personal email (`tupynambalucas@gmail.com`) | `lucas@tupynambalucas.dev`, `contato@tupynambalucas.dev` |
| **Secret Management** | Dedicated personal Infisical org `tupynambalucas` | Corporate Infisical org `tupynambalucas-dev` |
| **Client Contracts / MSAs** | Personal advisory contracts / Fractional CTO | Master Services Agreements (MSAs) with `tupynambalucas.dev` |
| **Contractor Integration** | Never: Contractors do not touch personal profile | Native: Contractors push code to `tupynambalucas-dev` PRs |

### 2.2 Account-Level Isolation vs. In-Org Slug Segregation

A fundamental architectural principle of this governance model is **Account-Level Segregation**:
- **Why NOT put personal projects inside the enterprise organization?**
  1. **Zero Blast Radius**: In platforms like Infisical and Cloudflare, members invited to an organization can view project lists, audit logs, and resource metadata. Putting personal sandboxes inside `tupynambalucas-dev` exposes founder private assets to contractor visibility or RBAC misconfiguration.
  2. **Billing and Tax Segregation**: Corporate tooling is paid via corporate company cards/CNPJ; personal tools belong to CPF/personal accounts. Mixing them violates fiscal boundaries.
  3. **Universal Demarcation**: By defining that `tupynambalucas` (no suffix) is personal and `tupynambalucas-dev` is corporate, all platforms reflect identical structural purity.

---

## 3. Multi-Platform Character Validation: The "Dot" vs. "Dash" Rule

Different cloud platforms, version control systems, and package managers enforce distinct regex validation patterns for names, usernames, and slugs. This variance dictates two deterministic naming rules:

### 3.1 Class A: Lenient Platforms (Dots and Spaces Allowed)
Platforms that permit dots (`.`), spaces, and mixed case in display names or identifiers:
- **Cloudflare** (Account Name, Domain Zones)
- **Stripe / Financial Entities** (Business Name)
- **LinkedIn / Discord / Slack** (Company / Organization Name)
- **Docusaurus / Portal Frontends** (Header, Brand Identity)

**Mandatory Rule for Class A**:
Always use the exact corporate brand name:
$$\mathbf{tupynambalucas.dev}$$

---

### 3.2 Class B: Strict Platforms (Alphanumeric, Dashes, Underscores Only - No Dots Allowed)
Platforms whose schemas reject dots (`Name can only contain alphanumeric characters, dashes, underscores, and spaces`):
- **Infisical Cloud** (Organization Name/Slug, Project Names/Slugs)
- **GitHub** (Organization Slug, Usernames)
- **NPM Package Registry** (Package Scopes: `@tupynambalucas-dev/*`)
- **AWS / GCP / Cloud IAM** (Account Aliases, IAM Roles, Resource Groups)
- **Kubernetes / Docker Hub** (Namespaces, Container Image Registries)

**Mandatory Rule for Class B**:
Transform the dot into a single hyphen (`-`):
$$\mathbf{tupynambalucas-dev}$$
*(Never use underscores `_`, never concatenate without a separator `tupynambalucasdev`, and never append arbitrary hashes).*

---

## 4. Multi-Platform Nomenclature Specifications

### 4.1 Infisical Cloud Governance: Dual-Tenant Architecture

Rather than mingling personal and corporate secrets within the same organization, Infisical is split into two distinct tenant organizations, leveraging the universal `-dev` demarcator:

```mermaid
flowchart TD
  subgraph InfisicalPersonal ["Personal Infisical Org: tupynambalucas (No -dev)"]
    direction TB
    P_Home["homelab<br/>Scope: Personal home server, IoT, private NAS"]
    P_Exp["experiments<br/>Scope: Personal research API keys, throwaway prototypes"]
    P_Site["personal-site<br/>Scope: Personal portfolio tokens"]
  end

  subgraph InfisicalCorp ["Corporate Infisical Org: tupynambalucas-dev (With -dev)"]
    direction TB
    C_Platform["tupynambalucas-platform<br/>(Display: Platform Infrastructure)<br/>Scope: K8s Operator, DBs, Tunnels, Cortex Gateway"]
    C_Toolkit["tupynambalucas-agent-toolkit<br/>(Display: Agent Toolkit)<br/>Scope: Developer Agent Fallback MCP Tokens"]
    C_Docs["tupynambalucas-docs<br/>(Display: Documentation Portal)<br/>Scope: Cloudflare Pages Deployments"]
    C_Corp["tupynambalucas-corporate<br/>(Display: Corporate Applications)<br/>Scope: Fastify API Secrets, Resend JWTs"]
  end
```

#### A. Corporate Infisical Organization (`tupynambalucas-dev`)
- **Organization Slug**: `tupynambalucas-dev`.
- **Display Name**: `tupynambalucas.dev` (or `tupynambalucas-dev`).
- **Access Governance**: RBAC enabled. Elastic contractors receive scoped read-only access strictly to specific projects (e.g. `tupynambalucas-agent-toolkit`).
- **Project Naming Formula (The Anti-Hash Rule)**:
  $$\text{tupynambalucas}-\text{\{context-or-product\}}$$

| Infisical Project Slug | Display Name | Boundary | Scope & Target Secrets | Target Consumers |
| :--- | :--- | :--- | :--- | :--- |
| **`tupynambalucas-platform`** | `Platform Infrastructure` | Corporate | `CORTEX_MCP_TOKEN`, `CLOUDFLARE_TUNNEL_TOKEN_HUB`, `GRAFANA_ADMIN_PASSWORD`, `MONGO_INITDB_ROOT_PASSWORD`, `REDIS_PASSWORD`. | Kubernetes Operator (`InfisicalSecret` CRD). |
| **`tupynambalucas-agent-toolkit`** | `Agent Toolkit` | Corporate | `FIRECRAWL_API_KEY`, `CONTEXT7_API_KEY`, `GITHUB_TOKEN`, `TUPYNAMBA_GATEWAY_TOKEN`. | Local developer agents via `infisical run` / fallback. |
| **`tupynambalucas-docs`** | `Documentation Portal` | Corporate | `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`. | GitHub Actions CI/CD for Cloudflare Pages. |
| **`tupynambalucas-corporate`** | `Corporate Applications`| Corporate | `FASTIFY_JWT_SECRET`, `RESEND_API_KEY`, `CLOUDFLARE_TUNNEL_TOKEN_CORPORATE`. | Production Web and API microservices. |

#### B. Personal Infisical Organization (`tupynambalucas`)
- **Organization Slug**: `tupynambalucas` (strictly NO `-dev`).
- **Display Name**: `Tupynambá Lucas (Personal)`.
- **Access Governance**: Strict single-user boundary. Zero contractors, zero associates.
- **Projects**:
  - `homelab`: Personal homelab infrastructure, local VPNs, NAS credentials.
  - `experiments`: Independent algorithmic experiments and personal AI testing.
  - `personal-site`: Personal domain and portfolio deployment secrets.

---

### 4.2 Cloudflare Infrastructure: Dual-Account Architecture

Cloudflare fully supports dots in account names and domain zones. To ensure pristine isolation between personal network tunnels and corporate production traffic:

1. **Corporate Account (`tupynambalucas.dev`)**:
   - **Account Name**: `tupynambalucas.dev`
   - **Sovereign DNS Apex**: `tupynambalucas.dev`
   - **Subdomain Routing**:
     - `docs.tupynambalucas.dev` -> Corporate Docusaurus portal (Pages)
     - `web.tupynambalucas.dev` / `api.tupynambalucas.dev` -> Corporate production services
     - `mcp.tupynambalucas.dev` -> Cortex AgentGateway Ingress
     - `*-dev.tupynambalucas.dev` -> Platform development tunnels via Traefik
   - **Zero Trust Tunnels**:
     - `tupynambalucas-hub-dev`: Traefik platform routing (Grafana, Loki, Cortex).
     - `tupynambalucas-corporate-dev`: Traefik corporate routing (Web, API, Docs).
   - **Cloudflare Pages**:
     - `tupynambalucas-docs`: Automated production builds from `docs` repository.

2. **Personal Account (`tupynambalucas`)**:
   - **Account Name**: `tupynambalucas` (strictly NO `-dev`).
   - **Purpose**: Strictly personal homelab tunnels (e.g. personal home desktop, private homelab cluster), personal hobby domains, and personal Cloudflare Workers experiments. Zero corporate traffic routes through this account.

---

### 4.3 GitHub Organization vs. Personal Profile

1. **Personal Profile (`github.com/tupynambalucas`)**:
   - **Header Title**: `# Tupynambá Lucas`
   - **Bio**: `Software Engineer & Systems Architect. Strong SE foundations, DDD & Bounded Contexts, distributed systems, and AI-driven platform engineering.`
   - **Affiliation**: `Founder & Principal Systems Architect at [tupynambalucas.dev](https://tupynambalucas.dev)`.
   - **Repository Focus**: Personal open-source tools, algorithmic research, profile README renderer.

2. **Corporate Organization (`github.com/tupynambalucas-dev`)**:
   - **Display Name**: `tupynambalucas.dev`
   - **Lead Overview**: `tupynambalucas.dev is a specialized software engineering and technology consulting organization providing enterprise architecture, autonomous agentic AI infrastructure, cloud-native platforms, and high-performance distributed systems.`
   - **Core Repositories**:
     - `org-core`: Meta-repository umbrella orchestrator.
     - `platform`: Core monorepo (TypeScript, Fastify, React, K8s, Skaffold).
     - `docs`: Sovereign documentation portal (Docusaurus Diátaxis).
     - `agent-toolkit`: Universal AI agent governance package & plugins.
     - `.github`: Organization-wide governance SSOT and workflows.

---

### 4.4 NPM Package Registries

- **Scope**: `@tupynambalucas-dev`
- **Canonical Packages**:
  - `@tupynambalucas-dev/agent-toolkit`: Enterprise AI agent tooling and fallback connectors.
  - `@tupynambalucas-dev/shared-config`: ESLint, Prettier, and TypeScript base configurations.
  - `@tupynambalucas-dev/corporate-preset`: Docusaurus architectural theme and collections.

---

### 4.5 Git Commit Authorship and Cryptographic Signatures

To ensure legal clarity and non-repudiation while preserving the founder's personal reputation:
- **`user.name`**: `tupynambalucasdev` (or `Tupynambá Lucas Varela Rodrigues`)
- **`user.email`**: `contato@tupynambalucas.dev`
- **Signing Format**: `gpg.format = ssh`
- **Signing Key**: `C:/Users/tupyn/.ssh/github_tupynambalucas_ed25519.pub`
- **Commit Flag**: All commits must pass `-S` (`git commit -S -m "..."`).
- **Emoji Invariant**: Strict zero-emoji policy across all commit messages, PR descriptions, and markdown documentation.

---

## 5. Sovereign Domain, Subdomain, and Email Architecture

### 5.1 Strategic Evaluation: The `personal.tupynambalucas.dev` Dilemma

A common question in founder-led engineering firms is whether to create subdomains like `personal.tupynambalucas.dev` and emails such as `contato@personal.tupynambalucas.dev`.

**Architectural Verdict: REJECTED (Anti-Pattern)**.

#### Why `personal.tupynambalucas.dev` is an Anti-Pattern:
1. **Semantic Contradiction**: The address `contato@personal.tupynambalucas.dev` creates cognitive friction. "Contato" (Contact) is an impersonal, institutional inbox keyword; "personal" denotes a private individual. Combining them under a commercial domain signals amateur brand positioning and identity confusion to enterprise clients.
2. **Email Deliverability & Spam Scoring (SPF, DKIM, DMARC)**: Deep tertiary subdomains (like `sub.domain.com`) have lower domain reputation baselines. Major mail servers (Google Workspace, Microsoft 365) apply stricter heuristics and higher spam penalties to mail sent from nested subdomains. Maintaining separate MX, SPF, DKIM, and DMARC records for a subdomain introduces unnecessary DNS fragility.
3. **Legal & Compliance Boundary Violation**: If an individual conducts domestic civil life (banking, streaming, utility bills) on a corporate domain or subdomain, any future enterprise tax audit, investor due diligence, or corporate legal discovery would technically subpoena the corporate email system, entangling personal domestic correspondence in company legal proceedings.

---

### 5.2 The Sovereign Email Topology

To achieve institutional prestige, pristine auditability, and personal privacy, all email communications follow a three-tier topology:

```mermaid
flowchart TD
  subgraph CorporateInboxes ["Corporate Institutional (tupynambalucas.dev)"]
    direction TB
    C_Contato["contato@tupynambalucas.dev<br/>(Inbound client leads, partnerships, RFP responses)"]
    C_Sec["security@tupynambalucas.dev<br/>(Vulnerability disclosure, compliance, CVE reporting)"]
    C_Bill["billing@tupynambalucas.dev<br/>(Invoicing, accounts receivable/payable)"]
  end

  subgraph FounderExec ["Founder Executive Persona (tupynambalucas.dev)"]
    direction TB
    F_Lucas["lucas@tupynambalucas.dev<br/>(High-trust client advisory, Fractional CTO engagements, official Git signing)"]
  end

  subgraph CivilPersonal ["Physical Person / Civil Domestic Domain"]
    direction TB
    P_Personal["tupynambalucas@gmail.com / civil domain<br/>(Personal banking, domestic utilities, private subscriptions, non-work contacts)"]
  end
```

1. **Corporate Institutional Tier (`@tupynambalucas.dev`)**:
   - `contato@tupynambalucas.dev`: Inbound business inquiries, client communication, official company announcements.
   - `security@tupynambalucas.dev`: Security audits, bug disclosures, RFC 9116 `security.txt` endpoint.
   - `billing@tupynambalucas.dev`: SaaS subscriptions, vendor billing, client invoicing.
2. **Founder Executive Tier (`lucas@tupynambalucas.dev`)**:
   - Direct high-level email representing the Founder & Principal Systems Architect.
   - Used for board-level consulting, advisory retainers, and signing official cryptographic commits for the organization.
3. **Civil / Domestic Tier (Pessoa Física - External)**:
   - Completely decoupled from `tupynambalucas.dev`.
   - Utilizes `tupynambalucas@gmail.com` or a personal civil domain.
   - Domestic utility bills, personal bank accounts, streaming services, and purely private correspondence never touch corporate servers.

---

### 5.3 Web Routing and Personal Portfolio Subdomain

If the founder desires a dedicated personal showcase, engineering essays, or curriculum vitae hosted under the corporate brand umbrella:
- **Canonical Subdomain**:
  $$\mathbf{lucas.tupynambalucas.dev} \quad \text{or} \quad \mathbf{tupynambalucas.dev/founder}$$
- **Prohibited Subdomain**: `personal.tupynambalucas.dev` (strictly prohibited).
- **Public Profile Linkage**: The personal GitHub profile (`github.com/tupynambalucas`) lists website `https://tupynambalucas.dev` and bio affiliation with `tupynambalucas.dev`.

---

## 6. Contractor Onboarding & Bring-Your-Own-Token (BYOT) Workflows

When an external contractor or temporary engineer joins a project:
1. **Repository Access**: The contractor is invited to `github.com/tupynambalucas-dev` with role-based access to specific repositories (e.g. `platform` or `docs`). They **never** receive access to `github.com/tupynambalucas` (personal).
2. **Secret Resolution Workflow (3 Cascading Layers)**:
   - **Tier 1 (Enterprise Infisical)**: If authorized, the contractor runs `pnpm dlx @infisical/cli login` and receives scoped read-only access to `tupynambalucas-agent-toolkit`.
   - **Tier 2 (BYOT Local `.env`)**: If the contractor does not have Infisical access, they copy `.env.example` to `.env` in their local workspace and provide their own personal Firecrawl, Context7, or GitHub keys.
   - **Tier 3 (Antigravity Interactive Setup)**: If no `.env` exists, the contractor runs `/plugin agent-toolkit` in the Antigravity CLI and enters their personal keys, which are persisted locally in `~/.gemini/config/config.json`.
3. **Pull Request Protocol**: All contractor contributions are submitted via pull requests against `develop`, requiring review and signed approval before merging.

---

## 7. Implementation Checklist & Governance Sign-Off

- [x] Standardize `# tupynambalucas.dev Platform Monorepo` in `platform/README.md`.
- [x] Standardize `PROJECT_NAME: 'tupynambalucas.dev'` in `platform/shared/config/src/project.config.ts`.
- [x] Standardize `tupynambalucas.dev is a specialized...` in `.github/profile/README.md`.
- [x] Add root `.gitignore` and `.env.example` in `org-core`.
- [x] Add strict validation and variables declaration in `agent-toolkit/mcp_config.json`.
- [x] Add `.vscode` workspace configuration in `agent-toolkit`.
- [ ] Provision personal Infisical organization `tupynambalucas` for homelab and personal experiments.
- [ ] Rename corporate Infisical project slug `tupynambalucas-core-ez7a` to `tupynambalucas-platform` under org `tupynambalucas-dev`.
- [ ] Provision dedicated corporate Infisical project `tupynambalucas-agent-toolkit` with developer fallback tokens under org `tupynambalucas-dev`.
- [ ] Verify Cloudflare Corporate Account Name is set to `tupynambalucas.dev`.
- [ ] Verify Cloudflare Personal Account Name is set to `tupynambalucas`.
