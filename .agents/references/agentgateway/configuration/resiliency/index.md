[Skip to content](index.md#content)

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

# Resiliency

Configure retries, timeouts, rate limits, and mirroring for fault tolerance.

Simulate failures, disruptions, and adverse conditions to test that your gateway and apps continue to function.

Tip

Many of these policies are directly from the [Kubernetes Gateway API](https://gateway-api.sigs.k8s.io/reference/api-spec/main/spec/#httprouterule) and behave the same as those policies.

The guides in this section show example configuration for different types of policies. Policies are applied to routes, which are part of a listener on a bind.

```yaml
gateways:
  default:
    port: 3000
routes:
  - policies:
```

[Mirroring\\
\\
Send copies of requests to alternative backends for shadow testing.](mirroring.md) [Rate limiting\\
\\
Enforce budget and spend limits per key by controlling request and token usage.](rate-limits.md) [Retries\\
\\
Configure automatic retry attempts for failed backend requests.](retries.md) [Timeouts\\
\\
Set request and backend timeouts to prevent long-running requests.](timeouts.md) [Fault injection\\
\\
Inject artificial latency into requests to test how your clients and services handle slow responses.](fault-injection.md)

[Traffic management](https://agentgateway.dev/docs/standalone/latest/configuration/traffic-management/ 'Traffic management') [Security](https://agentgateway.dev/docs/standalone/latest/configuration/security/ 'Security')

Was this page helpful?

Ask AI

Agentgateway assistant

Ask me anything about agentgateway configuration, features, or usage.

Note: AI-generated content might contain errors; please verify and test all returned information.

Tip: one topic per conversation gives the best results. Use the **+** button in the chat header to start a new conversation.

![Agent](index.md)

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
