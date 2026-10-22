# CEL reference

The CEL expression context provides the following objects, which you can use in CEL expressions
throughout agentgateway configuration.

## `apiKey`

`apiKey` contains the claims from a verified API Key. This is only present if the API Key policy is
enabled.

| Field | Type   | Default | Description                                                                                       |
| ----- | ------ | ------- | ------------------------------------------------------------------------------------------------- |
| `key` | string |         | The API key value. Redacted by default; use `apiKey.key.unredacted()` to access the actual value. |

## `backend`

`backend` contains information about the backend being used.

| Field      | Type   | Default   | Description                                                                                              |
| ---------- | ------ | --------- | -------------------------------------------------------------------------------------------------------- |
| `name`     | string |           | The name of the backend being used. For example, `my-service` or `service/my-namespace/my-service:8080`. |
| `protocol` | string | `http`    | The protocol of backend.                                                                                 |
| `type`     | string | `unknown` | The type of backend.                                                                                     |

## `basicAuth`

`basicAuth` contains the claims from a verified basic authentication Key. This is only present if
the Basic authentication policy is enabled.

| Field      | Type   | Default | Description |
| ---------- | ------ | ------- | ----------- |
| `username` | string |         |             |

## `destination`

`destination` contains attributes about the downstream request destination at agentgateway.

| Field      | Type    | Default   | Description                                                                                  |
| ---------- | ------- | --------- | -------------------------------------------------------------------------------------------- |
| `address`  | string  | `0.0.0.0` | The IP address of the downstream request destination at agentgateway.                        |
| `hostname` | string  |           | The requested destination hostname, when known. For TLS connections this is the sniffed SNI. |
| `port`     | integer |           | The port of the downstream request destination at agentgateway.                              |

## `env`

`env` contains selected process environment attributes exposed to CEL. This does NOT expose raw
environment variables, but rather a subset of well-known variables.

| Field       | Type   | Default | Description                                                |
| ----------- | ------ | ------- | ---------------------------------------------------------- |
| `gateway`   | string |         | The Gateway we are running as (when running on Kubernetes) |
| `namespace` | string |         | The namespace of the pod (when running on Kubernetes)      |
| `podName`   | string |         | The name of the pod (when running on Kubernetes)           |

## `extauthz`

`extauthz` contains dynamic metadata from ext_authz filters

## `extproc`

`extproc` contains dynamic metadata from ext_proc filters

## `jwt`

`jwt` contains the claims from a verified JWT token. This is only present if the JWT policy is
enabled.

| Field      | Type   | Default | Description                                                                                            |
| ---------- | ------ | ------- | ------------------------------------------------------------------------------------------------------ |
| `rawToken` | string |         | The raw bearer token. Redacted by default; use `jwt.rawToken.unredacted()` to access the actual value. |

## `llm`

`llm` contains attributes about an LLM request or response. This is only present when using an `ai`
backend.

