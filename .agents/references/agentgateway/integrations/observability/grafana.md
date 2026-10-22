# Grafana

Verified Code examples on this page have been automatically tested and verified.

Visualize agentgateway metrics and traces with Grafana

Use Grafana to create dashboards for agentgateway metrics and visualize distributed traces.

## Quick start

Run Grafana with Docker:

```
docker run -d --name grafana \
  -p 3001:3000 \
  grafana/grafana:latest
```

Access Grafana at <http://localhost:3001> (default credentials: admin/admin).

## Add Prometheus data source

1. Go to **Configuration** → **Data Sources**
2. Click **Add data source**
3. Select **Prometheus**
4. Set URL to `http://prometheus:9090` (or your Prometheus URL)
5. Click **Save & Test**

## Add Jaeger data source

For distributed tracing:

1. Go to **Configuration** → **Data Sources**
2. Click **Add data source**
3. Select **Jaeger**
4. Set URL to `http://jaeger:16686` (or your Jaeger URL)
5. Click **Save & Test**

## Import the agentgateway dashboard

Instead of building panels by hand, import the pre-built agentgateway dashboard. This dashboard is
maintained in the [agentgateway
repository](https://github.com/agentgateway/agentgateway/blob/main/controller/install/helm/agentgateway/files/agentgateway-dashboard.json)
and visualizes both the control and data plane metrics that agentgateway exposes.

1. Download the agentgateway Grafana dashboard.

   ```
   curl -L "https://raw.githubusercontent.com/agentgateway/agentgateway/main/controller/install/helm/agentgateway/files/agentgateway-dashboard.json" -o agentgateway-dashboard.json
   ```

2. In Grafana, go to **Dashboards** > **New** > **Import**.
3. Click **Upload dashboard JSON file** and select the `agentgateway-dashboard.json` file that you
   downloaded.
4. Select your Prometheus data source, then click **Import**.
5. Verify that you see metrics, such as the request rate by gateway, LLM token consumption, or MCP tool
   calls. The dashboard includes the following sections.

   | Section  | Metric                   | Description                                                                                                                            |
   | -------- | ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
   | Overview | Memory                   | The working set memory that each agentgateway proxy pod consumes.                                                                      |
   | Overview | CPU                      | The CPU usage rate for each agentgateway proxy pod.                                                                                    |
   | Requests | Requests (by Pod)        | The request rate that each agentgateway proxy pod handles.                                                                             |
   | Requests | Requests (by Gateway)    | The request rate for each gateway.                                                                                                     |
   | Requests | Requests (by Status)     | The request rate grouped by HTTP response status.                                                                                      |
   | Requests | Requests (by Reason)     | The request rate grouped by the response reason.                                                                                       |
   | LLM      | Token Consumption        | The rate of tokens that LLM requests consume, grouped by token type, model, and gateway.                                               |
   | LLM      | Time To First Token      | The time that it takes the LLM provider to return the first token of a response.                                                       |
   | LLM      | Request Time             | The total duration of LLM requests.                                                                                                    |
   | LLM      | Tokens Per Second        | The rate at which the LLM provider returns output tokens.                                                                              |
   | MCP      | MCP Calls (by method)    | The rate of MCP requests grouped by JSON-RPC method.                                                                                   |
   | MCP      | Tool Calls (by tool)     | The rate of MCP tool calls grouped by server, resource, and tool.                                                                      |
   | Latency  | Latency by Route         | The 50th, 95th, and 99th percentile request latency for each gateway and route.                                                        |
   | XDS      | XDS Messages by Type     | The rate of xDS configuration messages that the control plane sends, grouped by resource type.                                         |
   | XDS      | XDS Average Message Size | The average size of xDS messages, grouped by resource type.                                                                            |
   | Runtime  | Cgroup Memory            | The cgroup memory usage for each agentgateway proxy pod, such as working set, anonymous, file, and kernel memory.                      |
   | Runtime  | Process Memory           | The process-level memory for each agentgateway proxy pod, such as RSS, PSS, private, shared, and swap memory.                          |
   | Runtime  | Tokio Runtime            | The async runtime statistics for each agentgateway proxy pod, such as the worker count, number of alive tasks, and global queue depth. |
   | Runtime  | Build Versions           | The agentgateway build versions that are running, grouped by tag.                                                                      |

## Build custom panels

If you prefer to build your own dashboard, you can create panels from the metrics that agentgateway
exposes. The following examples show common queries.

### Request rate

```
rate(agentgateway_requests_total[5m])
```

### Request duration (p99)

```
histogram_quantile(0.99, rate(agentgateway_request_duration_seconds_bucket[5m]))
```

### Error rate

```
rate(agentgateway_requests_total{status=~"5.."}[5m]) / rate(agentgateway_requests_total[5m])
```

### LLM token usage

```
rate(agentgateway_llm_tokens_total[5m])
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

  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana-storage:/var/lib/grafana

volumes:
  grafana-storage:
```

## Learn more

[PrometheusConfigure Prometheus metrics](prometheus.md) [OpenTelemetryDistributed tracing setup](opentelemetry.md)

[Prometheus](/docs/standalone/latest/integrations/observability/prometheus/ 'Prometheus')[Jaeger](/docs/standalone/latest/integrations/observability/jaeger/ 'Jaeger')

Was this page helpful?
