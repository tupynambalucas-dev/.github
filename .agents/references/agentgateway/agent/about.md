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

Learn about the A2A protocol and how agents communicate and interoperate.

## About A2A [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/agent/about/#about-a2a)

Agent-to-agent, or [A2A](https://github.com/a2aproject/A2A), is an open protocol that enables communication and interoperability between opaque agentic applications. Developed by Google, A2A defines a common language that enables agents to show their capabilities and help them negotiate how they interact with the user, such as via text, forms, or bidirectional audio or video, irrespective of the framework or vendor they are built on.

With A2A, agents can:

- Discover each other’s capabilities.
- Negotiate interaction modalities (text, forms, media).
- Securely collaborate on long running tasks.
- Operate without exposing their internal state, memory, or tools.

## What are agents? [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/agent/about/#what-are-agents)

An artificial intelligence (AI) agent is an application that can interact with users in natural language. Agents use large language models (LLMs) to generate responses to user queries and decide whether to call external tools to execute actions on behalf of the user.

LLMs are limited by static training data. This limitation can make seemingly simple questions difficult to answer. For example, consider the following question:

> What’s the weather today?

The LLM has to know several pieces of real-time information that it was not trained on:

- The user’s location
- The current date
- The weather forecast for that date and location

With agents and tools, you can extend the capabilities of the LLM with your own external APIs, apps, and data. First, you create _tools_ that extend the capabilities of the LLM with a function, such as `get_weather`. These functions can include _parameters_, or inputs, that are needed to execute the function. For example, the `get_weather` function needs the date and location to get the current weather forecast. The _name_ and _description_ of the tool function and parameters help the LLM decide when to call the tool.

Next, when forwarding user requests to the LLM, you can include the set of tools that the LLM can leverage to answer the user. Based on the user’s question, the LLM can respond directly or suggest a tool to call to help answer the question. To get the required parameters for the tool call, the LLM might ask the end user or call other functions like `get_location` or `get_date`, which in turn might pull that information based on system settings on the end user’s device.

### Agent sequence diagram [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/agent/about/#diagram)

Consider the following sequence diagram that shows how agents and tools work.

```
AppLLMAgentUserAppLLMAgentUser"What's the weather in Columbus?"1Forward user request along with tool list2Suggest tool call (get_weather)3Send tool suggestion4Execute tool (get_weather)5Send tool result6Forward tool result7Generate final response8"The weather in Columbus is 15°C and cloudy."9
```

1. The User asks about the weather today. The request includes a list of tools that the LLM can use to answer the question.
2. The Agent sends the request with the tool list to the LLM.
3. Based on the conversation, the LLM suggests to call the `get_weather` tool and includes the required parameters to use that tool. The LLM might get these parameters by using the chat history, asking the end user to provide them, or by suggesting other tools to call before calling the `get_weather` function.
4. The Agent invokes the `get_weather` tool by sending a request to the App. The request includes the required parameters to execute the tool.
5. The App executes the `get_weather` tool with the required parameters to get the current weather in the location, such as Columbus, OH.
6. The App returns the tool result to the Agent.
7. The Agent returns the tool result to the LLM.
8. The LLM uses the real-time tool result from the App in a natural language response and returns this response to the Agent.
9. The Agent then forwards the natural language response to the User.

[Connect to an agent](https://agentgateway.dev/docs/standalone/latest/agent/a2a/ 'Connect to an agent')

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
