# Antigravity IDE

Connect Antigravity IDE to agentgateway

Configure Antigravity IDE to use agentgateway as an MCP server.

## Before you begin

1. [Install and run agentgateway](../../quickstart/mcp.md).
2. Confirm agentgateway is up by opening the [agentgateway UI](http://localhost:15000/ui).
3. Use the MCP endpoint `http://localhost:3000/mcp/http` to connect your client to agentgateway. If you run agentgateway on a different host or port, replace `localhost:3000` in the examples accordingly.

## Configuration

Add agentgateway to your Antigravity IDE MCP configuration. Set the `serverUrl` to your agentgateway
proxy address, which defaults to `http://localhost:3000/mcp/http` for local deployments:

```
{
  "mcpServers": {
    "agentgateway": {
      "serverUrl": "http://localhost:3000/mcp/http"
    }
  }
}
```

## Verify the Connection

1. Restart Antigravity IDE by closing the application and reopening it.
2. Check that agentgateway tools are in the MCP tools list (usually found in the **MCP** or **Tools** panel).
3. Click a tool, then click **Run** (or equivalent button). The tool execution verifies the connectivity with agentgateway.

[VS Code](/docs/standalone/latest/integrations/mcp-clients/vscode/ 'VS Code')

Was this page helpful?
