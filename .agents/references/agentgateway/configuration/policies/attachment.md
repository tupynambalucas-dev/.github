[Skip to content](attachment.md#content)

`CTRL K`

Toggle theme[Docs](https://agentgateway.dev/docs/) [Standalone](../../README.md) [Kubernetes](https://agentgateway.dev/docs/kubernetes/latest/) [Models](https://agentgateway.dev/models) [Blog](https://agentgateway.dev/blog) [Enterprise](https://agentgateway.dev/enterprise) [Community](https://discord.gg/y9efgEmppm) [Get Started](https://agentgateway.dev/#getting-started) [GitHub](https://github.com/agentgateway/agentgateway)

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

# Attachment points

Learn how to attach policies to different resources in agentgateway.

You can attach policies at the gateway or listener**Listener** An entry point for incoming traffic into agentgateway. Listeners are configured on ports and support HTTP, HTTPS, TCP, and TLS protocols., route**Route** A rule that matches incoming requests and forwards them to backends. Routes can match on path, hostname, headers, query parameters, and HTTP methods., or backend**Backend** A destination service that receives traffic from agentgateway. Backends can be static hosts, MCP servers, LLM providers, or other services. level to provide fine-grained control over traffic.

## Phases [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/configuration/policies/attachment/#phases)

Policies that are attached at multiple levels are applied at all levels.

| Section             | Available Policies                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Phase                                                |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| Gateway or listener | JWT**JWT (JSON Web Token)** A compact, URL-safe token format used for securely transmitting information between parties. JWTs are commonly used for authentication and authorization in agentgateway., External Authorization, External Processing**ExtProc (External Processing)** An advanced filter that allows arbitrary modifications to HTTP requests and responses using an external gRPC processing server. ExtProc is API-compatible with Envoy's External Processing service., Transformation**Transformation** The process of modifying HTTP requests or responses as they pass through agentgateway. Transformations can change headers, body content, and other request/response attributes., Basic Authentication**Authentication (AuthN)** The process of verifying the identity of a user or service. Agentgateway supports various authentication methods including JWT, API keys, and basic authentication., API Key**API Key** A secret token used to authenticate API requests. Agentgateway can validate API keys and attach metadata to authenticated requests. authentication | Runs before route selection                          |
| Route               | All Policies                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Runs after route selection, before backend selection |
| Backend             | Backend TLS, Backend Authentication, Backend HTTP, Backend TCP, AI/LLM, MCP Authorization, MCP Authentication, External Authorization, Header modification                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Runs after backend selection                         |

## Example policy configuration [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/configuration/policies/attachment/#example-policy-configuration)

Review the following example configuration that uses one of each policy type.

```yaml
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
gateways:
  default:
    port: 3000
    # Gateway level policy
    # Enforces that incoming requests have a valid API keyAPI KeyA secret token used to authenticate API requests. Agentgateway can validate API keys and attach metadata to authenticated requests.
    apiKey:
      mode: strict
      keys:
        - key: sk-testkey-1
          metadata:
            user: test
            role: admin
routes:
  # Route level policy
  # Adds a header (based on a CELCEL (Common Expression Language)A simple expression language used throughout agentgateway to enable flexible configuration. CEL expressions can access request context, JWT claims, and other variables to make dynamic decisions. expression) with the authenticated user (based on the API key)
  - policies:
      transformations:
        request:
          set:
            x-authenticated-user: apiKey.user
    backends:
      - host: localhost:8080
        # Backend level policy
        # Adds an Authorization header to outgoing requests
        policies:
          backendAuth:
            key: my-authorization-header
```

## More policy configuration guides [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/configuration/policies/attachment/#more-policy-configuration-guides)

For more information about available policies, review the following guides:

[Traffic management](../traffic-management/index.md) [Resiliency](../resiliency/index.md) [Security](../security/index.md)

[Conditional policies](https://agentgateway.dev/docs/standalone/latest/configuration/policies/conditional-policies/ 'Conditional policies')

Was this page helpful?

Ask AI

Agentgateway assistant

Ask me anything about agentgateway configuration, features, or usage.

Note: AI-generated content might contain errors; please verify and test all returned information.

Tip: one topic per conversation gives the best results. Use the **+** button in the chat header to start a new conversation.

![Agent](attachment.md)

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
