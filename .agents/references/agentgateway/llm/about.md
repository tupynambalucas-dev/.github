# About

Overview of supported LLM providers and their capabilities

Agentgateway provides seamless integration with various Large Language Model (LLM) providers. This
way, you can consume AI services through a unified interface while still maintaining flexibility in
the providers that you use.

## What is an LLM?

Large Language Models (LLMs) are very large, deep learning models that are pre-trained on massive
amounts of unlabeled and self-supervised data, often containing billions of words. LLMs extract
meanings from a sequence of text and can understand the relationship between words and phrases in
it. Based on this understanding, the LLM can then predict and generate natural language, and perform
related tasks, such as answering questions, summarizing text, translating between languages, or
writing content. LLMs can be fine-tuned on a smaller, more specific data set so that it can perform
a more specific task more accurately.

While LLMs were originally designed to be trained on text and natural language, they are now
becoming multimodal, supporting different media types, such as images and videos.

## Common problems with LLM consumption

When adopting an LLM on an enterprise-level, you typically run into the following issues:

- **Data leakage and privacy**: When interacting with LLMs, it is essential to comply with federal
  laws and to not leak any PII (personally identifiable information) or other sensitive information in
  prompts. For example, users might enter personal credit card or customer related information, such
  as account numbers and names. Attackers might also trick the model into revealing previous user data
  that is still stored in the context. To prevent sensitive information from leaking to the LLM
  provider, prompt guards must be in place that help to filter, block, monitor, and control LLM inputs
  and outputs to find offensive content, prevent misuse, and ensure ethical and responsible AI usage.
- **Cost controls**: Compared to traditional APIs, LLM queries are long-running, meaning the LLM must
  parse through its large data set iteratively to compute one token at a time. All tokens must then be
  summarized to generate a prediction. Given the large amounts of data that the LLM parses, GPUs are
  required to run LLMs efficiently, which are costly to run and maintain. Limiting the amount of
  tokens that can be used and monitoring token consumption are critical to keep costs to a minimum.
- **Fan-out patterns**: LLMs are limited by static training data. This limitation can make seemingly
  simple questions difficult to answer. For example, answering a simple question, such as `What is the
weather today?` requires the LLM to have access to several real-time information, such as the
  location, time, and weather forecast. Integrating LLMs with other MCP servers and agents to perform
  these tasks becomes essential to accurately answer questions of this nature.
- **Security**: To protect your LLM from being consumed by unauthorized users, you typically want to
  authenticate with the LLM before you start sending requests. Managing credentials, such as API keys,
  and monitoring the traffic to the LLM becomes essential to protect access to the LLM.
- **Scalability and reliability**: When relying on an LLM to perform specific tasks in your
  environment, you must put measures in place that prevent your applications from failing, being
  overwhelmed, or performing inefficiently. This includes retries and timeouts, request rate limiting,
  and multi-model failovers.

## Supported providers

Agentgateway supports native, OpenAI-compatible, and self-hosted LLM providers.

### Native providers

Review the following table to compare agentgateway’s support of different LLM provider APIs.

