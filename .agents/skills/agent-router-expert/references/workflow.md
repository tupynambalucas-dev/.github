# AI Agents Context Validation Workflow

This reference defines the verification steps required when creating, updating, or correcting `AGENTS.md` files across the monorepo.

---

## 1. Context Verification

### A. Directory Depth Check

- Ensure that the local `AGENTS.md` is placed precisely at the workspace root or Bounded Context directory root.
- Validate that all relative links (`[label](./path)`) resolve correctly by checking the path depth (e.g. from `extension/apps/api/AGENTS.md`, the root is reached via `../../../`).

### B. Catalog Alignment

- Verify that `AGENTS.md` files in applications (`services/api`, `services/web`) correctly refer to the pnpm Catalogs mapping of dependencies.

### C. Context Hierarchy Directive Check

- Verify that every Layer-2 and Layer-3 file has a `<context-hierarchy>` block as its first content (before the H1 heading).
- Verify that the `src` attributes in the directive resolve to existing `AGENTS.md` files using the relative path from the current file.
- Verify that the `<system-instruction>` uses imperative language.

### D. Required Skills Audit

- Verify that the root `/AGENTS.md` declares both `agent-router-expert` and `markdown-expert` in a `Required Skills` section.
- Verify that workspaces managing specialized documentation (e.g., Docusaurus portals) declare the appropriate skill (e.g., `docusaurus-expert`) in a `Required Skill` section.
- Verify that all skill references use skill names only. The presence of any filesystem path (e.g., `.agents/skills/`, `../skills/`) in a skill declaration is a blocking violation.
- Verify that Layer-3 files do NOT contain skill declarations (they inherit from parents).

---

## 2. Formatting and Rules Check

### A. Zero Emojis

- **Critical Audit**: Check all headings, bullet points, and descriptions for emojis. Emojis are strictly forbidden in `AGENTS.md` files. All headings must use plain text (e.g. `## Bounded Context Navigation` instead of `## [Emoji] Bounded Context Navigation`).

### B. Zero Placeholders

- Verify that no sections contain "TODO", "TBD", or empty bullet points. If a configuration or stack service is not yet defined, omit the section.

### C. Language Check

- Enforce strict US English (en-US) for all documentation prose, lists, and code examples in the context files.

### D. LLM-Optimized Checklist

- **Relative Links**: Verify that every referenced file, folder, schema, or configuration has a clickable relative markdown link. Ensure there are no absolute file system paths or external web URLs present inside the file. Localhost dev links (e.g. `http://localhost:3000`) are acceptable in running commands examples only.
- **Phrasing Check**: Verify that instructions use imperative, rule-based constraints ("MUST", "NEVER", "ALWAYS") instead of passive or descriptive phrasing.
- **Redundancy Audit**: Verify that global rules (English-First, Zero Emojis, Zero Placeholders) are NOT duplicated in local sub-workspace `AGENTS.md` files.
- **Snippet Audit**: Verify that the files include copy-pasteable blocks demonstrating patterns rather than just raw descriptions.

### E. Prettier Alignment

- Validate that the file complies with the formatting standards. Use `pnpm exec prettier --check <file>` or format with `pnpm exec prettier --write <file>`.

### F. Line Budget Check

- Count the total lines of the modified `AGENTS.md` file.
- Layer 1 (root): MUST NOT exceed 80 lines.
- Layer 2 (bounded context): MUST NOT exceed 120 lines.
- Layer 3 (sub-domain): MUST NOT exceed 100 lines.
- If the budget is exceeded, extract code snippets to an `.agents/` hidden subdirectory (e.g., `.agents/architecture.md`) and replace the inline block with a relative markdown link.
