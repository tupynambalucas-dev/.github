# LLM (OpenAI)

Verified Code examples on this page have been automatically tested and verified.

Route requests to OpenAI’s chat completions API with the agentgateway binary.

Configure the agentgateway binary to route requests to the [OpenAI](https://openai.com/) chat
completions API.

## Before you begin

1. [Install the agentgateway binary](../deployment/binary.md).

   To install the latest release:

   ```
   curl -sL https://agentgateway.dev/install | bash
   ```

   To install a specific version, pass the `--version` flag. Use any release tag from the [agentgateway
   releases page](https://github.com/agentgateway/agentgateway/releases), such as `1.4.1`.

   ```
   curl -sL https://agentgateway.dev/install | bash -s -- --version 1.4.1
   ```

   To install the nightly build for development and testing:

   1. Go to the [nightly release in GitHub
      Actions](https://github.com/agentgateway/agentgateway/actions/workflows/nightly.yml) and click the
      release that you want to use.
   2. From the URL, get the release number, such as `24873456345` in
      `https://github.com/agentgateway/agentgateway/actions/runs/24873456345`.
   3. Using the `gh` CLI, download the release for your OS. The following example uses macOS.

      ```
      gh run download 24873456345 -R agentgateway/agentgateway -n release-binary-mac
      ```

   4. Make the binary file executable and move it to your binary location, such as in the following
      example.

      ```
      chmod +x agentgateway
      sudo mv agentgateway /usr/local/bin/agentgateway
      ```

   5. Verify that you have the nightly release.

      ```
      agentgateway --version
      ```

      Example output:

      ```
      {
        "version": "0.0.0-alpha.813d7d0",
        "git_revision": "813d7d0ab4757db7c8ed5a639bc63c0bb20ac116",
        "rust_version": "1.95.0",
        "build_profile": "release",
        "build_target": "aarch64-apple-darwin"
      }
      ```

2. Get an [OpenAI API key](https://platform.openai.com/api-keys).

## Steps

Route to an OpenAI backend through agentgateway.

### Step 1: Set your API key

Store your OpenAI API key in an environment variable so agentgateway can authenticate to the API.

```
export OPENAI_API_KEY='<your-api-key>'
```

### Step 2: Start agentgateway

You add the model from the UI in the next steps, so you can start agentgateway without a config
file. When you run `agentgateway` without specifying a config, it bootstraps a basic config at
`~/.config/agentgateway/config.yaml` and uses it automatically.

```
agentgateway
```

Example output:

```
info  app  serving UI at http://localhost:15000/ui
```

### Step 3: Enable LLM

1. Open the [agentgateway UI](http://localhost:15000/ui/).
2. On the **Gateway Overview**, find the **LLM** row and click **Enable LLM**.

### Step 4: Add a model

1. In the **LLM** section of the navigation menu, click **Models**, and then click **Add model**.
2. For the **Incoming model match**, enter the model name that clients send, such as `gpt-3.5-turbo`.
3. From the **Provider** list, select **OpenAI**.
4. For the **Provider API key**, click **Env var** and enter `OPENAI_API_KEY` (the variable you set in Step 1).
5. Click **Save model**.

![](/img/ui-llm-add-model.png)

![](/img/ui-llm-add-model-dark.png)

### Step 5: Send a chat completion request

Send a request from the command line, or try it in the built-in playground.

From another terminal, send a request to the chat completions endpoint:

```
curl -s http://localhost:4000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [{"role": "user", "content": "Say hello in one sentence."}]
  }' | jq .
```

Or open the [LLM playground](http://localhost:15000/ui/llm/playground/), enter a prompt in the
**User message** box, and click **Send**.

![](/img/ui-llm-playground.png)

![](/img/ui-llm-playground-dark.png)

## Next steps

Check out more guides related to LLM consumption with agentgateway.

[Virtual key managementManage API keys and control spending with rate limits for your LLM requests.](../llm/cost-controls/virtual-keys.md) [LLM observabilityView metrics, traces, and logs for LLM traffic.](../llm/observability.md) [OpenAI provider referenceOptional model override, multiple routes, passthrough, and Codex connection.](../llm/providers/openai.md)

[MCP servers](/docs/standalone/latest/quickstart/mcp/ 'MCP servers')

Was this page helpful?
