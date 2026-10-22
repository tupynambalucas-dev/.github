<context-hierarchy>
  <parent src="../AGENTS.md" type="global-rules" />
  <system-instruction>
    AGENT: You are operating in the .agents bounded context. If you have not read "../AGENTS.md" in this session, stop now and read it using your file-reading tools before proceeding.
  </system-instruction>
</context-hierarchy>

# Bounded Context: .agents

This bounded context ([.agents/](./)) manages the lifecycle, personas, tools, and domain-specific knowledge for AI agents operating within the repository. It strictly adheres to the Antigravity (AGY) customization architecture.

---

## 1. Directory Architecture

- **[plans/](./plans/)**: Temporary, markdown-based execution plans for complex refactors.
- **[plugins/](./plugins/)**: Bundled MCP (Model Context Protocol) definitions, server lifecycle configs, and associated rules (e.g., the `cortex` plugin routing to `cortex_agentgateway`).
- **[rules/](./rules/)**: Global or localized markdown constraints that are automatically injected into the agent's context based on location or trigger conditions.
- **[scripts/](./scripts/)**: MUST be used ONLY for utility scripts (Node.js, Bash) that are executed by AI agents (both temporary and permanent). Human-operated scripts do not belong here.
- **[skills/](./skills/)**: Self-contained Markdown instruction files defining expert personas, validation workflows, and multi-step runbooks. Loaded on demand via progressive disclosure.

---

## 2. Agent Constraints

1. **Root Script Ban**: Agents MUST NEVER create temporary or utility scripts (e.g., `scratch.js`, `update.js`) directly in the monorepo root.
2. **Script Location**: The [scripts/](./scripts/) directory is STRICTLY for scripts executed by AI agents (temporary or permanent). Agents MUST save their scripts here instead of the root directory. Transient scripts can optionally be saved in the agent's isolated `brain/scratch/` directory.
3. **Cross-Boundary References**: Customizations inside [skills/](./skills/) or [plugins/](./plugins/) MUST be 100% self-contained. They MUST NOT contain relative links pointing to transient folders like [plans/](./plans/).
4. **Plugin Encapsulation**: Any new MCP server integration MUST be encapsulated inside a named plugin directory within [plugins/](./plugins/) containing a `plugin.json` and `mcp_config.json`.
5. **Concrete Nomenclature**: All contextual configurations MUST use concrete project names and identifiers appropriate to the host repository. Avoid introducing unresolved template placeholder tokens unless the host workspace explicitly utilizes an AST templating engine.
6. **Environment Variables**: When generating or updating `.env.example` files, agents MUST replace all sensitive values with explicit uppercase placeholders matching the key name (e.g., `API_KEY=<YOUR_API_KEY>`). Agents MUST use native shell regex tools (e.g., `sed` or PowerShell `-replace`) to scrub these files and MUST NEVER use inline Node.js scripts parsing multiline strings, as cross-platform line-ending issues cause silent failures and secret leaks.
7. **MCP Fallback Routing**: When the primary `cortex_agentgateway` (provided by the [cortex](./plugins/cortex/) plugin) or its MCP services return connection errors or are offline due to the infrastructure being down, agents MUST automatically fallback to using the local MCP tools provided by the [cortex-fallback](./plugins/cortex-fallback/) plugin.

---

## 3. Required Skill

When creating, updating, or analyzing custom Agent Skills within this bounded context, agents MUST activate the `skill-expert` skill by name before beginning.

---

## 4. Documentation Rules (Diátaxis Framework)

When agents author technical documentation in the repository:

1. **Diátaxis Framework**: Documentation intended for knowledge portals or documentation hubs SHOULD be structured into four quadrants (`tutorials`, `guides`, `reference`, `explanation`). Activate the `docusaurus-expert` skill when managing Docusaurus-based knowledge bases.
2. **Documentation Formatting**: Follow strict Markdown/MDX formatting standards, avoiding broken links and preserving document structure. Activate the `markdown-expert` skill when managing general repository documentation.
