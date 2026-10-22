# Knowledge Base Documentation Workflow

This reference defines the compilation, localization, and single-pass alignment validation protocols for Docusaurus Knowledge Bases.

---

## 1. i18n Translation Protocol

To support multi-language parity when internationalization is enabled, follow these rules:

- **Parity Check**: For every modified or new source document, maintain parity with localized files under `<docs-root>/i18n/<locale>/` in the corresponding plugin subdirectory.
- **Unescaped Elements**: Frontmatter keys, JSX component names, JSX props, and custom code block variables must be left untranslated.

---

## 2. Deferred Validation Pipeline

To optimize execution and avoid redundant checks, you MUST NOT run formatting, linting, typechecking, or compilation commands during intermediate edits. Batch all file creations and modifications, then execute this pipeline from the repository root:

### Step 1: Prettier Formatting Check

Verify and fix MDX formatting using Prettier:

```bash
# Verify formatting for all changed MDX/Markdown files
pnpm exec prettier --check "<docs-root>/**/*.mdx"

# Fix formatting if errors are found
pnpm exec prettier --write "<docs-root>/**/*.mdx"
```

### Step 2: MDX & Code Linting

Run the linter to validate MDX syntax, JS/TS segments, and code blocks:

```bash
pnpm --filter <docs-package> lint
```

### Step 3: TypeScript Validation

Ensure type-safety of custom TS/JSX components, config files, and loaders:

```bash
pnpm --filter <docs-package> typecheck
```

### Step 4: Ensure Free Development Port

Before running a production build, verify that no conflicting development servers are actively holding the documentation port. Stop any running local dev processes if necessary.

### Step 5: Execute Production Build & Link Checking

Run the full production compilation to verify pages and find any broken links or MDX parsing errors:

```bash
pnpm --filter <docs-package> build
```

Verify that the command exits with code `0`. Any broken markdown links or unresolved components will trigger a throw, halting the build.

---

## 3. Post-Task Guardrails

- **No Dev Server Auto-Start**: Do NOT start long-running development servers (`dev` or `preview` commands) after completing changes. The skill's verification process ends with a successful production build test.
