# CEL reference explorer

Explore the CEL expression context interactively, including all available variables and their nested
fields.

- request

  - methodstring
  - uristring
  - hoststring
  - schemestring
  - pathstring
  - pathAndQuerystring
  - versionstring
  - headersobject
  - bodystring
  - bodyPrefixstring
  - startTimestring
  - endTimestring

- response

  - codeinteger
  - grpcStatusinteger
  - headersobject
  - bodystring
  - bodyPrefixstring

- proxy

  - bindstring
  - gateway

    - namespacestring
    - namestring

  - listener

    - namestring

  - route

    - namespacestring
    - namestring
    - kindstring
    - rulestring

  - requestProcessingDurationstring
  - upstreamDurationstring
  - responseProcessingDurationstring

- env

  - podNamestring
  - namespacestring
  - gatewaystring

- jwt

  - rawTokenstring

- apiKey

  - \*keystring

- basicAuth

  - \*usernamestring

- llm

  - \*streamingboolean
  - \*requestModelstring
  - responseModelstring
  - \*providerstring
  - inputTokensinteger
  - inputImageTokensinteger
  - inputTextTokensinteger
  - inputAudioTokensinteger
  - cachedInputTokensinteger
  - cacheCreationInputTokensinteger
  - outputTokensinteger
  - outputImageTokensinteger
  - outputTextTokensinteger
  - outputAudioTokensinteger
  - reasoningTokensinteger
  - totalTokensinteger
  - serviceTierstring
  - timeToFirstTokenstring
  - timePerOutputTokenstring
  - countTokensinteger
  - prompt

    - \*rolestring
    - \*contentstring

  - completionstring[]
  - toolCalls

    - \*idstring
    - \*namestring
    - \*arguments

  - \*params

    - temperaturenumber
    - top_pnumber
    - frequency_penaltynumber
    - presence_penaltynumber
    - seedinteger
    - max_tokensinteger
    - encoding_formatstring
    - dimensionsinteger

  - cost

    - \*totalnumber
    - \*inputnumber
    - \*outputnumber
    - \*cacheReadnumber
    - \*cacheWritenumber
    - \*reasoningnumber
    - \*inputAudionumber
    - \*outputAudionumber

  - costRates

    - inputnumber
    - outputnumber
    - cacheReadnumber
    - cacheWritenumber
    - reasoningnumber
    - inputAudionumber
    - outputAudionumber

- llmRequest
- source

  - addressstring
  - portinteger
  - rawAddressstring
  - rawPortinteger
  - identity

    - \*trustDomainstring
    - \*namespacestring
    - \*serviceAccountstring

  - subjectAltNamesstring[]
  - issuerstring
  - subjectstring
  - subjectCnstring
  - certificatestring
  - unverifiedWorkload

    - namestring
    - namespacestring
    - serviceAccountstring

  - connectHeadersobject

- destination

  - addressstring
  - portinteger

- mcp

  - methodNamestring
  - sessionIdstring
  - tool

    - \*targetstring
    - \*namestring
    - argumentsobject
    - result
    - error

  - prompt

    - targetstring
    - namestring

  - resource

    - targetstring
    - namestring

  - task

    - \*targetstring
    - \*namestring

- backend

  - namestring
  - typestring
  - protocolstring

- extauthzobject
- extprocobject
- mcpGuardrailsobject
- metadataobject

request

object

`request` contains attributes about the incoming HTTP request

request.method

string

The HTTP method of the request. For example, `GET`

Validation

DefaultGET

request.uri

string

The complete URI of the request. For example, `http://example.com/path`.

Validation

Default/

request.host

string

The hostname of the request. For example, `example.com`.

Validation

Defaultnull

request.scheme

string

The scheme of the request. For example, `https`.

Validation

Defaultnull

request.path

string

The path of the request URI. For example, `/path`.

request.pathAndQuery

string

The path and query of the request URI. For example, `/path?foo=bar`.

Validation

Default/

request.version

string

The version of the request. For example, `HTTP/1.1`.

Validation

DefaultHTTP/1.1

request.headers

object

The headers of the request.

Validation

Default{}

request.body

string

The request's body, buffered up to `maxBufferSize`. If the body exceeds the max buffer size,  
this field is not available and will fail to evaluate.  
Including this attribute in an expression will trigger the body to be buffered.

request.bodyPrefix

string

