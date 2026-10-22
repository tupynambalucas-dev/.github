# OpenAI Realtime

Verified Code examples on this page have been automatically tested and verified.

Proxy OpenAI Realtime API WebSocket traffic and track token usage.

Proxy OpenAI Realtime API traffic through agentgateway to get token usage tracking and observability
for WebSocket-based interactions.

## About

The [OpenAI Realtime API](https://developers.openai.com/api/docs/guides/realtime) uses WebSocket
connections for low-latency, multimodal interactions. Agentgateway can proxy these WebSocket
connections and parse the `response.done` events to extract token usage data, including input
tokens, output tokens, and cached token counts.

To enable token usage tracking, you must prevent the client and server from negotiating WebSocket
frame compression. When the `sec-websocket-extensions: permessage-deflate` header is present, the
WebSocket frames are compressed and agentgateway cannot parse the token usage data. Remove this
header from the request so that frames remain uncompressed and parseable.

> [!NOTE] Note The realtime route type supports token usage tracking and observability. Other LLM policies such as prompt guards, prompt enrichment, and request-body rate limiting are not supported for WebSocket traffic.

## Before you begin

[Install the `agentgateway` binary](../../deployment/binary.md).

## Step 1: Configure the Realtime route

Set up your agentgateway configuration with the `realtime` route type and a transformation to remove
the `sec-websocket-extensions` header.

1. Create or update your `config.yaml` file. Map the `/v1/realtime` path to the `realtime` route type
   and remove the `sec-websocket-extensions` header to prevent WebSocket frame compression.

   ```
   cat <<'EOF' > config.yaml
   # yaml-language-server: $schema=https://agentgateway.dev/schema/config
   gateways:
     default:
       port: 3000
   routes:
   - matches:
     - path:
         pathPrefix: "/v1/realtime"
     backends:
     - ai:
         name: openai
         provider:
           openAI: {}
     policies:
       ai:
         routes:
           "/v1/realtime": "realtime"
       backendAuth:
         key: "$OPENAI_API_KEY"
       transformations:
         request:
           remove:
           - sec-websocket-extensions
   - backends:
     - ai:
         name: openai
         provider:
           openAI:
             model: gpt-4
     policies:
       ai:
         routes:
           "/v1/chat/completions": "completions"
           "*": "passthrough"
       backendAuth:
         key: "$OPENAI_API_KEY"
   EOF
   ```

2. Run the agentgateway proxy with your configuration.

   ```
   agentgateway -f config.yaml
   ```

## Step 2: Send a Realtime request

Send a request to the OpenAI Realtime API through agentgateway using a WebSocket client. The
Realtime API uses WebSocket connections, so standard HTTP tools like `curl` do not work. Use a
WebSocket client such as [`websocat`](https://github.com/vi/websocat),
[`wscat`](https://github.com/websockets/wscat), or a custom application.

Connect to `ws://localhost:3000/v1/realtime?model=gpt-4o-realtime-preview` and send the following
[client events](https://developers.openai.com/api/docs/guides/realtime) as JSON messages.

1. Create a conversation item with a text message.

   ```
   {"type":"conversation.item.create","item":{"type":"message","role":"user","content":[{"type":"input_text","text":"Say hello in one word."}]}}
   ```

2. Trigger a text response.

   ```
   {"type":"response.create","response":{"modalities":["text"]}}
   ```

3. Look for a `response.done` event in the server output. This event contains the token usage data that
   agentgateway extracts for metrics.

   ```
   {"type":"response.done","response":{...,"usage":{"total_tokens":225,"input_tokens":150,"output_tokens":75}}}
   ```

## Step 3: Verify token tracking

After the Realtime request completes, verify that agentgateway recorded the token usage metrics.

1. Open the agentgateway [metrics endpoint](http://localhost:15020/metrics).
2. Look for the `agentgateway_gen_ai_client_token_usage` metric. The metric includes labels for the token type (`input` or `output`) and the model used.

For more information about LLM metrics and observability, see [Observe
traffic](../observability.md).

[Embeddings](/docs/standalone/latest/llm/api-types/embeddings/ 'Embeddings')[Rerank](/docs/standalone/latest/llm/api-types/rerank/ 'Rerank')

Was this page helpful?
