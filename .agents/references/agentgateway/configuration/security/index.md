# Security

Compare the authentication, authorization, TLS, and rate limiting policies available to protect your
gateway.

Secure backends and routes with different types of security, authentication, authorization, and rate
limiting policies.

The guides in this section show example configuration for different types of policies. Policies are
applied to routes, which are part of a listener on a bind.

```
gateways:
  default:
    port: 3000
routes:
- policies:
```

[Backend authentication

Attach authentication tokens to outgoing backend requests.](backend-authn/index.md)[Backend TLS

Configure TLS for secure connections to backend services.](backend-tls.md)[CORS

Configure Cross-Origin Resource Sharing policies to control cross-domain requests.](cors.md)[CSRF

Protect against cross-site request forgery attacks with origin validation.](csrf.md)[HTTP authorization

Define allow, deny, and require rules using CEL expressions.](http-authz.md)[Network authorization

Enforce access control at the L4 level using CEL expressions.](network-authz.md)[JWT authentication

Verify JWT tokens from incoming requests using JWKS and configured issuers.](jwt-authn.md)[Basic authentication

Configure simple username and password authentication for your routes.](basic-authn.md)[API Key authentication

Authenticate requests using API keys with configurable validation modes.](apikey-authn.md)[External authorization

Delegate authorization decisions to external services like OPA.](external-authz.md)[MCP authentication

Configure OAuth 2.0 protection for MCP servers with JWT validation.](mcp-authn.md)[MCP authorization

Define authorization rules for MCP method invocations using CEL expressions.](mcp-authz.md)[OIDC browser authentication

Enable browser-based OpenID Connect authentication with encrypted session cookies.](oidc.md)

[Resiliency](/docs/standalone/latest/configuration/resiliency/ 'Resiliency')

Was this page helpful?