The request body buffered up to `maxBufferSize`. If the complete body exceeds the limit,  
this contains the first `maxBufferSize` bytes.

request.startTime

string

The time the request started

request.endTime

string

The time the request completed

response

object

`response` contains attributes about the HTTP response

response.code

integer

The HTTP status code of the response.

Validation

Default0

Formatuint16

Minimum0

Maximum65535

response.grpcStatus

integer

The gRPC status code of the response, when present.

Validation

Formatuint8

Minimum0

Maximum255

response.headers

object

The headers of the response.

Validation

Default{}

response.body

string

The response's body, buffered up to `maxBufferSize`. If the body exceeds the max buffer size,  
this field is not available and will fail to evaluate.  
Including this attribute in an expression will trigger the body to be buffered.

response.bodyPrefix

string

The response body buffered up to `maxBufferSize`. If the complete body exceeds the limit,  
this contains the first `maxBufferSize` bytes.

proxy

object

`proxy` contains proxy timing information for the request.

proxy.bind

string

The bind that accepted the request.

proxy.gateway

object

The selected Gateway.

proxy.gateway.namespace

string

The namespace of the selected Gateway.

proxy.gateway.name

string

The name of the selected Gateway.

proxy.listener

object

The selected listener.

proxy.listener.name

string

The name of the selected listener.

proxy.route

object

The selected route.

proxy.route.namespace

string

The namespace of the selected route.

proxy.route.name

string

The name of the selected route.

proxy.route.kind

string

The kind of the selected route.

proxy.route.rule

string

The selected route rule name, when available.

proxy.requestProcessingDuration

string

Time spent processing the request before sending the primary outbound call.

proxy.upstreamDuration

string

Time spent waiting for the primary outbound call.

proxy.responseProcessingDuration

string

Time spent processing the primary outbound response before sending the downstream response.

env

object

`env` contains selected process environment attributes exposed to CEL.  
This does NOT expose raw environment variables, but rather a subset of well-known variables.

env.podName

string

The name of the pod (when running on Kubernetes)

env.namespace

string

The namespace of the pod (when running on Kubernetes)

env.gateway

string

The Gateway we are running as (when running on Kubernetes)

jwt

object

`jwt` contains the claims from a verified JWT token. This is only present if the JWT policy is enabled.

jwt.rawToken

string

The raw bearer token. Redacted by default; use `jwt.rawToken.unredacted()` to access the actual value.

apiKey

object

`apiKey` contains the claims from a verified API Key. This is only present if the API Key policy is enabled.

apiKey.key

stringRequired

The API key value. Redacted by default; use `apiKey.key.unredacted()` to access the actual value.

basicAuth

object

`basicAuth` contains the claims from a verified basic authentication Key. This is only present if the Basic authentication policy is enabled.

basicAuth.username

stringRequired

`basicAuth` contains the claims from a verified basic authentication Key. This is only present if the Basic authentication policy is enabled.

llm

object

`llm` contains attributes about an LLM request or response. This is only present when using an `ai` backend.

llm.streaming

booleanRequired

Whether the LLM response is streamed. If it is streamed some fields may be inconsistent based on when accessed during the response flow.

llm.requestModel

stringRequired

The model requested for the LLM request. This may differ from the actual model used.

llm.responseModel

string

The model that actually served the LLM response.

llm.provider

stringRequired

The provider of the LLM.

llm.inputTokens

integer

The number of tokens in the input/prompt.

Validation

Formatuint64

Minimum0

llm.inputImageTokens

integer

The number of image tokens in the input/prompt.

Validation

Formatuint64

Minimum0

llm.inputTextTokens

integer

The number of text tokens in the input/prompt.  
Note: this field is only set in multi-modal calls where the total token count is split out by  
text/image/audio; for standard all-text calls, this is unset.

Validation

Formatuint64

Minimum0

llm.inputAudioTokens

integer

The number of audio tokens in the input/prompt.

Validation

Formatuint64

Minimum0

llm.cachedInputTokens

integer

The number of tokens in the input/prompt read from cache (savings)

Validation

Formatuint64

Minimum0

llm.cacheCreationInputTokens

integer

Tokens written to cache (costs)

Validation

Formatuint64

Minimum0

llm.outputTokens

integer

The number of tokens in the output/completion.

Validation

Formatuint64

Minimum0

llm.outputImageTokens

integer

The number of image tokens in the output/completion.

Validation

Formatuint64

Minimum0

