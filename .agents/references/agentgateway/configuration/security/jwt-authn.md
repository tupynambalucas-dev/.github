# JWT authentication

Verified Code examples on this page have been automatically tested and verified.

Verify JWT tokens from incoming requests using JWKS and configured issuers.

Attaches to: [Listener](/docs/standalone/latest/configuration/listeners/ 'Listener')[Route](/docs/standalone/latest/configuration/routes/ 'Route')

> [!NOTE] Note Agentgateway supports more than one configuration style. Where a feature can also be configured in the simplified llm or mcp modes, the examples on this page show each option in tabs. For more information, see Routing-based configuration .

JWT tokens**JWT (JSON Web Token)**A compact, URL-safe token format used for securely transmitting
information between parties. JWTs are commonly used for authentication and authorization in
agentgateway. from incoming requests can be verified.

JWT authentication requires a few parameters:

- The **issuer** verifies that tokens come from the specified issuer (`iss`).
- The **audiences** lists allowed audience values (`aud`)
- The **jwks** defines the list of public keys to verify against.

Additionally, authentication can run in three different modes:

- **Strict**: A valid token, issued by a configured issuer, must be present.
- **Optional** (default): If a token exists, validate it.  
  _Warning_: This allows requests without a JWT token!
- **Permissive**: Requests are never rejected. This is useful for usage of claims in later steps (authorization, logging, etc).  
  _Warning_: This allows requests without a JWT token!

```
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
llm:
  policies:
    jwtAuth:
      mode: strict
      issuer: agentgateway.dev
      audiences: [test.agentgateway.dev]
      jwks:
        # Relative to the folder the binary runs from, not the config file
        file: ./manifests/jwt/pub-key
  models:
  - name: "*"
    provider: openAI
    params:
      apiKey: "$OPENAI_API_KEY"
```

```
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
mcp:
  port: 3000
  policies:
    jwtAuth:
      mode: strict
      issuer: agentgateway.dev
      audiences: [test.agentgateway.dev]
      jwks:
        # Relative to the folder the binary runs from, not the config file
        file: ./manifests/jwt/pub-key
  targets:
  - name: everything
    stdio:
      cmd: npx
      args: ["@modelcontextprotocol/server-everything"]
```

```
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
gateways:
  default:
    port: 3000
    jwtAuth:
      mode: strict
      issuer: agentgateway.dev
      audiences: [test.agentgateway.dev]
      jwks:
        # Relative to the folder the binary runs from, not the config file
        file: ./manifests/jwt/pub-key
routes:
- backends:
  - host: localhost:8080
```

It is common to pair `jwtAuth` with `authorization`, using the `claims` from the verified JWT. For
example:

```
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
llm:
  policies:
    jwtAuth:
      mode: strict
      issuer: agentgateway.dev
      audiences: [test.agentgateway.dev]
      jwks:
        file: ./manifests/jwt/pub-key
    authorization:
      rules:
      - allow: 'request.path == "/admin" && jwt.groups.contains("admins")'
  models:
  - name: "*"
    provider: openAI
    params:
      apiKey: "$OPENAI_API_KEY"
```

```
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
mcp:
  port: 3000
  policies:
    jwtAuth:
      mode: strict
      issuer: agentgateway.dev
      audiences: [test.agentgateway.dev]
      jwks:
        file: ./manifests/jwt/pub-key
    authorization:
      rules:
      - allow: 'request.path == "/admin" && jwt.groups.contains("admins")'
  targets:
  - name: everything
    stdio:
      cmd: npx
      args: ["@modelcontextprotocol/server-everything"]
```

```
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
gateways:
  default:
    port: 3000
    jwtAuth:
      mode: strict
      issuer: agentgateway.dev
      audiences: [test.agentgateway.dev]
      jwks:
        file: ./manifests/jwt/pub-key
routes:
- policies:
    authorization:
      rules:
      - allow: 'request.path == "/admin" && jwt.groups.contains("admins")'
  backends:
  - host: localhost:8080
```

[Network authorization](/docs/standalone/latest/configuration/security/network-authz/ 'Network authorization')[Basic authentication](/docs/standalone/latest/configuration/security/basic-authn/ 'Basic authentication')

Was this page helpful?
