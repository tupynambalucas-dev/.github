<context-hierarchy>
  <parent src="../AGENTS.md" type="global-rules" />
  <system-instruction>
    AGENT: You are operating in the profile bounded context. If you have not read
    "../AGENTS.md" in this session, stop now and read it before proceeding.
  </system-instruction>
</context-hierarchy>

# Bounded Context: profile

This bounded context ([profile/](./)) manages the public GitHub Organization profile, brand
presentation copy, and visual assets rendered on the organization's public landing page at
`https://github.com/tupynambalucas-dev`.

---

## 1. Directory Structure

- **[README.md](./README.md)**: Public organization profile markdown document rendered directly by
  GitHub on the organization overview page.
- **[assets/](./assets/)**: Official brand SVG logos, monochrome variants, and visual marks.
  - [logo-horizontal-positive.svg](./assets/logo-horizontal-positive.svg):
    Light-theme horizontal logo.
  - [logo-horizontal-negative.svg](./assets/logo-horizontal-negative.svg):
    Dark-theme horizontal logo.
  - [logo-horizontal-multicolor.svg](./assets/logo-horizontal-multicolor.svg):
    Multicolor brand logo.
  - [logo-mark-blue.svg](./assets/logo-mark-blue.svg): Standalone isotype mark in primary blue.

---

## 2. Profile Content and Visual Guardrails

1. **Dual-Theme Support**: All embedded image assets in [README.md](./README.md) MUST use the
   HTML5 `<picture>` tag with `(prefers-color-scheme: dark)` and `(prefers-color-scheme: light)`
   media queries to ensure seamless appearance across dark and light GitHub themes.
2. **Relative Media Links**: Internal media in the profile MUST use relative links pointing to
   the local `./assets/` directory.
3. **Verbal Register**: Profile copy must maintain a senior, technical, and objective register.
   Avoid marketing hyperbole, unverified claims, or informal slang.
4. **Zero Emojis**: Emojis are strictly prohibited in all headings, body text, bullet points,
   and badges.
5. **No Placeholders**: Never publish placeholder tokens, upcoming features without substance,
   or empty sections.
6. **Prettier Compliance**: All markdown must adhere to 2-space indentation, max 100-character
   line width, and standard GFM syntax.

---

## 3. Required Skill

When editing or updating documentation in this bounded context, agents MUST activate the following
skill by name:

- **`markdown-expert`**