llm.outputTextTokens

integer

The number of text tokens in the output/completion.

Validation

Formatuint64

Minimum0

llm.outputAudioTokens

integer

The number of audio tokens in the output/completion.  
Note: this field is only set in multi-modal calls where the total token count is split out by  
text/image/audio; for standard all-text calls, this is unset.

Validation

Formatuint64

Minimum0

llm.reasoningTokens

integer

The number of reasoning tokens in the output/completion.

Validation

Formatuint64

Minimum0

llm.totalTokens

integer

The total number of tokens for the request.

Validation

Formatuint64

Minimum0

llm.serviceTier

string

The service tier the provider served the request under.

llm.timeToFirstToken

string

Time from request start until the first response token is received.

llm.timePerOutputToken

string

Average time from first response token to response completion per output token.

llm.countTokens

integer

The number of tokens in the request, when using the token counting endpoint  
These are not counted as 'input tokens' since they do not consume input tokens.

Validation

Formatuint64

Minimum0

llm.prompt

object[]

The prompt sent to the LLM. Warning: accessing this has some performance impacts for large prompts.

llm.prompt.role

stringRequired

Message role, such as "system", "user", or "assistant".

llm.prompt.content

stringRequired

Message text content.

llm.completion

string[]

The completion from the LLM. Warning: accessing this has some performance impacts for large responses.

llm.toolCalls

object[]

The tool calls from the LLM. Warning: accessing this has some performance impacts for large responses.

llm.toolCalls.id

stringRequired

No description for this field.

llm.toolCalls.name

stringRequired

No description for this field.

llm.toolCalls.arguments

Required

No description for this field.

llm.params

objectRequired

The parameters for the LLM request.

llm.params.temperature

number

No description for this field.

Validation

Formatdouble

llm.params.top_p

number

No description for this field.

Validation

Formatdouble

llm.params.frequency_penalty

number

No description for this field.

Validation

Formatdouble

llm.params.presence_penalty

number

No description for this field.

Validation

Formatdouble

llm.params.seed

integer

No description for this field.

Validation

Formatint64

llm.params.max_tokens

integer

No description for this field.

Validation

Formatuint64

Minimum0

llm.params.encoding_format

string

No description for this field.

llm.params.dimensions

integer

No description for this field.

Validation

Formatuint64

Minimum0

llm.cost

object

The realized USD cost of the request from the model cost catalog.  
Unset when the model could not be priced.

llm.cost.total

numberRequired

No description for this field.

Validation

Formatdouble

llm.cost.input

numberRequired

No description for this field.

Validation

Formatdouble

llm.cost.output

numberRequired

No description for this field.

Validation

Formatdouble

llm.cost.cacheRead

numberRequired

No description for this field.

Validation

Formatdouble

llm.cost.cacheWrite

numberRequired

No description for this field.

Validation

Formatdouble

llm.cost.reasoning

numberRequired

No description for this field.

Validation

Formatdouble

llm.cost.inputAudio

numberRequired

No description for this field.

Validation

Formatdouble

llm.cost.outputAudio

numberRequired

No description for this field.

Validation

Formatdouble

llm.costRates

object

Effective model catalog rates in USD per 1M tokens after tier selection.  
Unset when the model could not be priced.

llm.costRates.input

number

No description for this field.

Validation

Formatdouble

llm.costRates.output

number

No description for this field.

Validation

Formatdouble

llm.costRates.cacheRead

number

No description for this field.

Validation

Formatdouble

llm.costRates.cacheWrite

number

No description for this field.

Validation

Formatdouble

llm.costRates.reasoning

number

No description for this field.

Validation

Formatdouble

llm.costRates.inputAudio

number

No description for this field.

Validation

Formatdouble

llm.costRates.outputAudio

number

No description for this field.

Validation

Formatdouble

llmRequest

`llmRequest` contains the raw LLM request before processing. This is only present \*during\* LLM policies;  
policies occurring after the LLM policy, such as logs, will not have this field present even for LLM requests.

source

object

`source` contains attributes about the source of the request.

source.address

string

The IP address of the downstream connection.

Validation

Default0.0.0.0

Formatip

source.port

integer

The port of the downstream connection.

Validation

Default0

Formatuint16

Minimum0

Maximum65535

source.rawAddress

string

The original TCP peer IP address of the downstream connection.  
This can differ from the `address` when using tunneling protocols like PROXY.

