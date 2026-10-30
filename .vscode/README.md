# Developer Workstation IDE Configuration (`.vscode/`)

Shared Visual Studio Code and Antigravity IDE configurations, workspace extension recommendations, and local task definitions for `tupynambalucas-dev/.github`.

---

## 1. Overview

When opening `.github` as a standalone workspace, these configurations enforce consistent formatting, linting, schema validation, and CLI task execution. For cross-repository development across the full organization ecosystem, open the multi-root workspace provided by [`tupynambalucas-dev/org-core`](https://github.com/tupynambalucas-dev/org-core).

---

## 2. Directory Layout

| File | Purpose |
| :--- | :--- |
| [extensions.json](./extensions.json) | Workspace extension recommendations automatically prompted by VS Code and Antigravity IDE. |
| [settings.json](./settings.json) | Editor format-on-save rules, Prettier/ESLint bindings, Tailwind CSS linting, and Kubernetes/YAML JSON schemas. |
| [tasks.json](./tasks.json) | Cross-platform terminal task (`Antigravity CLI (.github)`) launching `agy` scoped to this repository. |

---

## 3. Recommended Extensions (`extensions.json`)

| Extension | Marketplace Identifier | Role |
| :--- | :--- | :--- |
| **Prettier** | `esbenp.prettier-vscode` | Default code, JSON, YAML, Markdown, and MDX formatter on save. |
| **ESLint** | `dbaeumer.vscode-eslint` | Static code analysis with workspace auto-detection and cache isolation. |
| **Tailwind CSS IntelliSense** | `bradlc.vscode-tailwindcss` | Utility class completion and conflict/variant linting. |
| **Red Hat YAML** | `redhat.vscode-yaml` | Schema store validation for Kubernetes manifests and Kustomize overlays. |
| **Unified MDX** | `unifiedjs.vscode-mdx` | Syntax highlighting and AST support for MDX v3 documentation. |
| **Markdown Preview Enhanced** | `shd101wyy.markdown-preview-enhanced` | Extended GitHub-flavored Markdown and Mermaid diagram previewing. |
| **GitHub Actions** | `github.vscode-github-actions` | Workflow syntax validation and CI run inspection. |
| **TaskDeck** | `emanuelebartolesi.taskdeck` | Sidebar task runner for `tasks.json` workflows. |
| **File Tree to Text Generator** | `d-koppenhagen.file-tree-to-text-generator` | ASCII directory tree generation for architectural documentation. |

---

## 4. Navigation

- [Repository Root README](../README.md)
- [Workstation Profile Templates (`templates/`)](../templates/README.md)
