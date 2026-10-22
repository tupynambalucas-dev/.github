# MCP servers

Connect agentgateway to MCP servers using various transports

Agentgateway supports connecting to MCP servers via multiple transport protocols. Choose the
transport that best fits your deployment model.

## Why use agentgateway with MCP Servers?

| Without agentgateway                | With agentgateway                                 |
| ----------------------------------- | ------------------------------------------------- |
| Direct client-to-server connections | Centralized gateway for all MCP traffic           |
| No authentication layer             | External authentication (OAuth2, Tailscale, etc.) |
| No observability                    | Full OpenTelemetry tracing and metrics            |
| No rate limiting                    | Per-client and per-tool rate limits               |
| No access control                   | Fine-grained authorization policies               |
| Clients must handle each transport  | Unified endpoint for all transports               |

## Learn more

- [MCP Connectivity Guide](../../mcp/index.md)
- [MCP Authentication](../../mcp/mcp-authn.md)
- [MCP Authorization](../../mcp/mcp-authz.md)

[stdio Transport

Connect agentgateway to local process-based MCP servers](stdio.md)[SSE Transport

Connect agentgateway to MCP servers via Server-Sent Events](sse.md)[Streamable HTTP Transport

Connect agentgateway to MCP servers via HTTP with streaming](streamable-http.md)

[MCP clients](/docs/standalone/latest/integrations/mcp-clients/ 'MCP clients')[Networking](/docs/standalone/latest/integrations/networking/ 'Networking')

Was this page helpful?
