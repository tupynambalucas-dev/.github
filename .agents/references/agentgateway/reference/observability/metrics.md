# Metrics

View and monitor agentgateway metrics for traffic and performance insights

The agentgateway comes with a built-in metrics endpoint that you can use to monitor traffic that is
going through the agentgateway. Metrics are automatically collected by the agentgateway for every
request that the agentgateway receives.

## View metrics

1. Follow the [Get started](../../quickstart/index.md) guide to create a configuration for
   your agentgateway and verify access to an MCP tool.
2. Open the [agentgateway metrics endpoint](http://localhost:15020/metrics) to view all the metrics
   that the agentgateway captures. If you tried out an MCP tool earlier, such as the `everything_add`
   tool, you see the counter for the `tool_calls_total` and `list_calls_total` metrics increase.

   Example output:

   ```
   # HELP tool_calls The total number of tool calls.
   # TYPE tool_calls counter
   # HELP tool_call_errors The total number of tool call errors.
   # TYPE tool_call_errors counter
   # HELP list_calls The total number of list calls.
   # TYPE list_calls counter
   # HELP read_resource_calls The total number of read resource calls.
   # TYPE read_resource_calls counter
   # HELP get_prompt_calls The total number of get prompt calls.
   # TYPE get_prompt_calls counter
   # HELP agentgateway_xds_connection_terminations The total number of completed connections to xds server (unstable).
   # TYPE agentgateway_xds_connection_terminations counter
   # HELP agentgateway_xds_message Total number of messages received (unstable).
   # TYPE agentgateway_xds_message counter
   # HELP agentgateway_xds_message_bytes Total number of bytes received (unstable).
   # TYPE agentgateway_xds_message_bytes counter
   # UNIT agentgateway_xds_message_bytes bytes
   # HELP agentgateway_requests The total number of HTTP requests sent.
   # TYPE agentgateway_requests counter
   agentgateway_requests_total{gateway="bind/3000",listener="listener0",route="route0",route_rule="unknown",backend="unknown",method="OPTIONS",status="200"} 1
   # EOF
   ```

3. You can optionally send a curl request to the agentgateway metrics endpoint to view the metrics from
   the command line.

   ```
   curl localhost:15020/metrics -s
   ```

[Traces](/docs/standalone/latest/reference/observability/traces/ 'Traces')

Was this page helpful?
