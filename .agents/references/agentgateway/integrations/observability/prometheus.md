# Prometheus

Collect metrics from agentgateway with Prometheus

Agentgateway exposes Prometheus-compatible metrics for monitoring and alerting.

## Metrics endpoint

Agentgateway exposes metrics on port `15020` by default:

```
curl http://localhost:15020/metrics
```

## Available metrics

### Request metrics

| Metric                                  | Type      | Description              |
| --------------------------------------- | --------- | ------------------------ |
| `agentgateway_requests_total`           | Counter   | Total number of requests |
| `agentgateway_request_duration_seconds` | Histogram | Request duration         |
| `agentgateway_request_size_bytes`       | Histogram | Request size             |
| `agentgateway_response_size_bytes`      | Histogram | Response size            |

### Connection metrics

| Metric                            | Type    | Description        |
| --------------------------------- | ------- | ------------------ |
| `agentgateway_connections_active` | Gauge   | Active connections |
| `agentgateway_connections_total`  | Counter | Total connections  |

### MCP metrics

| Metric                             | Type    | Description                  |
| ---------------------------------- | ------- | ---------------------------- |
| `agentgateway_mcp_sessions_active` | Gauge   | Active MCP sessions          |
| `agentgateway_mcp_requests_total`  | Counter | Total MCP requests by method |

### LLM metrics

| Metric                                      | Type      | Description                 |
| ------------------------------------------- | --------- | --------------------------- |
| `agentgateway_llm_requests_total`           | Counter   | Total LLM requests          |
| `agentgateway_llm_tokens_total`             | Counter   | Total tokens (input/output) |
| `agentgateway_llm_request_duration_seconds` | Histogram | LLM request duration        |

## Prometheus configuration

Add agentgateway to your Prometheus configuration:

```
# prometheus.yml
scrape_configs:
  - job_name: 'agentgateway'
    static_configs:
      - targets: ['localhost:15020']
    scrape_interval: 15s
```

## Docker Compose example

```
version: '3'
services:
  agentgateway:
    image: cr.agentgateway.dev/agentgateway:latest
    ports:
      - "3000:3000"
      - "15020:15020"
    volumes:
      - ./config.yaml:/config.yaml:ro
    command: ["-f", "/config.yaml"]

  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
```

## Learn more

[GrafanaVisualize metrics with Grafana](grafana.md) [OpenTelemetryDistributed tracing and metrics](opentelemetry.md)

[OpenTelemetry](/docs/standalone/latest/integrations/observability/opentelemetry/ 'OpenTelemetry')[Grafana](/docs/standalone/latest/integrations/observability/grafana/ 'Grafana')

Was this page helpful?
