# LLM clients

Configure AI coding tools and applications to use agentgateway

Agentgateway exposes OpenAI-compatible and provider-native APIs for supported clients. Configure
each client with the gateway address and a model name that agentgateway accepts, aliases, rewrites,
or routes.

## Supported clients

## Generate client settings in the Admin UI

The standalone Admin UI includes **LLM > Client Setup**, which generates connection settings and
snippets from your existing gateway URL, models, and virtual API keys. Open
<http://localhost:15000/ui/llm/client-setup>, select a model and key, and choose a client from the
**Integration** dropdown.

Client Setup has matching guides for [curl](curl.md),
[Claude Code](claude-code.md), [Claude
Desktop](claude-desktop.md),
[Codex](codex.md),
[Cursor](cursor.md), [GitHub
Copilot](github-copilot.md), and the [OpenAI
SDKs](openai-sdk.md).

The Client Setup UI and official LLM client documentation currently have gaps in both directions.
OpenCode and Windsurf have UI recipes but no corresponding guides; this documentation work is
tracked in [agentgateway/website#890](https://github.com/agentgateway/website/issues/890). Continue
has an official guide but no UI recipe. Adding Continue is tracked in
[agentgateway/agentgateway#2992](https://github.com/agentgateway/agentgateway/issues/2992). That
issue also covers validating the existing Windsurf recipe because its HTTP proxy configuration does
not clearly correspond to the current Devin Desktop guide, as well as introducing checks to prevent
future UI and documentation drift.

Client Setup configures the client only. It does not create or modify the gateway resources and
credentials that the selected client requires.

[Claude Code

Configure Claude Code CLI to use agentgateway](claude-code.md)[Claude Desktop

Configure Claude Desktop to use agentgateway](claude-desktop.md)[Cursor

Configure Cursor AI code editor to use agentgateway](cursor.md)[Codex

Configure Codex AI coding tool to use agentgateway](codex.md)[Devin Desktop

Configure Devin Desktop AI code editor to use agentgateway](devin.md)[VS Code Continue

Configure Continue extension for VS Code to use agentgateway](continue.md)[GitHub Copilot

Configure GitHub Copilot to use agentgateway](github-copilot.md)[OpenAI SDK

Use OpenAI SDK (Python and Node.js) with agentgateway](openai-sdk.md)[curl

Test and interact with agentgateway using curl](curl.md)

[Authentication & identity](/docs/standalone/latest/integrations/auth/ 'Authentication & identity')[LLM observability](/docs/standalone/latest/integrations/llm-observability/ 'LLM observability')

Was this page helpful?
