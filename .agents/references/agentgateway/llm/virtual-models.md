[Skip to content](virtual-models.md#content)

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

# Virtual models

VerifiedCode examples on this page have been automatically tested and verified.

Configure virtual models with weighted, failover, and conditional routing in simplified LLM mode.

Virtual models let you publish one client-facing model name and route requests across one or more internal target models.

Use `llm.virtualModels[]` to define the virtual entrypoint and `llm.models[]` as the concrete upstream targets.

## Public and internal models [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/llm/virtual-models/#public-and-internal-models)

Use `llm.models[].visibility` to control whether a model is directly exposed to clients or kept as an internal target.

- `public`: The model can be requested directly by clients and can also be used as a virtual model target.
- `internal`: The model is intended for internal routing targets and is not exposed as a direct client model.

## Route selection modes [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/llm/virtual-models/#route-selection-modes)

Each virtual model defines its routing strategy under `routing`.
The routing targets in a virtual model point to concrete `llm.models[]` entries.

### Weighted routing [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/llm/virtual-models/#weighted-routing)

Use `routing.weighted.targets` to split traffic between targets with `weight`.

```yaml
llm:
  models:
    - name: gpt-4o-public
      visibility: public
      provider: openAI
      params:
        model: gpt-4o
        apiKey: '$OPENAI_API_KEY'
    - name: gpt-4o-primary
      visibility: internal
      provider: openAI
      params:
        model: gpt-4o
        apiKey: '$OPENAI_API_KEY'
    - name: gpt-4o-fallback
      visibility: internal
      provider: openAI
      params:
        model: gpt-4o-mini
        apiKey: '$OPENAI_API_KEY'

  virtualModels:
    - name: smart
      routing:
        weighted:
          targets:
            - model: gpt-4o-primary
              weight: 90
            - model: gpt-4o-fallback
              weight: 10
```

### Failover routing [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/llm/virtual-models/#failover-routing)

Use failover (also called automatic fallback) to keep serving when a primary model fails or becomes unavailable. Configure `routing.failover.targets` with `priority` on the virtual model, and configure `health.eviction` on the concrete target models so unhealthy backends can leave the active set.

Failover has two levels of grouping:

- **Priority groups**: Targets with the same `priority` form one group. Lower priority values are preferred first. For example, priorities `0`, `0`, and `1` become `[[a, b], [c]]`.
- **Within a group**: Agentgateway load balances across targets by using a composite score of health and latency. Healthier, faster targets are favored.

Across priority groups, traffic moves to the next group only after every target in the current group is **evicted**. Lowering a health score alone is not enough to spill over to the next priority.

#### Health vs eviction [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/llm/virtual-models/#health-vs-eviction)

Configure health on the concrete `llm.models[]` entries that the virtual model targets (not on the virtual model itself).

| Setting                     | What it does                                                                                                                                                                                                                                                           |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| No `health` policy          | Unhealthy responses (by default, `5xx` or connection failures) still lower the endpoint health score used for within-group load balancing. Endpoints are never evicted, so traffic never fails over to the next priority.                                              |
| `health` without `eviction` | Same score-based weighting within a group. Eviction (and thus cross-priority failover) happens only when agentgateway can derive an eviction duration from elsewhere: `backoff` on a retry policy, or a `Retry-After` header on a 429 that is classified as unhealthy. |
| `health.eviction`           | Removes an unhealthy endpoint from the active set for a backoff period. When every endpoint in a priority group is evicted, later requests use the next priority.                                                                                                      |

Warning

Setting `routing.failover` alone does **not** switch to a lower-priority target after errors. You must set `health.eviction` on the primary (and typically backup) concrete models. Without eviction, requests keep hitting the highest-priority group forever.

Useful `health` fields:

- `unhealthyExpression`: Optional CEL expression; `true` marks the response unhealthy. When unset, any `5xx`, non-zero gRPC status, or connection failure is unhealthy.
- `eviction.duration`: Base time to keep an endpoint evicted. When you omit `duration`, agentgateway uses the `Retry-After` value from a 429 response, then the `backoff` from a retry policy, and then a default of `3s`. Repeated evictions use multiplicative backoff, with no upper bound.
- `eviction.consecutiveFailures`: Unhealthy responses required before eviction. When this and `healthThreshold` are both unset, a single unhealthy response can evict.
- `eviction.healthThreshold`: Evict when the endpoint health score (0.0–1.0) is below this value. Either this or `consecutiveFailures` can trigger eviction when both are set.
- `eviction.restoreHealth`: Optional health score (0.0–1.0) to apply when the endpoint returns from eviction.

Failover is driven by eviction of the active set, not by rewriting a single in-flight request to another target. The request that triggers eviction still fails unless you also configure retries so a later attempt can re-select a provider after eviction.

```yaml
llm:
  models:
    - name: claude-primary
      visibility: internal
      provider: anthropic
      params:
        model: claude-sonnet-4-0
        apiKey: '$ANTHROPIC_API_KEY'
      health:
        eviction:
          consecutiveFailures: 1
          duration: 60s
    - name: claude-backup-a
      visibility: internal
      provider: anthropic
      params:
        model: claude-3-5-haiku-20241022
        apiKey: '$ANTHROPIC_API_KEY'
      health:
        eviction:
          consecutiveFailures: 1
          duration: 60s
    - name: claude-backup-b
      visibility: internal
      provider: anthropic
      params:
        model: claude-3-5-haiku-20241022
        apiKey: '$ANTHROPIC_API_KEY'
      health:
        eviction:
          consecutiveFailures: 1
          duration: 60s

  virtualModels:
    - name: resilient
      routing:
        failover:
          targets:
            - model: claude-primary
              priority: 0
            - model: claude-backup-a
              priority: 1
            - model: claude-backup-b
              priority: 1
```

In this example:

1. Requests prefer `claude-primary` (`priority: 0`).
2. After an unhealthy response meets the eviction thresholds, `claude-primary` is removed from the active set for `duration`.
3. Later requests fail over to the `priority: 1` group and load balance between `claude-backup-a` and `claude-backup-b` by health and latency.
4. Within that backup group, a degraded target is weighted down; the other backup continues to receive more traffic until the degraded target recovers or is also evicted.

### Conditional routing [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/llm/virtual-models/#conditional-routing)

Use `routing.conditional.targets` and `when` expressions to select targets by request context.

```yaml
llm:
  models:
    - name: openai-public
      visibility: public
      provider: openAI
      params:
        model: gpt-4o-mini
        apiKey: '$OPENAI_API_KEY'
    - name: openai-fast
      visibility: internal
      provider: openAI
      params:
        model: gpt-4o-mini
        apiKey: '$OPENAI_API_KEY'
    - name: openai-smart
      visibility: internal
      provider: openAI
      params:
        model: gpt-4o
        apiKey: '$OPENAI_API_KEY'

  virtualModels:
    - name: adaptive
      routing:
        conditional:
          targets:
            - model: openai-fast
              when: request.headers["x-tier"] == "free"
            - model: openai-smart
              when: request.headers["x-tier"] == "pro"
```

Note

For reusable provider defaults in simplified mode, see [Multiple LLM providers](providers/multiple-llms.md).

[Manage API keys](https://agentgateway.dev/docs/standalone/latest/llm/api-keys/ 'Manage API keys') [Inference routing](https://agentgateway.dev/docs/standalone/latest/inference/ 'Inference routing')

Was this page helpful?

Ask AI

Agentgateway assistant

Ask me anything about agentgateway configuration, features, or usage.

Note: AI-generated content might contain errors; please verify and test all returned information.

Tip: one topic per conversation gives the best results. Use the **+** button in the chat header to start a new conversation.

![Agent](virtual-models.md)

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
