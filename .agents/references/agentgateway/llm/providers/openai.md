# OpenAI

Verified Code examples on this page have been automatically tested and verified.

Route agentgateway LLM traffic to OpenAI’s GPT models.

Configure OpenAI as an LLM provider in agentgateway.

## Configuration

Review the following example configuration.

```
# yaml-language-server: $schema=https://agentgateway.dev/schema/config

llm:
  models:
  - name: "*"
    provider: openAI
    params:
      apiKey: "$OPENAI_API_KEY"
```

Review the following example configuration.

| Setting         | Description                                                                                                                                                     |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`          | The model name to match in incoming requests. When a client sends `"model": "<name>"`, the request is routed to this provider. Use `*` to match any model name. |
| `provider`      | The LLM provider, set to `openAI` for OpenAI models.                                                                                                            |
| `params.model`  | The specific OpenAI model to use. If set, this model is used for all requests. If not set, the request must include the model to use.                           |
| `params.apiKey` | The OpenAI API key for authentication. You can reference environment variables using the `$VAR_NAME` syntax.                                                    |

> [!NOTE] Note For advanced routing scenarios that require path-based routing or custom endpoints, use the gateways and routes configuration format. See the Routing-based configuration guide for more information.

> [!NOTE] Note To connect Codex to agentgateway, see the Codex integration page .

[Amazon Bedrock](/docs/standalone/latest/llm/providers/bedrock/ 'Amazon Bedrock')

Was this page helpful?
