# Traffic management

Control traffic with matching, redirects, body buffering, rewrites, and transformations.

Control traffic and route requests through agentgateway.

> [!TIP] Tip Many of these policies are directly from the Kubernetes Gateway API and behave the same as those policies.

The guides in this section show example configuration for different types of policies. Policies are
applied to routes, which are part of a listener on a bind.

```
gateways:
  default:
    port: 3000
routes:
- policies:
```

[Request matching

Match incoming requests by path, headers, methods, and query parameters.](matching.md)[Header manipulation

Add, set, or remove HTTP request and response headers.](manipulation.md)[Redirects

Return a redirect response that rewrites the scheme, host, path, or status code before a request …](redirects.md)[Transformations

Modify header and body information for requests and responses.](transformations.md)[Rewrites

Rewrite the host or path of a request before agentgateway forwards it to a backend.](rewrites.md)[Direct Response

Serve a fixed status code and response body directly from agentgateway instead of forwarding to a …](direct-response.md)[Route delegation

Delegate routing decisions to route groups for independent team management.](route-delegation.md)[External processing (ExtProc)

Use external gRPC servers to modify HTTP requests and responses.](extproc.md)[Body buffering

Buffer request and response bodies before forwarding them.](buffer.md)[AI (LLM) Policies

Configure policies to control AI model behavior and prompt handling.](llm.md)

[Policies](/docs/standalone/latest/configuration/policies/ 'Policies')[Resiliency](/docs/standalone/latest/configuration/resiliency/ 'Resiliency')

Was this page helpful?
