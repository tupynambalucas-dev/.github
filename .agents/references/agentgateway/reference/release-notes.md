# Release notes

What’s new, changed, and fixed in each agentgateway standalone release.

Review the release notes for agentgateway standalone.

> [!NOTE] Note For more details, check out the release blog , or review the GitHub release notes in the agentgateway repository .

## 🔥 Breaking changes

### MCP request-phase guardrail rejections return HTTP 200

When an MCP guardrail rejects a request during the request phase, agentgateway now returns the
rejection as an HTTP 200 with a JSON-RPC error body, matching the existing response-phase behavior.
Update any clients or tests that expected a non-200 status for request-phase rejections.

### `auth.location` no longer nests `expression`

The `auth.location` configuration no longer uses a double-nested `expression` field. Update any
policies that set a custom token location to use the flattened form.

### musl container images removed

The `musl`-based container image variants are no longer published. Switch to the standard (glibc)
images.

## 🔒 Security

### Stateful MCP sessions can cross routes and overwrite the authorization policy

This release fixes the security advisory
[GHSA-mvgg-jvj2-4frq](https://github.com/agentgateway/agentgateway/security/advisories/GHSA-mvgg-jvj2-4frq),
a High severity (CVSS 8.1) issue in MCP authorization. In earlier versions, a client could present
an MCP session ID on a different route than the route that created the session. Agentgateway then
applied the second route’s MCP authorization policy, but stayed connected to the first route’s
backend. That mismatch bypassed the authorization controls that you configured. Only stateful MCP
setups with more than one MCP backend on separate routes are affected. HTTP authorization policies
are not affected. Now, a stateful MCP session is pinned to the backend endpoint that created it.

Upgrade to version 1.4.0 or later. No workaround exists for earlier versions. For details, review
the
[advisory](https://github.com/agentgateway/agentgateway/security/advisories/GHSA-mvgg-jvj2-4frq).

### Request and response body CEL attributes in authorization policies

The `request.body` and `response.body` CEL attributes behave differently in this release, and the
change affects any authorization policy that reads a body. The gateway buffers a body only up to the
`frontendPolicies.http.maxBufferSize` limit, which defaults to 2 MB.

| Attribute                                   | 1.3.x and earlier                                              | 1.4.x                                                                                 |
| ------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `request.body`, `response.body`             | The buffered prefix of the body, truncated to the buffer limit | Not available if the body exceeds the buffer limit. The expression fails to evaluate. |
| `request.bodyPrefix`, `response.bodyPrefix` | Not available                                                  | The first `maxBufferSize` bytes of the body                                           |

The split between `body` and `bodyPrefix` gives you more control over a body that exceeds the buffer
limit. Use `body` when the policy must see the complete body, and `bodyPrefix` when a prefix is
enough.

In either version, an authorization policy that matches on a body is prone to bypass. Consider the
following expression:

```
string(request.bodyPrefix).contains("attacker-payload")
```

If the request is larger than the buffer limit, the payload can be in the part of the body that
agentgateway did not buffer, and the expression does not match. Request encoding schemes, such as
compression, can also hide a payload from the expression.

Review each [HTTP authorization](../configuration/security/http-authz.md) and
[MCP authorization](../configuration/security/mcp-authz.md) policy that reads
`request.body` or `response.body`, and make sure that the policy degrades safely when the body
exceeds the buffer limit or arrives encoded. This guidance is a security recommendation for how you
use these attributes, not a defect in agentgateway. For the attribute descriptions, see the [CEL
reference](cel/variables.md).

## 🌟 New features

### New `gateways` configuration model

Standalone configuration gains a new top-level `gateways` concept that unifies the UI, LLM, MCP, and
routes so that they can share a single listener and port. `gateways` supersedes `binds`; existing
`binds` configuration continues to work, and the UI offers a one-click migration from `binds` to
`gateways`. This release also adds simpler host and TLS configuration, the ability to serve LLM and
MCP traffic on the same port, and an internal bind mode with wildcard fallback. For the full
configuration surface, see the [Configuration
reference](configuration/index.md).

### Database-backed configuration storage

Configuration that you create in the UI can now be stored in a database instead of on a persistent
disk. To use a database, set `config.storage.mode` to `hybrid`. Agentgateway then reads your config
file as the baseline and stores the UI-managed resources, including policies, in the database that
`config.database.url` points to. Use SQLite for local usage, or PostgreSQL for remote and highly
available setups, where a change notification keeps multiple replicas in sync. For the full
configuration surface, see the [Configuration
reference](configuration/index.md).

### MCP protocol 2026-07-28 support

Agentgateway adds support for the upcoming [MCP `2026-07-28` protocol
version](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/).

- **Stateful and stateless servers**: Agentgateway supports both stateful and stateless MCP servers, including closing the [SEP-2575](https://github.com/modelcontextprotocol/modelcontextprotocol) server-stateless conformance gap and skipping the synthetic `initialize` handshake for modern requests.
- **Trace context propagation**: Distributed trace context propagates through the MCP `_meta` field ([SEP-414](https://github.com/modelcontextprotocol/modelcontextprotocol)).
- **MCP Apps**: Basic support for MCP Apps, including multiplexing fixes for app-originated tool calls.
- **Capability and multiplexing improvements**: Preserved multi-resource tool result (MRTR) capabilities for modern clients, multi-target subscriptions and listen, and opaque resource URI multiplexing.

Because the MCP `2026-07-28` support is new in this release, most of it is not yet covered by a
dedicated guide. For the fields available today, see the [Configuration
reference](configuration/index.md).

### Cross App Access (XAA) for MCP

Agentgateway supports MCP [Enterprise-Managed
Authorization](https://modelcontextprotocol.io/extensions/auth/enterprise-managed-authorization)
through the OAuth Identity Assertion Authorization Grant (ID-JAG), also known as Cross App Access
(XAA). An enterprise identity provider can broker access between a client application and the MCP
server without the end user completing a separate OAuth flow for each downstream app. For more
information, see [Cross App
Access](../configuration/security/backend-authn/cross-app-access.md).

### OAuth token exchange backend authentication

Agentgateway can exchange an incoming token for a backend credential by using [RFC
8693](https://datatracker.ietf.org/doc/html/rfc8693) OAuth 2.0 token exchange and the [RFC
7523](https://datatracker.ietf.org/doc/html/rfc7523) JWT bearer grant. This release adds custom
token types and OAuth 2.1 exchange defaults, the ability to inject multiple secret-sourced headers,
and an override for the resolved secret key. For more information, see [OAuth token
exchange](../configuration/security/backend-authn/oauth-token-exchange.md).

### New MCP authentication providers

Agentgateway adds native MCP authentication providers for **Microsoft Entra ID**, **Descope**, and
**authentik**. The `entra` provider bridges the OAuth behaviors that Entra implements differently
from the MCP authorization specification, including serving RFC 8414 metadata from Entra’s OIDC
discovery document, stripping the RFC 8707 `resource` parameter, and short-circuiting Dynamic Client
Registration. For more information, see [MCP authentication](../mcp/mcp-authn.md)
and the [Microsoft Entra ID integration guide](../integrations/auth/entra.md).

### Virtual keys from ConfigMaps and hashed keys

Virtual keys can now be sourced from a `ConfigMap` in addition to a `Secret`, and API keys can be
stored as SHA-256 hashes so that raw key material never needs to be stored in plain text. For more
information, see [Virtual key management](../llm/cost-controls/virtual-keys.md).

### CEL enhancements

- **Custom CEL functions**: Register custom CEL functions for use in policies.
- **CEL filters for telemetry**: An opt-in CEL filter selects which requests emit OpenTelemetry spans, and CEL filters decouple OTLP log fields and filtering from stdout logging.
- **New CEL context and functions**: Access inbound `CONNECT` request headers through `source.connectHeaders`, and use a CEL replace mode for header transformations.

For the full CEL surface, see the [CEL reference](cel/index.md).

### Fault injection: request delay

A new `delay` traffic policy injects latency before a request is forwarded to the backend, for
fault-injection and chaos testing. The `policies.delay.duration` field accepts a duration string or
a CEL expression that returns a duration (or a number interpreted as milliseconds), so you can
inject latency conditionally, for example on a percentage of requests. Injected delay counts against
the request timeout. For more information, see [Fault
injection](../configuration/resiliency/fault-injection.md).

### AWS assume-role session tags and session name

AWS `assumeRole` backend authentication supports STS session tags and a configurable
`RoleSessionName`. Both the session name (`sessionNameExpression`) and per-tag values
(`tags[].expression`) can be set from CEL expressions that are evaluated per request, so you can
propagate identity attributes such as `jwt.sub` into the assumed AWS session. For more information,
see [Backend authentication](../configuration/security/backend-authn/index.md).

### Guardrail enhancements

- **Default callout timeouts**: Guardrail callouts now apply a default timeout.
- **Improved logs and UI**: Guardrail decisions surface more clearly in logs and the UI.
- **`failureMode` for external processing**: External processing (`extProc`) supports a `failureMode` for fail-open or fail-closed behavior.

For more information, see the [prompt guards](../llm/prompt-guards/index.md) and [MCP
guardrails](../mcp/guardrails/index.md) docs.

### External processing enhancements

External processing (`extProc`) supports a `failureMode` for fail-open or fail-closed behavior. For
more information, see [External
processing](../configuration/traffic-management/extproc.md).

### LLM gateway enhancements

- **Bedrock**: Added Responses-to-Bedrock image translation, sanitized tool names that exceed the 64-character Converse limit, and propagated cache-write tokens to the access log.
- **Gemini**: Fixed embeddings handling and `generateContent` model and usage extraction in detect mode.
- **Vertex AI**: Gemini requests use the native `generateContent` and `streamGenerateContent` endpoints, and `rawPredict` requests are rewritten for any publisher, not only Anthropic.
- **Azure AI Foundry**: Support for Anthropic endpoints on Foundry.
- **Detect mode and audio**: Fixed the detect-mode and audio endpoint paths.

For the list of supported providers, see the [LLM providers](../llm/providers/index.md)
docs.

### A2A v1.0 agent cards

Agentgateway supports the A2A v1.0 agent card format when it rewrites agent card URLs. For more
information, see the [A2A](../agent/a2a.md) docs.

### Operations and packaging

- **Standalone Helm chart**: A new `agentgateway-standalone` Helm chart deploys standalone agentgateway, with support for a metrics service and `ServiceMonitor`.
- **Database logging**: Standalone logging writes both successes and errors to the SQL database, with optimized write performance.
- **Bundled certificates**: Support for bundled CA certificates.
- **Security hardening**: Fixed timing attacks in authentication and added an admin IP allowlist.

[Configuration reference](/docs/standalone/latest/reference/configuration/ 'Configuration reference')[agctl CLI reference](/docs/standalone/latest/reference/agctl/ 'agctl CLI reference')

Was this page helpful?
