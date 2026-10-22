# Basic authentication

Verified Code examples on this page have been automatically tested and verified.

Configure simple username and password authentication for your routes.

Attaches to: [Listener](/docs/standalone/latest/configuration/listeners/ 'Listener')[Route](/docs/standalone/latest/configuration/routes/ 'Route')

> [!NOTE] Note Agentgateway supports more than one configuration style. Where a feature can also be configured in the simplified llm or mcp modes, the examples on this page show each option in tabs. For more information, see Routing-based configuration .

[Basic
authentication](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Authentication#basic_authentication_scheme)
enables a simple username/password authentication mechanism.

> [!WARNING] Warning Basic authentication is not generally recommended for production use. At a minimum, use basic authentication along with TLS encryption.

The **htpasswd** field specifies the username/password pairs. See the
[htpasswd](https://httpd.apache.org/docs/current/programs/htpasswd.html) documentation. The
**realm** field, optionally, specifies the [realm
name](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Authentication#www-authenticate_and_proxy-authenticate_headers)
returned in error responses.

Additionally, authentication can run in two different modes:

- **Strict**: A valid username/password pair must be present.
- **Optional** (default): If a username/password pair exists, validate it.  
  _Warning_: This allows requests without a username/password pair!

```
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
llm:
  policies:
    basicAuth:
      mode: strict
      # Generated with `htpasswd -nb -B user1 agentgateway`
      # You can also use:
      # htpasswd:
      #   file: /path/to/htpasswd
      # With inline configuration, $ must be escaped to $$.
      htpasswd: |
        user1:$$2y$$05$$LMZ.8WGNqvagmtJz2Gw6VuiE6khXc2zc0FDTHrfWJyLT66HM8BMAa
      realm: example.com
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
    basicAuth:
      mode: strict
      # Generated with `htpasswd -nb -B user1 agentgateway`
      # You can also use:
      # htpasswd:
      #   file: /path/to/htpasswd
      # With inline configuration, $ must be escaped to $$.
      htpasswd: |
        user1:$$2y$$05$$LMZ.8WGNqvagmtJz2Gw6VuiE6khXc2zc0FDTHrfWJyLT66HM8BMAa
      realm: example.com
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
    basicAuth:
      mode: strict
      # Generated with `htpasswd -nb -B user1 agentgateway`
      # You can also use:
      # htpasswd:
      #   file: /path/to/htpasswd
      # With inline configuration, $ must be escaped to $$.
      htpasswd: |
        user1:$$2y$$05$$LMZ.8WGNqvagmtJz2Gw6VuiE6khXc2zc0FDTHrfWJyLT66HM8BMAa
      realm: example.com
routes:
- backends:
  - host: localhost:8080
```

Now to send requests, include the username and password.

```
curl http://user1:agentgateway@localhost:3000
```

[JWT authentication](/docs/standalone/latest/configuration/security/jwt-authn/ 'JWT authentication')[API Key authentication](/docs/standalone/latest/configuration/security/apikey-authn/ 'API Key authentication')

Was this page helpful?
