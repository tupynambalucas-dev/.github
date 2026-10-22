---
name: docusaurus-expert
description: Use this skill to create, analyze, or update technical documentation in the <docs-root>/ workspace, ensuring MDX syntax compliance and strict adherence to the Diátaxis framework.
---

# Docusaurus Docs Expert

This skill defines the authoritative standards, directory structures, design patterns, and validation workflows for the **workspace** Knowledge Base (`<docs-root>/`).

---

## 1. Directory Structure & Diátaxis Standards

The `<docs-root>/` workspace officially adopts the **Diátaxis** framework. All documentation must be structured around user needs into four distinct quadrants. Do not organize files merely by topic.

### A. The Four Quadrants

When creating or editing documentation, classify and place it in the appropriate quadrant (e.g., inside `<docs-root>/handbook/` or the appropriate workspace root):

- `tutorials/`: Learning-oriented, practical lessons for beginners to acquire skills.
- `guides/` (How-to guides): Goal-oriented, practical step-by-step directions to solve specific problems.
- `reference/`: Information-oriented, theoretical descriptions (codebase, APIs, configs).
- `explanation/`: Understanding-oriented discussions, theory, background, and architecture.

### B. Complex Hierarchies & Categorization

When documenting specific domains or features that require multiple files:

- **Sub-categorization**: Group the files inside a category subfolder within the appropriate quadrant (e.g., `<docs-root>/reference/<domain-name>/`).
- **Docusaurus Categories**: You MUST create a `_category_.json` file inside these subfolders to generate sidebar dropdowns automatically.
- **Single Files**: If a domain only requires a single document for a quadrant (e.g., one tutorial), place it directly at the root of the quadrant (e.g., `tutorials/<domain-name>-start.mdx`) without creating a dedicated subfolder.

---

## 2. Document & MDX Standards

All files placed inside the documentation directories MUST strictly adhere to the following rules:

### A. Tone of Voice

- Maintain a senior, objective, and technical tone.
- Avoid preambles, introductory chatter, or conclusion summaries.
- Keep sentences concise, clear, and direct.

### B. Extension Rule: All-MDX

- **Zero `.md` Files**: All technical documents and guides must use the `.mdx` file extension to support rich React components and strict MDX parsing. No `.md` files should be created or exist within these directories (the only exception is the repository-standard `README.md` at package and workspace roots).

### C. MDX Parser Compliance

- **No HTML Comments**: Standard HTML comments (`<!-- comment -->`) are completely forbidden in MDX and will break compilation. Always use JavaScript comments wrapped in curly braces: `{/* comment */}`.
- **Escaping Special Characters**: Raw curly braces (`{` and `}`) and less-than signs (`<`) will be intercepted by the MDX parser as JSX or expression start tokens. Always escape them when they are intended as raw text: `\{`, `\}`, and `\<`.
- **Self-Closing Tags**: All HTML or JSX elements must be well-formed. Self-closing tags MUST end with a trailing slash (e.g., `<br />`, `<img src="..." />`, `<hr />`).
- **Markdown inside HTML/JSX**: To render standard markdown formatting inside raw HTML/JSX block elements, isolate the markdown content with empty lines above and below the block tags.
- **Docusaurus Admonitions**: Use native colon admonitions with a bracketed title (`:::note[Title]`, `:::tip[Title]`, `:::info[Title]`, `:::caution[Title]`, `:::danger[Title]`) instead of standard GFM quote alerts (`> [!NOTE]`).

### D. Cross-linking and Content Preservation

- **Cross-linking**: Use Docusaurus absolute paths (e.g., `[Link Text]` followed by `(/handbook/reference/...)`) for internal markdown links to prevent dead links caused by the deeply nested Diátaxis structure. Avoid relative paths like `../../`.
- **Content Integrity**: When migrating or converting existing `.md` documentation into MDX, you MUST migrate the content 1:1. Never summarize, truncate, or omit the original text. External web URLs (`http://` or `https://`) must be strictly preserved without modification.

### E. Formatting & Prettier Standards

