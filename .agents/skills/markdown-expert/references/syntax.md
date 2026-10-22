# GFM Syntax (GitHub Flavored Markdown)

Technical reference for writing and formatting Markdown files within the the workspace.

## Headings

Use one to six `#` characters followed by a space to create headings.

### Syntax

```markdown
# Heading Level 1

## Heading Level 2

### Heading Level 3

#### Heading Level 4

##### Heading Level 5

###### Heading Level 6
```

### Rendered Preview

#### Heading Level 4 (Example)

##### Heading Level 5 (Example)

###### Heading Level 6 (Example)

---

## Text Formatting

### Syntax and Rendered Preview

| Style         | Syntax                       | Example                  | Rendered Preview       |
| :------------ | :--------------------------- | :----------------------- | :--------------------- |
| Bold          | `**text**` or `__text__`     | `**Bold text**`          | **Bold text**          |
| Italic        | `*text*` or `_text_`         | `_Italic text_`          | _Italic text_          |
| Strikethrough | `~~text~~`                   | `~~Strikethrough text~~` | ~~Strikethrough text~~ |
| Bold & Italic | `**_text_**` or `***text***` | `**_Bold and italic_**`  | **_Bold and italic_**  |
| Subscript     | `<sub>text</sub>`            | `H<sub>2</sub>O`         | H<sub>2</sub>O         |
| Superscript   | `<sup>text</sup>`            | `X<sup>2</sup>`          | X<sup>2</sup>          |
| Underline     | `<ins>text</ins>`            | `<ins>Underlined</ins>`  | <ins>Underlined</ins>  |

---

## Blockquotes

Use the `>` character before lines of quoted text. Blockquotes can also be nested.

### Syntax

```markdown
Text that is not a quote

> This is a blockquote.
>
> > This is a nested blockquote.
```

### Rendered Preview

Text that is not a quote

> This is a blockquote.
>
> > This is a nested blockquote.

---

## Code

### Inline Code

Use a single backtick to wrap inline code or commands.

#### Syntax

```markdown
Use `git status` to view changes.
```

#### Rendered Preview

Use `git status` to view changes.

### Fenced Code Blocks

Use triple backticks to create standalone code blocks. Optionally, specify the language for syntax highlighting.

#### Syntax

````markdown
```typescript
const app = 'workspace';
console.log(app);
```
````

#### Rendered Preview

```typescript
const app = 'workspace';
console.log(app);
```

---

## Color Previews (Supported in Issues/PRs/Discussions)

Using backticks on supported color formats displays a color preview bubble on GitHub.

### Syntax

```markdown
HEX: `#0969DA`
RGB: `rgb(9, 105, 218)`
HSL: `hsl(212, 92%, 45%)`
```

### Rendered Preview

HEX: `#0969DA`
RGB: `rgb(9, 105, 218)`
HSL: `hsl(212, 92%, 45%)`

---

## Links

### Inline Links

Wrap the text in square brackets `[ ]` and the URL in parentheses `( )`.

#### Syntax

```markdown
[GitHub](https://github.com)
```

#### Rendered Preview

