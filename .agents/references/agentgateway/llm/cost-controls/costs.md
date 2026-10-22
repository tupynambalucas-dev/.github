# Model costs

Price LLM requests with a model cost catalog and expose realized USD costs in logs, traces, metrics,
and CEL policies.

Agentgateway can track LLM spend by mapping each request’s provider, model, and token counts to
per-token pricing.

Agentgateway extracts token usage from supported LLM APIs automatically. To convert those token
counts into cost, configure a model cost catalog. The catalog maps provider and model names to
pricing data so agentgateway can attach realized USD cost to logs, traces, metrics, and CEL
expressions.

> [!NOTE] Note Cost analysis is best-effort and may not exactly match your provider bill in scenarios such as price changes, custom pricing, failed requests, or provider-specific billing rules.

## Before you begin

[Install the `agentgateway` binary](../../deployment/binary.md).

## Configure a model catalog

Use `config.modelCatalog` to load one or more model cost catalog files. Catalog entries are merged
in order, and later entries take precedence. This lets you start with an imported public catalog and
then layer local overrides for contracted pricing, internal models, or provider-specific aliases.

```
# yaml-language-server: $schema=https://agentgateway.dev/schema/config

config:
  modelCatalog:
  - file: ./costs/catalog.json

llm:
  models:
  - name: "*"
    provider: openAI
    params:
      apiKey: "$OPENAI_API_KEY"
```

Run agentgateway with the config file.

```
agentgateway -f config.yaml
```

After the catalog is loaded, priced requests include cost data. The access log includes
`agw.ai.usage.cost.total`, and CEL exposes cost data as `llm.cost` and `llm.costRates`.

For general LLM telemetry setup, see [Observe traffic](../observability.md).

## Import costs (agctl)

Use `agctl costs import` to generate a catalog file from a supported pricing source. The default
source is `models.dev`.

```
mkdir -p costs
agctl costs import --out ./costs/catalog.json
```

To keep the catalog smaller, import only the providers that you use.

```
agctl costs import \
  --source models.dev \
  --providers anthropic,google,openai \
  --out ./costs/catalog.json
```

For all flags, see the [`agctl costs
import`](../../reference/agctl/agctl-costs-import.md) reference.

## Import costs (Admin UI)

You can also manage the model cost catalog from the built-in [Admin
UI](../../operations/ui.md).

