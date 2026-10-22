# Header manipulation

Verified Code examples on this page have been automatically tested and verified.

Add, set, or remove HTTP request and response headers.

Attaches to: [Route](/docs/standalone/latest/configuration/routes/ 'Route')[Backend](/docs/standalone/latest/configuration/backends/ 'Backend')

> [!NOTE] Note Agentgateway supports more than one configuration style. Where a feature can also be configured in the simplified llm or mcp modes, the examples on this page show each option in tabs. For more information, see Routing-based configuration .

There are a few different policies that offer manipulation of HTTP requests and responses.

The `requestHeaderModifier` and `responseHeaderModifier` modify request and response headers
respectively. These allow you to `add`, `set`, or `remove` headers. `add` and `set` differ in the
case the header already exists; `set` will replace it while `add` will append.

```
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
mcp:
  port: 3000
  policies:
    requestHeaderModifier:
      add:
        x-req-added: value
      remove:
      - x-remove-me
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
    requestHeaderModifier:
      add:
        x-req-added: value
      remove:
      - x-remove-me
  backends:
  - host: localhost:8080
```

More advanced operations are available with the [`transformation` policy](../transformations). Like
the `HeaderModifier` policies, this can also `add`, `set`, or `remove` headers, but can also
manipulate HTTP bodies. Additionally, each modification is based on a [CEL
expression](transformations.md) rather than
static strings.

[Request matching](/docs/standalone/latest/configuration/traffic-management/matching/ 'Request matching')[Redirects](/docs/standalone/latest/configuration/traffic-management/redirects/ 'Redirects')

Was this page helpful?
