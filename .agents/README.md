# AI Agents Configuration Hub

The `.agents/` directory is the Bounded Context for AI behavior customization, tool integration, and knowledge routing within the workspace.

This directory is natively supported by the **Antigravity (AGY)** agent architecture and uses Domain-Driven Design (DDD) to encapsulate AI capabilities and constraints.

## Architecture

Our AI configuration is split into distinct logical units based on their lifecycle and injection behavior:

### `plugins/`

Namespaced bundles that package Skills, Rules, Hooks, and MCP Server Configurations into a single deployable unit. For example, the `cortex` plugin encapsulates the `agentgateway` MCP server connection alongside rules that teach the AI how to automatically use `firecrawl` and `context7` when requested. The `cortex-fallback` plugin provides local `pnpm`-driven instances of these same MCP servers for when the primary gateway infrastructure is offline.

### `rules/`

Guidelines and constraints that the AI must follow. These markdown files are automatically discovered and injected into the agent's context based on directory hierarchy or specific trigger conditions (e.g., enforcing TypeScript strictness or naming conventions).

### `skills/`

On-demand, progressive-disclosure markdown files that teach the agent complex multi-step workflows, runbooks, and expert personas (e.g., `agent-router-expert`, `markdown-expert`). Skills are only fully loaded into the context window when explicitly requested or triggered.

### `scripts/`

Agent-authored utility scripts (Node.js, Bash, Python) meant for repository manipulation and version-controlled automation tasks.

### `plans/`

Temporary, markdown-based plan artifacts outlining execution steps for complex tasks. These files track the progress of long-running refactors across the monorepo.

## Contribution Guidelines

1. **Self-Contained Logic**: Skills and Plugins must be 100% self-contained. Do not create relative links pointing to temporary plans or other transient context.
2. **Portability and Decoupling**: All skills, rules, and plugins must remain completely decoupled from specific host workspace names, domains, or internal folder paths so that the entire `.agents/` directory can be transferred to any project out-of-the-box.
3. **No Root Scripts**: Never place utility or scratch scripts in the root directory. Save permanent scripts to `scripts/` or use the isolated `.gemini/brain/scratch/` directory for transient execution.
