# Redirects

Verified Code examples on this page have been automatically tested and verified.

Return a redirect response that rewrites the scheme, host, path, or status code before a request
reaches any backend.

Attaches to: [Route](/docs/standalone/latest/configuration/routes/ 'Route')[Backend](/docs/standalone/latest/configuration/backends/ 'Backend')

> [!NOTE] Note Agentgateway supports more than one configuration style. Where a feature can also be configured in the simplified llm or mcp modes, the examples on this page show each option in tabs. For more information, see Routing-based configuration .

Request redirects**Redirect**A traffic management feature that sends clients to a different URL,
with configurable scheme, authority, path, or status code. allow returning a direct response
redirecting users to another location.

For example, the following configuration will return a `307 Temporary Redirect` response with the
header `location: https://example.com/new-path`:

```
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
mcp:
  port: 3000
  policies:
    requestRedirect:
      scheme: https
      authority:
        full: example.com
      path:
        full: /new-path
      status: 307
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
    requestRedirect:
      scheme: https
      authority:
        full: example.com
      path:
        full: /new-path
      status: 307
```

[Header manipulation](/docs/standalone/latest/configuration/traffic-management/manipulation/ 'Header manipulation')[Transformations](/docs/standalone/latest/configuration/traffic-management/transformations/ 'Transformations')

Was this page helpful?
