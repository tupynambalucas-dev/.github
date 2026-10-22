# Cursor

Connect Cursor IDE to agentgateway

Configure Cursor, the AI-powered code editor, to use agentgateway as an MCP server.

## Before you begin

1. [Install and run agentgateway](../../quickstart/mcp.md).
2. Confirm agentgateway is up by opening the [agentgateway UI](http://localhost:15000/ui).
3. Use the MCP endpoint `http://localhost:3000/mcp/http` to connect your client to agentgateway. If you run agentgateway on a different host or port, replace `localhost:3000` in the examples accordingly.

## Configuration

Add agentgateway to your Cursor MCP settings. Create or edit `.cursor/mcp.json` in your project
root:

```
{
  "mcpServers": {
    "agentgateway": {
      "url": "http://localhost:3000/mcp/http"
    }
  }
}
```

## Global Configuration

For global configuration across all projects, edit `~/.cursor/mcp.json`:

```
{
  "mcpServers": {
    "agentgateway": {
      "url": "http://localhost:3000/mcp/http"
    }
  }
}
```

## Authentication

Include authentication headers if required:

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

## Verifying the Connection

After configuration, restart Cursor and check that agentgateway tools appear in the MCP tools list.
You can verify connectivity by asking Cursor to list available tools.

[Claude](/docs/standalone/latest/integrations/mcp-clients/claude/ 'Claude')[OpenCode](/docs/standalone/latest/integrations/mcp-clients/opencode/ 'OpenCode')

Was this page helpful?
