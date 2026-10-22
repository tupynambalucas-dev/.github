# OpenCode

Connect OpenCode to agentgateway

Configure OpenCode, the open source AI coding assistant, to use agentgateway as an MCP server.

## Before you begin

1. [Install and run agentgateway](../../quickstart/mcp.md).
2. Confirm agentgateway is up by opening the [agentgateway UI](http://localhost:15000/ui).
3. Use the MCP endpoint `http://localhost:3000/mcp/http` to connect your client to agentgateway. If you run agentgateway on a different host or port, replace `localhost:3000` in the examples accordingly.

## Configuration

Add agentgateway to your OpenCode configuration file `opencode.json`:

```
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "agentgateway": {
      "type": "remote",
      "url": "http://localhost:3000/mcp/http"
    }
  }
}
```

## Project-Level Configuration

For project-specific configuration, create `opencode.json` in your project root:

```
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "agentgateway": {
      "type": "remote",
      "url": "http://localhost:3000/mcp/http"
    }
  }
}
```

## Authentication

Include authentication if required:

```
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "agentgateway": {
      "type": "remote",
      "url": "http://localhost:3000/mcp/http",
      "headers": {
        "Authorization": "Bearer your-token-here"
      }
    }
  }
}
```

[Cursor](/docs/standalone/latest/integrations/mcp-clients/cursor/ 'Cursor')[Devin Desktop](/docs/standalone/latest/integrations/mcp-clients/devin/ 'Devin Desktop')

Was this page helpful?
