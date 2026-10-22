[Skip to content](retries.md#content)

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

# Retries

VerifiedCode examples on this page have been automatically tested and verified.

Configure automatic retry attempts for failed backend requests.

Attaches to: [Route](https://agentgateway.dev/docs/standalone/latest/configuration/routes/ 'Route')

[Route](https://agentgateway.dev/docs/standalone/latest/configuration/routes/ 'Route')

Note

Agentgateway supports more than one configuration style. Where a feature can also be configured in the simplified `llm` or `mcp` modes, the examples on this page show each option in tabs. For more information, see [Routing-based configuration](../../llm/configuration-modes.md).

When a backend request fails, agentgateway can be configured to _retry**Retry** A resiliency feature that automatically resends failed requests to backends. Retries can be configured with backoff strategies and specific conditions for when to retry._ the request.
When a retry is attempted, a different backend will be preferred (if possible).

Simplified (MCP)Routing-based

```yaml
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
mcp:
  port: 3000
  policies:
    retry:
      # total number of attempts allowed.
      # Note: 1 attempt implies no retries; the initial attempt is included in the count.
      attempts: 3
      # Optional; if set, a delay between each additional attempt
      backoff: 500ms
      # A list of HTTP response codes to consider retry-able.
      # In addition, retries are always permitted if the request to a backend was never started.
      codes: [429, 500, 503]
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
      retry:
        # total number of attempts allowed.
        # Note: 1 attempt implies no retries; the initial attempt is included in the count.
        attempts: 3
        # Optional; if set, a delay between each additional attempt
        backoff: 500ms
        # A list of HTTP response codes to consider retry-able.
        # In addition, retries are always permitted if the request to a backend was never started.
        codes: [429, 500, 503]
    backends:
      - host: localhost:8080
```

When a request has retries enabled and an HTTP body, the request body will be buffered.
If the total body size exceeds a threshold size, retries are disabled.

[Rate limiting](https://agentgateway.dev/docs/standalone/latest/configuration/resiliency/rate-limits/ 'Rate limiting') [Timeouts](https://agentgateway.dev/docs/standalone/latest/configuration/resiliency/timeouts/ 'Timeouts')

Was this page helpful?

Ask AI

Agentgateway assistant

Ask me anything about agentgateway configuration, features, or usage.

Note: AI-generated content might contain errors; please verify and test all returned information.

Tip: one topic per conversation gives the best results. Use the **+** button in the chat header to start a new conversation.

![Agent](retries.md)

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
