# Jaeger

Distributed tracing with Jaeger for agentgateway

Jaeger is a distributed tracing backend that works with agentgateway’s OpenTelemetry integration.

## Quick start

Run Jaeger with Docker:

```
docker run -d --name jaeger \
  -p 16686:16686 \
  -p 4317:4317 \
  jaegertracing/all-in-one:latest
```

Configure agentgateway to send traces. The following configuration is from the [`mcp-telemetry`
example](https://github.com/agentgateway/agentgateway/tree/main/examples/mcp-telemetry) in the
agentgateway repository.

[config.yaml](https:/agentgateway.dev/examples/mcp-telemetry/config.yaml)

```
frontendPolicies:
  tracing:
    host: localhost:4317
    randomSampling: true
binds:
- port: 3000
  listeners:
  - routes:
    - backends:
      - mcp:
          targets:
          - name: everything
            stdio:
              cmd: npx
              args: ["@modelcontextprotocol/server-everything"]
```

View traces at <http://localhost:16686>.

## Trace information

Agentgateway traces include:

- **HTTP spans**: Request method, URL, status code, duration
- **MCP spans**: Session ID, method name, tool calls
- **LLM spans**: Model, token counts, provider
- **Backend spans**: Upstream connections and responses

## Docker Compose example

The following Compose file runs agentgateway alongside Jaeger. To route traces through an
OpenTelemetry Collector instead, see the [Compose file in the `mcp-telemetry`
example](https://github.com/agentgateway/agentgateway/blob/main/examples/mcp-telemetry/docker-compose.yaml).

```
version: '3'
services:
  agentgateway:
    image: cr.agentgateway.dev/agentgateway:latest
    ports:
      - "3000:3000"
    volumes:
      - ./config.yaml:/config.yaml:ro
    command: ["-f", "/config.yaml"]
    depends_on:
      - jaeger

  jaeger:
    image: jaegertracing/all-in-one:latest
    ports:
      - "16686:16686"
      - "4317:4317"
    environment:
      - COLLECTOR_OTLP_ENABLED=true
```

## Learn more

[OpenTelemetryConfigure tracing in agentgateway](opentelemetry.md) [LLM ObservabilityAI-specific observability](../../llm/observability.md)

[Grafana](/docs/standalone/latest/integrations/observability/grafana/ 'Grafana')[Request Log](/docs/standalone/latest/integrations/observability/database/ 'Request Log')

Was this page helpful?
