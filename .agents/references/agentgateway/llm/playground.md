# LLM playground

Send a test chat completion through the gateway in the agentgateway admin UI.

Use the built-in LLM playground in the agentgateway admin UI to send a chat completion request
through your configured LLM provider. The playground sends a real request through the gateway, so
you can confirm that your provider, model, and policies work before you point an application at
agentgateway.

> [!NOTE] Note The LLM playground is available in the agentgateway UI in version 1.3 and later.

## Before you begin

1. [Install the `agentgateway` binary](../deployment/binary.md).
2. Configure at least one LLM provider. For an example, see [OpenAI](providers/openai.md) or any [OpenAI-compatible provider](providers/custom.md).

## Send a test request

1. Run agentgateway with your LLM configuration.

   ```
   agentgateway -f config.yaml
   ```

2. Open the [LLM playground](http://localhost:15000/ui/llm/playground/).
3. If you see a **Browser access is not allowed** notice, click **Apply CORS** so the playground can
   call the LLM listener from the UI.
4. In the **Model** list, select a model. If your configuration uses a wildcard (`*`) model, enter a
   specific model name in the **Specific model** field, such as `gpt-4o-mini`.
5. Optional: Expand **System prompt** to review or change the system prompt.
6. In the **User message** box, enter a prompt, such as `Say hello to agentgateway`, and click
   **Send**.
7. Verify that the gateway forwards the request to your provider and returns a response in the chat
   panel. Each response also shows the provider, model, latency, and token usage.

   ![](/img/ui-llm-playground.png)

   ![](/img/ui-llm-playground-dark.png)

## Next steps

- [Observe LLM traffic](observability.md) with metrics, logs, and traces.
- Try out CEL expressions in the [CEL playground](../reference/cel/playground.md).

[Observe traffic](/docs/standalone/latest/llm/observability/ 'Observe traffic')[Routing-based configuration for LLMs](/docs/standalone/latest/llm/configuration-modes/ 'Routing-based configuration for LLMs')

Was this page helpful?
