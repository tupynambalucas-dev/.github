# Plano de Arquitetura: Meta-Repositório Corporativo (`tupynambalucas-dev`)

Este documento especifica o design, a governança e o plano de implementação do **Meta-Repositório Corporativo** (ou *Umbrella Repository*) da organização `tupynambalucas-dev`. O meta-repositório unifica sob uma única raiz física os repositórios soberanos `.github`, `platform` e `docs`, garantindo que a Antigravity CLI e a IDE naveguem nativamente com referências `@` globais, sem abrir mão da autonomia de CI/CD e governança de cada repositório.

---

## 1. Objetivos Arquiteturais

1. **Navegação Nativa e Autocomplete `@` no Antigravity**:
   - Prover uma árvore de diretórios unificada para que a Antigravity CLI e a IDE indexem simultaneamente governança, engenharia e documentação sem necessidade de flags adicionais (`--add-dir`).
2. **Soberania e Desacoplamento dos Repositórios**:
   - Cada repositório filho (`.github`, `platform`, `docs`) mantém seu próprio histórico Git, branches, permissões RBAC e pipelines de CI/CD completamente autônomos.
3. **Versionamento Atômico de Estado Corporativo**:
   - O meta-repositório atua como um manifesto de release corporativo, fixando commits compatíveis entre governança, infraestrutura e documentação.

---

## 2. Comparativo de Abordagens de Meta-Repositório

Com base na pesquisa de engenharia e na documentação do Git e GitHub:

| Critério | Git Submodules (Recomendado) | Git Subtree | Multi-Root Workspace puro | Meta CLI / Ferramentas Externas |
| :--- | :--- | :--- | :--- | :--- |
| **Soberania do Git** | 100% autônomo por repositório | Histórico mesclado no repo pai | 100% autônomo | Depende de CLI de terceiros |
| **Indexação Antigravity (`@`)** | **Nativa** (mesma raiz de FS) | **Nativa** | Limitada por caminhos de terminal | Requer sincronização manual |
| **Sobrecarga de CI/CD** | Mínima (`submodules: recursive`) | Alta (reescrita de histórico) | Nenhuma (CI independente) | Requer runtime extra em CI |
| **Padrão da Indústria** | Padrão do Git / Kubernetes / Chromium | Projetos legados / forks | VS Code multi-root | Dependência de ecossistema Node |

