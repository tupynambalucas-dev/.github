# Groq

Verified Code examples on this page have been automatically tested and verified.

Route agentgateway LLM traffic to models served by Groq.

Configure Groq as an LLM provider in agentgateway.

## Configuration

Review the following example configuration.

```
# yaml-language-server: $schema=https://agentgateway.dev/schema/config

llm:
  models:
  - name: "*"
    provider: groq
    params:
      apiKey: "$GROQ_API_KEY"
```

Review the following example configuration.

| Setting          | Description                                                                                                                                                     |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`           | The model name to match in incoming requests. When a client sends `"model": "<name>"`, the request is routed to this provider. Use `*` to match any model name. |
| `provider`       | The LLM provider, set to `groq`.                                                                                                                                |
| `params.model`   | Optional. If set, this model is used for all requests. If not set, the request must include the model to use.                                                   |
| `params.apiKey`  | Your Groq API key. You can reference environment variables using the `$VAR_NAME` syntax.                                                                        |
| `params.baseUrl` | Optional. Overrides the provider base URL. Default: `https://api.groq.com/openai/v1`.                                                                           |

## Example request

After running agentgateway with the configuration from the previous section, you can send an
OpenAI-compatible request to the `v1/chat/completions` endpoint:

```
curl -X POST http://localhost:4000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama-3.3-70b-versatile",
    "messages": [{"role": "user", "content": "Hello from Groq!"}]
  }'
```

[Fireworks AI](/docs/standalone/latest/llm/providers/fireworks/ 'Fireworks AI')[Hugging Face](/docs/standalone/latest/llm/providers/huggingface/ 'Hugging Face')

Was this page helpful?
