# Developer Workstation and IDE Configuration (.vscode)

This directory manages shared Visual Studio Code configurations, recommended extensions,
and automated tasks for the tupynambalucas-dev organization.

---

## Directory Layout

```text
.vscode/
├── extensions.json                  # Recommended workspace extensions
├── settings.json                    # Workspace formatting, linting, and language settings
├── tasks.json                       # Automated build, lint, and run tasks
└── references/                      # Deep-dive documentation for core extensions
    └── extensions/                  # Individual markdown specifications per extension
```

---

## Extension Recommendations (`extensions.json`)

Key recommended extensions include:

- **Prettier** (`esbenp.prettier-vscode`): Enforces consistent code and markdown formatting.
- **ESLint** (`dbaeumer.vscode-eslint`): Static code analysis using flat configuration.
- **TaskDeck** (`emanuelebartolesi.taskdeck`): Task runner and execution control center.
- **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`): Autocompletion for utility classes.
- **Unified MDX** (`unifiedjs.vscode-mdx`): Syntax highlighting and linting for MDX documents.
- **Red Hat YAML** (`redhat.vscode-yaml`): Kubernetes and Helm manifest validation.

---

## Task Execution

Automated tasks are executed via standard terminal processes across Windows Terminal, Linux terminal emulators, and macOS Terminal without custom profile dependencies or non-standard scripts.

---

## Rules and Guidelines

- **Format on Save**: Enabled across all file types using Prettier.
- **Zero Emojis**: Documentation and commit messages must not contain emojis.
- **Line Endings**: Repository files use LF (`\n`). Git handles conversion automatically.
