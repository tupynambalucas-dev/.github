# Codex

Configure Codex AI coding tool to use agentgateway

Configure [Codex](https://chatgpt.com/codex), the AI coding tool by OpenAI, to route requests
through your agentgateway proxy.

## Before you begin

1. [Install the `agentgateway` binary](../../deployment/binary.md).
2. Install either the [Codex CLI](https://learn.chatgpt.com/docs/codex/cli) or the [ChatGPT desktop app](https://chatgpt.com/download/).

> [!TIP] Tip If you manage models and virtual API keys in the standalone Admin UI, Client Setup can generate the connection settings or snippet for this client. Review the gateway URL, select a model and key, choose the client from the Integration dropdown, and copy the recipe. Each recipe uses only the values that its client supports. Client Setup generates client-side values from existing configuration. It does not create a route, model, authentication policy, virtual key, or provider credential. Follow the steps in this guide to configure those prerequisites or to set up the client manually.

## Configure agentgateway

Start agentgateway with an OpenAI backend configuration. The wildcard `*` model name accepts any
model. Codex sends the model in each request, so you do not need to pin a specific model.

1. Create a configuration file.

   ```
   cat > config.yaml << 'EOF'
   # yaml-language-server: $schema=https://agentgateway.dev/schema/config
   llm:
     models:
     - name: "*"
       provider: openAI
       params:
         apiKey: "$OPENAI_API_KEY"
   EOF
   ```

2. Start agentgateway.

   ```
   agentgateway -f config.yaml
   ```

> [!NOTE] Note For wildcard model matching, rate limiting, and other options, see the OpenAI provider page .

## Connect Codex to agentgateway

### Codex CLI

Point Codex at agentgateway through one of the following methods.

To override the base URL for a single run, set `model_provider` and the provider’s `name` and
`base_url` (the `-c` values are TOML).

```
codex -c 'model_provider="agentgateway"' -c 'model_providers.agentgateway.name="OpenAI via agentgateway"' -c 'model_providers.agentgateway.base_url="http://localhost:4000/v1"'
```

To configure the base URL persistently without changing your default Codex configuration, create a
profile. For more information, see [Codex
profiles](https://learn.chatgpt.com/docs/config-file/config-advanced#profiles). The `name` field is
required for custom providers.

```
mkdir -p ~/.codex
cat > ~/.codex/agentgateway.config.toml <<'EOF'
model_provider = "agentgateway"

[model_providers.agentgateway]
name = "OpenAI via agentgateway"
base_url = "http://localhost:4000/v1"
wire_api = "responses"
EOF
```

Start Codex with the profile:

```
codex --profile agentgateway
```

#### Verify the CLI connection

1. Send a test prompt through agentgateway. For the profile configuration, include the profile name:

   ```
   codex --profile agentgateway "Hello"
   ```

2. Verify that the request appears in the agentgateway logs.

   Example output:

   ```
   info  request gateway=default/default listener=llm route=internal/model:* endpoint=api.openai.com:443 http.method=POST http.path=/v1/responses http.status=200 protocol=llm gen_ai.operation.name=chat gen_ai.provider.name=openai duration=1687ms
   ```

> [!NOTE] Note This configuration was tested with codex-cli 0.144.4 .

For more configuration options, see the [**Codex CLI
documentation**](https://learn.chatgpt.com/docs/codex/cli).

### Codex in the ChatGPT Desktop App

Codex is available in the ChatGPT desktop app. To use the same provider configuration with the app,
back up and replace the user-level configuration, then restart the ChatGPT desktop app:

```
cp ~/.codex/config.toml ~/.codex/config.toml.bak
cat > ~/.codex/config.toml <<'EOF'
model_provider = "agentgateway"

[model_providers.agentgateway]
name = "OpenAI via agentgateway"
base_url = "http://localhost:4000/v1"
wire_api = "responses"
EOF
```

To edit the file through the app instead, open **Settings > Configuration > Open config.toml** and
apply the same provider configuration.

#### Verify the app connection

1. Send a task from Codex in the ChatGPT desktop app.
2. Verify that the request appears in the agentgateway logs.

   Example output:

   ```
   info  request gateway=default/default listener=llm route=internal/model:* endpoint=api.openai.com:443 http.method=POST http.path=/v1/responses http.status=200 protocol=llm gen_ai.operation.name=chat gen_ai.provider.name=openai duration=1687ms
   ```

> [!NOTE] Note This configuration was tested with ChatGPT desktop app version 26.707.72221 .

For more information, see the [**Codex app
documentation**](https://learn.chatgpt.com/docs/environments/modes) and [**Codex configuration
basics**](https://learn.chatgpt.com/docs/config-file/config-basic).

Codex also probes `/v1/models` to discover model metadata. Until [agentgateway issue
#1462](https://github.com/agentgateway/agentgateway/issues/1462) adds a gateway-generated model
list, Codex may warn that model metadata is not found. That warning does not prevent `/v1/responses`
traffic from routing.

## Next steps

[OpenAI providerComplete OpenAI provider configuration](../../llm/providers/openai.md) [Prompt guardsSet up guardrails for LLM requests and responses](../../llm/prompt-guards/index.md)

[Cursor](/docs/standalone/latest/integrations/llm-clients/cursor/ 'Cursor')[Devin Desktop](/docs/standalone/latest/integrations/llm-clients/devin/ 'Devin Desktop')

Was this page helpful?
