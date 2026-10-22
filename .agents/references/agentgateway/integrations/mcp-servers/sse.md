# SSE Transport

Connect agentgateway to MCP servers via Server-Sent Events

Server-Sent Events (SSE) transport allows agentgateway to connect to remote MCP servers over HTTP
with real-time streaming responses.

## Overview

SSE transport is useful when:

- MCP servers run as standalone HTTP services
- You need real-time streaming of responses
- The server is accessible over the network

## Configuration

```
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
mcp:
  port: 3000
  policies:
    cors:
      allowOrigins:
        - "*"
      allowHeaders:
        - "*"
      exposeHeaders:
        - "Mcp-Session-Id"
  targets:
  - name: remote-mcp
    mcp:
      host: http://mcp-server:8080/sse
```

## Why use agentgateway?

| Direct SSE Connection               | With agentgateway                          |
| ----------------------------------- | ------------------------------------------ |
| Client manages connection lifecycle | Gateway handles reconnection and buffering |
| No authentication                   | OAuth2, API keys, or custom auth           |
| No access control                   | Tool-level authorization                   |
| Single server per client            | Multiple servers aggregated                |
| No metrics                          | Full observability with OpenTelemetry      |

## Learn more

- [MCP Connectivity Guide](../../mcp/index.md)
- [Streamable HTTP Transport](../../mcp/connect/http.md)

[stdio Transport](/docs/standalone/latest/integrations/mcp-servers/stdio/ 'stdio Transport')[Streamable HTTP Transport](/docs/standalone/latest/integrations/mcp-servers/streamable-http/ 'Streamable HTTP Transport')

Was this page helpful?
