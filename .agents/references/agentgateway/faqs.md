# FAQs

Answers to common questions about agentgateway’s features, configuration, and deployment.

Check out frequently asked questions about agentgateway.

## What are MCP and A2A?

With agentic artificial intelligence (AI) changing the way organizations build and deliver
applications, organizations face the challenge of rapidly adopting new technologies and
interoperability protocols to connect agents and tools in fragmented environments. Because AI agents
and tools can be built with different frameworks, and access different APIs and data sources,
standardizing the way agents and tools communicate with each other is essential to further
accelerate agent development.

[Model Context Protocol (MCP)](https://modelcontextprotocol.io/docs/getting-started/intro) and
[Agent-to-Agent (A2A)](https://github.com/a2aproject/A2A) are the leading protocols for enabling
communication between agents and tools. MCP helps to retrieve and exchange context with Large
Language Models (LLMs) and connect LLMs to tools. On the other hand, A2A solves for long-running
tasks and state management across multiple agents. MCP and A2A are both JSON-RPC protocols that
define the structure of how an agent describes what it wants to do, how it calls tools, and how it
hands off tasks to other agents.

## What do MCP and A2A not solve for?

While MCP and A2A define the RPC communication protocol for agents and tools, they currently do not
address real-world, enterprise-level concerns.

Agents typically do not operate in isolation. Instead, they interact with each other
(agent-to-agent), with internal systems (agent-to-tool), and external or foundational models
(agent-to-LLM). These interactions are often dynamic, multi-modal, and span organizational and data
boundaries.

Such long-lived interactivity creates new vectors for risk and complexity, including:

- **Security**: How to handle authentication, authorization, and auditing of agent interactions across tools and services?
- **Governance**: How to enforce policies across autonomous workflows, such as data residency or access control?
- **Observability**: How to gain visibility into what agents are doing, when, and why?
- **Scalability and performance**: How to ensure low latency while securely handling retries, timeouts, and failures?

Agentgateway is designed to tackle these challenges at its core with built-in security, governance,
and observability for all MCP and A2A communication between agents, tools, and LLMs.

## What’s the problem with traditional API and AI gateways?

Traditional API gateways, reverse proxies and AI gateways, such as Envoy, were built and optimized
for RESTful microservices architectures where the gateway receives short-lived HTTP requests from a
client, decides on a backend, and forwards the request to that backend. Typically, no session
context or ongoing connection state is required in these cases.

MCP, by contrast, is a stateful protocol based on JSON-RPC with its own semantics for how to
retrieve and exchange context with LLMs. MCP clients and servers must maintain long-lived sessions
where requests and responses are sent constantly. Every request and response must be tied to the
same session context. In addition, MCP servers can initiate messages back to the client
asynchronously, which makes keeping track of all stateful sessions challenging.

A single client request, such as to list all available tools, might require the proxy to access
multiple backend MCP servers, aggregate the responses, and return a single coherent result. In
addition, clients might not have access to all the tools that are available on the server. The proxy
must be capable to dynamically adjust its responses on a per-session basis and map each client
session to the backend servers it is allowed to access.

Traditional gateways were not designed and built to support the session and message awareness that
is required to properly handle stateful, session-based, and bidirectional communications. In
addition, these communication patterns are very resource intensive and can quickly overwhelm
traditional gateways leading to performance impacts or even failure. Without major re-architecture,
traditional gateways cannot support the rise of agentic AI use cases.

## What is agentgateway and why do I want to use it?

Agentgateway is an open source gateway control plane and proxy data plane, hosted [as part of the Linux Foundation](https://www.linuxfoundation.org/press/linux-foundation-welcomes-agentgateway-project-to-accelerate-ai-agent-adoption-while-maintaining-security-observability-and-governance). It is a general-purpose HTTP and gRPC data plane with load balancing, timeouts, retries, TLS, rate limits, authorization, and traffic policies. You can also front ordinary APIs and microservices with the same proxy that you use for LLM inference, MCP tool servers, and A2A agent traffic. This way, you do not need to operate separate “regular” and “AI” gateways. On that foundation, it focuses on implementing the missing pieces [not found in traditional API gateways](https://www.solo.io/blog/why-do-we-need-a-new-gateway-for-ai-agents) to support MCP and agent workloads at scale. The project emphasizes enterprise-grade security, observability, resiliency, reliability, and multi-tenancy features. Agentgateway is built to be the most performant, reliable, and mature LLM/MCP gateway on the market.

- **Unified data plane**: Agentgateway is one gateway for HTTP, gRPC, and agent traffic so that you can route microservice APIs with the same proxy you use for MCP, A2A, and LLMs, including the ability to integrate existing REST APIs as agent-native tools.
- **Highly performant**: Built in Rust, agentgateway is designed to handle any scale. It is optimized for high throughput, low latency, reliability, and stability when handling long-lived connections and fan-out patterns.
- **Any agent framework**: Agentgateway is compatible with any agentic framework supporting MCP and A2A protocols, including LangGraph, AutoGen, kagent, Claude Desktop, and OpenAI SDK. You can also use agentgateway to expose a REST API as an agent-native tool.
- **Platform-agnostic**: Agentgateway can run in any environment, including bare metal, virtual machine, containers, and Kubernetes.
- **Multiplexing and tool federation**: Agentgateway provides a single endpoint to federate multiple backend MCP servers and virtualize tool servers on a per-client basis.
- **Automatic protocol upgrades/fallbacks**: Agentgateway is built to negotiate and gracefully handle protocol upgrades and fallbacks to avoid client or server failures as the MCP/A2A protocols evolve.
- **Authentication and authorization**: Built-in JWT authentication and a robust RBAC system allow you to control access to MCP servers, tools and agents, and to protect against [tool poisoning attacks](https://invariantlabs.ai/blog/mcp-security-notification-tool-poisoning-attacks).
- **Built-in observability**: Agentgateway comes with built-in metrics and tracing capabilities that allow you to monitor the MCP client and backend tool interactions.
- **Self-service portal**: Agentgateway provides a built-in self-service developer portal that allows agent developers to easily connect, discover, federate, integrate, and secure agents and tools in any environment, including bare metal, VMs, containers, and Kubernetes.
- **Open source**: Agentgateway is open source, and licensed under the Apache 2.0 license.
- **Conformant to the Gateway API project**: Agentgateway is conformant to the Kubernetes Gateway API project, which allows you to use it as a gateway with any Gateway API implementation.
- **Dynamic configuration updates**: Agentgateway can be updated via an xDS interface without any downtime.

## How do I deploy agentgateway on Kubernetes?

Agentgateway includes a built-in Kubernetes controller, which allows users to use the [Kubernetes
Gateway API](https://gateway-api.sigs.k8s.io/) to provision and configure agentgateway proxies.

For more information, see the [Agentgateway on Kubernetes
documentation](https://agentgateway.dev/docs/kubernetes/).

## What’s the difference between agentgateway and kagent?

Agentgateway governs agent-to-tool, agent-to-agent, and agent-to-LLM communication ensuring that
these components can securely and reliably talk to each other and exchange data. However,
agentgateway assumes that the MCP servers, tools, and agents that you want to access already exist
in your environment.

That’s where [kagent](https://kagent.dev) comes in. With kagent, you can quickly develop, build, and
run MCP servers and agents directly in Kubernetes. Kagent automates complex DevOps and platform
engineering operations for you with out-of-the-box agents and tools, intelligent workflows, and
built-in troubleshooting.

Together, kagent and agentgateway give you all the tools to successfully build a production-ready
agentic AI environment that is scalable, reliable, and secure.

## What license is agentgateway under?

The agentgateway project uses [Apache License 2.0](https://www.apache.org/licenses/).

## What is the project roadmap?

The agentgateway project organizes issues into milestones for each release. For more details, see
the following agentgateway links:

- [Issues](https://github.com/agentgateway/agentgateway/issues)
- [Milestones](https://github.com/agentgateway/agentgateway/milestones)
- [Project board](https://github.com/orgs/agentgateway/projects/1)

## Where is the changelog?

The changelog is part of each [GitHub
release](https://github.com/agentgateway/agentgateway/releases/).

## How do I report a security vulnerability?

Report vulnerabilities privately by [filing a GitHub security
advisory](https://github.com/agentgateway/agentgateway/security/advisories/new). The agentgateway
security team reviews each report privately. Do not report security vulnerabilities in public GitHub
issues. If you are unsure whether an issue is a security vulnerability, report it privately.

For more details, see the [agentgateway security
policy](https://github.com/agentgateway/agentgateway/security/policy). To review vulnerabilities
that the project already disclosed, see the [published security
advisories](https://github.com/agentgateway/agentgateway/security/advisories).

## Is there enterprise software that is based on agentgateway?

[Solo.io](https://www.solo.io/products/agentgateway)

## What if I have more questions about agentgateway?

Join the weekly agentgateway [community
meeting](https://github.com/agentgateway/agentgateway?tab=readme-ov-file#community-meetings) or
engage with the agentgateway community on [Discord](https://discord.com/invite/y9efgEmppm).

[Reference](/docs/standalone/latest/reference/ 'Reference')

Was this page helpful?
