# Traces

Configure distributed tracing with Jaeger and OpenTelemetry integration

The agentgateway integrates with Jaeger as the tracing platform.
[Jaeger](https://www.jaegertracing.io) is an open source tool that helps you follow the path of a
request as it is forwarded between agents. The chain of events and interactions are captured by an
OpenTelemetry pipeline that is configured to send traces to the Jaeger agent. You can then visualize
the traces by using the Jaeger UI.

## Before you begin

1. Make sure that you have `docker`, such as by installing [Docker Desktop](https://docs.docker.com/desktop/).
2. [Install the `agentgateway` binary](../../deployment/binary.md).

## Set up Jaeger

Use [`docker compose`](https://docs.docker.com/compose/install/linux/) to spin up a Jaeger instance
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

## Tracing configuration types

Agentgateway supports two types of tracing configuration:

- **Static tracing**: Configured globally in the `config.tracing` section. All routes use the same tracing configuration.
- **Dynamic tracing**: Configured at the frontend policy level (per-listener). All routes handled by a listener use the same tracing configuration from `frontendPolicies.tracing`. This allows you to configure different tracing backends per listener, set dynamic span attributes and resource attributes using CEL expressions, override sampling rates per listener, or use different OTLP protocols (HTTP or gRPC) per listener.

## Static tracing

Static tracing is configured globally and applies to all routes.

1. Download a telemetry configuration for your agentgateway.

   ```
   curl -L https://agentgateway.dev/examples/mcp-telemetry/config.yaml -o config.yaml
   ```

2. Review the configuration file.

   ```
   cat config.yaml
   ```

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

   - **Listener**: An HTTP listener that listens for incoming traffic on port 3000.
   - **Traces**: The agentgateway is configured to send traces to the OpenTelemetry collector that you exposed on `http://localhost:4317`.
   - **Backend**: The agentgateway targets a sample, open source MCP test server, `server-everything`.

3. Optional: To use the agentgateway UI playground later, add the following CORS policy to your
   `config.yaml` file. The config automatically reloads when you save the file.

   ```
   gateways:
     default:
       port: 3000
   routes:
   - policies:
       cors:
         allowOrigins:
           - "*"
         allowHeaders:
           - "*"
     backends:
   ...
   ```

4. Run the agentgateway.

   ```
   agentgateway -f config.yaml
   ```

## Dynamic tracing

Dynamic tracing allows you to configure tracing at the frontend policy level, providing per-listener
control over tracing behavior. The tracing configuration applies to all routes handled by listeners
that use the frontend policies. Each route can have its own tracing configuration with dynamic
attributes, resources, and sampling rates.

- **`attributes`**: Span-level attributes that are added to each individual trace span. They are
  evaluated as CEL expressions for each request, so you can use dynamic values like `request.path` or
  `jwt.sub`. These appear as tags on individual spans in Jaeger.
- **`resources`**: Resource-level attributes that are set at the tracer provider level and apply to
  all spans from that tracer. The `service.name` resource attribute sets the service name that appears
  in Jaeger’s service dropdown. If not set, it defaults to `"agentgateway"`.
- **`remove`**: Attribute keys to remove before attributes are evaluated. This way, you can remove
  default attributes or avoid duplication.
- **`randomSampling` and `clientSampling`**: Optional per-policy overrides for random and client
  sampling. If set, overrides global config for requests that use this frontend policy.

### Basic dynamic tracing example

The following example shows how to configure dynamic tracing at the frontend policy level:

- **Listener**: An HTTP listener that listens for incoming traffic on port 3000.
- **Traces**: Agentgateway is configured with the following details:
  - Sends traces to the OpenTelemetry collector on `localhost:4317` with the gRPC protocol.
  - Sets the resource attributes for the service name to `agentgateway`.
  - Sets the span attributes for the environment to `production` and the route to the request path.
  - Enables random sampling tracing. By default, sampling is set to false and disabled, which means no traces are generated.
- **Policies**: A CORS policy is configured to allow all origins and the `mcp-protocol-version` header. This way, the configuration works with the [MCP inspector tool](https://modelcontextprotocol.io/docs/tools/inspector).
- **Backend**: Agentgateway targets a sample, open source MCP test server, `server-everything`.

```
frontendPolicies:
  tracing:
    host: localhost:4317
    protocol: grpc
    randomSampling: "1.0"
    attributes:
      environment: '"production"'
      route: request.path
    resources:
      service.name: '"agentgateway"'
gateways:
  default:
    port: 3000
routes:
- policies:
    cors:
      allowOrigins:
        - "*"
      allowHeaders:
        - "*"
  backends:
  - mcp:
      targets:
      - name: everything
        stdio:
          cmd: npx
          args: ["@modelcontextprotocol/server-everything"]
```

## Verify traces

1. Open the [agentgateway UI](http://localhost:15000/ui/) to view your listener and target
   configuration.
2. Connect to the MCP server with the agentgateway UI playground.

   1. From the navigation menu under **MCP**, click **Tool Playground**.
   2. If you see a banner prompting you to allow browser access, click **Apply CORS**. This adds the UI’s
      origin to the MCP CORS policy so the playground can open a session, and the configuration reloads
      automatically.
   3. Click **Initialize**. The agentgateway UI opens an MCP session and lists the tools that are exposed
      on the target.
   4. Verify that the **Result** panel reports the discovered tools.

      ![](/img/ui-playground-tools.png)

      ![](/img/ui-playground-tools-dark.png)

3. Verify access to a tool.

   1. From the **Tool** dropdown, select the `echo` tool.
   2. In the **Message** field, enter any string, such as `hello world`, and click **Call tool**.
   3. Verify that the **Result** panel returns `HTTP 200` and that your message is echoed in the **Tool
      output**.

      ![](/img/agentgateway-ui-tool-echo-hello.png)

      ![](/img/agentgateway-ui-tool-echo-hello-dark.png)

4. Open the [Jaeger UI](http://localhost:16686).
5. View traces.

   1. From the **Service** drop down, select the service name you configured, such as `agentgateway`.
   2. Click **Find Traces**.
   3. Verify that you can see trace spans for listing the MCP tools (`list_tools`) and calling a tool (`call_tool`).

   ![](/img/jaeger-traces.png)

   Expand a trace to review the details of the trace.

   ![](/img/jaeger-post-tool-call.png)

## Cleanup

Stop and remove the Jaeger container.

```
docker stop jaeger
docker rm jaeger
```

[Metrics](/docs/standalone/latest/reference/observability/metrics/ 'Metrics')

Was this page helpful?
