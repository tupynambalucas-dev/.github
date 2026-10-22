# Devin Desktop

Verified Code examples on this page have been automatically tested and verified.

Configure Devin Desktop AI code editor to use agentgateway

Configure [Devin Desktop](https://devin.ai/desktop), the AI-powered code editor from Cognition
(formerly Windsurf), to route requests to your LLM through your agentgateway proxy.

## Before you begin

1. [Install the `agentgateway` binary](../../deployment/binary.md).
2. Install [Devin Desktop](https://devin.ai/desktop).

## Example agentgateway configuration

```
cat > /tmp/test-devin.yaml << 'EOF'
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
llm:
  port: 3000
  models:
  - name: "*"
    provider: openAI
    params:
      apiKey: "$OPENAI_API_KEY"
EOF
```

## Configure Devin Desktop

Configure Devin Desktop to route LLM requests through agentgateway. For more information, review the
[Devin Desktop
documentation](https://docs.devin.ai/desktop/troubleshooting/windsurf-proxy-configuration).

1. Open Devin Desktop Settings.

   - **macOS**: `Cmd + ,` or **Devin Desktop** > **Settings**
   - **Windows/Linux**: `Ctrl + ,` or **File** > **Preferences** > **Settings**

2. Search for **Http: Proxy**.
3. Enter your agentgateway URL.

   ```
   http://localhost:3000
   ```

4. Save the settings.

## Verify the connection

1. Open the Devin Desktop chat panel.
2. Send a message such as “test”.
3. Devin Desktop responds through your agentgateway backend.

[Codex](/docs/standalone/latest/integrations/llm-clients/codex/ 'Codex')[VS Code Continue](/docs/standalone/latest/integrations/llm-clients/continue/ 'VS Code Continue')

Was this page helpful?
