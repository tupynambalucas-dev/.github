# MCP authorization

Verified Code examples on this page have been automatically tested and verified.

Define authorization rules for MCP method invocations using CEL expressions.

Attaches to: [Route](/docs/standalone/latest/configuration/routes/ 'Route')[Backend](/docs/standalone/latest/configuration/backends/ 'Backend')(MCP Backends only)

> [!NOTE] Note Agentgateway supports more than one configuration style. Where a feature can also be configured in the simplified llm or mcp modes, the examples on this page show each option in tabs. For more information, see Routing-based configuration .

The MCP authorization**Authorization (AuthZ)**The process of determining what actions an
authenticated user or service is allowed to perform. Agentgateway supports HTTP authorization, MCP
authorization, and external authorization services. policy works similarly to [HTTP
authorization](http-authz.md), but runs in the context
of an MCP request.

> [!NOTE] Note This policy works only for MCP traffic. Note that all standard HTTP policies also apply to MCP traffic.

Instead of running against an HTTP request, MCP authorization policies run against specific MCP
method invocations such as `list_tools` and `call_tools`.

If a tool or other resource is not allowed, the gateway automatically filters it from the `list`
response, so unauthorized clients never see it.

You can attach `mcpAuthorization` at the route level or directly to an MCP backend. A backend-level
policy applies to every MCP target in that backend. To vary the rules per target instead, keep one
route-level policy and match on the `mcp.tool.target` variable, as shown in [Different rules per
target](#different-rules-per-target). For the other policies that you can scope to an individual
target, see [MCP target policies](../../mcp/mcp-target-policies.md).

```
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
mcp:
  port: 3000
  policies:
    mcpAuthorization:
      rules:
      # Allow anyone to call 'echo'
      - 'mcp.tool.name == "echo"'
      # Only the test-user can call 'add'
      - 'jwt.sub == "test-user" && mcp.tool.name == "add"'
      # Any authenticated user with the claim `nested.key == value` can access 'printEnv'
      - 'mcp.tool.name == "printEnv" && jwt.nested.key == "value"'
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
routes:
- policies:
    mcpAuthorization:
      rules:
      # Allow anyone to call 'echo'
      - 'mcp.tool.name == "echo"'
      # Only the test-user can call 'add'
      - 'jwt.sub == "test-user" && mcp.tool.name == "add"'
      # Any authenticated user with the claim `nested.key == value` can access 'printEnv'
      - 'mcp.tool.name == "printEnv" && jwt.nested.key == "value"'
  backends:
  - mcp:
      targets:
      - name: everything
        stdio:
          cmd: npx
          args: ["@modelcontextprotocol/server-everything"]
```

> [!NOTE] Note Try out CEL expressions in the built-in CEL playground in the agentgateway admin UI before using them in your configuration.

## Role-based access with JWT claims

When you combine MCP authorization with [MCP
authentication](mcp-authn.md), you can write rules that
reference JWT claims. The following configuration restricts tools based on the authenticated user’s
identity and role:

- The MCP authentication policy validates JWTs against a local authorization server, such as Keycloak, running on port 9000.
- Any authenticated user can call the `echo` tool.
- Only the user `test-user` can call the `add` tool.
- Only users with the nested claim `nested.key == "value"` can call the `printEnv` tool.

```
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
mcp:
  port: 3000
  policies:
    mcpAuthentication:
      issuer: http://localhost:9000
      audiences:
      - http://localhost:3000/mcp
      jwks:
        url: http://localhost:9000/.well-known/jwks.json
      resourceMetadata:
        resource: http://localhost:3000/mcp
        scopesSupported:
        - read:all
        bearerMethodsSupported:
        - header
    mcpAuthorization:
      rules:
      # Any authenticated user can call 'echo'
      - 'mcp.tool.name == "echo"'
      # Only the test-user can call 'add'
      - 'jwt.sub == "test-user" && mcp.tool.name == "add"'
      # Claim-based access for 'printEnv'
      - 'mcp.tool.name == "printEnv" && jwt.nested.key == "value"'
  targets:
  - name: everything
    stdio:
      cmd: npx
      args: ["@modelcontextprotocol/server-everything"]
```

## Different rules per target

When you multiplex several MCP servers behind a single agentgateway listener, you can apply
different authorization rules to each target by matching on the `mcp.tool.target` variable in a
single policy. In the following configuration:

- Any user can access tools on the `public-tools` target.
- Only users with `admin` in the JWT `roles` claim can access tools on the `admin-tools` target.
- The JWT is validated against a local authorization server running on port 9000.

```
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
mcp:
  port: 3000
  policies:
    cors:
      allowOrigins: ["*"]
      allowHeaders:
      - mcp-protocol-version
      - content-type
      - cache-control
    mcpAuthentication:
      mode: optional
      issuer: http://localhost:9000
      audiences:
      - http://localhost:3000/mcp
      jwks:
        url: http://localhost:9000/.well-known/jwks.json
      resourceMetadata:
        resource: http://localhost:3000/mcp
        scopesSupported:
        - read:all
        bearerMethodsSupported:
        - header
    mcpAuthorization:
      rules:
      # Allow anyone to access tools on the public-tools target
      - 'mcp.tool.target == "public-tools"'
      # Only authenticated admins can access tools on the admin-tools target
      - 'mcp.tool.target == "admin-tools" && has(jwt.sub) && "admin" in jwt.roles'
  targets:
  - name: public-tools
    stdio:
      cmd: npx
      args: ["@modelcontextprotocol/server-everything"]
  - name: admin-tools
    stdio:
      cmd: npx
      args: ["@mycompany/admin-server"]
```

## CEL variables

The following MCP-specific CEL variables are available in authorization rules:

| Variable             | Type     | Availability | Description                                                    |
| -------------------- | -------- | ------------ | -------------------------------------------------------------- |
| `mcp.tool.name`      | `string` | Request-time | The name of the tool being called.                             |
| `mcp.tool.target`    | `string` | Request-time | The target backend handling the tool call.                     |
| `mcp.tool.arguments` | `map`    | Post-request | The JSON arguments passed to the tool call (access logs only). |
| `mcp.tool.result`    | `any`    | Post-request | The tool call result payload (access logs only).               |
| `mcp.tool.error`     | `any`    | Post-request | The tool call error payload (access logs only).                |
| `mcp.prompt.name`    | `string` | Request-time | The name of the prompt being accessed.                         |
| `mcp.resource.name`  | `string` | Request-time | The name of the resource being accessed.                       |
| `mcp.methodName`     | `string` | Post-request | The MCP JSON-RPC method name, such as `tools/call`.            |
| `mcp.sessionId`      | `string` | Post-request | The MCP session ID.                                            |

Request-time variables are available during authorization and can be used in `mcpAuthorization`
rules. Post-request variables are available in access log CEL expressions.

When you also configure [MCP
authentication](mcp-authn.md), claims from the validated
JWT are available to your rules as well:

| Variable           | Type     | Availability | Description                                                                 |
| ------------------ | -------- | ------------ | --------------------------------------------------------------------------- |
| `jwt.sub`          | `string` | Request-time | The `sub` (subject) claim from the JWT.                                     |
| `jwt.<claim>`      | `any`    | Request-time | Any top-level or nested JWT claim, such as `jwt.roles` or `jwt.nested.key`. |
| `has(jwt.<claim>)` | `bool`   | Request-time | Whether a JWT claim is present.                                             |

### Tool arguments are not available during authorization

`mcp.tool.arguments` is populated only after a tool call completes, so it cannot be referenced in
`mcpAuthorization` rules. Base authorization decisions on `mcp.tool.name` and `mcp.tool.target`
instead.

To inspect tool arguments, use an access log policy, which evaluates post-request:

```
frontendPolicies:
  accessLog:
    add:
      tool_args: 'mcp.tool.arguments'
```

See [MCP observability](../../mcp/mcp-observability.md) for the full example, and the
[CEL reference](../../reference/cel/index.md) for additional variables.

[MCP authentication](/docs/standalone/latest/configuration/security/mcp-authn/ 'MCP authentication')[OIDC browser authentication](/docs/standalone/latest/configuration/security/oidc/ 'OIDC browser authentication')

Was this page helpful?
