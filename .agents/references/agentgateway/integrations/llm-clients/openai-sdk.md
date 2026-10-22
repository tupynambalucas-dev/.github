# OpenAI SDK

Use OpenAI SDK (Python and Node.js) with agentgateway

Use the OpenAI Python or Node.js SDK to send requests through agentgateway.

## Before you begin

[Install the `agentgateway` binary](../../deployment/binary.md).

> [!TIP] Tip If you manage models and virtual API keys in the standalone Admin UI, Client Setup can generate the connection settings or snippet for this client. Review the gateway URL, select a model and key, choose the client from the Integration dropdown, and copy the recipe. Each recipe uses only the values that its client supports. Client Setup generates client-side values from existing configuration. It does not create a route, model, authentication policy, virtual key, or provider credential. Follow the steps in this guide to configure those prerequisites or to set up the client manually.

## Example agentgateway configuration

```
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
llm:
  port: 3000
  models:
  - name: "*"
    provider: openAI
    params:
      apiKey: "$OPENAI_API_KEY"
```

## Python

1. Install the OpenAI SDK in your Python project.

   ```
   pip install openai
   ```

2. Create and run the following script to send a request through agentgateway.

   ```
   from openai import OpenAI

   client = OpenAI(
       base_url="http://localhost:3000/v1",
       api_key="anything",  # placeholder if gateway has no auth
   )

   response = client.chat.completions.create(
       model="gpt-4o-mini",
       messages=[{"role": "user", "content": "Hello!"}],
   )
   print(response.choices[0].message.content)
   ```

You can also configure the SDK using environment variables.

```
export OPENAI_BASE_URL=http://localhost:3000/v1
export OPENAI_API_KEY=anything
```

Then initialize the client without arguments.

```
from openai import OpenAI

client = OpenAI()  # picks up OPENAI_BASE_URL and OPENAI_API_KEY from env
```

## Node.js

1. Install the OpenAI SDK in your Node.js project.

   ```
   npm install openai
   ```

2. Create and run the following script to send a request through agentgateway.

   ```
   import OpenAI from "openai";

   const client = new OpenAI({
     baseURL: "http://localhost:3000/v1",
     apiKey: "anything",
   });

   const response = await client.chat.completions.create({
     model: "gpt-4o-mini",
     messages: [{ role: "user", content: "Hello!" }],
   });
   console.log(response.choices[0].message.content);
   ```

[GitHub Copilot](/docs/standalone/latest/integrations/llm-clients/github-copilot/ 'GitHub Copilot')[curl](/docs/standalone/latest/integrations/llm-clients/curl/ 'curl')

Was this page helpful?
