# Request matching

Verified Code examples on this page have been automatically tested and verified.

Match incoming requests by path, headers, methods, and query parameters.

Based on the route schema (see the [configuration
reference](../../reference/configuration/index.md) for the full field reference and
[schema validation](../../reference/configuration/validation.md) for IDE
integration), you can configure the following matching**Matching**The process of determining which
route should handle an incoming request based on criteria such as path, hostname, headers, query
parameters, or HTTP methods. conditions for HTTP or TCP routes.

Request matching is a routing-based feature: routes and their match conditions are configured in the
top-level `routes` section and attached to a gateway. The simplified `llm` configuration supports
header-based model matching (`llm.models[].matches`), but path, method, and query matching require
routing-based configuration. For more information about the configuration styles, see [Routing-based
configuration](../../llm/configuration-modes.md).

## HTTP routes

For routes configured with [HTTP or HTTPS
listeners](../listeners.md), you can configure the following
matching conditions. These matching conditions do not apply to [TLS
listeners](../listeners.md#tls-listeners), which use TCP routes and
only support hostname-based matching.

### Path matching

Match incoming requests based on their path using one of the following strategies.

If no path match is specified, the default is to match all paths (`/`).

| Type   | Example                        | Description                              |
| ------ | ------------------------------ | ---------------------------------------- |
| Exact  | `{ "exact": "/foo/bar" }`      | Matches only the exact path `/foo/bar`   |
| Prefix | `{ "pathPrefix": "/foo" }`     | Matches any path starting with `/foo`    |
| Regex  | `{ "regex": "^/foo/[0-9]+$" }` | Matches paths using a regular expression |

> [!NOTE] Note Only one of exact , pathPrefix , or regex can be specified per path matcher.

Review the following example configuration.

```
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
gateways:
  default:
    port: 3000
routes:
- name: api-exact
  matches:
  - path:
      exact: "/api/v1/users"
  backends:
  - host: api.example.com:8080
```

```
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
gateways:
  default:
    port: 3000
routes:
- name: api-prefix
  matches:
  - path:
      pathPrefix: "/api/v1"
  backends:
  - host: api.example.com:8080
```

```
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
gateways:
  default:
    port: 3000
routes:
- name: api-regex
  matches:
  - path:
      regex: "^/api/v[0-9]+/users$"
  backends:
  - host: api.example.com:8080
```

### Header matching

Match incoming requests based on HTTP headers included in the request.

- **Exact match:**  
  `{ "name": "Authorization", "value": { "exact": "Bearer token" } }`
- **Regex match:**  
  `{ "name": "Authorization", "value": { "regex": "^Bearer .*" } }`

Review the following example configuration.

```
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
gateways:
  default:
    port: 3000
routes:
- name: auth-exact
  matches:
  - path:
      pathPrefix: "/api"
    headers:
    - name: "Authorization"
      value:
        exact: "Bearer abc123token"
  backends:
  - host: api.example.com:8080
```

```
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
gateways:
  default:
    port: 3000
routes:
- name: auth-regex
  matches:
  - path:
      pathPrefix: "/api"
    headers:
    - name: "Authorization"
      value:
        regex: "^Bearer .*"
  backends:
  - host: api.example.com:8080
```

```
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
gateways:
  default:
    port: 3000
routes:
- name: multi-header
  matches:
  - path:
      pathPrefix: "/api"
    headers:
    - name: "Authorization"
      value:
        regex: "^Bearer .*"
    - name: "Content-Type"
      value:
        exact: "application/json"
  backends:
  - host: api.example.com:8080
```

### Method matching

Optionally restrict matches to specific HTTP methods.

```
{ "method": { "method": "GET" } }
```

Review the following example configuration.

```
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
gateways:
  default:
    port: 3000
routes:
- name: get-only
  matches:
  - path:
      pathPrefix: "/api"
    method: "GET"
  backends:
  - host: api.example.com:8080
```

```
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
gateways:
  default:
    port: 3000
routes:
- name: post-only
  matches:
  - path:
      pathPrefix: "/api/users"
    method: "POST"
  backends:
  - host: api.example.com:8080
```

```
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
gateways:
  default:
    port: 3000
routes:
- name: read-operations
  matches:
  - path:
      pathPrefix: "/api/users"
    method: "GET"
  backends:
  - host: read-api.example.com:8080
- name: write-operations
  matches:
  - path:
      pathPrefix: "/api/users"
    method: "POST"
  backends:
  - host: write-api.example.com:8080
```

### Query parameter matching

Match on query parameters, either by exact value or regex.

- **Exact:**  
  `{ "name": "version", "value": { "exact": "v1" } }`
- **Regex:**  
  `{ "name": "version", "value": { "regex": "^v[0-9]+$" } }`

Review the following example configuration.

```
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
gateways:
  default:
    port: 3000
routes:
- name: version-exact
  matches:
  - path:
      pathPrefix: "/api"
    query:
    - name: "version"
      value:
        exact: "v1"
  backends:
  - host: api-v1.example.com:8080
```

```
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
gateways:
  default:
    port: 3000
routes:
- name: version-regex
  matches:
  - path:
      pathPrefix: "/api"
    query:
    - name: "version"
      value:
        regex: "^v[0-9]+$"
  backends:
  - host: api.example.com:8080
```

```
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
gateways:
  default:
    port: 3000
routes:
- name: multi-query
  matches:
  - path:
      pathPrefix: "/api"
    query:
    - name: "version"
      value:
        exact: "v1"
    - name: "format"
      value:
        regex: "^(json|xml)$"
  backends:
  - host: api.example.com:8080
```

### Combined matching

You can combine multiple matching conditions to create a more specific route, such as the following
example.

```
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
gateways:
  default:
    port: 3000
routes:
- name: comprehensive-match
  matches:
  - path:
      pathPrefix: "/api/v1"
    method: "GET"
    headers:
    - name: "Authorization"
      value:
        regex: "^Bearer .*"
    query:
    - name: "format"
      value:
        exact: "json"
  backends:
  - host: api.example.com:8080
```

## TCP routes

For routes configured with [TCP listeners](../routes.md#tcp-routes),
you can configure the following matching conditions.

### Hostname matching

Match incoming requests based on the hostname included in the request. This is primarily used for
TLS termination scenarios.

```
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
gateways:
  database-proxy:
    port: 5432
    protocol: TCP
tcpRoutes:
- name: database-backend
  gateways: [database-proxy]
  hostnames:
  - "db.example.com"
  backends:
  - host: postgres.example.com:5432
```

### Backend routing

Route directly to backends. You can include multiple backends and weights to load balance across
them.

Higher weights receive more traffic. Each new TCP connection is assigned to a backend proportionally
based on the ratio of the weights.

In the following example, traffic is load balanced across the three backends in the ratio 1:2:1. The
first backend receives 25% of the traffic, the second backend receives 50% of the traffic, and the
third backend receives 25% of the traffic.

If no weight is specified, the default is 1. Backends with a weight of 0 receive no traffic. Each
incoming TCP connection maintains a 1:1 mapping with an outgoing backend connection; once a
connection is established, it remains bound to its assigned backend for the lifetime of that
connection.

```
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
gateways:
  redis-proxy:
    port: 6379
    protocol: TCP
tcpRoutes:
- name: redis-cluster
  gateways: [redis-proxy]
  backends:
  - host: redis-1.example.com:6379
    weight: 1
  - host: redis-2.example.com:6379
    weight: 2
  - host: redis-3.example.com:6379
    weight: 1
```

[Header manipulation](/docs/standalone/latest/configuration/traffic-management/manipulation/ 'Header manipulation')

Was this page helpful?
