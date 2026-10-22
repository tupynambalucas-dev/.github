[Skip to content](openapi.md#content)

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

# OpenAPI

Expose OpenAPI endpoints as MCP tools in the agentgateway UI playground

Expose an OpenAPI**OpenAPI** A specification for describing RESTful APIs. Agentgateway can connect to MCP servers that expose an OpenAPI specification. server on the agentgateway. Then, your OpenAPI endpoints become available as tools in the agentgateway UI playground.

## Before you begin [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/mcp/connect/openapi/#before-you-begin)

1. [Install the `agentgateway` binary](../../deployment/binary.md).
2. [Install the `uv` Python package manager](https://docs.astral.sh/uv/getting-started/installation/).
3. Make sure that you have `docker`, such as by installing [Docker Desktop](https://docs.docker.com/desktop/).
4. For ARM64 machines: [Install `maven`](https://maven.apache.org/install.html) to build the sample Petstore image from source.

## Set up your OpenAPI server [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/mcp/connect/openapi/#openapi-server)

Start by setting up your OpenAPI server. You need an OpenAPI spec, such as a JSON or YAML file, as well as a running server instance that hosts the API. These steps use the [Swagger Petstore server](openapi.md#petstore) as an example.

In your OpenAPI schema, make sure to set the URL of the server. If no URL is set, agentgateway defaults to `/`. Then, the paths in your OpenAPI schema get an extra slash concatenated, which can break requests. For example, `/api/v1/` becomes `//api/v1/`.

To avoid this issue, explicitly set the URL value to `/` in the OpenAPI schema, such as the following example.

```json
 "servers": [\
    {\
      "url": "/"\
    }\
  ]
```

### Sample Petstore server [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/mcp/connect/openapi/#petstore)

Run the sample [Swagger Petstore server](https://github.com/swagger-api/swagger-petstore) locally. The following steps show use Docker and Maven as an example to pull, build, and run the Petstore server. You can also use your own OpenAPI server and update the steps accordingly.

AMD64 machinesARM64 or other machines

You can pull and run the sample Petstore server from Docker Hub.

1. Pull the Docker image for the Petstore server.

```sh
docker pull swaggerapi/petstore3:unstable
```

2. Run the Petstore server on port 8080.

```sh
docker run  --name swaggerapi-petstore3 -d -p 8080:8080 swaggerapi/petstore3:unstable
```

Build the Docker image from the source code. The example builds the image for an ARM64 machine.

1. Clone the [Swagger Petstore repository](https://github.com/swagger-api/swagger-petstore).

```sh
git clone https://github.com/swagger-api/swagger-petstore.git
cd swagger-petstore
```

2. Package the project with Maven.

```sh
mvn package
```

3. Build the Docker image for your platform.

```sh
docker buildx build --platform=linux/arm64 -t swaggerapi/petstore3:arm64 .
```

4. Run the Petstore server on port 8080.

```sh
docker run -d -p 8080:8080 swaggerapi/petstore3:arm64
```

## Configure the agentgateway [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/mcp/connect/openapi/#agentgateway)

1. From the directory where you plan to run agentgateway, download and review the OpenAPI schema for the Petstore server.

```sh
curl http://localhost:8080/api/v3/openapi.json > openapi.json
```

2. Download an OpenAPI configuration for your agentgateway.

```sh
curl -L https://agentgateway.dev/examples/mcp-openapi/config.yaml -o config.yaml
```

3. Update the agentgateway configuration file as follows:

   - **Listener**: An HTTP listener is configured and exposed on port 3000.
   - **Backend**: Use an MCP backend to set up an OpenAPI server based on the Petstore sample app.
   - **OpenAPI schema**: In the `openapi` target of the configuration file, set the schema source. You can provide the schema as a local file path, an inline string, or a remote URL. This example uses a local file path.
   - **CORS policy**: To use the agentgateway UI playground later, add the following CORS policy to your `config.yaml` file. The config automatically reloads when you save the file.

```
open config.yaml
```

Reference a local OpenAPI schema file.

```yaml
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
mcp:
  port: 3000
  policies:
    cors:
      allowOrigins:
        - '*'
      allowHeaders:
        - '*'
  targets:
    - name: openapi
      openapi:
        schema:
          file: openapi.json
        host: localhost:8080
```

4. Run the agentgateway.

```sh
agentgateway -f config.yaml
```

## Verify access to the Petstore APIs [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/mcp/connect/openapi/#verify-access-to-the-petstore-apis)

1. Open the [agentgateway UI](http://localhost:15000/ui/) to view your listener and backend configuration.

2. From the navigation menu under **MCP**, click **Tool Playground**.

3. If you see a banner prompting you to allow browser access, click **Apply CORS**. This adds the UI’s origin to the MCP CORS policy so the playground can open a session, and the configuration reloads automatically.

4. Click **Initialize**. The agentgateway UI opens an MCP session and lists the Petstore operations from the OpenAPI spec as tools.

5. Verify that the **Result** panel reports the discovered tools, such as `getPetById`, `findPetsByStatus`, and `addPet`. Agentgateway generates one tool per operation in the spec, named after the operation’s `operationId`.

![](https://agentgateway.dev/img/agentgateway-ui-tools-openapi.png)

![](https://agentgateway.dev/img/agentgateway-ui-tools-openapi-dark.png)

6. Verify access to a Petstore API.

1. From the **Tool** dropdown, select the `getInventory` tool, which returns the store’s pet inventory by status and takes no parameters.

1. Click **Call tool**.

1. Verify that the **Result** panel returns `HTTP 200` and the inventory counts in the **Tool output**.

   ![](https://agentgateway.dev/img/agentgateway-ui-tools-openapi-success.png)

   ![](https://agentgateway.dev/img/agentgateway-ui-tools-openapi-success-dark.png)

## Tool names [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/mcp/connect/openapi/#tool-names)

Agentgateway generates one MCP tool for each operation in your OpenAPI spec. Each tool is named after the operation’s `operationId` field. For example, an operation with `operationId: addPet` becomes an MCP tool named `addPet`. Make sure each operation in your spec defines a unique `operationId` so that the generated tool names are predictable and do not collide.

## Other configurations [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/mcp/connect/openapi/#other-configurations)

### Schema URL [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/mcp/connect/openapi/#schema-url)

Fetch the OpenAPI schema from a remote URL. Agentgateway retrieves the schema at startup.

```yaml
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
mcp:
  port: 3000
  policies:
    cors:
      allowOrigins:
        - '*'
      allowHeaders:
        - '*'
  targets:
    - name: openapi
      openapi:
        schema:
          url: http://localhost:8080/api/v3/openapi.json
        host: localhost:8080
```

### Inline schema [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/mcp/connect/openapi/#inline-schema)

Embed the OpenAPI schema directly as an inline string.

```yaml
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
mcp:
  port: 3000
  policies:
    cors:
      allowOrigins:
        - '*'
      allowHeaders:
        - '*'
  targets:
    - name: openapi
      openapi:
        schema: |
          {"openapi":"3.0.0",...}
        host: localhost:8080
```

### Stateless sessions [Permalink for this section](https://agentgateway.dev/docs/standalone/latest/mcp/connect/openapi/#stateless-sessions)

OpenAPI backends are inherently stateless because they translate standard REST endpoints into MCP tools. You can set `statefulMode: stateless` on the MCP backend to skip session tracking. In stateless mode, the gateway automatically wraps each request with an initialization sequence so the upstream processes every request independently.

```yaml
mcp:
  port: 3000
  statefulMode: stateless
  targets:
    - name: openapi
      openapi:
        schema:
          url: http://localhost:8080/api/v3/openapi.json
        host: localhost:8080
```

[Virtual MCP](https://agentgateway.dev/docs/standalone/latest/mcp/connect/virtual/ 'Virtual MCP')

Was this page helpful?

Ask AI

Agentgateway assistant

Ask me anything about agentgateway configuration, features, or usage.

Note: AI-generated content might contain errors; please verify and test all returned information.

Tip: one topic per conversation gives the best results. Use the **+** button in the chat header to start a new conversation.

![Agent](openapi.md)

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