**Decisão**: Adoção de **Git Submodules com Branch Tracking**, complementada pelo arquivo de workspace canônico [`tupynambalucas-dev.code-workspace`](file:///C:/Users/tupyn/projects/tupynambalucas-dev/.github/tupynambalucas-dev.code-workspace).

---

## 3. Topologia e Estrutura de Diretórios

```
tupynambalucas-dev/                         <- Raiz do Meta-Repositório Git
├── .github/                                <- Submódulo Git (Org Governance & Agentic Configs)
│   ├── .agents/                            <- Plugins, Skills, Rules e Plans corporativos
│   ├── profile/                            <- Perfil público da organização
│   └── tupynambalucas-dev.code-workspace   <- Definição de workspace multi-root
├── platform/                               <- Submódulo Git (Monorepo de Engenharia & K8s)
│   ├── hub/                                <- Serviços internos, Penpot, Memos, Studio
│   ├── renderer/                           <- Pipeline gerador de SVG cards dinâmicos
│   ├── cortex/                             <- AgentGateway, Guardrails e RAG Memory
│   └── kubernetes/                         <- Helm charts, Skaffold e manifestos GitOps
├── docs/                                   <- Submódulo Git (Hub Soberano de Documentação)
│   ├── apps/portal/                        <- Docusaurus 3 em produção
│   ├── collections/                        <- Documentações e blogs de todos os projetos
│   ├── packages/preset/                    <- Preset multi-instância e locales-sync
│   └── packages/studio-assets/             <- Tokens e assets corporativos
├── .gitmodules                             <- Manifesto declarativo dos submódulos
├── .gitignore                              <- Regras globais de exclusão do meta-repo
├── package.json                            <- Scripts de automação e orquestração local
└── README.md                               <- Manual de operação do meta-repositório
```

---

## 4. Especificação dos Arquivos de Configuração

### A. Manifesto de Submódulos (`.gitmodules`)

O arquivo `.gitmodules` deve utilizar URLs relativas à organização ou SSH padrão, com rastreamento explícito da branch canônica de desenvolvimento:

```ini
[submodule ".github"]
	path = .github
	url = https://github.com/tupynambalucas-dev/.github.git
	branch = main
	update = merge

[submodule "platform"]
	path = platform
	url = https://github.com/tupynambalucas-dev/platform.git
	branch = develop
	update = merge

[submodule "docs"]
	path = docs
	url = https://github.com/tupynambalucas-dev/docs.git
	branch = main
	update = merge
```

### B. Workspace Multi-Root (`tupynambalucas-dev.code-workspace`)

Localizado na raiz do meta-repositório para abertura no VS Code e Antigravity IDE:

```json
{
  "folders": [
    {
      "name": "Org Governance (.github)",
      "path": ".github"
    },
    {
      "name": "Core Monorepo (platform)",
      "path": "platform"
    },
    {
      "name": "Documentation Hub (docs)",
      "path": "docs"
    }
  ],
  "settings": {
    "git.autoRepositoryDetection": true,
    "files.exclude": {
      "**/.git": false
    }
  },
  "tasks": {
    "version": "2.0.0",
    "tasks": [
      {
        "label": "Antigravity CLI (Meta-Repo Scope)",
        "type": "process",
        "command": "agy",
        "windows": {
          "command": "powershell.exe",
          "args": ["-NoExit", "-Command", "agy"]
        },
        "problemMatcher": []
      },
      {
        "label": "Submodules: Update & Sync",
        "type": "shell",
        "command": "git submodule update --remote --merge",
        "problemMatcher": []
      }
    ]
  }
}
```

### C. Scripts Utilitários (`package.json` do Meta-Repositório)

```json
{
  "name": "@tupynambalucas-dev/meta",
  "version": "1.0.0",
  "private": true,
  "description": "Meta-repository orchestrating the tupynambalucas-dev ecosystem.",
  "scripts": {
    "sync": "git submodule update --init --recursive --remote --merge",
    "checkout:branches": "git submodule foreach 'git checkout $(git config -f $toplevel/.gitmodules submodule.$name.branch || echo main)'",
    "status": "git submodule status",
    "lint:all": "pnpm -r --filter=./platform --filter=./docs run lint"
  }
}
```

---

## 5. Workflows de Operação Diária

### 1. Clonagem Inicial por um Desenvolvedor
Para clonar todo o ecossistema com uma única linha:
```bash
git clone --recurse-submodules https://github.com/tupynambalucas-dev/tupynambalucas-dev.git
```

### 2. Sincronização Diária de Todos os Repositórios
Para trazer as últimas alterações de todos os repositórios filhos de forma atômica:
```bash
git submodule update --remote --merge
```

### 3. Evitando o Estado `detached HEAD`
Por padrão, `git submodule update` deixa o submódulo em `detached HEAD`. O comando abaixo assegura que cada submódulo esteja na sua branch ativa:
```bash
git submodule foreach 'git checkout $(git config -f $toplevel/.gitmodules submodule.$name.branch || echo main)'
```

### 4. Fluxo de Commit e Push
1. O desenvolvedor realiza alterações dentro da pasta do submódulo (`platform/`, `docs/` ou `.github/`).
2. Faz commit e push **dentro do repositório filho**:
   ```bash
   cd platform
   git add .
   git commit -m "feat(hub): add new internal service"
   git push origin develop
   cd ..
   ```
3. No meta-repositório, registra o novo ponteiro de commit:
   ```bash
   git add platform
   git commit -m "chore(platform): bump platform pointer to latest develop"
   git push origin main
   ```

---

## 6. Automação de CI/CD no GitHub Actions

O meta-repositório hospeda um workflow de atualização contínua para sincronizar automaticamente os ponteiros quando branches remotas recebem novos commits.

### Workflow: `.github/workflows/submodule-sync.yaml`
```yaml
name: Submodule Sync

on:
  schedule:
    - cron: '0 0 * * *' # Diário à meia-noite UTC
  workflow_dispatch:

permissions:
  contents: write
  pull-requests: write

jobs:
  sync-submodules:
    name: Synchronize Submodule Pointers
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Meta-Repository
        uses: actions/checkout@v4
        with:
          token: ${{ secrets.ORGANIZATION_GITHUB_TOKEN }}
          submodules: recursive
          fetch-depth: 0

      - name: Update Submodules to Latest Remote Commits
        run: |
          git submodule update --init --recursive --remote --merge

      - name: Create Pull Request on Changes
        uses: peter-evans/create-pull-request@v6
        with:
          token: ${{ secrets.ORGANIZATION_GITHUB_TOKEN }}
          commit-message: "chore(deps): synchronize submodule pointers"
          title: "chore: synchronize submodule pointers"
          body: "Automated synchronization of `.github`, `platform`, and `docs` submodule commit pointers."
          branch: "chore/sync-submodules"
          base: "main"
```

---

## 7. Roteiro de Execução Passo a Passo

### Passo 1: Criação do Repositório Remoto no GitHub
Criar o repositório na organização via GitHub CLI:
```bash
gh repo create tupynambalucas-dev/tupynambalucas-dev --public --description "Meta-repository orchestrating the tupynambalucas-dev ecosystem."
```

### Passo 2: Inicialização Local da Pasta Raiz
No diretório `C:\Users\tupyn\projects\tupynambalucas-dev`:
```bash
cd C:\Users\tupyn\projects\tupynambalucas-dev
git init -b main
```

### Passo 3: Vinculação dos Três Submódulos
```bash
git submodule add -b main https://github.com/tupynambalucas-dev/.github.git .github
git submodule add -b develop https://github.com/tupynambalucas-dev/platform.git platform
git submodule add -b main https://github.com/tupynambalucas-dev/docs.git docs
```

### Passo 4: Commit e Push Inicial do Meta-Repositório
```bash
git remote add origin https://github.com/tupynambalucas-dev/tupynambalucas-dev.git
git add .
git commit -m "feat(meta): initialize meta-repository orchestrating .github, platform, and docs"
git push -u origin main
```
