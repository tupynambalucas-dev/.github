# Transform requests

Verified Code examples on this page have been automatically tested and verified.

Dynamically compute and set LLM request fields using CEL expressions.

Use LLM request transformations to dynamically compute and set fields in LLM requests using Common
Expression Language (CEL)**CEL (Common Expression Language)**A simple expression language used
throughout agentgateway to enable flexible configuration. CEL expressions can access request
context, JWT claims, and other variables to make dynamic decisions. expressions. Transformations let
you enforce policies such as capping token usage or conditionally modifying request parameters,
without changing client code.

To learn more about CEL, see the following resources:

- [CEL expression reference](../reference/cel/index.md)
- [cel.dev tutorial](https://cel.dev/tutorials/cel-get-started-tutorial)

> [!NOTE] Note Try out CEL expressions in the built-in CEL playground in the agentgateway admin UI before using them in your configuration.

## Before you begin

[Install the `agentgateway` binary](../deployment/binary.md).

## Configure LLM request transformations

1. Create a configuration file with your LLM transformation settings. The following example caps
   `max_tokens` to 10, regardless of what the client requests.

   ```
   cat <<'EOF' > config.yaml
   # yaml-language-server: $schema=https://agentgateway.dev/schema/config
   llm:
     models:
     - name: "*"
       provider: openAI
       params:
         apiKey: "$OPENAI_API_KEY"
       transformation:
         max_tokens: "min(llmRequest.max_tokens, 10)"
   EOF
   ```

   | Setting          | Description                                                                                                                                                                                                                      |
   | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | `transformation` | A map of LLM request field names to CEL expressions. Each key is the field to set; each value is a CEL expression evaluated against the original request. Use the `llmRequest` variable to access the original LLM request body. |

   > [!NOTE] Note You can specify up to 64 transformations per policy. Transformations take priority over overrides for the same field. If an expression fails to evaluate, the field is silently removed from the request.

2. Run the agentgateway.

   ```
   agentgateway -f config.yaml
   ```

3. Send a request with `max_tokens` set to a value greater than 1024. The transformation caps it to 10
   before the request reaches the LLM provider.

   ```
   curl -s 'http://localhost:4000/v1/chat/completions' \
   --header 'Content-Type: application/json' \
   --data '{
     "model": "gpt-3.5-turbo",
     "max_tokens": 5000,
     "messages": [
       {
         "role": "user",
         "content": "Tell me a short story"
       }
     ]
   }' | jq .
   ```

   Example output:

   ```
   {"model":"gpt-3.5-turbo-0125","usage":
   {"prompt_tokens":12,"completion_tokens":10,
   "total_tokens":22,"completion_tokens_details":
   {"reasoning_tokens":0,"audio_tokens":0,
   "accepted_prediction_tokens":0,
   "rejected_prediction_tokens":0},"prompt_tokens_details":
   {"cached_tokens":0,"audio_tokens":0}},"choices":
   [{"message":{"content":"Once upon a time, in a quaint
   village nestled","role":"assistant","refusal":null,
   "annotations":[]},"index":0,"logprobs":null,
   "finish_reason":"length"}],
   "id":"chatcmpl-DHyGUsdgf2P5FidTbZIZFxdVGRfpq",
   "object":"chat.completion","created":1773175606,
   "service_tier":"default","system_fingerprint":null}%
   ```

   In the response, the `completion_tokens` value reflects a completion capped at 10 tokens.

## Conditionally set fields based on headers

Use a CEL expression in the model-level `transformation` field to dynamically set `max_tokens` based
on the caller’s identity from a request header. This example gives admin users a higher token limit
than regular users.

```
cat <<'EOF' > config.yaml
# yaml-language-server: $schema=https://agentgateway.dev/schema/config

llm:
  models:
  - name: "*"
    provider: openAI
    params:
      apiKey: "$OPENAI_API_KEY"
    transformation:
      max_tokens: "request.headers['x-user-id'] == 'admin' ? 100 : 10"
EOF
```

| Setting          | Description                                                                                                                                                                                                                                                               |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `transformation` | A map of LLM request field names to CEL expressions. Each key is the field to set; each value is a CEL expression evaluated against the original request. Use `request.headers` to access incoming HTTP headers and `llmRequest` to access the original LLM request body. |

Send a request as an admin user and verify the response uses the higher token limit.

```
curl -s http://localhost:4000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "x-user-id: admin" \
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [{"role": "user", "content": "Tell me a story"}]
  }' | jq .
```

Send a request as a regular user and verify the response is capped at the lower token limit.

```
curl -s http://localhost:4000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "x-user-id: alice" \
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [{"role": "user", "content": "Tell me a story"}]
  }' | jq .
```

In the responses, the admin user receives up to 100 completion tokens while the regular user is
capped at 10.

## Available CEL variables

You can use these variables in your CEL transformation expressions.

| Variable                  | Description                          | Example                           |
| ------------------------- | ------------------------------------ | --------------------------------- |
| `request.headers["name"]` | Request header values                | `request.headers["x-user-id"]`    |
| `request.path`            | Request path                         | `request.path` returns `/`        |
| `request.method`          | HTTP method                          | `request.method` returns `POST`   |
| `llmRequest.max_tokens`   | Original max_tokens from the request | `min(llmRequest.max_tokens, 100)` |
| `llmRequest.model`        | Requested model name                 | `llmRequest.model`                |

For a complete list of available variables and functions, see the [CEL reference
documentation](../reference/cel/index.md).

## Common transformation patterns

### Cap token usage

Enforce a maximum token limit regardless of what the client requests.

```
llm:
  models:
  - name: "*"
    provider: openAI
    params:
      apiKey: "$OPENAI_API_KEY"
    transformation:
      max_tokens: "min(llmRequest.max_tokens, 1024)"
```

### Set temperature based on headers

Allow callers to control creativity through a header while enforcing bounds.

```
llm:
  models:
  - name: "*"
    provider: openAI
    params:
      apiKey: "$OPENAI_API_KEY"
    transformation:
      temperature: "request.headers['x-creativity'] == 'high' ? 0.9 : 0.1"
```

### Combine multiple transformations

Apply several field-level transformations in a single configuration.

```
llm:
  models:
  - name: "*"
    provider: openAI
    params:
      apiKey: "$OPENAI_API_KEY"
    transformation:
      max_tokens: "request.headers['x-user-tier'] == 'premium' ? 4096 : 256"
      temperature: "request.headers['x-user-tier'] == 'premium' ? 0.8 : 0.3"
```

## Next steps

- Learn about [CEL expressions](../reference/cel/index.md) for advanced expression logic.
- Set up [authentication](../configuration/security/jwt-authn.md) to use JWT claims in transformations.

[Inference routing](/docs/standalone/latest/inference/ 'Inference routing')[Cost controls](/docs/standalone/latest/llm/cost-controls/ 'Cost controls')

Was this page helpful?
