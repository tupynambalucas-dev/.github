# Azure

Verified Code examples on this page have been automatically tested and verified.

Route agentgateway LLM traffic to models hosted on Microsoft Azure AI.

Configure Microsoft Azure AI as an LLM provider in agentgateway.

## Authentication

Before you can use Azure as an LLM provider, you must authenticate by using one of the standard
[Azure authentication methods](https://learn.microsoft.com/en-us/azure/ai-services/authentication).
In standalone mode, this authentication is configured with `llm.models[]` fields (for example,
`params.apiKey` or `auth.azure`). In routing-based configurations, use `policies.backendAuth.azure`.

> [!NOTE] Important Azure CLI authentication requires az or azd to be installed and signed in. Agentgateway calls the CLI when it needs a token. It does not open an interactive flow or run az login or azd auth login for you. Agentgateway does not bundle either command. Mounting a credential directory such as ~/.azure makes cached login state available inside the container, but it does not install the CLI. Use Azure CLI authentication only when running Agentgateway directly on your local machine. If Agentgateway runs in a container, use an API key, client secret, managed identity, or workload identity.

## Configuration

Azure supports two endpoint types:

- **Azure AI Foundry** (`foundry`): Connect to Azure AI Foundry project endpoints at `{resourceName}-resource.services.ai.azure.com`.
- **Azure OpenAI** (`openAI`): Connect directly to Azure OpenAI Service deployments at `{resourceName}.openai.azure.com`.

Review the following example configuration.

```
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
llm:
  models:
  - name: "*"
    provider: azure
    params:
      azureResourceName: "your-resource-name"
      azureResourceType: foundry
      azureProjectName: "your-project-name"
```

```
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
llm:
  models:
  - name: "gpt-4.1"
    provider: azure
    auth:
      key:
        value: "$AZURE_API_KEY"
        location:
          header:
            name: api-key
    params:
      azureResourceName: "your-resource-name"
      azureResourceType: foundry
      azureProjectName: "your-project-name"
```

```
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
llm:
  models:
  - name: "gpt-4.1"
    provider: azure
    params:
      azureResourceName: "your-resource-name"
      azureResourceType: openAI
```

Review the following example configuration.

| Setting                    | Description                                                                                                                                                     |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                     | The model name to match in incoming requests. When a client sends `"model": "<name>"`, the request is routed to this provider. Use `*` to match any model name. |
| `provider`                 | The LLM provider, set to `azure` for Azure AI models.                                                                                                           |
| `params.azureResourceName` | The Azure resource name used to construct the endpoint hostname.                                                                                                |
| `params.azureResourceType` | The endpoint type: `foundry` for Azure AI Foundry, or `openAI` for Azure OpenAI Service.                                                                        |
| `params.azureProjectName`  | The Foundry project name. Required for `foundry` type. If omitted, defaults to `azureResourceName`.                                                             |
| `params.azureApiVersion`   | Optional API version override. Defaults to `v1`. For legacy deployments, use a dated version like `2024-04-01-preview`.                                         |
| `params.model`             | The specific Azure model to use. If set, this model is used for all requests. If not set, the request must include the model to use.                            |
| `params.apiKey`            | The Azure API key for authentication. If unset, implicit Entra ID authentication is used. You can reference environment variables using the `$VAR_NAME` syntax. |

## Advanced configuration

For advanced Azure AI scenarios, use the traditional listener/route configuration format. The
following tabs show examples for different authentication methods.

**Azure AI Foundry with implicit auth**: Use `DefaultAzureCredential` to automatically detect
credentials from the environment (Azure CLI, managed identity, workload identity, or environment
variables).

```
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
gateways:
  default:
    port: 3000
routes:
- matches:
  - path:
      pathPrefix: /azure
  backends:
  - ai:
      name: azure
      provider:
        azure:
          resourceName: "your-resource-name"
          projectName: "your-project-name"
          resourceType: foundry
          model: gpt-4.1
```

Review the following example configuration.

| Setting                          | Description                                                                                                                                             |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ai.name`                        | The name of the LLM provider for this AI backend.                                                                                                       |
| `ai.provider.azure.resourceName` | The Azure resource name used to construct the endpoint hostname.                                                                                        |
| `ai.provider.azure.resourceType` | The endpoint type: `foundry` for Azure AI Foundry, or `openAI` for Azure OpenAI Service.                                                                |
| `ai.provider.azure.projectName`  | The Foundry project name. Required for `foundry` type.                                                                                                  |
| `ai.provider.azure.model`        | Optionally set the model to use for requests. If set, any models in the request are overwritten. If not set, the request must include the model to use. |
| `backendAuth.azure.implicit`     | Use implicit authentication via `DefaultAzureCredential`, which automatically detects credentials from the environment.                                 |

**Azure AI Foundry with client secret**: Use Azure service principal credentials to authenticate
agentgateway with an Azure AI Foundry endpoint.

```
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
gateways:
  default:
    port: 3000
routes:
- matches:
  - path:
      pathPrefix: /azure
  policies:
    backendAuth:
      azure:
        explicitConfig:
          clientSecret:
            tenant_id: "<your-tenant-id>"
            client_id: "<your-client-id>"
            client_secret: "<your-client-secret>"
  backends:
  - ai:
      name: azure
      provider:
        azure:
          resourceName: "your-resource-name"
          projectName: "your-project-name"
          resourceType: foundry
          model: gpt-4.1
```

Review the following example configuration.

| Setting                                         | Description                                                                                                                                             |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ai.name`                                       | The name of the LLM provider for this AI backend.                                                                                                       |
| `ai.provider.azure.resourceName`                | The Azure resource name used to construct the endpoint hostname.                                                                                        |
| `ai.provider.azure.resourceType`                | The endpoint type: `foundry` for Azure AI Foundry, or `openAI` for Azure OpenAI Service.                                                                |
| `ai.provider.azure.projectName`                 | The Foundry project name. Required for `foundry` type.                                                                                                  |
| `ai.provider.azure.model`                       | Optionally set the model to use for requests. If set, any models in the request are overwritten. If not set, the request must include the model to use. |
| `backendAuth.azure.explicitConfig.clientSecret` | Use Azure service principal authentication with tenant ID, client ID, and client secret.                                                                |

**Client secret authentication**

```
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
gateways:
  default:
    port: 3000
routes:
- backends:
  - ai:
      name: azure
      provider:
        azure:
          resourceName: "your-resource-name"
          resourceType: openAI
          model: gpt-4.1
  policies:
    backendAuth:
      azure:
        explicitConfig:
          clientSecret:
            tenant_id: "<your-tenant-id>"
            client_id: "<your-client-id>"
            client_secret: "<your-client-secret>"
```

Review the following example configuration.

| Setting                                         | Description                                                                                                                                             |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ai.name`                                       | The name of the LLM provider for this AI backend.                                                                                                       |
| `ai.provider.azure.resourceName`                | The Azure resource name used to construct the endpoint hostname.                                                                                        |
| `ai.provider.azure.resourceType`                | The endpoint type: `foundry` for Azure AI Foundry, or `openAI` for Azure OpenAI Service.                                                                |
| `ai.provider.azure.projectName`                 | The Foundry project name. Required for `foundry` type.                                                                                                  |
| `ai.provider.azure.model`                       | Optionally set the model to use for requests. If set, any models in the request are overwritten. If not set, the request must include the model to use. |
| `backendAuth.azure.explicitConfig.clientSecret` | Use Azure service principal authentication with tenant ID, client ID, and client secret.                                                                |

**System-assigned managed identity**: Let the Azure Instance Metadata Service automatically issue
agentgateway an access token to use to call Azure AI services.

To use system-assigned managed identity:

- Agentgateway must run in an Azure resource, such as a VM or container instance.
- The Azure resource must have managed identity enabled.
- The Azure resource identity must have permissions to and the network ability to access the Azure AI services.

Leave the `managedIdentity` field empty so that the system assigns a managed identity to use.

```
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
gateways:
  default:
    port: 3000
routes:
- backends:
  - ai:
      name: azure
      provider:
        azure:
          resourceName: "your-resource-name"
          resourceType: openAI
          model: gpt-4.1
  policies:
    backendAuth:
      azure:
        explicitConfig:
          managedIdentity: {}
```

Review the following example configuration.

| Setting                                            | Description                                                                                                                                             |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ai.name`                                          | The name of the LLM provider for this AI backend.                                                                                                       |
| `ai.provider.azure.resourceName`                   | The Azure resource name used to construct the endpoint hostname.                                                                                        |
| `ai.provider.azure.resourceType`                   | The endpoint type: `foundry` for Azure AI Foundry, or `openAI` for Azure OpenAI Service.                                                                |
| `ai.provider.azure.projectName`                    | The Foundry project name. Required for `foundry` type.                                                                                                  |
| `ai.provider.azure.model`                          | Optionally set the model to use for requests. If set, any models in the request are overwritten. If not set, the request must include the model to use. |
| `backendAuth.azure.explicitConfig.managedIdentity` | Use Azure managed identity. Leave empty for system-assigned, or specify `userAssignedIdentity` with `clientId`, `objectId`, or `resourceId`.            |

**User-assigned managed identity**: Manually assign a managed identity for agentgateway to use to
call Azure AI services. Unlike system-assigned managed identity, you manage the identity’s
lifecycle. This way, the identity is not tied to the underlying Azure resource and can be shared
across other Azure resources.

To use user-assigned managed identity:

- Agentgateway must run in an Azure resource, such as a VM or container instance.
- The Azure resource must have managed identity enabled.
- The Azure resource identity must have permissions to and the network ability to access the Azure AI services.
- Create and assign a managed identity for the Azure resource to use.

Specify the client ID of the user-assigned managed identity to use. You can also specify the object
ID or resource ID instead.

```
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
gateways:
  default:
    port: 3000
routes:
- backends:
  - ai:
      name: azure
      provider:
        azure:
          resourceName: "your-resource-name"
          resourceType: openAI
          model: gpt-4.1
  policies:
    backendAuth:
      azure:
        explicitConfig:
          managedIdentity:
            userAssignedIdentity:
              clientId: "<your-managed-identity-client-id>"
              # OR use objectId or resourceId instead
              # objectId: "your-managed-identity-object-id"
              # resourceId: "/subscriptions/.../resourceGroups/.../providers/Microsoft.ManagedIdentity/userAssignedIdentities/..."
```

Review the following example configuration.

| Setting                                            | Description                                                                                                                                             |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ai.name`                                          | The name of the LLM provider for this AI backend.                                                                                                       |
| `ai.provider.azure.resourceName`                   | The Azure resource name used to construct the endpoint hostname.                                                                                        |
| `ai.provider.azure.resourceType`                   | The endpoint type: `foundry` for Azure AI Foundry, or `openAI` for Azure OpenAI Service.                                                                |
| `ai.provider.azure.projectName`                    | The Foundry project name. Required for `foundry` type.                                                                                                  |
| `ai.provider.azure.model`                          | Optionally set the model to use for requests. If set, any models in the request are overwritten. If not set, the request must include the model to use. |
| `backendAuth.azure.explicitConfig.managedIdentity` | Use Azure managed identity. Leave empty for system-assigned, or specify `userAssignedIdentity` with `clientId`, `objectId`, or `resourceId`.            |

**Workload identity**: Authenticate with Azure identity in Kubernetes clusters without the need to
store credentials in the cluster.

To use workload identity:

- Agentgateway must run in a Kubernetes cluster.
- The Kubernetes cluster must use federated OIDC for authentication.
- The federated identity must link the Azure identity with access to Azure AI services to the Kubernetes service account.

```
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
gateways:
  default:
    port: 3000
routes:
- backends:
  - ai:
      name: azure
      provider:
        azure:
          resourceName: "your-resource-name"
          resourceType: openAI
          model: gpt-4.1
  policies:
    backendAuth:
      azure:
        explicitConfig:
          workloadIdentity: {}
    backendTLS: {}
```

Review the following example configuration.

| Setting                                             | Description                                                                                                                                             |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ai.name`                                           | The name of the LLM provider for this AI backend.                                                                                                       |
| `ai.provider.azure.resourceName`                    | The Azure resource name used to construct the endpoint hostname.                                                                                        |
| `ai.provider.azure.resourceType`                    | The endpoint type: `foundry` for Azure AI Foundry, or `openAI` for Azure OpenAI Service.                                                                |
| `ai.provider.azure.projectName`                     | The Foundry project name. Required for `foundry` type.                                                                                                  |
| `ai.provider.azure.model`                           | Optionally set the model to use for requests. If set, any models in the request are overwritten. If not set, the request must include the model to use. |
| `backendAuth.azure.explicitConfig.workloadIdentity` | Use Azure workload identity for Kubernetes environments.                                                                                                |

## Use Claude models on Azure AI Foundry

[Azure AI Foundry](https://ai.azure.com/) hosts Anthropic Claude models at native Anthropic
endpoints. When you set `azureResourceType: foundry` and a model name that starts with `claude-`,
agentgateway automatically routes requests to the Anthropic-native path (`/anthropic/v1/messages`)
instead of the OpenAI-compatible path, and injects the required `anthropic-version` header. No extra
configuration is needed beyond specifying a Claude model name.

> [!NOTE] Note For more information about Claude models on Azure AI Foundry, see the Microsoft documentation .

Review the following example configuration.

```
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
gateways:
  default:
    port: 3000
routes:
- name: azure
  matches:
  - path:
      pathPrefix: /azure-anthropic #prefix example
  backends:
  - ai:
      name: azure
      provider:
        azure:
          resourceName: your-foundry-resource
          projectName: your-project-name
          resourceType: foundry
          model: claude-sonnet-4-6
    policies:
      backendAuth:
        key:
          value: your-api-key
```

Review the following table to understand this configuration.

| Setting                    | Description                                                                                                                                                                                                                                                                     |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                     | The exact Claude model name to match in incoming requests, such as `claude-3-5-haiku-20241022`. Use `*` to match any model name.                                                                                                                                                |
| `provider`                 | Set to `azure` for Azure AI Foundry.                                                                                                                                                                                                                                            |
| `backendAuth.key.value`    | The Azure AI Foundry API key. You can reference environment variables using the `$VAR_NAME` syntax. The key is automatically sent in the `Authorization` header. Other auth method can be applied [Backend authentication](../../configuration/security/backend-authn/index.md) |
| `params.azureResourceName` | The Azure AI Foundry resource name used to construct the endpoint hostname.                                                                                                                                                                                                     |
| `params.azureResourceType` | Set to `foundry` to use Azure AI Foundry endpoints.                                                                                                                                                                                                                             |
| `params.azureProjectName`  | The Foundry project name.                                                                                                                                                                                                                                                       |

After running agentgateway with this configuration, send a request to verify:

```
curl -X POST http://localhost:4000/azure-anthropic \
  -H "Content-Type: application/json" \
  -d '{
    "max_tokens": 256,
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

[Anthropic](/docs/standalone/latest/llm/providers/anthropic/ 'Anthropic')[Gemini](/docs/standalone/latest/llm/providers/gemini/ 'Gemini')

Was this page helpful?
