# API types

Supported LLM API endpoint types and route configurations

Agentgateway natively supports multiple LLM API endpoint types. These are automatically exposed on
the gateway, and translated as appropriate based on the provider.

The following API types have dedicated guides:

- **[Chat completions](completions.md)**: The OpenAI `/v1/chat/completions` endpoint. This is the most widely used API type for text generation and chat applications.
- **[Responses](responses.md)**: The OpenAI `/v1/responses` endpoint for stateful, multi-step model interactions.
- **[Messages](messages.md)**: The Anthropic `/v1/messages` endpoint for Claude models.
- **[Embeddings](embeddings.md)**: The OpenAI-compatible `/v1/embeddings` endpoint for creating vector representations of text.
- **[Realtime](realtime.md)**: The OpenAI Realtime API for low-latency, streaming voice and text interactions over WebSockets.
- **[Rerank](rerank.md)**: The Cohere-compatible `/v2/rerank` endpoint for ranking documents by relevance to a query.
- **[Models](models.md)**: The OpenAI-compatible `/v1/models` endpoint for listing available models.
- **[Token count](token-count.md)**: The Anthropic `/v1/messages/count_tokens` endpoint for estimating input tokens.
- **[Passthrough](passthrough.md)**: Forwards requests directly to the backend provider without transformation.

[Chat completions

Send chat completion requests through agentgateway using the OpenAI Chat Completions API.](completions.md)[Responses

Send requests through agentgateway using the OpenAI Responses API.](responses.md)[Messages

Send requests through agentgateway using the Anthropic Messages API.](messages.md)[Embeddings

Send embedding requests through agentgateway using the OpenAI-compatible Embeddings API.](embeddings.md)[OpenAI Realtime

Proxy OpenAI Realtime API WebSocket traffic and track token usage.](realtime.md)[Rerank

Send rerank requests through agentgateway using the Cohere-compatible Rerank API.](rerank.md)[Passthrough

Forward requests to the upstream provider without transformation.](passthrough.md)[Models

List available models through agentgateway using the OpenAI-compatible Models API.](models.md)[Token count

Count tokens through agentgateway using the Anthropic Messages token-count API.](token-count.md)

[About](/docs/standalone/latest/llm/about/ 'About')[Providers](/docs/standalone/latest/llm/providers/ 'Providers')

Was this page helpful?