- All MDX files must align with the project Prettier configuration:

  - Use exactly 2-space indentation.
  - Use hyphens (`-`) for unordered list items; asterisks or pluses are forbidden.
  - Code blocks embedded in MDX must feature semicolons, trailing commas, single quotes for strings (except double quotes in JSX props), and parentheses for arrow functions.

### F. Project Variables Plugin (Optional)

- **Agnostic Content**: When a workspace supports dynamic AST tokens, avoid hardcoding brand names or URLs directly in reusable documentation content.
- **AST Tokens**: Use configured percentage-wrapped tokens (e.g., `%PROJECT_DOMAIN%` or `%PROJECT_NAME%`) when an AST variable replacement plugin is present.
- **Centralized Config**: Tokens should be defined centrally in the project's shared configuration module.
- **Compilation**: The AST variable plugin automatically resolves these tokens to production values during the build.

---

## 3. Automated Localization (L10n)

- **English-Only Authoring**: You MUST author, update, and review documentation exclusively in English (the source language).
- **No Manual Translation**: You MUST NOT create or edit localized target language files (e.g., `pt-BR`, `es`) manually.
- **L10n Automation**: All localization is strictly handled asynchronously by external L10n pipelines (e.g., Crowdin, GitHub Apps). When you commit English source files to the `<docs-root>`, the L10n pipeline will automatically pull them, translate them, and open a Pull Request targeting the `locales/` directory.
- **Translation Isolation**: Never attempt to fix typos or parity gaps in the localized target folders. Focus entirely on maintaining the structural integrity of the English source.

---

## 4. Single-Pass Deferred Validation

- **No Intermediate Tests**: Do NOT run verification commands after each individual edit or file creation. Always batch all proposed modifications across all files first.
- **Final Validation Only**: Execute the validation suite exactly ONCE at the end of the entire documentation task to test the build, types, and links.
- **Strictly No Dev/Preview Servers**: Never start the development server (`<dev-command>`) or preview server (`<preview-command>`). The verification workflow consists solely of verifying successful compilation and error-free builds.

For the step-by-step validation pipeline instructions, refer to [references/workflow.md](references/workflow.md).

---

## 5. Upstream/Vendor Documentation Adaptation

When a task requires adapting official third-party or upstream documentation (e.g., <upstream-tool>, Traefik, Kubernetes) into the Docusaurus workspace, follow this specific pattern. This type of documentation serves as an **inherited technology reference** — it is not project-authored content, but an adapted mirror of official upstream docs kept inside the project for developer convenience and architectural reference.

### A. Dedicated Category Placement & Navigation

- Place all adapted upstream docs inside a **dedicated named subfolder** within `<docs-root>/reference/`, for example: `<docs-root>/reference/<upstream-tool>/`.
- Every category and subcategory folder MUST include a `_category_.json` configured with a `generated-index` link:
  ```json
  {
    "label": "Category Label",
    "position": 1,
    "link": {
      "type": "generated-index",
      "description": "Concise summary of this documentation section."
    }
  }
  ```
  This ensures clicking the dropdown or navigating to the category URL displays a clean list of document cards.
- Do NOT mix upstream reference docs with project-authored content. They must occupy their own isolated category tree.

### B. Entrypoint Structure & About Folder Conversion

- Scraped documentation often features an `about/` folder containing `index.md`, `introduction.md`, and `architecture.md`.
- Convert this pattern into a single top-level `intro.mdx` file at the root of the technology reference folder (e.g., `<docs-root>/reference/<upstream-tool>/intro.mdx`).
- Include the Upstream Reference attribution banner, core concepts, motivation, and architecture diagrams in `intro.mdx`.
- Conclude `intro.mdx` with a `<DocCardList />` component pointing to every subcategory and major reference document.

### C. Redundant Index and Overview Consolidation

- Pure table-of-contents `index.md` files produced by web scrapers are superseded by Docusaurus `generated-index` cards and must NOT be converted into empty `.mdx` files.
- If an index file or `about.md` contains substantive introductory explanations or conceptual documentation, rename and convert it to `overview.mdx` (with `sidebar_position: 1`).

