# AI Agents Context Syntax Reference

This reference defines the structural syntax and formatting standards for `AGENTS.md` files across the monorepo to ensure high-fidelity parsing by LLMs.

---

## 1. Document Structure

All `AGENTS.md` files must follow a rigid, hierarchical layout to help AI agents parse context immediately.

### A. Headings Hierarchy

- **H1 (`#`)**: Workspace or package name identifying the context scope.
- **H2 (`##`)**: Major instruction categories:
  - `## Navigation`: Mappings to sub-workspaces or source entrypoints.
  - `## Architecture`: Directory map or system topologies.
  - `## Scoped Guardrails`: Strict coding rules specific to this folder.
  - `## Scoped Commands`: CLI scripts execution commands.

### B. List Formatting

- **Unordered Lists**: Always use hyphens (`-`) for list items to conform to the monorepo Prettier configuration. Do not use asterisks (`*`) or plus signs (`+`).
- **Ordered Lists**: Use lazy numbering (`1.`) for sequential verification steps.

---

## 2. Interactive Navigation (Links)

To prevent LLMs from executing multiple directory search tools, `AGENTS.md` files must feature direct relative markdown links.

### A. Clickable Relative Directory Links

- Use standard relative path links to point to child directories or source directories (e.g., [src/domains/](./src/domains/)).
- Ensure the trailing slash `/` is present for directory links.

### B. Clickable File Links

- Point to configuration files, tsconfig files, or main package manifests (e.g., [package.json](./package.json)).

### C. Clickable Link Formatting

- **Do Not Wrap Links in Backticks**: Clickable relative links MUST NEVER be wrapped in backticks (e.g., `[label](path)`). Surrounding a markdown link structure with backticks prevents it from being parsed as a hyperlink, rendering it as literal code text instead.

---

## 3. LLM-Optimized Design Patterns

To ensure high-fidelity parsing by LLMs, all `AGENTS.md` files must adhere to these design patterns:

### A. Explicit Relative Links

- Every referenced file, schema, or configuration directory MUST use clickable relative markdown links (e.g., [tsconfig.json](./tsconfig.json) or [src/domains/](./src/domains/)) to facilitate rapid tool-based navigation.
- Absolute file system paths (e.g., `/absolute/path/to/project`, `/projects/...`) and external production web URLs (e.g., `https://github.com/...`, `https://docusaurus.io/...`) MUST NEVER be included inside `AGENTS.md` files. Only local localhost-based development urls are permitted inside orchestration command execution examples.

### B. Imperative, Rule-Based Phrasing

- Write using clear, absolute constraints ("NEVER", "MUST", "ALWAYS") rather than conversational prose. This removes ambiguity and makes the instruction context directly actionable for LLMs.

### C. No Redundancy

- Do not duplicate global rules. Global rules (English-First, Zero Emojis, Zero Placeholders) exist solely in the root `AGENTS.md` and are inherited across all workspaces. Sub-workspace context files must only define rules specific to their scope.

### D. Concrete Snippets

- Provide explicit, copy-pasteable code blocks (TypeScript, Docker, CSS) demonstrating correct implementation patterns (e.g., Mapped Repository injection, state selectors, relative CSS units, and compose service declarations) rather than abstract explanations.

---

## 4. Prettier Formatting Standards

All `AGENTS.md` files must comply with the root Prettier formatting rules:

- **Indentation**: Standard 2-space indentation for list nesting, blockquotes, and HTML tags.
- **Line Width**: Word wrap prose to keep lines under 100 characters where possible.
- **Unordered Lists**: Always use hyphens (`-`) for unordered lists. Asterisks (`*`) and plus signs (`+`) are strictly forbidden.
- **Code Block Formatting**: JavaScript/TypeScript code snippets inside fenced code blocks must comply with:
  - `semi: true` (always use semicolons)
  - `singleQuote: true` (use single quotes for strings)
  - `trailingComma: "all"` (enforce trailing commas)
  - `arrowParens: "always"` (parentheses around arrow function arguments)

---

## 5. Context Hierarchy Directive Syntax

The `<context-hierarchy>` directive is an XML block placed at the top of every Layer-2 and
Layer-3 `AGENTS.md` file. It instructs agents to load parent context files before proceeding.

### Structure

The directive contains:

- One or more `<parent>` elements referencing parent context files via relative paths.
- A `<system-instruction>` element with an imperative, first-person instruction to the agent.

### Attributes

- `src` (required): Relative filesystem path from the current file to the parent `AGENTS.md`.
- `type` (required): Semantic category. Valid values: `global-rules`, `bounded-context-rules`.

### Layer-2 Example (one level deep)

```xml
<context-hierarchy>
  <parent src="../AGENTS.md" type="global-rules" />
  <system-instruction>
    AGENT: You are operating in the [exact-directory-name] bounded context. If you have not read "../AGENTS.md" in this session, stop now and read it using your
    file-reading tools before proceeding. Global constraints are mandatory.
  </system-instruction>
</context-hierarchy>
```

### Layer-3 Example (two levels deep)

```xml
<context-hierarchy>
  <parent src="../../AGENTS.md" type="global-rules" />
  <parent src="../AGENTS.md" type="bounded-context-rules" />
  <system-instruction>
    AGENT: You are operating in the [exact-directory-name] module. If you have not read "../../AGENTS.md" and "../AGENTS.md" in this session, stop now
    and read both files using your file-reading tools before proceeding.
  </system-instruction>
</context-hierarchy>
```

### Critical Rules

- The directive MUST be the first content in the file, before the H1 heading.
- The bounded context or module name in the `system-instruction` MUST exactly match the directory name it resides in (e.g., `k8s`, not `Kubernetes Orchestration`) to prevent path hallucination.
- MUST use relative paths only. Absolute paths are forbidden.
- MUST NOT reference external URLs.
- MUST use imperative language in the system-instruction.
