[Skip to content](conditional-policies.md#content)

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

# Conditional policies

Run different variants of a policy on the same route based on a CEL expression evaluated against the request.

## Conditional policies [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/configuration/policies/conditional-policies/#conditional-policies)

A policy normally applies the same configuration to every request on the route it attaches to. Conditional execution lets you nest a list of policy variants under a `conditional` field. Each variant has a CEL**CEL (Common Expression Language)** A simple expression language used throughout agentgateway to enable flexible configuration. CEL expressions can access request context, JWT claims, and other variables to make dynamic decisions. expression that determines whether it applies. For each request, agentgateway evaluates the entries in order and runs the first variant whose expression returns `true`.

A common use case is choosing between two external authorization servers based on the request. For example, you might send admin paths to a stricter authorization server and route everything else to a standard one.

The following policies support conditional execution:

- External authorization (`extAuth`)
- External processing (`extProc`)
- Rate limiting (`rateLimit`)
- Transformations (`transformation`)
- Direct response (`directResponse`)

For details on how to write the CEL expressions that go in each `condition` field, see the [CEL expressions reference](../../reference/cel/index.md).

### How conditional execution works [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/configuration/policies/conditional-policies/#how-it-works)

- **First match wins.** Agentgateway evaluates each `conditional` entry in the order you list them and runs the first variant whose `condition` evaluates to `true`. Subsequent entries are not evaluated.
- **Optional fallback.** An entry without a `condition` is the unconditional fallback. It must be the last entry in the list, and you can have at most one. If no condition matches and there is no fallback, the policy does not run for that request.
- **Mutually exclusive with the inline form.** For a given policy, set either the top-level fields or the `conditional` list, not both.
- **Limits.** A `conditional` list can have between 1 and 64 entries.

### Examples [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/configuration/policies/conditional-policies/#examples)

Review the following examples to see how conditional policies work. Conditional execution works the same way for every supported policy. The following examples show one configuration per policy type.

#### Multiple ext auth servers [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/configuration/policies/conditional-policies/#example-extauth)

Route to one of two external authorization servers based on the request path. Requests to a path that starts with `/admin` go to a stricter authorization server. The fallback entry handles every other request.

```yaml
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
gateways:
  default:
    port: 3000
routes:
  - backends:
      - host: localhost:8000
    policies:
      extAuthz:
        conditional:
          # Admin paths go to the stricter authorization server.
          - condition: request.path.startsWith("/admin")
            host: localhost:9000
            protocol:
              grpc: {}
            failureMode: deny
          # Fallback for every other request. No condition, must be last.
          - host: localhost:9001
            protocol:
              grpc: {}
            failureMode: deny
```

#### Different rate limits [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/configuration/policies/conditional-policies/#example-ratelimit)

Apply a stricter rate limit to write requests and a looser limit to all other traffic.

```yaml
gateways:
  default:
    port: 3000
routes:
  - backends:
      - host: localhost:8000
    policies:
      localRateLimit:
        conditional:
          - condition: request.method == "POST" || request.method == "PUT" || request.method == "DELETE"
            maxTokens: 10
            tokensPerFill: 10
            fillInterval: 1m
            type: requests
          - maxTokens: 100
            tokensPerFill: 100
            fillInterval: 1m
            type: requests
```

#### Transform internal traffic [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/configuration/policies/conditional-policies/#example-transformation)

Add a tracing header when the request includes an `x-internal: true` header. With no fallback entry, agentgateway skips the transformation on every other request.

```yaml
gateways:
  default:
    port: 3000
routes:
  - backends:
      - host: localhost:8000
    policies:
      transformations:
        conditional:
          - condition: request.headers["x-internal"] == "true"
            request:
              add:
                x-trace-source: '"internal"'
```

#### Filter LLM chats with extproc [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/configuration/policies/conditional-policies/#example-extproc)

Send requests on a path that starts with `/v1/chat` through an external processor. Every other request bypasses the processor.

```yaml
gateways:
  default:
    port: 3000
routes:
  - backends:
      - host: localhost:8000
    policies:
      extProc:
        conditional:
          - condition: request.path.startsWith("/v1/chat")
            host: localhost:9100
            failureMode: failClosed
```

#### Short-circuit deprecated paths with a direct response [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/configuration/policies/conditional-policies/#example-direct-response)

Return a `410 Gone` response for any path that starts with `/v0/`. Every other request proceeds to the backend.

```yaml
gateways:
  default:
    port: 3000
routes:
  - backends:
      - host: localhost:8000
    policies:
      directResponse:
        conditional:
          - condition: request.path.startsWith("/v0/")
            status: 410
            body: 'This API version is no longer available. Use /v1/.'
```

[Attachment points](https://agentgateway.dev/docs/standalone/latest/configuration/policies/attachment/ 'Attachment points')

Was this page helpful?

Ask AI

Agentgateway assistant

Ask me anything about agentgateway configuration, features, or usage.

Note: AI-generated content might contain errors; please verify and test all returned information.

Tip: one topic per conversation gives the best results. Use the **+** button in the chat header to start a new conversation.

![Agent](conditional-policies.md)

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
