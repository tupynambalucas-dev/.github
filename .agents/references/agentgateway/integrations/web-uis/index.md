# Web UIs & agent frameworks

Integrate agentgateway with popular web interfaces and agent frameworks for enterprise governance

Agentgateway provides a unified control plane to secure, observe, and audit all AI communications
from web UIs and agent frameworks. By routing LLM, A2A, and MCP traffic through agentgateway,
enterprises gain complete visibility and governance over their AI infrastructure.

> [!NOTE] Note Looking for a UI to review your agentgateway resources such as routes and policies? Check out the agentgateway Admin UI guide. On this page, you learn about connecting other AI web UI tools to agentgateway instead of directly to the backing LLM providers.

## Why Use agentgateway with Web UIs?

Web UIs and agent frameworks typically connect directly to LLM providers and tool servers, creating
blind spots for security and compliance teams. Agentgateway sits between these interfaces and your
AI backends to provide the following.

- **Centralized Authentication** - Enforce consistent auth policies across all AI interfaces
- **Access Control** - Fine-grained RBAC for models, tools, and agent capabilities
- **Audit Logging** - Complete trace of all LLM prompts, tool calls, and agent interactions
- **Rate Limiting** - Prevent runaway costs and resource exhaustion
- **Content Filtering** - Block sensitive data from leaving your environment
- **Observability** - Metrics, traces, and dashboards for all AI traffic

[Chatbot UI

Front Chatbot UI with agentgateway to keep API keys server-side and audit every chat.](chatbot-ui.md)[Goose

Route Goose’s LLM traffic through agentgateway to govern an autonomous agent’s model and tool calls.](goose.md)[LibreChat

Front LibreChat with agentgateway to centralize LLM credentials, audit, and rate limits.](librechat.md)[Open WebUI

Front Open WebUI with agentgateway to centralize auth, audit, and rate limits for LLM traffic.](open-webui.md)

[Platforms](/docs/standalone/latest/integrations/platforms/ 'Platforms')

Was this page helpful?
