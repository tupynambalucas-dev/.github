[Skip to content](stdio.md#content)

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

# Stdio

VerifiedCode examples on this page have been automatically tested and verified.

Run a local MCP server as a subprocess and expose it through agentgateway over stdio.

An MCP backend allows exposing MCP servers through the agentgateway using STDIO**STDIO (Standard Input/Output)** A connection method for MCP servers that communicates through standard input and output streams. STDIO is commonly used for local MCP server processes..

## Before you begin [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/mcp/connect/stdio/#before-you-begin)

[Install the `agentgateway` binary](../../deployment/binary.md).

## Configure the agentgateway [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/mcp/connect/stdio/#configure-the-agentgateway)

1. Download an MCP configuration for your agentgateway.

```yaml
curl -L https://agentgateway.dev/examples/mcp-basic/config.yaml -o config.yaml
```

2. Review the configuration file.

```
cat config.yaml
```

[config.yaml](https://agentgateway.dev/agentgateway.dev/examples/mcp-basic/config.yaml)

```yaml
mcp:
     port: 3000
     policies:
       cors:
         allowOrigins:
      - "*"
      allowHeaders:
      - mcp-protocol-version
      - content-type
      - cache-control
      - mcp-session-id
      exposeHeaders:
      - "Mcp-Session-Id"
targets:
  - name: everything
    stdio:
      cmd: npx
      args: ["@modelcontextprotocol/server-everything"]
```

Review the following table to understand this configuration.

| Field     | Description                                                                                                                                                                                                                                                                                   |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `mcp`     | The top-level MCP configuration block that defines how agentgateway connects to MCP servers.                                                                                                                                                                                                  |
| `port`    | The port on which agentgateway listens for incoming MCP requests, such as `3000`. If not specified, a default port is used.                                                                                                                                                                   |
| `targets` | A list of MCP targets to connect to. Each target defines an MCP server that agentgateway proxies requests to. At least one target is required.                                                                                                                                                |
| `name`    | A unique name for the MCP target, such as `server-everything`. This name identifies the target in logs and the UI.                                                                                                                                                                            |
| `stdio`   | Configuration for connecting to an MCP server via standard input/output. Use this for local MCP servers that run as a command. Contains `cmd` (the command to run) and `args` (arguments for the command). In this example, `npx` runs the `@modelcontextprotocol/server-everything` package. |
| `mcp`     | Configuration for connecting to a remote MCP server via streamable HTTP. Use this for remote MCP servers. Contains `host` (the URL of the MCP server endpoint).                                                                                                                               |

3. Run the agentgateway.

```sh
agentgateway -f config.yaml
```

## Verify access to tools [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/mcp/connect/stdio/#verify-access-to-tools)

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

[Streamable HTTP](https://agentgateway.dev/docs/standalone/latest/mcp/connect/http/ 'Streamable HTTP')

Was this page helpful?

Ask AI

Agentgateway assistant

Ask me anything about agentgateway configuration, features, or usage.

Note: AI-generated content might contain errors; please verify and test all returned information.

Tip: one topic per conversation gives the best results. Use the **+** button in the chat header to start a new conversation.

![Agent](stdio.md)

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