| Field                      | Type    | Default | Description                                                                                                                                                                                                      |
| -------------------------- | ------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cacheCreationInputTokens` | integer |         | Tokens written to cache (costs)                                                                                                                                                                                  |
| `cachedInputTokens`        | integer |         | The number of tokens in the input/prompt read from cache (savings)                                                                                                                                               |
| `completion`               | array   |         | The completion from the LLM. Warning: accessing this has some performance impacts for large responses.                                                                                                           |
| `cost`                     | object  |         | The realized USD cost of the request from the model cost catalog. Unset when the model could not be priced.                                                                                                      |
| `costRates`                | object  |         | Effective model catalog rates in USD per 1M tokens after tier selection. Unset when the model could not be priced.                                                                                               |
| `countTokens`              | integer |         | The number of tokens in the request, when using the token counting endpoint These are not counted as ‘input tokens’ since they do not consume input tokens.                                                      |
| `inputAudioTokens`         | integer |         | The number of audio tokens in the input/prompt.                                                                                                                                                                  |
| `inputImageTokens`         | integer |         | The number of image tokens in the input/prompt.                                                                                                                                                                  |
| `inputTextTokens`          | integer |         | The number of text tokens in the input/prompt. Note: this field is only set in multi-modal calls where the total token count is split out by text/image/audio; for standard all-text calls, this is unset.       |
| `inputTokens`              | integer |         | The total number of tokens in the input/prompt, including tokens read from or written to cache. This has consistent semantics across providers.                                                                  |
| `outputAudioTokens`        | integer |         | The number of audio tokens in the output/completion. Note: this field is only set in multi-modal calls where the total token count is split out by text/image/audio; for standard all-text calls, this is unset. |
| `outputImageTokens`        | integer |         | The number of image tokens in the output/completion.                                                                                                                                                             |
| `outputTextTokens`         | integer |         | The number of text tokens in the output/completion.                                                                                                                                                              |
| `outputTokens`             | integer |         | The number of tokens in the output/completion.                                                                                                                                                                   |
| `params`                   | object  |         | The parameters for the LLM request.                                                                                                                                                                              |
| `prompt`                   | array   |         | The prompt sent to the LLM. Warning: accessing this has some performance impacts for large prompts.                                                                                                              |
| `provider`                 | string  |         | The provider of the LLM.                                                                                                                                                                                         |
| `providerInputTokens`      | integer |         | The provider-reported number of tokens in the input/prompt. This is inconsistent across providers: some include cached tokens while others exclude them.                                                         |
| `providerTotalTokens`      | integer |         | The provider-reported total number of tokens for the request. This is inconsistent across providers because some include cached input tokens while others exclude them.                                          |
| `reasoningTokens`          | integer |         | The number of reasoning tokens in the output/completion.                                                                                                                                                         |
| `requestModel`             | string  |         | The model requested for the LLM request. This may differ from the actual model used.                                                                                                                             |
| `responseModel`            | string  |         | The model that actually served the LLM response.                                                                                                                                                                 |
| `serviceTier`              | string  |         | The service tier the provider served the request under.                                                                                                                                                          |
| `streaming`                | boolean |         | Whether the LLM response is streamed. If it is streamed some fields may be inconsistent based on when accessed during the response flow.                                                                         |
| `timePerOutputToken`       | string  |         | Average time from first response token to response completion per output token.                                                                                                                                  |
| `timeToFirstToken`         | string  |         | Time from request start until the first response token is received.                                                                                                                                              |
| `toolCalls`                | array   |         | The tool calls from the LLM. Warning: accessing this has some performance impacts for large responses.                                                                                                           |
| `totalTokens`              | integer |         | The total number of input and output tokens for the request. Input tokens include tokens read from or written to cache, giving this field consistent semantics across providers.                                 |

## `llmRequest`

`llmRequest` contains the raw LLM request before processing. This is only present _during_ LLM
policies; policies occurring after the LLM policy, such as logs, will not have this field present
even for LLM requests.

## `mcp`

`mcp` contains attributes about the MCP request. Request-time CEL only includes identity fields such
as `tool`, `prompt`, or `resource`. Post-request CEL may also include fields like `methodName`,
`sessionId`, and tool payloads.

| Field        | Type   | Default | Description |
| ------------ | ------ | ------- | ----------- |
| `methodName` | string |         |             |
| `prompt`     | object |         |             |
| `resource`   | object |         |             |
| `sessionId`  | string |         |             |
| `task`       | object |         |             |
| `tool`       | object |         |             |

## `mcpGuardrails`

`mcpGuardrails` contains dynamic metadata returned by mcpGuardrails policy processors.

## `metadata`

`metadata` contains values set by transformation metadata expressions.

## `proxy`

`proxy` contains proxy timing information for the request.

| Field                        | Type   | Default | Description                                                                                 |
| ---------------------------- | ------ | ------- | ------------------------------------------------------------------------------------------- |
| `bind`                       | string |         | The bind that accepted the request.                                                         |
| `gateway`                    | object |         | The selected Gateway.                                                                       |
| `listener`                   | object |         | The selected listener.                                                                      |
| `requestProcessingDuration`  | string |         | Time spent processing the request before sending the primary outbound call.                 |
| `responseProcessingDuration` | string |         | Time spent processing the primary outbound response before sending the downstream response. |
| `route`                      | object |         | The selected route.                                                                         |
| `upstreamDuration`           | string |         | Time spent waiting for the primary outbound call.                                           |

## `request`

`request` contains attributes about the incoming HTTP request

| Field          | Type   | Default    | Description                                                                                                                                                                                                                         |
| -------------- | ------ | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `body`         | string |            | The request’s body, buffered up to `maxBufferSize`. If the body exceeds the max buffer size, this field is not available and will fail to evaluate. Including this attribute in an expression will trigger the body to be buffered. |
| `bodyPrefix`   | string |            | The request body buffered up to `maxBufferSize`. If the complete body exceeds the limit, this contains the first `maxBufferSize` bytes.                                                                                             |
| `endTime`      | string |            | The time the request completed                                                                                                                                                                                                      |
| `headers`      | object |            | The headers of the request.                                                                                                                                                                                                         |
| `host`         | string |            | The hostname of the request. For example, `example.com`.                                                                                                                                                                            |
| `method`       | string | `GET`      | The HTTP method of the request. For example, `GET`                                                                                                                                                                                  |
| `path`         | string |            | The path of the request URI. For example, `/path`.                                                                                                                                                                                  |
| `pathAndQuery` | string | `/`        | The path and query of the request URI. For example, `/path?foo=bar`.                                                                                                                                                                |
| `scheme`       | string |            | The scheme of the request. For example, `https`.                                                                                                                                                                                    |
| `startTime`    | string |            | The time the request started                                                                                                                                                                                                        |
| `uri`          | string | `/`        | The complete URI of the request. For example, `http://example.com/path`.                                                                                                                                                            |
| `version`      | string | `HTTP/1.1` | The version of the request. For example, `HTTP/1.1`.                                                                                                                                                                                |

