# Cortex Plugin

This plugin provides integration with the centralized Cortex `AgentGateway` MCP proxy,
bundling multiple Model Context Protocol services under a unified ingress endpoint.

---

## Components

- **Manifest**: [plugin.json](./plugin.json)
- **MCP Configuration**: [mcp_config.json](./mcp_config.json)
- **Rules**: [rules/AGENTS.md](./rules/AGENTS.md)

---

## MCP Server Routing

All service toolsets (Firecrawl, GitHub, Grafana, Playwright, Context7, and Memory) are accessed
through the single MCP server named `cortex_agentgateway`.

| Service Toolset | Target Capabilities                                              |
| :-------------- | :--------------------------------------------------------------- |
| **Firecrawl**   | Web scraping, crawling, structured data extraction, and search. |
| **GitHub**      | Repository inspection, issue management, and pull requests.      |
| **Grafana**     | Observability queries (Prometheus, Loki, Tempo, Pyroscope).      |
| **Playwright**  | Headless Chromium browser automation and DOM accessibility trees.|
| **Context7**    | Up-to-date documentation retrieval for external libraries.       |
| **Memory**      | Persistent semantic entity graphs and vector RAG retrieval.      |
