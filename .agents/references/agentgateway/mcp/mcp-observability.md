# MCP observability

Track MCP tool calls with agentgateway metrics, logs, and distributed traces.

Review MCP-specific metrics, logs, and traces.

## Before you begin

Complete an MCP guide, such as the [stdio](../connect/stdio) guide. This guide uses the agentgateway
playground to interact with an MCP tool server, which generates metrics, logs, and traces.

## View MCP metrics

You can access the agentgateway metrics endpoint to view MCP-specific metrics, such as the number of
tool calls that were performed.

1. Open the agentgateway [metrics endpoint](http://localhost:15020/metrics).
2. Look for the `mcp_requests_total` metric. This metric counts the MCP requests that agentgateway
   processed and includes labels that describe each request, such as:

   - `server`: The MCP server that was used for the request.
   - `method`: The MCP method that was invoked, such as `tools/call` or `tools/list`.
   - `resource`: The name of the tool or resource that was accessed.
   - `resource_type`: The type of resource, such as `tool`, `prompt`, or `resource`.

   To count only tool calls, filter the metric on the `method` label.

## View traces

1. Use [`docker compose`](https://docs.docker.com/compose/install/linux/) to spin up a Jaeger instance
   with the following components:

   - An OpenTelemetry collector that receives traces from the agentgateway and forwards them to Jaeger. The collector is exposed on `http://localhost:4317`.
   - A Jaeger agent that receives the collected traces. The agent is exposed on `http://localhost:14268`.
   - A Jaeger UI that is exposed on `http://localhost:16686`.

   Steps to create a Jaeger instance:

   1. Create the OpenTelemetry collector configuration file in your current directory. The Compose file in
      the next step mounts this file into the collector container. Both files are sourced from the
      [`examples/mcp-telemetry`](https://github.com/agentgateway/agentgateway/tree/main/examples/mcp-telemetry)
      directory in the agentgateway repository.

      ```
      cat > otel-collector-config.yaml <<'EOF'
      receivers:
           otlp:
             protocols:
               grpc:
                 endpoint: 0.0.0.0:4317

         processors:
           batch: {}

         exporters:
           debug:
             verbosity: detailed
           otlp/jaeger:
             endpoint: jaeger:4317
             tls:
               insecure: true

         service:
           pipelines:
             logs:
               receivers: [otlp]
               processors: [batch]
               exporters: [debug]
             traces:
               receivers: [otlp]
               processors: [batch]
               exporters: [otlp/jaeger]

      EOF
      ```

   2. Spin up the Jaeger and collector containers.

      ```
      docker compose -f - up -d <<EOF
      services:
           jaeger:
             container_name: jaeger
             restart: unless-stopped
             image: jaegertracing/all-in-one:latest
             ports:
             - "127.0.0.1:16686:16686"
             - "127.0.0.1:14268:14268"
             environment:
             - COLLECTOR_OTLP_ENABLED=true

           otel-collector:
             container_name: otel-collector
             image: otel/opentelemetry-collector-contrib:0.146.0
             volumes:
               - ./otel-collector-config.yaml:/etc/otelcol-contrib/config.yaml
             ports:
               - "127.0.0.1:4317:4317"
             depends_on:
               - jaeger

      EOF
      ```

2. Configure your agentgateway proxy to emit traces and send them to the built-in OpenTelemetry
   collector agent. This example uses static tracing configuration. For per-route dynamic tracing
   configuration, see [Dynamic
   tracing](../reference/observability/traces.md#dynamic-tracing).

   ```
   cat <<EOF > config.yaml
   # yaml-language-server: $schema=https://agentgateway.dev/schema/config
   config:
     tracing:
       otlpEndpoint: http://localhost:4317
       randomSampling: true
   mcp:
     port: 3000
     targets:
     - name: everything
       stdio:
         cmd: npx
         args: ["@modelcontextprotocol/server-everything"]
   EOF
   ```

3. Run your agentgateway proxy.

   ```
   agentgateway -f config.yaml
   ```

4. Open the [agentgateway playground](http://localhost:15000/ui/playground/) and click **Connect**.
   Then, select a tool, such as `echo`, enter any message, and click **Run Tool**.
5. Open the [Jaeger UI](http://localhost:16686/search) and select the `call_tool` operation. Then,
   verify that you can see traces for your MCP tool call.

## View logs

Agentgateway automatically logs information to stdout. When you run agentgateway on your local
machine, you can view a log entry for each request that is sent to agentgateway in your CLI output.

Example for a successful MCP tool call:

```
INFO request ... protocol=mcp mcp.method.name=tools/call mcp.target=everything gen_ai.tool.name=echo mcp.session.id=6b497ee9-3710-428a-96d2-31ebeab73dcd trace.id=286cb6c44380a45e1f77f29ce4d146fd span.id=f7f30629c29d9089
```

### MCP logging fields

Agentgateway includes the following MCP-specific fields in structured logs:

| Field               | Description                                                                        |
| ------------------- | ---------------------------------------------------------------------------------- |
| `mcp.method.name`   | The MCP method being invoked, such as `initialize`, `tools/list`, or `tools/call`. |
| `mcp.session.id`    | The unique session identifier for the MCP connection.                              |
| `mcp.target`        | The target MCP server name.                                                        |
| `mcp.resource.type` | The type of resource, such as `tool`, `prompt`, `resource`, or `templates`.        |
| `mcp.resource.uri`  | The URI of the resource being accessed. Emitted for resource requests.             |
| `gen_ai.tool.name`  | The name of the tool being called. Emitted for tool-call requests.                 |

These fields are part of default structured logging and are emitted automatically for every MCP
request. To customize access logs further, you can use [CEL
expressions](../reference/cel/variables.md) to filter which requests are logged
and add post-request fields that are not captured by default. For example, the following access log
policy filters access log entries to only tool calls and adds the tool arguments and result to each
log entry:

```
frontendPolicies:
  accessLog:
    filter: 'mcp.methodName == "tools/call"'
    add:
      tool_args: 'mcp.tool.arguments'
      tool_result: 'mcp.tool.result'
      tool_error: 'mcp.tool.error'
```

The following CEL variables are available in access log policies but are **not** included in default
structured logs:

| Variable             | Availability | Description                                                         |
| -------------------- | ------------ | ------------------------------------------------------------------- |
| `mcp.methodName`     | Post-request | The MCP JSON-RPC method name, such as `tools/call` or `tools/list`. |
| `mcp.sessionId`      | Post-request | The MCP session ID.                                                 |
| `mcp.tool.name`      | Request-time | The name of the tool being called.                                  |
| `mcp.tool.target`    | Request-time | The target backend handling the tool call.                          |
| `mcp.tool.arguments` | Post-request | The JSON arguments passed to the tool call.                         |
| `mcp.tool.result`    | Post-request | The tool call result payload.                                       |
| `mcp.tool.error`     | Post-request | The tool call error payload.                                        |

For the full list of CEL variables, see the [CEL variables
reference](../reference/cel/variables.md).

[MCP target policies](/docs/standalone/latest/mcp/mcp-target-policies/ 'MCP target policies')[MCP spec compatibility](/docs/standalone/latest/mcp/spec-compatibility/ 'MCP spec compatibility')

Was this page helpful?
