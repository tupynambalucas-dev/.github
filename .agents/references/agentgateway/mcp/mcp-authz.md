# MCP authorization

Control access to MCP tools and resources with CEL-based authorization rules

MCP authorization controls which tools, prompts, and resources a client can reach, by using [CEL
expressions](../reference/cel/index.md) that evaluate against MCP method invocations
rather than against an HTTP request.

For the policy reference, including rule syntax, the CEL variables available at request time and in
access logs, role-based access with JWT claims, and per-target rules, see [MCP
authorization](../configuration/security/mcp-authz.md).

## Related

[MCP authenticationValidate tokens so that authorization rules can match on JWT claims.](mcp-authn.md) [MCP target policiesReview the other policies that you can scope to an individual target.](mcp-target-policies.md) [MCP observabilityLog tool calls and their arguments after a request completes.](mcp-observability.md) [CEL referenceLook up the full list of supported variables and functions.](../reference/cel/index.md) [7 practical MCP policiesCommunity blog post with worked authorization, authentication, and guardrail recipes.](https://learncloudnative.com/blog/2026-08-14-7-practical-mcp-policies-agentgateway)

[MCP authentication](/docs/standalone/latest/mcp/mcp-authn/ 'MCP authentication')[MCP guardrails](/docs/standalone/latest/mcp/guardrails/ 'MCP guardrails')

Was this page helpful?
