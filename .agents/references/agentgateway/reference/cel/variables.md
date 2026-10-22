# Variables and functions

How CEL variables are populated per policy phase, and where to find the full context reference and
function list.

When using CEL expressions, a variety of variables and functions are made available.

## Variables

Variables are only available when they exist in the current context. Previously in version 0.11 or
earlier, variables like `jwt` were always present but could be `null`. Now, to check if a JWT claim
exists, use the expression `has(jwt.sub)`. This expression returns `false` if there is no JWT,
rather than always returning `true`.

Additionally, fields are populated only if they are referenced in a CEL expression. This way,
agentgateway avoids expensive buffering of request bodies if no CEL expression depends on the
`body`.

Each policy execution consistently gets the current view of the request and response. For example,
during logging, any manipulations from earlier policies (such as transformations or external
processing) are observable in the CEL context.

For the full list of fields and types on every top-level object, see the [CEL
reference](cel-context.md) page. It is generated from the
[agentgateway CEL schema](https://github.com/agentgateway/agentgateway/blob/main/schema/cel.md) and
is the source of truth for nested fields (for example, `source.address` or `llm.inputTokens`).

## Variables by policy type

Depending on the policy, different top-level variables are bound when CEL runs. A variable is only
non-null when it is populated for the current request (for example, `has(jwt.sub)` or
`has(apiKey.key)`). The same name can refer to different snapshots depending on pipeline stage:
early policies evaluate against the live HTTP request, while logging, tracing, and metrics run after
the exchange and can include `response`, `mcp`, and full telemetry fields. Note that when using
streaming responses, the evaluation of response body attributes or LLM response information can be
inconsistent.

| Policy                        | Available top-level variables                                                                                                                                                                                                |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Transformation (request)      | `request`, `env`, `jwt`, `apiKey`, `basicAuth`, `llm`, `source`, `backend`, `extauthz`, `extproc`, `metadata` — not `response`, `mcp`, or `llmRequest`. [1](#fn:1)                                                           |
| Transformation (response)     | Same as request-path, plus `response` for response-side rules. [2](#fn:2)                                                                                                                                                    |
| Remote rate limit             | `request`, `env`, `jwt`, `apiKey`, `basicAuth`, `llm`, `source`, `backend`, `extauthz`, `extproc`, `metadata`                                                                                                                |
| HTTP Authorization            | `request`, `env`, `jwt`, `apiKey`, `basicAuth`, `llm`, `source`, `backend`, `extauthz`, `extproc`, `metadata`                                                                                                                |
| Network authorization         | `env`, `source` [3](#fn:3)                                                                                                                                                                                                   |
| External Authorization        | `request`, `response`, `env`, `jwt`, `apiKey`, `basicAuth`, `llm`, `source`, `backend`, `extauthz`, `extproc`, `metadata` — some expressions run after the authorization service returns and can read `response`. [4](#fn:4) |
| MCP Authorization             | `request`, `env`, `jwt`, `apiKey`, `basicAuth`, `llm`, `source`, `mcp`, `backend`, `extauthz`, `extproc`, `metadata`                                                                                                         |
| External processing (ExtProc) | Request-phase rules: same as Transformation (request). Response-phase rules: same as Transformation (response).                                                                                                              |
| LLM policy                    | `request`, `env`, `jwt`, `apiKey`, `basicAuth`, `llm`, `llmRequest`, `source`, `backend`, `extauthz`, `extproc`, `metadata` — `llmRequest` is the raw JSON body during LLM request handling (not `mcp`). [5](#fn:5)          |
| Logging                       | `request`, `response`, `env`, `jwt`, `apiKey`, `basicAuth`, `llm`, `source`, `mcp`, `backend`, `extauthz`, `extproc`, `metadata` [6](#fn:6)                                                                                  |
| Tracing                       | Same as Logging.                                                                                                                                                                                                             |
| Metrics                       | Same as Logging.                                                                                                                                                                                                             |

## Functions

The following functions can be used in all policy types.

| Function                | Purpose                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `json`                  | Parse a string or bytes as JSON. Example: `json(request.body).some_field`.                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `toJson`                | Convert a CEL value into a JSON string. Example: `toJson({"hello": "world"})`.                                                                                                                                                                                                                                                                                                                                                                                                             |
| `unvalidatedJwtPayload` | Parse the payload section of a JWT without verifying the signature. This splits the token, base64url-decodes the middle segment, and parses it as JSON. Example: `unvalidatedJwtPayload(request.headers.authorization.split(" ")[1]).sub`                                                                                                                                                                                                                                                  |
| `with`                  | CEL does not allow variable bindings. `with` allows doing this. Example: `json(request.body).with(b, b.field_a + b.field_b)`                                                                                                                                                                                                                                                                                                                                                               |
| `variables`             | `variables` exposes all of the variables available as a value. CEL otherwise does not allow accessing all variables without knowing them ahead of time. Warning: this automatically enables all fields to be captured.                                                                                                                                                                                                                                                                     |
| `mapValues`             | `mapValues` applies a function to all values in a map. `map` in CEL only applies to map keys.                                                                                                                                                                                                                                                                                                                                                                                              |
| `filterKeys`            | Returns a new map keeping only entries where the key matches the predicate (must evaluate to bool). Example: `{"a":1,"b":2}.filterKeys(k, k == "a")` results in `{"a":1}`. To remove keys, invert the predicate: `m.filterKeys(k, !k.startsWith("x_"))`.                                                                                                                                                                                                                                   |
| `merge`                 | `merge` joins two maps. Example: `{"a":2,"k":"v"}.merge({"a":3})` results in `{"a":3,"k":"v"}`.                                                                                                                                                                                                                                                                                                                                                                                            |
| `flatten`               | Usable only for logging and tracing. `flatten` will flatten a list or struct into many fields. For example, defining `headers: 'flatten(request.headers)'` would log many keys like `headers.user-agent: "curl"`, etc.                                                                                                                                                                                                                                                                     |
| `flattenRecursive`      | Usable only for logging and tracing. Like `flatten` but recursively flattens multiple levels.                                                                                                                                                                                                                                                                                                                                                                                              |
| `base64.encode`         | Encodes a string to a base64 string. Example: `base64.encode("hello")`.                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `base64.decode`         | Decodes a string in base64 format. Example: `string(base64.decode("aGVsbG8K"))`. Warning: this returns `bytes`, not a `String`. Various parts of agentgateway will display bytes in base64 format, which may appear like the function does nothing if not converted to a string.                                                                                                                                                                                                           |
| `url.encode`            | Percent-encodes a string for use as a URL component. Example: `url.encode("hello world/?x=1")` returns `hello%20world%2F%3Fx%3D1`.                                                                                                                                                                                                                                                                                                                                                         |
| `url.decode`            | Percent-decodes a URL-encoded string. Example: `url.decode("hello%20world")` returns `hello world`. This does not decode `+` as a space; use `form.decode` for `application/x-www-form-urlencoded` values.                                                                                                                                                                                                                                                                                 |
| `form.decode`           | Parses an `application/x-www-form-urlencoded` string or bytes value into a map. `+` is decoded as a space; repeated keys become lists. Example: `form.decode("a=1&a=2")` returns `{"a":["1","2"]}`.                                                                                                                                                                                                                                                                                        |
| `form.encode`           | Encodes a map as an `application/x-www-form-urlencoded` string. Keys are encoded in sorted order, list values emit repeated fields, and null values are skipped. Example: `form.encode({"scope":"openid profile"})` returns `scope=openid+profile`.                                                                                                                                                                                                                                        |
| `sha1.encode`           | Computes the SHA-1 digest of a string or bytes value and returns the lowercase hex string. Example: `sha1.encode("hello")`.                                                                                                                                                                                                                                                                                                                                                                |
| `sha256.encode`         | Computes the SHA-256 digest of a string or bytes value and returns the lowercase hex string. Example: `sha256.encode("hello")`.                                                                                                                                                                                                                                                                                                                                                            |
| `md5.encode`            | Computes the MD5 digest of a string or bytes value and returns the lowercase hex string. Example: `md5.encode("hello")`.                                                                                                                                                                                                                                                                                                                                                                   |
| `random`                | Generates a number float from 0.0-1.0                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `default`               | Resolves to a default value if the expression cannot be resolved. For example `default(request.headers["missing-header"], "fallback")`                                                                                                                                                                                                                                                                                                                                                     |
| `coalesce`              | Evaluates expressions from left to right and returns the first one that resolves successfully to a non-null value. `null` values are skipped while searching, but if every expression is either `null` or an error and at least one expression resolved to `null`, the result is `null`. Unlike `default`, it swallows any error from earlier expressions, not just missing keys or undeclared references. Example: `coalesce(request.headers["x-id"], json(request.body).id, "fallback")` |
| `regexReplace`          | Replace the string matching the regular expression. Example: `"/id/1234/data".regexReplace("/id/[0-9]*/", "/id/{id}/")` would result in the string `/id/{id}/data`.                                                                                                                                                                                                                                                                                                                        |
| `fail`                  | Unconditionally fail an expression.                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `uuid`                  | Randomly generate a UUIDv4                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |

The following standard functions are available:

- `contains`, `size`, `has`, `map`, `filter`, `all`, `max`, `startsWith`, `endsWith`, `string`, `bytes`, `double`, `exists`, `exists_one`, `int`, `uint`, `matches`.
- Duration/time functions: `duration`, `timestamp`, `getFullYear`, `getMonth`, `getDayOfYear`, `getDayOfMonth`, `getDate`, `getDayOfWeek`, `getHours`, `getMinutes`, `getSeconds`, `getMilliseconds`.
- From the [strings extension](https://pkg.go.dev/github.com/google/cel-go/ext#Strings): `charAt`, `indexOf`, `join`, `lastIndexOf`, `lowerAscii`, `upperAscii`, `trim`, `replace`, `split`, `substring`, `stripPrefix`, `stripSuffix`.
- From the [math extension](https://pkg.go.dev/github.com/google/cel-go/ext#Math): `math.least`, `math.greatest`, `math.ceil`, `math.floor`, `math.round`, `math.trunc`, `math.isInf`, `math.isNaN`, `math.isFinite`, `math.abs`, `math.sign`, `math.sqrt`, `math.bitAnd`, `math.bitOr`, `math.bitXor`, `math.bitNot`, `math.bitShiftLeft`, `math.bitShiftRight`.
- From the [Kubernetes IP extension](https://kubernetes.io/docs/reference/using-api/cel/#kubernetes-ip-address-library): `isIP("...")`, `ip("...")`, `ip("...").family()`, `ip("...").isUnspecified()`, `ip("...").isLoopback()`, `ip("...").isLinkLocalMulticast()`, `ip("...").isLinkLocalUnicast()`, `ip("...").isGlobalUnicast()`.
- From the [Kubernetes CIDR extension](https://kubernetes.io/docs/reference/using-api/cel/#kubernetes-cidr-library): `cidr("...").containsIP("...")`, `cidr("...").containsIP(ip("..."))`, `cidr("...").containsCIDR(cidr("..."))`, `cidr("...").ip()`, `cidr("...").masked()`, `cidr("...").prefixLength()`.

---

1. Request-time transformation evaluation binds `jwt`, `apiKey`, `basicAuth`, `llm`, `source`,
   `backend`, `extauthz`, `extproc`, and `metadata` when earlier filters have populated them; `mcp`
   only applies to MCP-specific policies. [↩︎](#fnref:1)
2. Response-side transformation sees the HTTP response object as well as the request snapshot
   fields. [↩︎](#fnref:2)
3. Network (L4) authorization uses `new_source` only: no HTTP `request` object. [↩︎](#fnref:3)
4. Some external authorization expressions run with only the client request; others run after the
   authorization service responds and can read the authorization HTTP response. [↩︎](#fnref:4)
5. LLM route transforms bind `llmRequest` to the parsed JSON body and restore the other fields from the
   stored request snapshot when available. [↩︎](#fnref:5)
6. For TCP logging, the executor is narrowed to `env`, `source`, and request timing fields (no full
   HTTP `request`/`response` objects). [↩︎](#fnref:6)

[CEL in YAML and example expressions](/docs/standalone/latest/reference/cel/yaml-and-examples/ 'CEL in YAML and example expressions')[CEL reference](/docs/standalone/latest/reference/cel/cel-context/ 'CEL reference')

Was this page helpful?
