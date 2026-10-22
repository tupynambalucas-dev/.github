# Backend authentication

Attach authentication tokens to outgoing backend requests.

Attaches to: [Backend](/docs/standalone/latest/configuration/backends/ 'Backend')

> [!NOTE] Note Agentgateway supports more than one configuration style. Where a feature can also be configured in the simplified llm or mcp modes, the examples on this page show each option in tabs. For more information, see Routing-based configuration .

## Configuration examples

When connecting to a backend, an authentication token can be attached to each request using the
backend authentication policy.

### Static keys

To attach a static key as an `Authorization` value, use `key`:

```
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
mcp:
  port: 3000
  policies:
    backendAuth:
      key:
        value: $MY_API_KEY
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
  - host: localhost:8080
    policies:
      backendAuth:
        key:
          value: $MY_API_KEY
```

The remaining examples on this page show only the `backendAuth` policy. Attach each one to a backend
under `backends[].policies`, as shown in the complete example above.

### File path

You can also add keys via a file path.

```
backendAuth:
  key:
    value:
      file: /path/to/my/key
```

### Authorization location

By default, the proxy retrieves the key from the `Authorization` header value.

To use a different header name, use the `location` field as shown in the following example.

```
backendAuth:
  key:
    value: $MY_API_KEY
    location:
      # Send as a request header (default)
      header:
        name: authorization
        prefix: "Bearer "
```

```
backendAuth:
  key:
    value: $MY_API_KEY
    location:
      # Send as a query parameter
      queryParameter:
        name: api_key
```

```
backendAuth:
  key:
    value: $MY_API_KEY
    location:
      # Send as a cookie
      cookie:
        name: api_key
```

### Passthrough

When using any form of incoming authentication, such as
[JWT](../jwt-authn.md), [API
key](../apikey-authn.md), or [basic
auth](../basic-authn.md), the original credential is
removed from the request by default before forwarding to the backend. To pass the original
credential through to the backend, use the `passthrough` method:

```
backendAuth:
  passthrough: {}
```

The `passthrough` method also accepts a `location` field to specify where to read the credential
from:

```
backendAuth:
  passthrough:
    location:
      header:
        name: authorization
        prefix: "Bearer "
```

## Google credentials

Google [Application Default
Credentials](https://docs.cloud.google.com/docs/authentication/application-default-credentials) can
also be used, which can be useful when connecting to GCP services:

```
backendAuth:
  gcp: {}
```

To request an access token (for most GCP services) or an ID token (for Cloud Run), set the `type`
field:

```
backendAuth:
  gcp:
    type: AccessToken
```

```
backendAuth:
  gcp:
    type: IdToken
    audience: "https://my-cloudrun-service-xyz.run.app"
```

Credentials are sourced from the environment automatically (for example, via the
`GOOGLE_APPLICATION_CREDENTIALS` environment variable or a metadata server).

## AWS credentials

AWS authentication can be used to sign requests to AWS services:

```
backendAuth:
  aws:
    # Specify access key and session token
    # Alternatively, leaving this empty will use the standard AWS credential lookup (https://docs.aws.amazon.com/sdkref/latest/guide/access.html) based on the environment
    accessKeyId: "$AWS_ACCESS_KEY_ID"
    secretAccessKey: "$AWS_SECRET_ACCESS_KEY"
    sessionToken: "$AWS_SESSION_TOKEN"
    region: us-west-2
```

## Token exchange methods

Instead of attaching a fixed credential, agentgateway can exchange the incoming request’s credential
for a new, backend-specific token at an OAuth authorization server before forwarding the request.

[OAuth token exchange

Exchange the incoming request credential for a per-backend token at an OAuth authorization server …](oauth-token-exchange.md)[Cross App Access (ID-JAG)

Call a downstream API as the authenticated end user with the OAuth Identity Assertion Authorization
…](cross-app-access.md)

[Backend TLS](/docs/standalone/latest/configuration/security/backend-tls/ 'Backend TLS')

Was this page helpful?
