[Skip to content](configuration-modes.md#content)

`CTRL K`

Toggle theme[Docs](https://agentgateway.dev/docs/) [Standalone](../README.md) [Kubernetes](https://agentgateway.dev/docs/kubernetes/latest/) [Models](https://agentgateway.dev/models) [Blog](https://agentgateway.dev/blog) [Enterprise](https://agentgateway.dev/enterprise) [Community](https://discord.gg/y9efgEmppm) [Get Started](https://agentgateway.dev/#getting-started) [GitHub](https://github.com/agentgateway/agentgateway)

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

# MCP configuration modes

Choose between the simplified `mcp` section and routing-based configuration, and decide whether to expose your MCP servers on one endpoint or on separate paths

Agentgateway offers two ways to configure Model Context Protocol (MCP) servers, and two ways to expose them to clients. The two choices are independent of each other.

- [Configuration modes](configuration-modes.md#configuration-modes): whether you write the `mcp` section or the `routes` section.
- [One endpoint or separate paths](configuration-modes.md#topology): whether clients see one federated MCP server or one endpoint per server.

## Configuration modes [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/mcp/configuration-modes/#configuration-modes)

Both modes serve traffic on a [gateway](../configuration/gateways.md), which defines the port that agentgateway listens on. The difference is how you describe what the gateway serves.

| Mode           | Where you configure it               | Use it when                                                                   |
| -------------- | ------------------------------------ | ----------------------------------------------------------------------------- |
| Simplified MCP | The top-level `mcp` section          | You only serve MCP traffic, and you do not need custom HTTP routing           |
| Routing-based  | The `gateways` and `routes` sections | You need path-based routing, non-MCP backends alongside MCP, or several ports |

Important

The top-level `mcp` section is a simplified form of the same MCP backend that `routes[].backends[].mcp` configures. It is not a different feature. Both modes produce an MCP backend, both support multiple targets, and both support the same MCP policies.

The following examples are equivalent. Each one exposes two MCP servers on port `3000`.

Simplified (MCP)Routing-based

```yaml
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
mcp:
  targets:
    - name: jira
      mcp:
        host: https://mcp.atlassian.com/v1/mcp
    - name: linear
      mcp:
        host: https://mcp.linear.app/mcp
```

```yaml
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
gateways:
  default:
    port: 3000
routes:
  - name: tools
    matches:
      - path:
          pathPrefix: /mcp
    backends:
      - mcp:
          targets:
            - name: jira
              mcp:
                host: https://mcp.atlassian.com/v1/mcp
            - name: linear
              mcp:
                host: https://mcp.linear.app/mcp
```

When you omit the `gateways` field, the `mcp` section attaches to the gateway named `default`. When your configuration file defines no gateway at all, the implied `default` gateway serves MCP traffic on port `3000`. For more information, see [Gateways](../configuration/gateways.md).

You can use both modes in the same file, but one mode is usually enough.

## One endpoint or separate paths [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/mcp/configuration-modes/#topology)

Independently of the configuration mode, you choose how many endpoints your clients connect to. What determines this is how you group targets into backends, not which section you write them in.

| Topology                    | How you configure it                                 | What the client sees                                                           |
| --------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------ |
| One endpoint (multiplexing) | Several `targets` in **one** backend                 | One MCP server whose `tools/list` response federates the tools of every target |
| Separate paths              | **One** backend per route, each with its own targets | One MCP server per path, each listed and called separately                     |

Multiplexing is also called federation. For a walkthrough, see [Virtual MCP](connect/virtual.md).

### When to use one endpoint [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/mcp/configuration-modes/#multiplex)

Multiplexing gives your clients a single endpoint to configure. You can add and remove MCP servers, or restrict individual tools, without reconfiguring any client. Tool names are prefixed with the target name by default so that tools from different servers do not collide.

Use one endpoint when:

- You want one connection string to distribute to your clients.
- You expect the set of MCP servers or tools to change over time.
- You hold the credentials for each MCP server yourself, such as API tokens in environment variables.

### When to use separate paths [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/mcp/configuration-modes/#separate)

Separate paths keep each MCP server independently addressable, with its own route, policies, and endpoint.

Use separate paths when:

- Each client should connect to one specific MCP server.
- You want to apply different HTTP-level policies per server.
- Your clients authenticate to each MCP server through a browser-based OAuth flow. See [Authentication with multiplexing](configuration-modes.md#auth) for why this matters.

## Authentication with multiplexing [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/mcp/configuration-modes/#auth)

Multiplexing changes what authentication options you have, so decide the topology and the authentication method together.

### Credentials that you hold [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/mcp/configuration-modes/#backend-auth)

When you hold the credentials, set them **per target** with `policies.backendAuth`. Each target gets its own credential, so a token for one MCP server is never sent to another.

```yaml
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
mcp:
  targets:
    - name: jira
      mcp:
        host: https://mcp.atlassian.com/v1/mcp
      policies:
        backendAuth:
          key: '$JIRA_MCP_TOKEN'
    - name: linear
      mcp:
        host: https://mcp.linear.app/mcp
      policies:
        backendAuth:
          key: '$LINEAR_MCP_TOKEN'
```

Warning

Do not use a `requestHeaderModifier` policy to add an `Authorization` header for this purpose. A policy on the route or backend applies to every target in that backend, so all of your MCP servers receive the same token. Use `policies.backendAuth` on each target instead.

For the full list of policies that you can set per target, see [MCP target policies](mcp-target-policies.md).

### Credentials that the user holds [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/mcp/configuration-modes/#user-auth)

If you want each user to authenticate to each MCP server themselves, such as through a browser-based OAuth flow with dynamic client registration, do not multiplex those servers. A client that connects to one federated endpoint has no way to run a separate authorization flow for every upstream server behind it. Expose those servers on separate paths instead.

For an alternative that works across servers, agentgateway can exchange the user identity for a per-service token with the OAuth Identity Assertion Authorization Grant, so that the client does not run a separate flow per server. Support on the MCP server side is required. For more information, see [Cross App Access (ID-JAG)](../configuration/security/backend-authn/cross-app-access.md).

## Control how many tools a client sees [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/mcp/configuration-modes/#tool-filtering)

A federated endpoint returns the tools of every target in one `tools/list` response. With many MCP servers behind one endpoint, that response can grow large enough to consume a significant part of an agent’s context window.

To keep the list small, restrict which tools the endpoint exposes with an `mcpAuthorization` policy. Tools that a client is not allowed to call are filtered out of `list` responses, so the client never sees them. You can scope rules to a single target by matching on the `mcp.tool.target` variable. For more information, see [MCP authorization](mcp-authz.md).

You can also use `prefixMode` to control how tool names are namespaced. For more information, see [Tool name prefixing](connect/virtual.md#tool-name-prefixing).

## Next steps [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/mcp/configuration-modes/#next-steps)

- Federate several MCP servers into one endpoint with [Virtual MCP](connect/virtual.md).
- Apply per-target policies with [MCP target policies](mcp-target-policies.md).
- Filter the tools that clients can see with [MCP authorization](mcp-authz.md).
- Configure LLM providers with [Routing-based configuration for LLMs](../llm/configuration-modes.md).

[About](https://agentgateway.dev/docs/standalone/latest/mcp/about/ 'About') [Connect to MCP servers](https://agentgateway.dev/docs/standalone/latest/mcp/connect/ 'Connect to MCP servers')

Was this page helpful?

Ask AI

Agentgateway assistant

Ask me anything about agentgateway configuration, features, or usage.

Note: AI-generated content might contain errors; please verify and test all returned information.

Tip: one topic per conversation gives the best results. Use the **+** button in the chat header to start a new conversation.

![Agent](configuration-modes.md)

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