| Provider     | Chat Completions | Responses | Messages | Embeddings | Realtime | Count Tokens | Rerank |
| ------------ | ---------------- | --------- | -------- | ---------- | -------- | ------------ | ------ |
| OpenAI       | ✅               | ✅        | ✅¹      | ✅         | ✅       | ✅²          | -      |
| Anthropic    | ✅¹              | ◇         | ✅       | -          | -        | ✅           | -      |
| Bedrock      | ✅¹              | ✅¹       | ✅¹      | ✅¹        | -        | ✅⁴          | ✅¹    |
| Azure        | ✅               | ✅        | ✅¹      | ✅         | -        | ✅²          | ⚠️³    |
| Gemini       | ✅               | ✅¹       | ✅¹      | ✅         | -        | ✅²          | -      |
| Vertex AI    | ✅⁴              | ◇         | ✅⁴      | ✅¹        | -        | ✅⁴          | ✅¹    |
| Copilot      | ✅               | ✅        | ✅¹      | ◇          | -        | ✅²          | ⚠️³    |
| Cohere       | ✅               | ✅¹       | ✅¹      | ✅         | -        | ✅²          | ✅     |
| Ollama       | ✅               | ✅        | ✅¹      | ✅         | -        | ✅²          | -      |
| Baseten      | ✅               | ✅¹       | ✅       | -          | -        | ✅²          | -      |
| Cerebras     | ✅               | ✅¹       | ✅¹      | -          | -        | ✅²          | -      |
| Deepinfra    | ✅               | ✅¹       | ✅       | ✅         | -        | ✅²          | -      |
| Deepseek     | ✅               | ✅¹       | ✅       | -          | -        | ✅²          | -      |
| Groq         | ✅               | ✅        | ✅¹      | -          | -        | ✅²          | -      |
| Hugging Face | ✅               | ✅        | ✅¹      | -          | -        | ✅²          | -      |
| Mistral      | ✅               | ✅¹       | ✅¹      | ✅         | -        | ✅²          | -      |
| OpenRouter   | ✅               | ✅        | ✅       | ✅         | -        | ✅²          | ✅     |
| Together AI  | ✅               | ✅¹       | ✅¹      | ✅         | -        | ✅²          | ✅     |
| xAI          | ✅               | ✅        | ✅¹      | -          | ✅       | ✅²          | -      |
| Fireworks    | ✅               | ✅        | ✅       | ✅         | -        | ✅²          | ✅     |

Legend:

| Symbol | Meaning                                                                        |
| ------ | ------------------------------------------------------------------------------ |
| ✅     | Supported natively                                                             |
| ✅¹    | Supported via Agentgateway translation                                         |
| ✅²    | Supported by a local estimate by Agentgateway                                  |
| ⚠️³    | Passthrough/provider-dependent; works only with a compatible upstream endpoint |
| ✅⁴    | Supported, but behavior depends on model family or provider route              |
| ◇      | Not currently implemented in Agentgateway                                      |
| -      | Provider does not offer this capability                                        |

### First-class providers

Many providers now have dedicated integrations with preconfigured base URLs and request formats:

- [Baseten](providers/baseten.md)
- [Cerebras](providers/cerebras.md)
- [DeepInfra](providers/deepinfra.md)
- [xAI (Grok)](providers/xai.md)
- [Cohere](providers/cohere.md)
- [Together AI](providers/togetherai.md)
- [Groq](providers/groq.md)
- [DeepSeek](providers/deepseek.md)
- [Mistral](providers/mistral.md)
- [Hugging Face](providers/huggingface.md)
- [OpenRouter](providers/openrouter.md)
- [Fireworks AI](providers/fireworks.md)

### Self-hosted solutions

Run models locally or in your own infrastructure:

- [Ollama](providers/ollama.md)
- [vLLM](providers/custom.md)
- [LM Studio](providers/custom.md)

### Custom providers

