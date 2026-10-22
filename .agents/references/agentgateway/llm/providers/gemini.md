# Gemini

Route agentgateway LLM traffic to Google Gemini models.

Configure Google Gemini as an LLM provider in agentgateway.

## Configuration

Review the following example configuration.

```
# yaml-language-server: $schema=https://agentgateway.dev/schema/config

llm:
  models:
  - name: "*"
    provider: gemini
    params:
      apiKey: "$GEMINI_API_KEY"
```

Review the following example configuration.

| Setting         | Description                                                                                                                                                     |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`          | The model name to match in incoming requests. When a client sends `"model": "<name>"`, the request is routed to this provider. Use `*` to match any model name. |
| `provider`      | The LLM provider, set to `gemini` for Google Gemini models.                                                                                                     |
| `params.model`  | The specific Gemini model to use. If set, this model is used for all requests. If not set, the request must include the model to use.                           |
| `params.apiKey` | The Gemini API key for authentication. You can reference environment variables using the `$VAR_NAME` syntax.                                                    |

[Azure](/docs/standalone/latest/llm/providers/azure/ 'Azure')[Ollama](/docs/standalone/latest/llm/providers/ollama/ 'Ollama')

Was this page helpful?
