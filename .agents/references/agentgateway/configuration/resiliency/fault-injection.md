[Skip to content](fault-injection.md#content)

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

# Fault injection

Inject artificial latency into requests to test how your clients and services handle slow responses.

Attaches to: [Route](https://agentgateway.dev/docs/standalone/latest/configuration/routes/ 'Route')

[Route](https://agentgateway.dev/docs/standalone/latest/configuration/routes/ 'Route')

Note

Agentgateway supports more than one configuration style. Where a feature can also be configured in the simplified `llm` or `mcp` modes, the examples on this page show each option in tabs. For more information, see [Routing-based configuration](../../llm/configuration-modes.md).

Fault injection adds artificial latency to matching requests before agentgateway forwards them to the backend. Use it to test how your clients and upstream services behave when responses are slow, such as verifying that timeouts, retries, and client-side deadlines work as expected.

The injected delay counts against the request timeout. If the delay is longer than the configured [request timeout](timeouts.md), the request times out.

## Inject a delay [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/configuration/resiliency/fault-injection/#inject-a-delay)

Set `delay.duration` in the route policies. The `duration` can be either of the following values.

| Value             | Description                                                                                                                                                                                                            |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A duration string | A fixed latency to inject, such as `2s` or `500ms`.                                                                                                                                                                    |
| A CEL expression  | An expression that is evaluated against each request and returns a duration or a number of milliseconds. Use this option for conditional, probabilistic, or randomized delays. A non-positive result injects no delay. |

The following example injects a fixed 2-second delay before agentgateway forwards requests to the backend.

Simplified (MCP)Routing-based

```yaml
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
mcp:
  port: 3000
  policies:
    delay:
      duration: 2s
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
      delay:
        duration: 2s
    backends:
      - host: localhost:8080
```

## Inject a probabilistic or random delay [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/configuration/resiliency/fault-injection/#inject-a-probabilistic-or-random-delay)

Because `duration` accepts a CEL expression, you can inject latency into only a subset of requests, or add jitter. The expression returns either a duration or a number that is interpreted as milliseconds.

| Expression                 | Effect                                                                  |
| -------------------------- | ----------------------------------------------------------------------- |
| `duration("500ms")`        | A fixed 500ms delay, expressed as a CEL duration.                       |
| `random() < 0.1 ? 500 : 0` | A 500ms delay on approximately 10% of requests, and no delay otherwise. |
| `int(random() * 500.0)`    | A random delay between 0 and 500ms (jitter) on every request.           |

The following example delays approximately 10% of requests by 500ms.

```yaml
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
gateways:
  default:
    port: 3000
routes:
  - policies:
      delay:
        duration: 'random() < 0.1 ? 500 : 0'
    backends:
      - host: localhost:8080
```

[Timeouts](https://agentgateway.dev/docs/standalone/latest/configuration/resiliency/timeouts/ 'Timeouts')

Was this page helpful?

Ask AI

Agentgateway assistant

Ask me anything about agentgateway configuration, features, or usage.

Note: AI-generated content might contain errors; please verify and test all returned information.

Tip: one topic per conversation gives the best results. Use the **+** button in the chat header to start a new conversation.

![Agent](fault-injection.md)

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
