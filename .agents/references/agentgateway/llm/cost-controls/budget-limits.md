# Budget and spend limits

Enforce per-key token budgets and dollar spend caps on LLM traffic with rate limiting.

The [Virtual key management](virtual-keys.md) guide caps
usage with a gateway-wide `localRateLimit`. This guide goes further: enforce budgets per key or per
user with remote rate limiting, and cap spend in dollars by rate limiting on the realized cost from
your [model cost catalog](costs.md).

Budget limits enforce token or cost quotas using a token bucket. Each user or API key gets a virtual
budget; each request draws it down, and the bucket refills at a configured interval. When the budget
is exhausted, requests are rejected with a `429` until the bucket refills.

## Before you begin

1. Complete the [Virtual key management](virtual-keys.md) guide to set up API key authentication and a token budget.
2. To enforce budgets per key or user (rather than a single shared budget), [deploy a remote rate limit server](../../configuration/resiliency/rate-limits.md#deploy-a-rate-limit-server). The examples in this guide assume the server is reachable at `localhost:8081`.

## Per-key token budgets

To give each user their own budget, use `remoteRateLimit` with a descriptor keyed on the API key’s
identity, and let the rate limit server hold the per-user counters.

> [!NOTE] Note Token-based rate limits are checked in two phases, at request time and at response time, because the completion token count is not known until the response returns. For details, see Token-based rate limits .

1. Configure agentgateway to send a per-user descriptor to the rate limit server. The `apiKey.user`
   value comes from the API key `metadata` you set in the virtual keys guide, so each user is counted
   independently. Setting `type: tokens` counts LLM tokens (not requests) against the budget.

   ```
   # yaml-language-server: $schema=https://agentgateway.dev/schema/config
   llm:
     policies:
       apiKey:
         mode: strict
         keys:
         - key: sk-alice-abc123def456
           metadata:
             user: alice
         - key: sk-bob-xyz789uvw012
           metadata:
             user: bob
       remoteRateLimit:
         host: localhost:8081
         domain: token-budgets
         descriptors:
         - entries:
           - key: user_id
             value: apiKey.user
           type: tokens
     models:
     - name: "*"
       provider: openAI
       params:
         apiKey: "$OPENAI_API_KEY"
   ```

2. Configure the rate limit server with a per-user daily token budget. The `key` matches the descriptor
   entry key that agentgateway sends.

   ```
   # ratelimit-config/config.yaml
   domain: token-budgets
   descriptors:
     - key: user_id
       rate_limit:
         unit: day
         requests_per_unit: 100000  # 100,000 tokens per user per day
   ```

When a user reaches their daily token budget, further requests are rejected with a `429` until the
budget refills.

## Local token budgets

For simpler setups that do not need shared state across replicas, use `localRateLimit` instead of a
remote server. Remember that a local limit is gateway-wide, not per-key, and supports only
`Seconds`, `Minutes`, and `Hours` intervals (no daily budgets).

```
llm:
  policies:
    localRateLimit:
    - maxTokens: 5000
      tokensPerFill: 5000
      fillInterval: 1h
      type: tokens
```

For the full local rate limit walkthrough, see [Virtual key
management](virtual-keys.md#configure-token-budgets).

## Convert budget to cost

To estimate the dollar value of a token budget, multiply by your provider’s pricing. For example,
with OpenAI GPT-4:

- Input tokens: $30 per 1M tokens
- Output tokens: $60 per 1M tokens

A 100,000 token budget (assuming a 50/50 input/output mix):

```
cost = (50,000 / 1,000,000 × $30) + (50,000 / 1,000,000 × $60)
     = $1.50 + $3.00
     = $4.50 per day
```

Token budgets approximate spend but drift as prices or model mix change. To cap spend in dollars
directly, enforce a dollar budget instead.

## Monitor budget usage

Track how much of each user’s budget has been consumed with the Prometheus metrics that agentgateway
exposes.

```
curl http://localhost:15020/metrics
```

Query token usage by user with the `agentgateway_gen_ai_client_token_usage_sum` metric, or realized
cost with `agw.ai.usage.cost.total`. For per-key spending queries and cost tracking, see [Virtual
key management](virtual-keys.md#monitor-per-key-spending)
and [Model costs](costs.md).

[Cost dashboard](/docs/standalone/latest/llm/cost-controls/dashboard/ 'Cost dashboard')

Was this page helpful?
