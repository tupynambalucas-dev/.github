# GitHub Markdown Patterns

This document defines the formatting, structural patterns, and content conventions for general Markdown files (`.md`, `README.md`, and skill documentation) across the monorepo.

---

## 1. Document Structure Patterns

### A. Canonical README Structure

Every package, application, or tool workspace MUST include a `README.md` at its root. Use the following structured outline:

```markdown
# Package Name or Tool Name

A concise, one-sentence explanation of what this package/tool does and its specific bounded context.

## Technology Stack

- Language: [e.g., TypeScript]
- Core Libraries: [e.g., Fastify 5, React 19]
- Styling: [e.g., Tailwind CSS v4, CSS Modules]

## Getting Started

Step-by-step instructions on how to set up, build, and run the package locally.

## Key Scripts

A table or list mapping the CLI commands defined in the package's `package.json` to their purposes:

- `pnpm dev`: Starts the local development server.
- `pnpm build`: Compiles the package for production.
- `pnpm test`: Runs unit and integration tests.

## Architecture

High-level description of the module's internal architecture, folder structure, or integrations.
```

---

## 2. Formatting and Styling Standards

### A. Semantic Line Breaks

To optimize Git diffs and make Pull Request reviews easier, follow the **semantic line break** pattern:

- End each line at a sentence boundary (e.g., after a period, question mark, or exclamation mark).
- Do not write massive paragraphs on a single line.
- Do not break lines in the middle of a sentence unless wrapping long lines (keep lines under 100 characters where possible).

### B. Heading Levels

- A document must have exactly one H1 (`#`) heading as the main title.
- Use ATX-style headings (`##`, `###`, `####`).
- Limit headings to level 4 (`####`) to maintain a clean reading hierarchy.
- Do not place links or format text (bold/italic) inside headings.

### C. Lazy Numbered Lists

For ordered instructions, use lazy numbering (`1.`) for all list items. This allows you to insert or remove steps without manual renumbering.

```markdown
1. Run the install script.
1. Configure your environment variables.
1. Start the development server.
```

### D. File and Directory References

- When mentioning a file path or directory as a link, use relative markdown links.
- **Link Formatting constraint**: NEVER wrap the entire markdown link structure in backticks (e.g., `[file.ts](./file.ts)`). This renders the literal markdown text of the link inside a code inline block, making it unclickable.
- **Monospace Styling**: If monospace formatting is required for the path or file label, place the backticks inside the brackets: `[`file.ts`](./file.ts)`. For maximum cleanliness, plain links without backticks are preferred.
- Example: Refer to `extension/packages/core/src/index.ts` for details.

### E. Unordered Lists Formatting

- Always use hyphens (`-`) instead of asterisks (`*`) or plus signs (`+`) for unordered list items to ensure consistency with our Prettier configuration and maintain a professional look.

---

## 3. Code Blocks and Technical Examples

### A. Language Declaration

All code blocks must explicitly declare the language (e.g., `typescript`, `tsx`, `bash`, `yaml`, `json`) to ensure proper syntax highlighting in editors and on GitHub.

### B. Strict Code Snippet Standards

Any code snippets written in repository documentation must strictly adhere to the project's engineering standards:

- **Strict Booleans**: Always use explicit boolean comparisons:

  ```typescript
  // Correct
  if (value === true) { ... }

  // Incorrect
  if (value) { ... }
  ```

- **Unawaited Promises**: Use the `void` operator for intentional unawaited asynchronous functions:
  ```typescript
  void notifyService();
  ```
- **React 19 Explicit JSX**: In TSX examples, always use explicit boolean/numeric comparisons:
  ```tsx
  {
    items.length > 0 && <Component />;
  }
  ```
