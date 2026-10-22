# Custom

Verified Code examples on this page have been automatically tested and verified.

Configure agentgateway for providers without built-in support that implement the OpenAI API format.

Use this page for providers that implement the OpenAI API format but do not have a first-class
`provider:` support yet. For built-in providers such as
[Baseten](baseten.md),
[Cerebras](cerebras.md),
[Cohere](cohere.md),
[DeepInfra](deepinfra.md),
[DeepSeek](deepseek.md), [Fireworks
AI](fireworks.md),
[Groq](groq.md), [Hugging
Face](huggingface.md),
[Mistral](mistral.md),
[OpenRouter](openrouter.md), [Together
AI](togetherai.md),
[xAI](xai.md), and
[Ollama](ollama.md), use the dedicated provider pages instead.

> [!NOTE] Note Many providers provide “OpenAI compatible” or “Anthropic compatible” endpoints. While these can be used with provider: openai / provider: anthropic and a customized baseUrl , prefer to use provider: custom . Using a specific vendor’s provider may introduce semantics specific to that provider.

## Before you begin

[Install the `agentgateway` binary](../../deployment/binary.md).

You also need the following prerequisites.

- An API key for your chosen provider, unless you are pointing to a local endpoint such as vLLM or LM Studio.

## Configuring a custom provider

With a custom provider, you provide the API endpoint and a list of formats it supports. Agentgateway
will automatically handle mapping between the incoming format and the supported formats.

Below shows an example of connecting to [Perplexity](https://www.perplexity.ai/), which exposes an
OpenAI-compatible API for search-augmented models and does not currently have a first-class
provider.

```
cat > /tmp/test-perplexity.yaml << 'EOF'
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
llm:
  models:
  - name: "*"
    provider:
      custom:
        formats:
          # Indicate this provider supports the completions API. With no `path` specified, this defaults to <baseUrl>/chat/completions
          - type: completions
          # Indicate this provider supports the messages API, on a custom path /messages-api
          # - type: messages
          #   path: /messages-api
          # All possible APIs:
          # - type: embeddings
          # - type: responses
          # - type: realtime
          # - type: anthropicTokenCount
          # - type: rerank
    params:
      apiKey: "$PERPLEXITY_API_KEY"
      model: llama-3.1-sonar-large-128k-online
      baseUrl: "https://api.perplexity.ai"
EOF
```

[Multiple LLM providers](/docs/standalone/latest/llm/providers/multiple-llms/ 'Multiple LLM providers')

Was this page helpful?
