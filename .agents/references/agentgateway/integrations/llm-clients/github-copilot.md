# GitHub Copilot

Configure GitHub Copilot to use agentgateway

Configure [GitHub Copilot](https://github.com/features/copilot) in VS Code to route requests through
agentgateway.

> [!NOTE] Note Custom endpoint configuration for GitHub Copilot requires a GitHub Copilot Business or Enterprise plan. Individual Copilot plans do not support custom proxy endpoints. For more information, see the GitHub Copilot documentation .

## Before you begin

1. [Install the `agentgateway` binary](../../deployment/binary.md).
2. Install VS Code with the [GitHub Copilot extension](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot).
3. Have a GitHub Copilot Business or Enterprise subscription.

> [!TIP] Tip If you manage models and virtual API keys in the standalone Admin UI, Client Setup can generate the connection settings or snippet for this client. Review the gateway URL, select a model and key, choose the client from the Integration dropdown, and copy the recipe. Each recipe uses only the values that its client supports. Client Setup generates client-side values from existing configuration. It does not create a route, model, authentication policy, virtual key, or provider credential. Follow the steps in this guide to configure those prerequisites or to set up the client manually.

## Example agentgateway configuration

```
cat > /tmp/test-copilot.yaml << 'EOF'
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

## Configure GitHub Copilot

1. Open VS Code Settings (`Cmd + ,` on macOS, `Ctrl + ,` on Windows/Linux).
2. Search for `github.copilot` in the settings search bar.
3. Set the proxy URL to your agentgateway address. Click **Edit in settings.json** and add:

   ```
   {
     "github.copilot.advanced": {
       "debug.overrideProxyUrl": "http://localhost:3000/v1"
     }
   }
   ```

4. Save the file and reload VS Code (`Cmd + Shift + P` > **Developer: Reload Window**).

## Verify the connection

1. Open a code file in VS Code.
2. Start typing and wait for Copilot suggestions to appear.
3. Open the Copilot chat panel (`Cmd + Shift + I` on macOS, `Ctrl + Shift + I` on Windows/Linux) and send a test message.

[VS Code Continue](/docs/standalone/latest/integrations/llm-clients/continue/ 'VS Code Continue')[OpenAI SDK](/docs/standalone/latest/integrations/llm-clients/openai-sdk/ 'OpenAI SDK')

Was this page helpful?
