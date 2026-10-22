# Claude Code

Configure Claude Code CLI to use agentgateway

Configure [Claude Code](https://code.claude.com/docs), the AI coding CLI by Anthropic, to route LLM
requests through your agentgateway proxy.

The primary use case is routing Claude Code to non-Anthropic LLM backends (such as vLLM, Ollama, or
any OpenAI-compatible provider) for cost optimization and flexibility. You can also configure direct
routing to Anthropic or use a Claude Teams account as alternative options.

## Before you begin

1. [Install the `agentgateway` binary](../../deployment/binary.md).
2. Install the [Claude Code CLI](https://code.claude.com/docs) (`npm install -g @anthropic-ai/claude-code`).

> [!TIP] Tip If you manage models and virtual API keys in the standalone Admin UI, Client Setup can generate the connection settings or snippet for this client. Review the gateway URL, select a model and key, choose the client from the Integration dropdown, and copy the recipe. Each recipe uses only the values that its client supports. Client Setup generates client-side values from existing configuration. It does not create a route, model, authentication policy, virtual key, or provider credential. Follow the steps in this guide to configure those prerequisites or to set up the client manually.

> [!NOTE] Note The CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS environment variable disables Claude Code’s experimental beta features. You typically do not need this variable when proxying to non-Anthropic backends or standard Anthropic routing. Only set this variable if you encounter errors like Extra inputs are not permitted when using advanced Anthropic features (such as experimental translation or extended thinking). If you use a non-Anthropic backend, this variable can be safely omitted.

## Configure agentgateway with OpenAI-compatible backend

Route Claude Code to any OpenAI-compatible LLM provider (such as vLLM, Ollama, or local language
models). This is the recommended approach for cost-effective and flexible deployment.

1. Create a configuration file with an OpenAI-compatible provider. The wildcard `*` model name accepts
   any model. Claude Code sends the model in each request, so you do not need to pin a specific model.

   ```
   cat > config.yaml << 'EOF'
   # yaml-language-server: $schema=https://agentgateway.dev/schema/config
   llm:
     models:
     - name: "*"
       provider: openAI
       params:
         baseUrl: "http://localhost:8000/v1"  # vLLM or similar OpenAI-compatible endpoint
         apiKey: "mock-key"  # Not used for local providers, but required by config
   EOF
   ```

   Replace `http://localhost:8000/v1` with your OpenAI-compatible provider’s endpoint.

2. Start agentgateway.

   ```
   agentgateway -f config.yaml
   ```

3. Configure Claude Code to point to your agentgateway instance.

   ```
   export ANTHROPIC_BASE_URL="http://localhost:4000"
   ```

4. Verify the connection.

   ```
   claude -p "Hello"
   ```

## Configure agentgateway with Anthropic backend

Alternatively, route Claude Code directly to Anthropic’s API through agentgateway. This is useful if
you want to leverage Anthropic’s latest models or features directly.

1. Get an Anthropic API key from the [Anthropic Console](https://platform.claude.com).
2. Export your Anthropic API key.

   ```
   export ANTHROPIC_API_KEY="sk-ant-your-key-here"
   ```

3. Create a configuration file with the Anthropic provider. The wildcard `*` model name accepts any
   model. Claude Code sends the model in each request, so you do not need to pin a specific model.

   ```
   cat > config.yaml << 'EOF'
   # yaml-language-server: $schema=https://agentgateway.dev/schema/config
   llm:
     models:
     - name: "*"
       provider: anthropic
       params:
         apiKey: "$ANTHROPIC_API_KEY"
   EOF
   ```

4. Start agentgateway.

   ```
   agentgateway -f config.yaml
   ```

5. Configure Claude Code.

   ```
   export ANTHROPIC_BASE_URL="http://localhost:4000"
   ```

6. Verify the connection.

   ```
   claude -p "Hello"
   ```

   Example output:

   ```
   Hello! How can I help you today?
   ```

   If you see an error like `API Error: 400 context_management: Extra inputs are not permitted`, Claude
   Code is sending experimental beta parameters that agentgateway does not yet support. Disable
   experimental betas and retry the request.

   ```
   export CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS=1
   claude -p "Hello"
   ```

> [!NOTE] Note For pinned model configuration, extended thinking, and other options, see the Anthropic provider page .

## Claude Teams or Pro account

If you have a Claude Teams or Pro account, you can use agentgateway for request routing without an
API key. Authentication is handled by your Claude subscription via OAuth.

1. Create a configuration file. Agentgateway listens on port `4001` and exposes Claude at the `/claude`
   path.

   ```
   cat > config.yaml << 'EOF'
   gateways:
     default:
       port: 4001
       protocol: HTTP
   routes:
   - name: claude-agent
     matches:
     - path:
         pathPrefix: /claude
     policies:
       urlRewrite:
         path:
           prefix: /
     backends:
     - ai:
         name: claude-agent
         provider:
           anthropic: {}
         policies:
           ai:
             routes:
               /v1/messages: messages
               /v1/messages/count_tokens: anthropicTokenCount
               '*': passthrough
   EOF
   ```

2. Start agentgateway.

   ```
   agentgateway -f config.yaml
   ```

3. Set the `ANTHROPIC_BASE_URL` environment variable to point Claude Code at the `/claude` path.

   ```
   export ANTHROPIC_BASE_URL="http://localhost:4001/claude"
   ```

4. Verify the connection.

   ```
   claude -p "Hello"
   ```

## Next steps

[Anthropic providerComplete Anthropic provider configuration](../../llm/providers/anthropic.md) [Prompt guardsSet up guardrails for LLM requests and responses](../../llm/prompt-guards/index.md)

[Claude Desktop](/docs/standalone/latest/integrations/llm-clients/claude-desktop/ 'Claude Desktop')

Was this page helpful?
