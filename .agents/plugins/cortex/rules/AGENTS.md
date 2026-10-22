# Cortex Plugin - MCP Service Instructions

> **CRITICAL AGENT INSTRUCTION (READ THIS FIRST):**
> ALL of the toolsets mentioned below (Firecrawl, GitHub, Grafana, Playwright, Context7, Memory) are **bundled under a SINGLE MCP server named `cortex_agentgateway`**.
> You MUST ALWAYS use `ServerName: "cortex_agentgateway"` when calling ANY of these tools via the `call_mcp_tool` wrapper.
> DO NOT attempt to call `ServerName: "firecrawl"`, `ServerName: "github"`, etc. They do not exist as independent servers and will fail. `cortex_agentgateway` is the ONLY valid server name for these tools.

All services below are accessed through the single AgentGateway ingress endpoint.
Do not pass credentials directly to any individual service tool.

---

## AgentGateway Routing

When multiple tools could satisfy a request, select the most specific one:

- **Web content extraction**: prefer `firecrawl_scrape` over Playwright for static pages.
- **Browser interaction or visual inspection**: use Playwright when JavaScript rendering or UI
  interaction is required.
- **Observability data**: use Grafana tools. Never query Prometheus or Loki directly.
- **Documentation lookup**: use Context7 before falling back to web search.
- **Memory and knowledge retrieval**: use Memory tools for persistent entity graphs and RAG search.

---

## Firecrawl

The Firecrawl tools (provided exclusively by the `cortex_agentgateway` MCP server) provide web scraping, crawling, searching, document parsing, and
autonomous research capabilities.

### Environment and Network Routing

- **Transparent Network Proxying**: AgentGateway automatically intercepts tools arguments and rewrites `localhost` or `127.0.0.1` to `host.docker.internal`. Agents should simply use `localhost`.
- Automatic target URL mapping for local applications (consult host workspace configuration):
  - **documentation**: `http://localhost:3002` (or configured docs port)
  - **web frontend**: `http://localhost:5173` (or configured dev server port)
  - **backend api**: `http://localhost:3000` (or configured api port)

### Tool Execution Best Practices

- **Scrape vs. Crawl**: Prefer `firecrawl_scrape` for single-page text extraction. Use
  `firecrawl_crawl` only when full multi-page site discovery is required.
- **Structured Data**: Use `firecrawl_extract` when schema-conforming JSON entity extraction is
  required from web sources.
- **Academic Research**: Use `firecrawl_research_search_papers` and `firecrawl_research_read_paper`
  for querying academic literature.

---

## GitHub

The GitHub tools (provided exclusively by the `cortex_agentgateway` MCP server) provide repository, issue, pull request, commit, and Copilot management
tools.

### Operational Rules

- **Branch Safety**: Always create a dedicated branch (`github_create_branch`) before committing
  changes or opening pull requests. Never push directly to `main` or `master`.
- **Search Before Create**: Run `github_search_issues` or `github_list_pull_requests` before
  opening new issues or PRs to prevent duplicate entries.
- **Pull Request Format**: Use Conventional Commits formatting (`feat:`, `fix:`, `docs:`) for PR
  titles and include comprehensive descriptions.

---

## Grafana

The Grafana tools (provided exclusively by the `cortex_agentgateway` MCP server) provide observability, metrics (Prometheus), logs (Loki), traces (Tempo),
and profiling (Pyroscope) tools.

### Operational Rules

- **Read-Only First**: Always perform read operations (`grafana_query_prometheus`,
  `grafana_query_loki_logs`, `grafana_tempo_get-trace`) to diagnose system state before making any
  configuration changes.
- **Log Range Boundaries**: Always specify explicit time ranges and line limits for
  `grafana_query_loki_logs` queries to prevent memory spikes.

---

## Playwright

The Playwright tools (provided exclusively by the `cortex_agentgateway` MCP server) provide headless browser automation using Chromium. Use these tools to
inspect web pages, evaluate UI layouts, and extract structural accessibility trees.

### Environment and Network Routing

- **Transparent Network Proxying**: AgentGateway automatically intercepts tools arguments and rewrites `localhost` or `127.0.0.1` to `host.docker.internal`. Agents should simply use `localhost`.
- Automatic target URL mapping for local applications (consult host workspace configuration):
  - **documentation**: `http://localhost:3002` (or configured docs port)
  - **web frontend**: `http://localhost:5173` (or configured dev server port)
  - **backend api**: `http://localhost:3000` (or configured api port)

### Tool Execution Best Practices

- **Snapshot vs. Screenshot**: Prefer `browser_snapshot` for inspecting text, DOM elements, and
  structural accessibility trees to conserve tokens. Use `browser_take_screenshot` only when visual
  layout evaluation is strictly necessary.
- **Form Filling**: Prefer `browser_fill_form` to fill multiple form inputs in a single operation
  rather than invoking `browser_type` repeatedly.
- **Resource Cleanup**: ALWAYS call `browser_close` when completing a browser testing session to
  release memory resources inside the container.

---

## Context7

The Context7 tools (provided exclusively by the `cortex_agentgateway` MCP server) provide up-to-date documentation, API references, and code snippets for
software libraries and frameworks.

### Tool Execution Best Practices

- **Library ID Resolution**: ALWAYS resolve the library ID using `context7_resolve-library-id`
  before querying documentation with `context7_query-docs`.
- **Targeted Queries**: Provide clear, specific search queries to retrieve relevant code snippets
  and official documentation.

---

## Memory

The Memory tools (provided exclusively by the `cortex_agentgateway` MCP server) provide RAG vector search, episodic chat history, entity graph management,
and document ingestion tools for persistent knowledge across sessions.

### Operational Rules

- Use Memory tools to store and retrieve entities, relationships, and session context that must
  persist across conversations.
- Always search Memory before creating new entities to avoid duplicates.
