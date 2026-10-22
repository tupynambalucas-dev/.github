# Ollama

Verified Code examples on this page have been automatically tested and verified.

Configure agentgateway to route LLM traffic to Ollama for local model inference

Configure [Ollama](https://ollama.com/) to serve local models through agentgateway. Agentgateway 1.3
includes the first-class `ollama` provider and automatically uses `http://localhost:11434/v1` unless
you override it.

## Before you begin

1. [Install the `agentgateway` binary](../../deployment/binary.md).
2. Install [Ollama](https://ollama.com/download).
3. Make sure that you have at least one model pulled locally.

   ```
   ollama list
   ```

   If not, pull a model.

   ```
   ollama pull llama3.2
   ```

## Configure agentgateway

Create a configuration file that routes requests to your local Ollama instance.

```
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
llm:
  port: 3000
  models:
  - name: "*"
    provider: ollama
    params:
      model: llama3.2
```

Review the following table to understand this configuration.

| Setting            | Description                                                                                                    |
| ------------------ | -------------------------------------------------------------------------------------------------------------- |
| `provider: ollama` | Uses the built-in Ollama provider shortcut instead of the older `openAI` compatibility path.                   |
| `params.model`     | Sets the default Ollama model. The model must already exist in your local Ollama instance.                     |
| `params.baseUrl`   | Optional override for non-default Ollama endpoints. If omitted, agentgateway uses `http://localhost:11434/v1`. |
| `name: "*"`        | Matches any requested model name, so clients can request any model that Ollama has pulled.                     |

If Ollama is running somewhere other than `http://localhost:11434/v1`, override the base URL instead
of using host overrides.

```
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
llm:
  port: 3000
  models:
  - name: "*"
    provider: ollama
    params:
      model: llama3.2
      baseUrl: http://192.168.1.20:11434/v1
```

Start agentgateway:

```
agentgateway -f config.yaml
```

## Test the configuration

Send a request to verify that agentgateway routes to Ollama. The model name in the request must
match a model you already pulled with `ollama pull`.

```
curl http://localhost:3000/v1/chat/completions \
  -H "content-type: application/json" \
  -d '{
    "model": "llama3.2",
    "messages": [
      {
        "role": "user",
        "content": "Explain Ollama in one sentence."
      }
    ]
  }' | jq
```

## Troubleshooting

### Connection refused

**What’s happening:**

Requests to agentgateway return a 503 response or a connection refused error.

**Why it’s happening:**

Ollama is not running, is listening on a different address, or `params.baseUrl` points to the wrong
endpoint.

**How to fix it:**

1. Verify Ollama is reachable directly.

   ```
   curl http://localhost:11434/api/version
   ```

2. If Ollama is not running, start it.

   ```
   ollama serve
   ```

3. If you set `params.baseUrl`, make sure it includes Ollama’s `/v1` prefix.

### Model not found

**What’s happening:**

The response returns a model not found error.

**Why it’s happening:**

The requested model has not been pulled into your local Ollama instance.

**How to fix it:**

1. List available models.

   ```
   ollama list
   ```

2. Pull the missing model.

   ```
   ollama pull llama3.2
   ```

> [!NOTE] Note Local providers like Ollama usually run over HTTP and do not require llm.models[].auth or llm.models[].tls . If your Ollama endpoint is behind HTTPS or requires authentication, configure llm.models[].tls and llm.models[].auth like any other upstream provider.

[Gemini](/docs/standalone/latest/llm/providers/gemini/ 'Gemini')[Vertex AI](/docs/standalone/latest/llm/providers/vertex/ 'Vertex AI')

Was this page helpful?
