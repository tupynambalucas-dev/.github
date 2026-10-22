# Vertex AI

Verified Code examples on this page have been automatically tested and verified.

Route agentgateway LLM traffic to models on Google Cloud Vertex AI.

Configure Google Cloud Vertex AI as an LLM provider in agentgateway.

## Authentication

Before you can use Vertex AI as an LLM provider, you must authenticate by using Google Cloud’s
[Application Default
Credentials](https://docs.cloud.google.com/docs/authentication/application-default-credentials).
Choose from one of the three methods:

- `GOOGLE_APPLICATION_CREDENTIALS`
- `application_default_credentials.json`
- metadata server

## Configuration

Review the following example configuration.

```
# yaml-language-server: $schema=https://agentgateway.dev/schema/config

llm:
  models:
  - name: gemini-2.5-flash
    provider: vertex
    params:
      model: google/gemini-2.5-flash-lite-preview-06-17
      vertexProject: my-project-id
      vertexRegion: us-west2
```

Review the following example configuration.

| Setting                | Description                                                                                                                                                     |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                 | The model name to match in incoming requests. When a client sends `"model": "<name>"`, the request is routed to this provider. Use `*` to match any model name. |
| `provider`             | The LLM provider, set to `vertex` for Google Cloud Vertex AI.                                                                                                   |
| `params.model`         | The specific Vertex AI model to use. If set, this model is used for all requests. If not set, the request must include the model to use.                        |
| `params.vertexProject` | The Google Cloud project ID.                                                                                                                                    |
| `params.vertexRegion`  | The Google Cloud region. Defaults to `global` if not specified.                                                                                                 |
| `auth.gcp`             | Google Cloud authentication configuration. Uses Application Default Credentials (ADC) by default.                                                               |

[Ollama](/docs/standalone/latest/llm/providers/ollama/ 'Ollama')[Baseten](/docs/standalone/latest/llm/providers/baseten/ 'Baseten')

Was this page helpful?
