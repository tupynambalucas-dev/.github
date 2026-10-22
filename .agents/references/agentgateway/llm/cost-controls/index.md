# Cost controls

Attribute, observe, enforce, and optimize LLM spend through agentgateway.

Control LLM spend end to end, in three stages:

- **Attribute**: Tie usage to teams and keys with [virtual keys](virtual-keys.md).
- **Observe**: Compute the realized USD cost of every request with a [model cost catalog](costs.md), see spend by model, provider, and user in the built-in [cost dashboard](dashboard.md), and view it in metrics, logs, and traces with [Observe traffic](../observability.md).
- **Enforce**: Cap token usage and dollar spend per user or key with [budget and spend limits](budget-limits.md), built on [rate limiting](../../configuration/resiliency/rate-limits.md).

[Virtual key management

Issue API keys with per-key token budgets and cost tracking (also known as virtual keys).](virtual-keys.md)[Model costs

Price LLM requests with a model cost catalog and expose realized USD costs in logs, traces, metrics,
…](costs.md)[Cost dashboard

View LLM spend, tokens, and traffic in the built-in Admin UI, grouped by model, provider, and user.](dashboard.md)[Budget and spend limits

Enforce per-key token budgets and dollar spend caps on LLM traffic with rate limiting.](budget-limits.md)

[Transform requests](/docs/standalone/latest/llm/transformations/ 'Transform requests')[Guardrails](/docs/standalone/latest/llm/prompt-guards/ 'Guardrails')

Was this page helpful?
