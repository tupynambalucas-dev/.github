# Workstation Profile Templates (`templates/`)

Exportable IDE profile bundles providing turnkey editor themes, keybindings, extension sets, and panel layouts for `tupynambalucas-dev` engineers.

---

## 1. Overview

While [`.vscode/`](../.vscode/README.md) governs repository-scoped workspace settings, this directory stores portable `.code-profile` snapshots that developers can import into Visual Studio Code or Antigravity IDE to bootstrap a standardized workstation UI and extension baseline.

---

## 2. Available Profiles

| Profile Artifact | Target IDE | Description |
| :--- | :--- | :--- |
| [profiles/tupynambalucas-dev.code-profile](./profiles/tupynambalucas-dev.code-profile) | VS Code / Antigravity IDE | Standard Dark Modern workstation profile bundling Material Icon Theme, Prettier, ESLint, YAML, MDX, Tailwind CSS, Container Tools, and custom Markdown preview keybindings. |

---

## 3. Importing a Profile

1. Open Visual Studio Code or Antigravity IDE.
2. Open the Command Palette (`Ctrl+Shift+P` on Windows/Linux or `Cmd+Shift+P` on macOS).
3. Run **Profiles: Import Profile...**.
4. Select `templates/profiles/tupynambalucas-dev.code-profile` from your local clone and confirm creation.

---

## 4. Navigation

- [Repository Root README](../README.md)
- [Workspace IDE Settings (`.vscode/`)](../.vscode/README.md)
