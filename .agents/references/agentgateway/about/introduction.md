[Skip to content](introduction.md#content)

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

# Introduction

Get started with agentgateway and explore its key features and policies.

Agentgateway is an open source gateway control plane and proxy data plane, hosted [as part of the Linux Foundation](https://www.linuxfoundation.org/press/linux-foundation-welcomes-agentgateway-project-to-accelerate-ai-agent-adoption-while-maintaining-security-observability-and-governance). It is a general-purpose HTTP and gRPC data plane with load balancing, timeouts, retries, TLS, rate limits, authorization, and traffic policies. You can also front ordinary APIs and microservices with the same proxy that you use for LLM inference, MCP tool servers, and A2A agent traffic. This way, you do not need to operate separate “regular” and “AI” gateways. On that foundation, it focuses on implementing the missing pieces [not found in traditional API gateways](https://www.solo.io/blog/why-do-we-need-a-new-gateway-for-ai-agents) to support MCP and agent workloads at scale. The project emphasizes enterprise-grade security, observability, resiliency, reliability, and multi-tenancy features. Agentgateway is built to be the most performant, reliable, and mature LLM/MCP gateway on the market. The rest of this page covers the motivation behind agentgateway, the core problems it solves, and its key features.

Important

Want to use agentgateway in a Kubernetes environment with the Gateway API? Check out the [agentgateway on Kubernetes docs](https://agentgateway.dev/docs/kubernetes/).

## Why agentgateway? [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/about/introduction/#why-agentgateway)

To understand the benefits of agentgateway and why you should use it, let’s dive into how agentic AI environments work, the challenges they come with, and why traditional gateways fall short of solving these challenges.

### About MCP and A2A [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/about/introduction/#about-mcp-and-a2a)

With agentic artificial intelligence (AI) changing the way organizations build and deliver applications, organizations face the challenge of rapidly adopting new technologies and interoperability protocols to connect agents and tools in fragmented environments. Because AI agents and tools can be built with different frameworks, and access different APIs and data sources, standardizing the way agents and tools communicate with each other is essential to further accelerate agent development.

[Model Context Protocol (MCP)](https://modelcontextprotocol.io/docs/getting-started/intro) and [Agent-to-Agent (A2A)](https://github.com/a2aproject/A2A) are the leading protocols for enabling communication between agents and tools. MCP helps to retrieve and exchange context with Large Language Models (LLMs) and connect LLMs to tools. On the other hand, A2A solves for long-running tasks and state management across multiple agents. MCP and A2A are both JSON-RPC protocols that define the structure of how an agent describes what it wants to do, how it calls tools, and how it hands off tasks to other agents.

### Challenges with MCP and A2A [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/about/introduction/#challenges-with-mcp-and-a2a)

While MCP and A2A define the RPC communication protocol for agents and tools, they currently do not address real-world, enterprise-level concerns.

Agents typically do not operate in isolation. Instead, they interact with each other (agent-to-agent), with internal systems (agent-to-tool), and external or foundational models (agent-to-LLM). These interactions are often dynamic, multi-modal, and span organizational and data boundaries.

Such long-lived interactivity creates new vectors for risk and complexity, including:

- **Security**: How to handle authentication, authorization, and auditing of agent interactions across tools and services?
- **Governance**: How to enforce policies across autonomous workflows, such as data residency or access control?
- **Observability**: How to gain visibility into what agents are doing, when, and why?
- **Scalability and performance**: How to ensure low latency while securely handling retries, timeouts, and failures?

Agentgateway is designed to tackle these challenges at its core with built-in security, governance, and observability for all MCP and A2A communication between agents, tools, and LLMs.

### Traditional gateways vs. agentgateway [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/about/introduction/#traditional-gateways-vs-agentgateway)

Traditional API gateways, reverse proxies and AI gateways, such as Envoy, were built and optimized for RESTful microservices architectures where the gateway receives short-lived HTTP requests from a client, decides on a backend, and forwards the request to that backend. Typically, no session context or ongoing connection state is required in these cases.

MCP, by contrast, is a stateful protocol based on JSON-RPC with its own semantics for how to retrieve and exchange context with LLMs. MCP clients and servers must maintain long-lived sessions where requests and responses are sent constantly. Every request and response must be tied to the same session context. In addition, MCP servers can initiate messages back to the client asynchronously, which makes keeping track of all stateful sessions challenging.

A single client request, such as to list all available tools, might require the proxy to access multiple backend MCP servers, aggregate the responses, and return a single coherent result. In addition, clients might not have access to all the tools that are available on the server. The proxy must be capable to dynamically adjust its responses on a per-session basis and map each client session to the backend servers it is allowed to access.

Traditional gateways were not designed and built to support the session and message awareness that is required to properly handle stateful, session-based, and bidirectional communications. In addition, these communication patterns are very resource intensive and can quickly overwhelm traditional gateways leading to performance impacts or even failure. Without major re-architecture, traditional gateways cannot support the rise of agentic AI use cases.

In contrast, Agentgateway is an open source gateway control plane and proxy data plane, hosted [as part of the Linux Foundation](https://www.linuxfoundation.org/press/linux-foundation-welcomes-agentgateway-project-to-accelerate-ai-agent-adoption-while-maintaining-security-observability-and-governance). It is a general-purpose HTTP and gRPC data plane with load balancing, timeouts, retries, TLS, rate limits, authorization, and traffic policies. You can also front ordinary APIs and microservices with the same proxy that you use for LLM inference, MCP tool servers, and A2A agent traffic. This way, you do not need to operate separate “regular” and “AI” gateways. On that foundation, it focuses on implementing the missing pieces [not found in traditional API gateways](https://www.solo.io/blog/why-do-we-need-a-new-gateway-for-ai-agents) to support MCP and agent workloads at scale. The project emphasizes enterprise-grade security, observability, resiliency, reliability, and multi-tenancy features. Agentgateway is built to be the most performant, reliable, and mature LLM/MCP gateway on the market.

## Key features [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/about/introduction/#key-features)

Agentgateway comes with the following key features:

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

## Policies [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/about/introduction/#policies)

Agentgateway provides policies**Policy** A configuration that manipulates, secures, or observes traffic as it flows through agentgateway. Policies can be attached at the listener, route, or backend level. to govern how traffic for MCP and A2A backends**Backend** A destination service that receives traffic from agentgateway. Backends can be static hosts, MCP servers, LLM providers, or other services. is managed, transformed**Transformation** The process of modifying HTTP requests or responses as they pass through agentgateway. Transformations can change headers, body content, and other request/response attributes., and secured.

Based on the [schema](https://github.com/agentgateway/agentgateway/blob/main/schema/config.json), you can configure the following policies. Each policy can be applied individually or in combination, allowing you to tailor security and traffic management to your needs.

**Traffic management**:

- **Header manipulation**: Add, set, or remove HTTP request and response headers.
- **Redirect**Redirect** A traffic management feature that sends clients to a different URL, with configurable scheme, authority, path, or status code.**: Redirect incoming requests to a different scheme, authority, path, or status code.
- **Rewrites**Rewrite** A traffic management feature that modifies the authority (host) or path of requests before forwarding them to backends.**: Rewrite the authority or path of requests before forwarding.
- **Direct response**Direct Response** A traffic management feature that returns a fixed response (body and status code) directly to the client without forwarding the request to a backend.**: Return a fixed response (body and status) directly, without forwarding to a backend.

**Security**:

- **CORS**CORS (Cross-Origin Resource Sharing)** A security mechanism that allows web pages to make requests to a different domain than the one serving the web page. Agentgateway can configure CORS headers to control cross-origin access.**: Configure Cross-Origin Resource Sharing (CORS) settings for allowed origins, headers, methods, and credentials.
- **MCP Authorization**Authorization (AuthZ)** The process of determining what actions an authenticated user or service is allowed to perform. Agentgateway supports HTTP authorization, MCP authorization, and external authorization services.**: Apply custom authorization rules using the MCP model.
- **MCP Authentication**Authentication (AuthN)** The process of verifying the identity of a user or service. Agentgateway supports various authentication methods including JWT, API keys, and basic authentication.**: Enforce authentication using an external provider (e.g., Auth0, Keycloak) with issuer, scopes, and audience.
- **A2A**: Enable agent-to-agent (A2A) communication features.
- **AI**: Attach AI-specific configuration for routes that use AI backends.
- **Backend TLS**TLS (Transport Layer Security)** A cryptographic protocol that provides secure communication over a network. Agentgateway supports TLS for both incoming connections (listeners) and outgoing connections (backends).**: Configure TLS settings for secure backend connections, including certificates and trust roots.
- **Backend Auth**: Set up authentication for backend services (e.g., passthrough, key, GCP, AWS).
- **Local Rate Limit**: Apply local rate limiting to control request rates.
- **Remote Rate Limit**: Apply distributed rate limiting using an external service.
- **JWT**JWT (JSON Web Token)** A compact, URL-safe token format used for securely transmitting information between parties. JWTs are commonly used for authentication and authorization in agentgateway. Auth**: Enforce JWT authentication with issuer, audiences, and JWKS (key set) configuration.
- **External Authorization**Authorization (AuthZ)** The process of determining what actions an authenticated user or service is allowed to perform. Agentgateway supports HTTP authorization, MCP authorization, and external authorization services. (extAuthz)**: Integrate with an external authorization service.

**Resiliency**:

- **Request mirroring**Mirroring** A resiliency feature that sends a copy of requests to an additional backend for testing or analysis, without affecting the primary request flow.**: Mirror a percentage of requests to an additional backend for testing or analysis.
- **Timeout**Timeout** A time limit for how long agentgateway will wait for a response from a backend before considering the request failed. Timeouts can be configured at the request or backend level.**: Set request and backend timeouts.
- **Retries**Retry** A resiliency feature that automatically resends failed requests to backends. Retries can be configured with backoff strategies and specific conditions for when to retry.**: Configure retry attempts, backoff, and which response codes should trigger retries.

[Architecture](https://agentgateway.dev/docs/standalone/latest/about/architecture/ 'Architecture')

Was this page helpful?

Ask AI

Agentgateway assistant

Ask me anything about agentgateway configuration, features, or usage.

Note: AI-generated content might contain errors; please verify and test all returned information.

Tip: one topic per conversation gives the best results. Use the **+** button in the chat header to start a new conversation.

![Agent](introduction.md)

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
