[Skip to content](about.md#content)

`CTRL K`

Toggle theme[Docs](https://agentgateway.dev/docs/) [Standalone](../README.md) [Kubernetes](https://agentgateway.dev/docs/kubernetes/latest/) [Models](https://agentgateway.dev/models) [Blog](https://agentgateway.dev/blog) [Enterprise](https://agentgateway.dev/enterprise) [Community](https://discord.gg/y9efgEmppm) [Get Started](https://agentgateway.dev/#getting-started) [GitHub](https://github.com/agentgateway/agentgateway)

agentgateway has joined the **Agentic AI Foundation** — [Learn more](https://aaif.io/blog/agentgateway-joins-aaif-as-an-open-gateway-for-agentic-ai-infrastructure/)×

Copy as Markdown

- Copy as Markdown
- View as Markdown
- Connect to Docs MCP
- Open in Claude
- Open in ChatGPT
- Open in Perplexity
- Print

Page as Markdown

CopyDownload✕

```

```

# About

Learn about Model Context Protocol and enterprise adoption challenges

Learn more about MCP and common challenges when adopting MCP in enterprise environments.

## About MCP [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/mcp/about/#about-mcp)

[Model Context Protocol (MCP)](https://modelcontextprotocol.io/docs/getting-started/intro) is an open protocol that standardizes how Large Language Model (LLM) applications connect to various external data sources and tools. Without MCP, you need to implement custom integrations for each tool that your LLM application needs to access. However, this approach is hard to maintain and can cause issues when you want to scale your environment. With MCP, you can significantly speed up, simplify, and standardize these types of integrations.

An MCP server exposes external data sources and tools so that LLM applications can access them. Typically, you want to deploy these servers remotely and have authorization mechanisms in place so that LLM applications can safely access the data.

With agentgateway, you can connect to one or multiple MCP servers in any environment. The agentgateway proxies requests to the MCP tool that is exposed on the server. You can also use the agentgateway to federate tools from multiple MCP servers. For more information, see the [virtual MCP](connect/virtual.md) guide.

You can configure MCP servers with the simplified `mcp` section or with the `routes` section, and you can expose several servers on one endpoint or on separate paths. For help choosing, see [MCP configuration modes](configuration-modes.md).

In standalone mode, MCP and LLM traffic can share one gateway or use separate gateways. Attach the `mcp` and `llm` sections to the same gateway to serve both on one port, or to different gateways to keep them on separate ports. For details, see [Gateways](../configuration/gateways.md) and [Routing-based configuration for LLMs](../llm/configuration-modes.md).

## MCP vs. A2A [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/mcp/about/#mcp-vs-a2a)

MCP and [Agent-to-Agent (A2A)](https://github.com/a2aproject/A2A) are the leading protocols for enabling communication between agents and tools. MCP helps to retrieve and exchange context with Large Language Models (LLMs) and connect LLMs to tools. On the other hand, A2A solves for long-running tasks and state management across multiple agents. MCP and A2A are both JSON-RPC protocols that define the structure of how an agent describes what it wants to do, how it calls tools, and how it hands off tasks to other agents.

## Challenges with MCP and A2A [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/mcp/about/#challenges-with-mcp-and-a2a)

While MCP and A2A define the RPC communication protocol for agents and tools, they currently do not address real-world, enterprise-level concerns.

Agents typically do not operate in isolation. Instead, they interact with each other (agent-to-agent), with internal systems (agent-to-tool), and external or foundational models (agent-to-LLM). These interactions are often dynamic, multi-modal, and span organizational and data boundaries.

Such long-lived interactivity creates new vectors for risk and complexity, including:

- **Security**: How to handle authentication, authorization, and auditing of agent interactions across tools and services?
- **Governance**: How to enforce policies across autonomous workflows, such as data residency or access control?
- **Observability**: How to gain visibility into what agents are doing, when, and why?
- **Scalability and performance**: How to ensure low latency while securely handling retries, timeouts, and failures?

Agentgateway is designed to tackle these challenges at its core with built-in security, governance, and observability for all MCP and A2A communication between agents, tools, and LLMs.

[MCP configuration modes](https://agentgateway.dev/docs/standalone/latest/mcp/configuration-modes/ 'MCP configuration modes')

Was this page helpful?

Ask AI

Agentgateway assistant

Ask me anything about agentgateway configuration, features, or usage.

Note: AI-generated content might contain errors; please verify and test all returned information.

Tip: one topic per conversation gives the best results. Use the **+** button in the chat header to start a new conversation.

![Agent](about.md)

•••

Rate limit reached

The assistant keeps a rolling history of 3 exchanges. Any older messages are no longer included in the context.

Switching topics? Starting a new conversation improves accuracy.Start new conversation

Current page

↑↓ navigate
↵ select
esc dismiss

Add this pageMention a page

Standalone

Standalone

Standalone deployment docs

Kubernetes

Kubernetes deployment docs

### What could be improved?

Your feedback helps us improve assistant answers and identify docs gaps we should fix.

Need more help? Join us on Discord:
[https://discord.gg/y9efgEmppm](https://discord.gg/y9efgEmppm)

Want to use your own agent? Add the Solo MCP server to query our docs directly. Get started here:
[https://search.solo.io/](https://search.solo.io/).

SkipSubmit
