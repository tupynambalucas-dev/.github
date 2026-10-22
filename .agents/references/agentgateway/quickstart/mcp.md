# MCP servers

Verified Code examples on this page have been automatically tested and verified.

Connect to an MCP server and try tools in the agentgateway playground.

Use the agentgateway binary to proxy requests to an open source MCP test server,
`server-everything`. Then, try a tool in the built-in agentgateway playground.

## Before you begin

1. [Install the agentgateway binary](../deployment/binary.md).

   ```
   curl -sL https://agentgateway.dev/install | bash
   ```

## Steps

### Step 1: Start the MCP test server

Run the open source `server-everything` MCP test server with the streamable HTTP transport.

```
PORT=3005 npx -y @modelcontextprotocol/server-everything streamableHttp
```

### Step 2: Start agentgateway

You add the MCP server from the UI in the next steps, so you can start agentgateway without a config
file. When you run `agentgateway` without specifying a config, it bootstraps a basic config at
`~/.config/agentgateway/config.yaml` and uses it automatically.

```
agentgateway
```

Example output:

```
info  app  serving UI at http://localhost:15000/ui
```

### Step 3: Enable MCP

1. Open the [agentgateway UI](http://localhost:15000/ui/).
2. On the **Gateway Overview**, find the **MCP** row and click **Enable MCP**.

### Step 4: Add the MCP server

1. In the **MCP** section of the navigation menu, click **Servers**, and then click **Add server**.
2. For the **Server name**, enter `server-everything`.
3. Keep the **Streamable HTTP** transport. For the **URL**, enter `http://localhost:3005/mcp`.
4. Click **Save server**.

![](/img/ui-mcp-add-server.png)

![](/img/ui-mcp-add-server-dark.png)

### Step 5: Try a tool in the playground

1. In the **MCP** section, click **Tool Playground**.
2. If you see a **Browser access is not allowed** notice, click **Apply CORS** so the playground can
   call the MCP listener from the UI.
3. Click **Initialize** to open an MCP session. The playground lists the tools that the server exposes,
   such as `echo` and various `get` commands.

   ![](/img/ui-playground-tools.png)

   ![](/img/ui-playground-tools-dark.png)

4. From the **Tool** list, select the `echo` tool. In the **Message** field, enter a string, such as
   `This is my first agentgateway setup`, and click **Call tool**.
5. Verify that the **Result** card shows an `HTTP 200` response with your message echoed back.

   ![](/img/ui-playground-tool-echo.png)

   ![](/img/ui-playground-tool-echo-dark.png)

## Next steps

Check out more guides for using MCP servers with agentgateway.

[stdioConnect to an MCP server via stdio](../mcp/connect/stdio.md) [Virtual MCPFederate multiple MCP servers.](../mcp/connect/virtual.md) [OpenAPIEnable OAuth 2.0 protection for MCP servers.](../mcp/mcp-authn.md)

[LLM (OpenAI)](/docs/standalone/latest/quickstart/llm/ 'LLM (OpenAI)')[Non-agentic HTTP traffic](/docs/standalone/latest/quickstart/non-agentic-http/ 'Non-agentic HTTP traffic')

Was this page helpful?