### D. Source Scrape Cleanup Rules

Upstream source files (typically obtained by scraping documentation websites) contain **web UI artifacts** that must be completely stripped before adapting the content:

- Navigation headers (`[Skip to content]`, `Toggle theme`, `CTRL K`, navbar links).
- Website announcement banners (e.g., `<upstream-tool> has joined the Agentic AI Foundation — ...×`).
- "Copy as Markdown" / "View as Markdown" / "Open in Claude" floating menus.
- Empty fenced code blocks used as spacers (` ``` ` followed immediately by ` ``` `).
- AI assistant widgets (`Ask AI`, `<upstream-tool> assistant`, `Rate limit reached`, `Start new conversation`).
- Page navigation UI (`↑↓ navigate`, `↵ select`, `esc dismiss`).
- Feedback forms (`Was this page helpful?`, `What could be improved?`, `SkipSubmit`).
- Inline glossary/tooltip injection artifacts (e.g., `backends**Backend** A destination service...` -> `backends`).
- `![Agent](filename.md)` image references pointing to local `.md` files (broken image links).
- External service promotions (Solo MCP server, Discord invite blocks at the bottom).

The actual technical content begins **after** this header noise, typically at the first `#` heading.

### E. Link Adaptation Rules

After stripping scrape artifacts, adapt all links:

- **Internal cross-links** (relative paths like `../configuration/gateways.md` or `connect/index.md`): Convert to Docusaurus absolute paths pointing to the adapted location, e.g., `/reference/<upstream-tool>/configuration/gateways`. Remove `.md` and `.mdx` extensions from link targets as Docusaurus resolves them automatically.
- **External upstream links** (e.g., `https://example.com/docs/mcp/...`): Preserve as-is. These are valid external references.
- **Valid Remote Images**: Preserve remote images that point to valid public URLs (`https://...`).
- **Permalink anchor links** (e.g., `[Permalink for this section](https://<upstream-tool>.dev/...#anchor)`): Strip the entire `[Permalink for this section](...)` inline link — these are website-specific UI elements with no documentation value.
- **Broken local image references** (e.g., `![Agent](about.md)`): Remove entirely.

### F. Mermaid Diagram Adaptation

Source files may contain raw Mermaid diagram syntax inside plain fenced code blocks (` ```mermaid ` or plain text). When a code block contains sequence diagram syntax (e.g., `sequenceDiagram`, `participant`, `->>`, `-->>`, `alt`/`else`/`end`):

- Convert the block to use the ` ```mermaid ` language identifier so Docusaurus renders it as a diagram.
- Preserve all Mermaid syntax content exactly — do not reformat or paraphrase.

### G. Frontmatter Requirements

Every adapted file must include a proper frontmatter block:

```mdx
---
title: '<Page Title>'
description: '<One-sentence summary of what this page covers>'
sidebar_position: <integer>
---
```

Use the original page `h1` heading as the `title`. Write a concise `description` based on the page's lead paragraph. Assign `sidebar_position` sequentially within each folder.

### H. Attribution Notice

At the top of the root `intro.mdx` of the upstream docs category, include a notice crediting the original source. For example:

```mdx
:::note[Upstream Reference]
This section is an adapted mirror of the official [<Upstream Tool> documentation](https://example.com/docs/).
Content has been reformatted for Docusaurus MDX compatibility. External links and technical content are preserved faithfully.
:::
```

### I. Content Integrity

- **Never summarize, truncate, or paraphrase** the technical body content. The goal is a faithful adaptation, not a rewrite.
- **Preserve all code blocks** exactly — including YAML, JSON, bash, and protocol-buffer examples.
- **Preserve all tables** with their original column structure.
- **Do not add opinions or project-specific commentary** inside the upstream reference category. Keep the content neutral and upstream-faithful.
- If an upstream page references a feature or product that does not apply to this project (e.g., Kubernetes-specific deployment docs when the section is standalone-only), keep the content but add an `:::info[Note]` admonition clarifying the context.
