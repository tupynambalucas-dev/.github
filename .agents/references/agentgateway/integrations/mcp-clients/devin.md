# Devin Desktop

Connect Devin Desktop to agentgateway

Configure Devin Desktop (formerly Windsurf), the AI-powered code editor from Cognition, to use
agentgateway as an MCP server.

## Before you begin

1. [Install and run agentgateway](../../quickstart/mcp.md).
2. Confirm agentgateway is up by opening the [agentgateway UI](http://localhost:15000/ui).
3. Use the MCP endpoint `http://localhost:3000/mcp/http` to connect your client to agentgateway. If you run agentgateway on a different host or port, replace `localhost:3000` in the examples accordingly.

## Configuration

Add agentgateway to your Devin Desktop MCP configuration. Create or edit
`~/.codeium/windsurf/mcp_config.json`. On Windows, this file is at
`%USERPROFILE%\.codeium\windsurf\mcp_config.json`. Devin Desktop does not create this file
automatically, so create it if it does not exist.

```
{
  "mcpServers": {
    "agentgateway": {
      "serverUrl": "http://localhost:3000/mcp/http"
    }
  }
}
```

> [!NOTE] Note For remote MCP servers, Devin Desktop uses the serverUrl field rather than the url field that some other clients use.

## Authentication

Include authentication headers if required:

```
{
  "mcpServers": {
    "agentgateway": {
      "serverUrl": "http://localhost:3000/mcp/http",
      "headers": {
        "Authorization": "Bearer your-token-here"
      }
    }
  }
}
```

## Verifying the Connection

1. Open the Cascade panel in Devin Desktop.
2. Click the **MCPs** icon in the top right of the Cascade panel, or open **Settings** > **Cascade** > **MCP Servers**, then refresh the server list.
3. Confirm that the agentgateway tools appear in the available tools list.

[OpenCode](/docs/standalone/latest/integrations/mcp-clients/opencode/ 'OpenCode')[VS Code](/docs/standalone/latest/integrations/mcp-clients/vscode/ 'VS Code')

Was this page helpful?
