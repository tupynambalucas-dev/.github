# curl

Test and interact with agentgateway using curl

Test and interact with agentgateway using curl.

## Before you begin

1. [Install the `agentgateway` binary](../../deployment/binary.md).
2. Install curl (pre-installed on macOS and Linux).

> [!TIP] Tip If you manage models and virtual API keys in the standalone Admin UI, Client Setup can generate the connection settings or snippet for this client. Review the gateway URL, select a model and key, choose the client from the Integration dropdown, and copy the recipe. Each recipe uses only the values that its client supports. Client Setup generates client-side values from existing configuration. It does not create a route, model, authentication policy, virtual key, or provider credential. Follow the steps in this guide to configure those prerequisites or to set up the client manually.

## Example agentgateway configuration

```
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
llm:
  port: 3000
  models:
  - name: "*"
    provider: openAI
    params:
      apiKey: "$OPENAI_API_KEY"
```

## Send a request

```
curl http://localhost:3000/v1/chat/completions \
  -H "content-type: application/json" \
  -d '{
    "model": "gpt-4o-mini",
    "messages": [
      {"role": "user", "content": "Hello, how are you?"}
    ]
  }' | jq
```

Example output:

```
{
  "id": "chatcmpl-abc123",
  "object": "chat.completion",
  "created": 1677652288,
  "model": "gpt-4o-mini",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "I'm doing well, thank you! How can I help you today?"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 13,
    "completion_tokens": 16,
    "total_tokens": 29
  }
}
```

## Authentication

If agentgateway requires authentication, include an `Authorization` header.

```
curl http://localhost:3000/v1/chat/completions \
  -H "content-type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "gpt-4o-mini",
    "messages": [{"role": "user", "content": "Hello"}]
  }' | jq
```

## Streaming responses

Use the `-N` flag to disable output buffering for streaming.

```
curl http://localhost:3000/v1/chat/completions \
  -N \
  -H "content-type: application/json" \
  -d '{
    "model": "gpt-4o-mini",
    "messages": [{"role": "user", "content": "Write a haiku about the cloud"}],
    "stream": true
  }'
```

[OpenAI SDK](/docs/standalone/latest/integrations/llm-clients/openai-sdk/ 'OpenAI SDK')

Was this page helpful?
