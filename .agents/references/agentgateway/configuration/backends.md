[Skip to content](backends.md#content)

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

# Backends

VerifiedCode examples on this page have been automatically tested and verified.

Configure backends to route traffic to hostnames, LLM providers, and MCP servers.

Agentgateway backends**Backend** A destination service that receives traffic from agentgateway. Backends can be static hosts, MCP servers, LLM providers, or other services. control where traffic is routed to.
Agentgateway supports a variety of backends, such as simple hostnames and IP addresses, LLM providers**Provider** A service that provides LLM capabilities, such as OpenAI, Anthropic, or Azure. Agentgateway supports multiple LLM providers and can route to different providers based on configuration., and MCP servers.

Note

Agentgateway supports more than one configuration style. Where a feature can also be configured in the simplified `llm` or `mcp` modes, the examples on this page show each option in tabs. For more information, see [Routing-based configuration](../llm/configuration-modes.md).

## Static Hosts [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/configuration/backends/#static-hosts)

The simplest form of backend is a static hostname or IP address. Static hosts are a routing-based backend, so they are configured in a `routes` entry; the simplified `llm` and `mcp` modes model only LLM providers and MCP targets. For example:

```yaml
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
gateways:
  default:
    port: 3000
    protocol: HTTP
routes:
  - backends:
      - host: example.com:8080
        weight: 1
      - host: 127.0.0.1:80
        weight: 9
```

## MCP Servers [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/configuration/backends/#mcp-servers)

The MCP backend allows you to connect to an MCP server.
Below shows a simple example, exposing a local and remote MCP server.
See the [MCP connectivity guide](../mcp/index.md) for more information.

Simplified (MCP)Routing-based

```yaml
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
mcp:
  port: 3000
  targets:
    - name: stdio-server
      stdio:
        cmd: npx
        args: ['@modelcontextprotocol/server-everything']
    - name: http-server
      mcp:
        host: https://example.com/mcp
```

```yaml
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
gateways:
  default:
    port: 3000
routes:
  - backends:
      - mcp:
          targets:
            - name: stdio-server
              stdio:
                cmd: npx
                args: ['@modelcontextprotocol/server-everything']
            - name: http-server
              mcp:
                host: https://example.com/mcp
```

### Session routing [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/configuration/backends/#session-routing)

By default, MCP backends use stateful session routing, where the gateway tracks session IDs and routes subsequent requests to the same upstream. For upstreams that do not maintain server-side session state, you can set `statefulMode: stateless`. In stateless mode, the gateway automatically wraps each request with an initialization sequence, so the upstream server processes every request independently.

Simplified (MCP)Routing-based

```yaml
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
mcp:
  port: 3000
  statefulMode: stateless
  targets:
    - name: openapi-server
      openapi:
        host: petstore3.swagger.io:443
        schema:
          url: https://petstore3.swagger.io/api/v3/openapi.json
```

```yaml
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
gateways:
  default:
    port: 3000
routes:
  - backends:
      - mcp:
          statefulMode: stateless
          targets:
            - name: openapi-server
              openapi:
                host: petstore3.swagger.io:443
                schema:
                  url: https://petstore3.swagger.io/api/v3/openapi.json
```

## LLM Providers [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/configuration/backends/#llm-providers)

Agentgateway natively supports connecting to LLM providers, such as OpenAI and Anthropic.
Below shows a simple example, connecting to OpenAI.
See the [LLM consumption guide](../llm/index.md) for more information.

Simplified (LLM)Routing-based

```yaml
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
llm:
  models:
    - name: openai
      provider: openAI
      params:
        model: gpt-3.5-turbo
        apiKey: '$OPENAI_API_KEY'
```

```yaml
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
gateways:
  default:
    port: 3000
routes:
  - backends:
      - ai:
          name: openai
          provider:
            openAI:
              model: gpt-3.5-turbo
    policies:
      backendAuth:
        key: '$OPENAI_API_KEY'
```

## AWS AgentCore [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/configuration/backends/#aws-agentcore)

The AWS backend routes requests to an [Amazon Bedrock AgentCore](https://aws.amazon.com/bedrock/agentcore/) agent runtime. AgentCore is a routing-based backend, so it is configured in a `routes` entry.

Agentgateway derives the connection details from the `agentRuntimeArn` value: requests are sent over TLS to the `bedrock-agentcore` endpoint in the runtime’s AWS region, with the path set to the runtime’s invocation endpoint. Agentgateway signs each request with AWS SigV4 by using the standard [AWS credential lookup](https://docs.aws.amazon.com/sdkref/latest/guide/access.html) from the environment.

The following configuration is from the [`traffic-aws-agentcore` example](https://github.com/agentgateway/agentgateway/tree/main/examples/traffic-aws-agentcore) in the agentgateway repository.

[config.yaml](https://agentgateway.dev/agentgateway.dev/examples/traffic-aws-agentcore/config.yaml)

```yaml
# AgentCore with static user-id header forwarding.
binds:
  - port: 3000
    listeners:
      - routes:
          - matches:
              - path:
                  pathPrefix: /supply-chain-agent
            backends:
              - aws:
                  agentCore:
                    agentRuntimeArn: 'arn:aws:bedrock-agentcore:us-west-2:606469916935:runtime/a2a_sca_iam-4rLvS1BRqq'
                policies:
                  requestHeaderModifier:
                    set:
                      X-Amzn-Bedrock-AgentCore-Runtime-User-Id: 'user-foo'
                      X-Amzn-Bedrock-AgentCore-Runtime-Custom-User-Id: 'user-foo'
```

| Setting                          | Description                                                                                                                                                                   |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `agentRuntimeArn`                | The ARN of the AgentCore agent runtime to invoke, in the format `arn:aws:bedrock-agentcore:<region>:<account-id>:runtime/<runtime-id>`.                                       |
| `qualifier`                      | Optional runtime version or endpoint qualifier to invoke. If unset, the default endpoint is used.                                                                             |
| `policies.requestHeaderModifier` | Optional headers to set before the request is sent upstream, such as the `X-Amzn-Bedrock-AgentCore-Runtime-User-Id` header that identifies the user to the AgentCore runtime. |

[Routes](https://agentgateway.dev/docs/standalone/latest/configuration/routes/ 'Routes') [Policies](https://agentgateway.dev/docs/standalone/latest/configuration/policies/ 'Policies')

Was this page helpful?

Ask AI

Agentgateway assistant

Ask me anything about agentgateway configuration, features, or usage.

Note: AI-generated content might contain errors; please verify and test all returned information.

Tip: one topic per conversation gives the best results. Use the **+** button in the chat header to start a new conversation.

![Agent](backends.md)

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
