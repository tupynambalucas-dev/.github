<context-hierarchy>
  <parent src="../AGENTS.md" type="global-rules" />
  <system-instruction>
    AGENT: You are operating in the .agents bounded context of tupynambalucas-dev/.github. If you have not read "../AGENTS.md" in this session, stop now and read it using your file-reading tools before proceeding.
  </system-instruction>
</context-hierarchy>

# Bounded Context: Organization Agent Plans & Hooks (`.agents/`)

This bounded context manages cross-repository architectural plans, corporate engineering reference archives, local lifecycle safety hooks, and agent-executed utility scripts within `tupynambalucas-dev/.github`.

> [!IMPORTANT]
> Active domain plugins (`@tupynambalucas-dev/plugin-*`), shared MCP servers (`@tupynambalucas-dev/mcp-*`), global rules, and modular `SKILL.md` assets reside exclusively in the sovereign `tupynambalucas-dev/agent-mesh` monorepo. Do not create `plugins/`, `skills/`, or `rules/` directories inside this bounded context.

---

## 1. Directory Layout

- [README.md](./README.md): Subsystem documentation and recursive navigation index.
- [hooks.json](./hooks.json): Antigravity `PreToolUse` safety gate blocking ad-hoc script creation in repository roots.
- [plans/](./plans/README.md): Cross-repository architectural specifications, master plans, and migration runbooks.
- [references/](./references/README.md): Preserved corporate governance guides and external platform reference archives.
- [scripts/](./scripts/): Permanent utility and hook enforcement scripts executed by AI agents:
  - [prevent-root-scripts.js](./scripts/prevent-root-scripts.js): `PreToolUse` hook handler denying root-level scratch script creation.
  - [fix.cjs](./scripts/fix.cjs): Document normalization helper script.
  - [split-yamls.cjs](./scripts/split-yamls.cjs): Multi-document YAML manifest splitter utility.

---

## 2. Operational & Security Guardrails

1. **Root Script Prohibition**: Agents MUST NEVER create temporary or utility scripts (e.g., `scratch.js`, `update.ps1`) in any repository root. Store permanent repository automation in [scripts/](./scripts/) and transient scratch files in the isolated `.gemini/antigravity-cli/brain/<conversation-id>/scratch/` directory.
2. **Sovereign Capability Boundary**: Reusable skills, rules, and MCP configurations MUST be authored in `tupynambalucas-dev/agent-mesh`, never duplicated locally inside `.github/.agents/`.
3. **Link Hygiene in Plans**: Architectural plans in [plans/](./plans/README.md) MUST use relative paths for intra-repository references and canonical `https://github.com/tupynambalucas-dev/<repo>` URLs for external repositories. Machine-specific `file:///` links are strictly prohibited.

---

## 3. Required Skills

- **`router-architect`** (`@tupynambalucas-dev/plugin-atelier`): Authoring or auditing `AGENTS.md` context routers.
- **`hook-architect`** (`@tupynambalucas-dev/plugin-atelier`): Updating or validating [hooks.json](./hooks.json) and hook scripts.
- **`readme-architect`** (`@tupynambalucas-dev/plugin-repo`): Maintaining [README.md](./README.md) and child directory navigation indexes.
