[Skip to content](timeouts.md#content)

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

# Timeouts

VerifiedCode examples on this page have been automatically tested and verified.

Set request and backend timeouts to prevent long-running requests.

Attaches to: [Route](https://agentgateway.dev/docs/standalone/latest/configuration/routes/ 'Route')

[Route](https://agentgateway.dev/docs/standalone/latest/configuration/routes/ 'Route')

[Backend](https://agentgateway.dev/docs/standalone/latest/configuration/backends/ 'Backend')

Note

Agentgateway supports more than one configuration style. Where a feature can also be configured in the simplified `llm` or `mcp` modes, the examples on this page show each option in tabs. For more information, see [Routing-based configuration](../../llm/configuration-modes.md).

Request timeouts**Timeout** A time limit for how long agentgateway will wait for a response from a backend before considering the request failed. Timeouts can be configured at the request or backend level. allow returning an error for requests that take too long to complete.

## Route Timeouts [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/configuration/resiliency/timeouts/#route-timeouts)

You can configure two types of timeouts on a route.

| Timeout                 | Description                                                                                                                                                                    |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `requestTimeout`        | The time from the start of an incoming request, until the end of the response headers is received. Note if there are retries, this includes the total time across retries.     |
| `backendRequestTimeout` | The time from the start of a request to a backend, until the end of the response headers are completed. Note this is per-request, so with retries this is a per-retry timeout. |

Simplified (MCP)Routing-based

```yaml
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
mcp:
  port: 3000
  policies:
    timeout:
      requestTimeout: 1s
  targets:
    - name: everything
      stdio:
        cmd: npx
        args: ['@modelcontextprotocol/server-everything']
```

```yaml
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
gateways:
  default:
    port: 3000
routes:
  - policies:
      timeout:
        requestTimeout: 1s
    backends:
      - host: localhost:8080
```

## Backend Timeouts [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/configuration/resiliency/timeouts/#backend-timeouts)

In addition to route level timeouts, you can configure per-backend timeouts within the backend configuration section.

| Timeout          | Description                                                                                       |
| ---------------- | ------------------------------------------------------------------------------------------------- |
| `requestTimeout` | The time from the start of an HTTP request to a backend until the response headers are completed. |
| `connectTimeout` | The time from the start of a TCP connection to a backend until the connection is established.     |

```yaml
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
gateways:
  default:
    port: 3000
routes:
  - backends:
      - host: localhost:8080
        policies:
          http:
            requestTimeout: 1s
          tcp:
            connectTimeout: 10s
            # Required when setting tcp connection options; {} keeps keepalive defaults
            keepalives: {}
```

[Retries](https://agentgateway.dev/docs/standalone/latest/configuration/resiliency/retries/ 'Retries') [Fault injection](https://agentgateway.dev/docs/standalone/latest/configuration/resiliency/fault-injection/ 'Fault injection')

Was this page helpful?

Ask AI

Agentgateway assistant

Ask me anything about agentgateway configuration, features, or usage.

Note: AI-generated content might contain errors; please verify and test all returned information.

Tip: one topic per conversation gives the best results. Use the **+** button in the chat header to start a new conversation.

![Agent](timeouts.md)

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
