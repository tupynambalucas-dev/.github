# Rewrites

Rewrite the host or path of a request before agentgateway forwards it to a backend.

Attaches to: [Route](/docs/standalone/latest/configuration/routes/ 'Route')

> [!NOTE] Note Agentgateway supports more than one configuration style. Where a feature can also be configured in the simplified llm or mcp modes, the examples on this page show each option in tabs. For more information, see Routing-based configuration .

Modify URLs of incoming requests with rewrite**Rewrite**A traffic management feature that modifies
the authority (host) or path of requests before forwarding them to backends. policies.

For example, the following configuration modifies the request hostname to `example.com` and the
request path to `/new-path`.

```
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
mcp:
  port: 3000
  policies:
    urlRewrite:
      authority:
        full: example.com
      path:
        full: /new-path
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
    urlRewrite:
      authority:
        full: example.com
      path:
        full: /new-path
  backends:
  - host: example.com:443
```

[Transformations](/docs/standalone/latest/configuration/traffic-management/transformations/ 'Transformations')[Direct Response](/docs/standalone/latest/configuration/traffic-management/direct-response/ 'Direct Response')

Was this page helpful?
