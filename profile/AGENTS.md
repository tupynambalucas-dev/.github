<context-hierarchy>
  <parent src="../AGENTS.md" type="global-rules" />
  <system-instruction>
    AGENT: You are operating in the profile bounded context. If you have not read "../AGENTS.md" in this session, stop now and read it using your file-reading tools before proceeding.
  </system-instruction>
</context-hierarchy>

# Bounded Context: Organization Profile (`profile/`)

This bounded context manages the public GitHub Organization profile, brand presentation copy, and official vector assets rendered directly on `https://github.com/tupynambalucas-dev`.

---

## 1. Directory Layout

- [README.md](./README.md): Public organization landing page rendered natively by GitHub on the `@tupynambalucas-dev` overview page.
- [assets/](./assets/): Official brand SVG logos, monochrome variants, and standalone marks:
  - [logo-horizontal-multicolor.svg](./assets/logo-horizontal-multicolor.svg): Primary multicolor horizontal wordmark.
  - [logo-horizontal-positive.svg](./assets/logo-horizontal-positive.svg): Light-theme horizontal wordmark.
  - [logo-horizontal-negative.svg](./assets/logo-horizontal-negative.svg): Dark-theme horizontal wordmark.
  - [logo-mark-blue.svg](./assets/logo-mark-blue.svg): Standalone isotype mark in primary blue.
  - [logo-mark-pink.svg](./assets/logo-mark-pink.svg): Standalone isotype mark in accent pink.
  - [logo-mark-purple.svg](./assets/logo-mark-purple.svg): Standalone isotype mark in accent purple.
  - [logo-mark-positive.svg](./assets/logo-mark-positive.svg): Light-theme monochrome isotype mark.
  - [logo-mark-negative.svg](./assets/logo-mark-negative.svg): Dark-theme monochrome isotype mark.
  - [logo-mark-quad-blue.svg](./assets/logo-mark-quad-blue.svg): Quad-grid variant mark in blue.
  - [logo-mark-quad-purple.svg](./assets/logo-mark-quad-purple.svg): Quad-grid variant mark in purple.

---

## 2. Operational & Visual Guardrails

1. **Public Landing Page Integrity**: `README.md` in this directory is NOT an internal package README; GitHub renders it verbatim on the public organization page. Preserve its executive overview, architecture diagram, and technology stack structure.
2. **Dual-Theme Asset Rendering**: Embedded brand images in [README.md](./README.md) MUST use HTML5 `<picture>` elements with `(prefers-color-scheme: dark)` and `(prefers-color-scheme: light)` media queries for seamless rendering across GitHub themes.
3. **Relative Asset Resolution**: Visual assets referenced inside [README.md](./README.md) MUST use relative paths pointing to `./assets/`.
4. **Executive Register**: Maintain an authoritative, objective engineering register free of marketing hyperbole or unverified claims.

---

## 3. Required Skills

- **`readme-architect`** (`@tupynambalucas-dev/plugin-repo`): Active when updating Markdown structure, tables, or Mermaid diagrams in [README.md](./README.md).
- **`router-architect`** (`@tupynambalucas-dev/plugin-atelier`): Active when updating this `AGENTS.md` context router.
