# VS Code Continue

Configure Continue extension for VS Code to use agentgateway

Configure [Continue](https://continue.dev/), the open-source AI code assistant for VS Code, to route
requests through agentgateway.

## Before you begin

1. [Install the `agentgateway` binary](../../deployment/binary.md).
2. Install VS Code with the [Continue extension](https://marketplace.visualstudio.com/items?itemName=Continue.continue).

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

## Configure Continue

1. Edit the `~/.continue/config.json` file to add your agentgateway endpoint.
2. Save the file and reload Continue in VS Code.

```
{
  "models": [
    {
      "title": "agentgateway",
      "provider": "openai",
      "model": "gpt-4o-mini",
      "apiBase": "http://localhost:3000/v1"
    }
  ]
}
```

Review the following table to understand this configuration.

| Field      | Description                                                  |
| ---------- | ------------------------------------------------------------ |
| `title`    | Display name shown in the Continue model selector.           |
| `provider` | Set to `openai` for any OpenAI-compatible endpoint.          |
| `model`    | The model name from your agentgateway backend configuration. |
| `apiBase`  | Your agentgateway URL with the `/v1` path.                   |

## Verify the connection

1. Open the Continue sidebar in VS Code (`Cmd + M` on macOS, `Ctrl + M` on Windows/Linux).
2. Select **agentgateway** from the model dropdown.
3. Send a test message: “Hello, are you working?”

[Devin Desktop](/docs/standalone/latest/integrations/llm-clients/devin/ 'Devin Desktop')[GitHub Copilot](/docs/standalone/latest/integrations/llm-clients/github-copilot/ 'GitHub Copilot')

Was this page helpful?
