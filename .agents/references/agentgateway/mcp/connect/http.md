[Skip to content](http.md#content)

`CTRL K`

Toggle theme[Docs](https://agentgateway.dev/docs/) [Standalone](../../README.md) [Kubernetes](https://agentgateway.dev/docs/kubernetes/latest/) [Models](https://agentgateway.dev/models) [Blog](https://agentgateway.dev/blog) [Enterprise](https://agentgateway.dev/enterprise) [Community](https://discord.gg/y9efgEmppm) [Get Started](https://agentgateway.dev/#getting-started) [GitHub](https://github.com/agentgateway/agentgateway)

agentgateway has joined the **Agentic AI Foundation** — [Learn more](https://aaif.io/blog/agentgateway-joins-aaif-as-an-open-gateway-for-agentic-ai-infrastructure/)×

Copy as Markdown

- Copy as Markdown
- View as Markdown
- Copy Codeblocks
- Connect to Docs MCP
- Open in Claude
- Open in ChatGPT
- Open in Perplexity
- Print

Page as Markdown

CopyDownload✕

```

```

# Streamable HTTP

Connect to MCP servers via streamable HTTP with automatic session management

Connect to an MCP server via streamable HTTP.

Important

Want to use agentgateway in a Kubernetes environment with the Gateway API? Check out the [agentgateway on Kubernetes docs](https://agentgateway.dev/docs/kubernetes/).

## About streamable HTTP [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/mcp/connect/http/#about-streamable-http)

Agentgateway automatically manages stateful MCP sessions when using HTTP-based transports. The session state (including backend pinning) is encoded in the session ID and persisted across requests, ensuring that subsequent tool calls in the same session are routed to the same backend server.

```
MCP ServerAgentgatewayClientMCP ServerAgentgatewayClientPin session to backendEncode state into session IDDecode session IDRoute to pinned backendinitialize (no session)initializeinitializedMcp-Session-Id: encrypted-state-abc123call_tool (with session ID)call_tool (same server)tool resultresult
```

1. **Session initialization**: When a client sends an `initialize` request, agentgateway creates a session and returns a session ID
2. **Backend pinning**: The session is pinned to a specific backend server (important when using multiple targets)
3. **State encoding**: The session state is encoded into the session ID using AES-256-GCM encryption
4. **Session resumption**: Subsequent requests with the same session ID are automatically routed to the same backend

## Stateless sessions [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/mcp/connect/http/#stateless-sessions)

By default, agentgateway proxies streamable HTTP in **stateful** mode, as described in the previous section. You can instead run in **stateless** mode with the `statefulMode` field, so that agentgateway does not create a session or return an `Mcp-Session-Id` header. Each request is treated independently, and the client must send the full context that the request needs. This mode suits stateless agents, or MCP servers where the client handles state directly.

Note

The `statefulMode` field controls how agentgateway proxies session-based servers. It is separate from the newer, inherently sessionless `2026-07-28` MCP protocol, which agentgateway supports automatically through version negotiation. For more information, see [MCP spec compatibility](../spec-compatibility.md).

To use stateless mode, set `statefulMode` to `stateless` on the MCP configuration.

```yaml
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
mcp:
  port: 3000
  statefulMode: stateless
  targets:
    - name: mcp
      mcp:
        host: http://localhost:3005/mcp/
```

When you send an `initialize` request through agentgateway in stateless mode, the response returns `HTTP 200` with no `Mcp-Session-Id` header. In the default stateful mode, the same request returns an `Mcp-Session-Id` header that pins the session to a backend.

## Before you begin [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/mcp/connect/http/#before-you-begin)

[Install the `agentgateway` binary](../../deployment/binary.md).

## Configure the agentgateway [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/mcp/connect/http/#configure-the-agentgateway)

1. Spin up an MCP server that uses streamable HTTP.

```sh
PORT=3005 npx -y @modelcontextprotocol/server-everything streamableHttp
```

2. Create a configuration for your agentgateway to connect to your MCP server. Make sure to expose the `Mcp-Session-Id` header in the CORS configuration for session persistence.

```yaml
cat <<EOF > config.yaml
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
  - name: mcp
    mcp:
      host: http://localhost:3005/mcp/
EOF
```

3. Run the agentgateway.

```sh
agentgateway -f config.yaml
```

## Verify access to tools [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/mcp/connect/http/#verify-access-to-tools)

1. Open the [agentgateway UI](http://localhost:15000/ui/) to view your listener and backend configuration.

2. Connect to the MCP test server with the agentgateway UI playground.

3. From the navigation menu under **MCP**, click **Tool Playground**.

4. If you see a **Browser access is not allowed** notice, click **Apply CORS** so the playground can call the MCP listener from the UI.

5. Click **Initialize** to open an MCP session. The agentgateway UI connects to the target that you configured and lists the tools that are exposed on the target.

   ![](https://agentgateway.dev/img/ui-playground-tools.png)

   ![](https://agentgateway.dev/img/ui-playground-tools-dark.png)

6. Verify access to a tool.

7. From the **Tool** list, select the `echo` tool.

8. In the **Message** field, enter any string, such as `This is my first agentgateway setup.`, and click **Call tool**.

9. Verify that the **Result** card shows an `HTTP 200` response with your message echoed back.

   ![](https://agentgateway.dev/img/ui-playground-tool-echo.png)

   ![](https://agentgateway.dev/img/ui-playground-tool-echo-dark.png)

[Stdio](https://agentgateway.dev/docs/standalone/latest/mcp/connect/stdio/ 'Stdio') [Virtual MCP](https://agentgateway.dev/docs/standalone/latest/mcp/connect/virtual/ 'Virtual MCP')

Was this page helpful?

Ask AI

Agentgateway assistant

Ask me anything about agentgateway configuration, features, or usage.

Note: AI-generated content might contain errors; please verify and test all returned information.

Tip: one topic per conversation gives the best results. Use the **+** button in the chat header to start a new conversation.

![Agent](http.md)

•••

Rate limit reached

The assistant keeps a rolling history of 3 exchanges. Any older messages are no longer included in the context.

Switching topics? Starting a new conversation improves accuracy.Start new conversation

Current page

↑↓ navigate
↵ select
esc dismiss

Add this pageMention a page

Standalone

Standalone

Standalone deployment docs

Kubernetes

Kubernetes deployment docs

### What could be improved?

Your feedback helps us improve assistant answers and identify docs gaps we should fix.

Need more help? Join us on Discord:
[https://discord.gg/y9efgEmppm](https://discord.gg/y9efgEmppm)

Want to use your own agent? Add the Solo MCP server to query our docs directly. Get started here:
[https://search.solo.io/](https://search.solo.io/).

SkipSubmit
