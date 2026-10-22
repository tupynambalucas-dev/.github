[Skip to content](a2a.md#content)

`CTRL K`

Toggle theme[Docs](https://agentgateway.dev/docs/) [Standalone](../README.md) [Kubernetes](https://agentgateway.dev/docs/kubernetes/latest/) [Models](https://agentgateway.dev/models) [Blog](https://agentgateway.dev/blog) [Enterprise](https://agentgateway.dev/enterprise) [Community](https://discord.gg/y9efgEmppm) [Get Started](https://agentgateway.dev/#getting-started) [GitHub](https://github.com/agentgateway/agentgateway)

agentgateway has joined the **Agentic AI Foundation** — [Learn more](https://aaif.io/blog/agentgateway-joins-aaif-as-an-open-gateway-for-agentic-ai-infrastructure/)×

Copy as Markdown

- Copy as Markdown
- View as Markdown
- Copy Codeblocks
- Connect to Docs MCP
- Open in Claude
- Open in ChatGPT
- Open in Perplexity
- Print

Page as Markdown

CopyDownload✕

```

```

# Connect to an agent

Route to A2A servers and securely expose their skills through agentgateway.

Proxy requests to an agent that communicates via the agent-to-agent protocol (A2A).

Important

Want to use agentgateway in a Kubernetes environment with the Gateway API? Check out the [agentgateway on Kubernetes docs](https://agentgateway.dev/docs/kubernetes/).

## Before you begin [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/agent/a2a/#before-you-begin)

1. [Install the `agentgateway` binary](../deployment/binary.md).
2. [Install the `uv` Python package manager](https://docs.astral.sh/uv/getting-started/installation/).

## Set up the agentgateway [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/agent/a2a/#agentgateway)

Create an agentgateway that proxies requests to the ADK agent that you create later.

1. Create a listener and target configuration for your agentgateway. In this example, the agentgateway is configured as follows:

   - **Listener**: An HTTP listener is configured for the A2A protocol and exposed on port 3000.
   - **Backend**: The agentgateway targets a backend on your localhost port 9999, which you create in a subsequent step.

```yaml
cat <<EOF > config.yaml
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
   config:
     logging:
       format: json
   frontendPolicies:
     accessLog:
       add:
         backend: backend
   binds:
   - port: 3000
     listeners:
     - routes:
       - policies:
           cors:
             allowOrigins:
             - '*'
             allowHeaders:
             - content-type
             - cache-control
           # Mark this route as a2a traffic
           a2a: {}
         backends:
         - host: localhost:9999

EOF
```

2. Create the agentgateway.

```sh
agentgateway -f config.yaml
```

## Set up an ADK agent [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/agent/a2a/#hello-world-agent)

The following steps use the [A2A sample repository](https://github.com/a2aproject/a2a-samples).

1. Clone the A2A sample repository.

```sh
git clone https://github.com/a2aproject/a2a-samples.git
```

2. Run the Hello World agent.

```sh
uv run --directory a2a-samples/samples/python/agents/helloworld .
```

## Verify the A2A connection [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/agent/a2a/#verify)

1. In another terminal, run the client and send several test messages to the Hello World agent.

```sh
uv run --directory a2a-samples/samples/python/hosts/cli . --agent http://localhost:3000
```

Example output:

```
======= Agent Card ========
{"capabilities":{"streaming":true},"defaultInputModes":["text"],"defaultOutputModes":["text"],"description":"Just a hello world agent","name":"Hello World Agent","protocolVersion":"0.2.5","skills":[{"description":"just returns hello world","examples":["hi","hello world"],"id":"hello_world","name":"Returns hello world","tags":["hello world"]}],"supportsAuthenticatedExtendedCard":true,"url":"http://localhost:3000","version":"1.0.0"}
=========  starting a new task ========

What do you want to send to the agent? (:q or quit to exit):
```

Type a sample message, such as `hi`, press enter to skip select file, and then send the message by pressing enter again.

The agent responded with `Hello World` by taking a look at the end of the response `{"kind":"text","text":"Hello World"}],"role":"agent"}`

2. In another terminal tab, manually send a request to the agent card endpoint through agentgateway.

```sh
curl localhost:3000/.well-known/agent.json | jq
```

Example output: Notice that the `url` field is rewritten to point to the agentgateway.

```json
{
     "capabilities": {
       "streaming": true
     },
     "defaultInputModes": [\
       "text"\
     ],
     "defaultOutputModes": [\
       "text"\
     ],
     "description": "Just a hello world agent",
     "name": "Hello World Agent",
     "protocolVersion": "0.2.5",
     "skills": [\
       {\
         "description": "just returns hello world",\
         "examples": [\
           "hi",\
           "hello world"\
         ],\
         "id": "hello_world",\
         "name": "Returns hello world",\
         "tags": [\
           "hello world"\
         ]\
       }\
     ],
     "supportsAuthenticatedExtendedCard": true,
     "url": "http://localhost:3000",
     "version": "1.0.0"
}
```

3. In the tab where the agentgateway is running, verify that you see request logs from your client query to the Hello World agent, such as the following example.

```text
2025-07-10T18:10:46.547567Z	info	request	gateway=bind/3000 listener=listener0 route=route0 endpoint=localhost:9999 src.addr=[::1]:59257 http.method=POST http.host=localhost http.path=/ http.version=HTTP/1.1 http.status=200 a2a.method=message/stream duration=3ms
```

## View the A2A route in the UI [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/agent/a2a/#ui)

The agentgateway UI shows the listener and route that serve your A2A traffic. To exercise the agent itself, use the A2A client as shown in the previous section.

1. Open the [agentgateway UI on port 15000](http://localhost:15000/ui/).

2. From the navigation menu under **Traffic**, click **Routes**. Verify that you see the route for your A2A listener, with the backend set to the ADK agent on `localhost:9999`.

![](https://agentgateway.dev/img/ui-a2a-route.png)

![](https://agentgateway.dev/img/ui-a2a-route-dark.png)

3. Click **Gateways** to review the gateway that serves A2A traffic on port 3000.

![](https://agentgateway.dev/img/ui-a2a-listener.png)

![](https://agentgateway.dev/img/ui-a2a-listener-dark.png)

[About](https://agentgateway.dev/docs/standalone/latest/agent/about/ 'About')

Was this page helpful?

Ask AI

Agentgateway assistant

Ask me anything about agentgateway configuration, features, or usage.

Note: AI-generated content might contain errors; please verify and test all returned information.

Tip: one topic per conversation gives the best results. Use the **+** button in the chat header to start a new conversation.

![Agent](a2a.md)

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
