# bradlc.vscode-tailwindcss

## Settings

### `tailwindcss-intellisense.trace.server`

Traces the communication between VS Code and the Tailwind CSS Language Server.

- **Default**: `"off"`

### `tailwindCSS.classAttributes`

The HTML attributes for which to provide class completions, hover previews, linting etc.

- **Default**:
  ```json
  ["class", "className", "ngClass", "class:list"]
  ```

### `tailwindCSS.classFunctions`

The function or tagged template literal names for which to provide class completions, hover previews, linting etc.

- **Default**: `[]`

### `tailwindCSS.codeActions`

Enable code actions.

- **Default**: `true`

### `tailwindCSS.codeLens`

Enable code lens.

- **Default**: `true`

### `tailwindCSS.colorDecorators`

Controls whether the editor should render inline color decorators for Tailwind CSS classes and helper functions.

- **Default**: `true`

### `tailwindCSS.emmetCompletions`

Enable class name completions when using Emmet-style syntax, for example div.bg-red-500.uppercase

- **Default**: `false`

### `tailwindCSS.experimental.classRegex`

- **Default**: `[]`

### `tailwindCSS.experimental.configFile`

Manually specify the Tailwind config file or files that should be read to provide IntelliSense features.
Can either be a single string value, or an object where each key is a config file path and each value is a glob or array of globs representing the set of files that the config file applies to.

- **Default**: `null`

### `tailwindCSS.files.exclude`

Configure glob patterns to exclude from all IntelliSense features.
Inherits all glob patterns from the `#files.exclude#` setting.

- **Default**:
  ```json
  ["**/.git/**", "**/node_modules/**", "**/.hg/**", "**/.svn/**"]
  ```

### `tailwindCSS.hovers`

Enable hovers.

- **Default**: `true`

### `tailwindCSS.includeLanguages`

Enable features in languages that are not supported by default.
Add a mapping here between the new language and an already supported language.
E.g.: `{"plaintext": "html"}`

- **Default**: `{}`

### `tailwindCSS.inspectPort`

Enable the Node.js inspector agent for the language server and listen on the specified port.

- **Default**: `null`

### `tailwindCSS.lint.cssConflict`

Class names on the same HTML element which apply the same CSS property or properties.

- **Default**: `"warning"`

### `tailwindCSS.lint.invalidApply`

Unsupported use of the `@apply` directive.

- **Default**: `"error"`

### `tailwindCSS.lint.invalidConfigPath`

Unknown or invalid path used with the theme helper.

- **Default**: `"error"`

### `tailwindCSS.lint.invalidScreen`

Unknown screen name used with the `@screen` directive.

- **Default**: `"error"`

### `tailwindCSS.lint.invalidTailwindDirective`

Unknown value used with the `@tailwind` directive.

- **Default**: `"error"`

### `tailwindCSS.lint.invalidVariant`

Unknown variant name used with the `@variants` directive.

- **Default**: `"error"`

### `tailwindCSS.lint.recommendedVariantOrder`

Class variants not in the recommended order (applies in JIT mode only).

- **Default**: `"warning"`

### `tailwindCSS.lint.suggestCanonicalClasses`

Indicate when utilities may be written in a more optimal form.

- **Default**: `"warning"`

### `tailwindCSS.lint.usedBlocklistedClass`

Usage of class names that have been blocklisted via `@source` not inline(…).

- **Default**: `"warning"`

### `tailwindCSS.rootFontSize`

Root font size in pixels.
Used to convert rem CSS values to their px equivalents.
See `#tailwindCSS.showPixelEquivalents#`.

- **Default**: `16`

### `tailwindCSS.showPixelEquivalents`

Show px equivalents for rem CSS values.

- **Default**: `true`

### `tailwindCSS.suggestions`

Enable autocomplete suggestions.

- **Default**: `true`
