[Skip to content](mirroring.md#content)

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

# Mirroring

VerifiedCode examples on this page have been automatically tested and verified.

Send copies of requests to alternative backends for shadow testing.

Attaches to: [Route](https://agentgateway.dev/docs/standalone/latest/configuration/routes/ 'Route')

[Route](https://agentgateway.dev/docs/standalone/latest/configuration/routes/ 'Route')

[Backend](https://agentgateway.dev/docs/standalone/latest/configuration/backends/ 'Backend')

Note

Agentgateway supports more than one configuration style. Where a feature can also be configured in the simplified `llm` or `mcp` modes, the examples on this page show each option in tabs. For more information, see [Routing-based configuration](../../llm/configuration-modes.md).

Request mirroring**Mirroring** A resiliency feature that sends a copy of requests to an additional backend for testing or analysis, without affecting the primary request flow. allows sending a copy of each request to an alternative backend.
These requests will not be retried if they fail.

Simplified (MCP)Routing-based

```yaml
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
mcp:
  port: 3000
  policies:
    requestMirror:
      backend:
        host: localhost:8080
      # Mirror 50% of requests
      percentage: 0.5
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
      requestMirror:
        backend:
          host: localhost:8080
        # Mirror 50% of requests
        percentage: 0.5
    backends:
      - host: localhost:8000
```

[Rate limiting](https://agentgateway.dev/docs/standalone/latest/configuration/resiliency/rate-limits/ 'Rate limiting')

Was this page helpful?

Ask AI

Agentgateway assistant

Ask me anything about agentgateway configuration, features, or usage.

Note: AI-generated content might contain errors; please verify and test all returned information.

Tip: one topic per conversation gives the best results. Use the **+** button in the chat header to start a new conversation.

![Agent](mirroring.md)

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
