# MCP authentication

Configure OAuth 2.0 and JWT authentication for MCP servers

MCP authentication protects MCP servers with OAuth 2.0. Agentgateway acts as a resource server: it
validates the tokens that your authorization server issues, serves the protected resource metadata
that MCP clients discover, and adapts to the OAuth behavior of each supported identity provider.

For the policy reference, including the authorization server proxy, resource server only, and
passthrough scenarios, the supported providers, authentication modes, and JWT claim validation, see
[MCP authentication](../configuration/security/mcp-authn.md).

## Identity provider guides

For end-to-end setup with a specific identity provider, including registering the application and
connecting an MCP client, see the following guides.

[Auth0Use an Auth0 tenant and API as the authorization server.](../integrations/auth/auth0.md) [authentikUse a self-hosted authentik instance with a pre-registered client ID.](../integrations/auth/authentik.md) [DescopeUse a Descope project as the authorization server.](../integrations/auth/descope.md) [Microsoft Entra IDUse an Entra app registration, with metadata and registration bridging.](../integrations/auth/entra.md) [KeycloakUse a Keycloak realm, with proxied client registration.](../integrations/auth/keycloak.md) [OktaUse an Okta org authorization server with an explicit JWKS URL.](../integrations/auth/okta.md)

## Related

[MCP authorizationControl which tools and resources authenticated clients can reach.](mcp-authz.md) [7 practical MCP policiesCommunity blog post with worked authentication, authorization, and guardrail recipes.](https://learncloudnative.com/blog/2026-08-14-7-practical-mcp-policies-agentgateway)

[MCP Apps](/docs/standalone/latest/mcp/apps/ 'MCP Apps')[MCP authorization](/docs/standalone/latest/mcp/mcp-authz/ 'MCP authorization')

Was this page helpful?