Validation

Default0.0.0.0

Formatip

source.rawPort

integer

The original TCP peer port of the downstream connection.  
This can differ from the `port` when using tunneling protocols like PROXY.

Validation

Default0

Formatuint16

Minimum0

Maximum65535

source.identity

object

The (Istio SPIFFE) identity of the downstream connection, if available.

Validation

Defaultnull

source.identity.trustDomain

stringRequired

The trust domain of the identity.

source.identity.namespace

stringRequired

The namespace of the identity.

source.identity.serviceAccount

stringRequired

The service account of the identity.

source.subjectAltNames

string[]

The subject alt names from the downstream certificate, if available.

Validation

Default[]

source.issuer

string

The issuer from the downstream certificate, if available.

source.subject

string

The subject from the downstream certificate, if available.

source.subjectCn

string

The CN of the subject from the downstream certificate, if available.

Validation

Defaultnull

source.certificate

string

PEM of the downstream client certificate. Present only when the client presented a certificate during the TLS handshake.

Validation

Defaultnull

source.unverifiedWorkload

object

The workload context of the downstream connection, resolved from the  
workload discovery store by source IP. Available when the source pod is  
known to the controller's workload discovery store.

Fields are nested under `unverified` to signal that they are derived  
from the source IP (not cryptographically authenticated). Policy  
authors should prefer `source.identity.*` for trust-sensitive checks.

source.unverifiedWorkload.name

string

The pod name of the source workload.

source.unverifiedWorkload.namespace

string

The namespace of the source workload.

source.unverifiedWorkload.serviceAccount

string

The service account of the source workload.

source.connectHeaders

object

HTTP CONNECT request headers, when this stream originated from a CONNECT  
tunnel. Empty otherwise. Exposed in CEL as `source.connectHeaders`, which  
supports the same accessors as `request.headers` (indexing, `join()`,  
`split()`, etc.).

CONNECT headers are client-supplied and unauthenticated at the transport  
layer, so trust decisions should validate the values (e.g. signature or  
issuer checks) rather than trusting header presence alone.

destination

object

`destination` contains attributes about the downstream request destination at agentgateway.

destination.address

string

The IP address of the downstream request destination at agentgateway.

Validation

Default0.0.0.0

Formatip

destination.port

integer

The port of the downstream request destination at agentgateway.

Validation

Default0

Formatuint16

Minimum0

Maximum65535

mcp

object

`mcp` contains attributes about the MCP request.  
Request-time CEL only includes identity fields such as `tool`, `prompt`, or `resource`.  
Post-request CEL may also include fields like `methodName`, `sessionId`, and tool payloads.

mcp.methodName

string

No description for this field.

mcp.sessionId

string

No description for this field.

mcp.tool

object

No description for this field.

mcp.tool.target

stringRequired

The target handling the tool call after multiplexing resolution.

mcp.tool.name

stringRequired

The resolved tool name sent to the upstream target.

mcp.tool.arguments

object

The JSON arguments passed to the tool call.

mcp.tool.result

The terminal tool result payload, if available.

mcp.tool.error

The terminal JSON-RPC error payload, if available.

mcp.prompt

object

No description for this field.

mcp.prompt.target

string

The target of the resource

mcp.prompt.name

string

The name of the resource

mcp.resource

object

No description for this field.

mcp.resource.target

string

The target of the resource

mcp.resource.name

string

The name of the resource

mcp.task

object

No description for this field.

mcp.task.target

stringRequired

The target handling the task.

mcp.task.name

stringRequired

The task ID.

backend

object

`backend` contains information about the backend being used.

backend.name

string

The name of the backend being used. For example, `my-service` or `service/my-namespace/my-service:8080`.

backend.type

string

The type of backend.

Validation

Enumai, mcp, static, dynamic, service, unknown

Defaultunknown

backend.protocol

string

The protocol of backend.

Validation

Enumhttp, tcp, a2a, mcp, llm

Defaulthttp

extauthz

object

`extauthz` contains dynamic metadata from ext_authz filters

extproc

object

`extproc` contains dynamic metadata from ext_proc filters

mcpGuardrails

object

`mcpGuardrails` contains dynamic metadata returned by mcpGuardrails policy processors.

metadata

object

`metadata` contains values set by transformation metadata expressions.

[CEL reference](/docs/standalone/latest/reference/cel/cel-context/ 'CEL reference')

Was this page helpful?
