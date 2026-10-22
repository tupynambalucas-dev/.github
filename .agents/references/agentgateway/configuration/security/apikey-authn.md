# API Key authentication

Verified Code examples on this page have been automatically tested and verified.

Authenticate requests using API keys with configurable validation modes.

Attaches to: [Listener](/docs/standalone/latest/configuration/listeners/ 'Listener')[Route](/docs/standalone/latest/configuration/routes/ 'Route')

> [!NOTE] Note Agentgateway supports more than one configuration style. Where a feature can also be configured in the simplified llm or mcp modes, the examples on this page show each option in tabs. For more information, see Routing-based configuration .

API key**API Key**A secret token used to authenticate API requests. Agentgateway can validate API
keys and attach metadata to authenticated requests. authentication**Authentication (AuthN)**The
process of verifying the identity of a user or service. Agentgateway supports various authentication
methods including JWT, API keys, and basic authentication. enables authenticating requests based on
a user-provided API key.

> [!TIP] Tip This policy is about authenticating incoming requests. For attaching API keys to outgoing requests, see Backend Authentication .

API Key authentication involves configuring a list of valid API keys, with associated metadata about
the key (optional).

Additionally, authentication can run in three different modes:

- **Strict**: A valid API key must be present.
- **Optional** (default): If an API key exists, validate it.  
  _Warning_: This allows requests without an API key!
- **Permissive**: Requests are never rejected. This setting is useful for usage of claims in later steps such as authorization or logging.  
  _Warning_: This allows requests without an API key!

```
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
llm:
  policies:
    apiKey:
      mode: strict
      keys:
      - key: sk-testkey-1
        metadata:
          user: test
          role: admin
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
    apiKey:
      mode: strict
      keys:
      - key: sk-testkey-1
        metadata:
          user: test
          role: admin
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
    apiKey:
      mode: strict
      keys:
      - key: sk-testkey-1
        metadata:
          user: test
          role: admin
routes:
- backends:
  - host: localhost:8080
```

Later policies can now operate on the metadata associated with the API key. For example, you can set
a custom `x-authenticated-user` header with the authenticated user from the API key metadata by
adding a route-level transformation.

```
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
llm:
  policies:
    apiKey:
      mode: strict
      keys:
      - key: sk-testkey-1
        metadata:
          user: test
          role: admin
    transformations:
      request:
        set:
          x-authenticated-user: apiKey.user
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
    apiKey:
      mode: strict
      keys:
      - key: sk-testkey-1
        metadata:
          user: test
          role: admin
    transformations:
      request:
        set:
          x-authenticated-user: apiKey.user
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
    apiKey:
      mode: strict
      keys:
      - key: sk-testkey-1
        metadata:
          user: test
          role: admin
routes:
- policies:
    transformations:
      request:
        set:
          x-authenticated-user: apiKey.user
  backends:
  - host: localhost:8080
```

[Basic authentication](/docs/standalone/latest/configuration/security/basic-authn/ 'Basic authentication')[External authorization](/docs/standalone/latest/configuration/security/external-authz/ 'External authorization')

Was this page helpful?
