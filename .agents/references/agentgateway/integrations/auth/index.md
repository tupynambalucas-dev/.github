# Authentication & identity

Integrate agentgateway with identity providers and authentication systems

Agentgateway supports multiple authentication methods and integrates with popular identity
providers.

## Authentication methods

Agentgateway supports several authentication approaches.

| Method                 | Use Case                          | Reference                                                                |
| ---------------------- | --------------------------------- | ------------------------------------------------------------------------ |
| JWT validation         | API authentication                | [JWT authentication](../../configuration/security/jwt-authn.md)          |
| MCP authentication     | OAuth protection for MCP servers  | [MCP authentication](../../configuration/security/mcp-authn.md)          |
| OIDC browser auth      | Browser-based user authentication | [OIDC browser authentication](../../configuration/security/oidc.md)      |
| OAuth2/OIDC (external) | User authentication via proxy     | [OAuth2 Proxy](oauth2-proxy.md)                                          |
| External authz         | Custom auth services              | [External authorization](../../configuration/security/external-authz.md) |
| Tailscale              | Zero-trust networks               | [Tailscale](tailscale.md)                                                |

## Identity providers

Agentgateway includes native MCP authentication providers for the following identity providers. Each
provider adapts agentgateway to the OAuth behaviors of that authorization server, such as where it
publishes signing keys and whether it supports Dynamic Client Registration.

[Keycloak

Protect MCP servers with Keycloak as the authorization server.](keycloak.md)[OAuth2 Proxy

Add user authentication with GitHub, Google, Azure AD, and other OAuth providers by integrating …](oauth2-proxy.md)[Auth0

Protect MCP servers with Auth0 as the authorization server.](auth0.md)[Tailscale

Authenticate users with their Tailscale identity for zero-trust access to your MCP servers.](tailscale.md)[Descope

Protect MCP servers with Descope as the authorization server.](descope.md)[Okta

Protect MCP servers with Okta as the authorization server.](okta.md)[authentik

Integrate agentgateway with authentik for identity management](authentik.md)[Microsoft Entra ID

Protect MCP servers with Microsoft Entra ID (Azure AD) as the authorization server.](entra.md)

[LLM clients](/docs/standalone/latest/integrations/llm-clients/ 'LLM clients')

Was this page helpful?
