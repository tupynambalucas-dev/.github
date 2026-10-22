# MDX & Docusaurus Syntax Reference

This reference outlines MDX syntax standards and native Docusaurus v3 features used in the monorepo.

---

## 1. Docusaurus Admonitions (Alerts)

Instead of generic GitHub flavored markdown quote alerts (`> [!NOTE]`), Docusaurus uses a dedicated triple-colon syntax (`:::`) to render stylized banners.

Supported types: `note`, `tip`, `info`, `caution`, `danger` (or `warning`).

```markdown
:::note
Here is some standard note content.
:::

:::tip[Custom Title]
You can define a custom title for the admonition by adding it in brackets next to the type.
:::

:::danger[Critical Warning]
Use danger admonitions sparingly for production risks or potential data loss.
:::
```

---

## 2. Interactive Multi-Tabs

Use the native `@theme/Tabs` and `@theme/TabItem` components for comparing instructions, scripts, or configurations.

```mdx
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="dev" label="Development" default>

    Development configurations or commands.

  </TabItem>
  <TabItem value="staging" label="Staging">

    Staging configurations or commands.

  </TabItem>
  <TabItem value="prod" label="Production">

    Production configurations or commands.

  </TabItem>
</Tabs>
```

> [!IMPORTANT]
> When nesting Markdown content (such as lists or headings) inside `<TabItem>`, adhere strictly to these spacing and indentation rules to avoid MDX parsing, tag mismatch, and formatting drift:
>
> 1. **Tag Indentation**: Indent `<TabItem>` tags by 2 spaces relative to `<Tabs>`.
> 2. **Content Indentation**: Indent all Markdown lines inside the `<TabItem>` block by 4 spaces.
> 3. **Empty Lines (Above and Below Content)**: Prettier automatically inserts a single blank line immediately after the opening `<TabItem>` tag and a single blank line immediately before the closing `</TabItem>` tag. Always include exactly one blank line both above and below the inner content to prevent formatting drift.

---

## 3. Code Block Highlights & Metadata

### A. Title/Filename Headers

To display a filename or title above a code block, use the `title="..."` key in the code block definition:

```typescript title="packages/core/src/types/index.ts"
export type BoundedContext = 'extension' | 'studio';
```

### B. Line Highlighting

To highlight specific lines within a code block, use curly braces `{...}` specifying 1-indexed lines or line ranges:

```typescript title="api/src/server.ts" {2,5-7}
import fastify from 'fastify';
const app = fastify(); // Highlighted

// Lines 5, 6, and 7 will be highlighted:
app.get('/health', async () => {
  return { status: 'ok' };
});
```

### C. Inline Comments Highlighting

You can also use inline comments within the code block to highlight lines automatically:

```typescript
// highlight-next-line
const secret = process.env.API_SECRET;

// highlight-start
const config = {
  port: 3000,
};
// highlight-end
```

---

## 4. JSX Elements and MDX Parsing Rules

MDX blends markdown with standard JSX. Keep the following parsing rules in mind to avoid compilation failures:

### A. Markdown inside JSX block tags

To write standard Markdown within block elements (such as `<div>` or `<section>`), separate the markdown content with blank lines:

```mdx
<div className="custom-box">

**This is bold markdown** inside a HTML div tag.

</div>
```

### B. Escaping Special Characters

Characters like `{` and `<` trigger the MDX parser for expressions or JSX. To display them as literal text, they must be escaped:

- Escape curly braces: `\{` and `\}`
- Escape less-than signs: `\<`

### C. Comments

Standard HTML comments (`<!-- -->`) are **not** valid in MDX. Use JavaScript comment syntax inside curly braces:

```mdx
{/* This is a single or multi-line comment in MDX */}
```

---

## 5. Prettier Formatting Standards

All MDX files are automatically formatted by Prettier on pre-commit. To prevent formatting issues, your manual edits must align with the root Prettier formatting rules:

- **Indentation**: Explicit 2-space indentation for document layout, list nesting, and JSX wrapper structures.
- **Line Width**: Word wrap prose to keep lines under 100 characters. Long URLs or code symbols that cannot be split are exempted.
- **Code Block Formatting**: Code blocks embedded within MDX must match the project's Prettier style:
  - `semi: true`: Always use semicolons in JavaScript/TypeScript blocks.
  - `singleQuote: true`: Use single quotes for strings (except double quotes in JSX tags).
  - `trailingComma: "all"`: Enforce trailing commas for objects, arrays, and parameters.
  - `arrowParens: "always"`: Enforce parentheses around arrow function arguments (e.g. `(arg) => {}`).
- **Unordered Lists**: Use hyphens (`-`) for unordered lists. Asterisks (`*`) and plus signs (`+`) are forbidden.