Use [Custom provider](providers/custom.md) for other providers without
direct support such as Perplexity, vLLM, or LM Studio. Agentgateway supports all of the common LLM
formats and can generally integrate with any provider ([file an
issue](https://github.com/agentgateway/agentgateway/issues/new) if one is missing!).

## Using the API

Agentgateway exposes multiple different API endpoints, including [OpenAI Chat
Completions](https://developers.openai.com/api/reference/chat-completions/overview), [Anthropic
Messages](https://platform.claude.com/docs/en/api/messages), and more. Depending on the API used in
the request, and the provider selected, agentgateway can pass the request through or translate it as
needed.

This enables a unified API regardless of the provider used, allowing seamlessly connecting clients
(regardless of which API they use) to any provider.

Below shows some basic examples using the Chat Completions API

> [!NOTE] Note For detailed configuration of specific API endpoint types, including Chat Completions and the OpenAI Realtime API, see API types .

```
curl 'http://localhost:4000/v1/chat/completions' \
--header 'Content-Type: application/json' \
--data ' {
  "model": "gpt-3.5-turbo",
  "messages": [
    {
      "role": "user",
      "content": "Tell me a story"
    }
  ]
}
'
```

> [!NOTE] Note The api_key parameter is required in the OpenAI library. Depending on your agentgateway configuration, it may or may not be required, and can be set to a mock value.

```
import openai

client = openai.OpenAI(
    api_key="anything",
    base_url="http://localhost:4000/v1"
)

response = client.chat.completions.create(model="gpt-4o-mini", messages = [
    {
        "role": "user",
        "content": "this is a test request, write a short poem"
    }
])

print(response)
```

```
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "anything",
  baseURL: "http://localhost:4000/v1",
});
const response = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [{ role: "user", content: "this is a test request, write a short poem" }]
});

console.log(response);
```

## Model routing and aliases

Model routing is configured within the `llm` section of your agentgateway configuration file. The
`llm` section offers a simplified, model-centric approach compared to the `gateways` and `routes`
model; for more details on the two approaches, see [LLM configuration
modes](configuration-modes.md). The model configurations shown in this
section live under the `llm.models` key.

Agentgateway routes requests by matching an incoming model name, and then sending it to the
configured model. The outgoing model can be passed through from the incoming model, be transformed,
or be a static model.

Some examples:

- Match `fast` and send to `gpt-mini`.
- Match `*` and forward the model as-is.
- Match `openai/*` and strip the `openai/` prefix, forwarding the remaining model as-is.

| Field          | Purpose                                                                                                                                                                          |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `models.name`  | The model name to match in incoming client requests. Agentgateway compares this value against the `model` field in the request body. Use a wildcard `*` to match any model name. |
| `params.model` | The model name sent to the upstream provider. If set, this overrides the model from the request. If not set, the model from the request is passed through.                       |

### Passthrough

Use `name: "*"` without setting `params.model` to accept any model name and pass it directly to the
provider. This is the simplest configuration for single-provider setups.

```
llm:
  models:
  - name: "*"
    provider: openAI
    params:
      apiKey: "$OPENAI_API_KEY"
```

Clients specify the actual model in their requests, such as `"model": "gpt-4o-mini"`, and
agentgateway forwards it to the provider as-is.

### Prefixed Passthrough

Use `name: "openai/*"` without setting `params.model` to accept model requests like
`openai/gpt-4o-mini` and forward to OpenAI as `gpt-4o-mini`. This is the recommended approach when
you want to expose all models from multiple providers.

```
llm:
  models:
  - name: "*"
    provider: openAI
    params:
      apiKey: "$OPENAI_API_KEY"
    transformation:
      model: llmRequest.model.stripPrefix("openai/")
```

Clients specify the provider and model in their requests, such as `"model": "openai/gpt-4o-mini"`,
and agentgateway forwards to `gpt-4o-mini`

### Model aliases

Set `name` to a user-friendly alias and `params.model` to the actual provider model. This lets you
decouple client-facing model names from provider-specific identifiers, making it easier to swap
models without updating client code.

```
llm:
  models:
  - name: fast
    provider: openAI
    params:
      model: gpt-4o-mini
      apiKey: "$OPENAI_API_KEY"
  - name: smart
    provider: openAI
    params:
      model: gpt-4o
      apiKey: "$OPENAI_API_KEY"
```

Clients send `"model": "fast"` or `"model": "smart"`, and agentgateway translates these to the
corresponding provider models.

### Route priority

When multiple models match a request, the more precise match takes precedence. For example, with the
configuration below, requests with `accounts/fireworks/*` will match the `fireworks` provider first:

```
llm:
  models:
  # Specific route: wins ties against the wildcard
  - name: "accounts/fireworks/*"
    provider: fireworks
    matches:
    - headers:
      - name: "x-org"
        value:
          exact: "eng"
    params:
      apiKey: "$FIREWORKS_API_KEY"
  # Catch-all route: matches anything, but lower priority
  - name: "*"
    provider: openAI
    matches:
    - headers:
      - name: "x-org"
        value:
          exact: "engineering"
    params:
      apiKey: "$OPENAI_API_KEY"
```

In this example, both routes have one header matcher, so they have equal specificity. Because the
Fireworks route is listed first, it takes priority when both routes match.

> [!NOTE] Note For advanced routing based on request body fields like the model name, see Virtual models .

[API types](/docs/standalone/latest/llm/api-types/ 'API types')

Was this page helpful?