[GitHub](https://github.com)

### Relative Links

Relative paths can be used to link to files within the repository.

> [!IMPORTANT]
> **Prohibited Absolute Paths**: Do not use absolute filesystem paths or local protocol URLs (e.g.,
> file scheme paths like `/absolute/path/to/docs/CONTRIBUTING.md` or similar). You must always use
> relative paths starting with `./` or `../` (or simply `path/to/file` if resolving from the
> current directory) or fully-qualified public web URLs with explicit domains (e.g.,
> `https://example.com/`).

#### Syntax

```markdown
[Contribution Guide](docs/CONTRIBUTING.md)
[Parent Directory Guide](../README.md)
```

[Contribution Guide](docs/CONTRIBUTING.md)  
[Parent Directory Guide](../README.md)

### Clickable Link Formatting

To ensure links render correctly as clickable hyperlinks in markdown previewers and are interactive for both humans and AI agents:

- **Do Not Wrap Links in Backticks**: Never surround the entire markdown link structure with backticks (e.g., `[label](path)`). This turns the hyperlink structure into a code literal block, disabling the click capability.
- **Styling Labels**: If a label (such as a file name or directory name) needs code block formatting, place the backticks inside the brackets: `[`label`](path)`.

### Section Anchors

Link directly to section headings using generated anchors:

- Conversion to lowercase.
- Spaces replaced with hyphens (`-`).
- Punctuation characters are removed.
- Duplicate anchors append an incrementing suffix (e.g., `-1`).

#### Syntax

```markdown
[Link to Headings](#headings)
```

#### Rendered Preview

[Link to Headings](#headings)

### Custom Anchors

Define a custom anchor point anywhere in the document using an HTML anchor tag.

#### Syntax

```markdown
<a name="custom-anchor"></a>
This is target text.

[Go to Target](#custom-anchor)
```

#### Rendered Preview

<a name="custom-anchor"></a>
This is target text.

[Go to Target](#custom-anchor)

---

## Images

Wrap alt text in `[ ]` prefixed with an exclamation mark `!`, followed by the image path/URL in `( )`.

### Syntax

```markdown
![Alt text](path/to/image.png)
```

### Rendered Preview

![Alt text](path/to/image.png)

---

## Lists

### Unordered Lists

Use hyphens (`-`) followed by a space. Do not use asterisks (`*`) or plus signs (`+`) for unordered list items to ensure consistency with our Prettier configuration.

#### Syntax

```markdown
- Item 1
- Item 2
  - Nested Item 2a
```

#### Rendered Preview

- Item 1
- Item 2
  - Nested Item 2a

### Ordered Lists

Precede each line with a number and a period.

#### Syntax

```markdown
1. First item
2. Second item
```

#### Rendered Preview

1. First item
2. Second item

### Task Lists

Create checkboxes using `[ ]` for pending and `[x]` for completed tasks.

#### Syntax

```markdown
- [x] Completed task
- [ ] Pending task
```

#### Rendered Preview

- [x] Completed task
- [ ] Pending task

---

## Mentions and References

GitHub automatically links mentions and issue/PR references.

### Syntax

```markdown
Mention User/Team: @username or @org/team-name
Reference Issue/PR: #123
```

### Rendered Preview

Mention User/Team: @username or @org/team-name  
Reference Issue/PR: #123

---

## Footnotes

Add footnotes using `[^identifier]` for the inline reference and `[^identifier]: content` for the footnote definition.

### Syntax

```markdown
Here is a footnote[^1].

[^1]: Footnote content placed at the bottom.
```

### Rendered Preview

Here is a footnote[^1].

[^1]: Footnote content placed at the bottom.

---

## Line Breaks

In `.md` files, a line break requires:

- Two trailing spaces.
- A trailing backslash `\`.
- An HTML `<br/>` tag.

### Syntax

```markdown
First line with two spaces  
Second line

First line with backslash\
Second line

First line with tag<br/>
Second line
```

### Rendered Preview

First line with two spaces  
Second line

First line with backslash\
Second line

First line with tag<br/>
Second line

---

## Alerts (Admonitions)

GFM blockquote-based alerts render with distinct styling and icons on GitHub and VS Code Preview.

### Syntax

```markdown
> [!NOTE]
> Useful information that users should know.

> [!TIP]
> Helpful advice for doing things better or more easily.

> [!IMPORTANT]
> Key information users need to know to achieve their goal.

> [!WARNING]
> Urgent info that needs immediate user attention to avoid problems.

> [!CAUTION]
> Advises about risks or negative outcomes of certain actions.
```

### Rendered Preview

> [!NOTE]
> Useful information that users should know.

> [!TIP]
> Helpful advice for doing things better or more easily.

> [!IMPORTANT]
> Key information users need to know to achieve their goal.

> [!WARNING]
> Urgent info that needs immediate user attention to avoid problems.

> [!CAUTION]
> Advises about risks or negative outcomes of certain actions.

---

## Comments

Hide content in the rendered output using HTML comment syntax.

### Syntax

```markdown
<!-- Hidden content -->
```

### Rendered Preview

(There is a hidden comment below this line, which is invisible in the rendered output)

<!-- Hidden content -->

---

## Escaping Characters

Prevent Markdown parsing by escaping characters with a backslash `\`.

### Syntax

```markdown
\*This is not italic\*
```

### Rendered Preview

\*This is not italic\*

---

## Prettier Formatting Standards

All Markdown files are formatted by Prettier on pre-commit. To ensure your modifications do not cause conflicts or formatting drift, align with the root Prettier formatting rules:

- **Indentation**: Standard 2-space indentation for list nesting, blockquotes, and HTML tags.
- **Line Width**: Word wrap prose to keep lines under 100 characters where possible.
- **Unordered Lists**: Always use hyphens (`-`) for unordered lists. Asterisks (`*`) and plus signs (`+`) are strictly forbidden.
- **Code Block Formatting**: JavaScript/TypeScript code snippets inside fenced code blocks must comply with:
  - `semi: true` (always use semicolons)
  - `singleQuote: true` (use single quotes for strings)
  - `trailingComma: "all"` (enforce trailing commas)
  - `arrowParens: "always"` (parentheses around arrow function arguments)
