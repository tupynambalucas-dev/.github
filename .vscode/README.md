# Developer Workstation and IDE Configuration (.vscode)

This directory manages shared Visual Studio Code configurations, recommended extensions,
automated tasks, and Windows Terminal profiles for the Tupynambá Lucas organization.

---

## Directory Layout

```text
.vscode/
├── extensions.json                  # Recommended workspace extensions
├── settings.json                    # Workspace formatting, linting, and language settings
├── tasks.json                       # Automated build, lint, and run tasks
├── references/                      # Deep-dive documentation for core extensions
│   └── extensions/                  # Individual markdown specifications per extension
├── scripts/                         # Shell and PowerShell workstation automation scripts
│   ├── launch-agy.ps1               # Launches Antigravity runtime in host environment
│   ├── launch-agy-wsl.ps1           # Launches Antigravity runtime inside WSL2 Ubuntu
│   └── launch-mage.ps1              # Launches local agent orchestration tools
└── terminal/                        # Terminal profiles and shell integrations
    └── windows/                     # Windows Terminal JSON fragment installations
        ├── Fragments/               # Custom profile fragment definitions
        └── install-profiles.ps1     # Installation script for Windows Terminal fragments
```

---

## Extension Recommendations (`extensions.json`)

Key recommended extensions include:

- **Prettier** (`esbenp.prettier-vscode`): Enforces consistent code and markdown formatting.
- **ESLint** (`dbaeumer.vscode-eslint`): Static code analysis using flat configuration.
- **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`): Autocompletion for utility classes.
- **Unified MDX** (`unifiedjs.vscode-mdx`): Syntax highlighting and linting for MDX documents.
- **Red Hat YAML** (`redhat.vscode-yaml`): Kubernetes and Helm manifest validation.

---

## Workstation Terminal Profiles

The `terminal/windows/` folder provides automated Windows Terminal profiles pre-configured
for development across the Windows 11 host and the `tupynambalucasdev-ubuntu` WSL2 instance.

To register the profiles into Windows Terminal:

```powershell
powershell -ExecutionPolicy Bypass -File .\.vscode\terminal\windows\install-profiles.ps1
```

---

## Rules and Guidelines

- **Format on Save**: Enabled across all file types using Prettier.
- **Zero Emojis**: Documentation and commit messages must not contain emojis.
- **Line Endings**: Repository files use LF (`\n`). Git handles conversion automatically.