1. Open the [Admin UI cost page](http://localhost:15000/ui/llm/costs) (**LLM > Costs**). The page lists
   your configured **Catalog sources** (files and ConfigMaps, merged in order) and any inline **Custom
   costs** overrides.

   ![Admin UI LLM Costs page showing catalog sources and custom cost overrides](/img/ui-cost-catalog.png)

   ![Admin UI LLM Costs page showing catalog sources and custom cost overrides](/img/ui-cost-catalog-dark.png)

2. Press **Refresh base costs**. The UI fetches the latest base costs and configures `modelCatalog`.
   You can refresh again later to pull updated pricing and model data.
3. To adjust pricing for a specific model, use **Edit** under **Custom costs** to add inline overrides
   without changing your catalog files.

When you set up a fresh configuration for the first time, the UI automatically performs the refresh
step.

After you load a catalog, the same Admin UI visualizes your priced traffic. For more information,
see [Cost dashboard](dashboard.md).

## Override catalog entries

If your provider pricing differs from the imported public catalog, add another catalog file after
the imported one. Later catalog sources override earlier sources.

```
config:
  modelCatalog:
  - file: ./costs/catalog.json
  - file: ./costs/overrides.json
```

Use overrides for contracted pricing, internally hosted models, or models that do not appear in the
imported catalog.

You can also load one or more catalog files with the `MODEL_CATALOG_PATHS` environment variable. Set
it to a comma-separated list of file paths.

```
MODEL_CATALOG_PATHS=./costs/catalog.json,./costs/overrides.json agentgateway -f config.yaml
```

> [!WARNING] Warning When MODEL_CATALOG_PATHS is set, it replaces any config.modelCatalog sources. Use one mechanism or the other.

## Use cost data

When a request matches an entry in the catalog, agentgateway populates these CEL fields:

- `llm.cost`: The realized USD cost of the request. Includes `total` plus per-token-type components such as `input`, `output`, `cacheRead`, `cacheWrite`, `reasoning`, `inputAudio`, and `outputAudio`. Unset when the model cannot be priced.
- `llm.costRates`: The effective USD-per-1,000,000-token rates that were applied. Includes the same per-token-type fields when available. Unset when the model cannot be priced.

The request access log always includes `agw.ai.usage.cost.total` for LLM requests when a cost is
available. Traces always include the full breakdown:

- `agw.ai.usage.cost.total`
- `agw.ai.usage.cost.input`
- `agw.ai.usage.cost.output`
- `agw.ai.usage.cost.cache_read`
- `agw.ai.usage.cost.cache_write`
- `agw.ai.usage.cost.reasoning`
- `agw.ai.usage.cost.input_audio`
- `agw.ai.usage.cost.output_audio`

As these are loaded into the CEL context, they can be explicitly emited as well.

```
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
frontendPolicies:
  accessLog:
    add:
       # Add the input cost
       input_cost: llm.cost.input
       # Add ALL cost variables, as `cost.input`, `cost.output`, etc.
       cost: flatten(llm.cost)
```

A priced request produces an access log entry that includes cost data.

```
... protocol=llm gen_ai.provider.name=openai gen_ai.request.model=gpt-4o-mini
gen_ai.usage.input_tokens=14 gen_ai.usage.output_tokens=6 agw.ai.usage.cost.total=0.0000057 ...
```

## Monitor catalog lookups

Every cost lookup increments the `agentgateway_cost_catalog_lookups_total` counter. The metric is
labeled with lookup `status`, provider, request model, and response model.

| Status      | Meaning                                                                        |
| ----------- | ------------------------------------------------------------------------------ |
| `Exact`     | The provider and model were found in the catalog and priced.                   |
| `Unpriced`  | The model was found, but the token types in the request had no matching rates. |
| `Missing`   | The provider or model was not found in the catalog.                            |
| `NoCatalog` | No catalog is configured.                                                      |

A rising `Missing` or `Unpriced` count means requests are flowing through models that your catalog
does not price. Add the missing providers or models to your catalog and reload.

> [!NOTE] Note In traces, the corresponding cost-resolution status attribute uses lowercase values: exact , unpriced , missing , and noCatalog .

## Enforce budgets

The model catalog provides pricing data for spend visibility. To block or throttle traffic, combine
cost visibility with rate limiting or virtual key management.

- Use [Rate limiting](../../configuration/resiliency/rate-limits.md) to cap request or token usage per route, user, or API key.
- Use [Virtual keys](virtual-keys.md) to issue keys with per-key controls and attribution.

## Advanced: Catalog format

Usually, you do not need to write catalog JSON by hand. Use `agctl costs import` or the Admin UI to
generate the base catalog, then add overrides only when needed.

A model cost catalog is JSON with the following high-level structure. Field names are camelCase, and
unknown fields are rejected.

```
{
  "providers": {
    "<provider-id>": {
      "models": {
        "<model-name>": {
          "rates": {
            "input": "0.0",
            "output": "0.0",
            "cacheRead": "0.0",
            "cacheWrite": "0.0",
            "reasoning": "0.0",
            "inputAudio": "0.0",
            "outputAudio": "0.0"
          },
          "tiers": [
            {
              "contextOver": 200000,
              "rates": {
                "input": "0.0",
                "output": "0.0"
              }
            }
          ]
        }
      }
    }
  }
}
```

Key points:

- Lookups are by **provider id** (such as `openai`, `anthropic`, or `gcp.gemini`) and **model name** (such as `gpt-4o-mini`).
- Rates are **strings** (exact decimals), in **USD per 1,000,000 tokens**.
- If a rate is omitted, that token type is not priced for the model.
- `tiers[]` is optional. Each tier selects alternate `rates` when the request context length is **over** the tier’s `contextOver` value. Tiers must be ordered by strictly increasing `contextOver`.

The following minimal example prices two OpenAI models and one tiered Gemini model:

```
{
  "providers": {
    "openai": {
      "models": {
        "gpt-4o-mini": {
          "rates": { "input": "0.15", "output": "0.6", "cacheRead": "0.075" }
        }
      }
    },
    "gcp.gemini": {
      "models": {
        "gemini-2.5-pro": {
          "rates": { "input": "1.25", "output": "10", "cacheRead": "0.125" },
          "tiers": [
            {
              "contextOver": 200000,
              "rates": { "input": "2.5", "output": "15", "cacheRead": "0.25" }
            }
          ]
        }
      }
    }
  }
}
```

The following minimal example prices one OpenAI model and one tiered Gemini model.

```
{
  "providers": {
    "openai": {
      "models": {
        "gpt-4o-mini": {
          "rates": { "input": "0.15", "output": "0.6", "cacheRead": "0.075" }
        }
      }
    },
    "gcp.gemini": {
      "models": {
        "gemini-2.5-pro": {
          "rates": { "input": "1.25", "output": "10", "cacheRead": "0.125" },
          "tiers": [
            {
              "contextOver": 200000,
              "rates": { "input": "2.5", "output": "15", "cacheRead": "0.25" }
            }
          ]
        }
      }
    }
  }
}
```

[Virtual key management](/docs/standalone/latest/llm/cost-controls/virtual-keys/ 'Virtual key management')[Cost dashboard](/docs/standalone/latest/llm/cost-controls/dashboard/ 'Cost dashboard')

Was this page helpful?
