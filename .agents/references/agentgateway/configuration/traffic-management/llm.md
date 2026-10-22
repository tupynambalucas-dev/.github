# AI (LLM) Policies

Configure policies to control AI model behavior and prompt handling.

Attaches to: [Backend](/docs/standalone/latest/configuration/backends/ 'Backend')(AI Backends only)

Agentgateway has a number of policies that can be used to control the behavior of the AI (LLM)
model. For more information on connecting to LLM providers, see [LLM
consumption](../../llm/index.md).

| Policy          | Details                                                                                         |
| --------------- | ----------------------------------------------------------------------------------------------- |
| `defaults`      | Configure default values for settings in the request. For example, `temperature: 0.7`.          |
| `overrides`     | Configure override values for settings in the request.                                          |
| `prompts`       | Append or prepend additional prompts to requests.                                               |
| `routes`        | Control the type of LLM request, such as OpenAI Completions, Anthropic Messages, or Embeddings. |
| `promptGuard`   | Authorize requests based on their prompts.                                                      |
| `modelAliases`  | Configure aliases for model names.                                                              |
| `promptCaching` | Configure automatic caching controls in requests.                                               |

[Body buffering](/docs/standalone/latest/configuration/traffic-management/buffer/ 'Body buffering')

Was this page helpful?
