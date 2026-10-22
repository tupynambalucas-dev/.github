# Cursor

Configure Cursor AI code editor to use agentgateway

Configure [Cursor](https://cursor.com/), the AI code editor, to route requests to your LLM through
your agentgateway proxy.

## Before you begin

1. [Install the `agentgateway` binary](../../deployment/binary.md).
2. [Install Cursor](https://cursor.com/).

> [!TIP] Tip If you manage models and virtual API keys in the standalone Admin UI, Client Setup can generate the connection settings or snippet for this client. Review the gateway URL, select a model and key, choose the client from the Integration dropdown, and copy the recipe. Each recipe uses only the values that its client supports. Client Setup generates client-side values from existing configuration. It does not create a route, model, authentication policy, virtual key, or provider credential. Follow the steps in this guide to configure those prerequisites or to set up the client manually.

## Example agentgateway configuration

```
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
llm:
  port: 3000
  models:
  - name: "*"
    provider: openAI
    params:
      apiKey: "$OPENAI_API_KEY"
```

## Configure Cursor

1. Open the Cursor Settings.

   - **macOS**: `Cmd + ,` or **Cursor** > **Settings**
   - **Windows/Linux**: `Ctrl + ,` or **File** > **Preferences** > **Settings**

2. Navigate to the **Models** tab.
3. Enable **Override OpenAI Base URL** and enter your agentgateway address.

   ```
   http://localhost:3000
   ```

   > [!NOTE] Note You do not need to provide LLM provider credentials (such as an API key) through Cursor. The credentials are configured in agentgateway. Toggle off any API key overrides in Cursor.

## Verify the connection

1. Open the Cursor chat panel (`Cmd + L` on macOS, `Ctrl + L` on Windows/Linux).
2. Send a message such as “test”.
3. Cursor responds through your agentgateway backend.

[Claude Desktop](/docs/standalone/latest/integrations/llm-clients/claude-desktop/ 'Claude Desktop')[Codex](/docs/standalone/latest/integrations/llm-clients/codex/ 'Codex')

Was this page helpful?
