[Skip to content](overview.md#content)

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

# Overview

Understand agentgateway’s top-level configuration sections and how to write, update, and run a configuration file.

Manage agentgateway through a configuration file. Supported file formats are JSON and YAML.

## Configuration sections [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/configuration/overview/#sections)

Agentgateway configuration has a few top level sections:

- `config` configures top level settings. These options are the only ones that are not dynamically configured.
- `gateways` provides the entry point for traffic, defining the ports and listeners that routes and features attach to. For more information, see [Gateways](gateways.md).
- `routes` and `tcpRoutes` define how traffic that reaches a gateway is matched and forwarded to backends.
- `llm` provides a simplified, model-centric configuration for routing requests to LLM providers. For more information, see [LLM configuration modes](../llm/configuration-modes.md).
- `mcp` provides a simplified configuration for connecting to MCP servers without requiring individual routes and backends.
- `ui` exposes the agentgateway UI on a gateway instead of only on the admin interface.
- `binds` is the deprecated predecessor to `gateways`, which nests listeners and routes under each port. Use `gateways` and `routes` instead. For help converting, see [Migrate from binds](gateways.md#migrate-from-binds).
- `services` and `workloads` can be used for very advanced cases where backends need to be represented as complex objects rather than simple URLs. However, it is recommended to [use agentgateway on Kubernetes](https://agentgateway.dev/docs/kubernetes/) for these purposes.

### Example configuration file [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/configuration/overview/#example-file)

```yaml
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
mcp:
  port: 3000
  policies:
    cors:
      allowOrigins:
        - '*'
      allowHeaders:
        - mcp-protocol-version
        - content-type
        - cache-control
        - mcp-session-id
      exposeHeaders:
        - 'Mcp-Session-Id'
  targets:
    - name: everything
      stdio:
        cmd: npx
        args: ['@modelcontextprotocol/server-everything']
```

## Update configuration [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/configuration/overview/#add)

To update configuration, you can write to the configuration file or use the agentgateway UI.

- **Write to the file**: Most changes that you make to the file are automatically picked up by agentgateway, with the exception of the top-level `config` section.
- **UI**: The agentgateway UI overwrites the contents of the configuration file. Note that any comments that you add to the file are wiped out! You can open the agentgateway UI on port 15000.

## Run your configuration [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/configuration/overview/#run)

To run agentgateway, install the agentgateway binary and pass the file with the `-f` option, such as the following example command.

```shell
agentgateway -f config.yaml
```

## Configuration overview [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/configuration/overview/#configuration-overview)

Agentgateway’s core configuration is made up of gateways, listeners**Listener** An entry point for incoming traffic into agentgateway. Listeners are configured on ports and support HTTP, HTTPS, TCP, and TLS protocols., routes**Route** A rule that matches incoming requests and forwards them to backends. Routes can match on path, hostname, headers, query parameters, and HTTP methods., and backends**Backend** A destination service that receives traffic from agentgateway. Backends can be static hosts, MCP servers, LLM providers, or other services..

- **Gateways** are the main entry point for incoming traffic. Each gateway is a named port. For a simple setup, you might have just a single gateway. More complex setups might have multiple gateways to serve different ports.
- **Listeners** subdivide a gateway when one port must serve multiple domains with different TLS certificates.
- **Routes** define how incoming traffic is matched and forwarded to backends. Routes attach to gateways by name.
- **Backends** are the targets that receive traffic from agentgateway. Backends can be simple URLs or more complex backends, like an MCP server or LLM provider**Provider** A service that provides LLM capabilities, such as OpenAI, Anthropic, or Azure. Agentgateway supports multiple LLM providers and can route to different providers based on configuration..

A minimal configuration that accepts HTTP traffic on port 3000 and forwards it to a backend running on `localhost:8000` looks like the following example.

```yaml
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
gateways:
  default:
    port: 3000
routes:
  - backends:
      - host: localhost:8000
```

[Static configuration](https://agentgateway.dev/docs/standalone/latest/configuration/static-configuration/ 'Static configuration')

Was this page helpful?

Ask AI

Agentgateway assistant

Ask me anything about agentgateway configuration, features, or usage.

Note: AI-generated content might contain errors; please verify and test all returned information.

Tip: one topic per conversation gives the best results. Use the **+** button in the chat header to start a new conversation.

![Agent](overview.md)

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
