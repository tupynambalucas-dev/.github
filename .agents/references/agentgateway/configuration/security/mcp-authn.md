# MCP authentication

Verified Code examples on this page have been automatically tested and verified.

Configure OAuth 2.0 protection for MCP servers with JWT validation.

Attaches to: [Route](/docs/standalone/latest/configuration/routes/ 'Route')

> [!NOTE] Note Agentgateway supports more than one configuration style. Where a feature can also be configured in the simplified llm or mcp modes, the examples on this page show each option in tabs. For more information, see Routing-based configuration .

MCP authentication enables OAuth 2.0 protection for MCP servers, helping to implement the [MCP
Authorization
specification](https://modelcontextprotocol.io/specification/draft/basic/authorization).
Agentgateway can act as a resource server, validating JWT tokens and exposing protected resource
metadata.

MCP authentication is configured at the route level under `policies.mcpAuthentication`. Because the
policy runs at the route level, you can use JWT claims from MCP auth in other route-level policies,
such as authorization, rate limiting, and transformations.

MCP authentication uses a connect-time model, sometimes called _eager auth_: the OAuth flow happens
once when the client first connects, not on each tool call. After the initial authentication, the
access token is reused for all subsequent requests within the session.

> [!NOTE] Note This policy works only for MCP traffic. Note that all standard HTTP policies also apply to MCP traffic.

There are three deployment scenarios.

## Authorization Server Proxy

Agentgateway can adapt traffic for authorization servers that don’t fully comply with OAuth
standards. For example, Keycloak exposes certificates at a non-standard endpoint.

Set the `provider` field to adapt agentgateway’s behavior to a specific authorization server.

In this mode, agentgateway:

- Exposes protected resource metadata on behalf of the MCP server
- Proxies authorization server metadata and client registration
- Validates tokens using the authorization server’s JWKS
- Returns `401 Unauthorized` with appropriate `WWW-Authenticate` headers for unauthenticated requests

### Supported providers

The `provider` field takes a map with a single provider key, such as `provider: {keycloak: {}}`.
Each provider adapts agentgateway to the behavior of that authorization server, including where it
publishes signing keys and how it handles Dynamic Client Registration (DCR).

Other identity providers that fully comply with the OAuth 2.0 specifications might also work, but
are not tested. For an end-to-end setup guide for each tested provider, see the [Authentication &
Identity](../../integrations/auth/index.md) section.

| `provider`                                          | Derived JWKS URL                                                                                                             | Metadata source      | Notable behavior                                                                                                                 |
| --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | -------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| [`auth0`](../../integrations/auth/auth0.md)         | {issuer}/.well-known/jwks.json                                                                                               | RFC 8414             | Appends the first audience to the authorization endpoint, because Auth0 does not support RFC 8707.                               |
| [`authentik`](../../integrations/auth/authentik.md) | {issuer}/jwks/                                                                                                               | OIDC discovery       | Injects a DCR endpoint, because open source authentik does not implement RFC 7591. Requires `clientId`.                          |
| [`descope`](../../integrations/auth/descope.md)     | [https://api.descope.com/{project-id}/.well-known/jwks.json](https://api.descope.com/%7bproject-id%7d/.well-known/jwks.json) | OIDC discovery       | Rewrites agentic issuers to the project-level JWKS URL. `clientId` recommended, because DCR requires a management key.           |
| [`entra`](../../integrations/auth/entra.md)         | Derived from the tenant’s v2.0 discovery document                                                                            | Entra v2.0 discovery | Strips the RFC 8707 `resource` parameter and proxies `authorize` and `token`. Requires `clientId`.                               |
| [`keycloak`](../../integrations/auth/keycloak.md)   | {issuer}/protocol/openid-connect/certs                                                                                       | OIDC discovery       | Proxies DCR, because Keycloak sends CORS headers on its registration endpoint only for origins that you allow in a realm policy. |
| [`okta`](../../integrations/auth/okta.md) `*`       | {issuer}/.well-known/jwks.json                                                                                               | OIDC discovery       | Appends the first audience to the authorization endpoint and proxies DCR to the org-level endpoint. Set `jwks` explicitly.       |
| Not set                                             | {issuer}/.well-known/jwks.json                                                                                               | RFC 8414             | Standards-compliant behavior with no provider-specific adaptations.                                                              |

`*` Okta publishes keys at `{issuer}/v1/keys`, not at the `{issuer}/.well-known/jwks.json` URL that
agentgateway derives, so always set `jwks` explicitly. For more information, see the [Okta
guide](../../integrations/auth/okta.md).

### Configuration example

Review the following configuration example and descriptions.

```
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
mcp:
  port: 3000
  policies:
    mcpAuthentication:
      issuer: http://localhost:7080/realms/mcp
      audiences: ["http://localhost:3000/mcp"]
      jwks:
        url: http://localhost:7080/realms/mcp/protocol/openid-connect/certs
      provider:
        keycloak: {}
      resourceMetadata:
        resource: http://localhost:3000/mcp
        scopesSupported:
        - read:all
        bearerMethodsSupported:
        - header
        - body
        - query
        resourceDocumentation: http://localhost:3000/stdio/docs
        resourcePolicyUri: http://localhost:3000/stdio/policies
  targets:
  - name: tools
    stdio:
      cmd: npx
      args: ["@modelcontextprotocol/server-everything"]
```

```
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
gateways:
  default:
    port: 3000
routes:
- backends:
  - mcp:
      targets:
      - name: tools
        stdio:
          cmd: npx
          args: ["@modelcontextprotocol/server-everything"]
  matches:
  - path:
      exact: /mcp
  - path:
      exact: /.well-known/oauth-protected-resource/mcp
  - path:
      exact: /.well-known/oauth-authorization-server/mcp
  - path:
      exact: /.well-known/oauth-authorization-server/mcp/client-registration
  policies:
    mcpAuthentication:
      issuer: http://localhost:7080/realms/mcp
      audiences: ["http://localhost:3000/mcp"]
      jwks:
        url: http://localhost:7080/realms/mcp/protocol/openid-connect/certs
      provider:
        keycloak: {}
      resourceMetadata:
        resource: http://localhost:3000/mcp
        scopesSupported:
        - read:all
        bearerMethodsSupported:
        - header
        - body
        - query
        resourceDocumentation: http://localhost:3000/stdio/docs
        resourcePolicyUri: http://localhost:3000/stdio/policies
```

| Setting          | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| resourceMetadata | The metadata source is where agentgateway fetches the authorization server metadata that it serves to MCP clients. `RFC 8414` means the path-based `/.well-known/oauth-authorization-server/{path}` form. `OIDC discovery` means `{issuer}/.well-known/openid-configuration`, which these providers serve instead. Most of them do not implement the RFC 8414 path-based issuer format; Keycloak 26.4.0 and later do, but agentgateway keeps using OIDC discovery for it so that earlier versions work, too. |
| jwks             | Set `jwks` to override that URL with a different endpoint, a local file, or an inline key set. If you omit `jwks`, agentgateway fetches keys from the derived URL for your provider.                                                                                                                                                                                                                                                                                                                         |
| clientId         | Setting `clientId` short-circuits DCR for every provider: agentgateway answers registration requests with that pre-registered client instead of proxying them to the authorization server. For `authentik` and `entra` this is the only way registration can succeed, because Entra has no registration endpoint and open source authentik does not implement RFC 7591.                                                                                                                                      |
| clientSecret     | Set `clientSecret` when your pre-registered client is a confidential client that the authorization server requires to authenticate at the token endpoint, such as an Entra app registration under the **Web** platform. Omit it for public, PKCE-only clients. Agentgateway injects the secret server-side into proxied token requests; MCP clients never supply it.                                                                                                                                         |
| matches          | In routing-based configuration, the route must also match the `/.well-known/oauth-authorization-server/<path>` prefix so that agentgateway can serve the proxied metadata and the `authorize` and `token` endpoints. The simplified `mcp` form sets up those routes for you.                                                                                                                                                                                                                                 |

### Adding an IdP

Adding support for a new provider requires minimal code changes. To contribute support for your
identity provider, see the [`McpIDP` enum in the agentgateway
source](https://github.com/agentgateway/agentgateway/blob/main/crates/agentgateway/src/types/agent.rs).

## Resource Server Only

Agentgateway acts solely as a resource server, validating tokens issued by an external authorization
server.

```
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
mcp:
  port: 3000
  policies:
    mcpAuthentication:
      issuer: http://localhost:9000
      audiences: ["http://localhost:3000/mcp"]
      jwks:
        url: http://localhost:9000/.well-known/jwks.json
      resourceMetadata:
        resource: http://localhost:3000/mcp
        scopesSupported:
        - read:all
        bearerMethodsSupported:
        - header
        - body
        - query
  targets:
  - name: tools
    stdio:
      cmd: npx
      args: ["@modelcontextprotocol/server-everything"]
```

```
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
gateways:
  default:
    port: 3000
routes:
- backends:
  - mcp:
      targets:
      - name: tools
        stdio:
          cmd: npx
          args: ["@modelcontextprotocol/server-everything"]
  matches:
  - path:
      exact: /mcp
  - path:
      exact: /.well-known/oauth-protected-resource/mcp
  policies:
    mcpAuthentication:
      issuer: http://localhost:9000
      audiences: ["http://localhost:3000/mcp"]
      jwks:
        url: http://localhost:9000/.well-known/jwks.json
      resourceMetadata:
        resource: http://localhost:3000/mcp
        scopesSupported:
        - read:all
        bearerMethodsSupported:
        - header
        - body
        - query
```

## Authentication mode

You can control how agentgateway handles requests that lack valid credentials by setting the `mode`
field. The following modes are supported:

| Mode               | Behavior                                                                                                                          |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| `strict` (default) | A valid token issued by a configured issuer must be present. Requests without a valid token are rejected with `401 Unauthorized`. |
| `optional`         | If a token is present, it is validated. Requests without a token are permitted.                                                   |
| `permissive`       | Requests are never rejected based on authentication.                                                                              |

The following example sets the mode to `permissive`:

```
policies:
  mcpAuthentication:
    mode: permissive
    issuer: http://localhost:9000
    audiences: ["http://localhost:3000/mcp"]
    jwks:
      url: http://localhost:9000/.well-known/jwks.json
    resourceMetadata:
      resource: http://localhost:3000/mcp
      scopesSupported:
      - read:all
```

## JWT claim validation

By default, agentgateway requires the `exp` (expiration) claim to be present in every JWT. To change
which claims are required, set the `jwtValidationOptions.requiredClaims` field. The following RFC
7519 registered claims are supported: `exp`, `nbf`, `aud`, `iss`, and `sub`. Any other claim name
that you list, such as `iat` or a custom claim, is ignored and logged as a warning.

> [!NOTE] Note The requiredClaims field controls only whether a claim must be present. It does not control whether the claim’s value is checked. When one of the exp , nbf , aud , or iss claims is present in a token, agentgateway validates its value, whether or not you list the claim in requiredClaims . For example, an expired token is rejected because it carries an exp claim, even if you omit exp from requiredClaims . The sub claim is checked for presence only, and custom claims are never validated by this field. To enforce the value of a custom claim, use an authorization policy instead.

Some identity providers issue tokens without an `exp` claim. To accept those tokens, set
`requiredClaims` to an empty list.

```
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
mcp:
  port: 3000
  policies:
    mcpAuthentication:
      issuer: http://localhost:9000
      audiences: ["http://localhost:3000/mcp"]
      jwks:
        url: http://localhost:9000/.well-known/jwks.json
      jwtValidationOptions:
        requiredClaims: []
      resourceMetadata:
        resource: http://localhost:3000/mcp
        scopesSupported:
        - read:all
  targets:
  - name: tools
    stdio:
      cmd: npx
      args: ["@modelcontextprotocol/server-everything"]
```

To require additional claims, such as `aud` and `sub` alongside `exp`, list each one.

```
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
mcp:
  port: 3000
  policies:
    mcpAuthentication:
      issuer: http://localhost:9000
      audiences: ["http://localhost:3000/mcp"]
      jwks:
        url: http://localhost:9000/.well-known/jwks.json
      jwtValidationOptions:
        requiredClaims:
        - exp
        - aud
        - sub
      resourceMetadata:
        resource: http://localhost:3000/mcp
        scopesSupported:
        - read:all
  targets:
  - name: tools
    stdio:
      cmd: npx
      args: ["@modelcontextprotocol/server-everything"]
```

## Passthrough

When the MCP server already implements OAuth authentication, no additional configuration is needed.
Agentgateway passes requests through without modification.

[External authorization](/docs/standalone/latest/configuration/security/external-authz/ 'External authorization')[MCP authorization](/docs/standalone/latest/configuration/security/mcp-authz/ 'MCP authorization')

Was this page helpful?