## `response`

`response` contains attributes about the HTTP response

| Field        | Type    | Default | Description                                                                                                                                                                                                                          |
| ------------ | ------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `body`       | string  |         | The response’s body, buffered up to `maxBufferSize`. If the body exceeds the max buffer size, this field is not available and will fail to evaluate. Including this attribute in an expression will trigger the body to be buffered. |
| `bodyPrefix` | string  |         | The response body buffered up to `maxBufferSize`. If the complete body exceeds the limit, this contains the first `maxBufferSize` bytes.                                                                                             |
| `code`       | integer |         | The HTTP status code of the response.                                                                                                                                                                                                |
| `grpcStatus` | integer |         | The gRPC status code of the response, when present.                                                                                                                                                                                  |
| `headers`    | object  |         | The headers of the response.                                                                                                                                                                                                         |

## `source`

`source` contains attributes about the source of the request.

| Field                | Type    | Default   | Description                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| -------------------- | ------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `address`            | string  | `0.0.0.0` | The IP address of the downstream connection.                                                                                                                                                                                                                                                                                                                                                                                                           |
| `certificate`        | string  |           | PEM of the downstream client certificate. Present only when the client presented a certificate during the TLS handshake.                                                                                                                                                                                                                                                                                                                               |
| `connectHeaders`     | object  |           | HTTP CONNECT request headers, when this stream originated from a CONNECT tunnel. Empty otherwise. Exposed in CEL as `source.connectHeaders`, which supports the same accessors as `request.headers` (indexing, `join()`, `split()`, etc.). CONNECT headers are client-supplied and unauthenticated at the transport layer, so trust decisions should validate the values (e.g. signature or issuer checks) rather than trusting header presence alone. |
| `identity`           | object  |           | The (Istio SPIFFE) identity of the downstream connection, if available.                                                                                                                                                                                                                                                                                                                                                                                |
| `issuer`             | string  |           | The issuer from the downstream certificate, if available.                                                                                                                                                                                                                                                                                                                                                                                              |
| `port`               | integer |           | The port of the downstream connection.                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `rawAddress`         | string  | `0.0.0.0` | The original TCP peer IP address of the downstream connection. This can differ from the `address` when using tunneling protocols like PROXY.                                                                                                                                                                                                                                                                                                           |
| `rawPort`            | integer |           | The original TCP peer port of the downstream connection. This can differ from the `port` when using tunneling protocols like PROXY.                                                                                                                                                                                                                                                                                                                    |
| `subject`            | string  |           | The subject from the downstream certificate, if available.                                                                                                                                                                                                                                                                                                                                                                                             |
| `subjectAltNames`    | array   |           | The subject alt names from the downstream certificate, if available.                                                                                                                                                                                                                                                                                                                                                                                   |
| `subjectCn`          | string  |           | The CN of the subject from the downstream certificate, if available.                                                                                                                                                                                                                                                                                                                                                                                   |
| `unverifiedWorkload` | object  |           | The workload context of the downstream connection, resolved from the workload discovery store by source IP. Available when the source pod is known to the controller’s workload discovery store. Fields are nested under `unverified` to signal that they are derived from the source IP (not cryptographically authenticated). Policy authors should prefer `source.identity.*` for trust-sensitive checks.                                           |

[Variables and functions](/docs/standalone/latest/reference/cel/variables/ 'Variables and functions')[CEL reference explorer](/docs/standalone/latest/reference/cel/cel-context-interactive/ 'CEL reference explorer')

Was this page helpful?
