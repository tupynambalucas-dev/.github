# Direct Response

Verified Code examples on this page have been automatically tested and verified.

Serve a fixed status code and response body directly from agentgateway instead of forwarding to a
backend.

Attaches to: [Route](/docs/standalone/latest/configuration/routes/ 'Route')

> [!NOTE] Note Agentgateway supports more than one configuration style. Where a feature can also be configured in the simplified llm or mcp modes, the examples on this page show each option in tabs. For more information, see Routing-based configuration .

Directly respond to a request with a custom response using direct response**Direct Response**A
traffic management feature that returns a fixed response (body and status code) directly to the
client without forwarding the request to a backend., without forwarding to any backend.

For example, the following configuration returns a `404 Not found!` response.

```
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
mcp:
  port: 3000
  policies:
    directResponse:
      body: "Not found!"
      status: 404
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
    directResponse:
      body: "Not found!"
      status: 404
```

## Conditional execution

To return a direct response only when a CEL expression matches, use the `conditional` field. For
example, you can return `410 Gone` on deprecated paths and let every other request reach the
backend. For details, see [Conditional
policies](../policies/conditional-policies.md).

[Rewrites](/docs/standalone/latest/configuration/traffic-management/rewrites/ 'Rewrites')[Route delegation](/docs/standalone/latest/configuration/traffic-management/route-delegation/ 'Route delegation')

Was this page helpful?
