# Cortex Fallback Plugin

This plugin provides localized execution of Model Context Protocol (MCP) servers (Firecrawl
and Context7) when the primary `cortex_agentgateway` infrastructure is offline or undergoing
maintenance.

---

## Components

- **Manifest**: [plugin.json](./plugin.json)
- **MCP Configuration**: [mcp_config.json](./mcp_config.json)
- **Rules**: [rules/fallback-rule.md](./rules/fallback-rule.md)

---

## Operational Scope

When the primary gateway fails to connect, agents automatically fail over to the local tools
defined in this plugin:

- **Firecrawl Fallback**: Executes local scraping or crawling via standard Node.js wrappers.
- **Context7 Fallback**: Executes direct Context7 API documentation queries.
