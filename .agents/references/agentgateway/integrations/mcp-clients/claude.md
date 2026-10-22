# Claude

Connect Claude Desktop and Claude Code to agentgateway

Configure Anthropic’s Claude Desktop app or Claude Code CLI to use agentgateway as an MCP server.

> [!NOTE] Note This page covers connecting Claude as an MCP client . To proxy Claude Code’s LLM traffic (prompts and responses) through agentgateway, see the Claude Code LLM client guide .

## Before you begin

1. [Install and run agentgateway](../../quickstart/mcp.md).
2. Confirm agentgateway is up by opening the [agentgateway UI](http://localhost:15000/ui).
3. Use the MCP endpoint `http://localhost:3000/mcp/http` to connect your client to agentgateway. If you run agentgateway on a different host or port, replace `localhost:3000` in the examples accordingly.

## Claude Desktop

Add agentgateway to your Claude Desktop configuration file.

Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```
{
  "mcpServers": {
    "agentgateway": {
      "url": "http://localhost:3000/mcp/http"
    }
  }
}
```

Edit `%APPDATA%\Claude\claude_desktop_config.json`:

```
{
  "mcpServers": {
    "agentgateway": {
      "url": "http://localhost:3000/mcp/http"
    }
  }
}
```

## Claude Code CLI

Configure Claude Code to connect to agentgateway.

```
claude mcp add agentgateway --transport http http://localhost:3000/mcp/http
```

Or, add to your project’s `.mcp.json`.

```
{
  "mcpServers": {
    "agentgateway": {
      "type": "http",
      "url": "http://localhost:3000/mcp/http"
    }
  }
}
```

> [!WARNING] Warning The SSE transport ( /mcp/sse ) is deprecated. Use the streamable HTTP transport ( /mcp/http ) for all new setups.

## Authentication

If agentgateway requires authentication, include the token in the URL or headers.

```
{
  "mcpServers": {
    "agentgateway": {
      "url": "http://localhost:3000/mcp/http",
      "headers": {
        "Authorization": "Bearer your-token-here"
      }
    }
  }
}
```

[Cursor](/docs/standalone/latest/integrations/mcp-clients/cursor/ 'Cursor')

Was this page helpful?
