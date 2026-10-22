[Skip to content](apps.md#content)

`CTRL K`

Toggle theme[Docs](https://agentgateway.dev/docs/) [Standalone](../README.md) [Kubernetes](https://agentgateway.dev/docs/kubernetes/latest/) [Models](https://agentgateway.dev/models) [Blog](https://agentgateway.dev/blog) [Enterprise](https://agentgateway.dev/enterprise) [Community](https://discord.gg/y9efgEmppm) [Get Started](https://agentgateway.dev/#getting-started) [GitHub](https://github.com/agentgateway/agentgateway)

agentgateway has joined the **Agentic AI Foundation** — [Learn more](https://aaif.io/blog/agentgateway-joins-aaif-as-an-open-gateway-for-agentic-ai-infrastructure/)×

Copy as Markdown

- Copy as Markdown
- View as Markdown
- Connect to Docs MCP
- Open in Claude
- Open in ChatGPT
- Open in Perplexity
- Print

Page as Markdown

CopyDownload✕

```

```

# MCP Apps

Serve interactive MCP Apps (UI resources) through agentgateway, including across federated MCP servers.

**MCP Apps** (the `io.modelcontextprotocol/ui` extension) let MCP tools return interactive user-interface (UI) resources that an MCP host can render, rather than plain text. A tool can return a UI resource identified by a `ui://` URI, and the host displays it to the user. Agentgateway supports MCP Apps automatically, including when you federate multiple MCP servers.

## How agentgateway handles MCP Apps [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/mcp/apps/#how-agentgateway-handles-mcp-apps)

You do not need to configure anything to use MCP Apps through agentgateway. UI resources pass through the gateway like any other MCP resource, with two behaviors worth knowing about:

- **Multiplexing**: When you federate multiple MCP servers into one endpoint, agentgateway rewrites the `ui://` resource URIs so that they still route to the correct upstream target while remaining valid `ui://` URIs that hosts can render. For more information, see the [Virtual MCP](connect/virtual.md) guide.
- **Authorization**: Any authorization rules that you configure also apply to UI resources. If a rule denies access to a UI resource, agentgateway does not advertise it to the client. For more information, see [MCP authorization](mcp-authz.md).

## MCP Apps and tool name prefixing [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/mcp/apps/#mcp-apps-and-tool-name-prefixing)

MCP Apps can call tools from within the rendered UI. By default, agentgateway prefixes tool names with the target name when you federate multiple MCP servers, which can interfere with app-originated tool calls that use the tool’s plain name. To expose unprefixed tool names, adjust the tool name prefixing behavior on the MCP backend. For more information, see the [Virtual MCP](connect/virtual.md#tool-name-prefixing) guide.

[Connect to MCP servers](https://agentgateway.dev/docs/standalone/latest/mcp/connect/ 'Connect to MCP servers') [MCP authentication](https://agentgateway.dev/docs/standalone/latest/mcp/mcp-authn/ 'MCP authentication')

Was this page helpful?

Ask AI

Agentgateway assistant

Ask me anything about agentgateway configuration, features, or usage.

Note: AI-generated content might contain errors; please verify and test all returned information.

Tip: one topic per conversation gives the best results. Use the **+** button in the chat header to start a new conversation.

![Agent](apps.md)

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
