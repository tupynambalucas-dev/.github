---
name: markdown-expert
description: Use this skill to write, analyze, or update general Markdown files (.md), package READMEs, or skill instructions using GitHub Flavored Markdown (GFM).
---

# Markdown Expert

This skill defines the standards, structure, design patterns, and validation workflow for general Markdown documentation in the monorepo.

## 1. Global Documentation Standards

The following rules apply to all documentation tasks, regardless of file extension or location.

### A. Tone of Voice

- Maintain a senior, objective, and technical tone.
- Avoid preambles, introductory chatter, or conclusion summaries.
- Keep sentences concise, clear, and direct.

### B. Strict English-First

- All code, configuration, technical documentation, READMEs, architectural briefs, code comments/examples, commit messages, and pull request descriptions MUST be written in English (en-US).
- Conversational chat responses with the user MUST be conducted in Brazilian Portuguese (pt-BR).

### C. Zero Emojis

- Emojis are strictly forbidden in all technical documents, READMEs, and skill files to maintain a professional, corporate appearance.

### D. Mermaid Diagram Standards

- Always define layout direction explicitly (e.g., `direction TD` or `direction LR`).
- Use clear node labels wrapped in double quotes (e.g., `node["label"]`) to prevent parser issues with special characters.
- Use subgraphs to explicitly illustrate Bounded Context boundaries (e.g., separating `extension/` logic from `studio/` logic).
- Do not use HTML formatting tags within Mermaid labels; rely on plain Markdown where supported.

### E. Zero Placeholders

- Never include empty sections, "TBD", or "TODO" notes in documentation. If a section is not yet ready, omit it completely.

### F. Prettier Formatting Standards

- All files must comply with the root Prettier formatting rules (2-space indentation, max 100-character line width, hyphen-based unordered lists, and proper JavaScript/TypeScript code block styling).

### G. Prohibited Absolute Paths

- Absolute filesystem paths or local protocol URLs (e.g., file scheme paths or `/absolute/path/...`) are strictly forbidden in all Markdown links and document references.
- All references must use:
  1. Standard relative paths (e.g., `./relative-file.md` or `../sibling/file.md`).
  2. Fully-qualified public web URLs with explicit domains (e.g., `https://example.com` or external domain references).

### H. Project Variables and Identifiers

- **Concrete Names Required**: Project names, package identifiers, and domains MUST use their actual concrete values corresponding to the target repository in all general `.md` files.
- **No Unresolved Placeholder Tokens**: Do NOT leave unresolved placeholder tokens (such as `%PROJECT_DOMAIN%` or generic `<PLACEHOLDER>`) in production documentation files unless the workspace explicitly uses an AST template compilation pipeline.

---

## 2. Document Guidelines

Use these guidelines when creating, updating, or analyzing general repository documentation, package READMEs, or files under the `.agents/` folder.

- **Syntax Standard**: Must adhere to standard GitHub Flavored Markdown (GFM).
- **GFM Callouts**: Use GFM blockquote alerts (`> [!NOTE]`, `> [!TIP]`, `> [!IMPORTANT]`, `> [!WARNING]`, `> [!CAUTION]`) for admonitions.
- **Reference Files**:
  - GFM syntax and formatting: [references/syntax.md](references/syntax.md)
  - Code examples and GitHub patterns: [references/patterns.md](references/patterns.md)
  - Validation and verification workflow: [references/workflow.md](references/workflow.md)

---

## 3. Build and Content Validation Workflow

Before completing any documentation task, you must execute the verification steps defined in the workflow guide:

- Follow the validation steps in [references/workflow.md](references/workflow.md).
