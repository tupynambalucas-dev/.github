# Backend TLS

Verified Code examples on this page have been automatically tested and verified.

Configure TLS for secure connections to backend services.

Attaches to: [Backend](/docs/standalone/latest/configuration/backends/ 'Backend')

> [!NOTE] Note Agentgateway supports more than one configuration style. Where a feature can also be configured in the simplified llm or mcp modes, the examples on this page show each option in tabs. For more information, see Routing-based configuration .

By default, requests to backends use HTTP. To use HTTPS, configure a backend TLS**TLS (Transport
Layer Security)**A cryptographic protocol that provides secure communication over a network.
Agentgateway supports TLS for both incoming connections (listeners) and outgoing connections
(backends). policy.

```
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
mcp:
  port: 3000
  policies:
    backendTLS:
      # A file containing the root certificate to verify.
      # If unset, the system trust bundle will be used.
      root: ./certs/root-cert.pem
      # For mutual TLS, the client certificate to use
      cert: ./certs/cert.pem
      # For mutual TLS, the client certificate key to use.
      key: ./certs/key.pem
      # If set, hostname verification is disabled
      # insecureHost: true
      # If set, all TLS verification is disabled
      # insecure: true
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
- backends:
  - host: localhost:8443
    policies:
      backendTLS:
        # A file containing the root certificate to verify.
        # If unset, the system trust bundle will be used.
        root: ./certs/root-cert.pem
        # For mutual TLS, the client certificate to use
        cert: ./certs/cert.pem
        # For mutual TLS, the client certificate key to use.
        key: ./certs/key.pem
        # If set, hostname verification is disabled
        # insecureHost: true
        # If set, all TLS verification is disabled
        # insecure: true
```

[Backend authentication](/docs/standalone/latest/configuration/security/backend-authn/ 'Backend authentication')[CORS](/docs/standalone/latest/configuration/security/cors/ 'CORS')

Was this page helpful?
