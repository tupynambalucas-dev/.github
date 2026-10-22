[Skip to content](rate-limits.md#content)

`CTRL K`

Toggle theme[Docs](https://agentgateway.dev/docs/) [Standalone](../../README.md) [Kubernetes](https://agentgateway.dev/docs/kubernetes/latest/) [Models](https://agentgateway.dev/models) [Blog](https://agentgateway.dev/blog) [Enterprise](https://agentgateway.dev/enterprise) [Community](https://discord.gg/y9efgEmppm) [Get Started](https://agentgateway.dev/#getting-started) [GitHub](https://github.com/agentgateway/agentgateway)

agentgateway has joined the **Agentic AI Foundation** — [Learn more](https://aaif.io/blog/agentgateway-joins-aaif-as-an-open-gateway-for-agentic-ai-infrastructure/)×

Copy as Markdown

- Copy as Markdown
- View as Markdown
- Copy Codeblocks
- Connect to Docs MCP
- Open in Claude
- Open in ChatGPT
- Open in Perplexity
- Print

Page as Markdown

CopyDownload✕

```

```

# Rate limiting

VerifiedCode examples on this page have been automatically tested and verified.

Enforce budget and spend limits per key by controlling request and token usage.

Attaches to: [Route](https://agentgateway.dev/docs/standalone/latest/configuration/routes/ 'Route')

[Route](https://agentgateway.dev/docs/standalone/latest/configuration/routes/ 'Route')

Note

Agentgateway supports more than one configuration style. Where a feature can also be configured in the simplified `llm` or `mcp` modes, the examples on this page show each option in tabs. For more information, see [Routing-based configuration](../../llm/configuration-modes.md).

Use rate limiting to enforce budget and spend limits per key: control the rate of requests and token usage on a route. Token-based limits let you cap usage per user, per API key, or per time window. Combined with API key authentication and observability, this gives you virtual key management.

## Rate limit types [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/configuration/resiliency/rate-limits/#rate-limit-types)

Agentgateway exposes two types of rate limits:

**Local rate limits** apply in memory, and counters are not shared between replicas of agentgateway, nor across restarts.
These are very low overhead, but not appropriate for usage where exact global counts are required, or for limits with long time windows (like monthly limits).

**Remote rate limits** store counters in an pluggable external data store, which enables shared state across replicas of agentgateway.
This is controlled via the [Envoy Rate Limit gRPC service](https://www.envoyproxy.io/docs/envoy/latest/api-v3/service/ratelimit/v3/rls.proto) to enable re-use with existing rate limiting services built for Envoy; the Envoy project has an example [rate limiter service](https://github.com/envoyproxy/ratelimit) that can be used.

## Rate limit modes [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/configuration/resiliency/rate-limits/#rate-limit-modes)

In additional to simple request-based rate limits, agentgateway can limit requests based on _tokens_ for [LLM consumption](../../llm/index.md).

### Request-based rate limits [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/configuration/resiliency/rate-limits/#request-based-rate-limits)

By default, agentgateway applies rate limits to requests. Therefore, each request consumes 1 unit of capacity.

To explicitly set request-based rate limits, set the rate limiting type to `requests` as shown in the following example.

Simplified (LLM)Simplified (MCP)Routing-basedtraffic-ratelimiting-local example

```yaml
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
llm:
  policies:
    localRateLimit:
      - maxTokens: 10
        tokensPerFill: 1
        fillInterval: 60s
        type: requests
  models:
    - name: '*'
      provider: openAI
      params:
        apiKey: '$OPENAI_API_KEY'
```

```yaml
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
mcp:
  port: 3000
  policies:
    localRateLimit:
      - maxTokens: 10
        tokensPerFill: 1
        fillInterval: 60s
        type: requests
  targets:
    - name: everything
      stdio:
        cmd: npx
        args: ['@modelcontextprotocol/server-everything']
```

```yaml
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
gateways:
  default:
    port: 3000
routes:
  - policies:
      localRateLimit:
        - maxTokens: 10
          tokensPerFill: 1
          fillInterval: 60s
          type: requests
    backends:
      - host: localhost:8080
```

For a runnable version of the routing-based configuration, see the [`traffic-ratelimiting-local` example](https://github.com/agentgateway/agentgateway/tree/main/examples/traffic-ratelimiting-local) in the agentgateway repository.

[config.yaml](https://agentgateway.dev/agentgateway.dev/examples/traffic-ratelimiting-local/config.yaml)

```yaml
config:
  tracing:
    otlpEndpoint: http://localhost:4317
    randomSampling: true
binds:
  - port: 3000
    listeners:
      - protocol: HTTP
        routes:
          - policies:
              localRateLimit:
                - maxTokens: 10
                  tokensPerFill: 1
                  fillInterval: 60s
            backends:
              - host: localhost:8080
```

### Token-based rate limits [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/configuration/resiliency/rate-limits/#token-based-rate-limits)

For tokens, each token (prompt or completion) consumes 1 unit of capacity.
Because the number of tokens that are used for the completion is not known at the time the request is sent, calculating the number of tokens can become tricky. To work around this issue, agentgateway checks token-based rate limits in two phases, at request time and at response time.

To enable token-based rate limiting, set the rate limiting type to `tokens`. This example shows only the `localRateLimit` policy; attach it to a route as shown in the complete examples in the [Configuration](rate-limits.md#configuration) section.

```yaml
localRateLimit:
  - maxTokens: 10
    tokensPerFill: 1
    fillInterval: 60s
    type: tokens
```

#### At request time [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/configuration/resiliency/rate-limits/#at-request-time)

- When `tokenize: true` _is not set_ or is set to `false` on the AI backend, the number of tokens that are used for the request cannot be calculated. Because of this, the request is always allowed, unless the rate limit is set to 0 tokens. The LLM typically returns the number of tokens that were used for the request when sending the response. Agentgateway verifies the number of tokens that were used in the request and the response to determine whether the rate limit was reached. By default, `tokenize` is set to false.
- When `tokenize: true` _is set_, agentgateway estimates the number of tokens at request time. Because of that, the request is only allowed if the estimated number of tokens does not exceed the set rate limit.

#### At response time [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/configuration/resiliency/rate-limits/#at-response-time)

When the LLM returns a response, it typically provides the number of tokens that were used during the request and response. Agentgateway uses these numbers to determine if the rate limit was reached.

Note that this determination happens _after_ the response is returned. Even, if the number of tokens that are used in the response exceeds the number of allowed tokens, the response is still returned to the user. Only subsequent requests are rate limited. If `tokenize: true` is set on the AI backend and tokens were estimated during the request, agentgateway verifies the actual number of tokens that were used for the request when the LLM returns its response. In the case the initial estimation was off, agentgateway adjusts the number of used tokens to count these against the set rate limit.

## Configuration [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/configuration/resiliency/rate-limits/#configuration)

### Local [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/configuration/resiliency/rate-limits/#local)

Local rate limiting uses a [Token bucket](https://en.wikipedia.org/wiki/Token_bucket) algorithm.

| Field           | Meaning                                                                                                                       |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `maxTokens`     | Maximum, and initial, size of the bucket                                                                                      |
| `fillInterval`  | How often to refill the bucket                                                                                                |
| `tokensPerFill` | How many tokens to replenish per fill                                                                                         |
| `type`          | The type of rate limiting. Choose between `requests` for request-based rate limits, and `tokens` for token-based rate limits. |

Below shows an example rate limit configuration that allows 5,000 tokens per hour, and 60 requests per second.

Simplified (LLM)Simplified (MCP)Routing-based

```yaml
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
llm:
  policies:
    localRateLimit:
      - maxTokens: 5000
        # Every hour, refill 5000 tokens
        tokensPerFill: 5000
        fillInterval: 1h
        type: tokens
      - maxTokens: 60
        # Every second, refill 1 token
        tokensPerFill: 1
        fillInterval: 1s
        type: requests
  models:
    - name: '*'
      provider: openAI
      params:
        apiKey: '$OPENAI_API_KEY'
```

```yaml
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
mcp:
  port: 3000
  policies:
    localRateLimit:
      - maxTokens: 5000
        # Every hour, refill 5000 tokens
        tokensPerFill: 5000
        fillInterval: 1h
        type: tokens
      - maxTokens: 60
        # Every second, refill 1 token
        tokensPerFill: 1
        fillInterval: 1s
        type: requests
  targets:
    - name: everything
      stdio:
        cmd: npx
        args: ['@modelcontextprotocol/server-everything']
```

```yaml
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
gateways:
  default:
    port: 3000
routes:
  - policies:
      localRateLimit:
        - maxTokens: 5000
          # Every hour, refill 5000 tokens
          tokensPerFill: 5000
          fillInterval: 1h
          type: tokens
        - maxTokens: 60
          # Every second, refill 1 token
          tokensPerFill: 1
          fillInterval: 1s
          type: requests
    backends:
      - host: localhost:8080
```

Note

The term “tokens” is used for two distinct meanings. In `maxTokens` and `tokensPerFill`, it indicates the “token” in the token bucket counter. Each token can allow either 1 LLM token, or 1 HTTP request, based on the `type`.

### Remote [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/configuration/resiliency/rate-limits/#remote)

Remote rate limits are not defined directly in agentgateway.
Instead, agentgateway is configured to connect to an external rate limit server, and which “descriptors” to send to the server.
The rate limit server is responsible for defining, and enforcing, the appropriate limits matching the descriptors.

#### Deploy a rate limit server [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/configuration/resiliency/rate-limits/#deploy-a-rate-limit-server)

Agentgateway connects to any server that implements the [Envoy Rate Limit gRPC service](https://www.envoyproxy.io/docs/envoy/latest/api-v3/service/ratelimit/v3/rls.proto). The Envoy project provides a reference [`ratelimit`](https://github.com/envoyproxy/ratelimit) server that stores counters in Redis. If you already run a compatible service, skip to [Connect agentgateway to the rate limit server](rate-limits.md#connect-agentgateway-to-the-rate-limit-server) and point `host` at it instead.

The following example runs the `ratelimit` server and its Redis backing store locally with Docker Compose.

1. Create a rate limit configuration for the server. The `domain` and each descriptor `key` must match the `domain` and descriptor entries that agentgateway sends (configured in the next section). This example limits each distinct `organization` value to 5,000 requests per hour.

```yaml
# ratelimit-config/config.yaml
domain: example.com
descriptors:
  - key: organization
    rate_limit:
      unit: hour
      requests_per_unit: 5000
```

2. Create a Docker Compose file to run the rate limit server and Redis. The server loads every `*.yaml` file under the mounted config directory, and serves the gRPC API on port `8081`.

```yaml
# docker-compose.yaml
services:
     redis:
       image: redis:7-alpine
       ports: ["6379:6379"]

     ratelimit:
       image: envoyproxy/ratelimit:master
       depends_on: [redis]
       ports:
      - "8081:8081"   # gRPC port that agentgateway connects to
    environment:
      USE_STATSD: "false"
      LOG_LEVEL: debug
      REDIS_SOCKET_TYPE: tcp
      REDIS_URL: redis:6379
      RUNTIME_ROOT: /data
      RUNTIME_SUBDIRECTORY: ratelimit
      RUNTIME_WATCH_ROOT: "false"
    volumes:
      - ./ratelimit-config:/data/ratelimit/config
```

3. Start the server.

```sh
docker compose up -d
```

4. Verify that the server is running. The `ratelimit` container logs the descriptors it loaded from your config.

```sh
docker compose logs ratelimit
```

Note

Setting `LOG_LEVEL: debug` makes the server log every descriptor it receives from agentgateway at request time, which is the fastest way to confirm that your `domain` and descriptor keys line up on both sides.

#### Connect agentgateway to the rate limit server [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/configuration/resiliency/rate-limits/#connect-agentgateway-to-the-rate-limit-server)

With the server running, configure agentgateway to connect to it and specify which descriptors to send. Each descriptor value is a [CEL expression](../traffic-management/transformations.md).

Simplified (LLM)Simplified (MCP)Routing-based

```yaml
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
llm:
policies:
  remoteRateLimit:
    # The address to access the rate limit server
    host: localhost:8081
    # Arbitrary 'domain' to match limits on the rate limit server
    domain: example.com
    descriptors:
      # Rate limit requests based on a header, whether the user is authenticated, and a static value (used to match a specific rate limit rule on the rate limit server)
      - entries:
          - key: some-static-value
            value: '"something"'
          - key: organization
            value: 'request.headers["x-organization"]'
          - key: authenticated
            value: 'has(jwt.sub)'
        type: tokens # or 'requests'
models:
  - name: '*'
    provider: openAI
    params:
      apiKey: '$OPENAI_API_KEY'
```

```yaml
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
mcp:
port: 3000
policies:
  remoteRateLimit:
    # The address to access the rate limit server
    host: localhost:8081
    # Arbitrary 'domain' to match limits on the rate limit server
    domain: example.com
    descriptors:
      # Rate limit requests based on a header, whether the user is authenticated, and a static value (used to match a specific rate limit rule on the rate limit server)
      - entries:
          - key: some-static-value
            value: '"something"'
          - key: organization
            value: 'request.headers["x-organization"]'
          - key: authenticated
            value: 'has(jwt.sub)'
        type: tokens # or 'requests'
targets:
  - name: everything
    stdio:
      cmd: npx
      args: ['@modelcontextprotocol/server-everything']
```

```yaml
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
gateways:
default:
  port: 3000
routes:
  - policies:
      remoteRateLimit:
        # The address to access the rate limit server
        host: localhost:8081
        # Arbitrary 'domain' to match limits on the rate limit server
        domain: example.com
        descriptors:
          # Rate limit requests based on a header, whether the user is authenticated, and a static value (used to match a specific rate limit rule on the rate limit server)
          - entries:
              - key: some-static-value
                value: '"something"'
              - key: organization
                value: 'request.headers["x-organization"]'
              - key: authenticated
                value: 'has(jwt.sub)'
            type: tokens # or 'requests'
backends:
  - host: localhost:8080
```

Each descriptor value is a [CEL expression](../traffic-management/transformations.md).

For a complete runnable setup, including the Envoy rate limit service configuration and the Docker commands to run it with Redis, see the [`traffic-ratelimiting-global` example](https://github.com/agentgateway/agentgateway/tree/main/examples/traffic-ratelimiting-global) in the agentgateway repository.

**Configuration from the traffic-ratelimiting-global example**

[config.yaml](https://agentgateway.dev/agentgateway.dev/examples/traffic-ratelimiting-global/config.yaml)

```yaml
config:
tracing:
  otlpEndpoint: http://localhost:4317
  randomSampling: true
binds:
  - port: 3000
listeners:
  - protocol: HTTP
    routes:
      - policies:
          remoteRateLimit:
            domain: 'agentgateway'
            host: '127.0.0.1:8081'
            # failureMode controls behavior when the rate limit service is unavailable.
            # "failOpen" (default): allow requests through on service failure.
            # "failClosed": deny requests with 500 on service failure.
            failureMode: failOpen
            descriptors:
              - entries:
                  - key: 'method'
                    value: request.method
                  - key: 'path'
                    value: request.path
                type: 'requests'
        backends:
          - host: localhost:8080
```

The example also defines the limits on the rate limit server side:

[ratelimit-config.yaml](https://agentgateway.dev/agentgateway.dev/examples/traffic-ratelimiting-global/ratelimit-config.yaml)

```yaml
domain: agentgateway
descriptors:
  - key: method
    value: 'GET'
    descriptors:
      - key: path
        value: '/'
        rate_limit:
          unit: minute
          requests_per_unit: 5
  - key: method
    value: 'POST'
    rate_limit:
      unit: minute
      requests_per_unit: 10
```

#### Failure behavior [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/configuration/resiliency/rate-limits/#failure-behavior)

By default, if the remote rate limit service is unavailable or returns an error, agentgateway **fails closed**: the request is denied with a `500 Internal Server Error`. This prevents unmetered traffic in the event of a service outage.

To allow requests through when the rate limit service is unavailable, set `failureMode` to `failOpen`:

```yaml
remoteRateLimit:
host: localhost:8081
domain: example.com
failureMode: failOpen
descriptors:
  - entries:
      - key: organization
        value: 'request.headers["x-organization"]'
    type: requests
```

| Value                  | Behavior                                                            |
| ---------------------- | ------------------------------------------------------------------- |
| `failClosed` (default) | Deny requests with `500` when the rate limit service is unavailable |
| `failOpen`             | Allow requests through when the rate limit service is unavailable   |

Warning

Be cautious when setting the failure mode to `failOpen`. While this setting prevents service disruptions if the rate limiting server is unavailable, rate limits are not enforced for your routes until the rate limiting server is available again.

#### Backend connection policies [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/configuration/resiliency/rate-limits/#backend-connection-policies)

You can configure connection policies on the `remoteRateLimit` field to secure or tune how agentgateway connects to the rate limit service. This includes TLS, authentication, and connection timeouts.

```yaml
remoteRateLimit:
host: ratelimit-service:8081
domain: my-api
policies:
  backendAuth:
    key:
      file: /secrets/api-key
  backendTLS:
    root: /certs/ca.pem
    insecure: false
  tcp:
    connectTimeout: 3s
    # Required when setting tcp connection options; {} keeps keepalive defaults
    keepalives: {}
descriptors:
  - entries:
      - key: service
        value: '"my-service"'
failureMode: failOpen
```

| Field                          | Description                                                                                                                                                                     |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `policies.backendAuth`         | Credentials to authenticate to the rate limit service. Supports `key` (API key from file or inline), `gcp`, `aws`, and `azure` auth.                                            |
| `policies.backendTLS`          | TLS settings for the connection to the rate limit service. Use `root` to specify a CA cert, `insecure: true` to skip certificate verification (not recommended for production). |
| `policies.tcp.connectTimeout`  | Connection timeout as a duration string, such as `3s`. When you set any `tcp` option, you must also set `keepalives`. Use `keepalives: {}` to keep the keepalive defaults.      |
| `policies.http.requestTimeout` | Request-level timeout as a duration string (for example, `"5s"`). Use for HTTP-based rate limit service connections.                                                            |

## Conditional execution [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/configuration/resiliency/rate-limits/#conditional-execution)

To apply different rate limits based on the request, use the `conditional` field. For example, you can apply stricter limits on writes than on reads. For details, see [Conditional policies](../policies/conditional-policies.md).

[Mirroring](https://agentgateway.dev/docs/standalone/latest/configuration/resiliency/mirroring/ 'Mirroring') [Retries](https://agentgateway.dev/docs/standalone/latest/configuration/resiliency/retries/ 'Retries')

Was this page helpful?

Ask AI

Agentgateway assistant

Ask me anything about agentgateway configuration, features, or usage.

Note: AI-generated content might contain errors; please verify and test all returned information.

Tip: one topic per conversation gives the best results. Use the **+** button in the chat header to start a new conversation.

![Agent](rate-limits.md)

•••

Rate limit reached

The assistant keeps a rolling history of 3 exchanges. Any older messages are no longer included in the context.

Switching topics? Starting a new conversation improves accuracy.Start new conversation

Current page

↑↓ navigate
↵ select
esc dismiss

Add this pageMention a page

Standalone

Standalone

Standalone deployment docs

Kubernetes

Kubernetes deployment docs

### What could be improved?

Your feedback helps us improve assistant answers and identify docs gaps we should fix.

Need more help? Join us on Discord:
[https://discord.gg/y9efgEmppm](https://discord.gg/y9efgEmppm)

Want to use your own agent? Add the Solo MCP server to query our docs directly. Get started here:
[https://search.solo.io/](https://search.solo.io/).

SkipSubmit
